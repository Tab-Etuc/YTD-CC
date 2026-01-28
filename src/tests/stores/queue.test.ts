/**
 * 佇列 Store 測試
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useQueueStore } from '@/stores/queue';
import type { QueueItemInput } from '@/types';

// Mock 日誌服務
vi.mock('@/services/errorHandler', () => ({
    logger: {
        info: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

describe('useQueueStore', () => {
    const mockItem: QueueItemInput = {
        url: 'https://youtube.com/watch?v=test',
        title: '測試影片',
        thumbnail: 'https://example.com/thumb.jpg',
        duration: '03:45',
        format: 'MP4',
        quality: '1080p',
        height: 1080,
    };

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    describe('初始狀態', () => {
        it('應該有正確的初始值', () => {
            const store = useQueueStore();

            expect(store.items).toEqual([]);
            expect(store.isProcessing).toBe(false);
            expect(store.hasItems).toBe(false);
            expect(store.pendingCount).toBe(0);
        });
    });

    describe('addItem', () => {
        it('應該加入項目到佇列', () => {
            const store = useQueueStore();

            const added = store.addItem(mockItem);

            expect(store.items).toHaveLength(1);
            expect(added.id).toBeDefined();
            expect(added.status).toBe('pending');
            expect(added.progress).toBe(0);
            expect(added.title).toBe(mockItem.title);
        });

        it('應該產生遞增的 ID', () => {
            const store = useQueueStore();

            const item1 = store.addItem(mockItem);
            const item2 = store.addItem(mockItem);

            expect(item2.id).toBe(item1.id + 1);
        });
    });

    describe('addItems', () => {
        it('應該加入多個項目', () => {
            const store = useQueueStore();

            const items = store.addItems([mockItem, { ...mockItem, title: '第二個' }]);

            expect(store.items).toHaveLength(2);
            expect(items).toHaveLength(2);
        });
    });

    describe('removeItem', () => {
        it('應該移除指定項目', () => {
            const store = useQueueStore();
            const added = store.addItem(mockItem);

            const result = store.removeItem(added.id);

            expect(result).toBe(true);
            expect(store.items).toHaveLength(0);
        });

        it('移除不存在的項目應該回傳 false', () => {
            const store = useQueueStore();

            const result = store.removeItem(999);

            expect(result).toBe(false);
        });
    });

    describe('clearPending', () => {
        it('應該清除待處理項目但保留正在下載的', () => {
            const store = useQueueStore();
            const item1 = store.addItem(mockItem);
            store.addItem(mockItem);

            store.startItem(item1.id);
            store.clearPending();

            expect(store.items).toHaveLength(1);
            expect(store.items[0]!.status).toBe('downloading');
        });
    });

    describe('clearCompleted', () => {
        it('應該清除已完成和錯誤的項目', () => {
            const store = useQueueStore();
            const item1 = store.addItem(mockItem);
            const item2 = store.addItem(mockItem);
            const item3 = store.addItem(mockItem);

            store.completeItem(item1.id);
            store.failItem(item2.id);

            store.clearCompleted();

            expect(store.items).toHaveLength(1);
            expect(store.items[0]!.id).toBe(item3.id);
        });
    });

    describe('updateItemStatus', () => {
        it('應該更新項目狀態', () => {
            const store = useQueueStore();
            const item = store.addItem(mockItem);

            store.updateItemStatus({ id: item.id, status: 'downloading', progress: 50 });

            expect(store.items[0]!.status).toBe('downloading');
            expect(store.items[0]!.progress).toBe(50);
        });
    });

    describe('便利方法', () => {
        it('startItem 應該將項目設為 downloading', () => {
            const store = useQueueStore();
            const item = store.addItem(mockItem);

            store.startItem(item.id);

            expect(store.items[0]!.status).toBe('downloading');
        });

        it('completeItem 應該將項目設為 completed', () => {
            const store = useQueueStore();
            const item = store.addItem(mockItem);

            store.completeItem(item.id);

            expect(store.items[0]!.status).toBe('completed');
            expect(store.items[0]!.progress).toBe(100);
        });

        it('failItem 應該將項目設為 error', () => {
            const store = useQueueStore();
            const item = store.addItem(mockItem);

            store.failItem(item.id);

            expect(store.items[0]!.status).toBe('error');
        });
    });

    describe('getNextPending', () => {
        it('應該回傳第一個待處理項目', () => {
            const store = useQueueStore();
            const item1 = store.addItem(mockItem);
            store.addItem(mockItem);

            store.startItem(item1.id);

            const next = store.getNextPending();

            expect(next?.id).not.toBe(item1.id);
            expect(next?.status).toBe('pending');
        });

        it('沒有待處理項目時應該回傳 undefined', () => {
            const store = useQueueStore();

            expect(store.getNextPending()).toBeUndefined();
        });
    });

    describe('computed 屬性', () => {
        it('pendingCount 應該計算待處理項目數', () => {
            const store = useQueueStore();
            store.addItem(mockItem);
            store.addItem(mockItem);
            const item3 = store.addItem(mockItem);

            store.startItem(item3.id);

            expect(store.pendingCount).toBe(2);
        });

        it('downloadingItem 應該回傳正在下載的項目', () => {
            const store = useQueueStore();
            const item = store.addItem(mockItem);

            store.startItem(item.id);

            expect(store.downloadingItem?.id).toBe(item.id);
        });

        it('overallProgress 應該計算整體進度', () => {
            const store = useQueueStore();
            const item1 = store.addItem(mockItem);
            store.addItem(mockItem); // 添加第二個項目以計算 50% 進度

            store.completeItem(item1.id);
            // 50% 完成

            expect(store.overallProgress).toBe(50);
        });
    });

    describe('retryFailed', () => {
        it('應該將所有失敗項目重設為待處理', () => {
            const store = useQueueStore();
            const item1 = store.addItem(mockItem);
            const item2 = store.addItem(mockItem);

            store.failItem(item1.id);
            store.failItem(item2.id);

            store.retryFailed();

            expect(store.items.every((i) => i.status === 'pending')).toBe(true);
        });
    });
});
