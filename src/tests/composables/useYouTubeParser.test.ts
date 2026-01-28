/**
 * useYouTubeParser Composable 測試
 */

import { describe, it, expect, vi } from 'vitest';
import { useYouTubeParser } from '@/composables/useYouTubeParser';

// Mock YouTube 工具函數
vi.mock('@/utils/youtube', () => ({
    parseYouTubeUrl: vi.fn((url: string) => {
        if (url.includes('watch?v=')) {
            const videoId = url.match(/v=([a-zA-Z0-9_-]+)/)?.[1] || null;
            return {
                isValid: !!videoId,
                videoId,
                isPlaylist: url.includes('list='),
                playlistId: url.match(/list=([a-zA-Z0-9_-]+)/)?.[1] || null,
            };
        }
        if (url.includes('youtu.be/')) {
            const videoId = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)?.[1] || null;
            return {
                isValid: !!videoId,
                videoId,
                isPlaylist: false,
                playlistId: null,
            };
        }
        if (url.includes('playlist?list=')) {
            const playlistId = url.match(/list=([a-zA-Z0-9_-]+)/)?.[1] || null;
            return {
                isValid: !!playlistId,
                videoId: null,
                isPlaylist: true,
                playlistId,
            };
        }
        return { isValid: false, videoId: null, isPlaylist: false, playlistId: null };
    }),
    extractVideoId: vi.fn((url: string) => {
        const match = url.match(/v=([a-zA-Z0-9_-]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        return match?.[1] || null;
    }),
    isPlaylistUrl: vi.fn((url: string) => url.includes('list=')),
    getThumbnailUrl: vi.fn((id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`),
    getWatchUrl: vi.fn((id: string) => `https://www.youtube.com/watch?v=${id}`),
}));

describe('useYouTubeParser', () => {
    describe('初始狀態', () => {
        it('應該有正確的初始值', () => {
            const parser = useYouTubeParser();

            expect(parser.url.value).toBe('');
            expect(parser.parseResult.value).toBeNull();
            expect(parser.isValid.value).toBe(false);
            expect(parser.videoId.value).toBeNull();
            expect(parser.isPlaylist.value).toBe(false);
            expect(parser.playlistId.value).toBeNull();
        });
    });

    describe('parse', () => {
        it('應該解析標準 YouTube URL', () => {
            const parser = useYouTubeParser();

            const result = parser.parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

            expect(result.isValid).toBe(true);
            expect(result.videoId).toBe('dQw4w9WgXcQ');
            expect(parser.url.value).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        });

        it('應該解析短網址', () => {
            const parser = useYouTubeParser();

            const result = parser.parse('https://youtu.be/dQw4w9WgXcQ');

            expect(result.isValid).toBe(true);
            expect(result.videoId).toBe('dQw4w9WgXcQ');
        });

        it('應該識別播放清單 URL', () => {
            const parser = useYouTubeParser();

            const result = parser.parse(
                'https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf'
            );

            expect(result.isValid).toBe(true);
            expect(result.isPlaylist).toBe(true);
            expect(result.playlistId).toBe('PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf');
        });

        it('應該處理無效 URL', () => {
            const parser = useYouTubeParser();

            const result = parser.parse('https://example.com/not-youtube');

            expect(result.isValid).toBe(false);
            expect(result.videoId).toBeNull();
        });
    });

    describe('computed 屬性', () => {
        it('thumbnailUrl 應該生成正確的縮圖 URL', () => {
            const parser = useYouTubeParser();

            parser.parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

            expect(parser.thumbnailUrl.value).toBe(
                'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
            );
        });

        it('沒有影片 ID 時 thumbnailUrl 應為 null', () => {
            const parser = useYouTubeParser();

            expect(parser.thumbnailUrl.value).toBeNull();
        });
    });

    describe('clear', () => {
        it('應該清除所有狀態', () => {
            const parser = useYouTubeParser();
            parser.parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

            parser.clear();

            expect(parser.url.value).toBe('');
            expect(parser.parseResult.value).toBeNull();
            expect(parser.isValid.value).toBe(false);
        });
    });

    describe('暴露的工具函數', () => {
        it('應該暴露 extractVideoId', () => {
            const parser = useYouTubeParser();

            const id = parser.extractVideoId('https://www.youtube.com/watch?v=test123');

            expect(id).toBe('test123');
        });

        it('應該暴露 isPlaylistUrl', () => {
            const parser = useYouTubeParser();

            expect(parser.isPlaylistUrl('https://youtube.com/playlist?list=PLtest')).toBe(true);
            expect(parser.isPlaylistUrl('https://youtube.com/watch?v=test')).toBe(false);
        });

        it('應該暴露 getThumbnailUrl', () => {
            const parser = useYouTubeParser();

            const url = parser.getThumbnailUrl('test123');

            expect(url).toBe('https://i.ytimg.com/vi/test123/maxresdefault.jpg');
        });

        it('應該暴露 getWatchUrl', () => {
            const parser = useYouTubeParser();

            const url = parser.getWatchUrl('test123');

            expect(url).toBe('https://www.youtube.com/watch?v=test123');
        });
    });
});
