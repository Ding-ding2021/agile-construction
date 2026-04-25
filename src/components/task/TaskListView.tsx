import type { PaginationState, TaskItem, TaskViewMode } from './taskManagement.types';

type TaskListViewProps = {
  tasks: TaskItem[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  searchQuery: string;
  viewMode: TaskViewMode;
};

const TaskListView = ({ tasks, pagination, onPageChange, searchQuery, viewMode }: TaskListViewProps) => {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  if (viewMode !== 'list') {
    return (
      <div className="tm-placeholder-wrap">
        <div className="tm-placeholder-content">{viewMode === 'grid' ? '网格视图开发中' : viewMode === 'kanban' ? '看板视图开发中' : '日历视图开发中'}</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="tm-placeholder-wrap">
        <div className="tm-placeholder-content">{searchQuery ? '未找到匹配任务' : '暂无任务数据'}</div>
      </div>
    );
  }

  return (
    <div className="tm-table-wrap">
      <div className="tm-table-container">
        <table className="tm-table">
          <thead>
            <tr>
              <th style={{ width: '17%' }}>任务名称</th>
              <th style={{ width: '13%' }}>父任务路径</th>
              <th style={{ width: '10%' }}>项目</th>
              <th style={{ width: '7%', textAlign: 'center' }}>状态</th>
              <th style={{ width: '7%', textAlign: 'center' }}>风险等级</th>
              <th style={{ width: '7%', textAlign: 'center' }}>负责人/执行人</th>
              <th style={{ width: '11%', textAlign: 'center' }}>计划时间</th>
              <th style={{ width: '8%', textAlign: 'center' }}>SLA状态</th>
              <th style={{ width: '8%', textAlign: 'center' }}>前置任务状态</th>
              <th style={{ width: '5%', textAlign: 'center' }}>催办次数</th>
              <th style={{ width: '7%', textAlign: 'center' }}>标准绑定</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((item) => (
              <tr key={item.code}>
                <td>
                  <div className="tm-task-cell">
                    <div className="tm-task-name">{item.name}</div>
                    <div className="tm-task-code">{item.code}</div>
                  </div>
                </td>
                <td>
                  <span className="tm-table-text tm-parent-path">{item.parentPath}</span>
                </td>
                <td>
                  <span className="tm-table-text">{item.projectName}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`tm-status-badge ${item.statusTone}`}>{item.status}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`tm-priority-badge ${item.riskTone}`}>{item.riskLevel}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="tm-table-text">{item.owner}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="tm-table-text">{item.plannedStartAt} ~ {item.plannedEndAt}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`tm-sla-status ${item.slaTone}`}>
                    <i className="tm-sla-dot" />
                    {item.slaStatus}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`tm-table-text ${item.predecessorStatus === '前置阻塞' ? 'tm-alert-text' : ''}`}>{item.predecessorStatus}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`tm-remind-badge ${item.remindCount > 2 ? 'high' : ''}`}>{item.remindCount}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`tm-table-text ${item.standardBindingStatus === '未绑定' ? 'tm-alert-text' : ''}`}>{item.standardBindingStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tm-pagination-shell">
        <div className="tm-pagination">
          <div className="tm-pagination-left">
            <div className="tm-page-info">共 {pagination.total} 条记录，当前第 {pagination.currentPage} / {totalPages || 1} 页</div>
            <div className="tm-page-size">每页显示 <button type="button" className="tm-page-size-btn">{pagination.pageSize} 条</button></div>
          </div>

          <div className="tm-page-controls">
            <button
              type="button"
              className={`tm-page-arrow ${pagination.currentPage === 1 ? 'tm-disabled' : ''}`}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              ‹
            </button>

            <div className="tm-page-numbers">
              {Array.from({ length: totalPages || 1 }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`tm-page-num ${pagination.currentPage === page ? 'active' : ''}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`tm-page-arrow ${pagination.currentPage === totalPages || totalPages === 0 ? 'tm-disabled' : ''}`}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === totalPages || totalPages === 0}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListView;
