type TaskHeaderProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

const TaskHeader = ({ searchQuery, onSearchChange }: TaskHeaderProps) => {
  return (
    <header className="tm-header">
      <div className="tm-header-title">
        <h1>任务管理</h1>
        <span>Task Management</span>
      </div>

      <div className="tm-header-actions">
        <div className="tm-search-box">
          <img src="/assets/CodeBubbyAssets/3947_2/30.svg" alt="搜索" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <button type="button" className="tm-icon-btn" aria-label="通知">
          <img src="/assets/CodeBubbyAssets/3947_2/26.svg" alt="" />
        </button>
        <button type="button" className="tm-icon-btn tm-icon-btn-active" aria-label="Agent">
          <img src="/assets/CodeBubbyAssets/3947_2/27.svg" alt="" />
        </button>
        <button type="button" className="tm-user-profile" aria-label="当前用户">
          <img src="/assets/CodeBubbyAssets/3947_2/28.svg" alt="" />
          <span>管理员</span>
          <img src="/assets/CodeBubbyAssets/3947_2/29.svg" alt="" />
        </button>
      </div>
    </header>
  );
};

export default TaskHeader;
