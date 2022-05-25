<template>
  <div id="app">
    <div
      data-tauri-drag-region
      class="
        fixed
        bg-slate-900
        w-screen
        h-8
        top-0
        flex
        items-center
        justify-items-center justify-between
        box-border
        px-3
      "
    >
      <div
        class="w-1/2 h-8 flex justify-between items-center"
        @mousedown="drag"
      >
        <img
          src="./assets/YTD.CC.png"
          id="appicon"
          alt=""
          srcset=""
          class="h-8"
        />
        <p
          class="
            text-indigo-400
            inset-y-0
            right-0
            cursor-default
            font-semibold
            select-none
          "
        >
          YTD.CC
        </p>
      </div>

      <!-- window controls wrapper -->
      <div class="w-28 h-8 flex">
        <!-- winmin -->
        <svg @click="winmin" class="ml-1 cursor-pointer">
          <!-- circle-outline -->
          <circle class="fill-current text-amber-500" cx="15" cy="15" r="10" />

          <!-- circle-inline -->
          <circle class="fill-current text-slate-900" cx="15" cy="15" r="8" />
        </svg>

        <!-- winmax -->
        <svg @click="winmax" class="cursor-pointer ml-1">
          <!-- circle-outline -->
          <circle class="fill-current text-green-500" cx="15" cy="15" r="10" />

          <!-- circle-inline -->
          <circle class="fill-current text-slate-900" cx="15" cy="15" r="8" />
        </svg>

        <!-- quit -->
        <svg @click="quit" class="cursor-pointer ml-1">
          <!-- circle-outline -->
          <circle class="fill-current text-rose-600" cx="15" cy="15" r="10" />

          <!-- circle-inline -->
          <circle class="fill-current text-slate-900" cx="15" cy="15" r="8" />
        </svg>
      </div>
    </div>

    <!-- notification -->
    <notifications
      group="foo-css"
      position="bottom right"
      type="success"
      :speed="500"
    />

    <!-- Main panel -->
    <Mainpanel />
  </div>
</template>

<script>
// Components
import Mainpanel from "./components/Mainpanel.vue";

import { appWindow } from "@tauri-apps/api/window";

appWindow.setDecorations(false);

export default {
  name: "App",
  components: {
    Mainpanel,
  },

  data() {
    return {
      id: 1,
    };
  },

  provide() {
    return {
      showNotify: this.showNotify,
    };
  },

  methods: {
    winmin() {
      appWindow.minimize();
    },

    winmax() {
      appWindow.toggleMaximize();
    },

    quit() {
      appWindow.close();
    },

    drag() {
      appWindow.startDragging();
    },

    showNotify(group, msg, type = "") {
      const text = `
        ${msg}
        <br>
        Date: ${new Date()}
      `;
      this.$notify({
        group,
        title: `${type} #${this.id++}`,
        text,
        type,
      });
    },
  },
};
</script>

<style>
body {
  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #4b1248, #f0c27b);
  overflow: hidden;
}
</style>
