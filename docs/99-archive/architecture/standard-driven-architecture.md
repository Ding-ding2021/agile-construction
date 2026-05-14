---
id: ARCH-STANDARD-DRIVEN
title: 标准管理"标准驱动执行"架构重构
status: active
ai_contract: docs/ai/contracts/standard-driven.md
last_updated: 2026-05-14
---

# Spec: 标准管理"标准驱动执行"架构重构

## Objective

**我们在构建什么？**

将标准管理从"标准是一本独立的花名册"重构为 **"标准是驱动任务生成、执行指导和验收判断的核心引擎"**。

**为什么？**

V1 产品定义（§2.2）的核心假设：

> 标准驱动执行——品牌营建标准不只是参考文件，而是任务生成、执行指导和验收判断的驱动引擎。任务应能从标准自动推导执行清单，验收应能从标准自动生成检查项。

老模型把标准当作可查询的资料库。标准的存在不产生任何业务影响。新模型认为标准是系统的"规则发动机"——标准绑定到任务模板，任务实例化时生成快照，执行时输出指导清单，验收时驱动检查项判定。

**成功标准：**

1. 标准可以从标准库被绑定到任务模板，模板实例化时任务自动携带标准快照
2. 任务的执行清单可由绑定的执行标准自动推导
3. 验收检查项可由绑定的验收标准自动生成，判定可由规则引擎计算
4. StandardSnapshot 是真实存在的表，不再是悬空引用
5. 标准变更后，在途任务继续使用历史快照，不受新版本影响

**用户是谁？**

- 品牌标准管理员：录入标准、切分条款、维护规则、管理版本
- 项目经理：在创建项目模板时绑定标准，确保项目中的任务有标准可依
- 验收/质检人员：在验收环节查看任务的验收标准，执行检查项判定
- 系统自动：从模板实例化任务时自动生成标准快照

---

## Current State（当前问题诊断）

### 诊断总览：V1 功能定义 vs 当前实现

| V1 核心能力                       | PRD 要求                     | 当前实现  | 差距                                  |
| --------------------------------- | ---------------------------- | --------- | ------------------------------------- |
| 标准对象库（执行标准 + 验收标准） | CRUD，3 层模型               | ✅ 已实现 | 缺规则层 UI、缺文件管理 UI            |
| 标准绑定到模板/任务               | 模板→标准关联，任务→快照生成 | ⚠️ 半实现 | ProjectTask 有绑定字段但无 API、无 UI |
| 标准驱动执行                      | 执行清单自动推导             | ❌ 未实现 | 规则存在但无执行逻辑                  |
| 标准快照                          | 任务进入执行态时固化         | ❌ 未实现 | StandardSnapshot 表不存在             |

### 问题一：StandardSnapshot 是幽灵表

ProjectTask 模型中有三个标准相关字段：

```prisma
standardSnapshotId   String?    // 引用一个不存在的表
standardBindingStatus String   @default("unbound")  // unbound/bound/snapshotted
snapshotStatus        String   @default("draft")    // draft/generated
```

但数据库中没有 `StandardSnapshot` 表。这是一个**幽灵引用**——前端和后端都知道有"标准快照"这个概念，但无法存储、查询或使用它。

| 影响                 | 说明                                       |
| -------------------- | ------------------------------------------ |
| 任务无法携带标准快照 | 任务知道"应该有快照"但不知道快照内容是什么 |
| 标准变更无法追溯     | 标准更新后，历史任务找不到当时的执行依据   |
| 验收争议无据可查     | 验收不通过时，无法回溯任务当时的验收标准   |

### 问题二：规则只存不用

StandardRule 模型定义了判定类型：

```prisma
model StandardRule {
  judgeType   String   // boolean / range / enum
  paramConfig String?  // JSON，如 { min: 10, max: 100 }
  description String?
}
```

后端有 4 个规则 CRUD 端点（getClauseRules, createRule, updateRule, deleteRule），前端类型定义完整（JUDGE_TYPE_OPTIONS、StandardRule 接口），但：

- 前端没有任何规则管理页面
- 后端没有规则执行引擎（判断一个值是否通过规则）
- 验收环节完全不读取规则数据

**规则从定义到执行是断链的。**

### 问题三：标准是孤岛

当前标准管理与任务的唯一连接点是 `TaskStandards.tsx` 组件：

- **只展示**：显示任务关联的标准名称和条款列表
- **不交互**：没有"绑定标准"的按钮或对话框
- **不计算**：不触发规则判定，不生成执行清单
- **依赖悬空 ID**：读取 `TaskDetail.standardClauseIds` 和 `acceptanceClauseIds`，这些字段不在 Prisma 中

| 期望（V1 PRD §5.2）               | 现状          |
| --------------------------------- | ------------- |
| 标准 → 任务模板 → 任务实例 → 快照 | ❌ 无此链路   |
| 标准变更影响评估                  | ❌ 无此功能   |
| 在途任务快照隔离                  | ❌ 无快照实体 |

---

### 前端诊断

#### StandardListPage（411 行）

