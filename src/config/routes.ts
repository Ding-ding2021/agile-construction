/**
 * 路由配置中心
 *
 * 集中管理所有 hash 路由的定义、匹配规则和组件映射。
 * 消除 App.tsx 中的硬编码 if/else 路由判断。
 */

import { lazy, type ComponentType } from 'react'
import type { ProjectDetailTab } from '../components/project/projectTabs.shared'
import { isProjectDetailTab } from '../components/project/projectTabs.shared'

// ─── Lazy-loaded page components ───────────────────────────────

export const PersonnelPage = lazy(() => import('../components/personnel/PersonnelPage'))
export const PersonnelUserDetailPage = lazy(
  () => import('../components/personnel/PersonnelUserDetailPage')
)
export const ProjectDetailPage = lazy(() => import('../components/project/ProjectDetailPage'))
export const ProjectManagementPage = lazy(
  () => import('../components/project/ProjectManagementPage')
)
export const TaskManagementPage = lazy(() => import('../components/task/TaskManagementPage'))
export const SystemSettingsPage = lazy(() => import('../components/settings/SystemSettingsPage'))
export const StandardManagementPage = lazy(
  () => import('../components/standard/StandardManagementPage')
)
export const StandardTemplateDetailPage = lazy(
  () => import('../components/standard/StandardTemplateDetailPage')
)
export const DigitalEmployeePage = lazy(() => import('../components/digital/DigitalEmployeePage'))
export const EngineerAssistantPage = lazy(
  () => import('../components/digital/EngineerAssistantPage')
)
export const ProcurementManagementPage = lazy(
  () => import('../components/procurement/ProcurementManagementPage')
)
export const SupplierDetailPage = lazy(() => import('../components/procurement/SupplierDetailPage'))
export const ContractSettlementPage = lazy(
  () => import('../components/contracts/ContractSettlementPage')
)
export const OrderManagementPage = lazy(() => import('../components/orders/OrderManagementPage'))
export const FacilityManagementPage = lazy(
  () => import('../components/facility/FacilityManagementPage')
)
export const ResourcePoolPage = lazy(() => import('../components/resource/ResourcePoolPage'))
export const CustomerManagementPage = lazy(
  () => import('../components/customer/CustomerManagementPage')
)

// ─── Route path constants ──────────────────────────────────────

export const ROUTE_PATHS = {
  projects: '#/projects',
  personnel: '#/personnel',
  personnelDetailPrefix: '#/personnel/users',
  tasks: '#/tasks',
  customers: '#/customers',
  procurement: '#/procurement',
  procurementSupplierPrefix: '#/procurement/suppliers/',
  contracts: '#/contracts',
  orders: '#/orders',
  facility: '#/facility',
  resources: '#/resources',
  settings: '#/settings',
  standards: '#/standards',
  standardTemplate: '#/standards/templates',
  standardTemplatePrefix: '#/standards/templates/',
  digitalEmployee: '#/digital-employee',
  engineerAssistant: '#/engineer-assistant',
} as const

// ─── AppRoute discriminated union ──────────────────────────────

export type AppRoute =
  | { page: 'projects' }
  | { page: 'personnel' }
  | { page: 'personnel-detail'; userId: string }
  | { page: 'tasks' }
  | { page: 'task-detail'; taskCode: string }
  | { page: 'customers' }
  | { page: 'procurement'; searchQuery?: string }
  | { page: 'procurement-supplier-detail'; supplierId: string; returnSearchQuery?: string }
  | { page: 'contracts' }
  | { page: 'orders' }
  | { page: 'facility' }
  | { page: 'resources' }
  | { page: 'settings' }
  | { page: 'standards' }
  | { page: 'standard-template-detail'; templateId: string }
  | { page: 'digital-employee' }
  | { page: 'engineer-assistant' }
  | { page: 'detail'; code: string; tab: ProjectDetailTab }
  | { page: 'new-detail'; mode: 'blank' | 'template'; draftId?: string; templateId?: string }

// ─── Page component registry (lazy components, untyped for flexibility) ───

export type PageComponentEntry = {
  page: AppRoute['page']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>
}

