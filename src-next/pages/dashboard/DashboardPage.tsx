import { PageLayout } from '@/components/page-layout'
import { SectionCards, type MetricCardData } from '@/components/section-cards'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import data from '@/data/data.json'

const mockMetrics: MetricCardData[] = [
  {
    title: 'Total Revenue',
    value: '$1,250.00',
    trend: 'up',
    trendLabel: '+12.5%',
    description: 'Trending up this month',
  },
  {
    title: 'New Customers',
    value: '1,234',
    trend: 'down',
    trendLabel: '-20%',
    description: 'Acquisition needs attention',
  },
  {
    title: 'Active Accounts',
    value: '45,678',
    trend: 'up',
    trendLabel: '+12.5%',
    description: 'Strong user retention',
  },
  {
    title: 'Growth Rate',
    value: '4.5%',
    trend: 'up',
    trendLabel: '+4.5%',
    description: 'Meets growth projections',
  },
]

export default function DashboardPage() {
  return (
    <PageLayout>
      <SectionCards metrics={mockMetrics} />
      <div className="flex flex-col gap-4 md:gap-6">
        <ChartAreaInteractive />
        <DataTable data={data} />
      </div>
    </PageLayout>
  )
}
