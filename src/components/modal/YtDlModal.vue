<template>
  <Transition
    enter-active-class="duration-500 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-400 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="showModal"
      class="fixed bottom-0 left-0 z-50 table h-[calc(100%-32px)] w-full rounded-b-xl bg-black/50 transition duration-300"
    >
      <div class="table-cell align-middle">
        <!-- Content State -->
        <div class="flex w-screen">
          <div
            class="mx-auto flex w-[60vw] justify-center rounded-t-lg border-b border-slate-500 bg-slate-800 p-8 shadow-2xl ring-1 ring-inset ring-white/10 transition-all duration-300"
          >
            <div class="flex h-full w-full">
              <div class="relative h-[72px] w-32 shrink-0">
                  <img
                    :src="videoThumbnail"
                    alt="YtVideoThumbnail"
                    class="h-full w-full rounded-md object-cover bg-slate-700"
                  />
                  <!-- Loading Overlay for thumbnail if needed, or just let it load -->
              </div>
              <div class="ml-3 h-full w-[80%]">
                <p class="truncate text-lg text-white">
                  <span v-if="isLoading" class="animate-pulse bg-slate-600 rounded text-transparent">讀取中...</span>
                  <span v-else>{{ videoTitle }}</span>
                </p>
                <hr class="mt-2 h-2 w-full content-center" />
                <div class="flex space-x-4 items-center">
                  <!-- author icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    class="h-6 w-6 fill-white"
                  >
                    <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                    <path
                      d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"
                    />
                  </svg>
                  <span class="w-1/3 truncate text-lg text-white">
                    <span v-if="isLoading" class="animate-pulse bg-slate-600 rounded text-transparent">Author Name</span>
                    <span v-else>{{ videoAuthor }}</span>
                  </span>

                  <!-- play icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 32 32"
                    version="1.1"
                    class="h-6 w-6"
                  >
                    <defs>
                      <filter
                        id="alpha"
                        filterUnits="objectBoundingBox"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                      >
                        <feColorMatrix
                          type="matrix"
                          in="SourceGraphic"
                          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                        />
                      </filter>
                      <mask id="mask0">
                        <g filter="url(#alpha)">
                          <rect
                            x="0"
                            y="0"
                            width="32"
                            height="32"
                            style="fill: rgb(100%, 100%, 100%); stroke: none"
                          />
                        </g>
                      </mask>
                      <clipPath id="clip1">
                        <rect x="0" y="0" width="32" height="32" />
                      </clipPath>
                      <g id="surface5" clip-path="url(#clip1)">
                        <path
                          style="
                            stroke: none;
                            fill-rule: evenodd;
                            fill: rgb(100%, 100%, 100%);
                          "
                          d="M 14.53125 -0.03125 C 15.488281 -0.03125 16.449219 -0.03125 17.40625 -0.03125 C 23.007812 0.648438 27.226562 3.421875 30.0625 8.28125 C 31.105469 10.25 31.742188 12.332031 31.96875 14.53125 C 31.96875 15.488281 31.96875 16.449219 31.96875 17.40625 C 31.289062 23.007812 28.515625 27.226562 23.65625 30.0625 C 21.6875 31.105469 19.605469 31.742188 17.40625 31.96875 C 16.449219 31.96875 15.488281 31.96875 14.53125 31.96875 C 8.929688 31.289062 4.710938 28.515625 1.875 23.65625 C 0.832031 21.6875 0.195312 19.605469 -0.03125 17.40625 C -0.03125 16.449219 -0.03125 15.488281 -0.03125 14.53125 C 0.648438 8.929688 3.421875 4.710938 8.28125 1.875 C 10.25 0.832031 12.332031 0.195312 14.53125 -0.03125 Z M 15.15625 1.59375 C 20.761719 1.503906 25.105469 3.777344 28.1875 8.40625 C 30.535156 12.398438 30.953125 16.585938 29.4375 20.96875 C 27.324219 26.125 23.523438 29.199219 18.03125 30.1875 C 12.316406 30.792969 7.722656 28.824219 4.25 24.28125 C 1.46875 20.140625 0.886719 15.703125 2.5 10.96875 C 4.335938 6.402344 7.617188 3.433594 12.34375 2.0625 C 13.277344 1.835938 14.214844 1.679688 15.15625 1.59375 Z M 12.78125 11.15625 C 15.214844 12.726562 17.632812 14.332031 20.03125 15.96875 C 17.644531 17.589844 15.25 19.191406 12.84375 20.78125 C 12.78125 17.574219 12.761719 14.363281 12.78125 11.15625 Z M 12.78125 11.15625 "
                        />
                      </g>
                      <mask id="mask1">
                        <g filter="url(#alpha)">
                          <rect
                            x="0"
                            y="0"
                            width="32"
                            height="32"
                            style="fill: rgb(100%, 100%, 100%); stroke: none"
                          />
                        </g>
                      </mask>
                      <clipPath id="clip2">
                        <rect x="0" y="0" width="32" height="32" />
                      </clipPath>
                      <g id="surface8" clip-path="url(#clip2)">
                        <path
                          style="
                            stroke: none;
                            fill-rule: evenodd;
                            fill: rgb(100%, 100%, 100%);
                          "
                          d="M 11.96875 9.03125 C 12.351562 8.984375 12.703125 9.054688 13.03125 9.25 C 15.90625 11.167969 18.78125 13.082031 21.65625 15 C 22.324219 15.644531 22.324219 16.292969 21.65625 16.9375 C 18.671875 18.941406 15.671875 20.921875 12.65625 22.875 C 11.972656 23.027344 11.480469 22.789062 11.1875 22.15625 C 11.144531 18.03125 11.144531 13.90625 11.1875 9.78125 C 11.359375 9.429688 11.621094 9.179688 11.96875 9.03125 Z M 12.78125 11.15625 C 12.761719 14.363281 12.78125 17.574219 12.84375 20.78125 C 15.25 19.191406 17.644531 17.589844 20.03125 15.96875 C 17.632812 14.332031 15.214844 12.726562 12.78125 11.15625 Z M 12.78125 11.15625 "
                        />
                      </g>
                    </defs>
                    <g id="surface1">
                      <use xlink:href="#surface5" mask="url(#mask0)" />
                      <use xlink:href="#surface8" mask="url(#mask1)" />
                    </g>
                  </svg>
                  <span class="w-1/2 text-lg text-white">
                    <span v-if="isLoading">--:--</span>
                    <span v-else>{{ videoDuration }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <svg
            v-if="!isDownloading"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="z-1 absolute right-[16vw] h-8 w-8 fill-red-500"
            @click="$emit('close-modal')"
          >
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="z-1 absolute right-[16vw] h-8 w-8 cursor-not-allowed fill-slate-700"
          >
            <!-- ! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"
            />
          </svg>
        </div>

        <div
          class="relative mx-auto flex w-[60vw] rounded-b-xl bg-slate-600 p-4"
        >
          <div v-if="isDownloading" class="relative m-auto flex h-6 w-full">
            <span class="absolute left-0 text-white">下載中...</span>
            <div
              class="relative m-auto flex h-6 w-[75%] rounded-xl bg-gray-200"
            >
              <div
                :style="{ width: downloadProgressBarValue }"
                class="shim-green absolute top-0 h-6 rounded-xl duration-500"
              ></div>
            </div>
            <span class="absolute right-5 font-medium text-blue-100">{{
              downloadProgressBarValue
            }}</span>
          </div>

          <div
            v-if="!isDownloading"
            class="my-auto mx-3 flex w-full gap-4 justify-around"
          >
            <!-- 檔案格式選單 -->
            <div class="relative flex h-10 w-32">
              <div 
                class="absolute z-0 h-full w-full rounded-lg text-white flex items-center px-3 select-none ring-1 ring-white/20 transition-colors"
                :class="isLoading ? 'bg-slate-600 cursor-not-allowed opacity-50' : 'bg-slate-700 cursor-pointer hover:bg-slate-600'"
                @click.stop="!isLoading && (formatActive = !formatActive, qualityActive = false)"
              >
                {{ formatTitle }}
                <div 
                  v-if="!isLoading"
                  class="absolute right-3 top-3 h-2 w-2 border-r-2 border-b-2 border-white transform duration-300"
                  :class="formatActive ? 'rotate-[225deg] top-4' : 'rotate-45'"
                ></div>
                <svg v-else class="absolute right-3 animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <ul
                  v-if="formatActive"
                  class="absolute bottom-full mb-1 w-full rounded-lg bg-slate-700 shadow-xl ring-1 ring-white/10 z-50 overflow-hidden"
                >
                  <li
                    class="relative cursor-pointer select-none p-3 text-white hover:bg-slate-600 transition-colors"
                    @click.stop="formatTitle = 'MP3'; formatActive = false"
                  >
                    MP3
                  </li>
                  <li
                    class="relative cursor-pointer select-none p-3 text-white hover:bg-slate-600 transition-colors border-t border-slate-600"
                    @click.stop="formatTitle = 'MP4'; formatActive = false"
                  >
                    MP4
                  </li>
                </ul>
              </Transition>
            </div>

            <!-- 影片畫質選單 -->
            <div v-if="formatTitle != 'MP3'" class="relative flex h-10 w-32">
              <div 
                class="absolute z-0 h-full w-full rounded-lg text-white flex items-center px-3 select-none ring-1 ring-white/20 transition-colors"
                :class="isLoading ? 'bg-slate-600 cursor-not-allowed opacity-50' : 'bg-slate-700 cursor-pointer hover:bg-slate-600'"
                @click.stop="!isLoading && (qualityActive = !qualityActive, formatActive = false)"
              >
                {{ qualityTitle }}
                <div 
                  v-if="!isLoading"
                  class="absolute right-3 top-3 h-2 w-2 border-r-2 border-b-2 border-white transform duration-300"
                  :class="qualityActive ? 'rotate-[225deg] top-4' : 'rotate-45'"
                ></div>
                <svg v-else class="absolute right-3 animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <ul
                  v-if="qualityActive"
                  class="scrollbar absolute bottom-full mb-1 max-h-[12rem] w-full overflow-y-auto rounded-lg bg-slate-700 shadow-xl ring-1 ring-white/10 z-50"
                >
                  <li
                    class="relative cursor-pointer select-none p-3 text-white hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-0"
                    v-for="quality in videoQualitys"
                    :key="quality"
                    @click.stop="qualityTitle = quality; qualityActive = false"
                  >
                    {{ quality }}
                  </li>
                </ul>
              </Transition>
            </div>

            <button
              class="flex h-10 w-24 items-center justify-center rounded-lg text-white shadow-lg font-medium transition-colors ring-1 ring-white/10"
              :class="isLoading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'"
              :disabled="isLoading"
              @click="check"
            >
              下載
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { sendNotification } from '@tauri-apps/plugin-notification';
import { readTextFile, writeTextFile, BaseDirectory, exists, mkdir } from '@tauri-apps/plugin-fs';
import { mapState } from 'vuex';

export default {
  name: 'YtDlModal',

  props: {
    showModal: {
      type: Boolean,
      default: true,
      required: true,
    },
    videoId: {
      type: String,
      default: null,
      required: true,
    },
  },

  computed: {
    ...mapState([
      'isDownloading',
      'downloadProgressBarValue',
      'windowControlOnTheLeft',
      'downloadOutputPath',
      'saveHistory',
    ]),
  },

  data() {
    return {
      isLoading: false,
      videoTitle: '載入中...',
      videoAuthor: '',
      videoThumbnail: '',
      videoDuration: '00:00',
      videoQualitys: [],
      formatActive: false,
      formatTitle: '檔案格式',
      qualityActive: false,
      qualityTitle: '影片畫質',
    };
  },

  watch: {
    showModal(val) {
      if (val && this.videoId) {
        this.fetchVideoInfo();
      }
    }
  },

  methods: {
    async fetchVideoInfo() {
      this.isLoading = true;
      // Reset State with Instant Thumbnail
      this.videoTitle = '載入中...';
      this.videoAuthor = '';
      // Use standard YouTube thumbnail URL for instant feedback
      this.videoThumbnail = `https://img.youtube.com/vi/${this.videoId}/mqdefault.jpg`;
      this.videoDuration = '00:00';
      this.videoQualitys = [];
      this.formatTitle = '檔案格式';
      this.qualityTitle = '影片畫質';

      const targetUrl = `https://www.youtube.com/watch?v=${this.videoId}`;
      
      try {
        const info = await invoke('get_video_info', { url: targetUrl });
        
        this.videoTitle = info.title;
        this.videoAuthor = info.uploader;
        // Update with higher res or preferred thumbnail from yt-dlp if different/better
        if (info.thumbnail) this.videoThumbnail = info.thumbnail;
        this.videoDuration = info.duration_string;
        
        const formats = info.formats || [];
        const qualities = new Set();
        formats.forEach(f => {
          if (f.height) qualities.add(f.height + 'p');
        });
        
        this.videoQualitys = Array.from(qualities).sort((a, b) => parseInt(b) - parseInt(a));
        
      } catch (e) {
         this.$notify({
          group: 'foo-css',
          title: '無法取得影片資訊',
          text: e.toString(),
          type: 'error',
        });
        this.$emit('close-modal');
      } finally {
        this.isLoading = false;
      }
    },

    async check() {
      if (this.formatTitle == '檔案格式') {
        return this.$notify({
          group: 'foo-css',
          title: '請選擇檔案格式！',
          type: 'error',
        });
      }
      if (this.formatTitle == 'MP4' && this.qualityTitle == '影片畫質') {
        return this.$notify({
          group: 'foo-css',
          title: '請選擇影片畫質！',
          type: 'error',
        });
      }

      await this.download();
    },

    async download() {
      const targetUrl = `https://www.youtube.com/watch?v=${this.videoId}`;
      const isAudio = this.formatTitle === 'MP3';
      
      let format = '';
      if (isAudio) {
         format = 'mp3'; 
      } else {
         const height = this.qualityTitle.replace('p', '');
         format = `bestvideo[height=${height}][ext=mp4]+bestaudio[ext=m4a]/best[height=${height}][ext=mp4]/best[ext=mp4]/best`;
      }

      this.$store.commit('UPDATE_STATUS', true);
      this.$store.commit('SET_BAR_VALUE', '0%');
      
      let unlisten;

      try {
        unlisten = await listen('download_progress', (event) => {
            this.$store.commit('SET_BAR_VALUE', event.payload);
        });

        await invoke('download_video', {
          url: targetUrl,
          path: this.downloadOutputPath,
          format: format,
          isAudio: isAudio
        });
        
        this.$store.commit('SET_BAR_VALUE', '100%');
        this.$store.commit('UPDATE_STATUS', false);
        this.$notify({
          group: 'foo-css',
          title: '下載完成！',
          text: `${this.videoTitle}`,
        });
        sendNotification({ title: this.videoTitle, body: '下載完成！' });
        
        await this.writeHistory();
        this.$emit('close-modal');

      } catch (err) {
        console.error(err);
        this.$store.commit('UPDATE_STATUS', false);
         this.$notify({
          group: 'foo-css',
          title: '下載失敗！',
          text: err.toString(),
          type: 'error',
        });
      } finally {
        if (unlisten) unlisten();
        this.formatTitle = '檔案格式';
        this.qualityTitle = '影片畫質';
      }
    },

    async writeHistory() {
      if (!this.saveHistory) return;

      try {
        const historyPath = 'history.json';
        if (!(await exists(historyPath, { baseDir: BaseDirectory.AppData }))) {
           await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });
        }

        let jsonData = { 下載次數統計: { MP3: 0, MP4: 0 }, 歷程記錄: [] };
        try {
           const content = await readTextFile(historyPath, { baseDir: BaseDirectory.AppData });
           if (content) jsonData = JSON.parse(content);
        } catch { /* ignore */ }
        
        if (!jsonData.下載次數統計) jsonData.下載次數統計 = { MP3: 0, MP4: 0 };
        if (!jsonData.歷程記錄) jsonData.歷程記錄 = [];

        if (this.formatTitle === 'MP3') jsonData.下載次數統計.MP3++;
        else jsonData.下載次數統計.MP4++;

        jsonData.歷程記錄.unshift({
            影片名稱: this.videoTitle,
            檔案格式: this.formatTitle,
            影片時長: this.videoDuration,
            影片背景: this.videoThumbnail,
            下載時間: Date.now(),
        });

        if (jsonData.歷程記錄.length > 50) jsonData.歷程記錄.pop();

        await writeTextFile(historyPath, JSON.stringify(jsonData), { baseDir: BaseDirectory.AppData });
        this.$store.dispatch('Set_History_List');

      } catch (err) {
        console.error('Failed to save history', err);
      }
    },
  },
};
</script>
