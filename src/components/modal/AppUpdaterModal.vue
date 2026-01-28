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
                class="relative flex w-96 flex-col rounded-2xl bg-slate-800 p-6 shadow-2xl ring-1 ring-white/10 ring-inset"
            >
                <!-- Header -->
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <svg
                            class="h-6 w-6 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        <h2 class="text-lg font-bold text-white">應用程式更新</h2>
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
                </div>

                <!-- Content -->
                <div class="py-4 text-center">
                    <p v-if="isChecking" class="text-slate-400">正在檢查更新...</p>
                    <p v-else-if="updateAvailable" class="text-slate-300">
                        發現新版本：
                        <span class="font-medium text-blue-400">{{ version }}</span>
                    </p>
                    <p v-else class="text-green-400">您已是最新版本</p>
                </div>

                <!-- Actions -->
                <div class="mt-4 flex gap-3">
                    <button
                        class="flex-1 rounded-lg bg-slate-700 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-600"
                        @click="emit('close')"
                    >
                        關閉
                    </button>
                    <button
                        v-if="updateAvailable"
                        class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-500"
                        @click="emit('install')"
                    >
                        立即更新
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
interface Props {
    show: boolean;
    isChecking?: boolean;
    updateAvailable?: boolean;
    version?: string;
}

defineProps<Props>();

const emit = defineEmits<{
    close: [];
    install: [];
}>();
</script>
