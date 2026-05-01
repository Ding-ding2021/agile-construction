# 共享UI组件

# 共享UI组件模块

## 概述

共享UI组件模块为项目管理应用程序提供了一个可复用、可主题化的组件库。它将常见的UI模式——数据展示、筛选、分页、反馈和图标——封装成一致、类型完善的组件。所有组件均使用CSS自定义属性系统（`--pm-*`）进行主题化，并支持可配置的`classNamePrefix`以实现命名空间隔离。

## 架构

该模块分为四个子目录，每个子目录负责不同的关注点：

```
src/components/shared/
├── data-display/          # 数据展示组件
│   ├── Pagination/        # 页面导航
│   ├── StatCard/          # 单一指标卡片
│   └── StatsCards/        # StatCard组
├── feedback/              # 用户反馈组件
│   └── EmptyState.tsx     # 空/无数据状态
├── filters/               # 筛选和搜索
│   └── ListToolbar/       # 视图切换 + 搜索栏
├── hooks/                 # 共享状态逻辑
│   └── useListState.ts    # 列表分页/筛选钩子
├── icons/                 # 图标系统
│   ├── Icon.tsx           # 图标组件
│   └── index.ts           # 图标注册表和类型
├── mui/                   # MUI包装组件
│   ├── PmButton.tsx       # 主题化按钮
│   ├── PmInput.tsx        # 带清除功能的主题化输入框
│   ├── PmTable.tsx        # 带骨架屏的主题化表格
│   └── index.ts           # 重新导出的MUI组件
├── ProjectCard.tsx        # 项目卡片（网格/看板/紧凑）
└── ProjectCard.css        # 项目卡片样式
```

## 关键组件

### ProjectCard

以三种视觉变体之一渲染项目项：`grid`（网格）、`kanban`（看板）或`compact`（紧凑）。通过`variant`属性选择变体。

- **网格变体**：多列卡片，显示所有项目字段（名称、代码、品牌、状态、进度、阶段、负责人、日期）。包含一个"打开"操作按钮。
- **看板变体**：针对看板优化的紧凑卡片，显示名称、代码、状态、进度、负责人和截止日期。
- **紧凑变体**：最小化的单行卡片，显示名称、状态和进度条。

所有变体都支持可选的`onClick`处理函数。当提供时，卡片变为可点击状态，并显示指针光标。项目项上的`statusTone`字段控制状态标签的颜色（蓝色、黄色、绿色、红色）。

```tsx
<ProjectCard project={project} variant="grid" onClick={handleProjectClick} />
```

### Pagination

一个完全受控的分页组件。它显示总记录数、当前页、每页大小和导航箭头。`classNamePrefix`属性允许自定义命名空间（默认为`pm`）。

```tsx
<Pagination total={100} currentPage={1} pageSize={10} onPageChange={setPage} />
```

### StatCard 和 StatsCards

`StatCard`显示单个指标，包含图标、标签、数值、可选的增量（趋势指示器）和子标签。它支持`vertical`（垂直）和`horizontal`（水平）布局。`trend`属性可以显式设置（`up`/`down`/`neutral`），也可以从`delta`字符串自动推断（例如，`+12%` → `up`）。

`StatsCards`从项目数组渲染一组`StatCard`组件。它支持`activeKey`用于高亮选中的卡片，以及`onItemClick`回调。

```tsx
<StatsCards
  items={[
    {
      key: 'revenue',
      icon: 'dollar',
      label: '收入',
      value: '¥1,234',
      tone: 'green',
      delta: '+12%',
    },
    { key: 'tasks', icon: 'task', label: '任务', value: 42, tone: 'blue' },
  ]}
  activeKey="revenue"
  onItemClick={handleStatClick}
/>
```

### EmptyState

一个灵活的空状态组件，用于显示"无数据"或"无结果"场景。支持图标（可以是React节点或图片URL）、标题、描述以及用于操作按钮的可选子元素。`compact`属性渲染一个更小的变体。

```tsx
<EmptyState iconSrc="/assets/empty.svg" title="暂无数据" description="请调整筛选条件后重试" />
```

### ListToolbar

一个结合了视图模式切换（例如，网格/看板/列表）和搜索输入框的工具栏。`rightSlot`属性允许在右侧注入额外的控件（例如，筛选按钮、操作按钮）。

```tsx
<ListToolbar
  viewModes={[
    { key: 'grid', label: '网格' },
    { key: 'kanban', label: '看板' },
  ]}
  activeView="grid"
  onViewChange={setView}
  searchQuery={search}
  onSearchChange={setSearch}
  rightSlot={<button>筛选</button>}
/>
```

### useListState 钩子

一个管理列表状态的通用钩子：搜索查询、筛选条件、分页和数据处理。它接受一个`process`函数，该函数根据当前状态转换源数据并返回`{ data, total }`。该钩子返回响应式状态和设置器。

```tsx
const { data, total, currentPage, setCurrentPage, searchQuery, setSearchQuery } = useListState({
  source: projects,
  initialFilters: { status: 'active' },
  pageSize: 20,
  process: ({ source, filters, page, pageSize, searchQuery }) => {
    // 应用筛选、搜索和分页
    return { data: filtered, total: filtered.length }
  },
})
```

### 图标系统

图标系统提供了一个带有语义名称的SVG图标集中注册表。`Icon`组件使用注册表中的正确路径渲染一个`<img>`标签。尺寸是预定义的（`xs`=12px，`sm`=16px，`md`=20px，`lg`=24px，`xl`=32px）或自定义数值。

```tsx
<Icon name="search" size="lg" />
<Icon name="add" size={18} className="custom-icon" />
```

注册表（`index.ts`）导出：

- `IconName`类型（所有图标名称的联合类型）
- `iconPaths`记录，将名称映射到文件路径
- `getIconPath()`函数，用于路径解析
- `hasIcon()`类型守卫
- `navIconMap`，用于侧边栏导航映射

### MUI包装组件

三个组件将Material-UI（MUI）与项目特定的主题化包装在一起：

- **PmButton**：将`variant`（`primary`/`secondary`/`ghost`/`danger`/`icon`）映射到MUI变体。支持带旋转器的`loading`状态。尺寸有`sm`（28px）和`md`（32px）。
- **PmInput**：包装MUI的`TextField`，带有一个可选的清除按钮。支持受控和非受控使用。
- **PmTable**：一个带骨架屏加载、空状态和分页的主题化表格。接受带有自定义渲染函数的类型化列定义。

`mui/index.ts`文件重新导出常用的MUI组件（Button、Dialog、Typography等），以便页面从单一源导入，从而实现未来的主题全局更改。

## 主题化

所有组件都使用CSS自定义属性进行主题化。关键变量如下：

| 变量              | 用途                    |
| ----------------- | ----------------------- |
| `--pm-card`       | 卡片背景色              |
| `--pm-border`     | 边框颜色                |
| `--pm-text-white` | 主要文本颜色            |
| `--pm-text-60`    | 次要文本（60%不透明度） |
| `--pm-text-40`    | 弱化文本（40%不透明度） |
| `--pm-element`    | 元素悬停背景色          |
| `--pm-primary`    | 主要强调色              |
| `--pm-blue-light` | 蓝色渐变终点            |
| `--pm-radius-xl`  | 大圆角半径              |
| `--pm-shadow-md`  | 中等盒子阴影            |
| `--pm-gap-md`     | 中等间距                |
| `--pm-font-xs`    | 极小字体大小            |
