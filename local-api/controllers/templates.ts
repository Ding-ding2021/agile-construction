import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const PT_COLUMNS = [
  'id',
  'template_id as templateId',
  'template_code as templateCode',
  'template_name as templateName',
  'template_version as templateVersion',
  'status',
  'priority',
  'scopes',
  'phase_blueprint as phaseBlueprint',
  'milestone_blueprint as milestoneBlueprint',
  'task_template_binding as taskTemplateBinding',
  'meta',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

const TT_COLUMNS = [
  'id',
  'task_template_id as taskTemplateId',
  'task_template_code as taskTemplateCode',
  'task_template_name as taskTemplateName',
  'task_template_version as taskTemplateVersion',
  'status',
  'template_level as templateLevel',
  'business_domain as businessDomain',
  'task_type as taskType',
  'required_flag as requiredFlag',
  'milestone_flag as milestoneFlag',
  'owner_role as ownerRole',
  'assignee_type_default as assigneeTypeDefault',
  'sla_rule_id as slaRuleId',
  'standard_binding as standardBinding',
  'dependency_blueprint as dependencyBlueprint',
  'child_template_refs as childTemplateRefs',
  'parent_template_code as parentTemplateCode',
  'sort_order as sortOrder',
  'meta',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

export function getTemplates(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { search, brand, storeType, status: filterStatus } = req.query
  let sql = `SELECT ${PT_COLUMNS} FROM project_templates WHERE 1=1`
  const params: unknown[] = []

  if (search) {
    sql += ' AND template_name LIKE ?'
    params.push(`%${search}%`)
  }
  if (status) {
    sql += ' AND status = ?'
    params.push(filterStatus)
  }

  sql += ' ORDER BY created_at DESC'

  const rows = db.prepare(sql).all(...params)
  const items = (rows as Record<string, unknown>[]).map(row => parsePT(row))

  if (brand) {
    items = items.filter((i: { brand: string }) => i.brand === brand)
  }
  if (storeType) {
    items = items.filter((i: { storeType: string }) => i.storeType === storeType)
  }

  res.json({ data: items })
}

export function getTemplate(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const row = db.prepare(`SELECT ${PT_COLUMNS} FROM project_templates WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined
  if (!row) throw new ApiError('Template not found', 'NOT_FOUND', 404)
  res.json(parsePT(row))
}

export function createTemplate(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body
  const now = new Date().toISOString()

  const count = db.prepare('SELECT COUNT(*) as c FROM project_templates').get() as { c: number }
  const templateCode = `TPL-${String(count.c + 1).padStart(3, '0')}`
  const templateId = `pt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const scopes = JSON.stringify({
    brandScope: body.brand || '',
    storeTypeScope: body.storeType || '',
    regionScope: body.region || '',
    projectTypeScope: body.projectType || '',
    serviceScope: body.service || '',
  })
  const phaseBlueprint = JSON.stringify(body.phases || [])
  const milestoneBlueprint = JSON.stringify(body.milestones || [])
  const taskTemplateBinding = JSON.stringify(body.taskTemplateBindings || [])

  const result = db
    .prepare(
      `
      INSERT INTO project_templates (template_id, template_code, template_name, template_version,
        status, priority, scopes, phase_blueprint, milestone_blueprint, task_template_binding, meta, created_at)
      VALUES (@templateId, @templateCode, @templateName, @templateVersion,
        @status, @priority, @scopes, @phaseBlueprint, @milestoneBlueprint, @taskTemplateBinding, @meta, @createdAt)
    `
    )
    .run({
      templateId,
      templateCode,
      templateName: body.templateName || body.name || '',
      templateVersion: body.templateVersion || '1.0.0',
      status: body.status || 'draft',
      priority: body.priority ?? 0,
      scopes,
      phaseBlueprint,
      milestoneBlueprint,
      taskTemplateBinding,
      meta: JSON.stringify(body.meta || {}),
      createdAt: now,
    })

  const created = db
    .prepare(`SELECT ${PT_COLUMNS} FROM project_templates WHERE id = ?`)
    .get(result.lastInsertRowid) as Record<string, unknown>

  res.status(201).json(parsePT(created))
}

export function updateTemplate(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const body = req.body

  const existing = db
    .prepare(`SELECT ${PT_COLUMNS} FROM project_templates WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined
  if (!existing) throw new ApiError('Template not found', 'NOT_FOUND', 404)

  const scopes = body.scopes ?? existing.scopes
  const phaseBlueprint = body.phases ? JSON.stringify(body.phases) : existing.phase_blueprint
  const milestoneBlueprint = body.milestones
    ? JSON.stringify(body.milestones)
    : existing.milestone_blueprint

  db.prepare(
    `
    UPDATE project_templates
    SET template_name = COALESCE(?, template_name),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        scopes = COALESCE(?, scopes),
        phase_blueprint = COALESCE(?, phase_blueprint),
        milestone_blueprint = COALESCE(?, milestone_blueprint)
    WHERE id = ?
  `
  ).run(
    body.templateName ?? body.name ?? null,
    body.status ?? null,
    body.priority ?? null,
    typeof scopes === 'string' ? scopes : JSON.stringify(scopes),
    phaseBlueprint,
    milestoneBlueprint,
    id
  )

  const updated = db
    .prepare(`SELECT ${PT_COLUMNS} FROM project_templates WHERE id = ?`)
    .get(id) as Record<string, unknown>
  res.json(parsePT(updated))
}

export function deleteTemplate(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const existing = db.prepare(`SELECT id FROM project_templates WHERE id = ?`).get(id)
  if (!existing) throw new ApiError('Template not found', 'NOT_FOUND', 404)

  db.prepare('DELETE FROM project_templates WHERE id = ?').run(id)
  res.json({ success: true })
}

export function getTemplateBindings(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)

  const template = db
    .prepare(
      'SELECT task_template_binding as taskTemplateBinding FROM project_templates WHERE id = ?'
    )
    .get(id) as Record<string, unknown> | undefined
  if (!template) throw new ApiError('Template not found', 'NOT_FOUND', 404)

  const bindingData = template.taskTemplateBinding as string | undefined
  const taskTemplateIds: string[] = bindingData ? JSON.parse(bindingData) : []

  if (taskTemplateIds.length === 0) {
    res.json({ data: [] })
    return
  }

  const placeholders = taskTemplateIds.map(() => '?').join(',')
  const rows = db
    .prepare(
      `SELECT ${TT_COLUMNS} FROM task_templates WHERE task_template_id IN (${placeholders}) ORDER BY sort_order ASC`
    )
    .all(...taskTemplateIds)

  res.json({ data: rows.map(r => parseTT(r as Record<string, unknown>)) })
}

export function addTemplateBinding(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const taskTemplateId = req.body.taskTemplateId

  if (!taskTemplateId) throw new ApiError('taskTemplateId is required', 'VALIDATION_ERROR', 400)

  const template = db
    .prepare('SELECT task_template_binding as t FROM project_templates WHERE id = ?')
    .get(id) as { t: string } | undefined
  if (!template) throw new ApiError('Template not found', 'NOT_FOUND', 404)

  const bindings: string[] = template.t ? JSON.parse(template.t) : []
  if (!bindings.includes(taskTemplateId)) {
    bindings.push(taskTemplateId)
  }

  db.prepare('UPDATE project_templates SET task_template_binding = ? WHERE id = ?').run(
    JSON.stringify(bindings),
    id
  )
  res.json({ data: bindings })
}

export function removeTemplateBinding(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const taskTemplateId = req.params.bindingId

  const template = db
    .prepare('SELECT task_template_binding as t FROM project_templates WHERE id = ?')
    .get(id) as { t: string } | undefined
  if (!template) throw new ApiError('Template not found', 'NOT_FOUND', 404)

  const bindings: string[] = template.t ? JSON.parse(template.t) : []
  const updated = bindings.filter((b: string) => b !== taskTemplateId)

  db.prepare('UPDATE project_templates SET task_template_binding = ? WHERE id = ?').run(
    JSON.stringify(updated),
    id
  )
  res.json({ data: updated })
}

export function getTaskTemplates(_req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const rows = db.prepare(`SELECT ${TT_COLUMNS} FROM task_templates ORDER BY sort_order ASC`).all()
  res.json({ data: rows.map(r => parseTT(r as Record<string, unknown>)) })
}

export function getTaskTemplate(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const row = db.prepare(`SELECT ${TT_COLUMNS} FROM task_templates WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined
  if (!row) throw new ApiError('Task template not found', 'NOT_FOUND', 404)
  res.json(parseTT(row))
}

export function createTaskTemplate(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const body = req.body
  const now = new Date().toISOString()

  if (!body.taskTemplateName || !body.templateLevel) {
    throw new ApiError('taskTemplateName and templateLevel are required', 'VALIDATION_ERROR', 400)
  }

  const count = db.prepare('SELECT COUNT(*) as c FROM task_templates').get() as { c: number }
  const code = `TTPL-${String(count.c + 1).padStart(4, '0')}`
  const ttId = `tt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const result = db
    .prepare(
      `
      INSERT INTO task_templates (task_template_id, task_template_code, task_template_name, task_template_version,
        status, template_level, business_domain, task_type, required_flag, milestone_flag,
        owner_role, assignee_type_default, parent_template_code, sort_order, meta, created_at)
      VALUES (@taskTemplateId, @taskTemplateCode, @taskTemplateName, @taskTemplateVersion,
        @status, @templateLevel, @businessDomain, @taskType, @requiredFlag, @milestoneFlag,
        @ownerRole, @assigneeTypeDefault, @parentTemplateCode, @sortOrder, @meta, @createdAt)
    `
    )
    .run({
      taskTemplateId: ttId,
      taskTemplateCode: code,
      taskTemplateName: body.taskTemplateName,
      taskTemplateVersion: body.taskTemplateVersion || '1.0.0',
      status: body.status || 'active',
      templateLevel: body.templateLevel,
      businessDomain: body.businessDomain || '',
      taskType: body.taskType || '',
      requiredFlag: body.requiredFlag ? 1 : 0,
      milestoneFlag: body.milestoneFlag ? 1 : 0,
      ownerRole: body.ownerRole || '',
      assigneeTypeDefault: body.assigneeTypeDefault || '',
      parentTemplateCode: body.parentTemplateCode || null,
      sortOrder: body.sortOrder ?? 0,
      meta: JSON.stringify(body.meta || {}),
      createdAt: now,
    })

  const created = db
    .prepare(`SELECT ${TT_COLUMNS} FROM task_templates WHERE id = ?`)
    .get(result.lastInsertRowid) as Record<string, unknown>

  res.status(201).json(parseTT(created))
}

export function updateTaskTemplate(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const body = req.body

  const existing = db.prepare(`SELECT id FROM task_templates WHERE id = ?`).get(id)
  if (!existing) throw new ApiError('Task template not found', 'NOT_FOUND', 404)

  db.prepare(
    `
    UPDATE task_templates
    SET task_template_name = COALESCE(?, task_template_name),
        status = COALESCE(?, status),
        template_level = COALESCE(?, template_level),
        required_flag = COALESCE(?, required_flag),
        owner_role = COALESCE(?, owner_role),
        parent_template_code = COALESCE(?, parent_template_code),
        sort_order = COALESCE(?, sort_order),
        standard_binding = COALESCE(?, standard_binding)
    WHERE id = ?
  `
  ).run(
    body.taskTemplateName ?? null,
    body.status ?? null,
    body.templateLevel ?? null,
    body.requiredFlag != null ? (body.requiredFlag ? 1 : 0) : null,
    body.ownerRole ?? null,
    body.parentTemplateCode ?? null,
    body.sortOrder ?? null,
    body.standardBinding ?? null,
    id
  )

  const updated = db
    .prepare(`SELECT ${TT_COLUMNS} FROM task_templates WHERE id = ?`)
    .get(id) as Record<string, unknown>
  res.json(parseTT(updated))
}

export function deleteTaskTemplate(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const id = Number(req.params.id)
  const existing = db.prepare(`SELECT id FROM task_templates WHERE id = ?`).get(id)
  if (!existing) throw new ApiError('Task template not found', 'NOT_FOUND', 404)

  db.prepare(
    'UPDATE task_templates SET parent_template_code = NULL WHERE parent_template_code = (SELECT task_template_code FROM task_templates WHERE id = ?)'
  ).run(id)
  db.prepare('DELETE FROM task_templates WHERE id = ?').run(id)
  res.json({ success: true })
}

function parsePT(row: Record<string, unknown>) {
  return {
    ...row,
    scopes: tryParseJSON(row.scopes as string | undefined, {}),
    phaseBlueprint: tryParseJSON(row.phaseBlueprint as string | undefined, []),
    milestoneBlueprint: tryParseJSON(row.milestoneBlueprint as string | undefined, []),
    taskTemplateBinding: tryParseJSON(row.taskTemplateBinding as string | undefined, []),
    meta: tryParseJSON(row.meta as string | undefined, {}),
    brand:
      tryParseJSON<{ brandScope?: string }>(row.scopes as string | undefined, {}).brandScope || '',
    storeType:
      tryParseJSON<{ storeTypeScope?: string }>(row.scopes as string | undefined, {})
        .storeTypeScope || '',
  }
}

function parseTT(row: Record<string, unknown>) {
  return {
    ...row,
    requiredFlag: !!row.requiredFlag,
    milestoneFlag: !!row.milestoneFlag,
    standardBinding: tryParseJSON(row.standardBinding as string | undefined, {}),
    dependencyBlueprint: tryParseJSON(row.dependencyBlueprint as string | undefined, []),
    childTemplateRefs: tryParseJSON(row.childTemplateRefs as string | undefined, []),
    meta: tryParseJSON(row.meta as string | undefined, {}),
  }
}

function tryParseJSON<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
