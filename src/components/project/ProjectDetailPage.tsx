import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import ProjectBreadcrumb from './ProjectBreadcrumb';
import ProjectTabs from './ProjectTabs';
import ProjectInfoCard from './ProjectInfoCard';
import PhasesCard from './PhasesCard';
import SummaryCard from './SummaryCard';
import ActivitiesCard from './ActivitiesCard';
import ProjectGanttView from './ProjectGanttView';
import type { ProjectItem } from '../../data/projects';
import type { ProjectDetailTab } from './ProjectTabs';
import './project-detail.css';

type ProjectDetailPageProps = {
  project: ProjectItem;
  activeTab: ProjectDetailTab;
  onBack: () => void;
};

const ProjectDetailPage = ({ project, activeTab, onBack }: ProjectDetailPageProps) => {
  return (
    <div className="pm-app project-detail-app">
      <div className="pm-glow pm-glow-left" />
      <div className="pm-glow pm-glow-right" />
      <Sidebar />

      <div className="project-detail-main">
        <Header title={project.name} subtitle={project.code} />

        <main className="project-detail-body">
          <ProjectBreadcrumb projectName={project.name} onBack={onBack} />
          <ProjectTabs activeTab={activeTab} projectCode={project.code} />
          <ProjectInfoCard project={project} />

          {activeTab === 'overview' ? (
            <div className="project-detail-grid">
              <PhasesCard />

              <div className="project-detail-side">
                <SummaryCard project={project} />
                <ActivitiesCard />
              </div>
            </div>
          ) : (
            <ProjectGanttView project={project} />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
