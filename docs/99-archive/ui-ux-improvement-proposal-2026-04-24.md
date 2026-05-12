---
title: Ui Ux Improvement Proposal 2026 04 24
number: ARC-056
domain: archive
category: archived
status: archived
last_updated: 2026-05-05
---

# 页面与交互改进建议报告

> **项目**: 多Agent建店管理平台（WorkBuddy）  
> **分析范围**: 18个页面组件 + 共享组件库 + 设计规范  
> **分析日期**: 2026-04-24  
> **优先级**: P0=紧急, P1=重要, P2=建议

---

## 一、现状概览

### 1.1 页面清单（18个页面）

| 模块     | 页面                       | 使用共享组件                          | 独立实现                            |
| -------- | -------------------------- | ------------------------------------- | ----------------------------------- |
| 项目     | ProjectManagementPage      | ✅ AppSidebar, PageHeader, StatsCards | —                                   |
| 项目     | ProjectDetailPage (8标签)  | ✅ AppSidebar, PageHeader, TabNav     | —                                   |
| 任务     | TaskManagementPage         | ✅ AppShell, AppSidebar, PageHeader   | TaskStatsCards                      |
| 人员     | PersonnelPage              | ✅ AppSidebar                         | —                                   |
| 人员     | PersonnelUserDetailPage    | ✅ AppSidebar                         | —                                   |
| 客户     | CustomerManagementPage     | ⚠️ 部分共享                           | cm-stat-card                        |
| 采购     | ProcurementManagementPage  | ✅ 共享                               | —                                   |
| 采购     | SupplierDetailPage         | ✅ 共享                               | —                                   |
| 合同     | ContractSettlementPage     | ⚠️ 部分共享                           | csm-header                          |
| 订单     | **OrderManagementPage**    | ❌ **完全独立**                       | om-sidebar, om-header, om-stat-card |
| 设施     | FacilityManagementPage     | ✅ 共享                               | —                                   |
| 资源     | ResourcePoolPage           | ⚠️ 部分共享                           | rp-header                           |
| 设置     | SystemSettingsPage         | ✅ 共享                               | —                                   |
| 标准     | StandardManagementPage     | ✅ 共享                               | —                                   |
| 标准     | StandardTemplateDetailPage | ⚠️ 部分共享                           | std-stat-card                       |
| 数字员工 | DigitalEmployeePage        | ✅ AppSidebar, PageHeader, StatsCards | —                                   |
| 数字员工 | EngineerAssistantPage      | ✅ 共享                               | —                                   |

### 1.2 共享组件库现状

已建立的共享组件（`src/components/shared/`）：

- **Navigation**: AppSidebar, PageHeader, TabNav
- **Layout**: AppShell
- **Data Display**: StatCard, StatsCards, Pagination
- **Filter**: ListToolbar
- **Icons**: Icon（语义化图标系统）

---

## 二、设计一致性问题

### 🔴 P0: OrderManagementPage 完全脱离设计系统

**问题描述**: 订单管理页面是唯一仍使用完全独立实现的页面：

- 独立 sidebar (`om-sidebar`)：硬编码导航项、独立样式
- 独立 header (`om-header`)：独立搜索框、用户操作区
- 独立 stat-cards (`om-stat-card`)：4张卡片完全手写
- 独立 CSS 文件 (`order-management-page.css`)

**影响**: 用户切换页面时视觉体验断裂，维护成本高。

**建议**: 迁移到共享组件：

```tsx
// 改造后
<div className="pm-app">
  <AppSidebar currentHash={currentHash} />
  <div className="pm-workspace">
    <PageHeader title="订单管理" subtitle="Order Management" ... />
    <StatsCards items={...} />
    {/* 保留订单特有表格逻辑 */}
  </div>
</div>
```

---

### 🟡 P1: 统计卡片仍有硬编码实现

**问题描述**: 以下页面仍有硬编码统计卡片：

- `CustomerManagementPage` — `cm-stat-card`
- `StandardTemplateDetailPage` — `std-stat-card`
- `TaskManagementPage` — `TaskStatsCards`（虽独立但已较规范）

**建议**: 统一使用 `StatsCards` + `StatCard`，通过配置驱动。

---

### 🟡 P1: 图标系统不统一

**问题描述**:

- `TaskManagementPage.tsx` 有 **47个独立 Icon import**
- 部分页面使用 `<img src="..." />` 直接引用 SVG
- 部分页面使用共享 `Icon` 组件

**建议**: 全面迁移到 `Icon` 语义化组件，所有图标通过 `IconName` 统一管理。

---

### 🟡 P1: CSS 魔法值泛滥

**问题描述**:

- `project-detail.css` 中大量硬编码尺寸：`86.95px`、`43.33px`、`128px`、`16.5px`
- 各页面 CSS 文件中存在 200+ 未提取变量的魔法值
- 与设计规范中的 `--pm-*` 变量体系不匹配

**建议**:

1. 建立 CSS 变量映射表，将常用魔法值纳入设计系统
2. 优先使用 `var(--pm-spacing-*)`、`var(--pm-radius-*)`
3. 对特殊尺寸添加注释说明设计意图

