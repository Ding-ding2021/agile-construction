import type { Request, Response, NextFunction } from 'express'
import type Database from 'better-sqlite3'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'
import { extractProjectCode } from './projectHelpers'

const TASK_COLUMNS = [
  'project_tasks.id',
  'project_tasks.project_id as projectId',
  'project_tasks.code',
  'project_tasks.name',
  'project_tasks.status',
  'project_tasks.assignee_id as assigneeId',
  'project_tasks.assignee_name as assigneeName',
  'project_tasks.start_date as plannedStartAt',
  'project_tasks.due_date as plannedEndAt',
  'project_tasks.parent_id as parentId',
  'project_tasks.node_level_type as nodeLevelType',
  'project_tasks.priority',
  'project_tasks.progress',
  'project_tasks.task_type as taskType',
  'project_tasks.source_type as sourceType',
  'project_tasks.risk_level as riskLevel',
  'project_tasks.sla_status as slaStatus',
  'project_tasks.description',
  'project_tasks.required_flag as requiredFlag',
  'project_tasks.milestone_flag as milestoneFlag',
  'project_tasks.owner_role as ownerRole',
  'project_tasks.assignee_type as assigneeType',
  'project_tasks.brand_id as brandId',
  'project_tasks.store_id as storeId',
  'project_tasks.actual_start_date as actualStartAt',
  'project_tasks.actual_end_date as actualEndAt',
  'project_tasks.blocked_reason as blockedReason',
  'project_tasks.remind_count as remindCount',
  'project_tasks.tags',
  'project_tasks.work_package_id as workPackageId',
  'project_tasks.sla_rule_id as slaRuleId',
  'project_tasks.planned_work_hours as plannedWorkHours',
  'project_tasks.actual_work_hours as actualWorkHours',
  'project_tasks.standard_snapshot_id as standardSnapshotId',
  'project_tasks.standard_binding_status as standardBindingStatus',
  'project_tasks.snapshot_status as snapshotStatus',
  'project_tasks.derived_from_task_id as derivedFromTaskId',
  'project_tasks.is_rectification as isRectification',
  'project_tasks.rectification_reason as rectificationReason',
  'project_tasks.close_reason as closeReason',
  'project_tasks.reopen_count as reopenCount',
  'project_tasks.created_by as createdBy',
  'project_tasks.created_at as createdAt',
  'project_tasks.updated_by as updatedBy',
  'project_tasks.updated_at as updatedAt',
].join(', ')

/** 带 projectName 的完整列定义（需要 JOIN projects 表） */
const TASK_COLUMNS_FULL = `${TASK_COLUMNS}, p.name as projectName, p.code as projectCode`

/** SQLite 返回 0/1 整数，转换为前端期望的 boolean */
function formatBoolField(row: Record<string, unknown>, fields: string[]): void {
  for (const f of fields) {
    if (f in row) row[f] = row[f] === 1 || row[f] === true
  }
}

const BOOL_FIELDS = ['requiredFlag', 'milestoneFlag', 'isRectification']

function parseTagsField(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags as string[]
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags)
      return Array.isArray(parsed) ? (parsed as string[]) : []
    } catch {
      return []
    }
  }
  return []
}

/** 为行数据添加计算字段 */
function addComputedFields(row: Record<string, unknown>, db?: Database.Database): void {
  row.isBlocked = !!row.blockedReason
  if (db && row.id) {
    const pre = db
      .prepare(
        `SELECT t.status FROM task_relations r
         JOIN project_tasks t ON t.id = r.to_task_id
         WHERE r.from_task_id = ? AND r.relation_type = 'finish_start'
         LIMIT 1`
      )
      .get(row.id) as { status: string } | undefined
    row.predecessorStatus = pre ? pre.status : '无前置任务'
  } else {
    row.predecessorStatus = '无前置任务'
  }
}

