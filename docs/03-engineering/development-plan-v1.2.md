---
id: DOC-03-ENGINEERING-DEVELOPMENT-PLAN-V1-2
title: 连锁门店营建管理系统 - 详细开发计划 V1.2
owner: docs-maintainer
<<<<<<< Updated upstream
status: active
last_updated: 2026-05-06
=======
status: draft
last_updated: 2026-05-03
>>>>>>> Stashed changes
source_of_truth: true
related_docs:
  - docs/01-product/product-roadmap-v1.2-draft.md
  - docs/03-engineering/component-refactoring-plan.md
  - docs/02-architecture/state-machine-design.md
  - docs/04-operations/phase4/development-progress-assessment-2026-04-23.md
  - docs/PLAN.md
---

# 连锁门店营建管理系统 - 详细开发计划 V1.2

<<<<<<< Updated upstream
> **文档版本**：V1.1  
> **适用场景**：单人 + AI 编码模式（基于 MUI v9 旧栈）  
> **计划性质**：工程任务分解（不考虑日历时间，按依赖关系排序）  
> **当前基线**：Phase 1 已完成，Phase 1.5 进行中（底座收官）  
> **核心原则**：先还技术债务，再补功能；状态机驱动；标准先行  
> **注意**：本文档描述的是 MUI v9 + `src/` 旧栈的开发计划。2026-05-06 起 UI 主栈已切换为 shadcn/ui（`src-next/`），旧栈仅维护不新增。新栈开发计划待 V2.0 升版。
=======
> **文档版本**：V1.2
> **适用场景**：单人 + AI 编码模式
> **计划性质**：工程任务分解（不考虑日历时间，按依赖关系排序）
> **当前基线**：Phase 1 全部完成，Phase 1.5 全部完成（底座搭建与收尾）
> **核心原则**：按数据依赖关系分层推进—「任务是原子 → 标准定义规则 → 模板组合任务 → 项目实例化模板」
> **架构调整**（2026-05-03）：重组——每阶段聚焦单一领域，打通一个完整闭环后再进入下一领域
>>>>>>> Stashed changes

---

## 0. 当前基线与债务清单

### 0.1 已完成资产（Phase 1 + 1.5 产出）

| 资产             | 状态    | 说明                                                           |
| ---------------- | ------- | -------------------------------------------------------------- |
| 需求文档体系     | ✅ 完整 | 10+ PRD，字段级定义，状态机规则清晰                            |
| 前端工程基础     | ✅ 可用 | React 18.3 + TS + Vite + Tailwind，Hash 路由，懒加载           |
| 共享组件体系     | ✅ 统一 | AppSidebar / PageHeader / StatsCards / TabNav 全站统一         |
| CSS Token 体系   | ✅ 完成 | `:root` 75 个统一 Token，全站硬编码清零，渐变 Token 化         |
| 路由集中化       | ✅ 完成 | `routes.ts` + `navigation.ts` 集中管理路由和导航               |
| Zustand 状态管理 | ✅ 完成 | `projectStore.ts` + persist，取代 App.tsx 内联状态             |
| 本地后端         | ✅ 完成 | Node.js + Express + better-sqlite3 + Prisma Schema，实体 CRUD  |
| 前端数据层       | ✅ 完成 | `services/repositories/` + `services/api/` API 优先 + 降级策略 |
| PMBOK 8 标签框架 | ✅ 完成 | 标签壳子就绪，详情页结构已建                                   |
| 项目/任务状态机  | ⚠️ 骨架 | 状态定义和基础守卫存在，但联动为 mock，前置依赖/标准绑定为假   |

### 0.2 当前债务清单（Phase 2 前置）

| 债务项                             | 影响                                       | Phase 2 清偿方案                    |
| ---------------------------------- | ------------------------------------------ | ----------------------------------- |
| 任务 parentTaskId = null           | 任务树靠 `parentPath` 字符串拆分，无法查询 | P2-T1 真实父子层级建模              |
| 标准绑定为文本字符串               | 标准快照无法追溯，检查项无法自动生成       | P2-T1 改为 ID 引用 + 快照自动生成   |
| 任务检查项无独立实体               | 检查项录入/验收判定逻辑处于 mock           | P2-T5 checklist_items 表            |
| 任务状态机守卫为 mock              | 状态流转不受真实数据约束                   | P2-T2 守卫条件全部真实化            |
| 前置依赖为假                       | 任务阻塞逻辑不工作                         | P2-T3 task_relations 实体表         |
| 整改派生缺失                       | 验收不通过无法自动生成整改任务             | P2-T3 整改派生自动化                |
| 派单/接单/改派流程不存在           | 任务分配缺业务闭环                         | P2-T3 派单流程                      |
| 任务数据流未脱离 localStorage      | 无法持久化细粒度任务操作                   | P2-T4 API + Repository 完善         |
| MUI 残留（任务模块 23 组件）       | sx prop 与 Tailwind 冲突，AI 生成质量差    | **2-A shadcn 试点替换**             |
| 双重持久化（Zustand + Repo）       | 并发写冲突，数据丢失风险                   | P2-T4 统一写路径                    |
| mock 数据绕过 store                | 运行时创建的数据无法被查询函数返回         | P2-T4 getProjectByCode 切 store     |
| JSON 字段滥用（8 个字段）          | SQL 无法查询内嵌数据，无 schema 校验       | P2-T5 subStatusJson → 独立子表      |
| 字段类型混用（String 存日期/金额） | 无法排序/计算/聚合                         | P2-T1 DateTime/Decimal/Int 类型修正 |
| API 字段白名单仅 18/58             | API 写入静默丢弃字段                       | P2-T4 白名单扩展到 ≥50              |

---

## 1. Phase 1：底座搭建

**目标**：消除技术债务，建立可维护的工程底座，让前端从「页面演示」进入「数据可持久化」阶段。

**前置条件**：无（当前基线即为起点）

---

### P1-T1 共享组件补齐与存量替换

- **目标**：完成 `component-refactoring-plan.md` 中定义的全部共享组件开发，并将所有业务模块迁移到新组件。
- **执行要点**：
  1. 补齐 `AppSidebar` 收起/展开、嵌套菜单支持
  2. 补齐 `PageHeader` 面包屑、`dark` 变体
  3. 补齐 `StatCard` delta 趋势、点击筛选、active 状态
  4. 新增 `TabNav` 组件（项目详情 8 标签共用）
  5. 按「personnel → task → digital → procurement → project → 其他」顺序逐个替换
  6. 删除废弃的 `layout/Sidebar.tsx`、`personnel/Sidebar.tsx`、`task/TaskSidebar.tsx` 等
- **前置依赖**：无
- **验收标准**：
  - `npm run build` 零报错
  - `npm run lint` 零报错
  - 所有页面侧边栏、页头、统计卡片功能正常
  - 新增路由只需修改 `src/config/routes.ts` 一处
- **技术要点**：
  - 保留旧代码 1 个迭代周期，确认稳定后删除
  - 每次替换后立即验证对应模块路由跳转
  - 禁止在替换过程中修改业务逻辑，仅做组件替换

---

### P1-T2 CSS 变量体系统一与硬编码清零

