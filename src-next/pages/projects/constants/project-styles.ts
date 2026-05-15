import type { ProjectItem } from '@/types/project'
import type { MetricCardData } from '@/components/section-cards'

export const HEALTH_STYLE: Record<string, string> = {
  正常: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  关注: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  预警: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  严重: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export const DIMENSION_LABELS: Record<string, string> = {
  executionStatus: '执行维度',
  acceptanceStatus: '验收维度',
  settlementStatus: '结算维度',
  dispatchStatus: '派单维度',
}

export const DIMENSION_ORDER = [
  'executionStatus',
  'acceptanceStatus',
  'settlementStatus',
  'dispatchStatus',
] as const

export function getProjectMetrics(projects: ProjectItem[]): MetricCardData[] {
  return [
    {
      title: '全部项目',
      value: String(projects.length),
      trend: 'neutral',
      description: '所有在建与已建项目',
    },
    {
      title: '健康',
      value: String(projects.filter(p => p.healthStatus === '正常' || !p.healthStatus).length),
      trend: 'up',
      trendLabel: '正常',
      description: '运行正常的项目',
    },
    {
      title: '需关注',
      value: String(
        projects.filter(
          p => p.healthStatus === '关注' || p.healthStatus === '预警' || p.healthStatus === '严重'
        ).length
      ),
      trend: 'down',
      trendLabel: '有风险',
      description: '存在风险或异常的项目',
    },
    {
      title: '已完成',
      value: String(projects.filter(p => p.healthStatus === '正常' && p.progress >= 100).length),
      trend: 'up',
      trendLabel: '完成率',
      description: '已验收或关闭的项目',
    },
  ]
}

export function avatarColor(name: string): string {
  const colors = [
    'bg-red-200 dark:bg-red-800',
    'bg-blue-200 dark:bg-blue-800',
    'bg-green-200 dark:bg-green-800',
    'bg-yellow-200 dark:bg-yellow-800',
    'bg-purple-200 dark:bg-purple-800',
    'bg-pink-200 dark:bg-pink-800',
    'bg-indigo-200 dark:bg-indigo-800',
    'bg-teal-200 dark:bg-teal-800',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
