/**
 * 剪貼簿 Composable
 * 封裝剪貼簿讀寫操作
 */

import { ref } from 'vue';
import { readText, writeText } from '@tauri-apps/plugin-clipboard-manager';

export function useClipboard() {
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
