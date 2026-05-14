# 实现计划：标准管理"标准驱动执行"架构重构

## 概述

将标准管理从"孤立的标准库 CRUD"重构为"标准驱动任务生成、执行指导与验收判定的核心引擎"。核心是新建**规则执行引擎**（Rule Engine）、**快照服务**（Snapshot Service）和**标准绑定服务**（Standard Binding Service），打通标准→任务→验收的完整链路。

## 架构决策

| 决策           | 选择                                      | 理由                                           |
| -------------- | ----------------------------------------- | ---------------------------------------------- |
| 快照粒度       | 每条 clause+rule 一条快照记录             | 便于按条款查询和对比历史版本                   |
| 规则失败容错   | 严格模式（全部通过才算通过）              | V1 优先保障质量                                |
| 绑定时机       | 任务详情内随时绑定                        | 灵活，不阻塞任务创建流程；锁定时机是快照生成时 |
| 文件管理完整度 | V1 仅元信息（名称、版本），不上传实际文件 | 快速上线                                       |
| 数据查询方式   | 保持 raw SQL（better-sqlite3）            | 与现有代码一致                                 |
| 服务层位置     | 新建 `local-api/services/` 目录           | 当前无 Service 层，需要独立测试的能力          |

## 任务列表

### 阶段 0：基础设施——规则引擎 + 快照服务（可独立测试）

#### 任务 0.1：创建规则执行引擎

**描述：** 新建 `local-api/services/ruleEngine.ts`，实现三种 judgeType 的判定逻辑。纯函数，不依赖数据库，可独立单元测试。

**验收标准：**

- [ ] `executeRule(rule, actualValue)` → 返回 `RuleResult { passed, actualValue, expectedValue, message }`
- [ ] boolean 型：`executeRule({ judgeType: 'boolean' }, true)` → `{ passed: true }`
- [ ] boolean 型：`executeRule({ judgeType: 'boolean' }, false)` → `{ passed: false }`
- [ ] range 型：`executeRule({ judgeType: 'range', paramConfig: '{"max":3}' }, 2)` → `{ passed: true }`
- [ ] range 型：`executeRule({ judgeType: 'range', paramConfig: '{"max":3}' }, 5)` → `{ passed: false }`
- [ ] range 型支持 min+max 双向区间
- [ ] enum 型：值在 allowed 列表中 → 通过；不在 → 不通过
- [ ] `executeAcceptanceRules(snapshots, values)` → 聚合全部规则的判定结果
- [ ] 无效 `paramConfig` JSON 时返回错误结果并带 error message
- [ ] 全部函数有 TypeScript 类型定义

**验证：**

- [ ] 单元测试通过：`npm run test -- ruleEngine`

**依赖：** 无

**涉及的文件：**

- `local-api/services/ruleEngine.ts`（新建）
- `local-api/types/rule-engine.ts`（新建，类型定义）

**预估范围：** M

#### 任务 0.2：规则引擎单元测试

**描述：** 为规则引擎的每种 judgeType 编写完整测试，覆盖通过/不通过边界情况。

**验收标准：**

- [ ] boolean 型：通过、不通过、边界（null 值）
- [ ] range 型：在区间内、低于最小值、高于最大值、恰好等于边界
- [ ] enum 型：在列表中、不在列表中、空列表
- [ ] `executeAcceptanceRules`：全部通过、部分未通过、全部未通过、空快照
- [ ] 无效 paramConfig：缺失、格式错误、缺少必要字段

**验证：**

- [ ] `npx vitest run -- coverage` → ruleEngine 100% 分支覆盖

**依赖：** 任务 0.1

**涉及的文件：**

- `tests/services/ruleEngine.test.ts`（新建）

**预估范围：** M

#### 任务 0.3：创建快照服务

**描述：** 新建 `local-api/services/snapshotService.ts`，实现标准快照的生成逻辑。核心原则：快照一旦生成不可修改。

**验收标准：**