- **目标**：将 `src/index.css` 中已定义的 `--pm-*` 变量全面落地，各模块 CSS 硬编码色值清零。
- **执行要点**：
  1. 对照 `design-specification.md` 补齐缺失变量（radius、shadow、font、gap、margin、功能色）
  2. 从 `digital-employee-page.css`（17KB）开始替换
  3. 依次替换 `procurement-management.css`（10KB）、`project-detail.css`（43KB）
  4. 其余模块 CSS 逐个清理
  5. 建立 CSS 变量使用规范：`禁止使用任何非 var() 的颜色/间距/圆角值`
- **前置依赖**：P1-T1（组件替换后样式影响面最小）
- **验收标准**：
  - 全局搜索 `#`、`rgba(`、`rgb(` 在 `.css` 文件中仅出现在 `index.css` 的变量定义区
  - 所有页面视觉回归通过（与原设计一致）
- **技术要点**：
  - 使用 `grep -r "rgba\|#" src/**/*.css` 做自动化检查
  - 暗色玻璃态主题下，MUI 组件通过 `theme.ts` 统一覆盖，不另写 CSS

---

### P1-T3 路由配置集中化与导航统一

- **目标**：将分散在 `App.tsx`、`各 Sidebar`、`各 PageHeader` 中的路由逻辑集中到 `src/config/routes.ts`。
- **执行要点**：
  1. 创建 `src/config/routes.ts`，定义 `ROUTES` + `NAV_ITEMS` + `readRouteFromHash`
  2. 创建 `src/config/navigation.ts`，定义菜单层级与权限可见性
  3. 在 `App.tsx` 中引用集中配置，删除内联路由常量
  4. 统一 `navigateByHash` 和 `isActive` 逻辑到 `nav.utils.ts`
  5. 新增 `#/workbench` 路由（为 Phase 5 预留）
- **前置依赖**：P1-T1
- **验收标准**：
  - 新增一个路由只需修改 `routes.ts` 和 `App.tsx` 的懒加载声明
  - 所有页面导航激活状态正确
  - 路由跳转无 404
- **技术要点**：
  - 路由配置同时驱动 `AppSidebar` 渲染和 `App.tsx` 页面分发
  - 保留 Hash 路由，V2 再评估 BrowserRouter

---

### P1-T4 本地后端 Schema 实体化

- **目标**：将 local-api 从「大快照 JSON」模式重构为「结构化实体表 + RESTful API」模式，支撑细粒度 CRUD 和跨表关联。
- **执行要点**：
  1. 重新设计 `schema.sql`，按业务实体建表：
     - `projects`（项目实体）
     - `project_stages`（项目阶段）
     - `project_milestones`（里程碑）
     - `tasks`（任务实体，含 `parent_task_id`）
     - `task_relations`（任务前置依赖）
     - `standards`（标准来源）
     - `standard_clauses`（标准条款）
     - `standard_snapshots`（标准快照）
     - `procurements`（采购申请/订单）
     - `acceptance_nodes`（验收节点）
     - `acceptance_checkitems`（验收检查项）
     - `assets`（资产台账）
     - `audit_logs`（已有，增强字段）
     - `users` / `roles` / `permissions`（基础权限）
  2. 使用 Prisma 作为 ORM，替换手写 SQL
  3. 创建 `prisma/schema.prisma`，定义模型和关系
  4. 生成迁移脚本
  5. 更新 `server.ts`，按 RESTful 风格重构路由（`/api/projects`、`/api/tasks/:id` 等）
  6. 保留幂等机制，扩展到所有写接口
- **前置依赖**：无（可与 P1-T1~T3 并行）
- **验收标准**：
  - Prisma 可正常 migrate 和 generate
  - 新 API 通过 `test-api.sh` 或 Postman 集合验证
  - 各实体表可独立 CRUD，非快照覆盖
  - 外键关系正确（如 `task.project_id` → `project.id`）
- **技术要点**：
  - Prisma 的 SQLite provider 后期可平滑切到 PostgreSQL
  - 审计日志表继续手写 SQL（绕开 ORM，保证灵活性）
  - 初期保留旧快照接口作为 fallback，新旧并存 1 个迭代

---

### P1-T5 前端数据层抽象（API 适配器）

- **目标**：建立 `services/` 层，统一封装对 local-api 的调用，使前端从直接操作 localStorage 迁移到调用后端 API。
- **执行要点**：
  1. 创建 `src/services/api/client.ts`：基于 `fetch` 的 HTTP 客户端，统一处理 CORS、错误、幂等键注入
  2. 创建 `src/services/api/projects.ts`、`tasks.ts`、`standards.ts`、`procurements.ts` 等模块 API
  3. 创建 `src/services/repositories/` 下的仓库模式实现（已有骨架，需扩展）
  4. 在 `App.tsx` 中替换 `localStorage` 读写为 API 调用
  5. 实现离线降级：API 不可用时 fallback 到 localStorage
  6. 统一错误处理：网络错误 → Toast 提示；业务错误 → 表单反馈
- **前置依赖**：P1-T4（需要结构化 API 才能对接）
- **验收标准**：
  - 项目列表、任务列表数据来自 API 而非 localStorage
  - 刷新页面后数据持久存在（SQLite）
  - local-api 未启动时，系统仍能降级运行（localStorage fallback）
- **技术要点**：
  - API 模块类型定义与 `local-api/contracts.ts` 对齐
  - 引入 React Query 或 SWR（可选，V1 可用 useEffect + useState 简化）
  - 所有写操作携带 `X-Idempotency-Key`

---

### P1-T6 状态机联动真实化

- **目标**：将 `projectStatusMachine.ts` 中的 mock 联动字符串替换为真实业务动作调用。
- **执行要点**：
  1. 修改 `enterStatusHooks` 定义：从字符串数组改为动作函数数组
  2. 定义联动动作接口：
     - `待拆解` → 调用任务树初始化 API
     - `执行中` → 启动催办/预警定时检查
     - `待验收` → 生成验收摘要和检查项
     - `整改中` → 汇总未通过任务
     - `待结算` → 触发结算建议生成
  3. 在 `App.tsx` 的 `transitionProjectStatus` 中，状态流转成功后顺序执行联动动作
  4. 联动动作失败不阻断状态流转，但需记录警告日志
  5. 为项目状态机编写单元测试（覆盖所有合法流转和非法拦截）
- **前置依赖**：P1-T5（联动动作需要调用真实 API）
- **验收标准**：
  - 项目从「待拆解」流转到「执行中」后，任务树真实生成（可查 API）
  - 项目进入「待验收」后，验收检查项真实生成
  - 状态流转日志记录联动动作执行结果
  - 单元测试覆盖全部守卫条件
- **技术要点**：
  - 状态机定义文件（`domain/` 层）**禁止 AI 直接修改**，人工维护
  - 联动动作封装为独立 `hooks/` 函数，便于测试和复用
  - 每个联动动作需支持「人工跳过」标记

---

### P1-T7 项目详情页 PMBOK 8 标签基础框架

- **目标**：将现有项目详情页从「6 生命周期标签」重构为「8 PMBOK 领域标签」的壳子结构，为后续 Phase 填充内容。
- **执行要点**：
  1. 新建/重命名标签组件：
     - `ProjectOverviewTab`（项目概览）
     - `ProjectScopeTab`（范围与任务）← 合并现有 plan + WBS
     - `ProjectScheduleTab`（进度管理）← 甘特图
     - `ProjectCostTab`（成本与采购）← 新增壳子
     - `ProjectQualityTab`（质量与验收）← 合并验收相关
     - `ProjectResourcesTab`（资源与人员）← 合并人员
     - `ProjectRiskTab`（风险与沟通）← 合并风险
     - `ProjectSettingsTab`（设置与 Agent）← 新增壳子
  2. 修改路由参数：`#/projects/:code/:tab` 的值从生命周期标识改为领域标识
  3. 修改 `buildProjectDetailTabHash` 和 `isProjectDetailTab`
  4. 标签切换时独立加载数据（避免一次性全量加载）
  5. 权限控制：不同角色可见不同标签（V1 先硬编码，V1.5 接入权限系统）
