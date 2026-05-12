---
id: DOC-00-GOVERNANCE-PR-DOC-CHECKLIST
number: GOV-004
domain: governance
category: review-process
title: 文档治理PR检查清单
owner: docs-maintainer
status: active
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs:
  - docs/00-governance/document-governance.md
  - docs/README.md
---

# 文档治理 PR 检查清单

在合并前逐项确认：

- [ ] 仅在 `docs/` 目录新增或修改业务文档
- [ ] active 文档 Frontmatter 字段完整
- [ ] `docs/README.md` 已同步登记新增/变更文档
- [ ] 文档链接均为有效 `docs/...` 路径
- [ ] 同主题无多份 active 冲突文档
- [ ] 历史文档已迁入 `docs/99-archive/` 或标记 `deprecated`
- [ ] 若影响设计规范，已同步 `design-specification` 与 `design-checklist`
