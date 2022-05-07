#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod yaydl;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![ytdl])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn ytdl(yturl: String) -> Result<(),()> {
  yaydl::main(yturl);

  // If it worked
  Ok(())
}

