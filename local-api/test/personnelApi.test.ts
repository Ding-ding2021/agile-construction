import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import app from '../app'
import { initDatabase, closeDatabase } from '../store/sqlite'
import { seedOrg, seedPerson, cleanPersonnelData } from './helpers'
import type { Database as DatabaseType } from 'better-sqlite3'

let db: DatabaseType

beforeEach(() => {
  process.env.TEST_DATABASE = 'true'
  db = initDatabase()
  cleanPersonnelData(db)
  seedOrg(db, 1)
})

afterAll(() => {
  closeDatabase()
})

describe('POST /api/personnel/:id/status', () => {
  it('状态变更成功', async () => {
    seedPerson(db, 500, 1, 1)

    const res = await request(app)
      .post('/api/personnel/500/status')
      .send({ personStatus: 2, reason: '请假', operatorId: 'admin' })

    expect(res.status).toBe(200)
    expect(res.body.personStatus).toBe(2)
    expect(res.body.availabilityStatus).toBe(3)

    const p = db
      .prepare('SELECT person_status, availability_status FROM pm_person WHERE id = ?')
      .get(500) as { person_status: number; availability_status: number }
    expect(p.person_status).toBe(2)
    expect(p.availability_status).toBe(3)
  })

  it('不存在的人员返回 404', async () => {
    const res = await request(app)
      .post('/api/personnel/99999/status')
      .send({ personStatus: 2, reason: '请假', operatorId: 'admin' })

    expect(res.status).toBe(404)
  })
})

describe('GET /api/personnel', () => {
  it('按角色筛选 — roleId', async () => {
    seedPerson(db, 600, 1, 1)
    seedPerson(db, 601, 1, 1)

    db.prepare(
      "INSERT INTO pm_role (id, role_code, role_name, status, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).run(10, 'PM', '项目经理', 1)

    db.prepare(
      "INSERT INTO pm_person_role_rel (person_id, role_id, is_primary, created_at) VALUES (?, ?, 1, datetime('now'))"
    ).run(600, 10)

    const res = await request(app).get('/api/personnel?roleId=10')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBe(1)
    expect(res.body.data[0].id).toBe(600)
  })

  it('按团队筛选 — teamId', async () => {
    seedPerson(db, 700, 1, 1)
    seedPerson(db, 701, 1, 1)

    db.prepare(
      "INSERT INTO pm_team (id, org_id, team_code, team_name, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).run(20, 1, 'T1', '施工一队', 1)

    db.prepare(
      "INSERT INTO pm_team_member_rel (team_id, person_id, role_in_team, created_at) VALUES (?, ?, ?, datetime('now'))"
    ).run(20, 700, '队长')

    const res = await request(app).get('/api/personnel?teamId=20')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBe(1)
    expect(res.body.data[0].id).toBe(700)
  })
})
