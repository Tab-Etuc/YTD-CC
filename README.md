<div align="center">

# YTD.CC

[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-FFC131?style=flat-square&logo=tauri)](https://tauri.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**輕量、快速的 YouTube 影片下載器**

下載 YouTube 影片為 MP3 音訊或 MP4 影片格式


</div>

---

## 功能特色

- **MP3 下載** - 支援多種音訊品質 (128k ~ 320k)
- **MP4 下載** - 支援多種影片畫質 (360p ~ 4K)
- **播放清單支援** - 批次下載整個播放清單
- **下載歷史** - 記錄所有下載過的影片
- **自訂橫幅** - 個人化首頁背景圖片
- **自動更新** - 內建應用程式更新機制
- **繁體中文** - 完整中文介面

---

## 技術棧

| 類別 | 技術 |
|------|------|
| **前端框架** | Vue 3 (Composition API) + TypeScript |
| **狀態管理** | Pinia |
| **樣式** | Tailwind CSS 4 |
| **桌面框架** | Tauri 2 (Rust) |
| **下載核心** | yt-dlp + FFmpeg |
| **測試** | Vitest + Vue Test Utils |
| **程式碼品質** | ESLint + Prettier |

---

## 安裝

### 執行檔下載

前往 [Releases](../../releases) 頁面下載最新版本的安裝檔：

| 平台 | 檔案格式 |
|------|----------|
| Windows | `.msi` 安裝檔 |
| macOS | `.dmg` 映像檔 |
| Linux | `.AppImage` 或 `.deb` |

### 從原始碼建構

#### 前置需求

- [Node.js](https://nodejs.org/) >= 20
- [Yarn](https://yarnpkg.com/) >= 1.22
- [Rust](https://www.rust-lang.org/tools/install) >= 1.85

#### 快速開始

```bash
# 1. 複製專案
git clone https://github.com/your-username/YTD-CC.git
cd YTD-CC

# 2. 一鍵設定 (安裝依賴 + 下載 sidecar 執行檔)
yarn setup

# 3. 啟動開發模式
yarn tauri dev
```

#### 手動設定

如果 `yarn setup` 無法正常運作，可以手動執行：

```bash
# 安裝 Node.js 依賴
yarn install

# 下載 sidecar 執行檔 (Windows)
yarn download-sidecars

# 或手動下載 (Linux/macOS)
chmod +x scripts/download-sidecars.sh
./scripts/download-sidecars.sh

# 啟動開發模式
yarn tauri dev
```

#### 建構發行版本

```bash
yarn tauri build
```

建構完成後，安裝檔會在 `src-tauri/target/release/bundle/` 目錄中。

---

## 開發

### 可用指令

| 指令 | 說明 |
|------|------|
| `yarn setup` | 一鍵設定開發環境 |
| `yarn dev` | 啟動 Vite 開發伺服器 |
| `yarn build` | 建構前端資源 |
| `yarn tauri dev` | 啟動 Tauri 開發模式 |
| `yarn tauri build` | 建構桌面應用程式 |
| `yarn download-sidecars` | 下載 yt-dlp 和 ffmpeg |
| `yarn lint` | 執行 ESLint 檢查 |
| `yarn lint:fix` | 自動修復 ESLint 問題 |
| `yarn format` | 使用 Prettier 格式化程式碼 |
| `yarn test` | 執行測試 (監視模式) |
| `yarn test:run` | 執行所有測試 |
| `yarn test:coverage` | 執行測試並產生覆蓋率報告 |
| `yarn validate` | 執行完整驗證 (型別檢查 + Lint + 測試) |

### 專案結構

```
YTD-CC/
├── src/                    # Vue 前端原始碼
│   ├── assets/             # 靜態資源
│   ├── components/         # Vue 元件
│   │   ├── common/         # 共用元件
│   │   ├── modal/          # Modal 元件
│   │   └── views/          # 頁面元件
│   ├── composables/        # Vue Composables
│   ├── constants/          # 應用程式常數
│   ├── router/             # Vue Router 設定
│   ├── stores/             # Pinia Stores
│   ├── tests/              # 單元測試
│   ├── types/              # TypeScript 型別定義
│   └── utils/              # 工具函數
│
├── src-tauri/              # Tauri/Rust 後端
│   ├── src/                # Rust 原始碼
│   ├── icons/              # 應用程式圖示
│   ├── ffmpeg.exe          # FFmpeg 執行檔
│   └── yt-dlp.exe          # yt-dlp 執行檔
│
├── eslint.config.mjs       # ESLint 設定
├── vitest.config.ts        # Vitest 設定
├── vite.config.ts          # Vite 設定
├── tailwind.config.js      # Tailwind CSS 設定
└── tsconfig.json           # TypeScript 設定
```

---

## 授權

本專案採用 [MIT License](LICENSE) 授權。

---

## 致謝

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - 強大的 YouTube 下載工具
- [FFmpeg](https://ffmpeg.org/) - 多媒體處理
- [Tauri](https://tauri.app/) - 跨平台桌面應用框架
- [Vue.js](https://vuejs.org/) - 漸進式 JavaScript 框架