- [ ] `generateSnapshots(taskId)` → 读取任务绑定的标准，生成快照并存入 `standard_snapshots` 表
- [ ] 快照内容包含：standardName, clauseCode, clauseTitle, clauseContent, ruleJudgeType, ruleParamConfig
- [ ] 快照版本号按时间戳生成（如 `2026-05-14T10:30:00.000Z`）
- [ ] 快照写入后对应 TaskStandardBinding 的 `snapshotStatus` 更新为 `"snapshotted"`
- [ ] `getTaskSnapshots(taskId)` → 返回任务所有快照
- [ ] `getSnapshotById(snapshotId)` → 返回单条快照
- [ ] 同一任务重复调用 `generateSnapshots` 时不重复生成（幂等）

**验证：**

- [ ] 单元测试 + 集成测试通过

**依赖：** 任务 0.1（读取 rule 数据）、任务 1.1（StandardSnapshot 表）

**涉及的文件：**

- `local-api/services/snapshotService.ts`（新建）

**预估范围：** M

#### 任务 0.4：创建标准绑定服务

**描述：** 新建 `local-api/services/standardBindingService.ts`，管理任务与标准条款的绑定关系。

**验收标准：**

- [ ] `bindStandardsToTask(taskId, clauseIds[])` → 批量创建绑定，每条一个类型（execution/acceptance）
- [ ] `unbindStandard(taskId, bindingId)` → 解绑单条
- [ ] `getTaskBindings(taskId)` → 返回任务所有绑定
- [ ] `checkBindingGuard(taskId)` → 检查任务是否已生成快照，已生成则禁止修改绑定
- [ ] 绑定/解绑操作记录 `boundAt` 时间戳和 `boundBy` 操作人

**验证：**

- [ ] 单元测试通过（守卫逻辑）

**依赖：** 任务 1.2（TaskStandardBinding 表）

**涉及的文件：**

- `local-api/services/standardBindingService.ts`（新建）

**预估范围：** S

### 检查点：阶段 0

- [ ] ruleEngine 全部判定逻辑正确
- [ ] ruleEngine 100% 分支覆盖
- [ ] snapshotService 快照生成 + 幂等正确
- [ ] standardBindingService 绑定/解绑/守卫正确
- [ ] 3 个 Service 文件均可独立测试

---

### 阶段 1：数据库 + API 层

#### 任务 1.1：新增 StandardSnapshot 表（Prisma）

**描述：** 在 `prisma/schema.prisma` 中新增 StandardSnapshot 模型，运行 migration。

**验收标准：**

- [ ] StandardSnapshot 模型含全部字段：id, standardId, clauseId?, ruleId?, taskId, snapshotVersion, standardName, clauseCode, clauseTitle, clauseContent?, ruleJudgeType?, ruleParamConfig?, generatedAt, generatedBy
- [ ] 关联关系：standard(Standard), clause(StandardClause?), rule(StandardRule?), task(ProjectTask)
- [ ] `npx prisma migrate dev` 成功
- [ ] `npx prisma studio` 可见 `standard_snapshots` 表

**验证：**

- [ ] migration 文件生成正确
- [ ] `npm run dev:api` 启动无错误

**依赖：** 无

**涉及的文件：**

- `prisma/schema.prisma`
- `prisma/migrations/`（自动生成）

**预估范围：** S

#### 任务 1.2：新增 TaskStandardBinding 表（Prisma）

**描述：** 在 `prisma/schema.prisma` 中新增 TaskStandardBinding 模型，建立任务与标准条款的多对多绑定。

**验收标准：**

- [ ] TaskStandardBinding 模型含字段：id, taskId, clauseId, ruleId?, bindingType(execution/acceptance), boundAt, boundBy?
- [ ] 唯一约束：`@@unique([taskId, clauseId, bindingType])`
- [ ] 关联关系：task(ProjectTask), clause(StandardClause), rule(StandardRule?)
- [ ] `npx prisma migrate dev` 成功

**验证：**

- [ ] `npm run dev:api` 启动无错误

**依赖：** 无

