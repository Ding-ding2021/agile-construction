---
id: AI-COMPONENT-DEVELOPMENT
human_source: docs/02-design/component-development-contract.md
status: active
last_synced: 2026-05-13
---

# AI 合约：组件开发合约

## 模块定位

定义 React 组件开发的标准流程、复用优先级和 AI 行为约束。

## 核心实体

| 实体     | 字段                                | 状态机                                            |
| -------- | ----------------------------------- | ------------------------------------------------- |
| 通用组件 | Props 接口, Tailwind 样式, 命名导出 | requirement → impl → review → merged              |
| 领域组件 | Contract 定义, 业务逻辑, 单元测试   | requirement → contract → impl → test → integrated |

## 业务规则

1. 复用优先级 P0 直接使用 → P1 CLI 安装 → P2 组合 → P3 自定义
2. 组件必须导出 TypeScript Props 接口
3. 使用 Tailwind 样式和 cn() 合并类名
4. 命名导出为主，禁止默认导出
5. 领域组件必须有单元测试
6. Contract 先于实现定义

## AI 约束

- 禁止在未确认 shadcn 存在性时创建新组件
- 禁止使用内联 style prop
- 禁止修改 cn() 或 shadcn 全局样式
- 禁止手动复制 shadcn 源码

## 依赖模块

| 模块       | 引用位置                             | 依赖内容        |
| ---------- | ------------------------------------ | --------------- |
| 设计治理   | ../00-governance/design-standards.md | 组件治理总则    |
| 组件查询表 | component-catalog.md                 | 组件可用性确认  |
| 编码规范   | coding-standards.md                  | TypeScript 风格 |

## 质量门禁

- 所有组件过 4 道审查门禁
- Props 必须向前兼容
- 文件路径与项目结构一致
