import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionCards } from '@/components/section-cards'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Search, TableIcon, MapIcon, Filter, ArrowUpDown, Plus } from 'lucide-react'
import { api } from '@/services/api'
import { ProjectTableView } from './components/ProjectTableView'
import { TaskPaginationBar } from '@/pages/tasks/components/TaskPaginationBar'
import { getProjectMetrics } from './constants/project-styles'
import type { ProjectItem } from '@/types/project'

const VIEWS = ['table', 'map'] as const
type ViewType = (typeof VIEWS)[number]

const STATUS_OPTIONS = ['待启动', '执行中', '待验收', '已验收', '已关闭', '已暂停']

export default function ProjectListPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewType>('table')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<'progress' | 'plannedOpenDate'>('progress')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    setLoading(true)
    api
      .getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = projects
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.owner ?? '').toLowerCase().includes(q)
      )
    }
    if (statusFilter.length > 0) {
      list = list.filter(p => statusFilter.includes(p.status))
    }
    list = [...list].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      return (a[sortKey] ?? 0) < (b[sortKey] ?? 0) ? -mul : mul
    })
    return list
  }, [projects, search, statusFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const metrics = useMemo(() => getProjectMetrics(filtered), [filtered])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  const toggleFilter = useCallback((s: string) => {
    setStatusFilter(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]))
    setPage(1)
  }, [])

  const isEmpty = !loading && filtered.length === 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          <SectionCards className="px-0" cardSize="lg" metrics={metrics} />

          <div className="flex items-center justify-between gap-4">
            <Tabs value={view} onValueChange={v => setView(v as ViewType)}>
              <TabsList>
                <TabsTrigger value="table">
                  <TableIcon className="size-4" />
                  表格
                </TabsTrigger>
                <TabsTrigger value="map" disabled>
                  <MapIcon className="size-4" />
                  地图
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <InputGroup className="max-w-[180px]">
                <InputGroupAddon align="inline-start">
                  <Search className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="搜索项目..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </InputGroup>
              <div className="w-px h-4 bg-border" />
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-0.5 px-2">
                      <Filter className="size-3.5" />
                      筛选{statusFilter.length > 0 && ` (${statusFilter.length})`}
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>按状态</DropdownMenuLabel>
                    {STATUS_OPTIONS.map(s => (
                      <DropdownMenuCheckboxItem
                        key={s}
                        checked={statusFilter.includes(s)}
                        onCheckedChange={() => toggleFilter(s)}
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
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-0.5 px-2">
                      <ArrowUpDown className="size-3.5" />
                      排序
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>排序方式</DropdownMenuLabel>
                    {[
                      { key: 'progress', label: '进度' },
                      { key: 'plannedOpenDate', label: '开业日期' },
                    ].map(o => (
                      <DropdownMenuCheckboxItem
                        key={o.key}
                        checked={sortKey === o.key}
                        onCheckedChange={() => {
                          setSortKey(o.key as typeof sortKey)
                          setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                        }}
                      >
                        {o.label} {sortKey === o.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" onClick={() => navigate('/projects/new')}>
                <Plus className="size-4" />
                新建项目
              </Button>
            </div>
          </div>

          {view === 'table' && <ProjectTableView projects={paged} loading={loading} />}
          {view === 'map' && (
            <div className="flex items-center justify-center h-48 text-sm text-muted-foreground rounded-md border border-border">
              地图视图 — 后续实现
            </div>
          )}

          {!isEmpty && totalPages > 1 && (
            <TaskPaginationBar
              page={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              total={filtered.length}
              rangeStart={(safePage - 1) * pageSize + 1}
              rangeEnd={Math.min(safePage * pageSize, filtered.length)}
              selectedCount={0}
            />
          )}
        </div>
      </div>
    </div>
  )
}
