# Harness 框架反馈与纠正机制 — 修复方案

## 摘要

基于前次 Harness 执行情况审查（2026-05-14，总分 74.5/B 级）发现的 5 个根因和 11 个问题，本方案聚焦**修复现有机制的断裂点**，构建一个**自动化闭环**的反馈纠正系统。

核心目标：让「检测违规 → 生成矫正 → 送达 Agent → 验证效果」四个环节全自动运转。

---

## 一、当前状态分析

### 1.1 现有机制架构

```
memory/*.md（记忆日志）
    ↓ 扫描
evaluate-adjustments.py（评估引擎）
    ↓ 生成
adjustments.yaml（调节状态存储）
    ↓ 同步
AGENTS.md 矫正块（送达 Agent 上下文）
```

### 1.2 前次审计发现的 5 个根因

| 编号 | 根因                                              | 影响                                                 | 严重度 |
| ---- | ------------------------------------------------- | ---------------------------------------------------- | ------ |
| R1   | 矫正块未注入 AGENTS.md                            | 调节指令从未送达 Agent，技能调用率低无法纠正         | 🔴 高  |
| R2   | 自动化链条三处断裂（CI 迁移、路径双轨、脚本 Bug） | 定时任务失效，评估结果不可靠                         | 🔴 高  |
| R3   | 记忆日志格式不一致                                | 评测引擎对非标准格式「失明」，漏报违规               | 🟡 中  |
| R4   | 验证层缺失                                        | 矫正是否生效无人知晓，调节效果无法衡量               | 🟡 中  |
| R5   | 人机交接无追踪                                    | 需要人类确认的项进入黑洞（飞书技能分配、L3-L4 审批） | 🟡 中  |

### 1.3 现有机制的核心缺陷：有检测无验证

当前机制停留在「检测 → 生成矫正」两段，缺少「验证矫正是否生效」的闭环。这导致：

- adjustments.yaml 反复生成相同的调节（技能遗漏率高），但从未解决
- 没有机制回答「上次的矫正指令奏效了吗？」

---

## 二、方案设计

### 2.1 目标架构：四段全自动闭环

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ ① 检测   │ → │ ② 生成   │ → │ ③ 送达   │ → │ ④ 验证   │
│ 扫描记忆 │    │ 匹配规则 │    │ 注入上下文│    │ 对比前后 │
│ 日志     │    │ 生成调节 │    │ Agent 读 │    │ 指标变化 │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                     │
                                               ┌─────↓─────┐
                                               │ ⑤ 自进化  │
                                               │ 调节生效  │
                                               │ 则过期    │
                                               │ 不生效    │
                                               │ 则升级    │
                                               └───────────┘
```

### 2.2 修复清单（按优先级）

#### P0 — 紧急修复（阻塞性断裂）

**FIX-1：修复 AGENTS.md 矫正块注入**

- **问题**：AGENTS.md 当前已回退到无矫正块的版本，`sync_agfile()` 在脚本中存在但上次运行时 AGENTS.md 结构不匹配导致注入位置错误
- **修复方案**：
  1. 在 AGENTS.md 末尾（`## 项目信息` 之后）加入占位标记 `<!-- ADJUSTMENTS-START -->` 和 `<!-- ADJUSTMENTS-END -->`，注意保留原有内容完整性
  2. 修改 `sync_agfile()` 函数，确保当 AGENTS.md 不含「启动清单」和「语言铁律」章节时，能以占位标记的方式正确查找和替换
  3. 手动运行一次 `evaluate-adjustments.py`，验证矫正块能正确注入
- **涉及文件**：`AGENTS.md`、`scripts/evaluate-adjustments.py`
- **验证方式**：运行脚本后检查 AGENTS.md 是否包含完整的矫正块

**FIX-2：统一 CI 输出路径**

- **问题**：weekly-review.yml 写到 `.workbuddy/stats/`，但 registry.yaml 和文档引用 `memory/stats/`，两套路径互不联通
- **修复方案**：
  1. 修改 `weekly-review.yml`，将输出路径从 `.workbuddy/stats/weekly/` 改为 `memory/stats/weekly/`
  2. 同样修改 `monthly-review.yml` 路径
  3. 确保 `memory/stats/` 目录结构存在
- **涉及文件**：`.github/workflows/weekly-review.yml`、`.github/workflows/monthly-review.yml`
- **验证方式**：检查 workflow 中的路径是否一致

**FIX-3：修复 rules.md 路径引用**

- **问题**：`evaluate-adjustments.py` L451 的 `rules_path` 指向 `docs/ai/contracts/rules.md`，实际文件在 `docs/ai/knowledge/rules.md`
- **确认**：前次检查发现实际路径是 `docs/ai/knowledge/rules.md`，需确认脚本中已修正
- **涉及文件**：`scripts/evaluate-adjustments.py`
- **验证方式**：grep 确认脚本中路径正确

#### P1 — 重要修复（增强健壮性）

**FIX-4：记忆日志格式强制校验**

