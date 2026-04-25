const TaskSidebar = () => {
  const currentHash = typeof window === 'undefined' ? '#/tasks' : window.location.hash || '#/tasks';

  const navItems = [
    { icon: '31.svg', label: '工作台', href: '#' },
    { icon: '32.svg', label: '数据中心', href: '#' },
    { icon: '33.svg', label: '项目管理', href: '#/projects' },
    { icon: '34.svg', label: '任务管理', href: '#/tasks' },
    { icon: '35.svg', label: '客户管理', href: '#' },
    { icon: '36.svg', label: '合同结算', href: '#' },
    { icon: '37.svg', label: '采购管理', href: '#' },
    { icon: '38.svg', label: '订单管理', href: '#' },
    { icon: '39.svg', label: '设施管理', href: '#' },
    { icon: '40.svg', label: '标准管理', href: '#' },
    { icon: '41.svg', label: '人员管理', href: '#' },
    { icon: '42.svg', label: '数字员工', href: '#' },
    { icon: '43.svg', label: '系统设置', href: '#' },
  ];

  return (
    <aside className="tm-sidebar">
      <div className="tm-sidebar-brand">
        <img src="/assets/CodeBubbyAssets/3947_2/45.png" alt="数字建管" className="tm-brand-logo" />
        <button className="tm-sidebar-collapse" aria-label="收起侧边栏" type="button">
          <img src="/assets/CodeBubbyAssets/3947_2/44.svg" alt="" />
        </button>
      </div>

      <nav className="tm-sidebar-nav">
        {navItems.map((item) => {
          const isActive = item.href === '#/projects'
            ? currentHash === '#/projects' || currentHash.startsWith('#/projects/')
            : item.href === '#/tasks'
              ? currentHash === '#/tasks'
              : false;

          return (
            <a key={item.label} href={item.href} className={`tm-nav-item ${isActive ? 'active' : ''}`}>
              <img src={`/assets/CodeBubbyAssets/3947_2/${item.icon}`} alt="" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default TaskSidebar;
