/* ==========================================================
   site.js — 共用功能（見 AGENTS.md 第 4 節）
   - 產生頁首、頁尾
   - 首頁：依 pages.js 產生講義卡片
   - 講義頁：產生標籤／閱讀時間、側邊目錄、上一篇／下一篇
   - 所有 .prompt-box 加上「複製」按鈕
   講義 HTML 不需要、也不應該手寫以上這些東西。
   ========================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || { title: "Prompt 小學堂", tagline: "", repo: "#", author: "" };
  var LESSONS = (window.LESSONS || []).slice().sort(function (a, b) { return a.id.localeCompare(b.id); });
  var body = document.body;
  var root = body.getAttribute("data-root") || "./";
  var READ_KEY = "prompt-school:read";

  /* ---------- 小工具 ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }
  function readSet() {
    try { return JSON.parse(localStorage.getItem(READ_KEY) || "[]"); } catch (e) { return []; }
  }
  function markRead(id) {
    try {
      var s = readSet();
      if (s.indexOf(id) === -1) { s.push(id); localStorage.setItem(READ_KEY, JSON.stringify(s)); }
    } catch (e) { /* 瀏覽器不支援儲存時直接略過 */ }
  }
  function metaRow(lesson) {
    var row = el("div", { class: "meta" }, [
      el("span", { class: "tag tag--level", text: lesson.level }),
      el("span", { text: "約 " + lesson.minutes + " 分鐘" })
    ]);
    lesson.tags.forEach(function (t) { row.appendChild(el("span", { class: "tag", text: "#" + t })); });
    return row;
  }

  /* GitHub repo 網址：pages.js 有填就用；沒填（還是 YOUR-ACCOUNT）就從 GitHub Pages 網址自動推算 */
  function detectRepo() {
    if (SITE.repo && SITE.repo.indexOf("YOUR-ACCOUNT") === -1) return SITE.repo;
    var host = location.hostname;
    if (!/\.github\.io$/.test(host)) return null;
    var user = host.split(".")[0];
    var seg = location.pathname.split("/").filter(Boolean)[0];
    var repo = (seg && !/\.html$/.test(seg) && seg !== "lessons") ? seg : host;
    return "https://github.com/" + user + "/" + repo;
  }
  var repoUrl = detectRepo();
  var hasAuthor = SITE.author && SITE.author !== "YOUR-NAME";

  var path = decodeURIComponent(location.pathname);
  var current = LESSONS.filter(function (l) { return path.slice(-l.file.length) === l.file; })[0];
  var isHome = body.classList.contains("home");

  /* ---------- 頁首 ---------- */
  var progress = el("div", { class: "progress", "aria-hidden": "true" });
  var nav = el("nav", { class: "site-nav", "aria-label": "主要導覽" }, [
    el("a", { href: root + "index.html#lessons", text: "全部講義" }),
    // 上線後連到 GitHub 上的 AGENTS.md；本機預覽時直接開專案裡的 AGENTS.md
    el("a", { href: repoUrl ? repoUrl + "/blob/main/AGENTS.md" : root + "AGENTS.md", text: "專案規則" }),
    repoUrl ? el("a", { href: repoUrl, text: "GitHub" }) : null
  ]);
  var header = el("header", { class: "site-header" }, [
    el("div", { class: "site-header__inner" }, [
      el("a", { class: "brand", href: root + "index.html" }, [
        el("span", { class: "brand__seal", text: "問" }),
        el("span", { text: SITE.title })
      ]),
      nav
    ]),
    progress
  ]);
  body.insertBefore(header, body.firstChild);

  /* ---------- 頁尾 ---------- */
  body.appendChild(el("footer", { class: "site-footer" }, [
    el("p", { text: SITE.title + " · " + SITE.tagline }),
    el("p", { text: "依照 AGENTS.md 規則建立" + (hasAuthor ? " · 作者 " + SITE.author : "") })
  ]));

  /* ---------- 首頁：講義卡片 ---------- */
  var list = document.getElementById("lesson-list");
  if (isHome && list) {
    var done = readSet();
    LESSONS.forEach(function (l) {
      var card = el("a", { class: "lesson-card", href: root + l.file }, [
        el("div", { class: "lesson-card__no", text: l.id }),
        el("h3", { text: l.title }),
        el("p", { text: l.summary }),
        metaRow(l)
      ]);
      if (done.indexOf(l.id) !== -1) card.appendChild(el("span", { class: "lesson-card__read", text: "已讀" }));
      list.appendChild(el("li", {}, [card]));
    });
    var count = document.getElementById("lesson-count");
    if (count) count.textContent = "共 " + LESSONS.length + " 篇";
  }

  /* ---------- 講義頁 ---------- */
  var article = document.querySelector(".lesson-article");
  if (current && article) {
    document.title = current.title + "｜" + SITE.title;

    // 標籤與閱讀時間
    var hero = article.querySelector(".lesson-hero");
    if (hero) hero.appendChild(metaRow(current));

    // 側邊目錄
    var tocList = el("ol");
    var links = [];
    article.querySelectorAll("section[id] > h2").forEach(function (h2) {
      var a = el("a", { href: "#" + h2.parentElement.id, text: h2.textContent });
      links.push(a);
      tocList.appendChild(el("li", {}, [a]));
    });
    var main = document.querySelector(".lesson-main");
    if (main) main.appendChild(el("aside", { class: "toc", "aria-label": "本頁目錄" }, [
      el("p", { class: "toc__title", text: "LESSON " + current.id }),
      tocList
    ]));

    // 目前閱讀段落高亮
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); });
        });
      }, { rootMargin: "-30% 0px -60% 0px" });
      article.querySelectorAll("section[id]").forEach(function (s) { io.observe(s); });
    }

    // 上一篇／下一篇
    var idx = LESSONS.indexOf(current);
    var prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
    var pager = el("nav", { class: "pager", "aria-label": "上一篇與下一篇" });
    if (prev) pager.appendChild(el("a", { class: "pager__prev", href: root + prev.file }, [
      el("small", { text: "← 上一篇" }), el("span", { text: prev.title })
    ]));
    if (next) pager.appendChild(el("a", { class: "pager__next", href: root + next.file }, [
      el("small", { text: "下一篇 →" }), el("span", { text: next.title })
    ]));
    article.appendChild(pager);

    markRead(current.id);
  }

  /* ---------- 複製按鈕 ---------- */
  document.querySelectorAll(".prompt-box").forEach(function (box) {
    var wrap = el("div", { class: "prompt-wrap" });
    box.parentNode.insertBefore(wrap, box);
    wrap.appendChild(box);
    var btn = el("button", { class: "copy-btn", type: "button", text: "複製" });
    btn.addEventListener("click", function () {
      var text = box.innerText;
      var ok = function () { btn.textContent = "已複製"; setTimeout(function () { btn.textContent = "複製"; }, 1500); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(ok);
      } else {
        var ta = el("textarea"); ta.value = text; document.body.appendChild(ta);
        ta.select(); try { document.execCommand("copy"); ok(); } catch (e) {} ta.remove();
      }
    });
    wrap.appendChild(btn);
  });

  /* ---------- 閱讀進度條 ---------- */
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
