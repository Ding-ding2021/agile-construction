---
id: DOC-02-ARCHITECTURE-WBS-FRAMEWORK
title: WBS 框架设计方案
owner: docs-maintainer
status: draft
last_updated: 2026-05-07
source_of_truth: true
related_code:
  - src-next/pages/tasks/components/tree/SubTaskTree.tsx
  - src-next/types/task.ts
  - src-next/components/ui/table.tsx
related_docs:
  - docs/02-architecture/task-tree-modeling.md
  - docs/01-product/product-roadmap-v1.2-draft.md
  - docs/03-engineering/development-plan-v1.2.md
  - docs/PLAN.md
---

# WBS 框架设计方案

> **版本**: v1.0
> **最后更新**: 2026-05-07
> **交付策略**: 分 3 阶段

---

## 1. 概述

WBS (Work Breakdown Structure) 框架为项目提供四视图集成的任务分解与管理能力：

- **🌳 树视图** — 层级化 WBS 表格（核心编辑视图）
- **📊 甘特图** — 时间线可视化
- **🔗 网络图** — PERT 依赖关系图
- **🧠 思维导图** — 规划期自由分解工具

### 核心流程

```
思维导图（自由分解） → 导入 WBS 树（结构化）→ 赋予工期/依赖 → 甘特图（时间线）↔ 网络图（逻辑图）
```

所有视图共享同一份 WBS 数据（Zustand store），切换无同步成本。

---

## 2. 阶段 1 — WBS 树核心

### 2.1 数据模型

```typescript
interface WBSNode {
  id: string
  wbsCode: string // CY-01.01.01
  name: string
  nodeLevel: 'project' | 'workPackage' | 'task' | 'subtask'
  status: TaskStatus
  progress: number // 叶子手动，父节点自动汇总
  plannedStart: string | null
  plannedEnd: string | null
  duration: number // 天
  assignee: string | null
  parentId: string | null
  children: WBSNode[]
}
```

WBS 编码规则（项目前缀 CY 从项目编码继承）：

| 层级   | 格式                 | 示例        |
| ------ | -------------------- | ----------- |
| 工作包 | `{前缀}-{2位序号}`   | CY-01       |
| 任务   | `{父编码}.{2位序号}` | CY-01.01    |
| 子任务 | `{父编码}.{2位序号}` | CY-01.01.01 |

### 2.2 组件树

```
WBSView ← 路由页面 (/projects/:id/wbs)
├── WBSToolbar
│   ├── 视图切换 Tab（树/甘特/网络图）
│   ├── 新建工作包
│   └── 展开/折叠全部
├── WBSTreeTable
│   ├── WBS 编码列（自动生成）
│   ├── 名称列（缩进 + 展开/折叠）
│   ├── 状态列（色标 Badge）
│   ├── 进度列（Progress + 子节点汇总）
│   ├── 负责人列
│   ├── 计划日期列
│   └── 操作列
└── WBSTreeSidePanel（选中节点详情）
    ├── 基本信息编辑
    ├── 工期/前置任务设置
    └── 备注
```

### 2.3 进度汇总规则

- 叶子节点：手动填写 0-100%
- 父节点：子节点进度加权平均（按必做子任务）
- 有未完成必做子任务时，父节点状态不得为"已完成"

### 2.4 阶段 1 交付物

| 模块             | 说明                                      |
| ---------------- | ----------------------------------------- |
| WBSNode 类型     | 含 wbsCode/nodeLevel/progress/duration    |
| WBS 编码         | 自动生成 + 重排序时重编码                 |
| WBSTreeTable     | 树形表格 + 展开/折叠 + 状态/进度/负责人列 |
| 进度汇总         | 父子进度联动计算                          |
| WBSToolbar       | 视图切换 + 新建工作包 + 展开全部          |
| WBSTreeSidePanel | 节点详情 + 工期/依赖编辑                  |
| API              | WBS 树 CRUD 接口                          |
| 路由             | /projects/:id/wbs + 任务详情 WBS 标签嵌入 |

---

## 3. 阶段 2 — 甘特图 + 网络图

### 3.1 技术选型

| 视图        | 库                                 | 许可证 | 理由                                         |
| ----------- | ---------------------------------- | ------ | -------------------------------------------- |
| 📊 甘特图   | @svar-ui/react-gantt（开源核心版） | MIT    | 拖拽、依赖连线、10K 任务、进度条             |
| 🔗 网络图   | @xyflow/react（React Flow）        | MIT    | 40K★、dagre 自动布局、自定义节点、跨模块复用 |
| 🔄 审批流程 | 同上 @xyflow/react                 | MIT    | 复用节点/边基础设施、布局算法                |

### 3.2 PRO 功能自建策略

SVAR Gantt PRO 功能（$524+）不购买，自行在开源核心上实现：

| 功能       | 方案                              |
| ---------- | --------------------------------- |
| 关键路径   | CPM 算法（DAG 前推/后推，~50 行） |
| 工作日日历 | dayjs business-days 插件          |
| 基线对比   | 存储两份日期快照 + 差值渲染       |
| 撤销/重做  | Zustand temporal 中间件           |
| 导出       | html2canvas + jspdf               |

### 3.3 网络图跨模块复用

React Flow 节点图基础设施可服务多个模块：

- **WBSNetwork** — PERT 依赖图（当前）
- **审批流程设计器** — 拖拽配置审批节点和流转条件
- **质检流程编排** — Agent 质检流程
- **任务流模板** — 自定义流程模板

### 3.4 三视图共享数据流

```
WBS 数据 (API) → WBS Store (Zustand)
  ├── ↔ WBSTreeTable  ← 编辑 WBS 结构/编码/日期/依赖
  ├── ↔ WBSGantt      ← 读取 dates + dependencies 渲染时间条
  └── ↔ WBSNetwork    ← 读取 dependencies 渲染 PERT
```

---

## 4. 阶段 3 — 思维导图画布

### 4.1 定位

规划期脑暴工具，非数据绑定。项目启动时用于自由分解任务结构，一键导入 WBS 树。

### 4.2 技术方案

复用 React Flow 技术栈（与网络图一致），改为 free-form canvas 模式：

- 拖拽创建节点
- 自由排列（无自动布局）
- 标注父子关系连线
- 导出为 WBS 树结构（JSON）

---

## 5. 路线图集成

与现有产品路线图的关系：

- P2-T6 甘特图组件：由本框架阶段 2 覆盖，无需独立开发
- P2-T5 8 标签内容填充：WBS 标签页由本框架填充
- 任务详情页：SubTaskTree 替换为 WBSTreeTable 组件

---

## 6. 测试策略

| 层级     | 内容                                                 |
| -------- | ---------------------------------------------------- |
| 单元测试 | WBS 编码生成、进度汇总算法、CPM 关键路径             |
| 组件测试 | WBSTreeTable 展开/折叠、SidePanel 编辑               |
| 集成测试 | 视图切换数据一致性、甘特-树双向同步                  |
| E2E      | Playwright — 新建 WBS 节点 → 编辑工期 → 切换甘特验证 |
