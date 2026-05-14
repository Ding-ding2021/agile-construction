# 实现计划：项目"任务驱动"状态架构重构

## 概述

将项目从"手动9状态"重构为"状态由任务聚合推导"的多维正交模型。核心是新建**聚合引擎**（Aggregation Engine），消除项目级手动状态按钮。

## 架构决策

| 决策         | 选择                                | 理由                                                     |
| ------------ | ----------------------------------- | -------------------------------------------------------- |
| 聚合引擎位置 | 新建 `local-api/services/` 目录     | 当前无 Service 层，控制器直连 SQLite，需要独立测试的能力 |
| 数据查询方式 | 保持 raw SQL（better-sqlite3）      | 与现有代码一致，避免混用 ORM / raw SQL                   |
| 聚合触发方式 | 同步触发（任务变更 → 直接调用聚合） | 简单可靠，SQLite 单线程无并发问题                        |
| 前端数据来源 | 从 API 获取聚合结果，前端只展示     | 符合"前端不独立计算"的边界规则                           |
| 健康度计算   | 第一版简单规则（无权重/衰减）       | 用户已确认"简单先上"                                     |

## 任务列表

### 阶段 0：聚合引擎（纯函数，可独立测试）

#### 任务 0.1：创建聚合引擎服务

**描述：** 新建 `local-api/services/projectAggregator.ts`，实现所有聚合计算函数。这些是纯函数（输入任务数据 → 输出聚合结果），不依赖数据库连接，可以单元测试。

**验收标准：**

- [ ] `computeExecutionStatus(tasks)` → 返回"未开始"/"进行中"/"已完成"
- [ ] `computeAcceptanceStatus(projectId)` → 返回"待验收"/"验收中"/"已通过"/"整改中"
- [ ] `computeSettlementStatus(projectId)` → 返回"未结算"/"结算中"/"已结算"
- [ ] `computeDispatchStatus(tasks)` → 返回"未派单"/"派单中"/"已派完"
- [ ] `computeParentStatus(project)` → 返回 PMBOK 五阶段之一（不可逆）
- [ ] `computeHealth(progress, slaData, risks)` → 返回 4 级别（简单规则）
- [ ] `aggregateProjectStatus(projectId)` → 编排函数，调用所有 compute 函数并返回完整聚合结果
- [ ] 全部函数有 TypeScript 类型定义

**验证：**

- [ ] 单元测试通过：`npm run test -- --grep "aggregator"`
- [ ] 100% 分支覆盖

**依赖：** 无

**涉及的文件：**

- `local-api/services/projectAggregator.ts`（新建）
- `local-api/types/project-aggregation.ts`（可选，类型定义）

**预估范围：** M（3-4 个文件）

#### 任务 0.2：聚合引擎单元测试

**描述：** 为聚合引擎的每个计算函数编写单元测试，覆盖所有分支（如全部任务为草稿 → "未开始"；部分任务执行中 → "进行中"）。

**验收标准：**

- [ ] `computeExecutionStatus`：3 个分支测试（未开始/进行中/已完成）
- [ ] `computeAcceptanceStatus`：4 个分支测试
- [ ] `computeSettlementStatus`：3 个分支测试
- [ ] `computeDispatchStatus`：3 个分支测试
- [ ] `computeHealth`：4 个级别测试
- [ ] `aggregateProjectStatus`：集成测试

**验证：**

- [ ] `npx vitest run --coverage` → 聚合引擎相关函数 100% 分支覆盖

**依赖：** 任务 0.1

**涉及的文件：**

- `tests/services/projectAggregator.test.ts`（新建）

**预估范围：** M（1 个测试文件，约 50-80 个测试用例）

### 检查点：聚合引擎基础

- [ ] 全部聚合函数单元测试通过
- [ ] 100% 分支覆盖
- [ ] 代码审查：聚合规则是否符合 spec 定义

---

### 阶段 1：后端集成

#### 任务 1.1：更新 Prisma Schema + 数据库迁移

**描述：**

