import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'

export function getAuditLogs(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const envId = (req.query.envId as string) || 'default'

  const rows = db
    .prepare('SELECT * FROM audit_logs WHERE env_id = ? ORDER BY created_at DESC LIMIT 100')
    .all(envId)

  res.json(rows)
}

export function createAuditLog(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const envId = (req.query.envId as string) || 'default'
  const payload = req.body

  db.prepare(
    'INSERT INTO audit_logs (env_id, scene, detail, project_code, at) VALUES (?, ?, ?, ?, ?)'
  ).run(envId, payload.scene, payload.detail, payload.projectCode || null, payload.at)

  res.status(204).end()
}
