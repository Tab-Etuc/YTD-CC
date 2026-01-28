/**
 * 效能工具函數測試
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    debounce,
    throttle,
    memoize,
    formatFileSize,
    formatDuration,
    processBatch,
} from '@/utils/performance';

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('應該延遲執行函數', () => {
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 100);

        debouncedFn();
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('連續呼叫時應該只執行最後一次', () => {
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 100);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('應該傳遞正確的參數', () => {
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 100);

        debouncedFn('arg1', 'arg2');
        vi.advanceTimersByTime(100);

        expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
});

describe('throttle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('應該立即執行第一次呼叫', () => {
        const fn = vi.fn();
        const throttledFn = throttle(fn, 100);

        throttledFn();
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('在限制時間內的呼叫應該被忽略', () => {
        const fn = vi.fn();
        const throttledFn = throttle(fn, 100);

        throttledFn();
        throttledFn();
        throttledFn();

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('限制時間過後應該可以再次執行', () => {
        const fn = vi.fn();
        const throttledFn = throttle(fn, 100);

        throttledFn();
        vi.advanceTimersByTime(100);
        throttledFn();

        expect(fn).toHaveBeenCalledTimes(2);
    });
});

describe('memoize', () => {
    it('應該快取函數結果', () => {
        const fn = vi.fn((x: number) => x * 2);
        const memoizedFn = memoize(fn);

        expect(memoizedFn(5)).toBe(10);
        expect(memoizedFn(5)).toBe(10);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('不同參數應該執行函數', () => {
        const fn = vi.fn((x: number) => x * 2);
        const memoizedFn = memoize(fn);

        expect(memoizedFn(5)).toBe(10);
        expect(memoizedFn(10)).toBe(20);
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('應該處理多個參數', () => {
        const fn = vi.fn((a: number, b: number) => a + b);
        const memoizedFn = memoize(fn);

        expect(memoizedFn(1, 2)).toBe(3);
        expect(memoizedFn(1, 2)).toBe(3);
        expect(memoizedFn(2, 3)).toBe(5);
        expect(fn).toHaveBeenCalledTimes(2);
    });
});

describe('formatFileSize', () => {
    it('應該格式化位元組', () => {
        expect(formatFileSize(0)).toBe('0 Bytes');
        expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('應該格式化 KB', () => {
        expect(formatFileSize(1024)).toBe('1 KB');
        expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('應該格式化 MB', () => {
        expect(formatFileSize(1048576)).toBe('1 MB');
        expect(formatFileSize(5242880)).toBe('5 MB');
    });

    it('應該格式化 GB', () => {
        expect(formatFileSize(1073741824)).toBe('1 GB');
    });
});

describe('formatDuration', () => {
    it('應該格式化秒數', () => {
        expect(formatDuration(0)).toBe('0:00');
        expect(formatDuration(30)).toBe('0:30');
    });

    it('應該格式化分鐘', () => {
        expect(formatDuration(60)).toBe('1:00');
        expect(formatDuration(90)).toBe('1:30');
        expect(formatDuration(125)).toBe('2:05');
    });

    it('應該格式化小時', () => {
        expect(formatDuration(3600)).toBe('1:00:00');
        expect(formatDuration(3661)).toBe('1:01:01');
        expect(formatDuration(7265)).toBe('2:01:05');
    });
});

describe('processBatch', () => {
    it('應該批次處理陣列', async () => {
        const items = [1, 2, 3, 4, 5];
        const processor = vi.fn((x: number) => x * 2);

        const results = await processBatch(items, processor, 2);

        expect(results).toEqual([2, 4, 6, 8, 10]);
        expect(processor).toHaveBeenCalledTimes(5);
    });

    it('應該處理異步處理器', async () => {
        const items = [1, 2, 3];
        const processor = async (x: number) => {
            await new Promise((r) => setTimeout(r, 10));
            return x * 2;
        };

        const results = await processBatch(items, processor, 2);

        expect(results).toEqual([2, 4, 6]);
    });

    it('應該傳遞正確的索引', async () => {
        const items = ['a', 'b', 'c'];
        const processor = vi.fn((item: string, index: number) => `${item}-${index}`);

        await processBatch(items, processor, 2);

        expect(processor).toHaveBeenCalledWith('a', 0);
        expect(processor).toHaveBeenCalledWith('b', 1);
        expect(processor).toHaveBeenCalledWith('c', 2);
    });
});
