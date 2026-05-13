---
id: DOC-PROJECT-REPORT-WIKI
number: PRJ-010
domain: project
category: report
title: Wiki 操作日志
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
---

# Wiki 操作日志

> 只追加，不修改。记录所有文档 Ingest / Query / Lint / Test / Distill 事件。

---

## 2026-05-13 | Refactor | 文档分类迁移

- 移动 `cloudflare-setup-guide.md` → `docs/03-development/`（操作指南，非治理制度）
- 移动 `2026-05-11-knowledge-engine.md` → `docs/03-development/`（技术方案类文档）
- 移动 `mvp-code-quality-plan-v2.md` → `docs/05-project/`（项目计划类文档）
- 移动 `2026-05-11-harness-governance.md` → `docs/99-archive/`（已过期实施计划）
- 合并 `pr-doc-checklist.md` 到 `document-governance.md`（Clause 12），原文件归档至 `99-archive/`
- 合并 `reasoning-language.md` 到 `project-charter.md`（Clause 6），原文件归档至 `99-archive/`
- 更新 5 个文件的 frontmatter（domain/category/id）

## 2026-05-11 | Init | 知识引擎地基文件创建

- 新建 `docs/ai/knowledge/patterns.md` — 从 `memory/patterns/shadcn-workflow.md` 迁移
- 新建 `docs/ai/knowledge/decisions.md` — 从 `MEMORY.md` 提取 10 个关键决策
- 新建 `docs/ai/knowledge/rules.md` — 从 `AGENTS.md` + `document-governance.md` 提取
- 新建 `docs/ai/context/state.md` — 当前项目状态
- 新建 `docs/04-operations/log.md` — 本文件
