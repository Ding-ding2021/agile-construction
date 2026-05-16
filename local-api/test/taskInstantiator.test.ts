import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getDatabase } from '../store/sqlite'
import {
  instantiateFromTemplates,
  previewInstantiation,
} from '../services/taskInstantiator'
import type { Database as DatabaseType } from 'better-sqlite3'

function seedProject(db: DatabaseType): { projectId: number } {
  db.prepare(
    `
    INSERT INTO projects (code, name, brand, parent_status, stage, planned_open_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `
  ).run('TINST-PRJ-001', '实例化测试项目', '测试品牌', '启动', '施工', '2026-06-01')

  const projectId = (
    db.prepare('SELECT id FROM projects WHERE code = ?').get('TINST-PRJ-001') as { id: number }
  ).id

  return { projectId }
}

function seedSingleTemplate(db: DatabaseType): void {
  const now = new Date().toISOString()
  db.prepare(
    `
    INSERT INTO task_templates (task_template_id, task_template_code, task_template_name, task_template_version,
      status, template_level, business_domain, task_type, required_flag, milestone_flag, owner_role, assignee_type_default, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    'TT-SINGLE',
    'TT-SINGLE',
    '独立任务',
    '1.0.0',
    'active',
    'task',
    '通用',
    '标准任务',
    1,
    0,
    '项目经理',
    '内部',
    1,
    now,
    now
  )
}

function seedParentChildTemplates(db: DatabaseType): void {
  const now = new Date().toISOString()
  db.prepare(
    `
    INSERT INTO task_templates (task_template_id, task_template_code, task_template_name, task_template_version,
      status, template_level, business_domain, task_type, required_flag, milestone_flag, owner_role, assignee_type_default, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    'TT-PARENT',
    'TT-PARENT',
    '父级工作包',
    '1.0.0',
    'active',
    'stage',
    '工程',
    '标准任务',
    1,
    0,
    '项目经理',
    '内部',
    1,
    now,
    now
  )

  db.prepare(
    `
    INSERT INTO task_templates (task_template_id, task_template_code, task_template_name, task_template_version,
      status, template_level, business_domain, task_type, required_flag, milestone_flag, owner_role, assignee_type_default, parent_template_code, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    'TT-CHILD',
    'TT-CHILD',
    '子级任务',
    '1.0.0',
    'active',
    'task',
    '工程',
    '标准任务',
    1,
    0,
    '施工员',
    '外包',
    'TT-PARENT',
    1,
    now,
    now
  )
}

function cleanTestData(db: DatabaseType): void {
  db.exec(`
    DELETE FROM template_instantiations;
    DELETE FROM project_tasks;
    DELETE FROM task_templates;
    DELETE FROM projects;
  `)
}

describe('taskInstantiator', () => {
  let db: DatabaseType

  beforeEach(() => {
    db = getDatabase()
    cleanTestData(db)
  })

  describe('instantiateFromTemplates', () => {
    it('单一模板扩展（无子任务）', () => {
      const { projectId } = seedProject(db)
      seedSingleTemplate(db)

      const result = instantiateFromTemplates({
        projectId,
        templateIds: ['TT-SINGLE'],
        projectStartDate: '',
      })

      expect(result.createdTasks).toHaveLength(1)
      expect(result.warnings).toEqual([])
      expect(result.createdTasks[0]).toMatchObject({
        name: '独立任务',
        parentId: null,
      })
      expect(result.createdTasks[0].id).toBeGreaterThan(0)
      expect(result.createdTasks[0].code).toBeTruthy()

      const saved = db
        .prepare('SELECT * FROM project_tasks WHERE id = ?')
        .get(result.createdTasks[0].id) as Record<string, unknown>
      expect(saved).toBeTruthy()
      expect(saved.name).toBe('独立任务')
      expect(saved.status).toBe('草稿')
      expect(saved.source_type).toBe('template')
      expect(saved.parent_id).toBeNull()
      expect(saved.node_level_type).toBe('task')
    })

    it('父子模板递归展开，子任务 parentId 正确', () => {
      const { projectId } = seedProject(db)
      seedParentChildTemplates(db)

      const result = instantiateFromTemplates({
        projectId,
        templateIds: ['TT-PARENT', 'TT-CHILD'],
        projectStartDate: '',
      })

      expect(result.createdTasks).toHaveLength(2)
      expect(result.warnings).toEqual([])

      const parent = result.createdTasks.find(t => t.name === '父级工作包')
      const child = result.createdTasks.find(t => t.name === '子级任务')

      expect(parent).toBeDefined()
      expect(child).toBeDefined()
      expect(parent!.parentId).toBeNull()

      expect(child!.parentId).toBe(parent!.id)

      const childRow = db
        .prepare('SELECT * FROM project_tasks WHERE id = ?')
        .get(child!.id) as Record<string, unknown>
      expect(childRow.parent_id).toBe(parent!.id)
    })

    it('空模板 ID 数组返回空结果', () => {
      const { projectId } = seedProject(db)

      const result = instantiateFromTemplates({
        projectId,
        templateIds: [],
        projectStartDate: '',
      })

      expect(result.createdTasks).toEqual([])
      expect(result.warnings).toEqual([])
    })

    it('不存在的模板 ID 返回警告', () => {
      const { projectId } = seedProject(db)
      seedSingleTemplate(db)

      const result = instantiateFromTemplates({
        projectId,
        templateIds: ['TT-SINGLE', 'NON-EXISTENT'],
        projectStartDate: '',
      })

      expect(result.createdTasks).toHaveLength(1)
      expect(result.warnings).toHaveLength(1)
      expect(result.warnings[0]).toContain('NON-EXISTENT')
    })

    it('事务原子性：插入冲突时全部回滚', () => {
      const { projectId } = seedProject(db)
      seedParentChildTemplates(db)

      const fixedNow = 1700000000000
      vi.spyOn(Date, 'now').mockReturnValue(fixedNow)

      const conflictNow = new Date().toISOString()
      db.prepare(
        `INSERT INTO project_tasks (project_id, code, name, status, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(projectId, `T-${fixedNow}-1`, '冲突任务', '草稿', 'test', conflictNow, conflictNow)

      expect(() => {
        instantiateFromTemplates({
          projectId,
          templateIds: ['TT-PARENT', 'TT-CHILD'],
          projectStartDate: '',
        })
      }).toThrow()

      const remaining = db
        .prepare('SELECT COUNT(*) AS cnt FROM project_tasks WHERE project_id = ?')
        .get(projectId) as { cnt: number }
      expect(remaining.cnt).toBe(1)

      vi.restoreAllMocks()
    })
  })

  describe('previewInstantiation', () => {
    it('预览不写入数据库', () => {
      const { projectId } = seedProject(db)
      seedParentChildTemplates(db)

      const beforeCount = (
        db.prepare('SELECT COUNT(*) AS cnt FROM project_tasks').get() as { cnt: number }
      ).cnt

      const result = previewInstantiation({
        projectId,
        templateIds: ['TT-PARENT', 'TT-CHILD'],
        projectStartDate: '',
      })

      const afterCount = (
        db.prepare('SELECT COUNT(*) AS cnt FROM project_tasks').get() as { cnt: number }
      ).cnt

      expect(afterCount).toBe(beforeCount)

      expect(result.taskTree).toHaveLength(1)
      expect(result.taskTree[0].name).toBe('父级工作包')
      expect(result.taskTree[0].children).toHaveLength(1)
      expect(result.taskTree[0].children[0].name).toBe('子级任务')
      expect(result.taskCount).toBe(2)
      expect(result.warnings).toEqual([])
    })
  })
})
