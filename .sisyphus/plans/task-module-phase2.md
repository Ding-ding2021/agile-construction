# 任务模块 Phase 2 开发计划

## TL;DR

> **Summary**: 任务模块从 mock 演示层升级为真实数据驱动的执行中枢，打通「DB → API → Repository → UI」完整链路，补齐 PRD P0+P1 字段，实现真实任务树层级和标准绑定
> **Deliverables**: DB 迁移（10→30+列）、TaskItem 字段补齐（20→35+）、API 实体 CRUD 完整、ProjectScopeTab 任务视图、标准绑定闭环
> **Effort**: Large（~8 个任务，2-3 波次）
> **Parallel**: YES — 3 波次
> **Critical Path**: W1-DB 迁移 → W2-类型+数据层 → W3-UI+集成

## Context

### Original Request

基于任务中心 PRD v1.01 和当前代码现状（mock 数据驱动），将任务模块从演示层升级为真实执行中枢。

### Interview Summary

- 字段策略：P0+P1 分批，P0 先跑通基础 CRUD，P1 补齐业务字段
- 任务入口：保留全局任务管理页 + 项目详情页 PMBOK scope 标签新增项目内任务视图（复用任务组件）
- 项目内任务展示：复用现有任务组件，后续根据需求文档调整
- 开发方向：从下往上（任务模型 → 标准 → 模板 → 项目），以任务为原子结构

### 业务模型决策（Q1-Q6）

| #   | 问题           | 决策                                                                                            |
| --- | -------------- | ----------------------------------------------------------------------------------------------- |
| Q1  | Personnel 模型 | 最小化表（id/name/role/department/status/email/phone/isExternal/skills）+ 独立 Permission 表    |
| Q2  | WorkPackage    | 独立实体，入任务树（project_root → work_package → task），新增 plannedWorkHours/actualWorkHours |
| Q3  | 映射策略       | 前端保留展示字段 + 关联 ID，Repository 做双向映射                                               |
| Q4  | 标准绑定       | 条款级 + 对象抽象层，4 个表（StandardFile/StandardClause/StandardObject/ClauseObjectBinding）   |
| Q5  | 状态机         | 10 状态（草稿/待分配/待执行/执行中/已暂停/待提交/待验收/不通过/已完成/已关闭），终态可重开      |
| Q6  | 审计字段       | 后端自动填充，Phase 2 存 operatorName 字符串，后续接入认证                                      |

### 当前现状（诊断结果）

- ✅ UI 骨架完整（TaskManagementPage + 4 视图模式 + 统计卡片 + 状态机）
- ✅ TaskTemplate / ProjectTemplate 类型对齐 PRD 契约
- ✅ 模板实例化引擎已实现（循环检测、依赖校验、状态验证）
- ❌ 全部数据来自 `mockTasks`（15 条硬编码）
- 🟡 DB 已有 `parentId Int?`，但前端只有 `parentPath` 字符串，无 `parentTaskId`
- 🟡 DB 已有 `projectId Int` FK，但前端使用 `projectName` 字符串展示
- ❌ `assignee` 是 String 姓名，无 `assigneeId` 人员关联
- ❌ DB 仅 10 列
- ❌ 无标准绑定真实数据

## Work Objectives

### Core Objective

打通任务模块真实数据链路，实现 TaskItem 类型与 PRD P0+P1 字段对齐，DB 持久化完整，API CRUD 可用，项目内任务视图可用。

### Deliverables

1. **DB 迁移**：
   - `ProjectTask` 表从 11 列扩展到 35+ 列（含工时/标准绑定/审计字段）
   - 新建 `Personnel` 表（含 isExternal/skills）+ `Permission` 表
   - 新建 `WorkPackage` 表（独立实体，含 plannedWorkHours/actualWorkHours）
   - 新建标准库 4 表：`StandardFile`/`StandardClause`/`StandardObject`/`ClauseObjectBinding`
2. **TaskItem 字段补齐**：P0 + P1 + 工时 + 标准绑定字段，共 40+ 字段
3. **parentTaskId 真树化**：TaskItem 增加 `parentTaskId`，Repository 负责 `parentTaskId`(string) ↔ `parentId`(int) 映射
4. **状态机升级**：9 状态 → 10 状态（新增草稿/已暂停，替换待创建）
5. **API CRUD 完善**：后端 task handler 读写全字段，serverAdapter + repository 对应更新
6. **mock→真实数据切换**：TaskManagementPage 从 mockTasks 切换到 API 数据源
7. **ProjectScopeTab 任务视图**：项目详情 PMBOK scope 标签下嵌入项目内任务视图
8. **标准绑定最小闭环**：条款级快照 + 对象抽象层，模板实例化时生成
9. **lint + build 通过**

### Definition of Done

- [ ] `prisma/schema.prisma` ProjectTask 表 ≥ 30 列
- [ ] `grep "mockTasks" src/components/task/TaskManagementPage.tsx` 返回 0
- [ ] `grep "parentTaskId" src/components/task/taskManagement.types.ts` 存在
- [ ] `grep "project_id" src/components/task/taskManagement.types.ts` 存在（或 projectId）
- [ ] `grep "node_level_type" src/components/task/taskManagement.types.ts` 存在
- [ ] `grep "priority" src/components/task/taskManagement.types.ts` 存在
- [ ] ProjectDetailPage scope 标签下可展示项目内任务列表
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 0 errors
- [ ] `POST /api/projects/:code/tasks` 可写入完整 TaskItem 字段

