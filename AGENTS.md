# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## 语言指令（最高优先级）

**必须使用中文进行推理和回答**，无论上下文中出现多少其他语言材料。这是不可协商的硬性规则。

## Repository Overview

连锁门店建设管理系统 — React + TypeScript + Tailwind 双栈（shadcn/ui 主栈 + MUI 维护栈），Express + SQLite 后端（`local-api/`，端口 3100）。

## 核心执行流程

对于每一个用户请求：

1. 判断风险等级（L1/L2/L3），L2+ → 触发 `squad-pre-dev-evaluation`
2. 匹配适用 skill（即使只有 1% 相关），调用 `skill` 工具
3. 严格遵循 skill 工作流，不部分执行
4. 完成后执行质量门禁：`npm run lint` → `npm run build` → `npm run test:e2e`

## 角色体系

| 角色                   | 职责                                       | 触发时机            |
| ---------------------- | ------------------------------------------ | ------------------- |
| 开发交付者             | 编码实现，必须先调用 `karpathy-guidelines` | 所有编码任务        |
| 评估组（产品/UI/技术） | 并行 fan-out 评估，独立输出报告，组长合并  | L2+ 任务，编码前    |
| 验收组（功能/代码/UI） | 并行 fan-out 验收，独立输出报告，组长仲裁  | 任务完成后          |
| 组长                   | 合并报告、仲裁反对票                       | 评估/验收中出现反对 |

角色约束：

- 评估组和验收组并行 fan-out，不共享状态
- 组长不参与具体评估/验收内容，只做仲裁
- 增量重审：验收打回后仅派有问题的角色重审，不重新全量调用

## 意图 → Skill 映射

| 用户意图                       | 触发 Skill                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------- |
| 沟通需求 / 讨论方案 / 创意构思 | `brainstorming`                                                                  |
| 新增功能 / 页面 / 组件         | `karpathy-guidelines` → `frontend-ui-engineering` → `incremental-implementation` |
| 修复 Bug / 异常行为            | `debugging-and-error-recovery`                                                   |
| 重构 / 简化代码                | `code-simplification`                                                            |
| 代码审查                       | `code-review-and-quality`                                                        |
| API / 接口设计                 | `api-and-interface-design`                                                       |
| UI 布局 / 样式调整             | `ui-layout-rules`                                                                |
| 性能优化                       | `performance-optimization`                                                       |
| E2E 测试 / 浏览器验证          | `browser-testing-with-devtools`                                                  |
| **任务开始前（L2+）**          | `squad-pre-dev-evaluation`                                                       |
| **任务完成后**                 | `squad-post-dev-review`                                                          |
| **任何编码前**                 | `karpathy-guidelines`                                                            |

## 开发阶段 → Skill 串联

```
评估 → 计划 → 编码 → 验证 → 验收 → 交付
  ↓      ↓      ↓      ↓      ↓      ↓
squad-  plan-  karpa-  lint  squad-  lint +
pre-    ning-  thy-    +    post-   build +
dev-    and-   guide-  build dev-    test:e2e
eval    task-  lines   +    review
(L2+)   break- +incr-  test
        down   emental
```

## 硬性规则

- 所有推理和回答必须使用中文（代码、术语、路径除外）
- **禁止**在 `src/`（MUI）中新增功能 — 新功能一律在 `src-next/`
- **禁止**绕过 `canTransition` 守卫直接修改 `project.status`
- **禁止**在组件中直接 `localStorage.setItem` — 统一通过 `useProjectStore`
- 前端功能必须有 Playwright E2E 测试覆盖，`npm run test:e2e` 未通过不得交付
- 修改前先 `npm run lint`
- 新增文件前先看同级目录现有文件的模式，模仿其写法

## 反作弊检查

以下想法是错误的，必须忽略：

- "这个改动太小，不需要 skill"
- "L1 任务不需要 karpathy-guidelines"
- "我先直接改 `src/` 里的旧代码，只是修一下"
- "lint 报错只是 warning，没关系"
- "代码写完了就算完成"

正确行为：

- 任何编码前先调用 `karpathy-guidelines`
- L2+ 任务编码前先通过 `squad-pre-dev-evaluation`
- 新功能永远在 `src-next/`，不动 `src/`
- 完成的标志是 `lint` + `build` + `test:e2e` 全通过，而非代码写完
- 任务完成后必须调用 `squad-post-dev-review`

## 常用命令

| 用途                  | 命令                                                |
| --------------------- | --------------------------------------------------- |
| 开发（shadcn）        | `npm run dev`                                       |
| 开发（MUI，仅修 bug） | `npm run dev:legacy`                                |
| 本地全栈              | `npm run dev:local`                                 |
| 构建                  | `npm run build` / `npm run build:legacy`            |
| 代码检查              | `npm run lint`                                      |
| 单元测试              | `npm run test:run` / `npm run test:run -w src-next` |
| E2E 测试              | `npm run test:e2e` / `npm run test:e2e:ui`          |
| 单文件检查            | `npx eslint <file>`                                 |

Pre-commit：`.husky/pre-commit` 自动执行 `lint-staged` + `tsc --noEmit`
Prettier：`semi: false, singleQuote: true, printWidth: 100, arrowParens: avoid`

## 架构速查

| 做什么          | 找这里                                        |
| --------------- | --------------------------------------------- |
| 改路由 / 加页面 | `src-next/App.tsx` → BrowserRouter `<Routes>` |
| 改导航跳转      | `src-next/components/app-sidebar.tsx`         |
| 改状态流转规则  | `src/domain/projectStatusMachine.ts`          |
| 改项目数据模型  | `src/data/projects.ts` → `ProjectItem`        |
| 改 shadcn 组件  | `src-next/components/ui/`                     |
| 改业务组件      | `src-next/components/` 对应 domain 子目录     |
| 改全局样式      | `src-next/index.css` → `@theme` + CSS 变量    |
| 改数据层        | `src-next/services/api.ts`                    |
| 改类型定义      | `src-next/types/`                             |

关键信息：

- 状态管理：`src/store/projectStore.ts`（Zustand + `persist`），localStorage key `pm-projects-state-v1`
- 样式：Tailwind CSS v4，oklch 色值
- 路由：BrowserRouter（`/tasks`, `/projects`, `/personnel` 等）

## 任务结束协议

每次完成开发任务后：

1. 调用 `task-memory` 工具写入 `.workbuddy/memory/YYYY-MM-DD.md`（模板见 `docs/00-governance/project-management-guide.md`）
2. 质量数据写入 `.workbuddy/stats/YYYY-MM-DD.json`
3. 运行 `python scripts/scan-tools.py --report` 更新仪表盘

## 按需查阅文档

规范文档不预加载，用 Read 工具在需要时查阅：

- 编码规范: `docs/00-governance/coding-standards.md`
- 开发指南: `docs/03-engineering/development-guide.md`
- 设计规范: `docs/01-product/design-spec-v2-shadcn.md`
- 项目管理: `docs/00-governance/project-management-guide.md`
- 完整索引: `docs/README.md`
