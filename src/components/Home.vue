<template>
  <div class="relative float-left h-screen w-[calc(100%-7rem)]">
    <!-- 右側歷程記錄 History -->
    <History />

    <!-- Main Download Panel -->
    <div
      class="mt-6 h-[33%] w-[55rem] rounded-xl bg-slate-800 shadow-2xl ring-1 ring-inset ring-white/10"
    >
      <Teleport to="body">
        <!-- use the modal component, pass in the prop -->
        <YtDlModal
          :showModal="showYtDlModal"
          :videoId="videoId"
          :videoTitle="videoTitle"
          :videoAuthor="videoAuthor"
          :videoAdaptiveDownloadUrl="videoAdaptiveDownloadUrl"
          :videoDownloadUrl="videoDownloadUrl"
          :videoDuration="videoDuration"
          :videoQualitys="videoQualitys"
          @closeModal="showYtDlModal = false"
        >
        </YtDlModal>
      </Teleport>

      <div class="flex h-full flex-wrap place-content-center justify-center">
        <div class="p-6">
          <p
            class="cursor-defaultmt-2 mb-5 select-none text-center text-xl font-medium leading-tight tracking-wide text-white"
          >
            貼上 Youtube 影片連結
          </p>
          <hr class="mt-3 h-2 w-full content-center" />
          <div>
            <input
              v-model="ytUrl"
              class="focus:shadow-outline mx-2 mt-4 w-[28rem] rounded-full px-3 py-1 pl-5 placeholder-gray-500 outline-indigo-400 transition-all duration-700 ease-in-out hover:w-[30rem]"
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=..."
              @keyup.enter="confirm"
            />

            <button
              class="mx-2 mt-3 w-16 rounded-lg bg-blue-500 p-0.5 text-center text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
              @click="confirm"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Banner  -->
    <div class="absolute mt-3 h-[55%] w-[55rem]">
      <div class="absolute right-0 h-full w-[18rem]">
        <div class="absolute right-0 bottom-0 h-[calc(100%-2rem)] w-[18rem]" />
        <!-- <div
          class="h-full w-full transform rounded-b-xl bg-slate-900/60 transition duration-700 hover:backdrop-blur-sm"
        >
          <header class="flex h-[4rem] w-[18rem] rounded-xl bg-blue-500">
            <div class="my-auto flex h-[2rem] w-[18rem]">
              Bar chart icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                class="static my-auto ml-4 h-7 w-7 fill-white"
                viewBox="0 0 32 32"
                version="1.1"
              >
                <g id="surface1">
                  <path
                    d="M 30 10 L 22 10 L 22 30 L 20 30 L 20 0 L 12 0 L 12 30 L 10 30 L 10 16 L 2 16 L 2 30 L 0 30 L 0 32 L 32 32 L 32 30 L 30 30 Z M 30 10 "
                  />
                </g>
              </svg>
              <p
                class="font-mediu static my-auto ml-3 cursor-default select-none text-xl leading-tight tracking-wide text-white"
              >
                統計
              </p>
            </div>
          </header>
          <DownloadCountChart
            class="m-atuo flex h-[calc(100%-4rem)] w-full items-center"
          /> 
        </div> -->
      </div>
      <img
        class="h-full w-[55rem] rounded-xl object-cover"
        :src="bannerImg"
        alt="banner"
      />
    </div>
  </div>
</template>

<script>
import { Body, fetch } from "@tauri-apps/api/http";

// Components
import History from "./History.vue";
import YtDlModal from "./modal/YtDlModal.vue";
import DownloadCountChart from "./DownloadCountChart.vue";

import bannerImg from "../assets/TDwZG1y.jpg";

