---
name: 项目详情任务与分解标签合并
overview: 仅在项目详情页合并“任务标签”和“工作分解(WBS)标签”，不改左侧一级菜单与全局任务管理路由
design:
  architecture:
    framework: react
  styleKeywords:
    - Glassmorphism
    - Dark
    - Structured
    - Data-Dense
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 22px
      weight: 600
    subheading:
      size: 16px
      weight: 500
    body:
      size: 13px
      weight: 400
  colorSystem:
    primary:
      - '#5B8CFF'
      - '#7AA2FF'
    background:
      - '#0F172A'
      - '#131D33'
    text:
      - '#EAF0FF'
      - '#9FB0D9'
    functional:
      - '#22C55E'
      - '#F59E0B'
      - '#EF4444'
      - '#60A5FA'
todos:
  - id: merge-project-tabs
    content: 合并项目详情任务与工作分解标签入口
    status: completed
  - id: build-task-wbs-view
    content: 新建项目级任务与WBS组合视图组件
    status: completed
  - id: wire-detail-tab-render
    content: 接入wbs分支渲染组合视图并保留兼容
    status: completed
    dependencies:
      - merge-project-tabs
      - build-task-wbs-view
  - id: polish-interaction-style
    content: 完善组合视图布局样式与任务交互行为
    status: completed
    dependencies:
      - wire-detail-tab-render
  - id: regression-verify-scope
    content: 回归验证全局任务菜单与#/tasks路由不受影响
    status: completed
    dependencies:
      - polish-interaction-style
---

## User Requirements

- 仅调整**项目详情页**内的标签结构：将“任务标签”和“工作分解标签”合并为一个入口。
- 明确保留左侧一级菜单“任务管理”及其全局页面能力，不删除 `#/tasks` 的全局路由。
- 合并后在同一标签下同时可查看项目任务与WBS结构，避免重复入口与来回切换。

## Product Overview

- 项目详情页保留单一“任务管理（或任务与分解）”标签，承载任务列表能力与WBS结构能力。
- 全局任务管理页面继续存在，作为跨项目总览入口；项目详情侧聚焦当前项目任务。
- 概览页已接入的任务调度台继续保留，作为快速处理入口。

## Core Features

- 标签层合并：去掉项目详情中冗余的“任务”占位标签，保留并重命名原“工作分解”交互标签。
- 内容层合并：单标签中展示“项目任务列表/统计/筛选”与“WBS树结构”。
- 跳转一致性：项目内任务操作优先页内完成，同时保留进入全局任务管理的补充入口。

## Tech Stack Selection

- 前端框架：React + TypeScript（沿用现有工程）
- 路由方式：Hash 路由（沿用 `projectTabs.shared.ts` 的标签键机制）
- 样式方式：模块化 CSS 文件（沿用 `src/components/project/*.css` 组织）

## Implementation Approach

采用“**路由键不变、视图合并**”方案：保留 `wbs` 作为项目详情内部路由键，避免 `#/projects/{code}/wbs` 兼容性回归；在该标签下接入新的组合视图组件，聚合任务域组件与现有 `ProjectWbsView`。
关键决策：

- 不改 `src/App.tsx` 的 `#/tasks` 页面分发逻辑。
- 不改 `src/components/layout/Sidebar.tsx` 中“任务管理”一级菜单。
- 优先复用 `TaskStatsCards`、`TaskToolbar`、`TaskListView`、`taskManagement.selectors.ts`，避免重复实现。  
  性能：
- 任务筛选采用 `useMemo`（按 `project.code / project.name` 过滤）；
- 列表按既有分页管道 `processTasks`，复杂度约 O(n log n)（含排序）；
- WBS仍使用现有展开状态管理，避免额外全量重渲染。

## Implementation Notes

- 严格限定改动面在项目详情页标签体系及其内容组件，控制爆炸半径。
- 保持 `ProjectDetailTab` 现有键集合稳定（优先不新增/替换路由键）。
- 任务数据优先复用现有来源（`taskRepository` 回退 `taskManagement.data`），避免新数据源分叉。
- 若当前 `ProjectDetailPage.tsx` 存在历史拼接问题，先做最小结构修复再接入新视图，避免回归扩大。

## Architecture Design

- `ProjectTabs.tsx`：负责标签文案与可交互入口（合并后仅保留一个任务相关入口）。
- `ProjectTaskAndWbsView.tsx`（新增）：负责项目任务列表区 + WBS区的组合编排。
- `ProjectDetailPage.tsx`：在 `activeTab === 'wbs'` 分支挂载组合视图。
- `Task*` 复用组件与 `ProjectWbsView` 分别保持职责单一，由组合容器统一连接。

## Directory Structure

/Users/dylan/CodeBuddy/20260402092847/

- src/components/project/ProjectTabs.tsx # [MODIFY] 合并项目详情标签展示，移除冗余任务占位，保留单一任务相关标签并更新文案。
- src/components/project/ProjectDetailPage.tsx # [MODIFY] 将 `activeTab === 'wbs'` 的渲染替换为组合视图接入；保留概览页任务调度台逻辑。
- src/components/project/ProjectTaskAndWbsView.tsx # [NEW] 项目级“任务+WBS”容器，复用任务统计、筛选、列表与WBS视图。
- src/components/project/project-task-and-wbs.css # [NEW] 组合视图布局样式（上下分区/间距/响应式），与现有深色玻璃风格一致。
- src/components/project/projectTabs.shared.ts # [MODIFY-IF-NEEDED] 仅在必要时补充标签文案映射，默认保持 `wbs` 键不变。

- 延续现有深色玻璃态视觉，强化“单入口、双视图”信息层级。
- 页面采用纵向双区块：上区任务运营（统计+筛选+列表），下区结构治理（WBS树+节点详情）。
- 交互上提供明确分段标题与粘性工具栏，降低任务与分解混用时的认知负担。
