/**
 * 本地 HTTP API 服务 — V2 实体化模式
 *
 * 迁移内容（2026-04-26）：
 * - 运行时：better-sqlite3（Prisma 管理 Schema，不用于运行时）
 * - 表结构由 prisma db push 管理，SQL 以 prisma/schema.prisma 为 SSOT
 * - 旧 /state 快照端点保留并标记 deprecated
 * - 新增 7 组实体 CRUD 端点
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'http'
import { parse } from 'url'
import {
  initDatabase,
  closeDatabase,
  cleanupExpiredIdempotencyKeys,
  getDatabase,
} from './store/sqlite'
import { checkIdempotencyKey, recordIdempotencyKey } from './store/idempotency'
import { createErrorResponse, type ProjectStateSnapshot } from './contracts'

const PORT = process.env.LOCAL_API_PORT ? parseInt(process.env.LOCAL_API_PORT) : 3100
const API_PREFIX = '/api'

// ========== 工具函数 ==========

function parseQuery(req: IncomingMessage): Record<string, string> {
  const url = parse(req.url || '', true)
  return url.query as Record<string, string>
}

// 解析 TASK 的 tags 字段，健壮地返回字符串数组
function parseTagsField(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags as string[]
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags)
      return Array.isArray(parsed) ? (parsed as string[]) : []
    } catch {
      return []
    }
  }
  return []
}

async function parseBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson<T>(res: ServerResponse, data: T, status = 200): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key',
  })
  res.end(JSON.stringify(data))
}

function sendNoContent(res: ServerResponse): void {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key',
  })
  res.end()
}

function handleError(res: ServerResponse, message: string, code: string, status: number): void {
  sendJson(res, createErrorResponse(message, code, status), status)
}

function sendDeprecationWarning(res: ServerResponse): void {
  res.setHeader('X-Deprecated', 'true')
  res.setHeader('X-Deprecated-Message', 'Use entity CRUD endpoints instead')
}

/** URL 模式匹配，提取路径参数 */
function matchPath(pathname: string, pattern: string): Record<string, string> | null {
  const parts = pathname.split('/').filter(Boolean)
  const patternParts = pattern.split('/').filter(Boolean)
  if (parts.length !== patternParts.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = parts[i]
    } else if (patternParts[i] !== parts[i]) {
      return null
    }
  }
  return params
}

// ========== 项目 CRUD ==========

