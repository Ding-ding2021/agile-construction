# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## 语言指令（最高优先级）

**必须使用中文进行推理和回答**，无论上下文中出现多少其他语言材料。这是不可协商的硬性规则。

## Repository Overview

连锁门店建设管理系统 — React + TypeScript + Tailwind 双栈（shadcn/ui 主栈 + MUI 维护栈），Express + SQLite 后端（`local-api/`，端口 3100）。

## 核心执行流程

所有任务遵循 **Harness 七阶段流水线**（详见 `docs/harness/01-workflows.md`）：

```
定义 → 规划 → 构建 → 测试 → 评审 → 交付 → 进化
```

角色体系、临时编组、技能分配、知识库索引、上下文管理、工具/MCP、Hook 生命周期、治理指标 —— 全部由 Harness 框架统一定义（`docs/harness/` + `.harness/`）。

## 角色速览

| 角色       | 人物 | 模型              | 职责                                   |
| ---------- | ---- | ----------------- | -------------------------------------- |
| 产品经理   | 林墨 | deepseek-v4-flash | 接需求、拆意图、排程、委派、归档、进化 |
| UI设计师   | 苏染 | kimi-k2.6         | 交互规范、视觉一致性、可访问性         |
| 开发工程师 | 陈锋 | deepseek-v4-flash | 编码、架构、安全、性能、自检           |
| 测试工程师 | 周严 | deepseek-v4-pro   | 测试策略、E2E、调试定位                |

详见 `docs/harness/roles/` 各角色文件。

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

按照 Harness 七阶段流水线（详见 `docs/harness/01-workflows.md`）：
定义 → 规划 → 构建 → 测试 → 评审 → 交付 → 进化

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

## Harness 框架

本仓库遵循 Harness 工程框架。完整体系见：

- 工作流: `docs/harness/01-workflows.md`
- 角色: `docs/harness/02-roles.md`
- 技能: `docs/harness/03-skills.md`
- 知识库: `docs/harness/04-knowledge-base.md`
- 治理: `docs/harness/09-governance.md`
- 配置: `.harness/registry.yaml`
