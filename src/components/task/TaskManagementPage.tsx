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
import { ImportDialog, ExportPanel } from '../ui'
import type { ExportConfig } from '../ui'
import type { TaskAssigneeOption } from './TaskDetailPage'
import { resolveTaskDetail } from './taskManagement.data'
import { calculateTaskStats, processTasks, shouldResetPage } from './taskManagement.selectors'
import type {
  TaskFilters,
  TaskViewMode,
  TaskItem,
  TaskDetail,
  TaskStatus,
} from './taskManagement.types'
import { STATUS_TONE_MAP } from './taskManagement.types'
import TaskKanbanView from './TaskKanbanView'
import TaskCalendarView from './TaskCalendarView'
import { taskRepository } from '../../services/repositories/taskRepository'
import { Drawer, Snackbar, Alert } from '@mui/material'

const TaskManagementPage = () => {
  const currentHash = typeof window === 'undefined' ? '#/tasks' : window.location.hash || '#/tasks'

  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<TaskViewMode>('list')
  const [filters, setFilters] = useState<TaskFilters>({
    statKey: 'all',
    searchQuery: '',
    groupBy: 'none',
    sortBy: 'default',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)
  const [selectedTaskCode, setSelectedTaskCode] = useState<string | null>(null)
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TaskDetail | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  const transitioningRef = useRef(new Set<string>())
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // 异步获取任务详情：API 优先，降级到 mock
  useEffect(() => {
    if (!selectedTaskCode) {
      setSelectedTaskDetail(null)
      return
    }

    let cancelled = false
    setIsDetailLoading(true)

    const task = tasks.find(t => t.code === selectedTaskCode)
    const projectCode = task?.projectId

    if (projectCode) {
      taskRepository
        .getTaskDetail(projectCode, selectedTaskCode)
        .then(apiDetail => {
          if (cancelled) return
          if (apiDetail) {
            const fallback = task ? resolveTaskDetail(selectedTaskCode, [task]) : null
            const merged = fallback ? { ...fallback, ...apiDetail } : apiDetail
            setSelectedTaskDetail(merged)
            setIsDetailLoading(false)
            return
          }
          fallbackToLocal()
        })
        .catch(() => {
          if (!cancelled) fallbackToLocal()
        })
    } else {
      fallbackToLocal()
    }

    function fallbackToLocal() {
      if (selectedTaskCode) {
        setSelectedTaskDetail(resolveTaskDetail(selectedTaskCode, tasks))
      }
      setIsDetailLoading(false)
    }

    return () => {
      cancelled = true
    }
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

  // 通用状态流转：更新状态 + 持久化（带防重复提交）
  const transitionTaskStatus = useCallback(
    async (taskCode: string, nextStatus: TaskStatus, successMsg: string) => {
      const task = tasks.find(t => t.code === taskCode)
      if (!task || transitioningRef.current.has(taskCode)) return
      transitioningRef.current.add(taskCode)
      try {
        await taskRepository.updateTask(task.projectId, taskCode, { status: nextStatus })
      } catch {
        // 后端不可用，直接写 localStorage
      }
      updateTaskInState(taskCode, {
        status: nextStatus,
        statusTone: STATUS_TONE_MAP[nextStatus] ?? 'neutral',
      })
      transitioningRef.current.delete(taskCode)
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
                    onOpenImport={() => setShowImport(true)}
                    onOpenExport={() => setShowExport(true)}
                  />

                  {viewMode === 'list' && (
                    <TaskListView
                      tasks={processedTasks}
                      pagination={pagination}
                      onPageChange={setCurrentPage}
                      onOpenTaskDetail={taskCode => {
                        setSelectedTaskCode(taskCode)
                      }}
                      onBatchAssign={codes => {
                        setFeedback({ tone: 'success', text: `已分配 ${codes.length} 个任务` })
                      }}
                      onBatchUrge={codes => {
                        setFeedback({ tone: 'success', text: `已催办 ${codes.length} 个任务` })
                      }}
                      onBatchExport={codes => {
                        setFeedback({ tone: 'success', text: `已导出 ${codes.length} 个任务` })
                      }}
                    />
                  )}
                  {viewMode === 'kanban' && (
                    <TaskKanbanView
                      tasks={processedTasks}
                      onOpenTaskDetail={setSelectedTaskCode}
                      onStatusChange={(taskCode, nextStatus) =>
                        transitionTaskStatus(taskCode, nextStatus, `状态已变更: ${nextStatus}`)
                      }
                    />
                  )}
                  {viewMode === 'calendar' && (
                    <TaskCalendarView
                      tasks={processedTasks}
                      onOpenTaskDetail={setSelectedTaskCode}
                    />
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {/* 任务详情侧拉弹窗 */}
      <Drawer anchor="right" open={!!selectedTaskCode} onClose={() => setSelectedTaskCode(null)}>
        <div
          style={{
            width: 680,
            maxWidth: '100vw',
            height: '100%',
            backgroundColor: '#051338',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {isDetailLoading && (
            <div style={{ padding: 40, textAlign: 'center', color: '#8899bb' }}>加载中...</div>
          )}
          {selectedTaskDetail && (
            <TaskDetailPage
              taskDetail={selectedTaskDetail}
              mode="drawer"
              onBack={() => setSelectedTaskCode(null)}
              onRemind={() => setFeedback({ tone: 'success', text: '已发送催办提醒' })}
              onCreateSubmission={async (taskCode, payload) => {
                const taskId = Number(selectedTaskDetail.id)
                if (!isNaN(taskId)) {
                  await taskRepository.createSubmission(
                    selectedTaskDetail.projectId,
                    taskCode,
                    taskId,
                    payload
                  )
                }
                transitionTaskStatus(taskCode, '待验收', '提交验收成功')
              }}
              onReviewSubmission={async (taskCode, reviewPayload) => {
                const taskId = Number(selectedTaskDetail.id)
                const subId = Number(reviewPayload.submissionId)
                if (!isNaN(taskId) && !isNaN(subId)) {
                  await taskRepository.reviewSubmission(
                    selectedTaskDetail.projectId,
                    taskCode,
                    taskId,
                    subId,
                    reviewPayload.result,
                    reviewPayload.comment
                  )
                }
                if (reviewPayload.result === 'pass') {
                  transitionTaskStatus(taskCode, '已完成', '验收通过')
                } else {
                  transitionTaskStatus(taskCode, '不通过', '已驳回整改')
                }
              }}
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

      {/* 导入 / 导出 Dialog */}
      <ImportDialog
        open={showImport}
        onClose={() => setShowImport(false)}
        onImport={() => setFeedback({ tone: 'success', text: '导入成功' })}
      />
      <ExportPanel
        open={showExport}
        onClose={() => setShowExport(false)}
        onExport={(config: ExportConfig) => {
          setFeedback({
            tone: 'success',
            text: `导出 ${config.scope === 'all' ? tasks.length : processedTasks.length} 条任务`,
          })
          setShowExport(false)
        }}
        filteredCount={processedTasks.length}
        totalCount={tasks.length}
      />

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