| 方面      | 状态 | 说明                                              |
| --------- | ---- | ------------------------------------------------- |
| 页面框架  | ✅   | 使用 PageLayout，结构正确                         |
| 统计卡片  | ✅   | SectionCards 显示 3 个指标                        |
| 筛选      | ✅   | InputGroup 搜索 + DropdownMenu 来源类型/排序      |
| 列表      | ⚠️   | Table 是内联的，未抽取为独立组件                  |
| 加载态    | ❌   | 纯文本"加载中..."，无 Skeleton                    |
| 空态      | ⚠️   | 简单文本，无插图和操作引导                        |
| 新增/编辑 | ✅   | Dialog 弹窗表单                                   |
| 删除      | ✅   | 软删除（isDeleted 标记），使用 AlertDialog        |
| 分页      | ✅   | 使用 TaskPaginationBar（从 tasks 目录跨模块引用） |

#### StandardDetailPage（412 行）

| 方面         | 状态 | 说明                                                    |
| ------------ | ---- | ------------------------------------------------------- |
| 页面框架     | ❌   | 未使用 PageLayout，自己写 div 布局                      |
| 标准基本信息 | ✅   | Card 展示 name、code、brand、storeType、sourceType      |
| Tab 结构     | ❌   | 无标签页，所有内容平铺在一个页面                        |
| 条款管理     | ⚠️   | Table 展示条款列表，支持新增/编辑（Dialog），缺删除确认 |
| 规则管理     | ❌   | 完全不存在                                              |
| 文件管理     | ❌   | 完全不存在，但 StandardFile 模型和后端 API 已就绪       |
| 加载态       | ❌   | 纯文本"加载中..."                                       |
| 返回导航     | ✅   | 有返回按钮                                              |
| 标准状态切换 | ❌   | 无法从 active 切换为 inactive/draft                     |

#### TaskStandards 组件（跨模块）

| 方面         | 状态 | 说明                   |
| ------------ | ---- | ---------------------- |
| 标准绑定展示 | ✅   | 显示绑定状态和条款信息 |
| 标准绑定操作 | ❌   | 无"绑定标准"交互       |
| 执行清单     | ❌   | 无从标准推导执行清单   |
| 规则判定     | ❌   | 无规则执行引擎调用     |

---

### 后端诊断

#### 现有端点（全部位于 /standards 前缀）

| 端点                                 | 方法   | 层次     | 状态                                                          |
| ------------------------------------ | ------ | -------- | ------------------------------------------------------------- |
| `/standards`                         | GET    | Standard | ✅ 列表查询（支持 search/sourceType/status/sortBy/sortOrder） |
| `/standards`                         | POST   | Standard | ✅ 创建（自动生成 code STD-XXXX）                             |
| `/standards/:id`                     | GET    | Standard | ✅ 详情                                                       |
| `/standards/:id`                     | PUT    | Standard | ✅ 更新（COALESCE 部分更新）                                  |
| `/standards/:id`                     | DELETE | Standard | ✅ 软删除                                                     |
| `/standards/:id/clauses`             | GET    | Clause   | ✅ 按标准查询条款                                             |
| `/standards/:id/clauses`             | POST   | Clause   | ✅ 创建条款                                                   |
| `/standards/clauses/:clauseId`       | PUT    | Clause   | ✅ 更新条款                                                   |
| `/standards/clauses/:clauseId`       | DELETE | Clause   | ✅ 硬删除条款                                                 |
| `/standards/clauses/:clauseId/rules` | GET    | Rule     | ✅ 按条款查询规则                                             |
| `/standards/clauses/:clauseId/rules` | POST   | Rule     | ✅ 创建规则                                                   |
| `/standards/rules/:ruleId`           | PUT    | Rule     | ✅ 更新规则                                                   |
| `/standards/rules/:ruleId`           | DELETE | Rule     | ✅ 硬删除规则                                                 |

#### 缺失的端点

| 需要新增                                    | 用途                 |
| ------------------------------------------- | -------------------- |
| `GET /standards/:id/files`                  | 查询标准关联文件     |
| `POST /standards/:id/files`                 | 上传标准文件         |
| `DELETE /standards/files/:fileId`           | 删除标准文件         |
| **`POST /tasks/:taskId/bind-standard`**     | 任务绑定标准         |
| **`DELETE /tasks/:taskId/unbind-standard`** | 任务解绑标准         |
| **`POST /tasks/:taskId/generate-snapshot`** | 为任务生成标准快照   |
| **`GET /tasks/:taskId/standard-snapshot`**  | 查看任务的标准快照   |
| **`POST /tasks/:taskId/check-rules`**       | 执行规则判定         |
| `GET /standards/:id/impact`                 | 查看标准引用影响范围 |

---

### 数据库诊断

#### 现有模型（4 张表）

| 表               | 状态 | 说明                                              |
| ---------------- | ---- | ------------------------------------------------- |
| standards        | ✅   | 9 字段完整，sourceType/status 枚举合理            |
| standard_files   | ⚠️   | content 为 String?，应改为存储文件路径或改用 Blob |
| standard_clauses | ✅   | 6 字段 + unique(standardId, code)，结构合理       |
| standard_rules   | ✅   | 4 字段，judgeType/paramConfig 设计合理            |

