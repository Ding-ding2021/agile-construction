import type { ProjectItem } from '../../../data/projects'

type ProjectResourcesTabProps = {
  project: ProjectItem
}

const ProjectResourcesTab = ({ project }: ProjectResourcesTabProps) => {
  return (
    <section className="project-tab-shell">
      <div className="project-tab-placeholder">
        <h3>资源与人员</h3>
        <p>项目编码：{project.code}</p>
        <p>负责人：{project.owner}</p>
        <p className="project-tab-hint">此标签将合并现有人员相关内容，在 Phase 2 中完善</p>
      </div>
    </section>
  )
}

export default ProjectResourcesTab
