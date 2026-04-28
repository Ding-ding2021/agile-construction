// Prisma mock factory for test isolation
// Exports createMockPrismaClient() which returns a mock Prisma client compatible shape
// with methods: project.findMany, project.findUnique, project.create, project.update, project.delete
import { vi } from 'vitest'

// Strongly-typed partial project representation (no any used in mocks)
type PartialProject = {
  id?: string
  code?: string
  name?: string
  description?: string
  status?: string
}

interface ProjectRecord {
  id: string
  code?: string
  name?: string
  description?: string
  status?: string
}

export function createMockPrismaClient(initialProjects: PartialProject[] = []) {
  // In-memory data store for the mock
  const data: ProjectRecord[] = initialProjects.map(p => ({
    id: p.id ?? `seed_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    code: p.code,
    name: p.name,
    description: p.description,
    status: p.status,
  }))

  const project = {
    // Return all projects (in-memory)
    findMany: vi.fn(async (): Promise<ProjectRecord[]> => data),
    // Find a single project by id or code
    findUnique: vi.fn(
      async ({
        where,
      }: {
        where?: { id?: string; code?: string }
      }): Promise<ProjectRecord | null> => {
        const key = where?.id ?? where?.code
        return data.find(p => p.id === key || p.code === key) ?? null
      }
    ),
    // Create a new project and push into in-memory store
    create: vi.fn(
      async ({ data: newData }: { data: Partial<ProjectRecord> }): Promise<ProjectRecord> => {
        const newItem: ProjectRecord = {
          id: `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          ...(newData ?? {}),
        } as ProjectRecord
        data.push(newItem)
        return newItem
      }
    ),
    // Update an existing project by id
    update: vi.fn(
      async ({
        where,
        data: update,
      }: {
        where?: { id?: string; code?: string }
        data: Partial<ProjectRecord>
      }): Promise<ProjectRecord | null> => {
        const idx = data.findIndex(p => p.id === where?.id || p.code === where?.code)
        if (idx >= 0) {
          data[idx] = { ...data[idx], ...update }
          return data[idx]
        }
        return null
      }
    ),
    // Delete a project by id
    delete: vi.fn(
      async ({
        where,
      }: {
        where?: { id?: string; code?: string }
      }): Promise<ProjectRecord | null> => {
        const idx = data.findIndex(p => p.id === where?.id || p.code === where?.code)
        if (idx >= 0) {
          const [removed] = data.splice(idx, 1)
          return removed
        }
        return null
      }
    ),
  }

  return { project } as { project: typeof project }
}
