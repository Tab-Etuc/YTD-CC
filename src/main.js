import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import Notifications from '@kyvg/vue3-notification'

import App from './App.vue'

import './assets/tailwind.css'

import Home from './components/Home.vue'
const About = { template: '<div class="w-12 h-12 bg-white"/>' }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/history',
      component: About
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/settings',
      component: About
    }
  ]
})

const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = createApp(App)

app.use(Notifications).use(router).use(store)

app.mount('#app')
