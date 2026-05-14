# Plan: Phase 6A 标准管理引擎实施计划

## Goal

补齐标准管理模块的三个结构性断裂：

1. StandardRule 从"死数据"变为"活规则"（ruleEngine.ts）
2. StandardSnapshot 从"不存在的引用"变为"真实实体"
3. 标准与任务之间的运行时绑定链路打通

## Tech Stack

- 后端：Express 5 + better-sqlite3 + Prisma Schema
- 测试：Vitest (node) + supertest
- 路由模式：Express Router + Controller

## Architecture

```
local-api/
├── services/
│   ├── ruleEngine.ts          # 纯函数规则引擎
│   ├── snapshotService.ts     # 快照生成与管理
│   └── standardBindingService.ts  # 标准绑定服务
├── routes/
│   ├── tasks.ts               # + 4 个绑定/快照/验收端点
│   └── standards.ts           # + 2 个规则执行端点
├── controllers/
│   ├── standards.ts           # 现有 12 个 CRUD 不变
│   └── tasks.ts               # 状态钩子触发快照
└── test/
    ├── setup.ts               # + Task 种子数据
    ├── helpers.ts             # + 工厂函数
    ├── smoke.test.ts          # 不变
    ├── ruleEngine.test.ts     # 新增
    ├── snapshotService.test.ts # 新增
    ├── bindingService.test.ts  # 新增
    └── api.standards.test.ts   # 新增

prisma/schema.prisma           # + StandardSnapshot + TaskStandardBinding
```

## Tasks

### Task 6A-1: Prisma Schema 新增表

**Files**: `prisma/schema.prisma` (modify)

Add two new models after the existing StandardRule model:

```prisma
model StandardSnapshot {
  id                  Int      @id @default(autoincrement())
  standardId          Int      @map("standard_id")
  clauseId            Int?     @map("clause_id")
  ruleId              Int?     @map("rule_id")
  taskId              Int      @map("task_id")
  snapshotVersion     String   @map("snapshot_version")
  standardName        String   @map("standard_name")
  clauseCode          String   @map("clause_code")
  clauseTitle         String   @map("clause_title")
  clauseContent       String?  @map("clause_content")
  ruleJudgeType       String?  @map("rule_judge_type")
  ruleParamConfig     String?  @map("rule_param_config")
  generatedAt         DateTime @default(now()) @map("generated_at")
  generatedBy         String   @default("system") @map("generated_by")
  triggerSource       String   @default("status_change") @map("trigger_source")

  standard            Standard @relation(fields: [standardId], references: [id])
  clause              StandardClause? @relation(fields: [clauseId], references: [id])
  rule                StandardRule? @relation(fields: [ruleId], references: [id])
  task                ProjectTask @relation(fields: [taskId], references: [id])

  @@map("standard_snapshots")
}

model TaskStandardBinding {
  id          Int      @id @default(autoincrement())
  taskId      Int      @map("task_id")
  clauseId    Int      @map("clause_id")
  ruleId      Int?     @map("rule_id")
  bindingType String   @map("binding_type")
  boundAt     DateTime @default(now()) @map("bound_at")
  boundBy     String?  @map("bound_by")

  task        ProjectTask @relation(fields: [taskId], references: [id])
  clause      StandardClause @relation(fields: [clauseId], references: [id])
  rule        StandardRule? @relation(fields: [ruleId], references: [id])

  @@unique([taskId, clauseId, bindingType])
  @@map("task_standard_bindings")
}
```

**Verify**: Run `npx prisma db push --accept-data-loss` and confirm both tables exist.

---

### Task 6A-2: ruleEngine.ts 规则执行引擎

**Files**: `local-api/services/ruleEngine.ts` (create), `local-api/test/ruleEngine.test.ts` (create)

Core pure function with three judgeType handlers. Test with 100% branch coverage.

```
boolean: actualValue === true → passed
range:   actualValue within [min, max] → passed
enum:    actualValue in allowed[] → passed
```

---

### Task 6A-3: snapshotService.ts 快照服务

**Files**: `local-api/services/snapshotService.ts` (create), `local-api/test/snapshotService.test.ts` (create)

Generate snapshots from task's standard bindings. Idempotent - same task + same call returns existing snapshots.

---

### Task 6A-4: standardBindingService.ts 绑定服务

**Files**: `local-api/services/standardBindingService.ts` (create), `local-api/test/bindingService.test.ts` (create)

Bind/unbind standards to tasks with guards (task status lock).

---

### Task 6A-5: 7 API 端点

**Files**:

- `local-api/routes/tasks.ts` (modify) - +4 endpoints
- `local-api/routes/standards.ts` (modify) - +1 endpoint
- `local-api/controllers/standards.ts` (modify) - +1 rule execute controller
- `local-api/controllers/tasks.ts` (modify) - +4 binding/snapshot/validate controllers
- `local-api/test/api.standards.test.ts` (create)

Endpoints:

1. `POST /projects/:code/tasks/:taskId/standards/bind` → bind standards to task
2. `DELETE /projects/:code/tasks/:taskId/standards/:bindingId` → unbind
3. `GET /projects/:code/tasks/:taskId/standards` → get task bindings
4. `GET /projects/:code/tasks/:taskId/snapshots` → get task snapshots
5. `POST /projects/:code/tasks/:taskId/snapshots/generate` → manual snapshot
6. `POST /projects/:code/tasks/:taskId/acceptance/validate` → validate acceptance
7. `POST /standards/rules/:id/execute` → execute single rule
8. `GET /standards/:id/bindings` → get standard's bindings

---

### Task 6A-6: 任务状态变更钩子

**Files**: `local-api/controllers/tasks.ts` (modify)

In `updateTask()`, after status transitions to "executing", call `snapshotService.generateSnapshots()`.

- Fail open (catch errors, log, don't block state change)
- Log to audit_logs table on failure

---

### Infrastructure: 测试数据补充

**Files**: `local-api/test/setup.ts` (modify), `local-api/test/helpers.ts` (modify)

1. Add Project + ProjectTask seed data
2. Add `createTestProject()`, `createTestTask()` factory functions

---

### UI Debt: 加载态 + PageLayout

**Files**:

- `src-next/pages/standards/StandardDetailPage.tsx` (modify)
- `src-next/pages/standards/StandardListPage.tsx` (modify)

1. Replace "加载中..." text with `<Skeleton>` component
2. Replace raw `<div>` layout with `<PageLayout>` component
