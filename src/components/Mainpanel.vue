<template>
  <div
    class="
    static  m-auto mt-10 grid bg-slate-800 rounded-xl shadow-2xl ring-1 ring-white/10 ring-inset overflow-hidden w-[45rem]"
  >
    <div class="md:flex place-content-center p-4">
      <div class="p-6">
        <p
          class="
            tracking-wide cursor-defaultmt-2 text-lg leading-tight font-mediu text-white text-center select-none"
        >
          貼上 Youtube 影片連結
        </p>
        <hr class="mt-3 w-full content-center h-2" />
        <div>
          <input
            v-model="url"
            class="
              mx-2 mt-4 placeholder-gray-500 w-[28rem] rounded-full px-3 pl-5 py-1 transition-all duration-700 ease-in-out focus:shadow-outline outline-indigo-400 hover:w-[30rem]
            "
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=..."
          />
          <button
            class="
              mx-2 mt-3 text-center bg-blue-500 hover:bg-blue-600 w-16 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 p-0.5
            "
            @click="btn"
          >
            確認
          </button>
        </div>
        <v-button class="bg-blue-500 hover:bg-blue-600 w-16 text-white rounded-lg" @click="dynamic">Open Dynamic Modal</v-button>
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
import downloader from '../common/downloader'

import { $vfm } from 'vue-final-modal'

export default {
  name: 'Mainpanel',

  data () {
    return {
      url: '',
      opt: ''
    }
  },

  inject: ['showNotify'],

  methods: {
    btn: async function () {
      if (this.url == '')
        return this.showNotify('foo-css', '請輸入連結！', 'error')

      if (!/^www\.youtube.com|be/.test(this.url) || !/v=|.be\//.test(this.url))
        return this.showNotify('foo-css', '連結無效！', 'error')
      downloader(this.url)
    },
    dynamic () {
      $vfm.show({
        component: 'VDynamicModal'
      })
    }
  },

  mounted () {
    window.showNotify = this.showNotify
  }
}
</script>
