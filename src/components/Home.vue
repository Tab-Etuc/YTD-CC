<template>
  <div class="relative float-left w-[calc(100%-7rem)] h-screen ">
    <!-- 右側歷史紀錄 History -->
    <History />

    <!-- Main Download Panel -->
    <div
      class="
         mt-6 bg-slate-800 rounded-xl shadow-2xl ring-1 ring-white/10 ring-inset overflow-hidden w-[55rem] h-[33%]"
    >
      <div class="flex flex-wrap place-content-center justify-center h-full">
        <div class="p-6">
          <p
            class="
            tracking-wide cursor-defaultmt-2 text-xl leading-tight font-mediu text-white text-center select-none mb-5"
          >
            貼上 Youtube 影片連結
          </p>
          <hr class="mt-3 w-full content-center h-2" />
          <div>
            <input
              v-model="ytUrl"
              class="
              mx-2 mt-4 placeholder-gray-500 w-[28rem] rounded-full px-3 pl-5 py-1 transition-all duration-700 ease-in-out focus:shadow-outline outline-indigo-400 hover:w-[30rem]
            "
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=..."
            />
            <button
              class="
              mx-2 mt-3 text-center bg-blue-500 hover:bg-blue-600 w-16 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 p-0.5
            "
              @click="confirm"
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

    <!-- Banner  -->
    <div class="absolute w-[55rem] h-[55%] mt-3">
      <div class="absolute right-0 w-[18rem] h-full">
        <div
          class="absolute right-0 bottom-0 w-[18rem] h-[calc(100%-2rem)] rounded-b-xl bg-slate-900/60 transition transform duration-700 hover:backdrop-blur-sm"
        />
        <header
          class="absolute right-0 flex w-[18rem] h-[4rem] rounded-xl bg-blue-500"
        >
          <div class="flex w-[18rem] h-[2rem] my-auto">
            <!-- Bar chart icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              class="static fill-white ml-4 w-7 h-7 my-auto"
              viewBox="0 0 32 32"
              version="1.1"
            >
              <g id="surface1">
                <path
                  d="M 30 10 L 22 10 L 22 30 L 20 30 L 20 0 L 12 0 L 12 30 L 10 30 L 10 16 L 2 16 L 2 30 L 0 30 L 0 32 L 32 32 L 32 30 L 30 30 Z M 30 10 "
                />
              </g>
            </svg>
            <p
              class="static tracking-wide cursor-default ml-3 my-auto text-xl leading-tight font-mediu text-white select-none"
            >
              紀錄
            </p>
          </div>
        </header>
      </div>
      <img
        class="object-cover w-[55rem] h-full rounded-xl"
        :src="bannerImg"
        alt="banner"
      />
    </div>
  </div>
</template>

<script>
// Components
import History from './History.vue'

import downloader from '../common/downloader'
import bannerImg from '../assets/TDwZG1y.jpg'

export default {
  name: 'Home',
  components: {
    History
  },

  data () {
    return {
      ytUrl: '',
      opt: '',
      bannerImg: bannerImg
    }
  },

  inject: ['showNotify'],

  methods: {
    confirm: async function () {
      if (this.ytUrl == '')
        return this.showNotify('foo-css', '請輸入連結！', 'error')

      if (
        !/^www\.youtube.com|be/.test(this.ytUrl) ||
        !/v=|.be\//.test(this.ytUrl)
      )
        return this.showNotify('foo-css', '連結無效！', 'error')
      downloader(this.ytUrl)
    }
  },

  mounted () {
    window.showNotify = this.showNotify
  }
}
</script>
