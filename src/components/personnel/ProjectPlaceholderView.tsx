/**
 * 项目管理页面的占位视图组件
 * 用于日历和地图视图，提供简化的业务概览或占位说明
 */

import type { ProjectItem, ProjectViewMode } from './projectManagement.types';

type ProjectPlaceholderViewProps = {
  viewMode: 'calendar' | 'map';
  projects: ProjectItem[];
  searchQuery?: string;
};

const ProjectPlaceholderView = ({ viewMode, projects, searchQuery = '' }: ProjectPlaceholderViewProps) => {
  const viewNames: Record<ProjectViewMode, string> = {
    list: '列表视图',
    grid: '网格视图',
    kanban: '看板视图',
    calendar: '日历视图',
    map: '地图视图'
  };

  const viewDescriptions: Record<ProjectViewMode, string> = {
    list: '以表格形式展示项目详情',
    grid: '以卡片形式展示项目概览',
    kanban: '按项目阶段分列展示',
    calendar: '按时间轴展示项目里程碑和开业计划',
    map: '按地理位置展示项目分布'
  };

  // 空状态
  if (projects.length === 0) {
    return (
      <div className="pm-placeholder-wrap">
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
    <div className="pm-placeholder-wrap">
      <div className="pm-placeholder-content">
        {/* 占位图标 */}
        <div className="pm-placeholder-icon">
          <img 
            src={`/assets/CodeBubbyAssets/3848_19/${viewMode === 'calendar' ? '12.svg' : '13.svg'}`} 
            alt="" 
          />
        </div>

        {/* 标题和描述 */}
        <div className="pm-placeholder-title">{viewNames[viewMode]}</div>
        <div className="pm-placeholder-desc">{viewDescriptions[viewMode]}</div>

        {/* 功能说明 */}
        <div className="pm-placeholder-features">
          <div className="pm-placeholder-feature">
            <img src="/assets/CodeBubbyAssets/3848_19/53.svg" alt="" />
            <span>功能开发中</span>
          </div>
          <div className="pm-placeholder-feature">
            <img src="/assets/CodeBubbyAssets/3848_19/54.svg" alt="" />
            <span>即将上线</span>
          </div>
        </div>

        {/* 统计概览 */}
        {viewMode === 'calendar' && (
          <div className="pm-placeholder-stats">
            <div className="pm-placeholder-stat">
              <div className="pm-placeholder-stat-value">{projects.length}</div>
              <div className="pm-placeholder-stat-label">项目总数</div>
            </div>
            <div className="pm-placeholder-stat">
              <div className="pm-placeholder-stat-value">
                {projects.filter(p => p.plannedOpenDate).length}
              </div>
              <div className="pm-placeholder-stat-label">已排期项目</div>
            </div>
            <div className="pm-placeholder-stat">
              <div className="pm-placeholder-stat-value">
                {new Set(projects.map(p => p.plannedOpenDate.split('-')[1])).size}
              </div>
              <div className="pm-placeholder-stat-label">涉及月份</div>
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div className="pm-placeholder-stats">
            <div className="pm-placeholder-stat">
              <div className="pm-placeholder-stat-value">{projects.length}</div>
              <div className="pm-placeholder-stat-label">项目总数</div>
            </div>
            <div className="pm-placeholder-stat">
              <div className="pm-placeholder-stat-value">
                {new Set(projects.map(p => p.brand)).size}
              </div>
              <div className="pm-placeholder-stat-label">品牌数量</div>
            </div>
            <div className="pm-placeholder-stat">
              <div className="pm-placeholder-stat-value">
                {new Set(projects.map(p => p.owner)).size}
              </div>
              <div className="pm-placeholder-stat-label">负责人数</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPlaceholderView;
