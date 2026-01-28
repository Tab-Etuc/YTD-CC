<template>
  <div class="mt-6 h-full w-[calc(100%-7rem)]">
    <p
      class="mb-10 flex w-full select-none justify-center text-4xl font-extrabold leading-tight tracking-wide text-blue-400"
    >
      設定
    </p>
    <div
      class="m-auto mt-6 flex h-20 w-[70%] justify-between rounded-xl bg-slate-700 p-4 shadow-2xl ring-1 ring-inset ring-white/10"
    >
      <p class="flex items-center text-lg font-extrabold text-white">
        視窗控制器 位置
      </p>
      <div class="flex items-center">
        <input
          type="checkbox"
          id="window-controls-position-switch-toggle"
          class="hidden"
          v-model="windowControlOnTheLeft"
          checked
        />
        <label
          for="window-controls-position-switch-toggle"
          id="slider"
          class="slider relative mr-4 h-6 w-12 cursor-pointer rounded-full bg-indigo-600"
        ></label>
        <label class="font-extrabold text-white">{{
          windowControlOnTheLeft ? '左' : '右'
        }}</label>
      </div>
    </div>

    <div
      class="m-auto mt-6 flex h-20 w-[70%] justify-between rounded-xl bg-slate-700 p-4 shadow-2xl ring-1 ring-inset ring-white/10"
    >
      <p class="flex items-center text-lg font-extrabold text-white">
        影片輸出 位置
      </p>
      <div
        class="my-auto flex h-10 w-[80%] cursor-pointer rounded bg-slate-900/70 ring-1 ring-inset ring-blue-500"
      >
        <a
          class="ml-4 flex h-full w-full select-none items-center text-white"
          @click="DownloadOutputPathSettings"
        >
          {{ downloadOutputPath }}
        </a>
      </div>
    </div>

    <div
      class="m-auto mt-6 flex h-20 w-[70%] justify-between rounded-xl bg-slate-700 p-4 shadow-2xl ring-1 ring-inset ring-white/10"
    >
      <p class="flex items-center text-lg font-extrabold text-white">
        是否儲存影片歷史紀錄
      </p>
      <div class="flex items-center">
        <input
          type="checkbox"
          id="save-history-switch-toggle"
          class="hidden"
          v-model="saveHistory"
          checked
        />
        <label
          for="save-history-switch-toggle"
          id="slider-history"
          class="slider relative mr-4 h-6 w-12 cursor-pointer rounded-full transition-colors duration-300"
          :class="saveHistory ? 'bg-green-400' : 'bg-red-400'"
        ></label>
        <label class="font-extrabold text-white">{{
          saveHistory ? '是' : '否'
        }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { invoke } from '@tauri-apps/api/core';
import { appDataDir, downloadDir } from '@tauri-apps/api/path';
import { open as openDialog } from '@tauri-apps/plugin-dialog';

const store = useStore();

const windowControlOnTheLeft = computed({
  get: () => store.state.windowControlOnTheLeft,
  set: (val) => {
    store.commit('SET_WINDOW_CONTROLS_ON_THE_LEFT', val);
    saveAllSettings();
  }
});

const downloadOutputPath = computed(() => store.state.downloadOutputPath);

const saveHistory = computed({
  get: () => store.state.saveHistory,
  set: (val) => {
    store.commit('SET_SAVE_HISTORY', val);
    saveAllSettings();
  }
});

const saveSettings = async (settings) => {
  try {
    await invoke('save_settings', { settings });
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
};

const saveAllSettings = async () => {
  try {
    const currentSettings = {
        WINDOW_CONTROLS_ON_THE_LEFT: store.state.windowControlOnTheLeft,
        DOWNLOAD_OUTPUT_PATH: store.state.downloadOutputPath,
        SAVE_HISTORY: store.state.saveHistory,
        BANNER_IMAGE: store.state.bannerImage || ''
    };
    
    await saveSettings(currentSettings);
    await store.dispatch('Set_Settings_List');
  } catch (err) {
    console.error(err);
  }
};

const DownloadOutputPathSettings = async () => {
  let selected = await openDialog({
    directory: true,
    multiple: false,
    defaultPath: await appDataDir(),
  });
  if (selected == null) return;
  

  try {
    const currentSettings = {
        WINDOW_CONTROLS_ON_THE_LEFT: store.state.windowControlOnTheLeft,
        DOWNLOAD_OUTPUT_PATH: selected,
        SAVE_HISTORY: store.state.saveHistory,
        BANNER_IMAGE: store.state.bannerImage || ''
    };

    await saveSettings(currentSettings);
    await store.dispatch('Set_Settings_List');
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await store.dispatch('Set_Settings_List').catch(console.error());
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
