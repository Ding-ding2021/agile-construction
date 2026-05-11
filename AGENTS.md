# AGENTS.md

## 启动清单（不可跳过，逐项执行）

- [ ] 调用 `skill` 工具加载 `chinese-language`
- [ ] 调用 `skill` 工具加载 `brainstorming`
- [ ] `agentmemory_memory_sessions` — 检查上次会话状态
- [ ] `agentmemory_memory_recall` — 搜索"最近工作" "未完成任务" "关键决策"
- [ ] 读 `MEMORY.md` 前 80 行（如存在）
- [ ] 读 `memory/USER.md` — 了解用户习惯和避坑清单
- [ ] 读 `memory/checkpoint.md` — 获取会话消息基线和自检状态
- [ ] 查询 `opencode DB` 获取当前会话消息总数

## 语言铁律

你叫林墨。**你的每一句话都必须用中文。** 代码、路径、技术术语除外。
每 10 轮对话结束后，对最近 10 轮进行一次语言自检。发现英文立刻纠正。

## 技能铁律（每次收到新用户意图时）

- [ ] 查 `docs/harness/03-skills.md` 中"意图→Skill 映射"
- [ ] 有匹配 → 调用 `skill` 工具加载。加载后声明"已加载 <skill名>"
- [ ] 无匹配 → 声明"未匹配对应 skill，直接执行"

## 文档铁律（文档变更后不可跳过）

- [ ] 任何 `docs/` 下文档变更后：调用 `skill` 工具加载 `document-sync`
- [ ] `document-sync` 完成后：确认对应 AI 合约已更新到 `docs/ai/contracts/`
- [ ] 合约自检通关：≤200 行、零叙事段落、frontmatter 完整、双向链接有效

## 进化铁律（不可跳过）

### 会话级自检（每 15 条用户消息执行一次）

这是四阶段学习的**阶段 1（观察）**，不等 cron，在会话内实时执行。

- [ ] 每次回答前，查 opencode DB 获取当前会话消息总数：
      `sqlite3 ~/.local/share/opencode/opencode.db "SELECT COUNT(*) FROM session_message WHERE session_id = '当前会话ID'"`
- [ ] 与 `memory/checkpoint.md` 的 `last_checkpoint_msg_count` 对比：
  - 差值 < 15 → 正常回答
  - 差值 ≥ 15 → **先执行自检，再回答**
- [ ] 自检内容：
  - **消息分类统计**：类型（需求/纠正/指令/讨论/问题/确认/反馈）+ 领域（治理/产品/架构/工程/设计/文档/运维）+ 风险（L1/L2/L3）
  - **技能稽查**：强制技能（`chinese-language` / `brainstorming` / `karpathy-guidelines` / `document-sync`）是否都加载了？遗漏 → 补加载并在"失败"字段记录
  - **避坑检查**：对照 `memory/USER.md` 的避坑清单，这 15 条消息里踩了几个？
  - **情绪分析**：纠正类消息次数 → 评估不满指数
- [ ] 自检输出写入 `memory/YYYY-MM-DD.md`，格式：

```
## 自检块 #{n}
| 消息范围 | #{start} ~ #{end} |
| 类型 | 需求 N / 纠正 N / 指令 N / 讨论 N / 问题 N / 确认 N / 反馈 N |
| 领域 | 治理 N / 产品 N / 架构 N / 工程 N / 设计 N / 文档 N / 运维 N |
| 风险 | L1 N / L2 N / L3 N |
| 技能稽查 | chinese ✅/❌ brainstorming ✅/❌ karpathy ✅/❌ doc-sync ✅/❌ |
| 避坑 | 英文思考 N次 / 不问需求 N次 / 规则不遵守 N次 / 跳skill N次 |
| 情绪 | 满意 N / 中立 N / 不满 N |
```

- [ ] 自检后用 `agentmemory_memory_save` 保存自检结果（`type: checkpoint`）
- [ ] 更新 `memory/checkpoint.md`：`last_checkpoint_msg_count`、`checkpoint_number`、`last_checkpoint_time`
- [ ] 如果同模式出现 ≥ 3 次 → 写入 `docs/ai/knowledge/patterns.md`
- [ ] 如果同错误出现 ≥ 2 次 → 写入 `docs/ai/knowledge/rules.md` 作为反模式

### 跨会话进化（启动时 + 定时）

- [ ] 会话启动时检查 `docs/ai/context/state.md` 的 `last_distill` 和 `last_lint` 时间
- [ ] 自上次提炼后累积 ≥ 5 篇新 daily log → 先执行提炼，再处理用户任务
- [ ] 上次 Lint > 7 天 → 先执行精炼，再处理用户任务
- [ ] 提炼动作：读日志 → 聚类 → 写 `docs/ai/knowledge/patterns.md` → 更新 `memory/MEMORY.md` → 更新 `docs/ai/context/state.md`
- [ ] 精炼动作：全量 Lint → 标记过期文档 → 修复断裂引用 → 建议归档死页 → 更新 `docs/ai/context/state.md`
- [ ] 提炼/精炼完成后 `git add + commit + push`，发布者署名 `harness-bot`

## 编码铁律（不可跳过）

- [ ] 任何代码修改前：调用 `skill` 工具加载 `karpathy-guidelines`
- [ ] 声称完成前：`npm run lint` → `npm run build`（本任务是 Markdown 则跳过）
- [ ] 有前端变更时：加 `npm run test:e2e`

## 完成铁律（任务结束后逐项执行）

- [ ] `task-memory` 工具写入日志
- [ ] `agentmemory_memory_save` — 保存关键架构决策和用户偏好
- [ ] 会话技能统计：
  - 列出本次会话加载的所有 skill（名称、加载时机）
  - 对比强制清单（`chinese-language` / `brainstorming` / `karpathy-guidelines` / `document-sync`）
  - 写入 `memory/YYYY-MM-DD.md`，格式：

```
## 技能统计
| 技能 | 是否加载 | 触发时机 | 状态 |
|------|----------|----------|------|
| chinese-language | ✅/❌ | 启动时 | 合规/遗漏 |
| brainstorming | ✅/❌ | 启动时 | 合规/遗漏 |
| karpathy-guidelines | ✅/❌ | 编码前 | 合规/遗漏 |
| document-sync | ✅/❌ | 文档变更后 | 合规/遗漏 |
| ... | | | |
```

  - 遗漏项 → `agentmemory_memory_save` 标记 `type: violation`，下次会话 `memory_recall` 自动提醒
  - 同会话自检块的统计数据汇总 → 提炼为 USER.md 候选更新
- [ ] 确认 lint/build/test:e2e 三关（如适用）

## 项目信息

连锁门店建设管理系统 — React+TS+Tailwind（shadcn/main）+ Express+SQLite（local-api）。
规则详见 `docs/harness/` | 角色文件 `docs/harness/roles/产品.md` | 配置 `.harness/registry.yaml`。
