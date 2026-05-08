export interface ProcurementOrder {
  id: number
  orderCode: string
  title: string
  projectCode: string
  supplierId: number
  categoryId: number | null
  quantity: number
  unit: string
  budgetAmount: number | null
  actualAmount: number | null
  status: string
  priority: string
  applicant: string
  applicantName: string
  assignee: string | null
  description: string | null
  taskCode: string | null
  expectedDate: string | null
  deliveredDate: string | null
  remark: string | null
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: number
  code: string
  name: string
  category: string
  contact: string
  city: string
}

export interface ProcurementFormData {
  title: string
  projectCode: string
  supplierId: number | null
  categoryId?: number | null
  quantity: number
  unit: string
  budgetAmount?: number | null
  priority: string
  applicant: string
  applicantName: string
  description?: string | null
  expectedDate?: string | null
}

export const PROCUREMENT_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿' },
  { value: 'pending', label: '待审批' },
  { value: 'approved', label: '已批准' },
  { value: 'ordered', label: '已下单' },
  { value: 'delivered', label: '已到货' },
  { value: 'closed', label: '已关闭' },
] as const

export const PROCUREMENT_STATUS_STYLE: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-600',
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  ordered: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-zinc-100 text-zinc-500',
}

export const PRIORITY_OPTIONS = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'urgent', label: '紧急' },
] as const

export const PRIORITY_STYLE: Record<string, string> = {
  low: 'bg-zinc-100 text-zinc-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-red-100 text-red-700',
}
