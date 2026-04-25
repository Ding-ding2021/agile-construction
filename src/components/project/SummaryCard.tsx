import type { ProjectItem } from '../../data/projects';

type SummaryCardProps = {
  project: ProjectItem;
};

const SummaryCard = ({ project }: SummaryCardProps) => {
  return (
    <div className="card summary-card">
      <div className="card-header">
        <h2>项目概要</h2>
      </div>
      <p className="summary-desc">{project.description}</p>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">预算</div>
          <div className="stat-value">{project.budget}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">团队</div>
          <div className="stat-value">{project.teamSize}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">任务完成</div>
          <div className="stat-value text-green-value">{project.tasks}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">待处理风险</div>
          <div className="stat-value text-yellow-value">{project.riskCount}</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