- **前置依赖**：P1-T1（TabNav 组件）、P1-T3（路由集中化）
- **验收标准**：
  - 8 个标签可正常切换，URL hash 同步更新
  - 每个标签有独立的加载状态和空态
  - 现有「项目概览」内容迁移到新框架不丢失
  - `npm run build` 零报错
- **技术要点**：
  - 标签组件按 `components/project/tabs/` 子目录组织
  - 领域标签与状态机正交：切换标签不触发状态变化
  - 各标签数据通过独立 API 获取（如 `/api/projects/:code/schedule`）

---

## 1.5. Phase 1.5：底座收官与视觉统一

**目标**：清偿 Phase 1 遗留技术债务，统一页面壳层、CSS Token、统计卡片与组件体系，为 Phase 2 功能开发扫清障碍。

**前置条件**：Phase 1 全部完成

---

### P1.5-T1 页面壳层统一

- **目标**：消除各页面独立实现的 sidebar/header 差异，统一为共享组件体系。
- **执行要点**：
  1. 统一全局布局结构：`.pm-workspace` / `.pm-main` / `.pm-body`
  2. 修复 `ProjectDetailPage` 布局错乱（当前使用 `.project-detail-main` 未对齐全局结构）
  3. 以 `ProjectManagementPage` 为基准，统一 Personnel / Digital / Procurement / Task 四页壳层
  4. 删除各页面独立 header/sidebar CSS 类（如 `.om-header`、`.rp-header` 等残留样式）
- **前置依赖**：P1-T1、P1-T3
- **验收标准**：
  - 所有页面（含项目详情）布局结构一致，无错位/溢出
  - 新增页面可直接复用全局布局类，无需自定义壳层
- **技术要点**：
  - 不修改视觉风格，只统一 DOM 结构和 CSS 类名
  - 对齐后删除冗余 CSS 规则

---

### P1.5-T2 CSS Token 治理

- **目标**：在 P1-T2 硬编码清零基础上，进一步治理 Token 命名混乱和循环引用问题。
- **执行要点**：
  1. 统一 Token 命名规范：`--pm-{范畴}-{属性}-{修饰}`（如 `--pm-color-primary`）
  2. 清理 `index.css` 中 189 个一次性变量的重复/近义项
  3. 建立 Token 分层：基础 Token（色值/字号）→ 语义 Token（背景/边框）→ 组件 Token（卡片/按钮）
  4. 修复循环引用（如 `--pm-text-white: var(--pm-text-white)`）
  5. 建立 Token 使用规范文档
- **前置依赖**：P1-T2
- **验收标准**：
  - `index.css` 变量数量从 189+ 压缩至 80 个以内
  - 无循环引用、无重复定义
  - 全局搜索 `#`、`rgba(` 在业务 CSS 中返回 0 结果
- **技术要点**：
  - 使用 CSS 自定义属性 `@property` 支持类型提示（可选）
  - Token 变更需通过查找替换批量更新，禁止手动逐行修改

---

### P1.5-T3 统计卡片统一

- **目标**：将全站统计卡片收敛到 `StatCard/StatsCards` 组件，消除独立实现。
- **执行要点**：
  1. 扫描剩余独立统计卡片实现（`cm-stat-card`、`std-stat-card` 等）
  2. 扩展 `StatsCards` API 支持各页面差异需求（如 `subLabel`、`layout`）
  3. 统一 tone 语义：`blue`→主色、`green`→成功、`orange`→警告、`purple`→辅助、`cyan`→标准
  4. 删除各页面独立的统计卡片 CSS
- **前置依赖**：P1.5-T1
- **验收标准**：
  - 全站统计卡片使用 `shared/StatsCards` 组件
  - 统计卡片交互（点击筛选、hover 效果）全站一致
- **技术要点**：
  - 保留页面级 `classNamePrefix` 用于 CSS 命名空间隔离
  - tone 扩展需同步更新 `StatCard` 类型定义和 CSS

---

### P1.5-T4 渐变色 Token 化迁移

- **目标**：将 73+ 处 `linear-gradient` 硬编码提取为语义化 Token，消除重复模式和内联 style 逃逸。
- **执行要点**：
  1. 提取 6 大渐变模式为 Token：
     - `--pm-gradient-stat-{tone}`：统计卡片背景（135° 20%→5%）
     - `--pm-gradient-brand`：品牌装饰（蓝→紫）
     - `--pm-gradient-btn-primary`：主按钮
     - `--pm-gradient-bar`：进度条
     - `--pm-gradient-kpi`：KPI 半透明背景
     - `--pm-gradient-modal`：模态框表面
  2. 统一角度标准化：`--pm-gradient-angle-diagonal: 135deg`、`vertical: 180deg`、`horizontal: 90deg`
  3. 建立语义化工具类：`.stat-card-bg-*`、`.kpi-bg-*`、`.bar-*`、`.accent-bar-*`、`.btn-*`
  4. 替换 `UserTable.tsx` 内联渐变 style 为 Token 引用
  5. 删除 `.pm-stat-blue` / `.tm-stat-blue` / `.om-stat-blue` 等页面前缀命名，统一为语义类名
- **前置依赖**：P1.5-T2
- **验收标准**：
  - 全局搜索 `linear-gradient` 仅出现在 `index.css` Token 定义区
  - 无内联 style 写渐变
  - 同一渐变模式全站只定义一次
- **技术要点**：
  - 禁止业务 CSS 直接使用 `linear-gradient`，一律通过 `var()` 引用
  - 渐变透明度跟随 Token，不单独硬编码

---

### P1.5-T5 卡片提取与空状态组件

- **目标**：提取可复用的 `ProjectCard` 和 `EmptyState` 组件，消除重复实现。
- **执行要点**：
  1. 提取 `ProjectCard` 组件：
     - props：`variant: 'grid' | 'kanban' | 'compact'`、`project: ProjectItem`、`onClick`
     - 合并网格视图和看板视图中 80% 重复的卡片结构
  2. 提取 `EmptyState` 组件：
     - props：`icon`、`title`、`description`、`action?`
     - 替换 6+ 处重复的空状态实现
  3. 在项目中心和任务中心试用新组件
- **前置依赖**：P1.5-T3
- **验收标准**：
  - `ProjectCard` 支持 3 种变体，字段显隐通过 props 控制
  - `EmptyState` 覆盖全站空状态场景
- **技术要点**：
  - `ProjectCard` 的 `compact` 变体用于侧滑抽屉/选择器
  - 不引入新依赖，基于现有共享组件构建

---

### P1.5-T6 shadcn/ui 组件化（替换 MUI + 原生组件）

