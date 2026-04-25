type PersonnelHeaderProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isInsightsOpen: boolean;
  onInsightsToggle: () => void;
};

const PersonnelHeader = ({
  searchQuery,
  onSearchChange,
  isInsightsOpen,
  onInsightsToggle,
}: PersonnelHeaderProps) => {
  return (
    <header className="pm-header">
      <div className="pm-header-title">
        <h1>项目管理</h1>
        <span>Project Management</span>
      </div>

      <div className="pm-header-actions">
        <div className="pm-search-box">
          <img src="/assets/CodeBubbyAssets/3848_19/41.svg" alt="搜索" />
          <input 
            type="text" 
            placeholder="搜索..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button type="button" className="pm-icon-btn" aria-label="通知">
          <img src="/assets/CodeBubbyAssets/3848_19/37.svg" alt="" />
        </button>
        <button
          type="button"
          className={`pm-icon-btn ${isInsightsOpen ? 'pm-icon-btn-active' : ''}`}
          aria-label={isInsightsOpen ? '关闭 Agent 对话框' : '打开 Agent 对话框'}
          aria-expanded={isInsightsOpen}
          onClick={onInsightsToggle}
        >
          <img src="/assets/CodeBubbyAssets/3848_19/38.svg" alt="" />
        </button>
        <button type="button" className="pm-user-profile" aria-label="当前用户">
          <img src="/assets/CodeBubbyAssets/3848_19/39.svg" alt="" />
          <span>管理员</span>
          <img src="/assets/CodeBubbyAssets/3848_19/40.svg" alt="" />
        </button>
      </div>
    </header>
  );
};

export default PersonnelHeader;
