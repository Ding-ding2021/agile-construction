import { describe, it, expect } from 'vitest'
import {
  computeExecutionStatus,
  computeAcceptanceStatus,
  computeSettlementStatus,
  computeDispatchStatus,
  computeParentStatus,
  computeHealth,
} from '../services/projectAggregator'
import type {
  TaskData,
  AcceptanceData,
  ProcurementData,
  RiskData,
  ProjectData,
} from '../services/projectAggregator'

// ─── computeExecutionStatus ───────────────────────────────────

describe('computeExecutionStatus', () => {
  it('no tasks returns 未开始', () => {
    expect(computeExecutionStatus([])).toBe('未开始')
  })

  it('all tasks draft returns 未开始', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '草稿', assigneeId: null, assigneeType: null },
      { id: 2, status: '待分配', assigneeId: null, assigneeType: null },
    ]
    expect(computeExecutionStatus(tasks)).toBe('未开始')
  })

  it('some executing returns 进行中', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '草稿', assigneeId: null, assigneeType: null },
      { id: 2, status: '执行中', assigneeId: 'u1', assigneeType: 'person' },
    ]
    expect(computeExecutionStatus(tasks)).toBe('进行中')
  })

  it('some completed with draft returns 进行中 (Decision #9)', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '已完成', assigneeId: 'u1', assigneeType: 'person' },
      { id: 2, status: '草稿', assigneeId: null, assigneeType: null },
    ]
    expect(computeExecutionStatus(tasks)).toBe('进行中')
  })

  it('all terminal returns 已完成', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '已完成', assigneeId: 'u1', assigneeType: 'person' },
      { id: 2, status: '已关闭', assigneeId: 'u2', assigneeType: 'person' },
    ]
    expect(computeExecutionStatus(tasks)).toBe('已完成')
  })

  it('待提交 is active', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '待提交', assigneeId: 'u1', assigneeType: 'person' },
    ]
    expect(computeExecutionStatus(tasks)).toBe('进行中')
  })

  it('待验收 is active', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '待验收', assigneeId: 'u1', assigneeType: 'person' },
    ]
    expect(computeExecutionStatus(tasks)).toBe('进行中')
  })

  it('不通过 is active', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '不通过', assigneeId: 'u1', assigneeType: 'person' },
    ]
    expect(computeExecutionStatus(tasks)).toBe('进行中')
  })
})

// ─── computeAcceptanceStatus ──────────────────────────────────

describe('computeAcceptanceStatus', () => {
  it('no items returns 待验收', () => {
    expect(computeAcceptanceStatus([])).toBe('待验收')
  })

  it('has reject returns 整改中', () => {
    const items: AcceptanceData[] = [{ id: 1, status: '已完成', reviewResult: 'reject' }]
    expect(computeAcceptanceStatus(items)).toBe('整改中')
  })

  it('has 整改中 status returns 整改中', () => {
    const items: AcceptanceData[] = [{ id: 1, status: '整改中', reviewResult: null }]
    expect(computeAcceptanceStatus(items)).toBe('整改中')
  })

  it('has pending returns 验收中', () => {
    const items: AcceptanceData[] = [{ id: 1, status: '待验收', reviewResult: null }]
    expect(computeAcceptanceStatus(items)).toBe('验收中')
  })

  it('has 验收中 returns 验收中', () => {
    const items: AcceptanceData[] = [{ id: 1, status: '验收中', reviewResult: null }]
    expect(computeAcceptanceStatus(items)).toBe('验收中')
  })

  it('all passed returns 已通过', () => {
    const items: AcceptanceData[] = [
      { id: 1, status: '已完成', reviewResult: 'pass' },
      { id: 2, status: '已通过', reviewResult: null },
    ]
    expect(computeAcceptanceStatus(items)).toBe('已通过')
  })

  it('mixed pass and unrelated returns 待验收', () => {
    const items: AcceptanceData[] = [{ id: 1, status: '待确认', reviewResult: null }]
    expect(computeAcceptanceStatus(items)).toBe('待验收')
  })
})

// ─── computeSettlementStatus ──────────────────────────────────

describe('computeSettlementStatus', () => {
  it('no procurements returns 未结算', () => {
    expect(computeSettlementStatus([])).toBe('未结算')
  })

  it('all settled returns 已结算', () => {
    const items: ProcurementData[] = [{ id: 1, status: '已完成', settlement_status: '已结算' }]
    expect(computeSettlementStatus(items)).toBe('已结算')
  })

  it('has settling returns 结算中', () => {
    const items: ProcurementData[] = [{ id: 1, status: '已完成', settlement_status: '待结算' }]
    expect(computeSettlementStatus(items)).toBe('结算中')
  })

  it('settlement_status 结算中 returns 结算中', () => {
    const items: ProcurementData[] = [{ id: 1, status: '已完成', settlement_status: '结算中' }]
    expect(computeSettlementStatus(items)).toBe('结算中')
  })

  it('no settlement_status falls back to status', () => {
    const items: ProcurementData[] = [{ id: 1, status: '待结算' }]
    expect(computeSettlementStatus(items)).toBe('结算中')
  })

  it('mix of settled and not returns 结算中', () => {
    const items: ProcurementData[] = [
      { id: 1, status: '已完成', settlement_status: '已结算' },
      { id: 2, status: '已完成', settlement_status: '待结算' },
    ]
    expect(computeSettlementStatus(items)).toBe('结算中')
  })
})

