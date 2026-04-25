import type { ProjectWbsNode } from '../../data/projectWbs'

type WbsNodePanelProps = {
  projectName: string
  node: ProjectWbsNode | null
}

const TYPE_LABELS: Record<ProjectWbsNode['type'], string> = {
  project: '项目',
  work_package: '工作包',
  task: '任务',
  subtask: '子任务',
}

const WbsNodePanel = ({ projectName, node }: WbsNodePanelProps) => {
  if (!node) {
    return null
  }

  return (
    <aside className="card wbs-panel">
      <div className="wbs-panel-header">
        <div>
          <span className="wbs-panel-eyebrow">{projectName}</span>
          <h3>{node.name}</h3>
        </div>
        <span className={`wbs-status-chip ${node.status}`}>{node.statusLabel}</span>
      </div>

      <div className="wbs-panel-grid">
        <div className="wbs-panel-field">
          <span>WBS编码</span>
          <strong>{node.wbsCode}</strong>
        </div>
        <div className="wbs-panel-field">
          <span>节点类型</span>
          <strong>{TYPE_LABELS[node.type]}</strong>
        </div>
        <div className="wbs-panel-field">
          <span>计划开始</span>
          <strong>{node.planStart}</strong>
        </div>
        <div className="wbs-panel-field">
          <span>计划结束</span>
          <strong>{node.planEnd}</strong>
        </div>
      </div>

      <div className="wbs-panel-section">
        <div className="wbs-panel-section-head">
          <span>进度</span>
          <strong>{node.progress}%</strong>
        </div>
        <div className="wbs-progress-track">
          <div
            className={`wbs-progress-fill ${node.status}`}
            style={{ width: `${node.progress}%` }}
          />
        </div>
      </div>

      <div className="wbs-panel-owner">
        <span className="wbs-panel-avatar">{node.owner.slice(0, 1)}</span>
        <div>
          <span className="wbs-panel-label">负责人</span>
          <strong>{node.owner}</strong>
        </div>
      </div>

      <div className="wbs-panel-section">
        <span className="wbs-panel-label">前置依赖</span>
        <div className="wbs-chip-list">
          {node.dependencies.length ? (
            node.dependencies.map(dependency => (
              <span key={dependency} className="wbs-info-chip muted">
                {dependency}
              </span>
            ))
          ) : (
            <span className="wbs-empty-text">无前置依赖</span>
          )}
        </div>
      </div>
    </aside>
  )
}

export default WbsNodePanel
