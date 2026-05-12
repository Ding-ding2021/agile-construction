# 自检检查点

> 最后更新: 2026-05-13T10:00 (UTC+8)

## 状态

last_checkpoint_msg_count: 2
checkpoint_number: 2
last_checkpoint_time: 2026-05-13T10:00:00Z
last_checkpoint_session: "evening-evolution-2026-05-13"

## 说明

- `last_checkpoint_msg_count`: 上次会话的**用户消息**数（不含 Agent 回复、系统消息、工具调用结果）
- `checkpoint_number`: 自检序号（从 1 开始）
- 每次会话结束时更新此文件
- 启动时检查：如果上次会话的 `last_checkpoint_msg_count ≥ 15`（用户消息），执行回顾式自检
