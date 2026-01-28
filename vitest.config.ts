import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    test: {
        // 測試環境
        environment: 'happy-dom',

        // 全域 API (不需要 import describe, it, expect)
        globals: true,

        // 測試檔案位置
        include: ['src/**/*.{test,spec}.{ts,tsx}'],

        // 測試設定檔
        setupFiles: ['./src/tests/setup.ts'],

        // 覆蓋率報告
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/tests/',
                '**/*.d.ts',
                'src/main.ts',
                'src/router/**',
            ],
        },

        // 排除不必要的檔案
        exclude: ['node_modules', 'dist', 'src-tauri'],
    },
});