export const pageComponentRegistry: PageComponentEntry[] = [
  { page: 'projects', component: ProjectManagementPage },
  { page: 'personnel', component: PersonnelPage },
  { page: 'personnel-detail', component: PersonnelUserDetailPage },
  { page: 'tasks', component: TaskManagementPage },
  { page: 'customers', component: CustomerManagementPage },
  { page: 'procurement', component: ProcurementManagementPage },
  { page: 'procurement-supplier-detail', component: SupplierDetailPage },
  { page: 'contracts', component: ContractSettlementPage },
  { page: 'orders', component: OrderManagementPage },
  { page: 'facility', component: FacilityManagementPage },
  { page: 'resources', component: ResourcePoolPage },
  { page: 'settings', component: SystemSettingsPage },
  { page: 'standards', component: StandardManagementPage },
  { page: 'standard-template-detail', component: StandardTemplateDetailPage },
  { page: 'digital-employee', component: DigitalEmployeePage },
  { page: 'engineer-assistant', component: EngineerAssistantPage },
  { page: 'detail', component: ProjectDetailPage },
  { page: 'new-detail', component: ProjectDetailPage },
]

// ─── Helper: get component by page name ────────────────────────

export const getPageComponent = (page: AppRoute['page']): PageComponentEntry | undefined => {
  const entry = pageComponentRegistry.find(item => item.page === page)
  return entry
}

// ─── Hash normalization ────────────────────────────────────────

export const normalizeHashPath = (hashPath: string): string => {
  if (!hashPath || hashPath === '#') {
    return ROUTE_PATHS.projects
  }

  let decodedHashPath = hashPath
  try {
    decodedHashPath = `#${decodeURIComponent(hashPath.slice(1))}`
  } catch {
    decodedHashPath = hashPath
  }

  const withoutTrailingSlash = decodedHashPath.replace(/\/+$/, '')

  if (withoutTrailingSlash.startsWith('#/')) {
    return withoutTrailingSlash
  }

  if (withoutTrailingSlash.startsWith('#')) {
    return `#/${withoutTrailingSlash.slice(1)}`
  }

  return ROUTE_PATHS.projects
}

// ─── Legacy tab alias map ──────────────────────────────────────

/** 旧生命周期标签 → 新 PMBOK 领域标签 兼容映射 */
export const LEGACY_PROJECT_TAB_ALIAS: Record<string, ProjectDetailTab> = {
  dashboard: 'overview',
  start: 'scope',
  plan: 'scope',
  execute: 'schedule',
  monitor: 'quality',
  close: 'quality',
  settings: 'settings',
  setting: 'settings',
  config: 'settings',
  preferences: 'settings',
  gantt: 'schedule',
  wbs: 'scope',
  acceptance: 'quality',
  team: 'resources',
  'digital-employee': 'settings',
}

// ─── CreateProjectMode parsing ─────────────────────────────────

export const parseCreateMode = (value: string | null): 'blank' | 'template' =>
  value === 'template' ? 'template' : 'blank'

export const parseDraftModeFromCode = (code: string): 'blank' | 'template' | null => {
  if (!code.startsWith('DRAFT-')) {
    return null
  }
  return code.includes('TEMPLATE') ? 'template' : 'blank'
}

// ─── Core: readRouteFromHash ───────────────────────────────────