### Must Have

- P0 字段全部补齐（task_id, project_id, status, assignee_id, planned_start_at, planned_end_at, created_by, created_at）
- parentTaskId 真实层级
- mock→API 切换
- ProjectScopeTab 基本可用

### Must NOT Have

- **禁止**修改 `src/domain/` 的状态机核心流转规则（ guards 逻辑可扩展，但不删除现有规则）
- **禁止**破坏现有 TaskManagementPage 的 UI 结构
- **禁止**删除 mockTasks 文件（保留用于测试参考）
- **禁止**引入新的 npm 依赖
- **禁止**在 Phase 2 做 Agent 能力（留给 Phase 5）
- **禁止**做自定义字段系统（PRD Section 10，留给后续）
- **禁止**构建标准结构化拆解 UI（AI/人工拆解标准文件是独立模块，Phase 2 只支持手工录入）
- **禁止**构建用户认证系统（Phase 2 audit 字段存 operatorName 字符串，认证留后续）

## Verification Strategy

> ZERO HUMAN INTERVENTION — all verification is agent-executed.

- Test decision: **tests-after** — 每波次完成后做 build 验证 + API 测试
- QA policy: Every task has agent-executed scenarios
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy

### Wave 0 — 文档一致性更新（前置，必须首先完成）

**目标**：将业务模型决策同步到 PRD/状态机设计/ER 图，确保文档基线与代码实现一致。

- D1: 更新 `task-center-prd.md`
  - 状态 "待创建" → "草稿"
  - 新增 "已暂停" 状态
  - `node_level_type` 从 4 层改为 3 层（去掉 `subtask`，stage 不入树）
  - 增加 Personnel 最小化模型说明
  - 增加 WorkPackage 独立实体说明
  - 标准绑定章节增加对象抽象层（任务→对象→条款）
- D2: 更新 `state-machine-design.md`
  - 状态列表更新（9 → 10 状态）
  - 状态流转图更新（草稿→待分配，执行中↔已暂停，终态可重开）
  - 阻塞与状态解耦说明
- D3: 更新 `task-center-erd.md`
  - 增加 Personnel 实体
  - 增加 Permission 实体
  - 增加 WorkPackage 实体
  - 增加标准库 4 实体（StandardFile/Clause/Object/Binding）
  - TASK 实体字段扩展（工时/标准绑定/审计字段）

### Wave 1 (数据层，串行，依赖 Wave 0)：

- W1-T1: DB Schema 迁移（Prisma ProjectTask 扩展 + migration）
- W1-T2: API 层更新（后端 handler 读写全字段）

**Wave 2** (类型层，依赖 W1)：

- W2-T1: TaskItem 字段补齐（P0+P1）
- W2-T2: Repository + serverAdapter 更新

**Wave 3** (UI 层，依赖 W2，可并行)：

- W3-T1: TaskManagementPage mock→API 切换
- W3-T2: TaskTreeView 真树化（parentTaskId）
- W3-T3: ProjectScopeTab 项目内任务视图
- W3-T4: 标准绑定最小闭环

### Dependency Matrix

| 任务                            | 依赖         | 阻塞                       |
| ------------------------------- | ------------ | -------------------------- |
| D1 更新 task-center-prd.md      | —            | D2, D3                     |
| D2 更新 state-machine-design.md | D1           | W1-T1                      |
| D3 更新 task-center-erd.md      | D1           | W1-T1                      |
| W1-T1 DB 迁移                   | D2, D3       | W1-T2, W2-T1               |
| W1-T2 API 更新                  | W1-T1        | W2-T2                      |
| W2-T1 TaskItem 字段补齐         | W1-T1        | W3-T1, W3-T2, W3-T3, W3-T4 |
| W2-T2 Repository 更新           | W1-T2, W2-T1 | W3-T1                      |
| W3-T1 mock→API                  | W2-T1, W2-T2 | —                          |
| W3-T2 真树化                    | W2-T1        | —                          |
| W3-T3 ProjectScopeTab           | W2-T1        | —                          |
| W3-T4 标准绑定                  | W2-T1        | —                          |

## TODOs

> Implementation + Test = ONE task. Never separate.

