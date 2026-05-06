export const PERSON_STATUS_STYLE: Record<number, { dot: string; bg: string }> = {
  1: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  2: {
    dot: 'bg-amber-500',
    bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  },
  3: { dot: 'bg-red-500', bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  4: { dot: 'bg-zinc-400', bg: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
}

export const AVAILABILITY_STYLE: Record<number, string> = {
  1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  3: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export const PERSON_STATUS_LABEL: Record<number, string> = {
  1: '在岗',
  2: '请假',
  3: '离岗',
  4: '禁用',
}

export const AVAILABILITY_LABEL: Record<number, string> = {
  1: '可分配',
  2: '忙碌',
  3: '不可分配',
}

export const EMPLOYMENT_LABEL: Record<number, string> = {
  1: '内部',
  2: '外包',
  3: '供应商',
}

export const RISK_LABEL: Record<number, string> = {
  1: '正常',
  2: '需关注',
  3: '高风险',
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
