import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/page-layout'
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
import {
  TableIcon,
  Columns3,
  CalendarIcon,
  MapIcon,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
} from 'lucide-react'
import { api } from '@/services/api'
import { ProjectTableView } from './components/ProjectTableView'
import { TaskPaginationBar } from '@/pages/tasks/components/TaskPaginationBar'
import { getProjectMetrics } from './constants/project-styles'
import type { ProjectItem } from '@/types/project'

const VIEWS = ['table', 'kanban', 'calendar', 'map'] as const
type ViewType = (typeof VIEWS)[number]

const HEALTH_OPTIONS = ['正常', '关注', '预警', '严重']

export default function ProjectListPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewType>('table')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [healthFilter, setHealthFilter] = useState<string[]>([])
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
    if (healthFilter.length > 0)
      list = list.filter(p => healthFilter.includes(p.healthStatus ?? ''))
    list = [...list].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'progress') return (a.progress - b.progress) * mul
      return String(a.plannedOpenDate ?? '').localeCompare(String(b.plannedOpenDate ?? '')) * mul
    })
    return list
  }, [projects, search, healthFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const metrics = useMemo(() => getProjectMetrics(filtered), [filtered])

  useEffect(() => {
    setPage(1)
  }, [search, healthFilter])

  const toggleFilter = useCallback((s: string) => {
    setHealthFilter(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]))
  }, [])

  const isEmpty = !loading && filtered.length === 0

  return (
    <PageLayout>
      <SectionCards className="px-0" cardSize="lg" metrics={metrics} />

      <div className="flex items-center justify-between gap-4">
        <Tabs value={view} onValueChange={v => setView(v as ViewType)}>
          <TabsList>
            <TabsTrigger value="table">
              <TableIcon className="size-4" /> 表格
            </TabsTrigger>
            <TabsTrigger value="kanban" disabled>
              <Columns3 className="size-4" /> 看板
            </TabsTrigger>
            <TabsTrigger value="calendar" disabled>
              <CalendarIcon className="size-4" /> 日历
            </TabsTrigger>
            <TabsTrigger value="map" disabled>
              <MapIcon className="size-4" /> 地图
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
              aria-label="搜索项目"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </InputGroup>
          <div className="w-px h-4 bg-border" />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-0.5 px-2 text-muted-foreground"
                >
                  <Filter className="size-3.5" />
                  健康度{healthFilter.length > 0 && ` (${healthFilter.length})`}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuGroup>
                <DropdownMenuLabel>按健康度</DropdownMenuLabel>
                {HEALTH_OPTIONS.map(s => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={healthFilter.includes(s)}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-0.5 px-2 text-muted-foreground"
                >
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
            <Plus className="size-4" /> 新建项目
          </Button>
        </div>
      </div>

      {view === 'table' && <ProjectTableView projects={paged} loading={loading} />}
      {view !== 'table' && (
        <div className="flex items-center justify-center h-48 text-sm text-muted-foreground rounded-md border border-border">
          {view === 'kanban' ? '看板' : view === 'calendar' ? '日历' : '地图'}视图 — 后续实现
        </div>
      )}

      {!isEmpty && (
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
    </PageLayout>
  )
}
