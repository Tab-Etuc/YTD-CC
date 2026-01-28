/**
 * 下載狀態 Store
 * 管理下載進度和狀態
 */

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { logger } from '@/services/errorHandler';

export const useDownloadStore = defineStore('download', () => {
    // ============================================================================
    // State
    // ============================================================================

    /** 是否正在下載 */
    const isDownloading = ref(false);

    /** 下載進度條數值 */
    const progressBarValue = ref('0%');

    /** 下載進度百分比 (數字) */
    const progressPercent = computed(() => {
        const value = parseFloat(progressBarValue.value);
        return isNaN(value) ? 0 : value;
    });

    /** 是否有下載進度 */
    const hasProgress = computed(() => progressPercent.value > 0);

    // ============================================================================
    // Actions
    // ============================================================================

    /** 開始下載 */
    function startDownload(): void {
        isDownloading.value = true;
        progressBarValue.value = '0%';
        logger.info('Download started');
    }

    /** 完成下載 */
    function finishDownload(): void {
        isDownloading.value = false;
        progressBarValue.value = '100%';
        logger.info('Download finished');
    }

    /** 取消/失敗下載 */
    function cancelDownload(): void {
        isDownloading.value = false;
        progressBarValue.value = '0%';
        logger.info('Download cancelled or failed');
    }

    /** 更新下載狀態 */
    function updateDownloadStatus(status: boolean): void {
        isDownloading.value = status;
    }

    /** 設定進度條數值 */
    function setProgressBarValue(value: string): void {
        progressBarValue.value = value;
    }

    /** 重置下載狀態 */
    function reset(): void {
        isDownloading.value = false;
        progressBarValue.value = '0%';
    }

    return {
        // State
        isDownloading,
        progressBarValue,

        // Getters
        progressPercent,
        hasProgress,

        // Actions
        startDownload,
        finishDownload,
        cancelDownload,
        updateDownloadStatus,
        setProgressBarValue,
        reset,
    };
});
