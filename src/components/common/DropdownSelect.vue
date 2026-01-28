<template>
  <div class="relative flex h-10" :class="widthClass">
    <div 
      class="absolute z-0 h-full w-full rounded-lg text-white flex items-center px-3 select-none ring-1 ring-white/20 transition-colors"
      :class="[
        disabled ? 'bg-slate-600 cursor-not-allowed opacity-50' : 'bg-slate-700 cursor-pointer hover:bg-slate-600',
      ]"
      @click.stop="toggleDropdown"
    >
      <slot name="icon" />
      <span class="truncate">{{ modelValue || placeholder }}</span>
      <div 
        v-if="!disabled && !loading"
        class="absolute right-3 top-3 h-2 w-2 border-r-2 border-b-2 border-white transform duration-300"
        :class="isOpen ? 'rotate-[225deg] top-4' : 'rotate-45'"
      ></div>
      <svg 
        v-if="loading" 
        class="absolute right-3 animate-spin h-4 w-4 text-white" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ul
        v-if="isOpen"
        class="absolute mb-1 w-full rounded-lg bg-slate-700 shadow-xl ring-1 ring-white/10 z-50 overflow-hidden"
        :class="[
          dropUp ? 'bottom-full' : 'top-full mt-1',
          maxHeight ? `max-h-[${maxHeight}] overflow-y-auto scrollbar` : ''
        ]"
      >
        <li
          v-for="(option, index) in options"
          :key="option.value ?? option.label ?? index"
          class="relative cursor-pointer select-none p-3 text-white hover:bg-slate-600 transition-colors flex items-center gap-2"
          :class="{ 'border-t border-slate-600': index > 0 }"
          @click.stop="selectOption(option)"
        >
          <component v-if="option.icon" :is="option.icon" class="w-4 h-4" />
          {{ option.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '請選擇' },
  options: { type: Array, required: true }, // [{ label, value, icon? }]
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  dropUp: { type: Boolean, default: true },
  maxHeight: { type: String, default: '12rem' },
  widthClass: { type: String, default: 'w-32' },
});

const emit = defineEmits(['update:modelValue', 'select', 'open', 'close']);

const isOpen = ref(false);

function toggleDropdown() {
  if (props.disabled || props.loading) return;
  isOpen.value = !isOpen.value;
  emit(isOpen.value ? 'open' : 'close');
}

function selectOption(option) {
  emit('update:modelValue', option.label);
  emit('select', option);
  isOpen.value = false;
  emit('close');
}

function closeDropdown(e) {
  if (isOpen.value) {
    isOpen.value = false;
    emit('close');
  }
}

// 點擊外部關閉
onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

// 暴露方法給父元件
defineExpose({ close: () => { isOpen.value = false; } });
</script>
