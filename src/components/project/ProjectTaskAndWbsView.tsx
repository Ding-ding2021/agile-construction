import { useMemo, useState } from 'react'
import type { ProjectItem } from '../../data/projects'
import ProjectGanttView from './ProjectGanttView'
import ProjectWbsView from './ProjectWbsView'
import './project-task-and-wbs.css'

type WorkspaceViewMode = 'wbs' | 'gantt'

type ProjectTaskAndWbsViewProps = {
  project: ProjectItem
  onOpenGlobalTask?: (taskCode?: string) => void
  defaultViewMode?: WorkspaceViewMode
}

const ProjectTaskAndWbsView = ({
  project,
  defaultViewMode = 'wbs',
}: ProjectTaskAndWbsViewProps) => {
  const [viewModeByProject, setViewModeByProject] = useState<Record<string, WorkspaceViewMode>>({})
  const currentViewMode = viewModeByProject[project.code] ?? defaultViewMode

  const summary = useMemo(() => {
    const riskCount = project.risks?.filter(risk => risk.status === 'active').length ?? 0
    return {
      phaseCount: project.phases?.length ?? 0,
      milestoneCount: project.milestones?.length ?? 0,
      pendingExecution: project.pendingExecutionCount,
      activeRiskCount: riskCount,
    }
  }, [project])

  return (
    <section className="project-task-wbs-view">
      <header className="project-workspace-header card">
        <div>
          <p className="project-workspace-eyebrow">计划与执行同源工作台</p>
          <h3>{project.name} 工作项视图</h3>
          <p>结构视图（WBS）与时间视图（甘特）基于同一 WorkItem 数据源派生，支持一致化治理。</p>
        </div>

        <div className="project-workspace-actions">
          <button
            type="button"
            className={`project-workspace-tab ${currentViewMode === 'wbs' ? 'active' : ''}`}
            onClick={() => setViewModeByProject(prev => ({ ...prev, [project.code]: 'wbs' }))}
          >
            结构视图
          </button>
          <button
            type="button"
            className={`project-workspace-tab ${currentViewMode === 'gantt' ? 'active' : ''}`}
            onClick={() => setViewModeByProject(prev => ({ ...prev, [project.code]: 'gantt' }))}
          >
            时间视图
          </button>
        </div>
      </header>

      <div className="project-workspace-summary">
        <span>阶段 {summary.phaseCount}</span>
        <span>里程碑 {summary.milestoneCount}</span>
        <span>待回传 {summary.pendingExecution}</span>
        <span className={summary.activeRiskCount > 0 ? 'warning' : ''}>
          活动风险 {summary.activeRiskCount}
        </span>
      </div>

      {currentViewMode === 'wbs' ? (
        <ProjectWbsView project={project} />
      ) : (
        <ProjectGanttView project={project} />
      )}
    </section>
  )
}

export default ProjectTaskAndWbsView
