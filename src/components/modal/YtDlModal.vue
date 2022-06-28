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
        <div
          class="w-[60%] m-auto p-8 bg-slate-800 ring-1 ring-white/10 ring-inset transition-all duration-300 shadow-2xl rounded-lg"
        >
          <div class="flex w-full h-full">
            <img
              :src="`//img.youtube.com/vi/${videoId}/maxresdefault.jpg`"
              alt="YtVideoThumbnail"
              class="w-32 h-[72px] rounded-md"
            />
            <div>
              <span class="text-white text-auto ml-5">{{ videoInfoTitle }}</span>
              <hr class="ml-5 mt-2 w-full content-center h-2" />
            </div>
          </div>

          <div class="text-white">
            <slot>
              default footer
              <button class="float-right text-white" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { invoke } from '@tauri-apps/api'

export default {
  name: 'YtDlModal',
  props: {
    show: Boolean,
    videoId: String,
    videoInfoTitle: String,
    videoInfoItags: String
  },

  methods: {
    check: async function () {
      const onlyaudio = false
      let url_to_choose = ''
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
      for (var itag in video_info_itags) {
        let this_aq = video_info_itags[itag]['audioQuality']
        let this_vq = video_info_itags[itag]['quality']
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
          (((onlyaudio && video_info_itags[itag]['mimeType']) ||
            (!onlyaudio && video_info_itags[itag]['mimeType'])) &&
            (!onlyaudio || video_info_itags[itag]['quality'] != null) &&
            video_info_itags[itag]['audioQuality'] != null &&
            ((onlyaudio && this_vq.is_empty()) ||
              (!onlyaudio && last_vq == '' && this_vq != ''))) ||
          is_better_quality
        ) {
          VIDEO_MIME = video_info_itags[itag]['mimeType']
          url_to_choose = video_info_itags[itag]['url']

          last_vq = this_vq
          last_aq = this_aq
        }
      }
      if (url_to_choose == '') {
        this.showNotify('foo-css', '下載失敗', 'error')
        return
      } else {
        let ext = 'mp4'
        let targetfile =
          video_info_title.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|)/g, '') +
          '.' +
          ext

        console.log(targetfile)
        this.downloadYT(url_to_choose, targetfile, false, ext)
      }
    },
    downloadYT: async function (url, filename, onlyaudio, outputext) {
      let that = this
      setTimeout(async () => {
        console.log('291')
        await invoke('getBarTotalSize').then(totalSize => {
          console.log(totalSize)
          changeBarValue = setInterval(async () => {
            await invoke('getBarSizeNow').then(size => {
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
        that.barValue = '0%'
      })
    },

    does_video_exist: async function (id) {
      var video_info_is_playable,
        video_info_has_details = ''
      await this.get_video_info(id)
        .then(data => {
          video_info_is_playable = data['playabilityStatus']['status']
          video_info_has_details = data['videoDetails']
          if (
            video_info_is_playable == null ||
            video_info_has_details == null ||
            Error
          )
            return
        })
        .catch(err => {
          console.log(err)
        })

      if (video_info_is_playable == 'OK' && video_info_has_details != null)
        return true
    }
  }
}
</script>