#### 缺失的模型

| 需要新增             | 用途                       |
| -------------------- | -------------------------- |
| **StandardSnapshot** | 任务实例化时固化的标准快照 |

#### ProjectTask 中需要调整的字段

当前：

```prisma
standardSnapshotId    String?   // 幽灵引用，类型应为 Int?
standardBindingStatus String   @default("unbound")
snapshotStatus        String   @default("draft")
```

调整后：standardSnapshotId 改为 Int? 指向真实存在的 StandardSnapshot 表。

---

### 组件复用诊断

#### 已识别 8 个跨模块可复用模式

| 模式                         | 当前状态         | 在标准管理中的使用                                        |
| ---------------------------- | ---------------- | --------------------------------------------------------- |
| PageLayout                   | 页面统一框架     | StandardListPage ✅ / StandardDetailPage ❌               |
| SectionCards                 | 统计指标卡       | StandardListPage ✅                                       |
| DropdownMenu 筛选/排序       | 下拉菜单式工具栏 | StandardListPage ✅                                       |
| Badge + STATUS_STYLE 映射    | 状态标签         | StandardListPage ✅ / StandardDetailPage ✅               |
| Dialog CRUD 表单             | 新增/编辑弹窗    | StandardListPage ✅ / StandardDetailPage ⚠️（缺删除确认） |
| Card 信息展示                | 信息卡片         | StandardDetailPage ⚠️（使用 grid 但非标准 Card）          |
| Skeleton 加载                | 骨架屏加载       | ❌ 两页都用纯文本"加载中..."                              |
| TaskPaginationBar 跨模块分页 | 分页组件         | StandardListPage ✅（但位于 tasks 目录，应提升）          |

#### 缺失的 10 项 UI 模式

| 优先级 | 缺失项                                         | 影响                         |
| ------ | ---------------------------------------------- | ---------------------------- |
| **P0** | StandardDetailPage 使用 PageLayout             | 页面结构不一致               |
| **P0** | StandardDetailPage 添加 Tab 结构               | 条款/规则/文件无层级组织     |
| **P0** | 条款表抽取为 StandardClauseTable 组件          | 便于跨页面复用               |
| **P1** | Skeleton 加载态替换纯文本                      | 用户体验                     |
| **P1** | 规则管理 UI（StandardRuleTable + RuleDialog）  | V1 核心能力缺失              |
| **P1** | 文件管理 UI（StandardFileUpload + FileList）   | API 就绪 UI 缺失             |
| **P1** | TaskPaginationBar 从 tasks/ 提升到 components/ | 架构规范                     |
| **P2** | 搜索输入框抽象为 SearchInput                   | 减少重复代码                 |
| **P2** | 筛选排序工具栏抽象为 FilterSortToolbar         | 减少重复代码                 |
| **P2** | 删除确认 AlertDialog 标准化                    | 条款/规则/文件的删除统一交互 |

---

## New Architecture Design

### 核心模型

```
标准的"角色" = 不是资料库，是规则发动机
                     ↓
            ┌──────────────────┐
            │   Standard        │
            │  ─────────        │
            │  code / name      │
            │  sourceType       │  品牌标准 / 行业标准 / 供应商标准 / 项目补充
            │  brand / storeType │
            │  status → 草稿/生效/停用 │
            │                   │
            │  ┌─ clauses[] ──→ 条款（结构化文本）│
            │  ├─ files[] ────→ 参考文件        │
            │  └─ rules[] ──→ 判定规则（通过 clauses）│
            └──────────────────┘
                     │
                     │ 被引用
                     ▼
            ┌──────────────────┐
            │  TaskTemplate     │
            │  ────────────     │
            │  绑定执行标准 ID   │
            │  绑定验收标准 ID   │
            └──────────────────┘
                     │
                     │ 实例化时自动生成
                     ▼
            ┌──────────────────┐
            │ StandardSnapshot  │  ← 新增！不再是幽灵表
            │  ──────────────   │
            │  taskId           │
            │  standardId       │
            │  clauses (JSON)   │  条款快照
            │  rules (JSON)     │  规则快照
            │  snapshotVersion  │
            │  generatedAt      │
            └──────────────────┘
                     │
                     │ 驱动
                     ▼
            ┌──────────────────┐
            │  规则执行引擎      │  ← 新增！
            │  ────────────     │
            │  executeRules(    │
            │    snapshotId,    │
            │    inputs         │  实际测量值/判断值
            │  ) → results[]    │
            └──────────────────┘
```

### 设计原则

1. **标准是模板级别的绑定** —— 标准绑定在 TaskTemplate，而非单个任务。任务实例化时从模板继承标准引用并生成快照。
2. **快照是固化的** —— 任务一旦进入执行态，快照不再随标准变更而变化。标准管理员更新标准不影响在途任务。
3. **规则判定是独立的** —— 规则执行引擎不依赖任务状态，只依赖快照数据和用户输入。
4. **标准变更可追溯** —— 从标准 → 模板 → 任务 → 快照的引用链完整可查。

---

