/**
 * 下載品質選項常數
 */

import type { VideoQualityOption, AudioQualityOption, DropdownOption } from '@/types';

/**
 * 影片畫質選項
 */
export const VIDEO_QUALITY_OPTIONS: VideoQualityOption[] = [
    { label: '2160p (4K)', height: 2160 },
    { label: '1440p (2K)', height: 1440 },
    { label: '1080p (Full HD)', height: 1080 },
    { label: '720p (HD)', height: 720 },
    { label: '480p', height: 480 },
    { label: '360p', height: 360 },
];

/**
 * 音訊品質選項
 */
export const AUDIO_QUALITY_OPTIONS: AudioQualityOption[] = [
    { label: '320 kbps', bitrate: '320k' },
    { label: '256 kbps', bitrate: '256k' },
    { label: '192 kbps', bitrate: '192k' },
    { label: '128 kbps', bitrate: '128k' },
];

/**
 * 轉換影片品質選項為下拉選單格式
 */
export function getVideoQualityDropdownOptions(): DropdownOption[] {
    return VIDEO_QUALITY_OPTIONS.map((opt) => ({
        label: opt.label,
        value: String(opt.height),
        height: opt.height,
    }));
}

/**
 * 轉換音訊品質選項為下拉選單格式
 */
export function getAudioQualityDropdownOptions(): DropdownOption[] {
    return AUDIO_QUALITY_OPTIONS.map((opt) => ({
        label: opt.label,
        value: opt.bitrate,
        bitrate: opt.bitrate,
    }));
}

/**
 * 取得預設影片品質
 */
export const DEFAULT_VIDEO_QUALITY = VIDEO_QUALITY_OPTIONS[2]!; // 1080p

/**
 * 取得預設音訊品質
 */
export const DEFAULT_AUDIO_QUALITY = AUDIO_QUALITY_OPTIONS[0]!; // 320kbps
