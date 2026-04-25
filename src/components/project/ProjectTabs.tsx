const ASSET_BASE = '/assets/CodeBubbyAssets/3923_861';

export const PROJECT_DETAIL_TABS = ['overview', 'gantt'] as const;
export type ProjectDetailTab = (typeof PROJECT_DETAIL_TABS)[number];

type ProjectTabItem = {
  id: 'overview' | 'gantt' | 'tasks' | 'risks' | 'cost' | 'procurement' | 'docs' | 'members' | 'changes' | 'ai';
  icon: string;
  label: string;
  badge?: string;
  aiBadge?: string;
};

const isInteractiveTab = (tabId: ProjectTabItem['id']): tabId is ProjectDetailTab =>
  tabId === 'overview' || tabId === 'gantt';

export const isProjectDetailTab = (value: string): value is ProjectDetailTab =>
  PROJECT_DETAIL_TABS.includes(value as ProjectDetailTab);

export const buildProjectDetailTabHash = (projectCode: string, tab: ProjectDetailTab = 'overview') => {
  const encodedCode = encodeURIComponent(projectCode);
  return tab === 'overview' ? `#/projects/${encodedCode}` : `#/projects/${encodedCode}/${tab}`;
};

const tabs: readonly ProjectTabItem[] = [
  { id: 'overview', icon: '6.svg', label: '概览' },
  { id: 'gantt', icon: '7.svg', label: '甘特图' },
  { id: 'tasks', icon: '8.svg', label: '任务', badge: '7' },
  { id: 'risks', icon: '9.svg', label: '风险/问题', badge: '2' },
  { id: 'cost', icon: '10.svg', label: '成本控制' },
  { id: 'procurement', icon: '11.svg', label: '项目采购', badge: '5' },
  { id: 'docs', icon: '12.svg', label: '资料', badge: '4' },
  { id: 'members', icon: '13.svg', label: '成员', badge: '8' },
  { id: 'changes', icon: '14.svg', label: '变更管理', badge: '3' },
  { id: 'ai', icon: '15.svg', label: 'AI 工程师', aiBadge: 'AI' },
];

type ProjectTabsProps = {
  activeTab: ProjectDetailTab;
  projectCode: string;
};

const ProjectTabs = ({ activeTab, projectCode }: ProjectTabsProps) => {
  return (
    <div className="nav-tabs">
      {tabs.map((tab) => {
        const interactiveTab = isInteractiveTab(tab.id) ? tab.id : null;
        const isActive = activeTab === tab.id;
        const content = (
          <>
            <img src={`${ASSET_BASE}/${tab.icon}`} alt="" />
            <span>{tab.label}</span>
            {tab.badge && <span className="badge">{tab.badge}</span>}
            {tab.aiBadge && <span className="badge badge-ai">{tab.aiBadge}</span>}
          </>
        );

        if (interactiveTab) {
          return (
            <a
              key={tab.id}
              href={buildProjectDetailTabHash(projectCode, interactiveTab)}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {content}
            </a>
          );
        }

        return (
          <button key={tab.id} type="button" className="tab-btn disabled" disabled aria-disabled="true">
            {content}
          </button>
        );
      })}
    </div>
  );
};

export default ProjectTabs;
