use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use serde_json::Value;
use tauri::{Emitter, Window};

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
            show_in_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn show_in_folder(path: String) {
  #[cfg(target_os = "windows")]
  {
    Command::new("explorer")
      .args(["/select,", &path]) // The comma after select is important
      .spawn()
      .unwrap();
  }
  #[cfg(target_os = "linux")]
  {
    Command::new("xdg-open")
      .arg(&path)
      .spawn()
      .unwrap();
  }
  #[cfg(target_os = "macos")]
  {
    Command::new("open")
      .arg("-R")
      .arg(&path)
      .spawn()
      .unwrap();
  }
}

#[tauri::command]
async fn get_video_info(url: String) -> Result<Value, String> {
    let output = Command::new("./yt-dlp.exe")
        .arg("-J")
        .arg(url)
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err("Failed to fetch video info".to_string());
    }

    let json_str = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;
    let json: Value = serde_json::from_str(&json_str).map_err(|e| e.to_string())?;
    
    Ok(json)
}

#[tauri::command]
async fn download_video(window: Window, url: String, path: String, format: String, is_audio: bool) -> Result<String, String> {
    let mut command = Command::new("./yt-dlp.exe");
    command.arg("-P").arg(path);
    
    // Force newlines for progress parsing
    command.arg("--newline");

    if is_audio {
        command.arg("-x").arg("--audio-format").arg("mp3");
    } else {
        command.arg("-f").arg(format);
    }
    
    command.arg("--js-runtimes").arg("node");
    command.arg(url);

    command.stdout(Stdio::piped());
    
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        command.creation_flags(CREATE_NO_WINDOW);
    }
    
    let mut child = command.spawn().map_err(|e| e.to_string())?;

    if let Some(stdout) = child.stdout.take() {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(line) = line {
                if line.contains("[download]") && line.contains("%") {
                    if let Some(idx) = line.find('%') {
                        let start = if idx > 6 { idx - 6 } else { 0 };
                        let part = &line[start..idx];
                        if let Some(num_str) = part.split_whitespace().last() {
                             let progress_val = format!("{}%", num_str);
                             let _ = window.emit("download_progress", progress_val);
                        }
                    }
                }
            }
        }
    }
    
    let status = child.wait().map_err(|e| e.to_string())?;

    if !status.success() {
        return Err("Download failed.".to_string());
    }

    Ok("Downloaded success.".to_string())
}

#[tauri::command]
async fn download_youtube(url: String, path: String) -> Result<String, String> {
    // let file_output_path = &(outputpath.to_owned() + &filename);
    // let file = Path::new(file_output_path);

    // if file.exists() { return Ok("File exists.".to_string()) };

    let status = Command::new("./yt-dlp.exe")
        .arg("-P")
        .arg(path)
        .arg("-f")
        .arg("bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best")
        .arg(url)
        .status()
        .expect("failed to execute process");


    if !status.success() {
        return Err("Download failed.".to_string());
    }

    Ok("Downloaded success.".to_string())
}
