# AGENTS.md

## 启动清单（不可跳过，逐项执行）

- [ ] `agentmemory_memory_sessions` — 检查上次会话状态
- [ ] `agentmemory_memory_recall` — 搜索"最近工作" "未完成任务" "关键决策"
- [ ] 读 `MEMORY.md` 前 80 行（如存在）

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

### 会话级自检（每 ~15 次工具调用执行一次）

这是四阶段学习的**阶段 1（观察）**，不等 cron，在会话内实时执行。

- [ ] 每完成约 15 次工具调用（读文件、写文件、编辑、搜索、bash），**暂停**并执行自检
- [ ] 自检内容：用 `task-memory` 或 `agentmemory_memory_save` 记录以下结构：

```
完成：<这 15 次调用完成了什么>
成功：<哪些做法有效>
失败：<哪些做法出错或无效>
纠正：<用户指出了什么错误，说了什么>
模式：<是否发现重复出现的模式或反模式>
```

- [ ] 自检记录写入 `memory/YYYY-MM-DD.md`（每日日志），标记 `type: checkpoint`
- [ ] 如果同模式出现 ≥ 3 次 → 写入 `docs/ai/knowledge/patterns.md`
- [ ] 如果同错误出现 ≥ 2 次 → 写入 `docs/ai/knowledge/rules.md` 作为反模式
- [ ] 如果发现公共陷阱 → 写入当前使用的 skill 同级目录的 `TRAPS.md`

### 跨会话进化（启动时 + 定时）

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
- [ ] 确认 lint/build/test:e2e 三关（如适用）

## 项目信息

连锁门店建设管理系统 — React+TS+Tailwind（shadcn/main）+ Express+SQLite（local-api）。
规则详见 `docs/harness/` | 角色文件 `docs/harness/roles/产品.md` | 配置 `.harness/registry.yaml`。