**涉及的文件：**

- `prisma/schema.prisma`
- `prisma/migrations/`（自动生成）

**预估范围：** S

#### 任务 1.3：新建标准绑定 API 端点（4 个）

**描述：** 新增绑定/解绑/查询的 REST API 端点，调用 standardBindingService。

**验收标准：**

- [ ] `POST /tasks/:id/standards/bind` → 接收 `{ clauseIds: number[], bindingType: string }` → 绑定成功返回绑定列表
- [ ] `DELETE /tasks/:id/standards/:bindingId` → 解绑单条，检查守卫
- [ ] `GET /tasks/:id/standards` → 返回任务已绑定标准列表（含 clause 详情）
- [ ] `GET /standards/:id/bindings` → 返回该标准被哪些任务引用
- [ ] 绑定前校验：clause 是否存在、bindingType 是否合法
- [ ] 解绑时：已生成快照的任务拒绝解绑（返回 409 Conflict）

**验证：**

- [ ] `curl -X POST localhost:3001/api/tasks/1/standards/bind -d '{"clauseIds":[1,2],"bindingType":"acceptance"}'` → 200
- [ ] `curl -X DELETE localhost:3001/api/tasks/1/standards/1` → 200
- [ ] 已快照任务解绑 → 409

**依赖：** 任务 0.4, 任务 1.2

**涉及的文件：**

- `local-api/routes/standards.ts`
- `local-api/controllers/standards.ts`（新增方法）
- `local-api/routes/tasks.ts`（新增绑定路由）
- `local-api/controllers/tasks.ts`（新增方法）

**预估范围：** M

#### 任务 1.4：新建快照 API 端点（2 个）

**描述：** 新增快照生成和查询的 API 端点。

**验收标准：**

- [ ] `GET /tasks/:id/snapshots` → 返回任务所有快照列表
- [ ] `POST /tasks/:id/snapshots/generate` → 触发快照生成，返回生成的快照列表
- [ ] 重复调用 generate → 幂等，不重复生成（已有快照则直接返回）
- [ ] 无绑定的任务调用 generate → 返回空数组 + 友好提示信息

**验证：**

- [ ] `curl -X POST localhost:3001/api/tasks/1/snapshots/generate` → 返回快照列表
- [ ] 再次调用同一接口 → 返回相同快照（不重复生成）

**依赖：** 任务 0.3, 任务 1.1, 任务 1.3（需要先绑定标准才能生成快照）

**涉及的文件：**

- `local-api/routes/tasks.ts`
- `local-api/controllers/tasks.ts`（新增方法）

**预估范围：** S

#### 任务 1.5：新建验收规则判定 API 端点

**描述：** 新增 `POST /tasks/:id/acceptance/validate` 端点，读取任务快照，调用 ruleEngine 逐条判定，返回验收结果。

**验收标准：**

- [ ] 接收 `{ values: Record<string, unknown> }` — 每条 clauseCode 对应的实际值
- [ ] 从 StandardSnapshot 读取该任务全部快照
- [ ] 调用 `executeAcceptanceRules(snapshots, values)` 执行判定
- [ ] 返回结果：`{ passed: boolean, passedCount, failedCount, results: RuleResult[] }`
- [ ] 任务无快照 → 返回 `{ error: "未绑定验收标准" }` （400）
- [ ] 全部规则通过 → `{ passed: true }`
- [ ] 任一规则不通过 → `{ passed: false }`，results 详细列出每条

**验证：**

- [ ] `curl localhost:3001/api/tasks/1/acceptance/validate -d '{"values":{"CLAUSE-001":true,"CLAUSE-002":2}}'` → 返回判定结果

**依赖：** 任务 0.1, 任务 1.4

**涉及的文件：**

- `local-api/routes/tasks.ts`
- `local-api/controllers/tasks.ts`（新增方法）
- `local-api/routes/acceptance.ts`（可选，如果验收模块已有独立路由）

**预估范围：** M

#### 任务 1.6：任务状态变更时自动触发快照生成

