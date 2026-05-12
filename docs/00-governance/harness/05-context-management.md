---
number: GOV-018
domain: governance
category: harness
---

# 上下文管理

## 概述

上下文决定了 AI Agent 在每次会话中能获取多少项目信息。关键策略：**启动加载少而精，按需加载多而全**。

---

## 上下文加载顺序

```
会话启动
    │
    ▼
1. opencode.json → instructions: ["AGENTS.md", "docs/00-governance/harness/roles/{role}.md"]
    │
    ▼
2. AGENTS.md ── 全局：角色/工作流/规则/反作弊
    │
    ▼
3. 角色说明卡 ── 本角色专属
    ├── docs/00-governance/harness/roles/产品.md (26 技能 + 14 指标)
    ├── docs/00-governance/harness/roles/设计.md (33 技能 + 12 指标)
    ├── docs/00-governance/harness/roles/开发.md (30 技能 + 13 指标)
    └── docs/00-governance/harness/roles/测试.md (12 技能 + 12 指标)
    │
    ▼
4. MEMORY.md ── 跨会话：架构决策/偏好/模式
    │
    ▼
5. 对话中 → skill 工具 → 按需加载 SKILL.md
```

---

## 上下文预算策略

| 策略             | 说明                                                                          |
| ---------------- | ----------------------------------------------------------------------------- |
| **启动预载**     | 只加载 AGENTS.md + 角色文件 + MEMORY.md，控制在 ~500 行                       |
| **技能按需**     | 通过 `skill` 工具按阶段和意图触发，不预加载 72 个 SKILL.md                    |
| **知识库用索引** | 不加载文档全文，只加载 docs/00-governance/harness/04-knowledge-base.md 的索引 |
| **文档按需读**   | 需要具体内容时用 `Read` 工具打开目标文档                                      |

---

## 各阶段上下文补充

| 阶段 | 额外加载                               |
| ---- | -------------------------------------- |
| 定义 | brainstorming skill + 对应产品文档索引 |
| 规划 | karpathy-guidelines + planning skill   |
| 构建 | 按需加载对应技术技能                   |
| 测试 | lint/build/test 命令执行结果           |
| 评审 | squad-post-dev-review + 验收清单       |
| 交付 | git/commit hooks 状态                  |
| 进化 | MEMORY.md 写入 + 知识库更新            |

---

## 记忆系统

| 存储                               | 内容                 | 读写者                       |
| ---------------------------------- | -------------------- | ---------------------------- |
| `MEMORY.md`                        | 长期决策、偏好、模式 | 产品写，所有角色读           |
| `.workbuddy/memory/YYYY-MM-DD.md`  | 每日任务日志         | 产品写                       |
| `.workbuddy/stats/YYYY-MM-DD.json` | 每任务质量数据       | 自动 + 产品写                |
| `agentmemory`                      | 跨会话语义记忆       | 产品写，`memory_recall` 检索 |

---

## 上下文清理规则

| 触发                | 操作                       |
| ------------------- | -------------------------- |
| 进入新阶段          | 释放上一阶段加载的领域技能 |
| 任务完成            | 释放该任务专属的文档上下文 |
| 歧义出现            | 产品重新加载需求相关文档   |
| 超过 5 次对话未引用 | 被动 skill 可以 unload     |
