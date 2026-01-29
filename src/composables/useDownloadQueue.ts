import { ref, onUnmounted, type Ref } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { sendNotification } from '@tauri-apps/plugin-notification';
import { useAppStore } from '@/stores/app';
import type { QueueItem } from '@/types';

export interface UseDownloadQueueReturn {
    startQueue: () => Promise<void>;
    stopQueue: () => void;
    activeDownloads: Ref<number>;
}

export function useDownloadQueue(): UseDownloadQueueReturn {
    const store = useAppStore();
    const MAX_CONCURRENT_DOWNLOADS = 3;
    const activeDownloads = ref(0);
    const unlistenProgress = ref<UnlistenFn | null>(null);

    // 監聽進度事件
    async function setupProgressListener(): Promise<void> {
        if (unlistenProgress.value) return;

        unlistenProgress.value = await listen<string>('download_progress', (event) => {
            // 這個事件目前是全域的，可能會混淆多個下載
            // TODO: 後端需要改進以支援帶 ID 的進度事件
            // 目前我們先假設進度條主要反映"整體活動"或單個下載
            // 如果同時下載多個，這個全域事件可能會跳動
            // 暫時解決方案：僅更新 'downloading' 狀態的項目
            // 更好的方案是在 Rust download_video 中回傳特定的進度 channel
            const progress = parseInt(event.payload.replace('%', ''));
            store.updateQueueItemProgress({ progress });
        });
    }

    async function downloadItem(item: QueueItem): Promise<void> {
        if (item.status !== 'pending') return;

        try {
            activeDownloads.value++;
            store.updateQueueItemStatus({ id: item.id, status: 'downloading', progress: 0 });

            await invoke('download_video', {
                params: {
                    url: item.url,
                    path: store.downloadOutputPath,
                    format:
                        item.format === 'MP4'
                            ? `bestvideo[height<=${item.height || 720}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${item.height || 720}][ext=mp4]/best`
                            : 'bestaudio/best',
                    is_audio: item.format === 'MP3',
                },
            });

            store.updateQueueItemStatus({ id: item.id, status: 'completed', progress: 100 });

            // 加入歷史記錄
            await store.addHistoryItem({
                title: item.title,
                format: item.format,
                duration: item.duration,
                thumbnail: item.thumbnail,
                quality: item.quality,
            });
        } catch (err) {
            console.error(`Failed to download ${item.title}:`, err);
            store.updateQueueItemStatus({ id: item.id, status: 'error', progress: 0 });
        } finally {
            activeDownloads.value--;
            processNext();
        }
    }

    async function processNext(): Promise<void> {
        if (!store.isQueueProcessing) return;

        const pendingItems = store.downloadQueue.filter((i) => i.status === 'pending');

        // 如果沒有待處理項目且沒有活動中的下載，則結束
        if (pendingItems.length === 0 && activeDownloads.value === 0) {
            finishQueue();
            return;
        }

        // 填滿併發槽
        while (activeDownloads.value < MAX_CONCURRENT_DOWNLOADS && pendingItems.length > 0) {
            const nextItem = pendingItems.shift();
            if (nextItem) {
                // 不使用 await，讓它在背景執行
                downloadItem(nextItem);
            }
        }
    }

    async function startQueue(): Promise<void> {
        if (store.isQueueProcessing) return;

        const pendingCount = store.downloadQueue.filter((i) => i.status === 'pending').length;
        if (pendingCount === 0) return;

        store.setQueueProcessing(true);
        await setupProgressListener();
        processNext();
    }

    function stopQueue(): void {
        store.setQueueProcessing(false);
    }

    function finishQueue(): void {
        store.setQueueProcessing(false);
        if (unlistenProgress.value) {
            unlistenProgress.value();
            unlistenProgress.value = null;
        }

        const completedCount = store.downloadQueue.filter((i) => i.status === 'completed').length;
        if (completedCount > 0) {
            sendNotification({
                title: '佇列下載完成',
                body: `成功下載 ${completedCount} 個影片`,
            });
        }
    }

    // 清理
    onUnmounted(() => {
        if (unlistenProgress.value) {
            unlistenProgress.value();
        }
    });

    return {
        startQueue,
        stopQueue,
        activeDownloads,
    };
}
