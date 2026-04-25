import { useEffect, useMemo, useState } from 'react'
import type { ProjectItem } from '../../data/projects'
import { getProjectGanttData } from '../../data/projectGantt'
import GanttChart from './GanttChart'
import GanttTaskPanel from './GanttTaskPanel'
import './project-gantt.css'

type ProjectGanttViewProps = {
  project: ProjectItem
}

const ProjectGanttView = ({ project }: ProjectGanttViewProps) => {
  const ganttData = useMemo(() => getProjectGanttData(project), [project])
  const [selectedTaskId, setSelectedTaskId] = useState(ganttData.focusTaskId)

  useEffect(() => {
    // eslint-disable-next-line
    setSelectedTaskId(ganttData.focusTaskId)
  }, [ganttData.focusTaskId, project.code])

  const taskItems = useMemo(
    () => ganttData.groups.flatMap(group => group.items),
    [ganttData.groups]
  )

  const selectedTask = useMemo(
    () => taskItems.find(item => item.id === selectedTaskId) ?? taskItems[0] ?? null,
    [selectedTaskId, taskItems]
  )
  const focusLabel = selectedTask?.critical ? '关键路径任务' : '执行任务'

  return (
    <section className="gantt-view">
      <div className="gantt-view-header">
        <div className="gantt-view-title-block">
          <span className="gantt-view-eyebrow">项目计划与执行</span>
          <h2>项目甘特图</h2>
          <p>{project.name}的关键路径任务已按设计、施工、验收与开业准备阶段展开。</p>
        </div>

        <div className="gantt-view-toolbar">
          <div className="gantt-summary-pills">
            <span className="gantt-summary-pill">
              <strong>{ganttData.summary.phaseCount}</strong>
              <span>阶段</span>
            </span>
            <span className="gantt-summary-pill">
              <strong>{ganttData.summary.taskCount}</strong>
              <span>任务</span>
            </span>
            <span className="gantt-summary-pill">
              <strong>{ganttData.summary.milestoneCount}</strong>
              <span>里程碑</span>
            </span>
            <span className="gantt-summary-pill muted">更新于 {ganttData.updatedAt}</span>
          </div>

          <div className="gantt-header-actions">
            <div className="gantt-legend">
              {ganttData.legend.map(item => (
                <span key={item.label} className="gantt-legend-item">
                  <span className={`gantt-legend-dot ${item.tone}`} />
                  <span>{item.label}</span>
                </span>
              ))}
            </div>

            <div className="gantt-quick-actions">
              <span className="gantt-meta-chip active">时间粒度：月</span>
              <span className="gantt-meta-chip">当前焦点：{focusLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gantt-view-layout">
        <div className="card gantt-board-card">
          <GanttChart
            timeline={ganttData.timeline}
            groups={ganttData.groups}
            selectedTaskId={selectedTaskId}
            onTaskSelect={setSelectedTaskId}
          />
        </div>
        <GanttTaskPanel projectName={project.name} task={selectedTask} />
      </div>
    </section>
  )
}

export default ProjectGanttView
