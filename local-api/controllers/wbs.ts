import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'
import { extractProjectCode } from './projectHelpers'

const WBS_COLUMNS = [
  'id',
  'project_code as projectCode',
  'wbs_code as wbsCode',
  'name',
  'node_level as nodeLevel',
  'status',
  'progress',
  'planned_start as plannedStart',
  'planned_end as plannedEnd',
  'duration',
  'assignee',
  'parent_id as parentId',
  'sort_order as sortOrder',
  'dependencies',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

const VALID_NODE_LEVELS = ['workPackage', 'task', 'subtask']

function isValidNodeLevel(level: string): boolean {
  return VALID_NODE_LEVELS.includes(level)
}

export function getWBSTree(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectCode = extractProjectCode(req)
  const rows = db
    .prepare(`SELECT ${WBS_COLUMNS} FROM wbs_nodes WHERE project_code = ? ORDER BY sort_order ASC`)
    .all(projectCode)
  res.json(rows)
}

export function createWBSNode(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectCode = extractProjectCode(req)
  const body = req.body

  if (!body.name || !body.nodeLevel) {
    throw new ApiError('name and nodeLevel are required', 'VALIDATION_ERROR', 400)
  }

  if (!isValidNodeLevel(body.nodeLevel)) {
    throw new ApiError(
      `nodeLevel must be one of: ${VALID_NODE_LEVELS.join(', ')}`,
      'VALIDATION_ERROR',
      400
    )
  }

  let wbsCode: string

  if (body.parentId) {
    const parent = db
      .prepare('SELECT wbs_code as wbsCode FROM wbs_nodes WHERE id = ?')
      .get(body.parentId) as { wbsCode: string } | undefined
    if (!parent) {
      throw new ApiError('Parent node not found', 'NOT_FOUND', 404)
    }

    const siblingCount = db
      .prepare('SELECT COUNT(*) as c FROM wbs_nodes WHERE parent_id = ?')
      .get(body.parentId) as { c: number }
    wbsCode = `${parent.wbsCode}.${String(siblingCount.c + 1).padStart(2, '0')}`
  } else {
    const rootCount = db
      .prepare('SELECT COUNT(*) as c FROM wbs_nodes WHERE project_code = ? AND parent_id IS NULL')
      .get(projectCode) as { c: number }
    wbsCode = `${projectCode}-${String(rootCount.c + 1).padStart(2, '0')}`
  }

  const now = new Date().toISOString()

  const result = db
    .prepare(
      `
      INSERT INTO wbs_nodes (project_code, wbs_code, name, node_level, status, progress,
        planned_start, planned_end, duration, assignee, parent_id, sort_order, dependencies,
        created_at, updated_at)
      VALUES (@projectCode, @wbsCode, @name, @nodeLevel, @status, @progress,
        @plannedStart, @plannedEnd, @duration, @assignee, @parentId, @sortOrder, @dependencies,
        @createdAt, @updatedAt)
    `
    )
    .run({
      projectCode,
      wbsCode,
      name: body.name,
      nodeLevel: body.nodeLevel,
      status: body.status || 'pending',
      progress: body.progress ?? 0,
      plannedStart: body.plannedStart || null,
      plannedEnd: body.plannedEnd || null,
      duration: body.duration ?? 0,
      assignee: body.assignee || null,
      parentId: body.parentId || null,
      sortOrder: body.sortOrder ?? 0,
      dependencies: body.dependencies || null,
      createdAt: now,
      updatedAt: now,
    })

  const created = db
    .prepare(`SELECT ${WBS_COLUMNS} FROM wbs_nodes WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}

export function updateWBSNode(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const body = req.body

  const existing = db.prepare('SELECT id FROM wbs_nodes WHERE id = ?').get(id)
  if (!existing) throw new ApiError('WBS node not found', 'NOT_FOUND', 404)

  db.prepare(
    `
    UPDATE wbs_nodes SET
      name = COALESCE(@name, name),
      node_level = COALESCE(@nodeLevel, node_level),
      status = COALESCE(@status, status),
      progress = COALESCE(@progress, progress),
      planned_start = COALESCE(@plannedStart, planned_start),
      planned_end = COALESCE(@plannedEnd, planned_end),
      duration = COALESCE(@duration, duration),
      assignee = COALESCE(@assignee, assignee),
      sort_order = COALESCE(@sortOrder, sort_order),
      dependencies = COALESCE(@dependencies, dependencies),
      updated_at = @updatedAt
    WHERE id = @id
  `
  ).run({
    id,
    name: body.name ?? null,
    nodeLevel: body.nodeLevel ?? null,
    status: body.status ?? null,
    progress: body.progress ?? null,
    plannedStart: body.plannedStart ?? null,
    plannedEnd: body.plannedEnd ?? null,
    duration: body.duration ?? null,
    assignee: body.assignee ?? null,
    sortOrder: body.sortOrder ?? null,
    dependencies: body.dependencies ?? null,
    updatedAt: new Date().toISOString(),
  })

  const updated = db.prepare(`SELECT ${WBS_COLUMNS} FROM wbs_nodes WHERE id = ?`).get(id)

  res.json(updated)
}

export function deleteWBSNode(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT id FROM wbs_nodes WHERE id = ?').get(id)
  if (!existing) throw new ApiError('WBS node not found', 'NOT_FOUND', 404)

  // Collect all descendant IDs recursively
  const idsToDelete: number[] = [id]
  const queue = [id]
  while (queue.length > 0) {
    const currentId = queue.shift()!
    const children = db.prepare('SELECT id FROM wbs_nodes WHERE parent_id = ?').all(currentId) as {
      id: number
    }[]
    for (const child of children) {
      idsToDelete.push(child.id)
      queue.push(child.id)
    }
  }

  // Delete in reverse order (children first) to avoid FK constraints
  const deleteStmt = db.prepare('DELETE FROM wbs_nodes WHERE id = ?')
  const deleteMany = db.transaction((ids: number[]) => {
    for (const deleteId of ids.reverse()) {
      deleteStmt.run(deleteId)
    }
  })
  deleteMany(idsToDelete)

  res.json({ success: true })
}