function getProjectId(projectCode: string): number {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) {
    throw new ApiError('Project not found', 'NOT_FOUND', 404)
  }
  return project.id
}

export function getAllTasks(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 50))
  const offset = (page - 1) * pageSize

  const countRow = db.prepare('SELECT COUNT(*) as total FROM project_tasks').get() as {
    total: number
  }
  const rows = db
    .prepare(
      `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks
       LEFT JOIN projects p ON p.id = project_tasks.project_id
       ORDER BY project_tasks.id ASC LIMIT ? OFFSET ?`
    )
    .all(pageSize, offset) as Record<string, unknown>[]
  const parsed = rows.map(row => {
    const r = { ...row, tags: parseTagsField(row.tags) } as Record<string, unknown>
    formatBoolField(r, BOOL_FIELDS)
    addComputedFields(r, db)
    return r
  })
  res.json({
    data: parsed,
    pagination: {
      page,
      pageSize,
      total: countRow.total,
      totalPages: Math.ceil(countRow.total / pageSize),
    },
  })
}

export function getTasks(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 50))
  const offset = (page - 1) * pageSize

  const countRow = db
    .prepare('SELECT COUNT(*) as total FROM project_tasks WHERE project_id = ?')
    .get(projectId) as { total: number }

  const rows = db
    .prepare(
      `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks
       LEFT JOIN projects p ON p.id = project_tasks.project_id
       WHERE project_id = ? ORDER BY project_tasks.id ASC LIMIT ? OFFSET ?`
    )
    .all(projectId, pageSize, offset) as Record<string, unknown>[]

  const parsed = rows.map(row => {
    const r = { ...row, tags: parseTagsField(row.tags) } as Record<string, unknown>
    formatBoolField(r, BOOL_FIELDS)
    addComputedFields(r, db)
    return r
  })
  res.json({
    data: parsed,
    pagination: {
      page,
      pageSize,
      total: countRow.total,
      totalPages: Math.ceil(countRow.total / pageSize),
    },
  })
}

