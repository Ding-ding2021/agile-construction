type ProjectBreadcrumbProps = {
  projectName: string;
  onBack: () => void;
};

const ASSET_BASE = '/assets/CodeBubbyAssets/3923_861';

const ProjectBreadcrumb = ({ projectName, onBack }: ProjectBreadcrumbProps) => {
  return (
    <div className="breadcrumb">
      <button type="button" className="breadcrumb-link" onClick={onBack}>
        <img src={`${ASSET_BASE}/1.svg`} alt="" />
        <span>项目列表</span>
      </button>
      <img src={`${ASSET_BASE}/2.svg`} alt=">" className="breadcrumb-separator" />
      <div className="breadcrumb-item active">
        <span>{projectName}</span>
      </div>
    </div>
  );
};

export default ProjectBreadcrumb;
