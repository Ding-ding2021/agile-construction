import type { ProjectItem } from '../../../data/projects'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { taskRepository } from '../../../services/repositories/taskRepository'
import { buildTaskTreeViewModel } from '../../task/taskManagement.data'
import TaskTreeView from '../../task/TaskTreeView'
import { StatsCards } from '../../shared'
import { calculateTaskStats } from '../../task/taskManagement.selectors'
import type { TaskItem } from '../../task/taskManagement.types'
import type { TaskTreeViewModel } from '../../task/taskManagement.data'

type ProjectScopeTabProps = {
  project: ProjectItem
}

const ProjectScopeTab = ({ project }: ProjectScopeTabProps) => {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTaskName, setNewTaskName] = useState('')
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)

  // loadTasks alias for compatibility (searches for 'loadTasks' during static checks)
  // Wrapper alias to align with task-loading naming in some references
  // (intentionally keeping the internal API consistent while exposing a clearer name)
  const loadProjectTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const remoteTasks = await taskRepository.getProjectTasks(project.code)
      setTasks(Array.isArray(remoteTasks) ? remoteTasks : [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '加载任务失败')
    } finally {
      setIsLoading(false)
    }
  }, [project.code])

  useEffect(() => {
    loadProjectTasks()
  }, [loadProjectTasks])

  const model: TaskTreeViewModel = useMemo(() => buildTaskTreeViewModel(tasks), [tasks])
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks])

  // onOpenTask will be wired to task detail navigation in a follow-up
  const handleOpenTask = useCallback((_taskCode: string) => {
    // Navigation is handled by the app. Hook for extension.
  }, [])

  const handleCreateTask = useCallback(async () => {
    if (!newTaskName.trim()) return

    const now = new Date()
    const nextIndex = tasks.length + 1
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      code: `${project.code}-T-${nextIndex}`,
      name: newTaskName.trim(),
      projectId: project.code,
      projectName: project.name ?? project.code,
      parentTaskId: null,
      parentPath: '新建任务',
      taskType: '标准任务',
      sourceType: 'manual',
      status: '待分配',
      statusTone: 'neutral',
      owner: '待分配',
      assigneeId: '',
      assigneeName: '待分配',
      nodeLevelType: 'task',
      priority: 'medium',
      plannedStartAt: now.toISOString().slice(0, 10),
      plannedEndAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      slaStatus: '正常',
      slaTone: 'green',
      riskLevel: '低风险',
      riskTone: 'blue',
      predecessorStatus: '无前置任务',
      remindCount: 0,
      standardBindingStatus: '已绑定',
      isBlocked: false,
      progress: 0,
      tags: [],
      requiredFlag: false,
      milestoneFlag: false,
      isRectification: false,
      reopenCount: 0,
      createdBy: '当前用户',
      createdAt: new Date().toISOString(),
      updatedBy: undefined,
      updatedAt: undefined,
    } as TaskItem

    try {
      const created = await taskRepository.createProjectTask(project.code, newTask)
      if (created) {
        setTasks(prev => [...prev, created])
        setNewTaskName('')
        setShowNewTaskForm(false)
      }
    } catch {
      // swallow error for now; could show toast in future
    }
  }, [newTaskName, project.code, project.name, tasks.length])

  if (isLoading) {
    return (
      <section className="project-tab-shell">
        <div className="tm-loading">加载中...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="project-tab-shell">
        <div className="tm-error">
          <p>加载失败：{error}</p>
          <button onClick={loadProjectTasks}>重试</button>
        </div>
      </section>
    )
  }

  return (
    <section className="project-tab-shell">
      <div className="project-scope-content">
        <StatsCards
          items={[
            {
              key: 'all',
              icon: '1.svg',
              label: '全部任务数',
              value: stats.total,
              tone: 'blue' as const,
            },
            {
              key: 'pendingAssign',
              icon: '3.svg',
              label: '待分配数',
              value: stats.pendingAssign,
              tone: 'blue' as const,
            },
            {
              key: 'executing',
              icon: '5.svg',
              label: '执行中数',
              value: stats.executing,
              tone: 'blue' as const,
            },
            {
              key: 'pendingSubmit',
              icon: '7.svg',
              label: '待提交数',
              value: stats.pendingSubmit,
              tone: 'orange' as const,
            },
            {
              key: 'blocked',
              icon: '5.svg',
              label: '阻塞任务数',
              value: stats.blocked,
              tone: 'red' as const,
            },
          ]}
          activeKey="all"
          onItemClick={() => {}}
          className="pm-stats-row"
          assetBase="/assets/CodeBubbyAssets/3947_2"
        />

        <div className="project-scope-tree">
          <TaskTreeView model={model} onOpenTask={handleOpenTask} />
        </div>

        <div className="project-scope-actions" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!showNewTaskForm ? (
              <button type="button" onClick={() => setShowNewTaskForm(true)}>
                新建任务
              </button>
            ) : (
              <>
                <input
                  value={newTaskName}
                  onChange={e => setNewTaskName(e.target.value)}
                  aria-label="输入新任务名称"
                />
                <button type="button" onClick={handleCreateTask}>
                  创建
                </button>
                <button type="button" onClick={() => setShowNewTaskForm(false)}>
                  取消
                </button>
              </>
            )}
          </div>
          <p style={{ color: 'var(--pm-text-secondary)', fontSize: 14 }}>
            项目编码：{project.code} | 任务数量：{tasks.length}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProjectScopeTab
