<template>
  <div class="relative float-left h-screen w-[calc(100%-7rem)]">
    <!-- 右側歷程記錄 History -->
    <History />

    <!-- Main Download Panel -->
    <div
      class="mt-6 h-[33%] w-[55rem] rounded-xl bg-slate-800 shadow-2xl ring-1 ring-inset ring-white/10"
    >
      <Teleport to="body">
        <!-- use the modal component, pass in the prop -->
        <YtDlModal
          :showModal="showYtDlModal"
          :videoId="videoId"
          :videoTitle="videoTitle"
          :videoAuthor="videoAuthor"
          :videoThumbnail="videoThumbnail"
          :videoAdaptiveDownloadUrl="videoAdaptiveDownloadUrl"
          :videoDownloadUrl="videoDownloadUrl"
          :videoDuration="videoDuration"
          :videoQualitys="videoQualitys"
          @close-modal="showYtDlModal = false"
        >
        </YtDlModal>
      </Teleport>

      <div
        class="relative flex h-full flex-wrap place-content-center justify-center"
      >
        <div class="p-6">
          <p
            class="cursor-defaultmt-2 mb-5 select-none text-center text-xl font-medium leading-tight tracking-wide text-white"
          >
            貼上 Youtube 影片連結
          </p>

          <hr class="mt-3 h-2 w-full content-center" />

          <div>
            <input
              v-model="ytUrl"
              class="focus:shadow-outline mx-2 mt-4 w-[28rem] rounded-full px-3 py-1 pl-5 placeholder-gray-500 outline-indigo-400 transition-all duration-700 ease-in-out hover:w-[30rem]"
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=..."
              @keyup.enter="confirm"
            />
            <button
              class="mx-2 mt-3 w-16 rounded-lg bg-blue-500 p-0.5 text-center text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
              @click="confirm(false)"
            >
              確認
            </button>
          </div>
        </div>

        <button
          class="absolute right-0 bottom-0 h-10 w-20 items-center justify-center rounded-br-lg rounded-tl-lg bg-gradient-to-tr from-[#ed6ea0]/70 to-blue-500/70 text-center text-white hover:translate-y-1 hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
          @click="confirm(true)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="mr-2 inline-block h-6 w-6 fill-white"
          >
            <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M192 0c-41.8 0-77.4 26.7-90.5 64H48C21.5 64 0 85.5 0 112V464c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H282.5C269.4 26.7 233.8 0 192 0zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm-80 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
            />
          </svg>
          <span class="inline-block font-extrabold text-red-50">貼上</span>
        </button>
      </div>
    </div>

    <!-- Banner  -->
    <div class="absolute mt-3 h-[55%] w-[55rem]">
      <div class="absolute left-5 bottom-4 h-10 w-full">
        <div
          class="flex h-10 w-10 rounded-full bg-slate-700/80 transition-all duration-700 ease-in-out hover:w-[70%] hover:flex-none hover:bg-slate-700/90"
          @mouseover="showBannerLink = true"
          @mouseleave="showBannerLink = false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="absolute left-3 bottom-2.5 my-auto h-5 w-5 fill-white data-active:left-4 data-active:fill-blue-400 data-active:transition-all data-active:duration-700"
            :data-active="showBannerLink"
          >
            <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
            />
          </svg>

          <div
            class="m-auto opacity-0 data-active:flex data-active:translate-x-0 data-active:opacity-100 data-active:transition-all data-active:duration-[3000ms]"
            :data-active="showBannerLink"
          >
            <p class="my-auto text-center font-extrabold text-white">圖源：</p>
            <a
              class="my-auto cursor-pointer text-center text-blue-400 underline"
              @click="
                openLink(
                  'https://twitter.com/dabidabi76/status/1369344876555481092'
                )
              "
            >
              https://twitter.com/dabidabi76/status/1369344876555481092
            </a>
          </div>
        </div>
      </div>
      <img
        class="h-full w-[55rem] rounded-xl object-cover"
        :src="bannerImg"
        alt="banner"
      />
    </div>
  </div>
</template>

<script>
import { Body, fetch } from '@tauri-apps/api/http';
import { readText } from '@tauri-apps/api/clipboard';
import { open } from '@tauri-apps/api/shell';

// Components
import History from '../SideHistory.vue';
import YtDlModal from '../modal/YtDlModal.vue';
import DownloadCountChart from '../DownloadCountChart.vue';

import bannerImg from '../../assets/home_banner.webp';

