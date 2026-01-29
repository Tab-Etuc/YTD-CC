/**
 * YTD-CC 主要 Store
 * 使用 Pinia Setup Store 語法，提供完整 TypeScript 支援
 */

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { invoke } from '@tauri-apps/api/core';
import { readTextFile, writeTextFile, exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';
import type { HistoryItem, HistoryData, QueueItem, QueueItemInput, AppSettings } from '@/types';
import { logger } from '@/services/errorHandler';

export const useAppStore = defineStore('app', () => {
    // ============================================================================
    // State
    // ============================================================================

    /** 是否正在下載 */
    const isDownloading = ref(false);

    /** 下載歷史記錄列表 */
    const historyList = ref<HistoryItem[] | null>(null);

    /** 下載進度條數值 */
    const downloadProgressBarValue = ref('0%');

    /** 視窗控制器是否在左側 */
    const windowControlOnTheLeft = ref(false);

    /** 下載輸出路徑 */
    const downloadOutputPath = ref('');

    /** 是否儲存歷史記錄 */
    const saveHistory = ref(true);

    /** 橫幅圖片路徑 */
    const bannerImage = ref('');

    /** 下載佇列 */
    const downloadQueue = ref<QueueItem[]>([]);

    /** 佇列是否正在處理中 */
    const isQueueProcessing = ref(false);

    /** 佇列 ID 計數器 */
    const queueIdCounter = ref(0);

    // ============================================================================
    // Getters
    // ============================================================================

    /** 待處理的佇列項目數量 */
    const pendingQueueCount = computed(
        () => downloadQueue.value.filter((i) => i.status === 'pending').length
    );

    /** 是否有佇列項目 */
    const hasQueueItems = computed(() => downloadQueue.value.length > 0);

    // ============================================================================
    // Actions - 下載狀態
    // ============================================================================

    /** 更新下載狀態 */
    function updateDownloadStatus(status: boolean): void {
        isDownloading.value = status;
    }

    /** 設定進度條數值 */
    function setProgressBarValue(value: string): void {
        downloadProgressBarValue.value = value;
    }

    // ============================================================================
    // Actions - 歷史記錄
    // ============================================================================

    /** 設定歷史記錄列表 */
    function setHistoryList(list: HistoryItem[] | null): void {
        historyList.value = list;
    }

    /** 從檔案載入歷史記錄 */
    async function fetchHistoryList(): Promise<void> {
        try {
            const log = await readTextFile('history.json', {
                baseDir: BaseDirectory.AppData,
            });
            const data: HistoryData = JSON.parse(log);
            const records = data.HISTORY_RECORDS?.reverse() ?? [];
            historyList.value = records.length > 0 ? records : null;
        } catch {
            historyList.value = null;
        }
    }

    /** 新增歷史記錄項目 */
    async function addHistoryItem(item: {
        title: string;
        format: 'MP3' | 'MP4';
        duration: string;
        thumbnail: string;
        quality: string;
    }): Promise<void> {
        if (!saveHistory.value) {
            return;
        }

        try {
            const historyPath = 'history.json';

            // 確保目錄存在
            if (!(await exists(historyPath, { baseDir: BaseDirectory.AppData }))) {
                await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });
            }

            // 讀取現有資料
            let jsonData: HistoryData = {
                DOWNLOAD_COUNT_STATISTICS: { MP3: 0, MP4: 0 },
                HISTORY_RECORDS: [],
            };

            try {
                const content = await readTextFile(historyPath, {
                    baseDir: BaseDirectory.AppData,
                });
                if (content) {
                    jsonData = JSON.parse(content);
                }
            } catch {
                // 忽略讀取錯誤，使用預設值
            }

            // 確保資料結構完整
            if (!jsonData.DOWNLOAD_COUNT_STATISTICS) {
                jsonData.DOWNLOAD_COUNT_STATISTICS = { MP3: 0, MP4: 0 };
            }
            if (!jsonData.HISTORY_RECORDS) {
                jsonData.HISTORY_RECORDS = [];
            }

            // 更新統計
            if (item.format === 'MP3') {
                jsonData.DOWNLOAD_COUNT_STATISTICS.MP3++;
            } else {
                jsonData.DOWNLOAD_COUNT_STATISTICS.MP4++;
            }

            // 新增記錄
            const newRecord: HistoryItem = {
                VIDEO_NAME: item.title,
                FILE_FORMAT: item.format,
                VIDEO_DURATION: item.duration || '00:00',
                BANNER_IMAGE: item.thumbnail,
                DOWNLOAD_TIME: Date.now(),
                ...(item.format === 'MP3' && { AUDIO_QUALITY: item.quality }),
                ...(item.format === 'MP4' && { VIDEO_QUALITY: item.quality }),
            };

            jsonData.HISTORY_RECORDS.unshift(newRecord);

            // 限制記錄數量
            if (jsonData.HISTORY_RECORDS.length > 200) {
                jsonData.HISTORY_RECORDS = jsonData.HISTORY_RECORDS.slice(0, 200);
            }

            // 儲存
            await writeTextFile(historyPath, JSON.stringify(jsonData, null, 2), {
                baseDir: BaseDirectory.AppData,
            });

            // 重新載入
            await fetchHistoryList();
        } catch (err) {
            console.error('Failed to write history:', err);
        }
    }

    // ============================================================================
    // Actions - 設定
    // ============================================================================

    /** 設定視窗控制器位置 */
    function setWindowControlsOnTheLeft(value: boolean): void {
        windowControlOnTheLeft.value = value;
    }

    /** 設定下載輸出路徑 */
    function setDownloadOutputPath(path: string): void {
        downloadOutputPath.value = path;
    }

    /** 設定是否儲存歷史記錄 */
    function setSaveHistory(value: boolean): void {
        saveHistory.value = value;
    }

    /** 設定橫幅圖片 */
    function setBannerImage(path: string): void {
        bannerImage.value = path;
    }

    /** 從後端載入設定 */
    async function fetchSettings(): Promise<void> {
        try {
            const data = await invoke<AppSettings>('load_settings');
            logger.debug('Loaded settings:', { data });
            windowControlOnTheLeft.value = data.WINDOW_CONTROLS_ON_THE_LEFT;
            downloadOutputPath.value = data.DOWNLOAD_OUTPUT_PATH;
            saveHistory.value = data.SAVE_HISTORY;
            bannerImage.value = data.BANNER_IMAGE || '';
        } catch (err) {
            console.error('Failed to load settings from Rust backend:', err);
        }
    }

    // ============================================================================
    // Actions - 下載佇列
    // ============================================================================

    /** 加入單一項目到佇列 */
    function addToQueue(item: QueueItemInput): void {
        queueIdCounter.value++;
        downloadQueue.value.push({
            ...item,
            id: queueIdCounter.value,
            status: 'pending',
            progress: 0,
        });
    }

    /** 加入多個項目到佇列 */
    function addMultipleToQueue(items: QueueItemInput[]): void {
        items.forEach((item) => {
            queueIdCounter.value++;
            downloadQueue.value.push({
                ...item,
                id: queueIdCounter.value,
                status: 'pending',
                progress: 0,
            });
        });
    }

    /** 從佇列移除項目 */
    function removeFromQueue(id: number): void {
        const index = downloadQueue.value.findIndex((i) => i.id === id);
        if (index > -1) {
            downloadQueue.value.splice(index, 1);
        }
    }

    /** 清空佇列 (保留正在下載的項目) */
    function clearQueue(): void {
        downloadQueue.value = downloadQueue.value.filter((i) => i.status === 'downloading');
    }

    /** 清除已完成和錯誤的佇列項目 */
    function clearCompletedQueue(): void {
        downloadQueue.value = downloadQueue.value.filter(
            (i) => i.status !== 'completed' && i.status !== 'error'
        );
    }

    /** 更新佇列項目狀態 */
    function updateQueueItemStatus(params: {
        id: number;
        status: QueueItem['status'];
        progress?: number;
    }): void {
        const item = downloadQueue.value.find((i) => i.id === params.id);
        if (item) {
            item.status = params.status;
            if (params.progress !== undefined) {
                item.progress = params.progress;
            }
        }
    }

    /** 更新正在下載項目的進度 */
    function updateQueueItemProgress(params: { progress: number }): void {
        const downloading = downloadQueue.value.find((i) => i.status === 'downloading');
        if (downloading) {
            downloading.progress = params.progress;
        }
    }

    /** 設定佇列處理狀態 */
    function setQueueProcessing(value: boolean): void {
        isQueueProcessing.value = value;
    }

    // ============================================================================
    // 匯出
    // ============================================================================

    return {
        // State
        isDownloading,
        historyList,
        downloadProgressBarValue,
        windowControlOnTheLeft,
        downloadOutputPath,
        saveHistory,
        bannerImage,
        downloadQueue,
        isQueueProcessing,

        // Getters
        pendingQueueCount,
        hasQueueItems,

        // Actions - 下載狀態
        updateDownloadStatus,
        setProgressBarValue,

        // Actions - 歷史記錄
        setHistoryList,
        fetchHistoryList,
        addHistoryItem,

        // Actions - 設定
        setWindowControlsOnTheLeft,
        setDownloadOutputPath,
        setSaveHistory,
        setBannerImage,
        fetchSettings,

        // Actions - 下載佇列
        addToQueue,
        addMultipleToQueue,
        removeFromQueue,
        clearQueue,
        clearCompletedQueue,
        updateQueueItemStatus,
        updateQueueItemProgress,
        setQueueProcessing,
    };
});
