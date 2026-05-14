# 飞书林墨机器人 — 转发方案实施计划

> 状态：计划定稿 | 负责人：林墨 | 日期：2026-05-14

---

## 一、目标与范围

### 1.1 目标

通过 Trae SOLO（林墨）联通飞书，实现「飞书里的林墨 = Trae 里的林墨」，具备完整 Harness 能力。

### 1.2 核心决策（已确认）

| 维度     | 决策                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| 核心场景 | 问答 + 操作（在飞书里既能查项目数据，也能下指令操作）                                    |
| 交互方式 | 群聊 @机器人 + 私聊对话                                                                  |
| 集成深度 | 全部 Harness 能力（评审、验收、交付全流程）                                              |
| 技术架构 | 方案 A：在 local-api 中新增飞书接口（轻量桥接）                                          |
| 身份配置 | 扩展 product-manager.yaml，飞书和 Trae 共用同一份角色文件                                |
| AI 调用  | 转发方案：飞书消息 → 消息队列 → Trae 轮询处理                                            |
| 离线策略 | 智能切换：Trae 在线 → 消息队列等待 Trae 处理；Trae 离线 → 直接调 AI 模型回复（离线模式） |

### 1.3 范围边界

**在范围内**：

- 飞书群聊中 @林墨 机器人，林墨回复
- 私聊林墨机器人，林墨回复
- 飞书消息通过队列转发给 Trae 处理
- Trae 离线时 AI 模型接管回复
- 支持查询项目数据（任务、进度、成员等）
- 支持执行项目操作（创建任务、分配人员等）
- 完整的 Harness 流程（评估组评审、验收组审查、交付通知）

**不在范围内**：

- 飞书直接操作代码（代码变更始终在 Trae 内完成）
- 多租户/多项目隔离（当前只有一个项目）
- 飞书语音/视频通话集成

---

## 二、架构设计

### 2.1 总体架构

```
┌──────────────────────────────────────────────────────┐
│                    飞书平台                           │
│  ┌──────────────┐   ┌──────────────┐                 │
│  │ 群聊 @林墨    │   │ 私聊林墨      │                 │
│  └──────┬───────┘   └──────┬───────┘                 │
│         │                  │                          │
│         └────────┬─────────┘                          │
│                  │  Webhook 推送                      │
└──────────────────┼──────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│               local-api（Express + SQLite）           │
│                                                      │
│  ┌────────────────────┐  ┌───────────────────────┐   │
│  │ /api/feishu/        │  │ 离线模式 (fallback)    │   │
│  │ webhook (接收消息)  │  │ AI 模型直接回复        │   │
│  │ queue  (消息队列)   │  │                       │   │
│  │ respond (发送回复)  │  │                       │   │
│  └────────┬───────────┘  └───────────────────────┘   │
│           │                                          │
│  ┌────────▼───────────┐                              │
│  │ 消息队列 (SQLite)   │                              │
│  │ - pending/in_process│                              │
│  │ - done              │                              │
│  └────────┬───────────┘                              │
│           │                                          │
│  ┌────────▼───────────────────────────────────┐      │
│  │ 现有业务逻辑（tasks/projects/members...）   │      │
│  └────────────────────────────────────────────┘      │
└──────────────────────┬───────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Trae 轮询│ │ AI 模型   │ │ 项目数据  │
    │ 处理消息 │ │ 离线回复  │ │ (SQLite) │
    └──────────┘ └──────────┘ └──────────┘
```

### 2.2 消息流转

```
飞书用户发消息
    │
    ▼
飞书服务器 → Webhook → local-api 接收
    │
    ▼
存入消息队列 (status: pending)
    │
    ├── Trae 在线？ ──YES──→ Trae 轮询取走 → 处理 → 回复飞书
    │
    └── Trae 离线？ ──NO───→ 离线模式：调 AI 模型 → 回复飞书
                               (标为 pending 等待 Trae 上线后补充处理)
```

### 2.3 在线/离线判定

**判定方式**：local-api 暴露一个心跳检测（Trae 定时发送心跳）。

- 心跳超时（默认 5 分钟无心跳）→ 判定为离线 → 切换到 AI 直接回复
- 心跳恢复 → 判定为在线 → 切换回队列模式
- 离线期间的消息：AI 模型即时回复，同时标记需要 Trae 补充审查

