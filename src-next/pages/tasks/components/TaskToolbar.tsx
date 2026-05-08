import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  TableIcon,
  Columns3,
  Calendar as CalendarIcon,
  Filter,
  ArrowUpDown,
  Layers,
  Settings,
  Plus,
} from 'lucide-react'
import type { TaskStatus } from '@/types/task'

interface ColumnDef {
  id: string
  label: string
  defaultWidth: number
  visible: boolean
}

interface TaskToolbarProps {
  view: string
  onViewChange: (v: string) => void
  search: string
  onSearchChange: (v: string) => void
  statusFilter: TaskStatus[]
  onStatusFilterChange: (f: TaskStatus[] | ((prev: TaskStatus[]) => TaskStatus[])) => void
  slaFilter: string[]
  onSlaFilterChange: (f: string[] | ((prev: string[]) => string[])) => void
  sortKey: string
  sortDir: 'asc' | 'desc'
  onSortChange: (key: string, dir: string) => void
  groupBy: string | null
  onGroupChange: (g: string | null) => void
  groupOptions: { id: string; label: string }[]
  columnDefs: ColumnDef[]
  onToggleColumn: (id: string) => void
  onNewTask?: () => void
}

export function TaskToolbar({
  view,
  onViewChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  slaFilter,
  onSlaFilterChange,
  sortKey,
  sortDir,
  onSortChange,
  groupBy,
  onGroupChange,
  groupOptions,
  columnDefs,
  onToggleColumn,
  onNewTask,
}: TaskToolbarProps) {
  const allStatuses: TaskStatus[] = [
    '草稿',
    '待分配',
    '待执行',
    '执行中',
    '已暂停',
    '待提交',
    '待验收',
    '不通过',
    '已完成',
    '已关闭',
  ]

  return (
    <div className="flex items-center justify-between gap-4">
      <Tabs value={view} onValueChange={onViewChange}>
        <TabsList>
          <TabsTrigger value="table">
            <TableIcon className="size-4" />
            表格
          </TabsTrigger>
          <TabsTrigger value="kanban">
            <Columns3 className="size-4" />
            看板
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="size-4" />
            日历
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-2 ml-auto">
        <InputGroup className="max-w-[180px]">
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="搜索任务..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </InputGroup>
        <div className="w-px h-4 bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] gap-0.5 px-2 text-muted-foreground"
              >
                <Filter className="size-3.5" />
                筛选
                {(statusFilter.length > 0 || slaFilter.length > 0) &&
                  ` (${statusFilter.length + slaFilter.length})`}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>按状态</DropdownMenuLabel>
              {allStatuses.map(s => (
                <DropdownMenuCheckboxItem
                  key={s}
                  checked={statusFilter.includes(s)}
                  onCheckedChange={c => {
                    onStatusFilterChange(
                      c ? [...statusFilter, s] : statusFilter.filter(x => x !== s)
                    )
                  }}
                >
                  {s}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>按时效</DropdownMenuLabel>
              {['正常', '即将超时', '超时'].map(s => (
                <DropdownMenuCheckboxItem
                  key={s}
                  checked={slaFilter.includes(s)}
                  onCheckedChange={c => {
                    onSlaFilterChange(c ? [...slaFilter, s] : slaFilter.filter(x => x !== s))
                  }}
                >
                  {s}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] gap-0.5 px-2 text-muted-foreground"
              >
                <ArrowUpDown className="size-3.5" />
                排序
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuCheckboxItem
              checked={sortKey === 'plannedEndAt' && sortDir === 'asc'}
              onCheckedChange={() => onSortChange('plannedEndAt', 'asc')}
            >
              截止日期 ↑
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortKey === 'plannedEndAt' && sortDir === 'desc'}
              onCheckedChange={() => onSortChange('plannedEndAt', 'desc')}
            >
              截止日期 ↓
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortKey === 'progress' && sortDir === 'asc'}
              onCheckedChange={() => onSortChange('progress', 'asc')}
            >
              进度 ↑
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortKey === 'progress' && sortDir === 'desc'}
              onCheckedChange={() => onSortChange('progress', 'desc')}
            >
              进度 ↓
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 text-[11px] gap-0.5 px-2 text-muted-foreground ${groupBy ? 'text-primary font-medium' : ''}`}
              >
                <Layers className="size-3.5" />
                分组{groupBy ? ` (${groupOptions.find(g => g.id === groupBy)?.label})` : ''}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuCheckboxItem
              checked={groupBy === null}
              onCheckedChange={() => onGroupChange(null)}
            >
              不分组
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            {groupOptions.map(opt => (
              <DropdownMenuCheckboxItem
                key={opt.id}
                checked={groupBy === opt.id}
                onCheckedChange={() => onGroupChange(opt.id)}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {onNewTask && (
          <>
            <div className="w-px h-4 bg-border" />
            <Button size="sm" className="h-7 text-xs" onClick={onNewTask}>
              <Plus className="size-3.5" />
              新建任务
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground">
                <Settings className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>显示字段</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columnDefs.map(col => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.visible}
                  onCheckedChange={() => onToggleColumn(col.id)}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
