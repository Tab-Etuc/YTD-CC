# Changelog

此檔案記錄本專案的所有重要變更。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，
版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [Unreleased]

### Added
- ESLint + Prettier 程式碼品質工具
- Vitest 單元測試框架
- Composables 架構 (`useClipboard`, `useYouTubeParser`, `useExternalLink`)
- Constants 模組 (品質選項、應用程式常數)
- Utils 模組 (YouTube URL 解析)
- 完整的 README.md 文件
- LICENSE 授權檔案
- TypeScript 嚴格模式

### Changed
- 從 Vuex 遷移至 Pinia 狀態管理
- 重構專案結構，新增 `composables/`, `constants/`, `utils/` 資料夾

## [0.2.0] - 2024-XX-XX

### Added
- 播放清單下載支援
- 下載佇列功能
- 批次下載多個影片

### Changed
- 升級至 Tauri 2.0
- UI 優化與動畫效果

## [0.1.0] - 2024-XX-XX

### Added
- 初始版本
- YouTube 影片下載 (MP3/MP4)
- 多種品質選項
- 下載歷史記錄
- 自訂橫幅圖片
- 繁體中文介面
