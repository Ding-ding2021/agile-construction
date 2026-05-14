---
id: AI-STANDARD-MANAGEMENT
human_source: docs/02-architecture/standard-management-architecture.md
status: active
last_synced: 2026-05-14
title: AI 合约：标准管理"标准驱动执行"架构
---

# AI 合约：标准驱动执行架构

## 模块定位

将标准管理从"孤立的资料库"重构为"标准驱动任务生成、执行指导和验收判断的核心引擎"

## 核心实体

| 实体                | 字段                                                                                                                                                                                 | 状态机                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Standard            | id, code(unique), name, brand?, storeType?, sourceType(brand/industry/supplier/project), status(active/inactive/draft), isDeleted                                                    | 无状态机，仅 active/inactive/draft 三态 |
| StandardFile        | id, standardId, fileName, fileVersion, content?                                                                                                                                      | 无状态机，依附 Standard                 |
| StandardClause      | id, standardId, code, title, content?, clauseType(execution/acceptance/general), sortOrder                                                                                           | 无独立状态，随 Standard 走              |
| StandardRule        | id, clauseId, judgeType(boolean/range/enum), paramConfig?(JSON), description?                                                                                                        | 无独立状态，随 Clause 走                |
| StandardSnapshot    | id, standardId, clauseId?, ruleId?, taskId, snapshotVersion, standardName, clauseCode, clauseTitle, clauseContent?, ruleJudgeType?, ruleParamConfig?(JSON), generatedAt, generatedBy | 只读实体，生成后不可修改                |
| TaskStandardBinding | id, taskId, clauseId, ruleId?, bindingType(execution/acceptance), boundAt, boundBy                                                                                                   | unique(taskId, clauseId, bindingType)   |

## 三层结构

```
Standard（标准）
  ├── StandardFile[]（文件）
  ├── StandardClause[]（条款）
  │     └── StandardRule[]（规则）
  └── StandardSnapshot[]（快照）
```

## 核心链路（4 步）

1. **标准库管理** → 标准 CRUD → 条款 CRUD → 规则 CRUD（已有，增加规则 UI + 文件管理 UI）
2. **标准绑定** → 通过 TaskStandardBinding 将条款/规则绑定到任务（全新）
3. **快照生成** → 任务进入"执行中"时自动冻住当时的标准版本（全新）
4. **规则执行** → 验收时基于快照执行 StandardRule 判定（全新）

## 规则执行引擎

| judgeType | 执行逻辑                           | paramConfig 示例                     |
| --------- | ---------------------------------- | ------------------------------------ |
| boolean   | 传入值 true → 通过，false → 不通过 | null（无需配置）                     |
| range     | 数值在 [min, max] 区间 → 通过      | `{"max":3,"unit":"mm"}`              |
| enum      | 值在 allowed 列表中 → 通过         | `{"allowed":["涂料","壁纸","瓷砖"]}` |

返回值：

```typescript
interface RuleResult {
  passed: boolean
  actualValue?: string | number | boolean
  expectedValue: string
  message: string
}
```

## API 骨架

### 保留（原有 12 个端点不变）

| 方法   | 路径                                           | 说明               |
| ------ | ---------------------------------------------- | ------------------ |
| GET    | /standards                                     | 标准列表           |
| GET    | /standards/:id                                 | 标准详情           |
| POST   | /standards                                     | 创建标准           |
| PUT    | /standards/:id                                 | 更新标准           |
| DELETE | /standards/:id                                 | 删除标准（软删除） |
| GET    | /standards/:id/clauses                         | 标准条款列表       |
| POST   | /standards/:id/clauses                         | 创建条款           |
| PUT    | /standards/:id/clauses/:clauseId               | 更新条款           |
| DELETE | /standards/:id/clauses/:clauseId               | 删除条款           |
| GET    | /standards/:id/clauses/:clauseId/rules         | 规则列表           |
| POST   | /standards/:id/clauses/:clauseId/rules         | 创建规则           |
| PUT    | /standards/:id/clauses/:clauseId/rules/:ruleId | 更新规则           |
| DELETE | /standards/:id/clauses/:clauseId/rules/:ruleId | 删除规则           |

### 新增（7 个端点）

| 方法   | 路径                            | 说明                           |
| ------ | ------------------------------- | ------------------------------ |
| POST   | /tasks/:id/standards/bind       | 任务绑定标准（批量 clauseIds） |
| DELETE | /tasks/:id/standards/:bindingId | 任务解绑标准                   |
| GET    | /tasks/:id/standards            | 查看任务已绑定标准             |
| GET    | /tasks/:id/snapshots            | 查看任务所有快照               |
| POST   | /tasks/:id/snapshots/generate   | 手动触发快照生成               |
| POST   | /tasks/:id/acceptance/validate  | 执行验收规则判定               |
| GET    | /standards/:id/bindings         | 查看标准被哪些任务引用         |

## 业务规则

