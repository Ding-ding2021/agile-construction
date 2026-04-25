/**
 * SQLite 数据库连接与初始化
 */

import { readFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import Database from 'better-sqlite3'
import type { Database as DatabaseType } from 'better-sqlite3'

const DB_PATH = join(process.cwd(), 'local-api', 'store', 'local.db')
const SCHEMA_PATH = join(process.cwd(), 'local-api', 'store', 'schema.sql')

let db: DatabaseType | null = null

/**
 * 初始化数据库连接与表结构
 */
export function initDatabase(): DatabaseType {
  if (db) {
    return db
  }

  // 确保目录存在
  const dbDir = dirname(DB_PATH)
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }

  // 创建数据库连接
  db = new Database(DB_PATH)

  // 启用 WAL 模式提升并发性能
  db.pragma('journal_mode = WAL')

  // 读取并执行 schema
  const schema = readFileSync(SCHEMA_PATH, 'utf-8')
  db.exec(schema)

  console.log('[SQLite] 数据库初始化完成:', DB_PATH)

  return db
}

/**
 * 获取数据库连接
 */
export function getDatabase(): DatabaseType {
  if (!db) {
    return initDatabase()
  }
  return db
}

/**
 * 关闭数据库连接
 */
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
    console.log('[SQLite] 数据库连接已关闭')
  }
}

/**
 * 清理过期幂等键（7天前）
 */
export function cleanupExpiredIdempotencyKeys(): number {
  const database = getDatabase()
  const result = database
    .prepare(
      `
    DELETE FROM idempotency_keys
    WHERE expired_at < datetime('now')
  `
    )
    .run()

  if (result.changes > 0) {
    console.log(`[SQLite] 清理过期幂等键: ${result.changes} 条`)
  }

  return result.changes
}

/**
 * 重置数据库（用于测试）
 */
export function resetDatabase(): void {
  const database = getDatabase()

  database.exec(`
    DELETE FROM project_state;
    DELETE FROM task_state;
    DELETE FROM acceptance_state;
    DELETE FROM settlement_state;
    DELETE FROM audit_logs;
    DELETE FROM idempotency_keys;
  `)

  console.log('[SQLite] 数据库已重置')
}
