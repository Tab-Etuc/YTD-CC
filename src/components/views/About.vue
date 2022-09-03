<template>
  <div class="float-left mt-6 h-screen w-[calc(100%-7rem)] overflow-hidden">
    <div class="relative float-left h-[90%] w-[22vw]">
      <img src="../../assets/YTD.CC.png" class="mx-auto my-4 w-[60%]" />
      <hr class="w-full" />
      <button
        class="mx-auto my-5 flex h-8 rounded-md border-t border-slate-600 bg-slate-800 hover:bg-slate-700"
        @click="checkAppUpdate()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          class="my-auto mx-3 h-6 w-6 fill-white"
        >
          <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M144 480C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144zM303 392.1C312.4 402.3 327.6 402.3 336.1 392.1L416.1 312.1C426.3 303.6 426.3 288.4 416.1 279C407.6 269.7 392.4 269.7 383 279L344 318.1V184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184V318.1L256.1 279C247.6 269.7 232.4 269.7 223 279C213.7 288.4 213.7 303.6 223 312.1L303 392.1z"
          />
        </svg>
        <a class="my-auto mr-3 text-blue-200">檢查更新</a>
      </button>

      <button
        class="mx-auto my-5 flex h-8 rounded-md border-t border-slate-500 bg-slate-700 hover:bg-slate-600"
        @click="openLink('https://github.com/Tab-Etuc/YTD-CC/issues/new')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="my-auto mx-3 h-5 w-5 fill-white"
        >
          <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M493.6 163c-24.88-19.62-45.5-35.37-164.3-121.6C312.7 29.21 279.7 0 256.4 0H255.6C232.3 0 199.3 29.21 182.6 41.38c-118.8 86.25-139.4 101.1-164.3 121.6C6.75 172 0 186 0 200.8v263.2C0 490.5 21.49 512 48 512h416c26.51 0 48-21.49 48-47.1V200.8C512 186 505.3 172 493.6 163zM303.2 367.5C289.1 378.5 272.5 384 256 384s-33.06-5.484-47.16-16.47L64 254.9V208.5c21.16-16.59 46.48-35.66 156.4-115.5c3.18-2.328 6.891-5.187 10.98-8.353C236.9 80.44 247.8 71.97 256 66.84c8.207 5.131 19.14 13.6 24.61 17.84c4.09 3.166 7.801 6.027 11.15 8.478C400.9 172.5 426.6 191.7 448 208.5v46.32L303.2 367.5z"
          />
        </svg>
        <a class="my-auto mr-3 text-blue-200">回報問題</a>
      </button>

      <button
        class="mx-auto my-5 flex h-8 rounded-md border-t border-slate-500 bg-slate-700 hover:bg-slate-600"
        @click="openLink('https://github.com/Tab-Etuc/YTD-CC')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 496 512"
          class="my-auto mx-3 h-6 w-6 fill-white"
        >
          <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
          />
        </svg>
        <a class="my-auto mr-3 text-blue-200">Github 專案</a>
      </button>
    </div>

    <div class="mx-5 h-[90%] w-[calc(100%-22vw)] overflow-x-hidden scrollbar">
      <div class="">
        <div class="mb-10">
          <p
            class="cursor-defaultmt-2 mb-10 select-none text-4xl font-extrabold leading-tight tracking-wide text-blue-400"
          >
            關於
          </p>

          <p
            class="cursor-defaultmt-2 ml-4 mb-10 select-none text-base font-extrabold leading-tight tracking-wide text-red-100"
          >
            YTD.CC 版本: {{ appVersion || '不明' }}
          </p>
          <div class="flex w-full">
            <img
              src="../../assets/tauri_logo_dark.svg"
              alt=""
              class="my-auto mx-5 h-12"
            />
            <img src="../../assets/vue_logo.svg" alt="" class="mx-5 h-14" />
          </div>
          <img
            src="../../assets/tailwindcss-logotype-white.svg"
            alt=""
            class="mx-5 mt-8 h-10"
          />
        </div>

        <div>
          <p
            class="cursor-defaultmt-2 mb-10 select-none text-4xl font-extrabold leading-tight tracking-wide text-blue-400"
          >
            開發者
          </p>
          <div class="mb-10 flex h-32 w-full">
            <img
              src="../../assets/about_avatar.webp"
              alt=""
              class="h-28 w-28 rounded-full"
            />
            <div>
              <p
                class="cursor-defaultmt-2 mt-5 ml-12 select-none text-xl font-extrabold leading-tight tracking-wide text-red-100"
              >
                Tab Etuc
              </p>
              <a
                class="ml-12 mt-3 flex cursor-pointer text-teal-400 underline"
                @click="openLink('https://github.com/Tab-Etuc')"
                >Github Profile</a
              >
            </div>
          </div>
        </div>

        <div>
          <p
            class="cursor-defaultmt-2 mb-10 select-none text-4xl font-extrabold leading-tight tracking-wide text-blue-400"
          >
            圖源
          </p>
          <ul
            class="cursor-defaultmt-2 mt-5 ml-12 select-none text-xl font-extrabold leading-tight tracking-wide text-red-100"
          >
            <p class="">•首頁 橫幅</p>
            <li
              class="mt-3 cursor-pointer text-sm text-teal-400 underline"
              @click="
                openLink(
                  'https://twitter.com/dabidabi76/status/1369344876555481092'
                )
              "
            >
              https://twitter.com/dabidabi76/status/1369344876555481092
            </li>
          </ul>
          <ul
            class="cursor-defaultmt-2 mt-5 ml-12 select-none text-xl font-extrabold leading-tight tracking-wide text-red-100"
          >
            <p class="">•頭像</p>
            <li
              class="my-3 text-sm text-teal-400 underline"
              @click="openLink('https://www.pixiv.net/artworks/86231494')"
            >
              https://www.pixiv.net/artworks/86231494
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { open } from '@tauri-apps/api/shell';
import { getVersion } from '@tauri-apps/api/app';
import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
} from '@tauri-apps/api/updater';

export default {
  name: 'About',
  components: {},

  data() {
    return {
      appVersion: '',
    };
  },

  async created() {
    this.appVersion = await getVersion();
  },

  methods: {
    async openLink(URL) {
      await open(URL);
    },

    async checkAppUpdate() {
      console.log('123');
      const update = await checkUpdate().then(() => console.log('1233'));
      const unlisten = await onUpdaterEvent(({ error, status }) => {
        console.log('Updater event', error, status);
      });
      console.log(update);
      if (update.shouldUpdate) {
        console.log(
          `Installing update ${update.manifest?.version}, ${update.manifest?.date}, ${update.manifest.body}`
        );
        await installUpdate();
      }
    },
  },
};
</script>