- **目标**：引入 shadcn/ui 替换 MUI 和原生 HTML 组件（304+ `<button>`、52+ `<input>`、52+ `<table>`），建立统一基础组件层。
- **执行要点**：
  1. `npx shadcn init` 初始化 + Tailwind v4 集成（`@tailwindcss/vite` 插件）
  2. 映射 shadcn 语义 Token（`--background`/`--primary`/`--border` 等）到现有 `--pm-*` 设计系统
  3. 安装 Lucide React 作为统一图标库，替代 MUI Icons + 外部 SVG
  4. 按需添加 shadcn 组件：`button`、`input`、`select`、`dialog`、`table`、`form`、`sonner`、`sheet`
  5. 逐步替换：先替换高频组件（Button/Input），再替换复杂组件（Table/Dialog）
  6. 用 Sonner (Toast) 替换 `window.alert` 阻断式提示
  7. 旧页面修改时顺手替换，不强制全量迁移
- **前置依赖**：P1.5-T1~T5
- **验收标准**：
  - 至少 3 个 shadcn 组件在业务页面中实际使用
  - shadcn 主题映射与设计规范一致（暗色玻璃态）
  - `npm run build` 零报错
  - `src/theme.ts`（MUI 主题）标记为 deprecated
- **技术要点**：
  - shadcn 使用 Tailwind 类 + CSS 变量，与 Tailwind v4 无缝集成
  - shadcn 源码在 `src/components/ui/`，直接修改即可覆盖样式
  - 自定义视图（甘特图/WBS/看板/任务树）保持自研不动

---

## 2. Phase 2：任务基础建设 + 架构治理

**目标**：将任务模块从"演示级 mock"升级为"可独立工作的完整业务单元"，同时清偿架构分析报告中发现的 P0 数据层问题。分两段执行——先完成 UI 层 shadcn 迁移，再做数据/逻辑层重构。

**前置条件**：Phase 1 & 1.5 全部完成

**核心原则**：

- 任务是系统原子——不依赖模板/项目即可独立闭环
- 先清 UI 层（shadcn 替换），再改数据层（字段硬化+状态机+API），避免在 MUI 代码上开发新功能导致双重返工
- 架构债务清偿与业务开发同步（P0 问题不延后）

**预估总工期**：12-16 天

---

## 2-A. shadcn 试点替换（任务管理模块）★ 先执行

**目标**：将任务管理模块 6 个核心文件从 MUI + 原生 HTML 全量替换为 shadcn/ui + Tailwind + Lucide React。

**为何先行**：P2-B 要修改 TaskDetailPage/TaskManagementPage/TaskListView/TaskToolbar 加新功能。如果先在 MUI 代码上开发，shadcn 迁移时需双重返工。先清 UI 层，P2-B 工作在干净的 shadcn 代码上。

**预估工期**：4 天

**执行文件清单**（来自 `shadcn-pilot-plan.md`）：

| 文件                     | 行数 | 当前状态                            | 替换内容               |
| ------------------------ | ---- | ----------------------------------- | ---------------------- |
| `TaskDetailPage.tsx`     | 1236 | 110 处 `sx`，17 个 MUI 图标         | 最大重构目标           |
| `TaskKanbanView.tsx`     | 371  | 40 处 `sx`                          | 拖拽逻辑不动，换样式层 |
| `TaskTreeView.tsx`       | 375  | 40 处 `sx`，MUI X TreeView          | 保留树逻辑，换渲染层   |
| `TaskManagementPage.tsx` | 581  | 8 个 MUI 图标，Drawer+Snackbar      | Sheet+Sonner+图标      |
| `TaskToolbar.tsx`        | 255  | 8 `<button>`+1 `<input>`+9 MUI 图标 | Button+Input+Lucide    |
| `TaskListView.tsx`       | 215  | 3 `<button>`+1 MUI 图标             | 少量改动               |

**替换汇总**：

- 149 处 `sx` + 25 处 `style` → Tailwind 类 + CSS 变量
- 23 个 MUI 组件 → shadcn 等价组件（Dialog→Dialog, Drawer→Sheet, Snackbar→Sonner, Tabs→Tabs 等）
- 28 个 MUI 图标 → Lucide React
- 12 个原生 `<button>` + 1 个 `<input>` → shadcn `Button` + `Input`

**保留不动**：

- 看板拖拽逻辑（`@dnd-kit`，与 UI 框架无关）
- 日历组件（`react-big-calendar`，外部库）
- MUI X TreeView 逻辑（无 shadcn 等价品，待后续评估）

**实施步骤**：

| 步骤   | 内容                                                                  | 工期   |
| ------ | --------------------------------------------------------------------- | ------ |
| Step 1 | `npx shadcn add tabs progress badge tooltip command popover` 补齐依赖 | 0.5 天 |
| Step 2 | TaskToolbar 先行 — 8 button+1 input+9 图标，文件最小，快速验证        | 0.5 天 |
| Step 3 | TaskListView + TaskManagementPage — Sheet/Sonner/图标替换             | 0.5 天 |
| Step 4 | TaskDetailPage 重构 — 110 处 sx+17 图标的逐区块替换（图标→sx→组件）   | 2 天   |
| Step 5 | TaskKanbanView + TaskTreeView — 40 处 sx 替换                         | 0.5 天 |
| Step 6 | 评审验证 — 功能回归 + UI 对比 + 浅色主题基础 Token 定义               | 0.5 天 |

**验收标准**：

- 任务模块 6 个文件零 MUI 组件残留（保留的 MUI X TreeView 除外）
- 零 MUI 图标残留
- 零原生 `<button>`/`<input>` 残留
- 零 `sx`/`style` 内联样式
- 暗色模式下 UI 与替换前一致
- 浅色主题 CSS 变量映射就绪（`.light` 选择器）
- `npm run build` 零报错 + lint 零新增错误

---

## 2-B. 任务基础建设 + 架构债务清偿

**目标**：在 2-A 清理后的 shadcn 代码上，实现任务数据模型硬化、状态机真实化、关系建模、API 完善、检查项闭环。同时清偿架构分析报告中的 5 项 P0 问题。

**预估工期**：8-12 天

---

### P2-T1 任务数据模型硬化 + 字段类型修正

- **目标**：精简字段、补齐缺失、建立真实父子关系、修正字段类型。
- **执行要点**：
  1. **字段精简**：从 40+ → ≤28 个核心字段，删除 14 个过早字段（财务/合同/SLA/vendor 类）
  2. **缺失字段补齐**：
     - `is_rectification`、`derived_from_task_id`、`rectification_reason`（整改闭环）
     - `priority`（优先级，与 `riskLevel` 正交）
     - `required_flag`、`milestone_flag`（任务性质标记）
  3. **🏗️ B2 字段类型修正**（架构报告）：
     - `dateRange`（String "2024-01-15 ~ 2024-06-15"）→ `startDate`/`endDate`（DateTime），支持排序/计算
     - `budget`（String "1,280万"）→ `budgetAmount`（Decimal）
     - `teamSize`（String "26人"）→ `teamSize`（Int），支持聚合统计
     - `plannedOpenDate`/`actualOpenDate` String → DateTime
     - 所有状态字段 String → Prisma enum（任务状态、派单状态、快照状态等）
  4. **parentTaskId 真实化**：
     - `tasks` 表增加自引用外键 `parent_task_id`
     - 新增 `tree_level`、`tree_path`（Materialized Path）
     - 删除 `parentPath` 字符串拼接字段
  5. **标准绑定真实化**：
     - `executionStandards`/`acceptanceStandards` 从 `string[]` → `standardClauseIds[]`
     - 新增 `standardSnapshotId`：绑定时自动生成快照
  6. **checklist 子实体化**：
     - 新建 `checklist_items` 独立表
     - 不在任务主表中内嵌检查项数据
