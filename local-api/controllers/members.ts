import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const COLUMNS =
  'id, project_id as projectId, user_id as userId, name, role, avatar, department, phone, email'

function getProjectId(projectCode: string): number {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) throw new ApiError('Project not found', 'NOT_FOUND', 404)
  return project.id
}

export function getMembers(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const rows = db
    .prepare(`SELECT ${COLUMNS} FROM project_members WHERE project_id = ?`)
    .all(projectId)
  res.json(rows)
}

export function createMember(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const body = req.body

  const result = db
    .prepare(
      'INSERT INTO project_members (project_id, user_id, name, role, avatar, department, phone, email) VALUES (@pid, @userId, @name, @role, @avatar, @department, @phone, @email)'
    )
    .run({
      pid: projectId,
      userId: body.userId || '',
      name: body.name || '',
      role: body.role || '',
      avatar: body.avatar || null,
      department: body.department || null,
      phone: body.phone || null,
      email: body.email || null,
    })

  const created = db
    .prepare(`SELECT ${COLUMNS} FROM project_members WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}
