---
id: ARC-LANGUAGE-CONFIG-AI
number: ARC-009
domain: archive
category: archived
title: AI 推理语言规范
status: archived
last_updated: 2026-05-13
archived_at: 2026-05-13
archived_reason: 已合并入 project-charter.md（GOV-006）Clause 6
---

# AI 推理语言规范

## Clause 1. 语言规范

### 1.1 [强制] 中文推理

所有推理过程必须使用中文输出，包括但不限于：

**1.1.1 [强制]** 意图声明（Intent Verbalization）使用中文。

**1.1.2 [强制]** 思考过程（Chain-of-Thought）使用中文。

**1.1.3 [强制]** 分析说明、中间推理使用中文。

**1.1.4 [强制]** 与用户的正式回答使用中文。

### 1.2 [参考] 例外规则

**1.2.1 [参考]** 委托子任务的 `task` 工具 prompt 必须使用英文（系统限制，无法调整）。

**1.2.2 [参考]** 代码、路径、技术术语本身不受此限制。
