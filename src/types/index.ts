/**
 * YTD-CC 應用程式型別定義
 */

// ============================================================================
// 歷史記錄
// ============================================================================

/** 下載歷史記錄項目 */
export interface HistoryItem {
    VIDEO_NAME: string;
    FILE_FORMAT: 'MP3' | 'MP4';
    VIDEO_DURATION: string;
    BANNER_IMAGE: string;
    DOWNLOAD_TIME: number;
    AUDIO_QUALITY?: string;
    VIDEO_QUALITY?: string;
}

/** 歷史記錄 JSON 檔案結構 */
export interface HistoryData {
    DOWNLOAD_COUNT_STATISTICS: {
        MP3: number;
        MP4: number;
    };
    HISTORY_RECORDS: HistoryItem[];
}

// ============================================================================
// 下載佇列
// ============================================================================

/** 佇列項目狀態 */
export type QueueItemStatus = 'pending' | 'downloading' | 'completed' | 'error';

/** 下載佇列項目 */
export interface QueueItem {
    id: number;
    url: string;
    title: string;
    thumbnail: string;
    duration: string;
    format: 'MP3' | 'MP4';
    quality: string;
    height?: number;
    bitrate?: string;
    status: QueueItemStatus;
    progress: number;
}

/** 新增佇列項目時的輸入類型 (不含自動產生的欄位) */
export type QueueItemInput = Omit<QueueItem, 'id' | 'status' | 'progress'>;

// ============================================================================
// 應用程式設定
// ============================================================================

/** 應用程式設定 */
export interface AppSettings {
    WINDOW_CONTROLS_ON_THE_LEFT: boolean;
    DOWNLOAD_OUTPUT_PATH: string;
    SAVE_HISTORY: boolean;
    BANNER_IMAGE: string;
}

// ============================================================================
// 影片資訊 (來自 yt-dlp)
// ============================================================================

/** 影片格式資訊 */
export interface VideoFormat {
    format_id: string;
    ext: string;
    width?: number;
    height?: number;
    vcodec: string;
    acodec: string;
    tbr?: number;
}

/** 播放清單項目 */
export interface PlaylistEntry {
    id: string;
    title: string;
    duration_string?: string;
    uploader?: string;
}

/** 影片/播放清單資訊 */
export interface VideoInfo {
    title: string;
    uploader: string;
    thumbnail?: string;
    duration_string: string;
    formats: VideoFormat[];
    thumbnails?: { url: string }[];
    entries?: PlaylistEntry[];
}

// ============================================================================
// 播放清單 Modal
// ============================================================================

/** 播放清單項目 (UI 用) */
export interface PlaylistVideoItem {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    uploader: string;
    selected: boolean;
}

/** 播放清單資料 (UI 用) */
export interface PlaylistData {
    title: string;
    uploader: string;
    count: number;
    thumbnail: string;
    entries: PlaylistVideoItem[];
}

/** 播放清單下載選項 */
export interface PlaylistDownloadOptions {
    format: 'MP3' | 'MP4';
    quality: string;
    height: number;
    audioQuality: string;
    bitrate: string;
}

// ============================================================================
// 音訊/影片品質選項
// ============================================================================

/** 影片畫質選項 */
export interface VideoQualityOption {
    label: string;
    height: number;
}

/** 音訊品質選項 */
export interface AudioQualityOption {
    label: string;
    bitrate: string;
}

// ============================================================================
// 下拉選單選項
// ============================================================================

/** 下拉選單選項 */
export interface DropdownOption {
    label: string;
    value: string;
    icon?: unknown;
    height?: number;
    bitrate?: string;
}
