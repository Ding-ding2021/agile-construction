import type { ProjectItem } from '../../../data/projects'

type ProjectSettingsTabProps = {
  project: ProjectItem
}

const ProjectSettingsTab = ({ project }: ProjectSettingsTabProps) => {
  return (
    <section className="project-tab-shell">
      <div className="project-tab-placeholder">
        <h3>设置与 Agent</h3>
        <p>项目编码：{project.code}</p>
        <p className="project-tab-hint">此标签将迁移现有项目设置内容，在 Phase 2 中完善</p>
      </div>
    </section>
  )
}

export default ProjectSettingsTab
