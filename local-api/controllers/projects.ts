import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const PROJECT_COLUMNS = [
  'id',
  'code',
  'name',
  'brand',
  'status',
  'parent_status as parentStatus',
  'sub_status_json as subStatusJson',
  'status_tone as statusTone',
  'stage',
  'progress',
  'budget',
  'team_size as teamSize',
  'date_range as dateRange',
  'description',
  'owner',
  'risk_level as riskLevel',
  'risk_count as riskCount',
  'milestone',
  'tasks',
  'template_id as templateId',
  'planned_open_date as plannedOpenDate',
  'actual_open_date as actualOpenDate',
  'dispatch_status as dispatchStatus',
  'execution_status as executionStatus',
  'acceptance_status as acceptanceStatus',
  'settlement_status as settlementStatus',
  'pending_dispatch_count as pendingDispatchCount',
  'pending_execution_count as pendingExecutionCount',
  'pending_acceptance_count as pendingAcceptanceCount',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

export function getProjects(_req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const rows = db.prepare(`SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY created_at DESC`).all()
  res.json(rows)
}

export function createProject(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO projects (
      code, name, brand, status, parent_status, sub_status_json, status_tone, stage, progress,
      budget, team_size, date_range, description, owner,
      risk_level, risk_count, milestone, tasks, template_id,
      planned_open_date, actual_open_date,
      dispatch_status, execution_status, acceptance_status, settlement_status,
      pending_dispatch_count, pending_execution_count, pending_acceptance_count,
      created_at, updated_at
    ) VALUES (
      @code, @name, @brand, @status, @parentStatus, @subStatusJson, @statusTone, @stage, @progress,
      @budget, @teamSize, @dateRange, @description, @owner,
      @riskLevel, @riskCount, @milestone, @tasks, @templateId,
      @plannedOpenDate, @actualOpenDate,
      @dispatchStatus, @executionStatus, @acceptanceStatus, @settlementStatus,
      @pendingDispatchCount, @pendingExecutionCount, @pendingAcceptanceCount,
      @now, @now
    )
  `)

  const result = stmt.run({
    code: body.code,
    name: body.name || '',
    brand: body.brand || '',
    status: body.status || '待立项',
    parentStatus: body.parentStatus || '启动',
    subStatusJson: body.subStatusJson || null,
    statusTone: body.statusTone || 'blue',
    stage: body.stage || '启动',
    progress: body.progress || 0,
    budget: body.budget || null,
    teamSize: body.teamSize || null,
    dateRange: body.dateRange || null,
    description: body.description || null,
    owner: body.owner || null,
    riskLevel: body.riskLevel || null,
    riskCount: body.riskCount || 0,
    milestone: body.milestone || null,
    tasks: body.tasks || null,
    templateId: body.templateId || null,
    plannedOpenDate: body.plannedOpenDate || '',
    actualOpenDate: body.actualOpenDate || null,
    dispatchStatus: body.dispatchStatus || null,
    executionStatus: body.executionStatus || null,
    acceptanceStatus: body.acceptanceStatus || null,
    settlementStatus: body.settlementStatus || null,
    pendingDispatchCount: body.pendingDispatchCount || 0,
    pendingExecutionCount: body.pendingExecutionCount || 0,
    pendingAcceptanceCount: body.pendingAcceptanceCount || 0,
    now,
  })

  const created = db
    .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}

export function getProjectByCode(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { code } = req.params

  const project = db.prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE code = ?`).get(code) as
    | Record<string, unknown>
    | undefined
  if (!project) {
    throw new ApiError('Project not found', 'NOT_FOUND', 404)
  }

  const phases = db
    .prepare(
      'SELECT * FROM project_phases WHERE project_id = (SELECT id FROM projects WHERE code = ?)'
    )
    .all(code)
  const milestones = db
    .prepare(
      'SELECT * FROM project_milestones WHERE project_id = (SELECT id FROM projects WHERE code = ?)'
    )
    .all(code)
  const risks = db
    .prepare(
      'SELECT * FROM project_risks WHERE project_id = (SELECT id FROM projects WHERE code = ?)'
    )
    .all(code)
  const members = db
    .prepare(
      'SELECT * FROM project_members WHERE project_id = (SELECT id FROM projects WHERE code = ?)'
    )
    .all(code)

  res.json({ ...project, phases, milestones, risks, members })
}

export function updateProject(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { code } = req.params

  const existing = db.prepare('SELECT id FROM projects WHERE code = ?').get(code)
  if (!existing) {
    throw new ApiError('Project not found', 'NOT_FOUND', 404)
  }

  const { code: _ignored, ...data } = req.body
  void _ignored
  const setClauses: string[] = []
  const params: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(data)) {
    const col = k.replace(/[A-Z]/g, m => '_' + m.toLowerCase())
    setClauses.push(`${col} = @${k}`)
    params[k] = v
  }

  if (setClauses.length === 0) {
    const existing = db.prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE code = ?`).get(code)
    res.json(existing)
    return
  }

  setClauses.push("updated_at = datetime('now')")
  db.prepare(`UPDATE projects SET ${setClauses.join(', ')} WHERE code = @code`).run({
    ...params,
    code,
  })

  const updated = db.prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE code = ?`).get(code)
  res.json(updated)
}

export function deleteProject(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { code } = req.params

  const result = db.prepare('DELETE FROM projects WHERE code = ?').run(code)
  if (result.changes === 0) {
    throw new ApiError('Project not found', 'NOT_FOUND', 404)
  }

  res.status(204).end()
}
