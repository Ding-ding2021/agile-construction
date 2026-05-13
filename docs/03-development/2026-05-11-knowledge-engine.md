---
id: DOC-DEVELOPMENT-KNOWLEDGE-ENGINE
number: GOV-029
domain: development
category: technical-design
title: Harness 知识引擎 — 统一知识管理框架
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code: []
related_docs:
  - DOC-GOVERNANCE-HUMAN-AI-COLLAB
  - DOC-GOVERNANCE-007-GIT-GOVERNANCE
---

# Harness 知识引擎 — 统一知识管理框架

> 融合 OpenClaw 记忆机制 + Hermes 自学习闭环 + LLM Wiki 知识复利

---

## Clause 1. 总则与设计原理

### 1.1 [参考] 文档定位

本规范定义 Harness 知识引擎的整体架构，涵盖知识分层、自学习闭环、会话桥接、Wiki 操作模型和目录结构。作为知识管理的顶层设计文档，与 [GOV-020 人机协作双轨策略](file:///Users/dylan/CodeBuddy/agile-construction/docs/00-governance/human-ai-collaboration.md) 构成互补关系（参见 `docs/00-governance/`）。

### 1.2 [参考] 三大机制融合

知识引擎融合三个开源知识管理范式：

**1.2.1 [参考] OpenClaw 记忆机制**

- **文件即真相**：`MEMORY.md`（长期）+ `memory/YYYY-MM-DD.md`（每日），纯 Markdown
- **混合检索**：BM25（关键词）+ 向量（语义）+ 时间衰减（30 天半衰期）
- **压缩前刷新**：上下文即将压缩时，Agent 自动写入持久记忆
- **输出外化**：大结果写入独立文件，用指针引用，不占上下文

**1.2.2 [参考] Hermes 自学习机制**

- 观察→提炼→复用→精炼 四阶段闭环
- 15 次工具调用自检：完成什么、成功什么、失败什么、用户纠正什么
- 3+ 次重复任务 → 自动创建 Skill：SKILL.md 捕获流程、陷阱、验证步骤
- 技能自我修补：执行中发现更好做法，自动 patch 现有 skill
- 三层记忆：提示词记忆 → 情节存档（FTS5+LLM 摘要）→ 技能记忆（渐进披露）

**1.2.3 [参考] LLM Wiki 模式（Karpathy）**

- **三层架构**：Raw（不可变源）→ Wiki（LLM 维护页）→ Schema（指令文件）
- **四操作**：Ingest → Query → Lint → Test
- **index.md**：内容目录；**log.md**：只追加操作日志
- **知识复利**：编译一次，持续收益；不像 RAG 每次从零推导

---

## Clause 2. 五层知识架构

### 2.1 [强制] 层次定义

项目知识按以下五层组织，自顶向下为 Schema → Wiki → Skill → 记忆 → Raw：

**2.1.1 [强制] Schema 层（顶层）**

- 文件：`AGENTS.md` + `.harness/manifest.yaml` + `.harness/registry.yaml` + 角色文件
- 职责：告诉 AI 如何组织知识
- 约束：此层为指令层，Agent 必须优先读取

**2.1.2 [强制] Wiki 层（知识库）**

- 文件：`docs/` 下所有 Markdown 文档，由 LLM 自动维护
- 结构：`docs/index.md` 作为总索引，文档间使用 `[[wikilinks]]` 交叉引用
- 定位：知识的持久化合物，跨会话不变

**2.1.3 [强制] Skill 层（可复用程序记忆）**

- 文件：`.agents/skills/` 下的 SKILL.md
- 加载策略：渐进披露，仅显示 skill 名+触发条件，任务匹配时加载完整内容
- 定位：从经验中自动提炼的可执行指令

**2.1.4 [强制] 记忆层（跨会话事实）**

- 文件：`memory/MEMORY.md`（长期）+ `memory/YYYY-MM-DD.md`（每日日志）
- 检索：向量 + BM25 + 时间衰减
- 定位：跨会话的持久事实

**2.1.5 [强制] Raw 层（不可变源）**

- 内容：PRD / 外部文档 / 数据库 dump 等原始材料
- 原则：只读不改，向上提供引用
- 定位：不可变的原始源

### 2.2 [强制] 层间流动规则

知识在五层之间按以下方向流动，不得逆向写入：

```
Raw ─(Ingest)─▶ Wiki ─(模式提取)─▶ Skill
                      │
                      ▼
                  记忆层 ─(事实沉淀)─▶ MEMORY.md
                      │
                      ▼
                  下次会话自动加载
```

**2.2.1 [强制]** Raw 层的原始文档经 Ingest 操作进入 Wiki 层

**2.2.2 [强制]** Wiki 层中识别出的可重复模式，提取为 Skill

**2.2.3 [强制]** 每次会话的关键事实沉淀到记忆层（MEMORY.md）

**2.2.4 [强制]** 记忆层内容在下次新会话启动时自动加载

---

## Clause 3. 四阶段自学习闭环

### 3.1 [强制] 阶段一：观察（Observe）

```
├── 15 次工具调用触发自检点
├── 记录：完成什么 / 成功 / 失败 / 用户纠正
└── 写入 memory/YYYY-MM-DD.md
```

**3.1.1 [强制]** 每 15 次工具调用必须触发一次自检点

**3.1.2 [强制]** 自检记录必须包含四要素：完成什么、成功什么、失败什么、用户纠正什么

**3.1.3 [强制]** 自检结果写入当日的 `memory/YYYY-MM-DD.md`

### 3.2 [强制] 阶段二：提炼（Distill）

```
├── 夜间 consolidate agent 运行
├── 聚类同类会话 → 主题摘要
├── 3+ 次重复模式 → 自动创建 skill
└── 关键事实 → 更新 MEMORY.md
```

**3.2.1 [推荐]** 配置夜间 consolidate agent 定期运行，自动处理当日日志

**3.2.2 [强制]** 同类会话聚类后生成主题摘要

**3.2.3 [强制]** 同一模式出现 3+ 次必须自动创建 Skill：SKILL.md 捕获流程、陷阱、验证步骤

**3.2.4 [强制]** 跨会话关键事实必须更新到 `MEMORY.md`

### 3.3 [强制] 阶段三：复用（Reuse）

```
├── 新会话 → memory_search 检索
├── 渐进披露：仅显示 skill 名+触发条件
├── 任务匹配时加载完整 SKILL.md
└── 失败路径 → Agent 看到并规避
```

**3.3.1 [强制]** 新会话启动时执行 memory_search 检索相关记忆

**3.3.2 [强制]** Skill 采用渐进披露：仅显示名称和触发条件，不加载全部内容

**3.3.3 [强制]** 任务匹配时加载完整 SKILL.md

**3.3.4 [推荐]** 历史失败路径应被检索到，供当前 Agent 规避

### 3.4 [强制] 阶段四：精炼（Refine）

```
├── 执行中更好做法 → patch 原 skill
├── 每周 Lint：矛盾、死页、缺失引用
├── 过期知识 → 标记 deprecated
└── 框架层面 → bump harness version
```

**3.4.1 [强制]** 执行中发现更好做法时立即 patch 原 skill

**3.4.2 [推荐]** 每周执行一次 Lint：扫描矛盾、死页、缺失引用、过期页

**3.4.3 [强制]** 过期知识标记为 deprecated，不得直接删除

**3.4.4 [参考]** 框架层面变更需 bump harness version

---

## Clause 4. 会话桥接

### 4.1 [强制] 启动加载链

新会话启动时按以下顺序加载知识：

```
新会话启动 → AGENTS.md → 角色文件 → MEMORY.md
  → 今日+昨日日志 → 上次会话摘要 → 语义搜索 → 业务对话
```

**4.1.1 [强制]** 加载顺序必须遵循：AGENTS.md → 角色文件 → MEMORY.md

**4.1.2 [强制]** 必须加载当日和昨日的操作日志

**4.1.3 [强制]** 必须加载上次会话摘要

**4.1.4 [推荐]** 启动时执行语义搜索，召回相关历史知识

### 4.2 [强制] 结束存档

会话结束时按以下顺序执行存档：

```
会话结束 → 生成 200 字概要 → .opencode/sessions/summary/
  → 提取长期事实 → 更新 MEMORY.md → 追加今日日志
```

**4.2.1 [强制]** 每次会话结束必须生成 200 字以内的概要

**4.2.2 [强制]** 概要按照 `.opencode/sessions/summary/` 存档

**4.2.3 [强制]** 从会话中提取的长期事实必须更新到 `MEMORY.md`

**4.2.4 [强制]** 当日操作追加到 `memory/YYYY-MM-DD.md`

---

## Clause 5. Wiki 操作模型

### 5.1 [强制] Ingest（摄入）

| 属性 | 值                                              |
| ---- | ----------------------------------------------- |
| 触发 | 新增外部文档时                                  |
| 操作 | 读取源 → 更新相关页 → 更新 index.md → 写 log.md |

**5.1.1 [强制]** 摄入外部文档时必须执行四步操作链：读取源 → 更新相关页 → 更新 `index.md` → 写 `log.md`

**5.1.2 [强制]** `log.md` 只追加，不修改历史记录

### 5.2 [强制] Query（查询）

| 属性 | 值                                           |
| ---- | -------------------------------------------- |
| 触发 | 每次提问                                     |
| 操作 | 从 index.md 出发 → 加载相关页 → 引文链回到源 |

**5.2.1 [强制]** 查询操作必须从 `index.md` 出发

**5.2.2 [强制]** 查询结果必须包含引文链，追溯到原始来源

### 5.3 [推荐] Lint（检查）

| 属性 | 值                                  |
| ---- | ----------------------------------- |
| 触发 | 每周/每月                           |
| 操作 | 扫描矛盾 → 死页 → 缺失引用 → 过期页 |

**5.3.1 [推荐]** 每周或每月执行 Lint 扫描

**5.3.2 [推荐]** Lint 覆盖范围：矛盾内容、死页链接、缺失引用、过期页面

### 5.4 [推荐] Test（测试）

| 属性 | 值                                       |
| ---- | ---------------------------------------- |
| 触发 | 每发布                                   |
| 操作 | 跑质量门禁 → 验证引用 → 检查 frontmatter |

**5.4.1 [推荐]** 每次发布前执行 Test

**5.4.2 [推荐]** Test 覆盖范围：质量门禁、引用验证、frontmatter 完整性

---

## Clause 6. 目录结构规范

### 6.1 [强制] 标准化目录布局

项目根目录必须遵循以下结构：

```
项目根/
├── AGENTS.md                    ← Schema
├── MEMORY.md                    ← 长期事实
├── memory/                      ← 每日操作日志
│   └── YYYY-MM-DD.md
├── .harness/                    ← 框架配置
│   ├── manifest.yaml
│   └── registry.yaml
├── .opencode/
│   ├── memory/                  ← 跨会话知识
│   ├── sessions/summary/        ← 会话桥接
│   └── hooks/
├── memory/                      ← 记忆层
│   ├── MEMORY.md                ← 长期记忆
│   ├── USER.md                  ← 用户画像
│   ├── YYYY-MM-DD.md            ← 任务日志
│   ├── stats/                   ← 质量数据
│   └── reports/                 ← 定期报告
├── docs/                        ← Wiki 层
│   ├── index.md                 ← 知识库总索引
│   ├── log.md                   ← 操作日志
│   ├── harness/                 ← 框架文档
│   ├── 00-governance/
│   ├── 01-product/
│   ├── 02-architecture/
│   ├── 03-engineering/
│   ├── 04-operations/
│   └── 99-archive/
├── .agents/skills/              ← 可复用技能
└── docs/superpowers/            ← 规格与计划
    ├── specs/
    └── plans/
```

**6.1.1 [强制]** `memory/` 目录下必须包含 `MEMORY.md` 和 `USER.md`

**6.1.2 [强制]** `docs/` 目录下必须包含 `index.md`（总索引）和 `log.md`（操作日志）

**6.1.3 [强制]** `docs/` 子目录使用双数字前缀排序（00-, 01-, 02-...）

**6.1.4 [强制]** `docs/99-archive/` 用于存放已废弃或归档的历史文档

**6.1.5 [强制]** 所有 skill 存放在 `.agents/skills/` 下，每个 skill 独立目录

### 6.2 [推荐] 目录维护规则

**6.2.1 [推荐]** 新增文档时同步更新 `docs/index.md`

**6.2.2 [推荐]** 文档移入 `99-archive/` 时在 `log.md` 中记录归档原因和时间

**6.2.3 [推荐]** `memory/stats/` 存放质量指标数据，`memory/reports/` 存放定期分析报告

---

## Clause 7. 实施优先级

### 7.1 [强制] 优先级定义

知识引擎的实施按 P0-P3 四级优先级组织：

| 优先级 | 含义   | 处理规则                           |
| ------ | ------ | ---------------------------------- |
| P0     | 阻塞级 | 必须优先完成，否则知识引擎无法运行 |
| P1     | 重要级 | 支撑核心体验，应尽快实现           |
| P2     | 增强级 | 提升自动化程度，按节奏推进         |
| P3     | 理想级 | 长期优化目标，有资源时处理         |

### 7.2 [参考] 当前实施状态

| 优先级 | 模块                                          | 工作量 | 状态      |
| ------ | --------------------------------------------- | ------ | --------- |
| P0     | `docs/index.md` + `docs/04-operations/log.md` | 10 min | ⬜ 待办   |
| P0     | AGENTS.md checklist 化                        | 30 min | ✅ 已完成 |
| P0     | 中文 + Skill 铁律五层冗余                     | 20 min | ✅ 已完成 |
| P1     | 会话摘要自动存档                              | 30 min | ⬜ 待办   |
| P1     | 15-call 自检点                                | 20 min | ⬜ 待办   |
| P2     | 夜间 consolidate agent                        | 40 min | ⬜ 待办   |
| P2     | Skill auto-create 管道                        | 60 min | ⬜ 待办   |
| P3     | 向量 + BM25 混合检索升级                      | 30 min | ⬜ 待办   |

**7.2.1 [强制]** P0 模块优先实施，完成后知识引擎方可投入使用

**7.2.2 [参考]** 已完成项（AGENTS.md 改造、中文铁律五层冗余）已纳入当前文档体系

---

## Clause 8. AGENTS.md 改造与工具链

### 8.1 [参考] AGENTS.md 改造原则

AGENTS.md 从散文风格改造为 checklist 风格，改造前后对比：

| 维度       | 旧版             | 新版                                        |
| ---------- | ---------------- | ------------------------------------------- |
| 行数       | 147              | 30                                          |
| 格式       | 散文描述         | Checklist 逐项勾选                          |
| 语气       | "应该""建议"     | 全部 MUST                                   |
| 启动动作   | 无               | memory_sessions + memory_recall + MEMORY.md |
| Skill 调用 | "匹配适用 skill" | 查映射表 → 调 skill → 声明结果              |
| 语言铁律   | 一行             | 五层冗余（AGENTS.md + skill + 四角色文件）  |

**8.1.1 [强制]** AGENTS.md 必须保持 checklist 格式，不得回退到散文风格

**8.1.2 [强制]** Agent 启动时必须执行 `memory_sessions` + `memory_recall` + 读取 `MEMORY.md`

**8.1.3 [强制]** Skill 调用必须：查映射表 → 调 skill → 声明结果

**8.1.4 [强制]** 语言铁律必须在五层冗余部署：AGENTS.md + skill + 四角色文件

### 8.2 [推荐] 工具链映射

| 能力     | 工具                                                    | 状态                  |
| -------- | ------------------------------------------------------- | --------------------- |
| 长期记忆 | `agentmemory_memory_save` / `agentmemory_memory_recall` | ✅ 已配置，待自动调用 |
| 每日日志 | `task-memory`                                           | ✅ 每次任务后调用     |
| 语义检索 | `agentmemory_memory_smart_search`                       | ✅ 已有，未使用       |
| 会话列表 | `agentmemory_memory_sessions`                           | ✅ 已有，返回空       |
| 存档     | `.opencode/sessions/summary/`                           | ⬜ 待实现             |
| 自检     | 15-call checkpoint                                      | ⬜ 待实现             |
| Lint     | 每周健康检查                                            | ⬜ 待实现             |

**8.2.1 [推荐]** 已配置的工具应逐步实现自动调用，减少人工介入

**8.2.2 [推荐]** 待实现模块按 Clause 7 优先级排期推进
