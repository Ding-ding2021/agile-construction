import type { ProjectItem } from '../../../data/projects'

type ProjectRiskTabProps = {
  project: ProjectItem
}

const ProjectRiskTab = ({ project }: ProjectRiskTabProps) => {
  return (
    <section className="project-tab-shell">
      <div className="project-tab-placeholder">
        <h3>风险与沟通</h3>
        <p>项目编码：{project.code}</p>
        <p>风险等级：{project.riskLevel ?? '未评估'}</p>
        <p className="project-tab-hint">此标签将合并现有风险相关内容，在 Phase 2 中完善</p>
      </div>
    </section>
  )
}

export default ProjectRiskTab
