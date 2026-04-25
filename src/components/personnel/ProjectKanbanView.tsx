/**
 * 项目管理页面的看板视图组件
 */

import type { ProjectItem, ProjectStage } from './projectManagement.types';

type ProjectKanbanViewProps = {
  projects: ProjectItem[];
  groups: Map<string, ProjectItem[]>;
  onProjectClick: (project: ProjectItem) => void;
  searchQuery?: string;
};

const stageColors: Record<ProjectStage, string> = {
  '启动': 'blue',
  '准备': 'yellow',
  '执行': 'green',
  '收尾': 'purple'
};

const riskLevelMap: Record<string, { label: string; tone: string }> = {
  low: { label: '低', tone: 'green' },
  medium: { label: '中', tone: 'yellow' },
  high: { label: '高', tone: 'orange' },
  critical: { label: '严重', tone: 'red' },
};

const ProjectKanbanView = ({
  projects,
  groups,
  onProjectClick,
  searchQuery = ''
}: ProjectKanbanViewProps) => {
  // 空状态
  if (projects.length === 0) {
    return (
      <div className="pm-kanban-wrap">
        <EmptyState
          iconSrc="/assets/CodeBuddyAssets/3848_19/50.svg"
          title={searchQuery ? '未找到匹配项目' : '暂无项目数据'}
          description={searchQuery ? '请尝试使用其他关键词搜索' : '点击上方"新建项目"开始创建'}
        />
      </div>
    );
  }

  return (
    <div className="pm-kanban-wrap">
      <div className="pm-kanban-container">
        {Array.from(groups.entries()).map(([stage, stageProjects]) => (
          <div key={stage} className="pm-kanban-column">
            {/* 列标题 */}
            <div className={`pm-kanban-column-header pm-kanban-header-${stageColors[stage as ProjectStage]}`}>
              <div className="pm-kanban-column-title">
                <span>{stage}</span>
                <em>{stageProjects.length}</em>
              </div>
            </div>

            {/* 列卡片 */}
            <div className="pm-kanban-column-body">
              {stageProjects.length === 0 ? (
                <div className="pm-kanban-empty">暂无项目</div>
              ) : (
                stageProjects.map((item) => (
                  <div
                    key={item.code}
                    className="pm-kanban-card"
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
                    <div className="pm-kanban-card-header">
                      <div className="pm-kanban-card-name">{item.name}</div>
                      <span className={`pm-kanban-card-status ${item.statusTone}`}>
                        {item.status}
                      </span>
                    </div>

                    {/* 项目编号和品牌 */}
                    <div className="pm-kanban-card-meta">
                      <span className="pm-kanban-card-code">{item.code}</span>
                      <span className="pm-brand-tag">{item.brand}</span>
                    </div>

                    {/* 进度 */}
                    <div className="pm-kanban-card-progress">
                      <div className="pm-kanban-card-progress-header">
                        <span>进度</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="pm-line-progress">
                        <div 
                          className={`pm-line-progress-fill ${item.statusTone}`} 
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="pm-kanban-card-stats">
                      <div className="pm-kanban-card-stat">
                        <img src="/assets/CodeBubbyAssets/3848_19/51.svg" alt="" />
                        <span>{item.milestone}</span>
                      </div>
                      <div className="pm-kanban-card-stat">
                        <img src="/assets/CodeBubbyAssets/3848_19/52.svg" alt="" />
                        <span>{item.tasks}</span>
                      </div>
                    </div>

                    {/* 底部 */}
                    <div className="pm-kanban-card-footer">
                      <span className="pm-kanban-card-owner">{item.owner}</span>
                      {item.riskLevel && (
                        <span className={`pm-kanban-card-risk ${item.riskLevel}`}>
                          {riskLevelMap[item.riskLevel].label}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectKanbanView;
