---
id: DOC-00-GOVERNANCE-CODE-REVIEW
title: Code Review Checklist
owner: docs-maintainer
status: draft
last_updated: 2026-05-05
source_of_truth: true
related_code: []
related_docs:
  - docs/00-governance/coding-standards.md
  - docs/00-governance/component-development-contract.md
  - docs/00-governance/project-management-guide.md
---

# Code Review Checklist

## 适用范围

所有 AI 完成开发后，进入"In Review"阶段前必须经过本 checklist。

---

## 1. 门禁检查（自动化，必须全部通过）

- [ ] `npm run build` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] `npm run test:run` — All tests passing
- [ ] 覆盖率未低于阈值（lines 55% / functions 42% / branches 42%）

## 2. 逻辑验证

- [ ] 新增/修改代码有对应的单元测试
- [ ] 测试用例名称描述业务场景（非 test1/test2）
- [ ] 核心模块输出了可解释交付物（测试用例清单 + 流程图 + 边界条件）

## 3. 编码规范

- [ ] 无 `any` 类型（除非有 `eslint-disable` 注释说明理由）
- [ ] 无硬编码色值/尺寸（使用 CSS 变量或设计 Token）
- [ ] 命名符合规范（组件 PascalCase，函数 camelCase，常量 UPPER_SNAKE_CASE）
- [ ] 注释仅用于关键逻辑/边界条件/复杂状态流（工程模式）
- [ ] 无 `console.log`（仅允许 console.warn/error/info）

## 4. 架构合规

- [ ] 未绕过状态机守卫直接修改状态
- [ ] 未在子组件中直接操作 localStorage
- [ ] 路由跳转使用 navigation.ts 的 goTo* 函数（非 window.location.hash 硬编码）
- [ ] 数据操作通过 Repository/Store 层（非直接 fetch）

## 5. AI 产物检查

- [ ] 无死代码（定义了但未使用）
- [ ] 无过度抽象（不要为了"将来可能用"创建接口/工具函数）
- [ ] 无过度注释（不要"每一行都加注释"）
- [ ] 无 `@ts-ignore` / `@ts-expect-error`（除非有 Issue 引用）

## 6. QA 验证

- [ ] 核心场景手动验证通过
- [ ] 边界条件（空数据、错误输入、网络异常）验证通过
- [ ] UI 变更：检查响应式布局、暗色模式、加载态、空态、错误态

---

## Review 结论

- [ ] **APPROVED** — 全部通过，可合并
- [ ] **CHANGES REQUESTED** — 具体问题：[列出需要修改的项]
- [ ] **BLOCKED** — 存在架构性问题，需架构团队介入