### 1. StandardSnapshot（核心新增）

#### 数据库模型

```prisma
model StandardSnapshot {
  id              Int      @id @default(autoincrement())
  taskId          Int      @map("task_id")
  standardId      Int      @map("standard_id")
  standardName    String   @map("standard_name")
  standardVersion String   @map("standard_version") // 快照时的标准版本号
  snapshotData    String   @map("snapshot_data")    // JSON：包含 clauses + rules + 元信息
  snapshotStatus  String   @default("active")       @map("snapshot_status") // active / superseded / archived
  generatedAt     DateTime @default(now())          @map("generated_at")
  generatedBy     String?  @map("generated_by")     // "system" | "user" | "agent"
  task            ProjectTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  standard        Standard    @relation(fields: [standardId], references: [id])

  @@unique([taskId, standardId])
  @@map("standard_snapshots")
}
```

#### snapshotData JSON 结构

```json
{
  "standard": {
    "code": "STD-0001",
    "name": "星巴克门店营建标准",
    "sourceType": "brand",
    "brand": "星巴克",
    "storeType": "标准店"
  },
  "clauses": [
    {
      "code": "C-001",
      "title": "地面平整度要求",
      "content": "地面平整度偏差不得超过 3mm/2m",
      "clauseType": "execution"
    },
    {
      "code": "C-002",
      "title": "地面平整度验收",
      "content": "使用 2m 靠尺测量，最大间隙不超过 3mm",
      "clauseType": "acceptance"
    }
  ],
  "rules": [
    {
      "clauseCode": "C-002",
      "judgeType": "range",
      "paramConfig": { "min": 0, "max": 3, "unit": "mm" },
      "description": "2m靠尺间隙 ≤ 3mm"
    }
  ],
  "snapshotVersion": 1,
  "standardUpdatedAt": "2026-05-01T00:00:00Z"
}
```

### 2. 标准绑定机制

#### 绑定层级

```
标准对象（Standard）
    ↓ 绑定
任务模板（TaskTemplate.executionStandardIds / acceptanceStandardIds）
    ↓ 实例化时自动
任务实例（ProjectTask.standardSnapshotId → StandardSnapshot）
    ↓ 供查询
执行清单 / 验收检查项
```

#### 绑定 API

| 端点                                                     | 方法   | 说明                 |
| -------------------------------------------------------- | ------ | -------------------- |
| `POST /api/task-templates/:templateId/bind-standard`     | POST   | 将标准绑定到任务模板 |
| `DELETE /api/task-templates/:templateId/unbind-standard` | DELETE | 解绑                 |
| `GET /api/task-templates/:templateId/standards`          | GET    | 查看模板已绑定标准   |

#### 快照生成时机

| 触发节点               | 说明                                         |
| ---------------------- | -------------------------------------------- |
| 任务模板实例化时       | 从模板创建任务时，自动为每个绑定标准生成快照 |
| 任务进入"执行中"状态前 | 确保快照已存在（兜底逻辑）                   |
| 手动触发               | `POST /api/tasks/:taskId/generate-snapshot`  |

#### 快照生成逻辑（后端服务层）

新建 `local-api/services/snapshotGenerator.ts`：

```typescript
interface SnapshotGenerator {
  // 从模板实例化任务时生成快照
  generateFromTemplate(taskId: number, templateId: number): Promise<StandardSnapshot[]>

  // 为单个任务手动生成快照
  generateForTask(taskId: number, standardId: number): Promise<StandardSnapshot>

  // 检查任务快照是否完整
  validateSnapshots(taskId: number): Promise<SnapshotValidation>

  // 对比快照与当前标准版本差异
  diffWithCurrent(snapshotId: number): Promise<SnapshotDiff>
}
```

### 3. 规则执行引擎（核心新增）

#### 引擎接口

新建 `local-api/services/ruleEngine.ts`：

```typescript
// 判定结果
interface RuleResult {
  ruleId: number
  clauseCode: string
  judgeType: 'boolean' | 'range' | 'enum'
  passed: boolean
  input: any // 实际输入值
  threshold: any // 阈值/期望值
  message: string // 人类可读的判定说明
}

// 引擎核心
interface RuleEngine {
  // 执行单条规则判定
  executeRule(rule: StandardRule, input: any): RuleResult

  // 批量执行快照中的所有规则
  executeSnapshot(snapshotId: number, inputs: Record<string, any>): Promise<RuleResult[]>

  // 执行特定条款类型的所有规则
  executeByClauseType(
    snapshotId: number,
    clauseType: string,
    inputs: Record<string, any>
  ): Promise<RuleResult[]>
}
```

#### 判定逻辑

