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
                    class="flex h-16 w-full shrink-0 items-center justify-between rounded-t-2xl bg-gradient-to-r from-green-600/80 to-blue-500/80 px-6"
                >
                    <div class="flex items-center gap-4">
                        <svg class="h-6 w-6 fill-white" viewBox="0 0 20 20">
                            <path
                                d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                            />
                        </svg>
                        <p class="text-xl font-medium text-white select-none">播放清單</p>
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

                <!-- Loading State -->
                <div v-if="isLoading" class="flex flex-1 items-center justify-center">
                    <div class="text-center">
                        <svg
                            class="mx-auto h-12 w-12 animate-spin text-blue-400"
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
                        <p class="mt-4 text-slate-400">載入播放清單中...</p>
                    </div>
                </div>

                <!-- Content -->
                <div v-else class="flex flex-1 gap-6 overflow-hidden p-6">
                    <!-- Left: Playlist Info & Options -->
                    <div class="flex w-1/3 flex-col">
                        <!-- Playlist Info -->
                        <div class="mb-6">
                            <div class="mb-4 aspect-video overflow-hidden rounded-xl bg-slate-700">
                                <img
                                    v-if="playlistData?.thumbnail"
                                    :src="playlistData.thumbnail"
                                    class="h-full w-full object-cover"
                                    alt="Playlist thumbnail"
                                />
                            </div>
                            <h2 class="line-clamp-2 text-lg font-bold text-white">
                                {{ playlistData?.title || '未命名播放清單' }}
                            </h2>
                            <p class="mt-1 text-sm text-slate-400">
                                {{ playlistData?.uploader }} · {{ playlistData?.count }} 部影片
                            </p>
                        </div>

                        <!-- Options -->
                        <div class="space-y-4">
                            <!-- Format Selection -->
                            <div>
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
                            <div>
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

                            <!-- Selection Actions -->
                            <div class="flex gap-2">
                                <button
                                    class="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-600"
                                    @click="selectAll"
                                >
                                    全選
                                </button>
                                <button
                                    class="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-600"
                                    @click="deselectAll"
                                >
                                    取消全選
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Video List -->
                    <div class="flex flex-1 flex-col overflow-hidden">
                        <div class="mb-4 flex items-center justify-between">
                            <p class="text-sm text-slate-400">
                                已選擇 {{ selectedCount }} / {{ videos.length }} 部影片
                            </p>
                        </div>

                        <div class="scrollbar flex-1 space-y-2 overflow-y-auto">
                            <div
                                v-for="video in videos"
                                :key="video.id"
                                class="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors"
                                :class="
                                    video.selected
                                        ? 'bg-blue-600/20 ring-1 ring-blue-500/50'
                                        : 'bg-slate-700/50 hover:bg-slate-700'
                                "
                                @click="toggleSelect(video)"
                            >
                                <!-- Checkbox -->
                                <div
                                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors"
                                    :class="
                                        video.selected
                                            ? 'border-blue-600 bg-blue-600'
                                            : 'border-slate-500'
                                    "
                                >
                                    <svg
                                        v-if="video.selected"
                                        class="h-3 w-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </div>

                                <!-- Thumbnail -->
                                <img
                                    :src="video.thumbnail"
                                    class="h-12 w-20 shrink-0 rounded object-cover"
                                    alt="Video thumbnail"
                                />

                                <!-- Info -->
                                <div class="min-w-0 flex-1">
                                    <h4 class="truncate text-sm font-medium text-white">
                                        {{ video.title }}
                                    </h4>
                                    <p class="text-xs text-slate-400">{{ video.duration }}</p>
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
                        class="rounded-lg px-4 py-2 font-medium text-slate-300 transition-colors hover:bg-slate-700"
                        @click="emit('close')"
                    >
                        取消
                    </button>

                    <button
                        :disabled="selectedCount === 0"
                        class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        @click="confirmSelection"
                    >
                        加入佇列 ({{ selectedCount }})
                    </button>
                </footer>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import DropdownSelect from '@/components/common/DropdownSelect.vue';
import type {
    PlaylistData,
    PlaylistVideoItem,
    PlaylistDownloadOptions,
    DropdownOption,
} from '@/types';

interface Props {
    show: boolean;
    playlistData: PlaylistData | null;
    isLoading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    close: [];
    confirm: [videos: PlaylistVideoItem[], options: PlaylistDownloadOptions];
}>();

// State
const videos = ref<PlaylistVideoItem[]>([]);
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

// Computed
const selectedCount = computed(() => videos.value.filter((v) => v.selected).length);

// Watchers
watch(
    () => props.playlistData,
    (data) => {
        if (data) {
            videos.value = data.entries.map((entry) => ({ ...entry }));
        } else {
            videos.value = [];
        }
    },
    { immediate: true }
);

// Methods
function handleQualitySelect(option: DropdownOption): void {
    selectedQuality.value = option.label;
    selectedQualityHeight.value = option.height || 720;
}

function handleAudioQualitySelect(option: DropdownOption): void {
    selectedAudioQuality.value = option.label;
    selectedAudioBitrate.value = option.bitrate || '192';
}

function toggleSelect(video: PlaylistVideoItem): void {
    video.selected = !video.selected;
}

function selectAll(): void {
    videos.value.forEach((v) => (v.selected = true));
}

function deselectAll(): void {
    videos.value.forEach((v) => (v.selected = false));
}

function confirmSelection(): void {
    const selected = videos.value.filter((v) => v.selected);
    const options: PlaylistDownloadOptions = {
        format: selectedFormat.value,
        quality: selectedQuality.value,
        height: selectedQualityHeight.value,
        audioQuality: selectedAudioQuality.value,
        bitrate: selectedAudioBitrate.value,
    };
    emit('confirm', selected, options);
}
</script>
