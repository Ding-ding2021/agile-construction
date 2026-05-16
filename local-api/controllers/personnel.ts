import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'
import {
  changePersonStatus,
  getAvailabilityForStatus,
  getPersonStatusLogs as getStatusLogs,
} from '../services/personnelStatusService'

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

const PERSON_COLUMNS_ALIASED = PERSON_COLUMNS.split(', ')
  .map(c => `p.${c}`)
  .join(', ')

export function getPersonnel(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { status, orgId, roleId, teamId } = req.query as Record<string, string | undefined>
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 50))
  const offset = (page - 1) * pageSize

  let countSql: string
  let dataSql: string
  let countParams: unknown[]
  let dataParams: unknown[]

  if (roleId) {
    countSql = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM pm_person p
      INNER JOIN pm_person_role_rel pr ON p.id = pr.person_id
      WHERE p.is_deleted = 0
    `
    dataSql = `
      SELECT DISTINCT ${PERSON_COLUMNS_ALIASED}
      FROM pm_person p
      INNER JOIN pm_person_role_rel pr ON p.id = pr.person_id
      WHERE p.is_deleted = 0
    `
    countParams = []
    dataParams = []

    if (status) {
      countSql += ' AND p.person_status = ?'
      dataSql += ' AND p.person_status = ?'
      countParams.push(Number(status))
      dataParams.push(Number(status))
    }
    if (orgId) {
      countSql += ' AND p.org_id = ?'
      dataSql += ' AND p.org_id = ?'
      countParams.push(Number(orgId))
      dataParams.push(Number(orgId))
    }
    if (teamId) {
      countSql += ' AND p.team_id = ?'
      dataSql += ' AND p.team_id = ?'
      countParams.push(Number(teamId))
      dataParams.push(Number(teamId))
    }
    countSql += ' AND pr.role_id = ?'
    dataSql += ' AND pr.role_id = ?'
    countParams.push(Number(roleId))
    dataParams.push(Number(roleId))
    dataSql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    dataParams.push(pageSize, offset)
  } else if (teamId) {
    countSql = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM pm_person p
      INNER JOIN pm_team_member_rel tmr ON p.id = tmr.person_id
      WHERE p.is_deleted = 0 AND tmr.team_id = ?
    `
    dataSql = `
      SELECT DISTINCT ${PERSON_COLUMNS_ALIASED}
      FROM pm_person p
      INNER JOIN pm_team_member_rel tmr ON p.id = tmr.person_id
      WHERE p.is_deleted = 0 AND tmr.team_id = ?
    `
    countParams = [Number(teamId)]
    dataParams = [Number(teamId)]

    if (status) {
      countSql += ' AND p.person_status = ?'
      dataSql += ' AND p.person_status = ?'
      countParams.push(Number(status))
      dataParams.push(Number(status))
    }
    if (orgId) {
      countSql += ' AND p.org_id = ?'
      dataSql += ' AND p.org_id = ?'
      countParams.push(Number(orgId))
      dataParams.push(Number(orgId))
    }
    dataSql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    dataParams.push(pageSize, offset)
  } else {
    countSql = 'SELECT COUNT(*) as total FROM pm_person WHERE is_deleted = 0'
    dataSql = `SELECT ${PERSON_COLUMNS} FROM pm_person WHERE is_deleted = 0`
    countParams = []
    dataParams = []

    if (status) {
      countSql += ' AND person_status = ?'
      dataSql += ' AND person_status = ?'
      countParams.push(Number(status))
      dataParams.push(Number(status))
    }
    if (orgId) {
      countSql += ' AND org_id = ?'
      dataSql += ' AND org_id = ?'
      countParams.push(Number(orgId))
      dataParams.push(Number(orgId))
    }
    dataSql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    dataParams.push(pageSize, offset)
  }

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