```typescript
function executeRule(rule: StandardRule, input: any): RuleResult {
  const config = JSON.parse(rule.paramConfig || '{}')

  switch (rule.judgeType) {
    case 'boolean':
      // 布尔判定：input 是否为真
      return {
        passed: Boolean(input),
        threshold: true,
        message: input ? '通过' : '不通过：期望为真',
      }

    case 'range':
      // 范围判定：min ≤ input ≤ max
      const { min, max, unit } = config
      const value = Number(input)
      const passed = value >= min && value <= max
      return {
        passed,
        threshold: { min, max, unit },
        message: passed
          ? `通过：${value}${unit} 在 [${min}, ${max}]${unit} 范围内`
          : value < min
            ? `不通过：${value}${unit} < 下限 ${min}${unit}`
            : `不通过：${value}${unit} > 上限 ${max}${unit}`,
      }

    case 'enum':
      // 枚举判定：input 在允许值列表中
      const allowedValues = config.values || []
      const passed = allowedValues.includes(input)
      return {
        passed,
        threshold: allowedValues,
        message: passed
          ? `通过：值 "${input}" 在允许列表中`
          : `不通过：值 "${input}" 不在允许列表 [${allowedValues.join(', ')}] 中`,
      }

    default:
      return { passed: false, message: `未知判定类型: ${rule.judgeType}` }
  }
}
```

#### 引擎触发时机

| 场景       | 触发方式                                                   |
| ---------- | ---------------------------------------------------------- |
| 任务验收时 | 验收人员提交检查项时，引擎自动执行验收类规则的判定         |
| 手动检查   | 执行人员可在执行过程中手动运行执行类规则，检查是否符合标准 |
| 批量评审   | 对同一项目的多个任务批量执行规则判定                       |

#### 规则判定结果使用

```
规则判定结果 → 检查项自动生成 → 验收单填充 → 不通过项 → 整改任务
```

---

### 4. 后端架构调整

#### 新增文件

| 文件                                            | 职责                           |
| ----------------------------------------------- | ------------------------------ |
| `local-api/services/snapshotGenerator.ts`       | 快照生成、版本对比             |
| `local-api/services/ruleEngine.ts`              | 规则判定引擎                   |
| `local-api/controllers/standards.ts`（扩展）    | 新增文件管理端点、影响查询端点 |
| `local-api/controllers/snapshots.ts`（新建）    | 快照查询、生成、对比           |
| `local-api/controllers/taskBindings.ts`（新建） | 任务标准绑定/解绑              |
| `local-api/routes/snapshots.ts`（新建）         | 快照路由                       |
| `local-api/routes/taskBindings.ts`（新建）      | 绑定路由                       |

#### 新增端点总览

| 端点                                  | 方法   | 所属         | 说明                                                       |
| ------------------------------------- | ------ | ------------ | ---------------------------------------------------------- |
| `/standards/:id/files`                | GET    | standards    | 标准文件列表                                               |
| `/standards/:id/files`                | POST   | standards    | 上传标准文件                                               |
| `/standards/files/:fileId`            | DELETE | standards    | 删除标准文件                                               |
| `/standards/:id/impact`               | GET    | standards    | 查看标准引用影响范围（被哪些模板引用、被多少在途任务引用） |
| `/task-templates/:id/standards`       | GET    | taskBindings | 模板已绑定标准列表                                         |
| `/task-templates/:id/bind-standard`   | POST   | taskBindings | 模板绑定标准                                               |
| `/task-templates/:id/unbind-standard` | DELETE | taskBindings | 模板解绑标准                                               |
| `/tasks/:taskId/snapshots`            | GET    | snapshots    | 任务的所有标准快照                                         |
| `/tasks/:taskId/snapshots`            | POST   | snapshots    | 手动生成快照                                               |
| `/snapshots/:snapshotId`              | GET    | snapshots    | 快照详情（含 clauses + rules）                             |
| `/snapshots/:snapshotId/diff`         | GET    | snapshots    | 快照与当前标准版本差异                                     |
| `/snapshots/:snapshotId/check`        | POST   | snapshots    | 执行规则判定                                               |

#### 调整现有端点

| 端点                 | 变更                                                                   |
| -------------------- | ---------------------------------------------------------------------- |
| `GET /standards/:id` | 返回数据中增加 `_count: { clauses, rules, files, snapshots }` 引用计数 |
| `POST /standards`    | 创建时自动生成 version 字段（初始版本号）                              |
| `PUT /standards/:id` | 更新时自动递增 version，并检查是否有进行中任务的快照引用               |

---

### 5. 数据库模式变更

#### 新增表

```prisma
model StandardSnapshot {
  id              Int         @id @default(autoincrement())
  taskId          Int         @map("task_id")
  standardId      Int         @map("standard_id")
  standardName    String      @map("standard_name")
  standardVersion String      @map("standard_version")
  snapshotData    String      @map("snapshot_data") // JSON
  snapshotStatus  String      @default("active") @map("snapshot_status")
  generatedAt     DateTime    @default(now()) @map("generated_at")
  generatedBy     String?     @map("generated_by")
  task            ProjectTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  standard        Standard    @relation(fields: [standardId], references: [id])

  @@unique([taskId, standardId])
  @@map("standard_snapshots")
}
```

#### 修改现有表

**Standard 表新增字段：**

```prisma
model Standard {
  // ... 现有字段不变
  version   Int @default(1)  // 新增：标准版本号，每次编辑自增
}
```

**TaskTemplate 表新增字段（如果已存在）：**

