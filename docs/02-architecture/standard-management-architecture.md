---
id: ARCH-STANDARD-MANAGEMENT
title: 标准管理"标准化驱动执行"架构重构
status: active
ai_contract: docs/ai/contracts/standard-management.md
last_updated: 2026-05-14
---

# Spec: 标准管理"标准驱动执行"架构重构

## Objective

**我们在构建什么？**

将标准管理从"标准是孤立的资料库"重构为 **"标准是驱动任务生成、执行指导和验收判断的核心引擎"**。

**为什么？**

V1 产品定义（§2.2）的核心假设：

> 营建项目的质量保障，取决于标准是否能真正落到任务执行和验收判断中。标准不是文档，是可执行的规则。

老模型做了标准 CRUD 和 3 层结构（Standard→Clause→Rule），但存在三个结构性断裂：

1. **有规则没执行** — StandardRule 存在但从未在验收/执行中生效
2. **有快照引用没快照实体** — ProjectTask 引用了 `standardSnapshotId` 但 StandardSnapshot 表不存在
3. **标准是孤岛** — 标准和任务之间没有运行时绑定链路

**成功标准：**

1. 标准规则（StandardRule）在验收检查时被实际执行
2. 任务进入执行态时生成不可篡改的标准快照
3. 标准管理模块从"孤立的资料管理"升级为"标准驱动的执行引擎"
4. 标准绑定成为任务创建的标准步骤（可跳过但系统会提示）

**用户是谁？**

- 品牌标准管理员：录入标准、条款、规则，发布生效
- 项目经理：创建任务时绑定标准，验收时查看判定依据
- 营建专员：执行任务时看到简化的标准执行清单
- 验收员：验收时系统自动根据规则判断通过/不通过/整改

---

## Current State（当前问题诊断）

### 问题一：有规则没执行（核心断裂）

| 层次   | 现状                                                                  | 问题                                           |
| ------ | --------------------------------------------------------------------- | ---------------------------------------------- |
| 数据库 | StandardRule 有 `judgeType`(boolean/range/enum) + `paramConfig`(JSON) | 结构完整但从未被调用                           |
| 后端   | `createRule/updateRule/deleteRule/getRules` CRUD 全部就位             | 没有执行规则的 service 层                      |
| 前端   | StandardRule 类型定义完整（含 `JUDGE_TYPE_OPTIONS`）                  | 没有任何规则管理 UI 页面                       |
| 验收   | Task 有 `acceptanceClauseIds` 字段                                    | 验收时只是"勾选通过"，不读取 StandardRule 判定 |

**结论**：StandardRule 是"只存不用的死数据"。

### 问题二：有快照引用没快照实体

| 层次             | 现状                                                                       | 问题                 |
| ---------------- | -------------------------------------------------------------------------- | -------------------- |
| ProjectTask 模型 | 含 `standardSnapshotId`(String)、`standardBindingStatus`、`snapshotStatus` | 字段存在但无对应表   |
| 数据库           | 无 StandardSnapshot 表                                                     | 引用指向不存在的实体 |
| 后端             | 无快照创建/查询 API                                                        | 字段永远为空         |
| 前端             | TaskStandards 组件只读展示                                                 | 不参与任何业务流程   |

**结论**：快照机制在 PRD 里设计了 50 行，在代码里是 0。

### 问题三：标准是孤岛

| 维度          | 现状                                       |
| ------------- | ------------------------------------------ |
| 标准→任务绑定 | 无 API，ProjectTask 上有字段但无 CRUD 端点 |
| 标准→模板绑定 | 无，TaskTemplate 没有任何标准引用字段      |
| 标准→验收联动 | 验收时系统不读取 StandardRule              |
| 跨模块交互    | 仅有 TaskStandards 显示组件，纯展示无交互  |

**结论**：标准管理模块自洽运行，但与任务中心、验收整改、项目管理的接口全部缺失。

### 问题四：前端缺口

| 缺失项                           | 说明                                                   |
| -------------------------------- | ------------------------------------------------------ |
| StandardDetailPage 缺 PageLayout | 使用原始 div，与其他页面样式不一致                     |
| 缺标签页结构                     | 应在详情页内有"基本信息/条款/规则/文件/绑定历史"标签页 |
| 缺规则管理 UI                    | StandardRule 类型完整但没有任何管理界面                |
| 缺标准文件管理                   | StandardFile 表存在但无上传/下载/预览 UI               |
| 缺 Skeleton 加载                 | 使用纯文字"加载中..."                                  |
| 缺标准搜索/过滤器抽象            | 筛选栏在页面内联，未提取为独立组件                     |

