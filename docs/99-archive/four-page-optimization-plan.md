---
id: DOC-04-OPS-4-PAGE-OPTIMIZATION
title: 四页面优化计划（以项目管理列表为基准）
date: 2026-04-25
status: archived
archived_reason: MUI 旧栈优化方案，UI 已切换为 shadcn，不再适用
archived_at: 2026-05-06
source_of_truth: true
---

# 四页面优化计划（以项目管理列表为基准）

> **基准页面**：ProjectManagementPage（项目管理列表）  
> **目标页面**：PersonnelPage、DigitalEmployeePage、ProcurementManagementPage、TaskManagementPage  
> **核心原则**：配色统一、布局统一、组件复用、响应式一致

---

## 一、基准页面分析（ProjectManagementPage）

### 1.1 布局结构

```
.pm-app
├── .pm-glow-left / .pm-glow-right
├── AppSidebar（可折叠，currentHash 驱动）
└── .pm-workspace
    └── .pm-main
        ├── PageHeader（标题 + 副标题 + 搜索框）
        └── .pm-body
            ├── StatsCards（4 个统计卡片，可点击筛选）
            ├── .pm-table-section（工具栏 + 视图切换 + 表格/看板/网格）
            └── Pagination（分页器）
```

### 1.2 配色特征

| 元素        | 颜色       | Token                                     |
| ----------- | ---------- | ----------------------------------------- |
| 页面背景    | 深蓝渐变   | `--pm-bg: #051338`                        |
| 侧边栏背景  | 半透明深蓝 | `--pm-sidebar-bg: rgba(10, 35, 99, 0.90)` |
| 卡片背景    | 极淡白     | `--pm-card: rgba(255, 255, 255, 0.04)`    |
| 主文字      | 纯白       | `--pm-text-white: #fff`                   |
| 次要文字    | 70% 白     | `--pm-text-70: rgba(255, 255, 255, 0.70)` |
| 边框        | 8% 白      | `--pm-border: rgba(255, 255, 255, 0.08)`  |
| 统计卡片-蓝 | `#2B7FFF`  | `--pm-blue`                               |
| 统计卡片-绿 | `#00BC7D`  | `--pm-green`                              |
| 统计卡片-紫 | `#8E51FF`  | `--pm-purple`                             |
| 统计卡片-橙 | `#FE9A00`  | `--pm-orange`                             |

### 1.3 组件复用特征

| 组件         | 来源                  | 用途                |
| ------------ | --------------------- | ------------------- |
| `AppSidebar` | `shared/navigation`   | 主导航              |
| `PageHeader` | `shared/navigation`   | 页头（标题 + 搜索） |
| `StatsCards` | `shared/data-display` | 统计卡片组          |
| `Pagination` | `shared/data-display` | 分页器              |

### 1.4 响应式特征

- 桌面端（默认）：sidebar 展开，表格多列
- 平板端（≤1024px）：sidebar 可折叠，表格列减少
- 移动端（≤768px）：workspace 垂直排列，表格卡片化

---

## 二、目标页面现状与差距

### 2.1 PersonnelPage（人员管理）

**现状**：

```
.pm-app
├── .pm-glow-left / .pm-glow-right
├── AppSidebar
└── .pm-workspace
    └── .pm-main
        ├── PageHeader
        └── .pm-body
            ├── PersonnelTabs（自定义 Tab 导航）
            ├── StatsCards（✅ 使用共享组件）
            └── UserTable（自定义表格）
```

**与基准的差距**：

| 维度     | 现状                      | 基准                                            | 差距       |
| -------- | ------------------------- | ----------------------------------------------- | ---------- |
| 布局结构 | ✅ 完全一致               | `.pm-app > .pm-workspace > .pm-main > .pm-body` | 无         |
| 统计卡片 | ✅ 使用 StatsCards        | StatsCards                                      | 无         |
| Tab 导航 | ❌ 自定义 `PersonnelTabs` | 无 Tab（或可用 `TabNav`）                       | 组件可统一 |
| 表格样式 | ❓ 需验证                 | `pm-table-section`                              | 可能不一致 |
| 响应式   | ❓ 需验证                 | 三断点                                          | 可能不完整 |