1. 快照一旦生成不可修改（审计依据）
2. 快照生成后不可更改标准绑定（锁定时机：生成快照时）
3. 验收判定必须基于快照中的标准版本，不能直接读当前标准
4. 验收判定采用严格模式：全部绑定规则通过才算验收通过
5. 规则执行引擎的每种 judgeType 必须有 100% 单元测试覆盖
6. 绑定/解绑操作必须记录操作人和时间
7. 删除已生成快照的标准条款 → 改为停用，不做物理删除
8. 未绑定验收标准的任务，验收时显示"未绑定验收标准，无法判定"

## 依赖模块

| 模块     | 引用位置                               | 依赖内容                                         |
| -------- | -------------------------------------- | ------------------------------------------------ |
| 任务中心 | TaskStandardBinding / StandardSnapshot | 任务状态 → 触发快照生成；任务详情 → 标准绑定面板 |
| 验收整改 | POST /tasks/:id/acceptance/validate    | 验收时读快照 → 执行规则判定                      |
| 项目管理 | 验收维度                               | 验收不通过 → 整改中 → 健康度降级                 |

## UI 组件

### 标准管理模块内

| 组件                | 位置                                 | 说明                                                        |
| ------------------- | ------------------------------------ | ----------------------------------------------------------- |
| StandardDetailTabs  | src-next/pages/standards/components/ | 标准详情标签页容器（基本信息/条款/规则/文件/绑定历史/快照） |
| RuleEditDialog      | src-next/pages/standards/components/ | 规则编辑器（boolean/range/enum 三类输入）                   |
| StandardFileUpload  | src-next/pages/standards/components/ | 标准文件元信息编辑器（名称、版本），V1 无实际文件上传       |
| BindingHistoryTable | src-next/pages/standards/components/ | 绑定历史列表                                                |

### 跨模块组件（任务中心内）

| 组件                   | 位置                                             | 说明                               |
| ---------------------- | ------------------------------------------------ | ---------------------------------- |
| StandardBindingPanel   | src-next/pages/tasks/components/StandardBinding/ | 任务标准绑定面板（搜索→选择→绑定） |
| StandardClauseSelector | src-next/pages/tasks/components/StandardBinding/ | 标准条款选择器（搜索+多选）        |
| StandardSnapshotViewer | src-next/pages/tasks/components/StandardBinding/ | 快照查看器（只读）                 |

### 验收模块内

| 组件            | 位置                                  | 说明                 |
| --------------- | ------------------------------------- | -------------------- |
| RuleJudgeResult | src-next/pages/acceptance/components/ | 验收规则判定结果展示 |

### 复用组件

| 复用模式             | 来源                         | 应用到                               |
| -------------------- | ---------------------------- | ------------------------------------ |
| PageLayout           | components/page-layout.tsx   | StandardDetailPage（当前缺失）       |
| SectionCards         | components/section-cards.tsx | 已用，保持不变                       |
| Skeleton             | shadcn/ui                    | StandardListPage, StandardDetailPage |
| Card                 | shadcn/ui                    | StandardDetailPage 基本信息标签      |
| Badge + STATUS_STYLE | types/standard.ts            | 扩展应用到快照状态、绑定状态         |
| Dialog CRUD 表单     | 项目/任务模块                | 标准条款/规则 CRUD                   |
| TaskPaginationBar    | pages/tasks/components/      | 提议提升到 components/ 跨模块共用    |

## 迁移策略

1. **阶段一（基础设施）**：创建 StandardSnapshot + TaskStandardBinding 表 → 新建 3 个 service 文件 → 新增 7 个 API 端点
2. **阶段二（前端重构）**：StandardDetailPage 引入 PageLayout + 标签页 → 规则/文件/绑定历史/快照标签页 → StandardListPage 增强
3. **阶段三（链路打通）**：StandardBindingPanel → 任务→执行中触发快照 → 验收时读快照+执行规则 → RuleJudgeResult 接入

## 测试要求

| 层级     | 覆盖目标                                          | 框架               |
| -------- | ------------------------------------------------- | ------------------ |
| 单元测试 | ruleEngine 三种 judgeType → 100% 分支覆盖         | Vitest             |
| 单元测试 | snapshotService 快照生成与不可变性 → 100%         | Vitest             |
| 单元测试 | standardBindingService 绑定/解绑/守卫 → 核心路径  | Vitest             |
| API 测试 | 标准绑定/解绑 → 核心路径                          | Vitest + supertest |
| API 测试 | 快照自动生成（任务→执行中触发）→ 核心路径         | Vitest + supertest |
| API 测试 | 验收规则判定 → 核心路径                           | Vitest + supertest |
| 组件测试 | StandardBindingPanel + RuleJudgeResult → 基本覆盖 | RTL                |
| E2E      | 标准→绑定→执行→快照→验收 全链路 → 1 场景          | Playwright         |

## 质量门禁

- 规则引擎每种 judgeType 必须有单元测试
- 快照生成的不可变性必须验证（修改原标准后快照内容不变）
- 绑定守卫必须验证（执行中任务拒绝解绑/重新绑定）
- 新增 Prisma 模型必须运行 migration 并验证无破坏