---

## New Architecture Design

### 核心模型

```
                ┌──────────────────────────────────┐
                │         Standard（标准）           │
                │  ────────────────────────          │
                │  id, code, name, brand, storeType  │
                │  sourceType, status                │
                │                                    │
                │  ┌── StandardFile[]（标准文件）     │
                │  ├── StandardClause[]（条款）       │
                │  │     └── StandardRule[]（规则）   │
                │  └── StandardSnapshot[]（快照）     │
                └──────────────┬───────────────────┘
                               │
                ┌──────────────▼───────────────────┐
                │     标准绑定链路                    │
                │                                    │
                │  Standard ──绑定──▶ ProjectTask    │
                │       │                           │
                │       └──快照──▶ StandardSnapshot  │
                │                    │               │
                │                    └──被引用──▶ 验收│
                └──────────────────────────────────┘
```

### 1. StandardSnapshot — 标准快照（新实体）

**设计理由**：当任务进入"执行中"状态时，当时生效的标准版本需要被"冻住"。快照是审计和争议处理的唯一依据。

```prisma
model StandardSnapshot {
  id                  Int      @id @default(autoincrement())
  standardId          Int      @map("standard_id")
  clauseId            Int?     @map("clause_id")
  ruleId              Int?     @map("rule_id")
  taskId              Int      @map("task_id")
  snapshotVersion     String   @map("snapshot_version")
  // 快照内容（冻住当时的值，不受后续标准变更影响）
  standardName        String   @map("standard_name")
  clauseCode          String   @map("clause_code")
  clauseTitle         String   @map("clause_title")
  clauseContent       String?  @map("clause_content")
  ruleJudgeType       String?  @map("rule_judge_type")
  ruleParamConfig     String?  @map("rule_param_config")  // JSON
  generatedAt         DateTime @default(now()) @map("generated_at")
  generatedBy         String   @default("system") @map("generated_by")

  standard            Standard @relation(fields: [standardId], references: [id])
  clause              StandardClause? @relation(fields: [clauseId], references: [id])
  rule                StandardRule? @relation(fields: [ruleId], references: [id])
  task                ProjectTask @relation(fields: [taskId], references: [id])

  @@map("standard_snapshots")
}
```

**快照生成时机**：

- 任务首次进入"执行中"状态时自动生成
- 验收单创建时补充生成（如果之前的快照不够用）
- 整改任务生成时引用原快照

**快照不可变性**：

- 快照一旦生成，不可修改
- 原始标准后续变更不影响已生成的快照
- 任务完成/归档后快照变为只读

### 2. 规则执行引擎

将 StandardRule 从"死数据"变为"活规则"。

#### 2.1 规则类型与执行逻辑

```
judgeType: "boolean" → 判定结果为 true/false
  示例: 检查消防设备是否安装 → 是/否

judgeType: "range" → 数值是否在 [min, max] 区间
  示例: 地砖缝隙 ≤ 3mm → paramConfig: { "max": 3, "unit": "mm" }

judgeType: "enum" → 值是否在允许列表中
  示例: 墙面材料 ∈ [涂料, 壁纸, 瓷砖] → paramConfig: { "allowed": ["涂料","壁纸","瓷砖"] }
```

#### 2.2 规则执行服务

新建 `local-api/services/ruleEngine.ts`：

```typescript
interface RuleResult {
  passed: boolean
  actualValue?: string | number | boolean
  expectedValue: string
  message: string
}

function executeRule(rule: StandardRule, actualValue: string | number | boolean): RuleResult

function executeAcceptanceRules(
  snapshotIds: number[],
  actualValues: Record<string, string | number | boolean>
): {
  results: RuleResult[]
  passedCount: number
  failedCount: number
  passed: boolean // 全部通过才为 true
}
```

#### 2.3 API 端点新增

| 端点                                  | 说明                             |
| ------------------------------------- | -------------------------------- |
| `POST /standards/rules/:id/execute`   | 执行单条规则，给定实际值返回判定 |
| `POST /tasks/:id/acceptance/validate` | 执行任务所有绑定规则的验收判定   |

### 3. 标准绑定链路

