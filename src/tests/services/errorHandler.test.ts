/**
 * 錯誤處理服務測試
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    AppError,
    logger,
    handleError,
    normalizeError,
    createNetworkError,
    createDownloadError,
    createFileSystemError,
    createValidationError,
    createBackendError,
    clearLogs,
    clearErrors,
    trySafe,
} from '@/services/errorHandler';
import { writeTextFile } from '@tauri-apps/plugin-fs';

describe('AppError', () => {
    it('應該建立帶有正確屬性的錯誤', () => {
        const error = new AppError({
            message: '測試錯誤',
            category: 'NETWORK',
            context: { url: 'https://example.com' },
        });

        expect(error.message).toBe('測試錯誤');
        expect(error.category).toBe('NETWORK');
        expect(error.context).toEqual({ url: 'https://example.com' });
        expect(error.isUserFacing).toBe(true);
        expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('應該使用預設值', () => {
        const error = new AppError({ message: '簡單錯誤' });

        expect(error.category).toBe('UNKNOWN');
        expect(error.context).toEqual({});
        expect(error.isUserFacing).toBe(true);
    });

    it('應該處理 cause 錯誤', () => {
        const cause = new Error('原始錯誤');
        const error = new AppError({
            message: '包裝錯誤',
            cause,
        });

        expect(error.cause).toBe(cause);
    });

    it('getUserMessage 應該回傳使用者友好訊息', () => {
        const userFacingError = new AppError({
            message: '使用者可見錯誤',
            isUserFacing: true,
        });
        expect(userFacingError.getUserMessage()).toBe('使用者可見錯誤');

        const internalError = new AppError({
            message: '內部錯誤',
            isUserFacing: false,
        });
        expect(internalError.getUserMessage()).toBe('發生未預期的錯誤，請稍後再試');
    });
});

describe('錯誤工廠函數', () => {
    it('createNetworkError 應該建立 NETWORK 類別錯誤', () => {
        const error = createNetworkError('網路連線失敗');
        expect(error.category).toBe('NETWORK');
    });

    it('createDownloadError 應該建立 DOWNLOAD 類別錯誤', () => {
        const error = createDownloadError('下載失敗');
        expect(error.category).toBe('DOWNLOAD');
    });

    it('createFileSystemError 應該建立 FILE_SYSTEM 類別錯誤', () => {
        const error = createFileSystemError('無法寫入檔案');
        expect(error.category).toBe('FILE_SYSTEM');
    });

    it('createValidationError 應該建立 VALIDATION 類別錯誤', () => {
        const error = createValidationError('無效的 URL');
        expect(error.category).toBe('VALIDATION');
    });

    it('createBackendError 應該建立 BACKEND 類別錯誤', () => {
        const error = createBackendError('後端錯誤');
        expect(error.category).toBe('BACKEND');
    });
});

describe('normalizeError', () => {
    it('應該直接回傳 AppError', () => {
        const appError = new AppError({ message: '既有錯誤' });
        expect(normalizeError(appError)).toBe(appError);
    });

    it('應該將 Error 轉換為 AppError', () => {
        const error = new Error('標準錯誤');
        const normalized = normalizeError(error);

        expect(normalized).toBeInstanceOf(AppError);
        expect(normalized.message).toBe('標準錯誤');
    });

    it('應該將字串轉換為 AppError', () => {
        const normalized = normalizeError('字串錯誤');

        expect(normalized).toBeInstanceOf(AppError);
        expect(normalized.message).toBe('字串錯誤');
    });

    it('應該處理未知類型', () => {
        const normalized = normalizeError({ custom: 'object' });

        expect(normalized).toBeInstanceOf(AppError);
        expect(normalized.message).toBe('發生未知錯誤');
    });

    it('應該自動分類網路錯誤', () => {
        const error = new Error('Network request failed');
        const normalized = normalizeError(error);
        expect(normalized.category).toBe('NETWORK');
    });

    it('應該自動分類下載錯誤', () => {
        const error = new Error('yt-dlp failed to download');
        const normalized = normalizeError(error);
        expect(normalized.category).toBe('DOWNLOAD');
    });
});

describe('logger', () => {
    beforeEach(() => {
        clearLogs();

        vi.spyOn(console, 'log').mockImplementation(() => { });

        vi.spyOn(console, 'warn').mockImplementation(() => { });

        vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.mocked(writeTextFile).mockClear();
    });

    it('應該記錄 info 日誌', () => {
        logger.info('測試訊息');
        // eslint-disable-next-line no-console
        expect(console.log).toHaveBeenCalled();
    });

    it('應該記錄 warn 日誌', () => {
        logger.warn('警告訊息');
        expect(console.warn).toHaveBeenCalled();
    });

    it('應該記錄 error 日誌並寫入檔案', async () => {
        logger.error('錯誤訊息');
        expect(console.error).toHaveBeenCalled();
        // 等待非同步日誌寫入
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(writeTextFile).toHaveBeenCalled();
    });

    it('應該接受 context 參數', () => {
        logger.info('帶有 context', { key: 'value' });
        // eslint-disable-next-line no-console
        expect(console.log).toHaveBeenCalled();
    });
});

describe('handleError', () => {
    beforeEach(() => {
        clearErrors();

        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('應該處理 AppError', async () => {
        const error = new AppError({ message: '測試錯誤' });
        const result = await handleError(error);

        expect(result).toBe(error);
    });

    it('應該處理一般 Error', async () => {
        const error = new Error('標準錯誤');
        const result = await handleError(error);

        expect(result).toBeInstanceOf(AppError);
        expect(result.message).toBe('標準錯誤');
    });
});

describe('trySafe', () => {
    beforeEach(() => {

        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('成功時應該回傳結果', async () => {
        const result = await trySafe(() => Promise.resolve('success'));
        expect(result).toBe('success');
    });

    it('失敗時應該回傳 undefined', async () => {
        const result = await trySafe(() => Promise.reject(new Error('失敗')));
        expect(result).toBeUndefined();
    });

    it('失敗時應該回傳 fallback 值', async () => {
        const result = await trySafe(() => Promise.reject(new Error('失敗')), {
            fallback: 'default',
        });
        expect(result).toBe('default');
    });
});
