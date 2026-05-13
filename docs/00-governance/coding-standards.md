---
id: DOC-GOVERNANCE-CODING-STANDARDS
number: GOV-002
domain: governance
category: coding-standards
title: 编码规范
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code: []
related_docs:
  - quality-metrics.md
  - git-governance.md
  - code-review-checklist.md
---

# 编码规范

## Clause 1. 铁律

### 1.1 [强制] 代码质量规则

| 编号  | 规则                        | 级别 |
| ----- | --------------------------- | ---- |
| 1.1.1 | 禁止 `console.log` 提交     | 强制 |
| 1.1.2 | 禁止 `any` 类型             | 强制 |
| 1.1.3 | 禁止死代码/未使用的 import  | 强制 |
| 1.1.4 | 必须处理 async/await 的异常 | 强制 |
| 1.1.5 | 变量/函数命名必须有意义     | 强制 |
| 1.1.6 | 组件必须有明确的 props 接口 | 强制 |

---

## Clause 2. 命名规范

### 2.1 [强制] 通用规则

**2.1.1 [强制]** 文件名：`kebab-case`（短横线分隔），如 `user-profile.tsx`、`api-client.ts`。

### 2.2 [强制] 组件命名

**2.2.1 [强制]** 组件名：`PascalCase`，如 `UserProfile`、`ApiClientProvider`。

### 2.3 [强制] 函数与变量

**2.3.1 [强制]** 函数/变量名：`camelCase`，如 `getUserById`、`isLoading`。

**2.3.2 [强制]** 布尔变量前缀：`is`、`has`、`should`，如 `isVisible`、`hasPermission`。

### 2.4 [强制] 常量

**2.4.1 [强制]** 常量名：`UPPER_SNAKE_CASE`，如 `MAX_RETRY_COUNT`、`API_BASE_URL`。

### 2.5 [强制] 类型定义

**2.5.1 [强制]** 接口/类型名：`PascalCase`，如 `UserProfile`、`ApiResponse`。

---

## Clause 3. 代码风格

### 3.1 [强制] 缩进与分号

**3.1.1 [强制]** 使用 2 空格缩进。

**3.1.2 [强制]** 必须使用分号结尾。

### 3.2 [强制] 引号

**3.2.1 [强制]** 字符串使用单引号 `' '`。

**3.2.2 [强制]** JSX 属性使用双引号 `" "`。

### 3.3 [推荐] 尾逗号

**3.3.1 [推荐]** 多行对象/数组使用尾逗号。

### 3.4 [强制] 导入顺序

**3.4.1 [强制]** 导入分组顺序：外部库 → 内部模块 → 样式文件，每组间空一行分隔。

### 3.5 [强制] 组件导出

**3.5.1 [强制]** 组件使用命名导出（named export），不使用默认导出。

### 3.6 [推荐] 代码长度

**3.6.1 [推荐]** 单行不超过 100 字符。

**3.6.2 [推荐]** 单个函数不超过 50 行。

**3.6.3 [推荐]** 单个组件不超过 200 行。

### 3.7 [强制] 注释

**3.7.1 [强制]** 禁止提交注释掉的代码块。

**3.7.2 [推荐]** 复杂逻辑必须写注释说明意图。

---

## Clause 4. TypeScript 规范

### 4.1 [强制] 类型显式声明

**4.1.1 [强制]** 函数参数和返回值必须显式声明类型。

**4.1.2 [强制]** 禁止隐式 `any`。

### 4.2 [强制] 严格模式

**4.2.1 [强制]** `tsconfig.json` 必须启用 `strict: true`。

**4.2.2 [强制]** 禁止使用 `as` 类型断言（如 `value as Type`），改用类型守卫或显式声明。

**4.2.3 [强制]** 禁止使用 `// @ts-ignore` 或 `// @ts-expect-error`。

### 4.3 [强制] 接口与类型

**4.3.1 [强制]** Props 必须定义接口，使用 `interface` 而非 `type`。

**4.3.2 [强制]** React 组件 Props 接口命名以 `Props` 结尾，如 `UserProfileProps`。

### 4.4 [推荐] 泛型

**4.4.1 [推荐]** 复用逻辑优先使用泛型而非 `any`。

