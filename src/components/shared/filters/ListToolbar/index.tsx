import type { ReactNode } from 'react'

type ToolbarViewMode = string

type ToolbarViewItem = {
  key: ToolbarViewMode
  label: string
}

type ListToolbarProps = {
  viewModes: ToolbarViewItem[]
  activeView: ToolbarViewMode
  onViewChange: (view: ToolbarViewMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  searchPlaceholder?: string
  className?: string
  rightSlot?: ReactNode
}

const ListToolbar = ({
  viewModes,
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = '搜索...',
  className = 'pm-table-toolbar',
  rightSlot,
}: ListToolbarProps) => {
  return (
    <div className={className}>
      <div className="pm-view-toggle" role="tablist" aria-label="视图切换">
        {viewModes.map(view => (
          <button
            key={view.key}
            type="button"
            className={`pm-view-btn ${activeView === view.key ? 'active' : ''}`}
            onClick={() => onViewChange(view.key)}
          >
            {view.label}
          </button>
        ))}
      </div>

      <div className="pm-toolbar-right">
        <div className="pm-search-input-wrap">
          <input
            type="text"
            value={searchQuery}
            onChange={event => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
        {rightSlot}
      </div>
    </div>
  )
}

export default ListToolbar
