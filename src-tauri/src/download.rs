// YTD-CC 下載管理模組
// 處理 yt-dlp 下載操作

#[allow(unused_imports)]
use crate::error::{AppError, AppResult};
use serde_json::Value;
use tauri::{AppHandle, Emitter, Manager, Window};
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;
use tracing::{debug, error, info, warn};

/// 下載進度事件名稱
const DOWNLOAD_PROGRESS_EVENT: &str = "download_progress";

/// 取得影片資訊
#[tauri::command]
pub async fn get_video_info(app: AppHandle, url: String) -> Result<Value, String> {
    info!("Fetching video info for: {}", url);

    let output = app
        .shell()
        .sidecar("yt-dlp")
        .map_err(|e| {
            error!("Failed to create yt-dlp sidecar: {}", e);
            e.to_string()
        })?
        .arg("-J")
        .arg(&url)
        .output()
        .await
        .map_err(|e| {
            error!("Failed to execute yt-dlp: {}", e);
            e.to_string()
        })?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        error!("yt-dlp failed: {}", stderr);
        return Err(format!("無法取得影片資訊: {}", stderr));
    }

    let json_str = String::from_utf8(output.stdout).map_err(|e| {
        error!("Failed to parse yt-dlp output: {}", e);
        e.to_string()
    })?;

    let json: Value = serde_json::from_str(&json_str).map_err(|e| {
        error!("Failed to parse JSON: {}", e);
        e.to_string()
    })?;

    info!("Video info fetched successfully");
    Ok(json)
}



/// 解析下載進度
/// 使用字元安全的方式解析，避免在多位元組字元中間切割
fn parse_progress(line: &str) -> Option<String> {
    if !line.contains("[download]") || !line.contains('%') {
        return None;
    }

    // 尋找 '%' 的位置，然後往回找數字
    // 使用 char_indices 來安全地處理 UTF-8 字元
    let chars: Vec<(usize, char)> = line.char_indices().collect();
    
    // 找到 '%' 字元的索引位置
    let percent_char_idx = chars.iter().position(|(_, c)| *c == '%')?;
    
    // 從 '%' 往回收集數字和小數點
    let mut digits = String::new();
    let mut found_digit = false;
    
    for i in (0..percent_char_idx).rev() {
        let ch = chars[i].1;
        if ch.is_ascii_digit() || ch == '.' {
            digits.insert(0, ch);
            found_digit = true;
        } else if found_digit {
            // 已經找到數字後遇到非數字字元，停止
            break;
        } else if ch.is_whitespace() {
            // 在找到數字之前遇到空白，繼續往回找
            continue;
        } else {
            // 遇到其他字元，停止
            break;
        }
    }

    // 驗證解析結果是否為有效數字
    if digits.is_empty() {
        return None;
    }

    digits
        .parse::<f64>()
        .ok()
        .map(|_| format!("{}%", digits))
}

/// 下載影片參數 (Command Input)
#[derive(serde::Deserialize)]
pub struct DownloadVideoParams {
    pub url: String,
    pub path: String,
    pub format: String,
    pub is_audio: bool,
}

/// 下載回應
#[derive(serde::Serialize)]
pub struct DownloadResponse {
    pub message: String,
}

/// 下載影片（帶進度回報）
#[tauri::command]
pub async fn download_video(
    app: AppHandle,
    window: Window,
    params: DownloadVideoParams,
) -> AppResult<DownloadResponse> {
    info!(
        "Starting download: url={}, path={}, is_audio={}",
        params.url, params.path, params.is_audio
    );

    let command = app.shell().sidecar("yt-dlp").map_err(|e| {
        error!("Failed to create yt-dlp sidecar: {}", e);
        AppError::ExternalProcess(e.to_string())
    })?;

    // 建構命令參數
    let mut args = vec![
        "-P", &params.path, 
        "--newline",
        "--no-check-certificates",
        "--extractor-retries", "3",
        "--fragment-retries", "3",
        "--retry-sleep", "3",
        "--no-warnings",
    ];

    if params.is_audio {
        args.extend(["-x", "--audio-format", "mp3"]);
    } else {
        args.extend(["-f", &params.format, "--merge-output-format", "mp4"]);
    }

    args.push(&params.url);

    debug!("yt-dlp args: {:?}", args);

    let (mut rx, _child) = command.args(args).spawn().map_err(|e| {
        error!("Failed to spawn yt-dlp: {}", e);
        AppError::ExternalProcess(e.to_string())
    })?;

    let mut success = false;
    let mut stderr_output = String::new();
    let mut video_download_complete = false;

    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Stdout(line_bytes) => {
                let line = String::from_utf8_lossy(&line_bytes);
                debug!("yt-dlp stdout: {}", line.trim());

                if let Some(progress) = parse_progress(&line) {
                    let progress_value: f64 =
                        progress.trim_end_matches('%').parse().unwrap_or(0.0);

                    // 追蹤影片下載完成狀態（用於處理音訊轉換的第二階段進度）
                    if progress_value >= 100.0 {
                        video_download_complete = true;
                    }

                    // 如果影片已下載完成，忽略後續的轉換進度
                    if video_download_complete && progress_value < 100.0 {
                        continue;
                    }

                    if let Err(e) = window.emit(DOWNLOAD_PROGRESS_EVENT, &progress) {
                        warn!("Failed to emit progress: {}", e);
                    }
                }
            }
            CommandEvent::Stderr(line_bytes) => {
                let line = String::from_utf8_lossy(&line_bytes);
                stderr_output.push_str(&line);
                debug!("yt-dlp stderr: {}", line.trim());
            }
            CommandEvent::Terminated(payload) => {
                if payload.code == Some(0) {
                    success = true;
                    info!("Download completed successfully");
                } else {
                    error!("Download failed with code: {:?}", payload.code);
                }
            }
            _ => {}
        }
    }

    if !success {
        let error_msg = if stderr_output.is_empty() {
            "下載失敗：未知錯誤".to_string()
        } else {
            format!("下載失敗: {}", stderr_output.lines().last().unwrap_or(""))
        };
        return Err(AppError::Download(error_msg));
    }

    Ok(DownloadResponse {
        message: "下載成功".to_string(),
    })
}

/// 簡易下載（舊 API 相容）
#[tauri::command]
pub async fn download_youtube(app: AppHandle, url: String, path: String) -> Result<String, String> {
    info!("Simple download: url={}, path={}", url, path);

    let output = app
        .shell()
        .sidecar("yt-dlp")
        .map_err(|e| {
            error!("Failed to create yt-dlp sidecar: {}", e);
            e.to_string()
        })?
        .args(["-P", &path])
        .args([
            "-f",
            "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        ])
        .arg(&url)
        .output()
        .await
        .map_err(|e| {
            error!("Failed to execute yt-dlp: {}", e);
            e.to_string()
        })?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        error!("Download failed: {}", stderr);
        return Err("下載失敗".to_string());
    }

    info!("Simple download completed");
    Ok("下載成功".to_string())
}
