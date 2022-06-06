<template>
  <div
    class="w-screen h-screen overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/10 ring-inset"
  >
    <div @mousedown="drag" class="sticky h-[1.1rem] w-screen  ">
      <!-- window controls wrapper -->
      <div
        class="static top-0 left-0 w-28 h-8 flex rounded-xl mb-3 bg-slate-700"
      >
        <!-- Window minimize -->
        <svg
          @click="winmin"
          class="cursor-pointer my-auto  mx-auto w-6 h-6 fill-slate-200 hover:fill-slate-50"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="surface1">
            <path
              d="M 8.625 3.101562 C 8.539062 3.164062 8.433594 3.285156 8.386719 3.375 C 8.300781 3.523438 8.296875 3.6875 8.296875 5.914062 L 8.296875 8.296875 L 5.953125 8.296875 C 3.390625 8.296875 3.429688 8.292969 3.164062 8.574219 C 3.046875 8.699219 3.023438 8.765625 3.007812 9.023438 C 2.984375 9.390625 3.097656 9.609375 3.378906 9.75 C 3.554688 9.839844 3.664062 9.84375 6.398438 9.84375 C 9.132812 9.84375 9.242188 9.839844 9.417969 9.75 C 9.519531 9.699219 9.652344 9.582031 9.707031 9.484375 L 9.820312 9.304688 L 9.820312 6.421875 C 9.820312 3.601562 9.820312 3.535156 9.722656 3.375 C 9.570312 3.117188 9.359375 3 9.046875 3 C 8.84375 3 8.742188 3.027344 8.625 3.101562 Z M 8.625 3.101562 "
            />
            <path
              d="M 14.53125 3.109375 C 14.441406 3.164062 14.328125 3.285156 14.277344 3.375 C 14.179688 3.535156 14.179688 3.601562 14.179688 6.421875 L 14.179688 9.304688 L 14.292969 9.484375 C 14.347656 9.582031 14.480469 9.699219 14.582031 9.75 C 14.757812 9.839844 14.867188 9.84375 17.609375 9.84375 L 20.460938 9.84375 L 20.644531 9.734375 C 20.90625 9.585938 21.007812 9.375 20.992188 9.015625 C 20.976562 8.765625 20.949219 8.695312 20.835938 8.574219 C 20.570312 8.292969 20.609375 8.296875 18.046875 8.296875 L 15.703125 8.296875 L 15.703125 5.914062 C 15.703125 3.265625 15.707031 3.328125 15.378906 3.109375 C 15.160156 2.957031 14.746094 2.957031 14.53125 3.109375 Z M 14.53125 3.109375 "
            />
            <path
              d="M 3.367188 14.25 C 3.09375 14.394531 2.984375 14.617188 3.007812 14.976562 C 3.023438 15.234375 3.046875 15.300781 3.164062 15.425781 C 3.429688 15.707031 3.390625 15.703125 5.953125 15.703125 L 8.296875 15.703125 L 8.296875 18.078125 C 8.296875 20.253906 8.304688 20.476562 8.382812 20.625 C 8.503906 20.875 8.726562 21 9.046875 21 C 9.359375 21 9.570312 20.882812 9.722656 20.625 C 9.820312 20.464844 9.820312 20.398438 9.820312 17.574219 L 9.820312 14.691406 L 9.695312 14.5 C 9.460938 14.140625 9.59375 14.15625 6.390625 14.15625 C 3.664062 14.160156 3.53125 14.164062 3.367188 14.25 Z M 3.367188 14.25 "
            />
            <path
              d="M 14.585938 14.234375 C 14.390625 14.328125 14.265625 14.492188 14.203125 14.722656 C 14.171875 14.839844 14.15625 15.875 14.164062 17.679688 C 14.179688 20.390625 14.183594 20.464844 14.277344 20.625 C 14.429688 20.882812 14.640625 21 14.953125 21 C 15.273438 21 15.496094 20.875 15.617188 20.625 C 15.695312 20.476562 15.703125 20.253906 15.703125 18.078125 L 15.703125 15.703125 L 18.046875 15.703125 C 20.609375 15.703125 20.570312 15.707031 20.835938 15.425781 C 20.953125 15.300781 20.976562 15.234375 20.992188 14.976562 C 21.015625 14.609375 20.902344 14.390625 20.621094 14.25 C 20.445312 14.160156 20.335938 14.15625 17.59375 14.15625 C 15.0625 14.15625 14.722656 14.164062 14.585938 14.234375 Z M 14.585938 14.234375 "
            />
          </g>
        </svg>

        <!-- Window maximize -->
        <svg
          @click="winmax"
          class="cursor-pointer my-auto mx-auto w-6 h-6 stroke-slate-200 hover:stroke-slate-50"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <path
            d="M7 4H4V7"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 4H20V7"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7 20H4V17"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 20H20V17"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- Window close -->
        <svg
          @click="quit"
          class="cursor-pointer my-auto mx-auto w-6 h-6  fill-slate-200 hover:fill-slate-50"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
          />
        </svg>
      </div>
    </div>
    <div class="static float-left h-screen w-28 ">
      <Sidebar />
    </div>

    <div class="static float-left w-[calc(100%-7rem)] h-[93%] ">
      <router-view></router-view>
    </div>

    <!-- Notification -->
    <notifications
      group="foo-css"
      position="bottom right"
      type="success"
      :speed="500"
    />
  </div>
</template>

<script>
// Components
import Sidebar from './components/Sidebar.vue'


import { appWindow } from '@tauri-apps/api/window'

export default {
  name: 'App',
  components: {
    Sidebar
  },

  data () {
    return {
      id: 1
    }
  },

  provide () {
    return {
      showNotify: this.showNotify
    }
  },

  async mounted () {
    appWindow.setDecorations(false)
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

    drag () {
      appWindow.startDragging()
    },

    showNotify (group, msg, type = '') {
      const text = `
        ${msg}
        <br>
        Date: ${new Date()}
      `
      this.$notify({
        group,
        title: `${type} #${this.id++}`,
        text,
        type
      })
    }
  }
}
</script>
