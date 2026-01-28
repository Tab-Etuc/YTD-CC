/**
 * 下載 Store 測試
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useDownloadStore } from '@/stores/download';

// Mock 日誌服務
vi.mock('@/services/errorHandler', () => ({
    logger: {
        info: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

describe('useDownloadStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    describe('初始狀態', () => {
        it('應該有正確的初始值', () => {
            const store = useDownloadStore();

            expect(store.isDownloading).toBe(false);
            expect(store.progressBarValue).toBe('0%');
            expect(store.progressPercent).toBe(0);
            expect(store.hasProgress).toBe(false);
        });
    });

    describe('startDownload', () => {
        it('應該設定 isDownloading 為 true 並重置進度', () => {
            const store = useDownloadStore();
            store.progressBarValue = '50%';

            store.startDownload();

            expect(store.isDownloading).toBe(true);
            expect(store.progressBarValue).toBe('0%');
        });
    });

    describe('finishDownload', () => {
        it('應該設定 isDownloading 為 false 並設定進度為 100%', () => {
            const store = useDownloadStore();
            store.isDownloading = true;

            store.finishDownload();

            expect(store.isDownloading).toBe(false);
            expect(store.progressBarValue).toBe('100%');
        });
    });

    describe('cancelDownload', () => {
        it('應該設定 isDownloading 為 false 並重置進度', () => {
            const store = useDownloadStore();
            store.isDownloading = true;
            store.progressBarValue = '50%';

            store.cancelDownload();

            expect(store.isDownloading).toBe(false);
            expect(store.progressBarValue).toBe('0%');
        });
    });

    describe('updateDownloadStatus', () => {
        it('應該更新下載狀態', () => {
            const store = useDownloadStore();

            store.updateDownloadStatus(true);
            expect(store.isDownloading).toBe(true);

            store.updateDownloadStatus(false);
            expect(store.isDownloading).toBe(false);
        });
    });

    describe('setProgressBarValue', () => {
        it('應該更新進度條數值', () => {
            const store = useDownloadStore();

            store.setProgressBarValue('75%');

            expect(store.progressBarValue).toBe('75%');
        });
    });

    describe('progressPercent (computed)', () => {
        it('應該從進度字串解析出數字', () => {
            const store = useDownloadStore();

            store.progressBarValue = '42.5%';
            expect(store.progressPercent).toBe(42.5);

            store.progressBarValue = '100%';
            expect(store.progressPercent).toBe(100);
        });

        it('無效值應該回傳 0', () => {
            const store = useDownloadStore();

            store.progressBarValue = 'invalid';
            expect(store.progressPercent).toBe(0);
        });
    });

    describe('hasProgress (computed)', () => {
        it('進度大於 0 時應該為 true', () => {
            const store = useDownloadStore();

            store.progressBarValue = '1%';
            expect(store.hasProgress).toBe(true);

            store.progressBarValue = '0%';
            expect(store.hasProgress).toBe(false);
        });
    });

    describe('reset', () => {
        it('應該重置所有狀態', () => {
            const store = useDownloadStore();
            store.isDownloading = true;
            store.progressBarValue = '50%';

            store.reset();

            expect(store.isDownloading).toBe(false);
            expect(store.progressBarValue).toBe('0%');
        });
    });
});
