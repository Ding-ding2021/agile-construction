import { useCallback, useMemo, useState } from 'react'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import TaskListView from './TaskListView'
import TaskToolbar from './TaskToolbar'
import { mockTasks } from './taskManagement.data'
import { calculateTaskStats, processTasks, shouldResetPage } from './taskManagement.selectors'
import type { TaskFilters, TaskViewMode } from './taskManagement.types'
import { goToTaskDetail } from '../../config/navigation'

const TaskManagementPage = () => {
  const currentHash = typeof window === 'undefined' ? '#/tasks' : window.location.hash || '#/tasks'

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<TaskFilters>({
    statKey: 'all',
    searchQuery: '',
    groupBy: 'none',
    sortBy: 'default',
  })
  const [viewMode, setViewMode] = useState<TaskViewMode>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)

  const stats = useMemo(() => calculateTaskStats(mockTasks), [])

  const { data: processedTasks, pagination } = useMemo(
    () => processTasks(mockTasks, filters, { currentPage, pageSize }),
    [filters, currentPage, pageSize]
  )

  const updateFilters = useCallback(
    (newFilters: Partial<TaskFilters>) => {
      setFilters(prev => {
        const next = { ...prev, ...newFilters }
        if (shouldResetPage(prev, next, pageSize, pageSize)) {
          setCurrentPage(1)
        }
        return next
      })
    },
    [pageSize]
  )

  const updateSearchQuery = useCallback(
    (query: string) => {
      setSearchQuery(query)
      updateFilters({ searchQuery: query })
    },
    [updateFilters]
  )

  return (
    <div className="tm-app">
      <div className="tm-glow tm-glow-left" />
      <div className="tm-glow tm-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <div className="tm-workspace">
        <main className="tm-main">
          <PageHeader
            title="任务管理"
            subtitle="Task Management"
            searchQuery={searchQuery}
            onSearchChange={updateSearchQuery}
            searchPlaceholder="搜索..."
          />
          <div className="tm-body">
            <StatsCards
              items={[
                {
                  key: 'all',
                  icon: '1.svg',
                  label: '全部任务数',
                  value: stats.total,
                  tone: 'blue',
                },
                {
                  key: 'pendingAssign',
                  icon: '3.svg',
                  label: '待分配数',
                  value: stats.pendingAssign,
                  tone: 'blue',
                },
                {
                  key: 'executing',
                  icon: '5.svg',
                  label: '执行中数',
                  value: stats.executing,
                  tone: 'blue',
                },
                {
                  key: 'pendingSubmit',
                  icon: '7.svg',
                  label: '待提交数',
                  value: stats.pendingSubmit,
                  tone: 'orange',
                },
                {
                  key: 'pendingAcceptance',
                  icon: '1.svg',
                  label: '待验收数',
                  value: stats.pendingAcceptance,
                  tone: 'orange',
                },
                {
                  key: 'slaRisk',
                  icon: '3.svg',
                  label: '超时/即将超时数',
                  value: stats.slaWarningOrOverdue,
                  tone: 'red',
                },
                {
                  key: 'blocked',
                  icon: '5.svg',
                  label: '阻塞任务数',
                  value: stats.blocked,
                  tone: 'red',
                },
              ]}
              activeKey={filters.statKey}
              onItemClick={key => {
                updateFilters({ statKey: key as TaskFilters['statKey'] })
                setCurrentPage(1)
              }}
              className="pm-stats-row"
              assetBase="/assets/CodeBubbyAssets/3947_2"
            />

            <section className="tm-table-section">
              <TaskToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                searchQuery={searchQuery}
                onSearchChange={updateSearchQuery}
                filters={filters}
                onFiltersChange={updateFilters}
              />

              <TaskListView
                tasks={processedTasks}
                pagination={pagination}
                onPageChange={setCurrentPage}
                searchQuery={searchQuery}
                viewMode={viewMode}
                onOpenTaskDetail={taskCode => {
                  goToTaskDetail(taskCode)
                }}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default TaskManagementPage
