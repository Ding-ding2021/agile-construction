import type { Request, Response } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

function getProjectId(projectCode: string): number {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) throw new ApiError('Project not found', 'NOT_FOUND', 404)
  return project.id
}

interface TaskToCreate {
  code: string
  name: string
  status: string
  nodeLevelType: string
  priority: string
  taskType: string
  sourceType: string
  description: null
  assigneeId: string
  assigneeName: string
  plannedStartAt: null
  plannedEndAt: null
  parentId: number | null
  requiredFlag: number
  milestoneFlag: number
  ownerRole: string | null
  assigneeType: string | null
  templateCode: string
  parentTemplateCode: string | null
}

export function instantiateFromTemplate(req: Request, res: Response): void {
  const db = getDatabase()
  const projectCode = req.params.code as string
  const projectId = getProjectId(projectCode)
  const templateId = Number(req.body.templateId)

  if (!templateId) throw new ApiError('templateId is required', 'VALIDATION_ERROR', 400)

  const template = db.prepare('SELECT * FROM project_templates WHERE id = ?').get(templateId) as
    | Record<string, unknown>
    | undefined
  if (!template) throw new ApiError('Template not found', 'NOT_FOUND', 404)

  const bindingJson = template.task_template_binding as string | null
  const taskTemplateIds: string[] = bindingJson ? JSON.parse(bindingJson) : []
  if (taskTemplateIds.length === 0)
    throw new ApiError('Template has no task bindings', 'BAD_REQUEST', 400)

  const placeholders = taskTemplateIds.map(() => '?').join(',')
  const taskTemplates = db
    .prepare(
      `SELECT * FROM task_templates WHERE task_template_id IN (${placeholders}) ORDER BY sort_order ASC`
    )
    .all(...taskTemplateIds) as Record<string, unknown>[]

  const now = new Date().toISOString()
  const codeIndex: Record<string, number> = {}

  function buildTaskDef(tpl: Record<string, unknown>): TaskToCreate {
    const code = tpl.task_template_code as string
    codeIndex[code] = (codeIndex[code] || 0) + 1
    const taskCode = `T-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${codeIndex[code]}`
    return {
      code: taskCode,
      name: tpl.task_template_name as string,
      status: '草稿',
      nodeLevelType:
        (tpl.template_level as string) === 'project_root'
          ? 'project_root'
          : (tpl.template_level as string) === 'stage'
            ? 'work_package'
            : 'task',
      priority: 'medium',
      taskType: (tpl.task_type as string) || '标准任务',
      sourceType: 'template',
      description: null,
      assigneeId: '',
      assigneeName: '待分配',
      plannedStartAt: null,
      plannedEndAt: null,
      parentId: null,
      requiredFlag: tpl.required_flag ? 1 : 0,
      milestoneFlag: tpl.milestone_flag ? 1 : 0,
      ownerRole: (tpl.owner_role as string) || null,
      assigneeType: (tpl.assignee_type_default as string) || null,
      templateCode: code,
      parentTemplateCode: (tpl.parent_template_code as string) || null,
    }
  }

  const tasksToCreate: TaskToCreate[] = taskTemplates.map(t => buildTaskDef(t))

  const batchApi = db.transaction(() => {
    const insertStmt = db.prepare(`
      INSERT INTO project_tasks (project_id, code, name, status, assignee_id, assignee_name,
        start_date, due_date, parent_id, node_level_type, priority, task_type, source_type,
        description, required_flag, milestone_flag, owner_role, assignee_type, created_by, created_at, updated_at)
      VALUES (@projectId, @code, @name, @status, @assigneeId, @assigneeName,
        @plannedStartAt, @plannedEndAt, @parentId, @nodeLevelType, @priority, @taskType, @sourceType,
        @description, @requiredFlag, @milestoneFlag, @ownerRole, @assigneeType, @createdBy, @now, @now)
    `)
    const idMap: Record<string, number> = {}
    const createdIds: number[] = []
    for (const item of tasksToCreate) {
      const info = insertStmt.run({
        projectId,
        code: item.code,
        name: item.name,
        status: item.status,
        assigneeId: item.assigneeId,
        assigneeName: item.assigneeName,
        plannedStartAt: item.plannedStartAt,
        plannedEndAt: item.plannedEndAt,
        parentId: item.parentId,
        nodeLevelType: item.nodeLevelType,
        priority: item.priority,
        taskType: item.taskType,
        sourceType: item.sourceType,
        description: item.description,
        requiredFlag: item.requiredFlag,
        milestoneFlag: item.milestoneFlag,
        ownerRole: item.ownerRole,
        assigneeType: item.assigneeType,
        createdBy: 'system',
        now,
      })
      const id = Number(info.lastInsertRowid)
      idMap[item.templateCode] = id
      createdIds.push(id)
    }

    const updateParentStmt = db.prepare('UPDATE project_tasks SET parent_id = ? WHERE code = ?')
    for (const item of tasksToCreate) {
      if (item.parentTemplateCode && idMap[item.parentTemplateCode]) {
        updateParentStmt.run(idMap[item.parentTemplateCode], item.code)
      }
    }

    return createdIds
  })

  const createdTaskIds = batchApi()

  db.prepare(
    `
    INSERT INTO template_instantiations (project_id, template_id, template_version, match_input, output_snapshot, created_at, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    projectId,
    String(templateId),
    template.template_version as string,
    JSON.stringify({ templateId, taskTemplateIds }),
    JSON.stringify({ taskCount: tasksToCreate.length, taskIds: createdTaskIds }),
    now,
    'system'
  )

  res.status(201).json({
    success: true,
    taskCount: tasksToCreate.length,
    taskIds: createdTaskIds,
  })
}
