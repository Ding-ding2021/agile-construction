'use client'

import * as React from 'react'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type Row,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChevronRightIcon,
  Columns3Icon,
  ChevronDownIcon,
  GripVerticalIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon as ChevronRightNavIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ArrowState = 'expanded' | 'collapsed' | 'none'
type LineColor = 'default' | 'checked' | 'indeterminate'

const LINE_TOGGLE_COLOR_MAP: Record<LineColor, string> = {
  default: 'text-muted-foreground',
  checked: 'text-foreground',
  indeterminate: 'text-muted-foreground',
}

const TreeToggleArrow = React.memo(function TreeToggleArrow({
  state,
  onClick,
  lineColor = 'default',
}: {
  state: ArrowState
  onClick: () => void
  lineColor?: LineColor
}) {
  if (state === 'none') {
    return <span className="inline-flex size-5 shrink-0" />
  }

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className="inline-flex size-5 items-center justify-center rounded hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={state === 'expanded' ? '折叠' : '展开'}
    >
      <ChevronRightIcon
        className={cn(
          'size-4 transition-transform duration-200',
          LINE_TOGGLE_COLOR_MAP[lineColor],
          state === 'expanded' && 'rotate-90'
        )}
      />
    </button>
  )
})

interface TreeRowMeta {
  isLastChild: boolean
  ancestorHasNext: boolean[]
  subRowCount: number
}

function computeTreeMetadata<TData extends TreeDataItem>(
  rows: Row<TData>[]
): Map<string, TreeRowMeta> {
  const meta = new Map<string, TreeRowMeta>()

  function walk(rows: Row<TData>[], ancestorHasNext: boolean[]) {
    rows.forEach((row, index) => {
      const isLast = index === rows.length - 1
      const subRows = (row.subRows ?? []) as Row<TData>[]
      meta.set(row.id, {
        isLastChild: isLast,
        ancestorHasNext,
        subRowCount: subRows.length,
      })
      if (subRows.length > 0) {
        walk(subRows, [...ancestorHasNext, !isLast])
      }
    })
  }

  walk(rows, [])
  return meta
}

const LEVEL_INDENT = 28

const LINE_COLOR_MAP: Record<LineColor, string> = {
  default: 'bg-border',
  checked: 'bg-foreground',
  indeterminate: 'bg-muted-foreground',
}

const TreeNodeLines = React.memo(function TreeNodeLines({
  ancestorHasNext,
  isLastChild,
  lineColor = 'default',
}: {
  ancestorHasNext: boolean[]
  isLastChild: boolean
  lineColor?: LineColor
}) {
  const lineClass = LINE_COLOR_MAP[lineColor]

  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden="true"
      style={{ width: ancestorHasNext.length * LEVEL_INDENT + LEVEL_INDENT }}
    >
      {ancestorHasNext.map((hasNext, i) => (
        <div
          key={i}
          className="relative flex items-center justify-center"
          style={{ width: LEVEL_INDENT }}
        >
          <div className={cn('w-px h-full', lineClass, !hasNext && 'invisible')} />
        </div>
      ))}
      <div className="relative flex items-center justify-center" style={{ width: LEVEL_INDENT }}>
        <div className={cn('absolute top-0 w-px h-1/2', lineClass)} />
        <div className={cn('absolute left-1/2 top-1/2 w-1/2 h-px', lineClass)} />
        {!isLastChild && (
          <div className={cn('absolute left-1/2 top-1/2 bottom-0 w-px', lineClass)} />
        )}
      </div>
    </div>
  )
})

interface TreeDataItem {
  id: string | number
  subRows?: TreeDataItem[]
}

interface TreeDataTableProps<TData extends TreeDataItem> {
  data: TData[]
  columns: ColumnDef<TData>[]
  getSubRows?: (item: TData) => TData[]
  getRowId?: (item: TData) => string
  onSelectionChange?: (selectedIds: Set<string>) => void
}

