/**
 * TaskManagementPage — 任务管理主页面
 *
 * 提供任务列表的查看、筛选、搜索和详情查看功能。
 * 数据加载优先从后端获取，失败时降级到 mock 数据。
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import TaskListView from './TaskListView'
import TaskToolbar from './TaskToolbar'
import TaskDetailPage from './TaskDetailPage'
import type { TaskAssigneeOption } from './TaskDetailPage'
import { buildTaskDetailFromItem, getTaskDetailByCode } from './taskManagement.data'
import { calculateTaskStats, processTasks, shouldResetPage } from './taskManagement.selectors'
import type {
  TaskFilters,
  TaskViewMode,
  TaskItem,
  TaskDetail,
  TaskStatus,
} from './taskManagement.types'
import { taskRepository } from '../../services/repositories/taskRepository'
import { Drawer, Snackbar, Alert } from '@mui/material'

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
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // 从 tasks 数组中实时构建选中任务的详情，替换静态 getTaskDetailByCode
  const selectedTaskDetail: TaskDetail | null = useMemo(() => {
    if (!selectedTaskCode) return null
    const cached = getTaskDetailByCode(selectedTaskCode)
    if (cached) return cached
    const task = tasks.find(t => t.code === selectedTaskCode)
    return task ? buildTaskDetailFromItem(task) : null
  }, [selectedTaskCode, tasks])

  // 自动清除反馈消息
  useEffect(() => {
    if (!feedback) return
    feedbackTimer.current = window.setTimeout(() => setFeedback(null), 2600)
    return () => window.clearTimeout(feedbackTimer.current)
  }, [feedback])

  // 通用更新：在 tasks 中找到对应任务，更新字段，持久化到 localStorage
  const updateTaskInState = useCallback((taskCode: string, patch: Partial<TaskItem>) => {
    setTasks(prev => {
      const next = prev.map(t => (t.code === taskCode ? { ...t, ...patch } : t))
      const updated = next.find(t => t.code === taskCode)
      if (updated) {
        taskRepository.saveTasks('__all', next)
      }
      return next
    })
  }, [])

  const getStatusTone = (s: TaskStatus): TaskItem['statusTone'] => {
    const map: Record<TaskStatus, TaskItem['statusTone']> = {
      草稿: 'neutral',
      待分配: 'neutral',
      待执行: 'neutral',
      执行中: 'blue',
      已暂停: 'orange',
      待提交: 'orange',
      待验收: 'orange',
      不通过: 'red',
      已完成: 'green',
      已关闭: 'green',
    }
    return map[s] ?? 'neutral'
  }

  // 通用状态流转：更新状态 + 持久化
  const transitionTaskStatus = useCallback(
    async (taskCode: string, nextStatus: TaskStatus, successMsg: string) => {
      const task = tasks.find(t => t.code === taskCode)
      if (!task) return
      try {
        await taskRepository.updateTask(task.projectId, taskCode, { status: nextStatus })
      } catch {
        // 后端不可用，直接写 localStorage
      }
      updateTaskInState(taskCode, { status: nextStatus, statusTone: getStatusTone(nextStatus) })
      setFeedback({ tone: 'success', text: successMsg })
    },
    [tasks, updateTaskInState]
  )

  // 从现有任务中提取所有负责人作为可分配人选
  const assigneeOptions: TaskAssigneeOption[] = useMemo(() => {
    const seen = new Set<string>()
    const options: TaskAssigneeOption[] = []
    for (const t of tasks) {
      const name = t.assigneeName || t.owner
      if (name && name !== '待分配' && !seen.has(name)) {
        seen.add(name)
        options.push({ id: t.assigneeId || `user-${name}`, name, disabled: false })
      }
    }
    return options
  }, [tasks])

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
              onRemind={() => setFeedback({ tone: 'success', text: '已发送催办提醒' })}
              onAdvance={() =>
                transitionTaskStatus(selectedTaskDetail.code, '执行中', '任务已重新执行')
              }
              onMarkSubmissionReady={() => {
                const current = selectedTaskDetail.status
                const next: TaskStatus =
                  current === '待提交'
                    ? '待验收'
                    : current === '执行中' || current === '已暂停'
                      ? '待提交'
                      : '待验收'
                transitionTaskStatus(selectedTaskDetail.code, next, '任务状态已更新')
              }}
              onRejectWithRectification={() =>
                transitionTaskStatus(selectedTaskDetail.code, '不通过', '任务已驳回整改')
              }
              onAcceptDispatch={() =>
                transitionTaskStatus(selectedTaskDetail.code, '执行中', '已接单')
              }
              onRejectDispatch={() =>
                transitionTaskStatus(selectedTaskDetail.code, '待分配', '已拒单')
              }
              assigneeOptions={assigneeOptions}
              onAssign={(taskCode, assigneeName) => {
                transitionTaskStatus(taskCode, '待执行', `已分配给 ${assigneeName}`)
                updateTaskInState(taskCode, {
                  assigneeName,
                  assigneeId: `user-${assigneeName}`,
                  owner: assigneeName,
                })
              }}
              onInlineUpdate={(taskCode, payload) => {
                updateTaskInState(taskCode, {
                  plannedStartAt: payload.plannedStartAt,
                  plannedEndAt: payload.plannedEndAt,
                  riskLevel: payload.riskLevel,
                })
                setFeedback({ tone: 'success', text: '保存成功' })
              }}
              onStatusChange={(taskCode, nextStatus) => {
                const labels: Record<string, string> = {
                  待分配: '待分配',
                  待执行: '待执行',
                  执行中: '执行中',
                  已暂停: '已暂停',
                  待提交: '待提交',
                  待验收: '待验收',
                  不通过: '不通过',
                  已完成: '已完成',
                  已关闭: '已关闭',
                }
                transitionTaskStatus(
                  taskCode,
                  nextStatus,
                  `状态已变更为「${labels[nextStatus] ?? nextStatus}」`
                )
              }}
              onUploadAttachments={(_taskCode, files) => {
                setFeedback({ tone: 'success', text: `已上传 ${files.length} 个文件` })
              }}
              onRemoveAttachment={(_taskCode, _attachmentId) => {
                setFeedback({ tone: 'success', text: '附件已删除' })
              }}
            />
          )}
        </div>
      </Drawer>

      {/* 反馈消息 */}
      <Snackbar
        open={!!feedback}
        autoHideDuration={2500}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setFeedback(null)}
          severity={feedback?.tone === 'error' ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {feedback?.text}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default TaskManagementPage
