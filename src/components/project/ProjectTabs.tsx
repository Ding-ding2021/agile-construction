import {
  PROJECT_TAB_LABELS,
  buildProjectDetailTabHash,
  type ProjectDetailTab,
} from './projectTabs.shared';

const ASSET_BASE = '/assets/CodeBubbyAssets/3923_861';

type ProjectTabItem = {
  id: ProjectDetailTab;
  icon: string;
};

const tabs: readonly ProjectTabItem[] = [
  { id: 'overview', icon: '6.svg' },
  { id: 'scope', icon: '8.svg' },
  { id: 'schedule', icon: '7.svg' },
  { id: 'cost', icon: '10.svg' },
  { id: 'quality', icon: '9.svg' },
  { id: 'resources', icon: '13.svg' },
  { id: 'risk', icon: '14.svg' },
  { id: 'settings', icon: '15.svg' },
];

type ProjectTabsProps = {
  activeTab: ProjectDetailTab;
  projectCode: string;
};

const ProjectTabs = ({ activeTab, projectCode }: ProjectTabsProps) => {
  return (
    <div className="nav-tabs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <a
            key={tab.id}
            href={buildProjectDetailTabHash(projectCode, tab.id)}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <img src={`${ASSET_BASE}/${tab.icon}`} alt="" />
            <span>{PROJECT_TAB_LABELS[tab.id]}</span>
          </a>
        );
      })}
    </div>
  );
};

export default ProjectTabs;
