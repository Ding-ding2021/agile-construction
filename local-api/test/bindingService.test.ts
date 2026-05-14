import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getDatabase } from '../store/sqlite'
import {
  bindStandardsToTask,
  unbindStandard,
  getTaskBindings,
  checkBindingGuard,
  getStandardBindings,
} from '../services/standardBindingService'

let taskId1: number
let taskId2: number
const standardId = 1

beforeAll(() => {
  const db = getDatabase()

  const now = new Date().toISOString()
  db.prepare(
    `
    INSERT INTO projects (code, name, brand, status, parent_status, status_tone, stage, planned_open_date, created_at, updated_at)
    VALUES ('BIND-TEST-PROJECT', '绑定测试项目', '测试品牌', 'active', '启动', 'neutral', '施工', '2026-06-01', ?, ?)
  `
  ).run(now, now)

  const projectRow = db
    .prepare("SELECT id FROM projects WHERE code = 'BIND-TEST-PROJECT'")
    .get() as { id: number }
  const projectId = projectRow.id

  const r1 = db
    .prepare(
      `
    INSERT INTO project_tasks (project_id, code, name, created_by, created_at, updated_at)
    VALUES (?, 'BIND-TASK-001', '绑定测试任务一', 'tester', ?, ?)
  `
    )
    .run(projectId, now, now)
  taskId1 = r1.lastInsertRowid as number

  const r2 = db
    .prepare(
      `
    INSERT INTO project_tasks (project_id, code, name, created_by, snapshot_status, created_at, updated_at)
    VALUES (?, 'BIND-TASK-002', '绑定测试任务二（已生成快照）', 'tester', 'generated', ?, ?)
  `
    )
    .run(projectId, now, now)
  taskId2 = r2.lastInsertRowid as number
})

afterAll(() => {
  const db = getDatabase()
  db.exec(`
    DELETE FROM task_standard_bindings;
    DELETE FROM project_tasks WHERE code IN ('BIND-TASK-001', 'BIND-TASK-002');
    DELETE FROM projects WHERE code = 'BIND-TEST-PROJECT';
  `)
})

describe('bindStandardsToTask', () => {
  it('单条绑定成功并返回 BindingResult', () => {
    const results = bindStandardsToTask(taskId1, [1], 'execution', '测试员')

    expect(results).toHaveLength(1)
    expect(results[0].taskId).toBe(taskId1)
    expect(results[0].clauseId).toBe(1)
    expect(results[0].bindingType).toBe('execution')
    expect(results[0].ruleId).toBe(1)
    expect(results[0].boundBy).toBe('测试员')
    expect(results[0].id).toBeGreaterThan(0)
    expect(results[0].boundAt).toBeTruthy()
  })

  it('批量绑定多条条款成功', () => {
    const results = bindStandardsToTask(taskId1, [2, 3], 'acceptance', '批量操作')

    expect(results).toHaveLength(2)
    expect(results[0].clauseId).toBe(2)
    expect(results[0].bindingType).toBe('acceptance')
    expect(results[0].ruleId).toBe(2)
    expect(results[1].clauseId).toBe(3)
    expect(results[1].bindingType).toBe('acceptance')
    expect(results[1].ruleId).toBe(3)
  })

  it('非法 bindingType 抛出错误', () => {
    expect(() => {
      bindStandardsToTask(taskId1, [1], 'invalid_type')
    }).toThrow('无效的绑定类型')
  })

  it('重复绑定相同 taskId + clauseId + bindingType 抛出错误', () => {
    expect(() => {
      bindStandardsToTask(taskId1, [1], 'execution')
    }).toThrow(/已绑定/)
  })

  it('不传 boundBy 时该字段为 null', () => {
    const results = bindStandardsToTask(taskId2, [1], 'execution')
    expect(results[0].boundBy).toBeNull()
  })

  it('无对应 rule 的 clause 绑定后 ruleId 为 null', () => {
    const db = getDatabase()
    db.prepare(
      `
      INSERT INTO standard_clauses (standard_id, code, title, content, clause_type, sort_order)
      VALUES (?, 'CLS-NO-RULE', '无规则条款', '此条款没有对应规则', 'execution', 99)
    `
    ).run(standardId)
    const clauseRow = db
      .prepare("SELECT id FROM standard_clauses WHERE code = 'CLS-NO-RULE'")
      .get() as { id: number }
    const noRuleClauseId = clauseRow.id

    const results = bindStandardsToTask(taskId1, [noRuleClauseId], 'execution')
    expect(results[0].ruleId).toBeNull()

    db.prepare('DELETE FROM task_standard_bindings WHERE id = ?').run(results[0].id)
    db.prepare('DELETE FROM standard_clauses WHERE id = ?').run(noRuleClauseId)
  })
})

