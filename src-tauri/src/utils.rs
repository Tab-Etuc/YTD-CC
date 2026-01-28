// YTD-CC 系統工具模組
// 提供系統相關的工具函數

use tracing::{error, info};

/// 在檔案總管中顯示檔案
#[tauri::command]
pub fn show_in_folder(path: String) -> Result<(), String> {
    info!("Opening folder for: {}", path);

    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .args(["/select,", &path])
            .spawn()
            .map_err(|e| {
                error!("Failed to open explorer: {}", e);
                e.to_string()
            })?;
    }

    #[cfg(target_os = "linux")]
    {
        // 嘗試使用 xdg-open 開啟資料夾
        let parent = std::path::Path::new(&path)
            .parent()
            .map(|p| p.to_string_lossy().to_string())
            .unwrap_or(path.clone());

        std::process::Command::new("xdg-open")
            .arg(&parent)
            .spawn()
            .map_err(|e| {
                error!("Failed to open file manager: {}", e);
                e.to_string()
            })?;
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg("-R")
            .arg(&path)
            .spawn()
            .map_err(|e| {
                error!("Failed to open Finder: {}", e);
                e.to_string()
            })?;
    }

    Ok(())
}
