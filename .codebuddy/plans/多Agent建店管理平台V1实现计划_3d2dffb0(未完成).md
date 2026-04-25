---
name: 多Agent建店管理平台V1实现计划
overview: 基于PRD和设计规范，实现多Agent建店管理平台V1版本的全部页面功能，包括品牌端、资源调度平台、资源方端三套系统的核心模块。
design:
  architecture:
    framework: react
  styleKeywords:
    - Liquid Glass
    - Material Design 3
    - Dark Mode
    - Glassmorphism
    - Gradient Background
    - Translucent
    - Modern Tech
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 24px
      weight: 600
    subheading:
      size: 18px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - '#154DD9'
      - '#1a5ae8'
      - '#1248c5'
    background:
      - '#030B1A'
      - '#0A2363'
      - '#0F2D5C'
    text:
      - rgba(255, 255, 255, 1)
      - rgba(255, 255, 255, 0.8)
      - rgba(255, 255, 255, 0.6)
      - rgba(255, 255, 255, 0.4)
    functional:
      - '#10B981'
      - '#F59E0B'
      - '#EF4444'
      - '#3B82F6'
todos:
  - id: setup-project-structure
    content: 建立模块化项目结构，创建brand/dispatch/supplier三个模块目录
    status: pending
  - id: define-types
    content: 定义核心业务类型：Project、Task、Vendor、User、Status等
    status: pending
    dependencies:
      - setup-project-structure
  - id: create-shared-components
    content: 创建共享组件库：StatsCards、DataTable、ViewToggle、StatusBadge、RiskBadge
    status: pending
    dependencies:
      - define-types
  - id: implement-brand-dashboard
    content: 实现品牌端工作台：待确认立项、待审批报价、待确认验收、风险提醒
    status: pending
    dependencies:
      - create-shared-components
  - id: implement-brand-projects
    content: 实现品牌端项目中心：项目列表、项目详情、里程碑视图、任务视图
    status: pending
    dependencies:
      - implement-brand-dashboard
  - id: implement-brand-approval
    content: 实现品牌端审批中心：报价单列表、审批操作
    status: pending
    dependencies:
      - implement-brand-projects
  - id: implement-dispatch-projectpool
    content: 实现资源调度平台项目池：项目列表、阶段分布、风险视图
    status: pending
    dependencies:
      - create-shared-components
  - id: implement-dispatch-taskcenter
    content: 实现资源调度平台任务中心：任务清单、任务依赖、SLA状态
    status: pending
    dependencies:
      - implement-dispatch-projectpool
  - id: implement-dispatch-dispatchdesk
    content: 实现资源调度平台调度台：待派单任务池、资源推荐、派单确认
    status: pending
    dependencies:
      - implement-dispatch-taskcenter
  - id: implement-supplier-dashboard
    content: 实现资源方端工作台：待接单、今日待处理、即将超时任务
    status: pending
    dependencies:
      - create-shared-components
  - id: implement-supplier-orders
    content: 实现资源方端待接单：任务列表、任务详情、接单/拒单
    status: pending
    dependencies:
      - implement-supplier-dashboard
  - id: implement-supplier-execution
    content: 实现资源方端任务执行：执行清单、开工打点、进度填报
    status: pending
    dependencies:
      - implement-supplier-orders
  - id: setup-routing
    content: 配置React Router路由，整合三套系统入口
    status: pending
    dependencies:
      - implement-brand-dashboard
      - implement-dispatch-projectpool
      - implement-supplier-dashboard
  - id: add-status-machine
    content: 实现状态机逻辑：项目状态流转、任务状态流转、验收状态流转
    status: pending
    dependencies:
      - define-types
  - id: mock-data-layer
    content: 创建模拟数据层：projects、tasks、vendors、users
    status: pending
    dependencies:
      - define-types
  - id: polish-interactions
    content: 完善交互细节：加载状态、空状态、错误处理、过渡动画
    status: pending
    dependencies:
      - setup-routing
---

## 产品概述

