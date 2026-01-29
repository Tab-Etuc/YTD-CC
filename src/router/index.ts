/**
 * Vue Router 配置
 * 使用路由懶加載優化初始載入效能
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// 使用動態導入實現路由懶加載
// Home 頁面作為主要入口，不使用懶加載以確保最佳首屏載入
import Home from '@/components/views/Home.vue';

// 其他頁面使用懶加載
// TypeScript 會自動推斷類型，無需顯式指定
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const History = () => import('@/components/views/History.vue');
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const About = () => import('@/components/views/About.vue');
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Settings = () => import('@/components/views/Settings.vue');

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: 'YTD.CC - YouTube 下載器',
        },
    },
    {
        path: '/history',
        name: 'history',
        component: History,
        meta: {
            title: '下載歷史 - YTD.CC',
        },
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: {
            title: '關於 - YTD.CC',
        },
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: {
            title: '設定 - YTD.CC',
        },
    },
    // 404 重定向到首頁
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    // 滾動行為設定
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    },
});

// 全域導航守衛 - 更新頁面標題
router.beforeEach((to, _from, next) => {
    const title = to.meta?.title;
    if (typeof title === 'string') {
        document.title = title;
    }
    next();
});

export default router;
