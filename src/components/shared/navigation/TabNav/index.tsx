import Icon from '../../icons/Icon'
import type { IconName } from '../../icons'

type TabNavItem = {
  id: string
  label: string
  icon?: IconName | string
  disabled?: boolean
  hidden?: boolean
  badge?: number
}

type TabNavVariant = 'default' | 'pills' | 'underline'

type TabNavProps = {
  tabs: TabNavItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: TabNavVariant
  classNamePrefix?: string
  ariaLabel?: string
  assetBase?: string
}

const TabNav = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  classNamePrefix = 'pm',
  ariaLabel = '标签导航',
  assetBase,
}: TabNavProps) => {
  const visibleTabs = tabs.filter(t => !t.hidden)

  const rootClass = [`${classNamePrefix}-tab-nav`, `${classNamePrefix}-tab-nav-${variant}`]
    .filter(Boolean)
    .join(' ')

  const btnClass = (isActive: boolean, isDisabled: boolean) => {
    const classes = [`${classNamePrefix}-tab-nav-btn`]
    if (isActive) classes.push('active')
    if (isDisabled) classes.push('disabled')
    return classes.join(' ')
  }

  return (
    <nav className={rootClass} role="tablist" aria-label={ariaLabel}>
      {visibleTabs.map(tab => {
        const isActive = activeTab === tab.id
        const isDisabled = tab.disabled

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled || undefined}
            className={btnClass(isActive, Boolean(isDisabled))}
            onClick={() => {
              if (!isDisabled && activeTab !== tab.id) {
                onTabChange(tab.id)
              }
            }}
            disabled={isDisabled}
          >
            {tab.icon && (
              <span className={`${classNamePrefix}-tab-nav-icon`}>
                {tab.icon.includes('.') ? (
                  <img src={assetBase ? `${assetBase}/${tab.icon}` : tab.icon} alt="" />
                ) : (
                  <Icon name={tab.icon as IconName} size="sm" />
                )}
              </span>
            )}
            <span className={`${classNamePrefix}-tab-nav-label`}>{tab.label}</span>
            {typeof tab.badge === 'number' && (
              <span className={`${classNamePrefix}-tab-nav-badge`}>{tab.badge}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default TabNav
export type { TabNavItem, TabNavProps, TabNavVariant }
