import { describe, it, expect, beforeEach } from 'vitest'
import { getDatabase } from '../store/sqlite'
import { submitTask, reviewTask } from '../services/acceptanceWorkflow'
import { ApiError } from '../middleware/error'
import type { Database as DatabaseType } from 'better-sqlite3'

interface SeedResult {
  projectId: number
  taskId: number
  taskCode: string
}

function seedTask(db: DatabaseType, status: string): SeedResult {
  const now = new Date().toISOString()
  const projectCode = 'PRJ-ACCEPT-' + Date.now()
  const taskCode = 'TASK-ACCEPT-' + Date.now()

  db.prepare(
    `INSERT INTO projects (code, name, brand, parent_status, stage, progress, planned_open_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(projectCode, '验收测试项目', '测试品牌', '启动', '施工', 50, '2026-06-01', now, now)

  const projectId = (db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as { id: number }).id

  db.prepare(
    `INSERT INTO project_tasks (project_id, code, name, status, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(projectId, taskCode, '验收测试任务', status, 'tester', now, now)

  const taskId = (db.prepare('SELECT id FROM project_tasks WHERE code = ?').get(taskCode) as { id: number }).id

  return { projectId, taskId, taskCode }
}

function seedProjectOnly(db: DatabaseType): number {
  const now = new Date().toISOString()
  const projectCode = 'PRJ-ACCEPT-ONLY-' + Date.now()

  db.prepare(
    `INSERT INTO projects (code, name, brand, parent_status, stage, progress, planned_open_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(projectCode, '验收父项目', '测试品牌', '启动', '施工', 50, '2026-06-01', now, now)

  return (db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as { id: number }).id
}

function cleanTestData(db: DatabaseType): void {
  db.exec(`
    DELETE FROM task_event_logs;
    DELETE FROM task_submissions;
    DELETE FROM task_standard_bindings;
    DELETE FROM standard_snapshots;
    DELETE FROM project_tasks;
    DELETE FROM projects;
  `)
}

describe('acceptanceWorkflow', () => {
  let db: DatabaseType

  beforeEach(() => {
    db = getDatabase()
    cleanTestData(db)
  })

  describe('submitTask', () => {
    it('执行中的任务提交后状态变为待验收', () => {
      const { taskId } = seedTask(db, '执行中')

      const result = submitTask({ taskId, submissionType: 'normal', submittedBy: '张三' })

      expect(result.submission.status).toBe('submitted')
      expect(result.taskStatus).toBe('待验收')
      expect(result.submission.taskId).toBe(taskId)
      expect(result.submission.submittedBy).toBe('张三')

      const task = db.prepare('SELECT status FROM project_tasks WHERE id = ?').get(taskId) as { status: string }
      expect(task.status).toBe('待验收')

      const logs = db.prepare('SELECT COUNT(*) as cnt FROM task_event_logs WHERE task_id = ?').get(taskId) as { cnt: number }
      expect(logs.cnt).toBe(1)
    })

    it('草稿状态的任务提交时抛出 ApiError', () => {
      const { taskId } = seedTask(db, '草稿')

      expect(() => {
        submitTask({ taskId, submissionType: 'normal', submittedBy: '张三' })
      }).toThrow(ApiError)

      try {
        submitTask({ taskId, submissionType: 'normal', submittedBy: '张三' })
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).message).toBe('只有执行中的任务才能提交验收')
        expect((e as ApiError).code).toBe('INVALID_STATUS')
        expect((e as ApiError).status).toBe(400)
      }
    })

    it('不存在的任务提交时抛出 ApiError', () => {
      expect(() => {
        submitTask({ taskId: 99999, submissionType: 'normal', submittedBy: '张三' })
      }).toThrow(ApiError)
    })

    it('前置任务未完成时提交抛出 ApiError', () => {
      const { taskId, projectId } = seedTask(db, '执行中')
      const taskCode = 'PRED-TASK-' + Date.now()
      const now = new Date().toISOString()

      db.prepare(
        `INSERT INTO project_tasks (project_id, code, name, status, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(projectId, taskCode, '前置任务', '进行中', 'tester', now, now)

      const predTaskId = (db.prepare('SELECT id FROM project_tasks WHERE code = ?').get(taskCode) as { id: number }).id

      db.prepare(
        `INSERT INTO task_relations (from_task_id, to_task_id, relation_type)
         VALUES (?, ?, 'finish_start')`
      ).run(predTaskId, taskId)

      expect(() => {
        submitTask({ taskId, submissionType: 'normal', submittedBy: '张三' })
      }).toThrow(ApiError)

      try {
        submitTask({ taskId, submissionType: 'normal', submittedBy: '张三' })
      } catch (e) {
        expect((e as ApiError).message).toBe('存在未完成的前置任务')
        expect((e as ApiError).code).toBe('PREDECESSORS_NOT_DONE')
      }
    })
  })

  describe('reviewTask', () => {
    function submitAndGetId(taskId: number): number {
      const result = submitTask({ taskId, submissionType: 'normal', submittedBy: '张三' })
      return result.submission.id as number
    }

    it('审核通过后任务状态变为已完成', () => {
      const { taskId } = seedTask(db, '执行中')
      const subId = submitAndGetId(taskId)

      const result = reviewTask({ submissionId: subId, result: 'pass', comment: '验收通过', reviewedBy: '李四' })

      expect(result.submission.status).toBe('accepted')
      expect(result.submission.reviewResult).toBe('pass')
      expect(result.submission.reviewComment).toBe('验收通过')
      expect(result.submission.reviewedBy).toBe('李四')
      expect(result.taskStatus).toBe('已完成')

      const task = db.prepare('SELECT status FROM project_tasks WHERE id = ?').get(taskId) as { status: string }
      expect(task.status).toBe('已完成')
    })

    it('审核退回后任务状态变为不通过', () => {
      const { taskId } = seedTask(db, '执行中')
      const subId = submitAndGetId(taskId)

      const result = reviewTask({ submissionId: subId, result: 'reject', comment: '质量问题', reviewedBy: '李四' })

      expect(result.submission.status).toBe('rejected')
      expect(result.submission.reviewResult).toBe('reject')
      expect(result.submission.reviewComment).toBe('质量问题')
      expect(result.taskStatus).toBe('不通过')

      const task = db.prepare('SELECT status FROM project_tasks WHERE id = ?').get(taskId) as { status: string }
      expect(task.status).toBe('不通过')
    })

    it('退回时未填写原因抛出 ApiError', () => {
      const { taskId } = seedTask(db, '执行中')
      const subId = submitAndGetId(taskId)

      expect(() => {
        reviewTask({ submissionId: subId, result: 'reject', comment: '', reviewedBy: '李四' })
      }).toThrow(ApiError)

      try {
        reviewTask({ submissionId: subId, result: 'reject', comment: '', reviewedBy: '李四' })
      } catch (e) {
        expect((e as ApiError).message).toBe('退回时必须填写原因')
        expect((e as ApiError).code).toBe('REVIEW_COMMENT_REQUIRED')
        expect((e as ApiError).status).toBe(400)
      }
    })

    it('退回时创建派生整改任务', () => {
      const { taskId, projectId } = seedTask(db, '执行中')
      const subId = submitAndGetId(taskId)

      const result = reviewTask({
        submissionId: subId,
        result: 'reject',
        comment: '不符合标准',
        reviewedBy: '李四',
        createDerivedTask: true,
      })

      expect(result.derivedTask).toBeDefined()
      expect(result.derivedTask!.isRectification).toBe(1)
      expect((result.derivedTask!.name as string).startsWith('整改-')).toBe(true)
      expect(result.derivedTask!.status).toBe('待分配')
      expect(result.derivedTask!.derivedFromTaskId).toBe(taskId)
      expect(result.derivedTask!.rectificationReason).toBe('不符合标准')
      expect(result.derivedTask!.projectId).toBe(projectId)
    })

    it('重复审核已审核的提交抛出 ApiError', () => {
      const { taskId } = seedTask(db, '执行中')
      const subId = submitAndGetId(taskId)

      reviewTask({ submissionId: subId, result: 'pass', comment: '通过', reviewedBy: '李四' })

      expect(() => {
        reviewTask({ submissionId: subId, result: 'reject', comment: '再次审核', reviewedBy: '王五' })
      }).toThrow(ApiError)

      try {
        reviewTask({ submissionId: subId, result: 'reject', comment: '再次审核', reviewedBy: '王五' })
      } catch (e) {
        expect((e as ApiError).message).toBe('提交记录不存在或已被审核')
        expect((e as ApiError).code).toBe('NOT_FOUND')
        expect((e as ApiError).status).toBe(404)
      }
    })

    it('不存在的提交记录抛出 ApiError', () => {
      expect(() => {
        reviewTask({ submissionId: 99999, result: 'pass', comment: '通过', reviewedBy: '李四' })
      }).toThrow(ApiError)
    })
  })
})
