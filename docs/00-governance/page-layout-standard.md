---
id: DOC-00-GOVERNANCE-PAGE-LAYOUT-STANDARD
title: 页面布局规范
owner: docs-maintainer
status: draft
last_updated: 2026-05-01
source_of_truth: true
related_code:
  - src/components/shared/layout/AppShell.tsx
related_docs:
  - docs/00-governance/design-specification.md
  - docs/00-governance/coding-standards.md
---

# 页面布局规范

## 一、布局层级结构

所有业务页面遵循统一的 5 层嵌套结构：

```
┌──────────────────────────────────────────────────────┐
│  .pm-app                                              │
│  ┌──────────────┬───────────────────────────────────┐ │
│  │              │  .pm-header                       │ │
│  │              │  ┌──────────────────────────────┐ │ │
│  │  .pm-sidebar  │  │ PageHeader                  │ │ │
│  │              │  │ [title] [search] [user]      │ │ │
│  │  AppSidebar  │  └──────────────────────────────┘ │ │
│  │  ┌────────┐  │  .pm-body                         │ │
│  │  │ nav    │  │  ┌──────────────────────────────┐ │ │
│  │  │ items  │  │  │ .pm-stats-row               │ │ │
│  │  │        │  │  │ StatsCards                   │ │ │
│  │  └────────┘  │  ├──────────────────────────────┤ │ │
│  │              │  │ .pm-content                  │ │ │
│  │              │  │ 工具栏 / 筛选                 │ │ │
│  │              │  │ 表格 / 卡片 / 视图            │ │ │
│  │              │  └──────────────────────────────┘ │ │
│  └──────────────┴───────────────────────────────────┘ │
│                                                      │
│  装饰: .pm-glow (固定定位背景光效)                     │
└──────────────────────────────────────────────────────┘
```

### 每层职责

| 层级   | 类名           | 职责                                        | 组件         |
| ------ | -------------- | ------------------------------------------- | ------------ |
| 根容器 | `pm-app`       | 全页 flex 容器，`min-height: 100vh`         | `AppShell`   |
| 侧边栏 | `pm-sidebar`   | 256px 固定宽度导航                          | `AppSidebar` |
| 工作区 | `pm-workspace` | 右侧弹性区域，`flex: 1`                     | `AppShell`   |
| 页头   | `pm-header`    | 64px 页面标题+搜索+用户信息                 | `PageHeader` |
| 主体   | `pm-body`      | 滚动容器，`calc(100vh - 64px)`，内边距 24px | 页面自行管理 |
| 统计行 | `pm-stats-row` | 统计卡片网格（7 列）                        | `StatsCards` |
| 内容区 | `pm-content`   | 表格/卡片/视图的具体内容                    | 页面自行管理 |

---

## 二、CSS 类名规范

### 2.1 统一使用 `pm-*` 前缀

所有页面布局类名统一使用 `pm-*` 前缀，不再使用模块特有前缀（`tm-*`、`fm-*` 等）。

| 原前缀 | 模块                    | 迁移方式         |
| ------ | ----------------------- | ---------------- |
| `pm-*` | 项目/人员/客户          | ✅ 已合规        |
| `tm-*` | 任务管理                | ⏳ 迁移到 `pm-*` |
| `fm-*` | 设施管理                | ⏳ 迁移到 `pm-*` |
| 无前缀 | 采购/数字员工/标准/设置 | ⏳ 迁移到 `pm-*` |

### 2.2 布局类名清单

