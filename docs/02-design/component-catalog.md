---
id: DOC-06-COMPONENT-CATALOG
number: DES-006
domain: design
category: reference
title: 组件查询表
owner: designer
status: active
last_updated: 2026-05-13
source_of_truth: false
visual_version: component-catalog.html
related_code:
  - src-next/components/ui/
  - src-next/components/
ai_contract: docs/ai/contracts/component-catalog.md
related_docs:
  - component-development-contract.md
  - ../00-governance/design-standards.md
  - design-checklist.md
---

# 组件查询表

## shadcn 组件（36 个）

### Layout

| 组件        | 路径                        | 分类   |
| ----------- | --------------------------- | ------ |
| scroll-area | @/components/ui/scroll-area | layout |
| separator   | @/components/ui/separator   | layout |
| sidebar     | @/components/ui/sidebar     | layout |

### Form

| 组件             | 路径                             | 分类 |
| ---------------- | -------------------------------- | ---- |
| button           | @/components/ui/button           | form |
| input            | @/components/ui/input            | form |
| input-group      | @/components/ui/input-group      | form |
| textarea         | @/components/ui/textarea         | form |
| label            | @/components/ui/label            | form |
| checkbox         | @/components/ui/checkbox         | form |
| select           | @/components/ui/select           | form |
| native-select    | @/components/ui/native-select    | form |
| combobox         | @/components/ui/combobox         | form |
| calendar         | @/components/ui/calendar         | form |
| date-time-picker | @/components/ui/date-time-picker | form |
| toggle           | @/components/ui/toggle           | form |
| toggle-group     | @/components/ui/toggle-group     | form |
| avatar           | @/components/ui/avatar           | form |
| badge            | @/components/ui/badge            | form |
| tag-picker       | @/components/ui/tag-picker       | form |

### Overlay

| 组件          | 路径                          | 分类    |
| ------------- | ----------------------------- | ------- |
| dialog        | @/components/ui/dialog        | overlay |
| drawer        | @/components/ui/drawer        | overlay |
| sheet         | @/components/ui/sheet         | overlay |
| popover       | @/components/ui/popover       | overlay |
| command       | @/components/ui/command       | overlay |
| dropdown-menu | @/components/ui/dropdown-menu | overlay |
| tooltip       | @/components/ui/tooltip       | overlay |
| sonner        | @/components/ui/sonner        | overlay |

### Navigation

| 组件        | 路径                        | 分类 |
| ----------- | --------------------------- | ---- |
| breadcrumb  | @/components/ui/breadcrumb  | nav  |
| tabs        | @/components/ui/tabs        | nav  |
| pagination  | @/components/ui/pagination  | nav  |
| collapsible | @/components/ui/collapsible | nav  |

### Data Display

| 组件     | 路径                     | 分类 |
| -------- | ------------------------ | ---- |
| table    | @/components/ui/table    | data |
| card     | @/components/ui/card     | data |
| progress | @/components/ui/progress | data |
| skeleton | @/components/ui/skeleton | data |
| chart    | @/components/ui/chart    | data |

## 自定义组件（21 个）

### Layout

| 组件             | 路径                         |
| ---------------- | ---------------------------- |
| AppShell         | @/components/layout/AppShell |
| Sidebar (layout) | @/components/layout/Sidebar  |
| app-sidebar      | @/components/app-sidebar     |
| site-header      | @/components/site-header     |
| page-layout      | @/components/page-layout     |

### Navigation

| 组件          | 路径                                 |
| ------------- | ------------------------------------ |
| nav-main      | @/components/nav-main                |
| nav-user      | @/components/nav-user                |
| nav-documents | @/components/templates/nav-documents |
| nav-projects  | @/components/templates/nav-projects  |
| nav-secondary | @/components/templates/nav-secondary |
| team-switcher | @/components/templates/team-switcher |

### Data Display

| 组件                   | 路径                                |
| ---------------------- | ----------------------------------- |
| data-table             | @/components/data-table             |
| data-table-tree        | @/components/data-table-tree        |
| task-list              | @/components/task-list              |
| section-cards          | @/components/section-cards          |
| chart-area-interactive | @/components/chart-area-interactive |
| wbs-tree-table         | @/components/wbs-tree-table         |
| wbs-gantt              | @/components/wbs-gantt              |
| wbs-network-diagram    | @/components/wbs-network-diagram    |
| embeddable-wbs         | @/components/embeddable-wbs         |

### Form

| 组件          | 路径                                 |
| ------------- | ------------------------------------ |
| person-select | @/components/personnel/person-select |
