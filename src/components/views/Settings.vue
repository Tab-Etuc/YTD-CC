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
  </div>
</template>

<script>
import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api';
import { appDir, downloadDir } from '@tauri-apps/api/path';
import { mapState } from 'vuex';
import { open } from '@tauri-apps/api/dialog';

export default {
  name: 'Settings',

  // data() {
  //   return {
  //     windowControlOnTheLeft: true,
  //   };
  // },

  computed: {
    ...mapState(['windowControlOnTheLeft', 'downloadOutputPath']),
  },

  async created() {
    try {
      var log = await readTextFile('settings.json', {
        dir: BaseDirectory.App,
      });
      if (log == '') throw 'dataIsEmpty';
    } catch (err) {
      // 當 settings.json 不存在時
      if (err.includes('(os error 2)') || err.includes('dataIsEmpty')) {
        const jsonData = {
          WINDOW_CONTROLS_ON_THE_LEFT: this.windowControlOnTheLeft,
          DOWNLOAD_OUTPUT_PATH: await downloadDir(),
        };
        await invoke('write_file', {
          path: `${await appDir()}/settings.json`,
          contents: JSON.stringify(jsonData),
        }).catch((err) => console.log(err));
      } else {
        console.log(err);
      }
    }
    await this.$store.dispatch('Set_Settings_List').catch((err) => {
      console.log(err);
    });
  },

  methods: {
    async WindowControlPositionSettings() {
      try {
        var log = await readTextFile('settings.json', {
          dir: BaseDirectory.App,
        });
        if (log == '') throw 'dataIsEmpty';
      } catch (err) {
        // 當 settings.json 不存在時
        if (err.includes('(os error 2)') || err.includes('dataIsEmpty')) {
          console.log('123');
          const jsonData = {
            WINDOW_CONTROLS_ON_THE_LEFT: this.windowControlOnTheLeft,
            DOWNLOAD_OUTPUT_PATH: await downloadDir(),
          };
          await invoke('write_file', {
            path: `${await appDir()}/settings.json`,
            contents: JSON.stringify(jsonData),
          }).catch((err) => console.log(err));
        } else {
          console.log(err);
        }
      }
      if (log) {
        const jsonData = JSON.parse(log);
        jsonData.WINDOW_CONTROLS_ON_THE_LEFT =
          !jsonData.WINDOW_CONTROLS_ON_THE_LEFT;
        await invoke('write_file', {
          path: `${await appDir()}/settings.json`,
          contents: JSON.stringify(jsonData),
        }).catch((err) => console.log(err));
      }
      console.log(log);
      await this.$store.dispatch('Set_Settings_List').catch((err) => {
        console.log(err);
      });
    },
    async DownloadOutputPathSettings() {
      // Open a selection dialog for directories
      let selected = await open({
        directory: true,
        multiple: false,
        defaultPath: await appDir(),
      });
      if (selected == null) return;
      selected += '\\';

      try {
        var log = await readTextFile('settings.json', {
          dir: BaseDirectory.App,
        });
        if (log == '') throw 'dataIsEmpty';
      } catch (err) {
        // 當 settings.json 不存在時
        if (err.includes('(os error 2)') || err.includes('dataIsEmpty')) {
          const jsonData = {
            WINDOW_CONTROLS_ON_THE_LEFT: this.windowControlOnTheLeft,
            DOWNLOAD_OUTPUT_PATH: selected,
          };
          await invoke('write_file', {
            path: `${await appDir()}/settings.json`,
            contents: JSON.stringify(jsonData),
          }).catch((err) => console.log(err));
        } else {
          console.log(err);
        }
      }

      if (log) {
        const jsonData = JSON.parse(log);
        jsonData.DOWNLOAD_OUTPUT_PATH = selected;
        await invoke('write_file', {
          path: `${await appDir()}/settings.json`,
          contents: JSON.stringify(jsonData),
        }).catch((err) => console.log(err));
      }
      await this.$store.dispatch('Set_Settings_List').catch((err) => {
        console.log(err);
      });
    },
  },
};
</script>
