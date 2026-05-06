---
id: DOC-04-OPERATIONS-PHASE3-LOCAL-BACKEND-FEASIBILITY
title: 本地后端联调指南
owner: docs-maintainer
status: archived
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs: []
---

# 本地后端联调指南

本文档说明如何在本地环境验证五条核心接口，包括环境搭建、联调步骤、幂等验证与切回云端检查清单。

## 一、环境准备

### 1. 安装依赖

```bash
npm install
```

新增依赖包括：

- `better-sqlite3`: SQLite 数据库驱动
- `@types/better-sqlite3`: TypeScript 类型定义
- `tsx`: TypeScript 执行器
- `concurrently`: 并行运行前后端

### 2. 环境变量（可选）

在项目根目录创建 `.env.local`:

```bash
# 本地 API 端口（默认 3100）
LOCAL_API_PORT=3100

# 前端 API 基础路径（已通过 vite proxy 自动代理）
# VITE_API_BASE_URL=/api

# CloudBase 环境 ID（本地联调时可忽略）
# VITE_TCB_ENV_ID=your-env-id
```

## 二、启动服务

### 方式 1: 并行启动（推荐）

```bash
npm run dev:local
```

该命令同时启动:

- 本地 API 服务 (端口 3100)
- Vite 开发服务器 (端口 5173)

### 方式 2: 分开启动

```bash
# 终端 1: 启动本地 API
npm run local-api

# 终端 2: 启动前端开发服务器
npm run dev
```

### 验证服务状态

```bash
# 检查本地 API 健康状态
curl http://localhost:3100/health

# 预期响应
{
  "status": "ok",
  "timestamp": "2026-04-14T08:00:00.000Z"
}
```

## 三、接口说明

### 基础信息

- **基础路径**: `http://localhost:3100/api`
- **前端代理**: 通过 Vite proxy 自动转发 `/api` → `http://localhost:3100/api`
- **CORS**: 已开启，支持跨域访问
- **幂等支持**: 写接口支持 `X-Idempotency-Key` 头部去重

### 五条核心接口

| 接口     | 方法    | 路径                                                     | 说明              |
| -------- | ------- | -------------------------------------------------------- | ----------------- |
| 项目状态 | GET/PUT | `/api/projects/state?envId={envId}`                      | 读取/保存项目状态 |
| 任务状态 | GET/PUT | `/api/tasks/state?contextKey={key}&envId={envId}`        | 读取/保存任务状态 |
| 验收状态 | GET/PUT | `/api/acceptance/state?projectCode={code}&envId={envId}` | 读取/保存验收状态 |
| 结算状态 | GET     | `/api/settlement/state?envId={envId}`                    | 读取结算建议      |
| 审计日志 | POST    | `/api/audit/logs?envId={envId}`                          | 追加审计日志      |

## 四、联调步骤

### 步骤 1: 初始化数据

首次启动后，数据库表自动创建，初始状态为空：

```bash
# 测试项目状态接口（初始为空）
curl http://localhost:3100/api/projects/state?envId=test

# 预期响应
{
  "projects": [],
  "logs": {}
}
```

### 步骤 2: 写入测试数据

```bash
# 保存项目状态
curl -X PUT http://localhost:3100/api/projects/state?envId=test \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-key-001" \
  -d '{
    "projects": [
      {
        "id": "proj-001",
        "code": "P001",
        "name": "测试项目",
        "status": "pending_confirmation",
        "createdAt": "2026-04-14T08:00:00Z"
      }
    ],
    "logs": {}
  }'

# 预期响应: HTTP 204 No Content
```

### 步骤 3: 验证数据持久化

```bash
# 重新读取项目状态
curl http://localhost:3100/api/projects/state?envId=test

# 预期响应
{
  "projects": [
    {
      "id": "proj-001",
      "code": "P001",
      "name": "测试项目",
      "status": "pending_confirmation",
      "createdAt": "2026-04-14T08:00:00Z"
    }
  ],
  "logs": {}
}
```

### 步骤 4: 前端集成验证

1. 打开浏览器访问 `http://localhost:5173`
2. 执行项目状态变更操作
3. 观察浏览器 Network 面板，确认请求发送至 `/api/projects/state`
4. 检查本地 API 终端日志，确认请求处理成功
5. 刷新页面，验证数据持久化成功

## 五、幂等性验证

### 测试场景