---

## 三、实施阶段

### Phase 1：飞书权限打通（前置条件）

| 任务 | 说明                                                                           |
| ---- | ------------------------------------------------------------------------------ |
| P1-1 | 完成 lark-cli 授权（使用已有 App ID `cli_aa8fce56d7799cd1`）                   |
| P1-2 | 在飞书开放平台配置 Bot 权限：`im:message`、`im:message:send_as_bot`、`im:chat` |
| P1-3 | 创建飞书 Bot 应用，获取 Webhook 验证 token                                     |
| P1-4 | 验证飞书消息收发链路通畅                                                       |

### Phase 2：local-api 飞书基础设施

| 任务 | 涉及文件                                  | 说明                                          |
| ---- | ----------------------------------------- | --------------------------------------------- |
| P2-1 | `local-api/routes/feishu.ts`（新建）      | 飞书路由：webhook、queue、respond             |
| P2-2 | `local-api/controllers/feishu.ts`（新建） | 消息接收、队列管理、响应发送                  |
| P2-3 | `local-api/store/sqlite.ts`（修改）       | 新增 feishu_messages 表和 feishu_heartbeat 表 |
| P2-4 | `local-api/routes/index.ts`（修改）       | 注册飞书路由                                  |

**feishu_messages 表结构**：
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT PRIMARY KEY | 飞书消息 ID |
| chat_id | TEXT | 群聊/私聊 ID |
| user_id | TEXT | 发送者飞书 ID |
| content | TEXT | 消息内容 |
| msg_type | TEXT | group / private |
| status | TEXT | pending / in_process / done / failed |
| source | TEXT | feishu / trae（标记是用户发来还是Trae回复）|
| reply_content | TEXT | Trae/AI 回复内容 |
| created_at | TEXT | 创建时间 |
| processed_at | TEXT | 处理时间 |

**feishu_heartbeat 表结构**：
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT PRIMARY KEY | 心跳ID |
| source | TEXT | trae |
| updated_at | TEXT | 最后心跳时间 |

### Phase 3：Trae 处理逻辑

| 任务 | 涉及文件                                    | 说明                                                      |
| ---- | ------------------------------------------- | --------------------------------------------------------- |
| P3-1 | `.trae/agents/product-manager.yaml`（修改） | 新增飞书处理 section：心跳发送、队列轮询、消息处理规则    |
| P3-2 | 新增 trae 侧工具调用                        | 林墨在会话中可调用 `GET /api/feishu/queue` 获取待处理消息 |

**product-manager.yaml 新增内容**：

```yaml
# 飞书集成配置
feishu:
  enabled: true
  heartbeat_interval: 60 # 心跳间隔（秒）
  poll_interval: 30 # 消息轮询间隔（秒）
  heartbeat_timeout: 300 # 离线判定超时（秒）

  message_handling:
    on_startup: check_pending # Trae 启动时检查积压消息
    during_session: poll # 会话中轮询

  tools:
    - name: feishu-check-queue
      type: local-api
      endpoint: GET /api/feishu/queue
      description: 获取待处理的飞书消息
    - name: feishu-send-reply
      type: local-api
      endpoint: POST /api/feishu/respond
      description: 发送飞书回复
    - name: feishu-heartbeat
      type: local-api
      endpoint: POST /api/feishu/heartbeat
      description: 发送心跳
```

### Phase 4：Harness 流程适配

| 任务 | 说明                                                                  |
| ---- | --------------------------------------------------------------------- |
| P4-1 | 飞书触发评估组评审：用户发「发起评审 + 任务名」→ 林墨在飞书内组织评估 |
| P4-2 | 飞书触发验收组审查：开发完成后在飞书通知验收                          |
| P4-3 | 飞书接收评审结果：评估/验收结论通过飞书卡片通知                       |
| P4-4 | 飞书进度查询：用户问「项目进度」「任务状态」，林墨查询 local-api 回复 |

### Phase 5：测试验证

