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
        justify-items-center
        justify-between
        box-border
        px-3"
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
             cursor-default font-semibold select-none"
        >
          YTD.CC
        </p>
      </div>

      <div class="w-28 h-8 flex">
        <svg @click="winmin" class="ml-1 cursor-pointer">
          <!-- circle-outline -->
          <circle
            class="
            fill-current
          text-amber-500"
            cx="15"
            cy="15"
            r="10"
          />

          <!-- circle-inline -->
          <circle
            class="
           fill-current
         text-slate-900"
            cx="15"
            cy="15"
            r="8"
          />
        </svg>

        <svg @click="winmax" class="cursor-pointer  ml-1">
          <!-- circle-outline -->
          <circle
            class="
          fill-current 
        text-green-500"
            cx="15"
            cy="15"
            r="10"
          />

          <!-- circle-inline -->
          <circle
            class="
          fill-current 
        text-slate-900"
            cx="15"
            cy="15"
            r="8"
          />
        </svg>

        <svg @click="quit" class="cursor-pointer  ml-1">
          <!-- circle-outline -->
          <circle
            class="
          fill-current 
        text-rose-600"
            cx="15"
            cy="15"
            r="10"
          />

          <!-- circle-inline -->
          <circle
            class="
          fill-current 
        text-slate-900"
            cx="15"
            cy="15"
            r="8"
          />
        </svg>
      </div>
    </div>
    <!-- <button
      class="mx-24 mt-28 text-center bg-indigo-400 hover:bg-indigo-600 w-16 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 p-0.5 "
      @click="show('foo-css', 'success')"
    >
      <i class="icon ion-information-circled" />
      SUCCESS
    </button> -->
    <notifications group="foo-css" position="bottom center" :speed="500" />
    <!-- Main panel -->
    <Mainpanel />

    <div
      class="shadow-[-1px_-1px_3px_rgba(255,255,255,0.4)] 
      shadow-[2px_2px_6px_rgba(0,0,0,0.8)]
      shadow-[inset_-2px_-2px_10px_rgba(255,255,255,0.1)]
      shadow-[inset_2px_2px_10px_rgba(0,0,0,0.8)]
      opacity-75 fixed bottom-0 w-screen h-20 bg-slate-900 rounded-t-lg"
    ></div>
  </div>
</template>

<script>
// Components
import Mainpanel from './components/Main.vue'

import { appWindow } from '@tauri-apps/api/window'

appWindow.setDecorations(false)
export default {
  name: 'App',
  components: {
    Mainpanel
  },
  data () {
    return {
      winMaximized: false,
      id: 1
    }
  },
  methods: {
    winmin () {
      appWindow.minimize()
    },
    winmax () {
      appWindow.toggleMaximize()
    },
    quit () {
      appWindow.close()
    },
    show (group, type = '') {
      const text = `
        This is notification text!
        <br>
        Date: ${new Date()}
      `
      this.$notify({
        group,
        title: `Test ${type} notification #${this.id++}`,
        text,
        type,
        data: {
          randomNumber: Math.random()
        }
      })
    },
    drag () {
      appWindow.startDragging()
    }
  }
}
</script>

<style>
body {
  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #4b1248, #f0c27b);
  overflow: hidden;
}
</style>
