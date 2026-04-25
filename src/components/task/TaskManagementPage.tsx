import { useCallback, useMemo, useState } from 'react';
import TaskHeader from './TaskHeader';
import TaskListView from './TaskListView';
import TaskSidebar from './TaskSidebar';
import TaskStatsCards from './TaskStatsCards';
import TaskToolbar from './TaskToolbar';
import { mockTasks } from './taskManagement.data';
import { calculateTaskStats, processTasks, shouldResetPage } from './taskManagement.selectors';
import type { TaskFilters, TaskViewMode } from './taskManagement.types';

const TaskManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({
    statKey: 'all',
    searchQuery: '',
    groupBy: 'none',
    sortBy: 'default',
  });
  const [viewMode, setViewMode] = useState<TaskViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  const stats = useMemo(() => calculateTaskStats(mockTasks), []);

  const { data: processedTasks, pagination } = useMemo(
    () => processTasks(mockTasks, filters, { currentPage, pageSize }),
    [filters, currentPage, pageSize],
  );

  const updateFilters = useCallback(
    (newFilters: Partial<TaskFilters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...newFilters };
        if (shouldResetPage(prev, next, pageSize, pageSize)) {
          setCurrentPage(1);
        }
        return next;
      });
    },
    [pageSize],
  );

  const updateSearchQuery = useCallback(
    (query: string) => {
      setSearchQuery(query);
      updateFilters({ searchQuery: query });
    },
    [updateFilters],
  );

  return (
    <div className="tm-app">
      <div className="tm-glow tm-glow-left" />
      <div className="tm-glow tm-glow-right" />

      <TaskSidebar />

      <div className="tm-workspace">
        <main className="tm-main">
          <TaskHeader searchQuery={searchQuery} onSearchChange={updateSearchQuery} />
          <div className="tm-body">
            <TaskStatsCards
              stats={stats}
              activeStatKey={filters.statKey}
              onStatCardClick={(statKey) => {
                updateFilters({ statKey });
                setCurrentPage(1);
              }}
            />

            <section className="tm-table-section">
              <TaskToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                searchQuery={searchQuery}
                onSearchChange={updateSearchQuery}
                filters={filters}
                onFiltersChange={updateFilters}
              />

              <TaskListView
                tasks={processedTasks}
                pagination={pagination}
                onPageChange={setCurrentPage}
                searchQuery={searchQuery}
                viewMode={viewMode}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskManagementPage;
