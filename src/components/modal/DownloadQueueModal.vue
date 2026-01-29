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
            v-if="show"
            class="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
        >
            <div
                class="relative flex h-[85%] w-[80%] flex-col rounded-2xl bg-slate-800 shadow-2xl ring-1 ring-white/10 ring-inset"
            >
                <!-- Header -->
                <header
                    class="flex h-16 w-full shrink-0 items-center justify-between rounded-t-2xl bg-gradient-to-r from-purple-600/80 to-blue-500/80 px-6"
                >
                    <div class="flex items-center gap-4">
                        <svg class="h-6 w-6 fill-white" viewBox="0 0 24 24">
                            <path
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        <p class="text-xl font-medium text-white select-none">
                            下載佇列 ({{ queue.length }})
                        </p>
                    </div>
                    <button
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        @click="emit('close')"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </header>

                <!-- Content -->
                <div class="flex-1 overflow-hidden p-6">
                    <!-- Queue List -->
                    <div class="scrollbar h-full overflow-y-auto">
                        <div
                            v-if="queue.length === 0"
                            class="flex h-full items-center justify-center"
                        >
                            <p class="text-lg text-slate-400">佇列為空</p>
                        </div>

                        <div v-else class="space-y-3">
                            <div
                                v-for="item in queue"
                                :key="item.id"
                                class="flex items-center gap-4 rounded-xl bg-slate-700/50 p-4 ring-1 ring-white/5 ring-inset"
                            >
                                <!-- Thumbnail -->
                                <img
                                    :src="item.thumbnail"
                                    class="h-16 w-28 rounded-lg object-cover"
                                    alt="thumbnail"
                                />

                                <!-- Info -->
                                <div class="min-w-0 flex-1">
                                    <h3 class="truncate font-medium text-white">
                                        {{ item.title }}
                                    </h3>
                                    <div
                                        class="mt-1 flex items-center gap-4 text-sm text-slate-400"
                                    >
                                        <span>{{ item.duration }}</span>
                                        <span class="rounded bg-slate-600 px-2 py-0.5">{{
                                            item.format
                                        }}</span>
                                        <span>{{ item.quality }}</span>
                                    </div>
                                </div>

                                <!-- Status -->
                                <div class="flex items-center gap-3">
                                    <!-- Status indicator -->
                                    <div class="flex items-center gap-2">
                                        <template v-if="item.status === 'pending'">
                                            <span class="h-2 w-2 rounded-full bg-yellow-400"></span>
                                            <span class="text-sm text-yellow-400">等待中</span>
                                        </template>
                                        <template v-else-if="item.status === 'downloading'">
                                            <svg
                                                class="h-5 w-5 animate-spin text-blue-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    class="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    stroke-width="4"
                                                />
                                                <path
                                                    class="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span class="text-sm text-blue-400"
                                                >{{ item.progress }}%</span
                                            >
                                        </template>
                                        <template v-else-if="item.status === 'completed'">
                                            <span class="h-2 w-2 rounded-full bg-green-400"></span>
                                            <span class="text-sm text-green-400">完成</span>
                                        </template>
                                        <template v-else-if="item.status === 'error'">
                                            <span class="h-2 w-2 rounded-full bg-red-400"></span>
                                            <span class="text-sm text-red-400">失敗</span>
                                        </template>
                                    </div>

                                    <!-- Remove button -->
                                    <button
                                        v-if="item.status === 'pending'"
                                        class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-400/10 hover:text-red-400"
                                        @click="removeItem(item.id)"
                                    >
                                        <svg
                                            class="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <footer
                    class="flex h-16 w-full shrink-0 items-center justify-between border-t border-slate-700 px-6"
                >
                    <button
                        :disabled="isProcessing || queue.length === 0"
                        class="rounded-lg px-4 py-2 font-medium text-slate-300 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        @click="clearQueue"
                    >
                        清空佇列
                    </button>

                    <div class="flex gap-3">
                        <button
                            v-if="hasCompletedItems"
                            class="rounded-lg bg-slate-700 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-600"
                            @click="emit('queue-complete')"
                        >
                            清除已完成
                        </button>
                        <button
                            :disabled="isProcessing || pendingCount === 0"
                            class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            @click="startQueueDownload"
                        >
                            {{ isProcessing ? '下載中...' : `開始下載 (${pendingCount})` }}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { useDownloadQueue } from '@/composables/useDownloadQueue';

interface Props {
    show: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
    close: [];
    'queue-complete': [];
}>();

const store = useAppStore();
const { startQueue } = useDownloadQueue();

// Computed
const queue = computed(() => store.downloadQueue);
const isProcessing = computed(() => store.isQueueProcessing);
const pendingCount = computed(() => store.pendingQueueCount);
const hasCompletedItems = computed(() =>
    queue.value.some((item) => item.status === 'completed' || item.status === 'error')
);

// Methods
function removeItem(id: number): void {
    store.removeFromQueue(id);
}

function clearQueue(): void {
    store.clearQueue();
}

async function startQueueDownload(): Promise<void> {
    await startQueue();
}
</script>
