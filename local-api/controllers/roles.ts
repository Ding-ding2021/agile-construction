import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const ROLE_COLUMNS = [
  'id',
  'role_code as roleCode',
  'role_name as roleName',
  'role_scope as roleScope',
  'description',
  'status',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

export function getRoles(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const status = req.query.status as string | undefined
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 50))
  const offset = (page - 1) * pageSize

  let countSql = 'SELECT COUNT(*) as total FROM pm_role WHERE 1=1'
  let dataSql = `SELECT ${ROLE_COLUMNS} FROM pm_role WHERE 1=1`
  const countParams: unknown[] = []
  const dataParams: unknown[] = []

  if (status) {
    countSql += ' AND status = ?'
    dataSql += ' AND status = ?'
    countParams.push(Number(status))
    dataParams.push(Number(status))
  }

  dataSql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  dataParams.push(pageSize, offset)

  const countRow = db.prepare(countSql).get(...countParams) as { total: number }
  const rows = db.prepare(dataSql).all(...dataParams)

  res.json({
    data: rows,
    pagination: {
      page,
      pageSize,
      total: countRow.total,
      totalPages: Math.ceil(countRow.total / pageSize),
    },
  })
}

export function getRole(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)

  const role = db.prepare(`SELECT ${ROLE_COLUMNS} FROM pm_role WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined
  if (!role) throw new ApiError('Role not found', 'NOT_FOUND', 404)

  const count = db
    .prepare('SELECT COUNT(*) as c FROM pm_person_role_rel WHERE role_id = ?')
    .get(id) as { c: number }

  res.json({ ...role, relatedPersonCount: count.c })
}

export function createRole(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body
  const now = new Date().toISOString()

  const count = db.prepare('SELECT COUNT(*) as c FROM pm_role').get() as { c: number }
  const roleCode = `R-${String(count.c + 1).padStart(4, '0')}`

  const result = db
    .prepare(
      `
      INSERT INTO pm_role (role_code, role_name, role_scope, description, status, created_at, updated_at)
      VALUES (@roleCode, @roleName, @roleScope, @description, @status, @createdAt, @updatedAt)
    `
    )
    .run({
      roleCode,
      roleName: body.roleName || '',
      roleScope: body.roleScope ?? 1,
      description: body.description || null,
      status: body.status ?? 1,
      createdAt: now,
      updatedAt: now,
    })

  const created = db
    .prepare(`SELECT ${ROLE_COLUMNS} FROM pm_role WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}

export function updateRole(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const body = req.body

  const existing = db.prepare('SELECT id FROM pm_role WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Role not found', 'NOT_FOUND', 404)

  db.prepare(
    `
    UPDATE pm_role SET
      role_name = COALESCE(@roleName, role_name),
      role_scope = COALESCE(@roleScope, role_scope),
      description = COALESCE(@description, description),
      status = COALESCE(@status, status),
      updated_at = @updatedAt
    WHERE id = @id
  `
  ).run({
    id,
    roleName: body.roleName ?? null,
    roleScope: body.roleScope ?? null,
    description: body.description ?? null,
    status: body.status ?? null,
    updatedAt: new Date().toISOString(),
  })

  const updated = db.prepare(`SELECT ${ROLE_COLUMNS} FROM pm_role WHERE id = ?`).get(id)

  res.json(updated)
}

export function deleteRole(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT id FROM pm_role WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Role not found', 'NOT_FOUND', 404)

  db.prepare('UPDATE pm_role SET status = 2, updated_at = ? WHERE id = ?').run(
    new Date().toISOString(),
    id
  )

  res.json({ success: true })
}

export function bindPersonToRole(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const roleId = Number(req.params.id)
  const { personId, isPrimary } = req.body

  const role = db.prepare('SELECT id FROM pm_role WHERE id = ?').get(roleId)
  if (!role) throw new ApiError('Role not found', 'NOT_FOUND', 404)

  const person = db.prepare('SELECT id FROM pm_person WHERE id = ?').get(personId)
  if (!person) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  const existing = db
    .prepare('SELECT id FROM pm_person_role_rel WHERE person_id = ? AND role_id = ?')
    .get(personId, roleId)
  if (existing) throw new ApiError('Relation already exists', 'CONFLICT', 409)

  const result = db
    .prepare(
      'INSERT INTO pm_person_role_rel (person_id, role_id, is_primary, created_at) VALUES (?, ?, ?, ?)'
    )
    .run(personId, roleId, isPrimary ? 1 : 0, new Date().toISOString())

  res.status(201).json({ id: result.lastInsertRowid, personId, roleId, isPrimary: !!isPrimary })
}

export function unbindPersonFromRole(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const roleId = Number(req.params.id)
  const personId = Number(req.params.personId)

  const existing = db
    .prepare('SELECT id FROM pm_person_role_rel WHERE person_id = ? AND role_id = ?')
    .get(personId, roleId)
  if (!existing) throw new ApiError('Relation not found', 'NOT_FOUND', 404)

  db.prepare('DELETE FROM pm_person_role_rel WHERE person_id = ? AND role_id = ?').run(
    personId,
    roleId
  )

  res.json({ success: true })
}