- **前置依赖**：P1-T4、2-A（shadcn 替换完成）
- **验收标准**：
  - 字段 ≤28 个，删除字段无引用残留
  - 日期/金额/数量字段全部为数值/日期类型，支持 SQL 计算
  - `parent_task_id` 可关联任意父任务
  - 标准绑定存 ID 引用
- **技术要点**：Materialized Path 格式 `/root_id/level1_id/level2_id/`；字段类型修正涉及数据迁移脚本

---

### P2-T2 任务状态机与守卫真实化

- **目标**：精简为 6 状态，守卫从 mock 字符串切换为真实数据库查询。
- **执行要点**：
  1. **状态精简**：9 → 6 状态（移除：`待创建`、`待提交`、`不通过`）
     - 保留：`待分配` / `待执行` / `执行中` / `待验收` / `已完成` / `已关闭`
     - 派单状态作为 `dispatch_status` 独立维度
  2. **守卫条件真实化**（全部从 mock → 数据库查询）：
     - `待分配 → 待执行`：执行人已分配 + 前置依赖满足 + 标准已绑定
     - `执行中 → 待验收`：检查项全部录有结果
     - `待验收 → 已完成`：检查项全部通过
     - `待验收 → 执行中`：退回执行 + 可选自动派生整改
  3. **enterStatusHooks 真实化**：`执行中`→记录开始时间、`待验收`→触发检查项生成、`已关闭`→解除阻塞
  4. **单元测试**：覆盖全部 6 状态合法流转 + 每个守卫阻断场景
- **前置依赖**：P2-T1
- **验收标准**：6 状态流转全部经过真实守卫；守卫失败返回缺口清单；联动动作审计日志可查

---

### P2-T3 任务关系建模

- **目标**：建立前置依赖、整改派生、派单/接单/改派流程。
- **执行要点**：
  1. 新建 `task_relations` 表：`predecessor_id, successor_id, relation_type, lag_days`。V1 只实现 FS，其余预留。添加时检测循环依赖。
  2. **整改派生**：验收不通过 → 自动创建 `is_rectification=true, derived_from_task_id=原任务ID` 的子任务，继承标准绑定
  3. **派单流程**：`待派单 / 已派单 / 已接单 / 已拒绝`，拒绝原因可查
  4. 前端：阻塞标记可视化（前置未满足/待派单/标准缺失），不替代主状态
- **前置依赖**：P2-T1、P2-T2
- **验收标准**：前置依赖可创建/查询/影响流转；循环依赖拦截；整改自动派生

---

### P2-T4 任务 API + Repository 完善 + 架构修复

- **目标**：建立完整 API 端点 + 数据层架构修复（双重持久化、mock 数据治理、API 白名单）。
- **执行要点**：
  1. **API 端点补全**（7 个端点）：CRUD + 子树查询 + 依赖查询 + 批量创建（事务）
  2. **🏗️ P3-1 API 字段白名单补齐**：`ALLOWED_UPDATE_FIELDS` 从当前 18 个扩展到 50+，覆盖 P2-T1 新增的全部字段（`standardSnapshotId`、`is_rectification`、`dispatch_status` 等）
  3. **🏗️ A1 双重持久化修复**：Zustand persist 作为唯一写路径，Repository 只负责 API 同步。删除 Repository 中的 `persistLocalState()` 直接写 localStorage。数据流向统一为：`组件 → store action → API → Zustand persist（自动）`
  4. **🏗️ A2 mock 数据治理**：`data/projects.ts` 中的 `getProjectByCode()` 从静态 `mockProjects` 数组切换为 `useProjectStore.getState().projects`；移除 `data/projects.ts` 从 `components/` 反向导入的循环依赖
  5. **taskRepository 完善**：`getTaskTree`、`getTaskRelations`、`transitionTaskStatus`、`createRectificationTask`、`getChecklistItems`
  6. 所有写操作携带 `X-Idempotency-Key`；批量操作使用事务
- **前置依赖**：P2-T1、P1-T5
- **验收标准**：
  - 任务 CRUD 全部通过 API，localStorage 仅作为 Zustand 的降级持久化
  - API 不可用时系统仍可运行（offline-first）
  - `getProjectByCode` 返回运行时数据，非静态 mock
  - 双重持久化冲突消除
  - API 白名单 ≥50 字段

---

### P2-T5 验收检查项闭环 + JSON 字段拆表

- **目标**：实现"检查项录入 → 验收判定 → 整改派生"闭环，同时修复架构报告中 JSON 字段滥用问题。
- **执行要点**：
  1. **检查项生成**：任务进入 `待验收` 时，根据标准快照自动生成检查项
  2. **检查项录入 UI**：2-A 已替换的 TaskDetailPage（shadcn）中增加检查项区域。逐条录入 + 附件 + 备注
  3. **验收判定**：全部通过→可完成；存在不通过→退回。判定逻辑独立封装
  4. **整改派生**：不通过 → 调用 P2-T3 逻辑自动创建整改子任务
  5. **🏗️ B1 JSON 字段拆表**：
     - `Project.subStatusJson` → `WorkPackageStatus` 独立子表（id, projectId, workPackageCode, status, reason）
     - `ProjectTemplate.scopes`/`phaseBlueprint`/`milestoneBlueprint` → 各自独立子表（P3 标准管理处理）
     - `ProjectTemplate.taskTemplateBinding` → `TemplateTaskBinding` 关联表
     - `Supplier.serviceAreas` → `SupplierServiceArea` 独立表（P7 采购模块处理）
     - `TaskTemplate.standardBinding` → `TemplateStandardBinding` 关联表
  6. **整改历史时间线**：TaskDetailPage 增加"不通过→整改→复验→通过"时间线
- **前置依赖**：P2-T3、P2-T4
- **验收标准**：
  - 检查项自动生成 + 逐条录入 + 验收判定 + 整改派生 + 复验闭环
  - `Project.subStatusJson` 迁移到 `WorkPackageStatus` 表，旧 JSON 字段标记 deprecated
  - 整改历史时间线完整可查
  - lint: 0 errors, build: 0 errors

---

### Phase 2 验收标准总览

**2-A + 2-B 全部完成的标志**：

- [ ] 任务模块 6 个文件零 MUI 残留（除 TreeView）
- [ ] 零 `sx`/`style` 内联样式
- [ ] 浅色主题 `.light` CSS 变量映射就绪
- [ ] 任务字段精炼至 ≤28 个，日期/金额/数量为数值类型
- [ ] 任务父子关系通过 `parent_task_id` 真实关联
- [ ] 标准绑定存 ID 引用，快照自动生成
- [ ] 6 状态流转 + 守卫条件全部真实（非 mock）
- [ ] 前置依赖可创建/查询/影响流转
- [ ] 验收不通过 → 整改任务自动派生
- [ ] 检查项独立实体化，录入/判定/整改闭环
- [ ] `Project.subStatusJson` 迁移到独立子表
- [ ] 双重持久化冲突消除（Zustand 唯一写路径）
- [ ] `getProjectByCode` 从 store 读取而非静态数组
- [ ] API 字段白名单 ≥50 字段
- [ ] 单元测试覆盖全部守卫和流转路径
- [ ] lint: 0 errors, build: 0 errors

