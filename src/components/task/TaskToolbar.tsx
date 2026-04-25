import { useEffect, useRef, useState } from 'react';
import type { TaskFilters, TaskViewMode } from './taskManagement.types';
import { groupOptions, sortOptions, statusOptions, riskOptions, slaOptions } from './taskManagement.data';

type TaskToolbarProps = {
  viewMode: TaskViewMode;
  onViewModeChange: (mode: TaskViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: TaskFilters;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
};

const viewModes: Array<{ mode: TaskViewMode; label: string; icon: string }> = [
  { mode: 'grid', label: '网格', icon: '9.svg' },
  { mode: 'list', label: '列表', icon: '10.svg' },
  { mode: 'kanban', label: '看板', icon: '11.svg' },
  { mode: 'calendar', label: '日历', icon: '12.svg' },
];

const TaskToolbar = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: TaskToolbarProps) => {
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const groupRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
        setShowGroupMenu(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="tm-table-toolbar">
      <div className="tm-view-toggle">
        {viewModes.map((view) => (
          <button
            key={view.mode}
            type="button"
            className={`tm-view-btn ${viewMode === view.mode ? 'active' : ''}`}
            onClick={() => onViewModeChange(view.mode)}
          >
            <img src={`/assets/CodeBubbyAssets/3947_2/${view.icon}`} alt="" />
            <span>{view.label}</span>
          </button>
        ))}
      </div>

      <div className="tm-toolbar-right">
        <div className="tm-search-input-wrap">
          <img src="/assets/CodeBubbyAssets/3947_2/15.svg" alt="" />
          <input
            type="text"
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div ref={groupRef} className="tm-toolbar-menu-wrap">
          <button type="button" className="tm-filter-btn" onClick={() => setShowGroupMenu((v) => !v)}>
            <img src="/assets/CodeBubbyAssets/3947_2/16.svg" alt="" />
            <span>分组</span>
            <img src="/assets/CodeBubbyAssets/3947_2/17.svg" alt="" />
          </button>
          {showGroupMenu && (
            <div className="tm-dropdown-menu">
              {groupOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`tm-dropdown-item ${filters.groupBy === option.value ? 'active' : ''}`}
                  onClick={() => {
                    onFiltersChange({ groupBy: option.value as TaskFilters['groupBy'] });
                    setShowGroupMenu(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={filterRef} className="tm-toolbar-menu-wrap">
          <button type="button" className="tm-filter-btn" onClick={() => setShowFilterMenu((v) => !v)}>
            <img src="/assets/CodeBubbyAssets/3947_2/13.svg" alt="" />
            <span>筛选</span>
          </button>
          {showFilterMenu && (
            <div className="tm-dropdown-menu tm-filter-dropdown">
              <div className="tm-filter-section-title">状态</div>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`tm-dropdown-item ${filters.status === status ? 'active' : ''}`}
                  onClick={() => onFiltersChange({ status: filters.status === status ? undefined : status })}
                >
                  {status}
                </button>
              ))}

              <div className="tm-filter-section-title">风险等级</div>
              {riskOptions.map((risk) => (
                <button
                  key={risk}
                  type="button"
                  className={`tm-dropdown-item ${filters.riskLevel === risk ? 'active' : ''}`}
                  onClick={() => onFiltersChange({ riskLevel: filters.riskLevel === risk ? undefined : risk })}
                >
                  {risk}
                </button>
              ))}

              <div className="tm-filter-section-title">SLA状态</div>
              {slaOptions.map((slaStatus) => (
                <button
                  key={slaStatus}
                  type="button"
                  className={`tm-dropdown-item ${filters.slaStatus === slaStatus ? 'active' : ''}`}
                  onClick={() => onFiltersChange({ slaStatus: filters.slaStatus === slaStatus ? undefined : slaStatus })}
                >
                  {slaStatus}
                </button>
              ))}

              <div className="tm-filter-section-title">阻塞</div>
              <button
                type="button"
                className={`tm-dropdown-item ${filters.blockedOnly ? 'active' : ''}`}
                onClick={() => onFiltersChange({ blockedOnly: !filters.blockedOnly || undefined })}
              >
                仅看阻塞任务
              </button>
            </div>
          )}
        </div>

        <div ref={sortRef} className="tm-toolbar-menu-wrap">
          <button type="button" className="tm-filter-btn" onClick={() => setShowSortMenu((v) => !v)}>
            <img src="/assets/CodeBubbyAssets/3947_2/18.svg" alt="" />
            <span>排序</span>
            <img src="/assets/CodeBubbyAssets/3947_2/19.svg" alt="" />
          </button>
          {showSortMenu && (
            <div className="tm-dropdown-menu">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`tm-dropdown-item ${filters.sortBy === option.value ? 'active' : ''}`}
                  onClick={() => {
                    onFiltersChange({ sortBy: option.value as TaskFilters['sortBy'] });
                    setShowSortMenu(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" className="tm-add-task-btn">
          <img src="/assets/CodeBubbyAssets/3947_2/14.svg" alt="" />
          <span>新建任务</span>
        </button>

        <button type="button" className="tm-toolbar-icon-btn" aria-label="更多">
          <img src="/assets/CodeBubbyAssets/3947_2/20.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default TaskToolbar;
