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
          @click="WindowControlPositionSettings"
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
          @click="SaveHistorySettings"
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

<script>
import { readTextFile, writeTextFile, mkdir, exists, BaseDirectory } from '@tauri-apps/plugin-fs';
import { appDataDir, downloadDir } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';

export default {
  name: 'Settings',

  computed: {
    windowControlOnTheLeft: {
      get() {
        return this.$store.state.windowControlOnTheLeft;
      },
      set(value) {
        this.$store.commit('SET_WINDOW_CONTROLS_ON_THE_LEFT', value);
      }
    },
    downloadOutputPath() {
      return this.$store.state.downloadOutputPath; 
    },
    saveHistory: {
      get() {
        return this.$store.state.saveHistory;
      },
      set(value) {
        this.$store.commit('SET_SAVE_HISTORY', value);
      }
    },
  },

  async created() {
    try {
      // Check if file exists and has content
      let log = '';
      try {
        log = await readTextFile('settings.json', { baseDir: BaseDirectory.AppData });
      } catch (e) {
        // file not found or other error
      }

      if (!log) {
         // Create default settings
         const jsonData = {
          WINDOW_CONTROLS_ON_THE_LEFT: this.windowControlOnTheLeft,
          DOWNLOAD_OUTPUT_PATH: await downloadDir(),
          SAVE_HISTORY: true,
        };
        await this.saveSettingsToFile(jsonData);
      }
    } catch (err) {
      console.error('Error in Settings created hook:', err);
    }
    await this.$store.dispatch('Set_Settings_List').catch(console.error());
  },

  methods: {
    async saveSettingsToFile(jsonData) {
      try {
        const dirExists = await exists('', { baseDir: BaseDirectory.AppData });
        if (!dirExists) {
          await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });
        }
        await writeTextFile('settings.json', JSON.stringify(jsonData), {
          baseDir: BaseDirectory.AppData,
        });
      } catch (err) {
        console.error('Failed to write settings.json', err);
      }
    },

    async WindowControlPositionSettings() {
      try {
        let jsonData = {};
        try {
          const log = await readTextFile('settings.json', { baseDir: BaseDirectory.AppData });
          if (!log) throw new Error('Empty file');
          jsonData = JSON.parse(log);
        } catch {
          // Keep existing settings if possible, or start fresh
          jsonData = {
             DOWNLOAD_OUTPUT_PATH: await downloadDir(),
             SAVE_HISTORY: this.saveHistory
          };
        }

        // Sync file with current store state (updated by v-model)
        jsonData.WINDOW_CONTROLS_ON_THE_LEFT = this.windowControlOnTheLeft;
        
        await this.saveSettingsToFile(jsonData);
        await this.$store.dispatch('Set_Settings_List');
      } catch (err) {
        console.error(err);
      }
    },

    async DownloadOutputPathSettings() {
      // Open a selection dialog for directories
      let selected = await open({
        directory: true,
        multiple: false,
        defaultPath: await appDataDir(),
      });
      if (selected == null) return;
      selected += '\\';

      try {
        let jsonData = {};
         try {
          const log = await readTextFile('settings.json', { baseDir: BaseDirectory.AppData });
          if (!log) throw new Error('Empty');
          jsonData = JSON.parse(log);
        } catch {
             jsonData = {
                WINDOW_CONTROLS_ON_THE_LEFT: this.windowControlOnTheLeft,
                // DOWNLOAD_OUTPUT_PATH updated below
                SAVE_HISTORY: this.saveHistory
            };
        }

        jsonData.DOWNLOAD_OUTPUT_PATH = selected;
        await this.saveSettingsToFile(jsonData);
        await this.$store.dispatch('Set_Settings_List');
      } catch (err) {
        console.error(err);
      }
    },

    async SaveHistorySettings() {
      try {
        let jsonData = {};
        try {
          const log = await readTextFile('settings.json', { baseDir: BaseDirectory.AppData });
          if (!log) throw new Error('Empty');
          jsonData = JSON.parse(log);
        } catch {
            jsonData = {
                WINDOW_CONTROLS_ON_THE_LEFT: this.windowControlOnTheLeft,
                DOWNLOAD_OUTPUT_PATH: await downloadDir(),
                // SAVE_HISTORY updated below
            };
        }

        // Sync file with current store state
        jsonData.SAVE_HISTORY = this.saveHistory;
        
        await this.saveSettingsToFile(jsonData);
        await this.$store.dispatch('Set_Settings_List');
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
#slider-history::before {
  left: 4px !important; 
}
input:checked + #slider-history::before {
  transform: translateX(20px) !important;
}
</style>
