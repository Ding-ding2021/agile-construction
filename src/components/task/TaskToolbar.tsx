import { useState, useRef, useEffect } from 'react'
import { type TaskFilters, type TaskViewMode } from './taskManagement.types'

type TaskToolbarProps = {
  viewMode: TaskViewMode
  onViewModeChange: (mode: TaskViewMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: TaskFilters
  onFiltersChange: (filters: Partial<TaskFilters>) => void
  onCreateTask?: () => void
  onOpenImport?: () => void
  onOpenExport?: () => void
}

const viewModes: Array<{ mode: TaskViewMode; label: string }> = [
  { mode: 'list', label: '表格' },
  { mode: 'kanban', label: '看板' },
  { mode: 'calendar', label: '日历' },
]

function MoreMenu({ onImport, onExport }: { onImport?: () => void; onExport?: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: 32,
          height: 32,
          padding: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: 10,
          background: 'transparent',
          color: 'rgba(255,255,255,0.70)',
          cursor: 'pointer',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            minWidth: 150,
            background: 'var(--pm-bg)',
            border: '1px solid var(--pm-border)',
            borderRadius: 12,
            boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.2)',
            padding: 4,
            zIndex: 50,
          }}
        >
          <button
            type="button"
            onClick={() => {
              onImport?.()
              setOpen(false)
            }}
            style={menuItemStyle}
          >
            导入任务
          </button>
          <button
            type="button"
            onClick={() => {
              onExport?.()
              setOpen(false)
            }}
            style={menuItemStyle}
          >
            导出任务
          </button>
        </div>
      )}
    </div>
  )
}

const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  border: 'none',
  borderRadius: 8,
  fontSize: 13,
  cursor: 'pointer',
  width: '100%',
  background: 'transparent',
  color: 'rgba(255,255,255,0.70)',
  fontFamily: 'inherit',
  textAlign: 'left',
}

const TaskToolbar = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onOpenImport,
  onOpenExport,
}: TaskToolbarProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderBottom: '1px solid var(--pm-border-light, rgba(255,255,255,0.08))',
        flexWrap: 'wrap',
      }}
    >
      {/* 视图切换 */}
      <div
        style={{
          display: 'flex',
          gap: 2,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 8,
          padding: 2,
        }}
      >
        {viewModes.map(view => (
          <button
            key={view.mode}
            type="button"
            onClick={() => onViewModeChange(view.mode)}
            style={{
              padding: '5px 12px',
              border: 'none',
              borderRadius: 6,
              background: viewMode === view.mode ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: viewMode === view.mode ? '#ffffff' : 'rgba(255,255,255,0.40)',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* 右侧操作 */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.40)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="搜索"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            style={{
              padding: '6px 12px 6px 32px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: 12,
              width: 180,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <FilterButton label="筛选" />
        <FilterButton label="排序" />
        <FilterButton label="分组" />

        <MoreMenu onImport={onOpenImport} onExport={onOpenExport} />

        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 14px',
            background: '#154DD9',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow:
              '0px 4px 6px -4px rgba(28,57,142,0.5), 0px 10px 15px -3px rgba(28,57,142,0.5)',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新建
        </button>
      </div>
    </div>
  )
}

function FilterButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '5px 12px',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 14,
        background: 'transparent',
        color: 'rgba(255,255,255,0.70)',
        fontSize: 12,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: 2 }}
      >
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
      {label}
    </button>
  )
}

export default TaskToolbar
