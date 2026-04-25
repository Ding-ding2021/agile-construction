/**
 * 项目管理页面的列表视图组件
 */

import type { ProjectItem, PaginationState } from './projectManagement.types';

type ProjectListViewProps = {
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

const ProjectListView = ({
  projects,
  pagination,
  onProjectClick,
  onPageChange,
  onPageSizeChange: _onPageSizeChange,
  searchQuery = ''
}: ProjectListViewProps) => {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  // 空状态
  if (projects.length === 0) {
    return (
      <div className="pm-table-wrap">
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
    <div className="pm-table-wrap">
      <div className="pm-table-container">
        <table className="pm-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>项目名称</th>
              <th style={{ width: '8%', textAlign: 'center' }}>品牌</th>
              <th style={{ width: '10%', textAlign: 'center' }}>阶段</th>
              <th style={{ width: '20%' }}>进度</th>
              <th style={{ width: '8%', textAlign: 'center' }}>里程碑</th>
              <th style={{ width: '8%', textAlign: 'center' }}>任务</th>
              <th style={{ width: '10%', textAlign: 'center' }}>风险</th>
              <th style={{ width: '10%', textAlign: 'center' }}>计划开业</th>
              <th style={{ width: '6%', textAlign: 'center' }}>负责人</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((item) => (
              <tr
                key={item.code}
                onClick={() => onProjectClick(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onProjectClick(item);
                  }
                }}
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div className="pm-project-cell">
                    <div className="pm-project-name">{item.name}</div>
                    <div className="pm-project-code">{item.code}</div>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="pm-brand-tag">{item.brand}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="pm-stage-tag">{item.stage}</span>
                </td>
                <td>
                  <div className="pm-progress-cell">
                    <span className={`pm-status-badge ${item.statusTone}`}>{item.status}</span>
                    <div className="pm-line-progress">
                      <div className={`pm-line-progress-fill ${item.statusTone}`} style={{ width: `${item.progress}%` }} />
                    </div>
                    <span className="pm-progress-value">{item.progress}%</span>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}><span className="pm-table-text">{item.milestone}</span></td>
                <td style={{ textAlign: 'center' }}><span className="pm-table-text">{item.tasks}</span></td>
                <td style={{ textAlign: 'center' }}>
                  {item.riskLevel ? (
                    <div className="pm-risk-cell">
                      <span className={`pm-risk-badge ${item.riskLevel}`}>
                        {riskLevelMap[item.riskLevel].label}
                      </span>
                      <span className="pm-risk-count">{item.riskCount}</span>
                    </div>
                  ) : (
                    <span className="pm-table-text">-</span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="pm-table-text">{item.plannedOpenDate}</span>
                </td>
                <td style={{ textAlign: 'center' }}><span className="pm-table-text">{item.owner}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default ProjectListView;
