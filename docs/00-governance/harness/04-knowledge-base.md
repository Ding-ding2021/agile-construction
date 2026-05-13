---
id: DOC-00-GOVERNANCE-HARNESS-KNOWLEDGE-BASE
number: GOV-014
domain: governance
category: harness
title: Harness 知识库
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code:
  - docs/ai/
  - memory/
  - .agents/skills/
related_docs:
  - docs/00-governance/harness/00-overview.md
  - docs/00-governance/harness/03-skills.md
  - docs/00-governance/harness/05-context-management.md
  - docs/00-governance/human-ai-collaboration.md
  - docs/ai/knowledge/decisions.md
---

# Harness 知识库

## Clause 1. 知识库架构

**1.1 [参考]** 知识库分为四个层次：

| 层     | 位置                 | 内容                           | 生命周期   |
| ------ | -------------------- | ------------------------------ | ---------- |
| 文档层 | `docs/`              | 结构化规范、设计文档、架构记录 | 长期有效   |
| 合约层 | `docs/ai/contracts/` | AI 可消费的提取合约            | 随文档同步 |
| 知识层 | `docs/ai/knowledge/` | 跨会话经验、决策记录、模式     | 持续积累   |
| 记忆层 | `memory/`            | 运行日志、会话记录             | 按天轮换   |

**1.2 [参考]** 数据流路径：

```text
人类编写 docs/ → document-sync 提取 → docs/ai/contracts/
AI 执行 → 经验反哺 → docs/ai/knowledge/
运行时记录 → memory/YYYY-MM-DD.md
跨会话提炼 → memory/patterns.md + memory/rules.md
```

---

## Clause 2. 合约层管理

**2.1 [强制]** 每个重要的 `docs/` 文档应有对应的 AI 合约位于 `docs/ai/contracts/`。

**2.2 [强制]** 合约格式要求：

| 条款  | 要求                        |
| ----- | --------------------------- |
| 2.2.1 | ≤ 200 行                    |
| 2.2.2 | 零叙事段落（纯表格 + 清单） |
| 2.2.3 | frontmatter 完整            |
| 2.2.4 | 双向链接指向人类源文档      |

**2.3 [强制]** 合约同步使用 `document-sync` 技能，非手动维护。

---

## Clause 3. 知识层管理

**3.1 [参考]** 知识层存储以下内容：

| 类别     | 存储位置                         | 示例          |
| -------- | -------------------------------- | ------------- |
| 关键决策 | `docs/ai/knowledge/decisions.md` | 架构选型决策  |
| 模式     | `memory/patterns.md`             | 同模式 ≥ 3 次 |
| 规则     | `memory/rules.md`                | 同错误 ≥ 2 次 |
| 避坑清单 | `memory/USER.md`                 | 日志聚合      |

---

## Clause 4. 记忆层管理

**4.1 [强制]** 记忆层采用双轨制，详见 [human-ai-collaboration.md](../human-ai-collaboration.md)。

**4.2 [参考]** 核心记忆文件：

| 文件                   | 用途               | 维护方式              |
| ---------------------- | ------------------ | --------------------- |
| `memory/MEMORY.md`     | 项目级持久记忆入口 | 手动 + 自动           |
| `memory/YYYY-MM-DD.md` | 每日运行日志       | 自动                  |
| `memory/patterns.md`   | 重复模式提炼       | 自动（同模式 ≥ 3 次） |
| `memory/rules.md`      | 错误规则提炼       | 自动（同错误 ≥ 2 次） |
| `memory/USER.md`       | 用户画像与避坑     | 手动 + 自动           |

---

## Clause 5. 知识维护

**5.1 [强制]** 文档变更后必须调用 `document-sync` 技能同步合约层。

**5.2 [推荐]** 每会话结束时，将有价值的经验反哺到 `docs/ai/knowledge/`。

**5.3 [强制]** 记忆层由 `memory/MEMORY.md` 作为统一入口，不新增零散记忆文件。
