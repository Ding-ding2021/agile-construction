# AGENTS.md

## 启动清单（不可跳过，逐项执行）

- [ ] 读 `memory/USER.md` — 了解用户习惯和避坑清单
- [ ] 读 `memory/checkpoint.md` — 获取会话消息基线和自检状态

## 文档铁律（文档变更后不可跳过）

- [ ] 任何 `docs/` 下文档变更后：调用 `skill` 工具加载 `document-sync`
- [ ] `document-sync` 完成后：确认对应 AI 合约已更新到 `docs/ai/contracts/`
- [ ] 合约自检通关：≤200 行、零叙事段落、frontmatter 完整、双向链接有效

## 进化铁律（不可跳过）

### 会话级自检（会话边界触发）

**触发时机**：会话结束时执行。

- [ ] 自检内容：
  - **消息分类统计**：统计本次会话的**用户消息**，按类型（需求/纠正/指令/讨论/问题/确认/反馈）分类
  - **避坑检查**：对照 `memory/USER.md` 的避坑清单，这次会话踩了几个？
  - **情绪分析**：纠正类消息次数 → 评估不满指数
- [ ] 自检输出写入 `memory/YYYY-MM-DD.md`

```
## 自检块 #{n}
| 用户消息范围 | #{start} ~ #{end} |
| 类型 | 需求 N / 纠正 N / 指令 N / 讨论 N / 问题 N / 确认 N / 反馈 N |
| 避坑 | 不问需求 N次 / 规则不遵守 N次 |
| 情绪 | 满意 N / 中立 N / 不满 N |
```

- [ ] 更新 `memory/checkpoint.md`：`last_checkpoint_msg_count`（本次会话**用户消息**数）、`checkpoint_number`、`last_checkpoint_time`
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

- [ ] **执行会话级自检**（见进化铁律 → 会话级自检，写自检块到 `memory/YYYY-MM-DD.md`，更新 `memory/checkpoint.md`）
- [ ] 写入 `memory/YYYY-MM-DD.md` — 保存关键架构决策和用户偏好
- [ ] 确认 lint/build/test:e2e 三关（如适用）

## 项目信息

连锁门店建设管理系统 — React+TS+Tailwind（shadcn/main）+ Express+SQLite（local-api）。
规则详见 `docs/00-governance/harness/` | 角色文件 `docs/00-governance/harness/roles/产品.md` | 配置 `.harness/registry.yaml`。
