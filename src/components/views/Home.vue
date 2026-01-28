<template>
  <div class="flex h-full w-full p-6 gap-6 box-border overflow-hidden">
    <Teleport to="body">
      <YtDlModal :showModal="showYtDlModal" :videoId="videoId"
        @close-modal="showYtDlModal = false"
        @add-to-queue="handleAddToQueue">
      </YtDlModal>
      
      <!-- 播放清單選擇 Modal -->
      <PlaylistModal 
        :show="showPlaylistModal"
        :playlist-data="playlistData"
        :is-loading="isLoadingPlaylist"
        @close="showPlaylistModal = false"
        @confirm="handlePlaylistConfirm"
      />
      
      <!-- 下載佇列 Modal -->
      <DownloadQueueModal 
        :show="showQueueModal"
        @close="showQueueModal = false"
        @queue-complete="handleQueueComplete"
      />
    </Teleport>

    <!-- Left Column: Main Content -->
    <div class="flex flex-col flex-1 h-full min-w-0 gap-6">
      
      <!-- Top: Download Panel -->
      <div class="relative flex flex-col justify-center h-[40%] w-full rounded-xl bg-slate-800 shadow-2xl ring-1 ring-inset ring-white/10 shrink-0 overflow-hidden">
        <div class="relative flex h-full flex-col items-center justify-center">
          <div class="p-6 w-full flex flex-col items-center">
            <p
              class="cursor-default mb-4 select-none text-center text-xl font-medium leading-tight tracking-wide text-white">
              貼上 Youtube 影片或播放清單連結
            </p>

            <hr class="mb-6 h-px w-2/3 bg-white/10 border-0" />

            <div class="relative w-full max-w-2xl rounded-xl bg-white/5 py-3 px-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white/10 flex items-center gap-2">
              <input v-model="ytUrl"
                class="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-4 py-2 font-light tracking-wide rounded-lg"
                placeholder="影片或播放清單連結..."
                @keyup.enter="confirm(false)" />
              
              <button
                class="flex items-center justify-center p-2 mx-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="貼上連結"
                @click="confirm(true)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="h-5 w-5 fill-current">
                  <path
                    d="M192 0c-41.8 0-77.4 26.7-90.5 64H48C21.5 64 0 85.5 0 112V464c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H282.5C269.4 26.7 233.8 0 192 0zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm-80 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-16-16-16s7.2-16 16-16z" />
                </svg>
              </button>

              <button
                class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg"
                @click="confirm(false)">
                確認
              </button>
            </div>
            
            <!-- URL 類型提示 -->
            <div class="flex items-center gap-4 mt-3 text-sm text-slate-400">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clip-rule="evenodd"/></svg>
                單一影片
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
                播放清單
              </span>
            </div>
          </div>
        </div>
        
        <!-- 下載佇列按鈕 (浮動) -->
        <button
          v-if="queueCount > 0"
          @click="showQueueModal = true"
          class="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all hover:scale-105"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span class="font-medium">佇列</span>
          <span class="bg-white/20 px-2 py-0.5 rounded-full text-xs">{{ queueCount }}</span>
        </button>
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

<script setup>
import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { fetch } from '@tauri-apps/plugin-http';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { open } from '@tauri-apps/plugin-shell';
import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { readFile } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';
import { useNotification } from '@kyvg/vue3-notification';

// Components
import SideHistory from '../SideHistory.vue';
const YtDlModal = defineAsyncComponent(() => import('../modal/YtDlModal.vue'));
const PlaylistModal = defineAsyncComponent(() => import('../modal/PlaylistModal.vue'));
const DownloadQueueModal = defineAsyncComponent(() => import('../modal/DownloadQueueModal.vue'));

// Assets
import defaultBannerImg from '../../assets/home_banner.webp';

const store = useStore();
const notify = useNotification();

// State
const ytUrl = ref('');
const videoId = ref('');
const videoTitle = ref('');
const videoAuthor = ref('');
const videoThumbnail = ref('');
const videoDownloadUrl = ref([]);
const videoAdaptiveDownloadUrl = ref([]);
const videoDuration = ref('');
const videoQualitys = ref([]);
const bannerImg = ref(defaultBannerImg);
const showYtDlModal = ref(false);
const showBannerLink = ref(false);
const currentObjectUrl = ref(null);

// 播放清單與佇列相關
const showPlaylistModal = ref(false);
const showQueueModal = ref(false);
const playlistData = ref(null);
const isLoadingPlaylist = ref(false);

// Computed
const bannerImage = computed(() => store.state.bannerImage);
const downloadOutputPath = computed(() => store.state.downloadOutputPath);
const windowControlOnTheLeft = computed(() => store.state.windowControlOnTheLeft);
const saveHistory = computed(() => store.state.saveHistory);
const queueCount = computed(() => store.getters.pendingQueueCount);

// Watchers
watch(bannerImage, async (newPath) => {
  if (newPath) {
    try {
      const contents = await readFile(newPath);
      const blob = new Blob([contents]);
      
      // Revoke old URL if exists
      if (currentObjectUrl.value) {
        URL.revokeObjectURL(currentObjectUrl.value);
      }
      
      currentObjectUrl.value = URL.createObjectURL(blob);
      bannerImg.value = currentObjectUrl.value;
    } catch (err) {
       console.error('Failed to load saved banner:', err);
    }
  }
}, { immediate: true });

