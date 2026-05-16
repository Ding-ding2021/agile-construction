import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

export interface SubmitInput {
  taskId: number
  submissionType: 'normal' | 'rectification' | 'supplement'
  description?: string
  attachmentIds?: string[]
  submittedBy: string
}

export interface ReviewInput {
  submissionId: number
  result: 'pass' | 'reject'
  comment: string
  reviewedBy: string
  createDerivedTask?: boolean
}

export interface SubmitResult {
  submission: Record<string, unknown>
  taskStatus: string
}

export interface ReviewResult {
  submission: Record<string, unknown>
  taskStatus: string
  derivedTask?: Record<string, unknown>
}

const SUB_COLUMNS = [
  'id',
  'task_id as taskId',
  'submission_type as submissionType',
  'description',
  'attachment_ids as attachmentIds',
  'status',
  'submitted_by as submittedBy',
  'submitted_at as submittedAt',
  'reviewed_by as reviewedBy',
  'review_result as reviewResult',
  'review_comment as reviewComment',
  'reviewed_at as reviewedAt',
].join(', ')

export function submitTask(input: SubmitInput): SubmitResult {
  const db = getDatabase()

  const task = db.prepare('SELECT id, status, project_id, name FROM project_tasks WHERE id = ?').get(input.taskId) as
    | { id: number; status: string; project_id: number; name: string }
    | undefined
  if (!task) {
    throw new ApiError('任务不存在', 'TASK_NOT_FOUND', 404)
  }

  if (task.status !== '执行中') {
    throw new ApiError('只有执行中的任务才能提交验收', 'INVALID_STATUS', 400)
  }

  const blockers = db
    .prepare(
      `SELECT COUNT(*) as cnt FROM task_relations r
       JOIN project_tasks ft ON ft.id = r.from_task_id
       WHERE r.to_task_id = ? AND r.relation_type = 'finish_start'
       AND ft.status NOT IN ('已完成', '已关闭')`
    )
    .get(input.taskId) as { cnt: number }
  if (blockers.cnt > 0) {
    throw new ApiError('存在未完成的前置任务', 'PREDECESSORS_NOT_DONE', 400)
  }

  const now = new Date().toISOString()
  let submission: Record<string, unknown> = {}
  let taskStatus = ''

  const insert = db.transaction(() => {
    const insertSub = db
      .prepare(
        `INSERT INTO task_submissions (task_id, submission_type, description, attachment_ids, status, submitted_by, submitted_at)
         VALUES (?, ?, ?, ?, 'submitted', ?, ?)`
      )
      .run(
        input.taskId,
        input.submissionType,
        input.description || null,
        input.attachmentIds ? JSON.stringify(input.attachmentIds) : null,
        input.submittedBy,
        now
      )

    submission = db
      .prepare(`SELECT ${SUB_COLUMNS} FROM task_submissions WHERE id = ?`)
      .get(insertSub.lastInsertRowid) as Record<string, unknown>

    db.prepare('UPDATE project_tasks SET status = ?, updated_at = ? WHERE id = ?').run('待验收', now, input.taskId)

    taskStatus = '待验收'

    db.prepare(
      `INSERT INTO task_event_logs (task_id, event_type, event_action, before_value, after_value, operator_id, operator_source, created_at)
       VALUES (?, 'status_change', ?, ?, ?, ?, 'user', ?)`
    ).run(
      input.taskId,
      'SUBMIT-' + Date.now(),
      JSON.stringify({ status: '执行中' }),
      JSON.stringify({ status: '待验收' }),
      input.submittedBy,
      now
    )
  })

  insert()

  return { submission, taskStatus }
}

export function reviewTask(input: ReviewInput): ReviewResult {
  const db = getDatabase()

  if (input.result === 'reject' && !input.comment) {
    throw new ApiError('退回时必须填写原因', 'REVIEW_COMMENT_REQUIRED', 400)
  }

  const submission = db
    .prepare(`SELECT ${SUB_COLUMNS}, task_id FROM task_submissions WHERE id = ? AND status = 'submitted'`)
    .get(input.submissionId) as (Record<string, unknown> & { taskId: number }) | undefined
  if (!submission) {
    throw new ApiError('提交记录不存在或已被审核', 'NOT_FOUND', 404)
  }

  const task = db.prepare('SELECT id, status, project_id, name FROM project_tasks WHERE id = ?').get(submission.taskId) as
    | { id: number; status: string; project_id: number; name: string }
    | undefined
  if (!task) {
    throw new ApiError('任务不存在', 'TASK_NOT_FOUND', 404)
  }

  const now = new Date().toISOString()
  const newStatus = input.result === 'pass' ? '已完成' : '不通过'
  let updatedSubmission: Record<string, unknown> = {}
  let derivedTaskResult: Record<string, unknown> | undefined

  const run = db.transaction(() => {
    db.prepare(
      `UPDATE task_submissions
       SET status = CASE WHEN ? = 'pass' THEN 'accepted' ELSE 'rejected' END,
           reviewed_by = ?,
           review_result = ?,
           review_comment = ?,
           reviewed_at = ?
       WHERE id = ?`
    ).run(input.result, input.reviewedBy, input.result, input.comment, now, input.submissionId)

    updatedSubmission = db
      .prepare(`SELECT ${SUB_COLUMNS} FROM task_submissions WHERE id = ?`)
      .get(input.submissionId) as Record<string, unknown>

    db.prepare('UPDATE project_tasks SET status = ?, updated_at = ? WHERE id = ?').run(newStatus, now, task.id)

    if (input.result === 'reject' && input.createDerivedTask) {
      const derivedCode = 'R-' + Date.now()
      db.prepare(
        `INSERT INTO project_tasks (project_id, code, name, status, source_type, is_rectification, derived_from_task_id, rectification_reason, created_by, created_at, updated_at)
         VALUES (?, ?, ?, '待分配', 'derived', 1, ?, ?, ?, ?, ?)`
      ).run(task.project_id, derivedCode, '整改-' + task.name, task.id, input.comment, input.reviewedBy, now, now)

      derivedTaskResult = db
        .prepare(
          `SELECT id, project_id as projectId, code, name, status, source_type as sourceType, is_rectification as isRectification, derived_from_task_id as derivedFromTaskId, rectification_reason as rectificationReason FROM project_tasks WHERE code = ?`
        )
        .get(derivedCode) as Record<string, unknown>
    }

    db.prepare(
      `INSERT INTO task_event_logs (task_id, event_type, event_action, before_value, after_value, operator_id, operator_source, created_at)
       VALUES (?, 'status_change', ?, ?, ?, ?, 'user', ?)`
    ).run(
      task.id,
      'REVIEW-' + Date.now(),
      JSON.stringify({ status: submission.status }),
      JSON.stringify({ status: newStatus }),
      input.reviewedBy,
      now
    )
  })

  run()

  const result: ReviewResult = { submission: updatedSubmission, taskStatus: newStatus }
  if (derivedTaskResult) {
    result.derivedTask = derivedTaskResult
  }
  return result
}
