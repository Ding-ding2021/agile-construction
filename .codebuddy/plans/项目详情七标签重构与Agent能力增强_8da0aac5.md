---
name: 项目详情七标签重构与Agent能力增强
overview: 在既有六标签高密度重构基础上新增“项目设置”标签，用于配置项目规则与Agent技能，实现项目经理在详情页内完成规则治理、计划制定、执行监控与收尾归档的全流程闭环。
design:
  architecture:
    framework: react
  styleKeywords:
    - 高密度后台
    - 深色专业
    - 规则中枢
    - Agent协同
    - 审计可追溯
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
  - id: scan-tabs-route-impact
    content: 使用[subagent:code-explorer]核对七标签与路由影响链
    status: completed
  - id: design-settings-layout
    content: 使用[skill:design-to-code-workflows]产出项目设置标签高密度布局
    status: completed
    dependencies:
      - scan-tabs-route-impact
  - id: extend-tab-protocol
    content: 修改projectTabs.shared.ts与ProjectTabs.tsx接入settings标签
    status: completed
    dependencies:
      - design-settings-layout
  - id: implement-settings-tab
    content: 重构ProjectDetailPage新增规则配置与Agent技能配置区
    status: completed
    dependencies:
      - extend-tab-protocol
  - id: extend-agent-settings-model
    content: 扩展projectDigitalEmployee类型与mock支撑规则技能审计
    status: completed
    dependencies:
      - implement-settings-tab
  - id: style-and-compat-check
    content: 更新project-detail.css并校验App.tsx别名兼容
    status: completed
    dependencies:
      - extend-agent-settings-model
  - id: prepare-cloudbase-contract
    content: 使用[integration:tcb]预留配置持久化与审计接口契约
    status: completed
    dependencies:
      - style-and-compat-check
---

## User Requirements

- 在项目详情页新增“项目设置”标签页，作为项目经理的配置中枢。
- 该标签需支持两类配置：项目规则配置、Agent技能配置。
- 配置应服务项目全生命周期闭环，不替代人工审批与责任判定。
- 保持现有详情页主流程可用：仪表盘、启动、计划、执行、监控、收尾继续可访问并可协同使用。

## Product Overview

项目详情页升级为“7标签闭环工作台”。新增“项目设置”后，项目经理可在同一详情内定义治理规则与Agent技能策略，再由其他标签执行、监控、收尾环节消费这些配置，实现“先设规则、再执行、可审计”的管控链路。视觉延续当前深色高密度后台风格，强调清晰分区与快速操作。

## Core Features

- 新增“项目设置”标签入口，纳入现有项目详情标签导航和路由。
- 项目规则配置：门禁阈值、预警等级、审批策略、自动触发策略。
- Agent技能配置：技能开关、阶段绑定、人工接管策略、日志审计策略。
- 配置效果可在执行与监控场景中被读取，并显示“当前规则版本/生效状态”。
- 配置变更保留操作记录，支持项目经理追溯“谁在何时改了什么”。

## Tech Stack Selection

- 现有栈复用：React + TypeScript + Vite。
- 路由与标签协议复用：`projectTabs.shared.ts` + `App.tsx` 的 Hash 解析机制。
- 页面样式复用：`project-detail.css` 现有深色高密度体系。
- Agent数据复用并扩展：`projectDigitalEmployee.types.ts`、`projectDigitalEmployee.data.ts`。

## Implementation Approach

采用“**协议先扩展、页面再挂载、数据后贯通**”策略：

1. 先将项目详情tab协议从6个扩展到7个，确保 `#/projects/:code/:tab` 可解析 `settings`；
2. 再在详情页挂载“项目设置”区块（规则配置+技能配置）；
3. 最后将配置与Agent建议区、执行监控区建立只读消费关系，并写入统一日志。
   关键决策：

- 不新增独立页面路由，不改 `AppRoute` 的 detail形态，仅扩展 `ProjectDetailTab` 枚举值。
- 保持“Agent建议不越权”，关键动作仍需人工触发或审批。
- 配置结构先落地为前端可维护模型，预留与 `integration:tcb` 对接接口。  
  性能与可靠性：
- 设置项渲染与校验均为 O(n)（按规则条目线性遍历）。
- 使用 `useMemo` 生成规则摘要与生效状态，减少重复计算。
- 空配置采用安全默认值，避免详情页其他标签读取时报错。

## Implementation Notes

