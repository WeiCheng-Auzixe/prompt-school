/* ==========================================================
   pages.js — 全站唯一資料來源（見 AGENTS.md 第 6 節）
   注意：= 之後到 ; 之前必須是合法 JSON（雙引號、不可有結尾逗號）
   repo 可以不改：放上 GitHub Pages 後，site.js 會從網址自動推算 repo 連結。
   author 改成你的名字後，頁尾會顯示作者。
   ========================================================== */

window.SITE = {
  "title": "Prompt 小學堂",
  "tagline": "給大學生的提示詞工程入門講義",
  "repo": "https://github.com/YOUR-ACCOUNT/prompt-school",
  "author": "YOUR-NAME"
};

window.LESSONS = [
  {
    "id": "01",
    "file": "lessons/01-what-is-a-prompt.html",
    "title": "提示詞是什麼？好提示的四個要素",
    "summary": "從「問一句話」升級成「交代一件事」：任務、脈絡、限制、格式。",
    "minutes": 8,
    "level": "入門",
    "tags": ["基礎"]
  },
  {
    "id": "02",
    "file": "lessons/02-role-and-context.html",
    "title": "給 AI 角色與背景脈絡",
    "summary": "告訴 AI「你是誰、對象是誰、為什麼要做」，回答立刻變得具體。",
    "minutes": 9,
    "level": "入門",
    "tags": ["技巧"]
  },
  {
    "id": "03",
    "file": "lessons/03-few-shot-examples.html",
    "title": "用範例教 AI：少樣本提示",
    "summary": "與其描述你要的風格，不如直接給兩三個範例讓 AI 模仿。",
    "minutes": 10,
    "level": "進階",
    "tags": ["技巧", "範例"]
  },
  {
    "id": "04",
    "file": "lessons/04-structured-output.html",
    "title": "指定輸出格式：表格、清單與 JSON",
    "summary": "先定好格式再請 AI 回答，結果可以直接貼進報告或程式裡。",
    "minutes": 10,
    "level": "進階",
    "tags": ["格式"]
  },
  {
    "id": "05",
    "file": "lessons/05-agents-md.html",
    "title": "寫一份 AGENTS.md：讓 AI 記住專案規則",
    "summary": "把每次都要重講的規則寫成文件，AI 讀完就能照同一套方式做事。",
    "minutes": 12,
    "level": "實戰",
    "tags": ["協作", "工具"]
  }
];
