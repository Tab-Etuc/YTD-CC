<template>
  <Transition
    enter-active-class="duration-500 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-400 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="showModal"
      class="fixed bottom-0 left-0 z-50 table h-[calc(100%-32px)] w-full rounded-b-xl bg-black/50 transition duration-300"
    >
      <div class="table-cell align-middle">
        <div class="flex w-screen">
          <div
            class="mx-auto flex w-[60vw] justify-center rounded-t-lg border-b border-slate-500 bg-slate-800 p-8 shadow-2xl ring-1 ring-inset ring-white/10 transition-all duration-300"
          >
            <div class="flex h-full w-full">
              <img
                :src="`//img.youtube.com/vi/${videoId}/0.jpg`"
                error
                alt="YtVideoThumbnail"
                class="h-[72px] w-32 rounded-md"
              />
              <div class="ml-3 h-full w-[80%]">
                <p class="truncate text-lg text-white">
                  {{ videoTitle }}
                </p>
                <hr class="mt-2 h-2 w-full content-center" />
                <div class="flex space-x-4">
                  <!-- author icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    class="h-6 w-6 fill-white"
                  >
                    <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                    <path
                      d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"
                    />
                  </svg>
                  <span class="w-1/3 truncate text-lg text-white">{{
                    videoAuthor
                  }}</span>

                  <!-- play icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 32 32"
                    version="1.1"
                    class="h-6 w-6"
                  >
                    <defs>
                      <filter
                        id="alpha"
                        filterUnits="objectBoundingBox"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                      >
                        <feColorMatrix
                          type="matrix"
                          in="SourceGraphic"
                          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                        />
                      </filter>
                      <mask id="mask0">
                        <g filter="url(#alpha)">
                          <rect
                            x="0"
                            y="0"
                            width="32"
                            height="32"
                            style="fill: rgb(100%, 100%, 100%); stroke: none"
                          />
                        </g>
                      </mask>
                      <clipPath id="clip1">
                        <rect x="0" y="0" width="32" height="32" />
                      </clipPath>
                      <g id="surface5" clip-path="url(#clip1)">
                        <path
                          style="
                            stroke: none;
                            fill-rule: evenodd;
                            fill: rgb(100%, 100%, 100%);
                          "
                          d="M 14.53125 -0.03125 C 15.488281 -0.03125 16.449219 -0.03125 17.40625 -0.03125 C 23.007812 0.648438 27.226562 3.421875 30.0625 8.28125 C 31.105469 10.25 31.742188 12.332031 31.96875 14.53125 C 31.96875 15.488281 31.96875 16.449219 31.96875 17.40625 C 31.289062 23.007812 28.515625 27.226562 23.65625 30.0625 C 21.6875 31.105469 19.605469 31.742188 17.40625 31.96875 C 16.449219 31.96875 15.488281 31.96875 14.53125 31.96875 C 8.929688 31.289062 4.710938 28.515625 1.875 23.65625 C 0.832031 21.6875 0.195312 19.605469 -0.03125 17.40625 C -0.03125 16.449219 -0.03125 15.488281 -0.03125 14.53125 C 0.648438 8.929688 3.421875 4.710938 8.28125 1.875 C 10.25 0.832031 12.332031 0.195312 14.53125 -0.03125 Z M 15.15625 1.59375 C 20.761719 1.503906 25.105469 3.777344 28.1875 8.40625 C 30.535156 12.398438 30.953125 16.585938 29.4375 20.96875 C 27.324219 26.125 23.523438 29.199219 18.03125 30.1875 C 12.316406 30.792969 7.722656 28.824219 4.25 24.28125 C 1.46875 20.140625 0.886719 15.703125 2.5 10.96875 C 4.335938 6.402344 7.617188 3.433594 12.34375 2.0625 C 13.277344 1.835938 14.214844 1.679688 15.15625 1.59375 Z M 12.78125 11.15625 C 15.214844 12.726562 17.632812 14.332031 20.03125 15.96875 C 17.644531 17.589844 15.25 19.191406 12.84375 20.78125 C 12.78125 17.574219 12.761719 14.363281 12.78125 11.15625 Z M 12.78125 11.15625 "
                        />
                      </g>
                      <mask id="mask1">
                        <g filter="url(#alpha)">
                          <rect
                            x="0"
                            y="0"
                            width="32"
                            height="32"
                            style="fill: rgb(100%, 100%, 100%); stroke: none"
                          />
                        </g>
                      </mask>
                      <clipPath id="clip2">
                        <rect x="0" y="0" width="32" height="32" />
                      </clipPath>
                      <g id="surface8" clip-path="url(#clip2)">
                        <path
                          style="
                            stroke: none;
                            fill-rule: evenodd;
                            fill: rgb(100%, 100%, 100%);
                          "
                          d="M 11.96875 9.03125 C 12.351562 8.984375 12.703125 9.054688 13.03125 9.25 C 15.90625 11.167969 18.78125 13.082031 21.65625 15 C 22.324219 15.644531 22.324219 16.292969 21.65625 16.9375 C 18.671875 18.941406 15.671875 20.921875 12.65625 22.875 C 11.972656 23.027344 11.480469 22.789062 11.1875 22.15625 C 11.144531 18.03125 11.144531 13.90625 11.1875 9.78125 C 11.359375 9.429688 11.621094 9.179688 11.96875 9.03125 Z M 12.78125 11.15625 C 12.761719 14.363281 12.78125 17.574219 12.84375 20.78125 C 15.25 19.191406 17.644531 17.589844 20.03125 15.96875 C 17.632812 14.332031 15.214844 12.726562 12.78125 11.15625 Z M 12.78125 11.15625 "
                        />
                      </g>
                    </defs>
                    <g id="surface1">
                      <use xlink:href="#surface5" mask="url(#mask0)" />
                      <use xlink:href="#surface8" mask="url(#mask1)" />
                    </g>
                  </svg>
                  <span class="w-1/2 text-lg text-white">
                    {{ videoDuration }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="z-1 absolute right-[16vw] h-8 w-8 fill-red-500"
            @click="$emit('closeModal')"
          >
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"
            />
          </svg>
        </div>

        <div
          class="relative mx-auto flex w-[60vw] rounded-b-xl bg-slate-600 p-4"
        >
          <div
            v-if="inDownload"
            class="relative m-auto h-6 w-[90%] rounded-xl bg-gray-200"
          >
            <div
              :style="{ width: barValue }"
              class="shim-green absolute top-0 h-6 rounded-xl"
            >
              <span class="relative my-auto ml-8 font-medium text-blue-100">{{
                barValue
              }}</span>
            </div>
          </div>

          <div
            v-if="!inDownload"
            class="my-auto mx-3 flex w-full justify-around"
          >
            <div class="relative flex h-7 w-[7rem]">
              <input
                type="text"
                class="absolute top-0 left-0 h-full w-full cursor-pointer rounded-md border-none bg-white p-3 shadow-2xl outline-none"
                :placeholder="formatTitle"
                readonly
              />
              <div
                class="absolute h-full w-full cursor-pointer before:absolute before:right-3 before:top-2 before:z-50 before:h-2 before:w-2 before:-rotate-45 before:border-2 before:border-black before:border-t-white before:border-r-white before:duration-300 data-active:before:top-3 data-active:before:-rotate-[225deg]"
                :data-active="formatActive"
                @click="
                  formatActive ? (formatActive = false) : (formatActive = true)
                "
              >
                <ul
                  class="absolute top-9 hidden w-full rounded-b-md bg-white data-active:block"
                  :data-active="formatActive"
                >
                  <li
                    class="relative select-none p-3 hover:bg-blue-400 hover:text-white"
                    @click="this.formatTitle = 'MP3'"
                  >
                    MP3
                  </li>
                  <li
                    class="relative select-none rounded-b-md p-3 hover:bg-blue-400 hover:text-white"
                    @click="this.formatTitle = 'MP4'"
                  >
                    MP4
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="formatTitle != 'MP3'" class="relative flex h-7 w-[7rem]">
              <input
                type="text"
                class="absolute top-0 left-0 h-full w-full cursor-pointer rounded-md border-none bg-white p-3 shadow-2xl outline-none"
                :placeholder="qualityTitle"
                readonly
              />
              <div
                class="absolute h-full w-full cursor-pointer before:absolute before:right-3 before:top-2 before:z-50 before:h-2 before:w-2 before:-rotate-45 before:border-2 before:border-black before:border-t-white before:border-r-white before:duration-300 data-active:before:top-3 data-active:before:-rotate-[225deg]"
                :data-active="qualityActive"
                @click="
                  qualityActive
                    ? (qualityActive = false)
                    : (qualityActive = true)
                "
              >
                <ul
                  class="scrollbar-thumb-rounded-full scrollbar-track-rounded-full absolute top-9 hidden h-[11rem] w-full overflow-auto rounded-b-md bg-white scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-900 hover:scrollbar-thumb-gray-900 data-active:block"
                  :data-active="qualityActive"
                >
                  <li
                    class="relative select-none p-3 last:rounded-b-md hover:bg-blue-400 hover:text-white"
                    v-for="quality in videoQualitys"
                    :key="quality"
                    @click="this.qualityTitle = quality"
                  >
                    {{ quality }}
                  </li>
                </ul>
              </div>
            </div>

            <button
              class="float-right flex h-7 w-16 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
              @click="check"
            >
              <a
                class="flex h-full w-full select-none items-center justify-center text-center text-white"
                >下載
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
// .\ffmpeg-x86_64-pc-windows-msvc.exe -i "../YTD.CC - Temporary Video.mp4" -i "../YTD.CC - Temporary Audio.mp4" -c:v copy -c:a aac output.mp4
import { invoke } from "@tauri-apps/api";

var temAudio = "YTD.CC - Temporary Audio.mp4";
var temVideo = "YTD.CC - Temporary Video.mp4";
var targetfile = "";

export default {
  name: "YtDlModal",
  props: {
    showModal: Boolean,
    videoId: String,
    videoTitle: String,
    videoAuthor: String,
    videoAdaptiveDownloadUrl: Array,
    videoDownloadUrl: Array,
    videoDuration: String,
    videoQualitys: Array,
  },

  data() {
    return {
      barValue: "0%",
      formatTitle: "檔案格式",
      qualityTitle: "影片畫質",
      formatActive: false,
      qualityActive: false,
      inDownload: false,
      needToDownloadAudioFile: false,
      needToMerge: false,
    };
  },

  methods: {
    check: async function () {
      console.log(this.videoAdaptiveDownloadUrl);
      console.log(this.videoDownloadUrl);

      if (this.formatTitle == "檔案格式")
        return this.$notify({
          group: "foo-css",
          title: "請選擇檔案格式！",
          type: "error",
        });

      if (this.qualityTitle == "影片畫質" && this.formatTitle != "MP3")
        return this.$notify({
          group: "foo-css",
          title: "請選擇影片畫質！",
          type: "error",
        });

      this.inDownload = true;

      targetfile =
        this.videoTitle.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|)/g, "") + // Windows 檔案命名規則
        "." +
        "mp4";
      let onlyaudio = false;

      if (this.formatTitle == "MP4") {
        if (this.videoDownloadUrl.includes(this.qualityTitle)) {
          this.downloadToComputer(
            this.videoDownloadUrl.filter(
              (a) => a["影片畫質"] === this.qualityTitle
            )[0]["url"],
            targetfile,
            onlyaudio
          );
        } else {
          console.log(
            this.videoAdaptiveDownloadUrl.filter(
              (a) => a[this.qualityTitle]
            )[0]["1080p"]
          );

          this.needToDownloadAudioFile = true;
          this.needToMerge = true;
          await this.downloadToComputer(
            this.videoAdaptiveDownloadUrl.filter(
              (a) => a[this.qualityTitle]
            )[0][this.qualityTitle],
            temVideo,
            false
          );
        }
      } else {
        onlyaudio = true;
        this.downloadToComputer(
          this.videoDownloadUrl.pop()["url"],
          targetfile,
          onlyaudio
        );
      }
    },

    downloadToComputer: async function (url, filename, onlyaudio) {
      let that = this;
      var changeBarValue;

      // 這邊如果後端的程式沒有在一秒內執行 進度條就不會動了
      // 預計改成由後端發出事件 在此接收後才 invoke('get_bar_total_size')
      setTimeout(async () => {
        await invoke("get_bar_total_size").then((totalSize) => {
          console.log(totalSize);
          changeBarValue = setInterval(async () => {
            await invoke("get_bar_size_now").then((size) => {
              that.barValue =
                parseInt(Math.round((size / totalSize) * 100)) + "%";
            });
          }, 300);
        });
      }, 2000);

      console.log(url);
      await invoke("download_youtube", {
        url,
        filename,
        onlyaudio,
      }).then(() => {
        clearInterval(changeBarValue);
        console.log("已停止迴圈");
        that.barValue = "0%";
        if (that.needToDownloadAudioFile) {
          that.downloadToComputer(
            that.videoDownloadUrl[0]["url"],
            temAudio,
            false
          );
          that.needToDownloadAudioFile = false;
        } else if (that.needToMerge) {
          invoke("merge", { temVideo, temAudio, targetfile });
        } else {
          that.$emit("closeModal");
          that.$notify({
            group: "foo-css",
            title: "影片下載成功！",
            text: `${that.videoTitle}`,
            type: "success",
          });

          that.inDownload = false;
        }
      });
    },
  },
};
</script>

<style>
/* 不知道怎麼改成 TailwindCSS 以後再說ㄅ  */

.shim-green {
  position: relative;
  overflow: hidden;
  background-color: rgba(65, 100, 255, 0.7);
}
.shim-green::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(233, 233, 233, 1) 0,
    rgba(233, 233, 233, 0.9) 50%,
    rgba(233, 233, 233, 0.8) 100%
  );
  animation: shimmer 2s ease-out infinite;
  content: "";
}

@keyframes shimmer {
  100% {
    transform: translateX(0%);
    opacity: 0;
  }
}
</style>