describe('unbindStandard', () => {
  it('解绑成功', () => {
    const results = bindStandardsToTask(taskId2, [2], 'acceptance', '待解绑')

    const bindingId = results[0].id
    unbindStandard(taskId2, bindingId)

    const bindings = getTaskBindings(taskId2)
    const found = bindings.find(b => b.id === bindingId)
    expect(found).toBeUndefined()
  })

  it('解绑不存在的绑定抛出错误', () => {
    expect(() => {
      unbindStandard(99999, 99999)
    }).toThrow('绑定记录不存在')
  })
})

describe('getTaskBindings', () => {
  it('返回任务的所有绑定', () => {
    const bindings = getTaskBindings(taskId1)

    expect(bindings.length).toBeGreaterThanOrEqual(3)
    expect(bindings.every(b => b.taskId === taskId1)).toBe(true)
  })

  it('没有绑定时返回空数组', () => {
    const db = getDatabase()
    const now = new Date().toISOString()
    const r = db
      .prepare(
        `
      INSERT INTO project_tasks (project_id, code, name, created_by, created_at, updated_at)
      VALUES ((SELECT id FROM projects WHERE code = 'BIND-TEST-PROJECT'), 'BIND-TASK-EMPTY', '无绑定任务', 'tester', ?, ?)
    `
      )
      .run(now, now)
    const emptyTaskId = r.lastInsertRowid as number

    const bindings = getTaskBindings(emptyTaskId)
    expect(bindings).toEqual([])

    db.prepare('DELETE FROM project_tasks WHERE id = ?').run(emptyTaskId)
  })
})

describe('checkBindingGuard', () => {
  it('snapshotStatus = draft 时返回 true（允许绑定）', () => {
    expect(checkBindingGuard(taskId1)).toBe(true)
  })

  it('snapshotStatus = generated 时返回 false（禁止绑定）', () => {
    expect(checkBindingGuard(taskId2)).toBe(false)
  })

  it('不存在的任务抛出错误', () => {
    expect(() => checkBindingGuard(99999)).toThrow('任务不存在')
  })
})

describe('getStandardBindings', () => {
  it('返回引用指定标准的绑定列表', () => {
    const bindings = getStandardBindings(standardId)

    expect(bindings.length).toBeGreaterThanOrEqual(3)
    bindings.forEach(b => {
      expect(b.clauseId).toBeGreaterThan(0)
      expect(b.taskId).toBeGreaterThan(0)
    })
  })

  it('未被引用的标准返回空数组', () => {
    const db = getDatabase()
    const now = new Date().toISOString()
    db.prepare(
      `
      INSERT INTO standards (code, name, source_type, status, updated_at)
      VALUES ('STD-UNREF', '未被引用的标准', 'brand', 'active', ?)
    `
    ).run(now)
    const newStdRow = db.prepare("SELECT id FROM standards WHERE code = 'STD-UNREF'").get() as {
      id: number
    }

    const bindings = getStandardBindings(newStdRow.id)
    expect(bindings).toEqual([])

    db.prepare('DELETE FROM standards WHERE id = ?').run(newStdRow.id)
  })
})