---

## 3. Phase 3：标准管理

**目标**：建立标准库完整体系—标准来源、条款结构化、规则项引擎。任务是先决条件完成后的第一步功能开发，标准库为任务提供"验收依据"。

**前置条件**：Phase 2 任务基础完成（任务可独立创建和流转）

**预估工期**：3-5 天

---

### P3-T1 标准库数据模型与基础 CRUD

> _(内容同旧版 P2-T1，前置条件改为 Phase 2 完成)_

- **目标**：实现标准管理模块的后端实体和前端页面。
- **执行要点**：
  1. 后端：`standards` 表 + `standard_files` 表 + RESTful API
  2. 前端：`StandardManagementPage` 重构
  3. 标准来源类型：品牌标准、行业规范、供应商要求、项目补充
  4. 标准文件字段：名称、来源、版本、适用品牌、适用店型、生效日期
  5. 支持标准版本管理（简单版本号）
- **前置依赖**：Phase 2（任务现有能力可绑定标准 ID）
- **验收标准**：
- [ ] 可创建、编辑、删除标准来源
- [ ] 标准列表可按品牌、店型、来源类型筛选
- **技术要点**：标准表预留 `standard_package_id` 供模板中心引用

---

### P3-T2 标准条款结构化与规则项引擎

> _(内容同旧版 P2-T2，前置条件调整)_

- **目标**：将标准文件切分为结构化条款，并转为可执行的规则项。
- **执行要点**：
  1. 新增 `standard_clauses` 表：条款编号、标题、内容、所属标准、类型（执行/验收/通用）
  2. 新增 `standard_rules` 表：规则项关联条款，判定方式（是/否、数值范围、枚举）
  3. 前端：标准详情页增加「条款结构化」视图
  4. AI 辅助条款提取（调用 LLM 切分标准文本，人工确认入库）
  5. 条款与任务模板的绑定关系表 `template_clause_bindings`
- **前置依赖**：P3-T1
- **验收标准**：
- [ ] 标准文件可拆分为多条结构化条款
- [ ] 条款可细化为规则项
- [ ] 规则项可与任务模板绑定
- **技术要点**：规则引擎 V1 用文本描述+判定类型枚举，不做表达式解析

---

## 4. Phase 4：模板中心

**目标**：建立项目模板和任务模板体系。模板 = 预定义的任务树 + 默认标准绑定 + 默认工期。任务基础（Phase 2）提供原子能力，标准库（Phase 3）提供条款数据，模板对二者做组合引用。

**前置条件**：Phase 2 + Phase 3 完成

**预估工期**：2-3 天

---

### P4-T1 模板中心（项目模板 + 任务模板）

> _(内容同旧版 P2-T3，前置条件改为 Phase 2+3 完成)_

- **目标**：建立模板中心，支持从模板生成项目容器和初始任务树。
- **执行要点**：
  1. 新增 `project_templates` 表：模板名称、适用品牌、适用店型、默认阶段、默认里程碑、关联标准包
  2. 新增 `task_templates` 表：模板任务树（含父子关系）、默认执行标准、默认验收标准、默认工期
  3. 前端：`TemplateCenterPage`
  4. 模板实例化逻辑：选择模板 → 调用 P2-T4 的 `POST /api/tasks/batch` 批量生成任务树 → 绑定标准快照
  5. 模板版本管理
- **前置依赖**：P3-T2、P2-T4
- **验收标准**：
- [ ] 可创建项目模板和任务模板
- [ ] 模板实例化正确生成任务树（含父子关系）
- [ ] 任务生成时自动绑定标准条款 + 生成快照
- [ ] 模板修改不影响已实例化的项目（快照隔离）
- **技术要点**：模板实例化是批量写操作，需事务+幂等键保证

---

## 5. Phase 5：项目闭环

**目标**：完成从"立项→模板实例化→项目确认→任务执行→验收→归档"的端到端项目管线。

**前置条件**：Phase 2 + 3 + 4 完成

**预估工期**：4-6 天

---

### P5-T1 项目立项流程

> _(内容同旧版 P2-T4，前置条件调整)_

- **目标**：实现从「开店立项」到「项目确认」的完整流程。
- **执行要点**：
  1. 门店基础信息录入（名称、城市、商圈、店型、面积、计划开业时间、预算区间）
  2. 选择店型模板
  3. 确认后调用 P4-T1 模板实例化，生成项目容器+初始任务树
  4. 项目状态自动流转：待立项 → 待确认 → 待拆解
  5. 立项信息完整度校验（关键字段缺失不允许确认）
- **前置依赖**：P4-T1
- **验收标准**：
- [ ] 一次完整立项：录入→选模板→确认→生成项目
- [ ] 生成的项目可在项目中心看到
- **技术要点**：立项草案状态保存在 `project_drafts` 表

---

### P5-T2 项目详情 8 标签内容填充

> _(内容同旧版 P2-T5，前置条件调整)_

- **目标**：填充 8 个领域标签中的核心内容，使项目详情页从壳子变为可用。
- **执行要点**：
  1. 项目概览：状态总览、快捷操作、风险提示、变更日志
  2. 范围与任务：立项信息确认、任务树（WBS）视图、标准绑定展示
  3. 进度管理：阶段与里程碑列表、计划 vs 实际时间对比
  4. 成本与采购：采购申请摘要、订单摘要、预算 vs 实际（先展示已有数据）
  5. 质量与验收：验收申请状态、检查项完成度、整改任务摘要
  6. 资源与人员：项目成员列表、工队分配入口
  7. 风险与沟通：风险登记册、问题日志
  8. 设置与 Agent：项目配置、Agent 入口（Phase 8 填充）
- **前置依赖**：P1-T7、P5-T1
- **验收标准**：
- [ ] 每个标签至少有列表展示+基本操作
- [ ] 范围与任务标签可查看真实任务树（来自 Phase 2）
- [ ] 质量与验收标签可查看真实检查项（来自 Phase 2）
- [ ] 各标签数据来自 API，非 mock
- **技术要点**：各标签独立数据加载，标签激活时按需请求

---

## 6. Phase 6：视图增强

**目标**：增强系统可视化能力—甘特图、看板拖拽、日历、地图、任务树交互。这些是纯 UI 层增强，不动业务逻辑。

**前置条件**：Phase 2 任务模型稳定（`task_relations` 表、`parent_task_id`、`startDate`/`endDate` 有真实数据）

**预估工期**：5-8 天

---

### P6-T1 甘特图缺失功能补充

> _(同旧版 P2-T0)_

- **目标**：在自研甘特图基础上补充今天标记线、依赖线可视化、时间粒度切换。
- **前置依赖**：Phase 2（需要 `task_relations` 和真实日期数据）
- **验收标准**：今天标记线+依赖线+日/周/月粒度切换可用

---

### P6-T2 看板拖拽状态流转

> _(同旧版 P3-T0，前置条件改为 Phase 2)_

- **目标**：引入 `@dnd-kit`，实现项目/任务看板的拖拽状态流转。
- **前置依赖**：Phase 2（任务状态机守卫已真实化）
- **验收标准**：拖拽流转+守卫拦截+动画流畅

---

### P6-T3 日历视图

> _(同旧版 P2-T7)_

- **目标**：引入 `react-big-calendar`，实现项目/任务日历视图。
- **前置依赖**：Phase 2（任务有真实日期）
- **验收标准**：月/周/日视图+暗色主题+事件可点击

