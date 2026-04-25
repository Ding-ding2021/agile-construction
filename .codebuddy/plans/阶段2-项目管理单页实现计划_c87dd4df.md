---
name: 阶段2-项目管理单页实现计划
overview: 在不扩展范围的前提下，基于现有项目管理模块实现并收敛“项目列表页（含新建项目弹窗）”的字段、按钮行为与验收标准，确保可录入、可查询、可状态更新、可进入详情入口。
todos:
  - id: freeze-page-contract
    content: 固化项目页字段映射与校验口径
    status: completed
  - id: build-create-form-modal
    content: 改造新建弹窗为表单并实现提交校验
    status: completed
    dependencies:
      - freeze-page-contract
  - id: wire-app-state
    content: 在App接入项目创建与状态更新逻辑
    status: completed
    dependencies:
      - build-create-form-modal
  - id: enhance-list-actions
    content: 增强列表查看详情与状态更新操作
    status: completed
    dependencies:
      - wire-app-state
  - id: polish-feedback-acceptance
    content: 完善空态留痕反馈并执行验收检查
    status: completed
    dependencies:
      - enhance-list-actions
---

## User Requirements

- 仅实现一个页面：**项目管理页（项目列表 + 新建项目弹窗）**，不扩展到其他模块。
- 输入字段、按钮行为、验收标准需依据现有需求文档给出并落地。
- 页面需覆盖最小闭环：**查询、创建、状态更新、详情入口**。
- 详情页内容本次不开发，只保留“查看详情”跳转入口。

## Product Overview

- 页面以“项目池管理”为核心，支持快速查看项目状态、风险与负责人，并完成新项目录入。
- 视觉上保持现有项目管理风格（深色面板、卡片化列表、悬浮弹窗），新增控件需与当前样式一致，不重做整体界面。

## Core Features

- **项目列表管理**：展示项目基础信息，支持关键词搜索、筛选、重置。
- **新建项目表单**：按文档建议字段提供最小可运行录入，包含必填校验与日期逻辑校验。
- **状态更新操作**：在列表中执行项目状态流转，反馈成功/失败信息。
- **详情跳转入口**：从列表项进入既有详情路由。
- **验收口径落地**：覆盖功能、数据、交互、留痕四类 DoD（可创建、可查询、可流转、可追溯）。

## Tech Stack Selection

- 前端框架：React 19 + TypeScript（已在 `package.json` 验证）
- 构建工具：Vite 8
- 样式体系：全局 `src/index.css` + 现有 `pm-*` 命名规范
- 数据形态：当前为本地内存状态（`App.tsx` 的 `projectsState`）

## Implementation Approach

采用“**在现有项目管理页增量改造**”策略：复用当前列表、筛选、状态机与路由，不引入新架构。
核心决策：

1. 复用 `ProjectManagementPage` 与 `CreateProjectModeModal` 入口，改为表单化创建，避免新增页面。
2. 复用 `projectStatusMachine.ts` 的流转规则，列表内状态更新走同一守卫逻辑，保证一致性。
3. 创建时将业务字段映射到现有 `ProjectItem` 结构，并补充可扩展字段，保持兼容。

复杂度与性能：

- 列表处理保持现有 `useMemo + processProjects`，查询/筛选/排序为 O(n log n) 上界（排序主导）。
- 创建与状态更新为数组单次映射 O(n)，数据量在 MVP 下可控。
- 避免重复渲染：仅在 `projectsState/filters` 变化时重算结果。

## Implementation Notes

- 严格复用当前路由与数据流：`App.tsx -> ProjectManagementPage -> ProjectListView/Toolbar/Modal`。
- 状态更新必须走 `canTransition`，禁止绕开守卫直接改状态。
- 保持向后兼容：保留原“新建项目”入口位置与“查看详情”行为，不改全局导航。
- 操作反馈采用现有轻量提示方式，不引入第三方消息库，控制改动面。
- 留痕最小化：沿用 `projectStatusLogs` 记录状态变更；新增创建日志进入同一日志容器。

## Architecture Design

- **状态拥有者**：`App.tsx`（项目列表主状态、状态日志）
- **页面编排层**：`ProjectManagementPage.tsx`（筛选、分页、弹窗开关、事件转发）
- **展示层**：
- `ProjectToolbar.tsx`（搜索/筛选/重置/新建触发）
- `ProjectListView.tsx`（列表展示、详情入口、状态操作）
- `CreateProjectModeModal.tsx`（改造为创建表单弹窗）
- **领域规则层**：`projectStatusMachine.ts`（流转守卫），`projectManagement.selectors.ts`（查询筛选）

## Directory Structure

## Directory Structure Summary

本次为现有项目管理页做单页增强，不新增业务模块，仅在既有文件内增量实现。

```text
/Users/dylan/CodeBuddy/20260402092847/src/App.tsx
  # [MODIFY] 增加项目创建与列表内状态更新处理；统一写入 projectsState 与 projectStatusLogs；继续透传详情跳转。

/Users/dylan/CodeBuddy/20260402092847/src/components/project/ProjectManagementPage.tsx
  # [MODIFY] 串联新建表单提交、状态更新回调与列表刷新；维持当前筛选/分页/视图切换行为。

/Users/dylan/CodeBuddy/20260402092847/src/components/personnel/CreateProjectModeModal.tsx
  # [MODIFY] 从“创建方式选择”改为“项目新建表单弹窗”；实现字段输入、必填校验、日期校验、提交中状态。

/Users/dylan/CodeBuddy/20260402092847/src/components/personnel/ProjectToolbar.tsx
  # [MODIFY] 补充重置操作（清空查询与筛选）；保留现有搜索和新建入口交互。

/Users/dylan/CodeBuddy/20260402092847/src/components/personnel/ProjectListView.tsx
  # [MODIFY] 增加操作列：查看详情按钮、更新状态控件；保留行点击兼容；完善空态文案与反馈。

/Users/dylan/CodeBuddy/20260402092847/src/components/personnel/projectManagement.types.ts
  # [MODIFY] 增补创建表单类型与项目扩展字段定义，确保字段映射类型安全。

/Users/dylan/CodeBuddy/20260402092847/src/data/projects.ts
  # [MODIFY] 新增“表单数据 -> ProjectItem”映射与编码生成辅助，复用现有状态/阶段映射规则。

/Users/dylan/CodeBuddy/20260402092847/src/index.css
  # [MODIFY] 增加新建表单、操作列、重置按钮及反馈样式，沿用 pm-* 命名与主题变量。
```
