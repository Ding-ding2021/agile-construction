import type { TaskFilters, TaskItem, TaskStats, PaginationState } from './taskManagement.types'

/**
 * 计算任务统计概览数据
 * 根据任务列表汇总各维度的数量，用于页面顶部的统计卡片展示
 */
export function calculateTaskStats(tasks: TaskItem[]): TaskStats {
  return {
    total: tasks.length,
    pendingAssign: tasks.filter(item => item.status === '待分配').length,
    executing: tasks.filter(item => item.status === '执行中').length,
    pendingSubmit: tasks.filter(item => item.status === '待提交').length,
    pendingAcceptance: tasks.filter(item => item.status === '待验收').length,
    // SLA 风险数 = 即将超时 + 已超时
    slaWarningOrOverdue: tasks.filter(
      item => item.slaStatus === '即将超时' || item.slaStatus === '超时'
    ).length,
    blocked: tasks.filter(item => item.isBlocked).length,
    rectification: tasks.filter(item => item.isRectification).length,
  }
}

/**
 * 按统计卡片键值筛选任务
 * 点击统计卡片时调用，将任务列表限定为对应维度的子集
 */
export function filterByStatKey(tasks: TaskItem[], statKey: TaskFilters['statKey']): TaskItem[] {
  switch (statKey) {
    case 'pendingAssign':
      return tasks.filter(item => item.status === '待分配')
    case 'executing':
      return tasks.filter(item => item.status === '执行中')
    case 'pendingSubmit':
      return tasks.filter(item => item.status === '待提交')
    case 'pendingAcceptance':
      return tasks.filter(item => item.status === '待验收')
    case 'slaRisk':
      return tasks.filter(item => item.slaStatus === '即将超时' || item.slaStatus === '超时')
    case 'blocked':
      return tasks.filter(item => item.isBlocked)
    case 'rectification':
      return tasks.filter(item => item.isRectification)
    case 'all':
    default:
      return tasks
  }
}

/**
 * 模糊搜索任务
 * 匹配范围：任务名称、编码、项目名称、父任务路径
 * 空查询返回全部结果，不中断当前筛选流程
 */
export function searchTasks(tasks: TaskItem[], query: string): TaskItem[] {
  // 空查询不执行过滤
  if (!query.trim()) return tasks
  const text = query.trim().toLowerCase()
  return tasks.filter(
    item =>
      item.name.toLowerCase().includes(text) ||
      item.code.toLowerCase().includes(text) ||
      item.projectName.toLowerCase().includes(text) ||
      // parentPath 为已弃用字段，保留作为过渡期兼容搜索
      (item.parentPath ?? '').toLowerCase().includes(text)
  )
}

/**
 * 高级筛选：支持状态、风险等级、SLA 状态、仅阻塞等多条件叠加
 * 各条件是"与"关系——同时满足所有非空条件
 */
export function advancedFilter(
  tasks: TaskItem[],
  filters: Pick<TaskFilters, 'status' | 'riskLevel' | 'slaStatus' | 'blockedOnly'>
): TaskItem[] {
  let result = tasks

  if (filters.status) {
    result = result.filter(item => item.status === filters.status)
  }

  if (filters.riskLevel) {
    result = result.filter(item => item.riskLevel === filters.riskLevel)
  }

  if (filters.slaStatus) {
    result = result.filter(item => item.slaStatus === filters.slaStatus)
  }

  if (filters.blockedOnly) {
    result = result.filter(item => item.isBlocked)
  }

  return result
}

/**
 * 任务排序
 * @param sortBy - 排序方式：default(保持原序), planned-end-asc(按计划结束时间升序),
 *                 risk-desc(风险从高到低), remind-desc(催办次数从高到低)
 */
export function sortTasks(tasks: TaskItem[], sortBy: TaskFilters['sortBy']): TaskItem[] {
  // 创建副本避免修改原数组
  const sorted = [...tasks]
  const riskRank = { 高风险: 3, 中风险: 2, 低风险: 1 } as const

  switch (sortBy) {
    case 'planned-end-asc':
      return sorted.sort(
        (a, b) => new Date(a.plannedEndAt).getTime() - new Date(b.plannedEndAt).getTime()
      )
    case 'risk-desc':
      return sorted.sort((a, b) => riskRank[b.riskLevel] - riskRank[a.riskLevel])
    case 'remind-desc':
      return sorted.sort((a, b) => b.remindCount - a.remindCount)
    case 'default':
    default:
      return sorted
  }
}

/**
 * 分页计算
 * 自动修正越界的页码（小于 1 修正为 1，大于总页数修正为最后一页）
 * 空列表时 totalPages 取 1 避免除零
 */
export function paginateTasks(
  tasks: TaskItem[],
  currentPage: number,
  pageSize: number
): { data: TaskItem[]; pagination: PaginationState } {
  const total = tasks.length
  const totalPages = Math.ceil(total / pageSize)
  // 将页码钳制在 [1, totalPages] 范围内，空列表时至少为第 1 页
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1)
  const start = (validPage - 1) * pageSize
  const end = start + pageSize

  return {
    data: tasks.slice(start, end),
    pagination: {
      currentPage: validPage,
      pageSize,
      total,
    },
  }
}

/**
 * 任务处理流水线：按顺序执行「统计键筛选 → 模糊搜索 → 高级筛选 → 排序 → 分页」
 * 这是页面使用的核心入口函数
 */
export function processTasks(
  tasks: TaskItem[],
  filters: TaskFilters,
  pagination: { currentPage: number; pageSize: number }
): { data: TaskItem[]; pagination: PaginationState } {
  let result = filterByStatKey(tasks, filters.statKey)
  result = searchTasks(result, filters.searchQuery)
  result = advancedFilter(result, {
    status: filters.status,
    riskLevel: filters.riskLevel,
    slaStatus: filters.slaStatus,
    blockedOnly: filters.blockedOnly,
  })
  result = sortTasks(result, filters.sortBy)
  return paginateTasks(result, pagination.currentPage, pagination.pageSize)
}

/**
 * 判断筛选条件变化时是否需要重置到第 1 页
 * 当任何筛选条件或分页大小发生变化时，页码应重置，避免"第 3 页有数据但筛选后只有 1 页"的情况
 */
export function shouldResetPage(
  prevFilters: TaskFilters,
  nextFilters: TaskFilters,
  prevPageSize: number,
  nextPageSize: number
): boolean {
  return (
    prevFilters.searchQuery !== nextFilters.searchQuery ||
    prevFilters.statKey !== nextFilters.statKey ||
    prevFilters.groupBy !== nextFilters.groupBy ||
    prevFilters.sortBy !== nextFilters.sortBy ||
    prevFilters.status !== nextFilters.status ||
    prevFilters.riskLevel !== nextFilters.riskLevel ||
    prevFilters.slaStatus !== nextFilters.slaStatus ||
    prevFilters.blockedOnly !== nextFilters.blockedOnly ||
    prevPageSize !== nextPageSize
  )
}
