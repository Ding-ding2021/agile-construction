export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiClientOptions = {
  method?: HttpMethod
  body?: unknown
  idempotencyKey?: string
  headers?: Record<string, string>
  retries?: number
  scope?: string
  scenario?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }

  /**
   * 生成可追踪的日志字符串
   */
  toLogString(): string {
    return `[api] ${this.code ?? 'API_ERROR'}: ${this.message} (HTTP ${this.status})`
  }
}

const DEFAULT_RETRIES = 1
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504])

const wait = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms))

const buildHeaders = (options: ApiClientOptions): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (options.idempotencyKey) {
    headers['X-Idempotency-Key'] = options.idempotencyKey
  }

  return headers
}

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || '/api'

const isUnsetEnvRequest = (path: string) => /[?&]envId=unset-env(?:&|$)/.test(path)
const isLocalDev =
  !import.meta.env.VITE_TCB_ENV_ID ||
  (import.meta.env.VITE_TCB_ENV_ID as string | undefined)?.trim() === 'unset-env'

const emitRemoteFallback = (
  scope: string,
  reason: string,
  status?: number,
  scenario?: string,
  idempotencyKey?: string
) => {
  if (typeof window === 'undefined') {
    return
  }

  // 增强日志：记录完整的降级上下文
  const logMessage = `[降级] scope=${scope}, scenario=${scenario ?? 'unknown'}, reason=${reason}, status=${status ?? 'N/A'}, key=${idempotencyKey ?? 'N/A'}`
  console.warn(logMessage)

  window.dispatchEvent(
    new CustomEvent('pm:remote-fallback', {
      detail: {
        scope,
        reason,
        status,
        scenario,
        idempotencyKey,
        at: new Date().toISOString(),
      },
    })
  )
}

export const apiRequest = async <T>(path: string, options: ApiClientOptions = {}): Promise<T> => {
  const retries = options.retries ?? DEFAULT_RETRIES
  const scope = options.scope ?? 'unknown'
  const scenario = options.scenario ?? path
  let attempt = 0

  if (!isLocalDev && isUnsetEnvRequest(path)) {
    console.info(`[API] 未配置云端环境，直接使用本地模式: ${scenario}`)
    throw new ApiError('云端环境未配置，已切换本地模式', 0, 'REMOTE_DISABLED')
  }

  while (attempt <= retries) {
    let response: Response

    try {
      response = await fetch(`${BASE_URL}${path}`, {
        method: options.method ?? 'GET',
        headers: buildHeaders(options),
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      })
    } catch (err) {
      // 增强日志：记录网络错误详情
      console.error('[API] Network error:', {
        path,
        scope,
        scenario,
        attempt,
        error: err instanceof Error ? err.message : String(err),
      })

      if (attempt < retries) {
        await wait((attempt + 1) * 300)
        attempt += 1
        continue
      }

      emitRemoteFallback(scope, 'network_error', 0, scenario, options.idempotencyKey)
      throw new ApiError('网络不可用，已切换本地兜底', 0, 'NETWORK_ERROR')
    }

    if (response.ok) {
      if (response.status === 204) {
        return undefined as T
      }

      return (await response.json()) as T
    }

    let errorMessage = `请求失败(${response.status})`
    let errorCode: string | undefined

    try {
      const payload = (await response.json()) as { message?: string; code?: string }
      errorMessage = payload.message ?? errorMessage
      errorCode = payload.code
    } catch {
      // ignore parse error
    }

    if (attempt < retries && RETRYABLE_STATUS.has(response.status)) {
      // 增强日志：记录重试信息
      console.warn(`[API] Retrying request (attempt ${attempt + 1}/${retries}):`, {
        path,
        scope,
        scenario,
        status: response.status,
        errorCode,
      })

      await wait((attempt + 1) * 300)
      attempt += 1
      continue
    }

    emitRemoteFallback(
      scope,
      errorCode ?? errorMessage,
      response.status,
      scenario,
      options.idempotencyKey
    )
    throw new ApiError(errorMessage, response.status, errorCode)
  }

  // 增强日志：记录重试耗尽
  console.error('[API] Retry exhausted:', {
    path,
    scope,
    scenario,
    retries,
  })

  emitRemoteFallback(scope, 'retry_exhausted', 500, scenario, options.idempotencyKey)
  throw new ApiError('请求失败，重试次数耗尽', 500, 'RETRY_EXHAUSTED')
}
