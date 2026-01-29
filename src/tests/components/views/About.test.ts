/**
 * About 頁面元件測試
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import About from '@/components/views/About.vue';

// Mock Tauri APIs
const mockOpen = vi.fn();
vi.mock('@tauri-apps/plugin-shell', () => ({
    open: (...args: unknown[]) => mockOpen(...args),
}));

describe('About', () => {
    let wrapper: VueWrapper;

    beforeEach(() => {
        mockOpen.mockClear();
        wrapper = mount(About);
    });

    describe('渲染', () => {
        it('應該正確渲染', () => {
            expect(wrapper.exists()).toBe(true);
        });

        it('應該顯示關於標題', () => {
            expect(wrapper.text()).toContain('關於');
        });

        it('應該顯示開發者資訊', () => {
            expect(wrapper.text()).toContain('開發者');
            expect(wrapper.text()).toContain('Tab Etuc');
        });

        it('應該顯示圖源資訊', () => {
            expect(wrapper.text()).toContain('圖源');
        });

        it('應該顯示應用程式版本', () => {
            // Mock version is set in setup.ts
            expect(wrapper.text()).toMatch(/YTD\.CC 版本:/);
        });
    });

    describe('Logo 和圖標', () => {
        it('應該顯示 YTD.CC logo', () => {
            const logo = wrapper.find('img[src*="YTD.CC"]');
            expect(logo.exists()).toBe(true);
        });

        it('應該顯示技術棧 logo', () => {
            const images = wrapper.findAll('img');
            expect(images.length).toBeGreaterThan(1);
        });
    });

    describe('按鈕', () => {
        it('應該有檢查更新按鈕', () => {
            expect(wrapper.text()).toContain('檢查更新');
        });

        it('應該有回報問題按鈕', () => {
            expect(wrapper.text()).toContain('回報問題');
        });

        it('應該有 Github 專案按鈕', () => {
            expect(wrapper.text()).toContain('Github 專案');
        });
    });

    describe('外部連結', () => {
        it('點擊回報問題按鈕應該開啟 GitHub issues 頁面', async () => {
            const buttons = wrapper.findAll('button');
            const reportButton = buttons.find((b) => b.text().includes('回報問題'));

            if (reportButton) {
                await reportButton.trigger('click');
                expect(mockOpen).toHaveBeenCalledWith(
                    'https://github.com/Tab-Etuc/YTD-CC/issues/new'
                );
            }
        });

        it('點擊 Github 專案按鈕應該開啟 GitHub 頁面', async () => {
            const buttons = wrapper.findAll('button');
            const githubButton = buttons.find((b) => b.text().includes('Github 專案'));

            if (githubButton) {
                await githubButton.trigger('click');
                expect(mockOpen).toHaveBeenCalledWith('https://github.com/Tab-Etuc/YTD-CC');
            }
        });

        it('點擊開發者 Github 連結應該開啟頁面', async () => {
            const link = wrapper.find('a.cursor-pointer.text-teal-400');
            if (link.exists()) {
                await link.trigger('click');
                expect(mockOpen).toHaveBeenCalledWith('https://github.com/Tab-Etuc');
            }
        });
    });
});
