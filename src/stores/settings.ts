/**
 * 應用程式設定 Store
 * 管理使用者偏好設定
 */

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { invoke } from '@tauri-apps/api/core';
import type { AppSettings } from '@/types';
import { logger, handleError, createBackendError } from '@/services/errorHandler';

export const useSettingsStore = defineStore('settings', () => {
    // ============================================================================
    // State
    // ============================================================================

    /** 視窗控制器是否在左側 */
    const windowControlOnTheLeft = ref(false);

    /** 下載輸出路徑 */
    const downloadOutputPath = ref('');

    /** 是否儲存歷史記錄 */
    const saveHistory = ref(true);

    /** 橫幅圖片路徑 */
    const bannerImage = ref('');

    /** 是否已載入設定 */
    const isLoaded = ref(false);

    /** 是否正在儲存 */
    const isSaving = ref(false);

    // ============================================================================
    // Getters
    // ============================================================================

    /** 是否有自訂橫幅 */
    const hasCustomBanner = computed(() => bannerImage.value !== '');

    /** 是否有設定下載路徑 */
    const hasDownloadPath = computed(() => downloadOutputPath.value !== '');

    /** 取得完整設定物件 */
    const settings = computed<AppSettings>(() => ({
        WINDOW_CONTROLS_ON_THE_LEFT: windowControlOnTheLeft.value,
        DOWNLOAD_OUTPUT_PATH: downloadOutputPath.value,
        SAVE_HISTORY: saveHistory.value,
        BANNER_IMAGE: bannerImage.value,
    }));

    // ============================================================================
    // Actions
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

            windowControlOnTheLeft.value = data.WINDOW_CONTROLS_ON_THE_LEFT;
            downloadOutputPath.value = data.DOWNLOAD_OUTPUT_PATH;
            saveHistory.value = data.SAVE_HISTORY;
            bannerImage.value = data.BANNER_IMAGE || '';
            isLoaded.value = true;

            logger.info('Settings loaded successfully', { path: data.DOWNLOAD_OUTPUT_PATH });
        } catch (error) {
            await handleError(
                createBackendError('無法載入設定', {
                    error: error instanceof Error ? error.message : String(error),
                })
            );
        }
    }

    /** 儲存設定到後端 */
    async function saveSettings(): Promise<boolean> {
        isSaving.value = true;

        try {
            await invoke('save_settings', { settings: settings.value });
            logger.info('Settings saved successfully');
            return true;
        } catch (error) {
            await handleError(
                createBackendError('無法儲存設定', {
                    error: error instanceof Error ? error.message : String(error),
                })
            );
            return false;
        } finally {
            isSaving.value = false;
        }
    }

    /** 更新單一設定並儲存 */
    async function updateSetting<K extends keyof AppSettings>(
        key: K,
        value: AppSettings[K]
    ): Promise<boolean> {
        switch (key) {
            case 'WINDOW_CONTROLS_ON_THE_LEFT':
                windowControlOnTheLeft.value = value as boolean;
                break;
            case 'DOWNLOAD_OUTPUT_PATH':
                downloadOutputPath.value = value as string;
                break;
            case 'SAVE_HISTORY':
                saveHistory.value = value as boolean;
                break;
            case 'BANNER_IMAGE':
                bannerImage.value = value as string;
                break;
        }

        return await saveSettings();
    }

    /** 重置所有設定為預設值 */
    async function resetToDefaults(): Promise<boolean> {
        windowControlOnTheLeft.value = false;
        downloadOutputPath.value = '';
        saveHistory.value = true;
        bannerImage.value = '';

        return await saveSettings();
    }

    return {
        // State
        windowControlOnTheLeft,
        downloadOutputPath,
        saveHistory,
        bannerImage,
        isLoaded,
        isSaving,

        // Getters
        hasCustomBanner,
        hasDownloadPath,
        settings,

        // Actions
        setWindowControlsOnTheLeft,
        setDownloadOutputPath,
        setSaveHistory,
        setBannerImage,
        fetchSettings,
        saveSettings,
        updateSetting,
        resetToDefaults,
    };
});