- **问题**：Agent 写入记忆日志时格式不统一（有的用 `/` 分隔，有的用中文「次」），导致 `parse_self_check_blocks()` 解析失败
- **修复方案**：
  1. 在 `.husky/pre-commit` 中增加格式校验：检查 `memory/*.md` 中「避坑」行是否符合标准正则
  2. 格式不匹配时警告但不阻断 commit（首次），连续两次不匹配时阻断
  3. 增强 `parse_self_check_blocks()` 解析器，增加兼容性正则作为兜底
- **涉及文件**：`.husky/pre-commit`、`scripts/evaluate-adjustments.py`
- **验证方式**：用历史日志中的非标准格式测试解析器能正确提取

**FIX-5：增加矫正效果验证层**

- **问题**：当前只有「检测 → 生成矫正」，没有「验证矫正是否生效」
- **修复方案**：
  1. 在 `evaluate-adjustments.py` 增加 `--verify` 模式
  2. 验证逻辑：对比「矫正应用前 7 天」和「矫正应用后 7 天」的同指标数据
  3. 若指标改善 → 标记调节 `status: resolved`，下个周期自动过期
  4. 若指标不变 → 保持 active，在 AGENTS.md 中标注「⚠️ 未改善」
  5. 若指标恶化 → 升级 severity（L1→L2, L2→L3），触发人工审批
  6. 验证结果写入 `memory/stats/adjustment-effectiveness.md`
- **涉及文件**：`scripts/evaluate-adjustments.py`（新增 verify 逻辑）
- **验证方式**：模拟数据测试升级/降级逻辑

**FIX-6：人机交接待办追踪**

- **问题**：飞书技能分配、L3-L4 审批等需人类介入的任务没有追踪机制
- **修复方案**：
  1. 新建 `memory/pending-human-tasks.md`，记录所有待人类处理项
  2. `evaluate-adjustments.py` 运行时自动将 L3-L4 pending_approval 项写入此文件
  3. 在 AGENTS.md 矫正块末尾增加「待人类处理」节，提醒人类当前有未决项
  4. 人类处理后手动更新状态，下个周期自动清理已完成项
- **涉及文件**：`memory/pending-human-tasks.md`（新建）、`scripts/evaluate-adjustments.py`、`AGENTS.md`
- **验证方式**：检查 L3 调节是否同时出现在 AGENTS.md 和 pending-human-tasks.md

#### P2 — 优化改进（长期健壮性）

**FIX-7：真相源同步自动校验**

- **问题**：registry.yaml 与 03-skills.md 技能清单不一致，无人发现
- **修复方案**：
  1. 新建 `scripts/verify-truth-source.py`
  2. 校验项：registry.yaml 中的技能数 vs 03-skills.md Clause 4 中的技能数、role_file 路径是否指向存在的文件、manifest.yaml skills_total 是否等于各角色技能数之和
  3. 集成到 weekly-review.yml，失败时告警但不阻断
- **涉及文件**：`scripts/verify-truth-source.py`（新建）、`.github/workflows/weekly-review.yml`
- **验证方式**：故意制造不一致，确认脚本能检测到

**FIX-8：daily-summary 恢复或确认替代方案**

- **问题**：daily-summary.yml 已禁用，注释说「由 Trae Schedule 替代」但新系统无产出
- **修复方案**：
  1. 确认 Trae Schedule 是否配置了对应的定时任务
  2. 若已配置但未生效，排查 Trae Schedule 的执行日志
  3. 若未配置，恢复 daily-summary.yml 或配置 Trae Schedule
- **涉及文件**：`.github/workflows/daily-summary.yml`
- **验证方式**：检查是否有 daily summary 产出文件

---

## 三、实施计划

### 阶段一：紧急修复（1 个工作日）

| 步骤 | 动作                                | 涉及文件                              | 产出                   |
| ---- | ----------------------------------- | ------------------------------------- | ---------------------- |
| 1.1  | 在 AGENTS.md 末尾添加矫正块占位标记 | AGENTS.md                             | 有占位标记的 AGENTS.md |
| 1.2  | 修改 sync_agfile() 支持占位标记模式 | evaluate-adjustments.py               | 修复后的注入逻辑       |
| 1.3  | 手动运行评估脚本验证注入            | —                                     | AGENTS.md 含矫正块     |
| 1.4  | 统一 CI 输出路径到 memory/stats/    | weekly-review.yml, monthly-review.yml | 路径一致               |
| 1.5  | 确认 rules.md 路径正确              | evaluate-adjustments.py               | 路径确认               |

**阶段一验证**：手动运行 `python3 scripts/evaluate-adjustments.py --days 14`，确认：

- adjustments.yaml 更新
- AGENTS.md 包含正确矫正块
- 无报错

### 阶段二：闭环增强（2 个工作日）

