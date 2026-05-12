---
title: Page Issues Audit 2026 04 25
number: ARC-047
domain: archive
category: archived
status: archived
last_updated: 2026-05-05
---

# 全站页面问题排查与修复计划

> 排查时间：2026-04-25
> 排查范围：src/components/ 下全部 33 个页面/视图组件

---

## 一、问题总览

| 类别                 | 数量              | 优先级 |
| -------------------- | ----------------- | ------ |
| 图标资源缺失         | 6+ 页面           | P0     |
| 项目详情页标签未启用 | 8 个标签 disabled | P1     |
| 独立 Sidebar 未统一  | 3 个页面          | P1     |
| 占位符内容           | 12+ 处            | P2     |
| 布局/CSS 问题        | 3 处              | P2     |
| EmptyState 替换遗漏  | 1 文件            | P3     |

---

## 二、P0 — 图标资源缺失

### 根因

大量页面引用的图标资源目录为空或不存在。全站仅 `3848_19`（77 SVG）和 `3990_3`（55 SVG）有文件，其余目录均为空。

### 影响矩阵

| 页面/组件                  | 引用目录    | 目录状态  | 影响范围                           |
| -------------------------- | ----------- | --------- | ---------------------------------- |
| TaskSidebar（任务管理）    | `3947_2`    | ❌ 空     | 侧边栏 13 个图标全损               |
| layout/Sidebar（项目详情） | `3923_861`  | ❌ 不存在 | 侧边栏 Logo + 13 个图标全损        |
| layout/Header（项目详情）  | `3923_861`  | ❌ 不存在 | 搜索/通知/用户图标全损             |
| OrderManagementPage        | `4106_3082` | ❌ 空     | 统计卡片 4 个图标全损              |
| ContractSettlementPage     | `4106_2422` | ❌ 空     | 统计卡片 + Tab 图标 + 操作图标全损 |
| StandardManagementPage     | `3998_1544` | ❌ 空     | 统计卡片 + 列表图标全损            |
| ProjectDetailPage 标签     | `3923_861`  | ❌ 不存在 | 10 个标签图标全损                  |
| PersonnelUserDetailPage    | `3848_19`   | ✅ 正常   | 无影响                             |

### 修复方案

**方案 A：统一图标目录（推荐）**
将所有页面的图标引用统一指向已有资源的目录：

- 统计卡片图标 → `3848_19`（已有 1.svg ~ 55.svg）
- 侧边栏导航图标 → `3990_3`（已有语义化命名如 dashboard, projects 等）

**方案 B：批量复制图标**
将 `3848_19` 的图标按编号复制到缺失目录，保持原有引用不变。

**决策**：采用方案 A，统一收敛到 `3848_19`（统计卡片）和 `3990_3`（侧边栏导航），同时删除/归档空目录的引用。

---

## 三、P1 — 项目详情页不完整

### 现状

`ProjectTabs.tsx` 定义了 10 个标签，但只有 `overview` / `gantt` 可点击：

```
概览 ✅  |  甘特图 ✅  |  任务 ❌  |  风险/问题 ❌  |  成本控制 ❌
项目采购 ❌ | 资料 ❌ | 成员 ❌ | 变更管理 ❌ | AI 工程师 ❌
```

`ProjectDetailPage` 渲染逻辑：

- `overview` → 项目概览网格（PhasesCard + SummaryCard + ActivitiesCard）
- 其他所有 tab → `ProjectGanttView`

### 8 个标签视图现状

| 标签      | 对应组件                                 | 状态                                                |
| --------- | ---------------------------------------- | --------------------------------------------------- |
| 任务      | `ProjectTaskAndWbsView`                  | 有代码，未接入                                      |
| 风险/问题 | `ProjectRiskTab`                         | 纯占位符（project-tab-placeholder）                 |
| 成本控制  | `ProjectCostTab`                         | 纯占位符                                            |
| 项目采购  | `ProjectProcurementTab`                  | 无独立组件                                          |
| 资料      | `ProjectDocsTab`                         | 无独立组件                                          |
| 成员      | `ProjectMembersView` / `ProjectTeamView` | ProjectMembersView 有代码，ProjectTeamView 是开发中 |
| 变更管理  | `ProjectChangesTab`                      | 无独立组件                                          |
| AI 工程师 | `ProjectDigitalEmployeeView`             | 开发中状态                                          |

### 修复方案

