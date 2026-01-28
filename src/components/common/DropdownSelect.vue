<template>
    <div ref="dropdownRef" class="relative">
        <button
            class="flex w-full items-center justify-between rounded-lg bg-slate-700 px-4 py-2 text-left text-white transition-colors hover:bg-slate-600"
            @click="toggle"
        >
            <span>{{ modelValue || placeholder }}</span>
            <svg
                class="h-4 w-4 transition-transform"
                :class="{ 'rotate-180': isOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </button>

        <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div
                v-if="isOpen"
                class="absolute z-10 mt-1 w-full overflow-hidden rounded-lg bg-slate-700 shadow-lg ring-1 ring-white/10"
            >
                <ul class="scrollbar max-h-60 overflow-auto">
                    <li
                        v-for="option in options"
                        :key="option.value"
                        class="cursor-pointer px-4 py-2 text-white transition-colors hover:bg-slate-600"
                        :class="{ 'bg-blue-600/30': modelValue === option.label }"
                        @click="selectOption(option)"
                    >
                        {{ option.label }}
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { DropdownOption } from '@/types';

interface Props {
    modelValue: string;
    options: DropdownOption[];
    placeholder?: string;
}

defineProps<Props>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
    select: [option: DropdownOption];
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function toggle(): void {
    isOpen.value = !isOpen.value;
}

function selectOption(option: DropdownOption): void {
    emit('update:modelValue', option.label);
    emit('select', option);
    isOpen.value = false;
}

function handleClickOutside(event: MouseEvent): void {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
