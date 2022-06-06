import Vue from 'vue'
import VueRouter from 'vue-router'
// 以上是官方的元件

import Home from '../components/Mainpanel.vue';
// 自訂的分頁元件

Vue.use(VueRouter);
// 啟用

// 本文件需要匯出給Entry:main.js使用
export default new VueRouter({
    // 開始定義路徑，後面接物件陣列
    routes: [{
        name: '首頁', // 元件接下來會呈現的名稱
        path: '/', // 對應的虛擬路徑
        component: Home // 對應的元件，本文件上面自訂的分頁元件名稱
    }, ],
});