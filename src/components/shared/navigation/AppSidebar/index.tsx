import { useCallback } from 'react'
import Icon from '../../icons/Icon'
import { navIconMap, type IconName } from '../../icons'
import { defaultNavItems, type SharedNavItem } from '../nav.config'
import { isHashRouteActive, navigateByHash } from '../nav.utils'
import { useSidebarCollapsed } from '../useSidebarCollapsed'

type AppSidebarProps = {
  currentHash: string
  collapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void
  items?: SharedNavItem[]
  className?: string
}

// 获取导航项对应的图标名称
const getNavIconName = (label: string): IconName => {
  return navIconMap[label] || 'menu'
}

const AppSidebar = ({
  currentHash,
  collapsed: controlledCollapsed,
  onCollapseChange,
  items = defaultNavItems,
  className = 'pm-sidebar',
}: AppSidebarProps) => {
  const isControlled = controlledCollapsed !== undefined
  const { collapsed: internalCollapsed, toggle } = useSidebarCollapsed(isControlled)

  const collapsed = isControlled ? controlledCollapsed : internalCollapsed

  const handleCollapseChange = useCallback(() => {
    const next = toggle()
    onCollapseChange?.(next)
  }, [toggle, onCollapseChange])

  return (
    <aside className={`${className} ${collapsed ? 'collapsed' : ''}`}>
      <div className="pm-sidebar-brand">
        <Icon name="logo" size="xl" className="pm-brand-logo" />
        <button
          className="pm-sidebar-collapse"
          aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
          type="button"
          onClick={handleCollapseChange}
        >
          <Icon name="collapse" size="sm" />
        </button>
      </div>

      <nav className="pm-sidebar-nav">
        {items.map(item => {
          const isActive = isHashRouteActive(currentHash, item.href)
          const isDisabled = item.disabled || !item.href
          const iconName = getNavIconName(item.label)

          if (isDisabled) {
            return (
              <button
                key={item.label}
                type="button"
                className="pm-nav-item disabled"
                disabled
                aria-disabled="true"
              >
                <Icon name={iconName} size="md" />
                <span>{item.label}</span>
              </button>
            )
          }

          return (
            <button
              key={item.label}
              type="button"
              className={`pm-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigateByHash(item.href!)}
            >
              <Icon name={iconName} size="md" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default AppSidebar
