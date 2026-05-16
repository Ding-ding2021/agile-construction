import { describe, it, expect, beforeEach } from 'vitest'
import { getDatabase } from '../store/sqlite'
import {
  generateSnapshots,
  getTaskSnapshots,
  getSnapshotById,
  getSnapshotsByStandard,
} from '../services/snapshotService'
import type { Database as DatabaseType } from 'better-sqlite3'

function seedTestTask(db: DatabaseType): { projectId: number; taskId: number } {
  db.prepare(
    `
    INSERT INTO projects (code, name, brand, parent_status, stage, progress, planned_open_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `
  ).run('PRJ-SNAP-001', '快照测试项目', '测试品牌', '执行中', '施工', 50, '2026-06-01')

  const projectId = (
    db.prepare(`SELECT id FROM projects WHERE code = ?`).get('PRJ-SNAP-001') as { id: number }
  ).id

  db.prepare(
    `
    INSERT INTO project_tasks (project_id, code, name, status, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `
  ).run(projectId, 'TASK-SNAP-001', '快照测试任务', '进行中', 'test')

  const taskId = (
    db.prepare(`SELECT id FROM project_tasks WHERE code = ?`).get('TASK-SNAP-001') as { id: number }
  ).id

  return { projectId, taskId }
}

function seedBindings(db: DatabaseType, taskId: number): void {
  db.prepare(
    `
    INSERT INTO task_standard_bindings (task_id, clause_id, rule_id, binding_type, bound_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `
  ).run(taskId, 1, 1, 'acceptance')

  db.prepare(
    `
    INSERT INTO task_standard_bindings (task_id, clause_id, rule_id, binding_type, bound_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `
  ).run(taskId, 2, 2, 'execution')

  db.prepare(
    `
    INSERT INTO task_standard_bindings (task_id, clause_id, rule_id, binding_type, bound_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `
  ).run(taskId, 3, 3, 'acceptance')
}

function cleanTestData(db: DatabaseType): void {
  db.exec(`
    DELETE FROM standard_snapshots;
    DELETE FROM task_standard_bindings;
    DELETE FROM project_tasks;
    DELETE FROM projects;
  `)
}

