import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'
import { extractProjectCode } from './projectHelpers'

const TASK_COLUMNS = [
  'id',
  'project_id as projectId',
  'code',
  'name',
  'status',
  'assignee_id as assigneeId',
  'assignee_name as assigneeName',
  'start_date as startDate',
  'due_date as dueDate',
  'parent_id as parentId',
  'node_level_type as nodeLevelType',
  'priority',
  'progress',
  'task_type as taskType',
  'source_type as sourceType',
  'risk_level as riskLevel',
  'sla_status as slaStatus',
  'description',
  'required_flag as requiredFlag',
  'milestone_flag as milestoneFlag',
  'owner_role as ownerRole',
  'assignee_type as assigneeType',
  'brand_id as brandId',
  'store_id as storeId',
  'actual_start_date as actualStartDate',
  'actual_end_date as actualEndDate',
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
  'created_at as createdAt',
  'updated_by as updatedBy',
  'updated_at as updatedAt',
].join(', ')

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
  const rows = db
    .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks ORDER BY id ASC`)
    .all() as Record<string, unknown>[]
  const parsed = rows.map(row => {
    const r = { ...row, tags: parseTagsField(row.tags) } as Record<string, unknown>
    formatBoolField(r, BOOL_FIELDS)
    return r
  })
  res.json(parsed)
}

export function getTasks(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))

  const rows = db
    .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE project_id = ? ORDER BY id ASC`)
    .all(projectId) as Record<string, unknown>[]

  const parsed = rows.map(row => {
    const r = { ...row, tags: parseTagsField(row.tags) } as Record<string, unknown>
    formatBoolField(r, BOOL_FIELDS)
    return r
  })
  res.json(parsed)
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
    .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE id = ?`)
    .get(result.lastInsertRowid) as Record<string, unknown> | undefined

  const response = created ? { ...created, tags: parseTagsField(created.tags) } : created
  if (response) formatBoolField(response as Record<string, unknown>, BOOL_FIELDS)

  res.status(201).json(response)
}

export function getTaskTree(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))

  const rows = db
    .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE project_id = ?`)
    .all(projectId) as Record<string, unknown>[]

  const tasks = rows.map(r => {
    const task = { ...r, tags: parseTagsField(r.tags) } as Record<string, unknown>
    formatBoolField(task, BOOL_FIELDS)
    return task
  })

  function buildTree(list: any[], parentId: number | null): any[] {
    return list
      .filter(t => (t.parentId ?? null) === parentId)
      .map(t => ({ ...t, children: buildTree(list, t.id) }))
  }

  const tree = buildTree(tasks, null)
  res.json({ tasks: tree })
}

function parseTaskId(raw: string): number {
  const id = parseInt(raw)
  if (isNaN(id)) throw new ApiError('无效的任务 ID', 'INVALID_REQUEST', 400)
  return id
}

export function updateTask(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const taskId = parseTaskId(req.params.taskId)
  const body = req.body

  const setClauses: string[] = []
  const params: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(body)) {
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
    .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE id = ?`)
    .get(taskId) as Record<string, unknown> | undefined

  const response = updated ? { ...updated, tags: parseTagsField(updated.tags) } : updated
  if (response) formatBoolField(response as Record<string, unknown>, BOOL_FIELDS)

  res.json(response)
}

export function deleteTask(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const taskId = parseTaskId(req.params.taskId)

  const result = db
    .prepare('DELETE FROM project_tasks WHERE id = ? AND project_id = ?')
    .run(taskId, projectId)

  if (result.changes === 0) {
    throw new ApiError('Task not found', 'NOT_FOUND', 404)
  }

  res.status(204).end()
}
