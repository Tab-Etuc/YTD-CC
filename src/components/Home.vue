<template>
  <div class="relative float-left w-[calc(100%-7rem)] h-[90%] ">
    <!-- History -->
    <History />

    <!-- Banner  -->
    <div class="absolute bottom-0 mt-3 w-[54rem] h-[60%]">
      <div class="absolute right-0 w-[18rem] h-[24rem]">
        <div
          class="absolute right-0 bottom-0 w-[18rem] h-[calc(100%-2rem)] rounded-b-xl bg-slate-900/75 "
        />
        <header class="absolute flex w-[18rem] h-[4rem] rounded-xl bg-blue-500">
          <div class="flex w-[18rem] h-[2rem] my-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              class="static fill-slate-200 ml-2"
              width="32px"
              height="32px"
              viewBox="0 0 32 32"
              version="1.1"
            >
              <g id="surface1">
                <path
                  d="M 16.90625 2.320312 C 11.492188 2.875 6.957031 6.523438 5.230469 11.695312 C 4.84375 12.851562 4.5625 14.457031 4.5625 15.511719 L 4.5625 16 L -0.03125 16 L 2.976562 19.011719 C 4.632812 20.675781 6 22.074219 6.019531 22.125 C 6.042969 22.1875 7 21.269531 9.125 19.125 L 12.195312 16.03125 L 9.925781 16.011719 L 7.648438 16 L 7.667969 15.574219 C 7.863281 11.320312 10.539062 7.613281 14.554688 6.054688 C 15.71875 5.605469 16.84375 5.414062 18.28125 5.40625 C 19.414062 5.40625 19.863281 5.457031 20.84375 5.695312 C 23.832031 6.417969 26.414062 8.511719 27.835938 11.355469 C 28.90625 13.5 29.1875 16.175781 28.585938 18.5625 C 28.105469 20.488281 27.113281 22.207031 25.679688 23.601562 C 24.039062 25.1875 22.238281 26.085938 19.875 26.511719 C 19.269531 26.617188 17.3125 26.617188 16.6875 26.507812 C 14.601562 26.144531 12.820312 25.304688 11.289062 23.96875 L 10.738281 23.480469 L 8.539062 25.679688 L 8.6875 25.851562 C 8.992188 26.175781 10.042969 27.019531 10.679688 27.445312 C 11.476562 27.980469 12.949219 28.71875 13.757812 28.988281 C 14.585938 29.261719 15.46875 29.476562 16.3125 29.605469 C 17.300781 29.757812 19.261719 29.757812 20.25 29.605469 C 23.292969 29.136719 25.832031 27.863281 27.976562 25.726562 C 29.1875 24.507812 29.898438 23.519531 30.632812 22.03125 C 31.304688 20.648438 31.742188 19.167969 31.9375 17.625 C 32.019531 16.945312 32.019531 15.054688 31.9375 14.375 C 31.632812 11.898438 30.707031 9.632812 29.167969 7.59375 C 28.644531 6.898438 27.273438 5.550781 26.5625 5.023438 C 24.636719 3.605469 22.605469 2.757812 20.3125 2.40625 C 19.511719 2.289062 17.675781 2.238281 16.90625 2.320312 Z M 16.90625 2.320312 "
                />
                <path
                  d="M 16.761719 13.726562 L 16.78125 17.582031 L 19.875 19.417969 C 21.574219 20.429688 23.042969 21.300781 23.136719 21.351562 L 23.304688 21.4375 L 23.851562 20.511719 C 24.148438 20.007812 24.398438 19.574219 24.414062 19.554688 C 24.417969 19.539062 23.226562 18.804688 21.742188 17.9375 L 19.0625 16.34375 L 19.0625 9.875 L 16.75 9.875 Z M 16.761719 13.726562 "
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
        class="object-cover w-[54rem] h-[24rem] rounded-xl"
        :src="bannerImg"
        alt="banner"
      />
    </div>

    <!-- Main Download Panel -->
    <div
      class="
        absolute mt-6 bg-slate-800 rounded-xl shadow-2xl ring-1 ring-white/10 ring-inset overflow-hidden w-[54rem] h-[33%]"
    >
      <div class="flex place-content-center p-8">
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
  </div>
</template>

<script>
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