**描述：** 在 `local-api/controllers/tasks.ts` 的 `updateTaskStatus` 中增加钩子：当任务状态首次变更为有绑定的执行中状态时，自动调用 `generateSnapshots`。

**验收标准：**

- [ ] 任务状态变更（如 draft→executing）且已有标准绑定时，自动生成快照
- [ ] 快照生成失败不影响任务状态变更（降级处理：记录错误日志，任务状态仍正常变更）
- [ ] 已生成过快照的任务不重复生成
- [ ] 任务无绑定标准时，不触发快照生成

**验证：**

- [ ] 创建任务 → 绑定标准 → 变更状态 → 查快照表确认已有记录

**依赖：** 任务 0.3, 任务 1.3, 任务 1.4

**涉及的文件：**

- `local-api/controllers/tasks.ts`

**预估范围：** S

### 检查点：阶段 1

- [ ] StandardSnapshot 和 TaskStandardBinding 表创建成功
- [ ] 7 个新 API 端点全部可用
- [ ] 任务状态变更 → 快照自动生成 → 验收规则判定 后端链路打通
- [ ] `npm run dev:api` 无错误

---

### 阶段 2：前端——标准管理模块内重构

#### 任务 2.1：StandardDetailPage 引入 PageLayout + 标签页容器

**描述：** 重构 StandardDetailPage，替换原始 div 布局为 PageLayout 组件，新增标签页容器 StandardDetailTabs。

**验收标准：**

- [ ] 使用 PageLayout 替代原始 div 容器
- [ ] 标签页包含：基本信息、条款、规则、文件、绑定历史、快照
- [ ] URL hash 支持标签页定位（如 `#rules`）
- [ ] 默认显示"基本信息"标签

**验证：**

- [ ] 打开标准详情页 → 看到 6 个标签页 → 切换正常
- [ ] `npm run dev:frontend` 无编译错误

**依赖：** 无

**涉及的文件：**

- `src-next/pages/standards/StandardDetailPage.tsx`
- `src-next/pages/standards/components/StandardDetailTabs.tsx`（新建）

**预估范围：** M

#### 任务 2.2：新建"规则"标签页——规则 CRUD

**描述：** 新建规则管理标签页，展示当前选中条款的规则列表，支持增删改。新建 RuleEditDialog 处理三种 judgeType 的不同输入。

**验收标准：**

- [ ] 规则列表表格：judgeType、paramConfig（格式化显示）、description
- [ ] 新建规则弹窗：
  - boolean 型：无需额外配置项
  - range 型：输入 min / max / unit 三个字段
  - enum 型：输入允许值列表（可动态增减条目）
- [ ] 编辑规则弹窗：同上，预填现有值
- [ ] 删除规则：二次确认弹窗 → 确认后删除
- [ ] paramConfig 实时预览：JSON.stringify 格式化展示

**验证：**

- [ ] 切换到"规则"标签 → 看到规则列表
- [ ] 添加一条 boolean 型规则 → 列表刷新
- [ ] 添加一条 range 型规则 → 输入 min/max/unit → 保存成功
- [ ] 编辑规则 → 弹窗预填 → 保存成功
- [ ] 删除规则 → 确认 → 列表刷新

**依赖：** 任务 2.1

**涉及的文件：**

- `src-next/pages/standards/StandardDetailPage.tsx`（注册规则标签页）
- `src-next/pages/standards/components/RuleEditDialog.tsx`（新建）

**预估范围：** L（三种 judgeType 输入控件较复杂）

#### 任务 2.3：新建"文件"标签页——文件元信息管理

**描述：** 新建文件管理标签页，V1 仅管理元信息（文件名、版本号），不做实际文件上传。

**验收标准：**

- [ ] 文件列表表格：文件名、文件版本
- [ ] 新增文件元信息弹窗：输入文件名和版本号
- [ ] 编辑文件元信息弹窗：预填
- [ ] 删除文件元信息：二次确认
- [ ] 加载态使用 Skeleton

**验证：**