const PROJECT_COLUMNS = [
  'id',
  'code',
  'name',
  'brand',
  'status',
  'status_tone as statusTone',
  'stage',
  'progress',
  'budget',
  'team_size as teamSize',
  'date_range as dateRange',
  'description',
  'owner',
  'risk_level as riskLevel',
  'risk_count as riskCount',
  'milestone',
  'tasks',
  'template_id as templateId',
  'planned_open_date as plannedOpenDate',
  'actual_open_date as actualOpenDate',
  'dispatch_status as dispatchStatus',
  'execution_status as executionStatus',
  'acceptance_status as acceptanceStatus',
  'settlement_status as settlementStatus',
  'pending_dispatch_count as pendingDispatchCount',
  'pending_execution_count as pendingExecutionCount',
  'pending_acceptance_count as pendingAcceptanceCount',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

function handleProjects(req: IncomingMessage, res: ServerResponse): void {
  const db = getDatabase()

  if (req.method === 'GET') {
    const rows = db
      .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY created_at DESC`)
      .all()
    sendJson(res, rows)
    return
  }

  if (req.method === 'POST') {
    parseBody<Record<string, unknown>>(req)
      .then(body => {
        const now = new Date().toISOString()
        const stmt = db.prepare(`
        INSERT INTO projects (
          code, name, brand, status, status_tone, stage, progress,
          budget, team_size, date_range, description, owner,
          risk_level, risk_count, milestone, tasks, template_id,
          planned_open_date, actual_open_date,
          dispatch_status, execution_status, acceptance_status, settlement_status,
          pending_dispatch_count, pending_execution_count, pending_acceptance_count,
          created_at, updated_at
        ) VALUES (
          @code, @name, @brand, @status, @statusTone, @stage, @progress,
          @budget, @teamSize, @dateRange, @description, @owner,
          @riskLevel, @riskCount, @milestone, @tasks, @templateId,
          @plannedOpenDate, @actualOpenDate,
          @dispatchStatus, @executionStatus, @acceptanceStatus, @settlementStatus,
          @pendingDispatchCount, @pendingExecutionCount, @pendingAcceptanceCount,
          @now, @now
        )
      `)
        const result = stmt.run({
          code: body.code,
          name: body.name || '',
          brand: body.brand || '',
          status: body.status || '待立项',
          statusTone: body.statusTone || 'blue',
          stage: body.stage || '启动',
          progress: body.progress || 0,
          budget: body.budget || null,
          teamSize: body.teamSize || null,
          dateRange: body.dateRange || null,
          description: body.description || null,
          owner: body.owner || null,
          riskLevel: body.riskLevel || null,
          riskCount: body.riskCount || 0,
          milestone: body.milestone || null,
          tasks: body.tasks || null,
          templateId: body.templateId || null,
          plannedOpenDate: body.plannedOpenDate || '',
          actualOpenDate: body.actualOpenDate || null,
          dispatchStatus: body.dispatchStatus || null,
          executionStatus: body.executionStatus || null,
          acceptanceStatus: body.acceptanceStatus || null,
          settlementStatus: body.settlementStatus || null,
          pendingDispatchCount: body.pendingDispatchCount || 0,
          pendingExecutionCount: body.pendingExecutionCount || 0,
          pendingAcceptanceCount: body.pendingAcceptanceCount || 0,
          now,
        })
        const created = db
          .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = ?`)
          .get(result.lastInsertRowid)
        sendJson(res, created, 201)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }

  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

function handleProjectByCode(req: IncomingMessage, res: ServerResponse, code: string): void {
  const db = getDatabase()

  if (req.method === 'GET') {
    const project = db.prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE code = ?`).get(code)
    if (!project) {
      handleError(res, 'Project not found', 'NOT_FOUND', 404)
      return
    }
    // 附带子资源
    const phases = db
      .prepare(
        'SELECT * FROM project_phases WHERE project_id = (SELECT id FROM projects WHERE code = ?)'
      )
      .all(code)
    const milestones = db
      .prepare(
        'SELECT * FROM project_milestones WHERE project_id = (SELECT id FROM projects WHERE code = ?)'
      )
      .all(code)
    const risks = db
      .prepare(
        'SELECT * FROM project_risks WHERE project_id = (SELECT id FROM projects WHERE code = ?)'
      )
      .all(code)
    const members = db
      .prepare(
        'SELECT * FROM project_members WHERE project_id = (SELECT id FROM projects WHERE code = ?)'
      )
      .all(code)
    sendJson(res, { ...(project as object), phases, milestones, risks, members })
    return
  }

  if (req.method === 'PUT') {
    parseBody<Record<string, unknown>>(req)
      .then(body => {
        const existing = db.prepare('SELECT id FROM projects WHERE code = ?').get(code)
        if (!existing) {
          handleError(res, 'Project not found', 'NOT_FOUND', 404)
          return
        }
        const { code: _, ...data } = body
        const setClauses: string[] = []
        const params: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(data)) {
          const col = k.replace(/[A-Z]/g, m => '_' + m.toLowerCase())
          setClauses.push(`${col} = @${k}`)
          params[k] = v
        }
        if (setClauses.length === 0) {
          sendJson(res, existing)
          return
        }
        setClauses.push("updated_at = datetime('now')")
        db.prepare(`UPDATE projects SET ${setClauses.join(', ')} WHERE code = @code`).run({
          ...params,
          code,
        })
        const updated = db
          .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE code = ?`)
          .get(code)
        sendJson(res, updated)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }

  if (req.method === 'DELETE') {
    const result = db.prepare('DELETE FROM projects WHERE code = ?').run(code)
    if (result.changes === 0) {
      handleError(res, 'Project not found', 'NOT_FOUND', 404)
      return
    }
    sendNoContent(res)
    return
  }

  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

// ========== 任务 CRUD ==========

const TASK_COLUMNS = [
  'id',
  'project_id as projectId',
  'code',
  'name',
  'status',
  'assignee_id as assigneeId',
  'assignee_name as assigneeName',
  'start_date as startDate',
  'due_date as dueDate',
  'parent_id as parentId',
  'node_level_type as nodeLevelType',
  'priority',
  'progress',
  'task_type as taskType',
  'source_type as sourceType',
  'risk_level as riskLevel',
  'sla_status as slaStatus',
  'description',
  'actual_start_date as actualStartDate',
  'actual_end_date as actualEndDate',
  'blocked_reason as blockedReason',
  'remind_count as remindCount',
  'tags',
  'work_package_id as workPackageId',
  'sla_rule_id as slaRuleId',
  'planned_work_hours as plannedWorkHours',
  'actual_work_hours as actualWorkHours',
  'standard_snapshot_id as standardSnapshotId',
  'created_by as createdBy',
  'created_at as createdAt',
  'updated_by as updatedBy',
  'updated_at as updatedAt',
].join(', ')

function handleTasks(req: IncomingMessage, res: ServerResponse, projectCode: string): void {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) {
    handleError(res, 'Project not found', 'NOT_FOUND', 404)
    return
  }

  if (req.method === 'GET') {
    const rows = db
      .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE project_id = ? ORDER BY id ASC`)
      .all(project.id)
    // Ensure tags field is parsed into an array for GET response, matching POST behavior
    const parsed = rows.map((row: any) => ({ ...row, tags: parseTagsField(row.tags) }))
    sendJson(res, parsed)
    return
  }

  if (req.method === 'POST') {
    parseBody<Record<string, unknown>>(req)
      .then(body => {
        const now = new Date().toISOString()
        const stmt = db.prepare(`
        INSERT INTO project_tasks (
          project_id, code, name, status,
          assignee_id, assignee_name,
          start_date, due_date, parent_id, node_level_type,
          priority, progress, task_type, source_type, risk_level, sla_status, description,
          actual_start_date, actual_end_date, blocked_reason, remind_count, tags,
          work_package_id, sla_rule_id, planned_work_hours, actual_work_hours, standard_snapshot_id,
          created_by, created_at, updated_by, updated_at
        ) VALUES (
          @projectId, @code, @name, @status,
          @assigneeId, @assigneeName,
          @plannedStartAt, @plannedEndAt, @parentId, @nodeLevelType,
          @priority, @progress, @taskType, @sourceType, @riskLevel, @slaStatus, @description,
          @actualStartAt, @actualEndAt, @blockedReason, @remindCount, @tags,
          @workPackageId, @slaRuleId, @plannedWorkHours, @actualWorkHours, @standardSnapshotId,
          @createdBy, @now, @updatedBy, @now
        )
      `)
        const result = stmt.run({
          projectId: project.id,
          code: body.code || '',
          name: body.name || '',
          status: body.status || '草稿',
          assigneeId: body.assigneeId || '',
          assigneeName: body.assigneeName || '待分配',
          plannedStartAt: body.plannedStartAt || null,
          plannedEndAt: body.plannedEndAt || null,
          parentId: body.parentId || null,
          nodeLevelType: body.nodeLevelType || 'task',
          priority: body.priority || 'medium',
          progress: body.progress || 0,
          taskType: body.taskType || '标准任务',
          sourceType: body.sourceType || 'manual',
          riskLevel: body.riskLevel || '低风险',
          slaStatus: body.slaStatus || '正常',
          description: body.description || body.taskDescription || null,
          actualStartAt: body.actualStartAt || null,
          actualEndAt: body.actualEndAt || null,
          blockedReason: body.blockedReason || null,
          remindCount: body.remindCount || 0,
          tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags || null,
          workPackageId: body.workPackageId || null,
          slaRuleId: body.slaRuleId || null,
          plannedWorkHours: body.plannedWorkHours || null,
          actualWorkHours: body.actualWorkHours || null,
          standardSnapshotId: body.standardSnapshotId || null,
          createdBy: body.createdBy || '系统',
          updatedBy: body.updatedBy || null,
          now,
        })
        const created = db
          .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE id = ?`)
          .get(result.lastInsertRowid)
        // 返回时解析 tags JSON 为数组
        const response = created
          ? {
              ...(created as object),
              tags: parseTagsField((created as Record<string, unknown>).tags),
            }
          : created
        sendJson(res, response, 201)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }

  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

