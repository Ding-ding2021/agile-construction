import { useState, useMemo, useCallback } from 'react';
import PersonnelSidebar from './Sidebar';
import PersonnelHeader from './Header';
import StatsCards from './StatsCards';
import UserTable from './UserTable';
import InsightsPanel from './InsightsPanel';
import ProjectDetailDrawer from './ProjectDetailDrawer';
import { 
  calculateProjectStats, 
  processProjects, 
  shouldResetPage,
  kanbanGroupByStage 
} from './projectManagement.selectors';
import { mockProjects } from './projectManagement.data';
import type { 
  ProjectItem, 
  ProjectFilters, 
  ProjectViewMode, 
  ProjectStats 
} from './projectManagement.types';

type PersonnelPageProps = {
  onProjectOpen: (projectCode: string) => void;
};

const PersonnelPage = ({ onProjectOpen }: PersonnelPageProps) => {
  // 状态管理
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({
    statKey: 'all',
    searchQuery: '',
    groupBy: 'none',
    sortBy: 'default',
    riskOnly: false
  });
  const [viewMode, setViewMode] = useState<ProjectViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);

  // 计算统计数据
  const stats: ProjectStats = useMemo(
    () => calculateProjectStats(mockProjects),
    []
  );

  // 处理项目数据
  const { data: processedProjects, pagination } = useMemo(
    () => processProjects(mockProjects, filters, { currentPage, pageSize }),
    [filters, currentPage, pageSize]
  );

  // 看板分组数据
  const kanbanGroups = useMemo(
    () => kanbanGroupByStage(processedProjects),
    [processedProjects]
  );

  // 更新筛选条件
  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>) => {
    setFilters(prev => {
      const next = { ...prev, ...newFilters };
      
      // 如果搜索、筛选、排序变化，重置页码
      if (shouldResetPage(prev, next, pageSize, pageSize)) {
        setCurrentPage(1);
      }
      
      return next;
    });
  }, [pageSize]);

  // 更新搜索查询（同步 Header 和 Toolbar）
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    updateFilters({ searchQuery: query });
  }, [updateFilters]);

  // 点击统计卡片
  const handleStatCardClick = useCallback((statKey: ProjectFilters['statKey']) => {
    updateFilters({ statKey });
    setCurrentPage(1);
  }, [updateFilters]);

  // 点击项目
  const handleProjectClick = useCallback((project: ProjectItem) => {
    onProjectOpen(project.code);
  }, [onProjectOpen]);

  const handleOpenDetailPage = useCallback(() => {
    const firstProject = processedProjects[0];
    if (!firstProject) {
      return;
    }

    onProjectOpen(firstProject.code);
  }, [onProjectOpen, processedProjects]);

  // 新建项目
  const handleNewProject = useCallback(() => {
    setSelectedProject(null);
    setIsNewProject(true);
    setIsDrawerOpen(true);
  }, []);

  // 关闭抽屉
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
      setIsNewProject(false);
    }, 300);
  }, []);

  // 分页处理
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return (
    <div className="pm-app">
      <div className="pm-glow pm-glow-left" />
      <div className="pm-glow pm-glow-right" />
      <PersonnelSidebar />
      <div className="pm-workspace">
        <main className="pm-main">
          <PersonnelHeader 
            searchQuery={searchQuery}
            onSearchChange={updateSearchQuery}
            isInsightsOpen={isInsightsOpen}
            onInsightsToggle={() => setIsInsightsOpen((prev) => !prev)}
          />
          <div className="pm-body">
            <StatsCards 
              stats={stats}
              activeStatKey={filters.statKey}
              onStatCardClick={handleStatCardClick}
            />
            <UserTable
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={updateSearchQuery}
              filters={filters}
              onFiltersChange={updateFilters}
              projects={processedProjects}
              pagination={pagination}
              kanbanGroups={kanbanGroups}
              onProjectClick={handleProjectClick}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onOpenDetailPage={processedProjects.length > 0 ? handleOpenDetailPage : undefined}
              onNewProject={handleNewProject}
            />
          </div>
        </main>
        <InsightsPanel isOpen={isInsightsOpen} onClose={() => setIsInsightsOpen(false)} />
      </div>

      {/* 项目详情抽屉 */}
      <ProjectDetailDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isNewProject={isNewProject}
      />
    </div>
  );
};

export default PersonnelPage;
