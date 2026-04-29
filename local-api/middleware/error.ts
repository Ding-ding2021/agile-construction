import type { Request, Response, NextFunction } from 'express'
import { createErrorResponse } from '../contracts'

export class ApiError extends Error {
  constructor(
    public override message: string,
    public code: string,
    public status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.status).json(createErrorResponse(err.message, err.code, err.status))
    return
  }

  console.error('[Error]', err.message)
  res.status(500).json(createErrorResponse('Internal server error', 'SERVER_ERROR', 500))
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json(createErrorResponse('Not found', 'NOT_FOUND', 404))
}
