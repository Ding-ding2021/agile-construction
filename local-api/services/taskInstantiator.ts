import { getDatabase } from '../store/sqlite'

export interface InstantiationInput {
  projectId: number
  templateIds: string[]
  projectStartDate: string
}

export interface InstantiationResult {
  createdTasks: Array<{ id: number; code: string; name: string; parentId: number | null }>
  warnings: string[]
}

interface PreviewTaskNode {
  code: string
  name: string
  level: string
  children: PreviewTaskNode[]
}

export interface PreviewResult {
  taskTree: PreviewTaskNode[]
  taskCount: number
  warnings: string[]
}

function mapLevel(templateLevel: string): string {
  if (templateLevel === 'project_root') return 'project_root'
  if (templateLevel === 'stage') return 'work_package'
  return 'task'
}

function getRootTemplates(
  templates: Record<string, unknown>[],
  templateIds: string[]
): Record<string, unknown>[] {
  return templates.filter(t => {
    const parentCode = t.parent_template_code as string | null
    return !parentCode || !templateIds.includes(parentCode)
  })
}

function getChildren(
  templates: Record<string, unknown>[],
  parentCode: string
): Record<string, unknown>[] {
  return templates.filter(t => t.parent_template_code === parentCode)
}

export function instantiateFromTemplates(input: InstantiationInput): InstantiationResult {
  const { projectId, templateIds } = input

  if (templateIds.length === 0) {
    return { createdTasks: [], warnings: [] }
  }

  const db = getDatabase()
  const warnings: string[] = []

  const placeholders = templateIds.map(() => '?').join(',')
  const taskTemplates = db
    .prepare(
      `SELECT * FROM task_templates WHERE task_template_id IN (${placeholders}) ORDER BY sort_order ASC`
    )
    .all(...templateIds) as Record<string, unknown>[]

  const foundIds = new Set(taskTemplates.map(t => t.task_template_id as string))
  const missingIds = templateIds.filter(id => !foundIds.has(id))
  for (const mid of missingIds) {
    warnings.push(`任务模板 ${mid} 不存在，已跳过`)
  }

  if (taskTemplates.length === 0) {
    return { createdTasks: [], warnings }
  }

  const rootTemplates = getRootTemplates(taskTemplates, templateIds)

  const insertStmt = db.prepare(`
    INSERT INTO project_tasks (project_id, code, name, status, assignee_id, assignee_name,
      start_date, due_date, parent_id, node_level_type, priority, task_type, source_type,
      description, required_flag, milestone_flag, owner_role, assignee_type, created_by, created_at, updated_at)
    VALUES (@projectId, @code, @name, @status, @assigneeId, @assigneeName,
      @plannedStartAt, @plannedEndAt, @parentId, @nodeLevelType, @priority, @taskType, @sourceType,
      @description, @requiredFlag, @milestoneFlag, @ownerRole, @assigneeType, @createdBy, @now, @now)
  `)

  let globalIndex = 0

  function buildTask(
    tpl: Record<string, unknown>,
    parentId: number | null
  ): Array<{ id: number; code: string; name: string; parentId: number | null }> {
    globalIndex += 1
    const taskCode = `T-${Date.now()}-${globalIndex}`

    const now = new Date().toISOString()
    const info = insertStmt.run({
      projectId,
      code: taskCode,
      name: tpl.task_template_name as string,
      status: '草稿',
      assigneeId: '',
      assigneeName: '待分配',
      plannedStartAt: null,
      plannedEndAt: null,
      parentId,
      nodeLevelType: mapLevel(tpl.template_level as string),
      priority: 'medium',
      taskType: (tpl.task_type as string) || '标准任务',
      sourceType: 'template',
      description: null,
      requiredFlag: (tpl.required_flag as number) ? 1 : 0,
      milestoneFlag: (tpl.milestone_flag as number) ? 1 : 0,
      ownerRole: (tpl.owner_role as string) || null,
      assigneeType: (tpl.assignee_type_default as string) || null,
      createdBy: 'system',
      now,
    })

    const newId = Number(info.lastInsertRowid)
    const result: Array<{ id: number; code: string; name: string; parentId: number | null }> = [
      { id: newId, code: taskCode, name: tpl.task_template_name as string, parentId },
    ]

    const children = getChildren(taskTemplates, tpl.task_template_code as string)
    for (const child of children) {
      const childResults = buildTask(child, newId)
      result.push(...childResults)
    }

    return result
  }

  const batchInsert = db.transaction(() => {
    const allResults: Array<{ id: number; code: string; name: string; parentId: number | null }> = []
    for (const root of rootTemplates) {
      const results = buildTask(root, null)
      allResults.push(...results)
    }
    return allResults
  })

  const createdTasks = batchInsert()

  return { createdTasks, warnings }
}

export function previewInstantiation(input: InstantiationInput): PreviewResult {
  const { templateIds } = input

  if (templateIds.length === 0) {
    return { taskTree: [], taskCount: 0, warnings: [] }
  }

  const db = getDatabase()
  const warnings: string[] = []

  const placeholders = templateIds.map(() => '?').join(',')
  const taskTemplates = db
    .prepare(
      `SELECT * FROM task_templates WHERE task_template_id IN (${placeholders}) ORDER BY sort_order ASC`
    )
    .all(...templateIds) as Record<string, unknown>[]

  const foundIds = new Set(taskTemplates.map(t => t.task_template_id as string))
  const missingIds = templateIds.filter(id => !foundIds.has(id))
  for (const mid of missingIds) {
    warnings.push(`任务模板 ${mid} 不存在，已跳过`)
  }

  if (taskTemplates.length === 0) {
    return { taskTree: [], taskCount: 0, warnings }
  }

  const rootTemplates = getRootTemplates(taskTemplates, templateIds)

  function buildPreviewTree(tpl: Record<string, unknown>): PreviewTaskNode {
    const children = getChildren(taskTemplates, tpl.task_template_code as string)
    return {
      code: tpl.task_template_code as string,
      name: tpl.task_template_name as string,
      level: tpl.template_level as string,
      children: children.map(buildPreviewTree),
    }
  }

  const taskTree = rootTemplates.map(buildPreviewTree)

  function countNodes(nodes: PreviewTaskNode[]): number {
    let count = 0
    for (const node of nodes) {
      count += 1
      count += countNodes(node.children)
    }
    return count
  }

  return { taskTree, taskCount: countNodes(taskTree), warnings }
}
