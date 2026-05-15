# 进度日志

## 2026-05-15 Phase 6A 标准管理引擎 — 交付完成

**要点**：标准管理从"死数据"变为"活引擎"，补齐三个结构性断裂。

### 交付成果

| 维度              | 数值                                                               |
| ----------------- | ------------------------------------------------------------------ |
| 新增 Prisma 表    | 2（StandardSnapshot + TaskStandardBinding）                        |
| 新增 Service 文件 | 3（ruleEngine / snapshotService / bindingService）                 |
| 新增 API 端点     | 8                                                                  |
| 新增测试文件      | 4（ruleEngine / snapshotService / bindingService / api.standards） |
| 全部测试通过      | 65/65                                                              |
| 前端 UI Debt 修复 | 3 项（Skeleton / PageLayout / aria-label）                         |
| Skills 调用       | 9 种（1 种未调用：karpathy-guidelines）                            |
| 违规记录          | 3 条（流程违规 + 角色越界 + 引入技术债务）                         |
| Evolve 复盘       | 已反哺（含数据报告 + 5-Why 根因分析 + 5 条改进措施）               |

### 本次修复的 Bug/问题

- squad-pre-dev-evaluation SKILL.md 缺测试评估员（已修复）
- squad-post-dev-review SKILL.md 缺测试验收员（已修复）
- .trae/agents/ 下 4 个角色 YAML 缺失（已补齐）
- app.ts 从 server.ts 提取，支持测试导入
- checkBindingGuard 未接入 Controller（已修复）
- API 测试 404 bug（变量名不一致，已修复）

### 本次治理改进

- 评审结论自动流转规则（agent-squad-protocol.md §5.3）
- 七阶段子流程明细（01-workflows.md §3.1.3）
- Evolve 规范含统计报告 + 5-Why 根因分析 + 改进措施（§6）
- 新增 AI 合约 harness-workflows.md

## 2026-05-15 Phase 6B 任务中心引擎 — 交付完成

**要点**：任务中心从 CRUD 升级为业务引擎，补齐模板实例化、验收工作流、服务协议计算三个核心能力。

### 交付成果

| 维度              | 数值                                                                        |
| ----------------- | --------------------------------------------------------------------------- |
| 新增 Service 文件 | 3（slaCalculator / acceptanceWorkflow / taskInstantiator）                  |
| 重构 Controller   | 2（instantiation / taskSubmissions）                                        |
| 增强 Controller   | 1（tasks.ts — \_slaStatus 注入）                                            |
| 新增 API 端点     | 2（instantiate/preview）                                                    |
| 增强 API 端点     | 3（submit/review/slaStatus 注入）                                           |
| 新增测试文件      | 4（slaCalculator / acceptanceWorkflow / taskInstantiator / api.taskEngine） |
| 全部测试通过      | 104/104（9 文件）                                                           |
| Skills 调用       | 8 种                                                                        |

### 本次修复的 Bug/问题

- [Bug 修复] instantiation.ts 子任务 parentId 传 null → WBS 树形结构断裂（已修复）
- [架构重构] taskInstantiator 从 Controller 抽离为独立 Service
- [列名修复] instantiation.ts 列名不匹配（驼峰 vs 下划线）
- [状态联动] acceptanceWorkflow 审核联动任务状态变更
- [派生任务] review(reject) 支持可选创建派生整改任务
- [退回校验] reject 时 comment 必填校验

### 本次交付的评估问题修复

| 评估问题                                  | 修复方案                                         |
| ----------------------------------------- | ------------------------------------------------ |
| 现有 instantiation.ts parentId = null bug | taskInstantiator 递归时传入正确 parentId         |
| taskInstantiator 需抽离为独立 Service     | 已抽离，Controller 只做参数解析                  |
| acceptanceWorkflow 需联动任务状态         | submit→待验收, review pass→已完成, reject→不通过 |
| review(reject) 派生整改任务               | createDerivedTask 参数控制，isRectification=1    |

## 2026-05-15 Phase 6C 项目管理引擎 — 交付完成

**要点**：项目状态从手动 9 状态重构为任务聚合推导的多维正交模型。新建聚合引擎、Controller 重构、前端组件改造、全量数据迁移。

### 交付成果

