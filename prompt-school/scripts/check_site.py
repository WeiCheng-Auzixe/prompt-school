#!/usr/bin/env python3
"""
check_site.py — 檢查網站是否符合 AGENTS.md 的規則

用法（在專案根目錄）：
    python3 scripts/check_site.py

全部通過會顯示 "All checks passed"，否則列出每一個問題並回傳錯誤碼 1。
只使用 Python 標準函式庫，不需要安裝任何套件。
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED_SECTIONS = ["goals", "concept", "example", "practice", "recap"]
LEVELS = {"入門", "進階", "實戰"}
FILE_RE = re.compile(r"^lessons/(\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.html$")

errors = []


def err(where, msg):
    errors.append(f"[{where}] {msg}")


def load_js_json(text, name):
    """取出 window.NAME = <JSON>; 中的 JSON。"""
    m = re.search(rf"window\.{name}\s*=\s*", text)
    if not m:
        err("pages.js", f"找不到 window.{name} = ...;")
        return None
    try:
        value, end = json.JSONDecoder().raw_decode(text, m.end())
        if not text[end:].lstrip().startswith(";"):
            err("pages.js", f"window.{name} 的 JSON 結尾後面必須接分號 ;")
        return value
    except json.JSONDecodeError as e:
        err("pages.js", f"window.{name} 不是合法 JSON：{e}")
        return None


class LessonParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sections = []
        self.classes = set()
        self.h1 = ""
        self.title = ""
        self._in = None
        self.body_root = None
        self.scripts = []
        self.inline_style = False
        self.style_tag = False
        self.inline_script = False
        self.abs_links = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for c in (a.get("class") or "").split():
            self.classes.add(c)
        if "style" in a:
            self.inline_style = True
        for key in ("href", "src"):
            v = a.get(key)
            if v and v.startswith("/") and not v.startswith("//"):
                self.abs_links.append(v)
        if tag == "section" and a.get("id"):
            self.sections.append(a["id"])
        elif tag == "h1":
            self._in = "h1"
        elif tag == "title":
            self._in = "title"
        elif tag == "body":
            self.body_root = a.get("data-root")
        elif tag == "style":
            self.style_tag = True
        elif tag == "script":
            if a.get("src"):
                self.scripts.append(a["src"])
            else:
                self.inline_script = True

    def handle_endtag(self, tag):
        if tag in ("h1", "title"):
            self._in = None

    def handle_data(self, data):
        if self._in == "h1":
            self.h1 += data
        elif self._in == "title":
            self.title += data


def check_lesson(lesson, path):
    where = path.relative_to(ROOT).as_posix()
    text = path.read_text(encoding="utf-8")
    p = LessonParser()
    p.feed(text)

    if p.h1.strip() != lesson["title"]:
        err(where, f"<h1>「{p.h1.strip()}」和 pages.js 的 title「{lesson['title']}」不一致")
    if not p.title.strip().startswith(lesson["title"]):
        err(where, "<title> 必須以講義標題開頭")
    if p.sections != REQUIRED_SECTIONS:
        err(where, f"段落必須依序為 {REQUIRED_SECTIONS}，目前是 {p.sections}")
    for cls in ("lesson-hero", "lesson-no", "lesson-lead", "compare", "exercise", "recap"):
        if cls not in p.classes:
            err(where, f"缺少必要元件 .{cls}")
    if p.body_root != "../":
        err(where, '<body> 必須有 data-root="../"')
    if p.scripts != ["../assets/js/pages.js", "../assets/js/site.js"]:
        err(where, "結尾必須依序載入 ../assets/js/pages.js 與 ../assets/js/site.js")
    if p.inline_style:
        err(where, "不可使用 inline style（style=\"...\"）")
    if p.style_tag:
        err(where, "不可使用 <style> 標籤，樣式請寫在 assets/css/style.css")
    if p.inline_script:
        err(where, "不可使用 inline <script>")
    for link in p.abs_links:
        err(where, f"請改用相對路徑：{link}")
    if "TODO" in text:
        err(where, "還有沒填完的 TODO")
    if "site-header" in p.classes or "site-footer" in p.classes or "pager" in p.classes:
        err(where, "不要手寫頁首、頁尾或上下篇，交給 site.js 產生")


def main():
    pages_js = (ROOT / "assets/js/pages.js").read_text(encoding="utf-8")
    site = load_js_json(pages_js, "SITE")
    lessons = load_js_json(pages_js, "LESSONS")
    if site is not None:
        for key in ("title", "tagline", "repo", "author"):
            if key not in site:
                err("pages.js", f"window.SITE 缺少 {key}")
    if lessons is None:
        return report()

    registered = set()
    for i, lesson in enumerate(lessons, start=1):
        where = f"pages.js #{i}"
        for key in ("id", "file", "title", "summary", "minutes", "level", "tags"):
            if key not in lesson:
                err(where, f"缺少欄位 {key}")
        if any(k not in lesson for k in ("id", "file", "title")):
            continue
        expected_id = f"{i:02d}"
        if lesson["id"] != expected_id:
            err(where, f"id 應該是 {expected_id}（需由 01 起連號、依序排列），目前是 {lesson['id']}")
        m = FILE_RE.match(lesson["file"])
        if not m:
            err(where, f"檔名格式錯誤：{lesson['file']}（應為 lessons/NN-slug.html）")
        elif m.group(1) != lesson["id"]:
            err(where, f"檔名編號 {m.group(1)} 和 id {lesson['id']} 不一致")
        if lesson.get("level") not in LEVELS:
            err(where, f"level 只能是 {sorted(LEVELS)}")
        tags = lesson.get("tags", [])
        if not (1 <= len(tags) <= 3):
            err(where, "tags 需要 1–3 個")
        if len(lesson.get("summary", "")) > 40:
            err(where, "summary 超過 40 字")
        if not isinstance(lesson.get("minutes"), int):
            err(where, "minutes 必須是整數")

        path = ROOT / lesson["file"]
        registered.add(lesson["file"])
        if not path.exists():
            err(where, f"找不到檔案 {lesson['file']}")
        else:
            check_lesson(lesson, path)

    for path in sorted((ROOT / "lessons").glob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        if rel not in registered:
            err(rel, "這個講義沒有在 pages.js 登記")

    for required in ("index.html", "AGENTS.md", "CLAUDE.md", ".nojekyll", "templates/lesson-template.html"):
        if not (ROOT / required).exists():
            err("專案", f"缺少 {required}")

    return report(len(lessons))


def report(count=0):
    if errors:
        print(f"Found {len(errors)} problem(s):")
        for e in errors:
            print("  -", e)
        return 1
    print(f"All checks passed ({count} lessons)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
