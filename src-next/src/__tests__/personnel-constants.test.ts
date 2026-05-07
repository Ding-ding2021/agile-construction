import { describe, it, expect } from 'vitest'
import {
  PERSON_STATUS_LABEL,
  AVAILABILITY_LABEL,
  EMPLOYMENT_LABEL,
  RISK_LABEL,
  PERSON_STATUS_STYLE,
  AVAILABILITY_STYLE,
  avatarColor,
} from '@/pages/personnel/constants/personnel-styles'

describe('personnel constants', () => {
  it('PERSON_STATUS_LABEL covers all statuses', () => {
    expect(PERSON_STATUS_LABEL[1]).toBe('在岗')
    expect(PERSON_STATUS_LABEL[2]).toBe('请假')
    expect(PERSON_STATUS_LABEL[3]).toBe('离岗')
    expect(PERSON_STATUS_LABEL[4]).toBe('禁用')
    expect(Object.keys(PERSON_STATUS_LABEL)).toHaveLength(4)
  })

  it('AVAILABILITY_LABEL covers all statuses', () => {
    expect(AVAILABILITY_LABEL[1]).toBe('可分配')
    expect(AVAILABILITY_LABEL[2]).toBe('忙碌')
    expect(AVAILABILITY_LABEL[3]).toBe('不可分配')
    expect(Object.keys(AVAILABILITY_LABEL)).toHaveLength(3)
  })

  it('EMPLOYMENT_LABEL covers all types', () => {
    expect(EMPLOYMENT_LABEL[1]).toBe('内部')
    expect(EMPLOYMENT_LABEL[2]).toBe('外包')
    expect(EMPLOYMENT_LABEL[3]).toBe('供应商')
    expect(Object.keys(EMPLOYMENT_LABEL)).toHaveLength(3)
  })

  it('RISK_LABEL covers all levels', () => {
    expect(RISK_LABEL[1]).toBe('正常')
    expect(RISK_LABEL[2]).toBe('需关注')
    expect(RISK_LABEL[3]).toBe('高风险')
    expect(Object.keys(RISK_LABEL)).toHaveLength(3)
  })
})

describe('PERSON_STATUS_STYLE', () => {
  it('each status has dot and bg', () => {
    for (const s of [1, 2, 3, 4]) {
      expect(PERSON_STATUS_STYLE[s]).toBeDefined()
      expect(PERSON_STATUS_STYLE[s].dot).toContain('bg-')
      expect(PERSON_STATUS_STYLE[s].bg).toContain('bg-')
    }
  })
})

describe('AVAILABILITY_STYLE', () => {
  it('each status has a valid style', () => {
    for (const s of [1, 2, 3]) {
      expect(AVAILABILITY_STYLE[s]).toBeDefined()
      expect(AVAILABILITY_STYLE[s]).toContain('bg-')
    }
  })
})

describe('avatarColor', () => {
  it('returns a valid color class', () => {
    const color = avatarColor('张三')
    expect(color).toContain('bg-')
    expect(color).toContain('text-')
  })

  it('same name returns same color', () => {
    expect(avatarColor('张三')).toBe(avatarColor('张三'))
  })

  it('different names may return different colors', () => {
    const colors = new Set(Array.from({ length: 20 }, (_, i) => avatarColor(`User${i}`)))
    expect(colors.size).toBeGreaterThan(1)
  })
})