| 维度               | 数值                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| 新增 Service 文件  | 1（projectAggregator.ts — 7 个纯函数 + 编排函数）                          |
| 新增 API 端点      | 2（health + reaggregate）                                                  |
| 自动触发点         | 3（任务/验收/采购）                                                        |
| 新建前端组件       | 2（ProjectHealthCard + ProjectDimensionStatus）                            |
| 改造页面           | 4（tab-overview + ProjectListPage + ProjectDetailPage + ProjectTableView） |
| 新增测试文件       | 4（projectAggregator.test.ts + api.projectEngine.test.ts + 2 组件测试）    |
| 全部测试通过       | 158/158（11 文件）                                                         |
| 构建通过           | tsc + vite build 通过                                                      |
| Prisma schema 清理 | 移除 status/subStatusJson/statusTone                                       |
| 数据迁移脚本       | 1（migrate-v2-status.ts，幂等+备份）                                       |

### Pre-dev Squad 评估修复

| 决策                    | 实现                                  |
| ----------------------- | ------------------------------------- |
| 纯函数签名              | 全部 7 个函数接受结构化数据数组       |
| parentStatus 不可逆推导 | 有序阶段数组 + 索引比较               |
| "中止"为终态            | parentStatus 首行检查                 |
| Progress 水平条         | shadcn Progress 组件                  |
| afterTaskUpdate 钩子    | 统一管理快照+聚合                     |
| 验收/采购触发           | taskSubmissions.ts + procurement.ts   |
| 健康度不独立 tab        | 概览页增强区域                        |
| statusTone 移除         | 全量+3 个 YAML+3 roles.md+02-roles.md |
| 混合状态→进行中         | computeExecutionStatus 决策 #9        |

### Post-dev Squad 验收

| 角色         | 初评       | 增量重审                                 |
| ------------ | ---------- | ---------------------------------------- |
| 功能验收     | 有条件通过 | ✅ 通过（updateProject 显式拒绝 status） |
| UI 验收      | 有条件通过 | ✅ 通过（空状态占位 + aria-label）       |
| 代码验收     | ✅ 通过    | -                                        |
| 测试验收     | 有条件通过 | ✅ 通过（E2E beforeEach 自包含数据）     |
| **最终结论** |            | **全票通过**                             |

### 本次治理改进

- 角色职责拆分：苏染=前端代码、陈锋=后端、周严=测试框架
- 3 个 YAML + 3 个 roles.md + 02-roles.md 同步更新
- 模式记录：聚合器 SQL schema drift 检测模式

## 2026-05-15 知识架构体系 — 交付完成

**要点**：五层知识架构规范 + MCP Memory 落地，补齐知识流转体系。

### 交付成果

| 维度            | 数值                                                     |
| --------------- | -------------------------------------------------------- |
| 新建规范文档    | 1（knowledge-architecture.md）                           |
| 修复旧文档      | 3（04-knowledge-base / registry.yaml / 01-workflows.md） |
| 新建 AI 合约    | 1（knowledge-architecture.md）                           |
| MCP Server 配置 | @modelcontextprotocol/server-memory 上线                 |
| 首次知识图谱    | 6 实体 + 5 关系写入                                      |
| MCP 工具验证    | 全部 8 个工具通过                                        |

## 2026-05-16 晚间技能进化总结 — 已执行

**要点**：2026-05-16 晚间技能进化总结任务完成。

### 执行结果

| 维度     | 数值                                             |
| -------- | ------------------------------------------------ |
| 产出物   | `.workbuddy/stats/daily/2026-05-16-evolution.md` |
| 技能分析 | 本会话为治理任务，未加载 Skill 工具（合理）      |
| 进化建议 | 5 个薄弱环节、3 项新技能建议                     |
| 知识提炼 | 跨会话提炼阈值已满足（17 篇 daily log）          |
| 飞书推送 | 跳过 — FEISHU_WEBHOOK_URL 未配置                 |
| Git 提交 | `761b0c7` feat(evolve) — harness-bot             |

### 关键发现

- FEISHU_WEBHOOK_URL 缺失导致飞书通知全线断裂
- `memory/` 与 `docs/ai/knowledge/` 存在内容冗余，需要确认 SSOT 边界
- 05-15 和 05-16 工作日志未生成，有 2 天 gap|

### 本次修复的 Bug/问题

- 04-knowledge-base.md §Clause 4 记忆层定义与实际 memory 结构不一致（已修复）
- registry.yaml MCP 工具名使用旧 API（memory_save → create_entities）（已修复）
- registry.yaml 误导性描述（"自动语义索引" → "AI 主动写入"）（已修复）
- Ship/Evolve 缺少 MCP 记忆写入步骤（已修复）

