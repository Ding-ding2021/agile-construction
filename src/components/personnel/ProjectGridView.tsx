/**
 * 项目管理页面的网格视图组件
 */

import type { ProjectItem, PaginationState } from './projectManagement.types';

type ProjectGridViewProps = {
  projects: ProjectItem[];
  pagination: PaginationState;
  onProjectClick: (project: ProjectItem) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  searchQuery?: string;
};

const riskLevelMap: Record<string, { label: string; tone: string }> = {
  low: { label: '低', tone: 'green' },
  medium: { label: '中', tone: 'yellow' },
  high: { label: '高', tone: 'orange' },
  critical: { label: '严重', tone: 'red' },
};

const ProjectGridView = ({
  projects,
  pagination,
  onProjectClick,
  onPageChange,
  onPageSizeChange: _onPageSizeChange,
  searchQuery = ''
}: ProjectGridViewProps) => {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  // 空状态
  if (projects.length === 0) {
    return (
      <div className="pm-grid-wrap">
        <div className="pm-empty-state">
          <img src="/assets/CodeBubbyAssets/3848_19/50.svg" alt="" className="pm-empty-icon" />
          {searchQuery ? (
            <>
              <div className="pm-empty-title">未找到匹配项目</div>
              <div className="pm-empty-desc">请尝试使用其他关键词搜索</div>
            </>
          ) : (
            <>
              <div className="pm-empty-title">暂无项目数据</div>
              <div className="pm-empty-desc">点击上方"新建项目"开始创建</div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pm-grid-wrap">
      {/* 网格卡片 */}
      <div className="pm-grid-container">
        {projects.map((item) => (
          <div
            key={item.code}
            className="pm-grid-card"
            onClick={() => onProjectClick(item)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onProjectClick(item);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`查看项目 ${item.name}`}
          >
            {/* 卡片头部 */}
            <div className="pm-grid-card-header">
              <div className="pm-grid-card-title">
                <div className="pm-grid-card-name">{item.name}</div>
                <div className="pm-grid-card-code">{item.code}</div>
              </div>
              <span className={`pm-grid-card-status ${item.statusTone}`}>
                {item.status}
              </span>
            </div>

            {/* 卡片标签 */}
            <div className="pm-grid-card-tags">
              <span className="pm-brand-tag">{item.brand}</span>
              <span className="pm-stage-tag">{item.stage}</span>
            </div>

            {/* 卡片进度 */}
            <div className="pm-grid-card-progress">
              <div className="pm-grid-card-progress-header">
                <span className="pm-grid-card-progress-label">项目进度</span>
                <span className="pm-grid-card-progress-value">{item.progress}%</span>
              </div>
              <div className="pm-line-progress">
                <div 
                  className={`pm-line-progress-fill ${item.statusTone}`} 
                  style={{ width: `${item.progress}%` }} 
                />
              </div>
            </div>

            {/* 卡片统计 */}
            <div className="pm-grid-card-stats">
              <div className="pm-grid-card-stat">
                <img src="/assets/CodeBubbyAssets/3848_19/51.svg" alt="" />
                <span>{item.milestone}</span>
              </div>
              <div className="pm-grid-card-stat">
                <img src="/assets/CodeBubbyAssets/3848_19/52.svg" alt="" />
                <span>{item.tasks}</span>
              </div>
            </div>

            {/* 卡片底部 */}
            <div className="pm-grid-card-footer">
              <div className="pm-grid-card-meta">
                <span className="pm-grid-card-date">{item.plannedOpenDate}</span>
                <span className="pm-grid-card-owner">{item.owner}</span>
              </div>
              
              {item.riskLevel && (
                <div className={`pm-grid-card-risk ${item.riskLevel}`}>
                  <span>{riskLevelMap[item.riskLevel].label}</span>
                  <span className="pm-risk-count">{item.riskCount}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className="pm-pagination-shell">
        <div className="pm-pagination">
          <div className="pm-pagination-left">
            <div className="pm-page-info">
              共 {pagination.total} 条记录，当前第 {pagination.currentPage} / {totalPages || 1} 页
            </div>
            <div className="pm-page-size">
              <span>每页显示</span>
              <button type="button" className="pm-page-size-btn">
                <span>{pagination.pageSize} 条</span>
                <img src="/assets/CodeBubbyAssets/3848_19/34.svg" alt="" />
              </button>
            </div>
          </div>

          <div className="pm-page-controls">
            <button
              type="button"
              className={`pm-page-arrow ${pagination.currentPage === 1 ? 'pm-disabled' : ''}`}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <img src="/assets/CodeBubbyAssets/3848_19/35.svg" alt="" />
            </button>
            
            <div className="pm-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`pm-page-num ${pagination.currentPage === page ? 'active' : ''}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              type="button"
              className={`pm-page-arrow ${pagination.currentPage === totalPages || totalPages === 0 ? 'pm-disabled' : ''}`}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === totalPages || totalPages === 0}
            >
              <img src="/assets/CodeBubbyAssets/3848_19/36.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGridView;