- [ ] 切换到"文件"标签 → 看到文件列表
- [ ] 添加文件元信息 → 列表刷新

**依赖：** 任务 2.1

**涉及的文件：**

- `src-next/pages/standards/StandardDetailPage.tsx`（注册文件标签页）
- `src-next/pages/standards/components/StandardFileMetaEditor.tsx`（新建）

**预估范围：** S

#### 任务 2.4：新建"绑定历史"标签页

**描述：** 展示当前标准被哪些任务引用。调用 `GET /standards/:id/bindings` API。

**验收标准：**

- [ ] 表格：任务名称、任务编码、条款编码、绑定类型、绑定时间
- [ ] 任务名称可点击跳转到任务详情
- [ ] 空状态：无绑定时显示"暂无任务引用此标准"
- [ ] 加载态使用 Skeleton

**验证：**

- [ ] 有绑定数据的标准 → 看到任务列表
- [ ] 无绑定的标准 → 看到空状态

**依赖：** 任务 1.3（`GET /standards/:id/bindings`）, 任务 2.1

**涉及的文件：**

- `src-next/pages/standards/StandardDetailPage.tsx`（注册绑定历史标签页）
- `src-next/pages/standards/components/BindingHistoryTable.tsx`（新建）

**预估范围：** S

#### 任务 2.5：新建"快照"标签页

**描述：** 展示由当前标准生成的所有快照记录。调用 `GET /tasks/:id/snapshots` — 这里需要一个按标准查询快照的端点，或者在前端从 binding 关联的任务去查。

**验收标准：**

- [ ] 快照列表表格：任务名称、条款编码、快照版本、生成时间
- [ ] 展开行：查看快照内容（冻住的标准名称、条款内容、规则判定类型和配置）
- [ ] 快照不可编辑、不可删除（只读）
- [ ] 空状态："暂无快照"
- [ ] 加载态使用 Skeleton

**验证：**

- [ ] 有快照的标准 → 看到快照列表 + 展开查看详情
- [ ] 无快照的标准 → 空状态

**依赖：** 任务 1.4（快照 API）, 任务 2.1

**涉及的文件：**

- `src-next/pages/standards/StandardDetailPage.tsx`（注册快照标签页）

**预估范围：** S

#### 任务 2.6：StandardListPage 增强

**描述：** 为标准列表页增强功能。

**验收标准：**

- [ ] **新增列**："引用任务数"，悬停提示显示任务名称列表
- [ ] **加载态**：替换"加载中..."文字 → Skeleton 组件
- [ ] 移除"删除"按钮文字中的纯文本提示 → 使用二次确认 Dialog

**验证：**

- [ ] 打开标准列表 → 看到新列、Skeleton 加载态

**依赖：** 任务 1.3（引用计数依赖 `GET /standards/:id/bindings`）

**涉及的文件：**

- `src-next/pages/standards/StandardListPage.tsx`

**预估范围：** S

### 检查点：阶段 2

- [ ] StandardDetailPage 有 6 个完整标签页
- [ ] 规则 CRUD 三种类型都可用
- [ ] 文件元信息管理可用
- [ ] 绑定历史和快照标签页正确展示数据
- [ ] StandardListPage Skeleton + 引用数列
- [ ] `npm run dev:frontend` 无编译错误

---

### 阶段 3：前端——跨模块链路打通

#### 任务 3.1：新建 StandardBindingPanel（任务详情内的标准绑定标签）

**描述：** 在任务详情页新增"标准"标签页，内含 StandardBindingPanel。调用绑定 API 完成标准→任务的绑定。

**验收标准：**

- [ ] 搜索条：按标准名称/编码模糊搜索
- [ ] 标准列表：显示搜索匹配的标准，点击展开查看条款
- [ ] StandardClauseSelector：条款多选（复选框），区分执行标准和验收标准
- [ ] 绑定按钮：将选中条款绑定到当前任务
- [ ] 已绑定列表：显示当前任务已绑定的条款，支持解绑
- [ ] 守卫：已生成快照的任务，绑定面板显示"快照已生成，不可修改"，隐藏绑定/解绑操作

