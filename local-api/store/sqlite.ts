/**
 * SQLite 数据库连接与初始化
 */

import { existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'
import type { Database as DatabaseType } from 'better-sqlite3'

// schema.sql 已删除，表结构由 prisma db push 管理

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let db: DatabaseType | null = null

function getDbPath(): string {
  return process.env.TEST_DATABASE === 'true'
    ? join(__dirname, 'test.db')
    : join(__dirname, 'prisma.db')
}

/**
 * 初始化数据库连接与表结构
 */
export function initDatabase(): DatabaseType {
  if (db) {
    return db
  }

  const DB_PATH = getDbPath()

  // 确保目录存在
  const dbDir = dirname(DB_PATH)
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }

  // 创建数据库连接
  db = new Database(DB_PATH)

  // 启用 WAL 模式提升并发性能
  db.pragma('journal_mode = WAL')
  // 启用外键约束，确保级联删除等操作生效
  db.pragma('foreign_keys = ON')

  // 飞书消息队列表
  db.exec(`
    CREATE TABLE IF NOT EXISTS feishu_messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL DEFAULT '',
      user_id TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      msg_type TEXT NOT NULL DEFAULT 'private',
      status TEXT NOT NULL DEFAULT 'pending',
      source TEXT NOT NULL DEFAULT 'feishu',
      reply_content TEXT,
      created_at TEXT NOT NULL DEFAULT '',
      processed_at TEXT
    )
  `)

  // 飞书心跳表
  db.exec(`
    CREATE TABLE IF NOT EXISTS feishu_heartbeat (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL DEFAULT 'trae',
      updated_at TEXT NOT NULL DEFAULT ''
    )
  `)

  console.log('[SQLite] 数据库连接成功:', DB_PATH)

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
    db.pragma('wal_checkpoint(TRUNCATE)')
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
    DELETE FROM project_status_logs;
    DELETE FROM project_members;
    DELETE FROM project_risks;
    DELETE FROM project_tasks;
    DELETE FROM project_milestones;
    DELETE FROM project_phases;
    DELETE FROM projects;
    DELETE FROM audit_logs;
    DELETE FROM idempotency_keys;
  `)

  console.log('[SQLite] 数据库已重置')
}
