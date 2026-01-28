/**
 * YouTube URL 解析 Composable
 * 提供響應式的 YouTube URL 解析功能
 */

import { ref, computed } from 'vue';
import {
    parseYouTubeUrl,
    extractVideoId,
    isPlaylistUrl,
    getThumbnailUrl,
    getWatchUrl,
    type YouTubeParseResult,
} from '@/utils/youtube';

export function useYouTubeParser() {
    const url = ref('');
    const parseResult = ref<YouTubeParseResult | null>(null);

    /**
     * 解析結果的計算屬性
     */
    const isValid = computed(() => parseResult.value?.isValid ?? false);
    const videoId = computed(() => parseResult.value?.videoId ?? null);
    const isPlaylist = computed(() => parseResult.value?.isPlaylist ?? false);
    const playlistId = computed(() => parseResult.value?.playlistId ?? null);

    /**
     * 影片縮圖 URL
     */
    const thumbnailUrl = computed(() => {
        if (videoId.value) {
            return getThumbnailUrl(videoId.value);
        }
        return null;
    });

    /**
     * 解析 URL
     */
    function parse(inputUrl: string): YouTubeParseResult {
        url.value = inputUrl;
        parseResult.value = parseYouTubeUrl(inputUrl);
        return parseResult.value;
    }

    /**
     * 清除解析結果
     */
    function clear(): void {
        url.value = '';
        parseResult.value = null;
    }

    return {
        // State
        url,
        parseResult,

        // Computed
        isValid,
        videoId,
        isPlaylist,
        playlistId,
        thumbnailUrl,

        // Methods
        parse,
        clear,

        // 直接暴露工具函數
        extractVideoId,
        isPlaylistUrl,
        getThumbnailUrl,
        getWatchUrl,
    };
}
