/**
 * SideHistory 元件測試
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SideHistory from '@/components/SideHistory.vue';
import { useAppStore } from '@/stores/app';
import type { HistoryItem } from '@/types';

const mockHistoryItems: HistoryItem[] = [
    {
        VIDEO_NAME: '測試影片 1',
        FILE_FORMAT: 'MP4',
        VIDEO_DURATION: '10:30',
        BANNER_IMAGE: 'https://example.com/thumb1.jpg',
        DOWNLOAD_TIME: Date.now() - 1000,
        VIDEO_QUALITY: '1080p',
    },
    {
        VIDEO_NAME: '測試影片 2',
        FILE_FORMAT: 'MP3',
        VIDEO_DURATION: '03:45',
        BANNER_IMAGE: 'https://example.com/thumb2.jpg',
        DOWNLOAD_TIME: Date.now() - 2000,
        AUDIO_QUALITY: '320kbps',
    },
    {
        VIDEO_NAME: '測試影片 3 - 這是一個很長的標題用來測試truncate功能是否正常運作',
        FILE_FORMAT: 'MP4',
        VIDEO_DURATION: '25:00',
        BANNER_IMAGE: 'https://example.com/thumb3.jpg',
        DOWNLOAD_TIME: Date.now() - 3000,
        VIDEO_QUALITY: '720p',
    },
];

describe('SideHistory', () => {
    let wrapper: VueWrapper;
    let store: ReturnType<typeof useAppStore>;

    beforeEach(() => {
        // Setup Pinia
        setActivePinia(createPinia());
        store = useAppStore();

        // Mock fetchHistoryList
        vi.spyOn(store, 'fetchHistoryList').mockResolvedValue();
    });

    describe('無歷史記錄', () => {
        beforeEach(() => {
            store.historyList = null;
            wrapper = mount(SideHistory);
        });

        it('應該正確渲染', () => {
            expect(wrapper.exists()).toBe(true);
        });

        it('應該顯示標題', () => {
            expect(wrapper.text()).toContain('歷程記錄');
        });

        it('應該顯示空狀態訊息', () => {
            expect(wrapper.text()).toContain('空無一物');
        });

        it('不應該渲染任何歷史項目', () => {
            const items = wrapper.findAll('ul');
            expect(items.length).toBe(0);
        });
    });

    describe('有歷史記錄', () => {
        beforeEach(() => {
            store.historyList = mockHistoryItems;
            wrapper = mount(SideHistory);
        });

        it('應該渲染所有歷史項目', () => {
            const items = wrapper.findAll('ul');
            expect(items.length).toBe(mockHistoryItems.length);
        });

        it('應該顯示影片名稱', () => {
            expect(wrapper.text()).toContain('測試影片 1');
            expect(wrapper.text()).toContain('測試影片 2');
        });

        it('應該顯示影片時長', () => {
            expect(wrapper.text()).toContain('10:30');
            expect(wrapper.text()).toContain('03:45');
        });

        it('應該顯示檔案格式', () => {
            expect(wrapper.text()).toContain('MP4');
            expect(wrapper.text()).toContain('MP3');
        });

        it('每個項目應該有縮圖', () => {
            const images = wrapper.findAll('img');
            expect(images.length).toBe(mockHistoryItems.length);
        });

        it('縮圖應該使用 lazy loading', () => {
            const images = wrapper.findAll('img');
            images.forEach((img) => {
                expect(img.attributes('loading')).toBe('lazy');
            });
        });

        it('不應該顯示空狀態訊息', () => {
            expect(wrapper.text()).not.toContain('空無一物');
        });
    });

    describe('Lifecycle', () => {
        it('掛載時應該呼叫 fetchHistoryList', () => {
            wrapper = mount(SideHistory);
            expect(store.fetchHistoryList).toHaveBeenCalled();
        });
    });

    describe('樣式', () => {
        beforeEach(() => {
            store.historyList = mockHistoryItems;
            wrapper = mount(SideHistory);
        });

        it('奇數項目應該有 bg-slate-800', () => {
            const items = wrapper.findAll('ul');
            if (items.length > 0) {
                expect(items[0]!.classes()).toContain('odd:bg-slate-800');
            }
        });

        it('偶數項目應該有 bg-slate-700', () => {
            const items = wrapper.findAll('ul');
            if (items.length > 0) {
                expect(items[0]!.classes()).toContain('even:bg-slate-700');
            }
        });
    });
});
