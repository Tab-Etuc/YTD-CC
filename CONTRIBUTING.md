# Contributing to YTD-CC

感謝您對 YTD-CC 的興趣！我們歡迎所有形式的貢獻。

## 開發流程

### 前置需求

- Node.js >= 20
- Rust >= 1.85
- npm >= 10

### 本地開發

1. Fork 並 clone 專案：
```bash
git clone https://github.com/your-username/YTD-CC.git
cd YTD-CC
```

2. 安裝依賴：
```bash
yarn install
```

3. 啟動開發伺服器：
```bash
yarn tauri dev
```

### 程式碼風格

我們使用 ESLint 和 Prettier 來確保程式碼品質和一致性。

在提交前請運行：
```bash
yarn lint        # 檢查程式碼風格
yarn format      # 格式化程式碼
yarn typecheck   # TypeScript 型別檢查
yarn test:run    # 運行測試
```

或使用一個命令運行所有檢查：
```bash
yarn validate
```

### 提交規範

我們使用 [Conventional Commits](https://www.conventionalcommits.org/) 規範：

- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文件更新
- `style`: 格式調整（不影響程式碼邏輯）
- `refactor`: 重構
- `test`: 測試相關
- `chore`: 建構工具或輔助工具變動

例如：
```
feat: 新增播放清單下載功能
fix: 修復下載進度條顯示問題
docs: 更新 README 安裝說明
```

## 提交 Pull Request

1. 建立 feature branch：`git checkout -b feature/amazing-feature`
2. 提交您的變更：`git commit -m 'feat: 新增很棒的功能'`
3. Push 到 branch：`git push origin feature/amazing-feature`
4. 開啟 Pull Request

### PR 檢查清單

- [ ] 程式碼通過所有 lint 檢查
- [ ] 相關測試已新增或更新
- [ ] 所有測試通過
- [ ] 文件已更新（如適用）
- [ ] PR 描述清楚說明變更內容

## 回報問題

使用 GitHub Issues 回報問題時，請包含：

1. 問題描述
2. 重現步驟
3. 預期行為
4. 實際行為
5. 系統環境（作業系統、版本等）
6. 相關截圖或錯誤訊息

## 功能建議

歡迎透過 GitHub Issues 提出功能建議！請說明：

1. 功能描述
2. 使用情境
3. 可能的實作方式（選填）

## 授權

貢獻此專案即表示您同意將您的貢獻以 MIT 授權釋出。