#### 3.1 绑定数据模型

ProjectTask 上已有 `standardBindingStatus`、`standardSnapshotId`、`snapshotStatus` 三个字段，但需要补充中间表：

```prisma
model TaskStandardBinding {
  id          Int      @id @default(autoincrement())
  taskId      Int      @map("task_id")
  clauseId    Int      @map("clause_id")
  ruleId      Int?     @map("rule_id")
  bindingType String   @map("binding_type")  // execution / acceptance
  boundAt     DateTime @default(now()) @map("bound_at")
  boundBy     String?  @map("bound_by")

  task        ProjectTask @relation(fields: [taskId], references: [id])
  clause      StandardClause @relation(fields: [clauseId], references: [id])
  rule        StandardRule? @relation(fields: [ruleId], references: [id])

  @@unique([taskId, clauseId, bindingType])
  @@map("task_standard_bindings")
}
```

#### 3.2 绑定 API

| 端点                                     | 说明                       |
| ---------------------------------------- | -------------------------- |
| `POST /tasks/:id/standards/bind`         | 为任务绑定标准条款（批量） |
| `DELETE /tasks/:id/standards/:bindingId` | 解绑某条标准               |
| `GET /tasks/:id/standards`               | 查看任务已绑定的标准列表   |
| `GET /standards/:id/bindings`            | 查看某标准被哪些任务引用   |

#### 3.3 绑定守卫

- 任务进入"执行中"后不可再更改标准绑定
- 验收标准必须在任务开始执行前绑定
- 未绑定验收标准的任务，验收时显示"未绑定验收标准，无法判定"

### 4. 标准驱动的验收执行

```
验收流程（新）:
 ┌──────────────┐
 │ 验收员发起验收  │
 └──────┬───────┘
        │
 ┌──────▼───────┐
 │ 加载任务快照   │  ← 从 StandardSnapshot 读取冻住的标准
 └──────┬───────┘
        │
 ┌──────▼───────┐
 │ 执行规则判定   │  ← 调用 ruleEngine.executeAcceptanceRules()
 │               │     传入验收员填报的实际值
 │  boolean:     │     "消防设备已安装？" → 是 → 通过
 │  range:       │     "缝隙宽度" → 4mm > 3mm → 不通过
 │  enum:        │     "墙面材料" → 水泥 ∉ [涂料,壁纸,瓷砖] → 不通过
 └──────┬───────┘
        │
 ┌──────▼───────┐
 │ 生成验收结果   │
 │               │
 │ 全部通过 → 验收通过，任务进入"已完成"
 │ 有未通过 → 列出不通过项，可选生成整改任务
 └──────────────┘
```

---

## 数据库模式变更

### 新增表

| 表名                     | 说明                           |
| ------------------------ | ------------------------------ |
| `standard_snapshots`     | 标准快照，任务进入执行态时生成 |
| `task_standard_bindings` | 任务与标准条款/规则的绑定关系  |

### 保留表（无结构变更）

| 表名               | 说明                                                       |
| ------------------ | ---------------------------------------------------------- |
| `standards`        | 保持不变：code, name, brand, storeType, sourceType, status |
| `standard_files`   | 保持不变                                                   |
| `standard_clauses` | 保持不变                                                   |
| `standard_rules`   | 保持不变                                                   |

### ProjectTask 字段复用

ProjectTask 上已有的三个标准相关字段保持不变，作为快照引用的入口：

```
standardSnapshotId    String?  → 指向 StandardSnapshot（任务级主快照）
standardBindingStatus String   → "unbound" | "bound" | "snapshotted"
snapshotStatus         String   → "draft" | "generated" | "expired"
```

---

## 后端逻辑

### 新增 Service 层

```
local-api/services/
├── ruleEngine.ts          # 规则执行引擎
├── snapshotService.ts     # 快照生成与管理
└── standardBindingService.ts  # 标准绑定服务
```

### 规则引擎（ruleEngine.ts）

```typescript
// 核心接口
function executeRule(rule: StandardRule, actualValue: unknown): RuleResult
function executeAcceptanceRules(taskId: number, values: Record<string, unknown>): AcceptanceResult

// 触发时机
// 1. 验收员提交验收数据时
// 2. 整改完成后重新验收时
// 3. 手动触发单条规则验证时
```

### 快照服务（snapshotService.ts）

