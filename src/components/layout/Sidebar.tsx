const ASSET_BASE = '/assets/CodeBubbyAssets/3923_861';

const navItems = [
  { label: '工作台', icon: '47.svg' },
  { label: '数据中心', icon: '48.svg' },
  { label: '项目管理', icon: '49.svg', active: true, href: '#/projects' },
  { label: '任务管理', icon: '50.svg' },
  { label: '客户管理', icon: '51.svg' },
  { label: '合同结算', icon: '52.svg' },
  { label: '采购管理', icon: '53.svg' },
  { label: '订单管理', icon: '54.svg' },
  { label: '设施管理', icon: '55.svg' },
  { label: '标准管理', icon: '56.svg' },
  { label: '人员管理', icon: '57.svg' },
  { label: '数字员工', icon: '58.svg' },
  { label: '系统设置', icon: '59.svg' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo-container">
          <img src={`${ASSET_BASE}/61.png`} alt="Logo" className="brand-logo" />
          <button type="button" className="sidebar-collapse-btn" aria-label="收起侧边栏">
            <img src={`${ASSET_BASE}/60.svg`} alt="Collapse" />
          </button>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a key={item.label} href={item.href ?? '#'} className={`nav-item ${item.active ? 'active' : ''}`}>
            <img src={`${ASSET_BASE}/${item.icon}`} alt="" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
