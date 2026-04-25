export const PROJECT_DETAIL_TABS = [
  'overview',
  'scope',
  'schedule',
  'cost',
  'quality',
  'resources',
  'risk',
  'settings',
] as const

export type ProjectDetailTab = (typeof PROJECT_DETAIL_TABS)[number]

export const isProjectDetailTab = (value: string): value is ProjectDetailTab =>
  PROJECT_DETAIL_TABS.includes(value as ProjectDetailTab)

export const buildProjectDetailTabHash = (
  projectCode: string,
  tab: ProjectDetailTab = 'overview'
) => {
  const encodedCode = encodeURIComponent(projectCode)
  return tab === 'overview' ? `#/projects/${encodedCode}` : `#/projects/${encodedCode}/${tab}`
}

/** 旧生命周期标签 → 新 PMBOK 领域标签 兼容映射 */
export const legacyTabToDomainTab = (legacy: string): ProjectDetailTab => {
  const map: Record<string, ProjectDetailTab> = {
    dashboard: 'overview',
    start: 'scope',
    plan: 'scope',
    execute: 'schedule',
    monitor: 'quality',
    close: 'quality',
    settings: 'settings',
  }
  return map[legacy] ?? 'overview'
}

export const PROJECT_TAB_LABELS: Record<ProjectDetailTab, string> = {
  overview: '项目概览',
  scope: '范围与任务',
  schedule: '进度管理',
  cost: '成本与采购',
  quality: '质量与验收',
  resources: '资源与人员',
  risk: '风险与沟通',
  settings: '设置与 Agent',
}