```bash
# 第一次写入（成功）
curl -X PUT http://localhost:3100/api/projects/state?envId=test \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: idempotent-test-001" \
  -d '{"projects": [{"id": "p1"}], "logs": {}}'

# 响应: HTTP 204

# 第二次重复写入（幂等返回）
curl -X PUT http://localhost:3100/api/projects/state?envId=test \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: idempotent-test-001" \
  -d '{"projects": [{"id": "p1"}], "logs": {}}'

# 响应: HTTP 204（不重复处理）

# 第三次写入（不同请求体，幂等键失效）
curl -X PUT http://localhost:3100/api/projects/state?envId=test \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: idempotent-test-001" \
  -d '{"projects": [{"id": "p2"}], "logs": {}}'

# 响应: HTTP 400 Bad Request（请求体不一致）
```

### 验证要点

1. **相同幂等键 + 相同请求体** → 返回成功，不重复处理
2. **相同幂等键 + 不同请求体** → 返回错误，拒绝处理
3. **不同幂等键** → 正常处理为新请求
4. **幂等键过期** → 7 天后自动清理，可重新使用

## 六、数据库管理

### 查看数据库文件

```bash
# 数据库文件位置
local-api/store/local.db

# 使用 sqlite3 命令行工具查看
sqlite3 local-api/store/local.db

# 查询所有表
.tables

# 查看项目状态数据
SELECT * FROM project_state;

# 退出
.quit
```

### 重置数据库

```bash
# 删除数据库文件（重启服务后自动重建）
rm local-api/store/local.db

# 或在代码中调用 resetDatabase() 函数
```

## 七、切回云端检查清单

完成本地验证后，切换回 CloudBase 云端服务前，请检查：

### 前端配置

- [ ] 移除或注释 `vite.config.ts` 中的 proxy 配置
- [ ] 设置环境变量 `VITE_API_BASE_URL` 指向云端 API 地址
- [ ] 设置环境变量 `VITE_TCB_ENV_ID` 为正确的 CloudBase 环境 ID
- [ ] 确认 CloudBase 鉴权已正确配置

### 接口契约一致性

- [ ] 确认云端 API 返回格式与本地一致
- [ ] 确认云端 API 支持相同的查询参数 (`envId`, `contextKey`, `projectCode`)
- [ ] 确认云端 API 支持 `X-Idempotency-Key` 幂等机制
- [ ] 确认错误响应格式包含 `message`、`code`、`status` 字段

### 数据迁移（如需要）

- [ ] 导出本地 SQLite 数据
- [ ] 将数据导入 CloudBase 数据库
- [ ] 验证数据完整性与一致性

### 回归测试

- [ ] 执行完整的项目状态流转测试
- [ ] 执行任务管理完整流程
- [ ] 执行验收流程
- [ ] 执行结算流程
- [ ] 验证审计日志记录

## 八、常见问题

### Q1: 端口被占用怎么办？

```bash
# 查找占用端口的进程
lsof -i :3100

# 终止进程
kill -9 <PID>

# 或修改环境变量使用其他端口
LOCAL_API_PORT=3200 npm run local-api
```

### Q2: 前端请求 404 错误？

检查：

1. 本地 API 是否正常启动
2. Vite proxy 配置是否正确
3. 请求路径是否包含 `/api` 前缀

### Q3: 数据库锁定错误？

SQLite 在高并发写入时可能出现锁定，解决方案：

- 使用 WAL 模式（已默认启用）
- 减少并发写入频率
- 考虑使用 PostgreSQL 等企业级数据库

### Q4: 幂等键不生效？

检查：

1. 请求是否包含 `X-Idempotency-Key` 头部
2. 幂等键是否已过期（7 天）
3. 请求体是否完全一致（包括字段顺序）

## 九、日志与监控

### 本地 API 日志

本地 API 服务会输出以下日志：

- 数据库初始化日志
- 幂等键命中日志
- 请求处理日志
- 错误日志

示例：

```
[SQLite] 数据库初始化完成: /path/to/local.db
[Local API] 服务已启动: http://localhost:3100
[Idempotency] 命中幂等键: key=test-key-001, scope=project_state_write
[API] 幂等重放: key=test-key-001
```

### 前端降级事件

前端会在 API 请求失败时触发 `pm:remote-fallback` 事件，可通过浏览器控制台查看：

```javascript
window.addEventListener('pm:remote-fallback', event => {
  console.log('API 降级事件:', event.detail)
})
```

## 十、附录

### 接口完整示例

完整的接口请求示例参见：

- `src/services/api/serverAdapter.ts` - 前端调用示例
- `local-api/server.ts` - 后端处理逻辑

### 数据库 Schema

数据库表结构定义参见：

- `local-api/store/schema.sql` - 完整 SQL 定义

### 相关文档

- [阶段3验收清单](./phase3/cloudbase-e2e-checklist.md)
- [发布检查清单](./phase3/launch-checklist.md)
- [项目架构说明](../CODEBUDDY.md)
