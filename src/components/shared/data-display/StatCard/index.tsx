import Icon from '../../icons/Icon'

type StatCardLayout = 'vertical' | 'horizontal'

type StatCardProps = {
  icon: string
  label: string
  value: string | number
  tone: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan'
  subLabel?: string
  delta?: string
  deltaIcon?: string
  /** 趋势方向：up 上升 / down 下降 / neutral 持平；未传时自动从 delta 文本推断 */
  trend?: 'up' | 'down' | 'neutral'
  active?: boolean
  onClick?: () => void
  assetBase?: string
  classNamePrefix?: string
  layout?: StatCardLayout
}

const inferTrend = (delta: string | undefined): 'up' | 'down' | 'neutral' => {
  if (!delta) return 'neutral'
  const trimmed = String(delta).trim()
  if (trimmed.startsWith('+')) return 'up'
  if (trimmed.startsWith('-')) return 'down'
  return 'neutral'
}

const StatCard = ({
  icon,
  label,
  value,
  tone,
  subLabel,
  delta,
  deltaIcon,
  trend,
  active = false,
  onClick,
  assetBase = '/assets/CodeBubbyAssets/3848_19',
  classNamePrefix = 'pm',
  layout = 'vertical',
}: StatCardProps) => {
  const cardClassName = [
    `${classNamePrefix}-stat-card`,
    `${classNamePrefix}-stat-${tone}`,
    tone,
    active ? 'active' : '',
    `${classNamePrefix}-stat-${layout}`,
  ]
    .filter(Boolean)
    .join(' ')

  const resolvedTrend = trend ?? inferTrend(delta)
  const trendIconName = deltaIcon
    ? undefined
    : resolvedTrend === 'up'
      ? 'arrow-up'
      : resolvedTrend === 'down'
        ? 'arrow-down'
        : undefined

  const iconEl = (
    <div className={`${classNamePrefix}-stat-icon-wrap ${classNamePrefix}-stat-icon`}>
      {icon.includes('.') ? <img src={`${assetBase}/${icon}`} alt="" /> : <span>{icon}</span>}
    </div>
  )

  if (layout === 'horizontal') {
    return (
      <div
        className={cardClassName}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {iconEl}
        <div className={`${classNamePrefix}-stat-text`}>
          <strong className={`${classNamePrefix}-stat-value`}>{value}</strong>
          <p className={`${classNamePrefix}-stat-label`}>{label}</p>
          {subLabel ? <span className={`${classNamePrefix}-stat-sublabel`}>{subLabel}</span> : null}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cardClassName}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={`${classNamePrefix}-stat-top`}>
        {iconEl}
        {delta ? (
          <div className={`${classNamePrefix}-stat-delta ${classNamePrefix}-stat-delta-${tone}`}>
            {deltaIcon ? (
              <img src={`${assetBase}/${deltaIcon}`} alt="" />
            ) : trendIconName ? (
              <Icon name={trendIconName} size="xs" />
            ) : null}
            <span>{delta}</span>
          </div>
        ) : null}
      </div>

      <p className={`${classNamePrefix}-stat-label`}>{label}</p>
      <strong className={`${classNamePrefix}-stat-value`}>{value}</strong>
      {subLabel ? <span className={`${classNamePrefix}-stat-sublabel`}>{subLabel}</span> : null}
    </div>
  )
}

export default StatCard
