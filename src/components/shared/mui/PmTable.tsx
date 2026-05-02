import { useCallback, useRef, useState, useEffect, type ReactNode } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Skeleton, Paper } from '@mui/material'

export interface PmTableColumn<T> {
  key: keyof T; header: string; render?: (item: T) => ReactNode
  width?: string | number; align?: 'left' | 'center' | 'right'
  sortable?: boolean; resizable?: boolean
}

export interface PmTableProps<T> {
  columns: PmTableColumn<T>[]; data: T[]; rowKey?: (row: T) => string | number
  loading?: boolean; emptyText?: string; page?: number; total?: number; rowsPerPage?: number
  onPageChange?: (page: number) => void; onRowsPerPageChange?: (rpp: number) => void
  selectable?: boolean; selectedKeys?: Set<string | number>; onSelectionChange?: (keys: Set<string | number>) => void
  batchActions?: ReactNode; onRowClick?: (row: T) => void
  sortKey?: string; sortDir?: 'asc' | 'desc'; onSortChange?: (key: string, dir: 'asc' | 'desc') => void
  onColumnResize?: (key: string, w: number) => void
}

const SKELETON_ROWS = 5; const MIN_COL_WIDTH = 40; const RH = 4

const thBase: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600,
  color: 'rgba(255,255,255,0.70)', background: 'rgba(255,255,255,0.03)',
  borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap', userSelect: 'none',
}
const tdBase: React.CSSProperties = {
  padding: '10px 12px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)',
}

function CkBox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <span onClick={e => { e.stopPropagation(); onChange() }} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 18, height: 18, borderRadius: 4, cursor: 'pointer',
      background: checked ? '#154DD9' : 'transparent',
      border: checked ? '2px solid #154DD9' : '2px solid rgba(255,255,255,0.3)',
      color: '#fff', fontSize: 11, fontWeight: 700, transition: 'all 0.15s', lineHeight: 1,
    }}>{checked ? '✓' : ''}</span>
  )
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  return <span style={{ marginLeft: 4, fontSize: 10, opacity: active ? 0.8 : 0.3 }}>{active ? (dir === 'asc' ? '▲' : '▼') : '▼'}</span>
}

function parseWidth(w: string | number | undefined, d = 120): number {
  if (w == null) return d; if (typeof w === 'number') return w
  const m = String(w).match(/^(\d+(?:\.\d+)?)px$/); return m ? parseFloat(m[1]) : d
}

