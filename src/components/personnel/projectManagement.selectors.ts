/**
 * 项目管理页面的纯函数层
 * 实现统计汇总、搜索、筛选、排序、分页等纯函数
 */

import type {
  ProjectItem,
  ProjectFilters,
  ProjectStats,
  PaginationState,
  ProjectStage,
} from './projectManagement.types'

/**
 * 计算项目统计数据
 */
export function calculateProjectStats(projects: ProjectItem[]): ProjectStats {
  return {
    total: projects.length,
    active: projects.filter(p => p.stage === '执行').length,
    pendingAcceptance: projects.filter(p => p.status === '待验收' || p.status === '验收中').length,
    risk: projects.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length,
  }
}

/**
 * 根据统计卡片键值筛选项目
 */
export function filterByStatKey(
  projects: ProjectItem[],
  statKey: ProjectFilters['statKey']
): ProjectItem[] {
  switch (statKey) {
    case 'active':
      return projects.filter(p => p.stage === '执行')
    case 'pendingAcceptance':
      return projects.filter(p => p.status === '待验收' || p.status === '验收中')
    case 'risk':
      return projects.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical')
    case 'all':
    default:
      return projects
  }
}

/**
 * 搜索项目（按名称和编号）
 */
export function searchProjects(projects: ProjectItem[], query: string): ProjectItem[] {
  if (!query.trim()) return projects

  const lowerQuery = query.toLowerCase().trim()
  return projects.filter(
    p => p.name.toLowerCase().includes(lowerQuery) || p.code.toLowerCase().includes(lowerQuery)
  )
}

/**
 * 高级筛选项目
 */
export function advancedFilter(
  projects: ProjectItem[],
  filters: Pick<ProjectFilters, 'stage' | 'status' | 'riskOnly'>
): ProjectItem[] {
  let result = projects

  if (filters.stage) {
    result = result.filter(p => p.stage === filters.stage)
  }

  if (filters.status) {
    result = result.filter(p => p.status === filters.status)
  }

  if (filters.riskOnly) {
    result = result.filter(p => p.riskLevel !== null)
  }

  return result
}

/**
 * 排序项目
 */
export function sortProjects(
  projects: ProjectItem[],
  sortBy: ProjectFilters['sortBy']
): ProjectItem[] {
  const sorted = [...projects]

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

    case 'progress-desc':
      return sorted.sort((a, b) => b.progress - a.progress)

    case 'planned-open-asc':
      return sorted.sort(
        (a, b) => new Date(a.plannedOpenDate).getTime() - new Date(b.plannedOpenDate).getTime()
      )

    case 'risk-desc': {
      const riskPriority = { critical: 4, high: 3, medium: 2, low: 1 }
      return sorted.sort((a, b) => {
        const aPriority = a.riskLevel ? riskPriority[a.riskLevel] : 0
        const bPriority = b.riskLevel ? riskPriority[b.riskLevel] : 0
        return bPriority - aPriority
      })
    }

    case 'default':
    default:
      return sorted
  }
}

/**
 * 分组项目
 */
export function groupProjects(
  projects: ProjectItem[],
  groupBy: ProjectFilters['groupBy']
): Map<string, ProjectItem[]> {
  const groups = new Map<string, ProjectItem[]>()

  if (groupBy === 'none') {
    groups.set('全部项目', projects)
    return groups
  }

  projects.forEach(project => {
    let key: string

    switch (groupBy) {
      case 'stage':
        key = project.stage
        break
      case 'owner':
        key = project.owner
        break
      case 'brand':
        key = project.brand
        break
      default:
        key = '未分类'
    }

    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(project)
  })

  return groups
}

/**
 * 分页处理
 */
export function paginateProjects(
  projects: ProjectItem[],
  currentPage: number,
  pageSize: number
): {
  data: ProjectItem[]
  pagination: PaginationState
} {
  const total = projects.length
  const totalPages = Math.ceil(total / pageSize)
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1)

  const startIndex = (validPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    data: projects.slice(startIndex, endIndex),
    pagination: {
      currentPage: validPage,
      pageSize,
      total,
    },
  }
}

/**
 * 看板分列：按项目阶段分列
 */
export function kanbanGroupByStage(projects: ProjectItem[]): Map<ProjectStage, ProjectItem[]> {
  const stages: ProjectStage[] = ['启动', '准备', '执行', '收尾']
  const groups = new Map<ProjectStage, ProjectItem[]>()

  stages.forEach(stage => {
    groups.set(stage, [])
  })

  projects.forEach(project => {
    const stageProjects = groups.get(project.stage)
    if (stageProjects) {
      stageProjects.push(project)
    }
  })

  return groups
}

/**
 * 完整的数据处理流程
 * 统计筛选 -> 搜索 -> 高级筛选 -> 排序 -> 分组/分页
 */
export function processProjects(
  projects: ProjectItem[],
  filters: ProjectFilters,
  pagination: { currentPage: number; pageSize: number }
): {
  data: ProjectItem[]
  pagination: PaginationState
  groups?: Map<string, ProjectItem[]>
} {
  // 1. 统计筛选
  let result = filterByStatKey(projects, filters.statKey)

  // 2. 搜索
  result = searchProjects(result, filters.searchQuery)

  // 3. 高级筛选
  result = advancedFilter(result, {
    stage: filters.stage,
    status: filters.status,
    riskOnly: filters.riskOnly,
  })

  // 4. 排序
  result = sortProjects(result, filters.sortBy)

  // 5. 分组或分页
  if (filters.groupBy !== 'none') {
    const groups = groupProjects(result, filters.groupBy)
    // 分组时也返回分页信息（虽然不分页，但提供总数）
    return {
      data: result,
      pagination: {
        currentPage: 1,
        pageSize: result.length,
        total: result.length,
      },
      groups,
    }
  }

  // 分页
  const paginated = paginateProjects(result, pagination.currentPage, pagination.pageSize)

  return paginated
}

/**
 * 检查是否需要重置页码
 * 当搜索、筛选、排序、每页条数变化时返回 true
 */
export function shouldResetPage(
  prevFilters: ProjectFilters,
  nextFilters: ProjectFilters,
  prevPageSize: number,
  nextPageSize: number
): boolean {
  return (
    prevFilters.searchQuery !== nextFilters.searchQuery ||
    prevFilters.statKey !== nextFilters.statKey ||
    prevFilters.stage !== nextFilters.stage ||
    prevFilters.status !== nextFilters.status ||
    prevFilters.riskOnly !== nextFilters.riskOnly ||
    prevFilters.sortBy !== nextFilters.sortBy ||
    prevFilters.groupBy !== nextFilters.groupBy ||
    prevPageSize !== nextPageSize
  )
}
