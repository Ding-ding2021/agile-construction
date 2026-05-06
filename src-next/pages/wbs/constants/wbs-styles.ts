import type { WBSStatus, WBSNodeLevel } from '@/types/wbs'

export const WBS_STATUS_STYLE: Record<WBSStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export const WBS_LEVEL_STYLE: Record<WBSNodeLevel, { nameStyle: string; indentColor: string }> = {
  workPackage: {
    nameStyle: 'font-semibold text-foreground',
    indentColor: 'border-l-2 border-foreground/20',
  },
  task: {
    nameStyle: 'font-medium text-foreground',
    indentColor: 'border-l-2 border-foreground/10',
  },
  subtask: { nameStyle: 'text-muted-foreground', indentColor: 'border-l-2 border-foreground/5' },
}

export const WBS_LEVEL_INDENT = 28
