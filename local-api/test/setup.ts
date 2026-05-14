import { execSync } from 'child_process'
import { existsSync, unlinkSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { initDatabase, getDatabase, closeDatabase } from '../store/sqlite'
import type { Database as DatabaseType } from 'better-sqlite3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TEST_DB_PATH = join(__dirname, '..', 'store', 'test.db')

function removeTestDb(): void {
  for (const suffix of ['', '-wal', '-shm']) {
    const p = `${TEST_DB_PATH}${suffix}`
    if (existsSync(p)) {
      unlinkSync(p)
    }
  }
}

beforeAll(async () => {
  process.env.TEST_DATABASE = 'true'

  removeTestDb()

  initDatabase()

  try {
    const schemaPath = join(__dirname, '..', '..', 'prisma', 'schema.prisma')
    execSync(
      `npx prisma db push --accept-data-loss --schema="${schemaPath}" --url="file:${TEST_DB_PATH}"`,
      {
        stdio: 'pipe',
      }
    )
  } catch (e) {
    console.warn('[Test Setup] prisma db push warning (non-fatal):', (e as Error).message)
  }

  seedTestData(getDatabase())
})

afterAll(() => {
  closeDatabase()
})

function tableExists(db: DatabaseType, tableName: string): boolean {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
    .get(tableName)
  return !!row
}

function seedTestData(db: DatabaseType): void {
  if (!tableExists(db, 'standards')) {
    console.warn('[Test Setup] standards 表不存在，跳过数据初始化（Prisma schema 可能未同步）')
    return
  }

  db.exec(`
    DELETE FROM standards;
    DELETE FROM standard_clauses;
    DELETE FROM standard_rules;
    DELETE FROM projects;
    DELETE FROM project_tasks;
  `)

  db.prepare(
    `
    INSERT INTO standards (code, name, brand, store_type, source_type, status, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `
  ).run('STD-001', '消防验收标准', '测试品牌', '标准店', 'brand', 'enabled')

  db.prepare(
    `
    INSERT INTO standard_clauses (standard_id, code, title, content, clause_type, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(1, 'CLS-001', '消防设备安装', '检查消防设备是否已安装', 'acceptance', 1)

  db.prepare(
    `
    INSERT INTO standard_clauses (standard_id, code, title, content, clause_type, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(1, 'CLS-002', '地砖缝隙', '地砖缝隙宽度不得超过3mm', 'execution', 2)

  db.prepare(
    `
    INSERT INTO standard_clauses (standard_id, code, title, content, clause_type, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(1, 'CLS-003', '墙面材料', '墙面材料必须是列表中的材料', 'acceptance', 3)

  db.prepare(
    `
    INSERT INTO standard_rules (clause_id, judge_type, param_config, description)
    VALUES (?, ?, ?, ?)
  `
  ).run(1, 'boolean', null, '消防设备是否已安装')

  db.prepare(
    `
    INSERT INTO standard_rules (clause_id, judge_type, param_config, description)
    VALUES (?, ?, ?, ?)
  `
  ).run(2, 'range', JSON.stringify({ max: 3, unit: 'mm' }), '地砖缝隙宽度')

  db.prepare(
    `
    INSERT INTO standard_rules (clause_id, judge_type, param_config, description)
    VALUES (?, ?, ?, ?)
  `
  ).run(3, 'enum', JSON.stringify({ allowed: ['涂料', '壁纸', '瓷砖'] }), '墙面材料')

  db.prepare(
    `
    INSERT INTO projects (code, name, brand, status, parent_status, status_tone, stage, planned_open_date, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `
  ).run('TEST-PRJ', '测试项目', '测试品牌', '执行中', '启动', 'neutral', '施工', '2026-06-01')

  db.prepare(
    `
    INSERT INTO project_tasks (project_id, code, name, status, created_by, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `
  ).run(1, 'TASK-001', '测试任务', '待执行', 'test')
}
