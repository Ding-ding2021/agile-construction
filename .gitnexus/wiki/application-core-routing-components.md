# 应用核心与路由——组件

# 应用核心与路由——组件模块

## 概述

本模块为应用程序提供基础UI组件和路由基础设施。它实现了一个**配置驱动的路由系统**，消除了`App.tsx`中的硬编码路由逻辑，并提供了一套可复用的共享组件，用于导航、布局和数据展示。

该模块分为两个主要部分：

- **路由** (`components/router/`)：基于路由配置的动态页面渲染
- **共享组件** (`components/shared/`)：可复用的UI构建块

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                    App.tsx (入口点)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │ route: AppRoute
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     AppRouter                                │
│  - 从路由配置解析页面组件                                     │
│  - 注入路由参数、回调和数据                                   │
│  - 使用Suspense包裹以支持懒加载                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ 渲染页面组件
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  共享组件                                     │
│  ┌──────────┐  ┌───────────┐  ┌────────┐  ┌───────────┐   │
│  │AppShell  │  │AppSidebar │  │PageHdr │  │ TabNav    │   │
│  │(布局)    │  │(导航)     │  │(页眉)  │  │(标签页)   │   │
│  └──────────┘  └───────────┘  └────────┘  └───────────┘   │
│  ┌──────────┐  ┌───────────┐  ┌────────┐  ┌───────────┐   │
│  │StatCard  │  │Pagination │  │EmptySt │  │ListToolbar│   │
│  │(展示)    │  │(展示)     │  │(反馈)  │  │(筛选器)   │   │
│  └──────────┘  └───────────┘  └────────┘  └───────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 路由组件

### AppRouter

`AppRouter`组件是中央路由调度器。它接收当前的`AppRoute`对象并渲染相应的页面组件。

**属性：**

| 属性                    | 类型                           | 描述                           |
| ----------------------- | ------------------------------ | ------------------------------ |
| `route`                 | `AppRoute`                     | 来自路由配置的当前路由对象     |
| `projects`              | `Array<{code, name, status}>`  | 用于数据驱动页面的全局项目数据 |
| `onOpenPersonnelDetail` | `(userId: string) => void`     | 人员详情导航的回调             |
| `onOpenSupplier`        | `(supplierId: string) => void` | 供应商详情导航的回调           |

**路由策略：**

该组件实现了一个两层路由策略：

1. **简单页面**（无属性或仅有公共属性）：由`AppRouter`自动渲染
2. **复杂页面**（详情视图、新建详情视图）：在`App.tsx`中作为特殊情况处理

**参数注入：**

`extractRouteParams`辅助函数将特定页面类型映射到其所需参数：

```typescript
case 'personnel-detail':      → { userId: route.userId }
case 'procurement-supplier-detail': → { supplierId: route.supplierId }
case 'standard-template-detail':    → { templateId: route.templateId }
```

**页面属性组装：**

属性以不可变方式分三层组装：

1. **路由参数**（针对`PARAM_PAGES`）：通过`extractRouteParams`提取
2. **回调属性**（针对`personnel`页面）：作为`onUserOpen`注入
3. **数据属性**（针对`contracts`/`projects`页面）：作为`projects`注入

**加载状态：**

`PageLoader`组件在路由切换期间提供一致的加载指示器，采用居中旋转器并带有应用程序深色主题背景。

## 共享导航组件

### AppSidebar

侧边栏导航组件提供应用程序的主要导航菜单。

**特性：**

- **可折叠**：支持受控和非受控折叠状态
- **持久化**：通过`useSidebarCollapsed`钩子将折叠状态持久化到`localStorage`
- **活动路由检测**：使用`isHashRouteActive`高亮当前部分
- **禁用项**：为未来功能渲染非交互项
- **图标映射**：通过`navIconMap`将导航标签映射到图标名称

**导航项：**

侧边栏从`nav.config.ts`渲染14个导航项，涵盖所有主要应用模块（项目、任务、客户、合同、采购等）。没有`href`的项将渲染为禁用状态。

### PageHeader

页面页眉组件在应用程序中提供一致的页面级页眉。

**特性：**

- **面包屑导航**：支持多级面包屑路径，带有可点击链接
- **搜索**：可选的搜索输入框，带有可配置的占位符
- **操作**：通知和AI助手按钮，用户资料展示
- **变体**：`standard`和`dark`变体，适用于不同模块上下文
- **可扩展性**：`extraTitleContent`和`extraActions`插槽用于自定义内容

### TabNav

支持多种视觉变体的标签导航组件。

**变体：**

| 变体        | 描述         |
| ----------- | ------------ |
| `default`   | 标准标签栏   |
| `pills`     | 药丸形标签   |
| `underline` | 下划线式标签 |

**特性：**

- **徽章支持**：标签上的数字徽章
- **隐藏标签**：标签可以有条件地隐藏
- **图标支持**：支持SVG图标（通过`Icon`组件）和基于图像的图标
- **无障碍性**：适当的ARIA角色和属性

### 导航工具函数

**`navigateByHash(targetHash)`**

处理基于哈希的导航，并解决相同哈希导航的问题：

```typescript
// 如果哈希不同，简单赋值即可
window.location.hash = targetHash

// 如果哈希相同，通过assign强制导航
window.location.assign(`${baseUrl}${targetHash}`)
```

**`isHashRouteActive(currentHash, href)`**

通过检查前缀匹配器来确定导航项是否处于活动状态：

```typescript
const routePrefixMatchers = {
  '#/projects': ['#/projects', '#/projects/'],
  '#/tasks': ['#/tasks', '#/tasks?', '#/tasks/'],
  // ... 更多路由
}
```

## 布局组件

### AppShell

`AppShell`组件提供应用程序的结构布局。

**属性：**

| 属性                 | 类型        | 描述                   |
| -------------------- | ----------- | ---------------------- |
| `rootClassName`      | `string`    | 根容器类名             |
| `sidebar`            | `ReactNode` | 侧边栏内容             |
| `header`             | `ReactNode` | 可选的页眉内容         |
| `children`           | `ReactNode` | 主要内容               |
| `workspaceClassName` | `string`    | 工作区类名             |
| `mainClassName`      | `string`    | 主要内容区域类名       |
| `glowClassPrefix`    | `string`    | 可选的光晕效果类名前缀 |

当提供`glowClassPrefix`时，该组件支持装饰性光晕效果，渲染左右光晕元素。

## 状态管理

### useSidebarCollapsed 钩子

管理侧边栏折叠状态，并持久化到`localStorage`：

```typescript
const { collapsed, toggle } = useSidebarCollapsed(controlled?: boolean)
```

- **受控模式**：当提供`controlled`时，钩子作为直通函数
- **非受控模式**：管理内部状态，并持久化到`localStorage`
- **切换**：返回切换后的新状态

## 模块导出

`components/shared/index.ts`桶文件按类别导出所有共享组件：

- **导航**：`AppSidebar`、`PageHeader`、`TabNav`
- **布局**：`AppShell`
- **数据展示**：`StatCard`、`Pagination`、`StatsCards`
- **筛选器**：`ListToolbar`
- **反馈**：`EmptyState`
- **图标**：`Icon`、`IconName`、`getIconPath`、`hasIcon`、`navIconMap`
- **卡片**：`ProjectCard`

## 集成点

该模块通过以下方式连接到代码库的其他部分：

1. **路由配置** (`config/routes`)：`AppRouter`从路由配置模块导入`PARAM_PAGES`和`getPageComponent`
2. **图标系统** (`components/icons`)：导航组件使用集中式图
