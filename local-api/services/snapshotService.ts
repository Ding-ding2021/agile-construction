import { getDatabase } from '../store/sqlite'

export interface SnapshotResult {
  id: number
  standardId: number
  clauseId: number | null
  ruleId: number | null
  taskId: number
  standardName: string
  clauseCode: string
  clauseTitle: string
  clauseContent: string | null
  ruleJudgeType: string | null
  ruleParamConfig: string | null
  generatedAt: string
  triggerSource: string
}

function mapRow(row: Record<string, unknown>): SnapshotResult {
  return {
    id: row.id as number,
    standardId: row.standard_id as number,
    clauseId: (row.clause_id as number) ?? null,
    ruleId: (row.rule_id as number) ?? null,
    taskId: row.task_id as number,
    standardName: row.standard_name as string,
    clauseCode: row.clause_code as string,
    clauseTitle: row.clause_title as string,
    clauseContent: (row.clause_content as string) ?? null,
    ruleJudgeType: (row.rule_judge_type as string) ?? null,
    ruleParamConfig: (row.rule_param_config as string) ?? null,
    generatedAt: row.generated_at as string,
    triggerSource: row.trigger_source as string,
  }
}

const SELECT_SNAPSHOT_SQL = `
  SELECT
    id, standard_id, clause_id, rule_id, task_id,
    standard_name, clause_code, clause_title, clause_content,
    rule_judge_type, rule_param_config, generated_at, trigger_source
  FROM standard_snapshots
`

function querySnapshots(sql: string, ...params: unknown[]): SnapshotResult[] {
  const db = getDatabase()
  const rows = db.prepare(sql).all(...params) as Record<string, unknown>[]
  return rows.map(mapRow)
}

function querySnapshot(sql: string, ...params: unknown[]): SnapshotResult | null {
  const db = getDatabase()
  const row = db.prepare(sql).get(...params) as Record<string, unknown> | undefined
  return row ? mapRow(row) : null
}

export function generateSnapshots(
  taskId: number,
  triggerSource: string = 'status_change'
): SnapshotResult[] {
  const db = getDatabase()

  const bindings = db
    .prepare(
      `
      SELECT clause_id, rule_id
      FROM task_standard_bindings
      WHERE task_id = ?
    `
    )
    .all(taskId) as { clause_id: number; rule_id: number | null }[]

  if (bindings.length === 0) {
    return []
  }

  const snapshotVersion = new Date().toISOString()
  const snapshots: SnapshotResult[] = []

  const insertStmt = db.prepare(`
    INSERT INTO standard_snapshots (
      standard_id, clause_id, rule_id, task_id,
      snapshot_version, standard_name, clause_code, clause_title,
      clause_content, rule_judge_type, rule_param_config,
      generated_by, trigger_source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'system', ?)
  `)

  const checkExist = db.prepare(`
    SELECT COUNT(*) AS cnt FROM standard_snapshots
    WHERE task_id = ? AND clause_id = ?
  `)

  const getClause = db.prepare(`
    SELECT sc.standard_id, sc.code, sc.title, sc.content, s.name AS standard_name
    FROM standard_clauses sc
    JOIN standards s ON s.id = sc.standard_id
    WHERE sc.id = ?
  `)

  const getRule = db.prepare(`
    SELECT judge_type, param_config
    FROM standard_rules
    WHERE id = ?
  `)

  const getLastSnapshot = db.prepare(`
    ${SELECT_SNAPSHOT_SQL}
    WHERE task_id = ? AND clause_id = ?
    ORDER BY id DESC LIMIT 1
  `)

  const generate = db.transaction(() => {
    for (const binding of bindings) {
      const existing = checkExist.get(taskId, binding.clause_id) as { cnt: number }
      if (existing.cnt > 0) {
        const row = getLastSnapshot.get(taskId, binding.clause_id) as
          | Record<string, unknown>
          | undefined
        if (row) {
          snapshots.push(mapRow(row))
        }
        continue
      }

      const clause = getClause.get(binding.clause_id) as
        | {
            standard_id: number
            code: string
            title: string
            content: string | null
            standard_name: string
          }
        | undefined

      if (!clause) {
        continue
      }

      let ruleJudgeType: string | null = null
      let ruleParamConfig: string | null = null

      if (binding.rule_id) {
        const rule = getRule.get(binding.rule_id) as
          | { judge_type: string; param_config: string | null }
          | undefined
        if (rule) {
          ruleJudgeType = rule.judge_type
          ruleParamConfig = rule.param_config
        }
      }

      insertStmt.run(
        clause.standard_id,
        binding.clause_id,
        binding.rule_id,
        taskId,
        snapshotVersion,
        clause.standard_name,
        clause.code,
        clause.title,
        clause.content,
        ruleJudgeType,
        ruleParamConfig,
        triggerSource
      )

      const inserted = getLastSnapshot.get(taskId, binding.clause_id) as Record<string, unknown>
      snapshots.push(mapRow(inserted))
    }
  })

  generate()

  if (snapshots.length > 0) {
    db.prepare(
      `
      UPDATE project_tasks
      SET snapshot_status = 'generated',
          standard_binding_status = 'snapshotted'
      WHERE id = ?
    `
    ).run(taskId)
  }

  return snapshots
}

export function getTaskSnapshots(taskId: number): SnapshotResult[] {
  return querySnapshots(`${SELECT_SNAPSHOT_SQL} WHERE task_id = ? ORDER BY id ASC`, taskId)
}

export function getSnapshotById(snapshotId: number): SnapshotResult | null {
  return querySnapshot(`${SELECT_SNAPSHOT_SQL} WHERE id = ?`, snapshotId)
}

export function getSnapshotsByStandard(standardId: number): SnapshotResult[] {
  return querySnapshots(`${SELECT_SNAPSHOT_SQL} WHERE standard_id = ? ORDER BY id ASC`, standardId)
}
