import type { Request, Response } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const STD_COLUMNS = [
  'id',
  'code',
  'name',
  'brand',
  'store_type as storeType',
  'source_type as sourceType',
  'status',
  'is_deleted as isDeleted',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

const CLAUSE_COLUMNS = [
  'id',
  'standard_id as standardId',
  'code',
  'title',
  'content',
  'clause_type as clauseType',
  'sort_order as sortOrder',
].join(', ')

const RULE_COLUMNS = [
  'id',
  'clause_id as clauseId',
  'judge_type as judgeType',
  'param_config as paramConfig',
  'description',
].join(', ')

// ─── Standards ───────────────────────────────────────────────

export function getStandards(req: Request, res: Response): void {
  const db = getDatabase()
  const { search, brand, storeType, sourceType, status } = req.query
  let sql = `SELECT ${STD_COLUMNS} FROM standards WHERE is_deleted = 0`
  const params: unknown[] = []

  if (search) {
    sql += ' AND (name LIKE ? OR code LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }
  if (brand) {
    sql += ' AND brand = ?'
    params.push(brand)
  }
  if (storeType) {
    sql += ' AND store_type = ?'
    params.push(storeType)
  }
  if (sourceType) {
    sql += ' AND source_type = ?'
    params.push(sourceType)
  }
  if (status) {
    sql += ' AND status = ?'
    params.push(status)
  }

  sql += ' ORDER BY created_at DESC'
  const rows = db.prepare(sql).all(...params)
  res.json({ data: rows })
}

export function getStandard(req: Request, res: Response): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const row = db.prepare(`SELECT ${STD_COLUMNS} FROM standards WHERE id = ?`).get(id)
  if (!row) throw new ApiError('Standard not found', 'NOT_FOUND', 404)
  res.json(row)
}

export function createStandard(req: Request, res: Response): void {
  const db = getDatabase()
  const body = req.body
  if (!body.name || !body.sourceType) {
    throw new ApiError('name and sourceType are required', 'VALIDATION_ERROR', 400)
  }
  const count = db.prepare('SELECT COUNT(*) as c FROM standards').get() as { c: number }
  const code = body.code || `STD-${String(count.c + 1).padStart(4, '0')}`
  const now = new Date().toISOString()

  const result = db
    .prepare(
      `
    INSERT INTO standards (code, name, brand, store_type, source_type, status, created_at)
    VALUES (@code, @name, @brand, @storeType, @sourceType, @status, @createdAt)
  `
    )
    .run({
      code,
      name: body.name,
      brand: body.brand || null,
      storeType: body.storeType || null,
      sourceType: body.sourceType,
      status: body.status || 'active',
      createdAt: now,
    })

  const created = db
    .prepare(`SELECT ${STD_COLUMNS} FROM standards WHERE id = ?`)
    .get(result.lastInsertRowid)
  res.status(201).json(created)
}

export function updateStandard(req: Request, res: Response): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const existing = db.prepare(`SELECT id FROM standards WHERE id = ?`).get(id)
  if (!existing) throw new ApiError('Standard not found', 'NOT_FOUND', 404)
  const body = req.body

  db.prepare(
    `
    UPDATE standards SET name = COALESCE(?, name), brand = COALESCE(?, brand),
      store_type = COALESCE(?, store_type), source_type = COALESCE(?, source_type),
      status = COALESCE(?, status)
    WHERE id = ?
  `
  ).run(
    body.name ?? null,
    body.brand ?? null,
    body.storeType ?? null,
    body.sourceType ?? null,
    body.status ?? null,
    id
  )

  const updated = db.prepare(`SELECT ${STD_COLUMNS} FROM standards WHERE id = ?`).get(id)
  res.json(updated)
}

export function deleteStandard(req: Request, res: Response): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const existing = db.prepare(`SELECT id FROM standards WHERE id = ?`).get(id)
  if (!existing) throw new ApiError('Standard not found', 'NOT_FOUND', 404)
  db.prepare('UPDATE standards SET is_deleted = 1 WHERE id = ?').run(id)
  res.json({ success: true })
}

// ─── Clauses ────────────────────────────────────────────────

export function getClauses(req: Request, res: Response): void {
  const db = getDatabase()
  const standardId = Number(req.params.id)
  const rows = db
    .prepare(
      `SELECT ${CLAUSE_COLUMNS} FROM standard_clauses WHERE standard_id = ? ORDER BY sort_order ASC`
    )
    .all(standardId)
  res.json({ data: rows })
}

