import { initDatabase, getDatabase, closeDatabase } from './store/sqlite'

initDatabase()
const db = getDatabase()
const now = new Date().toISOString()

db.prepare(`DELETE FROM wbs_nodes`).run()

const insertStmt = db.prepare(`
  INSERT INTO wbs_nodes (project_code, wbs_code, name, node_level, status, progress, planned_start, planned_end, duration, assignee, parent_id, sort_order, dependencies, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const result1 = insertStmt.run(
  'P001',
  'WBS-001',
  '店面装修',
  'workPackage',
  'in_progress',
  35,
  '2026-05-01',
  '2026-06-30',
  60,
  '张三',
  null,
  1,
  null,
  now,
  now
)
const parentId1 = result1.lastInsertRowid

const result2 = insertStmt.run(
  'P001',
  'WBS-002',
  '地面铺装',
  'task',
  'in_progress',
  50,
  '2026-05-05',
  '2026-05-25',
  20,
  '李四',
  parentId1,
  1,
  null,
  now,
  now
)
const wbs2Id = result2.lastInsertRowid

insertStmt.run(
  'P001',
  'WBS-003',
  '墙面施工',
  'subtask',
  'pending',
  0,
  '2026-05-28',
  '2026-06-15',
  18,
  '王五',
  parentId1,
  2,
  String(wbs2Id),
  now,
  now
)
insertStmt.run(
  'P001',
  'WBS-004',
  '设备采购安装',
  'workPackage',
  'pending',
  0,
  '2026-07-01',
  '2026-08-15',
  45,
  '赵六',
  null,
  2,
  null,
  now,
  now
)

console.log('WBS 种子数据已插入')
closeDatabase()
