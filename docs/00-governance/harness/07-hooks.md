---
id: DOC-00-GOVERNANCE-HARNESS-HOOKS
number: GOV-017
domain: governance
category: harness
title: Harness 钩子
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code:
  - .husky/
  - .opencode/hooks/
related_docs:
  - docs/00-governance/harness/00-overview.md
  - docs/00-governance/harness/01-workflows.md
  - docs/00-governance/git-governance.md
---

# Harness 钩子

## Clause 1. 钩子体系

**1.1 [参考]** 项目设两层钩子体系：

| 层        | 实现               | 触发点             | 用途                 |
| --------- | ------------------ | ------------------ | -------------------- |
| Git Hooks | `.husky/`          | git commit、push   | 代码质量门禁         |
| AI Hooks  | `.opencode/hooks/` | 会话启动、文件变更 | 上下文管理与文档同步 |

---

## Clause 2. Git Hooks

**2.1 [强制]** 核心 Git Hooks 配置：

| 钩子       | 触发时机              | 执行动作                    | 阻断条件  |
| ---------- | --------------------- | --------------------------- | --------- |
| pre-commit | `git commit`          | lint-staged（受影响的文件） | lint 失败 |
| commit-msg | commit message 输入后 | commit message 格式检查     | 格式不符  |
| pre-push   | `git push` 前         | 运行测试                    | 测试失败  |

**2.2 [强制]** 任何代码提交必须通过上述钩子检查。紧急情况下可提交 `--no-verify`，但需在 commit message 中说明原因。

---

## Clause 3. AI Hooks

**3.1 [参考]** AI Hooks 当前配置：

| 钩子          | 触发时机   | 执行动作     |
| ------------- | ---------- | ------------ |
| pre-commit    | AI 提交前  | 同步记忆文件 |
| session-start | 新会话启动 | 加载项目规则 |

---

## Clause 4. 钩子维护

**4.1 [推荐]** 钩子维护规则：

| 条款  | 规则                                |
| ----- | ----------------------------------- |
| 4.1.1 | 新增钩子时更新本文档                |
| 4.1.2 | 删除钩子前确认无依赖                |
| 4.1.3 | 每周检查一次 `.husky/` 是否正常运行 |
