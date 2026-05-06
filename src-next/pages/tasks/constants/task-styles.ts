export type TaskStatus =
  | '草稿' | '待分配' | '待执行' | '执行中' | '已暂停'
  | '待提交' | '待验收' | '不通过' | '已完成' | '已关闭'

export const STATUS_STYLE: Record<string, { dot: string; bg: string }> = {
  '草稿':   { dot: 'bg-zinc-400',  bg: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
  '待分配': { dot: 'bg-amber-500', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  '待执行': { dot: 'bg-amber-500', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  '执行中': { dot: 'bg-blue-500',  bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  '已暂停': { dot: 'bg-zinc-400',  bg: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
  '待提交': { dot: 'bg-amber-500', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  '待验收': { dot: 'bg-blue-500',  bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  '不通过': { dot: 'bg-red-500',   bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  '已完成': { dot: 'bg-green-500', bg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  '已关闭': { dot: 'bg-zinc-400',  bg: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
}

export const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
]

export function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export const SLA_STYLE: Record<string, string> = {
  '正常': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  '即将超时': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  '超时': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export const PRIORITY_ORDER: Record<string, number> = {
  '紧急': 0,
  '高': 1,
  '中': 2,
  '低': 3,
}

export const ALL_STATUSES: TaskStatus[] = [
  '草稿', '待分配', '待执行', '执行中', '已暂停',
  '待提交', '待验收', '不通过', '已完成', '已关闭',
]