- 将 `healthStatus` 字段添加到 Project 模型（`String @default("正常")`）
- 将 `dispatchStatus`, `executionStatus`, `acceptanceStatus`, `settlementStatus` 从 `String?` 改为 `String @default(...)`
- 将 `plannedOpenDate`, `actualOpenDate` 从 `String` 改为 `DateTime`（可选，低优先级）
- 添加 `pendingSettlementCount` 字段
- **不删除**旧的 `status` 字段（后续阶段再删）
- 运行 Prisma migration 生成 SQLite 迁移文件

**验收标准：**

- [ ] `prisma/schema.prisma` 中 Project 模型字段定义与 spec 一致
- [ ] `npx prisma migrate dev` 成功执行
- [ ] 数据库表 `projects` 新增/修改的列正确

**验证：**

- [ ] `npm run dev:api` 启动无错误
- [ ] `npx prisma studio` 可查看新字段

**依赖：** 无

**涉及的文件：**

- `prisma/schema.prisma`
- `prisma/migrations/`（自动生成）

**预估范围：** S

#### 任务 1.2：更新 PROJECT_COLUMNS 常量

**描述：** 更新 `local-api/controllers/projects.ts` 中的 `PROJECT_COLUMNS` 常量，添加 `healthStatus` 等新字段的 SQL 列映射，移除不再需要的旧字段映射。

**验收标准：**

- [ ] `PROJECT_COLUMNS` 包含全部新字段的 SQL 映射
- [ ] 现有查询不受影响

**验证：**

- [ ] `GET /api/projects` 返回新字段
- [ ] `GET /api/projects/:code` 返回新字段

**依赖：** 任务 1.1

**涉及的文件：**

- `local-api/controllers/projects.ts`

**预估范围：** XS

#### 任务 1.3：更新 createProject 设置默认值

**描述：** 在 `createProject` 中移除旧的 `status: '待立项'` 硬编码默认值，改为由聚合引擎计算所有维度状态。创建时设置 `parentStatus = '启动'`，其他维度状态由首次聚合计算。

**验收标准：**

- [ ] 新建项目时不再写死 `status: '待立项'`
- [ ] 新建项目时维度状态由聚合引擎初始化
- [ ] 新建项目时 `healthStatus = '正常'`

**验证：**

- [ ] POST /api/projects 创建新项目 → 检查返回值中维度状态正确

**依赖：** 任务 0.1, 任务 1.1

**涉及的文件：**

- `local-api/controllers/projects.ts`

**预估范围：** S

#### 任务 1.4：更新 updateProject 禁止设置 status

**描述：** 修改 `updateProject`，过滤掉 `status` 字段的更新请求。如果请求体包含 `status`，忽略或返回 400 错误。

**验收标准：**

- [ ] PUT /api/projects/:code 带 status 字段 → 忽略或返回 400
- [ ] PUT /api/projects/:code 带其他字段 → 正常更新

**验证：**

- [ ] 测试请求：`curl -X PUT localhost:3001/api/projects/XXX -d '{"status":"待确认"}'` → 不修改 status

**依赖：** 任务 1.1

**涉及的文件：**

- `local-api/controllers/projects.ts`

**预估范围：** XS

#### 任务 1.5：添加 `GET /projects/:code/health` 端点

**描述：** 新增路由和控制器方法，调用聚合引擎的健康度计算，返回详细的健康度指标数据（进度偏差、SLA、风险、未分配）。

**验收标准：**

- [ ] `GET /api/projects/:code/health` 返回健康度对象（`{ status, indicators: [...] }`）
- [ ] 健康度指标包含进度偏差、SLA 超时、风险项、未分配任务数

**验证：**

- [ ] `curl localhost:3001/api/projects/XXX/health` → 返回健康度 JSON

**依赖：** 任务 0.1, 任务 1.2

**涉及的文件：**

- `local-api/routes/projects.ts`
- `local-api/controllers/projects.ts`（新增 getProjectHealth 方法）

**预估范围：** S

#### 任务 1.6：添加 `POST /projects/:code/reaggregate` 端点

**描述：** 新增调试端点，用于手动触发项目聚合计算。接收项目编码，调用聚合引擎重新计算所有维度状态并更新数据库。

**验收标准：**

- [ ] `POST /api/projects/:code/reaggregate` 返回最新的聚合结果
- [ ] 数据库中对应的维度状态字段被更新

**验证：**

- [ ] 修改任务数据后调用 `/reaggregate` → 聚合结果反映最新任务状态

