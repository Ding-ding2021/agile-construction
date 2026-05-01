# 应用核心与路由

# 应用核心与路由

## 目的

应用核心与路由模块是应用的中枢神经系统。它通过 MUI 主题初始化 React 应用，通过基于哈希的路由管理所有客户端导航，并提供基于配置的系统，根据当前路由渲染页面组件。该模块通过将导航、路由定义和页面渲染整合到统一的类型化架构中，消除了分散的路由逻辑。

## 子模块

- **[`src/`](application-core-routing-src.md)** — 应用入口点和路由枢纽。使用 `ThemeProvider`、`CssBaseline` 和 `StrictMode` 初始化 React 树，然后将渲染委托给 `App` 组件。
- **[`config/`](application-core-routing-config.md)** — 中央路由和导航枢纽。提供类型化的路由定义、将路由映射到页面组件的组件注册表、哈希解析工具以及完整的导航辅助函数集（`goToProjectDetail`、`goToTaskList`、`goToPersonnelList` 等）。
- **[`components/`](application-core-routing-components.md)** — 基础 UI 和路由基础设施。包含基于配置的 `AppRouter`，可根据当前路由动态渲染页面，以及用于导航、布局和数据展示的共享组件。

## 协同工作方式

该模块以三层管道方式运行：

1. **初始化**（`src/`）：`main.tsx` 使用 MUI 主题和 `CssBaseline` 挂载应用，然后渲染 `App` 组件。
2. **路由配置**（`config/`）：`App` 组件使用 `routes.ts` 中的路由定义和 `navigation.ts` 中的导航辅助函数管理基于哈希的 URL 变更。`feature-registry.ts` 类型确保所有路由和组件都是类型安全的。
3. **动态渲染**（`components/`）：`AppRouter` 组件读取当前哈希，通过 `extractRouteParams` 提取路由参数，从注册表中查找匹配的页面组件并渲染。侧边栏和导航栏等共享组件在各页面间复用。

## 关键工作流

- **页面导航**：任何组件调用 `config/navigation.ts` 中的 `goTo*` 函数（例如 `goToProjectDetail`），该函数更新 `window.location.hash`。哈希变更触发 `AppRouter` 解析新路由，与注册表匹配，并渲染对应的页面组件。
- **路由参数提取**：导航到详情页面（如项目详情、任务详情）时，`AppRouter` 使用 `extractRouteParams` 从哈希中提取动态段（如 ID），并将其作为属性传递给页面组件。
- **侧边栏状态**：来自 `components/shared/navigation/` 的 `useSidebarCollapsed` 钩子通过 `writeCollapsed` 持久化侧边栏折叠状态，确保跨路由变更时布局一致。
