---
name: p0-data-layer-entity-migration
overview: 将数据层从 JSON 快照模式迁移到实体表模式：清理 Prisma Schema → 重构 local-api 为实体 CRUD → Repository 层对接 API → localStorage 数据迁移 → 验证全链路
todos:
  - id: d-1-1-schema-cleanup
    content: 'D-1-1: 清理 Prisma schema — 删除快照表 ProjectState/TaskState/AcceptanceState/SettlementState，保留实体表和 AuditLog/IdempotencyKey，执行 prisma generate'
    status: completed
  - id: d-1-1b-schema-align
    content: 'D-1-1b: 使用 [subagent:code-explorer] 扫描 ProjectItem/TaskItem 等前端类型，确保 Prisma 实体表字段与前端类型对齐，补全缺失字段'
    status: completed
    dependencies:
      - d-1-1-schema-cleanup
  - id: d-1-2-api-refactor
    content: 'D-1-2: 重构 local-api — 用 PrismaClient 替代 better-sqlite3，删除 schema.sql，新增项目/任务/里程碑/阶段/风险/成员/日志的 CRUD 端点，保留旧 /state 端点并标记 deprecated'
    status: completed
    dependencies:
      - d-1-1b-schema-align
  - id: d-1-3-adapter-update
    content: 'D-1-3: 更新 serverAdapter — 新增实体 API 方法（getProjects/createProject/getProjectTasks 等），projectRepository/taskRepository 切换到 API 优先 + localStorage 降级'
    status: completed
    dependencies:
      - d-1-2-api-refactor
  - id: d-1-4-data-migration
    content: 'D-1-4: 编写并执行数据迁移脚本 — 备份 localStorage→文件，然后逐条转换为实体记录写入 SQLite，验证数据完整性'
    status: completed
    dependencies:
      - d-1-3-adapter-update
  - id: d-1-5-verification
    content: 'D-1-5: 端到端验证 — prisma db push + local-api 启动 + 前端联调 + npm run lint/build/test 全量通过'
    status: completed
    dependencies:
      - d-1-4-data-migration
---

## 用户需求

制定 P0 级阻塞任务的完整执行计划：将项目后端从快照模式（整个 JSON blob 读写）迁移到实体表模式（结构化 CRUD），打通"前端 Repository → API → Prisma 实体 → SQLite"的完整数据链路。这是当前进入 Phase 2 的唯一阻塞点。

## 核心目标

1. 删除 Prisma schema 中不再需要的快照表（`ProjectState`、`TaskState` 等），保留实体表
2. 将 `local-api` 从 better-sqlite3 原始 SQL 切换为 Prisma Client 驱动，消除 `schema.sql` 与 `schema.prisma` 的双重维护
3. 新增项目、任务等核心实体的 CRUD API 端点，替代旧的快照式 `/state` 接口
4. 前端 `serverAdapter` 对接新 API，`projectRepository` / `taskRepository` 从 localStorage 优先切换到 API 优先
5. 编写数据迁移脚本，将现有 localStorage 中的演示数据无损导入 SQLite 实体表

## 关键决策已确认

- **后端驱动方式**：切换为 Prisma Client，删除 `local-api/store/schema.sql`
- **迁移策略**：使用 `prisma db push`（非 migrate），适合单人开发模式
- **V1 分阶段**：项目和任务先实体化，验收/结算保留快照模式（后续迭代处理）
- **旧接口兼容**：旧的快照式 `/state` 端点标记 deprecated，保留过渡期，不立即删除

## 技术栈

- **后端运行时**：tsx（TypeScript 直接执行，无需独立编译）
- **ORM**：Prisma Client 7.8（已安装于 devDependencies）
- **数据库**：SQLite（V1 阶段，V2 迁 PostgreSQL）
- **API 协议**：HTTP REST + JSON，幂等键支持
- **前端数据层**：Repository 模式（已有 9 个 Repository），API 优先 + localStorage 降级

## 实现策略

### 核心思路

三步渐进式迁移，每步可独立验证：

1. **Schema 层**：清理 Prisma schema，统一数据源定义
2. **API 层**：重构 local-api，从 better-sqlite3 切换到 Prisma，新增实体 CRUD 端点
3. **接入层**：前端 serverAdapter 对接新端点，Repository 切换到 API 优先

### 架构变更

```
迁移前：
  前端 Repository → localStorage (主) + 快照 API (备)
  local-api 使用 better-sqlite3 读写 JSON blob

迁移后：
  前端 Repository → 实体 CRUD API (主) + localStorage (降级)
  local-api 使用 Prisma Client 操作结构化实体表
  schema.sql 删除，schema.prisma 成为唯一 schema 来源
```

### 关键设计决策

1. **Prisma Client 导入路径**：`local-api/server.ts` 从 `../src/generated/prisma` 导入（Prisma schema 中 `output` 指向此路径）
2. **不立即删除旧端点**：旧的 `/projects/state`、`/tasks/state` 标记 deprecated，保留过渡期，避免前端一次性全部改造
3. **验收/结算保持快照**：这两个域数据结构复杂且非当前阻塞点，延后到后续迭代处理
4. **数据迁移使用独立脚本**：不嵌入 API 启动逻辑，避免每次启动都执行迁移

## 实现细节

### 性能考虑

- Prisma Client 单例模式（复用连接，避免每个请求新建连接）
- Repository 层保持 "API 读 → 写 localStorage 缓存" 的双写策略，确保离线可用
- 迁移脚本批量插入使用 `createMany`（Prisma SQLite 支持）

### 错误处理

- API 不可用时 Repository 降级到 localStorage（已有降级逻辑，沿用）
- 迁移脚本需要事务保护（全部成功或全部回滚）
- 旧 `/state` 端点保留幂等键支持

### 安全注意

- 不记录 PII 到日志
- 数据迁移前自动备份 localStorage 数据到文件
- 旧的 `local.db` 文件不删除，重命名为 `local.db.snapshot-backup`

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 在 D-1-1 执行前再次确认 Prisma schema 与现有类型定义的字段对齐情况，以及在 D-1-3 执行前确认所有 Repository 文件的当前状态
- Expected outcome: 输出字段差异清单，确保迁移脚本能正确转换数据
