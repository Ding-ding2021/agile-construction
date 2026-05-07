export interface ProjectTemplateScopes {
  brandScope: string
  storeTypeScope: string
  regionScope: string
  projectTypeScope: string
  serviceScope: string
}

export interface ProjectTemplate {
  id: number
  templateId: string
  templateCode: string
  templateName: string
  templateVersion: string
  status: string
  priority: number
  scopes: ProjectTemplateScopes
  phaseBlueprint: string[]
  milestoneBlueprint: string[]
  taskTemplateBinding: string[]
  meta: Record<string, unknown>
  brand: string
  storeType: string
  createdAt: string
  updatedAt: string
}

export interface TaskTemplate {
  id: number
  taskTemplateId: string
  taskTemplateCode: string
  taskTemplateName: string
  taskTemplateVersion: string
  status: string
  templateLevel: string
  businessDomain: string
  taskType: string
  requiredFlag: boolean
  milestoneFlag: boolean
  ownerRole: string
  assigneeTypeDefault: string
  slaRuleId: string | null
  standardBinding: Record<string, unknown>
  dependencyBlueprint: unknown[]
  childTemplateRefs: unknown[]
  parentTemplateCode: string | null
  sortOrder: number
  meta: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export const TEMPLATE_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿' },
  { value: 'active', label: '生效中' },
  { value: 'inactive', label: '已停用' },
] as const

export const TEMPLATE_STATUS_STYLE: Record<string, string> = {
  draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
}

export const TEMPLATE_LEVEL_OPTIONS = [
  { value: 'project_root', label: '项目根' },
  { value: 'stage', label: '阶段' },
  { value: 'work_package', label: '工作包' },
  { value: 'task', label: '任务' },
] as const
