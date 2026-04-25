import { useEffect, useMemo, useState } from 'react'
import type { ProjectItem } from '../../data/projects'
import TaskTreeView from '../task/TaskTreeView'
import {
  buildTaskTreeViewModel,
  getTasksByTemplateId,
  getTemplateInstantiationDiagnostics,
  getTemplateNameById,
  mockTasks,
} from '../task/taskManagement.data'
import type { TaskItem } from '../task/taskManagement.types'
import { personnelRepository } from '../../services/repositories/personnelRepository'

type ProjectTemplateViewProps = {
  project: ProjectItem
}

const personStatusLabelMap = {
  onduty: '在岗',
  leave: '请假',
  offboard: '离岗',
  disabled: '禁用',
} as const

const buildTasksByProject = (project: ProjectItem): TaskItem[] => {
  if (project.templateId) {
    return getTasksByTemplateId(project.templateId)
  }

  return mockTasks.filter(task => task.projectName === project.name)
}

const ProjectTemplateView = ({ project }: ProjectTemplateViewProps) => {
  const templateName = useMemo(() => getTemplateNameById(project.templateId), [project.templateId])
  const diagnostics = useMemo(
    () => getTemplateInstantiationDiagnostics(project.templateId),
    [project.templateId]
  )
  const [tasks, setTasks] = useState<TaskItem[]>(() => buildTasksByProject(project))

  useEffect(() => {
    setTasks(buildTasksByProject(project))
  }, [project])

  const assigneeOptions = personnelRepository.loadUsers().map(user => ({
    id: user.id,
    name: user.name,
    disabled: user.personStatus === 'disabled',
    statusLabel: personStatusLabelMap[user.personStatus],
  }))

  const model = useMemo(() => buildTaskTreeViewModel(tasks), [tasks])

  const handleAssignTask = (taskCode: string, assigneeName: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.code !== taskCode) {
          return task
        }

        const nextStatus = task.status === '待分配' ? '待执行' : task.status

        return {
          ...task,
          owner: assigneeName,
          status: nextStatus,
          statusTone:
            nextStatus === '执行中'
              ? 'blue'
              : nextStatus === '待提交' || nextStatus === '待验收'
                ? 'orange'
                : 'neutral',
          progress: nextStatus === '待执行' ? Math.max(task.progress, 15) : task.progress,
        }
      })
    )
  }

  if (!tasks.length) {
    return (
      <section className="project-template-empty" role="status" aria-live="polite">
        <div className="project-create-banner">
          <div className="project-create-banner-title">当前项目暂无可展示的模板任务结构</div>
          <p>请先在标准管理中绑定项目模板，或为当前项目补充任务分解数据后再查看。</p>
        </div>
      </section>
    )
  }

  return (
    <section className="project-template-view">
      <div className="project-create-banner">
        <div className="project-create-banner-title">
          项目模板视图：{templateName ?? '未命名模板'}
        </div>
        <p>
          当前展示为“单项目任务分解结构”。
          {diagnostics?.errors.length
            ? `校验异常：${diagnostics.errors[0]}`
            : diagnostics?.warnings.length
              ? `校验提示：${diagnostics.warnings[0]}`
              : '模板关系校验通过。'}
        </p>
      </div>

      <TaskTreeView
        model={model}
        assigneeOptions={assigneeOptions}
        onAssignTask={handleAssignTask}
        onOpenTask={taskCode => {
          const params = new URLSearchParams()
          if (project.templateId) {
            params.set('templateId', project.templateId)
          }
          params.set('projectName', project.name)
          params.set('taskCode', taskCode)
          window.location.assign(`#/tasks?${params.toString()}`)
        }}
      />
    </section>
  )
}

export default ProjectTemplateView
