---
id: DOC-GOVERNANCE-HARNESS-AI
number: GOV-000
domain: governance
category: harness
title: AI 合约索引
owner: docs-maintainer
status: active
last_updated: 2026-05-14
source_of_truth: true
related_code: []
related_docs: []
---

# AI 合约索引

> 本目录为 AI Agent 提供结构化模块合约。每个合约 ≤ 200 行，纯表格/清单格式。
> 合约由 `document-sync` 技能自动从人类文档提取，双向链接到 `docs/` 下的原文。

## 子目录

| 目录         | 用途                                 | 读者        |
| ------------ | ------------------------------------ | ----------- |
| `contracts/` | 模块合约（每模块一个文件）           | AI 按需加载 |
| `knowledge/` | 从交付中提取的可复用模式、规则、决策 | AI 启动加载 |
| `context/`   | 当前项目状态、活跃任务               | AI 启动加载 |

## 合约清单

| 文件                                  | 来源                                                       | 状态       |
| ------------------------------------- | ---------------------------------------------------------- | ---------- |
| `contracts/adaptive-governance.md`    | `docs/00-governance/harness/09-governance.md`              | active     |
| `contracts/agent-squad-protocol.md`   | `docs/00-governance/agent-squad-protocol.md`               | active     |
| `contracts/code-review-checklist.md`  | `docs/00-governance/code-review-checklist.md`              | active     |
| `contracts/coding-standards.md`       | `docs/00-governance/coding-standards.md`                   | active     |
| `contracts/component-catalog.md`      | `docs/02-design/component-catalog.md`                      | active     |
| `contracts/component-development.md`  | `docs/02-design/component-development-contract.md`         | active     |
| `contracts/design-standards.md`       | `docs/00-governance/design-standards.md`                   | active     |
| `contracts/digital-employee.md`       | `docs/01-product/digital-employee-prd.md`                  | active     |
| `contracts/document-governance.md`    | `docs/00-governance/document-governance.md`                | active     |
| `contracts/human-ai-collaboration.md` | `docs/00-governance/human-ai-collaboration.md`             | active     |
| `contracts/personnel-management.md`   | `docs/01-product/personnel-management-prd.md`              | active     |
| `contracts/procurement-management.md` | `docs/01-product/procurement-management-prd.md`            | active     |
| `contracts/product-planning.md`       | `docs/01-product/product-planning-v1.md`                   | active     |
| `contracts/product-roadmap.md`        | `docs/99-archive/product/product-roadmap-v1.2-draft.md`    | superseded |
| `contracts/project-charter.md`        | `docs/00-governance/project-charter.md`                    | active     |
| `contracts/project-management.md`     | `docs/99-archive/product/project-management-prd.md`        | superseded |
| `contracts/project-task-driven.md`    | `docs/02-architecture/project-task-driven-architecture.md` | active     |
| `contracts/settings.md`               | `docs/01-product/settings-prd.md`                          | active     |
| `contracts/agent.md`                  | `docs/02-architecture/agent-architecture.md`               | active     |
| `contracts/standard-management.md`    | `docs/02-architecture/standard-management-architecture.md` | active     |
| `contracts/task-center.md`            | `docs/02-architecture/task-center-architecture.md`         | active     |
| `contracts/testing-standards.md`      | `docs/04-testing/testing-standards.md`                     | active     |
| `contracts/v1-product-definition.md`  | `docs/01-product/v1-product-definition.md`                 | active     |
| `contracts/vi-standards.md`           | `docs/02-design/vi-standards.md`                           | active     |
| `contracts/workteam-management.md`    | `docs/01-product/workteam-management-prd.md`               | active     |

## knowledge/ 清单

| 文件                     | 内容说明            | 读者       |
| ------------------------ | ------------------- | ---------- |
| `knowledge/decisions.md` | 架构决策记录（ADR） | 开发、架构 |
| `knowledge/patterns.md`  | 可复用代码模式      | 开发       |
| `knowledge/rules.md`     | 不可违背规则        | 全体       |

## 维护规则

- 合约由 `document-sync` 技能自动维护，**不要手动编辑**
- 每次人类文档变更后，必须重新同步对应合约
- 合约文件在 `docs/README.md` 的 AI 合约层部分集中索引
