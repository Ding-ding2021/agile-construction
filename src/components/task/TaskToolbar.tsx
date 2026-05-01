import { useState, useRef, useEffect, type ReactNode } from 'react'
import { type TaskFilters, type TaskViewMode } from './taskManagement.types'
import TableView from '@mui/icons-material/TableView'
import ViewKanban from '@mui/icons-material/ViewKanban'
import CalendarMonth from '@mui/icons-material/CalendarMonth'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import Search from '@mui/icons-material/Search'
import Add from '@mui/icons-material/Add'
import FilterList from '@mui/icons-material/FilterList'
import Sort from '@mui/icons-material/Sort'
import GroupWork from '@mui/icons-material/GroupWork'

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

const VIEW_ICONS: Record<TaskViewMode, typeof TableView> = {
  list: TableView,
  kanban: ViewKanban,
  calendar: CalendarMonth,
}

const viewModes: TaskViewMode[] = ['list', 'kanban', 'calendar']
const viewLabels: Record<TaskViewMode, string> = {
  list: '表格',
  kanban: '看板',
  calendar: '日历',
}

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
        <MoreHoriz sx={{ fontSize: 16, color: 'rgba(255,255,255,0.70)' }} />
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
      <div className="pm-view-toggle" role="tablist" aria-label="视图切换">
        {viewModes.map(mode => {
          const Icon = VIEW_ICONS[mode]
          return (
            <button
              key={mode}
              type="button"
              className={`pm-view-btn ${viewMode === mode ? 'active' : ''}`}
              onClick={() => onViewModeChange(mode)}
            >
              <Icon sx={{ fontSize: 14 }} />
              <span>{viewLabels[mode]}</span>
            </button>
          )
        })}
      </div>

      {/* 右侧操作 */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <Search
            sx={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.40)',
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
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

        <FilterButton icon={<FilterList sx={{ fontSize: 12 }} />} label="筛选" />
        <FilterButton icon={<Sort sx={{ fontSize: 12 }} />} label="排序" />
        <FilterButton icon={<GroupWork sx={{ fontSize: 12 }} />} label="分组" />

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
          <Add sx={{ fontSize: 14 }} />
          新建
        </button>

        <MoreMenu onImport={onOpenImport} onExport={onOpenExport} />
      </div>
    </div>
  )
}

function FilterButton({ icon, label }: { icon: ReactNode; label: string }) {
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
      {icon}
      {label}
    </button>
  )
}

export default TaskToolbar
