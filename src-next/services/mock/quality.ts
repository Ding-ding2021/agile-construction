import type { QualityCheckItem } from '@/types/project-detail'

const MOCK_ITEMS: QualityCheckItem[] = [
  {
    id: 1,
    projectCode: '',
    name: '地基验收',
    category: '结构',
    status: 'pass',
    inspector: '质检科',
    checkedAt: '2026-04-08',
  },
  {
    id: 2,
    projectCode: '',
    name: '钢结构焊接检测',
    category: '结构',
    status: 'pass',
    inspector: '第三方检测',
    checkedAt: '2026-04-12',
  },
  {
    id: 3,
    projectCode: '',
    name: '电气布线检查',
    category: '电气',
    status: 'pending',
    inspector: '质检科',
    checkedAt: null,
  },
  {
    id: 4,
    projectCode: '',
    name: '给排水试压',
    category: '给排水',
    status: 'fail',
    inspector: '监理单位',
    checkedAt: '2026-04-18',
  },
  {
    id: 5,
    projectCode: '',
    name: '消防系统测试',
    category: '消防',
    status: 'pending',
    inspector: '消防部门',
    checkedAt: null,
  },
  {
    id: 6,
    projectCode: '',
    name: '外墙保温检查',
    category: '建筑',
    status: 'pass',
    inspector: '质检科',
    checkedAt: '2026-04-20',
  },
]

export async function getQualityItems(projectCode: string): Promise<QualityCheckItem[]> {
  void projectCode
  await new Promise(r => setTimeout(r, 200))
  return MOCK_ITEMS.map(i => ({ ...i, projectCode }))
}

export async function getQualitySummary(projectCode: string): Promise<{
  total: number
  passed: number
  failed: number
  pending: number
  passRate: number
}> {
  void projectCode
  await new Promise(r => setTimeout(r, 100))
  const total = MOCK_ITEMS.length
  const passed = MOCK_ITEMS.filter(i => i.status === 'pass').length
  const failed = MOCK_ITEMS.filter(i => i.status === 'fail').length
  const pending = MOCK_ITEMS.filter(i => i.status === 'pending').length
  return { total, passed, failed, pending, passRate: Math.round((passed / total) * 100) }
}
