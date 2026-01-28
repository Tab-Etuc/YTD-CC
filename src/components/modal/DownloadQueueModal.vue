<template>
  <Transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="transform translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="transform translate-x-full opacity-0"
  >
    <div
      v-if="show"
      class="fixed right-4 bottom-4 z-50 w-96 max-h-[60vh] bg-slate-800 rounded-xl shadow-2xl ring-1 ring-white/10 overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span class="text-white font-bold">下載佇列</span>
          <span class="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {{ queue.length }} 項目
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button 
            v-if="queue.length > 0 && !isProcessing"
            @click="clearQueue"
            class="text-white/70 hover:text-white transition-colors text-sm"
          >
            清空
          </button>
          <button 
            @click="$emit('close')"
            class="text-white/70 hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Queue List -->
      <div class="flex-1 overflow-y-auto scrollbar">
        <TransitionGroup
          tag="ul"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-x-full opacity-0"
          enter-to-class="translate-x-0 opacity-100"
          leave-active-class="transition duration-150 ease-in absolute w-full"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          move-class="transition-transform duration-300"
        >
          <li
            v-for="(item, index) in queue"
            :key="item.id"
            class="flex items-center gap-3 p-3 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition-colors"
          >
            <!-- Thumbnail -->
            <div class="relative w-16 h-10 shrink-0 rounded overflow-hidden bg-slate-700">
              <img 
                :src="item.thumbnail" 
                :alt="item.title"
                class="w-full h-full object-cover"
              />
              <!-- Status overlay -->
              <div 
                v-if="item.status === 'downloading'"
                class="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <svg class="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div 
                v-else-if="item.status === 'completed'"
                class="absolute inset-0 bg-green-500/50 flex items-center justify-center"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div 
                v-else-if="item.status === 'error'"
                class="absolute inset-0 bg-red-500/50 flex items-center justify-center"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <!-- Index badge for pending -->
              <div 
                v-else
                class="absolute top-0 left-0 bg-slate-900/80 text-white text-xs px-1.5 py-0.5 rounded-br"
              >
                #{{ index + 1 }}
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm truncate">{{ item.title }}</p>
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <span class="bg-slate-600 px-1.5 py-0.5 rounded">{{ item.format }}</span>
                <span v-if="item.quality">{{ item.quality }}</span>
                <span v-if="item.status === 'downloading' && item.progress">
                  {{ item.progress }}%
                </span>
              </div>
            </div>

            <!-- Actions -->
            <button
              v-if="item.status === 'pending'"
              @click="removeFromQueue(item.id)"
              class="text-slate-400 hover:text-red-400 transition-colors p-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        </TransitionGroup>

        <!-- Empty State -->
        <div v-if="queue.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-400">
          <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p class="text-sm">佇列為空</p>
          <p class="text-xs mt-1">貼上播放清單連結或多個影片連結</p>
        </div>
      </div>

      <!-- Footer: Start Download Button -->
      <div v-if="queue.length > 0" class="p-4 bg-slate-700/50 border-t border-slate-600">
        <div v-if="currentDownloading" class="mb-3">
          <div class="flex justify-between text-sm text-white mb-1">
            <span class="truncate flex-1 mr-2">{{ currentDownloading.title }}</span>
            <span class="text-blue-300">{{ currentDownloading.progress || 0 }}%</span>
          </div>
          <div class="h-2 bg-slate-600 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              :style="{ width: `${currentDownloading.progress || 0}%` }"
            ></div>
          </div>
        </div>
        <button
          @click="startQueueDownload"
          :disabled="isProcessing || pendingCount === 0"
          class="w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          :class="isProcessing || pendingCount === 0 
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'"
        >
          <svg v-if="isProcessing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isProcessing ? `下載中 (${completedCount}/${queue.length})` : `開始下載 (${pendingCount} 項)` }}</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { sendNotification } from '@tauri-apps/plugin-notification';
import { useNotification } from '@kyvg/vue3-notification';

const props = defineProps({
  show: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'queue-complete']);

const store = useStore();
const { notify } = useNotification();

// Computed
const queue = computed(() => store.state.downloadQueue);
const isProcessing = computed(() => store.state.isQueueProcessing);
const currentDownloading = computed(() => queue.value.find(i => i.status === 'downloading'));
const pendingCount = computed(() => queue.value.filter(i => i.status === 'pending').length);
const completedCount = computed(() => queue.value.filter(i => i.status === 'completed').length);

// Methods
function removeFromQueue(id) {
  store.commit('REMOVE_FROM_QUEUE', id);
}

function clearQueue() {
  store.commit('CLEAR_QUEUE');
}

async function startQueueDownload() {
  if (isProcessing.value || pendingCount.value === 0) return;
  
  store.commit('SET_QUEUE_PROCESSING', true);
  
  const downloadOutputPath = store.state.downloadOutputPath;
  let unlisten;
  
  try {
    unlisten = await listen('download_progress', (event) => {
      const progress = parseFloat(event.payload);
      if (!isNaN(progress)) {
        store.commit('UPDATE_QUEUE_ITEM_PROGRESS', { progress: Math.round(progress) });
      }
    });

    for (const item of queue.value) {
      if (item.status !== 'pending') continue;
      
      store.commit('UPDATE_QUEUE_ITEM_STATUS', { id: item.id, status: 'downloading', progress: 0 });
      
      try {
        const isAudio = item.format === 'MP3';
        let format = '';
        
        if (isAudio) {
          format = 'mp3';
        } else {
          format = `bestvideo[height=${item.height}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height=${item.height}]+bestaudio/best[height=${item.height}]/best`;
        }

        await invoke('download_video', {
          url: item.url,
          path: downloadOutputPath,
          format: format,
          isAudio: isAudio,
          bitrate: isAudio ? item.bitrate : null
        });
        
        store.commit('UPDATE_QUEUE_ITEM_STATUS', { id: item.id, status: 'completed', progress: 100 });
        
        // 紀錄到歷史
        await store.dispatch('Add_History_Item', {
          title: item.title,
          format: item.format,
          duration: item.duration,
          thumbnail: item.thumbnail,
          quality: item.quality
        });
        
      } catch (err) {
        console.error(`Download failed for ${item.title}:`, err);
        store.commit('UPDATE_QUEUE_ITEM_STATUS', { id: item.id, status: 'error' });
      }
    }
    
    // All done
    const completed = queue.value.filter(i => i.status === 'completed').length;
    const failed = queue.value.filter(i => i.status === 'error').length;
    
    notify({
      group: 'foo-css',
      title: '🎉 批次下載完成！',
      text: `成功 ${completed} 項，失敗 ${failed} 項`,
    });
    
    sendNotification({ 
      title: '批次下載完成', 
      body: `成功 ${completed} 項，失敗 ${failed} 項` 
    });
    
    emit('queue-complete');
    
  } catch (err) {
    console.error('Queue download error:', err);
  } finally {
    if (unlisten) unlisten();
    store.commit('SET_QUEUE_PROCESSING', false);
  }
}
</script>