多Agent建店管理平台 V1，面向连锁品牌建店场景，通过七个Agent（客服Agent、品牌需求Agent、项目经理Agent、资源调度Agent、资源执行Agent、验收质检Agent、结算对账Agent）替代部分人工岗位，完成从需求接入到结算建议的自动化推进。

## 核心功能模块

### 品牌端

- **工作台**：待确认立项、待审批报价、待确认验收、项目风险提醒
- **开店立项**：新建立项、店型模板选择、对话式需求录入
- **项目中心**：项目列表、项目详情、里程碑进度、任务视图
- **报价与审批**：报价单列表、报价详情、审批操作
- **验收中心**：待确认验收单、初验结果查看、整改记录
- **结算中心**：结算建议单查看、差异项查看、付款进度

### 资源调度平台

- **项目池**：项目列表、阶段分布、项目风险视图
- **任务中心**：任务清单、任务依赖、SLA状态、催办记录
- **调度台**：待派单任务池、资源推荐结果、派单确认、排期建议
- **资源池**：资源方档案、区域覆盖、资质证照、履约评分
- **异常中心**：延期/派单/验收/结算异常、升级处理记录
- **验收中心**：待初验任务、初验结果、整改任务、复验追踪
- **结算中心**：待对账项目、结算建议单、差异项审核
- **客服工单中心**：工单池、催办池、投诉池、服务指标
- **Agent运行中心**：Agent执行日志、决策记录、转人工记录

### 资源方端

- **工作台**：待接单、今日待处理、即将超时任务、待补资料
- **待接单**：任务列表、任务详情、接单/拒单、报价提交
- **我的项目**：项目列表、项目详情、阶段视图、任务清单
- **任务执行**：执行清单、开工打点、进度填报、完工提交
- **资料中心**：图片/文档/回执上传、资料完整性提示
- **验收申请**：发起验收、初验结果查看、整改任务、复验提交
- **结算中心**：报价记录、对账记录、结算建议查看、发票提交
- **客服与申诉**：在线客服、工单查询、发起申诉

## 状态流转

- **项目状态**：待立项 → 待确认 → 待拆解 → 待调度 → 执行中 → 待验收 → 整改中 → 待结算 → 已归档
- **任务状态**：待分配 → 待接单 → 待执行 → 执行中 → 待提交 → 待验收 → 不通过 → 已完成
- **验收状态**：待初验 → 初验通过/不通过 → 整改中 → 待复验 → 复验通过
- **结算状态**：待生成建议 → 待审核 → 待确认 → 已完成/争议中

## 设计约束

- 技术栈：React 18.3 + TypeScript + Tailwind CSS + Vite
- 设计风格：Liquid Glass（液态玻璃）+ Material Design 3，深色模式优先
- 品牌色：#154DD9
- 项目阶段统一：启动、准备、执行、收尾
- 一级页面必须包含：统计卡片行、工具栏、多视图支持、分页功能

## 技术栈

- **前端框架**：React 18.3 + TypeScript
- **样式方案**：Tailwind CSS v4
- **构建工具**：Vite
- **UI组件**：Radix UI（无头组件）
- **图标库**：Lucide React
- **状态管理**：React Context + useReducer（轻量级）
- **路由**：React Router v7
- **图表**：Recharts
- **地图**：Leaflet

## 实现策略

### 1. 模块化架构

采用特性模块（Feature Module）组织方式，按三套系统分别建立模块：

```
src/
├── brand/           # 品牌端
├── dispatch/        # 资源调度平台
├── supplier/        # 资源方端
├── shared/          # 共享组件
├── hooks/           # 共享Hooks
├── types/           # 类型定义
└── utils/           # 工具函数
```

### 2. 组件复用策略

- 共享布局组件：Sidebar、Header、PageContainer
- 共享数据组件：StatsCards、DataTable、ViewToggle、Pagination
- 共享表单组件：FormInput、FormSelect、FormDatePicker
- 共享反馈组件：Badge、StatusTag、RiskIndicator

### 3. 状态管理

- 本地状态：useState/useReducer管理组件级状态
- 共享状态：React Context管理跨组件状态（如当前用户角色、主题）
- 服务端状态：模拟数据层，后期可替换为真实API

### 4. 类型安全

