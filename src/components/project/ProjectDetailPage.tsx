import Header from '../layout/Header';
import { AppSidebar } from '../shared';
import ProjectBreadcrumb from './ProjectBreadcrumb';
import ProjectTabs from './ProjectTabs';
import ProjectInfoCard from './ProjectInfoCard';
import PhasesCard from './PhasesCard';
import SummaryCard from './SummaryCard';
import ActivitiesCard from './ActivitiesCard';
import ProjectGanttView from './ProjectGanttView';
import ProjectScopeTab from './tabs/ProjectScopeTab';
import ProjectCostTab from './tabs/ProjectCostTab';
import ProjectQualityTab from './tabs/ProjectQualityTab';
import ProjectResourcesTab from './tabs/ProjectResourcesTab';
import ProjectRiskTab from './tabs/ProjectRiskTab';
import ProjectSettingsTab from './tabs/ProjectSettingsTab';
import type { ProjectItem } from '../../data/projects';
import type { ProjectDetailTab } from './projectTabs.shared';
import './project-detail.css';

type ProjectDetailPageProps = {
  project: ProjectItem;
  activeTab: ProjectDetailTab;
  onBack: () => void;
};

const ProjectDetailPage = ({ project, activeTab, onBack }: ProjectDetailPageProps) => {
  const currentHash = typeof window === 'undefined' ? '#/projects' : window.location.hash || '#/projects';

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="project-detail-grid">
          <PhasesCard />

          <div className="project-detail-side">
            <SummaryCard project={project} />
            <ActivitiesCard />
          </div>
        </div>
      );
    }

    if (activeTab === 'schedule') {
      return <ProjectGanttView project={project} />;
    }

    if (activeTab === 'scope') {
      return <ProjectScopeTab project={project} />;
    }

    if (activeTab === 'cost') {
      return <ProjectCostTab project={project} />;
    }

    if (activeTab === 'quality') {
      return <ProjectQualityTab project={project} />;
    }

    if (activeTab === 'resources') {
      return <ProjectResourcesTab project={project} />;
    }

    if (activeTab === 'risk') {
      return <ProjectRiskTab project={project} />;
    }

    return <ProjectSettingsTab project={project} />;
  };

  return (
    <div className="pm-app project-detail-app">
      <div className="pm-glow pm-glow-left" />
      <div className="pm-glow pm-glow-right" />
      <AppSidebar currentHash={currentHash} />

      <div className="project-detail-main">
        <Header title={project.name} subtitle={project.code} />

        <main className="project-detail-body">
          <ProjectBreadcrumb projectName={project.name} onBack={onBack} />
          <ProjectTabs activeTab={activeTab} projectCode={project.code} />
          <ProjectInfoCard project={project} />
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
