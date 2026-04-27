import { useCallback } from 'react'
import type { ProjectItem } from '../../data/projects'
import './ProjectCard.css'

export interface ProjectCardProps {
  project: ProjectItem
  variant: 'grid' | 'kanban' | 'compact'
  onClick?: (project: ProjectItem) => void
  className?: string
}

function ProjectCard({ project, variant, onClick, className = '' }: ProjectCardProps) {
  const clickable = typeof onClick === 'function'
  const handleClick = useCallback(() => onClick?.(project), [onClick, project])
  const tone = project.statusTone ?? 'blue'

  if (variant === 'grid') {
    return (
      <div
        className={`pm-project-card pm-project-card-grid ${className}`.trim()}
        onClick={clickable ? handleClick : undefined}
        style={clickable ? { cursor: 'pointer' } : undefined}
        aria-label={`Project ${project.name}`}
      >
        <div className="pm-grid-cell">
          <span className="pm-grid-label">名称</span>
          <span className="pm-grid-value">{project.name}</span>
        </div>
        <div className="pm-grid-cell">
          <span className="pm-grid-label">编码</span>
          <span className="pm-grid-value">{project.code}</span>
        </div>
        <div className="pm-grid-cell">
          <span className="pm-grid-label">品牌</span>
          <span className="pm-grid-value">{project.brand}</span>
        </div>
        <div className="pm-grid-cell">
          <span className="pm-grid-label">状态</span>
          <span className={`pm-status-pill pm-tone-${tone}`}>{project.status}</span>
        </div>
        <div className="pm-grid-cell">
          <span className="pm-grid-label">进度</span>
          <div
            className="pm-progress-shell"
            role="progressbar"
            style={{ '--progress': `${project.progress ?? 0}%` } as React.CSSProperties}
          >
            <div className="pm-progress-bar" />
          </div>
        </div>
        <div className="pm-grid-cell">
          <span className="pm-grid-label">阶段</span>
          <span className="pm-grid-value">{project.stage}</span>
        </div>
        <div className="pm-grid-cell">
          <span className="pm-grid-label">负责人</span>
          <span className="pm-grid-value">{project.owner}</span>
        </div>
        <div className="pm-grid-cell">
          <span className="pm-grid-label">起始</span>
          <span className="pm-grid-value">{project.plannedOpenDate}</span>
        </div>
        <div className="pm-grid-cell">
          <span className="pm-grid-label">起止日期</span>
          <span className="pm-grid-value">{project.dateRange ?? project.plannedOpenDate}</span>
        </div>
        <div className="pm-grid-cell-actions">
          <button type="button" className="pm-btn pm-btn-ghost" onClick={handleClick}>
            打开
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'kanban') {
    return (
      <div
        className={`pm-project-card pm-project-card-kanban ${className}`.trim()}
        onClick={clickable ? handleClick : undefined}
        style={clickable ? { cursor: 'pointer' } : undefined}
        aria-label={`Project ${project.name} kanban`}
      >
        <div className="pm-kanban-row">
          <span className="pm-kanban-label">名称</span>
          <span className="pm-kanban-value">{project.name}</span>
        </div>
        <div className="pm-kanban-row">
          <span className="pm-kanban-label">编码</span>
          <span className="pm-kanban-value">{project.code}</span>
        </div>
        <div className="pm-kanban-row">
          <span className="pm-kanban-label">状态</span>
          <span className={`pm-kanban-status pm-tone-${tone}`}>{project.status}</span>
        </div>
        <div className="pm-kanban-row">
          <span className="pm-kanban-label">进度</span>
          <div
            className="pm-progress-shell"
            role="progressbar"
            style={{ '--progress': `${project.progress ?? 0}%` } as React.CSSProperties}
          >
            <div className="pm-progress-bar" />
          </div>
        </div>
        <div className="pm-kanban-row">
          <span className="pm-kanban-label">负责人</span>
          <span className="pm-kanban-value">{project.owner}</span>
        </div>
        <div className="pm-kanban-row">
          <span className="pm-kanban-label">截止日期</span>
          <span className="pm-kanban-value">{project.plannedOpenDate}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`pm-project-card pm-project-card-compact ${className}`.trim()}
      onClick={clickable ? handleClick : undefined}
      style={clickable ? { cursor: 'pointer' } : undefined}
      aria-label={`Project ${project.name} compact`}
    >
      <div className="pm-compact-row">
        <span className="pm-compact-name">{project.name}</span>
        <span className={`pm-compact-status pm-tone-${tone}`}>{project.status}</span>
        <div
          className="pm-compact-progress"
          role="meter"
          style={{ '--progress': `${project.progress ?? 0}%` } as React.CSSProperties}
        >
          <div className="pm-progress-bar" />
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
