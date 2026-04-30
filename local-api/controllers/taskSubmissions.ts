import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

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

function parseJsonField(val: unknown): unknown {
  if (!val) return val
  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch {
      return val
    }
  }
  return val
}

function parseTaskId(raw: string): number {
  const id = parseInt(raw)
  if (isNaN(id)) throw new ApiError('无效的任务 ID', 'INVALID_REQUEST', 400)
  return id
}

export function getTaskSubmissions(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = parseTaskId(req.params.taskId)

  const rows = db
    .prepare(
      `SELECT ${SUB_COLUMNS} FROM task_submissions WHERE task_id = ? ORDER BY submitted_at DESC`
    )
    .all(taskId) as Record<string, unknown>[]

  res.json(
    rows.map(r => ({
      ...r,
      attachmentIds: parseJsonField(r.attachmentIds),
    }))
  )
}

export function createTaskSubmission(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = parseTaskId(req.params.taskId)
  const body = req.body

  const stmt = db.prepare(`
    INSERT INTO task_submissions (task_id, submission_type, description, attachment_ids, status, submitted_by)
    VALUES (@taskId, @submissionType, @description, @attachmentIds, @status, @submittedBy)
  `)

  const result = stmt.run({
    taskId,
    submissionType: body.submissionType || 'normal',
    description: body.description || null,
    attachmentIds: body.attachmentIds ? JSON.stringify(body.attachmentIds) : null,
    status: 'submitted',
    submittedBy: body.submittedBy || '系统',
  })

  const created = db
    .prepare(`SELECT ${SUB_COLUMNS} FROM task_submissions WHERE id = ?`)
    .get(result.lastInsertRowid) as Record<string, unknown> | undefined

  res.status(201).json(
    created
      ? {
          ...created,
          attachmentIds: parseJsonField(created.attachmentIds),
        }
      : created
  )
}

export function reviewTaskSubmission(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const subId = parseInt(req.params.subId)
  const body = req.body
  const now = new Date().toISOString()

  if (!body.reviewResult || !['pass', 'reject'].includes(body.reviewResult)) {
    throw new ApiError('审核结果必须是 pass 或 reject', 'INVALID_REQUEST', 400)
  }

  const result = db
    .prepare(
      `
      UPDATE task_submissions
      SET status = CASE WHEN @reviewResult = 'pass' THEN 'accepted' ELSE 'rejected' END,
          reviewed_by = @reviewedBy,
          review_result = @reviewResult,
          review_comment = @reviewComment,
          reviewed_at = @reviewedAt
      WHERE id = @subId AND status = 'submitted'
    `
    )
    .run({
      subId,
      reviewResult: body.reviewResult,
      reviewedBy: body.reviewedBy || '系统',
      reviewComment: body.reviewComment || null,
      reviewedAt: now,
    })

  if (result.changes === 0) {
    throw new ApiError('提交记录不存在或已被审核', 'NOT_FOUND', 404)
  }

  const updated = db
    .prepare(`SELECT ${SUB_COLUMNS} FROM task_submissions WHERE id = ?`)
    .get(subId) as Record<string, unknown> | undefined

  res.json(
    updated
      ? {
          ...updated,
          attachmentIds: parseJsonField(updated.attachmentIds),
        }
      : updated
  )
}
