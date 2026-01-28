// YTD-CC 設定管理模組
// 處理應用程式設定的讀取和儲存

use crate::error::{AppError, AppResult};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use tracing::{debug, error, info};

/// 應用程式設定結構
#[derive(Serialize, Deserialize, Default, Clone, Debug)]
pub struct AppSettings {
    #[serde(rename = "WINDOW_CONTROLS_ON_THE_LEFT", default)]
    pub window_controls_on_the_left: bool,

    #[serde(rename = "DOWNLOAD_OUTPUT_PATH", default)]
    pub download_output_path: String,

    #[serde(rename = "SAVE_HISTORY", default = "default_save_history")]
    pub save_history: bool,

    #[serde(rename = "BANNER_IMAGE", default)]
    pub banner_image: String,
}

fn default_save_history() -> bool {
    true
}

/// 設定狀態包裝器
pub struct SettingsState(pub Mutex<AppSettings>);

impl SettingsState {
    /// 建立新的設定狀態
    pub fn new(settings: AppSettings) -> Self {
        Self(Mutex::new(settings))
    }

    /// 取得設定的複本
    pub fn get(&self) -> AppSettings {
        self.0.lock().unwrap().clone()
    }

    /// 更新設定
    pub fn update(&self, settings: AppSettings) {
        let mut current = self.0.lock().unwrap();
        *current = settings;
    }
}

/// 取得設定檔路徑
fn get_settings_path(app: &AppHandle) -> AppResult<PathBuf> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| AppError::Path(e.to_string()))?;
    Ok(app_data_dir.join("settings.json"))
}

/// 從檔案載入設定
pub fn load_settings_from_file(app: &AppHandle) -> AppSettings {
    let settings_path = match get_settings_path(app) {
        Ok(path) => path,
        Err(e) => {
            error!("Failed to get settings path: {}", e);
            return AppSettings::default();
        }
    };

    if !settings_path.exists() {
        info!("Settings file not found, using defaults");
        return AppSettings::default();
    }

    match std::fs::read_to_string(&settings_path) {
        Ok(content) => match serde_json::from_str(&content) {
            Ok(settings) => {
                info!("Settings loaded successfully from {:?}", settings_path);
                settings
            }
            Err(e) => {
                error!("Failed to parse settings: {}", e);
                AppSettings::default()
            }
        },
        Err(e) => {
            error!("Failed to read settings file: {}", e);
            AppSettings::default()
        }
    }
}

/// 儲存設定到檔案
pub async fn save_settings_to_file(app: &AppHandle, settings: &AppSettings) -> AppResult<()> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| AppError::Path(e.to_string()))?;

    // 確保目錄存在
    if !app_data_dir.exists() {
        tokio::fs::create_dir_all(&app_data_dir)
            .await
            .map_err(AppError::Io)?;
        debug!("Created app data directory: {:?}", app_data_dir);
    }

    let settings_path = app_data_dir.join("settings.json");
    let json = serde_json::to_string_pretty(settings)?;

    tokio::fs::write(&settings_path, json)
        .await
        .map_err(AppError::Io)?;

    info!("Settings saved successfully to {:?}", settings_path);
    Ok(())
}

/// 載入設定命令
#[tauri::command]
pub fn load_settings(state: tauri::State<SettingsState>) -> AppSettings {
    let settings = state.get();
    debug!("Settings loaded: {:?}", settings);
    settings
}

/// 儲存設定命令
#[tauri::command]
pub async fn save_settings(
    app: AppHandle,
    state: tauri::State<'_, SettingsState>,
    settings: AppSettings,
) -> Result<(), String> {
    // 更新記憶體中的設定
    state.update(settings.clone());

    // 儲存到檔案
    save_settings_to_file(&app, &settings)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}
