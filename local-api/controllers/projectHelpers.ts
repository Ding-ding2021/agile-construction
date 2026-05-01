import type { Request } from 'express'
import { ApiError } from '../middleware/error'

/**
 * Express 5.2 不传递 router.use() 的父路由 params 到子路由。
 * 从 originalUrl 中提取项目编码，适用于 /projects/:code/* 模式。
 * 匹配示例：/api/projects/DEMO-001/tasks → DEMO-001
 *            /api/projects/DEMO-001/logs   → DEMO-001
 */
export function extractProjectCode(req: Request): string {
  const match = req.originalUrl.match(/\/projects\/([^/?#]+?)(?:\/|$)/)
  if (!match) throw new ApiError('无法从 URL 提取项目编码', 'INVALID_URL', 400)
  return decodeURIComponent(match[1])
}
