import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { calculateSlaStatus } from '../services/slaCalculator'

describe('calculateSlaStatus', () => {
  it('dueDate is 7 days away returns normal', () => {
    const dueDate = dayjs().add(7, 'day').toISOString()
    const result = calculateSlaStatus(dueDate, '执行中', null)
    expect(result).toBe('normal')
  })

  it('dueDate is 6 hours away returns warning', () => {
    const dueDate = dayjs().add(6, 'hour').toISOString()
    const result = calculateSlaStatus(dueDate, '执行中', null)
    expect(result).toBe('warning')
  })

  it('dueDate was yesterday returns overdue', () => {
    const dueDate = dayjs().subtract(1, 'day').toISOString()
    const result = calculateSlaStatus(dueDate, '执行中', null)
    expect(result).toBe('overdue')
  })

  it('completed task returns normal even if overdue', () => {
    const dueDate = dayjs().subtract(1, 'day').toISOString()
    const result = calculateSlaStatus(dueDate, '已完成', null)
    expect(result).toBe('normal')
  })

  it('closed task returns normal', () => {
    const dueDate = dayjs().subtract(1, 'day').toISOString()
    const result = calculateSlaStatus(dueDate, '已关闭', null)
    expect(result).toBe('normal')
  })

  it('no dueDate returns normal', () => {
    const result = calculateSlaStatus(null, '执行中', null)
    expect(result).toBe('normal')
  })

  it('dueDate exactly 24 hours away returns warning', () => {
    const dueDate = dayjs().add(24, 'hour').toISOString()
    const result = calculateSlaStatus(dueDate, '执行中', null)
    expect(result).toBe('warning')
  })

  it('dueDate 24 hours + 2 minutes away returns normal', () => {
    const dueDate = dayjs().add(24, 'hour').add(2, 'minute').toISOString()
    const result = calculateSlaStatus(dueDate, '执行中', null)
    expect(result).toBe('normal')
  })

  it('actualEndAt does not affect calculation', () => {
    const futureDate = dayjs().add(7, 'day').toISOString()
    expect(calculateSlaStatus(futureDate, '执行中', '2026-06-01T10:00:00Z')).toBe('normal')

    const pastDate = dayjs().subtract(1, 'day').toISOString()
    expect(calculateSlaStatus(pastDate, '执行中', '2026-06-01T10:00:00Z')).toBe('overdue')

    const warningDate = dayjs().add(6, 'hour').toISOString()
    expect(calculateSlaStatus(warningDate, '执行中', '2026-06-01T10:00:00Z')).toBe('warning')
  })
})