**依赖：** 任务 0.1, 任务 1.2, 任务 1.3

**涉及的文件：**

- `local-api/routes/projects.ts`
- `local-api/controllers/projects.ts`（新增 reaggregateProject 方法）

**预估范围：** S

#### 任务 1.7：任务状态变更时自动触发聚合

**描述：** 在 `local-api/controllers/tasks.ts` 中，每次任务状态变更（updateTaskStatus）成功后，自动调用聚合引擎更新项目维度状态。验收和采购模块同理。

**验收标准：**

- [ ] 任务从"草稿"变更为"执行中" → 项目 executionStatus 自动变为"进行中"
- [ ] 全部任务变为"已完成" → 项目 executionStatus 自动变为"已完成"
- [ ] 聚合触发不影响任务变更本身的响应时间

**验证：**

- [ ] 集成测试：修改任务状态 → 查询项目聚合结果 → 验证更新

**依赖：** 任务 0.1, 任务 1.3, 任务 1.6

**涉及的文件：**

- `local-api/controllers/tasks.ts`
- `local-api/controllers/procurement.ts`（结算维度触发）
- `local-api/controllers/acceptance.ts`（验收维度触发）

**预估范围：** M

### 检查点：后端集成

- [ ] 全部 API 端点正常工作
- [ ] 任务变更 → 项目聚合自动更新
- [ ] `npm run dev:api` 无错误
- [ ] API 测试通过

---

### 阶段 2：前端改造

#### 任务 2.1：创建 ProjectHealthCard 组件

**描述：** 新建健康度指标卡组件，展示在项目概览页顶部。显示健康状态标签（正常/关注/预警/严重，各带颜色）+ 4 个指标卡片（进度偏差、SLA 超时、风险项、未分配任务数）。

**验收标准：**

- [ ] 健康状态标签带颜色（正常=绿色/关注=黄色/预警=橙色/严重=红色）
- [ ] 4 个指标卡片各显标签、数值和级别图标
- [ ] 组件接受 `HealthData` props

**验证：**

- [ ] Storybook 或手动渲染验证显示效果

**依赖：** 任务 1.5

**涉及的文件：**

- `src-next/pages/projects/components/ProjectHealthCard.tsx`（新建）

**预估范围：** S

#### 任务 2.2：创建 DimensionProgressRing 组件

**描述：** 维度进度环组件，每个维度一个小环形进度条 + 状态标签（如"执行维度 ●●●○○ 进行中"）。点击可展开该维度的详情。

**验收标准：**

- [ ] 环形进度条显示百分比
- [ ] 状态标签文字显示
- [ ] 点击展开/收起维度详情

**验证：**

- [ ] 手动渲染验证环形显示

**依赖：** 无

**涉及的文件：**

- `src-next/pages/projects/components/DimensionProgressRing.tsx`（新建）

**预估范围：** S

#### 任务 2.3：创建 ProjectDimensionStatus 组件

**描述：** 正交维度状态面板组件，展示 4 个维度的状态概览。使用 DimensionProgressRing 组件，布局为一行 4 列或 2×2 网格。

**验收标准：**

- [ ] 展示 executionStatus / acceptanceStatus / settlementStatus / dispatchStatus
- [ ] 每个维度用不同颜色标记
- [ ] 可点击维度名称进入该维度详情

**验证：**

- [ ] 手动渲染验证效果

**依赖：** 任务 2.2

**涉及的文件：**

- `src-next/pages/projects/components/ProjectDimensionStatus.tsx`（新建）

**预估范围：** S

#### 任务 2.4：重构 tab-overview 概览标签页

**描述：** 修改 `tab-overview.tsx`，将顶部区域改为：

1. 健康度看板（ProjectHealthCard）
2. 状态维度面板（ProjectDimensionStatus）
3. 项目进度条
4. 快捷操作区
   移除旧的状态 Badge 展示和状态变更按钮。

**验收标准：**

- [ ] 概览页顶部展示健康度卡
- [ ] 健康度卡下方展示 4 维度状态
- [ ] 下方保留原有基本信息展示
- [ ] 无旧状态 Badge 或状态变更按钮

**验证：**

- [ ] 打开项目详情 → 概览标签 → 看到新组件

