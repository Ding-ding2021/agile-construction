import type { ProjectGanttTaskItem } from '../../data/projectGantt';

type GanttTaskPanelProps = {
  projectName: string;
  task: ProjectGanttTaskItem | null;
};

const GanttTaskPanel = ({ projectName, task }: GanttTaskPanelProps) => {
  if (!task) {
    return null;
  }

  return (
    <aside className="card gantt-panel">
      <div className="gantt-panel-header">
        <div>
          <span className="gantt-panel-eyebrow">{projectName}</span>
          <h3>{task.name}</h3>
        </div>
        <span className={`gantt-status-chip ${task.status}`}>{task.statusLabel}</span>
      </div>

      <p className="gantt-panel-description">{task.description}</p>

      <div className="gantt-panel-grid">
        <div className="gantt-panel-field">
          <span>阶段</span>
          <strong>{task.groupLabel}</strong>
        </div>
        <div className="gantt-panel-field">
          <span>任务类型</span>
          <strong>{task.kind === 'milestone' ? '里程碑' : '执行任务'}</strong>
        </div>
        <div className="gantt-panel-field">
          <span>开始</span>
          <strong>{task.startDate}</strong>
        </div>
        <div className="gantt-panel-field">
          <span>结束</span>
          <strong>{task.endDate}</strong>
        </div>
      </div>

      <div className="gantt-panel-section">
        <div className="gantt-panel-section-head">
          <span>进度</span>
          <strong>{task.progress}%</strong>
        </div>
        <div className="gantt-progress-track">
          <div className={`gantt-progress-fill ${task.status}`} style={{ width: `${task.progress}%` }} />
        </div>
      </div>

      <div className="gantt-panel-owner">
        <span className="gantt-panel-avatar">{task.owner.slice(0, 1)}</span>
        <div>
          <span className="gantt-panel-label">负责人</span>
          <strong>{task.owner}</strong>
        </div>
      </div>

      <div className="gantt-toggle-row">
        <div>
          <span className="gantt-panel-label">关键路径</span>
          <strong>{task.critical ? '已纳入重点跟踪' : '普通跟踪任务'}</strong>
        </div>
        <span className={`gantt-toggle ${task.critical ? 'active' : ''}`}>
          <span />
        </span>
      </div>

      <div className="gantt-panel-section">
        <span className="gantt-panel-label">标签</span>
        <div className="gantt-chip-list">
          {task.tags.map((tag) => (
            <span key={tag} className="gantt-info-chip">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="gantt-panel-section">
        <span className="gantt-panel-label">前置任务</span>
        <div className="gantt-chip-list">
          {task.dependencies.length > 0 ? (
            task.dependencies.map((dependency) => (
              <span key={dependency} className="gantt-info-chip muted">
                {dependency}
              </span>
            ))
          ) : (
            <span className="gantt-empty-text">无前置任务</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default GanttTaskPanel;
