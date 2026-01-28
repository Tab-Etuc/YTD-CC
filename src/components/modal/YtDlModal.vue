<template>
    <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
        <div
            v-if="showModal"
            class="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
        >
            <div
                class="relative flex h-[80%] w-[70%] flex-col rounded-2xl bg-slate-800 shadow-2xl ring-1 ring-white/10 ring-inset"
            >
                <!-- Header -->
                <header
                    class="flex h-16 w-full shrink-0 items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#ed6ea0]/80 to-blue-500/80 px-6"
                >
                    <div class="flex items-center gap-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            class="h-6 w-6 fill-white"
                        >
                            <path
                                d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
                            />
                        </svg>
                        <p class="text-xl font-medium text-white select-none">影片下載</p>
                    </div>
                    <button
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        @click="closeModal"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <!-- Content -->
                <div class="flex flex-1 overflow-hidden p-6">
                    <!-- Left: Video Info -->
                    <div class="flex w-1/2 flex-col pr-6">
                        <!-- Thumbnail -->
                        <div
                            class="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-700"
                        >
                            <img
                                v-if="videoInfo?.thumbnail"
                                :src="videoInfo.thumbnail"
                                class="h-full w-full object-cover"
                                alt="Video thumbnail"
                            />
                            <div v-else class="flex h-full items-center justify-center">
                                <svg
                                    class="h-16 w-16 animate-pulse text-slate-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Video Title & Info -->
                        <div class="mt-4">
                            <h2 class="line-clamp-2 text-lg font-bold text-white">
                                {{ videoInfo?.title || '載入中...' }}
                            </h2>
                            <p class="mt-1 text-sm text-slate-400">
                                {{ videoInfo?.uploader || '' }}
                            </p>
                            <p class="mt-1 text-sm text-slate-400">
                                時長: {{ videoInfo?.duration_string || '--:--' }}
                            </p>
                        </div>
                    </div>

                    <!-- Right: Options -->
                    <div class="flex w-1/2 flex-col border-l border-slate-700 pl-6">
                        <h3 class="mb-4 text-lg font-bold text-white">下載選項</h3>

                        <!-- Format Selection -->
                        <div class="mb-4">
                            <label class="mb-2 block text-sm font-medium text-slate-300"
                                >格式</label
                            >
                            <div class="flex gap-2">
                                <button
                                    class="flex-1 rounded-lg px-4 py-2 font-medium transition-colors"
                                    :class="
                                        selectedFormat === 'MP4'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    "
                                    @click="selectedFormat = 'MP4'"
                                >
                                    MP4
                                </button>
                                <button
                                    class="flex-1 rounded-lg px-4 py-2 font-medium transition-colors"
                                    :class="
                                        selectedFormat === 'MP3'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    "
                                    @click="selectedFormat = 'MP3'"
                                >
                                    MP3
                                </button>
                            </div>
                        </div>

                        <!-- Quality Selection -->
                        <div class="mb-4">
                            <label class="mb-2 block text-sm font-medium text-slate-300">
                                {{ selectedFormat === 'MP4' ? '畫質' : '音質' }}
                            </label>
                            <DropdownSelect
                                v-if="selectedFormat === 'MP4'"
                                v-model="selectedQuality"
                                :options="videoQualityOptions"
                                @select="handleQualitySelect"
                            />
                            <DropdownSelect
                                v-else
                                v-model="selectedAudioQuality"
                                :options="audioQualityOptions"
                                @select="handleAudioQualitySelect"
                            />
                        </div>

                        <!-- Output Path -->
                        <div class="mb-6">
                            <label class="mb-2 block text-sm font-medium text-slate-300"
                                >輸出位置</label
                            >
                            <div
                                class="truncate rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-400"
                            >
                                {{ downloadOutputPath || '未設定' }}
                            </div>
                        </div>

                        <!-- Progress -->
                        <div v-if="isDownloading" class="mb-4">
                            <label class="mb-2 block text-sm font-medium text-slate-300"
                                >下載進度</label
                            >
                            <div class="relative h-4 w-full overflow-hidden rounded-full bg-slate-700/50 shadow-inner">
                                <!-- Progress fill -->
                                <div
                                    class="h-full rounded-full transition-all duration-300 ease-out"
                                    :style="{
                                        width: downloadProgressBarValue,
                                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                                    }"
                                >
                                    <!-- Shimmer overlay -->
                                    <div class="relative h-full w-full overflow-hidden rounded-full">
                                        <div 
                                            class="absolute inset-0 animate-shimmer"
                                            style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);"
                                        ></div>
                                    </div>
                                </div>
                                <!-- Pulse dot at the end -->
                                <div
                                    v-if="parseFloat(downloadProgressBarValue) > 0 && parseFloat(downloadProgressBarValue) < 100"
                                    class="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-lg"
                                    :style="{ 
                                        left: `calc(${downloadProgressBarValue} - 10px)`,
                                        boxShadow: '0 0 12px rgba(139, 92, 246, 0.8)'
                                    }"
                                >
                                    <div class="absolute inset-0 animate-ping rounded-full bg-white opacity-60"></div>
                                </div>
                            </div>
                            <div class="mt-2 flex items-center justify-between text-sm">
                                <span class="text-slate-400">下載中...</span>
                                <span class="font-mono font-medium text-white">
                                    {{ downloadProgressBarValue }}
                                </span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div v-if="!isDownloading" class="mt-auto flex gap-3">
                            <button
                                :disabled="!videoInfo || isDownloading"
                                class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                                @click="addToQueue"
                            >
                                <svg
                                    class="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                加入佇列
                            </button>
                            <button
                                :disabled="!videoInfo || isDownloading"
                                class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                @click="startDownload"
                            >
                                {{ isDownloading ? '下載中...' : '立即下載' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { sendNotification } from '@tauri-apps/plugin-notification';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app';
import DropdownSelect from '@/components/common/DropdownSelect.vue';
import type { VideoInfo, DropdownOption, QueueItemInput } from '@/types';

const { showModal, videoId } = defineProps<{
    showModal: boolean;
    videoId: string;
}>();
const emit = defineEmits<{
    'close-modal': [];
    'add-to-queue': [item: QueueItemInput];
}>();

const store = useAppStore();

// Store refs (using storeToRefs for proper reactivity and TypeScript inference)
const { isDownloading, downloadProgressBarValue, downloadOutputPath } = storeToRefs(store);

// State
const videoInfo = ref<VideoInfo | null>(null);
const selectedFormat = ref<'MP3' | 'MP4'>('MP4');
const selectedQuality = ref('720p');
const selectedQualityHeight = ref(720);
const selectedAudioQuality = ref('192kbps');
const selectedAudioBitrate = ref('192');

// Options
const videoQualityOptions: DropdownOption[] = [
    { label: '2160p (4K)', value: '2160p', height: 2160 },
    { label: '1440p', value: '1440p', height: 1440 },
    { label: '1080p', value: '1080p', height: 1080 },
    { label: '720p', value: '720p', height: 720 },
    { label: '480p', value: '480p', height: 480 },
    { label: '360p', value: '360p', height: 360 },
];

const audioQualityOptions: DropdownOption[] = [
    { label: '320kbps (High)', value: '320kbps', bitrate: '320' },
    { label: '192kbps (Medium)', value: '192kbps', bitrate: '192' },
    { label: '128kbps (Low)', value: '128kbps', bitrate: '128' },
];

// Watchers
watch(
    () => showModal,
    async (show) => {
        if (show && videoId) {
            await fetchVideoInfo();
        } else {
            videoInfo.value = null;
        }
    }
);

// Methods
async function fetchVideoInfo(): Promise<void> {
    try {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await invoke<VideoInfo>('get_video_info', { url });
        videoInfo.value = info;

        // Set thumbnail
        if (info.thumbnails && info.thumbnails.length > 0) {
            videoInfo.value!.thumbnail = info.thumbnails[info.thumbnails.length - 1]!.url;
        } else {
            videoInfo.value.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
    } catch (err) {
        console.error('Failed to fetch video info:', err);
        videoInfo.value = {
            title: '無法載入影片資訊',
            uploader: '',
            duration_string: '--:--',
            formats: [],
        };
    }
}

function handleQualitySelect(option: DropdownOption): void {
    selectedQuality.value = option.label;
    selectedQualityHeight.value = option.height || 720;
}

function handleAudioQualitySelect(option: DropdownOption): void {
    selectedAudioQuality.value = option.label;
    selectedAudioBitrate.value = option.bitrate || '192';
}

function addToQueue(): void {
    if (!videoInfo.value) {
        return;
    }

    const item: QueueItemInput = {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: videoInfo.value.title,
        thumbnail: videoInfo.value.thumbnail || '',
        duration: videoInfo.value.duration_string,
        format: selectedFormat.value,
        quality:
            selectedFormat.value === 'MP4' ? selectedQuality.value : selectedAudioQuality.value,
        height: selectedQualityHeight.value,
        bitrate: selectedAudioBitrate.value,
    };

    emit('add-to-queue', item);
    closeModal();
}

async function startDownload(): Promise<void> {
    if (!videoInfo.value) {
        return;
    }

    store.updateDownloadStatus(true);
    store.setProgressBarValue('0%');

    try {
        const url = `https://www.youtube.com/watch?v=${videoId}`;

        // Listen for progress events
        const unlisten = await listen<string>('download_progress', (event) => {
            store.setProgressBarValue(event.payload);
        });

        await invoke('download_video', {
            params: {
                url,
                path: downloadOutputPath.value,
                format:
                    selectedFormat.value === 'MP4'
                        ? `bestvideo[height<=${selectedQualityHeight.value}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${selectedQualityHeight.value}][ext=mp4]/best`
                        : 'bestaudio/best',
                is_audio: selectedFormat.value === 'MP3',
            },
        });

        unlisten();

        // Add to history
        await store.addHistoryItem({
            title: videoInfo.value.title,
            format: selectedFormat.value,
            duration: videoInfo.value.duration_string,
            thumbnail: videoInfo.value.thumbnail || '',
            quality:
                selectedFormat.value === 'MP4' ? selectedQuality.value : selectedAudioQuality.value,
        });

        // Send notification
        sendNotification({
            title: '下載完成',
            body: videoInfo.value.title,
        });

        closeModal();
    } catch (err) {
        console.error('Download failed:', err);
        sendNotification({
            title: '下載失敗',
            body: String(err),
        });
    } finally {
        store.updateDownloadStatus(false);
        store.setProgressBarValue('0%');
    }
}

function closeModal(): void {
    emit('close-modal');
}
</script>