// ─── computeDispatchStatus ────────────────────────────────────

describe('computeDispatchStatus', () => {
  it('no tasks returns 未派单', () => {
    expect(computeDispatchStatus([])).toBe('未派单')
  })

  it('all assigned returns 已派完', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '执行中', assigneeId: 'u1', assigneeType: 'person' },
      { id: 2, status: '草稿', assigneeId: 'u2', assigneeType: 'person' },
    ]
    expect(computeDispatchStatus(tasks)).toBe('已派完')
  })

  it('some assigned returns 派单中', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '执行中', assigneeId: 'u1', assigneeType: 'person' },
      { id: 2, status: '草稿', assigneeId: null, assigneeType: null },
    ]
    expect(computeDispatchStatus(tasks)).toBe('派单中')
  })

  it('none assigned returns 未派单', () => {
    const tasks: TaskData[] = [
      { id: 1, status: '草稿', assigneeId: null, assigneeType: null },
      { id: 2, status: '待分配', assigneeId: '', assigneeType: null },
    ]
    expect(computeDispatchStatus(tasks)).toBe('未派单')
  })
})

// ─── computeParentStatus ──────────────────────────────────────

describe('computeParentStatus', () => {
  const makeProject = (parentStatus: string): ProjectData => ({
    id: 1,
    parentStatus,
    progress: 0,
    plannedOpenDate: null,
  })

  it('new project stays at 启动', () => {
    expect(computeParentStatus(makeProject('启动'), false, false, false, false)).toBe('启动')
  })

  it('has wbs advances to 计划', () => {
    expect(computeParentStatus(makeProject('启动'), true, false, false, false)).toBe('计划')
  })

  it('has executing task advances to 执行', () => {
    expect(computeParentStatus(makeProject('计划'), true, true, false, false)).toBe('执行')
  })

  it('has acceptance item advances to 监控', () => {
    expect(computeParentStatus(makeProject('执行'), true, true, true, false)).toBe('监控')
  })

  it('all accepted advances to 收尾', () => {
    expect(computeParentStatus(makeProject('监控'), true, true, true, true)).toBe('收尾')
  })

  it('stays at 执行 if no acceptance items', () => {
    expect(computeParentStatus(makeProject('执行'), true, true, false, false)).toBe('执行')
  })

  it('cannot regress from 收尾', () => {
    expect(computeParentStatus(makeProject('收尾'), false, false, false, false)).toBe('收尾')
  })

  it('中止 is terminal and cannot be changed', () => {
    expect(computeParentStatus(makeProject('中止'), true, true, true, true)).toBe('中止')
    expect(computeParentStatus(makeProject('中止'), false, false, false, false)).toBe('中止')
  })
})

// ─── computeHealth ────────────────────────────────────────────

describe('computeHealth', () => {
  const makeRisks = (...levels: string[]): RiskData[] =>
    levels.map((l, i) => ({ id: i + 1, riskLevel: l, status: '开启' }))

  it('no risks returns 正常', () => {
    const h = computeHealth([], 0, 0, 0, 0)
    expect(h.status).toBe('正常')
  })

  it('blocking risk returns 严重', () => {
    const h = computeHealth(makeRisks('严重'), 0, 0, 0, 0)
    expect(h.status).toBe('严重')
  })

  it('sla overdue returns 严重', () => {
    const h = computeHealth([], 0, 0, 0, 1)
    expect(h.status).toBe('严重')
  })

  it('high risk returns 预警', () => {
    const h = computeHealth(makeRisks('高'), 0, 0, 0, 0)
    expect(h.status).toBe('预警')
  })

  it('has overdue task returns 预警', () => {
    const h = computeHealth([], 0, 1, 0, 0)
    expect(h.status).toBe('预警')
  })

  it('medium risk returns 关注', () => {
    const h = computeHealth(makeRisks('中'), 0, 0, 0, 0)
    expect(h.status).toBe('关注')
  })

  it('low risk returns 关注', () => {
    const h = computeHealth(makeRisks('低'), 0, 0, 0, 0)
    expect(h.status).toBe('关注')
  })

  it('closed risks are ignored', () => {
    const risks: RiskData[] = [{ id: 1, riskLevel: '严重', status: '已关闭' }]
    const h = computeHealth(risks, 0, 0, 0, 0)
    expect(h.status).toBe('正常')
  })

  it('indicators contains 4 items', () => {
    const h = computeHealth(makeRisks('中'), 10, 0, 3, 0)
    expect(h.indicators).toHaveLength(4)
    expect(h.indicators[3].label).toBe('未分配')
    expect(h.indicators[3].value).toBe('3项')
  })
})
