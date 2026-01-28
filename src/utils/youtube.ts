/**
 * YouTube URL 解析工具
 * 解析 YouTube 影片 ID 和播放清單
 */

// YouTube 影片 ID 長度
const VIDEO_ID_LENGTH = 11;

// 支援的 YouTube URL 模式
const YOUTUBE_PATTERNS = {
    // youtube.com/watch?v=VIDEO_ID
    WATCH: /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // youtu.be/VIDEO_ID
    SHORT: /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed/VIDEO_ID
    EMBED: /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/v/VIDEO_ID
    LEGACY: /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
} as const;

// 播放清單識別符
const PLAYLIST_IDENTIFIERS = ['list=', '/playlist'] as const;

export interface YouTubeParseResult {
    isValid: boolean;
    videoId: string | null;
    isPlaylist: boolean;
    playlistId: string | null;
}

/**
 * 從 URL 提取 YouTube 影片 ID
 */
export function extractVideoId(url: string): string | null {
    if (!url) {
        return null;
    }

    // 嘗試所有模式
    for (const pattern of Object.values(YOUTUBE_PATTERNS)) {
        const match = url.match(pattern);
        if (match?.[1] && match[1].length === VIDEO_ID_LENGTH) {
            return match[1];
        }
    }

    return null;
}

/**
 * 檢查 URL 是否為播放清單
 */
export function isPlaylistUrl(url: string): boolean {
    if (!url) {
        return false;
    }
    return PLAYLIST_IDENTIFIERS.some((id) => url.includes(id));
}

/**
 * 從播放清單 URL 提取播放清單 ID
 */
export function extractPlaylistId(url: string): string | null {
    if (!url) {
        return null;
    }

    const listMatch = url.match(/list=([a-zA-Z0-9_-]+)/);
    return listMatch?.[1] || null;
}

/**
 * 解析 YouTube URL
 */
export function parseYouTubeUrl(url: string): YouTubeParseResult {
    const videoId = extractVideoId(url);
    const isPlaylist = isPlaylistUrl(url);
    const playlistId = isPlaylist ? extractPlaylistId(url) : null;

    return {
        isValid: !!videoId || isPlaylist,
        videoId,
        isPlaylist,
        playlistId,
    };
}

/**
 * 驗證 YouTube 影片 ID 格式
 */
export function isValidVideoId(id: string): boolean {
    if (!id || id.length !== VIDEO_ID_LENGTH) {
        return false;
    }
    return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * 從影片 ID 產生縮圖 URL
 */
export function getThumbnailUrl(
    videoId: string,
    quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'mqdefault'
): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * 從影片 ID 產生 YouTube 觀看連結
 */
export function getWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
}
