# AGENTS.md — Prompt 小學堂

> 這份文件是寫給 AI 助手（Claude Code、Codex、Cursor、Copilot 等）看的「專案說明書」。
> 在新增或修改任何內容之前，**請先完整讀完這份文件**，並遵守其中的規則。
> 人類協作者也可以把它當作開發規範。

---

## 1. 專案目的

「Prompt 小學堂」是一個**提示詞工程（Prompt Engineering）入門講義網站**。

- **讀者**：第一次接觸生成式 AI 的大學生，沒有程式背景也看得懂。
- **目標**：每篇講義用 8–12 分鐘讀完，學會一個「馬上能用」的提示詞技巧。
- **語言**：正體中文（台灣用語），專有名詞第一次出現時附上英文，例如「少樣本提示（Few-shot Prompting）」。
- **形式**：純靜態網站（HTML + CSS + 原生 JavaScript），部署在 GitHub Pages，**不需要任何建置步驟**。

這個專案的重點不是「做出一個網頁」，而是建立一套**可以重複使用的規則**：
之後只要照著本文件的流程，就能很快地加一篇新講義，而且風格、結構都和既有頁面一致。

---

## 2. 檔案結構

```
（repo 最外層）
├── AGENTS.md                  ← 本文件（AI 開發規則，唯一的規則來源）
├── CLAUDE.md                  ← 給 Claude Code 讀的入口，內容指向 AGENTS.md
├── README.md                  ← 給人看的專案介紹與部署方式
├── SUBMISSION.md              ← 課堂作業繳交內容（不是網站的一部分）
├── index.html                 ← 首頁（在最外層；講義列表由 JS 自動產生）
├── .nojekyll                  ← 讓 GitHub Pages 不經過 Jekyll 處理
└── prompt-school/             ← 網站本體（其餘檔案都放這裡）
    ├── assets/
    │   ├── css/style.css      ← 全站唯一的樣式檔
    │   └── js/
    │       ├── pages.js       ← ★ 講義清單（新增講義一定要改這裡）
    │       └── site.js        ← 共用功能：導覽列、目錄、上下篇、複製按鈕
    ├── lessons/
    │   └── NN-slug.html       ← 每一篇講義一個檔案
    ├── templates/
    │   └── lesson-template.html ← 新講義的樣板，複製它來開始
    └── scripts/
        └── check_site.py      ← 檢查腳本，改完一定要跑
```

**不要**新增其他資料夾或 CSS／JS 檔，除非使用者明確要求。

---

## 3. 整體風格（Design System）

風格關鍵字：**「紙本筆記本」**——溫暖的米白紙張、深墨色文字、朱紅色印章當重點色。

| 項目 | 規則 |
| --- | --- |
| 背景色 | `--paper: #f7f3ea`（米白紙） |
| 主要文字 | `--ink: #1f2933`（深墨） |
| 重點色 | `--accent: #c2410c`（朱紅，用在講義編號、連結、重點） |
| 輔助色 | `--sage: #3f6b5c`（「好的範例」）、`--rust: #9a3412`（「不好的範例」） |
| 標題字體 | `Noto Serif TC`（襯線，有書本感） |
| 內文字體 | `Noto Sans TC` |
| 程式／提示詞 | `JetBrains Mono` |
| 內文寬度 | 最多 `72ch`，行高 `1.85` |

- **所有顏色、字體、間距都使用 `style.css` 最上方的 CSS 變數**，不要在 HTML 裡寫 `style="..."`，也不要寫死色碼。
- 不使用 emoji 當標題裝飾；圖示用文字或 CSS 做。
- 必須支援手機（寬度 375px 也要好讀）。

---

## 4. 講義頁面結構（最重要）

每一篇講義都必須有**以下 5 個段落，順序固定、`id` 固定**：

