import { http, invoke } from '@tauri-apps/api'
import { Body } from '@tauri-apps/api/http'


async function makeRequest (url, options = {}) {
  if (options.query) {
    const keys = Object.keys(options.query)
    for (let i = 0; i < keys.length; i++) {
      const value = options.query[keys[i]]
      if (value !== undefined) options.query[keys[i]] = value.toString()
    }
  }
  const response = await invoke('web_request', {
    url,
    body: options.body ?? http.Body.json({}),
    method: options.method ?? 'GET',
    query: options.query ?? {},
    headers: options.headers ?? {},
    responseType: { JSON: 1, Text: 2, Binary: 3 }[options.responseType] ?? 1
  })
  return response.data
}
async function download (url, filename, onlyaudio, outputext) {
  await invoke('download_yt', {
    url,
    filename,
    onlyaudio,
    outputext
  }).then((message) => console.log(message))
}
// https://kevintsengtw.blogspot.com/2011/09/javascript-stringformat.html?
String.prototype.format = function () {
  var txt = this.toString()
  for (var i = 0; i < arguments.length; i++) {
    var exp = getStringFormatPlaceHolderRegEx(i)
    arguments[i] = String(arguments[i]).replace(/\$/gm, '♒☯◈∭')
    txt = txt.replace(exp, arguments[i] == null ? '' : arguments[i])
    txt = txt.replace(/♒☯◈∭/gm, '$')
  }
  return cleanStringFormatResult(txt)
}
function getStringFormatPlaceHolderRegEx (placeHolderIndex) {
  return new RegExp('({)?\\{' + placeHolderIndex + '\\}(?!})', 'gm')
}
function cleanStringFormatResult (txt) {
  if (txt == null) return ''
  return txt.replace(getStringFormatPlaceHolderRegEx('\\d+'), '')
}

async function find_video_info (id) {
  let video_info_title, video_info_itags

  await get_video_info(id).then(data => {
    ;[video_info_title, video_info_itags] = [
      data['videoDetails']['title'],
      data['streamingData']['formats']
    ]
  })
  return [video_info_title, video_info_itags]
}
async function get_video_info (id) {
  const req = await makeRequest(
    'https://youtubei.googleapis.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
    {
      body: Body.json({
        videoId: id,
        context: {
          client: {
            clientName: 'ANDROID',
            clientVersion: '16.02'
          }
        }
      }),
      method: 'POST',
      responseType: 'JSON'
    }
  )
  return req
}
async function does_video_exist (id) {
  var video_info_is_playable,
    video_info_has_details = ''
  await get_video_info(id)
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

export default function main (url) {
  const onlyaudio = false
  if (/v=/.test(url)) {
    let data = url.split('v=')
    var id = data[1].slice(0, 11)
  } else {
    let data = url.split('.be/')
    var id = data[1].slice(0, 11)
  }

  does_video_exist(id)
    .then(data => {
      if (data != true) {
        showNotify('foo-css', '無法獲取影片資訊，連結無效？', 'error')
        return
      } else {
        let video_info_title = ''
        let video_info_itags = ''

        find_video_info(id)
          .then(data => {
            video_info_title = data[0]
            video_info_itags = data[1]
            if (!video_info_title) {
              showNotify('foo-css', '無法獲取影片資訊，連結無效？', 'error')
              return
            }
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
            console.log(video_info_itags)
            for (var itag in video_info_itags) {
              let this_aq = video_info_itags[itag]['audioQuality']
              let this_vq = video_info_itags[itag]['quality']
              let VIDEO_MIME = ''

              let is_better_audio =
                (last_aq == '' && this_aq != '') ||
                (last_aq == aq1 && (this_aq == aq2 || this_aq == aq3)) ||
                (last_aq == aq2 && this_aq == aq3)
              let is_same_or_better_audio =
                last_aq == this_aq || is_better_audio

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
              let is_same_or_better_video =
                last_vq == this_vq || is_better_video

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
              showNotify('foo-css', '下載失敗', 'error')
              return
            } else {
              let ext = 'mp4'
              let targetfile = '{0}.{1}'.format(
                video_info_title.replace(
                  /(\| | \\ | \' | \" | \: | \' | \/)/g,
                  ''
                ),
                ext
              )
              console.log(url_to_choose)
              download(url_to_choose, targetfile, false, ext)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
    .catch(err => {
      console.log(err)
    })
}
