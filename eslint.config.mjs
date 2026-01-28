import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    // 忽略的檔案和目錄
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            'src-tauri/target/**',
            '*.config.js',
            '*.config.ts',
        ],
    },

    // JavaScript 基礎規則
    js.configs.recommended,

    // TypeScript 規則
    ...tseslint.configs.recommended,

    // Vue 規則
    ...pluginVue.configs['flat/recommended'],

    // Prettier 相容性 (必須放在最後)
    eslintConfigPrettier,

    // 全域設定
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                parser: tseslint.parser,
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
    },

    // Vue 檔案設定
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            // Vue 特定規則
            'vue/multi-word-component-names': 'off',
            'vue/no-v-html': 'warn',
            'vue/require-default-prop': 'off',
            'vue/no-unused-vars': 'error',
            'vue/block-order': [
                'error',
                {
                    order: ['template', 'script', 'style'],
                },
            ],
            'vue/block-lang': [
                'error',
                {
                    script: { lang: 'ts' },
                },
            ],
            'vue/define-macros-order': [
                'error',
                {
                    order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
                    defineExposeLast: true,
                },
            ],
            'vue/html-self-closing': [
                'error',
                {
                    html: {
                        void: 'always',
                        normal: 'never',
                        component: 'always',
                    },
                },
            ],
        },
    },

    // TypeScript 檔案設定
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': [
                'warn',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'inline-type-imports',
                },
            ],
        },
    },

    // 通用規則
    {
        rules: {
            // 一般程式碼品質
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'warn',
            'no-unused-vars': 'off', // 使用 TypeScript 版本
            'prefer-const': 'error',
            'no-var': 'error',
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
        },
    }
);
