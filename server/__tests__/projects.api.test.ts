import express from 'express'
import { describe, it, expect, vi } from 'vitest'
import supertest from 'supertest'

// Import Prisma mock factory from tests mocks
import { createMockPrismaClient } from '../../src/test/mocks/prisma.mock'

// Mock Prisma client used by server
vi.mock('../../server/lib/prisma', () => {
  // Seed with one existing project for GET tests
  const initialProjects = [
    {
      id: 'proj_1',
      code: 'PRJ001',
      name: 'Initial Project',
      description: 'A seed project',
      status: 'active',
    },
  ]
  const mockPrisma = createMockPrismaClient(initialProjects)
  return {
    prisma: mockPrisma,
  }
})

// Import routes after mocking (to ensure mock is in place)
import routes from '../../server/routes'
import { getProjects, createProject } from '../../server/controllers/projects'

function buildApp(): express.Express {
  const app = express()
  app.use(express.json())
  app.use('/api', routes)
  return app
}

function mockResponse() {
  const res: Record<string, unknown> = {
    statusCode: 0,
    jsonPayload: null,
  }
  res.status = function status(code: number) {
    this.statusCode = code
    return this
  }
  res.json = function json(payload: unknown) {
    this.jsonPayload = payload
    return this
  }
  return res as unknown as express.Response
}

describe('Backend API integration tests for projects', () => {
  it('GET /api/projects returns 200 with an array', async () => {
    const app = buildApp()
    if (supertest) {
      const res = await supertest(app).get('/api/projects')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    } else {
      // Fallback: call controller directly
      const req = {} as express.Request
      const res = mockResponse()
      await getProjects(req, res)
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.jsonPayload)).toBe(true)
    }
  })

  it('POST /api/projects returns 201 with created project', async () => {
    const app = buildApp()
    const newProject = { code: 'PRJ002', name: 'New Project' }
    if (supertest) {
      const res = await supertest(app).post('/api/projects').send(newProject)
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.code).toBe(newProject.code)
    } else {
      // Fallback: call controller directly
      const req = { body: newProject } as express.Request
      const res = mockResponse()
      await createProject(req, res)
      expect(res.statusCode).toBe(201)
      expect(res.jsonPayload).toHaveProperty('id')
      expect(res.jsonPayload.code).toBe(newProject.code)
    }
  })
})
