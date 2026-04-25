---
name: 任务中心V1开发计划-基于最新PRD
overview: 基于最新版任务中心PRD与任务树建模文档，输出面向V1落地的分阶段开发计划，覆盖数据模型、状态机、核心页面、协同流程、审计治理与验收里程碑。
todos:
  - id: align-task-schema
    content: 使用[subagent:code-explorer]梳理PRD字段并更新任务类型定义
    status: completed
  - id: refactor-task-data-flow
    content: 重构任务数据构造与查询管道，统一统计和筛选口径
    status: completed
    dependencies:
      - align-task-schema
  - id: implement-task-ui-behavior
    content: 实现列表与详情交互、状态守卫、附件与历史闭环
    status: completed
    dependencies:
      - refactor-task-data-flow
  - id: upgrade-persistence-contract
    content: 升级仓储与本地API契约，完成新旧快照兼容迁移
    status: completed
    dependencies:
      - implement-task-ui-behavior
  - id: add-regression-tests
    content: 补齐selectors与repository测试，覆盖关键边界与异常回退
    status: completed
    dependencies:
      - upgrade-persistence-contract
  - id: verify-prd-acceptance
    content: 按PRD验收清单执行联调与口径核对并输出差异
    status: completed
    dependencies:
      - add-regression-tests
---

## User Requirements

- 基于最新《任务中心PRD》制定可执行的开发计划。
- 以最新PRD为唯一产品口径，字段说明表必须保留并作为实现与验收基准。
- 开发计划需覆盖任务中心核心能力落地：任务字段、关系模型、状态流转、执行协同、资料与历史记录、统计与验收。
- 同步考虑与任务树建模文档的继承关系，避免双份口径分叉。

## Product Overview

- 任务中心围绕“任务树 + 状态机 + 标准绑定 + 派单执行 + 验收整改闭环”实现统一执行控制台。
- 页面效果上，任务列表/看板/日历/详情应展示一致字段口径，支持筛选、状态推进、风险与SLA提示、过程留痕与资料追溯。

## Core Features

- 统一任务主数据与扩展数据口径（字段说明表、历史映射、ERD一致）。
- 任务状态机与守卫规则执行（待分配到完成/关闭，异常回退与整改派生）。
- 任务详情闭环能力（分配、状态变更、附件、评论、历史、收藏、审计）。
- 多视图查询与统计（列表/看板/日历、筛选排序分页、风险与SLA指标）。
- 持久化与兼容（本地缓存+本地API契约，旧数据平滑兼容）。

## Tech Stack Selection

- 前端：React 19 + TypeScript + Vite（现有架构）
- 任务模块：`src/components/task/*`（现有页面分层）
- 数据持久化：`localStorage` + `taskRepository`（现有模式）
- 本地接口：Node + TypeScript 本地API（`local-api/*`）
- 质量保障：ESLint + Vitest（项目已配置）

## Implementation Approach

- 采用“**先口径、后行为、再持久化与验证**”的分阶段落地策略：先统一类型与字段映射，再实现页面/状态机交互，最后补齐仓储契约和测试。
- 关键决策：复用现有 `TaskManagementPage + selectors + repository` 结构，不引入新框架；通过字段适配层兼容历史字段（如 `task_level`、`attachment_count`）减少回归风险。
- 性能与可靠性：列表处理保持 `filter -> search -> advancedFilter -> sort -> paginate` 单次管道，时间复杂度 O(n log n)（排序主导）；通过 `useMemo`、最小状态更新、分页切片降低重渲染成本。

## Implementation Notes (Execution Details)

- 优先复用现有状态枚举与流转映射（`statusTransitionOptionsMap`），避免并行状态定义。
- 保持哈希路由与上下文键（template/project/source）兼容，避免破坏当前深链打开行为。
- 仓储层先做向后兼容读取：旧快照缺失新字段时填充默认值；保存时统一写新结构。
- 审计日志与操作日志继续走现有 `taskRepository.appendOperationLog` 与 `serverAdapter.appendAuditLog`，避免新增日志通道。

## Architecture Design

- 展示层：`TaskToolbar`（筛选）→ `TaskListView`（多视图）→ `TaskDetailPage`（编辑与流转）。
- 业务层：`taskManagement.selectors.ts` 负责查询管道；`TaskManagementPage.tsx` 负责状态推进与交互编排。
- 数据层：`taskManagement.data.ts`（初始化/构造）+ `taskRepository.ts`（持久化）+ `serverAdapter.ts`/`local-api`（可选远端同步）。
- 文档口径：PRD字段说明表为主源，任务树文档仅做继承与架构映射。

## Directory Structure Summary

本次计划围绕现有任务模块进行增量改造，优先修改既有文件，必要时新增最小测试文件。

```text
/Users/dylan/CodeBuddy/20260402092847/
├── src/
│   ├── components/task/
│   │   ├── taskManagement.types.ts                  # [MODIFY] 扩展任务主字段、附件/评论/历史/收藏及兼容映射类型，统一状态与字段命名口径。
│   │   ├── taskManagement.data.ts                   # [MODIFY] 调整mock与详情构造逻辑，补齐新字段默认值、ERD关系字段及快照生成映射。
│   │   ├── taskManagement.selectors.ts              # [MODIFY] 增强筛选排序统计口径，支持新增字段与指标，维持单管道处理性能。
│   │   ├── TaskManagementPage.tsx                   # [MODIFY] 落地状态守卫、派单/整改/日志闭环、上下文持久化与兼容迁移。
│   │   ├── TaskDetailPage.tsx                       # [MODIFY] 增补详情字段分组展示与编辑规则，接入附件/历史/状态流转的统一交互。
│   │   ├── TaskListView.tsx                         # [MODIFY] 同步列表/看板/日历展示字段，保证状态、风险、SLA与来源口径一致。
│   │   └── TaskToolbar.tsx                          # [MODIFY] 扩展筛选项与排序入口，匹配最新PRD筛选维度。
│   ├── services/
│   │   ├── repositories/taskRepository.ts           # [MODIFY] 扩展任务状态快照结构与兼容读取，统一操作日志/审计写入策略。
│   │   └── api/serverAdapter.ts                     # [MODIFY] 更新任务快照契约类型，保持接口与幂等策略兼容。
│   └── components/task/__tests__/
│       └── taskManagement.selectors.test.ts         # [NEW] 覆盖筛选/排序/分页/统计核心场景与边界数据。
├── local-api/
│   ├── contracts.ts                                 # [MODIFY] 对齐任务状态快照结构定义，确保前后端类型一致。
│   ├── server.ts                                    # [MODIFY] 补充任务快照读写校验与默认回填，保持旧快照可读。
│   └── README.md                                    # [MODIFY] 更新任务状态接口字段说明与示例请求。
└── src/services/__tests__/
    └── taskRepository.task-center.test.ts           # [NEW] 验证本地缓存、远端失败回退、日志追加与整改任务创建。
```

## Agent Extensions

- **SubAgent: `code-explorer`**
- Purpose: 在实施前快速核对任务模块与本地API影响范围，避免遗漏文件与调用链。
- Expected outcome: 输出精确修改清单（类型、页面、仓储、接口、测试）并降低改动回归风险。