- [ ] D1. 更新 `task-center-prd.md` — 融入业务模型决策

  **What to do**:
  1. 读取 `docs/01-product/task-center-prd.md` Section 7（状态机设计）
  2. 状态更新：
     - `待创建` → `草稿`（模板预生成后等待 PM 确认激活）
     - 新增 `已暂停` 状态（执行中可暂停，可恢复或终止）
     - 终态（已完成/已关闭）增加可重开到 `待分配` 的说明
  3. `node_level_type` 层级调整：
     - 从 `project / work_package / task / subtask`（4 层）改为 `project_root / work_package / task`（3 层）
     - 说明：`subtask` 通过 `parentTaskId` 表达，不独立为层级；`stage` 作为项目生命周期属性，不入任务树
  4. 增加 Personnel 最小化模型说明（Section 新增或字段说明部分）
  5. 增加 WorkPackage 独立实体说明（区分于 `nodeLevelType = 'work_package'` 的任务节点）
  6. 标准绑定章节增加对象抽象层说明：
     - 任务绑定 `StandardObject`（工程对象）
     - 对象关联 `StandardClause`（条款）通过 `ClauseObjectBinding`
     - 形成"任务→对象→条款"的间接绑定链路
  7. 运行 `npm run build` 确保文档格式正确

  **Must NOT do**:
  - 禁止删除现有章节，只修改或新增
  - 禁止修改与 Phase 2 无关的内容

  **Recommended Agent Profile**:
  - Category: `writing`
  - Skills: []

  **Parallelization**: Can Parallel: NO | Wave 0 | Blocks: D2, D3

  **References**:
  - PRD: `docs/01-product/task-center-prd.md`
  - 业务模型决策：本计划 Context 部分 Q1-Q6

  **Acceptance Criteria**:
  - [ ] `grep "草稿" docs/01-product/task-center-prd.md` 存在（替代"待创建"）
  - [ ] `grep "已暂停" docs/01-product/task-center-prd.md` 存在
  - [ ] `grep "对象抽象层\|StandardObject" docs/01-product/task-center-prd.md` 存在
  - [ ] `npm run build` 0 errors

  **QA Scenarios**:

  ```
  Scenario: PRD contains new status
    Tool: Bash
    Steps: `grep -c "草稿\|已暂停" docs/01-product/task-center-prd.md`
    Expected: ≥ 3 occurrences
    Evidence: .sisyphus/evidence/task-d1-prd.txt
  ```

  **Commit**: YES | Message: `docs(task): update PRD with business model decisions - draft status, 3-level tree, object abstraction layer` | Files: `docs/01-product/task-center-prd.md`

---

- [ ] D2. 更新 `state-machine-design.md` — 状态机升级

  **What to do**:
  1. 读取 `docs/02-architecture/state-machine-design.md`
  2. 更新状态列表：9 状态 → 10 状态（草稿/待分配/待执行/执行中/已暂停/待提交/待验收/不通过/已完成/已关闭）
  3. 更新状态流转图（mermaid）：
     - 草稿 → 待分配
     - 执行中 ↔ 已暂停（双向）
     - 终态（已完成/已关闭）→ 待分配（重开）
  4. 增加阻塞与状态解耦说明：
     - `isBlocked: boolean` 是标记，不对应独立状态
     - 阻塞时状态停留在当前（如"执行中"但 isBlocked=true）
     - 增加 `blockedReason?: string` 字段说明
  5. 更新守卫条件章节，匹配新的状态流转
  6. 运行 `npm run build`

  **Must NOT do**:
  - 禁止删除 guards 核心逻辑，只更新状态名和流转路径

  **Recommended Agent Profile**:
  - Category: `writing`
  - Skills: []

  **Parallelization**: Can Parallel: NO | Wave 0 | Depends on: D1 | Blocks: W1-T1

  **References**:
  - State machine design: `docs/02-architecture/state-machine-design.md`
  - Guards implementation: `src/components/task/taskStateMachine.guards.ts`

  **Acceptance Criteria**:
  - [ ] `grep "10.*状态\|十个状态" docs/02-architecture/state-machine-design.md` 或状态列表包含 10 个状态
  - [ ] `grep "已暂停" docs/02-architecture/state-machine-design.md` 存在
  - [ ] 状态流转图 mermaid 语法正确（可渲染）

  **Commit**: YES | Message: `docs(task): update state machine design - 10 states, paused status, unblocked-state decoupling` | Files: `docs/02-architecture/state-machine-design.md`

---

- [ ] D3. 更新 `task-center-erd.md` — 实体关系图扩展

  **What to do**:
  1. 读取 `docs/01-product/task-center-erd.md` 当前 TASK 实体定义
  2. 扩展 TASK 实体字段（工时/标准绑定/审计）：
     - 增加 `plannedWorkHours`/`actualWorkHours`
     - 增加 `objectIds`（关联 StandardObject）
     - 增加 `standardSnapshot`（JSON）
     - 增加 `createdBy`/`createdAt`/`updatedBy`/`updatedAt`
  3. 新增 Personnel 实体：id/name/role/department/status/email/phone/isExternal/skills/createdAt/updatedAt
  4. 新增 Permission 实体：id/personnelId/resource/action/scope
  5. 新增 WorkPackage 实体：id/projectId/name/code/description/managerId/status/plannedWorkHours/actualWorkHours/budget/progress/timeFields/createdAt/updatedAt
  6. 新增标准库 4 实体：
     - StandardFile: id/code/name/version/category/status/createdAt
     - StandardClause: id/standardId/clauseNumber/title/content/type/createdAt
     - StandardObject: id/name/category/description/createdAt
     - ClauseObjectBinding: id/clauseId/objectId/role（关联表）
  7. 更新实体关系：
     - TASK.assigneeId → Personnel.id
     - TASK.workPackageId → WorkPackage.id
     - TASK.objectIds → StandardObject.id[]（多对多通过逻辑实现）
  8. 运行 `npm run build`

  **Must NOT do**:
  - 禁止删除现有 TASK 字段，只新增
  - 禁止修改其他模块实体（Project/Phase 等）

  **Recommended Agent Profile**:
  - Category: `writing`
  - Skills: []

  **Parallelization**: Can Parallel: NO | Wave 0 | Depends on: D1 | Blocks: W1-T1

  **References**:
  - ERD: `docs/01-product/task-center-erd.md`
  - Business model decisions: Q1-Q6 in this plan

  **Acceptance Criteria**:
  - [ ] `grep "Personnel\|WorkPackage\|StandardFile\|StandardClause\|StandardObject\|ClauseObjectBinding" docs/01-product/task-center-erd.md` 全部存在
  - [ ] TASK 实体字段数 ≥ 35 个（从现有 10+ 扩展）
  - [ ] mermaid ERD 图语法正确

  **Commit**: YES | Message: `docs(task): update ERD with new entities - Personnel, WorkPackage, Standard library (4 tables)` | Files: `docs/01-product/task-center-erd.md`

