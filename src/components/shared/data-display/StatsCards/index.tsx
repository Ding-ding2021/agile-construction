import StatCard from '../StatCard'
import type { ComponentType } from 'react'

type StatsCardsTone = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan'

type StatsCardsItem = {
  key: string
  icon?: string
  /** MUI 图标组件（优先级高于 icon） */
  iconComponent?: ComponentType<{ sx?: object }>
  label: string
  value: string | number
  tone: StatsCardsTone
  subLabel?: string
  delta?: string
  deltaIcon?: string
}

type StatsCardsProps = {
  items: StatsCardsItem[]
  activeKey?: string
  onItemClick?: (key: string) => void
  assetBase?: string
  className?: string
  classNamePrefix?: string
  layout?: 'vertical' | 'horizontal'
}

const StatsCards = ({
  items,
  activeKey,
  onItemClick,
  assetBase,
  className = 'pm-stats-row',
  classNamePrefix = 'pm',
  layout = 'vertical',
}: StatsCardsProps) => {
  return (
    <section className={className}>
      {items.map(item => (
        <StatCard
          key={item.key}
          icon={item.icon}
          iconComponent={item.iconComponent}
          label={item.label}
          value={item.value}
          tone={item.tone}
          subLabel={item.subLabel}
          delta={item.delta}
          deltaIcon={item.deltaIcon}
          active={activeKey === item.key}
          onClick={onItemClick ? () => onItemClick(item.key) : undefined}
          assetBase={assetBase}
          classNamePrefix={classNamePrefix}
          layout={layout}
        />
      ))}
    </section>
  )
}

export default StatsCards
