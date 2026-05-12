---
title: AI 合约索引
status: active
last_updated: 2026-05-12
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

| 文件                                  | 来源                                            | 状态   |
| ------------------------------------- | ----------------------------------------------- | ------ |
| `contracts/adaptive-governance.md`    | `docs/00-governance/harness/09-governance.md`   | active |
| `contracts/agent-squad-protocol.md`   | `docs/00-governance/agent-squad-protocol.md`    | active |
| `contracts/code-review-checklist.md`  | `docs/00-governance/code-review-checklist.md`   | active |
| `contracts/coding-standards.md`       | `docs/00-governance/coding-standards.md`        | active |
| `contracts/digital-employee.md`       | `docs/01-product/digital-employee-prd.md`       | active |
| `contracts/document-governance.md`    | `docs/00-governance/document-governance.md`     | active |
| `contracts/personnel-management.md`   | `docs/01-product/personnel-management-prd.md`   | active |
| `contracts/procurement-management.md` | `docs/01-product/procurement-management-prd.md` | active |
| `contracts/product-roadmap.md`        | `docs/01-product/product-roadmap-v1.2.md`       | active |
| `contracts/project-charter.md`        | `docs/00-governance/project-charter.md`         | active |
| `contracts/project-management.md`     | `docs/01-product/project-management-prd.md`     | active |
| `contracts/settings.md`               | `docs/01-product/settings-prd.md`               | active |
| `contracts/task-center.md`            | `docs/01-product/task-center-prd.md`            | active |
| `contracts/testing-standards.md`      | `docs/04-testing/testing-standards.md`          | active |
| `contracts/workteam-management.md`    | `docs/01-product/workteam-management-prd.md`    | active |

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
