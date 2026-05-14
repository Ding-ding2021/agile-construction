---
id: AI-PROJECT-MANAGEMENT
human_source: docs/99-archive/product/project-management-prd.md
status: superseded
last_synced: 2026-05-14
title: AI 合约：项目管理（旧版9状态模型）
last_updated: 2026-05-14
superseded_by: docs/ai/contracts/project-task-driven.md
---

> ⚠️ **本合约已被取代**。旧版 9 状态模型（待立项→待确认→...→已归档）已重构为"任务驱动"多维正交模型。
> 请使用新合约：`docs/ai/contracts/project-task-driven.md`

# AI 合约：项目管理

## 模块定位

品牌方营建部门核心工作入口，承接建店目标与任务集合管理

## 核心实体

| 实体          | 字段                                                                                                                                                                                                                                                                                                                           | 状态机                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Project       | project_id, project_code, project_name, brand_id, store_id, store_type, city, region, business_area, project_type, primary_status, secondary_status, risk_level, planned_open_date, planned_start_date, planned_end_date, actual_start_date, actual_end_date, budget_range, template_id, standard_package_id, project_owner_id | 待立项→待确认→待拆解→执行中→待验收→整改中→待结算→已归档；任意→已中止 |
| ProjectStage  | stage_id, project_id, stage_code, stage_name, stage_order, stage_status, planned_start_at, planned_end_at, actual_start_at, actual_end_at, owner_role                                                                                                                                                                          | 依项目状态联动                                                       |
| Milestone     | milestone_id, project_id, milestone_name, milestone_type, planned_at, actual_at, milestone_status, linked_task_ids, linked_result_object_ids                                                                                                                                                                                   | 未开始→进行中→已达成/已延期/已取消                                   |
| RiskItem      | risk_id, project_id, risk_type, risk_level, risk_title, risk_desc, source_object_type, source_object_id, due_at, risk_status                                                                                                                                                                                                   | 开启→处理中→已关闭                                                   |
| ProjectMember | member_id, project_id, user_id, role_type, responsibility_scope, is_primary                                                                                                                                                                                                                                                    | 活跃/已移除                                                          |
| ProjectLog    | log_id, project_id, log_type, content_summary, operator_type, operator_id                                                                                                                                                                                                                                                      | 追加记录                                                             |
| Baseline      | baseline_id, project_id, scope_baseline, schedule_baseline, cost_baseline, approved_by, approved_at, version                                                                                                                                                                                                                   | 已创建/已变更                                                        |
| IssueLog      | issue_id, project_id, issue_type, issue_title, severity, owner_id, status, target_close_at, actual_close_at                                                                                                                                                                                                                    | 开启→处理中→已关闭                                                   |

## 状态机（单级 9 状态）

1. 合法流转路径：待立项→待确认→待拆解→执行中→待验收→整改中→待结算→已归档；任意中间状态→已中止
2. 默认单向，允许回退（高级权限 + 审计日志）
3. 已归档/已中止为终态，冻结关键编辑
4. 守卫条件见 PRD §7.4（字段完整性、审批、任务树生成、关键任务阈值等）

### 状态联动

1. 待拆解→触发任务树初始化
2. 执行中→启用催办、预警、风险重算
3. 待验收→展示验收摘要和问题项
4. 整改中→汇总未通过任务跟踪整改进度
5. 待结算→触发结算建议流程
6. 终态→冻结关键编辑

## 业务规则

1. 项目是任务集合容器，非最小执行单元；一个项目对应一棵主任务树
2. 阶段是上层管理分组，默认由模板生成，人工调整顺序需留痕
3. 里程碑可映射到任务或结果对象，需可被验证是否达成
4. 项目进度不按任务数量平均计算：关键任务权重大于普通任务，里程碑显著贡献
5. 风险等级分低/中/高/严重；高风险进入工作台提醒，严重风险支持升级转人工
6. 项目详情采用 8 标签结构（PMBOK 领域），状态机与标签正交
7. 范围与任务标签内合并任务与 WBS 入口，全局任务中心 #/tasks 保留
8. 标准上下文在项目创建阶段明确；范围变更允许重匹配但保留历史
9. 所有人工动作必须填写原因，关键状态回退保留审计日志
10. Agent 仅做辅助建议，不可替代项目治理职责