export function PmTable<T = Record<string, unknown>>({
  columns, data, rowKey, loading = false, emptyText = '暂无数据', page = 0, total = 0, rowsPerPage = 10,
  onPageChange, onRowsPerPageChange, selectable = false, selectedKeys = new Set(), onSelectionChange,
  batchActions, onRowClick, sortKey, sortDir = 'desc', onSortChange, onColumnResize,
}: PmTableProps<T>) {
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}; columns.forEach(col => { init[String(col.key)] = parseWidth(col.width) }); return init
  })
  useEffect(() => { setColWidths(prev => { const n = { ...prev }; columns.forEach(col => { const k = String(col.key); if (!(k in n)) n[k] = parseWidth(col.width) }); return n }) }, [columns])

  const resizeRef = useRef<{ colKey: string; startX: number; startW: number } | null>(null)
  const handleResizeStart = useCallback((colKey: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const startW = colWidths[colKey] ?? parseWidth(columns.find(c => String(c.key) === colKey)?.width)
    resizeRef.current = { colKey, startX: e.clientX, startW }
  }, [colWidths, columns])
  useEffect(() => {
    if (!resizeRef.current) return
    const mm = (e: MouseEvent) => { const r = resizeRef.current; if (!r) return; const nw = Math.max(MIN_COL_WIDTH, r.startW + e.clientX - r.startX); setColWidths(p => ({ ...p, [r.colKey]: nw })) }
    const mu = () => { const r = resizeRef.current; if (r && onColumnResize && colWidths[r.colKey]) onColumnResize(r.colKey, colWidths[r.colKey]); resizeRef.current = null; document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); document.body.style.userSelect = ''; document.body.style.cursor = '' }
    document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu)
    document.body.style.userSelect = 'none'; document.body.style.cursor = 'col-resize'
    return () => { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); document.body.style.userSelect = ''; document.body.style.cursor = '' }
  }, [colWidths, onColumnResize])

  const hp = onPageChange !== undefined
  const gk = useCallback((row: T, idx: number): string | number => rowKey?.(row) ?? idx, [rowKey])
  const allSel = selectable && data.length > 0 && data.every(r => selectedKeys.has(gk(r, 0)))
  const ta = useCallback(() => { if (!onSelectionChange || !selectable) return; if (allSel) onSelectionChange(new Set()); else onSelectionChange(new Set(data.map((r, i) => gk(r, i)))) }, [onSelectionChange, selectable, allSel, data, gk])
  const to = useCallback((key: string | number) => { if (!onSelectionChange || !selectable) return; const n = new Set(selectedKeys); if (n.has(key)) n.delete(key); else n.add(key); onSelectionChange(n) }, [onSelectionChange, selectable, selectedKeys])

  const csx = { width: '100%', overflow: 'hidden' as const, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }

  if (loading) return (
    <Paper sx={csx}><TableContainer><Table sx={{ borderCollapse: 'collapse' }}><TableHead><TableRow>
      {selectable && <TableCell sx={{ width: 50, ...thBase }} />}
      {columns.map(col => <TableCell key={String(col.key)} sx={{ width: colWidths[String(col.key)], ...thBase }}>{col.header}</TableCell>)}
    </TableRow></TableHead><TableBody>
      {Array.from({ length: SKELETON_ROWS }).map((_, ri) => <TableRow key={`sk-${ri}`}>
        {selectable && <TableCell sx={{ width: 50, ...tdBase }}><Skeleton variant="rectangular" width={18} height={18} sx={{ borderRadius: 1 }} /></TableCell>}
        {columns.map((_c, ci) => <TableCell key={`skc-${ri}-${ci}`} sx={tdBase}><Skeleton variant="text" width={ci === 0 ? '60%' : '80%'} sx={{ opacity: Math.max(0.02, 0.3 - ri * 0.04) }} /></TableCell>)}
      </TableRow>)}
    </TableBody></Table></TableContainer></Paper>
  )
  if (data.length === 0) return <Paper sx={{ ...csx, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, color: 'rgba(255,255,255,0.40)', fontSize: 14 }}>{emptyText}</Paper>

  return (
    <div>
      <Paper sx={csx}>
        <TableContainer>
          <Table sx={{ borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow>
                {selectable && <TableCell sx={{ width: 50, ...thBase }} onClick={ta}><CkBox checked={allSel} onChange={ta} /></TableCell>}
                {columns.map(col => {
                  const ck = String(col.key); const isLast = col === columns[columns.length - 1]; const cr = col.resizable !== false && !isLast
                  return (
                    <TableCell key={ck} align={col.align || 'left'} sx={{ width: colWidths[ck], ...thBase, cursor: col.sortable ? 'pointer' : 'default', position: 'relative', overflow: 'visible' }}
                      onClick={() => { if (!col.sortable || !onSortChange) return; onSortChange(ck, sortKey === ck && sortDir === 'asc' ? 'desc' : 'asc') }}
                    >
                      {col.header}{col.sortable && <SortIcon active={sortKey === ck} dir={sortKey === ck ? sortDir : 'desc'} />}
                      {cr && (
                        <span onMouseDown={e => handleResizeStart(ck, e)}
                          style={{ position: 'absolute', top: 0, right: 0, width: RH, height: '100%', cursor: 'col-resize', zIndex: 1, opacity: 0 }}
                          onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '1' }}
                          onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '0' }}
                        >
                          <span style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 2, height: '60%', borderRadius: 1, background: 'rgba(255,255,255,0.3)' }} />
                        </span>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, ri) => {
                const k = gk(item, ri); const isSel = selectable && selectedKeys.has(k)
                return (
                  <TableRow key={k} onClick={() => onRowClick?.(item)} sx={{
                    cursor: onRowClick ? 'pointer' : 'default', bgcolor: isSel ? 'rgba(21,77,217,0.04)' : 'transparent', transition: 'background 0.15s',
                    '&:hover': { bgcolor: isSel ? 'rgba(21,77,217,0.06)' : 'rgba(255,255,255,0.06)' }, '& td': { borderBottom: '1px solid rgba(255,255,255,0.05)' },
                  }}>
                    {selectable && <TableCell sx={{ ...tdBase }} onClick={e => e.stopPropagation()}><CkBox checked={isSel} onChange={() => to(k)} /></TableCell>}
                    {columns.map(col => <TableCell key={String(col.key)} align={col.align || 'left'} sx={tdBase}>{col.render ? col.render(item) : (item[col.key as keyof T] as ReactNode)}</TableCell>)}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {hp && total > 0 && (
          <TablePagination component="div" count={total} page={page} rowsPerPage={rowsPerPage}
            onPageChange={(_, np) => onPageChange(np)} onRowsPerPageChange={e => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
            sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.40)', fontSize: 12, '.MuiTablePagination-toolbar': { minHeight: 64 }, '.MuiTablePagination-selectIcon': { color: 'rgba(255,255,255,0.40)' } }}
          />
        )}
      </Paper>
      {selectable && selectedKeys.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', marginTop: 12, background: 'rgba(21,77,217,0.08)', border: '1px solid rgba(21,77,217,0.15)', borderRadius: 10, fontSize: 13 }}>
          <span style={{ color: 'rgba(255,255,255,0.70)' }}>已选择 <strong style={{ color: '#fff' }}>{selectedKeys.size}</strong> 个</span>
          {batchActions}
        </div>
      )}
    </div>
  )
}
