import { getDatabase } from '../store/sqlite'
import type { Database as DatabaseType } from 'better-sqlite3'

export function getTestDb(): DatabaseType {
  return getDatabase()
}

export function resetTestData(): void {
  const db = getTestDb()
  db.exec(`
    DELETE FROM standards;
    DELETE FROM standard_clauses;
    DELETE FROM standard_rules;
  `)
}

export function createTestProject(): string {
  const db = getTestDb()
  const code = `PRJ-${Date.now()}`
  db.prepare(
    "INSERT INTO projects (code, name, brand, status, parent_status, status_tone, stage, planned_open_date, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))"
  ).run(code, '测试项目', '测试品牌', '执行中', '启动', 'neutral', '施工', '2026-06-01')
  return code
}

export function createTestTask(projectCode: string, status = '待执行'): string {
  const db = getTestDb()
  const taskCode = `TASK-${Date.now()}`
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) throw new Error(`Project not found: ${projectCode}`)
  db.prepare(
    "INSERT INTO project_tasks (project_id, code, name, status, created_by, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'))"
  ).run(project.id, taskCode, '测试任务', status, 'test')
  return taskCode
}