1. **启用标签点击**：将 `PROJECT_DETAIL_TABS` 扩展为全部 10 个，移除 `disabled` 状态
2. **接入已有视图**：
   - `tasks` → `ProjectTaskAndWbsView`
   - `members` → `ProjectMembersView`
3. **占位符视图升级**：为剩余 5 个标签提供轻量级真实视图（哪怕只是数据展示）
4. **替换旧 layout**：`layout/Sidebar` → `AppSidebar`，`layout/Header` → `PageHeader`

---

## 四、P1 — 独立 Sidebar 未统一

### 现状

| 页面               | Sidebar 实现               | 问题                                         |
| ------------------ | -------------------------- | -------------------------------------------- |
| PersonnelPage      | `PersonnelSidebar`（独立） | active 判断仅 projects/tasks，其余菜单不高亮 |
| TaskManagementPage | `TaskSidebar`（独立）      | 同上 + 图标目录缺失                          |
| ProjectDetailPage  | `layout/Sidebar`（旧）     | 图标目录缺失 + 不是 glass 风格               |

### 修复方案

将三个独立 sidebar 统一替换为 `AppSidebar`：

- `PersonnelPage` → 使用 `AppSidebar`（已验证可用）
- `TaskManagementPage` → 使用 `AppSidebar`
- `ProjectDetailPage` → 使用 `AppSidebar`

删除 `PersonnelSidebar`、`TaskSidebar`、`layout/Sidebar`、`layout/Header` 四个旧组件。

---

## 五、P2 — 占位符内容

### 清单

| 位置                                | 内容                     | 优先级 |
| ----------------------------------- | ------------------------ | ------ |
| `TaskListView` grid/kanban/calendar | "网格视图开发中" 等      | P2     |
| `ProjectOverviewTab`                | project-tab-placeholder  | P2     |
| `ProjectScopeTab`                   | project-tab-placeholder  | P2     |
| `ProjectScheduleTab`                | project-tab-placeholder  | P2     |
| `ProjectCostTab`                    | project-tab-placeholder  | P2     |
| `ProjectQualityTab`                 | project-tab-placeholder  | P2     |
| `ProjectResourcesTab`               | project-tab-placeholder  | P2     |
| `ProjectRiskTab`                    | project-tab-placeholder  | P2     |
| `ProjectSettingsTab`                | project-tab-placeholder  | P2     |
| `ProjectDigitalEmployeeView`        | "功能正在开发中"         | P2     |
| `ProjectTeamView`                   | "团队管理功能正在开发中" | P2     |
| `EngineerAssistantPage`             | "正在开发中..."          | P2     |
| `ProjectPlaceholderView`            | 日历/地图视图占位        | P3     |

### 修复方案

分阶段填充：

- **Phase 1**：将 `project-tab-placeholder` 替换为 `EmptyState` 组件 + 简短说明
- **Phase 2**：为高频标签（任务、成员、风险）构建真实视图
- **Phase 3**：剩余标签逐步填充

---

## 六、P2 — 布局/CSS 问题

### 发现的问题

1. **`TaskListView` 空状态替换未生效**
   - 之前 T5 替换的 `EmptyState` 没有写入成功，文件仍使用旧的 `.tm-placeholder-wrap`
   - 需重新替换

2. **`.tm-placeholder-wrap` CSS 已删除**
   - T5 中删除了 `.tm-placeholder-wrap` 和 `.tm-placeholder-content` 的 CSS 定义
   - 但 `TaskListView` 仍使用这些类名 → 空状态无样式

3. **SystemSettingsPage 内容列表项排版拥挤**
   - 配置项的"作用域/负责人/更新时间/风险"信息挤在一行
   - 需增加间距或使用更清晰的布局

4. **StandardTemplateDetailPage 条件渲染重复结构**
   - error 状态和正常状态各自渲染了一套 `AppSidebar + PageHeader`
   - 不是 bug，但可优化为统一外壳

---

## 七、修复计划

### Batch 1：紧急修复（图标 + 空状态）

| #   | 任务                                      | 文件                         | 预计时间 |
| --- | ----------------------------------------- | ---------------------------- | -------- |
| 1   | 统一 TaskSidebar 图标到 3848_19           | `TaskSidebar.tsx`            | 10min    |
| 2   | 统一 layout/Sidebar 图标到 3990_3         | `layout/Sidebar.tsx`         | 10min    |
| 3   | 统一 layout/Header 图标到 3990_3          | `layout/Header.tsx`          | 10min    |
| 4   | 修复 OrderManagementPage 图标             | `OrderManagementPage.tsx`    | 10min    |
| 5   | 修复 ContractSettlementPage 图标          | `ContractSettlementPage.tsx` | 10min    |
| 6   | 修复 StandardManagementPage 图标          | `StandardManagementPage.tsx` | 10min    |
| 7   | 重新替换 TaskListView 空状态为 EmptyState | `TaskListView.tsx`           | 15min    |
| 8   | 验证 build + lint                         | -                            | 5min     |

