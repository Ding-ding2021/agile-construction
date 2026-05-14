# Agent 行为审计系统

## 背景

当前 Harness 框架的反馈/纠偏机制依赖 Agent 自检块（避坑），存在幸存者偏差——Agent 只报告自己能意识到的错误，真正的盲区永远不可见。

目标是建立**客观可量化**的 Agent 行为审计体系，基于行为事件数据自动计算四个维度的指标，生成周度审计报告和矫正指令。

## 评估四维

| 维度     | 衡量问题                   | 数据来源          | 指标公式                                                                 |
| -------- | -------------------------- | ----------------- | ------------------------------------------------------------------------ |
| 铁律遵守 | 流程纪律有没有？           | 事件日志 + 自检块 | (1 - 铁律1违例/任务数) × (1 - 铁律2违例/任务数) × (1 - 铁律3违例/任务数) |
| 工具准确 | 该用的 Skill 用了没？      | 事件日志          | 正确调用数 / (调用总数 + 遗漏数)                                         |
| 文档使用 | 决策依据对不对？           | 事件日志          | 查阅次数 / (查阅次数 + 跳过次数)                                         |
| 角色尽职 | 该做的做了、不该做的没做？ | 事件日志 + 自检块 | 职责覆盖率 × 40% + 边界遵守率 × 40% + 独立判断率 × 20%                   |

## 事件数据模型

### 存储格式

JSONL，按天存储：`memory/events/YYYY-MM-DD.jsonl`

每行一条 JSON 事件记录。

### 事件类型

| 事件码           | 事件名   | 对应维度 | 字段                                     |
| ---------------- | -------- | -------- | ---------------------------------------- |
| SKILL_CALL       | 技能调用 | 工具准确 | skill, context, agent, timestamp         |
| SKILL_MISS       | 技能遗漏 | 工具准确 | should_have, context, agent, timestamp   |
| DOC_READ         | 文档查阅 | 文档使用 | doc, reason, agent, timestamp            |
| DOC_SKIP         | 文档跳过 | 文档使用 | should_have, reason, agent, timestamp    |
| IRON_RULE_BREAK  | 铁律违规 | 铁律遵守 | rule(1/2/3), desc, agent, timestamp      |
| CLARIFY_ASK      | 需求澄清 | 铁律遵守 | topic, ambiguity, agent, timestamp       |
| BOUNDARY_VIOLATE | 越界     | 角色尽职 | violation, agent, timestamp              |
| YES_MAN          | 盲从     | 角色尽职 | context, should_oppose, agent, timestamp |
| ROLE_DUTY_DONE   | 职责履行 | 角色尽职 | duty, agent, timestamp                   |

### 事件示例

```jsonl
{"event": "SKILL_CALL", "agent": "陈锋", "skill": "api-and-interface-design", "context": "设计新API", "timestamp": "2026-05-14T10:00:01Z"}
{"event": "DOC_READ", "agent": "陈锋", "doc": "docs/00-governance/harness/01-workflows.md", "reason": "确认构建流程", "timestamp": "2026-05-14T10:00:05Z"}
{"event": "IRON_RULE_BREAK", "agent": "陈锋", "rule": 1, "desc": "需求模糊未追问直接编码", "timestamp": "2026-05-14T10:05:00Z"}
```

## 系统架构

```
┌──────────────────────────────────────────────────────┐
│  Agent 行为事件日志                                    │
│  memory/events/YYYY-MM-DD.jsonl                       │
└────────────────────────┬─────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  事件聚合脚本                                          │
│  scripts/agent_event_logger.py                        │
│  ▶ 读取 JSONL 按维度聚合                               │
│  ▶ 生成日度/周度指标                                   │
└────────────────────────┬─────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  行为审计报告 + 评估报告                               │
│  memory/stats/weekly/{week}.md                        │
│  memory/stats/agent-eval/{agent}-{week}.md            │
└────────────────────────┬─────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  自适应评估引擎（已有）                                  │
│  scripts/evaluate-adjustments.py (扩展)               │
│  ▶ 读取新指标生成 adjustment                            │
│  ▶ 输出 adjustments.yaml                               │
└──────────────────────────────────────────────────────┘
```

## 评估节奏

| 层次     | 触发时机                       | 产出                           | 消费方       |
| -------- | ------------------------------ | ------------------------------ | ------------ |
| 单次会话 | 每次 Agent 会话结束            | memory/events/YYYY-MM-DD.jsonl | 数据原始积累 |
| 日度汇总 | 每日定时                       | events 文件归档                | 异常快速发现 |
| 周度评估 | 每周五 CI（weekly-review.yml） | 评估卡片 + adjustments.yaml    | 矫正决策     |

## 三源数据策略

| 数据来源         | 包含                                  | 客观程度           |
| ---------------- | ------------------------------------- | ------------------ |
| 事件日志（新增） | SKILL_CALL, DOC_READ, ROLE_DUTY_DONE  | 完全客观           |
| 混合来源         | SKILL_MISS, DOC_SKIP, IRON_RULE_BREAK | 需 LLM 辅助判定    |
| 自检块（已有）   | YES_MAN, BOUNDARY_VIOLATE             | 主观（幸存者偏差） |

三源混合策略：能用客观不用主观，客观数据锚定偏差下限。

## 实施范围

### P0 — 基础能力（本轮实现）

1. **事件采集脚本** — `scripts/agent-event-logger.py`
   - JSONL 读写能力
   - 事件格式验证
   - 按 Agent 聚合查询

2. **周度评估报告** — 扩展 `weekly-review.yml`
   - 新增 step：运行事件聚合
   - 输出四维评估卡片
   - 扩展 `evaluate-adjustments.py` 读取新指标

3. **自动埋点** — 在 Agent YAML 中注入事件记录指令
   - 会话结束时写 SKILL_CALL 和 DOC_READ
   - 越界/盲从自动标记

### P1 — 后续迭代（本轮不做）

- 前端可视化面板
- LLM 辅助语义判定
- A/B 对比实验框架

## 验收标准

- [ ] `scripts/agent-event-logger.py` 能写 JSONL、按维度聚合、输出 Markdown 卡片
- [ ] 周度 CI 运行后 `memory/stats/` 下生成四维评估报告
- [ ] evaluate-adjustments.py 能读取新事件指标触发矫正
- [ ] 三条铁律、工具准确率、文档使用率、角色尽职度四个维度均有数据

---

撰写人：林墨（产品经理 Agent）
日期：2026-05-14
名称：Agent 行为审计
状态：已批准待实施