export function createClause(req: Request, res: Response): void {
  const db = getDatabase()
  const standardId = Number(req.params.id)
  const body = req.body
  if (!body.title) throw new ApiError('title is required', 'VALIDATION_ERROR', 400)

  const count = db
    .prepare('SELECT COUNT(*) as c FROM standard_clauses WHERE standard_id = ?')
    .get(standardId) as { c: number }
  const code = body.code || `CL-${String(count.c + 1).padStart(3, '0')}`

  const result = db
    .prepare(
      `
    INSERT INTO standard_clauses (standard_id, code, title, content, clause_type, sort_order)
    VALUES (@standardId, @code, @title, @content, @clauseType, @sortOrder)
  `
    )
    .run({
      standardId,
      code,
      title: body.title,
      content: body.content || null,
      clauseType: body.clauseType || 'execution',
      sortOrder: body.sortOrder ?? 0,
    })

  const created = db
    .prepare(`SELECT ${CLAUSE_COLUMNS} FROM standard_clauses WHERE id = ?`)
    .get(result.lastInsertRowid)
  res.status(201).json(created)
}

export function updateClause(req: Request, res: Response): void {
  const db = getDatabase()
  const id = Number(req.params.clauseId)
  const body = req.body
  const existing = db.prepare(`SELECT id FROM standard_clauses WHERE id = ?`).get(id)
  if (!existing) throw new ApiError('Clause not found', 'NOT_FOUND', 404)

  db.prepare(
    `
    UPDATE standard_clauses SET title = COALESCE(?, title), content = COALESCE(?, content),
      clause_type = COALESCE(?, clause_type), sort_order = COALESCE(?, sort_order)
    WHERE id = ?
  `
  ).run(
    body.title ?? null,
    body.content ?? null,
    body.clauseType ?? null,
    body.sortOrder ?? null,
    id
  )

  const updated = db.prepare(`SELECT ${CLAUSE_COLUMNS} FROM standard_clauses WHERE id = ?`).get(id)
  res.json(updated)
}

export function deleteClause(req: Request, res: Response): void {
  const db = getDatabase()
  const id = Number(req.params.clauseId)
  db.prepare('DELETE FROM standard_clauses WHERE id = ?').run(id)
  res.json({ success: true })
}

// ─── Rules ──────────────────────────────────────────────────

export function getRules(req: Request, res: Response): void {
  const db = getDatabase()
  const clauseId = Number(req.params.clauseId)
  const rows = db
    .prepare(`SELECT ${RULE_COLUMNS} FROM standard_rules WHERE clause_id = ?`)
    .all(clauseId)
  res.json({ data: rows })
}

export function createRule(req: Request, res: Response): void {
  const db = getDatabase()
  const clauseId = Number(req.params.clauseId)
  const body = req.body
  if (!body.judgeType) throw new ApiError('judgeType is required', 'VALIDATION_ERROR', 400)

  const result = db
    .prepare(
      `
    INSERT INTO standard_rules (clause_id, judge_type, param_config, description)
    VALUES (@clauseId, @judgeType, @paramConfig, @description)
  `
    )
    .run({
      clauseId,
      judgeType: body.judgeType,
      paramConfig: body.paramConfig ? JSON.stringify(body.paramConfig) : null,
      description: body.description || null,
    })

  const created = db
    .prepare(`SELECT ${RULE_COLUMNS} FROM standard_rules WHERE id = ?`)
    .get(result.lastInsertRowid)
  res.status(201).json(created)
}

export function updateRule(req: Request, res: Response): void {
  const db = getDatabase()
  const id = Number(req.params.ruleId)
  const body = req.body
  const existing = db.prepare(`SELECT id FROM standard_rules WHERE id = ?`).get(id)
  if (!existing) throw new ApiError('Rule not found', 'NOT_FOUND', 404)

  db.prepare(
    `
    UPDATE standard_rules SET judge_type = COALESCE(?, judge_type),
      param_config = COALESCE(?, param_config), description = COALESCE(?, description)
    WHERE id = ?
  `
  ).run(
    body.judgeType ?? null,
    body.paramConfig ? JSON.stringify(body.paramConfig) : null,
    body.description ?? null,
    id
  )

  const updated = db.prepare(`SELECT ${RULE_COLUMNS} FROM standard_rules WHERE id = ?`).get(id)
  res.json(updated)
}

export function deleteRule(req: Request, res: Response): void {
  const db = getDatabase()
  const id = Number(req.params.ruleId)
  db.prepare('DELETE FROM standard_rules WHERE id = ?').run(id)
  res.json({ success: true })
}
