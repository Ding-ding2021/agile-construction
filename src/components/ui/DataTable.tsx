/**
 * DataTable — 通用表格组件
 *
 * 列配置驱动，支持排序、行选中、批量操作。
 * 参考线框图设计，与 MUI theme 保持视觉一致。
 *
 * 用法：
 *   <DataTable
 *     columns={[
 *       { key: 'name', label: '名称', sortable: true },
 *       { key: 'status', label: '状态', render: (v) => <StatusChip value={v} /> },
 *     ]}
 *     rows={data}
 *     onRowClick={(row) => ...}
 *   />
 */
import { useCallback, useRef, useState } from 'react'
import { Skeleton } from '@mui/material'

export type Column<T> = {
  key: string
  label: string
  sortable?: boolean
  width?: string | number
  render?: (value: unknown, row: T) => React.ReactNode
}

type ColumnWidths = Record<string, number>

type DataTableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  onRowClick?: (row: T) => void
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  selectable?: boolean
  selectedKeys?: Set<string | number>
  onSelectionChange?: (keys: Set<string | number>) => void
  batchActions?: React.ReactNode
  emptyText?: string
  loading?: boolean
}

const SKELETON_WIDTHS = [60, 40, 50, 70, 45, 55, 65, 35, 80, 50]

function SkeletonRow({ cols, showCheckbox }: { cols: number; showCheckbox: boolean }) {
  return (
    <tr>
      {showCheckbox && (
        <td style={tdStyle}>
          <Skeleton
            variant="rectangular"
            width={18}
            height={18}
            sx={{ borderRadius: 1, bgcolor: 'var(--pm-element)' }}
          />
        </td>
      )}
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={tdStyle}>
          <Skeleton
            variant="text"
            width={`${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%`}
            sx={{ bgcolor: 'var(--pm-element)' }}
          />
        </td>
      ))}
    </tr>
  )
}