// 任务树：递归查询构建树形结构
function handleTaskTree(req: IncomingMessage, res: ServerResponse, projectCode: string): void {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) {
    handleError(res, 'Project not found', 'NOT_FOUND', 404)
    return
  }

  // Only allow GET for this endpoint; reject others with 405
  if (req.method !== 'GET') {
    handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
    return
  }

  const rows = db
    .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE project_id = ?`)
    .all(project.id)
  const tasks = rows.map((r: any) => ({ ...r, tags: parseTagsField(r.tags) }))

  function buildTree(list: any[], parentId: number | null): any[] {
    return list
      .filter(t => (t.parentId ?? null) === parentId)
      .map(t => ({ ...t, children: buildTree(list, t.id) }))
  }

  const tree = buildTree(tasks, null)
  sendJson(res, { tasks: tree })
}

function handleTaskById(
  req: IncomingMessage,
  res: ServerResponse,
  projectCode: string,
  taskId: string
): void {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) {
    handleError(res, 'Project not found', 'NOT_FOUND', 404)
    return
  }

  if (req.method === 'PUT') {
    parseBody<Record<string, unknown>>(req)
      .then(body => {
        // 允许更新任意 camelCase 字段，映射到 snake_case 列名
        const data = body
        const setClauses: string[] = []
        const params: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(data)) {
          const col = k.replace(/[A-Z]/g, m => '_' + m.toLowerCase())
          setClauses.push(`${col} = @${k}`)
          params[k] = v
        }
        if (setClauses.length === 0) {
          handleError(res, 'No fields to update', 'INVALID_REQUEST', 400)
          return
        }
        const result = db
          .prepare(
            `UPDATE project_tasks SET ${setClauses.join(', ')} WHERE id = @_id AND project_id = @_pid`
          )
          .run({ ...params, _id: parseInt(taskId), _pid: project.id })
        if (result.changes === 0) {
          handleError(res, 'Task not found', 'NOT_FOUND', 404)
          return
        }
        const updated = db
          .prepare(`SELECT ${TASK_COLUMNS} FROM project_tasks WHERE id = ?`)
          .get(parseInt(taskId))
        // 返回时对 tags 做解析
        const response = updated
          ? {
              ...(updated as object),
              tags: parseTagsField((updated as Record<string, unknown>).tags),
            }
          : updated
        sendJson(res, response)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }

  if (req.method === 'DELETE') {
    const result = db
      .prepare('DELETE FROM project_tasks WHERE id = ? AND project_id = ?')
      .run(parseInt(taskId), project.id)
    if (result.changes === 0) {
      handleError(res, 'Task not found', 'NOT_FOUND', 404)
      return
    }
    sendNoContent(res)
    return
  }

  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

// ========== 里程碑 CRUD ==========

function handleMilestones(req: IncomingMessage, res: ServerResponse, projectCode: string): void {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) {
    handleError(res, 'Project not found', 'NOT_FOUND', 404)
    return
  }

  if (req.method === 'GET') {
    const rows = db
      .prepare(
        `
      SELECT id, project_id as projectId, name, due_date as dueDate, status, assignee, completed_date as completedDate
      FROM project_milestones WHERE project_id = ? ORDER BY due_date ASC
    `
      )
      .all(project.id)
    sendJson(res, rows)
    return
  }

  if (req.method === 'POST') {
    parseBody<Record<string, unknown>>(req)
      .then(body => {
        const result = db
          .prepare(
            `
        INSERT INTO project_milestones (project_id, name, due_date, status, assignee, completed_date)
        VALUES (@pid, @name, @dueDate, @status, @assignee, @completedDate)
      `
          )
          .run({
            pid: project.id,
            name: body.name || '',
            dueDate: body.dueDate || '',
            status: body.status || 'pending',
            assignee: body.assignee || null,
            completedDate: body.completedDate || null,
          })
        const created = db
          .prepare(
            `
        SELECT id, project_id as projectId, name, due_date as dueDate, status, assignee, completed_date as completedDate
        FROM project_milestones WHERE id = ?
      `
          )
          .get(result.lastInsertRowid)
        sendJson(res, created, 201)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }

  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

// ========== 阶段 / 风险 / 成员 CRUD ==========

function handlePhases(req: IncomingMessage, res: ServerResponse, projectCode: string): void {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) {
    handleError(res, 'Project not found', 'NOT_FOUND', 404)
    return
  }

  if (req.method === 'GET') {
    const rows = db
      .prepare(
        'SELECT id, project_id as projectId, name, start_date as startDate, end_date as endDate, progress, status FROM project_phases WHERE project_id = ? ORDER BY start_date ASC'
      )
      .all(project.id)
    sendJson(res, rows)
    return
  }

  if (req.method === 'POST') {
    parseBody<Record<string, unknown>>(req)
      .then(body => {
        const result = db
          .prepare(
            'INSERT INTO project_phases (project_id, name, start_date, end_date, progress, status) VALUES (@pid, @name, @startDate, @endDate, @progress, @status)'
          )
          .run({
            pid: project.id,
            name: body.name || '',
            startDate: body.startDate || '',
            endDate: body.endDate || '',
            progress: body.progress || 0,
            status: body.status || 'pending',
          })
        const created = db
          .prepare(
            'SELECT id, project_id as projectId, name, start_date as startDate, end_date as endDate, progress, status FROM project_phases WHERE id = ?'
          )
          .get(result.lastInsertRowid)
        sendJson(res, created, 201)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }
  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

function handleRisks(req: IncomingMessage, res: ServerResponse, projectCode: string): void {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) {
    handleError(res, 'Project not found', 'NOT_FOUND', 404)
    return
  }

  if (req.method === 'GET') {
    const rows = db
      .prepare(
        'SELECT id, project_id as projectId, description, level, probability, impact, mitigation, status, assignee, due_date as dueDate FROM project_risks WHERE project_id = ?'
      )
      .all(project.id)
    sendJson(res, rows)
    return
  }

  if (req.method === 'POST') {
    parseBody<Record<string, unknown>>(req)
      .then(body => {
        const result = db
          .prepare(
            'INSERT INTO project_risks (project_id, description, level, probability, impact, mitigation, status, assignee, due_date) VALUES (@pid, @description, @level, @probability, @impact, @mitigation, @status, @assignee, @dueDate)'
          )
          .run({
            pid: project.id,
            description: body.description || '',
            level: body.level || 'low',
            probability: body.probability || null,
            impact: body.impact || null,
            mitigation: body.mitigation || null,
            status: body.status || 'active',
            assignee: body.assignee || null,
            dueDate: body.dueDate || null,
          })
        const created = db
          .prepare(
            'SELECT id, project_id as projectId, description, level, probability, impact, mitigation, status, assignee, due_date as dueDate FROM project_risks WHERE id = ?'
          )
          .get(result.lastInsertRowid)
        sendJson(res, created, 201)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }
  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

function handleMembers(req: IncomingMessage, res: ServerResponse, projectCode: string): void {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) {
    handleError(res, 'Project not found', 'NOT_FOUND', 404)
    return
  }

  if (req.method === 'GET') {
    const rows = db
      .prepare(
        'SELECT id, project_id as projectId, user_id as userId, name, role, avatar, department, phone, email FROM project_members WHERE project_id = ?'
      )
      .all(project.id)
    sendJson(res, rows)
    return
  }

  if (req.method === 'POST') {
    parseBody<Record<string, unknown>>(req)
      .then(body => {
        const result = db
          .prepare(
            'INSERT INTO project_members (project_id, user_id, name, role, avatar, department, phone, email) VALUES (@pid, @userId, @name, @role, @avatar, @department, @phone, @email)'
          )
          .run({
            pid: project.id,
            userId: body.userId || '',
            name: body.name || '',
            role: body.role || '',
            avatar: body.avatar || null,
            department: body.department || null,
            phone: body.phone || null,
            email: body.email || null,
          })
        const created = db
          .prepare(
            'SELECT id, project_id as projectId, user_id as userId, name, role, avatar, department, phone, email FROM project_members WHERE id = ?'
          )
          .get(result.lastInsertRowid)
        sendJson(res, created, 201)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }
  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

// ========== 状态日志 ==========

function handleStatusLogs(req: IncomingMessage, res: ServerResponse, projectCode: string): void {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) {
    handleError(res, 'Project not found', 'NOT_FOUND', 404)
    return
  }

  if (req.method === 'GET') {
    const rows = db
      .prepare(
        `
      SELECT id, project_id as projectId, type, at, operator, message, from_status as fromStatus, to_status as toStatus, reason
      FROM project_status_logs WHERE project_id = ? ORDER BY at DESC
    `
      )
      .all(project.id)
    sendJson(res, rows)
    return
  }

  if (req.method === 'POST') {
    parseBody<Record<string, unknown>>(req)
      .then(body => {
        const result = db
          .prepare(
            'INSERT INTO project_status_logs (project_id, type, at, operator, message, from_status, to_status, reason) VALUES (@pid, @type, @at, @operator, @message, @fromStatus, @toStatus, @reason)'
          )
          .run({
            pid: project.id,
            type: body.type || 'transition',
            at: body.at || new Date().toISOString(),
            operator: body.operator || 'system',
            message: body.message || '',
            fromStatus: body.fromStatus || null,
            toStatus: body.toStatus || null,
            reason: body.reason || null,
          })
        const created = db
          .prepare(
            'SELECT id, project_id as projectId, type, at, operator, message, from_status as fromStatus, to_status as toStatus, reason FROM project_status_logs WHERE id = ?'
          )
          .get(result.lastInsertRowid)
        sendJson(res, created, 201)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }
  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

// ========== 审计日志 ==========

function handleAuditLogs(req: IncomingMessage, res: ServerResponse): void {
  const db = getDatabase()
  const query = parseQuery(req)
  const envId = query.envId || 'default'

  if (req.method === 'GET') {
    const rows = db
      .prepare('SELECT * FROM audit_logs WHERE env_id = ? ORDER BY created_at DESC LIMIT 100')
      .all(envId)
    sendJson(res, rows)
    return
  }

  if (req.method === 'POST') {
    parseBody<{ scene: string; detail: string; projectCode?: string; at: string }>(req)
      .then(payload => {
        db.prepare(
          'INSERT INTO audit_logs (env_id, scene, detail, project_code, at) VALUES (?, ?, ?, ?, ?)'
        ).run(envId, payload.scene, payload.detail, payload.projectCode || null, payload.at)
        sendNoContent(res)
      })
      .catch(err => handleError(res, err.message, 'INVALID_REQUEST', 400))
    return
  }

  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

// ========== 旧 /state 兼容端点（deprecated） ==========

function handleProjectStateCompat(req: IncomingMessage, res: ServerResponse): void {
  sendDeprecationWarning(res)
  const db = getDatabase()

  if (req.method === 'GET') {
    const projects = db
      .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY created_at DESC`)
      .all()
    const snapshot: ProjectStateSnapshot = {
      projects: projects as ProjectStateSnapshot['projects'],
      logs: {},
    }
    sendJson(res, snapshot)
    return
  }

  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