**优化建议**：

1. 将 `PersonnelTabs` 替换为共享 `TabNav` 组件
2. 统一表格样式为 `pm-table-section`
3. 验证响应式表现

---

### 2.2 DigitalEmployeePage（数字员工）

**现状**：

```
.pm-app
├── .pm-glow-left / .pm-glow-right
├── AppSidebar
└── .pm-workspace
    └── .pm-main
        ├── PageHeader
        └── .pm-body
            ├── 自定义 statCards（❌ 未使用 StatsCards）
            └── 自定义 AgentCard 网格
```

**与基准的差距**：

| 维度     | 现状                    | 基准                                            | 差距                     |
| -------- | ----------------------- | ----------------------------------------------- | ------------------------ |
| 布局结构 | ✅ 基本一致             | `.pm-app > .pm-workspace > .pm-main > .pm-body` | 无                       |
| 统计卡片 | ❌ **自定义实现**       | `StatsCards`                                    | **需替换**               |
| 卡片网格 | ❌ 自定义 AgentCard     | 无对应组件                                      | 需评估是否提取为共享组件 |
| 配色     | 🟡 使用自己的 assetBase | `/assets/CodeBubbyAssets/3848_19`               | 图标路径不一致           |

**优化建议**：

1. **高优先级**：将自定义 statCards 替换为 `StatsCards`
2. 统一图标 assetBase 为共享路径
3. AgentCard 如在其他页面复用，提取到 `shared/data-display`

---

### 2.3 ProcurementManagementPage（采购管理）

**现状**：

```
.pm-app
├── .pm-glow-left / .pm-glow-right
├── AppSidebar
└── .pm-workspace
    └── .pm-main
        ├── PageHeader
        └── .pm-body
            ├── 自定义 topTabs（❌ 未使用 TabNav）
            ├── StatsCards（✅ 使用共享组件）
            └── SupplierTable（自定义表格）
```

**与基准的差距**：

| 维度     | 现状                | 基准                                            | 差距       |
| -------- | ------------------- | ----------------------------------------------- | ---------- |
| 布局结构 | ✅ 一致             | `.pm-app > .pm-workspace > .pm-main > .pm-body` | 无         |
| 统计卡片 | ✅ 使用 StatsCards  | StatsCards                                      | 无         |
| Tab 导航 | ❌ 自定义 `topTabs` | 无 Tab（或可用 `TabNav`）                       | 组件可统一 |
| 表格样式 | ❓ 需验证           | `pm-table-section`                              | 可能不一致 |

**优化建议**：

1. 将 `topTabs` 替换为共享 `TabNav`
2. 统一表格样式为 `pm-table-section`

---

### 2.4 TaskManagementPage（任务中心）

**现状**：

```
.pm-app
├── .pm-glow-left / .pm-glow-right
├── AppSidebar
└── .pm-workspace
    └── .pm-main
        ├── PageHeader
        └── .pm-body
            ├── TaskStatsCards（❓ 自定义还是共享？）
            ├── TaskToolbar（自定义工具栏）
            └── TaskListView / TaskDetailPage
```

**与基准的差距**：

| 维度     | 现状                    | 基准                                            | 差距                       |
| -------- | ----------------------- | ----------------------------------------------- | -------------------------- |
| 布局结构 | ✅ 一致                 | `.pm-app > .pm-workspace > .pm-main > .pm-body` | 无                         |
| 统计卡片 | ❓ `TaskStatsCards`     | `StatsCards`                                    | 需确认是否可统一           |
| 工具栏   | ❌ 自定义 `TaskToolbar` | `ProjectToolbar`                                | 功能类似，可提取共享工具栏 |
| 视图切换 | ❌ 自定义实现           | `ProjectToolbar` 内嵌                           | 可统一                     |

**优化建议**：

1. 评估 `TaskStatsCards` 是否可替换为 `StatsCards`
2. 提取通用工具栏组件（搜索 + 筛选 + 视图切换 + 新建按钮）

---

## 三、统一优化计划

### Phase 1：统计卡片统一（0.5 天）

**目标**：所有页面使用共享 `StatsCards`

