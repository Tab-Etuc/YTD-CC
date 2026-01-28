// YTD-CC 應用程式錯誤處理模組
// 提供結構化錯誤類型和轉換

use serde::Serialize;
use thiserror::Error;

/// 應用程式錯誤類型
#[derive(Error, Debug)]
pub enum AppError {
    #[error("IO 錯誤: {0}")]
    Io(#[from] std::io::Error),

    #[error("JSON 序列化錯誤: {0}")]
    Json(#[from] serde_json::Error),

    #[error("路徑錯誤: {0}")]
    Path(String),

    #[error("Shell 命令錯誤: {0}")]
    Shell(String),

    #[error("下載錯誤: {0}")]
    Download(String),

    #[error("檔案系統錯誤: {0}")]
    FileSystem(String),

    #[error("設定錯誤: {0}")]
    Settings(String),

    #[error("外部程式錯誤: {0}")]
    ExternalProcess(String),

    #[error("未知錯誤: {0}")]
    Unknown(String),
}

/// 錯誤回應結構
#[derive(Serialize)]
pub struct ErrorResponse {
    pub code: String,
    pub message: String,
    pub details: Option<String>,
}

impl From<AppError> for ErrorResponse {
    fn from(error: AppError) -> Self {
        let (code, message, details) = match &error {
            AppError::Io(e) => ("IO_ERROR", error.to_string(), Some(e.to_string())),
            AppError::Json(e) => ("JSON_ERROR", error.to_string(), Some(e.to_string())),
            AppError::Path(msg) => ("PATH_ERROR", error.to_string(), Some(msg.clone())),
            AppError::Shell(msg) => ("SHELL_ERROR", error.to_string(), Some(msg.clone())),
            AppError::Download(msg) => ("DOWNLOAD_ERROR", error.to_string(), Some(msg.clone())),
            AppError::FileSystem(msg) => ("FS_ERROR", error.to_string(), Some(msg.clone())),
            AppError::Settings(msg) => ("SETTINGS_ERROR", error.to_string(), Some(msg.clone())),
            AppError::ExternalProcess(msg) => {
                ("EXTERNAL_PROCESS_ERROR", error.to_string(), Some(msg.clone()))
            }
            AppError::Unknown(msg) => ("UNKNOWN_ERROR", error.to_string(), Some(msg.clone())),
        };

        ErrorResponse {
            code: code.to_string(),
            message,
            details,
        }
    }
}

// 實作 Serialize 以便於透過 Tauri 傳遞
impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        ErrorResponse::from(self.clone_error()).serialize(serializer)
    }
}

impl AppError {
    /// 複製錯誤 (僅用於 Serialize)
    fn clone_error(&self) -> AppError {
        match self {
            AppError::Io(e) => AppError::Io(std::io::Error::new(e.kind(), e.to_string())),
            AppError::Json(_) => AppError::Unknown(self.to_string()),
            AppError::Path(msg) => AppError::Path(msg.clone()),
            AppError::Shell(msg) => AppError::Shell(msg.clone()),
            AppError::Download(msg) => AppError::Download(msg.clone()),
            AppError::FileSystem(msg) => AppError::FileSystem(msg.clone()),
            AppError::Settings(msg) => AppError::Settings(msg.clone()),
            AppError::ExternalProcess(msg) => AppError::ExternalProcess(msg.clone()),
            AppError::Unknown(msg) => AppError::Unknown(msg.clone()),
        }
    }
}

/// 結果類型別名
pub type AppResult<T> = Result<T, AppError>;

/// 將字串錯誤轉換為 AppError
impl From<String> for AppError {
    fn from(msg: String) -> Self {
        AppError::Unknown(msg)
    }
}

impl From<&str> for AppError {
    fn from(msg: &str) -> Self {
        AppError::Unknown(msg.to_string())
    }
}
