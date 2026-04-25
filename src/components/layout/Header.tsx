type HeaderProps = {
  title: string;
  subtitle: string;
};

const ASSET_BASE = '/assets/CodeBubbyAssets/3923_861';

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="topbar">
      <div className="topbar-title-group">
        <h1>{title}</h1>
        <span className="topbar-subtitle">{subtitle}</span>
      </div>
      <div className="topbar-actions">
        <div className="search-box">
          <img src={`${ASSET_BASE}/46.svg`} alt="搜索" />
          <input type="text" placeholder="搜索..." />
        </div>
        <button type="button" className="icon-btn" aria-label="通知">
          <img src={`${ASSET_BASE}/42.svg`} alt="" />
        </button>
        <button type="button" className="icon-btn icon-btn-active" aria-label="快捷操作">
          <img src={`${ASSET_BASE}/43.svg`} alt="" />
        </button>
        <button type="button" className="user-profile" aria-label="当前用户">
          <img src={`${ASSET_BASE}/44.svg`} alt="" className="avatar" />
          <span className="user-name">管理员</span>
          <img src={`${ASSET_BASE}/45.svg`} alt="" className="dropdown-icon" />
        </button>
      </div>
    </header>
  );
};

export default Header;
