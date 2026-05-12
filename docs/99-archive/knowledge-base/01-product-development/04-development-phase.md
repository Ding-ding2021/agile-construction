---
id: ARC-012
number: ARC-012
domain: archive
category: archived
title: 04 Development Phase
status: superseded
last_updated: 2026-05-05
archived_at: 2026-05-12
archived_reason: 历史归档
superseded_by: docs/ (see docs/README.md for current docs)
---

# 开发阶段

## 目标

将设计稿转化为可运行的代码，实现产品功能。

## 开发流程

```mermaid
flowchart LR
    A[技术方案设计] --> B[环境搭建]
    B --> C[接口定义]
    C --> D[并行开发]
    D --> E[联调测试]
    E --> F[代码审查]
    F --> G[合并主干]
```

## 关键活动

### 1. 技术方案设计

- **架构设计**：确定技术栈与分层架构
- **数据库设计**：表结构、索引、关系
- **API设计**：接口规范、数据格式
- **技术选型**：框架、库、工具选择

### 2. 开发规范

```
## 代码规范要点

1. 命名规范
   - 变量：camelCase
   - 常量：UPPER_SNAKE_CASE
   - 类名：PascalCase
   - 组件：PascalCase

2. 文件组织
   - 按功能模块划分目录
   - 组件：index.tsx + style.css + types.ts
   - 工具函数统一放 utils/

3. 注释规范
   - 公共API必须注释
   - 复杂逻辑添加说明
   - TODO标记待办事项

4. Git规范
   - commit message格式：type(scope): subject
   - 分支管理：main/develop/feature/*
   - PR必须Code Review
```

### 3. 代码审查

**审查清单：**

- [ ] 代码是否符合规范
- [ ] 是否有潜在Bug
- [ ] 性能是否有优化空间
- [ ] 是否有安全漏洞
- [ ] 测试是否覆盖
- [ ] 文档是否更新

## 开发阶段管理

### 每日站会

- 昨天做了什么
- 今天计划做什么
- 有什么阻塞问题

### 迭代节奏

- 迭代周期：2周
- 迭代计划会：周一上午
- 迭代评审会：周五下午
- 迭代回顾会：周五下班前

## 质量门禁

| 检查项   | 工具            | 通过标准   |
| -------- | --------------- | ---------- |
| 代码规范 | ESLint/Prettier | 0 error    |
| 类型检查 | TypeScript      | 0 error    |
| 单元测试 | Jest/Vitest     | 覆盖率>80% |
| 构建检查 | CI              | 构建成功   |
