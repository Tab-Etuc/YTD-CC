/**
 * Vitest 測試設定檔
 * 在所有測試執行前進行全域設定
 */

import { vi } from 'vitest';

// Mock Tauri APIs (避免測試時呼叫原生 API)
vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-clipboard-manager', () => ({
    readText: vi.fn(),
    writeText: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-shell', () => ({
    open: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({
    open: vi.fn(),
    save: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-fs', () => ({
    readTextFile: vi.fn(),
    writeTextFile: vi.fn(),
    readFile: vi.fn(),
    exists: vi.fn(),
    mkdir: vi.fn(),
    BaseDirectory: {
        AppData: 'AppData',
    },
}));

vi.mock('@tauri-apps/plugin-notification', () => ({
    sendNotification: vi.fn(),
}));
