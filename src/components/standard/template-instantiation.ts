import { getStandardTemplateById, getStandardTemplatesByKind } from './standard-template.data'
import type { TaskTemplate } from './template-contract.types'

export interface TemplateInstantiationDiagnostics {
  errors: string[]
  warnings: string[]
  blockedByStatus?: boolean
  blockedTemplateCodes?: string[]
}

export interface InstantiatedTaskSeed {
  templateCode: string
  templateName: string
  parentPath: string
  ownerRole: string
  sortOrder: number
  standardBound: boolean
  predecessorCodes: string[]
}

export interface TemplateInstantiationResult {
  templateName?: string
  tasks: InstantiatedTaskSeed[]
  diagnostics: TemplateInstantiationDiagnostics
}

const collectDependencies = (taskTemplates: TaskTemplate[]) =>
  taskTemplates.flatMap(template =>
    template.dependencyBlueprint.map(dep => ({
      from: dep.fromTemplateCode,
      to: dep.toTemplateCode,
    }))
  )

const hasCycleInDirectedGraph = (
  nodes: string[],
  edges: Array<{ from: string; to: string }>
): boolean => {
  const adjacency = new Map<string, string[]>()
  const inDegree = new Map<string, number>()

  nodes.forEach(node => {
    adjacency.set(node, [])
    inDegree.set(node, 0)
  })

  edges.forEach(({ from, to }) => {
    if (!adjacency.has(from) || !adjacency.has(to)) {
      return
    }
    adjacency.get(from)!.push(to)
    inDegree.set(to, (inDegree.get(to) ?? 0) + 1)
  })

  const queue: string[] = []
  inDegree.forEach((degree, node) => {
    if (degree === 0) {
      queue.push(node)
    }
  })

  let visited = 0
  while (queue.length > 0) {
    const node = queue.shift()!
    visited += 1

    for (const next of adjacency.get(node) ?? []) {
      const nextDegree = (inDegree.get(next) ?? 0) - 1
      inDegree.set(next, nextDegree)
      if (nextDegree === 0) {
        queue.push(next)
      }
    }
  }

  return visited !== nodes.length
}

export const instantiateTaskSeedsFromProjectTemplate = (
  templateId?: string
): TemplateInstantiationResult => {
  if (!templateId) {
    return { tasks: [], diagnostics: { errors: [], warnings: [] } }
  }

  const templateItem = getStandardTemplateById(templateId)

  if (!templateItem || !templateItem.projectTemplate) {
    return {
      tasks: [],
      diagnostics: {
        errors: ['未找到对应的项目模板，无法实例化任务树。'],
        warnings: [],
      },
    }
  }

  if (templateItem.status !== 'active') {
    return {
      tasks: [],
      diagnostics: {
        errors: [
          `模板「${templateItem.name}」当前状态为「${templateItem.status}」，仅 active 模板可实例化。`,
        ],
        warnings: [],
        blockedByStatus: true,
        blockedTemplateCodes: [templateItem.id],
      },
    }
  }

  const projectTemplate = templateItem.projectTemplate
  const allTaskTemplates = getStandardTemplatesByKind('task')
    .filter(item => item.taskTemplate)
    .map(item => item.taskTemplate!)
  const taskTemplateMap = new Map(
    allTaskTemplates.map(item => [item.taskTemplateCode, item] as const)
  )

  const bindings = projectTemplate.taskTemplateBinding
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const boundCodes = bindings.map(binding => binding.taskTemplateCode)
  const missingTemplateCodes = boundCodes.filter(code => !taskTemplateMap.has(code))

  const selectedTaskTemplates = boundCodes
    .map(code => taskTemplateMap.get(code))
    .filter((template): template is TaskTemplate => Boolean(template))

  const inactiveTaskTemplates = selectedTaskTemplates.filter(
    template => template.status !== 'active'
  )
  const activeTaskTemplates = selectedTaskTemplates.filter(template => template.status === 'active')

  const dependencyEdges = collectDependencies(activeTaskTemplates)
  const dependencyOutsideBinding = dependencyEdges.filter(
    edge => !boundCodes.includes(edge.from) || !boundCodes.includes(edge.to)
  )

  const selfDependency = dependencyEdges.filter(edge => edge.from === edge.to)
  const hasCycle = hasCycleInDirectedGraph(boundCodes, dependencyEdges)

  const errors: string[] = []
  const warnings: string[] = []

  if (missingTemplateCodes.length > 0) {
    errors.push(`存在未配置的任务模板编码：${missingTemplateCodes.join('、')}`)
  }

  if (inactiveTaskTemplates.length > 0) {
    errors.push(
      `存在非 active 任务模板，无法实例化：${inactiveTaskTemplates.map(item => item.taskTemplateCode).join('、')}`
    )
  }

  if (selfDependency.length > 0) {
    errors.push(`检测到自依赖关系：${selfDependency.map(item => item.from).join('、')}`)
  }

  if (hasCycle) {
    errors.push('检测到任务模板依赖环，请先修复依赖关系。')
  }

  if (dependencyOutsideBinding.length > 0) {
    warnings.push('存在跨绑定依赖，已在实例化时忽略。')
  }

  const tasks: InstantiatedTaskSeed[] = bindings
    .map(binding => {
      const template = taskTemplateMap.get(binding.taskTemplateCode)
      if (!template || template.status !== 'active') {
        return null
      }

      const predecessorCodes = template.dependencyBlueprint
        .map(item => item.fromTemplateCode)
        .filter(code => boundCodes.includes(code))

      return {
        templateCode: template.taskTemplateCode,
        templateName: template.taskTemplateName,
        parentPath: `${projectTemplate.templateName} / ${template.businessDomain}`,
        ownerRole: template.ownerRole,
        sortOrder: binding.sortOrder,
        standardBound:
          template.standardBinding.defaultExecutionStandardIds.length > 0 &&
          template.standardBinding.defaultAcceptanceStandardIds.length > 0,
        predecessorCodes,
      }
    })
    .filter((item): item is InstantiatedTaskSeed => Boolean(item))

  return {
    templateName: projectTemplate.templateName,
    tasks,
    diagnostics: {
      errors,
      warnings,
      blockedByStatus: inactiveTaskTemplates.length > 0,
      blockedTemplateCodes: inactiveTaskTemplates.map(item => item.taskTemplateCode),
    },
  }
}