```typescript
// 核心接口
function generateSnapshots(taskId: number): StandardSnapshot[]
function getTaskSnapshots(taskId: number): StandardSnapshot[]
function getSnapshotById(snapshotId: number): StandardSnapshot

// 触发时机
// 1. 任务状态变为"执行中"时自动调用
// 2. 验收单创建时补充调用（兜底）
```

### 标准绑定服务（standardBindingService.ts）

```typescript
// 核心接口
function bindStandardsToTask(taskId: number, clauseIds: number[]): void
function unbindStandard(taskId: number, bindingId: number): void
function getTaskBindings(taskId: number): TaskStandardBinding[]
function checkBindingGuard(taskId: number): boolean // 任务状态是否允许修改绑定
```

### API 调整汇总

| 端点                                     | 变更类型 | 说明                   |
| ---------------------------------------- | -------- | ---------------------- |
| 现有的 12 个标准 CRUD 端点               | 不变     | 保持原有 CRUD          |
| `POST /tasks/:id/standards/bind`         | 新增     | 任务绑定标准           |
| `DELETE /tasks/:id/standards/:bindingId` | 新增     | 任务解绑标准           |
| `GET /tasks/:id/standards`               | 新增     | 查看任务已绑定标准     |
| `GET /tasks/:id/snapshots`               | 新增     | 查看任务所有快照       |
| `POST /tasks/:id/snapshots/generate`     | 新增     | 手动触发快照生成       |
| `POST /tasks/:id/acceptance/validate`    | 新增     | 执行验收规则判定       |
| `GET /standards/:id/bindings`            | 新增     | 查看标准被哪些任务引用 |

---

## 前端页面与功能

### 1. 标准列表页（StandardListPage）— 增强

| 调整     | 说明                                                        |
| -------- | ----------------------------------------------------------- |
| 搜索栏   | 保持现有 InputGroup + DropdownMenu 组合                     |
| 数据卡片 | 保持 SectionCards 指标卡：全部标准/已启用/品牌标准/行业标准 |
| 表格     | **新增列**：引用任务数（悬停显示任务列表）                  |
| 操作     | **新增操作**：标准绑定 → 跳转到任务选择器                   |
| 加载态   | **替换**"加载中..."文字 → Skeleton 组件                     |

### 2. 标准详情页（StandardDetailPage）— 重构

**核心变更：引入 PageLayout + 标签页结构**

```
┌────────────────────────────────────────────────┐
│ ← 标准管理 / 标准详情                           │
├────────────────────────────────────────────────┤
│ [基本信息] [条款] [规则] [文件] [绑定历史] [快照] │
├────────────────────────────────────────────────┤
│                                                │
│  （当前选中标签页的内容）                        │
│                                                │
└────────────────────────────────────────────────┘
```

| 标签页   | 内容                                                          | 复用组件                      |
| -------- | ------------------------------------------------------------- | ----------------------------- |
| 基本信息 | 标准名称/编码/品牌/店型/来源/状态                             | Card + Badge                  |
| 条款     | 条款列表表格，支持增删改                                      | Table + Dialog CRUD           |
| 规则     | **新增**：规则管理表格 + 表达式编辑器                         | Table + Dialog                |
| 文件     | **新增**：标准文件元信息管理（名称、版本），V1 不上传实际文件 | Table + Dialog（元信息 CRUD） |
| 绑定历史 | **新增**：标准被哪些任务引用的时间线                          | Table                         |
| 快照     | **新增**：由该标准生成的快照列表                              | Table                         |

### 3. 任务标准绑定组件 — 新建

```
src-next/pages/tasks/components/StandardBinding/
├── StandardBindingPanel.tsx     # 标准绑定面板（任务详情内的标签页）
├── StandardClauseSelector.tsx   # 条款选择器（搜索+多选）
└── StandardSnapshotViewer.tsx   # 快照查看器（只读，展示冻住的标准）
```

StandardBindingPanel 功能：

- 搜索标准 → 选择条款 → 绑定到当前任务
- 已绑定条款列表 → 解绑
- 绑定类型选择（执行标准/验收标准）
- 绑定状态提示（未绑定/已绑定/已生成快照）

### 4. 验收标准判定组件 — 新建

```
src-next/pages/acceptance/components/RuleJudgeResult.tsx
```

功能：

- 展示每条绑定的规则
- 输入实际值（根据 judgeType 显示不同输入控件）
- 实时判定结果（通过/不通过）
- 汇总通过率

