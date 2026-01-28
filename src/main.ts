/**
 * YTD-CC 應用程式進入點
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import Notifications from '@kyvg/vue3-notification';
import App from './App.vue';
import './assets/tailwind.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Notifications);
app.use(router);

app.mount('#app');
