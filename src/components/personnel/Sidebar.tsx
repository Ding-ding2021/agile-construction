const PersonnelSidebar = () => {
  const currentHash = typeof window === 'undefined' ? '#/projects' : window.location.hash || '#/projects';

  const navItems = [
    { icon: '42.svg', label: '工作台', href: '#' },
    { icon: '43.svg', label: '数据中心', href: '#' },
    { icon: '44.svg', label: '项目管理', href: '#/projects' },
    { icon: '45.svg', label: '任务管理', href: '#/tasks' },
    { icon: '46.svg', label: '客户管理', href: '#' },
    { icon: '47.svg', label: '合同结算', href: '#' },
    { icon: '48.svg', label: '采购管理', href: '#' },
    { icon: '49.svg', label: '订单管理', href: '#' },
    { icon: '50.svg', label: '设施管理', href: '#' },
    { icon: '51.svg', label: '标准管理', href: '#' },
    { icon: '52.svg', label: '人员管理', href: '#' },
    { icon: '53.svg', label: '数字员工', href: '#' },
    { icon: '54.svg', label: '系统设置', href: '#' },
  ];

  return (
    <aside className="pm-sidebar">
      <div className="pm-sidebar-brand">
        <img src="/assets/CodeBubbyAssets/3848_19/78.png" alt="数字建管" className="pm-brand-logo" />
        <button className="pm-sidebar-collapse" aria-label="收起侧边栏">
          <img src="/assets/CodeBubbyAssets/3848_19/55.svg" alt="" />
        </button>
      </div>

      <nav className="pm-sidebar-nav">
        {navItems.map((item) => {
          const isActive = item.href === '#/projects'
            ? currentHash === '#/projects' || currentHash.startsWith('#/projects/')
            : item.href === '#/tasks'
              ? currentHash === '#/tasks'
              : false;

          return (
            <a key={item.label} href={item.href} className={`pm-nav-item ${isActive ? 'active' : ''}`}>
              <img src={`/assets/CodeBubbyAssets/3848_19/${item.icon}`} alt="" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default PersonnelSidebar;