### 5. 组件复用清单（从诊断中锁定）

| 复用模式             | 来源                           | 应用到                               |
| -------------------- | ------------------------------ | ------------------------------------ |
| PageLayout           | `components/page-layout.tsx`   | StandardDetailPage（当前缺失）       |
| SectionCards         | `components/section-cards.tsx` | 已用，保持不变                       |
| Skeleton             | shadcn/ui                      | StandardListPage、StandardDetailPage |
| Card 信息展示        | `Card` 组件                    | StandardDetailPage 基本信息标签      |
| Badge + STATUS_STYLE | `types/standard.ts` 已有       | 扩展应用到快照状态、绑定状态         |
| Dialog CRUD 表单     | 项目/任务模块已用              | 标准条款/规则 CRUD                   |
| DropdownMenu 筛选    | StandardListPage 已有          | 抽象为 FilterSortToolbar             |
| TaskPaginationBar    | `pages/tasks/components/`      | **提议提升到** `components/`         |

### 6. 新增页面清单

| 文件路径                                                                     | 说明                                                  |
| ---------------------------------------------------------------------------- | ----------------------------------------------------- |
| `src-next/pages/standards/components/StandardDetailTabs.tsx`                 | 标准详情标签页容器                                    |
| `src-next/pages/standards/components/RuleEditDialog.tsx`                     | 规则编辑器（range/enum/boolean 三类输入）             |
| `src-next/pages/standards/components/StandardFileMetaEditor.tsx`             | 标准文件元信息编辑器（名称、版本），V1 无实际文件上传 |
| `src-next/pages/standards/components/BindingHistoryTable.tsx`                | 绑定历史列表                                          |
| `src-next/pages/tasks/components/StandardBinding/StandardBindingPanel.tsx`   | 任务标准绑定面板                                      |
| `src-next/pages/tasks/components/StandardBinding/StandardClauseSelector.tsx` | 标准条款选择器                                        |
| `src-next/pages/tasks/components/StandardBinding/StandardSnapshotViewer.tsx` | 快照查看器                                            |
| `src-next/pages/acceptance/components/RuleJudgeResult.tsx`                   | 验收规则判定组件                                      |

---

## 迁移策略

### 阶段一：补齐基础设施（无破坏性变更）

```
1. 创建 StandardSnapshot 表
2. 创建 TaskStandardBinding 表
3. 新建 ruleEngine.ts, snapshotService.ts, standardBindingService.ts
4. 新增标准绑定 API（6 个端点）
5. 新增规则执行 API（2 个端点）
```

### 阶段二：前端页面重构

```
1. StandardDetailPage 引入 PageLayout + 标签页
2. 新建"规则"标签页（规则 CRUD）
3. 新建"文件"标签页（文件上传/下载）
4. 新建"绑定历史"和"快照"标签页
5. StandardListPage 增加 Skeleton + 引用任务数列
```

### 阶段三：打通链路

```
1. 新建 StandardBindingPanel（任务详情内的标准绑定标签）
2. taskStatus → "执行中" 触发快照生成
3. 验收时读取快照 + 执行规则判定
4. RuleJudgeResult 组件接入验收流程
```

### 阶段四：验收与回归

```
1. 全链路测试：创建标准 → 绑定任务 → 任务执行 → 快照生成 → 验收判定
2. PRD 旧文档归档（current PRD 内容已过时）
3. 更新 AI 合约
```

---

## Testing Strategy

| 层级     | 测试内容                              | 框架               | 覆盖率目标    |
| -------- | ------------------------------------- | ------------------ | ------------- |
| 单元测试 | ruleEngine 三种 judgeType 的判定逻辑  | Vitest             | 100% 分支覆盖 |
| 单元测试 | snapshotService 快照生成与不可变性    | Vitest             | 100%          |
| 单元测试 | standardBindingService 绑定/解绑/守卫 | Vitest             | 核心路径      |
| API 测试 | 标准绑定/解绑端点                     | Vitest + supertest | 核心路径      |
| API 测试 | 快照自动生成（任务→执行中触发）       | Vitest + supertest | 核心路径      |
| API 测试 | 验收规则判定端点                      | Vitest + supertest | 核心路径      |
| 组件测试 | StandardBindingPanel 绑定交互         | RTL                | 基本覆盖      |
| 组件测试 | RuleJudgeResult 判定渲染              | RTL                | 基本覆盖      |
| E2E 测试 | 标准→绑定→执行→快照→验收 全链路       | Playwright         | 1 场景        |

