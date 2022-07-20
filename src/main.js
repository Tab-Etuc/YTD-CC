import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Notifications from "@kyvg/vue3-notification";

import App from "./App.vue";

import "./assets/tailwind.css";

import Home from "./components/Home.vue";
const About = { template: "" };

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/history",
      component: About,
    },
    {
      path: "/about",
      component: About,
    },
    {
      path: "/settings",
      component: About,
    },
  ],
});

const app = createApp(App);

app.use(Notifications).use(router);

app.mount("#app");