export const readRouteFromHash = (): AppRoute => {
  const hash = window.location.hash
  const [hashPath, hashQuery = ''] = hash.split('?')
  const cleanHash = normalizeHashPath(hashPath)
  const routeQueryParams = new URLSearchParams(hashQuery)

  if (!cleanHash || cleanHash === '#' || cleanHash === ROUTE_PATHS.projects) {
    return { page: 'projects' }
  }

  if (cleanHash === ROUTE_PATHS.tasks) {
    return { page: 'tasks' }
  }

  const taskDetailMatch = cleanHash.match(/^#\/tasks\/([^/?#]+)$/)
  if (taskDetailMatch) {
    return {
      page: 'task-detail',
      taskCode: decodeURIComponent(taskDetailMatch[1]),
    }
  }

  if (cleanHash === ROUTE_PATHS.customers || cleanHash.startsWith(`${ROUTE_PATHS.customers}/`)) {
    return { page: 'customers' }
  }

  const procurementSupplierMatch = cleanHash.match(/^#\/procurement\/suppliers\/([^/?#]+)$/)
  if (procurementSupplierMatch) {
    const query = routeQueryParams.get('q')?.trim()
    return {
      page: 'procurement-supplier-detail',
      supplierId: decodeURIComponent(procurementSupplierMatch[1]),
      returnSearchQuery: query ? query : undefined,
    }
  }

  if (
    cleanHash === ROUTE_PATHS.procurement ||
    cleanHash.startsWith(`${ROUTE_PATHS.procurement}/`)
  ) {
    const query = routeQueryParams.get('q')?.trim()
    return { page: 'procurement', searchQuery: query ? query : undefined }
  }

  if (cleanHash === ROUTE_PATHS.contracts || cleanHash.startsWith(`${ROUTE_PATHS.contracts}/`)) {
    return { page: 'contracts' }
  }

  if (cleanHash === ROUTE_PATHS.orders || cleanHash.startsWith(`${ROUTE_PATHS.orders}/`)) {
    return { page: 'orders' }
  }

  if (cleanHash === ROUTE_PATHS.facility || cleanHash.startsWith(`${ROUTE_PATHS.facility}/`)) {
    return { page: 'facility' }
  }

  if (cleanHash === ROUTE_PATHS.resources || cleanHash.startsWith(`${ROUTE_PATHS.resources}/`)) {
    return { page: 'resources' }
  }

  if (cleanHash === ROUTE_PATHS.personnel) {
    return { page: 'personnel' }
  }

  const personnelDetailMatch = cleanHash.match(/^#\/personnel\/users(?:\/?([^/?#]+))?$/)
  if (personnelDetailMatch) {
    const encodedUserId = personnelDetailMatch[1] ?? 'U1001'
    return {
      page: 'personnel-detail',
      userId: decodeURIComponent(encodedUserId),
    }
  }

  if (cleanHash.startsWith('#/personnel/')) {
    return { page: 'personnel' }
  }

  if (cleanHash === ROUTE_PATHS.settings) {
    return { page: 'settings' }
  }

  if (cleanHash === ROUTE_PATHS.standards) {
    return { page: 'standards' }
  }

  if (
    cleanHash === ROUTE_PATHS.standardTemplate ||
    cleanHash.startsWith(ROUTE_PATHS.standardTemplatePrefix)
  ) {
    const encodedTemplateId = cleanHash.slice(ROUTE_PATHS.standardTemplatePrefix.length)
    return {
      page: 'standard-template-detail',
      templateId: decodeURIComponent(encodedTemplateId || 'tpl-store-standard-v1'),
    }
  }

  if (cleanHash === ROUTE_PATHS.digitalEmployee) {
    return { page: 'digital-employee' }
  }

  if (cleanHash === ROUTE_PATHS.engineerAssistant) {
    return { page: 'engineer-assistant' }
  }

  if (cleanHash === '#/projects/new') {
    const params = new URLSearchParams(hashQuery)
    return {
      page: 'new-detail',
      mode: parseCreateMode(params.get('createMode')),
      draftId: params.get('draftId') ?? undefined,
      templateId: params.get('templateId') ?? undefined,
    }
  }

  const detailMatch = cleanHash.match(/^#\/projects\/([^/]+)(?:\/([^/?#]+))?$/)
  if (detailMatch) {
    const encodedCode = detailMatch[1]
    const maybeTab = detailMatch[2]
    const decodedTab = maybeTab ? decodeURIComponent(maybeTab).trim().toLowerCase() : ''

    const normalizedTab =
      decodedTab && isProjectDetailTab(decodedTab)
        ? decodedTab
        : decodedTab && LEGACY_PROJECT_TAB_ALIAS[decodedTab]
          ? LEGACY_PROJECT_TAB_ALIAS[decodedTab]
          : 'overview'

    return {
      page: 'detail',
      code: decodeURIComponent(encodedCode),
      tab: normalizedTab,
    }
  }

  return { page: 'projects' }
}

// ─── AppRouter 页面分类（集中管理）────────────────────────────

export const SIMPLE_PAGES: AppRoute['page'][] = [
  'projects',
  'tasks',
  'customers',
  'orders',
  'facility',
  'resources',
  'settings',
  'standards',
  'digital-employee',
  'engineer-assistant',
]

export const PARAM_PAGES: AppRoute['page'][] = [
  'personnel-detail',
  'procurement-supplier-detail',
  'standard-template-detail',
]

export const CALLBACK_PAGES: AppRoute['page'][] = ['personnel', 'procurement']

export const DATA_PAGES: AppRoute['page'][] = ['contracts']

export const isRouterHandledPage = (page: AppRoute['page']): boolean => {
  return (
    SIMPLE_PAGES.includes(page) ||
    PARAM_PAGES.includes(page) ||
    CALLBACK_PAGES.includes(page) ||
    DATA_PAGES.includes(page)
  )
}
