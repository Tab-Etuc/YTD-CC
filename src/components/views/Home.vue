<template>
  <div class="flex h-full w-full p-6 gap-6 box-border overflow-hidden">
    <Teleport to="body">
      <YtDlModal :showModal="showYtDlModal" :videoId="videoId"
        @close-modal="showYtDlModal = false">
      </YtDlModal>
    </Teleport>

    <!-- Left Column: Main Content -->
    <div class="flex flex-col flex-1 h-full min-w-0 gap-6">
      
      <!-- Top: Download Panel -->
      <div class="relative flex flex-col justify-center h-[40%] w-full rounded-xl bg-slate-800 shadow-2xl ring-1 ring-inset ring-white/10 shrink-0 overflow-hidden">
        <div class="relative flex h-full flex-col items-center justify-center">
          <div class="p-6 w-full flex flex-col items-center">
            <p
              class="cursor-default mb-8 select-none text-center text-xl font-medium leading-tight tracking-wide text-white">
              貼上 Youtube 影片連結
            </p>

            <hr class="mb-8 h-px w-2/3 bg-white/10 border-0" />

            <div class="relative w-full max-w-2xl rounded-xl bg-white/5 py-3 px-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white/10 flex items-center gap-2">
              <input v-model="ytUrl"
                class="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-4 py-2 font-light tracking-wide rounded-lg"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                @keyup.enter="confirm(false)" />
              
              <button
                class="flex items-center justify-center p-2 mx-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="貼上連結"
                @click="confirm(true)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="h-5 w-5 fill-current">
                  <path
                    d="M192 0c-41.8 0-77.4 26.7-90.5 64H48C21.5 64 0 85.5 0 112V464c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H282.5C269.4 26.7 233.8 0 192 0zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm-80 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                </svg>
              </button>

              <button
                class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg"
                @click="confirm(false)">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom: Banner -->
      <div class="relative flex-1 w-full min-h-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-inset ring-white/10 group">
        <div class="absolute left-5 bottom-4 z-10 w-full pointer-events-none">
          <div
            class="flex items-center h-10 w-fit max-w-[2.5rem] overflow-hidden rounded-full bg-slate-800/80 backdrop-blur transition-all duration-500 ease-out hover:max-w-[90%] hover:pr-4 pointer-events-auto shadow-lg ring-1 ring-white/10"
            @mouseover="showBannerLink = true" @mouseleave="showBannerLink = false">
            
            <div class="h-10 w-10 flex items-center justify-center shrink-0 cursor-pointer text-white hover:text-blue-400 transition-colors"
                 @click.stop="changeBanner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-4 w-4 fill-current">
                  <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                </svg>
            </div>

            <div class="flex items-center whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1">
              <p class="font-bold text-white mr-2 text-sm shrink-0">圖源：</p>
              <a v-if="bannerImage" class="cursor-pointer text-blue-400 hover:text-blue-300 underline text-sm truncate" 
                 @click="openLink(bannerImage)">
                {{ bannerImage }}
              </a>
              <a v-else class="cursor-pointer text-blue-400 hover:text-blue-300 underline text-sm truncate" 
                 @click="openLink('https://twitter.com/dabidabi76/status/1369344876555481092')">
                twitter.com/dabidabi76
              </a>
            </div>
          </div>
        </div>
        <img class="h-full w-full object-cover transition-transform duration-700 hover:scale-105" :src="bannerImg" alt="banner" />
      </div>
    </div>

    <!-- Right Column: History -->
    <div class="hidden xl:block w-[300px] 2xl:w-[400px] shrink-0 h-full">
      <SideHistory />
    </div>
  </div>
</template>

<script>
import { fetch } from '@tauri-apps/plugin-http';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { open } from '@tauri-apps/plugin-shell';
import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { readFile, readTextFile, writeTextFile, mkdir, exists, BaseDirectory } from '@tauri-apps/plugin-fs';
import { appDataDir, downloadDir, dirname } from '@tauri-apps/api/path';

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
    ...mapState(['bannerImage', 'downloadOutputPath']),
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
      if (URL.startsWith('http')) {
        await open(URL);
      } else {
        // Use custom Rust command to open in explorer
        invoke('show_in_folder', { path: URL });
      }
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
      this.showYtDlModal = true;

      /* Original download call commented out
      await invoke('download_youtube', {
        url: targetUrl,
        path: this.downloadOutputPath || (await downloadDir())
      }).then(() => { console.log('123') })
      */
    }
  },

};

</script>
