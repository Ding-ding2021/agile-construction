import type { TaskFilters, TaskItem, TaskStats, PaginationState } from './taskManagement.types';

export function calculateTaskStats(tasks: TaskItem[]): TaskStats {
  return {
    total: tasks.length,
    pendingAssign: tasks.filter((item) => item.status === '待分配').length,
    executing: tasks.filter((item) => item.status === '执行中').length,
    pendingSubmit: tasks.filter((item) => item.status === '待提交').length,
    pendingAcceptance: tasks.filter((item) => item.status === '待验收').length,
    slaWarningOrOverdue: tasks.filter((item) => item.slaStatus === '即将超时' || item.slaStatus === '超时').length,
    blocked: tasks.filter((item) => item.isBlocked).length,
  };
}

export function filterByStatKey(tasks: TaskItem[], statKey: TaskFilters['statKey']): TaskItem[] {
  switch (statKey) {
    case 'pendingAssign':
      return tasks.filter((item) => item.status === '待分配');
    case 'executing':
      return tasks.filter((item) => item.status === '执行中');
    case 'pendingSubmit':
      return tasks.filter((item) => item.status === '待提交');
    case 'pendingAcceptance':
      return tasks.filter((item) => item.status === '待验收');
    case 'slaRisk':
      return tasks.filter((item) => item.slaStatus === '即将超时' || item.slaStatus === '超时');
    case 'blocked':
      return tasks.filter((item) => item.isBlocked);
    case 'all':
    default:
      return tasks;
  }
}

export function searchTasks(tasks: TaskItem[], query: string): TaskItem[] {
  if (!query.trim()) return tasks;
  const text = query.trim().toLowerCase();
  return tasks.filter((item) =>
    item.name.toLowerCase().includes(text) ||
    item.code.toLowerCase().includes(text) ||
    item.projectName.toLowerCase().includes(text) ||
    item.parentPath.toLowerCase().includes(text),
  );
}

export function advancedFilter(
  tasks: TaskItem[],
  filters: Pick<TaskFilters, 'status' | 'riskLevel' | 'slaStatus' | 'blockedOnly'>,
): TaskItem[] {
  let result = tasks;

  if (filters.status) {
    result = result.filter((item) => item.status === filters.status);
  }

  if (filters.riskLevel) {
    result = result.filter((item) => item.riskLevel === filters.riskLevel);
  }

  if (filters.slaStatus) {
    result = result.filter((item) => item.slaStatus === filters.slaStatus);
  }

  if (filters.blockedOnly) {
    result = result.filter((item) => item.isBlocked);
  }

  return result;
}

export function sortTasks(tasks: TaskItem[], sortBy: TaskFilters['sortBy']): TaskItem[] {
  const sorted = [...tasks];
  const riskRank = { 高风险: 3, 中风险: 2, 低风险: 1 } as const;

  switch (sortBy) {
    case 'planned-end-asc':
      return sorted.sort((a, b) => new Date(a.plannedEndAt).getTime() - new Date(b.plannedEndAt).getTime());
    case 'risk-desc':
      return sorted.sort((a, b) => riskRank[b.riskLevel] - riskRank[a.riskLevel]);
    case 'remind-desc':
      return sorted.sort((a, b) => b.remindCount - a.remindCount);
    case 'default':
    default:
      return sorted;
  }
}

export function paginateTasks(
  tasks: TaskItem[],
  currentPage: number,
  pageSize: number,
): { data: TaskItem[]; pagination: PaginationState } {
  const total = tasks.length;
  const totalPages = Math.ceil(total / pageSize);
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const start = (validPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: tasks.slice(start, end),
    pagination: {
      currentPage: validPage,
      pageSize,
      total,
    },
  };
}

export function processTasks(
  tasks: TaskItem[],
  filters: TaskFilters,
  pagination: { currentPage: number; pageSize: number },
): { data: TaskItem[]; pagination: PaginationState } {
  let result = filterByStatKey(tasks, filters.statKey);
  result = searchTasks(result, filters.searchQuery);
  result = advancedFilter(result, {
    status: filters.status,
    riskLevel: filters.riskLevel,
    slaStatus: filters.slaStatus,
    blockedOnly: filters.blockedOnly,
  });
  result = sortTasks(result, filters.sortBy);
  return paginateTasks(result, pagination.currentPage, pagination.pageSize);
}

export function shouldResetPage(
  prevFilters: TaskFilters,
  nextFilters: TaskFilters,
  prevPageSize: number,
  nextPageSize: number,
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
  );
}