---

## 三、交互体验问题

### 🔴 P0: window.alert 阻断式提示

**问题位置**: `TaskManagementPage.tsx` 第 801 行、第 999 行

```tsx
window.alert(`状态流转失败：\n${guardResult.blockedReason}`)
```

**问题**:

- 阻断用户操作，体验差
- 无法展示富文本或操作按钮
- 移动端适配差

**建议**: 替换为非阻断式 Toast/Notification 系统：

```tsx
// 建议实现
showToast({
  type: 'error',
  title: '状态流转失败',
  message: guardResult.blockedReason,
  action: { label: '查看详情', onClick: () => openGuardDetail(...) }
});
```

---

### 🟡 P1: 搜索交互缺乏防抖

**问题位置**: 多个页面的搜索框

**问题**:

- `ProjectManagementPage`、`TaskManagementPage`、`OrderManagementPage` 等页面的搜索都是直接 `onChange` 触发过滤
- 快速输入时产生大量不必要的重渲染和过滤计算

**建议**: 添加 300ms 防抖：

```tsx
const handleSearchChange = useDebouncedCallback((query: string) => {
  updateFilters({ searchQuery: query })
}, 300)
```

---

### 🟡 P1: 分页组件功能不完整

**问题位置**: `OrderManagementPage` 第 590-600 行

**问题**:

- 分页是静态展示，无法真正翻页
- 每页显示数量不可调整
- 缺少跳转到指定页的能力

**建议**:

1. 使用共享 `Pagination` 组件替代手写分页
2. 支持页码跳转、每页条数选择

---

### 🟡 P1: 项目详情页 KPI 条信息过载

**问题位置**: `ProjectDetailPage.tsx` 第 286-321 行

**问题**:

- KPI Strip 在 6 列网格中塞入过多信息
- 小屏幕下文字截断严重
- "待处理事项" 将三个数字合并显示，可读性差

**建议**:

1. 将 KPI Strip 拆分为两行：第一行核心指标，第二行详细数据
2. 或改为可横向滚动的卡片式布局
3. 添加 tooltip 展示详细 breakdown

---

### 🟡 P1: 任务详情侧拉窗缺少动画

**问题位置**: `TaskManagementPage.tsx` 第 1368-1396 行

**问题**:

- 任务详情侧拉窗 (`tm-detail-drawer-shell`) 直接出现/消失
- 缺少进入/退出动画
- Backdrop 点击关闭没有过渡

**建议**: 添加 CSS transition：

```css
.tm-detail-drawer-shell {
  transform: translateX(100%);
  transition: transform 0.3s ease;
}
.tm-detail-drawer-shell.open {
  transform: translateX(0);
}
```

---

### 🟢 P2: 页面切换缺少过渡动画

**问题**:

- Hash 路由切换时页面直接跳转
- 没有加载状态或过渡效果
- 虽然已有 `PageLoader` Suspense fallback，但日常切换感知不到

**建议**:

1. 页面切换时添加淡入淡出动画
2. 数据加载时显示骨架屏而非空白

---

## 四、可访问性问题

### 🟡 P1: 部分交互元素缺少焦点样式

**问题**:

- 自定义按钮、卡片点击区域缺少 `:focus-visible` 样式
- Tab 导航时焦点不可见

**建议**:

```css
.pm-nav-item:focus-visible,
.stat-card:focus-visible {
  outline: 2px solid var(--pm-primary);
  outline-offset: 2px;
}
```

---

### 🟡 P1: 表单错误提示不统一

**问题**:

- `ProjectDetailPage` 编辑弹窗使用行内错误提示
- `TaskManagementPage` 使用 `window.alert`
- `CreateProjectModeModal` 使用 modal 内错误展示

**建议**: 建立统一的表单验证和错误提示规范：

1. 字段级错误：行内红色提示
2. 表单级错误：顶部错误摘要
3. 系统级错误：Toast 通知

---

### 🟢 P2: 颜色对比度需验证

**问题**:

- 深色背景下使用 `rgba(255,255,255,0.30)` 作为提示文字
- 部分状态标签（如 `.project-status-badge`）的对比度可能不满足 WCAG AA

**建议**:

1. 使用对比度检查工具验证所有文字/背景组合
2. 确保正文对比度 ≥ 4.5:1，大文字 ≥ 3:1

---

## 五、组件架构问题

### 🟡 P1: App.tsx 过于庞大

**问题**:

- `App.tsx` 650 行，承载了路由分发、状态管理、业务逻辑
- 包含 `transitionProjectStatus`、`createProject`、`handleUpdateProjectBasicInfo` 等大量业务逻辑
- 路由分发仍使用硬编码 `if/else`，未使用 `pageComponentRegistry`

**建议**:

1. **路由分发改造**：使用 `pageComponentRegistry` + 动态渲染：

```tsx
const PageComponent = getPageComponent(route.page)
return <PageComponent {...pageProps} />
```

2. **业务逻辑下沉**：将项目状态流转逻辑移至 `src/domain/` 或自定义 Hook
3. **状态管理优化**：当前使用 Zustand store，但 App.tsx 仍持有大量派生逻辑，可移至 selector