---

- [ ] W1-T1. DB Schema 迁移 — ProjectTask 表扩展

  **What to do**:
  1. 读取 `prisma/schema.prisma` 当前 ProjectTask 模型（11 列）
  2. 按业务模型决策和 PRD Section 5.1-5.7 补齐字段：
     - **已存在保留**：`projectId Int`（FK）、`parentId Int?`（层级）
     - **P0 升级**：`assignee String?` → **`assigneeId String?`**（关联 Personnel.id）
     - **P0 新增**：`createdAt DateTime @default(now())`、`updatedAt DateTime @updatedAt`、`createdBy String?`、`updatedBy String?`
     - **P1 业务字段**：`nodeLevelType String?`、`businessDomain String?`、`priority String?`、`requiredFlag Boolean @default(false)`、`milestoneFlag Boolean @default(false)`、`tags String?`（JSON array）、`blockedReason String?`、`closeReason String?`、`reopenCount Int @default(0)`
     - **工时字段**：`plannedWorkHours Int @default(0)`、`actualWorkHours Int @default(0)`
     - **标准绑定**：`standardSnapshot String?`（JSON: StandardBindingSnapshot）、`objectIds String?`（JSON: string[]）
     - **关联字段**：`workPackageId String?`（关联 WorkPackage.id）
     - **派生任务**：`derivedFromTaskId String?`、`isRectification Boolean @default(false)`、`rectificationReason String?`
  3. **新建 Personnel 表**：id/name/role/department/status/email/phone/isExternal/skills/createdAt/updatedAt
  4. **新建 Permission 表**：id/personnelId/resource/action/scope
  5. **新建 WorkPackage 表**：id/projectId/name/code/description/managerId/status/plannedWorkHours/actualWorkHours/budget/progress/plannedStartAt/plannedEndAt/actualStartAt/actualEndAt/createdAt/updatedAt
  6. **新建标准库 4 表**：
     - `StandardFile`：id/code/name/version/category/status/createdAt
     - `StandardClause`：id/standardId/clauseNumber/title/content/type/createdAt
     - `StandardObject`：id/name/category/description/createdAt
     - `ClauseObjectBinding`：id/clauseId/objectId/role
  7. 目标：ProjectTask ≥35 列，新建 7 个表
  8. 执行 `npx prisma migrate dev --name add_task_p0_p1_fields` 创建迁移
  9. 运行 `npm run build` 确认 Prisma client 生成无误

  **Must NOT do**:
  - 禁止删除现有列
  - 禁止修改 Project 或其他模型

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: schema-only change, single file
  - Skills: [] — Reason: no special skills needed

  **Parallelization**: Can Parallel: NO | Wave 1 | Depends on: D2, D3 | Blocks: W1-T2, W2-T1

  **References**:
  - Schema: `prisma/schema.prisma` — ProjectTask model
  - PRD: `docs/01-product/task-center-prd.md` Section 5.1-5.7 + Section 13.2 (P0/P1 fields)
  - ERD: `docs/01-product/task-center-erd.md` — TASK entity definition

  **Acceptance Criteria**:
  - [ ] `grep -c "String\|Int\|Boolean\|DateTime" prisma/schema.prisma` 在 ProjectTask 模型中 ≥ 30
  - [ ] `npx prisma migrate dev` 无错误
  - [ ] `npm run build` 0 errors

  **QA Scenarios**:

  ```
  Scenario: Migration runs successfully
    Tool: Bash
    Steps: `npx prisma migrate dev --name test_add_fields 2>&1`
    Expected: Migration created without errors
    Evidence: .sisyphus/evidence/task-w1-t1-migration.txt

  Scenario: Build passes with new schema
    Tool: Bash
    Steps: `npm run build`
    Expected: Exit code 0
    Evidence: .sisyphus/evidence/task-w1-t1-build.txt
  ```

  **Commit**: YES | Message: `feat(db): expand ProjectTask schema to 30+ columns for PRD P0+P1 fields` | Files: `prisma/schema.prisma`, generated migration files

---

