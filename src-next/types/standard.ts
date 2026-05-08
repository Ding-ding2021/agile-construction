export interface StandardItem {
  id: number
  code: string
  name: string
  brand: string | null
  storeType: string | null
  sourceType: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface StandardClause {
  id: number
  standardId: number
  code: string
  title: string
  content: string | null
  clauseType: string
  sortOrder: number
}

export interface StandardRule {
  id: number
  clauseId: number
  judgeType: string
  paramConfig: Record<string, unknown> | null
  description: string | null
}

export const SOURCE_TYPE_OPTIONS = [
  { value: 'brand', label: '品牌标准' },
  { value: 'industry', label: '行业规范' },
  { value: 'supplier', label: '供应商要求' },
  { value: 'project', label: '项目补充' },
] as const

export const CLAUSE_TYPE_OPTIONS = [
  { value: 'execution', label: '执行标准' },
  { value: 'acceptance', label: '验收标准' },
  { value: 'general', label: '通用条款' },
] as const

export const JUDGE_TYPE_OPTIONS = [
  { value: 'boolean', label: '是/否' },
  { value: 'range', label: '数值范围' },
  { value: 'enum', label: '枚举选择' },
] as const

export const STANDARD_STATUS_OPTIONS = [
  { value: 'active', label: '生效中' },
  { value: 'inactive', label: '已停用' },
  { value: 'draft', label: '草稿' },
] as const

export const STANDARD_STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

export const CLAUSE_TYPE_STYLE: Record<string, string> = {
  execution: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  acceptance: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  general: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
}
