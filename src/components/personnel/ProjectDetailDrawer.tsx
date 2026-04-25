/**
 * 项目管理页面的详情抽屉组件
 */

import { useEffect } from 'react';
import { EmptyState } from '../shared';
import type { ProjectItem, ProjectDetail } from './projectManagement.types';

type ProjectDetailDrawerProps = {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  isNewProject?: boolean;
};

const riskLevelMap: Record<string, { label: string; tone: string }> = {
  low: { label: '低', tone: 'green' },
  medium: { label: '中', tone: 'yellow' },
  high: { label: '高', tone: 'orange' },
  critical: { label: '严重', tone: 'red' },
};

// 模拟详情数据生成
const generateProjectDetail = (project: ProjectItem): ProjectDetail => {
  return {
    project,
    milestones: [
      { name: '项目启动', status: 'completed', dueDate: '2024-01-15' },
      { name: '方案评审', status: 'completed', dueDate: '2024-02-20' },
      { name: '施工准备', status: 'in-progress', dueDate: '2024-03-10' },
      { name: '主体施工', status: 'pending', dueDate: '2024-05-30' },
      { name: '验收交付', status: 'pending', dueDate: project.plannedOpenDate }
    ],
    tasks: [
      { name: '完成设计图纸审核', assignee: '张三', status: 'completed' },
      { name: '协调施工资源', assignee: '李四', status: 'in-progress' },
      { name: '设备采购确认', assignee: '王五', status: 'in-progress' },
      { name: '安全隐患排查', assignee: '赵六', status: 'pending' }
    ],
    risks: project.riskLevel ? [
      {
        level: project.riskLevel,
        description: '施工进度滞后，需要增加人力投入',
        impact: '可能影响开业时间'
      }
    ] : []
  };
};

