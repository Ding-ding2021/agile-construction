import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const ORG_COLUMNS = [
  'id',
  'org_code as orgCode',
  'org_name as orgName',
  'org_type as orgType',
  'status',
  'contact_name as contactName',
  'contact_mobile as contactMobile',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

export function getOrganizations(_req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const rows = db.prepare(`SELECT ${ORG_COLUMNS} FROM pm_organization ORDER BY created_at DESC`).all()
  res.json({ data: rows })
}

export function getOrganization(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const row = db.prepare(`SELECT ${ORG_COLUMNS} FROM pm_organization WHERE id = ?`).get(id) as Record<string, unknown> | undefined
  if (!row) throw new ApiError('Organization not found', 'NOT_FOUND', 404)
  res.json(row)
}

export function createOrganization(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body

  const count = db.prepare('SELECT COUNT(*) as c FROM pm_organization').get() as { c: number }
  const orgCode = body.orgCode || `ORG-${String(count.c + 1).padStart(3, '0')}`

  const result = db
    .prepare(`
      INSERT INTO pm_organization (org_code, org_name, org_type, status, contact_name, contact_mobile)
      VALUES (@orgCode, @orgName, @orgType, @status, @contactName, @contactMobile)
    `)
    .run({
      orgCode,
      orgName: body.orgName || '',
      orgType: body.orgType ?? 1,
      status: body.status ?? 1,
      contactName: body.contactName || null,
      contactMobile: body.contactMobile || null,
    })

  const created = db
    .prepare(`SELECT ${ORG_COLUMNS} FROM pm_organization WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}
