# 模式识别记录

## 2026-05-16

### 模式: API 验收需同时检查前后端契约

- 后端 API 新增后，必须检查前端 api.ts 是否同步注册
- 列表接口需检查分页参数和响应格式的一致性
- 关联查询需检查是否使用 JOIN 避免 N+1

### 模式: camelCase 字段映射

- 后端 SQLite 使用 snake_case，通过 SQL AS 映射为 camelCase
- 前端 TypeScript 类型与 API 响应字段名保持一致
