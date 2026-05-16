import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const TEAM_COLUMNS = [
  't.id',
  't.org_id as orgId',
  't.team_code as teamCode',
  't.team_name as teamName',
  't.team_leader_id as teamLeaderId',
  't.service_scope as serviceScope',
  't.status',
  't.created_at as createdAt',
  't.updated_at as updatedAt',
].join(', ')

export function getTeams(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const orgId = req.query.orgId as string | undefined
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 50))
  const offset = (page - 1) * pageSize

  let countSql = 'SELECT COUNT(*) as total FROM pm_team t WHERE 1=1'
  let dataSql = `SELECT ${TEAM_COLUMNS} FROM pm_team t WHERE 1=1`
  const countParams: unknown[] = []
  const dataParams: unknown[] = []

  if (orgId) {
    countSql += ' AND t.org_id = ?'
    dataSql += ' AND t.org_id = ?'
    countParams.push(Number(orgId))
    dataParams.push(Number(orgId))
  }

  dataSql += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?'
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

export function getTeam(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)

  const team = db.prepare(`SELECT ${TEAM_COLUMNS} FROM pm_team t WHERE t.id = ?`).get(id) as
    | Record<string, unknown>
    | undefined
  if (!team) throw new ApiError('Team not found', 'NOT_FOUND', 404)

  const members = db
    .prepare(
      `
      SELECT
        r.id as relId,
        r.role_in_team as roleInTeam,
        r.created_at as joinedAt,
        p.id as personId,
        p.person_code as personCode,
        p.name as personName,
        p.title,
        p.mobile
      FROM pm_team_member_rel r
      JOIN pm_person p ON p.id = r.person_id
      WHERE r.team_id = ?
      ORDER BY r.created_at ASC
    `
    )
    .all(id)

  res.json({ ...team, members })
}

export function createTeam(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body
  const now = new Date().toISOString()

  const orgId = body.orgId || 1
  const count = db.prepare('SELECT COUNT(*) as c FROM pm_team WHERE org_id = ?').get(orgId) as {
    c: number
  }
  const teamCode = `T-${String(count.c + 1).padStart(4, '0')}`

  const result = db
    .prepare(
      `
      INSERT INTO pm_team (org_id, team_code, team_name, team_leader_id, service_scope, status, created_at, updated_at)
      VALUES (@orgId, @teamCode, @teamName, @teamLeaderId, @serviceScope, @status, @createdAt, @updatedAt)
    `
    )
    .run({
      orgId,
      teamCode,
      teamName: body.teamName || '',
      teamLeaderId: body.teamLeaderId || null,
      serviceScope: body.serviceScope || null,
      status: body.status ?? 1,
      createdAt: now,
      updatedAt: now,
    })

  const created = db
    .prepare(`SELECT ${TEAM_COLUMNS} FROM pm_team t WHERE t.id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}

export function updateTeam(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const body = req.body

  const existing = db.prepare('SELECT id FROM pm_team WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Team not found', 'NOT_FOUND', 404)

  db.prepare(
    `
    UPDATE pm_team SET
      team_name = COALESCE(@teamName, team_name),
      team_leader_id = COALESCE(@teamLeaderId, team_leader_id),
      service_scope = COALESCE(@serviceScope, service_scope),
      status = COALESCE(@status, status),
      updated_at = @updatedAt
    WHERE id = @id
  `
  ).run({
    id,
    teamName: body.teamName ?? null,
    teamLeaderId: body.teamLeaderId ?? null,
    serviceScope: body.serviceScope ?? null,
    status: body.status ?? null,
    updatedAt: new Date().toISOString(),
  })

  const updated = db.prepare(`SELECT ${TEAM_COLUMNS} FROM pm_team t WHERE t.id = ?`).get(id)

  res.json(updated)
}

export function deleteTeam(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT id FROM pm_team WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Team not found', 'NOT_FOUND', 404)

  db.prepare('UPDATE pm_team SET status = 2, updated_at = ? WHERE id = ?').run(
    new Date().toISOString(),
    id
  )

  res.json({ success: true })
}

export function addTeamMember(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const teamId = Number(req.params.id)
  const { personId, roleInTeam } = req.body

  const team = db.prepare('SELECT id FROM pm_team WHERE id = ?').get(teamId)
  if (!team) throw new ApiError('Team not found', 'NOT_FOUND', 404)

  const person = db.prepare('SELECT id FROM pm_person WHERE id = ?').get(personId)
  if (!person) throw new ApiError('Person not found', 'NOT_FOUND', 404)

  const existing = db
    .prepare('SELECT id FROM pm_team_member_rel WHERE team_id = ? AND person_id = ?')
    .get(teamId, personId)
  if (existing) throw new ApiError('Member already exists in team', 'CONFLICT', 409)

  const result = db
    .prepare(
      'INSERT INTO pm_team_member_rel (team_id, person_id, role_in_team, created_at) VALUES (?, ?, ?, ?)'
    )
    .run(teamId, personId, roleInTeam || null, new Date().toISOString())

  res
    .status(201)
    .json({ id: result.lastInsertRowid, teamId, personId, roleInTeam: roleInTeam || null })
}

export function removeTeamMember(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const teamId = Number(req.params.id)
  const personId = Number(req.params.personId)

  const existing = db
    .prepare('SELECT id FROM pm_team_member_rel WHERE team_id = ? AND person_id = ?')
    .get(teamId, personId)
  if (!existing) throw new ApiError('Member relation not found', 'NOT_FOUND', 404)

  db.prepare('DELETE FROM pm_team_member_rel WHERE team_id = ? AND person_id = ?').run(
    teamId,
    personId
  )

  res.json({ success: true })
}