```prisma
model TaskTemplate {
  // ... 现有字段不变
  executionStandardIds  String? @map("execution_standard_ids")  // JSON 数组：绑定的执行标准 ID
  acceptanceStandardIds String? @map("acceptance_standard_ids") // JSON 数组：绑定的验收标准 ID
}
```

**ProjectTask 表调整 standardSnapshotId：**

当前 `standardSnapshotId String?` → 改为 `standardSnapshotId Int?`，并添加外键指向 StandardSnapshot。

---

### 6. 前端页面与功能

#### 6.1 StandardDetailPage — 重构

| 功能区域     | 内容                                          | 实现方式                                 |
| ------------ | --------------------------------------------- | ---------------------------------------- |
| 页面框架     | 使用 PageLayout 替代原始 div                  | 复制 StandardListPage 的 PageLayout 模式 |
| Tab 结构     | 4 个标签页：基本信息 / 条款 / 规则 / 文件     | shadcn Tabs 组件                         |
| 基本信息 Tab | 标准信息卡片 + 编辑按钮                       | Card + Badge 状态标签                    |
| 条款 Tab     | 条款列表 + 新增/编辑/删除 Dialog              | StandardClauseTable 组件                 |
| 规则 Tab     | 规则列表（按条款分组）+ 新增/编辑/删除 Dialog | StandardRuleTable 组件                   |
| 文件 Tab     | 文件列表 + 上传/删除                          | StandardFileList 组件                    |
| 加载态       | Skeleton                                      | 每个 Tab 独立加载                        |
| 返回导航     | 保留现有返回按钮                              |                                          |

**Tab 结构原型：**

```
┌──────────────────────────────────────────────────────────┐
│  ← 返回    STD-0001  星巴克门店营建标准   [生效] [编辑]     │
│  ┌─────────┬────────┬────────┬────────┐                   │
│  │ 基本信息  │ 条款(12)│ 规则(8) │ 文件(3) │                   │
│  └─────────┴────────┴────────┴────────┘                   │
│                                                            │
│  ┌─ 条款列表 ──────────────────────────────────────────┐  │
│  │ 编号    │ 条款标题         │ 类型     │ 操作          │  │
│  │ C-001   │ 地面平整度要求    │ 执行标准  │ [编辑] [规则]  │  │
│  │ C-002   │ 地面平整度验收    │ 验收标准  │ [编辑] [规则]  │  │
│  │ ...                                                   │  │
│  └────────────────────────────────────────────────────┘  │
│  [+ 新增条款]                                              │
└──────────────────────────────────────────────────────────┘
```

#### 6.2 StandardListPage — 优化

| 变更项     | 说明                                 |
| ---------- | ------------------------------------ |
| 搜索框     | 抽象为 SearchInput 组件              |
| 筛选排序栏 | 抽象为 FilterSortToolbar 组件        |
| 标准表格   | 抽象为 StandardTable 组件            |
| 加载态     | 替换为 Skeleton                      |
| 删除确认   | 统一 AlertDialog                     |
| 分页       | TaskPaginationBar 提升到 components/ |

#### 6.3 新增组件

| 文件路径                                                      | 组件                 | 说明                                   |
| ------------------------------------------------------------- | -------------------- | -------------------------------------- |
| `src-next/pages/standards/components/StandardTable.tsx`       | StandardTable        | 标准列表表格（从 ListPage 提取）       |
| `src-next/pages/standards/components/StandardClauseTable.tsx` | StandardClauseTable  | 条款列表表格（从 DetailPage 提取）     |
| `src-next/pages/standards/components/StandardRuleTable.tsx`   | StandardRuleTable    | 规则列表表格（新增）                   |
| `src-next/pages/standards/components/StandardFileList.tsx`    | StandardFileList     | 文件列表 + 上传（新增）                |
| `src-next/pages/standards/components/RuleDialog.tsx`          | RuleDialog           | 规则新增/编辑弹窗（新增）              |
| `src-next/pages/standards/components/BindStandardDialog.tsx`  | BindStandardDialog   | 任务模板绑定标准选择器（新增）         |
| `src-next/pages/tasks/components/TaskStandardSnapshot.tsx`    | TaskStandardSnapshot | 任务标准快照展示（增强 TaskStandards） |
| `src-next/components/search-input.tsx`                        | SearchInput          | 通用搜索输入框（抽象提升）             |
| `src-next/components/filter-sort-toolbar.tsx`                 | FilterSortToolbar    | 通用筛选排序工具栏（抽象提升）         |
| `src-next/components/pagination-bar.tsx`                      | PaginationBar        | 通用分页（从 tasks/ 提升）             |

#### 6.4 TaskStandards 组件 — 增强

| 当前能力       | 增强后                                  |
| -------------- | --------------------------------------- |
| 只展示绑定状态 | 支持绑定/解绑标准操作                   |
| 条款列表为只读 | 从关联快照读取完整的条款和规则数据      |
| 无规则判定     | 支持手动触发规则检查（针对验收类规则）  |
| 无从属关系     | 显示"此标准来自模板 → 模板名称"的追溯链 |

#### 6.5 标准绑定到模板 — 新增交互