| 任务 | 说明                                                           |
| ---- | -------------------------------------------------------------- |
| P5-1 | 端到端测试：飞书发消息 → local-api 入库 → Trae 轮询 → 回复飞书 |
| P5-2 | 离线切换测试：关闭 Trae → 飞书发消息 → 离线 AI 回复            |
| P5-3 | 在线恢复测试：重新打开 Trae → 检查离线消息是否被补充处理       |
| P5-4 | Harness 流程测试：飞书发起评审 → 完整走通评审流程              |

---

## 四、需要修改/新建的文件总清单

### 新建文件

| 文件                                              | 说明                                             |
| ------------------------------------------------- | ------------------------------------------------ |
| `local-api/routes/feishu.ts`                      | 飞书路由                                         |
| `local-api/controllers/feishu.ts`                 | 飞书控制器（消息接收、队列管理、回复发送、心跳） |
| `SOUL.md`                                         | 林墨人格文件（✅ 已创建）                        |
| `.trae/documents/feishu-agent-forwarding-plan.md` | 本计划文档                                       |

### 修改文件

| 文件                                | 改动内容                                       |
| ----------------------------------- | ---------------------------------------------- |
| `local-api/routes/index.ts`         | 注册 feishu 路由                               |
| `local-api/store/sqlite.ts`         | 新增 feishu_messages + feishu_heartbeat 两张表 |
| `.trae/agents/product-manager.yaml` | 新增飞书集成配置 section + 引用 SOUL.md        |

### OpenClaw → Harness 文件映射（复用不新建）

| OpenClaw 文件 | Harness 对应文件                                | 说明           |
| ------------- | ----------------------------------------------- | -------------- |
| IDENTITY.md   | `.trae/agents/product-manager.yaml`             | 林墨角色配置   |
| SOUL.md       | `SOUL.md`（✅ 新建）                            | 林墨人格内核   |
| USER.md       | `memory/`                                       | 用户记忆与偏好 |
| AGENTS.md     | 根目录 `AGENTS.md`                              | 工作空间指南   |
| HEARTBEAT.md  | `.harness/registry.yaml` governance schedule    | 定时任务       |
| TOOLS.md      | `.mcp.json` + registry.yaml tools + lark skills | 工具清单       |

### Harness 独有能力（OpenClaw 没有的）

| 能力         | 来源                                                 |
| ------------ | ---------------------------------------------------- |
| 📚 知识库    | registry.yaml knowledge 段 + `docs/02-architecture/` |
| 🎯 Skills 库 | `.agents/skills/`（80+ 技能）                        |
| 🧬 进化系统  | `.harness/adjustments.yaml` + 自动调节引擎           |
| 👥 评审小组  | 评估组 + 验收组（agent-squad-protocol.md）           |
| 📊 五级考核  | 44 项质量指标自动追踪                                |

### 不修改的文件

| 文件                                 | 原因                                      |
| ------------------------------------ | ----------------------------------------- |
| `local-api/controllers/*.ts`（现有） | 业务逻辑不变，飞书通过同一套 API 操作数据 |
| `local-api/routes/*.ts`（现有）      | 同上                                      |
| `package.json`                       | 飞书 SDK 依赖在 Phase 1 确认后添加        |

---

## 五、关键设计决策

### 5.1 为什么不用 WebSocket 长连接？

飞书 Bot 不支持 WebSocket 推送，只有 Webhook 回调。所以必须由 local-api 被动接收 → 队列存储 → Trae 主动轮询。

### 5.2 离线 AI 回复的安全性

离线模式下 AI 直接回复不会执行写操作（不创建任务、不修改数据），仅做查询和对话。写操作必须等 Trae 上线后补充执行。

### 5.3 群聊 @ 和私聊的区别

- **群聊**：消息中包含 @林墨 才触发处理，防止群聊噪音
- **私聊**：所有消息都触发处理

---

## 六、验收标准

| #   | 标准                                                |
| --- | --------------------------------------------------- |
| 1   | 在飞书群里 @林墨 "项目进度如何"，收到林墨回复       |
| 2   | 私聊林墨 "创建一个任务叫测试"，任务在系统中成功创建 |
| 3   | 关闭 Trae 后发消息，林墨用 AI 模型回复，不会无响应  |
| 4   | 重新打开 Trae，能取到离线期间的对话记录             |
| 5   | 在飞书中发起评审，评估组流程能走通                  |
