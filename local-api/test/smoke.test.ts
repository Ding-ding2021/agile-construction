import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('API 基础设施 Smoke Test', () => {
  it('健康检查端点返回 ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('标准列表 API 返回种子数据', async () => {
    const res = await request(app).get('/api/standards')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
    expect(res.body.data[0]).toHaveProperty('code', 'STD-001')
  })

  it('不存在的路由返回 404', async () => {
    const res = await request(app).get('/api/non-existent-route')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('code', 'NOT_FOUND')
  })
})