### 本次交付的评估问题修复

| 问题                   | 修复                                |
| ---------------------- | ----------------------------------- |
| 知识体系无完整规范文档 | 新建 knowledge-architecture.md SSOT |
| MCP Memory 装而没用    | 配置上线 + 写入流程定义             |
| 四层模型装不下流程资产 | 五层架构明确定位                    |

## 2026-05-15 Phase 6C 阶段 4 — API 集成测试 + E2E 测试完成

**要点**：补齐项目管理引擎测试覆盖，覆盖 API 集成、组件渲染、E2E 三大层次。

### 交付成果

| 维度              | 数值                                            |
| ----------------- | ----------------------------------------------- |
| 新增 API 测试文件 | 1（api.projectEngine.test.ts）                  |
| 新增组件测试文件  | 2（ProjectHealthCard / ProjectDimensionStatus） |
| 新增 E2E 测试脚本 | 1（project-task-driven.spec.ts）                |
| API 测试数        | 12（7 场景全覆盖）                              |
| 组件测试数        | 13（7 + 6）                                     |
| 全量回归          | 158 tests ✅（11 文件）                         |
| 组件全量回归      | 90 tests ✅（16 文件）                          |
| TypeScript 编译   | 通过                                            |
| 构建              | 通过                                            |

### 本次发现的缺陷

| 缺陷                                                               | 文件                     | 修复                            |
| ------------------------------------------------------------------ | ------------------------ | ------------------------------- |
| 聚合器 SQL 引用 `cl.status` 但 checklist_items 表无此列            | projectAggregator.ts:220 | 改为 `cl.result as status`      |
| 聚合器 SQL 引用 `settlement_status` 但 procurement_orders 表无此列 | projectAggregator.ts:229 | 改为 `NULL as settlementStatus` |
| 聚合器 SQL 引用 `risk_level` 但 project_risks 表使用 `level`       | projectAggregator.ts:235 | 改为 `level as riskLevel`       |

### 测试覆盖范围

| 场景                           | API 测试 | 组件测试 | E2E |
| ------------------------------ | -------- | -------- | --- |
| 创建项目默认维度状态           | ✅       | —        | ✅  |
| status 旧字段不存在            | ✅       | —        | —   |
| 任务驱动聚合（reaggregate）    | ✅       | —        | —   |
| 健康度 4 指标                  | ✅       | —        | ✅  |
| 手动重新聚合                   | ✅       | —        | —   |
| PUT 禁止手动设置状态           | ✅       | —        | —   |
| 边界：空任务/全完成/混合       | ✅       | —        | —   |
| HealthCard 4 级健康度渲染      | —        | ✅       | ✅  |
| HealthCard 空指标/loading      | —        | ✅       | —   |
| DimensionStatus 4 维度/loading | —        | ✅       | ✅  |

## 2026-05-15 Phase 6C 阶段 3 — 数据迁移与旧字段清理 ✅

**要点**：删除 project 表旧字段（status/statusTone/subStatusJson），编写幂等迁移脚本，同步所有受影响的层。

### 交付成果

| 变更                     | 数量                                           |
| ------------------------ | ---------------------------------------------- |
| 新建迁移脚本             | 1（local-api/migrations/migrate-v2-status.ts） |
| Prisma schema 删除字段   | 3（status, subStatusJson, statusTone）         |
| 后端 Controller 文件变更 | 1（projects.ts — 3 处修改）                    |
| 前端类型文件变更         | 2（project.ts, project-detail.ts）             |
| 前端页面引用清理         | 4 处（Page + Component + Constant）            |
| 测试文件更新             | 7 个文件同步清理                               |
| 数据库 schema 同步       | prisma db push --accept-data-loss ✅           |
| 全量回归测试             | 158 / 158 ✅                                   |

### 迁移脚本特性

- 旧 status → parentStatus 映射：待立项/待确认→启动，待拆解→计划，执行中/整改中→执行，待验收→监控，待结算/已归档/已中止→收尾
- 通过 `_migrations` 表实现幂等控制
- 运行前自动备份数据库到 `store/backups/`
- 调用 `aggregateProjectStatus` 重新计算全维度和健康度
- "中止" 作为 parentStatus 可选值