export default {
  name: "Home",
  components: {
    History,
    YtDlModal,
    DownloadCountChart,
  },

  data() {
    return {
      ytUrl: "",
      videoId: "",
      videoTitle: "",
      videoAuthor: "",
      videoDownloadUrl: [],
      videoAdaptiveDownloadUrl: [],
      videoDuration: "",
      videoQualitys: [],
      bannerImg: bannerImg,
      showYtDlModal: false,
    };
  },

  methods: {
    async makeRequest(url, options = {}) {
      const response = await fetch(url, {
        body: options.body ?? Body.text(""),
        query: options.query ?? {},
        method: options.method ?? "get",
        headers: options.headers ?? {},
        responseType:
          { JSON: 1, Text: 2, Binary: 3 }[options.responseType] ?? 2,
      });
      if (!response.ok) throw new Error(`${response.status} ${response.data}`);
      if (typeof response.data == JSON) {
        response.data = JSON.parse(response.data);
      }
      return response.data;
    },

    async confirm() {
      // 檢查連結
      if (this.ytUrl == "")
        return this.$notify({
          group: "foo-css",
          title: "請輸入連結！",
          type: "error",
        });
      if (/(www\.youtube\.com|be)(?=\/watch\?v=)/.test(this.ytUrl)) {
        this.videoId = this.ytUrl.split("v=")[1].slice(0, 11);
      } else if (/www\.youtu\.be\//.test(this.ytUrl)) {
        this.videoId = this.ytUrl.split(".be/")[1].slice(0, 11);
      } else {
        return this.$notify({
          group: "foo-css",
          title: "連結無效！",
          type: "error",
        });
      }

      await this.find_video_info(this.videoId)
        .then(() => {
          if (!this.videoTitle || !this.videoAdaptiveDownloadUrl)
            return this.$notify({
              group: "foo-css",
              title: "無法獲取影片資訊，連結無效？",
              text: `${this.videoTitle}`,
              type: "error",
            });
          this.showYtDlModal = true;
        })
        .catch();
    },

    async find_video_info(id) {
      await this.makeRequest(
        "https://youtubei.googleapis.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
        {
          body: Body.json({
            videoId: id,
            context: {
              client: {
                clientName: "ANDROID",
                clientVersion: "16.02",
              },
            },
          }),
          method: "POST",
          responseType: "JSON",
        }
      )
        .then((data) => {
          function millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return (
              minutes + "分鐘 " + (seconds < 10 ? "0" : "") + seconds + "秒"
            );
          }

          [
            this.videoTitle,
            this.videoDownloadUrl,
            this.videoAdaptiveDownloadUrl,
            this.videoAuthor,
            this.videoDuration,
            this.videoQualitys,
          ] = [
            data["videoDetails"]["title"], // String - 影片標題

            data["streamingData"]["formats"].map((a) => {
              var rObj = {};
              rObj["影片畫質"] = a["qualityLabel"];
              rObj["url"] = a["url"];
              return rObj;
            }), // Array - 一般影片下載連結

            data["streamingData"]["adaptiveFormats"]
              .filter((a) => {
                if (a["audioQuality"]) return false;
                if (
                  a["qualityLabel"].includes("144p") ||
                  a["qualityLabel"].includes("360p") ||
                  a["qualityLabel"].includes("720p")
                )
                  return false;
                return true;
              })
              .map((a) => {
                let rObj = {};
                rObj[a["qualityLabel"]] = a["url"];
                return rObj;
              }), //  Array - (僅視訊畫面)影片下載連結

            data["videoDetails"]["author"], // String - 影片上傳者

            millisToMinutesAndSeconds(
              data["streamingData"]["formats"][0]["approxDurationMs"]
            ), // String - 影片時數

            [
              ...new Set( // 移除重複值
                data["streamingData"]["adaptiveFormats"]
                  .filter((a) => !a["audioQuality"]) // 將僅有音訊的檔案排除
                  .map((a) => {
                    return a["qualityLabel"]; // 獲取可下載之影片畫質
                  })
              ),
            ].map(
              (a) => ("720p60" == a && (a = "720p"), a) // 當值為 "720p60" 時替換成 "720p"
            ), // Array - 影片畫質
          ];
        })
        .catch();
      return;
    },
  },
};
</script>
