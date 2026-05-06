---
id: DOC-04-OPERATIONS-PHASE3-CLOUDBASE-E2E-CHECKLIST
title: cloudbase-e2e-checklist
owner: docs-maintainer
status: archived
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs: []
---

## CloudBase 真链路回归清单（阶段3）

### 0. 前置条件

- 已确认 CloudBase 环境可用（`envId`）
- 已获取有效鉴权凭据
- 前端配置可访问后端（`VITE_API_BASE_URL`、`VITE_TCB_ENV_ID`）
- 本地兜底保留，但本次验证以远端为准

### 1. 核心接口回归（五主链）

| 接口                | 操作  | 预期结果                   | 证据要求                   |
| ------------------- | ----- | -------------------------- | -------------------------- |
| `/projects/state`   | 读/写 | 返回项目状态快照，写入成功 | 请求参数、响应体、时间戳   |
| `/tasks/state`      | 读/写 | 按 `contextKey` 正常读写   | 请求参数、响应体、上下文键 |
| `/acceptance/state` | 读/写 | 按 `projectCode` 正常读写  | 请求参数、响应体、项目编码 |
| `/settlement/state` | 读    | 返回结算建议或空集         | 响应体、过滤规则说明       |
| `/audit/logs`       | 写    | 审计记录成功写入           | 请求体、请求ID/时间戳      |

### 2. 幂等与重试验证

- 使用 `X-Idempotency-Key` 重复提交同一写请求：
  - **预期**：不产生重复脏写
- 人为触发短暂失败后重试：
  - **预期**：重试语义一致，最终状态可解释

### 3. 异常场景验证

- 网络不可用 / 超时
- 4xx 业务错误
- 5xx 服务错误

**统一预期**：

- `pm:remote-fallback` 事件被触发并可见提示
- 错误可定位（状态码、错误码、范围）
- 本地兜底生效但不掩盖异常

### 4. 记录模板（每条回归都填）

- 场景：
- 接口：
- 请求摘要：
- 响应摘要：
- 结果：通过 / 失败 / 阻断
- 阻断原因：
- 下一步动作：
- 执行时间：

### 5. 通过标准

- 五主链均至少一次真实通过
- 幂等验证通过
- 至少3类失败场景可定位
- 回退可见化生效

### 6. 本次执行记录（2026-04-13）

- 场景：CloudBase 鉴权恢复
- 执行动作：调用 `tcb.login(forceUpdate=false/true)`、`tcb.envQuery(action=info)`
- 结果：**阻断**
- 阻断原因：`Token verification failed`，导致无法获取环境列表与 `envId`
- 影响：无法进入五接口远端真实回归
- 下一步动作：在集成面板重新登录 CloudBase 或更新 Token 后，按本清单第1节继续执行
