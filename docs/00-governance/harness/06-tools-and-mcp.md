---
id: DOC-GOVERNANCE-HARNESS-MCP
number: GOV-019
domain: governance
category: harness
title: 工具链与 MCP
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
---

# 工具链与 MCP

## 概述

26 个工具 + 3 个 MCP 服务器 = Agent 的武器库。

---

## CLI 工具链

| 类别 | 命令                   | 用途                  | 阶段      |
| ---- | ---------------------- | --------------------- | --------- |
| 开发 | `npm run dev`          | 本地开发（shadcn 栈） | 构建      |
| 开发 | `npm run dev:legacy`   | MUI 栈开发            | 构建      |
| 开发 | `npm run dev:local`    | 全栈开发              | 构建      |
| 构建 | `npm run build`        | 生产构建（shadcn）    | 测试      |
| 构建 | `npm run build:legacy` | MUI 构建              | 测试      |
| 检查 | `npm run lint`         | ESLint 检查           | 测试/构建 |
| 检查 | `npx eslint <file>`    | 单文件检查            | 构建      |
| 检查 | `npx tsc --noEmit`     | TypeScript 类型检查   | 测试      |
| 测试 | `npm run test:run`     | Vitest 单元/组件测试  | 测试      |
| 测试 | `npm run test:e2e`     | Playwright E2E 测试   | 测试      |
| 测试 | `npm run test:e2e:ui`  | Playwright 可视化     | 测试      |

---

## Git 与 GitHub 工具

| 类别   | 工具                                | 用途         | 阶段      |
| ------ | ----------------------------------- | ------------ | --------- |
| Git    | `git`                               | 版本控制     | 交付      |
| GitHub | `gh pr create/view`                 | PR 管理      | 交付      |
| GitHub | `gh issue list`                     | Issue 查看   | 定义/交付 |
| GitHub | `gh api`                            | API 调用     | 全程      |
| Issues | GitHub Issues + Labels + Milestones | 进度追踪     | 全程      |
| CI     | `.github/workflows/ci.yml`          | CI 自动检查  | 交付/测试 |
| 发布   | `.github/release.sh`                | 发布自动化   | 交付      |
| Issue  | `.github/ISSUE_TEMPLATE/`           | 标准化 Issue | 定义      |

---

## 代码分析与记忆工具

| 类别     | 工具                        | 用途                         |
| -------- | --------------------------- | ---------------------------- |
| 代码分析 | GitNexus CLI                | 代码索引/知识图谱            |
| 代码分析 | GitNexus MCP                | 影响分析/上下文查询/安全重构 |
| 记忆     | `task-memory`               | 每日日志写入                 |
| 记忆     | `agentmemory_memory_save`   | 长期记忆写入                 |
| 记忆     | `agentmemory_memory_recall` | 历史记忆检索                 |

---

## 浏览器工具

| 工具                | 主要能力                                                  |
| ------------------- | --------------------------------------------------------- |
| chrome-devtools MCP | 截图、快照、导航、填充、点击、性能追踪、网络分析、Console |

---

## 工具 × 阶段 映射

| 工具            | 定义 | 规划 | 构建 | 测试 | 评审 | 交付 | 进化 |
| --------------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| npm dev         | —    | —    | ●    | —    | —    | —    | —    |
| npm lint        | —    | —    | ●    | ●    | —    | —    | —    |
| npm build       | —    | —    | —    | ●    | —    | —    | —    |
| npm test        | —    | —    | —    | ●    | —    | —    | —    |
| npm test:e2e    | —    | —    | —    | ●    | —    | —    | —    |
| tsc             | —    | —    | ●    | ●    | —    | —    | —    |
| git             | —    | —    | —    | —    | —    | ●    | —    |
| gh CLI          | —    | —    | —    | —    | —    | ●    | —    |
| GitNexus        | ●    | ●    | ●    | —    | —    | —    | —    |
| task-memory     | —    | —    | —    | —    | —    | ●    | —    |
| agentmemory     | ●    | —    | —    | —    | —    | ●    | ●    |
| chrome-devtools | —    | —    | ●    | ●    | ●    | —    | —    |

---

## MCP 服务器

| 服务器              | 能力                                              | 角色             |
| ------------------- | ------------------------------------------------- | ---------------- |
| **chrome-devtools** | 页面导航、截图、快照、性能追踪、网络分析、Console | 设计、开发、测试 |
| **GitNexus**        | 代码知识图谱查询、影响分析、安全重构、变更检测    | 产品、开发       |
| **agentmemory**     | 记忆存储、检索、跨会话知识                        | 产品             |

---

## MCP 工具 × 角色 映射

| MCP 工具组                  | 产品 | 设计 | 开发 | 测试 |
| --------------------------- | ---- | ---- | ---- | ---- |
| chrome-devtools (截图/快照) |      | ●    |      | ●    |
| chrome-devtools (性能/网络) |      |      | ●    |      |
| chrome-devtools (Console)   |      |      | ●    | ●    |
| GitNexus (query/context)    | ●    |      | ●    |      |
| GitNexus (impact/refactor)  |      |      | ●    |      |
| GitNexus (detect_changes)   | ●    |      | ●    |      |
| agentmemory (memory\_\*)    | ●    |      |      |      |

---

## MCP 工具 × 阶段 映射

| 工具                    | 定义 | 规划 | 构建 | 测试 | 评审 | 交付 | 进化 |
| ----------------------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| chrome-devtools         | —    | —    | ●    | ●    | ●    | —    | —    |
| GitNexus query          | ●    | ●    | ●    | —    | —    | —    | —    |
| GitNexus impact         | —    | ●    | ●    | —    | —    | —    | —    |
| GitNexus detect_changes | —    | —    | —    | —    | —    | ●    | —    |
| agentmemory recall      | ●    | —    | —    | —    | —    | —    | ●    |
| agentmemory save        | —    | —    | —    | —    | —    | ●    | ●    |
| task-memory             | —    | —    | —    | —    | —    | ●    | —    |
