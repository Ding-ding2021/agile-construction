import app from './app'
import { initDatabase, closeDatabase, cleanupExpiredIdempotencyKeys } from './store/sqlite'

const PORT = process.env.LOCAL_API_PORT ? parseInt(process.env.LOCAL_API_PORT) : 3100

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
