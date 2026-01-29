<template>
    <div class="flex w-full flex-col items-center p-6">
        <p class="mb-4 cursor-default text-center text-xl leading-tight font-medium tracking-wide text-white select-none">
            貼上 Youtube 影片或播放清單連結
        </p>

        <hr class="mb-6 h-px w-2/3 border-0 bg-white/10" />

        <div
            class="relative flex w-full max-w-2xl items-center gap-2 rounded-xl bg-white/5 px-2 py-3 shadow-lg backdrop-blur-sm transition-colors hover:bg-white/10"
        >
            <input
                v-model="inputUrl"
                class="flex-1 rounded-lg bg-transparent px-4 py-2 font-light tracking-wide text-white placeholder-gray-400 outline-none"
                placeholder="影片或播放清單連結..."
                @keyup.enter="handleConfirm(false)"
            />

            <button
                class="mx-1 flex items-center justify-center rounded-lg p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                title="貼上連結"
                @click="handleConfirm(true)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="h-5 w-5 fill-current">
                    <path
                        d="M192 0c-41.8 0-77.4 26.7-90.5 64H48C21.5 64 0 85.5 0 112V464c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H282.5C269.4 26.7 233.8 0 192 0zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm-80 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-16-16-16s7.2-16 16-16z"
                    />
                </svg>
            </button>

            <button
                class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow-lg transition-colors hover:bg-blue-500"
                @click="handleConfirm(false)"
            >
                確認
            </button>
        </div>

        <!-- URL 類型提示 -->
        <div class="mt-3 flex items-center gap-4 text-sm text-slate-400">
            <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z"
                        clip-rule="evenodd"
                    />
                </svg>
                單一影片
            </span>
            <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                播放清單
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { useNotification } from '@kyvg/vue3-notification';

const emit = defineEmits<{
    (e: 'process-url', url: string): void;
}>();

const notify = useNotification();
const inputUrl = ref('');

async function handleConfirm(usingClipboard: boolean): Promise<void> {
    if (usingClipboard) {
        inputUrl.value = (await readText()) || '';
    }

    // Check URL
    if (inputUrl.value.trim() === '') {
        return notify.notify({
            group: 'foo-css',
            title: '請輸入連結！',
            type: 'error',
        });
    }
    
    emit('process-url', inputUrl.value);
    
    // Reset is handled by parent or we can clear it here if needed
    // Usually we clear it only if processing was successful (or started)
    // But in original code it clears it early for playlists, or keeps valid for video ID parsing.
    // For now, let's keep the value until parent decides what to do, OR clear it here.
    // The parent logic relies on `ytUrl` ref. I'll expose a method to clear it or let parent handle clearing.
    // Actually, in Vue, parent can't easily clear child ref without expose or v-model.
    // Let's use v-model for url? Or just clear it here after emit.
    // The original logic clears `ytUrl` in `confirm` function after processing.
}

// Expose clear method for parent
defineExpose({
    clear: () => {
        inputUrl.value = '';
    },
    setUrl: (url: string) => {
        inputUrl.value = url;
    },
    getUrl: () => inputUrl.value
});
</script>
