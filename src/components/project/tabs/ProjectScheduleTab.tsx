import type { ProjectItem } from '../../../data/projects'

type ProjectScheduleTabProps = {
  project: ProjectItem
}

const ProjectScheduleTab = ({ project }: ProjectScheduleTabProps) => {
  return (
    <section className="project-tab-shell">
      <div className="project-tab-placeholder">
        <h3>进度管理</h3>
        <p>项目编码：{project.code}</p>
        <p>当前进度：{project.progress}%</p>
        <p className="project-tab-hint">此标签将接入甘特图视图，在 Phase 2 中完善</p>
      </div>
    </section>
  )
}

export default ProjectScheduleTab
