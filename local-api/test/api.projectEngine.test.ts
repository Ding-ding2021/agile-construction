import { describe, it, expect, afterAll } from 'vitest'
import request from 'supertest'
import app from '../app'
import { getTestDb, createTestProject } from './helpers'

describe('项目引擎 API — 聚合引擎核心行为', () => {
  afterAll(() => {
    const db = getTestDb()
    db.exec(`
      DELETE FROM task_event_logs;
      DELETE FROM task_submissions;
      DELETE FROM project_tasks;
      DELETE FROM projects WHERE code LIKE 'PRJ-APE%';
    `)
  })

  // ─── 场景 1：创建项目 → 默认维度状态正确 ─────────────────
  describe('创建项目默认状态', () => {
    it('POST /api/projects — 新项目各维度状态应为默认值', async () => {
      const code = `PRJ-APE-${Date.now()}`
      const res = await request(app).post('/api/projects').send({ code, name: '聚合测试项目' })
      expect(res.status).toBe(201)

      expect(res.body).toHaveProperty('executionStatus', '未开始')
      expect(res.body).toHaveProperty('acceptanceStatus', '待验收')
      expect(res.body).toHaveProperty('settlementStatus', '未结算')
      expect(res.body).toHaveProperty('dispatchStatus', '未派单')
      expect(res.body).toHaveProperty('healthStatus', '正常')
      expect(res.body).toHaveProperty('parentStatus', '启动')
      expect(res.body).toHaveProperty('progress', 0)
    })

    it('POST /api/projects — 不应包含旧的 status 字段', async () => {
      const code = `PRJ-APE-${Date.now()}`
      const res = await request(app).post('/api/projects').send({ code, name: '状态清空测试' })
      expect(res.status).toBe(201)

      expect(res.body).not.toHaveProperty('status')
    })
  })

  // ─── 场景 2：添加任务 → 手动重新聚合验证 ──────────────────
  describe('任务驱动的手动重新聚合', () => {
    it('添加执行中任务后调用 reaggregate — executionStatus 应变为 进行中', async () => {
      const db = getTestDb()
      const projectCode = `PRJ-APE-${Date.now()}`

      const createRes = await request(app)
        .post('/api/projects')
        .send({ code: projectCode, name: '聚合测试-任务驱动' })
      expect(createRes.status).toBe(201)

      const projectId = (
        db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as { id: number }
      ).id
      const taskCode = `TASK-APE-${Date.now()}`
      db.prepare(
        `INSERT INTO project_tasks (project_id, code, name, status, created_by, updated_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`
      ).run(projectId, taskCode, '执行中任务', '执行中', 'tester')

      const reagRes = await request(app).post(`/api/projects/${projectCode}/reaggregate`)
      expect(reagRes.status).toBe(200)
      expect(reagRes.body).toHaveProperty('executionStatus', '进行中')
      expect(reagRes.body).toHaveProperty('code', projectCode)
    })

    it('全部任务完成后调用 reaggregate — executionStatus 应变为 已完成', async () => {
      const db = getTestDb()
      const projectCode = `PRJ-APE-${Date.now()}`

      const createRes = await request(app)
        .post('/api/projects')
        .send({ code: projectCode, name: '聚合测试-全部完成' })
      expect(createRes.status).toBe(201)

      const projectId = (
        db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as { id: number }
      ).id
      const taskCode1 = `TASK-APE-DONE-${Date.now()}`
      const taskCode2 = `TASK-APE-DONE-${Date.now() + 1}`
      db.prepare(
        `INSERT INTO project_tasks (project_id, code, name, status, created_by, updated_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`
      ).run(projectId, taskCode1, '已完成任务1', '已完成', 'tester')
      db.prepare(
        `INSERT INTO project_tasks (project_id, code, name, status, created_by, updated_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`
      ).run(projectId, taskCode2, '已完成任务2', '已完成', 'tester')

      const reagRes = await request(app).post(`/api/projects/${projectCode}/reaggregate`)
      expect(reagRes.status).toBe(200)
      expect(reagRes.body).toHaveProperty('executionStatus', '已完成')
      expect(reagRes.body).toHaveProperty('progress', 100)
    })
  })

  // ─── 场景 3：GET /health → 返回健康度指标 ─────────────────
  describe('健康度接口', () => {
    it('GET /api/projects/:code/health — 返回完整健康度指标', async () => {
      const db = getTestDb()
      const projectCode = createTestProject()
      const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as {
        id: number
      }

      const taskCode = `TASK-HEALTH-${Date.now()}`
      db.prepare(
        `INSERT INTO project_tasks (project_id, code, name, status, created_by, updated_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`
      ).run(project.id, taskCode, '健康度测试任务', '执行中', 'tester')

      const res = await request(app).get(`/api/projects/${projectCode}/health`)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('projectCode', projectCode)
      expect(res.body).toHaveProperty('health')
      expect(res.body.health).toHaveProperty('status')
      expect(res.body.health).toHaveProperty('indicators')
      expect(res.body.health.indicators).toBeInstanceOf(Array)
      expect(res.body.health.indicators).toHaveLength(4)

      const labels = res.body.health.indicators.map((i: { label: string }) => i.label)
      expect(labels).toContain('进度偏差')
      expect(labels).toContain('SLA超时')
      expect(labels).toContain('风险项')
      expect(labels).toContain('未分配')

      expect(res.body).toHaveProperty('executionStatus')
      expect(res.body).toHaveProperty('acceptanceStatus')
      expect(res.body).toHaveProperty('settlementStatus')
      expect(res.body).toHaveProperty('dispatchStatus')
      expect(res.body).toHaveProperty('parentStatus')
      expect(res.body).toHaveProperty('progress')
      expect(res.body).toHaveProperty('pendingCounts')
    })

    it('GET /api/projects/:code/health — 不存在的项目返回 404', async () => {
      const res = await request(app).get('/api/projects/PRJ-NONEXIST/health')
      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('code', 'NOT_FOUND')
    })
  })

  // ─── 场景 4：POST /reaggregate → 手动触发聚合 ────────────
  describe('手动重新聚合', () => {
    it('POST /api/projects/:code/reaggregate — 手动触发聚合后状态正确', async () => {
      const db = getTestDb()
      const projectCode = createTestProject()
      const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as {
        id: number
      }

      const taskCode = `TASK-REAGG-${Date.now()}`
      db.prepare(
        `INSERT INTO project_tasks (project_id, code, name, status, created_by, updated_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`
      ).run(project.id, taskCode, '重新聚合测试任务', '执行中', 'tester')

      const res = await request(app).post(`/api/projects/${projectCode}/reaggregate`)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('executionStatus', '进行中')
      expect(res.body).toHaveProperty('code', projectCode)
    })

    it('POST /api/projects/:code/reaggregate — 不存在的项目返回 404', async () => {
      const res = await request(app).post('/api/projects/PRJ-NONEXIST/reaggregate')
      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('code', 'NOT_FOUND')
    })
  })

  // ─── 场景 5：PUT 修改其他字段 ────────────────────────────
  describe('PUT /api/projects/:code', () => {
    it('修改其他字段 — 正常返回', async () => {
      const projectCode = createTestProject()

      const res = await request(app)
        .put(`/api/projects/${projectCode}`)
        .send({ name: '修改后的项目名称' })
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', '修改后的项目名称')
    })
  })

  // ─── 场景 6：边界情况 ─────────────────────────────────────
  describe('边界情况', () => {
    it('空任务项目 — 各维度应为初始默认值', async () => {
      const code = `PRJ-APE-EMPTY-${Date.now()}`
      const res = await request(app).post('/api/projects').send({ code, name: '空任务项目' })
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('executionStatus', '未开始')
      expect(res.body).toHaveProperty('acceptanceStatus', '待验收')
      expect(res.body).toHaveProperty('dispatchStatus', '未派单')
      expect(res.body).toHaveProperty('settlementStatus', '未结算')
      expect(res.body).toHaveProperty('healthStatus', '正常')
      expect(res.body).toHaveProperty('progress', 0)
    })

    it('全部完成项目 — 聚合状态正确', async () => {
      const db = getTestDb()
      const projectCode = `PRJ-APE-ALLDONE-${Date.now()}`

      const createRes = await request(app)
        .post('/api/projects')
        .send({ code: projectCode, name: '全部完成项目' })
      expect(createRes.status).toBe(201)

      const projectId = (
        db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as { id: number }
      ).id
      for (let i = 0; i < 3; i++) {
        db.prepare(
          `INSERT INTO project_tasks (project_id, code, name, status, assignee_id, created_by, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
        ).run(
          projectId,
          `TASK-ALLDONE-${Date.now()}-${i}`,
          `任务${i}`,
          '已完成',
          'worker',
          'tester'
        )
      }

      const reagRes = await request(app).post(`/api/projects/${projectCode}/reaggregate`)
      expect(reagRes.status).toBe(200)
      expect(reagRes.body).toHaveProperty('executionStatus', '已完成')
      expect(reagRes.body).toHaveProperty('dispatchStatus', '已派完')
      expect(reagRes.body).toHaveProperty('progress', 100)
    })

    it('混合状态项目 — executionStatus 为 进行中', async () => {
      const db = getTestDb()
      const projectCode = `PRJ-APE-MIXED-${Date.now()}`

      const createRes = await request(app)
        .post('/api/projects')
        .send({ code: projectCode, name: '混合状态项目' })
      expect(createRes.status).toBe(201)

      const projectId = (
        db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as { id: number }
      ).id
      for (let i = 0; i < 3; i++) {
        const statuses = ['执行中', '已完成', '待提交']
        db.prepare(
          `INSERT INTO project_tasks (project_id, code, name, status, created_by, updated_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`
        ).run(projectId, `TASK-MIXED-${Date.now()}-${i}`, `任务${i}`, statuses[i], 'tester')
      }

      const reagRes = await request(app).post(`/api/projects/${projectCode}/reaggregate`)
      expect(reagRes.status).toBe(200)
      expect(reagRes.body).toHaveProperty('executionStatus', '进行中')
      expect(reagRes.body.progress).toBeGreaterThan(0)
      expect(reagRes.body.progress).toBeLessThan(100)
    })
  })
})