| 順序 | `id` | 標題文字 | 內容 |
| --- | --- | --- | --- |
| 1 | `goals` | 學習目標 | 2–4 點，用「讀完後你可以……」開頭的條列 |
| 2 | `concept` | 核心觀念 | 解釋技巧是什麼、為什麼有效，可用 `.callout` 補充 |
| 3 | `example` | 實際範例 | **至少一組** `.compare`（不好 vs. 好的提示詞） |
| 4 | `practice` | 動手練習 | 至少一題 `.exercise`，參考答案放在 `<details>` 裡 |
| 5 | `recap` | 重點回顧 | 3 點以內的 `.recap` 條列 |

### 頁面骨架

```html
<body class="lesson" data-root="../" data-home="../../">
  <main class="lesson-main">
    <article class="lesson-article">
      <header class="lesson-hero">
        <p class="lesson-no">Lesson 03</p>
        <h1>講義標題（必須和 pages.js 的 title 完全一樣）</h1>
        <p class="lesson-lead">一句話說明這篇在教什麼。</p>
      </header>

      <section id="goals"> <h2>學習目標</h2> ... </section>
      <section id="concept"> <h2>核心觀念</h2> ... </section>
      <section id="example"> <h2>實際範例</h2> ... </section>
      <section id="practice"> <h2>動手練習</h2> ... </section>
      <section id="recap"> <h2>重點回顧</h2> ... </section>
    </article>
  </main>
  <script src="../assets/js/pages.js"></script>
  <script src="../assets/js/site.js"></script>
</body>
```

導覽列、頁尾、側邊目錄、閱讀時間、標籤、上一篇／下一篇，**全部由 `site.js` 根據 `pages.js` 自動產生**，
講義 HTML 裡**不要**手寫這些東西。

### 可用元件（只能用這些）

```html
<!-- 提示框：tip（建議）、warn（注意）、note（補充） -->
<div class="callout callout--tip"><strong>小撇步</strong><p>內容</p></div>

<!-- 提示詞區塊：會自動出現「複製」按鈕 -->
<pre class="prompt-box" data-label="提示詞">這裡放提示詞原文</pre>

<!-- 好壞對照 -->
<div class="compare">
  <div class="compare__bad"><h3>不好的寫法</h3><pre class="prompt-box">...</pre><p>為什麼不好</p></div>
  <div class="compare__good"><h3>比較好的寫法</h3><pre class="prompt-box">...</pre><p>為什麼比較好</p></div>
</div>

<!-- 練習題 -->
<div class="exercise">
  <p class="exercise__q"><strong>練習 1</strong> 題目內容</p>
  <details><summary>看參考答案</summary><pre class="prompt-box">...</pre></details>
</div>

<!-- 重點回顧 -->
<ul class="recap"><li>重點一</li><li>重點二</li></ul>
```

需要新元件時：先在 `style.css` 末端的「元件」區新增並加上註解，再把用法補進本節。

---

## 5. 檔案命名與放置

- 路徑說明：`data-root` 指向網站資料夾 `prompt-school/`（講義的 `../`），`data-home` 指向 repo 最外層（`index.html`、`AGENTS.md` 所在處，講義裡固定是 `../../`）。
- 講義放在 `prompt-school/lessons/`，檔名格式：**`NN-英文-slug.html`**
  - `NN`：兩位數編號，從 `01` 開始，**不可跳號、不可重複**
  - `slug`：小寫英文、單字用 `-` 連接，例如 `03-few-shot-examples.html`
  - 不可使用中文檔名、空白或大寫
- 圖片（若需要）放在 `prompt-school/assets/img/NN-說明.png`，HTML 中一律用相對路徑。
- 所有連結都用**相對路徑**（GitHub Pages 的網址會帶 repo 名稱，用 `/` 開頭會壞掉）。

---

## 6. `pages.js` 的格式

`prompt-school/assets/js/pages.js` 是全站的**唯一資料來源**。首頁卡片、導覽、上下篇都靠它。

