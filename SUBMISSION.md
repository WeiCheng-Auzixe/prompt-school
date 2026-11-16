# 繳交內容（複製貼上用）

> 把 `○○○` 換成你自己的資料，`YOUR-ACCOUNT` 換成你的 GitHub 帳號。

**繳交標題：**

```
雲科 ○○○○○○○○ ○○○ ○○○ Prompt 小學堂
```
（格式：學校 學號 系級 姓名 主題）

---

## 1. 專案簡介

「Prompt 小學堂」是一個給大學生的提示詞工程入門講義網站，目前有 5 篇講義：提示詞四要素、角色與脈絡、少樣本提示、指定輸出格式、撰寫 AGENTS.md。每篇約 10 分鐘，都有「不好 vs. 好」的提示詞對照、動手練習（附參考答案）與重點回顧。

網站使用純 HTML / CSS / JavaScript，不需建置，直接部署在 GitHub Pages。我用 `AGENTS.md` 定義了網站目的、紙本筆記本風格、固定的講義結構、檔案命名方式與 AI 修改規則，並寫了一支 `check_site.py` 自動檢查新頁面是否符合規則。

## 2. GitHub Repository 連結

https://github.com/YOUR-ACCOUNT/prompt-school

## 3. 網頁連結

https://YOUR-ACCOUNT.github.io/prompt-school/

## 4. AGENTS.md / CLAUDE.md

- AGENTS.md：https://github.com/YOUR-ACCOUNT/prompt-school/blob/main/AGENTS.md
- CLAUDE.md：https://github.com/YOUR-ACCOUNT/prompt-school/blob/main/CLAUDE.md（內容以 `@AGENTS.md` 引入同一份規則）

（如需附檔，直接上傳專案中的 `AGENTS.md`。）

## 5. 之後要新增頁面時，規則如何幫助 AI 繼續完成？

之後只要對 AI 說「請先讀 AGENTS.md，新增一篇講義，主題是 X」，AI 就能照固定流程完成，不需要我每次重新解釋：

1. **知道放哪裡、叫什麼名字**：規則規定講義放在 `prompt-school/lessons/`，檔名為 `NN-英文slug.html`，AI 會先讀 `pages.js` 找到下一個編號。
2. **有樣板可以複製**：`prompt-school/templates/lesson-template.html` 已經有完整骨架，AI 只要填內容。
3. **結構與風格一致**：每篇固定 5 個段落（學習目標、核心觀念、實際範例、動手練習、重點回顧），只能使用規定的元件與 CSS 變數，所以新頁面看起來和舊頁面是同一套。
4. **只要登記一次就自動串接**：在 `pages.js` 加一筆資料，首頁卡片、側邊目錄、上一篇／下一篇都由 `site.js` 自動產生，AI 不會漏改其他頁面。
5. **可以自動檢查**：`prompt-school/scripts/check_site.py` 會檢查段落順序、標題一致、檔名格式、是否登記、有沒有 inline style 等，AI 改完執行看到 `All checks passed` 才算完成。

也就是說，`AGENTS.md` 把「怎麼做」變成具體、可檢查的規則，AI 每次都能用同一套方式快速產出新內容。
