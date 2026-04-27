# Draft: 任务模块开发计划

## Requirements (PRD V1)

- 任务树管理、父子任务、任务关系
- 模板实例化 → 任务自动生成
- 任务分配、执行推进、提交验收
- 标准绑定与快照
- SLA/催办/阻塞/风险
- 派生任务（整改）
- P0 核心字段 8 个（task_id, task_code, task_name, project_id, status, assignee_id, planned_start_at, planned_end_at, created_by, created_at）
- PRD 总共 58 字段

## Current State

- ✅ UI 骨架（TaskManagementPage + 视图切换 + 统计卡片）
- ✅ 类型定义基本就绪（但缺 node_level_type, business_domain, priority, required_flag, milestone_flag, sortOrder, tags 等）
- ✅ TaskStatus 状态机（9 状态 + 守卫）
- ✅ TaskTemplate / ProjectTemplate 类型（完整对齐契约）
- ✅ 模板实例化引擎（循环检测/依赖校验/状态验证）
- ❌ 所有数据来自 mockTasks（15 条硬编码）
- ❌ 无真实 parentTaskId（只有 parentPath 字符串）
- ❌ 无 project_id FK（只有 projectName 字符串）
- ❌ 无标准绑定真实数据
- ❌ DB 仅 10 字段（缺 48 个 PRD 字段）
- ❌ TaskItem 缺 node_level_type, priority, required_flag, milestone_flag, sortOrder, tags

## Gap Analysis

| PRD 要求        | 当前                         | 差距           |
| --------------- | ---------------------------- | -------------- |
| 58 字段数据模型 | TaskItem ~20 字段            | 缺 38 字段     |
| 4 层任务树      | parentPath 字符串            | 无真实父子关系 |
| 项目-任务 FK    | projectName 字符串           | 无 project_id  |
| 模板→任务实例化 | 引擎就绪，无 UI              | 需接通链路     |
| 标准绑定        | mock "已绑定"                | 无真实数据     |
| DB 持久化       | 仅 10 字段                   | 缺 48 字段     |
| 任务分配/派单池 | 无                           | 需新建         |
| 执行清单        | 无                           | 需新建         |
| 派生任务(整改)  | rectificationRepository 已有 | 需接通         |
| SLA/催办/阻塞   | TaskItem 有占位字段          | 需真实计算     |

## Technical Decisions

- 开发顺序：DB → 类型 → 数据层 → UI → 集成
- P0 字段优先（基础 CRUD 跑通），P1 逐步补齐
- 复用现有 WorkItem 体系的 parentId 模式做真实树
- 先不做 Agent 能力（Phase 5 的事）

## Scope Boundaries

- IN: TaskItem 字段补齐、DB 迁移、API 完善、TaskTreeView 真树化、模板实例化 UI、标准绑定最小闭环
- EXCLUDE: Agent 能力、排程引擎、跨项目市场、自定义字段系统、验收模块独立开发

## Open Questions

- work_package 表是否需要切出来独立建？还是暂时挂在 task 上？
- 标准绑定是存 ID 引用还是存快照？PRD 要求两者都有
