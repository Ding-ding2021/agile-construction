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
    "INSERT INTO projects (code, name, brand, parent_status, stage, planned_open_date, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))"
  ).run(code, '测试项目', '测试品牌', '启动', '施工', '2026-06-01')
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

export function seedOrg(db: DatabaseType, id: number): void {
  db.prepare(
    "INSERT OR IGNORE INTO pm_organization (id, org_code, org_name, org_type, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).run(id, `ORG-${id}`, `组织${id}`, 1, 1)
}

export function seedPerson(
  db: DatabaseType,
  id: number,
  status: number,
  availability: number,
  title: string | null = null
): void {
  db.prepare(
    "INSERT OR IGNORE INTO pm_person (id, person_code, name, mobile, org_id, person_status, availability_status, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).run(
    id,
    `P-${id}`,
    `人员${id}`,
    `1380000${String(id).padStart(4, '0')}`,
    1,
    status,
    availability,
    title
  )
}

export function seedProject(db: DatabaseType, id: number): number {
  db.prepare(
    `INSERT INTO projects (id, code, name, brand, parent_status, stage, planned_open_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  ).run(id, `PROJ-${id}`, `项目${id}`, '测试品牌', '启动', '施工', '2026-06-01')
  return id
}

export function seedTask(
  db: DatabaseType,
  id: number,
  projectId: number,
  ownerRole: string | null = null
): number {
  db.prepare(
    `INSERT INTO project_tasks (id, project_id, code, name, status, owner_role, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  ).run(id, projectId, `TASK-${id}`, `任务${id}`, '执行中', ownerRole, 'test')
  return id
}

export function cleanPersonnelData(db: DatabaseType): void {
  const tables = [
    'pm_person_status_log',
    'pm_assignment_rel',
    'pm_person_role_rel',
    'pm_team_member_rel',
    'pm_person',
    'pm_team',
    'pm_role',
    'pm_organization',
    'project_tasks',
    'projects',
  ]
  for (const table of tables) {
    const exists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
      .get(table)
    if (exists) {
      db.prepare(`DELETE FROM ${table}`).run()
    }
  }
}
