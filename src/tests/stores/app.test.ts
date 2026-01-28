/**
 * Pinia Store 測試範例
 * 展示如何測試 Pinia store 的 actions 和 state
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAppStore } from '@/stores/app';

describe('useAppStore', () => {
    beforeEach(() => {
        // 每個測試前創建新的 Pinia 實例
        setActivePinia(createPinia());
    });

    describe('初始狀態', () => {
        it('isDownloading 應該預設為 false', () => {
            const store = useAppStore();
            expect(store.isDownloading).toBe(false);
        });

        it('historyList 應該預設為 null', () => {
            const store = useAppStore();
            expect(store.historyList).toBeNull();
        });

        it('downloadQueue 應該預設為空陣列', () => {
            const store = useAppStore();
            expect(store.downloadQueue).toEqual([]);
        });
    });

    describe('下載狀態 Actions', () => {
        it('updateDownloadStatus 應該正確更新狀態', () => {
            const store = useAppStore();

            store.updateDownloadStatus(true);
            expect(store.isDownloading).toBe(true);

            store.updateDownloadStatus(false);
            expect(store.isDownloading).toBe(false);
        });

        it('setProgressBarValue 應該正確設定進度', () => {
            const store = useAppStore();

            store.setProgressBarValue('50%');
            expect(store.downloadProgressBarValue).toBe('50%');
        });
    });

    describe('佇列 Actions', () => {
        it('addToQueue 應該正確加入項目', () => {
            const store = useAppStore();

            store.addToQueue({
                url: 'https://youtube.com/watch?v=abc123',
                title: '測試影片',
                thumbnail: 'https://img.youtube.com/vi/abc123/mqdefault.jpg',
                duration: '3:45',
                format: 'MP4',
                quality: '1080p',
            });

            expect(store.downloadQueue).toHaveLength(1);
            expect(store.downloadQueue[0]!.title).toBe('測試影片');
            expect(store.downloadQueue[0]!.status).toBe('pending');
            expect(store.downloadQueue[0]!.progress).toBe(0);
        });

        it('addMultipleToQueue 應該正確加入多個項目', () => {
            const store = useAppStore();

            store.addMultipleToQueue([
                {
                    url: 'https://youtube.com/watch?v=abc123',
                    title: '影片 1',
                    thumbnail: '',
                    duration: '3:45',
                    format: 'MP4',
                    quality: '1080p',
                },
                {
                    url: 'https://youtube.com/watch?v=def456',
                    title: '影片 2',
                    thumbnail: '',
                    duration: '5:00',
                    format: 'MP3',
                    quality: '320kbps',
                },
            ]);

            expect(store.downloadQueue).toHaveLength(2);
            expect(store.pendingQueueCount).toBe(2);
        });

        it('removeFromQueue 應該正確移除項目', () => {
            const store = useAppStore();

            store.addToQueue({
                url: 'https://youtube.com/watch?v=abc123',
                title: '測試影片',
                thumbnail: '',
                duration: '3:45',
                format: 'MP4',
                quality: '1080p',
            });

            const itemId = store.downloadQueue[0]!.id;
            store.removeFromQueue(itemId);

            expect(store.downloadQueue).toHaveLength(0);
        });

        it('updateQueueItemStatus 應該正確更新狀態', () => {
            const store = useAppStore();

            store.addToQueue({
                url: 'https://youtube.com/watch?v=abc123',
                title: '測試影片',
                thumbnail: '',
                duration: '3:45',
                format: 'MP4',
                quality: '1080p',
            });

            const itemId = store.downloadQueue[0]!.id;
            store.updateQueueItemStatus({
                id: itemId,
                status: 'downloading',
                progress: 50,
            });

            expect(store.downloadQueue[0]!.status).toBe('downloading');
            expect(store.downloadQueue[0]!.progress).toBe(50);
        });
    });

    describe('Getters', () => {
        it('pendingQueueCount 應該正確計算待處理數量', () => {
            const store = useAppStore();

            store.addMultipleToQueue([
                {
                    url: 'url1',
                    title: '1',
                    thumbnail: '',
                    duration: '',
                    format: 'MP4',
                    quality: '',
                },
                {
                    url: 'url2',
                    title: '2',
                    thumbnail: '',
                    duration: '',
                    format: 'MP4',
                    quality: '',
                },
            ]);

            expect(store.pendingQueueCount).toBe(2);

            // 更新第一個為完成
            store.updateQueueItemStatus({
                id: store.downloadQueue[0]!.id,
                status: 'completed',
            });

            expect(store.pendingQueueCount).toBe(1);
        });

        it('hasQueueItems 應該正確判斷是否有項目', () => {
            const store = useAppStore();

            expect(store.hasQueueItems).toBe(false);

            store.addToQueue({
                url: 'url',
                title: 'test',
                thumbnail: '',
                duration: '',
                format: 'MP4',
                quality: '',
            });

            expect(store.hasQueueItems).toBe(true);
        });
    });
});
