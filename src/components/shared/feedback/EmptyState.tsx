import React from 'react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  iconSrc?: string
  iconAlt?: string
  title?: string
  description?: string
  compact?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * 空状态组件
 *
 * 统一展示"暂无数据"等空状态场景
 *
 * @example
 * ```tsx
 * <EmptyState
 *   iconSrc="/assets/icon.svg"
 *   title="暂无数据"
 *   description="请尝试调整筛选条件"
 * />
 *
 * <EmptyState compact title="当前无待派单任务" />
 * ```
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  iconSrc,
  iconAlt = '',
  title,
  description,
  compact = false,
  className = '',
  children,
}) => {
  const baseClass = compact ? 'pm-empty-state compact' : 'pm-empty-state'

  return (
    <div className={`${baseClass} ${className}`.trim()} role="status" aria-live="polite">
      {icon && <div className="pm-empty-icon-wrap">{icon}</div>}
      {iconSrc && !icon && <img src={iconSrc} alt={iconAlt} className="pm-empty-icon" />}
      {title && <div className="pm-empty-title">{title}</div>}
      {description && <div className="pm-empty-desc">{description}</div>}
      {children}
    </div>
  )
}

export default EmptyState
