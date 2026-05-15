import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'
import { aggregateProjectStatus } from '../services/projectAggregator'

const PROJECT_COLUMNS = [
  'id',
  'code',
  'name',
  'brand',
  'parent_status as parentStatus',
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
  'health_status as healthStatus',
  'pending_dispatch_count as pendingDispatchCount',
  'pending_execution_count as pendingExecutionCount',
  'pending_acceptance_count as pendingAcceptanceCount',
  'pending_settlement_count as pendingSettlementCount',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

export function triggerProjectAggregation(projectId: number): void {
  try {
    const aggregation = aggregateProjectStatus(projectId)
    const db = getDatabase()
    db.prepare(
      `
      UPDATE projects SET
        parent_status = @parentStatus,
        execution_status = @executionStatus,
        acceptance_status = @acceptanceStatus,
        settlement_status = @settlementStatus,
        dispatch_status = @dispatchStatus,
        health_status = @healthStatus,
        progress = @progress,
        pending_dispatch_count = @pendingDispatch,
        pending_execution_count = @pendingExecution,
        pending_acceptance_count = @pendingAcceptance,
        pending_settlement_count = @pendingSettlement,
        updated_at = datetime('now')
      WHERE id = @projectId
    `
    ).run({
      projectId,
      parentStatus: aggregation.parentStatus,
      executionStatus: aggregation.executionStatus,
      acceptanceStatus: aggregation.acceptanceStatus,
      settlementStatus: aggregation.settlementStatus,
      dispatchStatus: aggregation.dispatchStatus,
      healthStatus: aggregation.health.status,
      progress: aggregation.progress,
      pendingDispatch: aggregation.pendingCounts.dispatch,
      pendingExecution: aggregation.pendingCounts.execution,
      pendingAcceptance: aggregation.pendingCounts.acceptance,
      pendingSettlement: aggregation.pendingCounts.settlement,
    })
  } catch (err) {
    console.error(`[Aggregator] 项目 ${projectId} 聚合失败:`, err)
  }
}

export function getProjects(_req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const rows = db.prepare(`SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY created_at DESC`).all()
  res.json(rows)
}

export function createProject(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body
  const now = new Date().toISOString()

  const result = db
    .prepare(
      `
    INSERT INTO projects (
      code, name, brand, parent_status, stage, progress,
      budget, team_size, date_range, description, owner,
      risk_level, risk_count, milestone, tasks, template_id,
      planned_open_date, actual_open_date,
      dispatch_status, execution_status, acceptance_status, settlement_status, health_status,
      pending_dispatch_count, pending_execution_count, pending_acceptance_count, pending_settlement_count,
      created_at, updated_at
    ) VALUES (
      @code, @name, @brand, @parentStatus, @stage, @progress,
      @budget, @teamSize, @dateRange, @description, @owner,
      @riskLevel, @riskCount, @milestone, @tasks, @templateId,
      @plannedOpenDate, @actualOpenDate,
      @dispatchStatus, @executionStatus, @acceptanceStatus, @settlementStatus, @healthStatus,
      @pendingDispatchCount, @pendingExecutionCount, @pendingAcceptanceCount, @pendingSettlementCount,
      @now, @now
    )
  `
    )
    .run({
      code: body.code,
      name: body.name || '',
      brand: body.brand || '',
      parentStatus: '启动',
      stage: body.stage || '启动',
      progress: 0,
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
      dispatchStatus: '未派单',
      executionStatus: '未开始',
      acceptanceStatus: '待验收',
      settlementStatus: '未结算',
      healthStatus: '正常',
      pendingDispatchCount: 0,
      pendingExecutionCount: 0,
      pendingAcceptanceCount: 0,
      pendingSettlementCount: 0,
      now,
    })

  const projectId = Number(result.lastInsertRowid)
  triggerProjectAggregation(projectId)

  const created = db.prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = ?`).get(projectId)

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

  const existing = db.prepare('SELECT id FROM projects WHERE code = ?').get(code) as
    | { id: number }
    | undefined
  if (!existing) {
    throw new ApiError('Project not found', 'NOT_FOUND', 404)
  }

  const { code: _ignored, ...data } = req.body
  void _ignored

  if ('status' in req.body) {
    throw new ApiError(
      'status 字段已废弃，不允许手动设置。项目状态已由系统自动聚合',
      'DEPRECATED_FIELD',
      400
    )
  }

  const setClauses: string[] = []
  const params: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(data)) {
    const col = k.replace(/[A-Z]/g, m => '_' + m.toLowerCase())
    setClauses.push(`${col} = @${k}`)
    params[k] = v
  }

  if (setClauses.length === 0) {
    triggerProjectAggregation(existing.id)
    const updated = db.prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE code = ?`).get(code)
    res.json(updated)
    return
  }

  setClauses.push("updated_at = datetime('now')")
  db.prepare(`UPDATE projects SET ${setClauses.join(', ')} WHERE code = @code`).run({
    ...params,
    code,
  })

  triggerProjectAggregation(existing.id)

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

export function getProjectHealth(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { code } = req.params

  const project = db.prepare('SELECT id, code FROM projects WHERE code = ?').get(code) as
    | { id: number; code: string }
    | undefined
  if (!project) {
    throw new ApiError('Project not found', 'NOT_FOUND', 404)
  }

  const aggregation = aggregateProjectStatus(project.id)
  res.json({
    projectCode: project.code,
    health: aggregation.health,
    executionStatus: aggregation.executionStatus,
    acceptanceStatus: aggregation.acceptanceStatus,
    settlementStatus: aggregation.settlementStatus,
    dispatchStatus: aggregation.dispatchStatus,
    parentStatus: aggregation.parentStatus,
    progress: aggregation.progress,
    pendingCounts: aggregation.pendingCounts,
  })
}

export function reaggregateProject(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { code } = req.params

  const project = db.prepare('SELECT id, code FROM projects WHERE code = ?').get(code) as
    | { id: number; code: string }
    | undefined
  if (!project) {
    throw new ApiError('Project not found', 'NOT_FOUND', 404)
  }

  triggerProjectAggregation(project.id)

  const updated = db.prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE code = ?`).get(code)
  res.json(updated)
}
