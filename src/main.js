import { createApp } from 'vue'
import Notifications from '@kyvg/vue3-notification'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

import './assets/tailwind.css'

import Home from './components/Home.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    }
  ]
})
const app = createApp(App)
app
  .use(Notifications)
  .use(VueSidebarMenu)
  .use(router)

app.mount('#app')
