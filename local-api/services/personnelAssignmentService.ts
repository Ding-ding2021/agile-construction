import type { Database as DatabaseType } from 'better-sqlite3'

export interface CanAssignResult {
  ok: boolean
  reasons: string[]
}

export function canAssign(db: DatabaseType, personId: number, taskId: number): CanAssignResult {
  const reasons: string[] = []

  const person = db
    .prepare(
      'SELECT person_status, availability_status, title FROM pm_person WHERE id = ? AND is_deleted = 0'
    )
    .get(personId) as
    | { person_status: number; availability_status: number; title: string | null }
    | undefined

  if (!person) {
    reasons.push('人员不存在')
    return { ok: false, reasons }
  }

  if (person.person_status !== 1) {
    reasons.push('人员当前不在岗')
  }

  if (person.availability_status !== 1) {
    reasons.push('人员当前不可分配')
  }

  if (reasons.length > 0) {
    return { ok: false, reasons }
  }

  const task = db.prepare('SELECT owner_role FROM project_tasks WHERE id = ?').get(taskId) as
    | { owner_role: string | null }
    | undefined

  if (!task) {
    reasons.push('任务不存在')
    return { ok: false, reasons }
  }

  if (task.owner_role) {
    const roleMatch =
      person.title === task.owner_role ||
      db
        .prepare(
          `SELECT 1 FROM pm_person_role_rel pr
           JOIN pm_role r ON r.id = pr.role_id
           WHERE pr.person_id = ? AND (r.role_name = ? OR r.role_code = ?)
           LIMIT 1`
        )
        .get(personId, task.owner_role, task.owner_role)

    if (!roleMatch) {
      reasons.push(`人员角色不匹配，任务需要 ${task.owner_role} 角色`)
    }
  }

  const loadCount = db
    .prepare(
      `SELECT COUNT(*) as cnt FROM pm_assignment_rel
       WHERE person_id = ? AND status = 1`
    )
    .get(personId) as { cnt: number }

  if (loadCount.cnt >= 5) {
    reasons.push(`当前负载 ${loadCount.cnt} 个任务，超过阈值 5 个`)
  }

  return { ok: reasons.length === 0, reasons }
}

export function unassign(
  db: DatabaseType,
  relationId: number,
  operatorId: string,
  reason: string
): void {
  db.prepare(
    `UPDATE pm_assignment_rel
     SET status = 2, change_reason = ?, updated_by = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(reason, operatorId, relationId)
}

export function reassign(
  db: DatabaseType,
  oldRelationId: number,
  newPersonId: number,
  operatorId: string,
  reason: string
): void {
  const oldRel = db
    .prepare(
      'SELECT source_type, source_id, relation_role, person_id FROM pm_assignment_rel WHERE id = ? AND status = 1'
    )
    .get(oldRelationId) as
    | {
        source_type: number
        source_id: number
        relation_role: number
        person_id: number
      }
    | undefined

  if (!oldRel) {
    return
  }

  unassign(db, oldRelationId, operatorId, reason)

  const relationCode = 'ASN-' + Date.now()

  db.prepare(
    `INSERT INTO pm_assignment_rel
     (relation_code, source_type, source_id, person_id, relation_role,
      replace_from_person_id, change_reason, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  ).run(
    relationCode,
    oldRel.source_type,
    oldRel.source_id,
    newPersonId,
    oldRel.relation_role,
    oldRel.person_id,
    reason,
    operatorId
  )
}
