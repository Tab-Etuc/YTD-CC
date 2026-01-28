/**
 * 歷史記錄 Store
 * 管理下載歷史記錄
 */

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { readTextFile, writeTextFile, exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';
import type { HistoryItem, HistoryData } from '@/types';
import { logger, handleError, createFileSystemError } from '@/services/errorHandler';

const HISTORY_FILE = 'history.json';
const MAX_HISTORY_RECORDS = 200;

export const useHistoryStore = defineStore('history', () => {
    // ============================================================================
    // State
    // ============================================================================

    /** 下載歷史記錄列表 */
    const historyList = ref<HistoryItem[] | null>(null);

    /** 是否正在載入 */
    const isLoading = ref(false);

    /** 下載統計 */
    const statistics = ref<{ MP3: number; MP4: number }>({ MP3: 0, MP4: 0 });

    // ============================================================================
    // Getters
    // ============================================================================

    /** 是否有歷史記錄 */
    const hasHistory = computed(() => historyList.value !== null && historyList.value.length > 0);

    /** 歷史記錄數量 */
    const historyCount = computed(() => historyList.value?.length ?? 0);

    /** 總下載次數 */
    const totalDownloads = computed(() => statistics.value.MP3 + statistics.value.MP4);

    // ============================================================================
    // Actions
    // ============================================================================

    /** 設定歷史記錄列表 */
    function setHistoryList(list: HistoryItem[] | null): void {
        historyList.value = list;
    }

    /** 從檔案載入歷史記錄 */
    async function fetchHistoryList(): Promise<void> {
        isLoading.value = true;

        try {
            const content = await readTextFile(HISTORY_FILE, {
                baseDir: BaseDirectory.AppData,
            });

            const data: HistoryData = JSON.parse(content);
            const records = data.HISTORY_RECORDS?.reverse() ?? [];

            historyList.value = records.length > 0 ? records : null;
            statistics.value = data.DOWNLOAD_COUNT_STATISTICS ?? { MP3: 0, MP4: 0 };

            logger.info('History loaded successfully', { count: records.length });
        } catch (error) {
            historyList.value = null;
            statistics.value = { MP3: 0, MP4: 0 };
            logger.debug('No history file found or error reading', { error });
        } finally {
            isLoading.value = false;
        }
    }

    /** 新增歷史記錄項目 */
    async function addHistoryItem(
        item: {
            title: string;
            format: 'MP3' | 'MP4';
            duration: string;
            thumbnail: string;
            quality: string;
        },
        shouldSave: boolean = true
    ): Promise<void> {
        if (!shouldSave) {
            return;
        }

        try {
            // 確保目錄存在
            if (!(await exists(HISTORY_FILE, { baseDir: BaseDirectory.AppData }))) {
                await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });
            }

            // 讀取現有資料
            let jsonData: HistoryData = {
                DOWNLOAD_COUNT_STATISTICS: { MP3: 0, MP4: 0 },
                HISTORY_RECORDS: [],
            };

            try {
                const content = await readTextFile(HISTORY_FILE, {
                    baseDir: BaseDirectory.AppData,
                });
                if (content) {
                    jsonData = JSON.parse(content);
                }
            } catch {
                // 忽略讀取錯誤，使用預設值
            }

            // 確保資料結構完整
            jsonData.DOWNLOAD_COUNT_STATISTICS ??= { MP3: 0, MP4: 0 };
            jsonData.HISTORY_RECORDS ??= [];

            // 更新統計
            jsonData.DOWNLOAD_COUNT_STATISTICS[item.format]++;

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
            if (jsonData.HISTORY_RECORDS.length > MAX_HISTORY_RECORDS) {
                jsonData.HISTORY_RECORDS = jsonData.HISTORY_RECORDS.slice(0, MAX_HISTORY_RECORDS);
            }

            // 儲存
            await writeTextFile(HISTORY_FILE, JSON.stringify(jsonData, null, 2), {
                baseDir: BaseDirectory.AppData,
            });

            // 更新本地狀態
            statistics.value = jsonData.DOWNLOAD_COUNT_STATISTICS;

            // 重新載入
            await fetchHistoryList();

            logger.info('History item added', { title: item.title, format: item.format });
        } catch (error) {
            await handleError(
                createFileSystemError('無法儲存下載記錄', {
                    error: error instanceof Error ? error.message : String(error),
                })
            );
        }
    }

    /** 清除所有歷史記錄 */
    async function clearHistory(): Promise<void> {
        try {
            const jsonData: HistoryData = {
                DOWNLOAD_COUNT_STATISTICS: { MP3: 0, MP4: 0 },
                HISTORY_RECORDS: [],
            };

            await writeTextFile(HISTORY_FILE, JSON.stringify(jsonData, null, 2), {
                baseDir: BaseDirectory.AppData,
            });

            historyList.value = null;
            statistics.value = { MP3: 0, MP4: 0 };

            logger.info('History cleared');
        } catch (error) {
            await handleError(
                createFileSystemError('無法清除下載記錄', {
                    error: error instanceof Error ? error.message : String(error),
                })
            );
        }
    }

    /** 刪除單一歷史記錄 */
    async function removeHistoryItem(downloadTime: number): Promise<void> {
        try {
            const content = await readTextFile(HISTORY_FILE, {
                baseDir: BaseDirectory.AppData,
            });

            const jsonData: HistoryData = JSON.parse(content);
            const index = jsonData.HISTORY_RECORDS.findIndex(
                (item) => item.DOWNLOAD_TIME === downloadTime
            );

            if (index > -1) {
                const [removed] = jsonData.HISTORY_RECORDS.splice(index, 1);

                // 更新統計 - removed 在這裡一定存在因為 index > -1
                if (removed && jsonData.DOWNLOAD_COUNT_STATISTICS[removed.FILE_FORMAT] > 0) {
                    jsonData.DOWNLOAD_COUNT_STATISTICS[removed.FILE_FORMAT]--;
                }

                await writeTextFile(HISTORY_FILE, JSON.stringify(jsonData, null, 2), {
                    baseDir: BaseDirectory.AppData,
                });

                await fetchHistoryList();

                logger.info('History item removed', { downloadTime });
            }
        } catch (error) {
            await handleError(
                createFileSystemError('無法刪除歷史記錄', {
                    error: error instanceof Error ? error.message : String(error),
                })
            );
        }
    }

    return {
        // State
        historyList,
        isLoading,
        statistics,

        // Getters
        hasHistory,
        historyCount,
        totalDownloads,

        // Actions
        setHistoryList,
        fetchHistoryList,
        addHistoryItem,
        clearHistory,
        removeHistoryItem,
    };
});
