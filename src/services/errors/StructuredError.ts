/**
 * 统一错误模型
 *
 * 目标：提供结构化的错误信息，便于排障和监控
 */

export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'BUSINESS_ERROR'
  | 'IDEMPOTENCY_CONFLICT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SERVER_ERROR'
  | 'RETRY_EXHAUSTED'

export type ErrorScope = 'api' | 'repository' | 'domain' | 'ui'

export type StructuredErrorOptions = {
  status?: number
  idempotencyKey?: string
  raw?: unknown
}

export class StructuredError extends Error {
  readonly code: ErrorCode
  readonly scope: ErrorScope
  readonly scenario: string
  readonly status?: number
  readonly idempotencyKey?: string
  readonly at: string
  readonly raw?: unknown

  constructor(
    code: ErrorCode,
    scope: ErrorScope,
    scenario: string,
    message: string,
    options: StructuredErrorOptions = {}
  ) {
    super(message)
    this.name = 'StructuredError'
    this.code = code
    this.scope = scope
    this.scenario = scenario
    this.status = options.status
    this.idempotencyKey = options.idempotencyKey
    this.at = new Date().toISOString()
    this.raw = options.raw
  }

  /**
   * 生成可追踪的日志字符串
   */
  toLogString(): string {
    const parts = [`[${this.scope}:${this.scenario}]`, this.code, this.message]

    if (this.status) {
      parts.push(`HTTP ${this.status}`)
    }

    if (this.idempotencyKey) {
      parts.push(`key=${this.idempotencyKey}`)
    }

    return parts.join(' ')
  }

  /**
   * 序列化为 JSON（用于日志上报）
   */
  toJSON() {
    return {
      code: this.code,
      scope: this.scope,
      scenario: this.scenario,
      message: this.message,
      status: this.status,
      idempotencyKey: this.idempotencyKey,
      at: this.at,
    }
  }

  /**
   * 从原始错误创建结构化错误
   */
  static fromRaw(
    raw: unknown,
    code: ErrorCode,
    scope: ErrorScope,
    scenario: string,
    options: StructuredErrorOptions = {}
  ): StructuredError {
    const message = raw instanceof Error ? raw.message : String(raw)
    return new StructuredError(code, scope, scenario, message, {
      ...options,
      raw,
    })
  }

  /**
   * 判断是否为网络错误
   */
  isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR'
  }

  /**
   * 判断是否为幂等冲突
   */
  isIdempotencyConflict(): boolean {
    return this.code === 'IDEMPOTENCY_CONFLICT'
  }

  /**
   * 判断是否为可重试错误
   */
  isRetryable(): boolean {
    return ['NETWORK_ERROR', 'RATE_LIMIT_EXCEEDED', 'SERVER_ERROR', 'RETRY_EXHAUSTED'].includes(
      this.code
    )
  }
}

/**
 * 创建网络错误
 */
export const createNetworkError = (
  scenario: string,
  message: string = '网络请求失败',
  options: StructuredErrorOptions = {}
): StructuredError => {
  return new StructuredError('NETWORK_ERROR', 'api', scenario, message, options)
}

/**
 * 创建验证错误
 */
export const createValidationError = (
  scenario: string,
  message: string,
  options: StructuredErrorOptions = {}
): StructuredError => {
  return new StructuredError('VALIDATION_ERROR', 'domain', scenario, message, options)
}

/**
 * 创建业务错误
 */
export const createBusinessError = (
  scenario: string,
  message: string,
  options: StructuredErrorOptions = {}
): StructuredError => {
  return new StructuredError('BUSINESS_ERROR', 'domain', scenario, message, options)
}

/**
 * 创建幂等冲突错误
 */
export const createIdempotencyConflictError = (
  scenario: string,
  idempotencyKey: string,
  options: StructuredErrorOptions = {}
): StructuredError => {
  return new StructuredError(
    'IDEMPOTENCY_CONFLICT',
    'repository',
    scenario,
    '重复请求，幂等键冲突',
    {
      ...options,
      idempotencyKey,
    }
  )
}

/**
 * 错误日志记录器
 */
export const errorLogger = {
  /**
   * 记录错误到控制台
   */
  log(error: StructuredError): void {
    console.error('[ERROR]', error.toLogString(), error.toJSON())
  },

  /**
   * 记录错误到远程服务（未来扩展）
   */
  async report(error: StructuredError): Promise<void> {
    // 未来可接入错误上报服务（如 Sentry）
    this.log(error)
  },
}