const ProjectDetailDrawer = ({ 
  project, 
  isOpen, 
  onClose, 
  isNewProject = false 
}: ProjectDetailDrawerProps) => {
  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const detail = project ? generateProjectDetail(project) : null;

  return (
    <>
      {/* 遮罩层 */}
      <div className="pm-drawer-overlay" onClick={onClose} />

      {/* 抽屉主体 */}
      <div className="pm-drawer">
        {/* 头部 */}
        <div className="pm-drawer-header">
          <div className="pm-drawer-title">
            {isNewProject ? '新建项目' : (project?.name || '项目详情')}
          </div>
          <button
            type="button"
            className="pm-drawer-close"
            onClick={onClose}
            aria-label="关闭"
          >
            <img src="/assets/CodeBuddyAssets/3848_19/58.svg" alt="" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="pm-drawer-body">
          {isNewProject ? (
            // 新建项目表单
            <div className="pm-drawer-form">
              <div className="pm-form-group">
                <label>项目名称 *</label>
                <input type="text" placeholder="请输入项目名称" />
              </div>
              <div className="pm-form-group">
                <label>项目编号 *</label>
                <input type="text" placeholder="自动生成或手动输入" />
              </div>
              <div className="pm-form-row">
                <div className="pm-form-group">
                  <label>品牌 *</label>
                  <select>
                    <option>请选择品牌</option>
                    <option>万象城</option>
                    <option>SKP</option>
                    <option>K11</option>
                    <option>太古里</option>
                  </select>
                </div>
                <div className="pm-form-group">
                  <label>项目阶段</label>
                  <select>
                    <option>启动</option>
                    <option>准备</option>
                    <option>执行</option>
                    <option>收尾</option>
                  </select>
                </div>
              </div>
              <div className="pm-form-row">
                <div className="pm-form-group">
                  <label>计划开业日期</label>
                  <input type="date" />
                </div>
                <div className="pm-form-group">
                  <label>负责人</label>
                  <select>
                    <option>请选择负责人</option>
                    <option>张三</option>
                    <option>李四</option>
                    <option>王五</option>
                  </select>
                </div>
              </div>
              <div className="pm-form-group">
                <label>备注</label>
                <textarea placeholder="请输入项目备注信息" rows={3} />
              </div>
            </div>
          ) : detail ? (
            // 项目详情
            <>
              {/* 基本信息 */}
              <div className="pm-detail-section">
                <div className="pm-detail-section-title">基本信息</div>
                <div className="pm-detail-grid">
                  <div className="pm-detail-item">
                    <span className="pm-detail-label">项目编号</span>
                    <span className="pm-detail-value">{detail.project.code}</span>
                  </div>
                  <div className="pm-detail-item">
                    <span className="pm-detail-label">品牌</span>
                    <span className="pm-detail-value">{detail.project.brand}</span>
                  </div>
                  <div className="pm-detail-item">
                    <span className="pm-detail-label">项目阶段</span>
                    <span className="pm-detail-value">
                      <span className="pm-stage-tag">{detail.project.stage}</span>
                    </span>
                  </div>
                  <div className="pm-detail-item">
                    <span className="pm-detail-label">项目状态</span>
                    <span className="pm-detail-value">
                      <span className={`pm-status-badge ${detail.project.statusTone}`}>
                        {detail.project.status}
                      </span>
                    </span>
                  </div>
                  <div className="pm-detail-item">
                    <span className="pm-detail-label">负责人</span>
                    <span className="pm-detail-value">{detail.project.owner}</span>
                  </div>
                  <div className="pm-detail-item">
                    <span className="pm-detail-label">计划开业</span>
                    <span className="pm-detail-value">{detail.project.plannedOpenDate}</span>
                  </div>
                </div>

                {/* 进度 */}
                <div className="pm-detail-progress">
                  <div className="pm-detail-progress-header">
                    <span>项目进度</span>
                    <span>{detail.project.progress}%</span>
                  </div>
                  <div className="pm-line-progress">
                    <div 
                      className={`pm-line-progress-fill ${detail.project.statusTone}`} 
                      style={{ width: `${detail.project.progress}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* 里程碑 */}
              <div className="pm-detail-section">
                <div className="pm-detail-section-title">里程碑</div>
                <div className="pm-milestone-list">
                  {detail.milestones.map((milestone, index) => (
                    <div key={index} className="pm-milestone-item">
                      <div className={`pm-milestone-dot ${milestone.status}`} />
                      <div className="pm-milestone-content">
                        <div className="pm-milestone-name">{milestone.name}</div>
                        <div className="pm-milestone-date">{milestone.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 任务 */}
              <div className="pm-detail-section">
                <div className="pm-detail-section-title">任务概览</div>
                <div className="pm-task-list">
                  {detail.tasks.map((task, index) => (
                    <div key={index} className="pm-task-item">
                      <div className="pm-task-info">
                        <span className="pm-task-name">{task.name}</span>
                        <span className="pm-task-assignee">{task.assignee}</span>
                      </div>
                      <span className={`pm-task-status ${task.status}`}>
                        {task.status === 'completed' ? '已完成' : task.status === 'in-progress' ? '进行中' : '待处理'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 风险 */}
              {detail.risks.length > 0 && (
                <div className="pm-detail-section">
                  <div className="pm-detail-section-title">风险提示</div>
                  <div className="pm-risk-list">
                    {detail.risks.map((risk, index) => (
                      <div key={index} className={`pm-risk-item ${risk.level}`}>
                        <div className="pm-risk-header">
                          <span className={`pm-risk-badge ${risk.level}`}>
                            {riskLevelMap[risk.level].label}
                          </span>
                        </div>
                        <div className="pm-risk-description">{risk.description}</div>
                        <div className="pm-risk-impact">影响：{risk.impact}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              iconSrc="/assets/CodeBuddyAssets/3848_19/50.svg"
              title="未选择项目"
              description="请从列表中选择一个项目查看详情"
            />
          )}
        </div>

        {/* 底部按钮 */}
        <div className="pm-drawer-footer">
          {isNewProject ? (
            <>
              <button type="button" className="pm-btn-secondary" onClick={onClose}>
                取消
              </button>
              <button type="button" className="pm-btn-primary">
                创建项目
              </button>
            </>
          ) : (
            <>
              <button type="button" className="pm-btn-secondary" onClick={onClose}>
                关闭
              </button>
              <button type="button" className="pm-btn-primary">
                编辑项目
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectDetailDrawer;
