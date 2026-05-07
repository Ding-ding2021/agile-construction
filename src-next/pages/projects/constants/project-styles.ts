import type { ProjectItem } from '@/types/project'

export const PROJECT_STATUS_STYLE: Record<string, string> = {
  待启动: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  执行中: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  待验收: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  已验收: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  已关闭: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  已暂停: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
}

export const PROJECT_TONE_STYLE: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
}

export function getProjectMetrics(projects: ProjectItem[]) {
  return [
    {
      title: '全部项目',
      value: String(projects.length),
      change: '',
      trend: 'neutral' as const,
      icon: 'FolderKanban' as const,
      color: 'blue' as const,
    },
    {
      title: '执行中',
      value: String(projects.filter(p => p.status === '执行中').length),
      change: '',
      trend: 'neutral' as const,
      icon: 'Activity' as const,
      color: 'emerald' as const,
    },
    {
      title: '待验收',
      value: String(projects.filter(p => p.status === '待验收').length),
      change: '',
      trend: 'neutral' as const,
      icon: 'Clock' as const,
      color: 'amber' as const,
    },
    {
      title: '已完成',
      value: String(projects.filter(p => p.status === '已验收' || p.status === '已关闭').length),
      change: '',
      trend: 'neutral' as const,
      icon: 'CheckCircle2' as const,
      color: 'violet' as const,
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