```
任务模板编辑页
  ┌────────────────────────────────────────────┐
  │ 执行标准                                     │
  │ ┌──────────────────────────────────┐        │
  │ │ STD-0001  星巴克门店营建标准  [×] │        │
  │ │ STD-0005  地面工程执行标准    [×] │        │
  │ │ [+ 绑定执行标准]                  │        │
  │ └──────────────────────────────────┘        │
  │                                             │
  │ 验收标准                                     │
  │ ┌──────────────────────────────────┐        │
  │ │ STD-0002  星巴克验收标准      [×] │        │
  │ │ [+ 绑定验收标准]                  │        │
  │ └──────────────────────────────────┘        │
  └────────────────────────────────────────────┘
```

点击"+ 绑定"弹出 BindStandardDialog，展示可选标准列表（支持搜索和来源类型筛选），勾选后确认绑定。

#### 6.6 新增路由

| 路由     | 页面                | 说明                                                 |
| -------- | ------------------- | ---------------------------------------------------- |
| 现有     | StandardListPage    | 标准列表（已有）                                     |
| 现有     | StandardDetailPage  | 标准详情（已有，需重构）                             |
| **新增** | StandardsBindPage   | 标准与模板绑定管理（可选独立页，也可嵌入模板编辑页） |
| **新增** | StandardsImpactPage | 标准影响范围查询（可选）                             |

---

### 7. 组件复用方案

#### 7.1 跨模块提升（P1 优先级）

| 当前位置                                                | 组件              | 提升到                                   |
| ------------------------------------------------------- | ----------------- | ---------------------------------------- |
| `src-next/pages/tasks/components/TaskPaginationBar.tsx` | TaskPaginationBar | `src-next/components/pagination-bar.tsx` |

提升后需要更新所有引用点（StandardListPage、TaskListPage 等）。

#### 7.2 新抽象组件（P2 优先级）

| 来源                                  | 抽象为            | 放置位置                                      |
| ------------------------------------- | ----------------- | --------------------------------------------- |
| StandardListPage 的 InputGroup        | SearchInput       | `src-next/components/search-input.tsx`        |
| StandardListPage 的 DropdownMenu 区域 | FilterSortToolbar | `src-next/components/filter-sort-toolbar.tsx` |

标准管理和项目管理列表页共享这些组件。

#### 7.3 兼容性不变组件

以下组件保持现有实现不变，标准管理直接复用：

- PageLayout（当前 StandardDetailPage 未使用，需加上）
- SectionCards
- DropdownMenu（筛选/排序菜单容器）
- Badge + STATUS_STYLE 常量
- Card（信息展示）
- Dialog（CRUD 弹窗）
- Skeleton（加载态）
- AlertDialog（删除确认）

---

### 8. 迁移策略

#### 阶段一：补实体（Snapshot + 文件）

```
1. 数据库新增 StandardSnapshot 表
2. 数据库 Standard.version 字段
3. 后端新增 snapshotGenerator.ts + ruleEngine.ts（不影响现有功能）
4. 后端扩展标准文件管理端点
5. 前端重构 StandardDetailPage（PageLayout + Tabs + Skeleton）
6. 前端新增 StandardFileList 组件
```

#### 阶段二：补规则链路

```
1. 后端新增快照和规则判定端点
2. 前端新增 StandardRuleTable + RuleDialog
3. 前端新增 TaskStandardSnapshot 组件
4. 任务验收页接入规则判定引擎
```

#### 阶段三：补绑定链路

```
1. 模板新增 executionStandardIds / acceptanceStandardIds 字段
2. 后端新增模板标准绑定/解绑端点
3. 前端新增 BindStandardDialog + 模板编辑页接入
4. 任务实例化时自动触发快照生成
```

#### 阶段四：组件优化

```
1. TaskPaginationBar 提升到 components/
2. SearchInput + FilterSortToolbar 抽象
3. StandardTable + StandardClauseTable 提取
4. 全量 Skeleton 替换纯文本加载态
```

---

## Tech Stack

| 层次     | 方案                          | 备注                                      |
| -------- | ----------------------------- | ----------------------------------------- |
| 数据库   | SQLite + Prisma               | 保持现有技术栈                            |
| 后端     | Express + TypeScript          | 新增 snapshotGenerator、ruleEngine 服务层 |
| 前端     | React + TypeScript + Tailwind | shadcn/ui 组件                            |
| 状态管理 | React Context                 | 保持现有                                  |
| 测试     | Vitest + Playwright           | 新增规则引擎和快照生成专项测试            |

## Commands

```bash
# 开发
npm run dev              # 启动前后端开发服务器
npm run dev:api          # 仅启动后端 API
npm run dev:frontend     # 仅启动前端

# 测试
npm run test             # 运行单元测试
npm run test:e2e         # 运行 E2E 测试
npm run test:rule-engine # 新增：规则引擎专项测试
npm run test:snapshot    # 新增：快照生成专项测试

# 质量
npm run build            # 构建项目
npm run lint             # 代码检查
```

## Testing Strategy

