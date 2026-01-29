/**
 * Vitest 測試設定檔
 * 在所有測試執行前進行全域設定
 */

import { vi } from 'vitest';
import { config } from '@vue/test-utils';

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
    isPermissionGranted: vi.fn().mockResolvedValue(true),
    requestPermission: vi.fn().mockResolvedValue('granted'),
}));

vi.mock('@tauri-apps/api/webviewWindow', () => ({
    getCurrentWebviewWindow: vi.fn().mockReturnValue({
        minimize: vi.fn(),
        toggleMaximize: vi.fn(),
        close: vi.fn(),
    }),
}));

vi.mock('@tauri-apps/api/app', () => ({
    getVersion: vi.fn().mockResolvedValue('1.0.0'),
}));

vi.mock('@tauri-apps/plugin-updater', () => ({
    check: vi.fn().mockResolvedValue(null),
}));

// Vue Test Utils global config
config.global.stubs = {
    // Stub router-link for components that use it
    'router-link': {
        template: '<a :to="to"><slot /></a>',
        props: ['to'],
    },
    // Stub router-view
    'router-view': {
        template: '<div><slot /></div>',
    },
    // Stub Teleport (Vue 3 built-in)
    Teleport: {
        template: '<div><slot /></div>',
    },
    // Stub notifications plugin
    notifications: true,
};

// Mock window.URL methods
if (typeof URL.createObjectURL === 'undefined') {
    Object.defineProperty(URL, 'createObjectURL', {
        value: vi.fn(() => 'blob:mock-url'),
    });
}

if (typeof URL.revokeObjectURL === 'undefined') {
    Object.defineProperty(URL, 'revokeObjectURL', {
        value: vi.fn(),
    });
}

