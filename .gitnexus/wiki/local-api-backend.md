# 本地 API 后端

# 本地 API 后端模块

## 概述

本地 API 后端是一个基于 Express 的 HTTP 服务器，为项目管理操作提供本地开发和测试后端。它通过为项目、任务、里程碑、阶段、风险、成员、状态日志和审计日志提供 CRUD 端点，取代了开发期间对远程 API 的需求——所有这些都由本地 SQLite 数据库支持。

**主要特性：**

- 单进程，零依赖外部服务（无 Redis，无远程数据库）
- 写操作支持幂等性，以实现安全重试
- 使用 WAL 模式的 SQLite，提升并发读取性能
- 通过 Prisma 管理模式（schema.prisma 作为唯一真实来源）
- 默认运行在 3100 端口

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                        server.ts                            │
│  Express 应用设置、中间件注册、启动                         │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                     routes/index.ts                         │
│  中央路由器：将所有子路由器挂载到 /api 下                   │
└──┬──────────┬──────────┬──────────┬──────────┬──────────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│项目  │ │任务  │ │里程碑│ │阶段  │ │风险  │ │成员  │
│路由  │ │路由  │ │路由  │ │路由  │ │路由  │ │路由  │
└──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
   │        │        │        │        │        │
   ▼        ▼        ▼        ▼        ▼        ▼
┌─────────────────────────────────────────────────────────────┐
│                    controllers/                              │
│  请求处理器：解析输入、调用数据库、返回响应                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    store/sqlite.ts                          │
│  数据库连接管理、初始化、清理                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQLite (better-sqlite3)                  │
│                    local-api/store/prisma.db                │
└─────────────────────────────────────────────────────────────┘
```

## 核心组件

### 1. 服务器入口点 (`server.ts`)

初始化 Express 应用，注册全局中间件（CORS、JSON 解析），将路由挂载到 `/api` 下，并开始监听。启动时还会初始化数据库并清理过期的幂等性键。

```typescript
// 关键启动序列
initDatabase()
cleanupExpiredIdempotencyKeys()
app.listen(PORT, ...)
```

### 2. 路由结构 (`routes/`)

路由层按资源组织。每个子路由器都挂载到 `/api` 下，并带有项目作用域的路径：

| 路由器文件      | 挂载路径                         | 端点                                                    |
| --------------- | -------------------------------- | ------------------------------------------------------- |
| `projects.ts`   | `/api/projects`                  | GET /, POST /, GET /:code, PUT /:code, DELETE /:code    |
| `tasks.ts`      | `/api/projects/:code/tasks`      | GET /, POST /, GET /tree, PUT /:taskId, DELETE /:taskId |
| `milestones.ts` | `/api/projects/:code/milestones` | GET /, POST /                                           |
| `phases.ts`     | `/api/projects/:code/phases`     | GET /, POST /                                           |
| `risks.ts`      | `/api/projects/:code/risks`      | GET /, POST /                                           |
| `members.ts`    | `/api/projects/:code/members`    | GET /, POST /                                           |
| `logs.ts`       | `/api/projects/:code/logs`       | GET /, POST /                                           |
| `audit.ts`      | `/api/audit/logs`                | GET /, POST /                                           |

跨项目任务查询也可通过 `GET /api/tasks/all` 使用。

### 3. 控制器 (`controllers/`)

每个控制器文件导出请求处理函数。它们遵循一致的模式：

1. 通过 `getDatabase()` 获取数据库连接
2. 从项目代码解析项目 ID（如果未找到则抛出带有 404 的 `ApiError`）
3. 使用预编译语句执行 SQL
4. 返回响应（读取操作为 JSON，创建操作为 201，删除操作为 204）

**通用辅助模式** — `getProjectId()` 出现在每个项目作用域的控制器中：

```typescript
function getProjectId(projectCode: string): number {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) throw new ApiError('Project not found', 'NOT_FOUND', 404)
  return project.id
}
```

**值得注意的控制器行为：**

- **`projects.ts`** — `getProjectByCode` 返回完整的项目详情，包括其阶段、里程碑、风险和成员，在单个响应中返回。`updateProject` 根据请求体字段动态构建 SET 子句（排除 `code` 以防止键更改）。
- **`tasks.ts`** — `getTaskTree` 使用递归的 `buildTree` 函数从扁平的任务行构建层次树。标签存储为 JSON 字符串，并在读取时通过 `parseTagsField` 解析。
- **`logs.ts`** — 状态日志使用列别名（`from_status as fromStatus`）以实现驼峰式响应。
- **`projectHelpers.ts`** — 项目数据查询与转换辅助函数，提供跨控制器的通用项目数据操作。
- **`taskLogs.ts`** — 任务日志记录辅助函数，处理任务操作的历史日志记录。
- **`taskSubmissions.ts`** — 任务提交处理辅助函数，管理任务提交流程及验证。

### 4. 中间件 (`middleware/`)

| 中间件                  | 文件             | 用途                                                             |
| ----------------------- | ---------------- | ---------------------------------------------------------------- |
| `corsMiddleware`        | `cors.ts`        | 设置 CORS 头，处理 OPTIONS 预检请求                              |
| `errorHandler`          | `error.ts`       | 捕获 `ApiError` 实例以返回结构化错误响应；对于意外错误回退到 500 |
| `notFoundHandler`       | `error.ts`       | 为未匹配的路由返回 404                                           |
| `idempotencyMiddleware` | `idempotency.ts` | 拦截带有 `X-Idempotency-Key` 头的 POST/PUT/PATCH/DELETE 请求     |

**错误响应格式**（在 `contracts.ts` 中定义）：

```json
{
  "message": "Project not found",
  "code": "NOT_FOUND",
  "status": 404,
  "timestamp": "2026-04-29T10:00:00.000Z"
}
```

### 5. 幂等性 (`store/idempotency.ts`)

幂等性系统确保使用相同键和请求体重试写操作会产生相同的结果，而不会产生副作用。

**流程：**

1. 中间件提取 `X-Idempotency-Key` 头
2. 计算请求体的 SHA-256 哈希值
3. 检查是否存在具有匹配哈希值的 `(key, envId)` 记录
4. 如果找到：立即返回缓存的响应
5. 如果未找到：包装 `res.json` 以捕获响应，然后存储记录

**关键细节：**

- TTL：7 天（可通过 `IDEMPOTENCY_TTL_DAYS` 配置）
- 作用域：请求路径（`req.path`）
- 冲突检测：不匹配的请求哈希返回 `{ exists: false }`（记录为警告）
- 并发插入：通过 try/catch 优雅处理

### 6. 数据库层 (`store/sqlite.ts`)

使用 `better-sqlite3` 管理单个 SQLite 连接。

**关键函数：**

| 函数              | 用途                                |
| ----------------- | ----------------------------------- |
| `initDatabase()`  | 创建连接，启用 WAL 模式和外键       |
| `getDatabase()`   | 返回现有连接或调用 `initDatabase()` |
| `closeDatabase()` | 关闭                                |