export function getPerson(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const row = db.prepare(`SELECT ${PERSON_COLUMNS} FROM pm_person WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined
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
    .prepare(
      `
      INSERT INTO pm_person (person_code, name, mobile, email, org_id, title, employment_type,
        person_status, availability_status, work_city, remark, created_by, created_at)
      VALUES (@personCode, @name, @mobile, @email, @orgId, @title, @employmentType,
        @personStatus, @availabilityStatus, @workCity, @remark, @createdBy, @createdAt)
    `
    )
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

  const existing = db
    .prepare('SELECT id, person_status, availability_status FROM pm_person WHERE id = ?')
    .get(id) as Record<string, unknown> | undefined
  if (!existing) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  let skipStatusFields = false

  if (
    body.personStatus !== undefined &&
    Number(body.personStatus) !== (existing.person_status as number)
  ) {
    const newStatus = Number(body.personStatus)
    const newAvailability = getAvailabilityForStatus(newStatus)

    changePersonStatus(db, {
      personId: id,
      beforeStatus: existing.person_status as number,
      afterStatus: newStatus,
      beforeAvailability: existing.availability_status as number,
      afterAvailability: newAvailability,
      reason: body.statusChangeReason || null,
      operatorId: body.operatorId || 'system',
    })

    skipStatusFields = true
  }

  const setClauses: string[] = []
  const params: Record<string, unknown> = { id, updatedAt: new Date().toISOString() }

  const fieldMapping: Record<string, string> = {
    name: 'name',
    mobile: 'mobile',
    email: 'email',
    orgId: 'org_id',
    title: 'title',
    employmentType: 'employment_type',
    workCity: 'work_city',
    remark: 'remark',
  }

  for (const [key, col] of Object.entries(fieldMapping)) {
    if (body[key] !== undefined) {
      setClauses.push(`${col} = @${key}`)
      params[key] = body[key]
    }
  }

  if (skipStatusFields) {
    setClauses.push('person_status = person_status')
    setClauses.push('availability_status = availability_status')
  } else {
    if (body.personStatus !== undefined) {
      setClauses.push('person_status = @personStatus')
      params.personStatus = Number(body.personStatus)
    }
    if (body.availabilityStatus !== undefined) {
      setClauses.push('availability_status = @availabilityStatus')
      params.availabilityStatus = Number(body.availabilityStatus)
    }
  }

  if (setClauses.length > 0) {
    setClauses.push('updated_at = @updatedAt')
    db.prepare(`UPDATE pm_person SET ${setClauses.join(', ')} WHERE id = @id`).run(params)
  }

  const updated = db.prepare(`SELECT ${PERSON_COLUMNS} FROM pm_person WHERE id = ?`).get(id)

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

export function updatePersonStatus(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const { personStatus, reason, operatorId } = req.body as {
    personStatus: number
    reason: string | null
    operatorId: string
  }

  const existing = db
    .prepare('SELECT id, person_status, availability_status FROM pm_person WHERE id = ?')
    .get(id) as Record<string, unknown> | undefined
  if (!existing) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  const currentStatus = existing.person_status as number
  const currentAvailability = existing.availability_status as number

  if (currentStatus !== personStatus) {
    const newAvailability = getAvailabilityForStatus(personStatus)

    changePersonStatus(db, {
      personId: id,
      beforeStatus: currentStatus,
      afterStatus: personStatus,
      beforeAvailability: currentAvailability,
      afterAvailability: newAvailability,
      reason: reason || null,
      operatorId: operatorId || 'system',
    })
  }

  const updated = db.prepare(`SELECT ${PERSON_COLUMNS} FROM pm_person WHERE id = ?`).get(id)

  res.json(updated)
}

export function getPersonStatusLogs(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT id FROM pm_person WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  const rows = getStatusLogs(db, id)
  res.json({ data: rows })
}

export function getPersonRoles(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT id FROM pm_person WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  const rows = db
    .prepare(
      `
      SELECT
        pr.id,
        pr.role_id as roleId,
        r.role_code as roleCode,
        r.role_name as roleName,
        r.role_scope as roleScope,
        pr.is_primary as isPrimary,
        pr.created_at as createdAt
      FROM pm_person_role_rel pr
      LEFT JOIN pm_role r ON pr.role_id = r.id
      WHERE pr.person_id = ?
      ORDER BY pr.is_primary DESC, pr.created_at ASC
    `
    )
    .all(id)

  res.json({ data: rows })
}

export function getPersonTeams(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT id FROM pm_person WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  const rows = db
    .prepare(
      `
      SELECT
        tm.id,
        tm.team_id as teamId,
        t.team_code as teamCode,
        t.team_name as teamName,
        t.org_id as orgId,
        tm.role_in_team as roleInTeam,
        tm.created_at as createdAt
      FROM pm_team_member_rel tm
      LEFT JOIN pm_team t ON tm.team_id = t.id
      WHERE tm.person_id = ?
      ORDER BY tm.created_at ASC
    `
    )
    .all(id)

  res.json({ data: rows })
}
