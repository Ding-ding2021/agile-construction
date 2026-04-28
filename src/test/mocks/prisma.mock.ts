// Prisma mock factory for test isolation
// Exports createMockPrismaClient() which returns a mock Prisma client compatible shape
// with methods: project.findMany, project.findUnique, project.create, project.update, project.delete
import { vi } from 'vitest'

type PrismaLike = any

export function createMockPrismaClient(initialProjects: any[] = []) {
  // In-memory data store for the mock
  const data: any[] = initialProjects.slice()

  const project = {
    // Return all projects (in-memory)
    findMany: vi.fn(async () => data),
    // Find a single project by id or code
    findUnique: vi.fn(async ({ where }: any) => {
      const key = where?.id ?? where?.code
      return data.find(p => p.id === key || p.code === key) ?? null
    }),
    // Create a new project and push into in-memory store
    create: vi.fn(async ({ data: newData }: any) => {
      const newItem = {
        id: `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        ...(newData ?? {}),
      }
      data.push(newItem)
      return newItem
    }),
    // Update an existing project by id
    update: vi.fn(async ({ where, data: update }: any) => {
      const idx = data.findIndex(p => p.id === where?.id || p.code === where?.code)
      if (idx >= 0) {
        data[idx] = { ...data[idx], ...update }
        return data[idx]
      }
      return null
    }),
    // Delete a project by id
    delete: vi.fn(async ({ where }: any) => {
      const idx = data.findIndex(p => p.id === where?.id || p.code === where?.code)
      if (idx >= 0) {
        const [removed] = data.splice(idx, 1)
        return removed
      }
      return null
    }),
  }

  return { project } as PrismaLike
}
