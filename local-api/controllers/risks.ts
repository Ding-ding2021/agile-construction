import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const COLUMNS =
  'id, project_id as projectId, description, level, probability, impact, mitigation, status, assignee, due_date as dueDate'

function getProjectId(projectCode: string): number {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) throw new ApiError('Project not found', 'NOT_FOUND', 404)
  return project.id
}

export function getRisks(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const rows = db
    .prepare(`SELECT ${COLUMNS} FROM project_risks WHERE project_id = ?`)
    .all(projectId)
  res.json(rows)
}

export function createRisk(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const body = req.body

  const result = db
    .prepare(
      'INSERT INTO project_risks (project_id, description, level, probability, impact, mitigation, status, assignee, due_date) VALUES (@pid, @description, @level, @probability, @impact, @mitigation, @status, @assignee, @dueDate)'
    )
    .run({
      pid: projectId,
      description: body.description || '',
      level: body.level || 'low',
      probability: body.probability || null,
      impact: body.impact || null,
      mitigation: body.mitigation || null,
      status: body.status || 'active',
      assignee: body.assignee || null,
      dueDate: body.dueDate || null,
    })

  const created = db
    .prepare(`SELECT ${COLUMNS} FROM project_risks WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}
