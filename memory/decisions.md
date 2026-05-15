# 近期决策速记

## 2026-05-15 聚合器 SQL schema drift 修复

**问题**：`projectAggregator.ts` 三处 SQL 引用了实际 schema 中不存在的列名（cl.status, settlement_status, risk_level），导致聚合器在测试环境崩溃。

**决策**：将 SQL 列名修正为匹配 Prisma schema 的字段名（cl.result, NULL, level）。不做逻辑变更，仅修复列映射。

**影响**：修复后 158 个全量 API 测试全部通过，聚合器在 checklist_items/procurement_orders/project_risks 表无数据时不再报错。

## 2026-05-15 聚合触发时机

**发现**：`GET /projects/:code` 不触发聚合，只读 DB 存储值。聚合只在 `createProject` / `updateProject` / `reaggregateProject` 时触发。

**决策**：API 测试调整策略——插入任务后调用 `POST /reaggregate` 再验证聚合结果，而非直接 GET 期望自动聚合。

## 2026-05-15 Phase 6C 阶段 3 — 清理旧的 Project.status 字段

**问题**：V2 维度系统已经通过 `parentStatus`/`executionStatus`/`acceptanceStatus`/`settlementStatus`/`dispatchStatus` 五个维度覆盖了旧的单一 `status` 字段，但 Prisma schema、Controller、前端类型和测试中仍有残留。

**决策**：

1. 从 `prisma/schema.prisma` 的 `Project` 模型中删除 `status`、`subStatusJson`、`statusTone` 三个字段
2. `PROJECT_COLUMNS` 中移除对应列映射，`createProject` INSERT 移除 `status` 写入
3. 前端 `ProjectItem`/`ProjectOverview` 类型删除 `status`/`statusTone`，所有 `project.status` 回退表达式改为 `healthStatus ?? '正常'`
4. 测试文件中所有 `INSERT INTO projects` 移除 `status`/`status_tone` 列
5. 删除 `api.projectEngine.test.ts` 中 `STATUS_MANUAL_SET_FORBIDDEN` 的 400 测试（该逻辑已被移除）
6. 删除未使用的 `PROJECT_STATUS_STYLE` 常量

**影响**：158 全量回归测试 11 文件全部通过。

## 2026-05-15 Phase 6C — Pre-dev Squad 9 项仲裁决策

| #   | 决策                                                                      | 来源             |
| --- | ------------------------------------------------------------------------- | ---------------- |
| 1   | computeAcceptanceStatus/settlementStatus 接受结构化数据数组而非 projectId | 开发+测试        |
| 2   | parentStatus 推导规则：创建→启动→计划→执行→监控→收尾（不可逆）            | 产品             |
| 3   | parentStatus 增加"中止"为终态                                             | 产品             |
| 4   | 维度面板使用 shadcn Progress 水平条，不手写 SVG 环                        | UI/UX + 老板拍板 |
| 5   | 抽取 afterTaskUpdate(taskId) 钩子统一管理快照+聚合                        | 开发             |
| 6   | 验收/采购聚合触发的独立子任务                                             | 开发             |
| 7   | 健康度不独立成 tab，作为概览页增强区域                                    | UI/UX + 老板拍板 |
| 8   | statusTone 随旧 status 一同移除                                           | 开发 + 老板批准  |
| 9   | executionStatus 规则：存在已完成任务→"进行中"；全部终态→"已完成"          | 测试 + 老板批准  |

## 2026-05-15 Phase 6C — 角色职责拆分

**问题**：前端代码和测试代码之前由开发工程师陈锋负责，与角色定义不符。

**决策**：

1. 苏染（设计师）负责前端代码编写
2. 陈锋（开发）专攻后端，不写前端代码
3. 周严（测试）负责测试框架/代码编写
4. 更新 3 个 YAML + 3 个 roles.md + 02-roles.md 同步