---

### P6-T4 地图视图

> _(同旧版 P2-T6 + P2-T8)_

- **目标**：接入高德地图，实现项目位置标记和聚合展示。
- **前置依赖**：Phase 5（项目有地理信息字段）
- **验收标准**：地址解析+地图标记+暗色主题

---

### P6-T5 任务树交互增强

> _(同旧版 P3-T2，前置条件已满足)_

- **目标**：基于 Phase 2 的真实任务树数据，提供可交互树视图。
- **前置依赖**：Phase 2
- **验收标准**：3-4 层嵌套展开+状态色标+点击查看详情+WBS 编码

---

## 7. Phase 7：采购、资源与资产沉淀

**目标**：建立采购基础闭环、工队管理和资产归档，使「任务推进 → 采购协同 → 工队派单 → 资产沉淀」链路可执行。

**前置条件**：Phase 5 项目闭环完成

**预估工期**：5-8 天

---

### P7-T1 采购管理基础闭环

- **目标**：实现采购申请 → 审批 → 下单 → 到货跟踪的完整流程。
- **执行要点**：
  1. 后端实体：`procurement_requests`（关联项目/任务）、`procurement_orders`、`procurement_arrivals`
  2. 采购状态机：`待申请 → 待审批 → 待下单 → 待到货 → 已到货`
  3. 前端：`ProcurementManagementPage` 数据接入
  4. 采购申请可从任务详情页发起
  5. 到货确认后，解除关联任务的采购阻塞
- **前置依赖**：Phase 2（任务有真实数据和状态机）
- **验收标准**：可创建采购申请并关联任务；到货确认后解除阻塞
- **技术要点**：采购与任务通过 `task_id` 外键关联；部分到货逻辑 V1.5 完善

---

### P7-T2 工队管理基础版

- **目标**：建立工队档案、班组结构、资质证照管理，支持任务派单时选择工队。
- **执行要点**：
  1. 后端实体：`workteams`、`workteam_members`、`workteam_qualifications`
  2. 前端：`WorkteamManagementPage` 基础版
  3. 任务派单联动：执行方可选择工队 + 自动推荐可服务工队 + 负载展示
  4. 工队评级手动录入（优秀/良好/一般）
- **前置依赖**：Phase 2（派单流程已实现）
- **验收标准**：可创建工队档案；任务派单可选手队；资质到期预警

---

### P7-T3 资产归档基础

- **目标**：项目交付后，将门店资产沉淀为「一店一档」。
- **执行要点**：
  1. 后端实体：`assets`（资产台账）、`asset_categories`、`project_deliverables`
  2. 资产从采购到货记录和验收通过任务中自动归集
  3. 一店一档：汇总资产 + 交付资料 + 验收报告 + 结算建议
- **前置依赖**：P7-T1
- **验收标准**：资产可自动归集；一店一档汇总可用

---

## 8. Phase 8：Agent 与工作台

**目标**：建立 Agent 节点框架，落地 3 个核心 Agent，并完成工作台首页。

**前置条件**：Phase 7 完成

**预估工期**：5-8 天

---

### P8-T1 Agent 节点框架与执行记录

- **目标**：建立 Agent 运行基础设施：触发节点、输入上下文、输出结构化、人工确认、执行记录。
- **执行要点**：
  1. 后端实体：`agent_configs`、`agent_executions`
  2. Agent 执行状态：`待执行 → 执行中 → 已完成 → 已转人工/已失败`
  3. Agent 输出必须经过人工确认才可影响业务对象（红线）
  4. 封装 `src/services/agent/` 层：统一调用 LLM API
- **前置依赖**：Phase 2+5（任务数据和项目闭环就绪）
- **验收标准**：Agent 可在指定节点触发；输出需人工确认后生效；执行记录可查

---

### P8-T2 品牌需求 Agent

- **目标**：辅助立项信息补全、模板匹配、立项草案生成。
- **触发节点**：立项表单填写/提交前
- **前置依赖**：P8-T1、P5-T1（项目立项流程）
- **验收标准**：缺失字段提示 + 模板推荐 + 草案生成可读可用

---

### P8-T3 项目经理 Agent

- **目标**：辅助任务树生成建议、催办预警、风险摘要。
- **触发节点**：项目待拆解 / 任务不到 3 天到期 / 关键任务阻塞 > 2 天
- **前置依赖**：P8-T1、Phase 2（任务数据模型稳定）
- **验收标准**：催办预警可用 + 风险摘要可用 + 任务树建议可人工确认后采纳

---

### P8-T4 验收质检 Agent

- **目标**：辅助资料完整性检查和检查项生成。
- **触发节点**：任务待验收 / 验收申请提交前 / 初验完成后
- **前置依赖**：P8-T1、Phase 2（检查项和标准快照）
- **验收标准**：检查项自动生成 + 资料完整性检查 > 80% 识别率

---

### P8-T5 工作台首页

- **目标**：一屏掌握全局—待办、预警、项目动态、快捷入口。
- **前置依赖**：P8-T2、P8-T3、P8-T4
- **验收标准**：登录默认进入；待办/预警/动态数据来自真实 API

---

## 9. Phase 9：联调与闭环验证

**目标**：验证端到端流程可执行，修复跨模块问题，建立可演示的闭环。

**前置条件**：Phase 8 完成

**预估工期**：3-5 天

---

### P9-T1 端到端状态机联调

- **目标**：验证项目、任务、采购、验收、资产全链路状态流转正确性。
- **测试场景**：
  - 场景 A：标准建店（立项→拆解→执行→验收→结算→归档）
  - 场景 B：验收整改（初验不通过→整改→复验→通过）
  - 场景 C：采购阻塞（采购异常→任务阻塞→到货解除→任务恢复）
- **验收标准**：3 场景全部可走通，无状态非法跳转

---

### P9-T2 结果对象模型验证

- **目标**：验证各结果对象（采购单/验收单/整改单/资产/结算）的独立性和关联完整性。
- **验收标准**：每个结果对象可独立 CRUD；关联可查；一店一档归档校验通过

---

### P9-T3 单品牌建店闭环演示

- **目标**：基于高保真数据，完成一次完整闭环演示。
- **验收标准**：全程无阻断性 bug；每个环节有数据可查

---

### P9-T4 数据初始化治理

- **目标**：建立可复用的种子数据体系（演示/测试/开发数据独立）。
- **验收标准**：5 分钟内完成初始化；演示数据可重置

---

## 10. 跨 Phase 通用任务

以下任务贯穿多个 Phase，需在对应阶段持续执行：

### 10.1 单元测试补充

| 阶段    | 测试目标                                     | 覆盖率要求    |
| ------- | -------------------------------------------- | ------------- |
| Phase 1 | 状态机（项目 + 任务）、共享组件              | 核心逻辑 100% |
| Phase 2 | 任务数据模型、守卫条件、整改派生、检查项闭环 | 核心逻辑 100% |
| Phase 3 | 标准库 CRUD、条款结构化                      | 核心逻辑 80%  |
| Phase 4 | 模板实例化                                   | 核心逻辑 80%  |
| Phase 5 | 项目立项流程                                 | 核心逻辑 80%  |
| Phase 6 | 甘特图、日历、地图交互                       | 核心逻辑 60%  |
| Phase 7 | 采购状态机、工队管理、结算计算               | 核心逻辑 80%  |
| Phase 8 | Agent 框架、工作台聚合查询                   | 核心逻辑 60%  |
| Phase 9 | 端到端场景                                   | 场景覆盖 100% |

