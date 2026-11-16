# CLAUDE.md

本專案的所有開發規則都寫在 `AGENTS.md`，請先完整閱讀它：

@AGENTS.md

## 給 Claude Code 的快速提醒

- 新增講義：複製 `prompt-school/templates/lesson-template.html` → 放到 `prompt-school/lessons/NN-slug.html` → 在 `prompt-school/assets/js/pages.js` 登記。
- 講義必須有 5 個段落：`goals`、`concept`、`example`、`practice`、`recap`。
- 改完一定要跑 `python3 prompt-school/scripts/check_site.py`，看到 `All checks passed` 才算完成。
- 不要引入任何框架或建置工具；不要寫 inline style。
