import { describe, it, expect, afterAll } from 'vitest'
import request from 'supertest'
import app from '../app'
import { getTestDb, createTestProject } from './helpers'

describe('任务实例化 API', () => {
  let projectCode: string
  let projectTemplateId: number

  afterAll(() => {
    const db = getTestDb()
    db.exec(`
      DELETE FROM template_instantiations;
      DELETE FROM task_event_logs;
      DELETE FROM task_submissions;
      DELETE FROM project_tasks;
      DELETE FROM task_templates;
      DELETE FROM project_templates;
      DELETE FROM projects WHERE code LIKE 'PRJ-TE%';
    `)
  })

  it('准备工作：创建项目 + 项目模板 + 任务模板（含父子层级）', () => {
    const db = getTestDb()
    projectCode = createTestProject()

    const now = new Date().toISOString()
    db.prepare(
      `INSERT INTO task_templates (task_template_id, task_template_code, task_template_name, task_template_version,
        status, template_level, business_domain, task_type, required_flag, milestone_flag, owner_role, assignee_type_default, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      'TT-PARENT',
      'TT-PARENT',
      '父级工作包',
      '1.0.0',
      'active',
      'work_package',
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

    db.prepare(
      `INSERT INTO task_templates (task_template_id, task_template_code, task_template_name, task_template_version,
        status, template_level, business_domain, task_type, required_flag, milestone_flag, owner_role, assignee_type_default, parent_template_code, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      'TT-CHILD',
      'TT-CHILD',
      '子级任务',
      '1.0.0',
      'active',
      'task',
      '通用',
      '标准任务',
      1,
      0,
      '施工员',
      '内部',
      'TT-PARENT',
      2,
      now,
      now
    )

    const result = db
      .prepare(
        `INSERT INTO project_templates (template_id, template_code, template_name, template_version, status, priority, task_template_binding, meta, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        'pt_test_1',
        'TPL-TEST',
        '测试项目模板',
        '1.0.0',
        'active',
        0,
        JSON.stringify(['TT-PARENT', 'TT-CHILD']),
        JSON.stringify({}),
        now,
        now
      )

    projectTemplateId = Number(result.lastInsertRowid)
    expect(projectTemplateId).toBeGreaterThan(0)
  })

  it('POST /api/projects/:code/instantiate — 从模板实例化任务', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectCode}/instantiate`)
      .send({ templateId: projectTemplateId })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.taskCount).toBeGreaterThan(0)
    expect(Array.isArray(res.body.taskIds)).toBe(true)
    expect(res.body.taskIds.length).toBe(2)

    const db = getTestDb()
    const projectId = (
      db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as { id: number }
    ).id
    const parentTask = db
      .prepare('SELECT id, parent_id FROM project_tasks WHERE project_id = ? AND name = ?')
      .get(projectId, '父级工作包') as { id: number; parent_id: number | null } | undefined
    expect(parentTask).toBeDefined()
    expect(parentTask!.parent_id).toBeNull()

    const childTask = db
      .prepare('SELECT parent_id FROM project_tasks WHERE name = ?')
      .get('子级任务') as { parent_id: number | null } | undefined
    expect(childTask).toBeDefined()
    expect(childTask!.parent_id).toBe(parentTask!.id)
  })

  it.skip('GET /api/projects/:code/tasks/instantiate/preview — 预览模板实例化（路由待实现）', async () => {
    const templateIds = JSON.stringify(['TT-PARENT', 'TT-CHILD'])
    const res = await request(app).get(
      `/api/projects/${projectCode}/tasks/instantiate/preview?templateIds=${encodeURIComponent(templateIds)}`
    )
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.taskTree)).toBe(true)
    expect(res.body.taskCount).toBeGreaterThan(0)
    expect(res.body.taskCount).toBe(2)

    const db = getTestDb()
    const projectId = (
      db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as { id: number }
    ).id
    const taskCount = (
      db
        .prepare('SELECT COUNT(*) as cnt FROM project_tasks WHERE project_id = ?')
        .get(projectId) as { cnt: number }
    ).cnt
    expect(taskCount).toBe(2)

    expect(res.body.taskTree[0].name).toBe('父级工作包')
    expect(res.body.taskTree[0].children).toHaveLength(1)
    expect(res.body.taskTree[0].children[0].name).toBe('子级任务')
  })
})