### 10.2 文档同步

| 阶段      | 文档更新内容                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Phase 1   | 更新 `development-guide.md`（组件使用规范）、`coding-standards.md`（CSS 变量规范）                                                   |
| Phase 1.5 | 新增 `css-token-spec.md`（Token 命名规范）、`component-contract.md`（组件开发契约）                                                  |
| Phase 2   | 更新 `task-tree-modeling.md`（真实父子层级）、`taskManagement.types.ts`（字段精简）、`taskStateMachine.guards.ts`（6 状态+真实守卫） |
| Phase 3   | 更新 `structured-standard-library.md`（标准条款与规则项实现）                                                                        |
| Phase 4   | 新增 `template-center-design.md`（模板中心设计）                                                                                     |
| Phase 5   | 更新 `project-management-prd.md`（8 标签内容填充）                                                                                   |
| Phase 6   | 新增 `gantt-component-spec.md`（甘特图扩展）、`calendar-view-spec.md`、`map-view-spec.md`                                            |
| Phase 7   | 更新 `procurement-management-prd.md`、新增 `workteam-management-prd.md`                                                              |
| Phase 8   | 更新 `multi-agent-v1-prd.md`、新增 `workbench-prd.md`                                                                                |
| Phase 9   | 编写 `e2e-test-guide.md`、`demo-runbook.md`                                                                                          |

### 10.3 质量门禁（每 Phase 结束必须执行）

1. `npm run build` 零报错
2. `npm run lint` 零报错
3. `tsc --noEmit` 零报错
4. 核心模块单元测试通过
5. 当前 Phase 新增功能可手动走通
6. 代码审查（AI 生成代码 100% Review）

---

## 11. 任务依赖总图

```
Phase 1: 底座搭建
├── P1-T1 共享组件补齐 ──┬── P1-T2 CSS变量统一
├── P1-T3 路由集中化 ────┤   └── P1-T7 8标签框架
├── P1-T4 Schema实体化 ──┬── P1-T5 API适配器
│                        └── P1-T6 状态机联动真实化
│
Phase 1.5: 底座收官与视觉统一
├── P1.5-T1 页面壳层统一 ──┬── P1.5-T2 CSS Token治理
├── P1.5-T3 统计卡片统一 ──┤   └── P1.5-T4 渐变色Token迁移
└── P1.5-T5 卡片+空状态 ───┴── P1.5-T6 shadcn UI迁移
│
Phase 2: 任务基础建设 + 架构治理
├── 2-A shadcn试点（任务模块6文件）───────── 先执行 ────┐
│                                                      │
├── 2-B 任务基础（在2-A清理后的代码上）◄───────────────┘
│   ├── P2-T1 数据硬化+字段类型修正 ──┬── P2-T2 状态机+守卫真实化
│   │                                 ├── P2-T3 关系建模（依赖+整改+派单）
│   │                                 ├── P2-T4 API+Repository+双重持久化修复
│   │                                 └── P2-T5 检查项闭环+JSON字段拆表
│   └── 同步清偿 5 项P0架构债务
│
Phase 3: 标准管理 ← 规则层
├── P3-T1 标准库CRUD
└── P3-T2 条款结构化+规则项引擎（依赖P3-T1）
│
Phase 4: 模板中心 ← 组合层
└── P4-T1 项目+任务模板（依赖Phase 2+3）
│
Phase 5: 项目闭环 ← 编排层
├── P5-T1 项目立项流程（依赖Phase 4）
└── P5-T2 8标签内容填充（依赖Phase 2+5-1）
│
Phase 6: 视图增强 ← 可视化层（纯UI）
├── P6-T1 甘特图补充（依赖Phase 2任务数据）
├── P6-T2 看板拖拽（依赖Phase 2状态机）
├── P6-T3 日历视图（依赖Phase 2任务日期）
├── P6-T4 地图视图（依赖Phase 5项目地理字段）
└── P6-T5 任务树交互（依赖Phase 2真实层级）
│
Phase 7: 采购、资源与资产
├── P7-T1 采购闭环（依赖Phase 2任务）
├── P7-T2 工队管理（依赖Phase 2派单流程）
└── P7-T3 资产归档（依赖P7-T1）
│
Phase 8: Agent与工作台
├── P8-T1 Agent框架（依赖Phase 2+5）
├── P8-T2 品牌需求Agent（依赖Phase 5）
├── P8-T3 项目经理Agent（依赖Phase 2）
├── P8-T4 验收质检Agent（依赖Phase 2检查项）
└── P8-T5 工作台首页（依赖P8-T2/T3/T4）
│
Phase 9: 联调与验证
├── P9-T1 端到端联调
├── P9-T2 结果对象验证
├── P9-T3 闭环演示
└── P9-T4 数据初始化治理
```

---

## 12. 风险与应对（工程视角）

| 风险项                                       | 影响                 | 应对策略                                                                           |
| -------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| **AI 生成代码理解偏差**                      | 功能不符合预期，返工 | 每个任务输出后人工 Review；核心模块（状态机/domain/data）人工设计，AI 只做 UI 实现 |
| **Prisma + SQLite 迁移到 PostgreSQL 不兼容** | V2 迁移困难          | 严格使用 Prisma 标准语法，避免 SQLite 特有函数；迁移前做兼容性检查                 |
| **shadcn 替换破坏现有功能**                  | 任务模块功能异常     | 2-A 只替换 UI 层不动业务逻辑；Step 6 功能回归测试覆盖                              |
| **任务基础不牢导致模板实例化失败**           | 上层模块全阻塞       | P2 独立验收标准：脱离项目/模板可独立走完任务闭环                                   |
| **双重持久化冲突导致数据丢失**               | 运行时数据损坏       | P2-T4 统一写路径为 Zustand persist；Repository 不再直接写 localStorage             |
| **Agent LLM 调用成本高/不稳定**              | 功能不可用           | V1 Agent 先用规则引擎兜底，LLM 作为增强；超时+降级策略（Phase 8 实现）             |
| **单人开发上下文丢失**                       | 跨 Phase 需求遗忘    | 每 Phase 结束更新本文档和 MEMORY.md；关键决策写入代码注释                          |

---

## 13. 版本历史

| 版本 | 日期       | 更新内容                                                                                                                       | 作者     |
| ---- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- |
| V1.3 | 2026-05-03 | **Phase 2 整合**：2-A shadcn 试点先行 + 2-B 任务基础同步清偿 5 项架构 P0 债务；字段类型修正、双重持久化修复、JSON 拆表纳入计划 | AI Agent |
| V1.2 | 2026-05-03 | 架构重组：从"按功能模块分包"改为"按数据依赖关系分层"；新建 Phase 2 任务基础；旧 Phase 2 拆为 Phase 3-6                         | AI Agent |
| V1.1 | 2026-04-25 | 新增 Phase 1.5 底座收官；更新依赖总图、文档同步表                                                                              | AI Agent |
| V1.0 | 2026-04-24 | 初始版本                                                                                                                       | AI Agent |

---

**文档维护者**：AI Agent + 产品经理
**下次评审**：Phase 2 任务基础完成后
**评审重点**：任务全闭环（独立任务可创建 → 绑定标准 → 分配 → 执行 → 验收 → 整改）是否跑通
