# Prompt 小學堂

給大學生的**提示詞工程（Prompt Engineering）入門講義網站**。
每篇講義約 10 分鐘，都有「不好 vs. 好」的對照範例與動手練習。

整個網站依照 [`AGENTS.md`](AGENTS.md) 的規則建立：只要照著同一套規則，AI 就能很快地繼續新增講義，且風格與結構都和既有頁面一致。

- 網站：`https://YOUR-ACCOUNT.github.io/prompt-school/`
- 技術：純 HTML + CSS + 原生 JavaScript，不需要任何建置步驟

## 目前的講義

| # | 標題 | 等級 |
| --- | --- | --- |
| 01 | 提示詞是什麼？好提示的四個要素 | 入門 |
| 02 | 給 AI 角色與背景脈絡 | 入門 |
| 03 | 用範例教 AI：少樣本提示 | 進階 |
| 04 | 指定輸出格式：表格、清單與 JSON | 進階 |
| 05 | 寫一份 AGENTS.md：讓 AI 記住專案規則 | 實戰 |

## 專案結構

```
├── AGENTS.md                  AI 開發規則（唯一規則來源）
├── CLAUDE.md                  Claude Code 入口，指向 AGENTS.md
├── index.html                 首頁
├── assets/css/style.css       全站樣式
├── assets/js/pages.js         講義清單（新增講義在這裡登記）
├── assets/js/site.js          導覽、目錄、上下篇、複製按鈕
├── lessons/NN-slug.html       講義頁面
├── templates/lesson-template.html  新講義樣板
└── scripts/check_site.py      規則檢查腳本
```

## 本機預覽

```bash
python3 -m http.server 8000
# 瀏覽器打開 http://localhost:8000
```

## 新增一篇講義

對 AI 說：

> 請先閱讀 AGENTS.md，然後依照「新增一篇講義的標準流程」，幫我新增一篇講義，主題是「讓 AI 一步一步思考」。

AI 會：複製樣板 → 寫好 5 個固定段落 → 在 `pages.js` 登記 → 執行 `python3 scripts/check_site.py` 檢查。

---

## 部署到 GitHub Pages

### 0. （可選）填上作者名字

打開 `assets/js/pages.js`，把 `"author": "YOUR-NAME"` 換成你的名字，頁尾就會顯示作者。
GitHub 連結不用改：網站放上 GitHub Pages 後，會從網址自動推算 repo 位置。
README 最上面的網站網址可以換成你自己的。

### 方法 A：用網頁上傳（不用打指令）

1. 登入 GitHub → 右上角 **+** → **New repository**
2. Repository name 填 `prompt-school`，選 **Public**，按 **Create repository**
3. 在新 repo 頁面點 **uploading an existing file**
4. 把解壓縮後 `prompt-school` 資料夾**裡面的所有檔案和資料夾**拖進去（不是拖整個外層資料夾）
   - `.nojekyll` 是隱藏檔，若拖不到可以之後用 **Add file → Create new file** 建立一個空檔案叫 `.nojekyll`（本網站沒有它也能正常運作）
5. 按 **Commit changes**
6. 到 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 **Save**
7. 等 1–3 分鐘，重新整理 Pages 設定頁，上方會出現網址：
   `https://YOUR-ACCOUNT.github.io/prompt-school/`

### 方法 B：用 git 指令

```bash
cd prompt-school
git init
git add .
git commit -m "Initial commit: Prompt 小學堂"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/prompt-school.git
git push -u origin main
```

接著同方法 A 的第 6–7 步開啟 GitHub Pages。
