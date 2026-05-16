import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { initDatabase, closeDatabase } from '../store/sqlite'
import { canAssign, unassign, reassign } from '../services/personnelAssignmentService'
import { seedOrg, seedPerson, seedProject, seedTask, cleanPersonnelData } from './helpers'
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

describe('canAssign', () => {
  it('在岗且可分配、角色匹配、负载低 → 允许分配', () => {
    seedPerson(db, 100, 1, 1, '施工员')
    seedProject(db, 100)
    seedTask(db, 100, 100, '施工员')

    const result = canAssign(db, 100, 100)
    expect(result.ok).toBe(true)
    expect(result.reasons).toHaveLength(0)
  })

  it('人员不在岗 → 拒绝', () => {
    seedPerson(db, 101, 2, 1)
    seedProject(db, 101)
    seedTask(db, 101, 101)

    const result = canAssign(db, 101, 101)
    expect(result.ok).toBe(false)
    expect(result.reasons).toContain('人员当前不在岗')
  })

  it('人员不可分配 → 拒绝', () => {
    seedPerson(db, 102, 1, 3)
    seedProject(db, 102)
    seedTask(db, 102, 102)

    const result = canAssign(db, 102, 102)
    expect(result.ok).toBe(false)
    expect(result.reasons).toContain('人员当前不可分配')
  })

  it('人员角色与任务 owner_role 不匹配 → 拒绝', () => {
    seedPerson(db, 103, 1, 1, '项目经理')
    seedProject(db, 103)
    seedTask(db, 103, 103, '施工员')

    const result = canAssign(db, 103, 103)
    expect(result.ok).toBe(false)
    expect(result.reasons.some((r: string) => r.includes('角色不匹配'))).toBe(true)
  })

  it('人员当前负载 ≥ 5 个任务 → 拒绝', () => {
    seedPerson(db, 104, 1, 1)
    seedProject(db, 104)

    for (let i = 1; i <= 5; i++) {
      db.prepare(
        `INSERT INTO pm_assignment_rel (relation_code, source_type, source_id, person_id, relation_role, status, created_at, updated_at)
         VALUES (?, 2, ?, ?, 1, 1, datetime('now'), datetime('now'))`
      ).run(`ASN-104-${i}`, 1000 + i, 104)
    }

    seedTask(db, 104, 104)
    const result = canAssign(db, 104, 104)
    expect(result.ok).toBe(false)
    expect(result.reasons.some((r: string) => r.includes('负载'))).toBe(true)
  })

  it('任务不存在 → 拒绝', () => {
    seedPerson(db, 105, 1, 1)
    const result = canAssign(db, 105, 99999)
    expect(result.ok).toBe(false)
    expect(result.reasons).toContain('任务不存在')
  })

  it('人员不存在 → 拒绝', () => {
    seedProject(db, 105)
    seedTask(db, 105, 105)
    const result = canAssign(db, 99999, 105)
    expect(result.ok).toBe(false)
    expect(result.reasons).toContain('人员不存在')
  })

  it('通过 pm_person_role_rel 角色关联匹配 → 允许分配', () => {
    seedPerson(db, 106, 1, 1, null)
    seedProject(db, 106)
    seedTask(db, 106, 106, '质检员')

    db.prepare(
      "INSERT INTO pm_role (id, role_code, role_name, status, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).run(1, 'QC', '质检员', 1)

    db.prepare(
      "INSERT INTO pm_person_role_rel (person_id, role_id, is_primary, created_at) VALUES (?, ?, 1, datetime('now'))"
    ).run(106, 1)

    const result = canAssign(db, 106, 106)
    expect(result.ok).toBe(true)
  })
})

describe('unassign', () => {
  it('将关联状态置为失效', () => {
    seedPerson(db, 200, 1, 1)
    seedProject(db, 200)
    seedTask(db, 200, 200)

    db.prepare(
      `INSERT INTO pm_assignment_rel (relation_code, source_type, source_id, person_id, relation_role, status, created_at, updated_at)
       VALUES (?, 2, ?, ?, 1, 1, datetime('now'), datetime('now'))`
    ).run('ASN-200', 200, 200)

    const rel = db
      .prepare('SELECT id FROM pm_assignment_rel WHERE person_id = ? AND status = 1')
      .get(200) as { id: number }
    unassign(db, rel.id, 'admin', '任务调整')

    const updated = db
      .prepare('SELECT status, change_reason, updated_by FROM pm_assignment_rel WHERE id = ?')
      .get(rel.id) as { status: number; change_reason: string; updated_by: string }
    expect(updated.status).toBe(2)
    expect(updated.change_reason).toBe('任务调整')
    expect(updated.updated_by).toBe('admin')
  })
})

describe('reassign', () => {
  it('正常重新分配：旧关联失效，新关联创建', () => {
    seedPerson(db, 300, 1, 1)
    seedPerson(db, 301, 1, 1)
    seedProject(db, 300)
    seedTask(db, 300, 300)

    db.prepare(
      `INSERT INTO pm_assignment_rel (relation_code, source_type, source_id, person_id, relation_role, status, created_at, updated_at)
       VALUES (?, 2, ?, ?, 1, 1, datetime('now'), datetime('now'))`
    ).run('ASN-300', 300, 300)

    const rel = db
      .prepare('SELECT id FROM pm_assignment_rel WHERE person_id = ? AND status = 1')
      .get(300) as { id: number }
    reassign(db, rel.id, 301, 'admin', '人员替换')

    const oldRel = db.prepare('SELECT status FROM pm_assignment_rel WHERE id = ?').get(rel.id) as {
      status: number
    }
    expect(oldRel.status).toBe(2)

    const newRel = db
      .prepare(
        'SELECT person_id, replace_from_person_id, change_reason FROM pm_assignment_rel WHERE person_id = ? AND status = 1'
      )
      .get(301) as { person_id: number; replace_from_person_id: number; change_reason: string }
    expect(newRel.person_id).toBe(301)
    expect(newRel.replace_from_person_id).toBe(300)
    expect(newRel.change_reason).toBe('人员替换')
  })

  it('旧关联不存在时静默返回', () => {
    seedPerson(db, 302, 1, 1)
    reassign(db, 99999, 302, 'admin', '无旧关联')

    const count = db.prepare('SELECT COUNT(*) as cnt FROM pm_assignment_rel').get() as {
      cnt: number
    }
    expect(count.cnt).toBe(0)
  })

  it('新旧人员相同时仍创建新关联', () => {
    seedPerson(db, 303, 1, 1)
    seedProject(db, 303)
    seedTask(db, 303, 303)

    db.prepare(
      `INSERT INTO pm_assignment_rel (relation_code, source_type, source_id, person_id, relation_role, status, created_at, updated_at)
       VALUES (?, 2, ?, ?, 1, 1, datetime('now'), datetime('now'))`
    ).run('ASN-303', 303, 303)

    const rel = db
      .prepare('SELECT id FROM pm_assignment_rel WHERE person_id = ? AND status = 1')
      .get(303) as { id: number }
    reassign(db, rel.id, 303, 'admin', '自替换')

    const oldRel = db.prepare('SELECT status FROM pm_assignment_rel WHERE id = ?').get(rel.id) as {
      status: number
    }
    expect(oldRel.status).toBe(2)

    const newRel = db
      .prepare(
        'SELECT person_id, replace_from_person_id FROM pm_assignment_rel WHERE person_id = ? AND status = 1'
      )
      .get(303) as { person_id: number; replace_from_person_id: number }
    expect(newRel.person_id).toBe(303)
    expect(newRel.replace_from_person_id).toBe(303)
  })
})
