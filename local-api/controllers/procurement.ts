import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'
import { triggerProjectAggregation } from './projects'

function getProjectIdByCode(code: string): number {
  const db = getDatabase()
  const row = db.prepare('SELECT id FROM projects WHERE code = ?').get(code) as
    | { id: number }
    | undefined
  if (!row) throw new ApiError('Project not found', 'PROJECT_NOT_FOUND', 404)
  return row.id
}

const ORDER_COLUMNS = [
  'id',
  'order_code as orderCode',
  'title',
  'project_code as projectCode',
  'supplier_id as supplierId',
  'category_id as categoryId',
  'quantity',
  'unit',
  'budget_amount as budgetAmount',
  'actual_amount as actualAmount',
  'status',
  'priority',
  'applicant',
  'applicant_name as applicantName',
  'assignee',
  'description',
  'task_code as taskCode',
  'expected_date as expectedDate',
  'delivered_date as deliveredDate',
  'remark',
  'is_deleted as isDeleted',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

export function getProcurements(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { search, title, status, priority, projectCode } = req.query

  let sql = `SELECT ${ORDER_COLUMNS} FROM procurement_orders WHERE is_deleted = 0`
  const params: unknown[] = []

  if (search) {
    sql += ' AND (title LIKE ? OR order_code LIKE ? OR applicant_name LIKE ?)'
    const q = `%${search}%`
    params.push(q, q, q)
  }
  if (title) {
    sql += ' AND title LIKE ?'
    params.push(`%${title}%`)
  }
  if (status) {
    sql += ' AND status = ?'
    params.push(status)
  }
  if (priority) {
    sql += ' AND priority = ?'
    params.push(priority)
  }
  if (projectCode) {
    sql += ' AND project_code = ?'
    params.push(projectCode)
  }

  sql += ' ORDER BY created_at DESC'

  const rows = db.prepare(sql).all(...params)
  res.json({ data: rows })
}

export function getProcurement(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const row = db.prepare(`SELECT ${ORDER_COLUMNS} FROM procurement_orders WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined

  if (!row) throw new ApiError('Procurement order not found', 'NOT_FOUND', 404)
  res.json(row)
}

export function createProcurement(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body

  if (
    !body.title ||
    !body.applicant ||
    !body.applicantName ||
    !body.projectCode ||
    !body.supplierId
  ) {
    throw new ApiError(
      'title, applicant, applicantName, projectCode, and supplierId are required',
      'VALIDATION_ERROR',
      400
    )
  }

  const count = db.prepare('SELECT COUNT(*) as c FROM procurement_orders').get() as { c: number }
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const orderCode = `PO-${datePart}-${String((count.c + 1) % 10000).padStart(4, '0')}`

  const now = new Date().toISOString()

  const result = db
    .prepare(
      `
      INSERT INTO procurement_orders (
        order_code, title, project_code, supplier_id, category_id,
        quantity, unit, budget_amount, actual_amount,
        status, priority, applicant, applicant_name, assignee,
        description, task_code, expected_date, delivered_date, remark,
        created_at, updated_at
      ) VALUES (
        @orderCode, @title, @projectCode, @supplierId, @categoryId,
        @quantity, @unit, @budgetAmount, @actualAmount,
        @status, @priority, @applicant, @applicantName, @assignee,
        @description, @taskCode, @expectedDate, @deliveredDate, @remark,
        @createdAt, @updatedAt
      )
    `
    )
    .run({
      orderCode,
      title: body.title,
      projectCode: body.projectCode,
      supplierId: body.supplierId,
      categoryId: body.categoryId ?? null,
      quantity: body.quantity ?? 1,
      unit: body.unit ?? '个',
      budgetAmount: body.budgetAmount ?? null,
      actualAmount: body.actualAmount ?? null,
      status: body.status ?? 'draft',
      priority: body.priority ?? 'medium',
      applicant: body.applicant,
      applicantName: body.applicantName,
      assignee: body.assignee ?? null,
      description: body.description ?? null,
      taskCode: body.taskCode ?? null,
      expectedDate: body.expectedDate ?? null,
      deliveredDate: body.deliveredDate ?? null,
      remark: body.remark ?? null,
      createdAt: now,
      updatedAt: now,
    })

  const created = db
    .prepare(`SELECT ${ORDER_COLUMNS} FROM procurement_orders WHERE id = ?`)
    .get(result.lastInsertRowid)

  try {
    triggerProjectAggregation(getProjectIdByCode(body.projectCode))
  } catch {
    /* non-blocking */
  }

  res.status(201).json(created)
}

export function updateProcurement(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const body = req.body

  const existing = db.prepare('SELECT id FROM procurement_orders WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Procurement order not found', 'NOT_FOUND', 404)

  const now = new Date().toISOString()

  db.prepare(
    `
    UPDATE procurement_orders SET
      title = COALESCE(@title, title),
      project_code = COALESCE(@projectCode, project_code),
      supplier_id = COALESCE(@supplierId, supplier_id),
      category_id = COALESCE(@categoryId, category_id),
      quantity = COALESCE(@quantity, quantity),
      unit = COALESCE(@unit, unit),
      budget_amount = COALESCE(@budgetAmount, budget_amount),
      actual_amount = COALESCE(@actualAmount, actual_amount),
      status = COALESCE(@status, status),
      priority = COALESCE(@priority, priority),
      applicant = COALESCE(@applicant, applicant),
      applicant_name = COALESCE(@applicantName, applicant_name),
      assignee = COALESCE(@assignee, assignee),
      description = COALESCE(@description, description),
      task_code = COALESCE(@taskCode, task_code),
      expected_date = COALESCE(@expectedDate, expected_date),
      delivered_date = COALESCE(@deliveredDate, delivered_date),
      remark = COALESCE(@remark, remark),
      updated_at = @updatedAt
    WHERE id = @id
  `
  ).run({
    id,
    title: body.title ?? null,
    projectCode: body.projectCode ?? null,
    supplierId: body.supplierId ?? null,
    categoryId: body.categoryId ?? null,
    quantity: body.quantity ?? null,
    unit: body.unit ?? null,
    budgetAmount: body.budgetAmount ?? null,
    actualAmount: body.actualAmount ?? null,
    status: body.status ?? null,
    priority: body.priority ?? null,
    applicant: body.applicant ?? null,
    applicantName: body.applicantName ?? null,
    assignee: body.assignee ?? null,
    description: body.description ?? null,
    taskCode: body.taskCode ?? null,
    expectedDate: body.expectedDate ?? null,
    deliveredDate: body.deliveredDate ?? null,
    remark: body.remark ?? null,
    updatedAt: now,
  })

  const updated = db.prepare(`SELECT ${ORDER_COLUMNS} FROM procurement_orders WHERE id = ?`).get(id)

  try {
    const projCode = body.projectCode || (existing as Record<string, unknown>).project_code
    if (projCode) triggerProjectAggregation(getProjectIdByCode(projCode as string))
  } catch {
    /* non-blocking */
  }

  res.json(updated)
}

export function deleteProcurement(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const now = new Date().toISOString()

  const existing = db.prepare('SELECT id FROM procurement_orders WHERE id = ?').get(id)
  if (!existing) throw new ApiError('Procurement order not found', 'NOT_FOUND', 404)

  db.prepare('UPDATE procurement_orders SET is_deleted = 1, updated_at = ? WHERE id = ?').run(
    now,
    id
  )

  res.json({ success: true })
}

export function getSuppliers(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const rows = db.prepare('SELECT id, code, name, category, contact, city FROM suppliers').all()
  res.json({ data: rows })
}
