import type { WBSStatus, WBSNodeLevel } from '@/types/wbs'

export const WBS_STATUS_STYLE: Record<WBSStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export const WBS_LEVEL_STYLE: Record<WBSNodeLevel, { nameStyle: string; codeStyle: string }> = {
  workPackage: {
    nameStyle: 'text-sm font-semibold text-foreground',
    codeStyle: 'text-xs font-semibold text-foreground/50',
  },
  task: {
    nameStyle: 'text-sm font-medium text-foreground/85',
    codeStyle: 'text-xs text-foreground/40',
  },
  subtask: {
    nameStyle: 'text-xs text-muted-foreground',
    codeStyle: 'text-xs text-muted-foreground/60',
  },
}

export const WBS_LEVEL_INDENT = 8 // w-8 = 32px per level
