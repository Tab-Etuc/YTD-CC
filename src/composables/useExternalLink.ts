/**
 * 外部連結 Composable
 * 統一處理開啟外部連結或檔案路徑
 */

import { open } from '@tauri-apps/plugin-shell';
import { invoke } from '@tauri-apps/api/core';

/** Composable 回傳類型 */
interface UseExternalLinkReturn {
    openLink: (url: string) => Promise<void>;
    openUrl: (url: string) => Promise<void>;
    showInFolder: (path: string) => Promise<void>;
}

export function useExternalLink(): UseExternalLinkReturn {
    /**
     * 開啟外部連結或在檔案總管中顯示路徑
     */
    async function openLink(url: string): Promise<void> {
        if (!url) {
            return;
        }

        if (url.startsWith('http://') || url.startsWith('https://')) {
            // 開啟網頁連結
            await open(url);
        } else {
            // 在檔案總管中顯示
            await invoke('show_in_folder', { path: url });
        }
    }

    /**
     * 開啟 URL（僅限網頁連結）
     */
    async function openUrl(url: string): Promise<void> {
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            await open(url);
        }
    }

    /**
     * 在檔案總管中顯示路徑
     */
    async function showInFolder(path: string): Promise<void> {
        if (path) {
            await invoke('show_in_folder', { path });
        }
    }

    return {
        openLink,
        openUrl,
        showInFolder,
    };
}