**依赖：** 任务 2.1, 任务 2.3

**涉及的文件：**

- `src-next/pages/projects/detail/tab-overview.tsx`

**预估范围：** M

#### 任务 2.5：创建 tab-health 健康度详情标签页

**描述：** 新增独立的"健康度"标签页，展示更详细的健康度分析，包括：

- 健康度趋势（如果有历史数据）
- 各指标的详细说明
- 建议操作列表（如"分配 3 个未认领任务"）

**验收标准：**

- [ ] 项目详情页新增"健康度"标签
- [ ] 标签页内容包含健康度详细指标和建议操作

**验证：**

- [ ] 打开项目详情 → 看到"健康度"标签 → 点击展示信息

**依赖：** 任务 2.1, 任务 2.4

**涉及的文件：**

- `src-next/pages/projects/detail/tab-health.tsx`（新建）
- `src-next/pages/projects/ProjectDetailPage.tsx`（注册新标签）

**预估范围：** M

#### 任务 2.6：改造项目列表页

**描述：** 修改 `ProjectListPage.tsx`：

- 旧"状态"列改为"健康度"列（显示健康度标签）
- 新增"执行进度"列（进度条）
- 新增"待办"列（悬停显示各维度待办数）
- 状态筛选器改为健康度筛选
- 移除旧状态筛选选项

**验收标准：**

- [ ] 项目列表每行显示健康度标签
- [ ] 项目列表每行显示进度条
- [ ] 筛选器按健康度过滤
- [ ] 无旧"状态"列

**验证：**

- [ ] 打开项目列表页 → 看到新列和新筛选

**依赖：** 任务 2.1（复用 ProjectHealthCard 的健康度标签）

**涉及的文件：**

- `src-next/pages/projects/ProjectListPage.tsx`

**预估范围：** M

### 检查点：前端改造

- [ ] 项目列表页正常显示新 UI
- [ ] 项目概览页正常显示健康度和维度状态
- [ ] `npm run dev:frontend` 无编译错误

---

### 阶段 3：数据迁移与清理

#### 任务 3.1：编写数据迁移脚本

**描述：** 编写迁移脚本，将现有项目的旧 `status` 值映射到新维度系统：

1. 旧 status → parentStatus 映射（待立项→启动，待确认→启动，待拆解→计划，执行中→执行，整改中→执行，待验收→监控，待结算→收尾，已归档→收尾，已中止→收尾）
2. 根据项目当前的任务数据计算各维度初始值
3. 计算初始健康度

**验收标准：**

- [ ] 所有现有项目的 parentStatus 根据映射规则正确设置
- [ ] 维度状态根据任务数据正确计算
- [ ] 健康度合理设置（不会全部是"严重"）
- [ ] 迁移脚本可重复运行（幂等）

**验证：**

- [ ] 在测试数据库上运行迁移 → 检查结果

**依赖：** 任务 0.1, 任务 1.1, 任务 1.3

**涉及的文件：**

- `local-api/migrations/migrate-v2-status.ts`（新建）

**预估范围：** M

#### 任务 3.2：移除旧 status 字段

**描述：** 确认所有代码不再引用 `status` 字段后：

1. 从 Prisma schema 删除 `status` 字段
2. 从 PROJECT_COLUMNS 删除 `status` 映射
3. 运行 Prisma migration 从数据库删除列
4. 从所有前端展示/过滤逻辑中移除 `status` 引用

**验收标准：**

- [ ] `prisma/schema.prisma` 无 `status` 字段
- [ ] `local-api/controllers/projects.ts` 无 `status` 引用
- [ ] `src-next/pages/projects/` 无 `status` 引用
- [ ] 数据库 `projects` 表无 `status` 列
- [ ] 删除前已确认无其他模块引用 `project.status`

**验证：**

- [ ] `npm run build` 无错误
- [ ] `npm run test` 全部通过

**依赖：** 任务 1.1, 任务 2.6, 任务 3.1

**涉及的文件：**

- `prisma/schema.prisma`
- `local-api/controllers/projects.ts`
- `src-next/pages/projects/`

**预估范围：** S

#### 任务 3.3：移除旧 UI 元素

**描述：** 清理所有与旧状态系统相关的 UI 元素：

