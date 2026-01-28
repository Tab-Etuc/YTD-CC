/**
 * 下載佇列 Store
 * 管理批次下載佇列
 */

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { QueueItem, QueueItemInput, QueueItemStatus } from '@/types';
import { logger } from '@/services/errorHandler';

export const useQueueStore = defineStore('queue', () => {
    // ============================================================================
    // State
    // ============================================================================

    /** 下載佇列 */
    const items = ref<QueueItem[]>([]);

    /** 佇列是否正在處理中 */
    const isProcessing = ref(false);

    /** 佇列 ID 計數器 */
    const idCounter = ref(0);

    // ============================================================================
    // Getters
    // ============================================================================

    /** 待處理的佇列項目數量 */
    const pendingCount = computed(() => items.value.filter((i) => i.status === 'pending').length);

    /** 正在下載的項目 */
    const downloadingItem = computed(() => items.value.find((i) => i.status === 'downloading'));

    /** 已完成的項目數量 */
    const completedCount = computed(
        () => items.value.filter((i) => i.status === 'completed').length
    );

    /** 失敗的項目數量 */
    const errorCount = computed(() => items.value.filter((i) => i.status === 'error').length);

    /** 是否有佇列項目 */
    const hasItems = computed(() => items.value.length > 0);

    /** 是否有待處理項目 */
    const hasPendingItems = computed(() => pendingCount.value > 0);

    /** 佇列總數 */
    const totalCount = computed(() => items.value.length);

    /** 整體進度百分比 */
    const overallProgress = computed(() => {
        if (items.value.length === 0) {return 0;}
        const total = items.value.length;
        const completed = completedCount.value;
        const downloading = downloadingItem.value;
        const downloadingProgress = downloading ? downloading.progress / 100 : 0;
        return Math.round(((completed + downloadingProgress) / total) * 100);
    });

    // ============================================================================
    // Actions
    // ============================================================================

    /** 產生新的佇列 ID */
    function generateId(): number {
        return ++idCounter.value;
    }

    /** 加入單一項目到佇列 */
    function addItem(item: QueueItemInput): QueueItem {
        const newItem: QueueItem = {
            ...item,
            id: generateId(),
            status: 'pending',
            progress: 0,
        };

        items.value.push(newItem);
        logger.info('Queue item added', { id: newItem.id, title: item.title });

        return newItem;
    }

    /** 加入多個項目到佇列 */
    function addItems(inputItems: QueueItemInput[]): QueueItem[] {
        const newItems = inputItems.map((item) => ({
            ...item,
            id: generateId(),
            status: 'pending' as QueueItemStatus,
            progress: 0,
        }));

        items.value.push(...newItems);
        logger.info('Multiple queue items added', { count: newItems.length });

        return newItems;
    }

    /** 從佇列移除項目 */
    function removeItem(id: number): boolean {
        const index = items.value.findIndex((i) => i.id === id);
        if (index > -1) {
            items.value.splice(index, 1);
            logger.info('Queue item removed', { id });
            return true;
        }
        return false;
    }

    /** 清空佇列 (保留正在下載的項目) */
    function clearPending(): void {
        items.value = items.value.filter((i) => i.status === 'downloading');
        logger.info('Pending queue items cleared');
    }

    /** 清除已完成和錯誤的佇列項目 */
    function clearCompleted(): void {
        items.value = items.value.filter((i) => i.status !== 'completed' && i.status !== 'error');
        logger.info('Completed queue items cleared');
    }

    /** 清空所有佇列 */
    function clearAll(): void {
        items.value = [];
        logger.info('All queue items cleared');
    }

    /** 更新佇列項目狀態 */
    function updateItemStatus(params: {
        id: number;
        status: QueueItemStatus;
        progress?: number;
    }): void {
        const item = items.value.find((i) => i.id === params.id);
        if (item) {
            item.status = params.status;
            if (params.progress !== undefined) {
                item.progress = params.progress;
            }
            logger.debug('Queue item status updated', {
                id: params.id,
                status: params.status,
            });
        }
    }

    /** 更新正在下載項目的進度 */
    function updateDownloadingProgress(progress: number): void {
        const downloading = downloadingItem.value;
        if (downloading) {
            downloading.progress = progress;
        }
    }

    /** 標記項目為正在下載 */
    function startItem(id: number): void {
        updateItemStatus({ id, status: 'downloading', progress: 0 });
    }

    /** 標記項目為已完成 */
    function completeItem(id: number): void {
        updateItemStatus({ id, status: 'completed', progress: 100 });
    }

    /** 標記項目為失敗 */
    function failItem(id: number): void {
        updateItemStatus({ id, status: 'error', progress: 0 });
    }

    /** 取得下一個待處理項目 */
    function getNextPending(): QueueItem | undefined {
        return items.value.find((i) => i.status === 'pending');
    }

    /** 設定佇列處理狀態 */
    function setProcessing(value: boolean): void {
        isProcessing.value = value;
    }

    /** 重試失敗的項目 */
    function retryFailed(): void {
        items.value.forEach((item) => {
            if (item.status === 'error') {
                item.status = 'pending';
                item.progress = 0;
            }
        });
        logger.info('Failed items retried');
    }

    return {
        // State
        items,
        isProcessing,

        // Getters
        pendingCount,
        downloadingItem,
        completedCount,
        errorCount,
        hasItems,
        hasPendingItems,
        totalCount,
        overallProgress,

        // Actions
        addItem,
        addItems,
        removeItem,
        clearPending,
        clearCompleted,
        clearAll,
        updateItemStatus,
        updateDownloadingProgress,
        startItem,
        completeItem,
        failItem,
        getNextPending,
        setProcessing,
        retryFailed,
    };
});
