import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

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
  'created_by as createdBy',
  'created_at as createdAt',
  'updated_by as updatedBy',
  'updated_at as updatedAt',
].join(', ')

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
  const parsed = rows.map(row => ({ ...row, tags: parseTagsField(row.tags) }))
  res.json(parsed)
}

export function getTasks(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)

  const rows = db
    .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE project_id = ? ORDER BY id ASC`)
    .all(projectId) as Record<string, unknown>[]

  const parsed = rows.map(row => ({ ...row, tags: parseTagsField(row.tags) }))
  res.json(parsed)
}

export function createTask(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const body = req.body
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO project_tasks (
      project_id, code, name, status,
      assignee_id, assignee_name,
      start_date, due_date, parent_id, node_level_type,
      priority, progress, task_type, source_type, risk_level, sla_status, description,
      actual_start_date, actual_end_date, blocked_reason, remind_count, tags,
      work_package_id, sla_rule_id, planned_work_hours, actual_work_hours, standard_snapshot_id,
      created_by, created_at, updated_by, updated_at
    ) VALUES (
      @projectId, @code, @name, @status,
      @assigneeId, @assigneeName,
      @plannedStartAt, @plannedEndAt, @parentId, @nodeLevelType,
      @priority, @progress, @taskType, @sourceType, @riskLevel, @slaStatus, @description,
      @actualStartAt, @actualEndAt, @blockedReason, @remindCount, @tags,
      @workPackageId, @slaRuleId, @plannedWorkHours, @actualWorkHours, @standardSnapshotId,
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
    createdBy: body.createdBy || '系统',
    updatedBy: body.updatedBy || null,
    now,
  })

  const created = db
    .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE id = ?`)
    .get(result.lastInsertRowid) as Record<string, unknown> | undefined

  const response = created ? { ...created, tags: parseTagsField(created.tags) } : created

  res.status(201).json(response)
}

export function getTaskTree(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)

  const rows = db
    .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE project_id = ?`)
    .all(projectId) as Record<string, unknown>[]

  const tasks = rows.map(r => ({ ...r, tags: parseTagsField(r.tags) }))

  function buildTree(list: any[], parentId: number | null): any[] {
    return list
      .filter(t => (t.parentId ?? null) === parentId)
      .map(t => ({ ...t, children: buildTree(list, t.id) }))
  }

  const tree = buildTree(tasks, null)
  res.json({ tasks: tree })
}

export function updateTask(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const taskId = parseInt(req.params.taskId)
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

  res.json(response)
}

export function deleteTask(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const taskId = parseInt(req.params.taskId)

  const result = db
    .prepare('DELETE FROM project_tasks WHERE id = ? AND project_id = ?')
    .run(taskId, projectId)

  if (result.changes === 0) {
    throw new ApiError('Task not found', 'NOT_FOUND', 404)
  }

  res.status(204).end()
}
