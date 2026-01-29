/**
 * Sidebar 元件測試
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Sidebar from '@/components/Sidebar.vue';

// 自定義 router-link stub 用於測試
const RouterLinkStub = {
    template: '<a :data-to="to" class="my-2 flex h-12 w-12 cursor-pointer rounded-xl"><slot /></a>',
    props: ['to'],
};

describe('Sidebar', () => {
    it('應該正確渲染', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    'router-link': RouterLinkStub,
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });

    it('應該包含所有導航連結', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    'router-link': RouterLinkStub,
                },
            },
        });

        // 使用 data-to 屬性來找到所有導航連結
        const links = wrapper.findAll('a[data-to]');
        expect(links.length).toBe(4); // Home, History, About, Settings
    });

    it('應該有正確的路由路徑', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    'router-link': RouterLinkStub,
                },
            },
        });
        const links = wrapper.findAll('a[data-to]');

        const expectedRoutes = ['/', '/history', '/about', '/settings'];
        links.forEach((link, index) => {
            expect(link.attributes('data-to')).toBe(expectedRoutes[index]);
        });
    });

    it('應該顯示 YTD.CC 圖標', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    'router-link': RouterLinkStub,
                },
            },
        });
        const logo = wrapper.find('img[alt="YTD.CC Icon"]');
        expect(logo.exists()).toBe(true);
    });

    it('每個導航連結應該包含 SVG 圖標', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    'router-link': RouterLinkStub,
                },
            },
        });
        const links = wrapper.findAll('a[data-to]');

        links.forEach((link) => {
            const svg = link.find('svg');
            expect(svg.exists()).toBe(true);
        });
    });

    it('導航連結應該有正確的 CSS class', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    'router-link': RouterLinkStub,
                },
            },
        });
        const links = wrapper.findAll('a[data-to]');

        links.forEach((link) => {
            expect(link.classes()).toContain('cursor-pointer');
            expect(link.classes()).toContain('rounded-xl');
        });
    });
});

