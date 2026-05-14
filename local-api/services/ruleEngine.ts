export interface RuleResult {
  passed: boolean
  actualValue?: string | number | boolean
  expectedValue: string
  message: string
}

export interface AcceptanceResult {
  results: RuleResult[]
  passedCount: number
  failedCount: number
  passed: boolean
}

function parseParamConfig(paramConfig: string | null): Record<string, unknown> | null {
  if (paramConfig === null || paramConfig === undefined) {
    return null
  }
  try {
    return JSON.parse(paramConfig)
  } catch {
    return null
  }
}

export function executeRule(
  rule: { judgeType: string; paramConfig: string | null },
  actualValue: unknown
): RuleResult {
  const { judgeType } = rule

  switch (judgeType) {
    case 'boolean': {
      if (typeof actualValue !== 'boolean') {
        return {
          passed: false,
          actualValue: actualValue as string | number | boolean | undefined,
          expectedValue: '布尔值',
          message: '期望值为布尔类型',
        }
      }
      return {
        passed: actualValue,
        actualValue,
        expectedValue: 'true',
        message: actualValue ? '校验通过' : '校验不通过',
      }
    }

    case 'range': {
      const config = parseParamConfig(rule.paramConfig)
      if (!config) {
        return {
          passed: false,
          actualValue: actualValue as string | number | boolean | undefined,
          expectedValue: '数值范围配置',
          message: '规则参数格式错误',
        }
      }

      const { min, max, unit } = config as { min?: number; max?: number; unit?: string }

      if (min === undefined && max === undefined) {
        return {
          passed: false,
          actualValue: actualValue as string | number | boolean | undefined,
          expectedValue: '数值范围',
          message: '范围参数未配置',
        }
      }

      let numericValue: number

      if (typeof actualValue === 'number') {
        numericValue = actualValue
      } else if (typeof actualValue === 'string') {
        numericValue = Number(actualValue)
        if (isNaN(numericValue)) {
          return {
            passed: false,
            actualValue: actualValue as string | number | boolean | undefined,
            expectedValue: formatRange(min, max, unit),
            message: '实际值无法转换为数字',
          }
        }
      } else if (typeof actualValue === 'boolean') {
        return {
          passed: false,
          actualValue: actualValue as string | number | boolean | undefined,
          expectedValue: formatRange(min, max, unit),
          message: '实际值类型不匹配，期望数字',
        }
      } else {
        return {
          passed: false,
          actualValue: undefined,
          expectedValue: formatRange(min, max, unit),
          message: '实际值类型不匹配，期望数字',
        }
      }

      if (isNaN(numericValue)) {
        return {
          passed: false,
          actualValue: actualValue as string | number | boolean | undefined,
          expectedValue: formatRange(min, max, unit),
          message: '实际值不是有效数字',
        }
      }

      const passed =
        (min === undefined || numericValue >= min) && (max === undefined || numericValue <= max)

      return {
        passed,
        actualValue: numericValue,
        expectedValue: formatRange(min, max, unit),
        message: passed ? '校验通过' : '超出范围',
      }
    }

    case 'enum': {
      const config = parseParamConfig(rule.paramConfig)
      if (!config) {
        return {
          passed: false,
          actualValue: actualValue as string | number | boolean | undefined,
          expectedValue: '枚举列表',
          message: '规则参数格式错误',
        }
      }

      const { allowed } = config as { allowed?: string[] }

      if (!allowed || allowed.length === 0) {
        return {
          passed: false,
          actualValue: actualValue as string | number | boolean | undefined,
          expectedValue: '非空枚举列表',
          message: '枚举列表为空',
        }
      }

      if (typeof actualValue !== 'string') {
        return {
          passed: false,
          actualValue: actualValue as string | number | boolean | undefined,
          expectedValue: allowed.join(' | '),
          message: '实际值类型不匹配，期望字符串',
        }
      }

      const passed = allowed.includes(actualValue)
      return {
        passed,
        actualValue,
        expectedValue: allowed.join(' | '),
        message: passed ? '校验通过' : '不在允许的枚举列表中',
      }
    }

    default:
      return {
        passed: false,
        actualValue: actualValue as string | number | boolean | undefined,
        expectedValue: '有效的判定类型',
        message: `不支持的判定类型: ${judgeType}`,
      }
  }
}

function formatRange(min?: number, max?: number, unit?: string): string {
  const left = min !== undefined ? String(min) : '-∞'
  const right = max !== undefined ? String(max) : '+∞'
  const suffix = unit ? ` (${unit})` : ''
  return `${left} ~ ${right}${suffix}`
}

export function executeAcceptanceRules(
  rules: Array<{ id: number; judgeType: string; paramConfig: string | null; description?: string }>,
  actualValues: Record<string, string | number | boolean>
): AcceptanceResult {
  const results = rules.map(rule => {
    const actualValue = actualValues[String(rule.id)]
    const result = executeRule(rule, actualValue)
    return {
      ...result,
      message: rule.description ? `${rule.description}: ${result.message}` : result.message,
    }
  })

  const passedCount = results.filter(r => r.passed).length
  const failedCount = results.filter(r => !r.passed).length

  return {
    results,
    passedCount,
    failedCount,
    passed: failedCount === 0,
  }
}