- 统一定义业务对象类型：Project、Task、Vendor、User等
- 状态机类型：ProjectStatus、TaskStatus、CheckStatus等
- Agent相关类型：AgentLog、AgentDecision等

### 5. 路由结构

```
/                         # 默认首页（品牌端工作台）
/brand/*                  # 品牌端
/dispatch/*               # 资源调度平台
/supplier/*               # 资源方端
```

### 6. 性能优化

- 组件懒加载：React.lazy + Suspense
- 虚拟滚动：大数据列表使用 react-window
- 防抖节流：搜索、筛选使用防抖

## 目录结构

```
src/
├── components/
│   ├── layout/           # 布局组件
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── PageContainer.tsx
│   ├── shared/           # 共享组件
│   │   ├── StatsCards.tsx
│   │   ├── DataTable.tsx
│   │   ├── ViewToggle.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SearchBox.tsx
│   │   ├── FilterPanel.tsx
│   │   └── Pagination.tsx
│   └── ui/               # 基础UI组件
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Modal.tsx
│       └── Card.tsx
├── modules/
│   ├── brand/            # 品牌端模块
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── approvals/
│   │   ├── acceptance/
│   │   └── settlement/
│   ├── dispatch/         # 资源调度平台模块
│   │   ├── projectPool/
│   │   ├── taskCenter/
│   │   ├── dispatchDesk/
│   │   ├── vendorPool/
│   │   ├── exceptions/
│   │   ├── acceptance/
│   │   ├── settlement/
│   │   ├── tickets/
│   │   └── agentCenter/
│   └── supplier/         # 资源方端模块
│       ├── dashboard/
│       ├── orders/
│       ├── projects/
│       ├── execution/
│       ├── documents/
│       ├── acceptance/
│       ├── settlement/
│       └── support/
├── hooks/
│   ├── useProjects.ts
│   ├── useTasks.ts
│   ├── useVendors.ts
│   └── useAuth.ts
├── types/
│   ├── project.ts
│   ├── task.ts
│   ├── vendor.ts
│   ├── user.ts
│   └── status.ts
├── utils/
│   ├── statusMachine.ts
│   ├── formatters.ts
│   └── validators.ts
├── data/                 # 模拟数据
│   ├── mockProjects.ts
│   ├── mockTasks.ts
│   └── mockVendors.ts
├── App.tsx
└── main.tsx
```

采用 Liquid Glass（液态玻璃）+ Material Design 3 设计风格，深色模式优先。核心视觉特征包括半透明磨砂玻璃效果、柔和渐变背景、统一的圆角系统和清晰的信息层级。

### 设计架构

- **背景层**：深蓝黑主背景（#030B1A）+ 径向渐变光晕装饰
- **玻璃态卡片**：bg-white/[0.04] + border-white/8 + backdrop-blur
- **信息层级**：通过透明度（100%/80%/60%/40%）区分主次信息
- **圆角系统**：rounded-xl (12px) 用于按钮，rounded-2xl (16px) 用于卡片
- **过渡动画**：统一 200ms 过渡时间

### 页面布局

- **侧边栏**：256px 固定宽度，深蓝背景（#0A2363），玻璃态效果
- **主内容区**：自适应宽度，24px 内边距
- **统计卡片行**：4列网格布局，渐变背景
- **工具栏**：左侧视图切换 + 右侧搜索/筛选/排序
- **数据表格**： glass 背景表头，hover 效果行

### 交互设计

- **悬停反馈**：背景亮度提升 + 边框加强
- **选中状态**：品牌蓝边框 (#154DD9) + 轻微缩放
- **视图切换**：分段控制器样式，激活态品牌蓝背景
- **筛选展开**：下拉面板，玻璃态背景

## Agent Extensions

### MCP

- **Figma**
- Purpose: 获取设计稿数据，确保实现与设计规范一致
- Expected outcome: 提取设计规范、颜色值、间距、组件尺寸等设计token

### SubAgent

- **code-explorer**
- Purpose: 探索代码库结构，识别可复用组件和模式
- Expected outcome: 生成现有组件清单、样式复用建议、代码模式分析报告