function getDescendantIds<TData extends TreeDataItem>(row: Row<TData>): string[] {
  const ids: string[] = []
  const subRows = row.subRows ?? []
  for (const subRow of subRows) {
    ids.push(subRow.id)
    ids.push(...getDescendantIds(subRow))
  }
  return ids
}

function getAllNodeIds<TData extends TreeDataItem>(row: Row<TData>): string[] {
  return [row.id, ...getDescendantIds(row)]
}

function collectCheckboxState<TData extends TreeDataItem>(
  row: Row<TData>,
  selectedIds: Set<string>
): { checked: boolean; indeterminate: boolean } {
  const subRows = row.subRows ?? []
  if (subRows.length === 0) {
    return { checked: selectedIds.has(row.id), indeterminate: false }
  }
  const childStates = subRows.map(sr => collectCheckboxState(sr, selectedIds))
  const allChecked = childStates.every(s => s.checked)
  const someChecked = childStates.some(s => s.checked || s.indeterminate)
  return {
    checked: allChecked,
    indeterminate: !allChecked && someChecked,
  }
}

function DragHandle({ id }: { id: string | number }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">拖拽排序</span>
    </Button>
  )
}

const INDENT_PER_LEVEL = 28

function TreeCheckboxCellSimple<TData extends TreeDataItem>({
  row,
  selectedIds,
  onToggle,
}: {
  row: Row<TData>
  selectedIds: Set<string>
  onToggle: (row: Row<TData>) => void
}) {
  const subRows = (row.subRows ?? []) as Row<TData>[]
  const childStates = subRows.map(sr => collectCheckboxState(sr, selectedIds))
  const allChecked = childStates.every(s => s.checked)
  const someChecked = childStates.some(s => s.checked || s.indeterminate)
  const checked = subRows.length === 0 ? selectedIds.has(row.id) : allChecked
  const indeterminate = !allChecked && someChecked

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        onCheckedChange={() => onToggle(row)}
        aria-label="选择行"
      />
    </div>
  )
}

