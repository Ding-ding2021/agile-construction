const ASSET_BASE = '/assets/CodeBubbyAssets/3923_861';

const navItems = [
  { label: '工作台', icon: '47.svg' },
  { label: '数据中心', icon: '48.svg' },
  { label: '项目管理', icon: '49.svg', href: '#/projects' },
  { label: '任务管理', icon: '50.svg', href: '#/tasks' },
  { label: '客户管理', icon: '51.svg', href: '#/customers' },
  { label: '合同结算', icon: '52.svg', href: '#/contracts' },
  { label: '采购管理', icon: '53.svg', href: '#/procurement' },
  { label: '订单管理', icon: '54.svg', href: '#/orders' },
  { label: '设施管理', icon: '55.svg', href: '#/facility' },
  { label: '标准管理', icon: '56.svg', href: '#/standards' },
  { label: '人员管理', icon: '57.svg', href: '#/personnel' },
  { label: '数字员工', icon: '58.svg', href: '#/digital-employee' },
  { label: '系统设置', icon: '59.svg', href: '#/settings' },
];

const Sidebar = () => {
  const currentHash = typeof window === 'undefined' ? '#/projects' : window.location.hash || '#/projects';

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
        {navItems.map((item) => {
          const isActive = item.href
            ? item.href === '#/projects'
              ? currentHash === '#/projects' || currentHash.startsWith('#/projects/')
              : currentHash === item.href || currentHash.startsWith(`${item.href}/`)
            : false;
          return (
            <a key={item.label} href={item.href ?? '#'} className={`nav-item ${isActive ? 'active' : ''}`}>
              <img src={`${ASSET_BASE}/${item.icon}`} alt="" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
