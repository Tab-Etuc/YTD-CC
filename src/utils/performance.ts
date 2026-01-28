/**
 * 效能優化工具函數
 */

import { onUnmounted, type Ref, watch, type WatchSource } from 'vue';

/**
 * 函數防抖
 * @param fn 要防抖的函數
 * @param delay 延遲毫秒數
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delay);
    };
}

/**
 * 函數節流
 * @param fn 要節流的函數
 * @param limit 時間限制毫秒數
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * 記憶化函數
 * @param fn 要記憶化的函數
 */
export function memoize<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T
): (...args: Parameters<T>) => ReturnType<T> {
    const cache = new Map<string, ReturnType<T>>();

    return (...args: Parameters<T>) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

/**
 * 延遲執行 (請求閒置回調)
 */
export function requestIdleCallback(
    callback: () => void,
    options?: { timeout?: number }
): number | ReturnType<typeof setTimeout> {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, options);
    }
    // 降級使用 setTimeout
    return setTimeout(callback, options?.timeout ?? 1);
}

/**
 * 取消閒置回調
 */
export function cancelIdleCallback(handle: number | ReturnType<typeof setTimeout>): void {
    if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(handle as number);
    } else {
        clearTimeout(handle as ReturnType<typeof setTimeout>);
    }
}

/**
 * 使用防抖的 watch
 */
export function useDebouncedWatch<T>(
    source: WatchSource<T> | Ref<T>,
    callback: (value: T, oldValue: T) => void,
    delay: number = 300
): void {
    const debouncedCallback = debounce(callback, delay);

    const stopWatch = watch(source, (newValue, oldValue) => {
        debouncedCallback(newValue, oldValue);
    });

    onUnmounted(() => {
        stopWatch();
    });
}

/**
 * 圖片懶加載
 */
export function lazyLoadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * 格式化檔案大小
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) {return '0 Bytes';}

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化時間長度 (秒 -> MM:SS 或 HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 批次處理陣列 (避免阻塞主線程)
 */
export async function processBatch<T, R>(
    items: T[],
    processor: (item: T, index: number) => R | Promise<R>,
    batchSize: number = 10,
    delayMs: number = 0
): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map((item, idx) => processor(item, i + idx)));
        results.push(...batchResults);

        if (delayMs > 0 && i + batchSize < items.length) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }

    return results;
}
