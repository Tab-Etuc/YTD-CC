use std::process::Command as StdCommand;
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;
use tauri::{Emitter, Window, AppHandle, Manager};
use serde_json::Value;
use std::fs;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Serialize, Deserialize, Default, Clone)]
struct AppSettings {
    #[serde(rename = "WINDOW_CONTROLS_ON_THE_LEFT", default)]
    window_controls_on_the_left: bool,
    #[serde(rename = "DOWNLOAD_OUTPUT_PATH", default)]
    download_output_path: String,
    #[serde(rename = "SAVE_HISTORY", default)]
    save_history: bool,
    #[serde(rename = "BANNER_IMAGE", default)]
    banner_image: String,
}

struct SettingsState(Mutex<AppSettings>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            download_youtube,
            get_video_info,
            download_video,
            show_in_folder,
            load_settings,
            save_settings
        ])
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().unwrap();
            let settings_path = app_data_dir.join("settings.json");
            
            let settings = if settings_path.exists() {
                let content = fs::read_to_string(&settings_path).unwrap_or_default();
                serde_json::from_str(&content).unwrap_or_default()
            } else {
                AppSettings::default()
            };
            
            app.manage(SettingsState(Mutex::new(settings)));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn load_settings(state: tauri::State<SettingsState>) -> AppSettings {
    state.0.lock().unwrap().clone()
}

#[tauri::command]
async fn save_settings(app: AppHandle, state: tauri::State<'_, SettingsState>, settings: AppSettings) -> Result<(), String> {
    {
        let mut current_settings = state.0.lock().unwrap();
        *current_settings = settings.clone();
    }
    
    let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    if !app_data_dir.exists() {
        tokio::fs::create_dir_all(&app_data_dir).await.map_err(|e| e.to_string())?;
    }
    
    let settings_path = app_data_dir.join("settings.json");
    let json = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    
    tokio::fs::write(settings_path, json).await.map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn show_in_folder(path: String) {
  #[cfg(target_os = "windows")]
  {
    StdCommand::new("explorer")
      .args(["/select,", &path]) // The comma after select is important
      .spawn()
      .unwrap();
  }
  #[cfg(target_os = "linux")]
  {
    StdCommand::new("xdg-open")
      .arg(&path)
      .spawn()
      .unwrap();
  }
  #[cfg(target_os = "macos")]
  {
    StdCommand::new("open")
      .arg("-R")
      .arg(&path)
      .spawn()
      .unwrap();
  }
}

#[tauri::command]
async fn get_video_info(app: AppHandle, url: String) -> Result<Value, String> {
    let output = app.shell().sidecar("yt-dlp")
        .map_err(|e| e.to_string())?
        .arg("-J")
        .arg(url)
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Failed to fetch video info: {}", stderr));
    }

    let json_str = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;
    let json: Value = serde_json::from_str(&json_str).map_err(|e| e.to_string())?;
    
    Ok(json)
}

#[tauri::command]
async fn download_video(app: AppHandle, window: Window, url: String, path: String, format: String, is_audio: bool) -> Result<String, String> {
    let command = app.shell().sidecar("yt-dlp")
        .map_err(|e| e.to_string())?;
    
    // We cannot mutate the command after creating it easily with chain, so use shadowing or separate calls?
    // Sidecar returns a Command builder, we can chain args.
    
    let mut args = vec!["-P", path.as_str(), "--newline"];
    
    if is_audio {
        args.extend(["-x", "--audio-format", "mp3"]);
    } else {
        args.extend(["-f", format.as_str()]);
        args.extend(["--merge-output-format", "mp4"]);
    }
    
    args.extend(["--js-runtimes", "node"]);
    args.push(url.as_str());

    let (mut rx, _child) = command
        .args(args)
        .spawn()
        .map_err(|e| e.to_string())?;

    let mut success = false;
    let mut stderr_output = String::new();
    let mut video_download_complete = false;

    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Stdout(line_bytes) => {
                let line = String::from_utf8_lossy(&line_bytes);
                if line.contains("[download]") && line.contains("%") {
                    if let Some(idx) = line.find('%') {
                        let start = if idx > 6 { idx - 6 } else { 0 };
                        let part = &line[start..idx];
                        if let Some(num_str) = part.split_whitespace().last() {
                             if let Ok(num) = num_str.parse::<f64>() {
                                 if num >= 100.0 {
                                     video_download_complete = true;
                                 }
                                 if video_download_complete && num < 100.0 {
                                     continue;
                                 }
                             }
                             let progress_val = format!("{}%", num_str);
                             let _ = window.emit("download_progress", progress_val);
                        }
                    }
                }
            }
            CommandEvent::Stderr(line_bytes) => {
                let line = String::from_utf8_lossy(&line_bytes);
                stderr_output.push_str(&line);
                println!("yt-dlp stderr: {}", line); 
            }
            CommandEvent::Terminated(payload) => {
                if payload.code == Some(0) {
                    success = true;
                }
            }
            _ => {}
        }
    }

    if !success {
        return Err(format!("Download failed: {}", stderr_output));
    }

    Ok("Downloaded success.".to_string())
}

#[tauri::command]
async fn download_youtube(app: AppHandle, url: String, path: String) -> Result<String, String> {
    // let file_output_path = &(outputpath.to_owned() + &filename);
    // let file = Path::new(file_output_path);

    // if file.exists() { return Ok("File exists.".to_string()) };

    let output = app.shell().sidecar("yt-dlp")
        .map_err(|e| e.to_string())?
        .args(["-P", &path])
        .args(["-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"])
        .arg(url)
        .output()
        .await
        .map_err(|e| e.to_string())?;


    if !output.status.success() {
        return Err("Download failed.".to_string());
    }

    Ok("Downloaded success.".to_string())
}
