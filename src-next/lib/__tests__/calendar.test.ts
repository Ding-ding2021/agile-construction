import { describe, it, expect } from 'vitest'
import { isWorkingDay, getWorkingDays, getNonWorkingDays } from '../calendar'

interface DayStatus {
  date: string
  isWorkingDay: boolean
  reason: string | null
}

const HOLIDAYS_2026: DayStatus[] = [
  { date: '2026-01-01', isWorkingDay: false, reason: '元旦' },
  { date: '2026-05-01', isWorkingDay: false, reason: '劳动节' },
  { date: '2026-05-02', isWorkingDay: false, reason: '劳动节' },
  { date: '2026-05-03', isWorkingDay: false, reason: '劳动节' },
  { date: '2026-05-04', isWorkingDay: true, reason: '调休' },
]

describe('isWorkingDay', () => {
  it('普通周一为工作日', () => {
    expect(isWorkingDay('2026-05-11', HOLIDAYS_2026)).toBe(true)
  })
  it('普通周日为非工作日', () => {
    expect(isWorkingDay('2026-05-10', HOLIDAYS_2026)).toBe(false)
  })
  it('法定假日为非工作日', () => {
    expect(isWorkingDay('2026-05-01', HOLIDAYS_2026)).toBe(false)
  })
  it('调休上班日为工作日', () => {
    expect(isWorkingDay('2026-05-04', HOLIDAYS_2026)).toBe(true)
  })
  it('空例外列表退回到周末规则', () => {
    expect(isWorkingDay('2026-05-10', [])).toBe(false)
    expect(isWorkingDay('2026-05-11', [])).toBe(true)
  })
})

describe('getWorkingDays', () => {
  it('区间内返回工作日列表（排除假期）', () => {
    const days = getWorkingDays('2026-04-30', '2026-05-03', HOLIDAYS_2026)
    expect(days).toContain('2026-04-30')
    expect(days).not.toContain('2026-05-01')
    expect(days).not.toContain('2026-05-02')
    expect(days).not.toContain('2026-05-03')
  })
})

describe('getNonWorkingDays', () => {
  it('区间内返回非工作日列表（含假期）', () => {
    const days = getNonWorkingDays('2026-04-30', '2026-05-02', HOLIDAYS_2026)
    const dates = days.map(d => d.date)
    expect(dates).toContain('2026-05-01')
    expect(dates).toContain('2026-05-02')
  })
  it('非工作日包含 reason', () => {
    const days = getNonWorkingDays('2026-05-01', '2026-05-01', HOLIDAYS_2026)
    expect(days[0].reason).toBe('劳动节')
  })
})
