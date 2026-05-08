import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const CREW_COLUMNS = [
  'id',
  'name',
  'code',
  'leader_name as leaderName',
  'leader_phone as leaderPhone',
  'member_count as memberCount',
  'rating',
  'status',
  'speciality',
  'work_cities as workCities',
  'is_deleted as isDeleted',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

const MEMBER_COLUMNS = [
  'cm.id',
  'cm.crew_id as crewId',
  'cm.person_id as personId',
  'p.name as personName',
  'cm.role',
  'cm.join_date as joinDate',
  'cm.created_at as createdAt',
].join(', ')

const CERT_COLUMNS = [
  'id',
  'crew_id as crewId',
  'cert_type as certType',
  'cert_name as certName',
  'cert_number as certNumber',
  'issue_date as issueDate',
  'expire_date as expireDate',
  'status',
  'file_url as fileUrl',
  'created_at as createdAt',
].join(', ')

export function getCrews(_req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const rows = db
    .prepare(`SELECT ${CREW_COLUMNS} FROM crews WHERE is_deleted = 0 ORDER BY created_at DESC`)
    .all()
  res.json({ data: rows })
}

export function getCrew(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const row = db.prepare(`SELECT ${CREW_COLUMNS} FROM crews WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined
  if (!row) throw new ApiError('Crew not found', 'NOT_FOUND', 404)
  res.json(row)
}

export function createCrew(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body
  const now = new Date().toISOString()

  const count = db.prepare('SELECT COUNT(*) as c FROM crews').get() as { c: number }
  const code = `C-${String(count.c + 1).padStart(4, '0')}`

  const result = db
    .prepare(
      `
      INSERT INTO crews (name, code, leader_name, leader_phone, member_count, rating, status, speciality, work_cities, created_at)
      VALUES (@name, @code, @leaderName, @leaderPhone, @memberCount, @rating, @status, @speciality, @workCities, @createdAt)
    `
    )
    .run({
      name: body.name || '',
      code,
      leaderName: body.leaderName || null,
      leaderPhone: body.leaderPhone || null,
      memberCount: 0,
      rating: body.rating || null,
      status: body.status || 'active',
      speciality: body.speciality || null,
      workCities: body.workCities ? JSON.stringify(body.workCities) : null,
      createdAt: now,
    })

  const created = db
    .prepare(`SELECT ${CREW_COLUMNS} FROM crews WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}

export function updateCrew(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const body = req.body

  const existing = db.prepare('SELECT id FROM crews WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Crew not found', 'NOT_FOUND', 404)

  db.prepare(
    `
    UPDATE crews SET
      name = COALESCE(@name, name),
      leader_name = COALESCE(@leaderName, leader_name),
      leader_phone = COALESCE(@leaderPhone, leader_phone),
      rating = COALESCE(@rating, rating),
      status = COALESCE(@status, status),
      speciality = COALESCE(@speciality, speciality),
      work_cities = COALESCE(@workCities, work_cities),
      updated_at = @updatedAt
    WHERE id = @id
  `
  ).run({
    id,
    name: body.name ?? null,
    leaderName: body.leaderName ?? null,
    leaderPhone: body.leaderPhone ?? null,
    rating: body.rating ?? null,
    status: body.status ?? null,
    speciality: body.speciality ?? null,
    workCities: body.workCities ? JSON.stringify(body.workCities) : null,
    updatedAt: new Date().toISOString(),
  })

  const updated = db.prepare(`SELECT ${CREW_COLUMNS} FROM crews WHERE id = ?`).get(id)

  res.json(updated)
}

export function deleteCrew(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const now = new Date().toISOString()

  const existing = db.prepare('SELECT id FROM crews WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Crew not found', 'NOT_FOUND', 404)

  db.prepare('UPDATE crews SET is_deleted = 1, updated_at = ? WHERE id = ?').run(now, id)

  res.json({ success: true })
}

function recalcMemberCount(db: ReturnType<typeof getDatabase>, crewId: number): void {
  const count = db
    .prepare('SELECT COUNT(*) as c FROM crew_members WHERE crew_id = ?')
    .get(crewId) as { c: number }
  db.prepare('UPDATE crews SET member_count = ?, updated_at = ? WHERE id = ?').run(
    count.c,
    new Date().toISOString(),
    crewId
  )
}

export function getCrewMembers(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const crewId = Number(req.params.id)
  const rows = db
    .prepare(
      `SELECT ${MEMBER_COLUMNS} FROM crew_members cm LEFT JOIN pm_person p ON cm.person_id = p.id WHERE cm.crew_id = ? ORDER BY cm.created_at ASC`
    )
    .all(crewId)
  res.json({ data: rows })
}

export function addCrewMember(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const crewId = Number(req.params.id)
  const body = req.body
  const now = new Date().toISOString()

  const crew = db.prepare('SELECT id FROM crews WHERE id = ? AND is_deleted = 0').get(crewId)
  if (!crew) throw new ApiError('Crew not found', 'NOT_FOUND', 404)

  const person = db
    .prepare('SELECT id FROM pm_person WHERE id = ? AND is_deleted = 0')
    .get(body.personId)
  if (!person) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  const existingMember = db
    .prepare('SELECT id FROM crew_members WHERE crew_id = ? AND person_id = ?')
    .get(crewId, body.personId)
  if (existingMember) throw new ApiError('Member already exists in this crew', 'CONFLICT', 409)

  const result = db
    .prepare(
      `
      INSERT INTO crew_members (crew_id, person_id, role, join_date, created_at)
      VALUES (@crewId, @personId, @role, @joinDate, @createdAt)
    `
    )
    .run({
      crewId,
      personId: body.personId,
      role: body.role || '队员',
      joinDate: body.joinDate || now.slice(0, 10),
      createdAt: now,
    })

  recalcMemberCount(db, crewId)

  const created = db
    .prepare(
      `SELECT ${MEMBER_COLUMNS} FROM crew_members cm LEFT JOIN pm_person p ON cm.person_id = p.id WHERE cm.id = ?`
    )
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}

export function removeCrewMember(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const crewId = Number(req.params.id)
  const memberId = Number(req.params.memberId)

  const existing = db
    .prepare('SELECT id FROM crew_members WHERE id = ? AND crew_id = ?')
    .get(memberId, crewId)
  if (!existing) throw new ApiError('Crew member not found', 'NOT_FOUND', 404)

  db.prepare('DELETE FROM crew_members WHERE id = ?').run(memberId)

  recalcMemberCount(db, crewId)

  res.json({ success: true })
}

export function getCrewCertifications(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const crewId = Number(req.params.id)
  const rows = db
    .prepare(
      `SELECT ${CERT_COLUMNS} FROM crew_certifications WHERE crew_id = ? ORDER BY created_at DESC`
    )
    .all(crewId)
  res.json({ data: rows })
}

export function createCertification(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const crewId = Number(req.params.id)
  const body = req.body
  const now = new Date().toISOString()

  const crew = db.prepare('SELECT id FROM crews WHERE id = ? AND is_deleted = 0').get(crewId)
  if (!crew) throw new ApiError('Crew not found', 'NOT_FOUND', 404)

  const result = db
    .prepare(
      `
      INSERT INTO crew_certifications (crew_id, cert_type, cert_name, cert_number, issue_date, expire_date, status, file_url, created_at)
      VALUES (@crewId, @certType, @certName, @certNumber, @issueDate, @expireDate, @status, @fileUrl, @createdAt)
    `
    )
    .run({
      crewId,
      certType: body.certType || '',
      certName: body.certName || '',
      certNumber: body.certNumber || null,
      issueDate: body.issueDate || null,
      expireDate: body.expireDate || null,
      status: body.status || 'valid',
      fileUrl: body.fileUrl || null,
      createdAt: now,
    })

  const created = db
    .prepare(`SELECT ${CERT_COLUMNS} FROM crew_certifications WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}

export function updateCertification(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.certId)
  const body = req.body

  const existing = db.prepare('SELECT id FROM crew_certifications WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Certification not found', 'NOT_FOUND', 404)

  db.prepare(
    `
    UPDATE crew_certifications SET
      cert_type = COALESCE(@certType, cert_type),
      cert_name = COALESCE(@certName, cert_name),
      cert_number = COALESCE(@certNumber, cert_number),
      issue_date = COALESCE(@issueDate, issue_date),
      expire_date = COALESCE(@expireDate, expire_date),
      status = COALESCE(@status, status),
      file_url = COALESCE(@fileUrl, file_url)
    WHERE id = @id
  `
  ).run({
    id,
    certType: body.certType ?? null,
    certName: body.certName ?? null,
    certNumber: body.certNumber ?? null,
    issueDate: body.issueDate ?? null,
    expireDate: body.expireDate ?? null,
    status: body.status ?? null,
    fileUrl: body.fileUrl ?? null,
  })

  const updated = db.prepare(`SELECT ${CERT_COLUMNS} FROM crew_certifications WHERE id = ?`).get(id)

  res.json(updated)
}

export function deleteCertification(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.certId)

  const existing = db.prepare('SELECT id FROM crew_certifications WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Certification not found', 'NOT_FOUND', 404)

  db.prepare('DELETE FROM crew_certifications WHERE id = ?').run(id)

  res.json({ success: true })
}
