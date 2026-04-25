/**
 * 项目管理页面的工具栏组件
 */

import { useState, useRef, useEffect } from 'react';
import type { ProjectViewMode, ProjectFilters } from './projectManagement.types';
import { groupOptions, sortOptions, stageOptions, statusOptions } from './projectManagement.data';

type ProjectToolbarProps = {
  viewMode: ProjectViewMode;
  onViewModeChange: (mode: ProjectViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: ProjectFilters;
  onFiltersChange: (filters: Partial<ProjectFilters>) => void;
  onOpenDetailPage?: () => void;
  onNewProject: () => void;
};

const viewModes: Array<{ mode: ProjectViewMode; label: string; icon: string }> = [
  { mode: 'list', label: '列表', icon: '10.svg' },
  { mode: 'grid', label: '网格', icon: '9.svg' },
  { mode: 'kanban', label: '看板', icon: '11.svg' },
  { mode: 'calendar', label: '日历', icon: '12.svg' },
  { mode: 'map', label: '地图', icon: '13.svg' }
];

const ProjectToolbar = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onOpenDetailPage: _onOpenDetailPage,
  onNewProject
}: ProjectToolbarProps) => {
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const groupRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
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
    <div className="pm-table-toolbar">
      {/* 视图切换 */}
      <div className="pm-view-toggle">
        {viewModes.map((view) => (
          <button
            key={view.mode}
            type="button"
            className={`pm-view-btn ${viewMode === view.mode ? 'active' : ''}`}
            onClick={() => onViewModeChange(view.mode)}
          >
            <img src={`/assets/CodeBubbyAssets/3848_19/${view.icon}`} alt="" />
            <span>{view.label}</span>
          </button>
        ))}
      </div>

      {/* 右侧工具栏 */}
      <div className="pm-toolbar-right">
        {/* 搜索框 */}
        <div className="pm-search-input-wrap">
          <img src="/assets/CodeBubbyAssets/3848_19/41.svg" alt="" />
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* 分组按钮 */}
        <div ref={groupRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className={`pm-filter-btn ${filters.groupBy !== 'none' ? 'active' : ''}`}
            onClick={() => setShowGroupMenu(!showGroupMenu)}
          >
            <img src="/assets/CodeBubbyAssets/3848_19/17.svg" alt="" />
            <span>分组</span>
            <img src="/assets/CodeBubbyAssets/3848_19/18.svg" alt="" />
          </button>
          
          {showGroupMenu && (
            <div className="pm-dropdown-menu">
              {groupOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`pm-dropdown-item ${filters.groupBy === option.value ? 'active' : ''}`}
                  onClick={() => {
                    onFiltersChange({ groupBy: option.value as ProjectFilters['groupBy'] });
                    setShowGroupMenu(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 筛选按钮 */}
        <div ref={filterRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className={`pm-filter-btn ${(filters.stage || filters.status || filters.riskOnly) ? 'active' : ''}`}
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <img src="/assets/CodeBubbyAssets/3848_19/14.svg" alt="" />
            <span>筛选</span>
          </button>
          
          {showFilterMenu && (
            <div className="pm-dropdown-menu pm-filter-dropdown">
              <div className="pm-filter-section">
                <div className="pm-filter-section-title">项目阶段</div>
                {stageOptions.map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    className={`pm-dropdown-item ${filters.stage === stage ? 'active' : ''}`}
                    onClick={() => {
                      onFiltersChange({ 
                        stage: filters.stage === stage ? undefined : stage 
                      });
                    }}
                  >
                    {stage}
                  </button>
                ))}
              </div>
              
              <div className="pm-filter-section">
                <div className="pm-filter-section-title">项目状态</div>
                {statusOptions.slice(0, 5).map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`pm-dropdown-item ${filters.status === status ? 'active' : ''}`}
                    onClick={() => {
                      onFiltersChange({ 
                        status: filters.status === status ? undefined : status 
                      });
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
              
              <div className="pm-filter-section">
                <button
                  type="button"
                  className={`pm-dropdown-item ${filters.riskOnly ? 'active' : ''}`}
                  onClick={() => {
                    onFiltersChange({ riskOnly: !filters.riskOnly });
                  }}
                >
                  仅显示风险项目
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 排序按钮 */}
        <div ref={sortRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className={`pm-filter-btn ${filters.sortBy !== 'default' ? 'active' : ''}`}
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            <img src="/assets/CodeBubbyAssets/3848_19/19.svg" alt="" />
            <span>排序</span>
            <img src="/assets/CodeBubbyAssets/3848_19/18.svg" alt="" />
          </button>
          
          {showSortMenu && (
            <div className="pm-dropdown-menu">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`pm-dropdown-item ${filters.sortBy === option.value ? 'active' : ''}`}
                  onClick={() => {
                    onFiltersChange({ sortBy: option.value as ProjectFilters['sortBy'] });
                    setShowSortMenu(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 新建项目按钮 */}
        <button
          type="button"
          className="pm-add-user-btn"
          onClick={onNewProject}
        >
          <img src="/assets/CodeBubbyAssets/3848_19/15.svg" alt="" />
          <span>新建项目</span>
        </button>

        {/* 更多筛选按钮 */}
        <button type="button" className="pm-toolbar-icon-btn" aria-label="更多筛选">
          <img src="/assets/CodeBubbyAssets/3848_19/21.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default ProjectToolbar;
