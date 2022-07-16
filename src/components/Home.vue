<template>
  <div class="relative float-left w-[calc(100%-7rem)] h-screen ">
    <!-- 右側歷史紀錄 History -->
    <History />

    <!-- Main Download Panel -->
    <div
      class="
         mt-6 bg-slate-800 rounded-xl shadow-2xl ring-1 ring-white/10 ring-inset overflow-hidden w-[55rem] h-[33%]"
    >
      <Teleport to="body">
        <!-- use the modal component, pass in the prop -->
        <YtDlModal
          :showModal="showYtDlModal"
          :videoId="videoId"
          :videoTitle="videoTitle"
          :videoAuthor="videoAuthor"
          :videoItags="videoItags"
          :videoDuration="videoDuration"
          :videoQualitys="videoQualitys"
          @closeModal="showYtDlModal = false"
        >
          <!-- <template #header>
            <h3>custom header</h3>
          </template> -->
        </YtDlModal>
      </Teleport>

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
import { Body, fetch } from '@tauri-apps/api/http'

// Components
import History from './History.vue'
import YtDlModal from './modal/YtDlModal.vue'

import bannerImg from '../assets/TDwZG1y.jpg'

export default {
  name: 'Home',
  components: {
    History,
    YtDlModal
  },

  data () {
    return {
      ytUrl: '',
      videoId: '',
      videoTitle: '',
      videoAuthor: '',
      videoItags: [],
      videoDuration: '',
      videoQualitys: [],
      bannerImg: bannerImg,
      showYtDlModal: false
    }
  },

  methods: {
    makeRequest: async function (url, options = {}) {
      const response = await fetch(url, {
        body: options.body ?? Body.text(''),
        query: options.query ?? {},
        method: options.method ?? 'get',
        headers: options.headers ?? {},
        responseType: { JSON: 1, Text: 2, Binary: 3 }[options.responseType] ?? 2
      })
      if (!response.ok) throw new Error(`${response.status} ${response.data}`)
      if (typeof response.data == JSON) {
        response.data = JSON.parse(response.data)
      }
      return response.data
    },

    confirm: async function () {
      // 檢查連結
      if (this.ytUrl == '')
        return this.$notify({
          group: 'foo-css',
          title: '請輸入連結！',
          type: 'error'
        })
      if (/(www\.youtube\.com|be)(?=\/watch\?v=)/.test(this.ytUrl)) {
        this.videoId = this.ytUrl.split('v=')[1].slice(0, 11)
      } else if (/www\.youtu\.be\//.test(this.ytUrl)) {
        this.videoId = this.ytUrl.split('.be/')[1].slice(0, 11)
      } else {
        return this.$notify({
          group: 'foo-css',
          title: '連結無效！',
          type: 'error'
        })
      }

      await this.find_video_info(this.videoId)
        .then(() => {
          if (!this.videoTitle || !this.videoItags)
            return this.$notify({
              group: 'foo-css',
              title: '無法獲取影片資訊，連結無效？',
              text: `${this.videoTitle}`,
              type: 'error'
            })
          this.showYtDlModal = true
        })
        .catch()
    },

    find_video_info: async function (id) {
      await this.makeRequest(
        'https://youtubei.googleapis.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
        {
          body: Body.json({
            videoId: id,
            context: {
              client: {
                clientName: 'ANDROID',
                clientVersion: '16.02'
              }
            }
          }),
          method: 'POST',
          responseType: 'JSON'
        }
      )
        .then(data => {
          function millisToMinutesAndSeconds (millis) {
            var minutes = Math.floor(millis / 60000)
            var seconds = ((millis % 60000) / 1000).toFixed(0)
            return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
          }

          ;[
            this.videoTitle,
            this.videoItags,
            this.videoAuthor,
            this.videoDuration,
            this.videoQualitys
          ] = [
            data['videoDetails']['title'],
            data['streamingData']['formats'],
            data['videoDetails']['author'],
            millisToMinutesAndSeconds(
              data['streamingData']['formats'][0]['approxDurationMs']
            ),
            [
              ...new Set( // 移除重複值
                data['streamingData']['adaptiveFormats'].map(a => {
                  return a['qualityLabel'] // 得到可下載之影片畫質
                })
              )
            ].filter(a => a) // 移除空值 ( undefined... )
          ]
        })
        .catch()
      return
    }
  }
}
</script>