describe('验收工作流 API', () => {
  let projectCode: string
  let taskId: number

  afterAll(() => {
    const db = getTestDb()
    db.exec(`
      DELETE FROM task_event_logs;
      DELETE FROM task_submissions;
      DELETE FROM project_tasks;
      DELETE FROM projects WHERE code LIKE 'PRJ-TE%';
    `)
  })

  it('准备工作：创建项目和执行中的任务', () => {
    const db = getTestDb()
    projectCode = createTestProject()

    const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as {
      id: number
    }
    const taskCode = `TASK-SUBMIT-${Date.now()}`
    const now = new Date().toISOString()
    db.prepare(
      `INSERT INTO project_tasks (project_id, code, name, status, assignee_id, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(project.id, taskCode, '提交验收测试任务', '执行中', 'worker', 'tester', now, now)

    const task = db.prepare('SELECT id FROM project_tasks WHERE code = ?').get(taskCode) as {
      id: number
    }
    taskId = task.id
    expect(taskId).toBeGreaterThan(0)
  })

  it('POST /api/projects/:code/tasks/:taskId/submissions — 提交任务成果', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectCode}/tasks/${taskId}/submissions`)
      .send({ submissionType: 'normal', description: '施工完成', submittedBy: '张三' })
    expect(res.status).toBe(201)
    expect(res.body.status).toBe('submitted')
    expect(res.body.taskId).toBe(taskId)
    expect(res.body.submittedBy).toBe('张三')

    const db = getTestDb()
    const task = db.prepare('SELECT status FROM project_tasks WHERE id = ?').get(taskId) as {
      status: string
    }
    expect(task.status).toBe('待验收')
  })

  it('PUT /api/projects/:code/tasks/:taskId/submissions/:subId/review — 审核通过', async () => {
    const db = getTestDb()
    const submission = db
      .prepare("SELECT id FROM task_submissions WHERE task_id = ? AND status = 'submitted'")
      .get(taskId) as { id: number } | undefined
    expect(submission).toBeDefined()

    const res = await request(app)
      .put(`/api/projects/${projectCode}/tasks/${taskId}/submissions/${submission!.id}/review`)
      .send({ reviewResult: 'pass', reviewedBy: '李四', reviewComment: '验收通过' })
    expect(res.status).toBe(200)
    expect(res.body.submission.status).toBe('accepted')
    expect(res.body.submission.reviewResult).toBe('pass')
    expect(res.body.submission.reviewComment).toBe('验收通过')
    expect(res.body.submission.reviewedBy).toBe('李四')
    expect(res.body.taskStatus).toBe('已完成')

    const task = db.prepare('SELECT status FROM project_tasks WHERE id = ?').get(taskId) as {
      status: string
    }
    expect(task.status).toBe('已完成')
  })

  it('准备工作：创建退回+派生整改任务场景', () => {
    const db = getTestDb()
    const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as {
      id: number
    }
    const taskCode = `TASK-REJECT-${Date.now()}`
    const now = new Date().toISOString()
    db.prepare(
      `INSERT INTO project_tasks (project_id, code, name, status, assignee_id, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(project.id, taskCode, '退回测试任务', '执行中', 'worker', 'tester', now, now)

    taskId = (
      db.prepare('SELECT id FROM project_tasks WHERE code = ?').get(taskCode) as { id: number }
    ).id
  })

  it('PUT /api/projects/:code/tasks/:taskId/submissions/:subId/review — 审核退回并生成派生整改任务', async () => {
    const db = getTestDb()
    const subRes = await request(app)
      .post(`/api/projects/${projectCode}/tasks/${taskId}/submissions`)
      .send({ submissionType: 'normal', description: '施工完成', submittedBy: '张三' })
    expect(subRes.status).toBe(201)
    const subId = subRes.body.id

    const res = await request(app)
      .put(`/api/projects/${projectCode}/tasks/${taskId}/submissions/${subId}/review`)
      .send({
        reviewResult: 'reject',
        reviewedBy: '李四',
        reviewComment: '需要整改',
        createDerivedTask: true,
      })
    expect(res.status).toBe(200)
    expect(res.body.submission.status).toBe('rejected')
    expect(res.body.taskStatus).toBe('不通过')

    const task = db.prepare('SELECT status FROM project_tasks WHERE id = ?').get(taskId) as {
      status: string
    }
    expect(task.status).toBe('不通过')

    expect(res.body.derivedTask).toBeDefined()
    expect(res.body.derivedTask.isRectification).toBe(1)
    expect(res.body.derivedTask.derivedFromTaskId).toBe(taskId)
  })

  it('POST /api/projects/:code/tasks/:taskId/submissions — 草稿状态任务提交返回 400', async () => {
    const db = getTestDb()
    const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as {
      id: number
    }
    const taskCode = `TASK-DRAFT-${Date.now()}`
    const now = new Date().toISOString()
    db.prepare(
      `INSERT INTO project_tasks (project_id, code, name, status, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(project.id, taskCode, '草稿任务', '草稿', 'tester', now, now)
    const draftTaskId = (
      db.prepare('SELECT id FROM project_tasks WHERE code = ?').get(taskCode) as { id: number }
    ).id

    const res = await request(app)
      .post(`/api/projects/${projectCode}/tasks/${draftTaskId}/submissions`)
      .send({ submissionType: 'normal', submittedBy: '张三' })
    expect(res.status).toBe(400)
  })
})

describe('查询增强 - slaStatus 注入', () => {
  let projectCode: string

  afterAll(() => {
    const db = getTestDb()
    db.exec(`
      DELETE FROM task_event_logs;
      DELETE FROM task_submissions;
      DELETE FROM project_tasks;
      DELETE FROM projects WHERE code LIKE 'PRJ-TE%';
    `)
  })

  it('准备工作：创建项目和逾期任务', () => {
    const db = getTestDb()
    projectCode = createTestProject()

    const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as {
      id: number
    }
    const taskCode = `TASK-SLA-${Date.now()}`
    db.prepare(
      `INSERT INTO project_tasks (project_id, code, name, status, due_date, created_by, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
    ).run(project.id, taskCode, '逾期任务', '执行中', '2025-01-01T00:00:00.000Z', 'test')
  })

  it('GET /api/projects/:code/tasks — 返回 _slaStatus 字段', async () => {
    const res = await request(app).get(`/api/projects/${projectCode}/tasks`)
    expect(res.status).toBe(200)
    expect(res.body.data).toBeInstanceOf(Array)
    expect(res.body.data.length).toBeGreaterThan(0)

    const overdueTask = res.body.data.find((t: Record<string, unknown>) => t.name === '逾期任务')
    expect(overdueTask).toBeDefined()
    expect(overdueTask).toHaveProperty('_slaStatus')
    expect(overdueTask!._slaStatus).toBe('overdue')
  })
})

describe('任务催办 API', () => {
  let projectCode: string
  let taskId: number

  afterAll(() => {
    const db = getTestDb()
    db.exec(`
      DELETE FROM task_event_logs;
      DELETE FROM task_submissions;
      DELETE FROM project_tasks;
      DELETE FROM projects WHERE code LIKE 'PRJ-TE%';
    `)
  })

  it('准备工作：创建项目和任务', () => {
    const db = getTestDb()
    projectCode = createTestProject()

    const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as {
      id: number
    }
    const taskCode = `TASK-REMIND-${Date.now()}`
    db.prepare(
      `INSERT INTO project_tasks (project_id, code, name, status, created_by, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`
    ).run(project.id, taskCode, '催办测试任务', '执行中', 'test')

    taskId = (
      db.prepare('SELECT id FROM project_tasks WHERE code = ?').get(taskCode) as { id: number }
    ).id
  })

  it('POST /api/projects/:code/tasks/:taskId/remind — 催办任务', async () => {
    const res = await request(app).post(`/api/projects/${projectCode}/tasks/${taskId}/remind`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const db = getTestDb()
    const task = db.prepare('SELECT remind_count FROM project_tasks WHERE id = ?').get(taskId) as {
      remind_count: number
    }
    expect(task.remind_count).toBe(1)
  })

  it('POST /api/projects/:code/tasks/:taskId/remind — 多次催办累计计数', async () => {
    await request(app).post(`/api/projects/${projectCode}/tasks/${taskId}/remind`)
    await request(app).post(`/api/projects/${projectCode}/tasks/${taskId}/remind`)

    const db = getTestDb()
    const task = db.prepare('SELECT remind_count FROM project_tasks WHERE id = ?').get(taskId) as {
      remind_count: number
    }
    expect(task.remind_count).toBe(3)
  })
})
