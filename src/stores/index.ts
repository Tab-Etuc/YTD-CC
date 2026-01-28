/**
 * YTD-CC Stores 入口
 * 匯出所有 Pinia stores
 */

export { useDownloadStore } from './download';
export { useHistoryStore } from './history';
export { useSettingsStore } from './settings';
export { useQueueStore } from './queue';

// 保持向後相容性 - 匯出舊的 useAppStore
// 注意：建議逐步遷移到使用個別的 stores
export { useAppStore } from './app';
