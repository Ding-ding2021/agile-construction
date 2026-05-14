import { getDatabase } from '../store/sqlite'

export interface BindingResult {
  id: number
  taskId: number
  clauseId: number
  ruleId: number | null
  bindingType: string
  boundAt: string
  boundBy: string | null
}

const VALID_BINDING_TYPES = ['execution', 'acceptance']

const BINDING_COLUMNS = [
  'id',
  'task_id as taskId',
  'clause_id as clauseId',
  'rule_id as ruleId',
  'binding_type as bindingType',
  'bound_at as boundAt',
  'bound_by as boundBy',
].join(', ')

function rowToBinding(row: Record<string, unknown>): BindingResult {
  return {
    id: row.id as number,
    taskId: row.taskId as number,
    clauseId: row.clauseId as number,
    ruleId: (row.ruleId as number) ?? null,
    bindingType: row.bindingType as string,
    boundAt: row.boundAt as string,
    boundBy: (row.boundBy as string) ?? null,
  }
}

function lookupRuleId(clauseId: number): number | null {
  const db = getDatabase()
  const row = db
    .prepare('SELECT id FROM standard_rules WHERE clause_id = ? LIMIT 1')
    .get(clauseId) as { id: number } | undefined
  return row?.id ?? null
}

export function bindStandardsToTask(
  taskId: number,
  clauseIds: number[],
  bindingType: string,
  boundBy?: string
): BindingResult[] {
  if (!VALID_BINDING_TYPES.includes(bindingType)) {
    throw new Error(`无效的绑定类型: ${bindingType}，仅支持 execution 或 acceptance`)
  }

  const db = getDatabase()
  const now = new Date().toISOString()
  const results: BindingResult[] = []

  const checkStmt = db.prepare(
    'SELECT id FROM task_standard_bindings WHERE task_id = ? AND clause_id = ? AND binding_type = ?'
  )
  const insertStmt = db.prepare(
    'INSERT INTO task_standard_bindings (task_id, clause_id, rule_id, binding_type, bound_at, bound_by) VALUES (?, ?, ?, ?, ?, ?)'
  )

  const insertMany = db.transaction(() => {
    for (const clauseId of clauseIds) {
      const existing = checkStmt.get(taskId, clauseId, bindingType)
      if (existing) {
        throw new Error(`任务 ${taskId} 已绑定条款 ${clauseId}（类型: ${bindingType}）`)
      }

      const ruleId = lookupRuleId(clauseId)
      const info = insertStmt.run(taskId, clauseId, ruleId, bindingType, now, boundBy ?? null)
      results.push({
        id: info.lastInsertRowid as number,
        taskId,
        clauseId,
        ruleId,
        bindingType,
        boundAt: now,
        boundBy: boundBy ?? null,
      })
    }
  })

  insertMany()

  return results
}

export function unbindStandard(taskId: number, bindingId: number): void {
  const db = getDatabase()
  const existing = db
    .prepare('SELECT id FROM task_standard_bindings WHERE id = ? AND task_id = ?')
    .get(bindingId, taskId)
  if (!existing) {
    throw new Error(`绑定记录不存在: id=${bindingId}, taskId=${taskId}`)
  }
  db.prepare('DELETE FROM task_standard_bindings WHERE id = ?').run(bindingId)
}

export function getTaskBindings(taskId: number): BindingResult[] {
  const db = getDatabase()
  const rows = db
    .prepare(
      `SELECT ${BINDING_COLUMNS} FROM task_standard_bindings WHERE task_id = ? ORDER BY id ASC`
    )
    .all(taskId) as Record<string, unknown>[]
  return rows.map(rowToBinding)
}

export function checkBindingGuard(taskId: number): boolean {
  const db = getDatabase()
  const row = db.prepare('SELECT snapshot_status FROM project_tasks WHERE id = ?').get(taskId) as
    | { snapshot_status: string }
    | undefined
  if (!row) {
    throw new Error(`任务不存在: ${taskId}`)
  }
  return row.snapshot_status !== 'generated'
}

export function getStandardBindings(standardId: number): BindingResult[] {
  const db = getDatabase()
  const rows = db
    .prepare(
      `SELECT b.id, b.task_id as taskId, b.clause_id as clauseId, b.rule_id as ruleId,
              b.binding_type as bindingType, b.bound_at as boundAt, b.bound_by as boundBy
       FROM task_standard_bindings b
       INNER JOIN standard_clauses c ON c.id = b.clause_id
       WHERE c.standard_id = ?
       ORDER BY b.id ASC`
    )
    .all(standardId) as Record<string, unknown>[]
  return rows.map(rowToBinding)
}
