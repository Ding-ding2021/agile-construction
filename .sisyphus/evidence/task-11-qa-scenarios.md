# QA Scenarios for Core Modules

This document enumerates comprehensive QA scenarios covering Happy path, Edge cases, and Error paths for selected core modules. Scenarios reference existing tests and source implementations to ensure alignment with current coverage.

Note: This file does not modify production code or tests. It is an evidence artifact for QA analysis.

## Module: projectStatusMachine

### Happy path

- Scenario 1: 待立项 -> 待确认 with container present; expect ok and no reason.
  - Context: { hasContainer: true }
  - Action: canTransition('待立项','待确认', context)
  - Expected: { ok: true }
- Scenario 2: 待确认 -> 待拆解 with approval present; expect ok.
  - Context: { hasApproval: true }
  - Action: canTransition('待确认','待拆解', context)
  - Expected: { ok: true }

### Edge cases

- Scenario 3: 待立项 -> 待确认 without container; expect not ok and reason contains '容器'.
  - Context: { hasContainer: false }
  - Action: canTransition('待立项','待确认', context)
  - Expected: { ok: false, reason: expect.stringContaining('容器') }
- Scenario 4: 待拆解 -> 执行中, missing milestones; expect not ok and reason mentions milestone/container/etc.
  - Context: { hasContainer: true, hasMilestones: false, hasTaskTree: true, hasStandardBinding: true }
  - Action: canTransition('待拆解','执行中', context)
  - Expected: { ok: false, reason: expect.any(String) }

### Error paths

- Scenario 5: 非法流转路径: 待立项 -> 已归档; expect not ok.
  - Context: { }
  - Action: canTransition('待立项','已归档', context)
  - Expected: { ok: false }
- Scenario 6: 待执行 -> 待提交: 不满足守卫时，仍返回阻塞信息（通用守卫失败）
  - Context: { } // 走守卫校验，未通过将返回阻塞原因
  - Action: canTransition('执行中','待提交', context)
  - Expected: { ok: false, blockedReason: expect.any(String) }

## Module: projectRepository

### Happy path

- Scenario 1: saveState 将本地状态写入本地存储，并返回成功；检查键名和结构。
  - Action: 调用 projectRepository.saveState({ projects, logs })，随后读取本地存储键。
  - Expected: localStorage 包含 'pm-projects-state-v1' 与正确结构；'pm-project-logs-v1' 也存在。
- Scenario 2: loadState 在本地存在数据时，优先返回本地数据并覆盖本地日志。
  - Action: 预置 localStorage 项目和日志；调用 projectRepository.loadState()
  - Expected: 返回的 state 包含本地数据，日志来自本地缓存。

### Edge cases

- Scenario 3: loadState 当远端请求失败时，回退到本地状态。
  - Action: 模拟 serverAdapter 调用失败，调用 loadState()
  - Expected: 返回本地缓存的 state（如果有）或初始状态。
- Scenario 4: saveState 远端写入失败但本地仍然更新缓存。
  - Action: 在 saveState 时让远端调用抛错，检查本地缓存是否仍被写入。
  - Expected: 本地缓存更新完成，且错误被记录（不抛错）。

### Error paths

- Scenario 5: 本地存储不可用时的恢复行为。
  - Action: 将 localStorage 置为不可用（模拟浏览器异常），调用 loadState()
  - Expected: 程序应回退到初始本地状态并继续工作。
- Scenario 6: 保存状态时发生 JSON 序列化错误。
  - Action: 注入不可序列化对象，调用 saveState()
  - Expected: 错误被捕获并记录，仍尝试保留本地缓存。

## Module: taskManagement.selectors

### Happy path

- Scenario 1: calculateTaskStats 对简单任务集返回正确统计（总数、待分配、执行中等）。
  - Action: 传入示例任务列表
  - Expected: stats.total 等字段符合示例数据；例如 total === 3。
- Scenario 2: sortTasks 按 remind-desc 排序正确。
  - Action: sortTasks(tasks, 'remind-desc')
  - Expected: 结果按 remindCount 从高到低排序。

### Edge cases

- Scenario 3: searchTasks 对空字符串返回全部任务。
  - Action: searchTasks(tasks, '')
  - Expected: 返回原始任务数组长度等于输入。
- Scenario 4: advancedFilter 同时应用 status/riskLevel，返回符合条件的子集。
  - Action: advancedFilter(tasks, { status: '执行中', riskLevel: '中风险' })
  - Expected: 返回仅包含符合这两个条件的任务。

### Error paths

- Scenario 5: paginateTasks 在越界页码时回落到有效页。
  - Action: paginateTasks(tasks, 999, 2)
  - Expected: currentPage 为最后一页，数据长度正确。
- Scenario 6: processTasks 对复杂过滤链路正常工作，产出分页结果。
  - Action: 传入多条件过滤并确认 pagination 对象。
  - Expected: data 与 pagination 正确反映过滤结果。

## Module: taskStateMachine.guards

### Happy path

- Scenario 1: validateStatusTransition - 待分配 -> 待执行，条件均满足时通过。
  - Task: owner 已指派、standardBindingStatus 已绑定、snapshot 已生成、standardSnapshotId 存在
  - Action: validateStatusTransition(task, '待执行', [task])
  - Expected: { passed: true }
- Scenario 2: validateStatusTransition - 待执行 -> 执行中，未阻塞且执行主体已确认
  - Task: owner 不是待分配，前置任务未阻塞
  - Action: validateStatusTransition(task, '执行中', [task])
  - Expected: { passed: true }

### Edge cases

- Scenario 3: 待执行 -> 待提交，进度不足80%，应被阻塞
  - Task: progress 50
  - Action: validateStatusTransition(task, '待提交', [task])
  - Expected: passed: false, blockedReason 包含 '执行进度不足'
- Scenario 4: 待验收 -> 待结算，验收未通过，应被阻塞
  - Task: progress 100, acceptancePassed false
  - Action: validateStatusTransition(task, '待结算', [task])
  - Expected: passed: false

### Error paths

- Scenario 5: 待分配 -> 待执行，未提供执行人且未绑定执行标准
  - Task: owner 为 '待分配'，standardBindingStatus 为 '未绑定'
  - Action: validateStatusTransition(task, '待执行', [task])
  - Expected: passed: false, blockedReason 非空
- Scenario 6: 待拆解 -> 执行中，存在前置任务阻塞
  - Task: predecessor 状态为阻塞
  - Action: validateStatusTransition(task, '执行中', [task, predecessor])
  - Expected: passed: false

## Evidence and references

- 参考测试用例（Happy/Edge/Error）位于：
  - src/domain/**tests**/projectStatusMachine.test.ts
  - src/domain/projectStatusMachine.ts
  - src/services/repositories/projectRepository.ts
  - src/components/task/taskManagement.selectors.ts
  - src/components/task/**tests**/taskManagement.selectors.test.ts
  - src/components/task/**tests**/taskStateMachine.guards.test.ts

## Evidence count

- This QA document covers 4 modules with 2 scenarios per section (Happy/Edge/Error), totaling 24 scenarios.
