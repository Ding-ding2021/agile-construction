---
id: DOC-00-GOVERNANCE-HARNESS-TOOLS
number: GOV-016
domain: governance
category: harness
title: Harness 工具与 MCP
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code:
  - .trae/
  - .claude/
  - .opencode/
  - .gitnexus/
related_docs:
  - docs/00-governance/harness/00-overview.md
  - docs/00-governance/harness/03-skills.md
  - docs/00-governance/document-governance.md
---

# Harness 工具与 MCP

## Clause 1. 工具概览

**1.1 [参考]** 项目使用以下主要工具和平台：

| 工具                   | 版本/类型    | 用途               |
| ---------------------- | ------------ | ------------------ |
| Node.js                | v22+         | 运行时             |
| React + TypeScript     | 前端框架     | UI 开发            |
| Tailwind CSS           | v3+          | 样式系统           |
| shadcn/ui              | 组件库       | 组件系统           |
| Express + SQLite       | 后端         | API + 数据层       |
| Vitest                 | 测试框架     | 单元测试           |
| Playwright             | E2E 测试框架 | 浏览器测试         |
| Claude Code + OpenCode | AI 编码工具  | AI 辅助开发        |
| GitNexus               | 代码智能     | 代码理解、影响分析 |
| Husky + lint-staged    | Git 钩子     | 代码质量门禁       |

---

## Clause 2. AI 工具层

**2.1 [参考]** AI 工具配置路径：

| 工具            | 配置文件          | 技能目录                          |
| --------------- | ----------------- | --------------------------------- |
| OpenCode (`oc`) | `.opencode/` 目录 | 系统级 + 项目级 `.agents/skills/` |
| Claude Code     | `.claude/` 目录   | symlink → `.agents/skills/`       |

**2.2 [强制]** 所有工具的技能目录必须引用 `.agents/skills/` 作为唯一源。新增技能时，先放到 `.agents/skills/`，再在各个工具中创建引用。

---

## Clause 3. 配置管理

**3.1 [强制]** 各工具配置文件遵循 SSOT 原则（详见 [document-governance.md §7](../document-governance.md#7-%E5%8D%95%E6%BA%90%E7%9C%9F%E7%90%86-ssot-%E5%8E%9F%E5%88%99)）。

**3.2 [推荐]** 配置文件变更日志记录在 `docs/05-project/` 下的发布记录中。

---

## Clause 4. 工具维护

**4.1 [推荐]** 定期检查：

| 条款  | 检查项                       | 频率           |
| ----- | ---------------------------- | -------------- |
| 4.1.1 | 工具版本是否过时             | 每季度         |
| 4.1.2 | 配置文件是否与当前工作流一致 | 每月           |
| 4.1.3 | 技能目录符号链接是否有效     | 每次技能变更后 |
