/**
 * 项目管理页面的主内容编排组件
 * 负责工具栏交互、视图切换、分页、空状态和详情入口
 */

import type { 
  ProjectItem, 
  ProjectFilters, 
  ProjectViewMode, 
  PaginationState,
  ProjectStage 
} from './projectManagement.types';
import ProjectToolbar from './ProjectToolbar';
import ProjectListView from './ProjectListView';
import ProjectGridView from './ProjectGridView';
import ProjectKanbanView from './ProjectKanbanView';
import ProjectPlaceholderView from './ProjectPlaceholderView';

type UserTableProps = {
  viewMode: ProjectViewMode;
  onViewModeChange: (mode: ProjectViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: ProjectFilters;
  onFiltersChange: (filters: Partial<ProjectFilters>) => void;
  projects: ProjectItem[];
  pagination: PaginationState;
  kanbanGroups: Map<ProjectStage, ProjectItem[]>;
  onProjectClick: (project: ProjectItem) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onOpenDetailPage?: () => void;
  onNewProject: () => void;
};

const UserTable = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  projects,
  pagination,
  kanbanGroups,
  onProjectClick,
  onPageChange,
  onPageSizeChange,
  onOpenDetailPage,
  onNewProject
}: UserTableProps) => {
  return (
    <section className="pm-table-section">
      {/* 工具栏 */}
      <ProjectToolbar
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onOpenDetailPage={onOpenDetailPage}
        onNewProject={onNewProject}
      />

      {/* 视图区域 */}
      {viewMode === 'list' && (
        <ProjectListView
          projects={projects}
          pagination={pagination}
          onProjectClick={onProjectClick}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          searchQuery={searchQuery}
        />
      )}

      {viewMode === 'grid' && (
        <ProjectGridView
          projects={projects}
          pagination={pagination}
          onProjectClick={onProjectClick}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          searchQuery={searchQuery}
        />
      )}

      {viewMode === 'kanban' && (
        <ProjectKanbanView
          projects={projects}
          groups={kanbanGroups}
          onProjectClick={onProjectClick}
          searchQuery={searchQuery}
        />
      )}

      {(viewMode === 'calendar' || viewMode === 'map') && (
        <ProjectPlaceholderView
          viewMode={viewMode}
          projects={projects}
          searchQuery={searchQuery}
        />
      )}
    </section>
  );
};

export default UserTable;
