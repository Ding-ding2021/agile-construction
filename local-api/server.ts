/**
 * 本地 HTTP API 服务 — Express 模式
 *
 * 迁移内容（2026-04-29）：
 * - 运行时：Express + better-sqlite3（Prisma 管理 Schema）
 * - 表结构由 prisma/schema.prisma 为 SSOT
 * - 旧 /state 兼容端点已删除
 * - 所有 handler 已拆分到 controllers/ 和 routes/
 */

import express from 'express'
import { initDatabase, closeDatabase, cleanupExpiredIdempotencyKeys } from './store/sqlite'
import { corsMiddleware } from './middleware/cors'
import { errorHandler } from './middleware/error'
import routes from './routes/index'

const PORT = process.env.LOCAL_API_PORT ? parseInt(process.env.LOCAL_API_PORT) : 3100
const app = express()

// Middleware
app.use(corsMiddleware)
app.use(express.json())

// Routes
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'entity' })
})
app.use('/api', routes)

// Error handling
app.use(errorHandler)

// Start
initDatabase()
cleanupExpiredIdempotencyKeys()

app.listen(PORT, () => {
  console.log(`[Local API] 服务已启动: http://localhost:${PORT}`)
  console.log(`[Local API] API 基础路径: http://localhost:${PORT}/api`)
  console.log(`[Local API] 健康检查: http://localhost:${PORT}/health`)
})

process.on('SIGINT', () => {
  console.log('\n[Local API] 正在关闭服务...')
  closeDatabase()
  process.exit(0)
})
