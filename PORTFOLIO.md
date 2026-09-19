![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

![Agent Mode](https://img.shields.io/badge/Agent_Mode-已實作-1E2761?style=flat-square)
![MCP](https://img.shields.io/badge/MCP-已整合-1E2761?style=flat-square)
![Agentic Workflow](https://img.shields.io/badge/Agentic_Workflow-已建立-1E2761?style=flat-square)

# 待辦清單 Web App

這是一個在 **GitHub Copilot 實戰工作坊**中完成的純前端待辦清單應用程式，目標是透過簡單、實用且有資料持久化能力的介面，展示 AI 協作開發與實際交付流程。

## 🌐 線上展示

**https://john1012.github.io/copilot-workshop-in-taipei/**

## ✨ 功能

- 新增待辦事項，空白內容不會送出
- 勾選與取消勾選已完成狀態
- 刪除單一待辦事項
- 依全部 / 未完成 / 已完成進行篩選
- 清除所有已完成項目
- 底部即時顯示「未完成:N 項」
- 深色與淺色主題切換
- 所有資料存放在瀏覽器 `localStorage`，重新整理後仍維持狀態
- 以純前端方式實作，支援桌面與手機版面

## 🛠 技術

| 項目 | 內容                         |
| :--- | :--------------------------- |
| 前端 | HTML5、CSS3、原生 JavaScript |
| 架構 | 無框架、無套件、無建置流程   |
| 儲存 | localStorage                 |
| 部署 | GitHub Pages                 |
| 設計 | CSS 變數與回應式排版         |

## 🤖 開發方式

這個專案是如何透過 GitHub Copilot 的 AI 開發流程完成的：

- **Agent Mode**：讓 AI 依需求直接建立與修改前端檔案，並逐步驗證功能是否正確。
- **MCP**：整合 Microsoft Learn 與 GitHub 上下文，讓 AI 能查官方文件與檢查 issue 情境。
- **Agentic workflow**：透過 `.github/copilot-instructions.md` 與 `.github/prompts/fix-issue.prompt.md`，將修正 issue 的流程固化成可重複執行的腳本。
- **版本控制**：透過 PR、合併與 GitHub Pages 部署，將開發成果變成真正可公開使用的作品。

## 💡 我學到什麼

1. 以自然語言描述需求時，越清楚越容易得到符合目標的實作結果。
2. AI 不只是自動補全，而是可以協助規劃、修改與驗證整個開發流程。
3. MCP 能擴充 AI 的資訊來源，讓它更容易理解專案與外部規範。
4. 定義標準化 workflow 後，重複性任務可以被重用，讓開發更穩定。
5. 在 AI 協作下，仍需人工檢查與驗證，才能確保結果符合實際需求。

## 📄 授權

MIT
