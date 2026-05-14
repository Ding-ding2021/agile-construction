import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'
import { createTestProject, createTestTask } from './helpers'

describe('标准绑定 API', () => {
  let projectCode: string
  let taskCode: string

  it('准备工作：创建测试项目和任务', async () => {
    projectCode = createTestProject()
    taskCode = createTestTask(projectCode, '待执行')
    expect(taskCode).toBeTruthy()
  })

  it('POST /api/projects/:code/tasks/:taskCode/standards/bind — 绑定标准条款', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectCode}/tasks/${taskCode}/standards/bind`)
      .send({ clauseIds: [1, 2, 3], bindingType: 'acceptance' })
    expect(res.status).toBe(201)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(3)
    expect(res.body[0]).toHaveProperty('bindingType', 'acceptance')
  })

  it('POST /api/projects/:code/tasks/:taskCode/standards/bind — 重复绑定抛出错误', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectCode}/tasks/${taskCode}/standards/bind`)
      .send({ clauseIds: [1], bindingType: 'acceptance' })
    expect(res.status).toBe(500)
  })

  it('GET /api/projects/:code/tasks/:taskCode/standards — 查看绑定列表', async () => {
    const res = await request(app).get(`/api/projects/${projectCode}/tasks/${taskCode}/standards`)
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(3)
  })

  it('POST /api/projects/:code/tasks/:taskCode/snapshots/generate — 手动生成快照', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectCode}/tasks/${taskCode}/snapshots/generate`)
      .send({ triggerSource: 'test' })
    expect(res.status).toBe(201)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(3)
  })

  it('POST /api/projects/:code/tasks/:taskCode/snapshots/generate — 幂等', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectCode}/tasks/${taskCode}/snapshots/generate`)
      .send({ triggerSource: 'test' })
    expect(res.status).toBe(201)
    expect(res.body.length).toBe(3)
  })

  it('GET /api/projects/:code/tasks/:taskCode/snapshots — 查看快照列表', async () => {
    const res = await request(app).get(`/api/projects/${projectCode}/tasks/${taskCode}/snapshots`)
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(3)
    expect(res.body.data[0]).toHaveProperty('standardName')
  })

  it('DELETE /api/projects/:code/tasks/:taskCode/standards/:bindingId — 已生成快照后无法解绑', async () => {
    const bindRes = await request(app).get(
      `/api/projects/${projectCode}/tasks/${taskCode}/standards`
    )
    const bindingId = bindRes.body.data[0].id

    const res = await request(app).delete(
      `/api/projects/${projectCode}/tasks/${taskCode}/standards/${bindingId}`
    )
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('code', 'BINDING_LOCKED')
  })

  it('POST /api/projects/:code/tasks/:taskCode/acceptance/validate — 验收判定', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectCode}/tasks/${taskCode}/acceptance/validate`)
      .send({ actualValues: { 1: true, 3: '涂料' } })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('passed')
  })
})

describe('规则执行 API', () => {
  it('POST /api/standards/rules/:id/execute — 执行 boolean 规则', async () => {
    const res = await request(app)
      .post('/api/standards/rules/1/execute')
      .send({ actualValue: true })
    expect(res.status).toBe(200)
    expect(res.body.passed).toBe(true)
  })

  it('POST /api/standards/rules/:id/execute — 执行 range 规则', async () => {
    const res = await request(app).post('/api/standards/rules/2/execute').send({ actualValue: 2 })
    expect(res.status).toBe(200)
    expect(res.body.passed).toBe(true)
  })

  it('POST /api/standards/rules/:id/execute — 不存在的规则返回 404', async () => {
    const res = await request(app)
      .post('/api/standards/rules/999/execute')
      .send({ actualValue: true })
    expect(res.status).toBe(404)
  })
})

describe('标准绑定引用 API', () => {
  it('GET /api/standards/:id/bindings — 查看标准被哪些任务引用', async () => {
    const res = await request(app).get('/api/standards/1/bindings')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
  })

  it('GET /api/standards/:id/bindings — 不存在的标准返回 404', async () => {
    const res = await request(app).get('/api/standards/999/bindings')
    expect(res.status).toBe(404)
  })
})
