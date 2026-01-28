/**
 * YTD-CC 錯誤處理服務
 * 提供統一的錯誤處理、日誌記錄和用戶通知
 */

import { ref, readonly } from 'vue';

// ============================================================================
// 型別定義
// ============================================================================

/** 日誌等級 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** 錯誤類別 */
export type ErrorCategory =
    | 'NETWORK'
    | 'DOWNLOAD'
    | 'FILE_SYSTEM'
    | 'VALIDATION'
    | 'PERMISSION'
    | 'BACKEND'
    | 'UNKNOWN';

/** 日誌條目 */
export interface LogEntry {
    id: number;
    level: LogLevel;
    message: string;
    timestamp: Date;
    category?: ErrorCategory;
    context?: Record<string, unknown>;
    stack?: string;
}

/** 應用程式錯誤 */
export class AppError extends Error {
    public readonly category: ErrorCategory;
    public readonly context: Record<string, unknown>;
    public readonly timestamp: Date;
    public readonly isUserFacing: boolean;

    constructor(options: {
        message: string;
        category?: ErrorCategory;
        context?: Record<string, unknown>;
        cause?: Error;
        isUserFacing?: boolean;
    }) {
        super(options.message);
        this.name = 'AppError';
        this.category = options.category ?? 'UNKNOWN';
        this.context = options.context ?? {};
        this.timestamp = new Date();
        this.isUserFacing = options.isUserFacing ?? true;

        if (options.cause) {
            this.cause = options.cause;
            this.stack = options.cause.stack;
        }
    }

    /** 取得用戶友好的錯誤訊息 */
    getUserMessage(): string {
        if (!this.isUserFacing) {
            return '發生未預期的錯誤，請稍後再試';
        }
        return this.message;
    }
}

// ============================================================================
// 日誌服務
// ============================================================================

const MAX_LOG_ENTRIES = 500;
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const logs = ref<LogEntry[]>([]);
const currentLogLevel = ref<LogLevel>('info');
let logIdCounter = 0;

/** 設定日誌等級 */
export function setLogLevel(level: LogLevel): void {
    currentLogLevel.value = level;
}

/** 取得所有日誌 */
export function getLogs(): readonly LogEntry[] {
    return readonly(logs).value;
}

/** 清除所有日誌 */
export function clearLogs(): void {
    logs.value = [];
}

/** 記錄日誌 */
function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    // 檢查日誌等級
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[currentLogLevel.value]) {
        return;
    }

    const entry: LogEntry = {
        id: ++logIdCounter,
        level,
        message,
        timestamp: new Date(),
        context,
    };

    logs.value.push(entry);

    // 限制日誌數量
    if (logs.value.length > MAX_LOG_ENTRIES) {
        logs.value = logs.value.slice(-MAX_LOG_ENTRIES);
    }

    // 輸出到控制台
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    const prefix = `[${level.toUpperCase()}] [${entry.timestamp.toISOString()}]`;

    if (context) {
        console[consoleMethod](prefix, message, context);
    } else {
        console[consoleMethod](prefix, message);
    }
}

/** 日誌物件 */
export const logger = {
    debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
    info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
    warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
    error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
};

// ============================================================================
// 錯誤處理服務
// ============================================================================

/** 錯誤處理器類型 */
type ErrorHandler = (error: AppError) => void | Promise<void>;

const errorHandlers: ErrorHandler[] = [];
const recentErrors = ref<AppError[]>([]);

/** 註冊錯誤處理器 */
export function registerErrorHandler(handler: ErrorHandler): () => void {
    errorHandlers.push(handler);
    return () => {
        const index = errorHandlers.indexOf(handler);
        if (index > -1) {
            errorHandlers.splice(index, 1);
        }
    };
}

/** 取得最近的錯誤 */
export function getRecentErrors(): readonly AppError[] {
    return readonly(recentErrors).value;
}

/** 清除錯誤記錄 */
export function clearErrors(): void {
    recentErrors.value = [];
}