## 甘特图需求

### P0 核心缺失（阻塞体验）

1. 无限日历加载 — 缩放大范围时自动加载日历数据
2. 里程碑菱形标记 ◆ — 关键节点无工期
3. 依赖类型 FS/SS/FF/SF — 当前仅隐式 FS

### P1 重要缺失（影响专业度）

4. 拖拽编辑日期/工期 — 条内拖拽移动 + 边缘拉伸
5. 拖拽创建依赖 — 从一条拖箭头到另一条
6. 自动重排程 — 修改前序任务后后序自动调整
7. 级联排序 — 按开始时间自动排序
8. 基线对比 — 保存初始计划，对比实际偏离
9. Ctrl+Z 撤销

### P2 增强功能

10. 自定义任务颜色 | 11. 导出 PDF/图片 | 12. 资源负载可视化 | 13. 筛选/搜索任务 | 14. 看板视图 | 15. 导入 MS Project/Excel

### 实施阶段

- 阶段 A（当前）：树形甘特图 + 粒度切换 5 级 + 两级头部自适应 + 连续滚轮缩放 + 日历系统 + 周末/假日着色 + 今日线
- 阶段 B（下期）：无限日历加载 + 里程碑◆ + 依赖类型 FS/SS/FF/SF + 拖拽编辑 + 拖拽依赖 + 自动重排程 + Ctrl+Z
- 阶段 C（远期）：基线对比 + 看板视图 + 导入导出 + 资源负载 + AI 调度

## 依赖模块

| 模块     | 引用位置              | 依赖内容                                                     |
| -------- | --------------------- | ------------------------------------------------------------ |
| 任务中心 | §4.1 项目与任务树关系 | 任务树生成、进度汇总、关键任务状态                           |
| 标准管理 | §5 标准绑定设计       | 店型模板、标准包、品牌标准上下文                             |
| 采购     | §6.4 成本与采购标签   | 采购申请、订单、到货跟踪                                     |
| 验收     | §6.4 质量与验收标签   | 验收申请、检查项、整改追踪                                   |
| 资产     | §4.2 项目容器模型     | 资产摘要                                                     |
| 结算     | §6.4 待结算状态联动   | 结算建议流程                                                 |
| Agent    | §8.4 Agent 权限       | 品牌需求 Agent 辅助立项、项目经理 Agent 辅助阶段/风险/里程碑 |

## API 骨架

| 方法 | 路径                         | 说明                         |
| ---- | ---------------------------- | ---------------------------- |
| POST | /api/projects                | 创建项目                     |
| GET  | /api/projects                | 项目列表（含筛选/分组/排序） |
| GET  | /api/projects/:id            | 项目详情                     |
| PUT  | /api/projects/:id/status     | 状态流转（带守卫校验）       |
| GET  | /api/projects/:id/stages     | 阶段列表                     |
| GET  | /api/projects/:id/milestones | 里程碑列表                   |
| GET  | /api/projects/:id/risks      | 风险记录                     |
| POST | /api/projects/:id/archive    | 归档门禁执行                 |
| POST | /api/projects/:id/abort      | 中止项目（需原因）           |
| GET  | /api/projects/:id/logs       | 项目日志                     |

## 质量门禁

- 立项完整性：项目容器创建 + 基础信息完整才能进入待确认
- 归档门禁：结算完成 + 问题日志关闭 + 验收通过才可归档
- 中止门禁：必须填写原因 + 记录审计日志
- 状态回退：高级权限 + 审计日志 + 填写原因
- 验收标准 V1：可创建/确认立项 → 生成容器 → 8 标签详情 → 状态机流转 → Agent 接管
- 业务验收标准：至少支撑 1 条真实项目从立项到归档主流程