function handleCompatNoop(req: IncomingMessage, res: ServerResponse): void {
  sendDeprecationWarning(res)
  if (req.method === 'GET') {
    sendJson(res, { tasks: [] })
    return
  }
  handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
}

// ========== 健康检查 ==========

function handleHealth(_req: IncomingMessage, res: ServerResponse): void {
  sendJson(res, { status: 'ok', timestamp: new Date().toISOString(), mode: 'entity' })
}

// ========== 路由分发 ==========

function router(req: IncomingMessage, res: ServerResponse): void {
  const url = parse(req.url || '', true)
  const pathname = url.pathname || ''

  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key',
    })
    res.end()
    return
  }

  if (pathname === '/health') {
    handleHealth(req, res)
    return
  }

  if (pathname.startsWith(API_PREFIX)) {
    const path = pathname.slice(API_PREFIX.length)

    // 旧 /state 兼容
    if (path === '/projects/state') {
      handleProjectStateCompat(req, res)
      return
    }
    if (path === '/tasks/state') {
      handleCompatNoop(req, res)
      return
    }
    if (path === '/acceptance/state') {
      handleCompatNoop(req, res)
      return
    }
    if (path === '/settlement/state') {
      handleCompatNoop(req, res)
      return
    }

    // 审计日志
    if (path === '/audit/logs') {
      handleAuditLogs(req, res)
      return
    }

    // 项目列表
    if (path === '/projects') {
      handleProjects(req, res)
      return
    }

    // 项目详情 /api/projects/:code
    let params = matchPath(path, 'projects/:code')
    if (params) {
      handleProjectByCode(req, res, params.code)
      return
    }

    // 子资源路由
    params = matchPath(path, 'projects/:code/tasks/tree')
    if (params) {
      handleTaskTree(req, res, params.code)
      return
    }
    params = matchPath(path, 'projects/:code/tasks')
    if (params) {
      handleTasks(req, res, params.code)
      return
    }
    params = matchPath(path, 'projects/:code/tasks/:taskId')
    if (params) {
      handleTaskById(req, res, params.code, params.taskId)
      return
    }
    params = matchPath(path, 'projects/:code/milestones')
    if (params) {
      handleMilestones(req, res, params.code)
      return
    }
    params = matchPath(path, 'projects/:code/phases')
    if (params) {
      handlePhases(req, res, params.code)
      return
    }
    params = matchPath(path, 'projects/:code/risks')
    if (params) {
      handleRisks(req, res, params.code)
      return
    }
    params = matchPath(path, 'projects/:code/members')
    if (params) {
      handleMembers(req, res, params.code)
      return
    }
    params = matchPath(path, 'projects/:code/logs')
    if (params) {
      handleStatusLogs(req, res, params.code)
      return
    }

    handleError(res, 'Not found', 'NOT_FOUND', 404)
    return
  }

  handleError(res, 'Not found', 'NOT_FOUND', 404)
}

// ========== 启动服务 ==========

function startServer(): void {
  initDatabase()
  cleanupExpiredIdempotencyKeys()

  const server = createServer(router)

  server.listen(PORT, () => {
    console.log(`[Local API] 服务已启动: http://localhost:${PORT}`)
    console.log(`[Local API] API 基础路径: http://localhost:${PORT}${API_PREFIX}`)
    console.log(`[Local API] 模式: entity (prisma schema SSOT + better-sqlite3 runtime)`)
    console.log(`[Local API] 健康检查: http://localhost:${PORT}/health`)
  })

  process.on('SIGINT', () => {
    console.log('\n[Local API] 正在关闭服务...')
    closeDatabase()
    server.close(() => {
      console.log('[Local API] 服务已关闭')
      process.exit(0)
    })
  })
}

startServer()
