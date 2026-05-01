export type ViewToggleItem = {
  key: string
  label: string
  icon?: string
  assetBase?: string
}

type ViewToggleProps = {
  items: ViewToggleItem[]
  value: string
  onChange: (key: string) => void
  className?: string
  'aria-label'?: string
}

/**
 * ViewToggle — 统一视图切换分段控件
 *
 * 替换各页面独立的 pm-view-toggle / tm-view-toggle / fm-view-toggle 实现。
 *
 * @example
 * ```tsx
 * <ViewToggle
 *   items={[
 *     { key: 'list', label: '列表', icon: '10.svg', assetBase: '/assets/...' },
 *     { key: 'grid', label: '网格', icon: '9.svg', assetBase: '/assets/...' },
 *   ]}
 *   value={viewMode}
 *   onChange={setViewMode}
 * />
 * ```
 */
const ViewToggle = ({
  items,
  value,
  onChange,
  className,
  'aria-label': ariaLabel = '视图切换',
}: ViewToggleProps) => (
  <div className={className ?? 'pm-view-toggle'} role="tablist" aria-label={ariaLabel}>
    {items.map(item => (
      <button
        key={item.key}
        type="button"
        className={`pm-view-btn ${value === item.key ? 'active' : ''}`}
        onClick={() => onChange(item.key)}
        role="tab"
        aria-selected={value === item.key}
      >
        {item.icon && <img src={`${item.assetBase ?? ''}/${item.icon}`} alt="" aria-hidden />}
        <span>{item.label}</span>
      </button>
    ))}
  </div>
)

export default ViewToggle