- 已验证当前tab源在 `src/components/project/projectTabs.shared.ts`，新增标签必须同步 `ProjectTabs.tsx` 与 `ProjectDetailPage.tsx` 渲染分支。
- 已验证路由解析在 `src/App.tsx` 通过 `isProjectDetailTab` 判断，新增 `settings` 后无需改变 detail 路由结构。
- 当前 `ProjectDetailPage.tsx` 已存在 `onAppendActivityLog`，应复用该回调记录“配置变更摘要”，避免新增并行日志通道。
- 已验证 `project-detail.css` 存在 `nav-tabs`、`tab-btn`、`project-detail-grid` 与 1360/1024/768 断点，应在既有规则上增量扩展。
- 当前项目存在 `projectDigitalEmployee.*` 类型与mock，可直接扩展“技能绑定/接管策略/审计策略”字段，降低重复建模风险。

## Architecture Design

- **标签协议层**：`projectTabs.shared.ts` 维护 tab 枚举、类型守卫、hash 构建。
- **导航层**：`ProjectTabs.tsx` 增加“项目设置”按钮及状态提示（如未完成配置徽标）。
- **页面编排层**：`ProjectDetailPage.tsx` 增加 `renderSettingsTab`，组织规则区、技能区、生效摘要区、审计区。
- **配置数据层**：`projectDigitalEmployee.types.ts` 扩展设置模型；`projectDigitalEmployee.data.ts` 提供项目设置mock和默认策略。
- **路由兼容层**：`App.tsx` 继续通过现有 detail 路由解析，仅依赖 `isProjectDetailTab` 自动兼容新增tab。

## Directory Structure Summary

- `/Users/dylan/CodeBuddy/20260402092847/src/components/project/projectTabs.shared.ts` # [MODIFY] 扩展 `PROJECT_DETAIL_TABS` 增加 `settings`，保持类型守卫和 hash 构建兼容。
- `/Users/dylan/CodeBuddy/20260402092847/src/components/project/ProjectTabs.tsx` # [MODIFY] 新增“项目设置”标签项与视觉状态，保持现有导航交互语义。
- `/Users/dylan/CodeBuddy/20260402092847/src/components/project/ProjectDetailPage.tsx` # [MODIFY] 新增 `renderSettingsTab` 与 activeTab 分发逻辑，承载规则设置和Agent技能设置区块。
- `/Users/dylan/CodeBuddy/20260402092847/src/components/project/project-detail.css` # [MODIFY] 增加设置标签相关网格、配置卡片、策略状态、审计时间线样式并复用断点。
- `/Users/dylan/CodeBuddy/20260402092847/src/components/project/projectDigitalEmployee.types.ts` # [MODIFY] 新增项目规则配置、技能绑定、人工接管、审计策略类型定义。
- `/Users/dylan/CodeBuddy/20260402092847/src/components/project/projectDigitalEmployee.data.ts` # [MODIFY] 新增设置标签默认配置、阶段技能映射、规则版本与示例审计记录。
- `/Users/dylan/CodeBuddy/20260402092847/src/App.tsx` # [CHECK/MODIFY] 校验 legacy tab alias 与 detail 路由兼容；必要时补充历史别名映射到 `settings`。

## 设计方案

采用“高密度深色控制台”风格，在项目详情中新增“项目设置”工作屏：

- 顶部“配置摘要条”：规则版本、生效状态、最近变更人。
- 左列“项目规则”卡组：门禁、预警、审批、自动触发策略。
- 右列“Agent技能”卡组：技能开关、阶段绑定、接管阈值、审计级别。
- 底部“变更审计时间线”：记录变更动作与影响范围。
  每个区块都提供清晰状态标识（正常/警告/阻断）和主操作按钮，保持与其他标签一致的卡片语言与交互节奏。

## Agent Extensions

- **SubAgent: `code-explorer`**
- Purpose: 扫描项目详情标签、路由、样式、Agent数据模型的真实影响面。
- Expected outcome: 输出精准修改链路，避免遗漏 `projectTabs.shared.ts` 与 `App.tsx` 兼容点。
- **Skill: `design-to-code-workflows`**
- Purpose: 生成“项目设置”标签的高密度布局结构与配置区块设计稿到代码映射建议。
- Expected outcome: 形成可直接落到 `ProjectDetailPage.tsx` 与 `project-detail.css` 的区块方案。
- **Integration: `tcb`**
- Purpose: 预留项目规则与Agent技能配置的云端接入契约。
- Expected outcome: 配置模型具备从本地mock迁移到CloudBase的稳定扩展路径。
