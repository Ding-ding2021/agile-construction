import type { ProjectItem } from '../../data/projects';

type ProjectInfoCardProps = {
  project: ProjectItem;
};

const ASSET_BASE = '/assets/CodeBubbyAssets/3923_861';

const ProjectInfoCard = ({ project }: ProjectInfoCardProps) => {
  return (
    <div className="card project-info-card">
      <div className="card-header">
        <h2>项目概要</h2>
        <button type="button" className="edit-btn">
          <img src={`${ASSET_BASE}/3.svg`} alt="" />
          <span>编辑</span>
        </button>
      </div>
      <div className="project-info-details">
        <div className="info-item status-item">
          <span className="info-label">状态</span>
          <span className={`project-status-badge ${project.statusTone}`}>{project.status}</span>
        </div>
        <div className="info-item">
          <span className="info-label">负责人</span>
          <span className="info-value">{project.owner}</span>
        </div>
        <div className="info-item with-icon">
          <img src={`${ASSET_BASE}/4.svg`} alt="" />
          <span className="info-value">{project.dateRange}</span>
        </div>
        <div className="info-item with-icon">
          <img src={`${ASSET_BASE}/5.svg`} alt="" />
          <span className="info-value">{project.teamSize}</span>
        </div>
        <div className="info-item progress-item">
          <span className="info-label">总体进度</span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
          </div>
          <span className="progress-text">{project.progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoCard;
