import { createRouter, createWebHistory } from 'vue-router';

// 自訂的分頁元件
import Home from '../components/views/Home.vue';
import history from '../components/views/history.vue';
import About from '../components/views/About.vue';
import Settings from '../components/views/Settings.vue';

// 本文件需要匯出給Entry:main.js使用
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/history',
      component: history,
    },
    {
      path: '/about',
      component: About,
    },
    {
      path: '/settings',
      component: Settings,
    },
  ],
});
