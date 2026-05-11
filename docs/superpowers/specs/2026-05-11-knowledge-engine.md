# Harness 知识引擎 — 统一知识管理框架

> 融合 OpenClaw 记忆机制 + Hermes 自学习闭环 + LLM Wiki 知识复利

---

## 一、调研结论

### OpenClaw 记忆机制

- **文件即真相**：`MEMORY.md`（长期）+ `memory/YYYY-MM-DD.md`（每日），纯 Markdown
- **混合检索**：BM25（关键词）+ 向量（语义）+ 时间衰减（30 天半衰期）
- **压缩前刷新**：上下文即将压缩时，Agent 自动写入持久记忆
- **输出外化**：大结果写入独立文件，用指针引用，不占上下文

### Hermes 自学习机制

- **观察→提炼→复用→精炼** 四阶段闭环
- **15 次工具调用自检**：完成什么、成功什么、失败什么、用户纠正什么
- **3+ 次重复任务 → 自动创建 Skill**：SKILL.md 捕获流程、陷阱、验证步骤
- **技能自我修补**：执行中发现更好做法，自动 patch 现有 skill
- **三层记忆**：提示词记忆 → 情节存档（FTS5+LLM 摘要）→ 技能记忆（渐进披露）

### LLM Wiki 模式（Karpathy）

- **三层架构**：Raw（不可变源）→ Wiki（LLM 维护页）→ Schema（指令文件）
- **四操作**：Ingest → Query → Lint → Test
- **index.md**：内容目录；**log.md**：只追加操作日志
- **知识复利**：编译一次，持续收益；不像 RAG 每次从零推导

---

## 二、五层知识架构

```
┌─────────────────────────────────────────┐
│  Schema 层                               │
│  AGENTS.md + Harness 注册表 + 角色文件    │
│  "告诉 AI 如何组织知识"                   │
├─────────────────────────────────────────┤
│  Wiki 层                                 │
│  docs/ Markdown 文档 + LLM 自动维护       │
│  index.md + [[wikilinks]] 交叉引用        │
│  "知识的持久化合物"                       │
├─────────────────────────────────────────┤
│  Skill 层                                │
│  .agents/skills/ 可复用程序记忆           │
│  渐进披露（只加载相关 skill）              │
│  "从经验中自动提炼的可执行指令"            │
├─────────────────────────────────────────┤
│  记忆层                                  │
│  MEMORY.md（长期）+ memory/YYYY-MM-DD.md   │
│  向量 + BM25 + 时间衰减                   │
│  "跨会话的持久事实"                       │
├─────────────────────────────────────────┤
│  Raw 层                                  │
│  PRD / 外部文档 / 数据库 dump             │
│  只读不改，向上提供引用                   │
│  "不可变的原始源"                         │
└─────────────────────────────────────────┘
```

### 层间流动

```
Raw ─(Ingest)─▶ Wiki ─(模式提取)─▶ Skill
                      │
                      ▼
                  记忆层 ─(事实沉淀)─▶ MEMORY.md
                      │
                      ▼
                  下次会话自动加载
```

---

## 三、四阶段自学习闭环

```
阶段 1: 观察（Observe）
  ├── 15 次工具调用触发自检点
  ├── 记录：完成什么 / 成功 / 失败 / 用户纠正
  └── 写入 memory/YYYY-MM-DD.md

阶段 2: 提炼（Distill）
  ├── 夜间 consolidate agent 运行
  ├── 聚类同类会话 → 主题摘要
  ├── 3+ 次重复模式 → 自动创建 skill
  └── 关键事实 → 更新 MEMORY.md

阶段 3: 复用（Reuse）
  ├── 新会话 → memory_search 检索
  ├── 渐进披露：仅显示 skill 名+触发条件
  ├── 任务匹配时加载完整 SKILL.md
  └── 失败路径 → Agent 看到并规避

阶段 4: 精炼（Refine）
  ├── 执行中更好做法 → patch 原 skill
  ├── 每周 Lint：矛盾、死页、缺失引用
  ├── 过期知识 → 标记 deprecated
  └── 框架层面 → bump harness version
```

---

## 四、会话桥接

### 启动加载链

```
新会话启动 → AGENTS.md → 角色文件 → MEMORY.md
  → 今日+昨日日志 → 上次会话摘要 → 语义搜索 → 业务对话
```

### 结束存档

```
会话结束 → 生成 200 字概要 → .opencode/sessions/summary/
  → 提取长期事实 → 更新 MEMORY.md → 追加今日日志
```

---

## 五、Wiki 操作模型

| 操作   | 频率           | 做什么                                          |
| ------ | -------------- | ----------------------------------------------- |
| Ingest | 新增外部文档时 | 读取源 → 更新相关页 → 更新 index.md → 写 log.md |
| Query  | 每次提问       | 从 index.md 出发 → 加载相关页 → 引文链回到源    |
| Lint   | 每周/每月      | 扫描矛盾 → 死页 → 缺失引用 → 过期页             |
| Test   | 每发布         | 跑质量门禁 → 验证引用 → 检查 frontmatter        |

---

## 六、目录结构

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
├── .workbuddy/
│   ├── memory/YYYY-MM-DD.md     ← 任务日志
│   ├── stats/                   ← 质量数据
│   └── reports/                 ← 定期报告
├── docs/                        ← Wiki
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

---

## 七、实施优先级

| 优先级 | 模块                            | 工作量 | 状态      |
| ------ | ------------------------------- | ------ | --------- |
| P0     | `docs/index.md` + `docs/log.md` | 10 min | ⬜        |
| P0     | AGENTS.md checklist 化          | 30 min | ✅ 已完成 |
| P0     | 中文 + Skill 铁律五层冗余       | 20 min | ✅ 已完成 |
| P1     | 会话摘要自动存档                | 30 min | ⬜        |
| P1     | 15-call 自检点                  | 20 min | ⬜        |
| P2     | 夜间 consolidate agent          | 40 min | ⬜        |
| P2     | Skill auto-create 管道          | 60 min | ⬜        |
| P3     | 向量 + BM25 混合检索升级        | 30 min | ⬜        |

---

## 八、AGENTS.md 改造要点

改造前后对比：

| 维度       | 旧版             | 新版                                        |
| ---------- | ---------------- | ------------------------------------------- |
| 行数       | 147              | 30                                          |
| 格式       | 散文描述         | Checklist 逐项勾选                          |
| 语气       | "应该" "建议"    | 全部 MUST                                   |
| 启动动作   | 无               | memory_sessions + memory_recall + MEMORY.md |
| Skill 调用 | "匹配适用 skill" | 查映射表 → 调 skill → 声明结果              |
| 语言铁律   | 一行             | 五层冗余（AGENTS.md + skill + 四角色文件）  |

---

## 九、工具链映射

| 能力     | 工具                                                    | 状态                  |
| -------- | ------------------------------------------------------- | --------------------- |
| 长期记忆 | `agentmemory_memory_save` / `agentmemory_memory_recall` | ✅ 已配置，待自动调用 |
| 每日日志 | `task-memory`                                           | ✅ 每次任务后调用     |
| 语义检索 | `agentmemory_memory_smart_search`                       | ✅ 已有，未使用       |
| 会话列表 | `agentmemory_memory_sessions`                           | ✅ 已有，返回空       |
| 存档     | `.opencode/sessions/summary/`                           | ⬜ 待实现             |
| 自检     | 15-call checkpoint                                      | ⬜ 待实现             |
| Lint     | 每周健康检查                                            | ⬜ 待实现             |
