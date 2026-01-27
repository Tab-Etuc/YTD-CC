<template>
  <div class="flex h-full w-[calc(100%-7rem)]">
    <div>
      <!-- Main Download Panel -->
      <div
        class="mt-6 h-[33%] w-[55rem] rounded-xl bg-slate-800 shadow-2xl ring-1 ring-inset ring-white/10 2xl:w-[80rem]">
        <Teleport to="body">
          <!-- use the modal component, pass in the prop -->
          <YtDlModal :showModal="showYtDlModal" :videoId="videoId" :videoTitle="videoTitle" :videoAuthor="videoAuthor"
            :videoThumbnail="videoThumbnail" :videoAdaptiveDownloadUrl="videoAdaptiveDownloadUrl"
            :videoDownloadUrl="videoDownloadUrl" :videoDuration="videoDuration" :videoQualitys="videoQualitys"
            @close-modal="showYtDlModal = false">
          </YtDlModal>
        </Teleport>

        <div class="relative flex h-full flex-wrap place-content-center justify-center">
          <div class="p-6">
            <p
              class="cursor-defaultmt-2 mb-5 select-none text-center text-xl font-medium leading-tight tracking-wide text-white">
              貼上 Youtube 影片連結
            </p>

            <hr class="mt-3 h-2 w-full content-center" />

            <div class="mt-4 rounded-xl bg-white/5 py-4 shadow-lg backdrop-blur-sm transition-colors hover:bg-white/10">
              <input v-model="ytUrl"
                class="focus:shadow-outline mx-2 w-[28rem] rounded-full px-3 py-1 pl-5 placeholder-gray-500 outline-indigo-400 transition-all duration-700 ease-in-out hover:w-[30rem]"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=..."
                @keyup.enter="confirm(false)" />
              <button
                class="mx-2 mt-3 w-16 rounded-lg bg-blue-500 p-0.5 text-center text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
                @click="confirm(false)">
                確認
              </button>
            </div>
          </div>

          <button
            class="absolute right-0 bottom-0 h-10 w-20 items-center justify-center rounded-br-lg rounded-tl-lg bg-gradient-to-tr from-[#ed6ea0]/70 to-blue-500/70 text-center text-white transition-all duration-700 hover:translate-y-1 hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
            @click="confirm(true)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="mr-2 inline-block h-6 w-6 fill-white">
              <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M192 0c-41.8 0-77.4 26.7-90.5 64H48C21.5 64 0 85.5 0 112V464c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H282.5C269.4 26.7 233.8 0 192 0zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm-80 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
            </svg>
            <span class="inline-block font-extrabold text-red-50">貼上</span>
          </button>
        </div>
      </div>

      <!-- Banner  -->
      <div class="relative mt-3 h-[55%] w-[55rem] 2xl:w-[80rem]">
        <div class="absolute left-5 bottom-4 h-10 w-full">
          <div
            class="group flex h-10 w-fit max-w-[2.5rem] overflow-hidden rounded-full bg-slate-700/80 pl-10 pr-0 transition-all duration-700 ease-in-out hover:max-w-[40rem] hover:pr-5 hover:bg-slate-700/90"
            @mouseover="showBannerLink = true" @mouseleave="showBannerLink = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              class="absolute left-3 bottom-3 my-auto h-4 w-4 fill-white transition-all duration-700 group-hover:left-4 group-hover:fill-blue-400 cursor-pointer"
              @click.stop="changeBanner"
              :data-active="showBannerLink">
              <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
            </svg>

            <div
              class="m-auto flex opacity-0 transition-opacity duration-0 group-hover:delay-700 group-hover:duration-0 group-hover:opacity-100"
              :data-active="showBannerLink">
              <p class="my-auto text-center font-extrabold text-white">
                圖源：
              </p>
              <a class="my-auto cursor-pointer text-center text-blue-400 underline" @click="
                openLink(
                  'https://twitter.com/dabidabi76/status/1369344876555481092'
                )
                ">
                https://twitter.com/dabidabi76/status/1369344876555481092
              </a>
            </div>
          </div>
        </div>
        <img class="h-full w-full rounded-xl object-cover" :src="bannerImg" alt="banner" />
      </div>
    </div>
    <!-- 右側歷程記錄 History -->
    <SideHistory />
  </div>
</template>

<script>
import { fetch } from '@tauri-apps/plugin-http';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { open } from '@tauri-apps/plugin-shell';
import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { readFile, readTextFile, writeTextFile, mkdir, exists, BaseDirectory } from '@tauri-apps/plugin-fs';
import { appDataDir } from '@tauri-apps/api/path';

// Components
import SideHistory from '../SideHistory.vue';
import YtDlModal from '../modal/YtDlModal.vue';
import DownloadCountChart from '../DownloadCountChart.vue';

import bannerImg from '../../assets/home_banner.webp';
import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    SideHistory,
    YtDlModal,
    DownloadCountChart,
  },
  
  computed: {
    ...mapState(['bannerImage']),
  },

  watch: {
    bannerImage: {
      immediate: true,
      async handler(newPath) {
        if (newPath) {
          try {
            const contents = await readFile(newPath);
            const blob = new Blob([contents]);
            this.bannerImg = URL.createObjectURL(blob);
          } catch (err) {
            console.error('Failed to load saved banner:', err);
          }
        }
      },
    },
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
    async changeBanner() {
      const file = await openFileDialog({
        multiple: false,
        directory: false,
        filters: [{
          name: 'Images',
          extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif']
        }]
      });
      if (file) {
        try {
          const contents = await readFile(file);
          const blob = new Blob([contents]);
          this.bannerImg = URL.createObjectURL(blob);

          // Save to settings
          try {
            // Ensure directory exists
            if (!(await exists('', { baseDir: BaseDirectory.AppData }))) {
              await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });
            }

            const settingsPath = 'settings.json';
            let jsonData = {};
            try {
              const log = await readTextFile(settingsPath, {
                baseDir: BaseDirectory.AppData,
              });
              jsonData = JSON.parse(log);
            } catch (err) {
               // Ignore read error, start fresh if needed
               console.warn("Could not read settings.json, creating new.");
            }
            
            jsonData.BANNER_IMAGE = file;
            
            await writeTextFile(settingsPath, JSON.stringify(jsonData), {
              baseDir: BaseDirectory.AppData,
            });
            
            this.$store.commit('SET_BANNER_IMAGE', file);
          } catch (err) {
            console.error('Failed to save banner setting:', err);
          }
        } catch (err) {
          console.error('Failed to read image:', err);
        }
      }
    },

    async openLink(URL) {
      await open(URL);
    },

    async makeRequest(url, options = {}) {
      const response = await fetch(url, {
        body: options.body,
        method: options.method ?? 'GET',
        headers: options.headers ?? {},
      });
      if (!response.ok) return `${response.status} ${response.statusText}`;
      
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    },

    async confirm(usingClipboard) {
      console.log('123')
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
      const targetUrl = `https://www.youtube.com/watch?v=${this.videoId}`;
      this.ytUrl = '';


      await invoke('download_youtube', {
        url: targetUrl
      }).then(() => { console.log('123') })

    }
  },

};

</script>
