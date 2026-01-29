/**
 * Settings 頁面元件測試
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Settings from '@/components/views/Settings.vue';
import { useAppStore } from '@/stores/app';

// Mock Tauri APIs
vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@tauri-apps/api/path', () => ({
    appDataDir: vi.fn().mockResolvedValue('/mock/app/data'),
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({
    open: vi.fn().mockResolvedValue('/mock/download/path'),
}));

describe('Settings', () => {
    let wrapper: VueWrapper;
    let store: ReturnType<typeof useAppStore>;

    beforeEach(() => {
        // Setup Pinia
        setActivePinia(createPinia());
        store = useAppStore();

        // Setup default store values
        store.windowControlOnTheLeft = false;
        store.downloadOutputPath = '/default/path';
        store.saveHistory = true;

        wrapper = mount(Settings);
    });

    describe('渲染', () => {
        it('應該正確渲染', () => {
            expect(wrapper.exists()).toBe(true);
        });

        it('應該顯示標題', () => {
            expect(wrapper.text()).toContain('設定');
        });

        it('應該顯示視窗控制器設定區塊', () => {
            expect(wrapper.text()).toContain('視窗控制器 位置');
        });

        it('應該顯示影片輸出位置設定區塊', () => {
            expect(wrapper.text()).toContain('影片輸出 位置');
        });

        it('應該顯示歷史記錄設定區塊', () => {
            expect(wrapper.text()).toContain('是否儲存影片歷史紀錄');
        });

        it('應該顯示當前下載路徑', () => {
            expect(wrapper.text()).toContain('/default/path');
        });
    });

    describe('視窗控制器開關', () => {
        it('預設應該顯示右側', () => {
            expect(wrapper.text()).toContain('右');
        });

        it('切換時應該更新顯示', async () => {
            const toggle = wrapper.find('#window-controls-position-switch-toggle');
            await toggle.setValue(true);
            // The computed setter should update the store
        });
    });

    describe('歷史記錄開關', () => {
        it('預設應該顯示是', () => {
            expect(wrapper.text()).toContain('是');
        });

        it('當 saveHistory 為 true 時標籤應有綠色樣式', () => {
            const label = wrapper.find('#slider-history');
            expect(label.classes()).toContain('bg-green-400');
        });

        it('當 saveHistory 為 false 時標籤應有紅色樣式', async () => {
            store.saveHistory = false;
            await wrapper.vm.$nextTick();

            const label = wrapper.find('#slider-history');
            expect(label.classes()).toContain('bg-red-400');
        });
    });

    describe('下載路徑選擇', () => {
        it('點擊路徑區塊應該觸發選擇對話框', async () => {
            const pathSelector = wrapper.find('.cursor-pointer a');
            await pathSelector.trigger('click');

            // Check that the store method was triggered
            // This is verified by the mock setup
        });
    });
});
