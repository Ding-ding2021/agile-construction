import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'
import { submitTask, reviewTask } from '../services/acceptanceWorkflow'
import { triggerProjectAggregation } from './projects'

function getProjectIdFromTask(taskId: number): number {
  const db = getDatabase()
  const row = db.prepare('SELECT project_id FROM project_tasks WHERE id = ?').get(taskId) as
    | { project_id: number }
    | undefined
  if (!row) throw new ApiError('Task not found', 'TASK_NOT_FOUND', 404)
  return row.project_id
}

function getProjectIdFromSubmission(subId: number): number {
  const db = getDatabase()
  const row = db
    .prepare(
      'SELECT pt.project_id FROM task_submissions ts JOIN project_tasks pt ON pt.id = ts.task_id WHERE ts.id = ?'
    )
    .get(subId) as { project_id: number } | undefined
  if (!row) throw new ApiError('Submission not found', 'NOT_FOUND', 404)
  return row.project_id
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
  const taskId = parseTaskId(req.params.taskId)
  const body = req.body

  const result = submitTask({
    taskId,
    submissionType: body.submissionType || 'normal',
    description: body.description || null,
    attachmentIds: body.attachmentIds,
    submittedBy: body.submittedBy || '系统',
  })

  try {
    triggerProjectAggregation(getProjectIdFromTask(taskId))
  } catch {
    /* non-blocking */
  }

  res.status(201).json({
    ...result.submission,
    attachmentIds: parseJsonField(result.submission.attachmentIds),
  })
}

export function reviewTaskSubmission(req: Request, res: Response, _next: NextFunction): void {
  const subId = parseInt(req.params.subId)
  const body = req.body

  if (!body.reviewResult || !['pass', 'reject'].includes(body.reviewResult)) {
    throw new ApiError('审核结果必须是 pass 或 reject', 'INVALID_REQUEST', 400)
  }

  const result = reviewTask({
    submissionId: subId,
    result: body.reviewResult,
    comment: body.reviewComment || '',
    reviewedBy: body.reviewedBy || '系统',
    createDerivedTask: body.createDerivedTask,
  })

  try {
    triggerProjectAggregation(getProjectIdFromSubmission(subId))
  } catch {
    /* non-blocking */
  }

  res.json({
    ...result,
    submission: {
      ...result.submission,
      attachmentIds: parseJsonField(result.submission.attachmentIds),
    },
  })
}
