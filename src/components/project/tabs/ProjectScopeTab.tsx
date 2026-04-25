import type { ProjectItem } from '../../../data/projects'

type ProjectScopeTabProps = {
  project: ProjectItem
}

const ProjectScopeTab = ({ project }: ProjectScopeTabProps) => {
  return (
    <section className="project-tab-shell">
      <div className="project-tab-placeholder">
        <h3>范围与任务</h3>
        <p>项目编码：{project.code}</p>
        <p className="project-tab-hint">
          此标签将合并现有「计划与执行」+ WBS 内容，在 Phase 2 中完善
        </p>
      </div>
    </section>
  )
}

export default ProjectScopeTab