/** 處理錯誤 */
export async function handleError(error: unknown): Promise<AppError> {
    const appError = normalizeError(error);

    // 記錄錯誤
    logger.error(appError.message, {
        category: appError.category,
        context: appError.context,
        stack: appError.stack,
    });

    // 儲存到最近錯誤列表
    recentErrors.value.push(appError);
    if (recentErrors.value.length > 50) {
        recentErrors.value = recentErrors.value.slice(-50);
    }

    // 執行所有錯誤處理器
    for (const handler of errorHandlers) {
        try {
            await handler(appError);
        } catch (handlerError) {
            console.error('Error handler failed:', handlerError);
        }
    }

    return appError;
}

/** 將未知錯誤標準化為 AppError */
export function normalizeError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error;
    }

    if (error instanceof Error) {
        return new AppError({
            message: error.message,
            category: categorizeError(error),
            cause: error,
        });
    }

    if (typeof error === 'string') {
        return new AppError({
            message: error,
            category: 'UNKNOWN',
        });
    }

    return new AppError({
        message: '發生未知錯誤',
        category: 'UNKNOWN',
        context: { originalError: error },
    });
}

/** 根據錯誤內容自動分類 */
function categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
        return 'NETWORK';
    }
    if (message.includes('download') || message.includes('yt-dlp')) {
        return 'DOWNLOAD';
    }
    if (message.includes('file') || message.includes('permission') || message.includes('path')) {
        return 'FILE_SYSTEM';
    }
    if (message.includes('invalid') || message.includes('validation')) {
        return 'VALIDATION';
    }
    if (message.includes('tauri') || message.includes('invoke')) {
        return 'BACKEND';
    }

    return 'UNKNOWN';
}

// ============================================================================
// 錯誤工廠函數
// ============================================================================

/** 建立網路錯誤 */
export function createNetworkError(message: string, context?: Record<string, unknown>): AppError {
    return new AppError({
        message,
        category: 'NETWORK',
        context,
    });
}

/** 建立下載錯誤 */
export function createDownloadError(message: string, context?: Record<string, unknown>): AppError {
    return new AppError({
        message,
        category: 'DOWNLOAD',
        context,
    });
}

/** 建立檔案系統錯誤 */
export function createFileSystemError(
    message: string,
    context?: Record<string, unknown>
): AppError {
    return new AppError({
        message,
        category: 'FILE_SYSTEM',
        context,
    });
}

/** 建立驗證錯誤 */
export function createValidationError(
    message: string,
    context?: Record<string, unknown>
): AppError {
    return new AppError({
        message,
        category: 'VALIDATION',
        context,
    });
}

/** 建立後端錯誤 */
export function createBackendError(message: string, context?: Record<string, unknown>): AppError {
    return new AppError({
        message,
        category: 'BACKEND',
        context,
    });
}

// ============================================================================
// 非同步錯誤包裝器
// ============================================================================

/** 包裝非同步函數，自動處理錯誤 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    options?: {
        category?: ErrorCategory;
        fallbackMessage?: string;
        rethrow?: boolean;
    }
): T {
    return (async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            const appError =
                error instanceof AppError
                    ? error
                    : new AppError({
                          message: options?.fallbackMessage ?? (error as Error).message,
                          category: options?.category ?? 'UNKNOWN',
                          cause: error instanceof Error ? error : undefined,
                      });

            await handleError(appError);

            if (options?.rethrow) {
                throw appError;
            }

            return undefined;
        }
    }) as T;
}

/** 安全執行非同步操作 */
export async function trySafe<T>(
    fn: () => Promise<T>,
    options?: {
        fallback?: T;
        category?: ErrorCategory;
        message?: string;
    }
): Promise<T | undefined> {
    try {
        return await fn();
    } catch (error) {
        await handleError(
            new AppError({
                message: options?.message ?? (error as Error).message,
                category: options?.category ?? 'UNKNOWN',
                cause: error instanceof Error ? error : undefined,
            })
        );
        return options?.fallback;
    }
}
