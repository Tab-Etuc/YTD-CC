/**
 * YouTube URL 解析 Composable
 * 提供響應式的 YouTube URL 解析功能
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue';
import {
    parseYouTubeUrl,
    extractVideoId,
    isPlaylistUrl,
    getThumbnailUrl,
    getWatchUrl,
    type YouTubeParseResult,
} from '@/utils/youtube';

/** Composable 回傳類型 */
interface UseYouTubeParserReturn {
    url: Ref<string>;
    parseResult: Ref<YouTubeParseResult | null>;
    isValid: ComputedRef<boolean>;
    videoId: ComputedRef<string | null>;
    isPlaylist: ComputedRef<boolean>;
    playlistId: ComputedRef<string | null>;
    thumbnailUrl: ComputedRef<string | null>;
    parse: (inputUrl: string) => YouTubeParseResult;
    clear: () => void;
    extractVideoId: typeof extractVideoId;
    isPlaylistUrl: typeof isPlaylistUrl;
    getThumbnailUrl: typeof getThumbnailUrl;
    getWatchUrl: typeof getWatchUrl;
}

export function useYouTubeParser(): UseYouTubeParserReturn {
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
