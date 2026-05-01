import { useState } from 'react'
import DataTable, { type Column } from '../ui/DataTable'
import StatusChip from '../ui/StatusChip'
import type { PaginationState, TaskItem } from './taskManagement.types'
import { STATUS_TONE_MAP } from './taskManagement.types'
import Pagination from '../shared/data-display/Pagination'

type TaskListViewProps = {
  tasks: TaskItem[]
  pagination: PaginationState
  onPageChange: (page: number) => void
  onOpenTaskDetail?: (taskCode: string) => void
  onBatchAssign?: (taskCodes: string[]) => void
  onBatchUrge?: (taskCodes: string[]) => void
  onBatchExport?: (taskCodes: string[]) => void
}

const SLA_MAP: Record<string, { bg: string; color: string; label: string }> = {
  正常: { bg: 'var(--pm-green-15)', color: 'var(--pm-green)', label: '正常' },
  即将超时: { bg: 'var(--pm-orange-15)', color: 'var(--pm-orange-light)', label: '即将超时' },
  超时: { bg: 'var(--pm-red-15)', color: 'var(--pm-red)', label: '超时' },
}

function SlaBadge({ value }: { value: string }) {
  const c = SLA_MAP[value] ?? {
    bg: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.40)',
    label: value,
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        background: c.bg,
        color: c.color,
      }}
    >
      {c.label}
    </span>
  )
}

function CodeCell({ value }: { value: string }) {
  return (
    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)', fontFamily: 'monospace' }}>
      {value}
    </span>
  )
}

function TaskNameCell({ row }: { row: TaskItem }) {
  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block',
        maxWidth: 260,
      }}
    >
      {row.name}
    </span>
  )
}

function OwnerCell({ value }: { value: string }) {
  return <span style={{ fontSize: 13, color: '#fff' }}>{value || '—'}</span>
}

function DateCell({ value }: { value: string }) {
  return <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)' }}>{value || '—'}</span>
}

function ActionCell() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 10,
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
    </span>
  )
}

const columns: Column<TaskItem>[] = [
  { key: 'code', label: '编号', width: 130, render: v => <CodeCell value={v as string} /> },
  { key: 'name', label: '任务名称', render: (_, row) => <TaskNameCell row={row} /> },
  {
    key: 'status',
    label: '状态',
    width: 100,
    render: (_, row) => (
      <StatusChip label={row.status} tone={STATUS_TONE_MAP[row.status] ?? 'neutral'} />
    ),
  },
  { key: 'owner', label: '负责人', width: 90, render: v => <OwnerCell value={v as string} /> },
  {
    key: 'plannedEndAt',
    label: '计划结束',
    width: 110,
    render: v => <DateCell value={v as string} />,
  },
  { key: 'slaStatus', label: 'SLA', width: 90, render: v => <SlaBadge value={v as string} /> },
  { key: 'actions', label: '', width: 50, render: () => <ActionCell /> },
]

const TaskListView = ({
  tasks,
  pagination,
  onPageChange,
  onOpenTaskDetail,
  onBatchAssign,
  onBatchUrge,
  onBatchExport,
}: TaskListViewProps) => {
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set())

  if (tasks.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
          color: 'rgba(255,255,255,0.40)',
          fontSize: 14,
        }}
      >
        暂无任务数据
      </div>
    )
  }

  return (
    <div>
      <DataTable
        columns={columns}
        rows={tasks}
        rowKey={r => r.code}
        onRowClick={row => onOpenTaskDetail?.(row.code)}
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        batchActions={
          <>
            <button
              type="button"
              style={batchBtnStyle}
              onClick={() => onBatchAssign?.(Array.from(selectedKeys).map(String))}
            >
              批量分配
            </button>
            <button
              type="button"
              style={batchBtnStyle}
              onClick={() => onBatchUrge?.(Array.from(selectedKeys).map(String))}
            >
              批量催办
            </button>
            <button
              type="button"
              style={batchBtnStyle}
              onClick={() => onBatchExport?.(Array.from(selectedKeys).map(String))}
            >
              导出选中
            </button>
          </>
        }
      />

      <Pagination
        total={pagination.total}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        onPageChange={onPageChange}
        classNamePrefix="tm"
      />
    </div>
  )
}

const batchBtnStyle: React.CSSProperties = {
  padding: '5px 12px',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 14,
  background: 'transparent',
  color: 'rgba(255,255,255,0.70)',
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

export default TaskListView
