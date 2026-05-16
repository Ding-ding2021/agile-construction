# 近期决策速记

## 2026-05-16

### 6D API 分页格式决策

- 列表接口应统一返回 `{ data: [], pagination: { page, pageSize, total, totalPages } }`
- 与现有任务列表接口保持一致，避免前端多态适配

### 6D 前端 API 封装决策

- 新增 roles/teams/personnel 扩展端点需同步注册到 src-next/services/api.ts
- 确保后端 API 发布即前端可用

### 6D 分页实现技术决策

- 使用 COUNT + LIMIT/OFFSET 模式实现服务端分页
- better-sqlite3 纯 SQL 实现，不引入 Prisma Client
- 分页参数默认值：page=1, pageSize=50，最大 pageSize=100
- JOIN 查询场景使用 COUNT(DISTINCT p.id) 避免重复计数
- 常量列定义避免硬编码表别名前缀，通过动态映射生成带别名版本（PERSON_COLUMNS_ALIASED），兼顾单表查询和 JOIN 查询的复用性
