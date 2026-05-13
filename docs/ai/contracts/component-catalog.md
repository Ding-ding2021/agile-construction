---
id: AI-COMPONENT-CATALOG
human_source: docs/02-design/component-catalog.md
status: active
last_synced: 2026-05-13
visual_version: docs/02-design/component-catalog.html
---

# AI 合约：组件查询表

## 模块定位

全量组件目录索引，供 AI Agent 和开发者快速确认组件可用性和导入路径。

## 核心实体

| 实体        | 字段             | 状态机                 |
| ----------- | ---------------- | ---------------------- |
| shadcn 组件 | 名称, 路径, 分类 | installed → deprecated |
| 自定义组件  | 名称, 路径, 分类 | active → deprecated    |

## shadcn 组件（36 个）

| 分类         | 组件列表                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout       | scroll-area, separator, sidebar                                                                                                                                     |
| Form         | button, input, input-group, textarea, label, checkbox, select, native-select, combobox, calendar, date-time-picker, toggle, toggle-group, avatar, badge, tag-picker |
| Overlay      | dialog, drawer, sheet, popover, command, dropdown-menu, tooltip, sonner                                                                                             |
| Navigation   | breadcrumb, tabs, pagination, collapsible                                                                                                                           |
| Data Display | table, card, progress, skeleton, chart                                                                                                                              |

## 自定义组件（21 个）

| 分类         | 组件列表                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout       | AppShell, Sidebar, app-sidebar, site-header, page-layout (5)                                                                                      |
| Navigation   | nav-main, nav-user, nav-documents, nav-projects, nav-secondary, team-switcher (6)                                                                 |
| Data Display | data-table, data-table-tree, task-list, section-cards, chart-area-interactive, wbs-tree-table, wbs-gantt, wbs-network-diagram, embeddable-wbs (9) |
| Form         | person-select (1)                                                                                                                                 |

## 导入规范

- shadcn 组件：`@/components/ui/<name>`
- 自定义组件：`@/components/<name>`
- 使用命名导出，禁止默认导出

## 质量门禁

- 新建组件前必须在此表确认无重复
- 废弃组件标记 deprecated 而非直接删除
