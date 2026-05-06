import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const PERSON_COLUMNS = [
  'id',
  'person_code as personCode',
  'name',
  'mobile',
  'email',
  'avatar_url as avatarUrl',
  'org_id as orgId',
  'title',
  'employment_type as employmentType',
  'person_status as personStatus',
  'availability_status as availabilityStatus',
  'work_city as workCity',
  'current_task_count as currentTaskCount',
  'critical_task_count as criticalTaskCount',
  'risk_level as riskLevel',
  'remark',
  'is_deleted as isDeleted',
  'created_by as createdBy',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

export function getPersonnel(_req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const rows = db
    .prepare(`SELECT ${PERSON_COLUMNS} FROM pm_person WHERE is_deleted = 0 ORDER BY created_at DESC`)
    .all()
  res.json({ data: rows })
}

export function getPerson(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const row = db.prepare(`SELECT ${PERSON_COLUMNS} FROM pm_person WHERE id = ?`).get(id) as Record<string, unknown> | undefined
  if (!row) throw new ApiError('Person not found', 'NOT_FOUND', 404)
  res.json(row)
}

export function createPerson(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body
  const now = new Date().toISOString()

  const count = db.prepare('SELECT COUNT(*) as c FROM pm_person').get() as { c: number }
  const personCode = `P-${String(count.c + 1).padStart(4, '0')}`

  const result = db
    .prepare(`
      INSERT INTO pm_person (person_code, name, mobile, email, org_id, title, employment_type,
        person_status, availability_status, work_city, remark, created_by, created_at)
      VALUES (@personCode, @name, @mobile, @email, @orgId, @title, @employmentType,
        @personStatus, @availabilityStatus, @workCity, @remark, @createdBy, @createdAt)
    `)
    .run({
      personCode,
      name: body.name || '',
      mobile: body.mobile || '',
      email: body.email || null,
      orgId: body.orgId || 1,
      title: body.title || null,
      employmentType: body.employmentType ?? 1,
      personStatus: body.personStatus ?? 1,
      availabilityStatus: body.availabilityStatus ?? 1,
      workCity: body.workCity || null,
      remark: body.remark || null,
      createdBy: 'admin',
      createdAt: now,
    })

  const created = db
    .prepare(`SELECT ${PERSON_COLUMNS} FROM pm_person WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}

export function updatePerson(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const body = req.body

  const existing = db.prepare('SELECT id FROM pm_person WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  db.prepare(`
    UPDATE pm_person SET
      name = COALESCE(@name, name),
      mobile = COALESCE(@mobile, mobile),
      email = COALESCE(@email, email),
      org_id = COALESCE(@orgId, org_id),
      title = COALESCE(@title, title),
      employment_type = COALESCE(@employmentType, employment_type),
      person_status = COALESCE(@personStatus, person_status),
      availability_status = COALESCE(@availabilityStatus, availability_status),
      work_city = COALESCE(@workCity, work_city),
      remark = COALESCE(@remark, remark),
      updated_at = @updatedAt
    WHERE id = @id
  `).run({
    id,
    name: body.name ?? null,
    mobile: body.mobile ?? null,
    email: body.email ?? null,
    orgId: body.orgId ?? null,
    title: body.title ?? null,
    employmentType: body.employmentType ?? null,
    personStatus: body.personStatus ?? null,
    availabilityStatus: body.availabilityStatus ?? null,
    workCity: body.workCity ?? null,
    remark: body.remark ?? null,
    updatedAt: new Date().toISOString(),
  })

  const updated = db
    .prepare(`SELECT ${PERSON_COLUMNS} FROM pm_person WHERE id = ?`)
    .get(id)

  res.json(updated)
}

export function deletePerson(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const now = new Date().toISOString()

  const existing = db.prepare('SELECT id FROM pm_person WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  db.prepare('UPDATE pm_person SET is_deleted = 1, deleted_at = ? WHERE id = ?').run(now, id)

  res.json({ success: true })
}
