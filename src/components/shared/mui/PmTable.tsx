import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
  Paper,
} from '@mui/material'

export interface PmTableColumn<T> {
  key: keyof T
  header: string
  render?: (item: T) => ReactNode
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

export interface PmTableProps<T> {
  columns: PmTableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyText?: string
  page?: number
  total?: number
  rowsPerPage?: number
  onPageChange?: (page: number) => void
  onRowsPerPageChange?: (rowsPerPage: number) => void
}

const SKELETON_ROWS = 5

function TableSkeleton({ columns }: { columns: PmTableColumn<unknown>[] }) {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
        <TableRow key={`skeleton-${rowIdx}`}>
          {columns.map((_col, colIdx) => (
            <TableCell key={`sk-cell-${rowIdx}-${colIdx}`}>
              <Skeleton
                variant="text"
                width={colIdx === 0 ? '60%' : '80%'}
                sx={{ opacity: Math.max(0.02, 0.3 - rowIdx * 0.04) }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function PmTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyText = '暂无数据',
  page = 0,
  total = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}: PmTableProps<T>) {
  const hasPagination = onPageChange !== undefined

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        bgcolor: 'transparent',
        border: 1,
        borderColor: 'var(--pm-border)',
        borderRadius: '16px',
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
                  key={String(col.key)}
                  align={col.align || 'left'}
                  sx={{
                    width: col.width,
                    color: 'var(--pm-text-40)',
                    fontSize: 11,
                    fontWeight: 500,
                    borderBottom: '1px solid var(--pm-border)',
                  }}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={columns as PmTableColumn<unknown>[]} />
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ height: 120, color: 'var(--pm-text-30)', fontSize: 13 }}
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  hover
                  sx={{
                    '&:hover': { bgcolor: 'var(--pm-element)' },
                    '& td': { borderBottom: '1px solid var(--pm-border-light)' },
                  }}
                >
                  {columns.map(col => (
                    <TableCell
                      key={String(col.key)}
                      align={col.align || 'left'}
                      sx={{ color: 'var(--pm-text-60)', fontSize: 12 }}
                    >
                      {col.render ? col.render(item) : (item[col.key] as ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {hasPagination && total > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={e => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
          sx={{
            borderTop: '1px solid var(--pm-border-light)',
            color: 'var(--pm-text-40)',
            fontSize: 12,
            '.MuiTablePagination-toolbar': { minHeight: 64 },
            '.MuiTablePagination-selectIcon': { color: 'var(--pm-text-40)' },
          }}
        />
      )}
    </Paper>
  )
}
