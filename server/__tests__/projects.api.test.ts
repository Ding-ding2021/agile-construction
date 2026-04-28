import { describe, it, expect } from 'vitest'
import { createMockPrismaClient } from '../../src/test/mocks/prisma.mock'

describe('Prisma mock factory (backed by in-memory data)', () => {
  it('should return an empty array for findMany with no seed data', () => {
    const mock = createMockPrismaClient()
    expect(mock.project.findMany()).toBeDefined()
  })

  it('should return seed data for findMany when initialProjects provided', async () => {
    const projects = [{ id: 'p1', code: 'P001', name: 'Test', status: 'active' }]
    const mock = createMockPrismaClient(projects)
    const result = await mock.project.findMany()
    expect(result).toHaveLength(1)
    expect(result[0].code).toBe('P001')
  })

  it('should persist created projects', async () => {
    const mock = createMockPrismaClient()
    await mock.project.create({
      data: { id: 'new1', code: 'NEW01', name: 'New Project', status: 'active' },
    })
    const all = await mock.project.findMany()
    expect(all).toHaveLength(1)
    expect(all[0].code).toBe('NEW01')
  })
})
