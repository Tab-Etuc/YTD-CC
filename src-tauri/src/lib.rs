use std::process::Command;

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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn download_youtube(url: String) -> Result<String, String> {
    // let file_output_path = &(outputpath.to_owned() + &filename);
    // let file = Path::new(file_output_path);

    // if file.exists() { return Ok("File exists.".to_string()) };

    let status = Command::new("./yt-dlp.exe")
        .arg(url)
        .status()
        .expect("failed to execute process");

    if !status.success() {
        return Err("Download failed.".to_string());
    }

    Ok("Downloaded success.".to_string())
}
