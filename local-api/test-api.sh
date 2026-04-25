#!/bin/bash

# 本地 API 接口测试脚本
# 测试五条核心接口与幂等机制

API_BASE="http://localhost:3100/api"
ENV_ID="test-env"

echo "=========================================="
echo "本地 API 接口测试"
echo "=========================================="
echo ""

# 1. 健康检查
echo "【1】健康检查"
curl -s http://localhost:3100/health | jq .
echo ""

# 2. 项目状态接口
echo "【2】项目状态接口"
echo "2.1 GET /projects/state (初始为空)"
curl -s "${API_BASE}/projects/state?envId=${ENV_ID}" | jq .
echo ""

echo "2.2 PUT /projects/state (保存数据)"
curl -s -X PUT "${API_BASE}/projects/state?envId=${ENV_ID}" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-project-001" \
  -d '{
    "projects": [
      {
        "id": "proj-001",
        "code": "P001",
        "name": "测试项目A",
        "status": "pending_confirmation",
        "createdAt": "2026-04-14T08:00:00Z"
      }
    ],
    "logs": {}
  }' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

echo "2.3 GET /projects/state (验证保存)"
curl -s "${API_BASE}/projects/state?envId=${ENV_ID}" | jq .
echo ""

echo "2.4 PUT /projects/state (幂等重放 - 相同键)"
curl -s -X PUT "${API_BASE}/projects/state?envId=${ENV_ID}" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-project-001" \
  -d '{
    "projects": [
      {
        "id": "proj-001",
        "code": "P001",
        "name": "测试项目A",
        "status": "pending_confirmation",
        "createdAt": "2026-04-14T08:00:00Z"
      }
    ],
    "logs": {}
  }' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

# 3. 任务状态接口
echo "【3】任务状态接口"
echo "3.1 GET /tasks/state"
curl -s "${API_BASE}/tasks/state?contextKey=project-P001&envId=${ENV_ID}" | jq .
echo ""

echo "3.2 PUT /tasks/state"
curl -s -X PUT "${API_BASE}/tasks/state?contextKey=project-P001&envId=${ENV_ID}" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-task-001" \
  -d '{
    "tasks": [
      {
        "id": "task-001",
        "name": "设计评审",
        "status": "pending",
        "assignee": "张三"
      }
    ]
  }' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

echo "3.3 GET /tasks/state (验证保存)"
curl -s "${API_BASE}/tasks/state?contextKey=project-P001&envId=${ENV_ID}" | jq .
echo ""

# 4. 验收状态接口
echo "【4】验收状态接口"
echo "4.1 GET /acceptance/state"
curl -s "${API_BASE}/acceptance/state?projectCode=P001&envId=${ENV_ID}" | jq .
echo ""

echo "4.2 PUT /acceptance/state"
curl -s -X PUT "${API_BASE}/acceptance/state?projectCode=P001&envId=${ENV_ID}" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-acceptance-001" \
  -d '{
    "nodes": [
      {"id": "node-1", "name": "需求确认", "status": "completed"}
    ],
    "milestones": [
      {"id": "ms-1", "name": "里程碑1", "progress": 100}
    ]
  }' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

echo "4.3 GET /acceptance/state (验证保存)"
curl -s "${API_BASE}/acceptance/state?projectCode=P001&envId=${ENV_ID}" | jq .
echo ""

# 5. 结算状态接口
echo "【5】结算状态接口"
echo "5.1 GET /settlement/state"
curl -s "${API_BASE}/settlement/state?envId=${ENV_ID}" | jq .
echo ""

# 6. 审计日志接口
echo "【6】审计日志接口"
echo "6.1 POST /audit/logs"
curl -s -X POST "${API_BASE}/audit/logs?envId=${ENV_ID}" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-audit-001" \
  -d '{
    "scene": "project_status_change",
    "detail": "项目状态从【待确认】变更为【待拆解】",
    "projectCode": "P001",
    "at": "2026-04-14T08:30:00Z"
  }' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

echo "6.2 POST /audit/logs (幂等重放)"
curl -s -X POST "${API_BASE}/audit/logs?envId=${ENV_ID}" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-audit-001" \
  -d '{
    "scene": "project_status_change",
    "detail": "项目状态从【待确认】变更为【待拆解】",
    "projectCode": "P001",
    "at": "2026-04-14T08:30:00Z"
  }' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

echo "=========================================="
echo "测试完成"
echo "=========================================="
