import { useState, useEffect, useMemo } from 'react'
import { SectionCards } from '@/components/section-cards'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { api } from '@/services/api'
import { ProjectTableView } from './components/ProjectTableView'
import { ProjectToolbar } from './components/ProjectToolbar'
import { getProjectMetrics } from './constants/project-styles'
import type { ProjectItem } from '@/types/project'

export default function ProjectListPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    setLoading(true)
    api
      .getProjects()
      .then((res: unknown) => {
        const data = res as { data?: ProjectItem[] } | ProjectItem[]
        const list = Array.isArray(data) ? data : (data.data ?? [])
        setProjects(list)
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return projects
    const q = search.toLowerCase()
    return projects.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.owner ?? '').toLowerCase().includes(q)
    )
  }, [projects, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const metrics = useMemo(() => getProjectMetrics(filtered), [filtered])

  useEffect(() => {
    setPage(1)
  }, [search])

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">项目管理</h1>
        <p className="text-sm text-muted-foreground">查看和管理所有门店建设项目</p>
      </div>

      <SectionCards metrics={metrics} />

      <ProjectToolbar search={search} onSearchChange={setSearch} onNewProject={() => {}} />

      <ProjectTableView projects={paged} loading={loading} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            共 {filtered.length} 条，第 {(safePage - 1) * pageSize + 1}-
            {Math.min(safePage * pageSize, filtered.length)} 条
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text="上一页"
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  className={safePage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <PaginationItem key={p}>
                  <PaginationLink
                    onClick={() => setPage(p)}
                    isActive={p === safePage}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  text="下一页"
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                  className={
                    safePage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
