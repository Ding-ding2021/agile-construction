import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { initDatabase, closeDatabase } from '../store/sqlite'
import {
  changePersonStatus,
  getAvailabilityForStatus,
  canManuallyOverrideAvailability,
  getPersonStatusLogs,
} from '../services/personnelStatusService'
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

describe('getAvailabilityForStatus', () => {
  it('在岗返回可分配(1)', () => {
    expect(getAvailabilityForStatus(1)).toBe(1)
  })

  it('请假返回不可分配(3)', () => {
    expect(getAvailabilityForStatus(2)).toBe(3)
  })

  it('离岗返回不可分配(3)', () => {
    expect(getAvailabilityForStatus(3)).toBe(3)
  })

  it('禁用返回不可分配(3)', () => {
    expect(getAvailabilityForStatus(4)).toBe(3)
  })

  it('未知状态返回不可分配(3)', () => {
    expect(getAvailabilityForStatus(99)).toBe(3)
  })
})

describe('canManuallyOverrideAvailability', () => {
  it('在岗可以手动覆盖', () => {
    expect(canManuallyOverrideAvailability(1)).toBe(true)
  })

  it('请假不可手动覆盖', () => {
    expect(canManuallyOverrideAvailability(2)).toBe(false)
  })

  it('离岗不可手动覆盖', () => {
    expect(canManuallyOverrideAvailability(3)).toBe(false)
  })

  it('禁用不可手动覆盖', () => {
    expect(canManuallyOverrideAvailability(4)).toBe(false)
  })
})

describe('changePersonStatus', () => {
  it('在岗→请假，状态变更并写入日志', () => {
    seedPerson(db, 10, 1, 1)
    changePersonStatus(db, {
      personId: 10,
      beforeStatus: 1,
      afterStatus: 2,
      beforeAvailability: 1,
      afterAvailability: 3,
      reason: '请假',
      operatorId: 'admin',
    })

    const p = db
      .prepare('SELECT person_status, availability_status FROM pm_person WHERE id = ?')
      .get(10) as { person_status: number; availability_status: number }
    expect(p.person_status).toBe(2)
    expect(p.availability_status).toBe(3)

    const logs = getPersonStatusLogs(db, 10)
    expect(logs.length).toBe(1)
    const log = logs[0] as {
      after_person_status: number
      after_availability: number
      reason: string | null
      operator_id: string
    }
    expect(log.after_person_status).toBe(2)
    expect(log.after_availability).toBe(3)
    expect(log.reason).toBe('请假')
    expect(log.operator_id).toBe('admin')
  })

  it('请假→在岗，可用性自动恢复为可分配', () => {
    seedPerson(db, 11, 2, 3)
    changePersonStatus(db, {
      personId: 11,
      beforeStatus: 2,
      afterStatus: 1,
      beforeAvailability: 3,
      afterAvailability: 1,
      reason: '销假',
      operatorId: 'admin',
    })

    const p = db
      .prepare('SELECT person_status, availability_status FROM pm_person WHERE id = ?')
      .get(11) as { person_status: number; availability_status: number }
    expect(p.person_status).toBe(1)
    expect(p.availability_status).toBe(1)
  })

  it('在岗→离岗，可用性变为不可分配', () => {
    seedPerson(db, 12, 1, 1)
    changePersonStatus(db, {
      personId: 12,
      beforeStatus: 1,
      afterStatus: 3,
      beforeAvailability: 1,
      afterAvailability: 3,
      reason: '离职',
      operatorId: 'admin',
    })

    const p = db
      .prepare('SELECT person_status, availability_status FROM pm_person WHERE id = ?')
      .get(12) as { person_status: number; availability_status: number }
    expect(p.person_status).toBe(3)
    expect(p.availability_status).toBe(3)
  })

  it('在岗→禁用，可用性变为不可分配', () => {
    seedPerson(db, 13, 1, 1)
    changePersonStatus(db, {
      personId: 13,
      beforeStatus: 1,
      afterStatus: 4,
      beforeAvailability: 1,
      afterAvailability: 3,
      reason: '违规禁用',
      operatorId: 'admin',
    })

    const p = db
      .prepare('SELECT person_status, availability_status FROM pm_person WHERE id = ?')
      .get(13) as { person_status: number; availability_status: number }
    expect(p.person_status).toBe(4)
    expect(p.availability_status).toBe(3)
  })

  it('空 reason 也能正常写入日志', () => {
    seedPerson(db, 14, 1, 1)
    changePersonStatus(db, {
      personId: 14,
      beforeStatus: 1,
      afterStatus: 2,
      beforeAvailability: 1,
      afterAvailability: 3,
      reason: null,
      operatorId: 'system',
    })

    const logs = getPersonStatusLogs(db, 14)
    expect(logs.length).toBe(1)
    expect(logs[0].reason).toBeNull()
  })

  it('无日志人员返回空数组', () => {
    seedPerson(db, 15, 1, 1)
    const logs = getPersonStatusLogs(db, 15)
    expect(logs).toEqual([])
  })
})