export default function DataTable<T = Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  onRowClick,
  onSortChange,
  sortKey,
  sortDir,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  batchActions,
  emptyText = '暂无数据',
  loading = false,
}: DataTableProps<T>) {
  const allSelected = rows.length > 0 && rows.every(r => selectedKeys.has(rowKey(r)))
  const someSelected = !allSelected && rows.some(r => selectedKeys.has(rowKey(r)))

  // ─── 列宽调整 ─────────────────────────────────────────────
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({})
  const resizeRef = useRef<{
    colKey: string
    startX: number
    startWidth: number
    th: HTMLTableCellElement
  } | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  const getColWidth = (col: Column<T>): number | string | undefined =>
    columnWidths[col.key] ?? col.width

  const handleResizeStart = useCallback((e: React.MouseEvent, col: Column<T>) => {
    e.preventDefault()
    const th = (e.target as HTMLElement).closest('th')
    if (!th) return
    const startWidth = th.getBoundingClientRect().width
    resizeRef.current = { colKey: col.key, startX: e.clientX, startWidth, th }

    const onMove = (ev: MouseEvent) => {
      const r = resizeRef.current
      if (!r) return
      const diff = ev.clientX - r.startX
      const newWidth = Math.max(60, r.startWidth + diff)
      r.th.style.width = `${newWidth}px`
      // 同步 <colgroup> 中的 col
      if (tableRef.current) {
        const colEl = tableRef.current.querySelector<HTMLTableColElement>(
          `col[data-key="${r.colKey}"]`
        )
        if (colEl) colEl.style.width = `${newWidth}px`
      }
    }

    const onUp = (ev: MouseEvent) => {
      const r = resizeRef.current
      if (r) {
        const diff = ev.clientX - r.startX
        const finalWidth = Math.max(60, r.startWidth + diff)
        setColumnWidths(prev => ({ ...prev, [r.colKey]: finalWidth }))
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
      resizeRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  const toggleAll = useCallback(() => {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(rows.map(r => rowKey(r))))
    }
  }, [onSelectionChange, allSelected, rows, rowKey])

  const toggleOne = useCallback(
    (key: string | number) => {
      if (!onSelectionChange) return
      const next = new Set(selectedKeys)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      onSelectionChange(next)
    },
    [onSelectionChange, selectedKeys]
  )

  if (loading) {
    return (
      <div>
        <table
          ref={tableRef}
          style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}
        >
          <colgroup>
            {selectable && <col style={{ width: 44 }} />}
            {columns.map(col => (
              <col key={col.key} data-key={col.key} style={{ width: getColWidth(col) }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {selectable && <th style={thStyle} />}
              {columns.map(col => (
                <th key={col.key} style={{ ...thStyle, width: getColWidth(col) }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} showCheckbox={selectable} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          color: 'rgba(255,255,255,0.40)',
          fontSize: 14,
        }}
      >
        {emptyText}
      </div>
    )
  }

  return (
    <div>
      <table
        ref={tableRef}
        style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}
      >
        <colgroup>
          {selectable && <col style={{ width: 44 }} />}
          {columns.map(col => (
            <col key={col.key} data-key={col.key} style={{ width: getColWidth(col) }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {selectable && (
              <th style={thStyle} onClick={toggleAll}>
                <span
                  style={ckStyle(allSelected || someSelected)}
                  onClick={e => {
                    e.stopPropagation()
                    toggleAll()
                  }}
                >
                  {allSelected ? '✓' : ''}
                </span>
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  ...thStyle,
                  width: getColWidth(col),
                  cursor: col.sortable ? 'pointer' : 'default',
                  position: 'relative',
                }}
                onClick={() => {
                  if (!col.sortable || !onSortChange) return
                  const isAsc = sortKey === col.key && sortDir === 'asc'
                  onSortChange(col.key, isAsc ? 'desc' : 'asc')
                }}
              >
                {col.label}
                {col.sortable && (
                  <span
                    style={{
                      marginLeft: 4,
                      opacity: sortKey === col.key ? 0.8 : 0.3,
                      fontSize: 10,
                    }}
                  >
                    {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '▼'}
                  </span>
                )}
                {/* 拖拽调整列宽的手柄 */}
                {columns.indexOf(col) < columns.length - 1 && (
                  <div
                    onMouseDown={e => handleResizeStart(e, col)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 0,
                      width: 6,
                      height: 'calc(100% - 8px)',
                      cursor: 'col-resize',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        width: 1,
                        height: '60%',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: 1,
                        transition: 'background 0.15s',
                      }}
                      className="resize-handle-line"
                    />
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const key = rowKey(row)
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                style={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.15s',
                  background: selectedKeys.has(key) ? 'rgba(21,77,217,0.04)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!selectedKeys.has(key))
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                }}
                onMouseLeave={e => {
                  if (!selectedKeys.has(key)) e.currentTarget.style.background = 'transparent'
                }}
              >
                {selectable && (
                  <td style={tdStyle} onClick={e => e.stopPropagation()}>
                    <span style={ckStyle(selectedKeys.has(key))} onClick={() => toggleOne(key)}>
                      {selectedKeys.has(key) ? '✓' : ''}
                    </span>
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key} style={tdStyle}>
                    {col.render ? (
                      col.render(row[col.key], row)
                    ) : (
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)' }}>
                        {String(row[col.key] ?? '')}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Batch action bar */}
      {selectable && selectedKeys.size > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 16px',
            marginTop: 12,
            background: 'rgba(21,77,217,0.08)',
            border: '1px solid rgba(21,77,217,0.15)',
            borderRadius: 10,
            fontSize: 13,
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.70)' }}>
            已选择 <strong style={{ color: '#fff' }}>{selectedKeys.size}</strong> 个
          </span>
          {batchActions}
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.70)',
  background: 'rgba(255,255,255,0.03)',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  whiteSpace: 'nowrap',
  userSelect: 'none',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 13,
  borderBottom: '1px solid rgba(255,255,255,0.05)',
}

const ckStyle = (checked: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  borderRadius: 4,
  cursor: 'pointer',
  background: checked ? '#154DD9' : 'transparent',
  border: checked ? '2px solid #154DD9' : '2px solid rgba(255,255,255,0.3)',
  color: '#fff',
  fontSize: 11,
  fontWeight: 700,
  transition: 'all 0.15s',
})
