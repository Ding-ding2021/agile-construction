const PersonnelTabs = () => {
  const tabs = [
    { id: 'users', icon: '1.svg', label: '用户列表', active: true },
    { id: 'roles', icon: '2.svg', label: '角色与权限' },
    { id: 'audit', icon: '3.svg', label: '操作审计' }
  ];

  return (
    <div className="pm-tabs">
      {tabs.map(tab => (
        <button key={tab.id} className={`pm-tab-btn ${tab.active ? 'active' : ''}`}>
          <img src={`/assets/CodeBubbyAssets/358_3/${tab.icon}`} alt="" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default PersonnelTabs;
