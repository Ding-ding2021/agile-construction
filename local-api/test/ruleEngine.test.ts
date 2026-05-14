import { describe, it, expect } from 'vitest'
import { executeRule, executeAcceptanceRules } from '../services/ruleEngine'

describe('executeRule - boolean', () => {
  it('布尔值为 true 时通过', () => {
    const result = executeRule({ judgeType: 'boolean', paramConfig: null }, true)
    expect(result.passed).toBe(true)
    expect(result.actualValue).toBe(true)
    expect(result.message).toBe('校验通过')
  })

  it('布尔值为 false 时不通过', () => {
    const result = executeRule({ judgeType: 'boolean', paramConfig: null }, false)
    expect(result.passed).toBe(false)
    expect(result.actualValue).toBe(false)
    expect(result.message).toBe('校验不通过')
  })

  it('实际值为 null 时不通过', () => {
    const result = executeRule({ judgeType: 'boolean', paramConfig: null }, null)
    expect(result.passed).toBe(false)
    expect(result.message).toBe('期望值为布尔类型')
  })

  it('实际值为非布尔类型时不通过', () => {
    const result = executeRule({ judgeType: 'boolean', paramConfig: null }, 'yes')
    expect(result.passed).toBe(false)
    expect(result.message).toBe('期望值为布尔类型')
  })
})

describe('executeRule - range', () => {
  it('数值在范围内时通过', () => {
    const result = executeRule(
      { judgeType: 'range', paramConfig: JSON.stringify({ min: 0, max: 100, unit: 'mm' }) },
      50
    )
    expect(result.passed).toBe(true)
    expect(result.actualValue).toBe(50)
    expect(result.message).toBe('校验通过')
  })

  it('数值超出范围时不通过', () => {
    const result = executeRule(
      { judgeType: 'range', paramConfig: JSON.stringify({ min: 0, max: 100, unit: 'mm' }) },
      150
    )
    expect(result.passed).toBe(false)
    expect(result.message).toBe('超出范围')
  })

  it('边界值通过', () => {
    const result1 = executeRule(
      { judgeType: 'range', paramConfig: JSON.stringify({ min: 0, max: 100 }) },
      0
    )
    expect(result1.passed).toBe(true)

    const result2 = executeRule(
      { judgeType: 'range', paramConfig: JSON.stringify({ min: 0, max: 100 }) },
      100
    )
    expect(result2.passed).toBe(true)
  })

  it('只有 max 限制时通过', () => {
    const result = executeRule(
      { judgeType: 'range', paramConfig: JSON.stringify({ max: 5, unit: 'mm' }) },
      3
    )
    expect(result.passed).toBe(true)
    expect(result.expectedValue).toContain('5')
  })

  it('paramConfig 为空时不通过', () => {
    const result = executeRule({ judgeType: 'range', paramConfig: null }, 50)
    expect(result.passed).toBe(false)
    expect(result.message).toBe('规则参数格式错误')
  })

  it('负值在范围内通过', () => {
    const result = executeRule(
      { judgeType: 'range', paramConfig: JSON.stringify({ min: -10, max: 0 }) },
      -5
    )
    expect(result.passed).toBe(true)
    expect(result.actualValue).toBe(-5)
  })

  it('字符串格式的 NaN 不通过', () => {
    const result = executeRule(
      { judgeType: 'range', paramConfig: JSON.stringify({ min: 0, max: 100 }) },
      'abc'
    )
    expect(result.passed).toBe(false)
    expect(result.message).toBe('实际值无法转换为数字')
  })
})

