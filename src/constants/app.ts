/**
 * 應用程式常數
 */

/**
 * 應用程式名稱
 */
export const APP_NAME = 'YTD.CC';

/**
 * 應用程式版本
 */
export const APP_VERSION = '0.2.0';

/**
 * 歷史記錄最大數量
 */
export const MAX_HISTORY_RECORDS = 200;

/**
 * 歷史記錄檔案名稱
 */
export const HISTORY_FILE_NAME = 'history.json';

/**
 * 通知群組 ID
 */
export const NOTIFICATION_GROUP = 'foo-css';

/**
 * 支援的圖片格式
 */
export const SUPPORTED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif'] as const;

/**
 * 支援的下載格式
 */
export const SUPPORTED_FORMATS = ['MP3', 'MP4'] as const;

export type SupportedFormat = (typeof SUPPORTED_FORMATS)[number];