// Methods
const changeBanner = async () => {
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
      
      if (currentObjectUrl.value) {
        URL.revokeObjectURL(currentObjectUrl.value);
      }
      
      currentObjectUrl.value = URL.createObjectURL(blob);
      bannerImg.value = currentObjectUrl.value;

      // Save to settings
      try {
        await invoke('save_settings', {
          settings: {
            WINDOW_CONTROLS_ON_THE_LEFT: windowControlOnTheLeft.value,
            DOWNLOAD_OUTPUT_PATH: downloadOutputPath.value,
            SAVE_HISTORY: saveHistory.value,
            BANNER_IMAGE: file
          }
        });
        
        store.commit('SET_BANNER_IMAGE', file);
      } catch (err) {
        console.error('Failed to save banner setting:', err);
      }
    } catch (err) {
      console.error('Failed to set banner:', err);
    }
  }
};

const openLink = async (URL) => {
  if (URL.startsWith('http')) {
    await open(URL);
  } else {
    // Use custom Rust command to open in explorer
    invoke('show_in_folder', { path: URL });
  }
};

const confirm = async (usingClipboard) => {
  if (usingClipboard) {
    ytUrl.value = await readText();
  }
  
  // Check URL
  if (ytUrl.value == '') {
    return notify.notify({
      group: 'foo-css',
      title: '請輸入連結！',
      type: 'error',
    });
  }

  // 檢查是否為播放清單
  const isPlaylist = ytUrl.value.includes('list=') || ytUrl.value.includes('/playlist');
  
  if (isPlaylist) {
    await handlePlaylistUrl(ytUrl.value);
    ytUrl.value = '';
    return;
  }

  // 單一影片處理
  if (/(www\.youtube\.com|be)(?=\/watch\?v=)/.test(ytUrl.value)) {
    videoId.value = ytUrl.value.split('v=')[1].slice(0, 11);
  } else if (/www\.youtu\.be\//.test(ytUrl.value)) {
    videoId.value = ytUrl.value.split('.be/')[1].slice(0, 11);
  } else {
    ytUrl.value = '';
    return notify.notify({
      group: 'foo-css',
      title: '連結無效！',
      type: 'error',
    });
  }
  
  if (videoId.value.length != 11) {
    ytUrl.value = '';
    return notify.notify({
      group: 'foo-css',
      title: '連結無效！',
      type: 'error',
    });
  }
  
  ytUrl.value = '';
  showYtDlModal.value = true;
};

// 處理播放清單 URL
const handlePlaylistUrl = async (url) => {
  isLoadingPlaylist.value = true;
  showPlaylistModal.value = true;
  
  try {
    const info = await invoke('get_video_info', { url });
    
    if (info.entries && info.entries.length > 0) {
      playlistData.value = {
        title: info.title || '未命名播放清單',
        uploader: info.uploader || '未知',
        count: info.entries.length,
        thumbnail: info.thumbnails?.[0]?.url || '',
        entries: info.entries.map((entry, index) => ({
          id: entry.id,
          title: entry.title || `影片 ${index + 1}`,
          thumbnail: `https://img.youtube.com/vi/${entry.id}/mqdefault.jpg`,
          duration: entry.duration_string || '--:--',
          uploader: entry.uploader || info.uploader || '',
          selected: true,
        })),
      };
    } else {
      throw new Error('無法解析播放清單');
    }
  } catch (err) {
    console.error('Failed to fetch playlist:', err);
    notify.notify({
      group: 'foo-css',
      title: '無法取得播放清單',
      text: err.toString(),
      type: 'error',
    });
    showPlaylistModal.value = false;
  } finally {
    isLoadingPlaylist.value = false;
  }
};

// 處理播放清單確認
const handlePlaylistConfirm = (selectedVideos, options) => {
  const items = selectedVideos.map(video => ({
    url: `https://www.youtube.com/watch?v=${video.id}`,
    title: video.title,
    thumbnail: video.thumbnail,
    duration: video.duration,
    format: options.format,
    quality: options.format === 'MP4' ? options.quality : options.audioQuality,
    height: options.height,
    bitrate: options.bitrate,
  }));
  
  store.commit('ADD_MULTIPLE_TO_QUEUE', items);
  showPlaylistModal.value = false;
  playlistData.value = null;
  
  notify.notify({
    group: 'foo-css',
    title: `已加入 ${items.length} 個影片到佇列`,
  });
  
  // 顯示佇列
  showQueueModal.value = true;
};

// 處理單一影片加入佇列
const handleAddToQueue = (item) => {
  store.commit('ADD_TO_QUEUE', item);
  notify.notify({
    group: 'foo-css',
    title: '已加入下載佇列',
    text: item.title,
  });
};

// 佇列完成處理
const handleQueueComplete = () => {
  store.commit('CLEAR_COMPLETED_QUEUE');
};

// Assuming makeRequest was not really used in template, keeping it as local function if needed or removing
// Keeping as const just in case
const makeRequest = async (url, options = {}) => {
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
};
</script>
