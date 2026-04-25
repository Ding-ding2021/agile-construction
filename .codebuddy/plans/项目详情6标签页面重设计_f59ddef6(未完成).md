---
name: 项目详情6标签页面重设计
overview: 围绕项目详情页的6个标签（仪表盘/启动/计划/执行/监控/收尾）进行信息架构与布局重设计，按现有设计规范提升后台信息密度、可操作性和状态可读性。
design:
  architecture:
    framework: react
  styleKeywords:
    - 高密度后台
    - 深色专业
    - 生命周期治理
    - 卡片分区
    - 可操作看板
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 20px
      weight: 600
    subheading:
      size: 14px
      weight: 600
    body:
      size: 12px
      weight: 400
  colorSystem:
    primary:
      - '#154DD9'
      - '#2B7FFF'
      - '#51A2FF'
    background:
      - '#051338'
      - '#0A2363'
      - '#111625'
    text:
      - '#FFFFFF'
      - '#B8C7E6'
      - '#7F8DAA'
    functional:
      - '#00BC7D'
      - '#FFB900'
      - '#FE9A00'
      - '#FF6467'
todos:
  - id: map-current-layout
    content: 使用[subagent:code-explorer]梳理六标签现状与依赖
    status: pending
  - id: draft-dense-layout
    content: 使用[skill:design-to-code-workflows]生成高密度布局草案
    status: pending
    dependencies:
      - map-current-layout
  - id: refactor-detail-tabs
    content: 重构ProjectDetailPage六标签区块与信息层级
    status: pending
    dependencies:
      - draft-dense-layout
  - id: upgrade-detail-styles
    content: 更新project-detail.css实现密度化与响应式适配
    status: pending
    dependencies:
      - refactor-detail-tabs
  - id: align-tabs-and-regress
    content: 联调ProjectTabs并回归验证跳转与关键动作
    status: pending
    dependencies:
      - upgrade-detail-styles
---

## User Requirements

- 重新设计项目详情页中 **6 个标签对应页面** 的布局与信息结构：项目仪表盘、启动、计划、执行、监控、收尾。
- 不依赖新设计稿，基于现有规范与现有页面视觉体系进行重做。
- 风格目标为 **更强信息密度的管理后台**，强调快速浏览、快速决策与阶段治理可视化。

## Product Overview

项目详情页在保持现有导航与路由结构不变的前提下，重构为“高密度信息展示 + 关键动作直达 + 风险/门禁提示”的统一页面体系。整体视觉继续沿用当前深色后台风格，但在同屏承载更多关键指标、状态与操作入口，减少页面切换成本。

## Core Features

- 六标签统一信息架构：每个标签形成“摘要区 + 主体区 + 风险/门禁区 + 操作区”。
- 生命周期闭环强化：从启动到收尾的关键状态、门禁与审计信息在对应标签直观呈现。
- 执行与监控增强：执行标签强化任务/WBS推进动作，监控标签强化偏差、风险、整改追踪。
- 收尾治理可视化：验收、结算、归档、问题日志收口条件集中展示并可快速定位缺口。

## Tech Stack Selection

- 前端框架：React + TypeScript（沿用现有工程）
- 构建体系：Vite（沿用现有工程）
- 样式方案：模块页面级 CSS（沿用 `project-detail.css` 现有模式）
- 路由方式：Hash 路由（保持 `projectTabs.shared.ts` 与 `App.tsx` 兼容机制）

## Implementation Approach

采用“**结构重排优先、视觉增强其次、行为保持兼容**”策略：先按六标签定义重组页面信息层级，再在现有样式体系内提升密度与可读性，最后确保路由、入口按钮、跨模块跳转不回归。
关键决策：

- 不新增重型 UI 框架，复用现有组件与样式语义，降低改造风险。
- 以标签内区块化布局替代松散卡片拼接，提升扫描效率与可维护性。
- 保持现有数据来源与回调接口，避免牵连状态机与业务模型。  
  性能与可靠性：
- 渲染复杂度维持 O(n)（按卡片/列表项线性渲染）。
- 减少重复渲染：将标签内容组织为稳定区块组件/渲染函数，避免无关区块重绘。
- 控制改动面在项目详情域，避免波及全局任务中心与其他页面。

## Implementation Notes

- 严格复用已存在的类名语义（如 `card`、`project-detail-primary`、`project-flow-chain`）和配色层级，防止视觉漂移。
- 重点防回归点：`#/projects/:code/:tab` 六标签切换、`#/tasks` 跳转、采购协同跳转、状态反馈信息显示。
- 不改动主状态机与路由协议，仅重构展示层布局与信息组织。
- 响应式断点继续沿用 `1360/1024/768` 规则，避免新增复杂断点导致维护成本上升。

## Architecture Design

本次为现有前端展示层的局部重构，遵循当前架构：

- `ProjectDetailPage.tsx`：六标签页面结构与区块编排主入口
- `ProjectTabs.tsx`：标签切换交互与可达性维持
- `project-detail.css`：标签页密度化布局、状态样式、响应式适配  
  改造边界：
- 不改 domain 状态机
- 不改项目数据模型
- 不改全局路由协议（仅消费既有 tab）

## Directory Structure

## Directory Structure Summary

本次改造集中在项目详情页面展示层，重构六标签布局结构与样式表现，保持现有路由和业务能力兼容。

- `/Users/dylan/CodeBuddy/20260402092847/src/components/project/ProjectDetailPage.tsx` # [MODIFY] 项目详情六标签主内容重构。按“摘要/主体/风险门禁/动作”重组各标签区块；复用现有回调与数据，不变更业务接口。
- `/Users/dylan/CodeBuddy/20260402092847/src/components/project/project-detail.css` # [MODIFY] 高密度后台样式重构。优化网格、卡片、表格/列表信息密度、状态标签与断点适配；保持现有色彩体系与交互反馈一致。
- `/Users/dylan/CodeBuddy/20260402092847/src/components/project/ProjectTabs.tsx` # [MODIFY] 标签栏与新内容结构对齐。保持六标签导航与可访问性语义，优化与页面重构后的视觉一致性。

## 设计方案

采用“高密度专业后台”风格，保留当前深色体系并提升信息承载。六个标签作为六个核心工作屏：每屏至少包含顶部摘要条、核心数据区、风险/门禁区、快捷动作区。卡片从“展示型”转为“决策型”，同屏展示状态、偏差、责任人与下一步动作。交互强调快速切换、清晰层级、低认知成本。

## Agent Extensions

- **SubAgent: `code-explorer`**
- Purpose: 精准扫描项目详情相关文件与样式依赖，确认重构影响面。
- Expected outcome: 输出完整且无遗漏的改造文件清单与调用链。

- **Skill: `design-to-code-workflows`**
- Purpose: 基于“无设计稿”场景生成六标签高密度布局规范与可落地组件结构建议。
- Expected outcome: 形成可直接映射到 React 结构与 CSS 规则的布局方案。