### Batch 2：项目详情页修复

| #   | 任务                             | 文件                    | 预计时间 |
| --- | -------------------------------- | ----------------------- | -------- |
| 9   | 启用全部 10 个标签点击           | `ProjectTabs.tsx`       | 15min    |
| 10  | 扩展 ProjectDetailPage tab 渲染  | `ProjectDetailPage.tsx` | 20min    |
| 11  | 接入 ProjectTaskAndWbsView       | `ProjectDetailPage.tsx` | 10min    |
| 12  | 接入 ProjectMembersView          | `ProjectDetailPage.tsx` | 10min    |
| 13  | 替换 layout/Sidebar → AppSidebar | `ProjectDetailPage.tsx` | 15min    |
| 14  | 替换 layout/Header → PageHeader  | `ProjectDetailPage.tsx` | 15min    |
| 15  | 删除旧 layout 组件               | `layout/*`              | 5min     |

### Batch 3：Sidebar 统一

| #   | 任务                                             | 文件                                            | 预计时间 |
| --- | ------------------------------------------------ | ----------------------------------------------- | -------- |
| 16  | PersonnelPage 替换 PersonnelSidebar → AppSidebar | `PersonnelPage.tsx`                             | 20min    |
| 17  | TaskManagementPage 替换 TaskSidebar → AppSidebar | `TaskManagementPage.tsx`                        | 20min    |
| 18  | 删除 PersonnelSidebar / TaskSidebar              | `personnel/Sidebar.tsx`, `task/TaskSidebar.tsx` | 5min     |
| 19  | 统一各页面 `currentHash` 获取逻辑                | 所有页面                                        | 15min    |

### Batch 4：占位符降级

| #   | 任务                                      | 文件                 | 预计时间 |
| --- | ----------------------------------------- | -------------------- | -------- |
| 20  | 8 个 project-tab-placeholder → EmptyState | `project/tabs/*.tsx` | 20min    |
| 21  | TaskListView 非 list 视图使用 EmptyState  | `TaskListView.tsx`   | 10min    |
| 22  | 其他开发中提示规范化                      | 各页面               | 15min    |

---

## 八、验证清单

- [ ] 所有页面侧边栏图标正常显示
- [ ] 所有页面统计卡片图标正常显示
- [ ] 项目详情页 10 个标签全部可点击
- [ ] 任务管理页空状态正确显示
- [ ] `npx vite build` 通过
- [ ] `npx tsc --noEmit` 通过
- [ ] 各页面导航高亮正确
- [ ] 响应式布局无重叠

---

## 九、附录：图标目录状态全量

| 目录        | 位置             | SVG 数量 | 用途                             |
| ----------- | ---------------- | -------- | -------------------------------- |
| `3848_19`   | public/assets    | 77       | PersonnelPage 统计卡片 + Sidebar |
| `3990_3`    | public/assets    | 55       | AppSidebar 语义化图标            |
| `3923_861`  | .codebuddy/figma | 0        | layout/Sidebar（无文件）         |
| `3947_2`    | .codebuddy/figma | 0        | TaskSidebar（无文件）            |
| `3998_1544` | .codebuddy/figma | 0        | StandardManagementPage（无文件） |
| `4106_2422` | .codebuddy/figma | 0        | ContractSettlementPage（无文件） |
| `4106_3082` | .codebuddy/figma | 0        | OrderManagementPage（无文件）    |
| `4106_3892` | .codebuddy/figma | 0        | 未使用                           |
| `4106_5251` | .codebuddy/figma | 0        | 未使用                           |
| `4203_756`  | .codebuddy/figma | 0        | 未使用                           |
| `4287_2`    | .codebuddy/figma | 0        | 未使用                           |
| `3997_751`  | .codebuddy/figma | 0        | 未使用                           |
| `4048_3`    | .codebuddy/figma | 0        | 未使用                           |
| `4048_588`  | .codebuddy/figma | 0        | 未使用                           |
| `4094_832`  | .codebuddy/figma | 0        | 未使用                           |
| `4102_1613` | .codebuddy/figma | 0        | 未使用                           |