export function createTask(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const body = req.body
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO project_tasks (
      project_id, code, name, status,
      assignee_id, assignee_name,
      start_date, due_date, parent_id, node_level_type,
      priority, progress, task_type, source_type, risk_level, sla_status, description,
      required_flag, milestone_flag, owner_role, assignee_type, brand_id, store_id,
      actual_start_date, actual_end_date, blocked_reason, remind_count, tags,
      work_package_id, sla_rule_id, planned_work_hours, actual_work_hours,
      standard_snapshot_id, standard_binding_status, snapshot_status,
      derived_from_task_id, is_rectification, rectification_reason, close_reason, reopen_count,
      created_by, created_at, updated_by, updated_at
    ) VALUES (
      @projectId, @code, @name, @status,
      @assigneeId, @assigneeName,
      @plannedStartAt, @plannedEndAt, @parentId, @nodeLevelType,
      @priority, @progress, @taskType, @sourceType, @riskLevel, @slaStatus, @description,
      @requiredFlag, @milestoneFlag, @ownerRole, @assigneeType, @brandId, @storeId,
      @actualStartAt, @actualEndAt, @blockedReason, @remindCount, @tags,
      @workPackageId, @slaRuleId, @plannedWorkHours, @actualWorkHours,
      @standardSnapshotId, @standardBindingStatus, @snapshotStatus,
      @derivedFromTaskId, @isRectification, @rectificationReason, @closeReason, @reopenCount,
      @createdBy, @now, @updatedBy, @now
    )
  `)

  const result = stmt.run({
    projectId,
    code: body.code || '',
    name: body.name || '',
    status: body.status || '草稿',
    assigneeId: body.assigneeId || '',
    assigneeName: body.assigneeName || '待分配',
    plannedStartAt: body.plannedStartAt || null,
    plannedEndAt: body.plannedEndAt || null,
    parentId: body.parentId || null,
    nodeLevelType: body.nodeLevelType || 'task',
    priority: body.priority || 'medium',
    progress: body.progress || 0,
    taskType: body.taskType || '标准任务',
    sourceType: body.sourceType || 'manual',
    riskLevel: body.riskLevel || '低风险',
    slaStatus: body.slaStatus || '正常',
    description: body.description || body.taskDescription || null,
    requiredFlag: body.requiredFlag ? 1 : 0,
    milestoneFlag: body.milestoneFlag ? 1 : 0,
    ownerRole: body.ownerRole || null,
    assigneeType: body.assigneeType || null,
    brandId: body.brandId || null,
    storeId: body.storeId || null,
    actualStartAt: body.actualStartAt || null,
    actualEndAt: body.actualEndAt || null,
    blockedReason: body.blockedReason || null,
    remindCount: body.remindCount || 0,
    tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags || null,
    workPackageId: body.workPackageId || null,
    slaRuleId: body.slaRuleId || null,
    plannedWorkHours: body.plannedWorkHours || null,
    actualWorkHours: body.actualWorkHours || null,
    standardSnapshotId: body.standardSnapshotId || null,
    standardBindingStatus: body.standardBindingStatus || 'unbound',
    snapshotStatus: body.snapshotStatus || 'draft',
    derivedFromTaskId: body.derivedFromTaskId || null,
    isRectification: body.isRectification ? 1 : 0,
    rectificationReason: body.rectificationReason || null,
    closeReason: body.closeReason || null,
    reopenCount: body.reopenCount || 0,
    createdBy: body.createdBy || '系统',
    updatedBy: body.updatedBy || null,
    now,
  })

  const created = db
    .prepare(
      `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks
       LEFT JOIN projects p ON p.id = project_tasks.project_id WHERE project_tasks.id = ?`
    )
    .get(result.lastInsertRowid) as Record<string, unknown> | undefined

  const response = created ? { ...created, tags: parseTagsField(created.tags) } : created
  if (response) {
    formatBoolField(response as Record<string, unknown>, BOOL_FIELDS)
    addComputedFields(response as Record<string, unknown>, db)
  }

  res.status(201).json(response)
}

export function getTaskTree(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))

  const rows = db
    .prepare(
      `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks
       LEFT JOIN projects p ON p.id = project_tasks.project_id
       WHERE project_id = ?`
    )
    .all(projectId) as Record<string, unknown>[]

  const tasks = rows.map(r => {
    const task = { ...r, tags: parseTagsField(r.tags) } as Record<string, unknown>
    formatBoolField(task, BOOL_FIELDS)
    addComputedFields(task, db)
    return task
  })

  function buildTree(
    list: Record<string, unknown>[],
    parentId: number | null
  ): Record<string, unknown>[] {
    return list
      .filter(t => (t.parentId ?? null) === parentId)
      .map(t => ({ ...t, children: buildTree(list, t.id) }))
  }

  const tree = buildTree(tasks, null)
  res.json({ tasks: tree })
}

/** 接受数字 ID 或字符串 taskCode，统一解析为数字 ID */
function resolveTaskId(db: Database.Database, projectId: number, raw: string): number {
  const id = parseInt(raw)
  if (!isNaN(id)) return id
  const row = db
    .prepare('SELECT id FROM project_tasks WHERE code = ? AND project_id = ?')
    .get(raw, projectId) as { id: number } | undefined
  if (!row) throw new ApiError('Task not found', 'NOT_FOUND', 404)
  return row.id
}

/** 带 projectId 上下文的查询（通过项目路由） */
export function getTaskByCode(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const taskCode = req.params.taskCode
  findTaskByCode(db, taskCode, projectId, res)
}

function findTaskByCode(
  db: Database.Database,
  taskCode: string,
  projectId: number | null,
  res: Response
): void {
  if (projectId) {
    const row = db
      .prepare(
        `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks t
         LEFT JOIN projects p ON p.id = t.project_id
         WHERE t.code = ? AND project_id = ?`
      )
      .get(taskCode, projectId) as Record<string, unknown> | undefined

    if (!row) throw new ApiError('Task not found', 'NOT_FOUND', 404)
    const parsed = { ...row, tags: parseTagsField(row.tags) } as Record<string, unknown>
    formatBoolField(parsed, BOOL_FIELDS)
    addComputedFields(parsed, db)
    res.json(parsed)
  } else {
    const row = db
      .prepare(
        `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks t
         LEFT JOIN projects p ON p.id = t.project_id
         WHERE t.code = ?`
      )
      .get(taskCode) as Record<string, unknown> | undefined

    if (!row) throw new ApiError('Task not found', 'NOT_FOUND', 404)
    const parsed = { ...row, tags: parseTagsField(row.tags) } as Record<string, unknown>
    formatBoolField(parsed, BOOL_FIELDS)
    addComputedFields(parsed, db)
    res.json(parsed)
  }
}

export function getTaskByCodeGlobal(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskCode = req.params.taskCode

  const row = db
    .prepare(
      `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks
       LEFT JOIN projects p ON p.id = project_tasks.project_id
       WHERE project_tasks.code = ?`
    )
    .get(taskCode) as Record<string, unknown> | undefined

  if (!row) {
    throw new ApiError('Task not found', 'NOT_FOUND', 404)
  }

  const parsed = { ...row, tags: parseTagsField(row.tags) } as Record<string, unknown>
  formatBoolField(parsed, BOOL_FIELDS)
  addComputedFields(parsed, db)
  res.json(parsed)
}

export function updateTask(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const taskId = resolveTaskId(db, projectId, req.params.taskId)
  const body = req.body

  if (body.status) {
    const current = db
      .prepare('SELECT status FROM project_tasks WHERE id = ? AND project_id = ?')
      .get(taskId, projectId) as { status: string } | undefined
    if (current) {
      const guardMsg = guardStatusTransition(db, taskId, current.status, body.status)
      if (guardMsg) throw new ApiError(guardMsg, 'STATUS_GUARD', 400)
    }
  }

  const ALLOWED_UPDATE_FIELDS = new Set([
    'status',
    'assigneeId',
    'assigneeName',
    'name',
    'priority',
    'progress',
    'riskLevel',
    'slaStatus',
    'description',
    'taskDescription',
    'blockedReason',
    'tags',
    'remindCount',
    'actualStartAt',
    'actualEndAt',
    'plannedStartAt',
    'plannedEndAt',
    'startDate',
    'dueDate',
    'nodeLevelType',
    'taskType',
    'sourceType',
    'assigneeType',
    'ownerRole',
    'requiredFlag',
    'milestoneFlag',
    'brandId',
    'storeId',
    'workPackageId',
    'slaRuleId',
    'plannedWorkHours',
    'actualWorkHours',
    'standardSnapshotId',
    'standardBindingStatus',
    'snapshotStatus',
    'derivedFromTaskId',
    'isRectification',
    'rectificationReason',
    'closeReason',
    'reopenCount',
    'updatedBy',
  ])

  const setClauses: string[] = []
  const params: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(body)) {
    if (!ALLOWED_UPDATE_FIELDS.has(k)) continue
    const col = k.replace(/[A-Z]/g, m => '_' + m.toLowerCase())
    setClauses.push(`${col} = @${k}`)
    params[k] = v
  }

  if (setClauses.length === 0) {
    throw new ApiError('No fields to update', 'INVALID_REQUEST', 400)
  }

  const result = db
    .prepare(
      `UPDATE project_tasks SET ${setClauses.join(', ')} WHERE id = @_id AND project_id = @_pid`
    )
    .run({ ...params, _id: taskId, _pid: projectId })

  if (result.changes === 0) {
    throw new ApiError('Task not found', 'NOT_FOUND', 404)
  }

  const updated = db
    .prepare(
      `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks
       LEFT JOIN projects p ON p.id = project_tasks.project_id WHERE project_tasks.id = ?`
    )
    .get(taskId) as Record<string, unknown> | undefined

  const response = updated ? { ...updated, tags: parseTagsField(updated.tags) } : updated
  if (response) {
    formatBoolField(response as Record<string, unknown>, BOOL_FIELDS)
    addComputedFields(response as Record<string, unknown>, db)
  }

  res.json(response)
}

export function deleteTask(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const taskId = resolveTaskId(db, projectId, req.params.taskId)

  const childCount = db
    .prepare('SELECT COUNT(*) as cnt FROM project_tasks WHERE parent_id = ? AND project_id = ?')
    .get(taskId, projectId) as { cnt: number }

  if (childCount.cnt > 0) {
    throw new ApiError(
      `无法删除：存在 ${childCount.cnt} 个子任务。请先删除子任务或使用 ?force=true`,
      'HAS_CHILDREN',
      409
    )
  }

  const result = db
    .prepare('DELETE FROM project_tasks WHERE id = ? AND project_id = ?')
    .run(taskId, projectId)

  if (result.changes === 0) {
    throw new ApiError('Task not found', 'NOT_FOUND', 404)
  }

  res.status(204).end()
}

/** 查询前置任务依赖 */
export function getTaskDependencies(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const taskId = resolveTaskId(db, projectId, req.params.taskId)

  const predecessors = db
    .prepare(
      `SELECT r.id, r.from_task_id as fromTaskId, r.to_task_id as toTaskId,
              r.relation_type as relationType,
              ft.code as fromTaskCode, ft.name as fromTaskName, ft.status as fromTaskStatus
       FROM task_relations r
       JOIN project_tasks ft ON ft.id = r.from_task_id
       WHERE r.to_task_id = ?
       ORDER BY r.id`
    )
    .all(taskId)

  const successors = db
    .prepare(
      `SELECT r.id, r.from_task_id as fromTaskId, r.to_task_id as toTaskId,
              r.relation_type as relationType,
              tt.code as toTaskCode, tt.name as toTaskName, tt.status as toTaskStatus
       FROM task_relations r
       JOIN project_tasks tt ON tt.id = r.to_task_id
       WHERE r.from_task_id = ?
       ORDER BY r.id`
    )
    .all(taskId)

  res.json({ data: { predecessors, successors } })
}

/** 前置任务是否全部完成（守卫条件） */
function checkPredecessorsDone(db: ReturnType<typeof getDatabase>, taskId: number): boolean {
  const blockers = db
    .prepare(
      `SELECT COUNT(*) as cnt FROM task_relations r
       JOIN project_tasks ft ON ft.id = r.from_task_id
       WHERE r.to_task_id = ? AND r.relation_type = 'finish_start'
       AND ft.status NOT IN ('已完成', '已关闭')`
    )
    .get(taskId) as { cnt: number }
  return blockers.cnt === 0
}

/** 状态流转是否合法（状态机守卫） */
const STATUS_TRANSITIONS: Record<string, string[]> = {
  草稿: ['待分配'],
  待分配: ['待执行'],
  待执行: ['执行中'],
  执行中: ['已暂停', '待提交'],
  已暂停: ['执行中'],
  待提交: ['待验收'],
  待验收: ['不通过', '已完成'],
  不通过: ['执行中'],
  已完成: ['已关闭'],
  已关闭: [],
}

function checkTransition(from: string, to: string): string | null {
  const allowed = STATUS_TRANSITIONS[from]
  if (!allowed) return `未知来源状态: ${from}`
  if (!allowed.includes(to)) return `不允许从「${from}」流转到「${to}」`
  return null
}

export function getTaskStateMachine(req: Request, res: Response, _next: NextFunction): void {
  res.json({
    transitions: STATUS_TRANSITIONS,
    statuses: Object.keys(STATUS_TRANSITIONS),
  })
}

/** 批量创建任务（支持模板实例化） */
export function batchCreateTasks(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const tasks = req.body.tasks
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new ApiError('tasks array is required', 'VALIDATION_ERROR', 400)
  }

  const insertStmt = db.prepare(`
    INSERT INTO project_tasks (
      project_id, code, name, status,
      assignee_id, assignee_name,
      start_date, due_date, parent_id, node_level_type,
      priority, task_type, source_type, description,
      required_flag, milestone_flag, owner_role, assignee_type,
      created_by, created_at
    ) VALUES (
      @projectId, @code, @name, @status,
      @assigneeId, @assigneeName,
      @plannedStartAt, @plannedEndAt, @parentId, @nodeLevelType,
      @priority, @taskType, @sourceType, @description,
      @requiredFlag, @milestoneFlag, @ownerRole, @assigneeType,
      @createdBy, @now
    )
  `)

  const now = new Date().toISOString()
  const createdIds: number[] = []

  const insertMany = db.transaction((items: Record<string, unknown>[]) => {
    for (const item of items) {
      const info = insertStmt.run({
        projectId,
        code: item.code || '',
        name: item.name || '',
        status: item.status || '草稿',
        assigneeId: item.assigneeId || '',
        assigneeName: item.assigneeName || '待分配',
        plannedStartAt: item.plannedStartAt || null,
        plannedEndAt: item.plannedEndAt || null,
        parentId: item.parentId || null,
        nodeLevelType: item.nodeLevelType || 'task',
        priority: item.priority || 'medium',
        taskType: item.taskType || '标准任务',
        sourceType: item.sourceType || (item.parentId ? 'template' : 'manual'),
        description: item.description || null,
        requiredFlag: item.requiredFlag ? 1 : 0,
        milestoneFlag: item.milestoneFlag ? 1 : 0,
        ownerRole: item.ownerRole || null,
        assigneeType: item.assigneeType || null,
        createdBy: item.createdBy || '系统',
        now,
      })
      createdIds.push(Number(info.lastInsertRowid))
    }
  })

  insertMany(tasks as Record<string, unknown>[])

  const created = db
    .prepare(
      `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks
       LEFT JOIN projects p ON p.id = project_tasks.project_id
       WHERE project_tasks.id IN (${createdIds.map(() => '?').join(',')})`
    )
    .all(...createdIds) as Record<string, unknown>[]

  const parsed = created.map(row => {
    const r = { ...row, tags: parseTagsField(row.tags) } as Record<string, unknown>
    formatBoolField(r, BOOL_FIELDS)
    addComputedFields(r, db)
    return r
  })

  res.status(201).json({ data: parsed, count: parsed.length })
}

/** 状态变更时检查守卫条件 */
function guardStatusTransition(
  db: ReturnType<typeof getDatabase>,
  taskId: number,
  from: string,
  to: string
): string | null {
  const guardErr = checkTransition(from, to)
  if (guardErr) return guardErr

  // 从"待执行"到"执行中"：必须有负责人
  if (from === '待执行' && to === '执行中') {
    const task = db.prepare('SELECT assignee_id FROM project_tasks WHERE id = ?').get(taskId) as
      | {
          assignee_id: string | null
        }
      | undefined
    if (!task?.assignee_id) return '必须指定负责人后才能开始执行'
  }

  // 从"执行中"到"待提交"：前置任务必须完成
  if (from === '执行中' && to === '待提交') {
    if (!checkPredecessorsDone(db, taskId)) return '存在未完成的前置任务，请先完成前置任务'
  }

  return null
}

export { statusTransitionAllowed, checkPredecessorsDone }

function statusTransitionAllowed(from: string, to: string): boolean {
  return checkTransition(from, to) === null
}
