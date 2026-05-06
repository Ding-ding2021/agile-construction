import type { Story } from '@ladle/react'
import { Suspense, lazy } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import PersonnelDetailContent from '@/pages/personnel/components/PersonnelDetailContent'
import { getPersonDetail } from '@/pages/personnel/components/personnel-detail-mock'

const PersonnelListPage = lazy(() => import('@/pages/personnel/PersonnelListPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))

function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  )
}

function LazyPage({ Component }: { Component: React.LazyExoticComponent<React.ComponentType> }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  )
}

/** 人员管理 — 真实页面，mock API 返回 5 条数据 */
export const PersonnelPage: Story = () => <LazyPage Component={PersonnelListPage} />
PersonnelPage.meta = { title: '人员管理', description: '人员列表 + 搜索筛选 + 新增编辑' }

/** 人员详情页 — 全屏模式（张伟） */
export const PersonnelDetail: Story = () => (
  <PersonnelDetailContent person={getPersonDetail(1)} loading={false} />
)
PersonnelDetail.meta = {
  title: '人员详情-全屏',
  description: '基本信息/技能资质/任务负载/操作记录',
}

/** 人员详情 — 侧拉窗 Sheet 模式（张伟） */
export const PersonnelDetailSheet: Story = () => (
  <div className="flex items-center justify-center h-96 text-sm text-muted-foreground">
    <p>在列表页点击人员名字即可弹出侧拉窗</p>
  </div>
)
PersonnelDetailSheet.meta = {
  title: '人员详情-Sheet',
  description: '侧拉窗模式由 PersonnelListPage 内嵌渲染',
}

/** 系统设置 — 无 API 依赖，使用 localStorage */
export const SettingsPageView: Story = () => <LazyPage Component={SettingsPage} />
SettingsPageView.meta = { title: '系统设置', description: '主题色 / 字体 / 导航偏好' }

/** Dashboard — 使用本地 data.json + mockMetrics */
export const DashboardPageView: Story = () => <LazyPage Component={DashboardPage} />
DashboardPageView.meta = { title: '数据面板', description: '指标卡 + 图表 + 数据表格' }