```css
/* 根容器 */
.pm-app {
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 背景光效（固定定位装饰） */
.pm-glow {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
}

/* 侧边栏 */
.pm-sidebar {
  width: 256px;
  flex-shrink: 0;
  z-index: 10;
}

/* 工作区 */
.pm-workspace {
  flex: 1;
  min-width: 0;
}

/* 页头 */
.pm-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 主体 */
.pm-body {
  height: calc(100vh - 64px);
  overflow: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 统计行 */
.pm-stats-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
}

/* 内容区 */
.pm-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

### 2.3 业务组件保留模块前缀

仅布局层统一使用 `pm-*`，业务组件内部的 CSS 类名可以保留模块前缀以区分作用域：

- `tm-table`（任务表格） ✅ 保留
- `tm-view-toggle`（任务视图切换） ❌ 迁移到 `pm-view-toggle`
- `tm-filter-btn`（任务筛选按钮） ❌ 迁移到 `pm-filter-btn`

**判断原则**："属于布局还是属于业务"——决定全局布局的类名用 `pm-*`，决定组件内部表现的保留原前缀。

---

## 三、AppShell 组件规范

### 3.1 接口定义

```typescript
type AppShellProps = {
  /** 页面根容器类名前缀，默认 'pm' */
  classNamePrefix?: string
  /** 是否显示背景光效装饰 */
  glow?: boolean
  /** 侧边栏组件 */
  sidebar: ReactNode
  /** 页头组件 */
  header?: ReactNode
  /** 统计行（可选，放在 header 和 content 之间） */
  stats?: ReactNode
  /** 主体内容 */
  children: ReactNode
}
```

### 3.2 渲染结构

```tsx
const AppShell = ({
  classNamePrefix = 'pm',
  glow = true,
  sidebar,
  header,
  stats,
  children,
}: AppShellProps) => (
  <div className={`${classNamePrefix}-app`}>
    {glow && (
      <>
        <div className={`${classNamePrefix}-glow ${classNamePrefix}-glow-left`} />
        <div className={`${classNamePrefix}-glow ${classNamePrefix}-glow-right`} />
      </>
    )}
    <div className={`${classNamePrefix}-sidebar`}>{sidebar}</div>
    <div className={`${classNamePrefix}-workspace`}>
      <main className={`${classNamePrefix}-main`}>
        {header && <div className={`${classNamePrefix}-header`}>{header}</div>}
        <div className={`${classNamePrefix}-body`}>
          {stats && <div className={`${classNamePrefix}-stats-row`}>{stats}</div>}
          <div className={`${classNamePrefix}-content`}>{children}</div>
        </div>
      </main>
    </div>
  </div>
)
```

### 3.3 使用示例

```tsx
// 标准用法 —— 只需传入核心内容
<AppShell
  sidebar={<AppSidebar currentHash={currentHash} />}
  header={<PageHeader title="任务管理" searchQuery={q} onSearchChange={setQ} />}
  stats={<StatsCards items={statsItems} />}
>
  <TaskListView tasks={tasks} ... />
</AppShell>

// 无统计行
<AppShell
  sidebar={<AppSidebar currentHash={currentHash} />}
  header={<PageHeader title="设置" />}
>
  <SettingsContent />
</AppShell>
```

---

## 四、页面迁移清单

| 页面                      | 当前模式 | 当前前缀 | 是否使用 AppShell | 迁移优先级                      |
| ------------------------- | -------- | -------- | ----------------- | ------------------------------- |
| ProjectManagementPage     | 手动     | `pm-*`   | ❌                | P1（已合规，仅需套 AppShell）   |
| PersonnelPage             | 手动     | `pm-*`   | ❌                | P1（已合规，仅需套 AppShell）   |
| CustomerManagementPage    | 手动     | `pm-*`   | ❌                | P1（已合规，仅需套 AppShell）   |
| TaskManagementPage        | 手动     | `tm-*`   | ❌                | P2（需改 CSS 类名前缀）         |
| FacilityManagementPage    | 手动     | `fm-*`   | ❌                | P2（需改 CSS 类名前缀）         |
| ProcurementManagementPage | 手动     | 无       | ❌                | P2（无前缀冲突最小）            |
| DigitalEmployeePage       | 手动     | 无       | ❌                | P2（无前缀冲突最小）            |
| OrderManagementPage       | 手动     | 无       | ❌                | P2（无前缀冲突最小）            |
| StandardManagementPage    | AppShell | 无       | ✅                | P3（已有 AppShell，调整 props） |
| SystemSettingsPage        | AppShell | `pm-*`   | ✅                | P3（已有 AppShell，调整 props） |

### 迁移步骤

1. **P1** — `pm-*` 前缀页面直接套 AppShell，不改 CSS
2. **P2** — 布局类名统一为 `pm-*`，业务类名保留模块前缀
3. **P3** — 已有 AppShell 的页面适配新接口

---

## 五、强制约束

- **禁止**新增 `*-app`、`*-workspace`、`*-main`、`*-body` 的模块级样式覆盖
- **禁止**在页面组件中直接写 `<div className="pm-app">`——必须使用 AppShell
- **禁止**在布局层使用硬编码色值/圆角/间距——统一走 `--pm-*` CSS 变量
- **禁止**每个页面重复写 glow 装饰元素——由 AppShell 统一管理
