import type { ReactNode } from 'react'
import { navigateByHash } from '../nav.utils'
import Icon from '../../icons/Icon'

type BreadcrumbItem = {
  label: string
  href?: string
  onClick?: () => void
}

type PageHeaderProps = {
  title: string
  subtitle: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
  extraTitleContent?: ReactNode
  extraActions?: ReactNode
  showActions?: boolean
  /** 变体：standard（标准）/ dark（深色，适配 digital 模块） */
  variant?: 'standard' | 'dark'
  /** 面包屑导航 */
  breadcrumb?: BreadcrumbItem[]
}

const PageHeader = ({
  title,
  subtitle,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = '搜索...',
  extraTitleContent,
  extraActions,
  showActions = true,
  variant = 'standard',
  breadcrumb,
}: PageHeaderProps) => {
  return (
    <header className={`pm-header ${variant === 'dark' ? 'pm-header-dark' : ''}`}>
      <div className="pm-header-title">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="pm-header-breadcrumb" aria-label="面包屑导航">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1
              return (
                <span key={`${item.label}-${index}`} className="pm-breadcrumb-wrap">
                  {item.href || item.onClick ? (
                    <button
                      type="button"
                      className="pm-breadcrumb-link"
                      onClick={
                        item.onClick
                          ? item.onClick
                          : () => {
                              if (item.href) navigateByHash(item.href)
                            }
                      }
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className={`pm-breadcrumb-item ${isLast ? 'active' : ''}`}>
                      {item.label}
                    </span>
                  )}
                  {!isLast && (
                    <span className="pm-breadcrumb-separator" aria-hidden="true">
                      /
                    </span>
                  )}
                </span>
              )
            })}
          </nav>
        )}
        <h1>{title}</h1>
        <span>{subtitle}</span>
        {extraTitleContent}
      </div>

      {showActions && (
        <div className="pm-header-actions">
          {onSearchChange && (
            <div className="pm-search-box">
              <Icon name="search" size="sm" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={event => onSearchChange(event.target.value)}
              />
            </div>
          )}
          {extraActions}
          <button type="button" className="pm-icon-btn" aria-label="通知">
            <Icon name="notification" size="md" />
          </button>
          <button type="button" className="pm-icon-btn pm-icon-btn-active" aria-label="AI助手">
            <Icon name="ai-assistant" size="md" />
          </button>
          <button type="button" className="pm-user-profile" aria-label="当前用户">
            <Icon name="user-avatar" size="md" />
            <span>管理员</span>
            <Icon name="dropdown" size="sm" />
          </button>
        </div>
      )}
    </header>
  )
}

export default PageHeader
