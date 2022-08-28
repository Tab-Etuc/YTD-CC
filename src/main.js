import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from './store';
import Notifications from '@kyvg/vue3-notification';

import App from './App.vue';

import './assets/tailwind.css';

import Home from './components/views/Home.vue';
import About from './components/views/About.vue';
import Settings from './components/views/Settings.vue';
const temp = { template: '' };

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/history',
      component: temp,
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

const app = createApp(App).use(store);

app.use(Notifications).use(router);

app.mount('#app');
