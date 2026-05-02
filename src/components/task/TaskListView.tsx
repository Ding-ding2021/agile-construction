import { useState } from 'react'
import { PmTable } from '../shared/mui'
import type { PmTableColumn } from '../shared/mui'
import StatusChip from '../ui/StatusChip'
import type { PaginationState, TaskItem } from './taskManagement.types'
import { STATUS_TONE_MAP } from './taskManagement.types'

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

const columns: PmTableColumn<TaskItem>[] = [
  { key: 'code' as keyof TaskItem, header: '编号', width: 130, render: item => <CodeCell value={item.code} /> },
  { key: 'name' as keyof TaskItem, header: '任务名称', render: item => <TaskNameCell row={item} /> },
  { key: 'status' as keyof TaskItem, header: '状态', width: 100, render: item => <StatusChip label={item.status} tone={STATUS_TONE_MAP[item.status] ?? 'neutral'} /> },
  { key: 'owner' as keyof TaskItem, header: '负责人', width: 90, render: item => <OwnerCell value={item.owner} /> },
  { key: 'plannedEndAt' as keyof TaskItem, header: '计划结束', width: 110, render: item => <DateCell value={item.plannedEndAt} /> },
  { key: 'slaStatus' as keyof TaskItem, header: 'SLA', width: 90, render: item => <SlaBadge value={item.slaStatus} /> },
  { key: 'code' as keyof TaskItem, header: '', width: 50, render: () => <ActionCell /> },
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
    <PmTable
      columns={columns}
      data={tasks}
      rowKey={r => r.code}
      selectable
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      onRowClick={row => onOpenTaskDetail?.(row.code)}
      batchActions={
        <>
          <button type="button" style={batchBtnStyle} onClick={() => onBatchAssign?.(Array.from(selectedKeys).map(String))}>批量分配</button>
          <button type="button" style={batchBtnStyle} onClick={() => onBatchUrge?.(Array.from(selectedKeys).map(String))}>批量催办</button>
          <button type="button" style={batchBtnStyle} onClick={() => onBatchExport?.(Array.from(selectedKeys).map(String))}>导出选中</button>
        </>
      }
      page={pagination.currentPage - 1}
      total={pagination.total}
      rowsPerPage={pagination.pageSize}
      onPageChange={page => onPageChange(page + 1)}
    />
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
