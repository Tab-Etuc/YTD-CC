/**
 * 剪貼簿 Composable
 * 封裝剪貼簿讀寫操作
 */

import { ref, type Ref } from 'vue';
import { readText, writeText } from '@tauri-apps/plugin-clipboard-manager';

/** Composable 回傳類型 */
interface UseClipboardReturn {
    clipboardContent: Ref<string>;
    error: Ref<Error | null>;
    isReading: Ref<boolean>;
    read: () => Promise<string>;
    write: (text: string) => Promise<boolean>;
}

export function useClipboard(): UseClipboardReturn {
    const clipboardContent = ref<string>('');
    const error = ref<Error | null>(null);
    const isReading = ref(false);

    /**
     * 讀取剪貼簿內容
     */
    async function read(): Promise<string> {
        isReading.value = true;
        error.value = null;

        try {
            const text = await readText();
            clipboardContent.value = text || '';
            return clipboardContent.value;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
            return '';
        } finally {
            isReading.value = false;
        }
    }

    /**
     * 寫入內容到剪貼簿
     */
    async function write(text: string): Promise<boolean> {
        error.value = null;

        try {
            await writeText(text);
            clipboardContent.value = text;
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
            return false;
        }
    }

    return {
        clipboardContent,
        error,
        isReading,
        read,
        write,
    };
}
