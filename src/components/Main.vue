<template>
  <div
    class=" mt-16 place-items-center  my-auto max-w-md mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden md:max-w-3xl"
  >
    <div class="md:flex  place-content-center p-4">
      <div class="p-8">
        <p
          class="tracking-wide cursor-default  mt-2 text-lg leading-tight font-medium text-white text-center select-none"
        >
          貼上 Youtube 影片連結
        </p>
        <hr class="mt-3" size="8px" align="center" width="100%" />
        <div>
          <input
            v-model="yturl"
            class="ml-2 mt-4 placeholder-gray-500  w-60 rounded-full px-3 pl-5 py-1  transition-all duration-700 ease-in-out focus:shadow-outline outline-indigo-400 hover:w-64"
            placeholder="https://www.youtube.com/..."
          />
          <button
            class="mx-2 mt-3 text-center bg-indigo-400 hover:bg-indigo-600 w-16 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 p-0.5 "
            @click="btn"
          >
            確認
          </button>
        </div>
        <!-- <select
            class="mx-2 bg-indigo-400 text-white rounded-lg w-16 p-1 "
            v-model="opt"
          >
            <option value="mp3">MP3</option>
            <option value="mp4">MP4</option>
          </select> -->
      </div>
    </div>
  </div>
</template>

<script>
import { invoke } from '@tauri-apps/api/tauri'

export default {
  name: 'Main',

  data () {
    return {
      yturl: '',
      opt: ''
    }
  },

  methods: {
    btn: function () {
      // With the Tauri global script, enabled when `tauri.conf.json > build > withGlobalTauri` is set to true:
      const invoke = window.__TAURI__.invoke
      // Invoke the command
      invoke('ytdl', { yturl: this.yturl })
        .then(message => console.log(message))
        .catch(error => console.error(error))
    }
  }
}
</script>