### 测试用例示例（规则引擎）

```typescript
describe('ruleEngine - boolean 类型', () => {
  it('实际值为 true → 通过', () => {
    const rule = { judgeType: 'boolean', paramConfig: null }
    const result = executeRule(rule, true)
    expect(result.passed).toBe(true)
  })

  it('实际值为 false → 不通过', () => {
    const rule = { judgeType: 'boolean', paramConfig: null }
    const result = executeRule(rule, false)
    expect(result.passed).toBe(false)
  })
})

describe('ruleEngine - range 类型', () => {
  it('实际值在范围内 → 通过', () => {
    const rule = { judgeType: 'range', paramConfig: JSON.stringify({ max: 3, unit: 'mm' }) }
    const result = executeRule(rule, 2)
    expect(result.passed).toBe(true)
  })

  it('实际值超出范围 → 不通过', () => {
    const rule = { judgeType: 'range', paramConfig: JSON.stringify({ max: 3, unit: 'mm' }) }
    const result = executeRule(rule, 5)
    expect(result.passed).toBe(false)
  })
})

describe('ruleEngine - enum 类型', () => {
  it('实际值在允许列表中 → 通过', () => {
    const rule = {
      judgeType: 'enum',
      paramConfig: JSON.stringify({ allowed: ['涂料', '壁纸', '瓷砖'] }),
    }
    const result = executeRule(rule, '涂料')
    expect(result.passed).toBe(true)
  })

  it('实际值不在允许列表中 → 不通过', () => {
    const rule = {
      judgeType: 'enum',
      paramConfig: JSON.stringify({ allowed: ['涂料', '壁纸', '瓷砖'] }),
    }
    const result = executeRule(rule, '水泥')
    expect(result.passed).toBe(false)
  })
})
```

---

## Boundaries

### Always

- 快照一旦生成不可修改
- 快照生成后不可更改标准绑定（锁定时机：生成快照时，而非进入"执行中"时）
- 验收判定必须基于快照中的标准版本，不能直接读当前标准
- 规则执行引擎的每种 judgeType 必须有单元测试
- 验收规则判定采用严格模式：全部绑定规则通过才算验收通过
- 绑定/解绑操作必须记录操作人和时间

### Ask First

- 修改 Prisma schema（新增表）
- 新增 API 端点
- 修改 StandardDetailPage 页面结构
- 改动与任务状态机的联结点

### Never

- 让验收员直接修改规则判定结果
- 快照内容被原始标准的后续变更覆盖
- 删除已生成快照的标准条款（改为停用）
- 在未绑定验收标准的情况下做"跳过验收"

---

## 与项目管理模块的关系

标准管理模块与[项目管理"任务驱动"架构](file:///Users/dylan/CodeBuddy/agile-construction/docs/02-architecture/project-task-driven-architecture.md)的交互点：

| 交互点      | 触发条件                  | 效果                       |
| ----------- | ------------------------- | -------------------------- |
| 任务→执行中 | taskStatus 变为"执行中"   | 自动生成标准快照           |
| 验收维度    | 验收检查项创建            | 读取快照 → 执行规则判定    |
| 整改        | 验收不通过 → 生成整改任务 | 整改任务继承原快照引用     |
| 项目健康度  | 验收维度"整改中"          | 健康度降级为"关注"或"预警" |

---

## Resolved Decisions（已决策 — 2026-05-14）

| #   | 问题           | 决策                                                                  | 理由                                                                 |
| --- | -------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | 快照粒度       | **A — 单条快照**（每条 clause+rule 一条记录）                         | 便于按条款查询和对比历史版本                                         |
| 2   | 规则失败容错   | **A — 严格模式**（全部通过才算通过）                                  | V1 优先保障质量，后续可演进为阈值模式                                |
| 3   | 绑定时机       | **B — 任务详情内随时绑定**（StandardBindingPanel 作为任务详情标签页） | 灵活绑定，不阻塞任务创建流程；锁定时机为"生成快照时"而非"进入执行中" |
| 4   | 文件管理完整度 | **A — 仅元信息**（名称、版本），不上传实际文件                        | V1 快速上线，实际文件管理留给后续版本                                |