function DraggableTreeRow<TData extends TreeDataItem>({
  row,
  selectedIds,
  onToggle,
}: {
  row: Row<TData>
  selectedIds: Set<string>
  onToggle: (row: Row<TData>) => void
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  })
  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map(cell => {
        if (cell.column.id === 'drag') {
          return (
            <TableCell key={cell.id}>
              <DragHandle id={row.id} />
            </TableCell>
          )
        }
        if (cell.column.id === 'select') {
          return (
            <TableCell key={cell.id}>
              <TreeCheckboxCellSimple row={row} selectedIds={selectedIds} onToggle={onToggle} />
            </TableCell>
          )
        }
        return (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export function TreeDataTable<TData extends TreeDataItem>({
  data: initialData,
  columns,
  getSubRows,
  getRowId,
  onSelectionChange,
}: TreeDataTableProps<TData>) {
  const resolvedGetSubRows = React.useCallback(
    (item: TData) => (getSubRows ? getSubRows(item) : (item.subRows ?? [])) as TData[],
    [getSubRows]
  )

  const [data, setData] = React.useState(() => initialData)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const tableColumns = React.useMemo(() => {
    return [
      {
        id: 'drag',
        header: () => null,
        cell: () => null,
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<TData>,
      {
        id: 'select',
        header: ({ table }) => {
          const flatRows = table.getRowModel().rows
          const allOnPage = flatRows.length > 0
          const allSelected = flatRows.every(r => selectedIds.has(r.id))
          const someSelected = flatRows.some(r => selectedIds.has(r.id))

          return (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={allOnPage && allSelected}
                indeterminate={(allOnPage && !allSelected && someSelected) || undefined}
                onCheckedChange={value => {
                  if (value) {
                    const next = new Set(selectedIds)
                    flatRows.forEach(r => {
                      getAllNodeIds(r).forEach(id => next.add(id))
                    })
                    setSelectedIds(next)
                    onSelectionChange?.(next)
                  } else {
                    const next = new Set(selectedIds)
                    flatRows.forEach(r => {
                      getAllNodeIds(r).forEach(id => next.delete(id))
                    })
                    setSelectedIds(next)
                    onSelectionChange?.(next)
                  }
                }}
                aria-label="全选"
              />
            </div>
          )
        },
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<TData>,
      ...columns,
    ]
  }, [columns, selectedIds, onSelectionChange])

  const resolvedRowId = React.useCallback(
    (row: TData) => (getRowId ? getRowId(row) : String(row.id)),
    [getRowId]
  )

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
      expanded,
    },
    getRowId: resolvedRowId,
    getSubRows: resolvedGetSubRows,
    getRowCanExpand: row => {
      const subRows = resolvedGetSubRows(row.original)
      return subRows.length > 0
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  })

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => table.getRowModel().rows.map(r => r.id),
    [table]
  )

  function handleToggleRow(row: Row<TData>) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      const rowIds = getAllNodeIds(row)
      if (next.has(row.id)) {
        rowIds.forEach(id => next.delete(id))
      } else {
        rowIds.forEach(id => next.add(id))
      }
      onSelectionChange?.(next)
      return next
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!active || !over || active.id === over.id) return

    setData(prev => {
      const activeId = String(active.id)
      const overId = String(over.id)
      const parentMap = new Map<string, { parentId: string | null; item: TData }>()

      function walk(items: TData[], pid: string | null) {
        items.forEach(item => {
          parentMap.set(String(item.id), { parentId: pid, item })
          walk(resolvedGetSubRows(item), String(item.id))
        })
      }
      walk(prev, null)

      const activeInfo = parentMap.get(activeId)
      const overInfo = parentMap.get(overId)
      if (!activeInfo || !overInfo) return prev
      if (activeInfo.parentId !== overInfo.parentId) return prev

      function getSiblingArray(items: TData[], parentId: string | null): TData[] | null {
        if (parentId === null) return items
        for (const item of items) {
          if (String(item.id) === parentId) {
            return resolvedGetSubRows(item)
          }
          const found = getSiblingArray(resolvedGetSubRows(item), parentId)
          if (found) return found
        }
        return null
      }

      const siblings = getSiblingArray(prev, activeInfo.parentId)
      if (!siblings) return prev

      const oldIndex = siblings.indexOf(activeInfo.item)
      const overItem = overInfo.item
      const newIndex = siblings.indexOf(overItem)
      if (oldIndex === -1 || newIndex === -1) return prev

      const moved = arrayMove(siblings, oldIndex, newIndex)

      function replaceSiblings(
        items: TData[],
        parentId: string | null,
        newSiblings: TData[]
      ): TData[] {
        if (parentId === null) return newSiblings
        return items.map(item => {
          if (String(item.id) === parentId) {
            return { ...item, subRows: newSiblings }
          }
          const children = resolvedGetSubRows(item)
          if (children.length > 0) {
            return {
              ...item,
              subRows: replaceSiblings(children, parentId, newSiblings),
            }
          }
          return item
        })
      }

      return replaceSiblings(prev, activeInfo.parentId, moved)
    })
  }

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
              <Columns3Icon data-icon="inline-start" />
              列显示
              <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {table
                .getAllColumns()
                .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border border-border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows.length > 0 ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map(row => (
                      <DraggableTreeRow
                        key={row.id}
                        row={row as Row<TData>}
                        selectedIds={selectedIds}
                        onToggle={handleToggleRow}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                      暂无数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            已选 {selectedIds.size} 项
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="tree-rows-per-page" className="text-sm font-medium">
                每页行数
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={value => {
                  table.setPageSize(Number(value))
                }}
                items={[10, 20, 30, 40, 50].map(pageSize => ({
                  label: `${pageSize}`,
                  value: `${pageSize}`,
                }))}
              >
                <SelectTrigger size="sm" className="w-20" id="tree-rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map(pageSize => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              第 {table.getState().pagination.pageIndex + 1} 页，共 {table.getPageCount()} 页
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">首页</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">上一页</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">下一页</span>
                <ChevronRightNavIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">末页</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
