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
      v-if="show"
      class="fixed z-[9998] bottom-0 left-0 w-full h-[calc(100%-32px)] bg-black/50 table transition duration-300 rounded-b-xl"
    >
      <div class="table-cell align-middle">
        <div class="flex w-screen">
          <div
            class="flex w-[60vw] mx-auto p-8 bg-slate-800 ring-1 ring-white/10 ring-inset border-slate-500 border-b transition-all duration-300 shadow-2xl rounded-t-lg justify-center"
          >
            <div class="flex w-full h-full">
              <img
                :src="`//img.youtube.com/vi/${videoId}/maxresdefault.jpg`"
                alt="YtVideoThumbnail"
                class="w-32 h-[72px] rounded-md"
              />
              <div class="w-[80%] h-full ml-3 ">
                <p class="text-white text-lg truncate">
                  {{ this.videoInfoTitle }}
                </p>
                <hr class="mt-2 w-full content-center h-2" />
                <div class="flex space-x-4">
                  <!-- author icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    class="w-6 h-6  fill-white"
                  >
                    <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                    <path
                      d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"
                    />
                  </svg>
                  <span class="text-white text-lg">{{
                    this.videoInfoAuthor
                  }}</span>

                  <!-- play icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 32 32"
                    version="1.1"
                    class="w-6 h-6 first: items-center"
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
                            style="fill:rgb(100%,100%,100%);stroke:none;"
                          />
                        </g>
                      </mask>
                      <clipPath id="clip1">
                        <rect x="0" y="0" width="32" height="32" />
                      </clipPath>
                      <g id="surface5" clip-path="url(#clip1)">
                        <path
                          style=" stroke:none;fill-rule:evenodd;fill:rgb(100%,100%,100%);"
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
                            style="fill:rgb(100%,100%,100%);stroke:none;"
                          />
                        </g>
                      </mask>
                      <clipPath id="clip2">
                        <rect x="0" y="0" width="32" height="32" />
                      </clipPath>
                      <g id="surface8" clip-path="url(#clip2)">
                        <path
                          style=" stroke:none;fill-rule:evenodd;fill:rgb(100%,100%,100%);"
                          d="M 11.96875 9.03125 C 12.351562 8.984375 12.703125 9.054688 13.03125 9.25 C 15.90625 11.167969 18.78125 13.082031 21.65625 15 C 22.324219 15.644531 22.324219 16.292969 21.65625 16.9375 C 18.671875 18.941406 15.671875 20.921875 12.65625 22.875 C 11.972656 23.027344 11.480469 22.789062 11.1875 22.15625 C 11.144531 18.03125 11.144531 13.90625 11.1875 9.78125 C 11.359375 9.429688 11.621094 9.179688 11.96875 9.03125 Z M 12.78125 11.15625 C 12.761719 14.363281 12.78125 17.574219 12.84375 20.78125 C 15.25 19.191406 17.644531 17.589844 20.03125 15.96875 C 17.632812 14.332031 15.214844 12.726562 12.78125 11.15625 Z M 12.78125 11.15625 "
                        />
                      </g>
                    </defs>
                    <g id="surface1">
                      <use xlink:href="#surface5" mask="url(#mask0)" />
                      <use xlink:href="#surface8" mask="url(#mask1)" />
                    </g>
                  </svg>
                  <span class="text-white text-lg ">
                    {{ get_video_duration() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="absolute right-[16vw] z-1 w-8 h-8 fill-red-500"
            @click="$emit('close')"
          >
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"
            />
          </svg>
        </div>

        <div
          class="relative bg-slate-600 mx-auto rounded-b-xl w-[60vw] h-[8vh]  flex"
        >
          <div
            v-if="inDownload"
            class="relative w-[90%] h-6 bg-gray-200 rounded-xl m-auto "
          >
            <div
              :style="{ width: barValue }"
              class="absolute top-0 h-6 rounded-xl shim-green "
            >
              <span class="relative font-medium text-blue-100 my-auto ml-8">{{
                barValue
              }}</span>
            </div>
          </div>

          <div
            v-if="!inDownload"
            class="flex justify-around h-[50%] w-full my-auto mx-3"
          >
            <details class="relative w-[7rem] mr-4 open:z-[1]">
              <summary class="summary">
                <input
                  type="radio"
                  name="item"
                  id="default"
                  title="檔案格式"
                  checked
                />
                <input
                  type="radio"
                  name="item"
                  id="mp3"
                  value="mp3"
                  title="MP3"
                  v-model="fileFormat"
                />
                <input
                  type="radio"
                  name="item"
                  id="mp4"
                  value="mp4"
                  title="MP4"
                  v-model="fileFormat"
                />
              </summary>
              <ul class="list">
                <li>
                  <label for="mp3">
                    MP3
                  </label>
                </li>
                <li>
                  <label for="mp4">MP4</label>
                </li>
              </ul>
            </details>

            <button
              class="flex float-right bg-blue-500 hover:bg-blue-600 w-16 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 h-7"
              @click="check"
            >
              <a
                class="flex text-center text-white items-center justify-center w-full h-full"
                >下載</a
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

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
  content: '';
}

@keyframes shimmer {
  100% {
    transform: translateX(0%);
    opacity: 0;
  }
}

summary {
  cursor: pointer;
  width: 100%;
  height: 1.75rem;
  border-radius: 5px;
  background-color: #ddd;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

details[open] summary:before {
  content: '';
  display: block;
  width: 100vw;
  height: 100vh;
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
}

summary:after {
  position: absolute;
  top: 50%;
  bottom: 70%; /* 不知道為甚麼填 50% 不像置中 ;w;  */
  right: 4px;
  content: '';
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin: auto;
  border-bottom: 1px solid currentColor;
  border-left: 1px solid currentColor;
  border-bottom-left-radius: 2px;
  transform: rotate(45deg) translate(50%, 0%);
  transform-origin: center center;
  transition: transform ease-in-out 100ms;
}

summary:focus {
  outline: none;
}

details[open] summary:after {
  transform: rotate(-45deg) translate(0%, 0%);
}

ul {
  width: 100%;
  background: #ddd;
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  padding: 1rem;
  margin: 0;
  box-sizing: border-box;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
}

li {
  margin: 0;
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
}

li:first-child {
  padding-top: 0;
}

li:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

/* FAKE SELECT */

summary.radios {
  counter-reset: radios;
}

summary.radios:before {
  content: var(--selection);
}

input[type='radio'] {
  counter-increment: radios;
  appearance: none;
  display: none;
}

input[type='radio']:checked {
  display: inline;
  --display: block;
}

input[type='radio']:after {
  content: attr(title);
  display: inline;
  font-size: 1.1rem;
  margin-left: 4px;
}

ul.list {
  counter-reset: labels;
}

label {
  width: 100%;
  display: flex;
  cursor: pointer;
  justify-content: space-between;
}

label span {
  --display: none;
  display: var(--display);
  width: 1rem;
  height: 1rem;
  border: 1px solid #727272;
  border-radius: 3px;
}
</style>

<script>
import { invoke } from '@tauri-apps/api'

export default {
  name: 'YtDlModal',
  props: {
    show: Boolean,
    videoId: String,
    videoInfoTitle: String,
    videoInfoAuthor: String,
    videoInfoItags: Array
  },

  data () {
    return {
      barValue: '0%',
      fileFormat: '',
      inDownload: false
    }
  },

  methods: {
    test: function () {
      console.log(this.fileFormat)
    },
    check: async function () {
      const onlyaudio = false

      if (this.fileFormat == 'mp3') onlyaudio = true

      this.inDownload = true

      let urlToChoose = ''

      // 未來改成使用者自選畫質
      let vq1 = 'tiny'
      let vq2 = 'small'
      let vq3 = 'medium'
      let vq4 = 'large'
      let vq5 = 'hd720'
      let vq6 = 'hd1080'
      let last_vq = ''

      let aq1 = 'AUDIO_QUALITY_LOW'
      let aq2 = 'AUDIO_QUALITY_MEDIUM'
      let aq3 = 'AUDIO_QUALITY_HIGH'

      let last_aq = ''
      for (var itag in this.videoInfoItags) {
        let this_aq = this.videoInfoItags[itag]['audioQuality']
        let this_vq = this.videoInfoItags[itag]['quality']
        let VIDEO_MIME = ''

        let is_better_audio =
          (last_aq == '' && this_aq != '') ||
          (last_aq == aq1 && (this_aq == aq2 || this_aq == aq3)) ||
          (last_aq == aq2 && this_aq == aq3)
        let is_same_or_better_audio = last_aq == this_aq || is_better_audio

        let is_better_video =
          (last_vq == '' && this_vq != '') ||
          (last_vq == vq1 &&
            (this_vq == vq2 ||
              this_vq == vq3 ||
              this_vq == vq4 ||
              this_vq == vq5 ||
              this_vq == vq6)) ||
          (last_vq == vq2 &&
            (this_vq == vq3 ||
              this_vq == vq4 ||
              this_vq == vq5 ||
              this_vq == vq6)) ||
          (last_vq == vq3 &&
            (this_vq == vq4 || this_vq == vq5 || this_vq == vq6)) ||
          (last_vq == vq4 && (this_vq == vq5 || this_vq == vq6)) ||
          (last_vq == vq5 && this_vq == vq6)
        let is_same_or_better_video = last_vq == this_vq || is_better_video

        let is_better_quality =
          (is_better_audio && is_same_or_better_video) ||
          (is_better_video && is_same_or_better_audio) ||
          (onlyaudio && is_better_audio)

        // If audio: Try to download the best audio quality.
        // If video: Try to download the best combination.
        if (
          (((onlyaudio && this.videoInfoItags[itag]['mimeType']) ||
            (!onlyaudio && this.videoInfoItags[itag]['mimeType'])) &&
            (!onlyaudio || this.videoInfoItags[itag]['quality'] != null) &&
            this.videoInfoItags[itag]['audioQuality'] != null &&
            ((onlyaudio && this_vq.is_empty()) ||
              (!onlyaudio && last_vq == '' && this_vq != ''))) ||
          is_better_quality
        ) {
          VIDEO_MIME = this.videoInfoItags[itag]['mimeType']
          urlToChoose = this.videoInfoItags[itag]['url']

          last_vq = this_vq
          last_aq = this_aq
        }
      }
      if (!urlToChoose) {
        this.showNotify('foo-css', '下載失敗', 'error')
        return
      } else {
        let ext = 'mp4'
        let targetfile =
          this.videoInfoTitle.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|)/g, '') +
          '.' +
          ext

        console.log(targetfile)
        this.downloadYT(urlToChoose, targetfile, onlyaudio, ext)
      }
    },

    downloadYT: async function (url, filename, onlyaudio, outputext) {
      let that = this
      setTimeout(async () => {
        await invoke('get_bar_total_size').then(totalSize => {
          console.log(totalSize)
          changeBarValue = setInterval(async () => {
            await invoke('get_bar_size_now').then(size => {
              that.barValue =
                parseInt(Math.round((size / totalSize) * 100)) + '%'
            })
          }, 300)
        })
      }, 1000)
      var changeBarValue

      await invoke('download_yt', {
        url,
        filename,
        onlyaudio,
        outputext
      }).then(() => {
        clearInterval(changeBarValue)
        console.log('已停止迴圈')
        that.$emit('close')
        that.$notify({
          group: 'foo-css',
          title: '影片下載成功！',
          text: `${that.videoInfoTitle}`,
          type: 'success'
        })

        that.barValue = '0%'
        that.inDownload = false
      })
    },

    get_video_duration: function () {
      // 每更新一次進度條，此函式變會調用一次
      // 預計日後直接將 影片時長 存成變數

      console.log(this.videoInfoItags)
      function millisToMinutesAndSeconds (millis) {
        var minutes = Math.floor(millis / 60000)
        var seconds = ((millis % 60000) / 1000).toFixed(0)
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
      }
      return millisToMinutesAndSeconds(
        this.videoInfoItags[0]['approxDurationMs']
      )
    }
  }
}
</script>