export default {
  name: 'Home',
  components: {
    History,
    YtDlModal,
    DownloadCountChart,
  },

  data() {
    return {
      ytUrl: '',
      videoId: '',
      videoTitle: '',
      videoAuthor: '',
      videoThumbnail: '',
      videoDownloadUrl: [],
      videoAdaptiveDownloadUrl: [],
      videoDuration: '',
      videoQualitys: [],
      bannerImg: bannerImg,
      showYtDlModal: false,
      showBannerLink: false,
    };
  },

  methods: {
    async openLink(URL) {
      await open(URL);
    },

    async makeRequest(url, options = {}) {
      const response = await fetch(url, {
        body: options.body ?? Body.text(''),
        query: options.query ?? {},
        method: options.method ?? 'get',
        headers: options.headers ?? {},
        responseType:
          { JSON: 1, Text: 2, Binary: 3 }[options.responseType] ?? 2,
      });
      if (!response.ok) return `${response.status} ${response.data}`;
      if (typeof response.data == JSON) {
        response.data = JSON.parse(response.data);
      }
      return response.data;
    },

    async confirm(usingClipboard) {
      if (usingClipboard) {
        this.ytUrl = await readText();
      }
      // 檢查連結
      if (this.ytUrl == '')
        return this.$notify({
          group: 'foo-css',
          title: '請輸入連結！',
          type: 'error',
        });

      if (/(www\.youtube\.com|be)(?=\/watch\?v=)/.test(this.ytUrl)) {
        this.videoId = this.ytUrl.split('v=')[1].slice(0, 11);
      } else if (/www\.youtu\.be\//.test(this.ytUrl)) {
        this.videoId = this.ytUrl.split('.be/')[1].slice(0, 11);
      } else {
        this.ytUrl = '';
        return this.$notify({
          group: 'foo-css',
          title: '連結無效！',
          type: 'error',
        });
      }
      if (this.videoId.length != 11) {
        this.ytUrl = '';
        return this.$notify({
          group: 'foo-css',
          title: '連結無效！',
          type: 'error',
        });
      }
      this.ytUrl = '';

      await this.find_video_info(this.videoId)
        .then(() => {
          if (!this.videoTitle || !this.videoAdaptiveDownloadUrl)
            return this.$notify({
              group: 'foo-css',
              title: '無法獲取影片資訊，連結無效？',
              text: `${this.videoTitle}`,
              type: 'error',
            });
          this.showYtDlModal = true;
        })
        .catch();
    },

    async find_video_info(id) {
      await this.makeRequest(
        'https://youtubei.googleapis.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
        {
          body: Body.json({
            videoId: id,
            context: {
              client: {
                clientName: 'ANDROID',
                clientVersion: '16.02',
              },
            },
          }),
          method: 'POST',
          responseType: 'JSON',
        }
      )
        .then((data) => {
          function millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return (
              minutes + '分鐘 ' + (seconds < 10 ? '0' : '') + seconds + '秒'
            );
          }

          [
            this.videoTitle,
            this.videoDownloadUrl,
            this.videoAdaptiveDownloadUrl,
            this.videoAuthor,
            this.videoDuration,
            this.videoQualitys,
          ] = [
            data['videoDetails']['title'], // String - 影片標題

            data['streamingData']['formats'].map((a) => {
              var rObj = {};
              rObj['影片畫質'] = a['qualityLabel'];
              rObj['url'] = a['url'];
              return rObj;
            }), // Array - 一般影片下載連結

            data['streamingData']['adaptiveFormats']
              .filter((a) => {
                if (a['audioQuality']) return false;
                if (
                  a['qualityLabel'].includes('144p') ||
                  a['qualityLabel'].includes('360p') ||
                  a['qualityLabel'].includes('720p')
                )
                  return false;
                return true;
              })
              .map((a) => {
                let rObj = {};
                rObj[a['qualityLabel']] = a['url'];
                return rObj;
              }), //  Array - (僅視訊畫面)影片下載連結

            data['videoDetails']['author'], // String - 影片上傳者

            millisToMinutesAndSeconds(
              data['streamingData']['formats'][0]['approxDurationMs']
            ), // String - 影片時數

            [
              ...new Set( // 移除重複值
                data['streamingData']['adaptiveFormats']
                  .filter((a) => !a['audioQuality']) // 將僅有音訊的檔案排除
                  .map((a) => {
                    return a['qualityLabel']; // 獲取可下載之影片畫質
                  })
              ),
            ].map(
              (a) => ('720p60' == a && (a = '720p'), a) // 當值為 "720p60" 時替換成 "720p"
            ), // Array - 影片畫質
          ];
        })
        .catch();

      await this.makeRequest(
        `https://i3.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`
      )
        .then((res) => {
          if (res.includes('404')) throw Error;
          this.videoThumbnail = `https://i3.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`;
        })
        .catch(() => {
          this.videoThumbnail = `https://i3.ytimg.com/vi/${this.videoId}/hqdefault.jpg`;
        });

      return;
    },
  },
};
</script>
