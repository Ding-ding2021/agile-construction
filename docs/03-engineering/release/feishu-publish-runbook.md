---
id: DOC-03-ENGINEERING-RELEASE-FEISHU-PUBLISH-RUNBOOK
title: 1) 搜索目标群
owner: docs-maintainer
status: active
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs: []
---

## 飞书发布与周追踪执行手册（阶段3）

### 当前状态

- 已加载 `飞书套件` 能力并安装 `lark-cli`
- 当前阻断：`lark-cli` 未完成授权（`not configured`）

### 一次性准备（待你完成授权后）

> 说明：由于当前环境未授权，以下命令为“授权后即用”。

```bash
lark-cli config show
lark-cli im +chat-search --query "阶段3" --as bot
```

### 发布节奏（每周一）

1. 发布里程碑消息到项目群
2. 创建本周任务清单
3. 周五汇总并回传评审结论

### 消息模板（建议）

- 标题：`阶段3周计划（W{周数}）`
- 内容：
  - 本周目标（3条以内）
  - 关键里程碑（按日期）
  - 风险与阻断（含处理动作）
  - 本周验收口径（DoD）

### 命令模板（授权后执行）

```bash
# 1) 搜索目标群
lark-cli im +chat-search --query "多Agent建店" --as bot

# 2) 发送周计划消息（将 CHAT_ID 替换为真实值）
lark-cli im +messages-send --chat-id CHAT_ID --text "【阶段3周计划】\n1) 本周目标...\n2) 里程碑...\n3) 风险...\n4) DoD..." --as bot

# 3) 创建周任务（可选，若启用任务域）
lark-cli task +tasks-create --summary "阶段3-W1 五接口真回归" --as bot
lark-cli task +tasks-create --summary "阶段3-W1 降级可见化回归" --as bot
```

### 周追踪最小要求

- 每周至少 1 条计划发布消息
- 每周至少 1 次风险更新
- 每周至少 1 次结果复盘（通过/失败/阻断）

### 阻断说明（2026-04-13）

- `lark-cli config show` 检查结果：`NOT_CONFIGURED`
- `lark-cli im +chat-search --query "阶段3" --as bot` 返回 `not configured`
- 结论：当前无法自动完成飞书实际发布，但已提供授权后可直接执行的标准命令模板
