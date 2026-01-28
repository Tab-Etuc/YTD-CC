/**
 * useClipboard Composable 測試
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useClipboard } from '@/composables/useClipboard';

// Mock Tauri clipboard plugin
vi.mock('@tauri-apps/plugin-clipboard-manager', () => ({
    readText: vi.fn(),
    writeText: vi.fn(),
}));

describe('useClipboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('初始狀態', () => {
        it('應該有正確的初始值', () => {
            const clipboard = useClipboard();

            expect(clipboard.clipboardContent.value).toBe('');
            expect(clipboard.error.value).toBeNull();
            expect(clipboard.isReading.value).toBe(false);
        });
    });

    describe('read', () => {
        it('成功時應該更新 clipboardContent', async () => {
            const { readText } = await import('@tauri-apps/plugin-clipboard-manager');
            vi.mocked(readText).mockResolvedValue('測試內容');

            const clipboard = useClipboard();
            const result = await clipboard.read();

            expect(result).toBe('測試內容');
            expect(clipboard.clipboardContent.value).toBe('測試內容');
            expect(clipboard.error.value).toBeNull();
        });

        it('讀取時應該設定 isReading', async () => {
            const { readText } = await import('@tauri-apps/plugin-clipboard-manager');
            let resolvePromise: (value: string) => void;
            const promise = new Promise<string>((resolve) => {
                resolvePromise = resolve;
            });
            vi.mocked(readText).mockReturnValue(promise);

            const clipboard = useClipboard();
            const readPromise = clipboard.read();

            expect(clipboard.isReading.value).toBe(true);

            resolvePromise!('done');
            await readPromise;

            expect(clipboard.isReading.value).toBe(false);
        });

        it('失敗時應該設定 error', async () => {
            const { readText } = await import('@tauri-apps/plugin-clipboard-manager');
            vi.mocked(readText).mockRejectedValue(new Error('讀取失敗'));

            const clipboard = useClipboard();
            const result = await clipboard.read();

            expect(result).toBe('');
            expect(clipboard.error.value).toBeInstanceOf(Error);
            expect(clipboard.error.value?.message).toBe('讀取失敗');
        });

        it('空值時應該回傳空字串', async () => {
            const { readText } = await import('@tauri-apps/plugin-clipboard-manager');
            vi.mocked(readText).mockResolvedValue(null as unknown as string);

            const clipboard = useClipboard();
            const result = await clipboard.read();

            expect(result).toBe('');
            expect(clipboard.clipboardContent.value).toBe('');
        });
    });

    describe('write', () => {
        it('成功時應該回傳 true 並更新內容', async () => {
            const { writeText } = await import('@tauri-apps/plugin-clipboard-manager');
            vi.mocked(writeText).mockResolvedValue(undefined);

            const clipboard = useClipboard();
            const result = await clipboard.write('新內容');

            expect(result).toBe(true);
            expect(clipboard.clipboardContent.value).toBe('新內容');
            expect(clipboard.error.value).toBeNull();
        });

        it('失敗時應該回傳 false 並設定 error', async () => {
            const { writeText } = await import('@tauri-apps/plugin-clipboard-manager');
            vi.mocked(writeText).mockRejectedValue(new Error('寫入失敗'));

            const clipboard = useClipboard();
            const result = await clipboard.write('內容');

            expect(result).toBe(false);
            expect(clipboard.error.value).toBeInstanceOf(Error);
            expect(clipboard.error.value?.message).toBe('寫入失敗');
        });

        it('寫入前應該清除之前的錯誤', async () => {
            const { writeText, readText } = await import('@tauri-apps/plugin-clipboard-manager');
            vi.mocked(readText).mockRejectedValue(new Error('讀取失敗'));
            vi.mocked(writeText).mockResolvedValue(undefined);

            const clipboard = useClipboard();

            // 先觸發一個錯誤
            await clipboard.read();
            expect(clipboard.error.value).not.toBeNull();

            // 寫入應該清除錯誤
            await clipboard.write('新內容');
            expect(clipboard.error.value).toBeNull();
        });
    });
});