| 步骤 | 动作                                   | 涉及文件                      | 产出     |
| ---- | -------------------------------------- | ----------------------------- | -------- |
| 2.1  | 增加 verify 逻辑到评估脚本             | evaluate-adjustments.py       | 验证能力 |
| 2.2  | 实现矫正效果追踪（改善/不变/恶化三级） | evaluate-adjustments.py       | 效果追踪 |
| 2.3  | 增强避坑格式解析器兼容性               | evaluate-adjustments.py       | 解析兜底 |
| 2.4  | 新增 pre-commit 格式校验（警告模式）   | .husky/pre-commit             | 格式提醒 |
| 2.5  | 新建 pending-human-tasks.md            | memory/pending-human-tasks.md | 待办追踪 |

**阶段二验证**：

- 用模拟数据测试验证逻辑（改善/不变/恶化三种情况）
- 用历史非标准格式日志测试解析器
- 确认 L3 调节能同时出现在 AGENTS.md 和 pending-human-tasks.md

### 阶段三：长期建设（1 个工作日）

| 步骤 | 动作                          | 涉及文件                           | 产出         |
| ---- | ----------------------------- | ---------------------------------- | ------------ |
| 3.1  | 新建真相源校验脚本            | scripts/verify-truth-source.py     | 自动校验     |
| 3.2  | 集成到 weekly-review workflow | weekly-review.yml                  | CI 自动校验  |
| 3.3  | 恢复或确认 daily-summary      | daily-summary.yml 或 Trae Schedule | 每日总结恢复 |

**阶段三验证**：故意制造一个 registry 与 docs 不一致，确认 CI 能报告

---

## 四、关键文件修改说明

### 4.1 AGENTS.md

**修改内容**：在文件末尾 `## 项目信息` 段落之后，添加：

```markdown
<!-- ADJUSTMENTS-START -->
<!-- ADJUSTMENTS-END -->
```

**原则**：不改变现有铁律内容，只增加占位标记，由脚本自动填充矫正块。

### 4.2 scripts/evaluate-adjustments.py

**修改点**：

1. **sync_agfile()** — 增加「仅占位标记」模式的替换逻辑
2. **parse_self_check_blocks()** — 增加兼容正则，解析 `3次（E1 xxx / E2 xxx）` 等变体格式
3. **新增 verify_effectiveness()** — 对比矫正前后指标变化，返回改善/不变/恶化
4. **新增 main() 中的 --verify 分支** — 支持独立验证模式

### 4.3 .github/workflows/weekly-review.yml

**修改点**：路径从 `.workbuddy/stats/weekly/` 改为 `memory/stats/weekly/`

### 4.4 .husky/pre-commit（新增逻辑）

在现有 hook 末尾增加：

```bash
# 记忆日志格式校验（警告模式，不阻断）
for f in $(git diff --cached --name-only --diff-filter=ACM | grep '^memory/.*\.md$'); do
  if grep -q '避坑' "$f" && ! grep -qP '避坑\s*\|.*\d+\s*次' "$f"; then
    echo "⚠️  $f: 避坑格式可能不规范，建议检查"
  fi
done
```

### 4.5 scripts/verify-truth-source.py（新建）

独立校验脚本，检查：

- registry.yaml 技能数 vs 03-skills.md 技能数
- role_file 路径可访问性
- manifest.yaml skills_total 一致性

### 4.6 memory/pending-human-tasks.md（新建）

模板格式：

```markdown
# 待人类处理任务

> 由 evaluate-adjustments.py 自动维护，人类处理后手动更新状态

## 待审批调节（L3-L4）

| ID  | 角色 | 触发条件 | 严重度 | 状态 | 创建日期 |
| --- | ---- | -------- | ------ | ---- | -------- |

## 待分配技能（Lark 技能）

| 技能名 | 状态 | 建议角色 | 创建日期 |
| ------ | ---- | -------- | -------- |
```

---

## 五、假设与决策

1. **矫正块仍在 AGENTS.md**：不引入新的上下文文件，保持 Agent 加载链路简单
2. **CI 路径统一到 memory/stats/**：与 memory/ 日志体系保持一致，便于数据聚合
3. **格式校验采用警告模式**：不强制阻断 commit 避免影响 Agent 正常流程，提供渐进式约束
4. **验证层内嵌到评估脚本**：不拆分为独立脚本，保持「检测+生成+验证」在同一执行上下文中
5. **daily-summary 先确认状态再决定修复**：不盲目恢复，先确认 Trae Schedule 的实际情况

---

## 六、验证步骤

完成所有修改后，按以下顺序验证：

1. **单元验证**：手动运行 `python3 scripts/evaluate-adjustments.py --days 14 --dry-run`
2. **注入验证**：检查 AGENTS.md 是否包含完整矫正块
3. **验证逻辑**：用历史数据模拟 --verify 模式，确认改善/不变/恶化三级判断正确
4. **格式解析**：用 05-13.md（非标准格式）测试解析器能正确提取
5. **CI 集成**：确认 weekly-review.yml 修改后语法正确
6. **真相源校验**：运行 verify-truth-source.py，确认能检测 registry-md 不一致
