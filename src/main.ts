/**
 * YTD-CC 應用程式進入點
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import Notifications, { notify } from '@kyvg/vue3-notification';
import App from './App.vue';
import { initGlobalErrorHandling, registerErrorHandler } from '@/services/errorHandler';
import './assets/tailwind.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Notifications);
app.use(router);

// 初始化錯誤處理
initGlobalErrorHandling(app);

registerErrorHandler((error) => {
    if (error.isUserFacing) {
        notify({
            type: 'error',
            title: '錯誤',
            text: error.getUserMessage(),
        });
    }
});

app.mount('#app');