---

### 🟡 P1: AppShell 和手动布局并存

**问题**:

- `TaskManagementPage` 使用 `AppShell` 包裹
- 其他页面（如 `ProjectManagementPage`、`DigitalEmployeePage`）手动写 `<div className="pm-app">...`
- 两种模式功能相同但代码重复

**建议**: 统一使用 `AppShell`，所有页面遵循相同布局模式：

```tsx
<AppShell
  rootClassName="pm-app"
  glowClassPrefix="pm-glow"
  workspaceClassName="pm-workspace"
  mainClassName="pm-main"
  sidebar={<AppSidebar currentHash={currentHash} />}
  header={<PageHeader ... />}
>
  {/* 页面内容 */}
</AppShell>
```

---

### 🟢 P2: 页面级状态管理分散

**问题**:

- 各页面自行管理 `searchQuery`、`filters`、`currentPage` 等状态
- 模式重复：几乎每个列表页都有相同的 state 结构

**建议**: 提取通用列表状态 Hook：

```tsx
function useListState<TFilters extends Record<string, unknown>>(defaultFilters: TFilters) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  // ... 通用逻辑
}
```

---

## 六、视觉层级问题

### 🟡 P1: 项目详情页标签过多

**问题**: `ProjectDetailPage` 有 8 个标签（overview, scope, schedule, cost, quality, resources, risk, settings）

**问题**:

- 在小屏幕上标签换行或需要横向滚动
- 用户难以快速定位常用标签

**建议**:

1. 将标签按使用频率分组：核心标签（overview, scope, schedule）+ 辅助标签
2. 或添加"更多"下拉菜单收纳不常用标签
3. 记住用户最后访问的标签

---

### 🟢 P2: 空状态设计缺失

**问题**:

- 列表为空时大多显示空白或简单文字
- `ProjectPlaceholderView` 已有实现但不够丰富

**建议**:

1. 统一空状态组件，包含：插画 + 说明文字 + 操作按钮
2. 根据场景提供引导性操作（如"创建第一个项目"）

---

## 七、改进优先级汇总

| 优先级 | 问题                               | 影响范围 | 预估工作量 |
| ------ | ---------------------------------- | -------- | ---------- |
| **P0** | OrderManagementPage 迁移到共享组件 | 1个页面  | 2-3h       |
| **P0** | 替换 window.alert 为 Toast         | 全局     | 3-4h       |
| **P1** | App.tsx 路由分发改造               | 全局     | 2-3h       |
| **P1** | 统一使用 AppShell 布局             | 多个页面 | 2-3h       |
| **P1** | 搜索防抖                           | 多个页面 | 1-2h       |
| **P1** | 硬编码统计卡片迁移                 | 3个页面  | 2h         |
| **P1** | 图标系统统一                       | 全局     | 4-6h       |
| **P1** | KPI Strip 信息优化                 | 1个页面  | 1-2h       |
| **P1** | 侧拉窗动画                         | 1个页面  | 1h         |
| **P1** | 焦点样式补全                       | 全局     | 2h         |
| **P2** | CSS 魔法值清理                     | 全局     | 4-6h       |
| **P2** | 页面过渡动画                       | 全局     | 2-3h       |
| **P2** | 空状态组件                         | 全局     | 2-3h       |
| **P2** | 对比度验证                         | 全局     | 2h         |

---

## 八、推荐实施顺序

### 第一阶段：一致性修复（1-2天）

1. **OrderManagementPage 组件迁移** — 消除最大的不一致
2. **App.tsx 路由改造** — 技术债务清理
3. **AppShell 统一** — 建立统一布局模式

### 第二阶段：交互优化（2-3天）

4. **Toast 系统建立** — 替换所有 window.alert
5. **搜索防抖** — 提升列表页性能
6. **侧拉窗动画** — 提升任务管理体验

### 第三阶段：视觉优化（2-3天）

7. **图标系统统一** — 全面迁移到 Icon 组件
8. **KPI Strip 重构** — 优化信息密度
9. **CSS 变量清理** — 减少魔法值

### 第四阶段：可访问性（1-2天）

10. **焦点样式补全**
11. **对比度验证与修复**
12. **空状态组件统一**

---

## 九、设计规范符合度检查

| 规范项              | 符合度 | 备注                   |
| ------------------- | ------ | ---------------------- |
| 色彩系统 (`--pm-*`) | ⚠️ 70% | 部分页面使用硬编码色值 |
| 字体系统            | ✅ 85% | 基本遵循，部分特殊尺寸 |
| 间距系统            | ⚠️ 60% | 大量魔法值未使用变量   |
| 圆角系统            | ✅ 80% | 基本遵循               |
| 卡片结构            | ✅ 90% | 共享组件已规范         |
| 响应式断点          | ✅ 75% | 已有媒体查询，可完善   |
| BEM 命名            | ⚠️ 50% | 部分使用，部分未遵循   |

---

_报告完成。如需针对某一项展开详细实施方案，请告知。_
