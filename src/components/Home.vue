<template>
  <div class="relative float-left w-[calc(100%-7rem)] h-[93%] ">
    <div
      class="
        mt-6  bg-slate-800 rounded-xl shadow-2xl ring-1 ring-white/10 ring-inset overflow-hidden w-[54rem]"
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

    <img class="absolute bottom-0 mt-3 w-[54rem] h-[24rem]" :src="bannerSrc"/>
  </div>
</template>

<script>
import downloader from '../common/downloader'
import img from '../assets/TDwZG1y.jpg'
export default {
  name: 'Mainpanel',

  data () {
    return {
      ytUrl: '',
      opt: '',
      bannerSrc: img
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
