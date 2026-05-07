import type { CostOrder } from '@/types/project-detail'

const MOCK_ORDERS: CostOrder[] = [
  {
    id: 1,
    projectCode: '',
    title: '钢结构采购',
    category: '材料',
    amount: 150000,
    status: '已下单',
    applicant: '张三',
    createdAt: '2026-04-01',
  },
  {
    id: 2,
    projectCode: '',
    title: '玻璃幕墙分包',
    category: '分包',
    amount: 380000,
    status: '审批中',
    applicant: '李四',
    createdAt: '2026-04-05',
  },
  {
    id: 3,
    projectCode: '',
    title: '电气设备采购',
    category: '设备',
    amount: 95000,
    status: '待报价',
    applicant: '王五',
    createdAt: '2026-04-10',
  },
  {
    id: 4,
    projectCode: '',
    title: '暖通空调安装',
    category: '分包',
    amount: 220000,
    status: '已下单',
    applicant: '张三',
    createdAt: '2026-04-12',
  },
  {
    id: 5,
    projectCode: '',
    title: '消防系统采购',
    category: '材料',
    amount: 78000,
    status: '审批中',
    applicant: '赵六',
    createdAt: '2026-04-15',
  },
]

export async function getCostOrders(projectCode: string): Promise<CostOrder[]> {
  void projectCode
  await new Promise(r => setTimeout(r, 200))
  return MOCK_ORDERS.map(o => ({ ...o, projectCode }))
}

export async function getCostSummary(projectCode: string): Promise<{
  totalBudget: number
  totalSpent: number
  pendingApproval: number
  orderCount: number
}> {
  void projectCode
  await new Promise(r => setTimeout(r, 100))
  return { totalBudget: 1200000, totalSpent: 923000, pendingApproval: 3, orderCount: 5 }
}