**验证：**

- [ ] 打开任务详情 → "标准"标签 → 搜索标准 → 选择条款 → 绑定 → 列表刷新
- [ ] 已快照任务 → 面板只读

**依赖：** 任务 1.3, 任务 1.6

**涉及的文件：**

- `src-next/pages/tasks/components/StandardBinding/StandardBindingPanel.tsx`（新建）
- `src-next/pages/tasks/components/StandardBinding/StandardClauseSelector.tsx`（新建）
- `src-next/pages/tasks/TaskDetailPage.tsx`（注册"标准"标签页）

**预估范围：** L（跨模块交互，多种状态）

#### 任务 3.2：新建 StandardSnapshotViewer（快照查看器）

**描述：** 在任务详情中，查看已生成的标准快照内容。

**验收标准：**

- [ ] 快照列表：每条快照的行标准名称、条款编码、快照版本、生成时间
- [ ] 展开查看：冻住的标准内容（clauseTitle, clauseContent, ruleJudgeType, ruleParamConfig）
- [ ] 与原标准对比：链接到标准详情页当前版本（"当前版本可能有更新"）
- [ ] 空状态："尚未生成标准快照"

**验证：**

- [ ] 已快照任务 → 看到快照列表 → 展开查看内容

**依赖：** 任务 1.4, 任务 3.1

**涉及的文件：**

- `src-next/pages/tasks/components/StandardBinding/StandardSnapshotViewer.tsx`（新建）

**预估范围：** S

#### 任务 3.3：新建 RuleJudgeResult 组件（验收判定展示）

**描述：** 在验收模块中，展示基于规则引擎的判定结果。

**验收标准：**

- [ ] 调用 `POST /tasks/:id/acceptance/validate` API 获取判定结果
- [ ] 展示每条款、每条规则的判定状态（通过/不通过 + 颜色）
- [ ] 汇总条：通过 X / 总计 Y，通过率 Z%
- [ ] 不通过的规则显示：期望值 vs 实际值对比
- [ ] 全部通过时显示绿色成功提示
- [ ] 有未通过时显示红色失败提示 + "可生成整改任务"按钮

**验证：**

- [ ] 模拟有通过/有不通过的验收数据 → 渲染判定结果

**依赖：** 任务 1.5

**涉及的文件：**

- `src-next/pages/acceptance/components/RuleJudgeResult.tsx`（新建）

**预估范围：** M

### 检查点：阶段 3

- [ ] 任务详情"标准"标签 → 搜索/选择/绑定/解绑 全流程
- [ ] 快照查看器展示冻住的标准内容
- [ ] 验收判定结果组件正确展示
- [ ] 标准→绑定→快照→验收 前端链路畅通

---

### 阶段 4：测试完善

#### 任务 4.1：规则引擎快照服务单元测试（详见阶段 0 任务 0.2）

已在阶段 0 完成。此阶段确认通过率。

**验证：**

- [ ] `npx vitest run -- coverage` → ruleEngine + snapshotService 100% 分支覆盖

#### 任务 4.2：API 集成测试

**描述：** 编写 supertest API 测试，验证端到端后端流程。

**验收标准：**

- [ ] 标准绑定：创建任务 → POST bind → 验证绑定记录 → GET 任务绑定列表
- [ ] 标准解绑：DELETE unbind → 验证记录删除
- [ ] 禁止解绑：生成快照后 → DELETE unbind → 409
- [ ] 快照生成：POST generate → 验证快照表有记录
- [ ] 快照幂等：再次 generate → 返回相同记录
- [ ] 验收判定：POST validate → 验证 ruleEngine 被正确调用

**验证：**

- [ ] `npm run test:api` 全部通过

**依赖：** 任务 1.3 ~ 1.6

**涉及的文件：**

- `tests/api/standard-binding.test.ts`（新建）
- `tests/api/standard-snapshot.test.ts`（新建）

