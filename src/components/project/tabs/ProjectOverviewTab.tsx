import type { ProjectItem } from '../../../data/projects'

type ProjectOverviewTabProps = {
  project: ProjectItem
}

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  return (
    <section className="project-tab-shell">
      <div className="project-tab-placeholder">
        <h3>项目概览</h3>
        <p>项目名称：{project.name}</p>
        <p>项目编码：{project.code}</p>
        <p className="project-tab-hint">此标签内容将在 Phase 2 中完善</p>
      </div>
    </section>
  )
}

export default ProjectOverviewTab
