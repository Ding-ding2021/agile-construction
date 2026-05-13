---
id: DOC-00-GOVERNANCE-HARNESS-REPLICATION
number: GOV-018
domain: governance
category: harness
title: Harness 复制指南
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code: []
related_docs:
  - docs/00-governance/harness/00-overview.md
  - docs/00-governance/harness/01-workflows.md
  - docs/00-governance/harness/02-roles.md
  - docs/00-governance/harness/03-skills.md
  - .harness/registry.yaml
---

# Harness 复制指南

## Clause 1. 复制目标

**1.1 [参考]** 本指南供需要将 Harness 工程框架复制到其他项目时参考。

---

## Clause 2. 复制步骤

**2.1 [强制]** 复制 Harness 框架到新项目时，按以下顺序执行：

| 条款  | 步骤         | 内容                                                                          |
| ----- | ------------ | ----------------------------------------------------------------------------- |
| 2.1.1 | 复制治理文档 | 复制 `docs/00-governance/` 目录（不含角色 YAML）                              |
| 2.1.2 | 调整宪法     | 修改 `project-charter.md` 中的项目名称、领域                                  |
| 2.1.3 | 调整角色     | 修改 `02-roles.md` 中角色名称                                                 |
| 2.1.4 | 调整技能     | 修改 `03-skills.md` 中的技能映射，去除不适用的技能                            |
| 2.1.5 | 复制配置     | 复制 `.harness/registry.yaml`                                                 |
| 2.1.6 | 创建目录     | 创建 `docs/`、`memory/`、`.agents/skills/`                                    |
| 2.1.7 | 复制核心技能 | 复制 `karpathy-guidelines`、`document-sync`、`verification-before-completion` |

**2.2 [推荐]** 复制完成后验证：

| 条款  | 验证项                                |
| ----- | ------------------------------------- |
| 2.2.1 | 治理文档链接有效                      |
| 2.2.2 | 角色配置 YAML 引用路径正确            |
| 2.2.3 | 技能目录结构正确                      |
| 2.2.4 | `.harness/registry.yaml` 引用路径更新 |
