import { useEffect, useMemo, useState } from 'react';
import PersonnelPage from './components/personnel/PersonnelPage';
import ProjectDetailPage from './components/project/ProjectDetailPage';
import TaskManagementPage from './components/task/TaskManagementPage';
import { buildProjectDetailTabHash, isProjectDetailTab, type ProjectDetailTab } from './components/project/ProjectTabs';
import { getProjectByCode } from './data/projects';

type AppRoute =
  | { page: 'projects' }
  | { page: 'tasks' }
  | { page: 'detail'; code: string; tab: ProjectDetailTab };

const PROJECTS_HASH = '#/projects';
const TASKS_HASH = '#/tasks';
const DETAIL_HASH_PREFIX = '#/projects/';

const readRouteFromHash = (): AppRoute => {
  const hash = window.location.hash;

  if (!hash || hash === '#' || hash === PROJECTS_HASH) {
    return { page: 'projects' };
  }

  if (hash === TASKS_HASH) {
    return { page: 'tasks' };
  }

  if (hash.startsWith(DETAIL_HASH_PREFIX)) {
    const routePath = hash.slice(DETAIL_HASH_PREFIX.length);
    const [encodedCode, maybeTab] = routePath.split('/');

    if (!encodedCode) {
      return { page: 'projects' };
    }

    return {
      page: 'detail',
      code: decodeURIComponent(encodedCode),
      tab: maybeTab && isProjectDetailTab(maybeTab) ? maybeTab : 'overview',
    };
  }

  return { page: 'projects' };
};

function App() {
  const [route, setRoute] = useState<AppRoute>(() => readRouteFromHash());

  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = PROJECTS_HASH;
    }

    const handleHashChange = () => {
      setRoute(readRouteFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeProject = useMemo(() => {
    if (route.page !== 'detail') {
      return null;
    }

    return getProjectByCode(route.code) ?? null;
  }, [route]);

  const openProject = (projectCode: string, tab: ProjectDetailTab = 'overview') => {
    window.location.hash = buildProjectDetailTabHash(projectCode, tab);
  };

  const goToProjectList = () => {
    window.location.hash = PROJECTS_HASH;
  };

  if (route.page === 'detail' && activeProject) {
    return (
      <ProjectDetailPage
        project={activeProject}
        activeTab={route.tab}
        onBack={goToProjectList}
      />
    );
  }

  if (route.page === 'tasks') {
    return <TaskManagementPage />;
  }

  return <PersonnelPage onProjectOpen={openProject} />;
}

export default App;