describe('snapshotService', () => {
  let db: DatabaseType

  beforeEach(() => {
    db = getDatabase()
    cleanTestData(db)
  })

  describe('generateSnapshots', () => {
    it('任务有绑定时生成快照', () => {
      const { taskId } = seedTestTask(db)
      seedBindings(db, taskId)

      const snapshots = generateSnapshots(taskId)

      expect(snapshots).toHaveLength(3)
      expect(snapshots[0]).toMatchObject({
        taskId,
        clauseId: 1,
        ruleId: 1,
        standardName: '消防验收标准',
        clauseCode: 'CLS-001',
        clauseTitle: '消防设备安装',
        ruleJudgeType: 'boolean',
      })
      expect(snapshots[1]).toMatchObject({
        taskId,
        clauseId: 2,
        ruleId: 2,
        clauseCode: 'CLS-002',
        clauseTitle: '地砖缝隙',
        ruleJudgeType: 'range',
      })
      expect(snapshots[2]).toMatchObject({
        taskId,
        clauseId: 3,
        ruleId: 3,
        clauseCode: 'CLS-003',
        clauseTitle: '墙面材料',
        ruleJudgeType: 'enum',
      })

      for (const snap of snapshots) {
        expect(snap.id).toBeGreaterThan(0)
        expect(snap.standardId).toBe(1)
        expect(snap.generatedAt).toBeTruthy()
        expect(snap.triggerSource).toBe('status_change')
      }
    })

    it('任务无绑定时返回空数组', () => {
      const { taskId } = seedTestTask(db)

      const snapshots = generateSnapshots(taskId)

      expect(snapshots).toEqual([])
    })

    it('重复调用幂等，不重复生成快照', () => {
      const { taskId } = seedTestTask(db)
      seedBindings(db, taskId)

      const firstCall = generateSnapshots(taskId)
      expect(firstCall).toHaveLength(3)

      const secondCall = generateSnapshots(taskId)
      expect(secondCall).toHaveLength(3)

      const rows = db
        .prepare(`SELECT COUNT(*) AS cnt FROM standard_snapshots WHERE task_id = ?`)
        .get(taskId) as { cnt: number }
      expect(rows.cnt).toBe(3)
    })

    it('快照内容完整性验证', () => {
      const { taskId } = seedTestTask(db)
      seedBindings(db, taskId)

      const snapshots = generateSnapshots(taskId)

      for (const snap of snapshots) {
        expect(snap).toHaveProperty('id')
        expect(snap).toHaveProperty('standardId')
        expect(snap).toHaveProperty('clauseId')
        expect(snap).toHaveProperty('ruleId')
        expect(snap).toHaveProperty('taskId')
        expect(snap).toHaveProperty('standardName')
        expect(snap).toHaveProperty('clauseCode')
        expect(snap).toHaveProperty('clauseTitle')
        expect(snap).toHaveProperty('clauseContent')
        expect(snap).toHaveProperty('ruleJudgeType')
        expect(snap).toHaveProperty('ruleParamConfig')
        expect(snap).toHaveProperty('generatedAt')
        expect(snap).toHaveProperty('triggerSource')
      }

      const first = snapshots[0]
      expect(first.standardName).toBe('消防验收标准')
      expect(first.clauseContent).toBe('检查消防设备是否已安装')
      expect(first.ruleJudgeType).toBe('boolean')
      expect(first.ruleParamConfig).toBeNull()
    })

    it('快照包含自定义 triggerSource', () => {
      const { taskId } = seedTestTask(db)
      seedBindings(db, taskId)

      const snapshots = generateSnapshots(taskId, 'manual')

      for (const snap of snapshots) {
        expect(snap.triggerSource).toBe('manual')
      }
    })

    it('生成快照后更新任务状态', () => {
      const { taskId } = seedTestTask(db)
      seedBindings(db, taskId)

      generateSnapshots(taskId)

      const task = db
        .prepare(`SELECT snapshot_status, standard_binding_status FROM project_tasks WHERE id = ?`)
        .get(taskId) as { snapshot_status: string; standard_binding_status: string }

      expect(task.snapshot_status).toBe('generated')
      expect(task.standard_binding_status).toBe('snapshotted')
    })
  })

  describe('getTaskSnapshots', () => {
    it('获取任务的所有快照', () => {
      const { taskId } = seedTestTask(db)
      seedBindings(db, taskId)
      generateSnapshots(taskId)

      const snapshots = getTaskSnapshots(taskId)

      expect(snapshots).toHaveLength(3)
      for (const snap of snapshots) {
        expect(snap.taskId).toBe(taskId)
      }
    })

    it('任务无快照时返回空数组', () => {
      const { taskId } = seedTestTask(db)

      const snapshots = getTaskSnapshots(taskId)

      expect(snapshots).toEqual([])
    })
  })

  describe('getSnapshotById', () => {
    it('根据 ID 获取单个快照', () => {
      const { taskId } = seedTestTask(db)
      seedBindings(db, taskId)
      const snapshots = generateSnapshots(taskId)

      const result = getSnapshotById(snapshots[0].id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(snapshots[0].id)
      expect(result!.taskId).toBe(taskId)
    })

    it('不存在的 ID 返回 null', () => {
      const result = getSnapshotById(99999)
      expect(result).toBeNull()
    })
  })

  describe('getSnapshotsByStandard', () => {
    it('获取指定标准的所有快照', () => {
      const { taskId } = seedTestTask(db)
      seedBindings(db, taskId)
      generateSnapshots(taskId)

      const snapshots = getSnapshotsByStandard(1)

      expect(snapshots).toHaveLength(3)
      for (const snap of snapshots) {
        expect(snap.standardId).toBe(1)
      }
    })

    it('标准无快照时返回空数组', () => {
      const snapshots = getSnapshotsByStandard(999)
      expect(snapshots).toEqual([])
    })
  })
})
