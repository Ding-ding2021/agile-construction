/**
 * TaskManagementPage — 任务管理主页面
 *
 * 提供任务列表的查看、筛选、搜索和详情查看功能。
 * 数据加载优先从后端获取，失败时降级到 mock 数据。
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import TaskListView from './TaskListView'
import TaskToolbar from './TaskToolbar'
import TaskDetailPage from './TaskDetailPage'
import { getTaskDetailByCode } from './taskManagement.data'
import { calculateTaskStats, processTasks, shouldResetPage } from './taskManagement.selectors'
import type { TaskFilters, TaskViewMode, TaskItem, TaskDetail } from './taskManagement.types'
import { taskRepository } from '../../services/repositories/taskRepository'
import { Drawer } from '@mui/material'

const TaskManagementPage = () => {
  const currentHash = typeof window === 'undefined' ? '#/tasks' : window.location.hash || '#/tasks'

  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
  const [selectedTaskCode, setSelectedTaskCode] = useState<string | null>(null)

  const selectedTaskDetail: TaskDetail | null = useMemo(
    () => (selectedTaskCode ? (getTaskDetailByCode(selectedTaskCode) ?? null) : null),
    [selectedTaskCode]
  )

  // 从 Repository 加载数据（API → localStorage → mock fallback）
  const loadRemoteTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const remoteTasks = await taskRepository.loadTasks('__all')
      if (remoteTasks && remoteTasks.length > 0) {
        setTasks(remoteTasks)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载任务失败，请检查网络连接')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    loadRemoteTasks().then(() => {
      // 确保组件卸载后不更新
      if (cancelled) return
    })
    return () => {
      cancelled = true
    }
  }, [loadRemoteTasks])

  const handleRetry = useCallback(() => {
    loadRemoteTasks()
  }, [loadRemoteTasks])

  const stats = useMemo(() => calculateTaskStats(tasks), [tasks])

  const { data: processedTasks, pagination } = useMemo(
    () => processTasks(tasks, filters, { currentPage, pageSize }),
    [tasks, filters, currentPage, pageSize]
  )

  // 更新筛选条件：筛选条件变化时自动重置到第 1 页
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
            {isLoading && (
              <div
                className="tm-loading"
                style={{ padding: '40px', textAlign: 'center', color: 'var(--pm-text-secondary)' }}
              >
                加载中...
              </div>
            )}
            {error && (
              <div className="tm-error" style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--pm-error, #ef5350)', marginBottom: 12 }}>
                  加载失败：{error}
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  style={{
                    padding: '8px 24px',
                    background: 'var(--pm-primary, #1976d2)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  重试
                </button>
              </div>
            )}
            {!isLoading && !error && (
              <>
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
                      setSelectedTaskCode(taskCode)
                    }}
                  />
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {/* 任务详情侧拉弹窗 */}
      <Drawer anchor="right" open={!!selectedTaskDetail} onClose={() => setSelectedTaskCode(null)}>
        <div
          style={{
            width: 680,
            maxWidth: '100vw',
            height: '100%',
            backgroundColor: '#051338',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {selectedTaskDetail && (
            <TaskDetailPage
              taskDetail={selectedTaskDetail}
              mode="drawer"
              onBack={() => setSelectedTaskCode(null)}
            />
          )}
        </div>
      </Drawer>
    </div>
  )
}

export default TaskManagementPage
