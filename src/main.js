import { createApp } from 'vue';

import store from './store';
import router from './router';
import Notifications from '@kyvg/vue3-notification';

import App from './App.vue';

import './assets/tailwind.css';

const app = createApp(App);

app.use(store).use(Notifications).use(router);

app.mount('#app');