- [ ] W1-T2. API 层更新 — 后端 CRUD 读写全字段

  **What to do**:
  1. 读取 `local-api/server.ts` 中 task handler（`handleTasks`, `handleTaskById`）
  2. 更新 POST handler：从请求 body 中读取全字段（含 Personnel 关联/WorkPackage 关联/工时/标准绑定），写入 better-sqlite3 INSERT
  3. 更新 PUT handler：支持更新新增字段（含工时/状态/标准绑定）
  4. 更新 GET handler：返回全字段（含关联表 join：Personnel.name as assigneeName, WorkPackage.name as workPackageName）
  5. 字段映射：`TaskItem` (camelCase) → DB (snake_case) 的 SQL 列名转换
  6. 新增 Personnel API：GET/POST/PUT `/api/personnel`
  7. 新增 WorkPackage API：GET/POST/PUT `/api/work-packages`
  8. 新增标准库 API：GET `/api/standards`（文件/条款/对象查询）
  9. 运行 `npm run build` 确认

  **Must NOT do**:
  - 禁止删除现有 API 端点
  - 禁止修改 deprecated 快照端点

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: API handler update, single file focus
  - Skills: []

  **Parallelization**: Can Parallel: NO | Wave 1 | Depends on: W1-T1 | Blocks: W2-T2

  **References**:
  - Backend: `local-api/server.ts` lines ~283-413 (task handlers)
  - Schema: `prisma/schema.prisma` (updated by W1-T1)
  - SQLite helper: `local-api/store/sqlite.ts`

  **Acceptance Criteria**:
  - [ ] `POST /api/projects/:code/tasks` 可写入 ≥ 20 个字段
  - [ ] `GET /api/projects/:code/tasks` 返回 ≥ 20 个字段
  - [ ] `PUT /api/projects/:code/tasks/:taskId` 可更新
  - [ ] `npm run build` 0 errors

  **QA Scenarios**:

  ```
  Scenario: Create task with full fields
    Tool: Bash
    Steps: `curl -X POST http://localhost:3100/api/projects/TEST/tasks -H "Content-Type: application/json" -d '{"name":"test","code":"TEST-001","status":"待分配","priority":"高","required_flag":true}'`
    Expected: 201 Created with all fields in response
    Evidence: .sisyphus/evidence/task-w1-t2-create.txt

  Scenario: GET returns all fields
    Tool: Bash
    Steps: `curl http://localhost:3100/api/projects/TEST/tasks | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d[0].keys()) if d else 0)"`
    Expected: ≥ 20 keys
    Evidence: .sisyphus/evidence/task-w1-t2-fields.txt
  ```

  **Commit**: YES | Message: `feat(api): task CRUD handlers read/write full PRD P0+P1 fields` | Files: `local-api/server.ts`

---

- [ ] W2-T1. TaskItem 类型字段补齐 — P0+P1 字段

  **What to do**:
  1. 读取 `src/components/task/taskManagement.types.ts` 当前 `TaskItem` 接口
  2. **状态机升级**：
     - `TaskStatus` 枚举：删除"待创建"，新增"草稿"和"已暂停"（共 10 状态）
     - 更新 `AVAILABLE_STATUS_TRANSITIONS` 映射（草稿→待分配，终态可重开）
     - 更新 guards：阻塞与状态解耦（isBlocked 标记，不对应独立状态）
     - 新增 predecessorIds: string[] 字段，替代 parentPath 推断依赖关系
  3. 添加/调整 **P0 字段**：
     - `taskId: string` — 任务主键（对应 DB `id`）
     - `projectId: string` — 关联项目 ID（从 `projectName` 升级，保留 projectName 展示字段）
     - `assigneeId?: string` — 执行人 ID（**升级**：替换 `owner` 字符串，关联 Personnel）
     - `assigneeName?: string` — 执行人姓名（展示字段，Repository 映射）
     - `nodeLevelType?: 'project_root' | 'work_package' | 'task'` — 节点层级（3 层，stage 不入树）
     - `businessDomain?: string` — 业务域
     - `createdBy?: string` / `createdAt?: string` / `updatedBy?: string` / `updatedAt?: string` — 审计字段
  4. 添加 **P1 字段**：
     - `priority?: '低' | '中' | '高' | '紧急'`
     - `requiredFlag: boolean`（默认 false）
     - `milestoneFlag: boolean`（默认 false）
     - `tags?: string[]`
     - `workPackageId?: string`
     - `plannedWorkHours?: number` / `actualWorkHours?: number` — 工时
     - `closeReason?: string` / `reopenCount: number`（默认 0）
  5. **标准绑定字段**：
     - `objectIds?: string[]` — 关联 StandardObject.id（替代直接条款绑定）
     - `standardSnapshot?: StandardBindingSnapshot` — 内联快照（JSON）
  6. **parentTaskId 与 parentPath**：
     - 增加 `parentTaskId?: string | null` — 前端统一用字符串 ID
     - **保留 `parentPath`** 作为只读展示字段，Repository 从 parentTaskId 链生成
     - Repository 负责 `parentTaskId` (string) ↔ `parentId` (int) 映射
  7. 更新 `TaskDetail` 接口对应扩展
  8. 更新 mock 数据生成器 `mockTasks` 适配新字段
  9. 更新 `buildTaskDetailFromItem` 映射新字段
  10. 运行 `npx tsc --noEmit` 确认无类型错误

  **Must NOT do**:
  - 禁止删除 `parentPath`（保留兼容）
  - 禁止删除现有字段
  - 禁止修改 `TaskStatus` 状态机枚举

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: type definitions + mechanical updates
  - Skills: []

  **Parallelization**: Can Parallel: NO | Wave 2 | Depends on: W1-T1 | Blocks: W3-T1, W3-T2, W3-T3, W3-T4

  **References**:
  - Types: `src/components/task/taskManagement.types.ts` TaskItem interface
  - PRD P0/P1: `docs/01-product/task-center-prd.md` Section 13.2
  - Mock data: `src/components/task/taskManagement.data.ts`
  - Template types: `src/components/standard/template-contract.types.ts` TaskTemplate

  **Acceptance Criteria**:
  - [ ] `grep "taskId\|projectId\|nodeLevelType\|priority\|requiredFlag\|milestoneFlag\|tags\|parentTaskId" src/components/task/taskManagement.types.ts` 全部存在
  - [ ] `npx tsc --noEmit` 无 TaskItem 相关类型错误
  - [ ] mockTasks 编译通过

  **QA Scenarios**:

  ```
  Scenario: TypeScript compiles with new fields
    Tool: Bash
    Steps: `npx tsc --noEmit --pretty 2>&1 | grep -i "taskManagement.types\|TaskItem" | grep -i "error"`
    Expected: No errors
    Evidence: .sisyphus/evidence/task-w2-t1-types.txt

  Scenario: mock data generates with new fields
    Tool: Bash
    Steps: `npx tsc --noEmit 2>&1 | grep "taskManagement.data"`
    Expected: No errors
    Evidence: .sisyphus/evidence/task-w2-t1-mock.txt
  ```

  **Commit**: YES | Message: `feat(task): add P0+P1 fields to TaskItem/TaskDetail types, add parentTaskId` | Files: `src/components/task/taskManagement.types.ts`, `src/components/task/taskManagement.data.ts`

---

- [ ] W2-T2. Repository + serverAdapter 更新

  **What to do**:
  1. 读取 `src/services/api/serverAdapter.ts` — 更新 `createProjectTask` 方法签名，接受完整 TaskItem 字段
  2. 更新 `getProjectTasks` 返回类型（含关联字段 join）
  3. 读取 `src/services/repositories/taskRepository.ts` — 更新 `createProjectTask` / `getProjectTasks` 传参
  4. 更新 `saveTasks` 将完整 TaskItem 写入 API（不再走 deprecated snapshot）
  5. 更新 `loadTasks` 从 API 读取全字段
  6. 实现 **双向映射逻辑**：
     - 读：API 返回 `parentId: number` → TaskItem `parentTaskId: string` + 生成 `parentPath` 面包屑
     - 读：API 返回 `assigneeId: string` → 查 Personnel 表填充 `assigneeName`
     - 读：API 返回 `workPackageId: string` → 查 WorkPackage 表填充 `workPackageName`
     - 读：API 返回 `objectIds: string[]` → 查 StandardObject/Clause 生成 `standardSnapshot`
     - 写：TaskItem `parentTaskId: string` → API `parentId: number`
     - 写：TaskItem `assigneeId`/`workPackageId`/`objectIds` → 直接传递
  7. 更新 `createRectificationTaskFromAcceptance` 适配新字段（派生任务字段）
  8. 运行 `npm run build`

  **Must NOT do**:
  - 禁止删除 deprecated 快照方法（保留兼容）
  - 禁止修改 `projectStore.ts`

  **Recommended Agent Profile**:
  - Category: `quick`
  - Skills: []

  **Parallelization**: Can Parallel: NO | Wave 2 | Depends on: W1-T2, W2-T1 | Blocks: W3-T1

  **References**:
  - Adapter: `src/services/api/serverAdapter.ts`
  - Repository: `src/services/repositories/taskRepository.ts`
  - Types: `src/components/task/taskManagement.types.ts` (updated by W2-T1)

  **Acceptance Criteria**:
  - [ ] `createProjectTask` 可传入完整 TaskItem
  - [ ] `getProjectTasks` 返回带新字段的 TaskItem[]
  - [ ] `npm run build` 0 errors

  **QA Scenarios**:

  ```
  Scenario: Repository round-trip
    Tool: Bash
    Steps: Verify createProjectTask → getProjectTasks preserves all fields
    Expected: All P0+P1 fields survive the round-trip
    Evidence: .sisyphus/evidence/task-w2-t2-repo.txt
  ```

  **Commit**: YES | Message: `feat(repo): update task repository/adapter for full TaskItem fields` | Files: `src/services/api/serverAdapter.ts`, `src/services/repositories/taskRepository.ts`

---

- [ ] W3-T1. TaskManagementPage mock→API 切换

  **What to do**:
  1. 读取 `src/components/task/TaskManagementPage.tsx`
  2. 将 `import { mockTasks }` 替换为从 repository 加载真实数据：
     - 使用 `useProjectStore` 或直接调用 `taskRepository.getProjectTasks(projectCode)`
     - 添加 loading/error 状态
  3. 全局任务列表：聚合所有项目的任务（或使用 `loadTasks('global')`）
  4. 保留统计卡片、筛选、排序逻辑（`calculateTaskStats`、`processTasks` 已支持通用 TaskItem[]）
  5. **保留 mockTasks 文件**不删除（用于测试参考）
  6. 运行 `npm run build`

  **Must NOT do**:
  - 禁止修改 TaskListView/TaskToolbar/StatsCards 组件
  - 禁止改变 UI 布局结构
  - 禁止删除 mockTasks 文件

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 3 | Depends on: W2-T1, W2-T2

  **References**:
  - Page: `src/components/task/TaskManagementPage.tsx`
  - Repository: `src/services/repositories/taskRepository.ts`
  - Store: `src/store/projectStore.ts`

  **Acceptance Criteria**:
  - [ ] `grep "mockTasks" src/components/task/TaskManagementPage.tsx` 返回 0
  - [ ] 页面展示 loading 态后渲染任务列表
  - [ ] `npm run build` 0 errors

  **QA Scenarios**:

  ```
  Scenario: Page loads with real data
    Tool: Playwright
    Steps: Navigate to #/tasks, verify task list renders (even if empty)
    Expected: No "mockTasks" reference in source; page doesn't crash
    Evidence: .sisyphus/evidence/task-w3-t1-page.png

  Scenario: Loading state shown
    Tool: Bash
    Steps: Check TaskManagementPage source for loading state
    Expected: Has useState for loading/isLoading
    Evidence: .sisyphus/evidence/task-w3-t1-loading.txt
  ```

  **Commit**: YES | Message: `feat(task): switch TaskManagementPage from mockTasks to API data source` | Files: `src/components/task/TaskManagementPage.tsx`

---

- [ ] W3-T2. TaskTreeView 真树化 — parentTaskId 替代 parentPath

  **What to do**:
  1. 读取 `src/components/task/taskManagement.data.ts` 中 `buildTaskTreeViewModel` 函数
  2. 重写为基于 `parentTaskId` 构建真实树：
     - 根节点：`parentTaskId === null` 的任务
     - 递归挂载子节点：`children = tasks.filter(t => t.parentTaskId === parent.taskId)`
  3. 更新 `TaskTreeNode` 类型支持 `nodeLevelType`
  4. 更新 `TaskTreeView` 组件使用新的树结构渲染
  5. 保留 `parentPath` 作为展示面包屑（从树遍历生成，而非数据库字段）
  6. 运行 `npm run build`

  **Must NOT do**:
  - 禁止修改 `TaskTreeView` 的 UI 渲染逻辑（只改数据构建）
  - 禁止删除 `parentPath`（保留用于展示面包屑）

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: tree data transformation + minor component update
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 3 | Depends on: W2-T1

  **References**:
  - Data: `src/components/task/taskManagement.data.ts` lines 349-436
  - Types: `src/components/task/taskManagement.types.ts` (TaskItem with parentTaskId from W2-T1)
  - Component: `src/components/task/TaskTreeView.tsx`

  **Acceptance Criteria**:
  - [ ] `buildTaskTreeViewModel` 产出的节点 `children` 数组非空（有父子关系时）
  - [ ] 4 层节点类型（project_root/stage/work_package/task）可通过 `nodeLevelType` 区分
  - [ ] `npm run build` 0 errors

  **QA Scenarios**:

  ```
  Scenario: Tree builds correctly from parentTaskId
    Tool: Bash
    Steps: Unit test: create 3 tasks with parentTaskId chain, verify tree depth = 3
    Expected: Root node has 1 child, child has 1 child
    Evidence: .sisyphus/evidence/task-w3-t2-tree.txt

  Scenario: Circular reference handled
    Tool: Bash
    Steps: Create A→B→A cycle, verify no infinite loop
    Expected: Tree builds without crash, cycle detection warning
    Evidence: .sisyphus/evidence/task-w3-t2-cycle.txt
  ```

  **Commit**: YES | Message: `feat(task): real tree hierarchy via parentTaskId, replace parentPath splitting` | Files: `src/components/task/taskManagement.data.ts`, `src/components/task/TaskTreeView.tsx`

---

- [ ] W3-T3. ProjectScopeTab 项目内任务视图

  **What to do**:
  1. 读取 `src/components/project/tabs/ProjectScopeTab.tsx`（当前是占位符）
  2. 实现项目内任务视图：
     - 根据当前项目 `project.code` 调用 `taskRepository.getProjectTasks(projectCode)` 加载该项目下的任务
     - 复用 `TaskTreeView` 组件展示项目内任务树（带 `nodeLevelType` 层级）
     - 复用 `StatsCards` 展示该项目任务统计（总数/待分配/执行中/阻塞等）
  3. 全局 vs 项目内的差异：
     - 全局任务管理：跨项目汇总视图，保留现有 TaskManagementPage
     - 项目内视图：仅当前项目任务，嵌入 ProjectScopeTab，**不包含独立页头**（复用 ProjectDetailPage 的 tab 框架）
  4. 添加「新建任务」入口（调用 `createProjectTask`）
  5. 运行 `npm run build`

  **Must NOT do**:
  - 禁止修改 ProjectDetailPage 的 tab 路由结构
  - 禁止修改 TaskManagementPage（全局页）
  - 禁止在此任务中做 WBS 合并（留给后续）

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: UI component with data integration
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 3 | Depends on: W2-T1

  **References**:
  - Placeholder: `src/components/project/tabs/ProjectScopeTab.tsx`
  - Project detail: `src/components/project/ProjectDetailPage.tsx`
  - Task tree: `src/components/task/TaskTreeView.tsx`
  - Repository: `src/services/repositories/taskRepository.ts`

  **Acceptance Criteria**:
  - [ ] ProjectDetailPage 的 scope 标签页展示项目内任务列表（非空白占位）
  - [ ] 任务列表按 `nodeLevelType` 显示层级
  - [ ] 统计卡片显示该项目任务汇总数据
  - [ ] `npm run build` 0 errors

  **QA Scenarios**:

  ```
  Scenario: Scope tab shows project tasks
    Tool: Playwright
    Steps: Navigate to #/projects/:code, click "范围" tab
    Expected: Task tree/table visible, not placeholder text
    Evidence: .sisyphus/evidence/task-w3-t3-scope.png

  Scenario: Stats reflect project tasks only
    Tool: Bash
    Steps: Verify StatsCards in scope tab receives project-filtered tasks
    Expected: Task count ≤ total tasks for that project
    Evidence: .sisyphus/evidence/task-w3-t3-stats.txt
  ```

  **Commit**: YES | Message: `feat(project): implement ProjectScopeTab with project-scoped task view` | Files: `src/components/project/tabs/ProjectScopeTab.tsx`

---

- [ ] W3-T4. 标准绑定最小闭环

  **What to do**:
  1. 确保 `standardSnapshotId` 在 DB 中有对应列（W1-T1 已完成）
  2. 在模板实例化流程中生成标准快照：
     - 读取 `src/components/standard/template-instantiation.ts`
     - 实例化任务时，根据 `TaskTemplate.standardBinding` 生成 `standardSnapshotId`
     - 将 `execution_standard_ids` 和 `acceptance_standard_ids` 写入任务
  3. 更新 `createProjectTask` API 传递标准绑定字段
  4. 在 TaskDetail 展示标准绑定状态（不再是 mock "已绑定"）
  5. 运行 `npm run build`

  **Must NOT do**:
  - 禁止在此任务中构建标准库 UI（那是标准管理模块的事）
  - 禁止修改 `template-contract.types.ts` 的 StandardBinding 接口

  **Recommended Agent Profile**:
  - Category: `quick`
  - Skills: []

  **Parallelization**: Can Parallel: YES | Wave 3 | Depends on: W2-T1

  **References**:
  - Instantiation: `src/components/standard/template-instantiation.ts`
  - Types: `src/components/standard/template-contract.types.ts` StandardBinding
  - Repository: `src/services/repositories/taskRepository.ts`
  - Schema: `prisma/schema.prisma` (standard_snapshot_id column)

  **Acceptance Criteria**:
  - [ ] 模板实例化生成的任务包含 `standardSnapshotId`
  - [ ] `execution_standard_ids` 和 `acceptance_standard_ids` 从模板继承
  - [ ] TaskDetail 页面展示真实的标准绑定状态
  - [ ] `npm run build` 0 errors

  **QA Scenarios**:

  ```
  Scenario: Template instantiation generates standard snapshot
    Tool: Bash
    Steps: Call instantiateTaskSeedsFromProjectTemplate with active template, verify snapshot IDs
    Expected: Each task seed has standardBound=true with executionStandardIds non-empty
    Evidence: .sisyphus/evidence/task-w3-t4-snapshot.txt

  Scenario: Task detail shows real standard binding
    Tool: Bash
    Steps: Check TaskDetail render with standardSnapshotId set
    Expected: Displays standard IDs, not mock "已绑定" text
    Evidence: .sisyphus/evidence/task-w3-t4-detail.txt
  ```

  **Commit**: YES | Message: `feat(task): standard binding closed loop — snapshot generation on template instantiation` | Files: `src/components/standard/template-instantiation.ts`, `src/services/repositories/taskRepository.ts`

## Final Verification Wave (MANDATORY)

- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy

- W1-T1: `feat(db): expand ProjectTask schema to 30+ columns for PRD P0+P1 fields`
- W1-T2: `feat(api): task CRUD handlers read/write full PRD P0+P1 fields`
- W2-T1: `feat(task): add P0+P1 fields to TaskItem/TaskDetail types, add parentTaskId`
- W2-T2: `feat(repo): update task repository/adapter for full TaskItem fields`
- W3-T1: `feat(task): switch TaskManagementPage from mockTasks to API data source`
- W3-T2: `feat(task): real tree hierarchy via parentTaskId, replace parentPath splitting`
- W3-T3: `feat(project): implement ProjectScopeTab with project-scoped task view`
- W3-T4: `feat(task): standard binding closed loop — snapshot generation on template instantiation`

## Success Criteria

1. TaskItem 类型 ≥ 40 字段（P0+P1+工时+标准绑定+审计）
2. DB ProjectTask 表 ≥ 35 列
3. 新建 7 个表：Personnel/Permission/WorkPackage/StandardFile/StandardClause/StandardObject/ClauseObjectBinding
4. 状态机 10 状态（草稿/待分配/待执行/执行中/已暂停/待提交/待验收/不通过/已完成/已关闭）
5. TaskManagementPage 不使用 mock 数据
6. 任务树支持真实 parentTaskId 层级（3 层：project_root → work_package → task）
7. ProjectScopeTab 展示项目内任务（非占位符）
8. 标准绑定通过对象抽象层实现（任务→对象→条款）
9. `npm run lint` 0 errors
10. `npm run build` 0 errors
