<template>
    <div
        class="group relative min-h-0 w-full flex-1 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 ring-inset"
    >
        <div class="pointer-events-none absolute bottom-4 left-5 z-10 w-full">
            <div
                class="pointer-events-auto flex h-10 w-fit max-w-[2.5rem] items-center overflow-hidden rounded-full bg-slate-800/80 shadow-lg ring-1 ring-white/10 backdrop-blur transition-all duration-500 ease-out hover:max-w-[90%] hover:pr-4"
                @mouseover="showBannerLink = true"
                @mouseleave="showBannerLink = false"
            >
                <div
                    class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center text-white transition-colors hover:text-blue-400"
                    @click.stop="changeBanner"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-4 w-4 fill-current">
                        <path
                            d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                        />
                    </svg>
                </div>

                <div
                    class="ml-1 flex items-center overflow-hidden whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                    <p class="mr-2 shrink-0 text-sm font-bold text-white">圖源：</p>
                    <a
                        v-if="bannerImage"
                        class="cursor-pointer truncate text-sm text-blue-400 underline hover:text-blue-300"
                        @click="openLink(bannerImage)"
                    >
                        {{ bannerImage }}
                    </a>
                    <a
                        v-else
                        class="cursor-pointer truncate text-sm text-blue-400 underline hover:text-blue-300"
                        @click="openLink('https://twitter.com/dabidabi76/status/1369344876555481092')"
                    >
                        twitter.com/dabidabi76
                    </a>
                </div>
            </div>
        </div>
        <img
            class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            :src="bannerImg"
            alt="banner"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { open } from '@tauri-apps/plugin-shell';
import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { readFile } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';
import { useAppStore } from '@/stores/app';
import defaultBannerImg from '@/assets/home_banner.webp';

const store = useAppStore();

// State
const bannerImg = ref(defaultBannerImg);
const showBannerLink = ref(false);
const currentObjectUrl = ref<string | null>(null);

// Computed
const bannerImage = computed(() => store.bannerImage);
const downloadOutputPath = computed(() => store.downloadOutputPath);
const windowControlOnTheLeft = computed(() => store.windowControlOnTheLeft);
const saveHistory = computed(() => store.saveHistory);

// Watchers
watch(
    bannerImage,
    async (newPath) => {
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
                // Fallback to default if loading failed
                bannerImg.value = defaultBannerImg;
            }
        } else {
             bannerImg.value = defaultBannerImg;
        }
    },
    { immediate: true }
);

// Methods
async function changeBanner(): Promise<void> {
    const file = await openFileDialog({
        multiple: false,
        directory: false,
        filters: [
            {
                name: 'Images',
                extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
            },
        ],
    });

    if (file) {
        try {
            const contents = await readFile(file as string);
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
                        BANNER_IMAGE: file,
                    },
                });

                store.setBannerImage(file as string);
            } catch (err) {
                console.error('Failed to save banner setting:', err);
            }
        } catch (err) {
            console.error('Failed to set banner:', err);
        }
    }
}

async function openLink(url: string): Promise<void> {
    if (url.startsWith('http')) {
        await open(url);
    } else {
        // Use custom Rust command to open in explorer
        invoke('show_in_folder', { path: url });
    }
}
</script>