### 4.5 [强制] Enum

**4.5.1 [强制]** 使用 `const enum` 或联合类型替代普通 `enum`。

---

## Clause 5. React / Next.js 规范

### 5.1 [强制] 组件定义

**5.1.1 [强制]** 使用函数组件 + Hooks，不使用 class 组件。

### 5.2 [强制] 状态管理

**5.2.1 [强制]** 优先使用 React Context + useReducer / Zustand，避免 prop drilling。

### 5.3 [强制] 性能

**5.3.1 [强制]** 列表渲染必须有唯一 `key`。

**5.3.2 [推荐]** 消耗大的计算使用 `useMemo` / `useCallback`。

### 5.4 [强制] 数据获取

**5.4.1 [强制]** API 调用必须包装在 try/catch 中。

**5.4.2 [推荐]** 优先使用 Server Component 获取数据，减少客户端请求。

### 5.5 [强制] shadcn/ui

**5.5.1 [强制]** UI 组件优先使用 shadcn/ui 内置组件。

**5.5.2 [强制]** 自定义组件风格必须与 shadcn/ui 保持一致。

### 5.6 [强制] App Router 约定

**5.6.1 [强制]** 遵循 Next.js App Router 文件命名约定：`page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`、`not-found.tsx`。

**5.6.2 [强制]** 组件默认为 Server Component，仅在需要交互性（事件处理、状态、浏览器 API）时添加 `'use client'`。

**5.6.3 [强制]** Server Component 禁止使用 Hooks、事件监听器或浏览器专属 API。

**5.6.4 [推荐]** 数据获取优先在 Server Component 中完成，减少客户端请求次数。

---

## Clause 6. 错误处理规范

> 统一的错误处理是系统健壮性的基础。本条款定义前后端共享的错误处理规范。

### 6.1 [强制] API 层错误处理

**6.1.1 [强制]** 所有 API 路由处理函数必须包裹在 try/catch 中，不遗漏异常路径。

**6.1.2 [强制]** API 错误响应使用统一格式：`{ success: false, error: { code: string, message: string } }`。

**6.1.3 [强制]** 错误处理逻辑集中在中间件或工具函数中，不在每个路由中重复编写。

### 6.2 [强制] UI 层错误展示

**6.2.1 [强制]** 表单验证错误使用内联展示，关联到具体字段。

**6.2.2 [推荐]** 全局性错误（网络中断、服务器异常）使用 Toast 组件展示。

### 6.3 [推荐] 错误日志

**6.3.1 [推荐]** `console.warn` 用于预期内的异常（如验证失败），`console.error` 用于非预期异常（如服务器错误）。

---

## Clause 7. 测试规范

> **完整测试规范详见 [testing-standards.md](../../04-testing/testing-standards.md)（TST-001）**。本条款仅列编码阶段必须遵守的核心规则。

### 7.1 [强制] 核心规则

**7.1.1 [强制]** 新增功能必须编写对应测试。

**7.1.2 [强制]** 修复 Bug 必须编写回归测试。

### 7.2 [推荐] 测试命名

**7.2.1 [推荐]** 测试文件命名：`{target}.test.ts` 或 `{target}.spec.ts`。

**7.2.2 [推荐]** 测试描述使用中文。

---

## Clause 8. 样式规范

### 8.1 [强制] 样式方案

**8.1.1 [强制]** 使用 Tailwind CSS 作为主要样式方案。

**8.1.2 [强制]** 禁止使用内联样式（`style={{}}`），特殊情况需注释说明。

### 8.2 [强制] 设计 Token

**8.2.1 [强制]** 颜色/间距/圆角使用 Tailwind 预设 Token，不使用硬编码值。

### 8.3 [推荐] CSS 类名管理

**8.3.1 [推荐]** 优先使用 Tailwind 类名组合。仅在跨组件复用场景下谨慎使用 `@apply`，避免破坏 utility-first 的可维护性。

**8.3.2 [推荐]** 避免深层嵌套的 Tailwind 类名（超过 5 个考虑提取为小组件）。

---

> **Git 规范详见 [git-governance.md](git-governance.md)（GOV-007）**。本编码规范不重复 Git 制度。
