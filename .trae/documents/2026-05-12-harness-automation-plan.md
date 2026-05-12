# 自动化盲区补全 + 文档分裂健康检查计划

> 计划制定：2026-05-12
> 当前阶段：**_前序会话上下文丢失，重新探索后制定_**

---

## 一、当前状态（探索结论）

### 1.1 自动化现状

| 组件                     | 状态             | 问题                                                                                                                           |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ | --- | --------------------- |
| AGENTS.md 启动清单       | 含 opencode 残留 | 第 8~12 行引用 `agentmemory_memory_sessions`、`agentmemory_memory_recall`、`opencode DB`，这些在 Trae 中不可用                 |
| AGENTS.md 自检机制       | 含 opencode 残留 | 第 46~50 行用 `sqlite3 ~/.local/share/opencode/opencode.db` 查消息总数，Trae 无此数据库                                        |
| evaluate-adjustments.py  | **从未运行**     | `.harness/adjustments.yaml` 中 `last_evaluated: null`                                                                          |
| GitHub Actions workflows | 4 个存在         | `opencode run` 命令在 ubuntu-latest 上静默失败（CLI 未安装），`weekly-review.yml` 第 35~38 行调用 evaluate-adjustments.py 但 ` |     | echo "⚠️"` 吞掉了错误 |
| Trae Schedule 定时任务   | **0 个**         | 未创建任何本地定时任务                                                                                                         |
| `memory/` 目录           | **空目录**       | 无 MEMORY.md、USER.md、checkpoint.md、daily logs                                                                               |
| `memory/patterns/`       | 不存在           | -                                                                                                                              |
| `memory/archive/`        | 不存在           | -                                                                                                                              |

### 1.2 文档分裂健康状态

| 组件                              | 状态          | 问题                                                                 |
| --------------------------------- | ------------- | -------------------------------------------------------------------- |
| docs/ai/README.md 合约清单        | **残缺**      | 仅列出 5 个合约，实际存在 15 个（缺少 10 个）                        |
| docs/ai/README.md knowledge/ 清单 | **空白**      | 表格为空，实际存在 3 个文件（patterns.md， rules.md， decisions.md） |
| docs/ai/contracts/                | 15 个文件存在 | 全部 active，frontmatter 完整                                        |
| docs/ai/knowledge/                | 3 个文件存在  | 全部有内容                                                           |
| document-sync 技能                | 存在          | 但缺少同步记录，不确定是否为全部合约都同步过                         |

---

## 二、需要做的事

### P0 — Trae 本地自动化（3 项）

#### P0-A：修复 AGENTS.md

**问题**：AGENTS.md 是 Trae 会话的入口规则文件，但引用了：

- `agentmemory_memory_sessions` / `agentmemory_memory_recall`（Trae 无此工具）
- `opencode DB` 查询（Trae 无此数据库）
- 启动清单第 8~12 行引用了 `brainstorming` 技能，但该项目 `.agents/skills/` 下不存在该技能

**方案**：

1. 去掉 AGENTS.md 第 8、9、12 行（agentmemory 和 opencode DB 引用）
2. 替换第 46~50 行的 sqlite3 自检机制为**本地计数器**方案：
   - 在 `memory/checkpoint.md` 中记录 baseline 消息号
   - 每次会话通过读取 `memory/checkpoint.md` 获取 baseline
   - 手动计数当前会话消息数（或根据 checkpoint 中的记录判断）
3. 去掉启动清单中的 `brainstorming` 技能加载要求（技能不存在）
4. 在"进化铁律"部分加一段 "## Trae 自检适配说明"，解释 Trae 环境下的自检替代方案

**文件**：`AGENTS.md`
**验证**：用 Trae 新开会话，启动清单所有项都能勾上

#### P0-B：首次运行 evaluate-adjustments.py

**问题**：核心自适应治理引擎（L2.5）已写好 559 行代码，但从未执行过。每周考核 workflow 第 35~38 行调用了它但被 `|| echo "⚠️"` 吞掉错误。

**方案**：

1. 先在本地 dry-run 预览输出：
   ```bash
   cd /Users/dylan/CodeBuddy/agile-construction
   python3 scripts/evaluate-adjustments.py --days 30 --dry-run
   ```
2. 查看输出是否符合预期
3. 正式运行：
   ```bash
   python3 scripts/evaluate-adjustments.py --days 30 --output .harness/adjustments.yaml --agfile AGENTS.md
   ```
4. 确认 `adjustments.yaml` 中 `last_evaluated` 有了时间戳

**验证**：`.harness/adjustments.yaml` 的 `last_evaluated` 不再是 null，`active_adjustments` 有内容

#### P0-C：创建 3 个 Trae Schedule 定时任务

**问题**：0 个本地定时任务。GitHub Actions 的 cron 依赖 push 到 GitHub 才能触发，且 `opencode run` 全部静默失败。

**方案**：创建以下 Trae Schedule：

