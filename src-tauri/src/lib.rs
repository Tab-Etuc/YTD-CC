// YTD-CC 主程式庫
// Tauri 應用程式入口

mod download;
mod error;
mod settings;
mod utils;

use settings::{load_settings_from_file, SettingsState};
use tauri::Manager;
use tracing::info;
use tracing_subscriber::{fmt, prelude::*, EnvFilter};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 初始化日誌系統
    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::from_default_env().add_directive("ytd_cc=debug".parse().unwrap()))
        .init();

    info!("Starting YTD-CC application");

    tauri::Builder::default()
        // 註冊插件
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        // 註冊命令處理器
        .invoke_handler(tauri::generate_handler![
            // 下載相關
            download::download_youtube,
            download::get_video_info,
            download::download_video,
            // 設定相關
            settings::load_settings,
            settings::save_settings,
            // 工具
            utils::show_in_folder,
        ])
        // 初始化設定
        .setup(|app| {
            info!("Initializing application settings");

            // 載入設定
            let initial_settings = load_settings_from_file(app.handle());
            app.manage(SettingsState::new(initial_settings));

            info!("Application initialized successfully");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
