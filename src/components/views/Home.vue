<template>
    <div class="box-border flex h-full w-full gap-6 overflow-hidden p-6">
        <Teleport to="body">
            <YtDlModal
                :show-modal="showYtDlModal"
                :video-id="videoId"
                @close-modal="showYtDlModal = false"
                @add-to-queue="handleAddToQueue"
            />

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
        <div class="flex h-full min-w-0 flex-1 flex-col gap-6">
            <!-- Top: Download Panel -->
            <div
                class="relative flex h-[40%] w-full shrink-0 flex-col justify-center overflow-hidden rounded-xl bg-slate-800 shadow-2xl ring-1 ring-white/10 ring-inset"
            >
                <div class="relative flex h-full flex-col items-center justify-center">
                    <UrlInput ref="urlInputRef" @process-url="handleProcessUrl" />
                </div>

                <!-- 下載佇列按鈕 (浮動) -->
                <button
                    v-if="queueCount > 0"
                    class="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white shadow-lg transition-all hover:scale-105 hover:from-blue-500 hover:to-purple-500"
                    @click="showQueueModal = true"
                >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    <span class="font-medium">佇列</span>
                    <span class="rounded-full bg-white/20 px-2 py-0.5 text-xs">{{
                        queueCount
                    }}</span>
                </button>
            </div>

            <!-- Bottom: Banner -->
            <HomeBanner />
        </div>

        <!-- Right Column: History -->
        <div class="hidden h-full w-[300px] shrink-0 xl:block 2xl:w-[400px]">
            <SideHistory />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { useNotification } from '@kyvg/vue3-notification';
import { useAppStore } from '@/stores/app';
import type {
    VideoInfo,
    PlaylistData,
    PlaylistVideoItem,
    PlaylistDownloadOptions,
    QueueItemInput,
} from '@/types';

// Components
import SideHistory from '@/components/SideHistory.vue';
import HomeBanner from '@/components/home/HomeBanner.vue';
import UrlInput from '@/components/home/UrlInput.vue';

defineOptions({
    name: 'Home',
});

// Async Components
const YtDlModal = defineAsyncComponent(() => import('@/components/modal/YtDlModal.vue'));
const PlaylistModal = defineAsyncComponent(() => import('@/components/modal/PlaylistModal.vue'));
const DownloadQueueModal = defineAsyncComponent(
    () => import('@/components/modal/DownloadQueueModal.vue')
);

const store = useAppStore();
const notify = useNotification();

// Refs
const urlInputRef = ref<InstanceType<typeof UrlInput> | null>(null);

// State
const videoId = ref('');
const showYtDlModal = ref(false);

// 播放清單與佇列相關
const showPlaylistModal = ref(false);
const showQueueModal = ref(false);
const playlistData = ref<PlaylistData | null>(null);
const isLoadingPlaylist = ref(false);

// Computed
const queueCount = computed(() => store.pendingQueueCount);

// Methods
async function handleProcessUrl(url: string): Promise<void> {
    const inputUrl = url;

    // 檢查是否為播放清單
    const isPlaylist = inputUrl.includes('list=') || inputUrl.includes('/playlist');

    if (isPlaylist) {
        await handlePlaylistUrl(inputUrl);
        urlInputRef.value?.clear();
        return;
    }

    // 單一影片處理
    if (/(www\.youtube\.com|be)(?=\/watch\?v=)/.test(inputUrl)) {
        videoId.value = inputUrl.split('v=')[1]?.slice(0, 11) ?? '';
    } else if (/www\.youtu\.be\//.test(inputUrl)) {
        videoId.value = inputUrl.split('.be/')[1]?.slice(0, 11) ?? '';
    } else {
        urlInputRef.value?.clear();
        return notify.notify({
            group: 'foo-css',
            title: '連結無效！',
            type: 'error',
        });
    }

    if (videoId.value.length !== 11) {
        urlInputRef.value?.clear();
        return notify.notify({
            group: 'foo-css',
            title: '連結無效！',
            type: 'error',
        });
    }

    urlInputRef.value?.clear();
    showYtDlModal.value = true;
}

// 處理播放清單 URL
async function handlePlaylistUrl(url: string): Promise<void> {
    isLoadingPlaylist.value = true;
    showPlaylistModal.value = true;

    try {
        const info = await invoke<VideoInfo>('get_video_info', { url });

        if (info.entries && info.entries.length > 0) {
            playlistData.value = {
                title: info.title || '未命名播放清單',
                uploader: info.uploader || '未知',
                count: info.entries.length,
                thumbnail: info.thumbnails?.[0]?.url || '',
                entries: info.entries.map(
                    (entry, index): PlaylistVideoItem => ({
                        id: entry.id,
                        title: entry.title || `影片 ${index + 1}`,
                        thumbnail: `https://img.youtube.com/vi/${entry.id}/mqdefault.jpg`,
                        duration: entry.duration_string || '--:--',
                        uploader: entry.uploader || info.uploader || '',
                        selected: true,
                    })
                ),
            };
        } else {
            throw new Error('無法解析播放清單');
        }
    } catch (err) {
        console.error('Failed to fetch playlist:', err);
        notify.notify({
            group: 'foo-css',
            title: '無法取得播放清單',
            text: String(err),
            type: 'error',
        });
        showPlaylistModal.value = false;
    } finally {
        isLoadingPlaylist.value = false;
    }
}

// 處理播放清單確認
function handlePlaylistConfirm(
    selectedVideos: PlaylistVideoItem[],
    options: PlaylistDownloadOptions
): void {
    const items: QueueItemInput[] = selectedVideos.map((video) => ({
        url: `https://www.youtube.com/watch?v=${video.id}`,
        title: video.title,
        thumbnail: video.thumbnail,
        duration: video.duration,
        format: options.format,
        quality: options.format === 'MP4' ? options.quality : options.audioQuality,
        height: options.height,
        bitrate: options.bitrate,
    }));

    store.addMultipleToQueue(items);
    showPlaylistModal.value = false;
    playlistData.value = null;

    notify.notify({
        group: 'foo-css',
        title: `已加入 ${items.length} 個影片到佇列`,
    });

    // 顯示佇列
    showQueueModal.value = true;
}

// 處理單一影片加入佇列
function handleAddToQueue(item: QueueItemInput): void {
    store.addToQueue(item);
    notify.notify({
        group: 'foo-css',
        title: '已加入下載佇列',
        text: item.title,
    });
}

// 佇列完成處理
function handleQueueComplete(): void {
    store.clearCompletedQueue();
}
</script>
