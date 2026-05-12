---
id: DOC-DESIGN-DESIGN-SYSTEM-
number: DES-003
domain: design
category: design-system
title: 项目详情页全面翻新
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
---

# 项目详情页全面翻新

## 问题

- 8 个平铺 Tab 只有文字无图标，快速扫视困难
- `overflow-x-auto` 可能截断 TabsTrigger 的 active 底部指示线
- 各 Tab 内容区标题/间距/padding 不统一，各标签自行管理 heading
- 缺少固定项目头部（项目名/编码/状态），切换 Tab 后即消失

## 方案

### 1. 项目头部（固定在 Tab 上方）

```
面包屑: 项目管理 > {项目名称}
项目名称: XXXXX   编码: PRJ-001   状态: [进行中] 品牌: 肯德基
```

- 使用 shadcn Card 包裹，始终渲染在 Tabs 上方
- 数据来自 `ProjectDetail` 的 `projectCode`、`name`、`status`、`brand`
- 不随 Tab 切换变化

### 2. Tab 栏加图标

| Tab        | 图标            | 图标名            |
| ---------- | --------------- | ----------------- |
| 项目概览   | LayoutDashboard | `LayoutDashboard` |
| 范围与任务 | GitBranch       | `GitBranch`       |
| 进度管理   | Timer           | `Timer`           |
| 成本与采购 | DollarSign      | `DollarSign`      |
| 质量与验收 | CheckCircle2    | `CheckCircle2`    |
| 资源与人员 | Users           | `Users`           |
| 风险与沟通 | AlertTriangle   | `AlertTriangle`   |
| 项目设置   | Settings        | `Settings`        |

- 每个 TabsTrigger 内 `icon + label` 组合
- 图标 size-4，与文字 gap-1.5

### 3. 修复下划线指示器

当前 TabsTrigger 的 `after:bottom-[-5px]` 下划线可能被 `overflow-x-auto` 的滚动容器裁切。解决方案：将 `overflow-x-auto` 移至 TabsList 容器内侧，留出下划线所需的 `pb-1` 空间。

### 4. 标准化内容区

- 移除各 Tab 组件内部的独立 `<h3>` 标题
- 统一使用 `space-y-4` 作为内容区容器
- Tab 组件只返回内容卡片，不控制页面级 padding

## 涉及文件

- `src-next/pages/projects/ProjectDetailPage.tsx` — 修改：加项目头部 + Tab 图标 + 修下划线
- `src-next/pages/projects/detail/tab-overview.tsx` — 微调：移除重复标题
- `src-next/pages/projects/detail/tab-scope.tsx` — 微调：移除重复标题
- `src-next/pages/projects/detail/tab-progress.tsx` — 微调：移除重复标题
- `src-next/pages/projects/detail/tab-cost.tsx` — 微调：移除重复标题
- `src-next/pages/projects/detail/tab-quality.tsx` — 微调：移除重复标题
- `src-next/pages/projects/detail/tab-resource.tsx` — 微调：移除重复标题
- `src-next/pages/projects/detail/tab-risk.tsx` — 微调：移除重复标题
- `src-next/pages/projects/detail/tab-settings.tsx` — 微调：移除重复标题
