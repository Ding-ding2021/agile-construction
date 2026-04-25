import { describe, it, expect } from 'vitest'

/**
 * 统一错误模型测试
 *
 * 目标：确保错误处理具备结构化字段，便于排障和监控
 */
describe('错误处理模型', () => {
  interface StructuredError {
    code: string
    scope: string
    scenario: string
    status?: number
    idempotencyKey?: string
    at: string
    message: string
    raw?: unknown
  }

  const createStructuredError = (
    code: string,
    scope: string,
    scenario: string,
    message: string,
    options: Partial<StructuredError> = {}
  ): StructuredError => ({
    code,
    scope,
    scenario,
    message,
    at: new Date().toISOString(),
    ...options,
  })

  describe('StructuredError 创建', () => {
    it('应创建网络错误', () => {
      const error = createStructuredError('NETWORK_ERROR', 'api', 'load-projects', '网络请求失败', {
        status: 500,
      })

      expect(error.code).toBe('NETWORK_ERROR')
      expect(error.scope).toBe('api')
      expect(error.scenario).toBe('load-projects')
      expect(error.status).toBe(500)
      expect(error.at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('应创建验证错误', () => {
      const error = createStructuredError(
        'VALIDATION_ERROR',
        'domain',
        'create-project',
        '项目名称不能为空'
      )

      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.scope).toBe('domain')
      expect(error.message).toContain('项目名称')
    })

    it('应创建幂等冲突错误', () => {
      const error = createStructuredError(
        'IDEMPOTENCY_CONFLICT',
        'repository',
        'save-state',
        '重复请求',
        { idempotencyKey: 'key-001' }
      )

      expect(error.code).toBe('IDEMPOTENCY_CONFLICT')
      expect(error.idempotencyKey).toBe('key-001')
    })
  })

  describe('错误分类', () => {
    it('应正确识别网络错误', () => {
      const error = createStructuredError('NETWORK_ERROR', 'api', 'test', '网络错误')

      const isNetworkError = error.code === 'NETWORK_ERROR'
      expect(isNetworkError).toBe(true)
    })

    it('应正确识别业务错误', () => {
      const error = createStructuredError('BUSINESS_ERROR', 'domain', 'test', '业务错误')

      const isBusinessError = error.scope === 'domain'
      expect(isBusinessError).toBe(true)
    })

    it('应正确识别幂等冲突（必须包含幂等键）', () => {
      const error = createStructuredError(
        'IDEMPOTENCY_CONFLICT',
        'repository',
        'test',
        '幂等冲突',
        { idempotencyKey: 'key-001' }
      )

      // 幂等冲突必须同时满足两个条件：错误码匹配 + 存在幂等键
      const isIdempotencyError =
        error.code === 'IDEMPOTENCY_CONFLICT' && Boolean(error.idempotencyKey)
      expect(isIdempotencyError).toBe(true)
    })
  })

  describe('错误日志', () => {
    it('应生成可追踪的日志字符串', () => {
      const error = createStructuredError('NETWORK_ERROR', 'api', 'load-projects', '网络请求失败', {
        status: 500,
        idempotencyKey: 'req-001',
      })

      const logMessage = `[${error.scope}:${error.scenario}] ${error.code}: ${error.message} (HTTP ${error.status}, key=${error.idempotencyKey})`

      expect(logMessage).toContain('api:load-projects')
      expect(logMessage).toContain('NETWORK_ERROR')
      expect(logMessage).toContain('HTTP 500')
      expect(logMessage).toContain('key=req-001')
    })
  })
})
