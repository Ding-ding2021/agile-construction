/**
 * Phase 6C — 阶段 3：V2 状态迁移脚本
 *
 * 将现有项目的旧 `status` 值映射到新维度系统（parentStatus + 各维度状态 + 健康度）。
 * 幂等设计：通过 `_migrations` 表记录已应用的迁移，重复运行自动跳过。
 *
 * 用法：tsx local-api/migrations/migrate-v2-status.ts
 */

import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { getDatabase } from '../store/sqlite'
import { aggregateProjectStatus } from '../services/projectAggregator'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MIGRATION_NAME = 'v2_status_migration'

function getDbPath(): string {
  return process.env.TEST_DATABASE === 'true'
    ? join(__dirname, '..', 'store', 'test.db')
    : join(__dirname, '..', 'store', 'prisma.db')
}

function backupDatabase(dbPath: string): string {
  const backupDir = join(__dirname, '..', 'store', 'backups')
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = join(backupDir, `pre-migration-v2-status-${timestamp}.db`)

  copyFileSync(dbPath, backupPath)
  console.log(`[迁移] 数据库备份完成: ${backupPath}`)
  return backupPath
}

const STATUS_MAP: Record<string, string> = {
  待立项: '启动',
  待确认: '启动',
  待拆解: '计划',
  执行中: '执行',
  整改中: '执行',
  待验收: '监控',
  待结算: '收尾',
  已归档: '收尾',
  已中止: '收尾',
}

function ensureMigrationsTable(): void {
  const db = getDatabase()
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now')),
      checksum TEXT
    )
  `)
}

function isMigrationApplied(): boolean {
  const db = getDatabase()
  const row = db.prepare('SELECT name FROM _migrations WHERE name = ?').get(MIGRATION_NAME)
  return row !== undefined
}

function markMigrationApplied(): void {
  const db = getDatabase()
  db.prepare(
    "INSERT OR REPLACE INTO _migrations (name, applied_at) VALUES (?, datetime('now'))"
  ).run(MIGRATION_NAME)
}

function migrateProjects(): void {
  const db = getDatabase()

  const projects = db
    .prepare(
      `
    SELECT id, code, status, parent_status as parentStatus
    FROM projects
    WHERE status IS NOT NULL AND status != ''
  `
    )
    .all() as Array<{ id: number; code: string; status: string; parentStatus: string }>

  console.log(`[迁移] 找到 ${projects.length} 个需要迁移的项目`)

  for (const project of projects) {
    const mappedStatus = STATUS_MAP[project.status]
    if (mappedStatus) {
      if (project.parentStatus === '启动' || !project.parentStatus) {
        db.prepare('UPDATE projects SET parent_status = ? WHERE id = ?').run(
          mappedStatus,
          project.id
        )
        console.log(
          `  [${project.code}] status="${project.status}" → parentStatus="${mappedStatus}"`
        )
      } else {
        console.log(`  [${project.code}] parentStatus 已有值 "${project.parentStatus}"，跳过映射`)
      }
    } else {
      console.log(
        `  [${project.code}] status="${project.status}" 无映射规则，保持当前 parentStatus="${project.parentStatus}"`
      )
    }
  }
}

function recalculateAllDimensions(): void {
  const db = getDatabase()

  const allProjects = db.prepare('SELECT id, code FROM projects').all() as Array<{
    id: number
    code: string
  }>
  console.log(`[迁移] 重新计算 ${allProjects.length} 个项目的全维度状态`)

  for (const project of allProjects) {
    try {
      const aggregation = aggregateProjectStatus(project.id)
      db.prepare(
        `
        UPDATE projects SET
          parent_status = @parentStatus,
          execution_status = @executionStatus,
          acceptance_status = @acceptanceStatus,
          settlement_status = @settlementStatus,
          dispatch_status = @dispatchStatus,
          health_status = @healthStatus,
          progress = @progress,
          pending_dispatch_count = @pendingDispatch,
          pending_execution_count = @pendingExecution,
          pending_acceptance_count = @pendingAcceptance,
          pending_settlement_count = @pendingSettlement,
          updated_at = datetime('now')
        WHERE id = @id
      `
      ).run({
        id: project.id,
        parentStatus: aggregation.parentStatus,
        executionStatus: aggregation.executionStatus,
        acceptanceStatus: aggregation.acceptanceStatus,
        settlementStatus: aggregation.settlementStatus,
        dispatchStatus: aggregation.dispatchStatus,
        healthStatus: aggregation.health.status,
        progress: aggregation.progress,
        pendingDispatch: aggregation.pendingCounts.dispatch,
        pendingExecution: aggregation.pendingCounts.execution,
        pendingAcceptance: aggregation.pendingCounts.acceptance,
        pendingSettlement: aggregation.pendingCounts.settlement,
      })
      console.log(
        `  [${project.code}] parentStatus=${aggregation.parentStatus}, health=${aggregation.health.status}`
      )
    } catch (err) {
      console.error(`  [${project.code}] 聚合失败:`, err)
    }
  }
}

function main(): void {
  console.log('='.repeat(60))
  console.log('  Phase 6C — V2 状态迁移脚本')
  console.log('='.repeat(60))

  ensureMigrationsTable()

  if (isMigrationApplied()) {
    console.log('[迁移] 已执行过，跳过（幂等保护）')
    console.log(
      "[迁移] 如需重新执行，请执行: DELETE FROM _migrations WHERE name = 'v2_status_migration';"
    )
    return
  }

  const dbPath = getDbPath()
  console.log(`[迁移] 数据库路径: ${dbPath}`)

  if (!existsSync(dbPath)) {
    console.error('[迁移] 错误: 数据库文件不存在，请先初始化数据库')
    process.exit(1)
  }

  backupDatabase(dbPath)

  migrateProjects()
  recalculateAllDimensions()
  markMigrationApplied()

  console.log('[迁移] 完成!')
}

main()