```js
window.LESSONS = [
  {
    "id": "03",
    "file": "lessons/03-few-shot-examples.html",
    "title": "用範例教 AI：少樣本提示",
    "summary": "一句話摘要，會顯示在首頁卡片（40 字以內）",
    "minutes": 10,
    "level": "入門",
    "tags": ["技巧", "範例"]
  }
];
```

規則：

1. `=` 後面到 `;` 之間必須是**合法 JSON**（雙引號、最後一筆後面不能有逗號），因為檢查腳本會用 JSON 解析它。
2. 陣列依 `id` 由小到大排序。
3. `level` 只能是 `入門`、`進階`、`實戰` 三種之一。
4. `tags` 1–3 個，盡量沿用既有標籤：`基礎`、`技巧`、`範例`、`格式`、`工具`、`協作`。

---

## 7. 新增一篇講義的標準流程

當使用者說「幫我新增一篇講義，主題是 X」時，依序做：

1. **讀** `prompt-school/assets/js/pages.js`，找出目前最大的編號 `NN`，新講義用 `NN+1`。
2. **複製** `prompt-school/templates/lesson-template.html` 到 `prompt-school/lessons/NN-slug.html`。
3. **填內容**：依第 4 節的 5 個段落撰寫，至少一組 `.compare`、一題 `.exercise`。
4. **登記**：在 `pages.js` 陣列最後加上一筆資料，`title` 要和 `<h1>`、`<title>` 一致。
5. **檢查**：執行 `python3 prompt-school/scripts/check_site.py`，必須顯示 `All checks passed`。
6. **回報**：告訴使用者新增了哪個檔案、主題重點、以及如何本機預覽。

修改既有講義時：只改內容，**不要**改檔名或編號（會讓別人存的連結失效）。

---

## 8. 寫作規範

- 一個段落不超過 4 句話；多用條列和範例，少用長篇大論。
- 語氣像學長姐在教學弟妹：親切、直接，用「你」稱呼讀者。
- 提示詞範例要**真的能貼到 ChatGPT / Claude 使用**，不要寫虛構的語法。
- 「不好的寫法」要是新手真的會寫出來的樣子，並說明它的問題。
- 不要寫出特定 AI 產品的價格、版本號等容易過期的資訊。
- 標點使用全形（，。、「」），中英文之間加一個半形空格。

---

## 9. AI 修改時必須遵守的規則

**一定要做**

- 動手前先讀本文件與 `pages.js`；不確定就先問使用者。
- 沿用既有元件與 CSS 變數，讓新頁面看起來和舊頁面是同一套。
- 每次修改後執行 `python3 prompt-school/scripts/check_site.py`。
- 新增元件或規則時，同步更新本文件（AGENTS.md 是唯一的規則來源）。

**不可以做**

- 不可引入框架、套件或建置工具（React、Vue、Tailwind、npm 等）。
- 不可在講義 HTML 中寫 inline style、inline script 或另外的 `<style>`。
- 不可手寫導覽列、頁尾或上下篇連結（交給 `site.js`）。
- 不可刪除或重新編號既有講義，除非使用者明確要求。
- 不可從外部網站載入除了 Google Fonts 以外的資源。

---

## 10. 本機預覽與部署

```bash
# 本機預覽（在專案根目錄）
python3 -m http.server 8000
# 打開 http://localhost:8000

# 檢查
python3 prompt-school/scripts/check_site.py
```

部署：推送到 GitHub 的 `main` 分支，在 **Settings → Pages** 選擇
`Deploy from a branch` → `main` / `(root)`。幾分鐘後網站就會出現在
`https://<帳號>.github.io/<repo 名稱>/`（`index.html` 在最外層，網站其餘檔案在 `prompt-school/` 內）。

網站名稱、作者等設定寫在 `prompt-school/assets/js/pages.js` 的 `window.SITE`。`repo` 保留 `YOUR-ACCOUNT` 時，
`site.js` 會從 GitHub Pages 網址自動推算 repo 連結；本機預覽時「專案規則」會直接開啟本地的 `AGENTS.md`。
