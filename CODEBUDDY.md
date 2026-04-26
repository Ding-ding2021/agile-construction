# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## 常用命令

- **安装依赖**：`npm install`
  - 首次拉取仓库后执行，安装 React + Vite + TypeScript + ESLint 相关依赖。

- **本地开发**：`npm run dev`
  - 启动 Vite 开发服务器（默认热更新）。用于日常页面联调与交互验证。

- **生产构建**：`npm run build`
  - 先执行 `tsc -b` 做类型构建，再执行 `vite build` 打包前端产物。

- **代码检查**：`npm run lint`
  - 对整个仓库运行 ESLint。

- **运行测试**：`npm run test:run`
  - 运行 Vitest 测试套件（任务模块已覆盖 63 个测试用例）。

- **本地预览构建产物**：`npm run preview`
  - 在本地启动构建后静态预览服务，验证打包结果是否可正常访问。

- **单文件校验（替代单测）**：`npx eslint src/components/task/TaskManagementPage.tsx`
  - 当前 `package.json` 未配置测试脚本；如需“单点验证”，按文件运行 ESLint。

## 高层架构（Big Picture）

## 1) 运行时入口与路由编排

- 应用入口是 `src/main.tsx`，仅挂载 `App` 与全局样式。
- 真正的应用编排集中在 `src/App.tsx`：
  - 使用 **Hash 路由**（如 `#/projects`、`#/tasks`、`#/personnel`、`#/digital-employee`）。
  - `readRouteFromHash` 负责将 hash 解析为统一 `AppRoute` 联合类型。
  - 项目详情、新建草稿、模板详情等都由 hash + query 参数驱动。
- 这是一个“**单入口控制多页面**”的前端架构：跨页面跳转与状态透传都在 `App.tsx` 做。

## 2) 关键状态与持久化边界

- `App.tsx` 持有两份核心状态：
  - `projectsState`：项目主数据。
  - `projectStatusLogs`：项目状态流转与联动日志。
- 两者分别持久化到 `localStorage`（`pm-projects-state-v1`、`pm-project-logs-v1`）。
- 这意味着当前系统的“数据后端”仍是浏览器本地，适合演示与流程验证，不是服务端权威数据源。

## 3) 项目域：状态机驱动的流程主线

- 项目状态定义与守卫逻辑在 `src/domain/projectStatusMachine.ts`：
  - 定义状态集合（待立项→待确认→待拆解→执行中→待验收→待结算→已归档等）。
  - `allowedTransitions` 明确合法流转。
  - `canTransition` 结合 `GuardContext` 执行守卫校验（里程碑、任务树、验收结果、结算完成等）。
- `App.tsx` 的 `transitionProjectStatus` 是统一状态更新入口：
  - 做守卫验证。
  - 更新项目状态、阶段、色调、进度下限。
  - 生成状态日志与 hook 日志。
- 项目详情页 `ProjectDetailPage` 通过 props 消费这些能力，自己不重建状态机。

## 4) 数据分层：基础 mock + 业务增强字段

- `src/data/projects.ts` 将 `personnel` 域的基础 `mockProjects` 二次加工为 `ProjectItem`：
  - 在基础字段上补充派单/回传/验收/结算等闭环字段（`dispatchStatus`、`executionStatus`、`acceptanceStatus`、`settlementStatus`）。
  - 统一状态归一化（`normalizeProjectStatus`）与视觉映射（`getProjectStatusTone`）。
  - 提供新建项目、草稿项目、项目编码生成等工厂函数。
- 这是一个“**展示与流程字段合并在前端模型**”的策略，方便快速迭代 UI 和流程。

## 5) 任务域：页面内闭环 + 选择器管道

- 任务模型在 `src/components/task/taskManagement.types.ts`，覆盖状态、SLA、风险、关联、流转日志等。
- 任务样例与详情拼装在 `taskManagement.data.ts`：
  - `mockTasks` 为主样本。
  - 支持按模板 ID 生成任务子集（通过 hash query 传参）。
  - `buildTaskDetailMapByTasks` 将列表项扩展为详情结构。
- 任务筛选处理在 `taskManagement.selectors.ts`：
  - `filter -> search -> advancedFilter -> sort -> paginate` 的确定性管道。
- `TaskManagementPage.tsx` 负责页面级状态推进（催办、状态前进、SLA重算），目前主要在前端本地闭环。

## 6) 页面组织与复用模式

- `components/project/*`：项目详情 8 标签视图（项目概览、范围与任务、进度管理、成本与采购、质量与验收、资源与人员、风险与沟通、设置与 Agent），按 PMBOK 领域组织。
- `components/task/*`：任务中心列表与详情。
- `components/personnel/*`：人员中心及项目相关辅助视图。
- `components/digital/*`、`components/settings/*`：数字员工与系统设置入口页，当前以演示/配置展示为主。
- 共享布局组件有两套侧边栏（`layout/Sidebar.tsx` 与 `personnel/Sidebar.tsx`）+ 统一头部组件，均通过 hash 导航。

## 7) 视觉与样式系统

- 全局样式在 `src/index.css`，页面局部样式分散在各模块 CSS。
- 视觉基线由 `docs/00-governance/design-specification.md` 定义（深色玻璃态、统一圆角与交互动效）。
- UI 资源依赖大量静态资产（`assets/`、`public/`），许多页面图标与装饰图直接从资产目录引用。

## 8) README 与当前工程现实

- 根 `README.md` 仍是 Vite 模板说明，不反映业务架构现状。
- 实际业务结构以 `src/App.tsx` + `src/domain/*` + `src/data/*` + `src/components/*` 为准；后续改动应以这些文件为主线理解系统。

## 9) 设计规范参考

- **设计规范**：`docs/00-governance/design-specification.md` — 视觉基线（深色玻璃态、统一圆角与交互动效）
- **编码规范**：`docs/00-governance/coding-standards.md` — TypeScript/React 编码标准
- **开发指南**：`docs/03-engineering/development-guide.md` — 本地开发与调试流程
- **完整文档索引**：`docs/README.md` — 仓库全部 83 篇文档的统一导航入口
