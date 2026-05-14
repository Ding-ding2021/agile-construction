---
id: AI-PRODUCT-ROADMAP
human_source: docs/99-archive/product/product-roadmap-v1.2-draft.md
status: superseded
last_synced: 2026-05-14
title: AI 合约：产品规划路线图（已归档）
last_updated: 2026-05-14
superseded_by: docs/ai/contracts/product-planning.md
---

# AI 合约：产品规划路线图

## 模块定位

全产品战略规划文件，定义两阶段演进路线（V1 内部闭环→V2 平台开放）、功能模块优先级（P0/P1/P2）、六阶段实施路线图及风险管理框架。

## 核心实体

| 实体           | 字段                                                                                                      | 状态机                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 项目 (Project) | code, name, status, milestones[], risks[], budget, storeAddress(GeoAddress), tags[]                       | 待立项→待确认→待拆解→执行中→待验收→整改中→待结算→已归档 |
| 任务 (Task)    | id, parentTaskId, title, standardId, acceptStandardId, assignee, status, dependencyIds[], resultObjects[] | 待分配→待执行→执行中→待验收→已完成→已关闭               |
| 模块规划       | phase(V1.0/V1.5/V2.0/V2.5), priority(P0/P1/P2), coreFunctions[], deliveryPhase                            | -                                                       |
| GeoAddress     | fullAddress, province, city, district, street, longitude, latitude, poiId, geoHash                        | -                                                       |

## 业务规则

1. V1 聚焦品牌方内部管理，V2 开放为多方协同平台，架构预留不提前实现
2. 模块优先级：P0 必须上线 / P1 顺延 / P2 延后
3. 实施六阶段：底座搭建(1-2月)→标准与项目(2-4月)→任务中心(4-5月)→采购资源资产(5-7月)→Agent与工作台(7-9月)→联调与试点(9-12月)
4. 项目详情采用 PMBOK 领域标签（8 标签），与项目状态机正交无关
5. 核心迭代原则：标准先行、任务原子化、结果对象独立、状态驱动流程、人工兜底、全程留痕、架构预留
6. AI 编码模式：核心模块（状态机/权限/数据模型）人工设计，AI 仅做实现填充；禁止 AI 直接修改 domain/ 和 data/ 层
7. V1 后端 SQLite，V2 迁移 PostgreSQL；V1 UI 优先复用 MUI v9 组件，不再新增自研

## 依赖模块

| 模块     | 引用位置                                      | 依赖内容                                                                             |
| -------- | --------------------------------------------- | ------------------------------------------------------------------------------------ |
| 标准管理 | docs/01-product/product-roadmap-v1.2.md §4.3  | 标准库驱动任务生成、执行指导和验收判断                                               |
| 项目管理 | docs/01-product/project-management-prd.md     | 项目容器、PMBOK 标签、里程碑、风险、成本                                             |
| 任务中心 | docs/01-product/task-center-prd.md            | 任务树模型、标准绑定、前置依赖                                                       |
| 采购管理 | docs/01-product/project-management-prd.md     | 采购申请→订单→到货跟踪与任务联动                                                     |
| 工队管理 | docs/01-product/workteam-management-prd.md    | 班组结构、资质、评级、排期、派单对接                                                 |
| Agent    | docs/99-archive/product/multi-agent-v1-prd.md | 品牌需求 Agent、项目经理 Agent、验收质检 Agent（已归档，详见 agent-architecture.md） |
| 系统设置 | docs/01-product/settings-prd.md               | 权限、字典、编码规则、通知、Agent 配置                                               |

## API 骨架

| 方法 | 路径                      | 说明       |
| ---- | ------------------------- | ---------- |
| GET  | /api/projects             | 项目列表   |
| POST | /api/projects             | 立项       |
| GET  | /api/projects/:code       | 项目详情   |
| PUT  | /api/projects/:code       | 更新项目   |
| GET  | /api/projects/:code/tasks | 项目任务树 |
| GET  | /api/standards            | 标准库列表 |
| POST | /api/templates/apply      | 模板下发   |

## 质量门禁

- 每 Phase 交付后安排业务方评审（真实用户试用），未通过不进入下阶段
- 所有 AI 生成代码必须经人工 Review 后方可合并
- 核心状态机出现漏洞（非法跳转/数据不一致）→ 暂停迭代
- 每双周架构健康度评审，跟踪技术债务清单增长速率
- Phase 交付验收标准逐条通过
- Agent 输出必须经人工确认才可生效，设置人工一键接管机制
