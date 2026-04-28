import { describe, it, expect, vi } from 'vitest'

import * as clientModule from '../services/api/client'
import { serverAdapter, createIdempotencyKey } from '../services/api/serverAdapter'

describe('serverAdapter', () => {
  it('createIdempotencyKey should include scope and optional target', () => {
    const key = createIdempotencyKey('scope', 'target')
    expect(key).toContain('scope-target-')
  })

  it('getProjectTasks should call apiRequest with correct path', async () => {
    // Spy on apiRequest to capture how it's called
    const spy = vi.spyOn(clientModule, 'apiRequest').mockResolvedValue([] as any)

    const result = await serverAdapter.getProjectTasks('PRJ1')

    // verify apiRequest was called and path contains the expected project code
    const calls = (spy as any).mock.calls
    expect(calls.length).toBeGreaterThan(0)
    const pathArg = calls[0][0] as string
    expect(pathArg).toContain('/projects/PRJ1/tasks')
    // ensure returned value flows through
    expect(result).toEqual([])
  })
})