1. **每日健康检查** — 工作日 09:00
   - 检查 `.harness/adjustments.yaml` 是否有新调节
   - 检查 `memory/checkpoint.md` 是否比上次运行时更新
   - 检查是否有未同步的文档变更
   - 输出简短报告保存到 `.workbuddy/stats/daily/`

2. **每周自适应评估** — 每周五 17:00
   - 运行 `scripts/evaluate-adjustments.py --days 14`
   - 更新 `AGENTS.md` 矫正块
   - 提交结果到 git

3. **每周文档同步检查** — 每周一 09:00
   - 扫描 `docs/` 下的 Markdown 文件修改时间
   - 与 `docs/ai/contracts/` 的 `last_synced` 对比
   - 列出过期合约，生成报告

**验证**：Schedule 列表中存在 3 个活跃任务

### P1 — 文档索引修复 + memory 初始化（2 项）

#### P1-A：修复 docs/ai/README.md

**问题**：合约清单只列出 5 个，但实际有 15 个；knowledge/ 表格空白但有 3 个文件。

**方案**：更新 `docs/ai/README.md`：

1. 合约清单补全为 15 条（逐一核对来源——来自 `docs/` 下哪些文件）
2. knowledge/ 清单补全 3 条
3. 确认每个合约的 `human_source` 字段和实际来源匹配

**文件**：`docs/ai/README.md`
**验证**：README 合约清单 15 行，knowledge 清单 3 行

#### P1-B：初始化 memory/ 目录

**问题**：`memory/` 为空，`memory/patterns/` 和 `memory/archive/` 不存在。

**方案**：

1. 创建 `memory/MEMORY.md`（从项目结构和已知决策重建基础记忆）
2. 创建 `memory/USER.md`（记录用户是产品经理，不懂代码，需要通俗解释）
3. 创建 `memory/checkpoint.md`（设置初始 baseline）
4. 创建 `memory/patterns/README.md` 占位说明
5. 创建 `memory/archive/README.md` 占位说明

**验证**：`memory/` 下有 3 个核心文件 + 2 个子目录

### P2 — 未来可优化项（本期不做，仅记录）

| 项            | 说明                                                 | 依赖                      |
| ------------- | ---------------------------------------------------- | ------------------------- |
| Skills 热力图 | 统计哪些 skill 使用频次高/低，优化 107 个 skill 列表 | 需要足够多的使用数据      |
| 死链检测      | 自动检测 `docs/` 中指向不存在的文件的链接            | P0-C 的文档同步检查稳定后 |
| 启动快路径    | 如果连续 3 次会话都加载相同技能集，缓存为快捷方式    | 需要多次会话数据          |

---

## 三、实施步骤

### Step 1：修复 AGENTS.md

- 去掉 opencode 残留行（第 8、9、12 行）
- 替换自检机制（第 46~50 行）
- 去掉 brainstorming 引用
- 添加 Trae 自检适配说明

**验证**：AGENTS.md 全文搜索 opencode 0 匹配

### Step 2：evaluate-adjustments.py dry-run

- `python3 scripts/evaluate-adjustments.py --days 30 --dry-run`
- 确认输出，无报错

### Step 3：正式运行 evaluate-adjustments.py

- `python3 scripts/evaluate-adjustments.py --days 30 --output .harness/adjustments.yaml --agfile AGENTS.md`
- 验证 `adjustments.yaml` 更新

### Step 4：创建 3 个 Trae Schedule

- 每日健康检查（09:00 工作日）
- 每周自适应评估（周五 17:00）
- 每周文档同步检查（周一 09:00）

### Step 5：修复 docs/ai/README.md

- 合约清单 5→15
- knowledge 清单 0→3

### Step 6：初始化 memory/

- MEMORY.md、USER.md、checkpoint.md
- patterns/README.md、archive/README.md

---

## 四、验证标准

| #   | 检查项                                   | 过关条件                                      |
| --- | ---------------------------------------- | --------------------------------------------- |
| 1   | AGENTS.md 无 opencode 引用               | `grep -c opencode AGENTS.md` = 0              |
| 2   | evaluate-adjustments.py 成功运行         | `adjustments.yaml` 中 `last_evaluated` 有日期 |
| 3   | 3 个 Trae Schedule 已创建                | Schedule 列表 >= 3                            |
| 4   | docs/ai/README.md 合约清单完整           | 表格行数 = 15                                 |
| 5   | docs/ai/README.md knowledge 清单完整     | 表格行数 = 3                                  |
| 6   | memory/ 非空                             | `ls memory/*.md` 至少 3 个文件                |
| 7   | memory/patterns/ 和 memory/archive/ 存在 | 2 个目录                                      |

---

## 五、超出范围

- 不修改 GitHub Actions workflows 本身（仅确认它们的状态）
- 不重置或重写 evaluate-adjustments.py
- 不删除 docs/ai/contracts/ 中的任何文件
- 不做前端代码修改
- 不修改 `.harness/registry.yaml` 或 manifest.yaml
