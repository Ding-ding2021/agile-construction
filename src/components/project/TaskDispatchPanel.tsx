import { useMemo } from 'react'
import type { TaskItem, TaskStatus } from '../task/taskManagement.types'

type TaskDispatchPanelProps = {
  tasks: TaskItem[]
  onTaskClick?: (taskCode: string) => void
}

const dispatchPoolStatuses: TaskStatus[] = ['待创建', '待分配']

const isDispatchPoolTask = (status: TaskStatus) => dispatchPoolStatuses.includes(status)

const TaskDispatchPanel = ({ tasks, onTaskClick }: TaskDispatchPanelProps) => {
  const dispatchPoolTasks = useMemo(
    () => tasks.filter(task => isDispatchPoolTask(task.status)).slice(0, 8),
    [tasks]
  )

  const pendingSubmissionTasks = useMemo(
    () =>
      tasks
        .filter(task => task.status === '待提交')
        .map(task => ({
          task,
          material: {
            done: task.progress || 0,
            total: 100,
            missing: task.progress ? 100 - task.progress : 100,
          },
        }))
        .slice(0, 8),
    [tasks]
  )

  const handleTaskClick = (taskCode: string) => {
    if (onTaskClick) {
      onTaskClick(taskCode)
    } else {
      window.location.hash = `#/tasks?taskCode=${encodeURIComponent(taskCode)}`
    }
  }

  return (
    <div className="card task-dispatch-panel">
      <div className="task-dispatch-panel-head">
        <h2>任务调度台</h2>
        <p>聚焦待派单与待提交任务，支持快速处理</p>
      </div>
      <div className="task-dispatch-panel-grid">
        <article className="task-dispatch-sub-panel">
          <header>
            <strong>待派单池</strong>
            <span>{dispatchPoolTasks.length} 项</span>
          </header>
          <ul>
            {dispatchPoolTasks.length ? (
              dispatchPoolTasks.map(task => (
                <li key={task.code}>
                  <button type="button" onClick={() => handleTaskClick(task.code)}>
                    <span className="task-name">{task.name}</span>
                    <em className="task-meta">
                      {task.status} · {task.owner}
                    </em>
                  </button>
                </li>
              ))
            ) : (
              <li className="task-dispatch-empty">当前无待派单任务</li>
            )}
          </ul>
        </article>

        <article className="task-dispatch-sub-panel">
          <header>
            <strong>待提交资料</strong>
            <span>{pendingSubmissionTasks.length} 项</span>
          </header>
          <ul>
            {pendingSubmissionTasks.length ? (
              pendingSubmissionTasks.map(({ task, material }) => (
                <li key={task.code}>
                  <button type="button" onClick={() => handleTaskClick(task.code)}>
                    <span className="task-name">{task.name}</span>
                    <em className="task-meta">
                      进度 {material.done}%
                      {material.missing > 0 ? ` · 待完成 ${material.missing}%` : ' · 已完成'}
                    </em>
                  </button>
                </li>
              ))
            ) : (
              <li className="task-dispatch-empty">当前无待提交任务</li>
            )}
          </ul>
        </article>
      </div>
    </div>
  )
}

export default TaskDispatchPanel
