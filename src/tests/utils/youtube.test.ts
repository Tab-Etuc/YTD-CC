/**
 * YouTube URL 解析工具測試
 */

import { describe, it, expect } from 'vitest';
import {
    extractVideoId,
    isPlaylistUrl,
    extractPlaylistId,
    parseYouTubeUrl,
    isValidVideoId,
    getThumbnailUrl,
    getWatchUrl,
} from '@/utils/youtube';

describe('youtube utils', () => {
    describe('extractVideoId', () => {
        it('應該從 youtube.com/watch?v= 格式提取 ID', () => {
            expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
                'dQw4w9WgXcQ'
            );
        });

        it('應該從 youtu.be/ 短連結格式提取 ID', () => {
            expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('應該從 embed 格式提取 ID', () => {
            expect(extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('應該從帶有額外參數的 URL 提取 ID', () => {
            expect(
                extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLxxxxxxx')
            ).toBe('dQw4w9WgXcQ');
        });

        it('應該對無效 URL 返回 null', () => {
            expect(extractVideoId('')).toBeNull();
            expect(extractVideoId('https://example.com')).toBeNull();
            expect(extractVideoId('not a url')).toBeNull();
        });
    });

    describe('isPlaylistUrl', () => {
        it('應該識別包含 list= 的播放清單 URL', () => {
            expect(
                isPlaylistUrl('https://www.youtube.com/watch?v=abc&list=PLxxxxxxxxxxxxxxxx')
            ).toBe(true);
        });

        it('應該識別 /playlist 路徑', () => {
            expect(isPlaylistUrl('https://www.youtube.com/playlist?list=PLxxxxxxxx')).toBe(true);
        });

        it('應該對普通影片 URL 返回 false', () => {
            expect(isPlaylistUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false);
        });

        it('應該對空字串返回 false', () => {
            expect(isPlaylistUrl('')).toBe(false);
        });
    });

    describe('extractPlaylistId', () => {
        it('應該提取播放清單 ID', () => {
            expect(
                extractPlaylistId('https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4g')
            ).toBe('PLrAXtmErZgOeiKm4g');
        });

        it('應該對無播放清單的 URL 返回 null', () => {
            expect(extractPlaylistId('https://www.youtube.com/watch?v=abc')).toBeNull();
        });
    });

    describe('parseYouTubeUrl', () => {
        it('應該正確解析影片 URL', () => {
            const result = parseYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
            expect(result.isValid).toBe(true);
            expect(result.videoId).toBe('dQw4w9WgXcQ');
            expect(result.isPlaylist).toBe(false);
        });

        it('應該正確解析播放清單 URL', () => {
            const result = parseYouTubeUrl('https://www.youtube.com/watch?v=abc&list=PLxxxxxxx');
            expect(result.isValid).toBe(true);
            expect(result.isPlaylist).toBe(true);
            expect(result.playlistId).toBe('PLxxxxxxx');
        });
    });

    describe('isValidVideoId', () => {
        it('應該驗證有效的 ID', () => {
            expect(isValidVideoId('dQw4w9WgXcQ')).toBe(true);
            expect(isValidVideoId('abc123_-xyz')).toBe(true);
        });

        it('應該拒絕無效的 ID', () => {
            expect(isValidVideoId('')).toBe(false);
            expect(isValidVideoId('short')).toBe(false);
            expect(isValidVideoId('too-long-video-id')).toBe(false);
        });
    });

    describe('getThumbnailUrl', () => {
        it('應該產生正確的縮圖 URL', () => {
            expect(getThumbnailUrl('dQw4w9WgXcQ')).toBe(
                'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg'
            );
        });

        it('應該支援不同品質選項', () => {
            expect(getThumbnailUrl('dQw4w9WgXcQ', 'maxresdefault')).toBe(
                'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
            );
        });
    });

    describe('getWatchUrl', () => {
        it('應該產生正確的觀看連結', () => {
            expect(getWatchUrl('dQw4w9WgXcQ')).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        });
    });
});
