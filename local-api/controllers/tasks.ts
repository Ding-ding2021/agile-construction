import type { Request, Response, NextFunction } from 'express'
import type Database from 'better-sqlite3'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'
import { extractProjectCode } from './projectHelpers'

const TASK_COLUMNS = [
  't.id as id',
  'project_id as projectId',
  't.code as code',
  't.name as name',
  't.status as status',
  'assignee_id as assigneeId',
  'assignee_name as assigneeName',
  'start_date as plannedStartAt',
  'due_date as plannedEndAt',
  'parent_id as parentId',
  'node_level_type as nodeLevelType',
  'priority',
  't.progress as progress',
  'task_type as taskType',
  'source_type as sourceType',
  't.risk_level as riskLevel',
  'sla_status as slaStatus',
  't.description as description',
  'required_flag as requiredFlag',
  'milestone_flag as milestoneFlag',
  'owner_role as ownerRole',
  'assignee_type as assigneeType',
  'brand_id as brandId',
  'store_id as storeId',
  'actual_start_date as actualStartAt',
  'actual_end_date as actualEndAt',
  'blocked_reason as blockedReason',
  'remind_count as remindCount',
  'tags',
  'work_package_id as workPackageId',
  'sla_rule_id as slaRuleId',
  'planned_work_hours as plannedWorkHours',
  'actual_work_hours as actualWorkHours',
  'standard_snapshot_id as standardSnapshotId',
  'standard_binding_status as standardBindingStatus',
  'snapshot_status as snapshotStatus',
  'derived_from_task_id as derivedFromTaskId',
  'is_rectification as isRectification',
  'rectification_reason as rectificationReason',
  'close_reason as closeReason',
  'reopen_count as reopenCount',
  'created_by as createdBy',
  't.created_at as createdAt',
  'updated_by as updatedBy',
  't.updated_at as updatedAt',
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
      `SELECT ${TASK_COLUMNS_FULL} FROM project_tasks t
       LEFT JOIN projects p ON p.id = t.project_id
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
