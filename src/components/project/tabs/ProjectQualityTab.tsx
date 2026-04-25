import type { ProjectItem } from '../../../data/projects'

type ProjectQualityTabProps = {
  project: ProjectItem
}

const ProjectQualityTab = ({ project }: ProjectQualityTabProps) => {
  return (
    <section className="project-tab-shell">
      <div className="project-tab-placeholder">
        <h3>质量与验收</h3>
        <p>项目编码：{project.code}</p>
        <p>验收状态：{project.acceptanceStatus ?? '未开始'}</p>
        <p className="project-tab-hint">此标签将合并现有验收相关内容，在 Phase 2 中完善</p>
      </div>
    </section>
  )
}

export default ProjectQualityTab
