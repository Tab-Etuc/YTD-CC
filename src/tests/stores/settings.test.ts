/**
 * Settings Store 測試
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from '@/stores/settings';

// Mock Tauri API
vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn(),
}));

// Mock 日誌服務
vi.mock('@/services/errorHandler', () => ({
    logger: {
        info: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
    handleError: vi.fn(),
    createBackendError: vi.fn((msg) => new Error(msg)),
}));

describe('useSettingsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    describe('初始狀態', () => {
        it('應該有正確的初始值', () => {
            const store = useSettingsStore();

            expect(store.windowControlOnTheLeft).toBe(false);
            expect(store.downloadOutputPath).toBe('');
            expect(store.saveHistory).toBe(true);
            expect(store.bannerImage).toBe('');
            expect(store.isLoaded).toBe(false);
            expect(store.isSaving).toBe(false);
        });
    });

    describe('設定方法', () => {
        it('setWindowControlsOnTheLeft 應該更新值', () => {
            const store = useSettingsStore();

            store.setWindowControlsOnTheLeft(true);

            expect(store.windowControlOnTheLeft).toBe(true);
        });

        it('setDownloadOutputPath 應該更新路徑', () => {
            const store = useSettingsStore();

            store.setDownloadOutputPath('/path/to/downloads');

            expect(store.downloadOutputPath).toBe('/path/to/downloads');
        });

        it('setSaveHistory 應該更新值', () => {
            const store = useSettingsStore();

            store.setSaveHistory(false);

            expect(store.saveHistory).toBe(false);
        });

        it('setBannerImage 應該更新路徑', () => {
            const store = useSettingsStore();

            store.setBannerImage('/path/to/banner.jpg');

            expect(store.bannerImage).toBe('/path/to/banner.jpg');
        });
    });

    describe('computed 屬性', () => {
        it('hasCustomBanner 應該正確計算', () => {
            const store = useSettingsStore();

            expect(store.hasCustomBanner).toBe(false);

            store.bannerImage = '/path/to/banner.jpg';
            expect(store.hasCustomBanner).toBe(true);
        });

        it('hasDownloadPath 應該正確計算', () => {
            const store = useSettingsStore();

            expect(store.hasDownloadPath).toBe(false);

            store.downloadOutputPath = '/path/to/downloads';
            expect(store.hasDownloadPath).toBe(true);
        });

        it('settings 應該回傳完整設定物件', () => {
            const store = useSettingsStore();
            store.windowControlOnTheLeft = true;
            store.downloadOutputPath = '/downloads';
            store.saveHistory = false;
            store.bannerImage = '/banner.jpg';

            expect(store.settings).toEqual({
                WINDOW_CONTROLS_ON_THE_LEFT: true,
                DOWNLOAD_OUTPUT_PATH: '/downloads',
                SAVE_HISTORY: false,
                BANNER_IMAGE: '/banner.jpg',
            });
        });
    });

    describe('fetchSettings', () => {
        it('成功時應該更新狀態', async () => {
            const { invoke } = await import('@tauri-apps/api/core');
            vi.mocked(invoke).mockResolvedValue({
                WINDOW_CONTROLS_ON_THE_LEFT: true,
                DOWNLOAD_OUTPUT_PATH: '/test/path',
                SAVE_HISTORY: false,
                BANNER_IMAGE: '/test/banner.jpg',
            });

            const store = useSettingsStore();
            await store.fetchSettings();

            expect(store.windowControlOnTheLeft).toBe(true);
            expect(store.downloadOutputPath).toBe('/test/path');
            expect(store.saveHistory).toBe(false);
            expect(store.bannerImage).toBe('/test/banner.jpg');
            expect(store.isLoaded).toBe(true);
        });
    });

    describe('resetToDefaults', () => {
        it('應該重置所有設定為預設值', async () => {
            const { invoke } = await import('@tauri-apps/api/core');
            vi.mocked(invoke).mockResolvedValue(undefined);

            const store = useSettingsStore();
            store.windowControlOnTheLeft = true;
            store.downloadOutputPath = '/custom/path';
            store.saveHistory = false;
            store.bannerImage = '/custom/banner.jpg';

            await store.resetToDefaults();

            expect(store.windowControlOnTheLeft).toBe(false);
            expect(store.downloadOutputPath).toBe('');
            expect(store.saveHistory).toBe(true);
            expect(store.bannerImage).toBe('');
        });
    });
});
