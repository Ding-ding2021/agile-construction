---
number: PRJ-017
domain: project
category: plan
title: 项目规划
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_docs:
  - docs/00-governance/project-charter.md
  - docs/00-governance/agent-squad-protocol.md
  - docs/README.md
---

# 项目规划

> 本文件记录项目里程碑、版本规范和 Phase 映射。由 `项目章程`（GOV-006）定义治理原则，本文件体现具体推进计划。

## 里程碑映射

| 里程碑                      | 对应 Phase | 任务数 | 状态      |
| --------------------------- | ---------- | ------ | --------- |
| M1 - Phase 1 底座搭建       | Phase 1    | —      | ✅ 已完成 |
| M1.5 - Phase 1.5 底座收官   | Phase 1.5  | —      | ✅ 已完成 |
| M2 - Phase 2 WBS/标准/任务  | Phase 2    | —      | ✅ 已完成 |
| M3 - Phase 3 模板中心       | Phase 3    | —      | ✅ 已完成 |
| M4 - Phase 4 采购管理       | Phase 4    | —      | ✅ 已完成 |
| M5 - Phase 5 工队管理       | Phase 5    | —      | ✅ 已完成 |
| M6 - Phase 6 Agent 与工作台 | Phase 6    | —      | 🔜 待开发 |
| M7 - Phase 7 联调与闭环验证 | Phase 7    | —      | ⏳ 待定   |

## Phase Label 对照

| Label                   | 对应 Phase |
| ----------------------- | ---------- |
| `phase:1-foundation`    | Phase 1    |
| `phase:1.5-base-finish` | Phase 1.5  |
| `phase:2-wbs-standards` | Phase 2    |
| `phase:3-templates`     | Phase 3    |
| `phase:4-procurement`   | Phase 4    |
| `phase:5-crews`         | Phase 5    |
| `phase:6-agent`         | Phase 6    |
| `phase:7-e2e`           | Phase 7    |

## 版本规范

```
v{major}.{minor}.{patch}
```

- **major**: Phase 完成编号（1, 2, 3…）
- **minor**: 阶段内的任务包（0-9）
- **patch**: Hotfix、小文档、CI 修复

示例：`v1.0.0`（Phase 1 完成）、`v1.5.0`（Phase 1.5 完成）