- 移除 `project-styles.ts` 中的旧状态样式映射（只保留健康度样式）
- 移除项目详情页中任何旧状态展示
- 确保无残留的状态变更入口

**验收标准：**

- [ ] 前端没有任何"待立项"、"待确认"等旧状态文字的展示（除非在日志历史中）
- [ ] 项目详情页无"推进状态"、"变更状态"按钮

**验证：**

- [ ] 全站搜索 `status`（在项目模块）确认无残留

**依赖：** 任务 2.4, 任务 2.5, 任务 2.6

**涉及的文件：**

- `src-next/pages/projects/constants/project-styles.ts`
- 其他包含旧状态引用的文件

**预估范围：** S

---

### 阶段 4：测试完善

#### 任务 4.1：API 集成测试

**描述：** 使用 supertest 编写 API 测试，验证端到端流程：

1. 创建项目 → 检查默认维度状态
2. 添加任务 → 修改任务状态 → 查询项目 → 验证聚合更新
3. 调用 health 端点 → 验证返回格式
4. 调用 reaggregate 端点 → 验证手动触发
5. 禁止手动设置 status

**验收标准：**

- [ ] 全部核心路径测试通过
- [ ] 包含边界情况（空任务项目、全部完成项目等）

**验证：**

- [ ] `npm run test:api` 全部通过

**依赖：** 任务 1.2 ~ 1.7

**涉及的文件：**

- `tests/api/projects.test.ts`（新增或扩展现有测试）

**预估范围：** M

#### 任务 4.2：组件测试

**描述：** 使用 RTL（React Testing Library）为 ProjectHealthCard、ProjectDimensionStatus、DimensionProgressRing 每个组件编写渲染测试。

**验收标准：**

- [ ] 健康度各状态均能被正确渲染
- [ ] 维度状态面板渲染所有4个维度
- [ ] 进度环渲染正确的百分比

**验证：**

- [ ] `npm run test` 组件测试通过

**依赖：** 任务 2.1, 任务 2.2, 任务 2.3

**涉及的文件：**

- `src-next/__tests__/components/ProjectHealthCard.test.tsx`
- `src-next/__tests__/components/ProjectDimensionStatus.test.tsx`
- `src-next/__tests__/components/DimensionProgressRing.test.tsx`

**预估范围：** S

#### 任务 4.3：E2E 测试

**描述：** 使用 Playwright 编写一个端到端测试场景：创建项目 → 添加任务 → 推进任务状态 → 验证项目聚合状态自动刷新。

**验收标准：**

- [ ] E2E 测试覆盖完整的用户流程
- [ ] 测试不依赖预置数据（自包含）

**验证：**

- [ ] `npx playwright test` 通过

**依赖：** 任务 2.4, 任务 3.3

**涉及的文件：**

- `e2e/project-task-driven.spec.ts`（新建）

**预估范围：** M

### 检查点：全部完成

- [ ] 所有单元测试通过（100% 分支覆盖）
- [ ] 所有 API 测试通过
- [ ] E2E 测试通过
- [ ] `npm run build` 无错误
- [ ] 手动验证：创建项目 → 添加任务 → 推进 → 健康度刷新
- [ ] 代码审查通过

---

## 风险与缓解措施

| 风险                               | 影响 | 缓解措施                                             |
| ---------------------------------- | ---- | ---------------------------------------------------- |
| 现有代码依赖 `project.status` 字段 | 高   | 在移除前用 Grep 搜索全量代码，确保无隐藏引用         |
| 聚合引擎在大数据量下性能           | 中   | 第一版同步触发，若性能差再加缓存/异步队列            |
| 前端改版导致现有功能退化           | 高   | 分步迁移（先加新UI，共存，再删旧UI），每步都有检查点 |
| 数据迁移脚本写错导致数据丢失       | 高   | 迁移前备份数据库，迁移脚本必须幂等可重跑             |

## 与 V1 交付计划的关系

本计划对应 V1 交付计划的"项目管理模块重构"部分。完成本计划后，项目管理模块将彻底转型为任务驱动模型，后续可继续审视其他模块（任务中心、验收管理、采购管理等）。

## 待解决问题

- 无（spec 中 4 个开放问题已由用户确认）
