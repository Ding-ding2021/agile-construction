import type { ProjectItem } from '../../../data/projects'

type ProjectCostTabProps = {
  project: ProjectItem
}

const ProjectCostTab = ({ project }: ProjectCostTabProps) => {
  return (
    <section className="project-tab-shell">
      <div className="project-tab-placeholder">
        <h3>成本与采购</h3>
        <p>项目编码：{project.code}</p>
        <p>预算：{project.budget}</p>
        <p className="project-tab-hint">此标签为新增壳子，在 Phase 2 中完善</p>
      </div>
    </section>
  )
}

export default ProjectCostTab
