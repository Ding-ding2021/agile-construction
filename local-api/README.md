# 本地后端 API 服务

提供五条核心接口的本地实现，用于本地开发与测试。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务

#### 方式 1: 并行启动前后端（推荐）

```bash
npm run dev:local
```

自动启动本地 API (端口 3100) 和前端开发服务器 (端口 5173)。

#### 方式 2: 单独启动后端

```bash
npm run local-api
```

访问 `http://localhost:3100/health` 检查服务状态。

## 接口列表

| 接口     | 方法    | 路径                                                     | 说明              |
| -------- | ------- | -------------------------------------------------------- | ----------------- |
| 项目状态 | GET/PUT | `/api/projects/state?envId={envId}`                      | 读取/保存项目状态 |
| 任务状态 | GET/PUT | `/api/tasks/state?contextKey={key}&envId={envId}`        | 读取/保存任务状态 |
| 验收状态 | GET/PUT | `/api/acceptance/state?projectCode={code}&envId={envId}` | 读取/保存验收状态 |
| 结算状态 | GET     | `/api/settlement/state?envId={envId}`                    | 读取结算建议      |
| 审计日志 | POST    | `/api/audit/logs?envId={envId}`                          | 追加审计日志      |

## 测试接口

```bash
# 运行接口测试脚本
./local-api/test-api.sh

# 或手动测试
curl http://localhost:3100/health
curl http://localhost:3100/api/projects/state?envId=test
```

## 任务状态快照约束（V2）

`/api/tasks/state` 读写结构：

```json
{
  "schemaVersion": 2,
  "tasks": []
}
```

服务端在写入时会执行轻量校验：

- `tasks` 必须是数组
- `status` 必须在任务状态枚举内
- `plannedStartAt <= plannedEndAt`
- `isBlocked=true` 时必须提供 `blockedReason`

## 数据存储

- **数据库**: SQLite
- **文件位置**: `local-api/store/local.db`
- **表结构**: `local-api/store/schema.sql`

### 查看数据

```bash
sqlite3 local-api/store/local.db
.tables
SELECT * FROM project_state;
.quit
```

### 重置数据

```bash
rm local-api/store/local.db
```

重启服务后自动重建。

## 幂等机制

所有写接口（PUT/POST）支持幂等键：

```bash
curl -X PUT http://localhost:3100/api/projects/state?envId=test \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: unique-key-123" \
  -d '{"projects": [...], "logs": {}}'
```

- 相同幂等键 + 相同请求体 → 返回成功，不重复处理
- 幂等键有效期：7 天

## 环境变量

| 变量                | 默认值 | 说明              |
| ------------------- | ------ | ----------------- |
| `LOCAL_API_PORT`    | `3100` | 本地 API 端口     |
| `VITE_API_BASE_URL` | `/api` | 前端 API 基础路径 |

## 切换回云端

详见 [本地联调指南](../docs/04-operations/phase3/local-backend-feasibility.md#七切回云端检查清单)。
