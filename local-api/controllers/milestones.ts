import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const COLUMNS =
  'id, project_id as projectId, name, due_date as dueDate, status, assignee, completed_date as completedDate'

function getProjectId(projectCode: string): number {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) throw new ApiError('Project not found', 'NOT_FOUND', 404)
  return project.id
}

export function getMilestones(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const rows = db
    .prepare(`SELECT ${COLUMNS} FROM project_milestones WHERE project_id = ? ORDER BY due_date ASC`)
    .all(projectId)
  res.json(rows)
}

export function createMilestone(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const body = req.body

  const result = db
    .prepare(
      'INSERT INTO project_milestones (project_id, name, due_date, status, assignee, completed_date) VALUES (@pid, @name, @dueDate, @status, @assignee, @completedDate)'
    )
    .run({
      pid: projectId,
      name: body.name || '',
      dueDate: body.dueDate || '',
      status: body.status || 'pending',
      assignee: body.assignee || null,
      completedDate: body.completedDate || null,
    })

  const created = db
    .prepare(`SELECT ${COLUMNS} FROM project_milestones WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}