**预估范围：** M

#### 任务 4.3：前端组件测试

**描述：** 为关键前端组件编写渲染和交互测试。

**验收标准：**

- [ ] RuleEditDialog：三种 judgeType 的输入控件渲染正确
- [ ] StandardBindingPanel：搜索/选择/绑定交互
- [ ] RuleJudgeResult：通过/不通过状态的渲染
- [ ] StandardSnapshotViewer：快照数据展示

**验证：**

- [ ] `npm run test` 组件测试通过

**依赖：** 任务 2.2, 任务 3.1, 任务 3.2, 任务 3.3

**涉及的文件：**

- `src-next/__tests__/components/RuleEditDialog.test.tsx`
- `src-next/__tests__/components/StandardBindingPanel.test.tsx`
- `src-next/__tests__/components/RuleJudgeResult.test.tsx`

**预估范围：** M

#### 任务 4.4：E2E 测试——全链路

**描述：** 使用 Playwright 编写端到端测试，覆盖标准→绑定→执行→快照→验收完整场景。

**验收标准：**

- [ ] 场景：创建标准（含 clause + rule）→ 绑定到任务 → 任务进入执行 → 快照自动生成 → 验收时读取快照 → 执行规则判定
- [ ] 场景：标准更新后，旧快照内容不变
- [ ] 场景：未绑定验收标准的任务，验收时显示警告

**验证：**

- [ ] `npx playwright test` 通过

**依赖：** 阶段 1 ~ 3 全部完成

**涉及的文件：**

- `e2e/standard-driven-acceptance.spec.ts`（新建）

**预估范围：** L

### 检查点：全部完成

- [ ] 所有单元测试通过（100% 分支覆盖）
- [ ] 所有 API 测试通过
- [ ] E2E 测试通过
- [ ] `npm run build` 无错误
- [ ] `npm run lint` 无错误
- [ ] 手动验证：创建标准 → 绑定任务 → 任务执行 → 快照 → 验收判定 全流程
- [ ] 代码审查通过

---

## 风险与缓解措施

| 风险                                     | 影响 | 缓解措施                                      |
| ---------------------------------------- | ---- | --------------------------------------------- |
| 规则编辑器（三种 judgeType）UI 复杂度高  | 中   | 阶段 2 任务 2.2 作为独立任务，先出原型再细化  |
| StandardBindingPanel 跨模块交互复杂      | 高   | 先完成 API 层（阶段 1），确保后端稳定再写前端 |
| 任务状态变更钩子可能影响现有任务流程     | 中   | 降级处理：快照生成失败不阻塞任务状态变更      |
| 标准→验收判定链路长，中间环节多          | 高   | E2E 测试覆盖主链路，每个阶段有检查点          |
| 现有 StandardDetailPage 重构破坏已有功能 | 中   | 先保留旧代码逻辑，用标签页逐步替代            |

## 与项目管理改造的关系

标准管理改造与项目管理"任务驱动"架构的交互点：

| 项目管理任务                          | 标准管理关联                                                     |
| ------------------------------------- | ---------------------------------------------------------------- |
| 任务 1.7 状态变更触发聚合             | 任务 1.6 状态变更触发快照生成 → 两个钩子可能同时触发，需注意顺序 |
| 验收维度（项目管理 spec 3.2.4）       | 任务 1.5 验收规则判定 → 验收结果影响项目健康度                   |
| 健康度计算规则（项目管理 spec 3.2.3） | "验收整改中"状态 → 标准驱动验收未通过 → 健康度降级               |
| projectAggregator 中验收维度          | 需要读取 StandardSnapshot 来判断验收标准是否覆盖                 |

**执行建议：** 如果项目管理改造和标准管理改造先后实施，标准管理的阶段 0/1 可以与项目管理的阶段 0/1 并行（互不冲突），但标准管理的阶段 3（链路打通）需要在项目管理的阶段 2（验收维度）之后才能完整测试。

## 待解决问题

- 无（spec 中 4 个开放问题已由用户确认决策）
