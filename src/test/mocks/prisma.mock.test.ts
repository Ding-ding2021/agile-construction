/* eslint-disable @typescript-eslint/no-explicit-any -- 测试 mock 需要 any */

import { describe, it, expect } from 'vitest'
import { createMockPrismaClient } from './prisma.mock'

describe('Prisma mock factory', () => {
  it('should expose mock project methods and persist created items', async () => {
    const client: any = createMockPrismaClient()
    // initially empty
    const all1 = await client.project.findMany()
    expect(Array.isArray(all1)).toBe(true)
    // create a new item
    const created = await client.project.create({
      data: { code: 'PRJ-TEST', name: 'Test Project' },
    })
    expect(created).toHaveProperty('code', 'PRJ-TEST')
    // ensure it exists now
    const all2 = await client.project.findMany()
    expect(all2.length).toBeGreaterThanOrEqual(1)
  })

  it('should update an existing item', async () => {
    const initial = [{ id: '1', code: 'PRJ-001', name: 'Initial' }]
    const client: any = createMockPrismaClient(initial)
    const updated = await client.project.update({ where: { id: '1' }, data: { name: 'Updated' } })
    expect(updated?.name).toBe('Updated')
  })
})
