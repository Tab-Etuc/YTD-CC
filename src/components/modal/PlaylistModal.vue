<template>
  <Transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="w-[70vw] max-w-4xl max-h-[80vh] bg-slate-800 rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="relative p-6 bg-gradient-to-r from-purple-600 to-blue-600">
          <button 
            @click="$emit('close')"
            class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div v-if="isLoading" class="flex items-center gap-4">
            <div class="w-20 h-12 bg-white/20 rounded animate-pulse"></div>
            <div class="flex-1">
              <div class="h-5 w-48 bg-white/20 rounded animate-pulse mb-2"></div>
              <div class="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div v-else-if="playlistData" class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
              <div>
                <h2 class="text-xl font-bold text-white">{{ playlistData.title }}</h2>
                <p class="text-white/70 text-sm">{{ playlistData.uploader }} · {{ playlistData.count }} 部影片</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Format Options -->
        <div class="p-4 bg-slate-700/50 border-b border-slate-600 flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="text-white text-sm">格式：</span>
            <DropdownSelect
              v-model="selectedFormat"
              :options="formatOptions"
              placeholder="選擇格式"
              :drop-up="false"
              width-class="w-28"
              @select="handleFormatChange"
            />
          </div>
          
          <div v-if="selectedFormat === 'MP4'" class="flex items-center gap-2">
            <span class="text-white text-sm">畫質：</span>
            <DropdownSelect
              v-model="selectedQuality"
              :options="qualityOptions"
              placeholder="選擇畫質"
              :drop-up="false"
              width-class="w-28"
              @select="handleQualityChange"
            />
          </div>
          
          <div v-if="selectedFormat === 'MP3'" class="flex items-center gap-2">
            <span class="text-white text-sm">音質：</span>
            <DropdownSelect
              v-model="selectedAudioQuality"
              :options="audioQualityOptions"
              placeholder="選擇音質"
              :drop-up="false"
              width-class="w-36"
              @select="handleAudioQualityChange"
            />
          </div>
          
          <div class="flex-1"></div>
          
          <div class="flex items-center gap-2">
            <button
              @click="selectAll"
              class="px-3 py-1.5 text-sm text-white bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
            >
              全選
            </button>
            <button
              @click="deselectAll"
              class="px-3 py-1.5 text-sm text-white bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
            >
              取消全選
            </button>
          </div>
        </div>

        <!-- Video List -->
        <div class="flex-1 overflow-y-auto scrollbar">
          <div v-if="isLoading" class="p-4 space-y-3">
            <div v-for="i in 5" :key="i" class="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg animate-pulse">
              <div class="w-6 h-6 bg-slate-600 rounded"></div>
              <div class="w-24 h-14 bg-slate-600 rounded"></div>
              <div class="flex-1">
                <div class="h-4 w-3/4 bg-slate-600 rounded mb-2"></div>
                <div class="h-3 w-1/4 bg-slate-600 rounded"></div>
              </div>
            </div>
          </div>
          
          <ul v-else-if="playlistData?.entries" class="divide-y divide-slate-700">
            <li
              v-for="(video, index) in playlistData.entries"
              :key="video.id"
              class="flex items-center gap-3 p-3 hover:bg-slate-700/50 transition-colors cursor-pointer"
              @click="toggleSelect(index)"
            >
              <!-- Checkbox -->
              <div 
                class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors shrink-0"
                :class="video.selected 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-slate-500 hover:border-slate-400'"
              >
                <svg v-if="video.selected" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <!-- Index -->
              <span class="w-8 text-center text-slate-400 text-sm shrink-0">{{ index + 1 }}</span>
              
              <!-- Thumbnail -->
              <div class="relative w-24 h-14 shrink-0 rounded overflow-hidden bg-slate-700">
                <img 
                  :src="video.thumbnail" 
                  :alt="video.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <span class="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                  {{ video.duration }}
                </span>
              </div>
              
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-white text-sm truncate">{{ video.title }}</p>
                <p class="text-slate-400 text-xs truncate">{{ video.uploader }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-700/50 border-t border-slate-600 flex items-center justify-between">
          <p class="text-slate-400 text-sm">
            已選擇 <span class="text-white font-bold">{{ selectedCount }}</span> / {{ playlistData?.entries?.length || 0 }} 部影片
          </p>
          
          <div class="flex items-center gap-3">
            <button
              @click="$emit('close')"
              class="px-6 py-2 text-white bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              @click="handleConfirm"
              :disabled="selectedCount === 0 || !isOptionsValid"
              class="px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              :class="selectedCount > 0 && isOptionsValid
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              加入佇列
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DropdownSelect from '../common/DropdownSelect.vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  playlistData: { type: Object, default: null },
  isLoading: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'confirm']);

// Format options
const formatOptions = [
  { label: 'MP3', value: 'MP3' },
  { label: 'MP4', value: 'MP4' },
];

const qualityOptions = [
  { label: '2160p (4K)', value: '2160', height: 2160 },
  { label: '1440p (2K)', value: '1440', height: 1440 },
  { label: '1080p', value: '1080', height: 1080 },
  { label: '720p', value: '720', height: 720 },
  { label: '480p', value: '480', height: 480 },
  { label: '360p', value: '360', height: 360 },
];

const audioQualityOptions = [
  { label: '320kbps (最高)', value: '320', bitrate: '320' },
  { label: '192kbps (高)', value: '192', bitrate: '192' },
  { label: '128kbps (標準)', value: '128', bitrate: '128' },
];

// State
const selectedFormat = ref('MP4');
const selectedQuality = ref('1080p');
const selectedHeight = ref(1080);
const selectedAudioQuality = ref('192kbps (高)');
const selectedBitrate = ref('192');

// Computed
const selectedCount = computed(() => {
  return props.playlistData?.entries?.filter(v => v.selected).length || 0;
});

const isOptionsValid = computed(() => {
  if (selectedFormat.value === 'MP4') {
    return selectedQuality.value && selectedQuality.value !== '選擇畫質';
  }
  return selectedAudioQuality.value && selectedAudioQuality.value !== '選擇音質';
});

// Methods
function handleFormatChange(option) {
  selectedFormat.value = option.value;
}

function handleQualityChange(option) {
  selectedQuality.value = option.label;
  selectedHeight.value = option.height;
}

function handleAudioQualityChange(option) {
  selectedAudioQuality.value = option.label;
  selectedBitrate.value = option.bitrate;
}

function toggleSelect(index) {
  if (props.playlistData?.entries?.[index]) {
    props.playlistData.entries[index].selected = !props.playlistData.entries[index].selected;
  }
}

function selectAll() {
  props.playlistData?.entries?.forEach(v => v.selected = true);
}

function deselectAll() {
  props.playlistData?.entries?.forEach(v => v.selected = false);
}

function handleConfirm() {
  const selectedVideos = props.playlistData?.entries?.filter(v => v.selected) || [];
  
  emit('confirm', selectedVideos, {
    format: selectedFormat.value,
    quality: selectedQuality.value,
    height: selectedHeight.value,
    audioQuality: selectedAudioQuality.value,
    bitrate: selectedBitrate.value,
  });
}

// Reset state when modal opens
watch(() => props.show, (val) => {
  if (val) {
    selectedFormat.value = 'MP4';
    selectedQuality.value = '1080p';
    selectedHeight.value = 1080;
    selectedAudioQuality.value = '192kbps (高)';
    selectedBitrate.value = '192';
  }
});
</script>