| 层级     | 测试内容                                       | 框架               | 覆盖率目标    |
| -------- | ---------------------------------------------- | ------------------ | ------------- |
| 单元测试 | 规则引擎三种判定类型（boolean/range/enum）     | Vitest             | 100% 分支覆盖 |
| 单元测试 | 快照生成逻辑（含数据序列化正确性）             | Vitest             | 100% 分支覆盖 |
| 单元测试 | 快照与当前版本差异对比                         | Vitest             | 核心路径      |
| API 测试 | 标准 CRUD 端点（回归）                         | Vitest + supertest | 核心路径      |
| API 测试 | 文件管理端点                                   | Vitest + supertest | 核心路径      |
| API 测试 | 模板标准绑定/解绑                              | Vitest + supertest | 核心路径      |
| API 测试 | 快照生成 + 查询 + 规则判定                     | Vitest + supertest | 核心路径      |
| 组件测试 | StandardTable, ClauseTable, RuleTable          | RTL                | 基本覆盖      |
| 组件测试 | BindStandardDialog                             | RTL                | 基本覆盖      |
| E2E 测试 | 创建标准→绑定模板→实例化任务→快照生成→规则判定 | Playwright         | 1 场景        |

### 测试用例示例（规则引擎）

```typescript
describe('RuleEngine - boolean 判定', () => {
  it('true 输入 → 通过', () => {
    const rule = { judgeType: 'boolean', paramConfig: '{}' }
    const result = executeRule(rule, true)
    expect(result.passed).toBe(true)
  })

  it('false 输入 → 不通过', () => {
    const rule = { judgeType: 'boolean', paramConfig: '{}' }
    const result = executeRule(rule, false)
    expect(result.passed).toBe(false)
  })
})

describe('RuleEngine - range 判定', () => {
  it('值在范围内 → 通过', () => {
    const rule = { judgeType: 'range', paramConfig: '{"min":0,"max":3,"unit":"mm"}' }
    const result = executeRule(rule, 2)
    expect(result.passed).toBe(true)
  })

  it('值低于下限 → 不通过', () => {
    const rule = { judgeType: 'range', paramConfig: '{"min":0,"max":3,"unit":"mm"}' }
    const result = executeRule(rule, -1)
    expect(result.passed).toBe(false)
  })

  it('值高于上限 → 不通过', () => {
    const rule = { judgeType: 'range', paramConfig: '{"min":0,"max":3,"unit":"mm"}' }
    const result = executeRule(rule, 5)
    expect(result.passed).toBe(false)
  })
})

describe('RuleEngine - enum 判定', () => {
  it('值在允许列表中 → 通过', () => {
    const rule = { judgeType: 'enum', paramConfig: '{"values":["A","B","C"]}' }
    const result = executeRule(rule, 'B')
    expect(result.passed).toBe(true)
  })

  it('值不在允许列表中 → 不通过', () => {
    const rule = { judgeType: 'enum', paramConfig: '{"values":["A","B","C"]}' }
    const result = executeRule(rule, 'D')
    expect(result.passed).toBe(false)
  })
})
```

## Boundaries

### Always

- 标准快照一旦生成，内容不可修改（只读）
- 规则引擎的每种判定类型必须有单元测试
- 标准变更后必须检查是否有进行中任务的快照引用，有则提示影响范围
- 前端组件优先复用已有模式，不重复造轮子
- 加载态必须使用 Skeleton，禁止纯文本"加载中..."

### Ask First

- 修改 Prisma schema（新增/修改模型）
- 修改现有 API 端点签名
- 引入新的判定类型（boolean/range/enum 之外的）
- 调整标准绑定层级关系
- 改变快照生成时机

### Never

- 允许用户手动编辑已生成的快照内容
- 在标准变更时静默覆盖在途任务的快照
- 删除已被快照引用的标准（只能停用）
- 在前端直接计算规则判定结果（必须通过后端规则引擎）
- 跳过快照生成直接开始任务执行

---

## Open Questions（待用户决策）

以下问题需要用户确认：

1. **快照粒度：按标准还是按条款？**
   - 当前设计：一个任务对一个标准生成一条快照
   - 备选：一个任务对一个标准的多条条款各自生成快照（更细粒度）
   - 建议：按标准（简化，后续可按需细化）

2. **规则引擎的执行范围：验收时自动执行 vs 手动触发？**
   - 当前设计：验收人员提交检查项时自动执行验收类规则
   - 备选：始终手动触发
   - 建议：验收类自动执行，执行类手动触发

3. **标准文件存储：本地文件系统 vs 数据库 Blob？**
   - 当前 StandardFile.content 是 String? 但实际应存文件
   - 建议：V1 阶段使用本地文件系统 + 路径存储，V2 切换云存储

4. **StandardSnapshot.snapshotData 用 JSON 字符串 vs 关联表？**
   - 当前设计：JSON 字符串（简单、不可变）
   - 备选：快照的 clauses 和 rules 各自存关联表
   - 建议：JSON 字符串（快照是一次性固化数据，不需要关系查询）

5. **规则冲突处理：一个任务绑定多个标准的同类规则冲突时如何处理？**
   - 场景：任务同时绑定了品牌标准和行业标准，两者