describe('executeRule - enum', () => {
  it('值在枚举列表中通过', () => {
    const result = executeRule(
      { judgeType: 'enum', paramConfig: JSON.stringify({ allowed: ['涂料', '壁纸', '瓷砖'] }) },
      '涂料'
    )
    expect(result.passed).toBe(true)
    expect(result.message).toBe('校验通过')
  })

  it('值不在枚举列表中不通过', () => {
    const result = executeRule(
      { judgeType: 'enum', paramConfig: JSON.stringify({ allowed: ['涂料', '壁纸', '瓷砖'] }) },
      '玻璃'
    )
    expect(result.passed).toBe(false)
    expect(result.message).toBe('不在允许的枚举列表中')
  })

  it('枚举列表为空时不通过', () => {
    const result = executeRule(
      { judgeType: 'enum', paramConfig: JSON.stringify({ allowed: [] }) },
      '涂料'
    )
    expect(result.passed).toBe(false)
    expect(result.message).toBe('枚举列表为空')
  })

  it('大小写敏感不通过', () => {
    const result = executeRule(
      { judgeType: 'enum', paramConfig: JSON.stringify({ allowed: ['涂料', '壁纸', '瓷砖'] }) },
      '涂料'
    )
    expect(result.passed).toBe(true)

    const resultUpper = executeRule(
      { judgeType: 'enum', paramConfig: JSON.stringify({ allowed: ['涂料', '壁纸', '瓷砖'] }) },
      '涂料'
    )
    expect(resultUpper.passed).toBe(true)

    const resultLower = executeRule(
      { judgeType: 'enum', paramConfig: JSON.stringify({ allowed: ['Paint', 'Wallpaper'] }) },
      'paint'
    )
    expect(resultLower.passed).toBe(false)
  })

  it('paramConfig 为 null 时不通过', () => {
    const result = executeRule({ judgeType: 'enum', paramConfig: null }, '涂料')
    expect(result.passed).toBe(false)
    expect(result.message).toBe('规则参数格式错误')
  })
})

describe('executeRule - unsupported judgeType', () => {
  it('不支持的判定类型返回不通过', () => {
    const result = executeRule({ judgeType: 'unknown', paramConfig: null }, 'anything')
    expect(result.passed).toBe(false)
    expect(result.message).toBe('不支持的判定类型: unknown')
  })
})

describe('executeAcceptanceRules', () => {
  it('所有规则通过时返回全通过', () => {
    const rules = [
      { id: 1, judgeType: 'boolean', paramConfig: null, description: '消防设备安装' },
      {
        id: 2,
        judgeType: 'range',
        paramConfig: JSON.stringify({ max: 3, unit: 'mm' }),
        description: '地砖缝隙',
      },
      {
        id: 3,
        judgeType: 'enum',
        paramConfig: JSON.stringify({ allowed: ['涂料', '壁纸', '瓷砖'] }),
        description: '墙面材料',
      },
    ]
    const actualValues: Record<string, string | number | boolean> = {
      '1': true,
      '2': 2,
      '3': '瓷砖',
    }

    const result = executeAcceptanceRules(rules, actualValues)

    expect(result.passed).toBe(true)
    expect(result.passedCount).toBe(3)
    expect(result.failedCount).toBe(0)
    expect(result.results).toHaveLength(3)
  })

  it('部分规则通过时返回部分通过', () => {
    const rules = [
      { id: 1, judgeType: 'boolean', paramConfig: null },
      { id: 2, judgeType: 'range', paramConfig: JSON.stringify({ min: 0, max: 100 }) },
      { id: 3, judgeType: 'enum', paramConfig: JSON.stringify({ allowed: ['A', 'B'] }) },
    ]
    const actualValues: Record<string, string | number | boolean> = {
      '1': true,
      '2': 999,
      '3': 'C',
    }

    const result = executeAcceptanceRules(rules, actualValues)

    expect(result.passed).toBe(false)
    expect(result.passedCount).toBe(1)
    expect(result.failedCount).toBe(2)
  })

  it('规则数组为空时返回全通过', () => {
    const result = executeAcceptanceRules([], {})

    expect(result.passed).toBe(true)
    expect(result.passedCount).toBe(0)
    expect(result.failedCount).toBe(0)
    expect(result.results).toHaveLength(0)
  })

  it('description 被拼接到 message 中', () => {
    const rules = [{ id: 1, judgeType: 'boolean', paramConfig: null, description: '消防检查' }]
    const result = executeAcceptanceRules(rules, { '1': false })

    expect(result.results[0].message).toBe('消防检查: 校验不通过')
  })
})
