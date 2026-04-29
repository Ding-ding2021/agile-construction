import type { Request, Response, NextFunction } from 'express'
import { checkIdempotencyKey, recordIdempotencyKey } from '../store/idempotency'

export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-idempotency-key'] as string | undefined
  if (!key || !['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    next()
    return
  }

  const envId = (req.query.envId as string) || 'default'
  const scope = req.path

  const existing = checkIdempotencyKey(key, envId, scope, req.body)
  if (existing.exists) {
    const body = existing.record.responseBody ? JSON.parse(existing.record.responseBody) : undefined
    res.status(existing.record.responseStatus).json(body)
    return
  }

  const originalJson = res.json.bind(res)
  res.json = function (body: unknown) {
    recordIdempotencyKey(key, envId, scope, req.body, res.statusCode, JSON.stringify(body))
    return originalJson(body)
  }

  next()
}
