/**
 * 项目风险卡片组件
 * 展示项目相关风险列表，按风险等级排序
 */

import { EmptyState } from '../shared'
import type { ProjectRisk } from '../../data/projects'

type ProjectRisksCardProps = {
  risks: ProjectRisk[]
  onRiskClick?: (risk: ProjectRisk) => void
}

const riskLevelConfig = {
  critical: { label: '严重', className: 'risk-level-critical', icon: '🔴' },
  high: { label: '高', className: 'risk-level-high', icon: '🟠' },
  medium: { label: '中', className: 'risk-level-medium', icon: '🟡' },
  low: { label: '低', className: 'risk-level-low', icon: '🟢' },
}

const riskStatusConfig = {
  active: { label: '处理中', className: 'risk-status-active' },
  mitigated: { label: '已缓解', className: 'risk-status-mitigated' },
  closed: { label: '已关闭', className: 'risk-status-closed' },
}

const ProjectRisksCard = ({ risks, onRiskClick }: ProjectRisksCardProps) => {
  // 按风险等级排序
  const sortedRisks = [...risks].sort((a, b) => {
    const levelOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return levelOrder[a.level] - levelOrder[b.level]
  })

  if (risks.length === 0) {
    return (
      <div className="card risks-card">
        <div className="card-header">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2>风险列表</h2>
        </div>
        <EmptyState
          icon="✓"
          title="暂无风险预警"
          description="项目运行平稳，无高风险事项"
          compact
        />
      </div>
    )
  }

  // 统计各等级风险数量
  const riskStats = {
    critical: risks.filter(r => r.level === 'critical' && r.status === 'active').length,
    high: risks.filter(r => r.level === 'high' && r.status === 'active').length,
    medium: risks.filter(r => r.level === 'medium' && r.status === 'active').length,
    low: risks.filter(r => r.level === 'low' && r.status === 'active').length,
  }

  return (
    <div className="card risks-card">
      <div className="card-header">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2>风险列表</h2>
        <span className="risks-count">{risks.length}</span>
      </div>

      {/* 风险统计 */}
      <div className="risks-stats">
        {riskStats.critical > 0 && (
          <span className="risk-stat-item critical">
            <span className="risk-stat-icon">🔴</span>
            <span className="risk-stat-value">{riskStats.critical}</span>
            <span className="risk-stat-label">严重</span>
          </span>
        )}
        {riskStats.high > 0 && (
          <span className="risk-stat-item high">
            <span className="risk-stat-icon">🟠</span>
            <span className="risk-stat-value">{riskStats.high}</span>
            <span className="risk-stat-label">高</span>
          </span>
        )}
        {riskStats.medium > 0 && (
          <span className="risk-stat-item medium">
            <span className="risk-stat-icon">🟡</span>
            <span className="risk-stat-value">{riskStats.medium}</span>
            <span className="risk-stat-label">中</span>
          </span>
        )}
        {riskStats.low > 0 && (
          <span className="risk-stat-item low">
            <span className="risk-stat-icon">🟢</span>
            <span className="risk-stat-value">{riskStats.low}</span>
            <span className="risk-stat-label">低</span>
          </span>
        )}
      </div>

      {/* 风险列表 */}
      <div className="risks-list">
        {sortedRisks.map(risk => {
          const levelInfo = riskLevelConfig[risk.level]
          const statusInfo = riskStatusConfig[risk.status]

          return (
            <div
              key={risk.id}
              className={`risk-item ${levelInfo.className}`}
              onClick={() => onRiskClick?.(risk)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onRiskClick?.(risk)
                }
              }}
            >
              <div className="risk-header">
                <span className={`risk-level-badge ${levelInfo.className}`}>
                  <span className="risk-level-icon">{levelInfo.icon}</span>
                  <span className="risk-level-label">{levelInfo.label}</span>
                </span>
                <span className={`risk-status ${statusInfo.className}`}>{statusInfo.label}</span>
              </div>
              <div className="risk-description">{risk.description}</div>
              <div className="risk-impact">
                <span className="risk-impact-label">影响：</span>
                <span className="risk-impact-text">{risk.impact}</span>
              </div>
              <div className="risk-meta">
                <span className="risk-assignee">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {risk.assignee}
                </span>
                {risk.dueDate && (
                  <span className="risk-due-date">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {risk.dueDate}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectRisksCard
