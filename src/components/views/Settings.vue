<template>
    <div class="mt-6 h-full w-[calc(100%-7rem)]">
        <p
            class="mb-10 flex w-full justify-center text-4xl leading-tight font-extrabold tracking-wide text-blue-400 select-none"
        >
            設定
        </p>
        <div
            class="m-auto mt-6 flex h-20 w-[70%] justify-between rounded-xl bg-slate-700 p-4 shadow-2xl ring-1 ring-white/10 ring-inset"
        >
            <p class="flex items-center text-lg font-extrabold text-white">視窗控制器 位置</p>
            <div class="flex items-center">
                <input
                    id="window-controls-position-switch-toggle"
                    v-model="windowControlOnTheLeft"
                    type="checkbox"
                    class="hidden"
                    checked
                />
                <label
                    id="slider"
                    for="window-controls-position-switch-toggle"
                    class="slider relative mr-4 h-6 w-12 cursor-pointer rounded-full bg-indigo-600"
                ></label>
                <label class="font-extrabold text-white">{{
                    windowControlOnTheLeft ? '左' : '右'
                }}</label>
            </div>
        </div>

        <div
            class="m-auto mt-6 flex h-20 w-[70%] justify-between rounded-xl bg-slate-700 p-4 shadow-2xl ring-1 ring-white/10 ring-inset"
        >
            <p class="flex items-center text-lg font-extrabold text-white">影片輸出 位置</p>
            <div
                class="my-auto flex h-10 w-[80%] cursor-pointer rounded bg-slate-900/70 ring-1 ring-blue-500 ring-inset"
            >
                <a
                    class="ml-4 flex h-full w-full items-center text-white select-none"
                    @click="selectDownloadOutputPath"
                >
                    {{ downloadOutputPath }}
                </a>
            </div>
        </div>

        <div
            class="m-auto mt-6 flex h-20 w-[70%] justify-between rounded-xl bg-slate-700 p-4 shadow-2xl ring-1 ring-white/10 ring-inset"
        >
            <p class="flex items-center text-lg font-extrabold text-white">是否儲存影片歷史紀錄</p>
            <div class="flex items-center">
                <input
                    id="save-history-switch-toggle"
                    v-model="saveHistory"
                    type="checkbox"
                    class="hidden"
                    checked
                />
                <label
                    id="slider-history"
                    for="save-history-switch-toggle"
                    class="slider relative mr-4 h-6 w-12 cursor-pointer rounded-full transition-colors duration-300"
                    :class="saveHistory ? 'bg-green-400' : 'bg-red-400'"
                ></label>
                <label class="font-extrabold text-white">{{ saveHistory ? '是' : '否' }}</label>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { appDataDir } from '@tauri-apps/api/path';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { useAppStore } from '@/stores/app';
import type { AppSettings } from '@/types';

defineOptions({
    name: 'Settings',
});

const store = useAppStore();

// Computed with v-model support
const windowControlOnTheLeft = computed({
    get: () => store.windowControlOnTheLeft,
    set: (val: boolean) => {
        store.setWindowControlsOnTheLeft(val);
        saveAllSettings();
    },
});

const downloadOutputPath = computed(() => store.downloadOutputPath);

const saveHistory = computed({
    get: () => store.saveHistory,
    set: (val: boolean) => {
        store.setSaveHistory(val);
        saveAllSettings();
    },
});

// Methods
async function saveSettings(settings: AppSettings): Promise<void> {
    try {
        await invoke('save_settings', { settings });
    } catch (err) {
        console.error('Failed to save settings:', err);
    }
}

async function saveAllSettings(): Promise<void> {
    try {
        const currentSettings: AppSettings = {
            WINDOW_CONTROLS_ON_THE_LEFT: store.windowControlOnTheLeft,
            DOWNLOAD_OUTPUT_PATH: store.downloadOutputPath,
            SAVE_HISTORY: store.saveHistory,
            BANNER_IMAGE: store.bannerImage || '',
        };

        await saveSettings(currentSettings);
        await store.fetchSettings();
    } catch (err) {
        console.error(err);
    }
}

async function selectDownloadOutputPath(): Promise<void> {
    const selected = await openDialog({
        directory: true,
        multiple: false,
        defaultPath: await appDataDir(),
    });

    if (selected === null) {
        return;
    }

    try {
        const currentSettings: AppSettings = {
            WINDOW_CONTROLS_ON_THE_LEFT: store.windowControlOnTheLeft,
            DOWNLOAD_OUTPUT_PATH: selected as string,
            SAVE_HISTORY: store.saveHistory,
            BANNER_IMAGE: store.bannerImage || '',
        };

        await saveSettings(currentSettings);
        await store.fetchSettings();
    } catch (err) {
        console.error(err);
    }
}

// Lifecycle
onMounted(async () => {
    await store.fetchSettings().catch(console.error);
});
</script>

<style scoped>
#slider-history::before {
    left: 4px !important;
}
input:checked + #slider-history::before {
    transform: translateX(20px) !important;
}
</style>
