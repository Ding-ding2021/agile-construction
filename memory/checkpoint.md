# 自检计数器

> 维护会话级自检状态和技能统计。每 15 条用户消息触发一次自检。
> Agent 每次回答前查 DB 获取消息数，对比 `last_checkpoint_msg_count` 判断是否触发。

## 计数器

| 字段 | 值 |
|------|-----|
| session_id | ses_1ea334998ffeEFbuMAyBll7fyL |
| last_checkpoint_msg_count | 15 |
| total_messages | 15 |
| checkpoint_number | 1 |
| last_checkpoint_time | 2026-05-11 21:15 |
| next_checkpoint_at | 30 |

## 强制技能清单

| 技能 | 触发时机 | 违规后果 |
|------|----------|----------|
| `chinese-language` | 每次会话启动 | 语言铁律违规 |
| `brainstorming` | 每次会话启动 | 需求不清 |
| `karpathy-guidelines` | 任何编码前 | 编码规范违规 |
| `document-sync` | 任何文档变更后 | 合约未同步 |

## 自检块记录

| 块号 | 消息范围 | 触发时间 |
|------|----------|----------|
| 1 | #1 ~ #15 | 2026-05-11 21:15 |
| | | |

## 消息分类模板

```
## 自检块 #{n}
| 消息范围 | #{start} ~ #{end} |
| 类型 | 需求 N / 纠正 N / 指令 N / 讨论 N / 问题 N / 确认 N / 反馈 N |
| 领域 | 治理 N / 产品 N / 架构 N / 工程 N / 设计 N / 文档 N / 运维 N |
| 风险 | L1 N / L2 N / L3 N |
| 技能稽查 | chinese ✅/❌ brainstorming ✅/❌ karpathy ✅/❌ doc-sync ✅/❌ |
| 避坑 | 坑1: N次 / 坑2: N次 / 坑3: N次 |
| 情绪 | 满意 N / 中立 N / 不满 N |
```