| 页面                | 当前实现              | 操作                  |
| ------------------- | --------------------- | --------------------- |
| DigitalEmployeePage | 自定义 statCards 数组 | **替换为 StatsCards** |
| TaskManagementPage  | `TaskStatsCards`      | 评估是否可替换        |

**验收标准**：

- `grep -r "statCards\|TaskStatsCards" src/components/` 仅在 `StatsCards/index.tsx` 和页面 props 中出现

---

### Phase 2：Tab 导航统一（0.5 天）

**目标**：所有页面的 Tab 使用共享 `TabNav`

| 页面                      | 当前实现        | 操作            |
| ------------------------- | --------------- | --------------- |
| PersonnelPage             | `PersonnelTabs` | 替换为 `TabNav` |
| ProcurementManagementPage | `topTabs`       | 替换为 `TabNav` |

**验收标准**：

- `grep -r "PersonnelTabs\|topTabs" src/components/` 返回 0 结果

---

### Phase 3：表格区域统一（1 天）

**目标**：所有列表页使用统一的表格容器样式

**提取共享样式**：

```css
/* 添加到 index.css 或共享 CSS */
.pm-table-section {
  background: var(--pm-card);
  border: 1px solid var(--pm-border);
  border-radius: var(--pm-radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pm-table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
```

**应用页面**：

- ProjectManagementPage（已有，作为基准）
- PersonnelPage
- ProcurementManagementPage
- TaskManagementPage

---

### Phase 4：工具栏统一（1 天）

**目标**：提取通用列表工具栏组件

**共享组件**：`shared/filters/ListToolbar`（已存在，需增强）

**功能清单**：

- 视图模式切换（列表/看板/网格）
- 搜索框
- 筛选器下拉
- 新建按钮
- 重置筛选

**应用页面**：

- ProjectManagementPage（已有 `ProjectToolbar`）
- TaskManagementPage（已有 `TaskToolbar`）
- PersonnelPage
- ProcurementManagementPage

---

### Phase 5：响应式统一（1 天）

**目标**：所有 4 个页面在 3 个断点下表现一致

**断点定义**：

```css
/* 桌面（默认） */
/* 平板 */
@media (max-width: 1024px) { ... }
/* 手机 */
@media (max-width: 768px) { ... }
```

**统一规则**：

- 1024px：sidebar 可折叠，表格列减少，统计卡片 2×2 排列
- 768px：workspace 垂直排列，表格卡片化，统计卡片 1 列

---

## 四、执行顺序与工期

```
Day 1（上午）: Phase 1 — 统计卡片统一
Day 1（下午）: Phase 2 — Tab 导航统一
Day 2: Phase 3 — 表格区域统一
Day 3: Phase 4 — 工具栏统一
Day 4: Phase 5 — 响应式统一 + 回归测试
```

**总工期**：4 天

---

## 五、与项目详情页修复的衔接

项目详情页的修复（对齐全局布局结构）应**优先于**四页面优化执行，因为：

1. 项目详情页修复是「bug 修复」，四页面优化是「体验提升」
2. 项目详情页修复后，其布局结构将与基准页一致，便于后续统一响应式
3. 项目详情页修复仅需 0.5 天，可快速完成

**建议顺序**：

1. 项目详情页布局修复（0.5 天）
2. 四页面优化 Phase 1-5（4 天）

---

## 六、验收标准

| 检查项               | 验证方式                                                         |
| -------------------- | ---------------------------------------------------------------- |
| 4 个页面布局结构一致 | 代码对比：均使用 `.pm-app > .pm-workspace > .pm-main > .pm-body` |
| 统计卡片统一         | 所有页面使用 `StatsCards`，无自定义实现                          |
| Tab 导航统一         | 所有页面使用 `TabNav`，无自定义实现                              |
| 表格区域统一         | 所有列表页使用 `.pm-table-section`                               |
| 响应式一致           | 4 个页面在 1024px/768px 下无横向溢出                             |
| 配色一致             | 无页面级硬编码色值，全部使用 CSS token                           |
| 构建通过             | `npm run build` 零报错                                           |

---

**计划编制**：Buddy  
**编制日期**：2026-04-25
