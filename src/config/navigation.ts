/**
 * Navigation helpers — 集中管理所有 hash URL 构建函数
 *
 * 消除组件层中散落的 `window.location.hash = '...'` 硬编码。
 * 所有导航操作统一从这里导入。
 */

import type { ProjectDetailTab } from '../components/project/projectTabs.shared'
import { buildProjectDetailTabHash } from '../components/project/projectTabs.shared'
import { navigateByHash } from '../components/shared/navigation/nav.utils'
export { navigateByHash }

// ─── Core: safe hash setter ────────────────────────────────────

const setHash = (hash: string) => {
  if (typeof window !== 'undefined') {
    navigateByHash(hash)
  }
}

// ─── Project routes ────────────────────────────────────────────

export const goToProjectList = () => setHash('#/projects')

export const goToProjectDetail = (projectCode: string, tab?: ProjectDetailTab) => {
  setHash(buildProjectDetailTabHash(projectCode, tab))
}

export const goToNewProject = (
  mode: 'blank' | 'template' = 'blank',
  options?: { draftId?: string; templateId?: string }
) => {
  const params = new URLSearchParams()
  params.set('createMode', mode)
  if (options?.draftId) params.set('draftId', options.draftId)
  if (options?.templateId) params.set('templateId', options.templateId)
  setHash(`#/projects/new?${params.toString()}`)
}

// ─── Task routes ───────────────────────────────────────────────

export const goToTaskList = () => setHash('#/tasks')

export const goToTaskDetail = (taskCode: string) => {
  setHash(`#/tasks/${encodeURIComponent(taskCode)}`)
}

// ─── Personnel routes ──────────────────────────────────────────

export const goToPersonnelList = () => setHash('#/personnel')

export const goToPersonnelUser = (userId: string) => {
  setHash(`#/personnel/users/${encodeURIComponent(userId)}`)
}

// ─── Procurement routes ────────────────────────────────────────

export const goToProcurementList = () => setHash('#/procurement')

export const goToSupplierDetail = (supplierId: string, returnSearchQuery?: string) => {
  const q = returnSearchQuery ? `?q=${encodeURIComponent(returnSearchQuery)}` : ''
  setHash(`#/procurement/suppliers/${encodeURIComponent(supplierId)}${q}`)
}

// ─── Standard routes ───────────────────────────────────────────

export const goToStandardList = () => setHash('#/standards')

export const goToStandardTemplate = (templateId: string) => {
  setHash(`#/standards/templates/${encodeURIComponent(templateId)}`)
}

// ─── Simple top-level routes ───────────────────────────────────

export const goToCustomers = () => setHash('#/customers')
export const goToContracts = () => setHash('#/contracts')
export const goToOrders = () => setHash('#/orders')
export const goToFacility = () => setHash('#/facility')
export const goToResources = () => setHash('#/resources')
export const goToSettings = () => setHash('#/settings')
export const goToDigitalEmployee = () => setHash('#/digital-employee')
export const goToEngineerAssistant = () => setHash('#/engineer-assistant')

// ─── Legacy redirect helpers (for migration) ───────────────────

/** 从结算差异项跳转回项目详情 settlement-review 面板 */
export const goToProjectSettlementReview = (projectCode: string, diffId: string) => {
  const params = new URLSearchParams()
  params.set('panel', 'settlement-review')
  params.set('diff', diffId)
  setHash(`#/projects/${encodeURIComponent(projectCode)}?${params.toString()}`)
}

/** 从任务派单面板跳转到任务列表（带 taskCode 查询参数） */
export const goToTaskListWithCode = (taskCode: string) => {
  setHash(`#/tasks?taskCode=${encodeURIComponent(taskCode)}`)
}
