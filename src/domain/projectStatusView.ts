import type { ProjectStage } from '../components/personnel/projectManagement.types'
import type { ProjectStatus } from './projectStatusMachine'
import type { ParentStatus } from './projectParentStatus'
import { getParentStatusTone as getParentTone } from './projectParentStatus'

// ─── 旧版兼容函数 ───────────────────────────────────────────────

export const getProjectStageByStatus = (status: ProjectStatus): ProjectStage => {
  switch (status) {
    case '待立项':
    case '待确认':
      return '启动'
    case '待拆解':
      return '计划'
    case '执行中':
      return '执行'
    case '待验收':
    case '整改中':
      return '监控'
    case '待结算':
    case '已归档':
    case '已中止':
      return '收尾'
    default:
      return '启动'
  }
}

export const getProjectStatusTone = (
  status: ProjectStatus
): 'blue' | 'yellow' | 'green' | 'red' => {
  switch (status) {
    case '待立项':
    case '待确认':
    case '待拆解':
      return 'blue'
    case '待验收':
    case '待结算':
      return 'yellow'
    case '整改中':
    case '已中止':
      return 'red'
    case '执行中':
    case '已归档':
    default:
      return 'green'
  }
}

// ─── 新版父状态函数 ─────────────────────────────────────────────

export const getParentStatusStage = (parent: ParentStatus): ProjectStage => {
  const map: Record<ParentStatus, ProjectStage> = {
    启动: '启动',
    计划: '计划',
    执行: '执行',
    收尾: '收尾',
    归档: '收尾',
  }
  return map[parent]
}

export const getParentProgressFloor = (parent: ParentStatus): number => {
  const floors: Record<ParentStatus, number> = {
    启动: 0,
    计划: 20,
    执行: 40,
    收尾: 90,
    归档: 100,
  }
  return floors[parent]
}

// 新版：根据父状态获取 tone
export const getParentStatusTone = getParentTone

export const normalizeProjectStatus = (rawStatus: string): ProjectStatus => {
  if (
    rawStatus === '待立项' ||
    rawStatus === '待确认' ||
    rawStatus === '待拆解' ||
    rawStatus === '执行中' ||
    rawStatus === '待验收' ||
    rawStatus === '整改中' ||
    rawStatus === '待结算' ||
    rawStatus === '已归档' ||
    rawStatus === '已中止'
  ) {
    return rawStatus as ProjectStatus
  }

  const mapper: Record<string, ProjectStatus> = {
    规划中: '待立项',
    立项审批: '待立项',
    审批中: '待确认',
    方案评审: '待确认',
    资源协调: '待拆解',
    进行中: '执行中',
    待协调: '整改中',
    进度滞后: '整改中',
    验收中: '待验收',
    待验收: '待验收',
  }

  return mapper[rawStatus] ?? '待立项'
}

export const getProgressFloorByStatus = (status: ProjectStatus): number => {
  switch (status) {
    case '待立项':
      return 0
    case '待确认':
      return 10
    case '待拆解':
      return 20
    case '执行中':
      return 40
    case '待验收':
      return 90
    case '整改中':
      return 75
    case '待结算':
      return 96
    case '已归档':
      return 100
    case '已中止':
      return 0
    default:
      return 0
  }
}
