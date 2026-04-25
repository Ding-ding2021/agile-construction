import { useEffect, useMemo, useState } from 'react'
import CreateProjectModeModal from '../personnel/CreateProjectModeModal'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import InsightsPanel from '../personnel/InsightsPanel'
import ProjectGridView from '../personnel/ProjectGridView'
import ProjectKanbanView from '../personnel/ProjectKanbanView'
import ProjectListView from '../personnel/ProjectListView'
import ProjectPlaceholderView from '../personnel/ProjectPlaceholderView'
import ProjectToolbar from '../personnel/ProjectToolbar'
import { statsCardConfig } from '../personnel/projectManagement.data'
import {
  calculateProjectStats,
  kanbanGroupByStage,
  processProjects,
  shouldResetPage,
} from '../personnel/projectManagement.selectors'
import type {
  CreateProjectFormData,
  ProjectFilters,
  ProjectItem,
  ProjectViewMode,
} from '../personnel/projectManagement.types'
import type { ProjectStatus } from '../../domain/projectStatusMachine'

type TransitionActionResult = {
  ok: boolean
  message: string
}

type ProjectManagementPageProps = {
  projects?: ProjectItem[]
  onProjectOpen?: (projectCode: string) => void
  onProjectCreate?: (formData: CreateProjectFormData) => TransitionActionResult
  onProjectStatusUpdate?: (
    projectCode: string,
    toStatus: ProjectStatus,
    reason?: string
  ) => TransitionActionResult
}

const defaultFilters: ProjectFilters = {
  statKey: 'all',
  searchQuery: '',
  groupBy: 'none',
  sortBy: 'default',
  riskOnly: false,
}

const ProjectManagementPage = ({
  projects,
  onProjectOpen,
  onProjectCreate,
  onProjectStatusUpdate,
}: ProjectManagementPageProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ProjectViewMode>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isInsightsOpen, setIsInsightsOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 获取当前路由 hash
  const currentHash =
    typeof window === 'undefined' ? '#/projects' : window.location.hash || '#/projects'

  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters)

  useEffect(() => {
    if (!feedback) {
      return
    }
    const timer = window.setTimeout(() => setFeedback(null), 2600)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const safeProjects = projects ?? []

  const stats = useMemo(() => calculateProjectStats(safeProjects), [safeProjects])

  const pagedResult = useMemo(
    () => processProjects(safeProjects, filters, { currentPage, pageSize }),
    [filters, currentPage, pageSize, safeProjects]
  )

  const fullResultForKanban = useMemo(
    () => processProjects(safeProjects, filters, { currentPage: 1, pageSize: 1000 }),
    [filters, safeProjects]
  )

  const kanbanGroups = useMemo(
    () => kanbanGroupByStage(fullResultForKanban.data),
    [fullResultForKanban.data]
  )

  const updateFilters = (nextPatch: Partial<ProjectFilters>) => {
    setFilters(prev => {
      const next = { ...prev, ...nextPatch }
      if (shouldResetPage(prev, next, pageSize, pageSize)) {
        setCurrentPage(1)
      }
      return next
    })
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    updateFilters({ searchQuery: query })
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setFilters(defaultFilters)
    setCurrentPage(1)
  }

  const handleProjectOpen = (project: ProjectItem) => {
    if (onProjectOpen) {
      onProjectOpen(project.code)
      return
    }

    if (typeof window !== 'undefined') {
      window.location.hash = `#/projects/${encodeURIComponent(project.code)}`
    }
  }

  const handleProjectCreate = (formData: CreateProjectFormData): TransitionActionResult => {
    const result = onProjectCreate?.(formData) ?? { ok: false, message: '创建能力暂未接入' }

    if (!result.ok) {
      setCreateError(result.message)
      return result
    }

    setCreateError(null)
    setFeedback({ tone: 'success', text: result.message })
    return result
  }

  const handleStatusUpdate = (
    projectCode: string,
    toStatus: ProjectStatus,
    reason?: string
  ): TransitionActionResult => {
    const result = onProjectStatusUpdate?.(projectCode, toStatus, reason) ?? {
      ok: false,
      message: '状态更新能力暂未接入',
    }
    setFeedback({ tone: result.ok ? 'success' : 'error', text: result.message })
    return result
  }

  return (
    <div className="pm-app">
      <div className="pm-glow pm-glow-left" />
      <div className="pm-glow pm-glow-right" />

      <AppSidebar
        currentHash={currentHash}
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
      />

      <div className="pm-workspace">
        <main className="pm-main">
          <PageHeader
            title="项目管理"
            subtitle="Project Management"
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            searchPlaceholder="搜索项目..."
          />

          <div className="pm-body">
            <StatsCards
              items={statsCardConfig.map(card => {
                const value =
                  card.key === 'all'
                    ? stats.total
                    : card.key === 'active'
                      ? stats.active
                      : card.key === 'pendingAcceptance'
                        ? stats.pendingAcceptance
                        : stats.risk

                const tone =
                  card.key === 'all'
                    ? 'blue'
                    : card.key === 'active'
                      ? 'green'
                      : card.key === 'pendingAcceptance'
                        ? 'purple'
                        : 'orange'

                return {
                  key: card.key,
                  icon: card.icon.split('/').pop() || '',
                  label: card.label,
                  value,
                  tone: tone as 'blue' | 'green' | 'purple' | 'orange',
                  delta: card.delta?.value != null ? String(card.delta.value) : undefined,
                  deltaIcon: card.delta?.icon.split('/').pop(),
                }
              })}
              activeKey={filters.statKey}
              onItemClick={key => updateFilters({ statKey: key as ProjectFilters['statKey'] })}
              assetBase="/assets/CodeBubbyAssets/3848_19"
            />

            <section className="pm-table-section">
              <ProjectToolbar
                viewMode={viewMode}
                onViewModeChange={mode => setViewMode(mode)}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                filters={filters}
                onFiltersChange={updateFilters}
                onResetFilters={handleResetFilters}
                onNewProject={() => {
                  setCreateError(null)
                  setIsCreateModalOpen(true)
                }}
              />

              {viewMode === 'list' && (
                <ProjectListView
                  projects={pagedResult.data}
                  pagination={pagedResult.pagination}
                  onProjectClick={handleProjectOpen}
                  onPageChange={page => setCurrentPage(page)}
                  onPageSizeChange={_size => undefined}
                  onProjectStatusUpdate={handleStatusUpdate}
                  feedback={feedback}
                  searchQuery={searchQuery}
                />
              )}

              {viewMode === 'grid' && (
                <ProjectGridView
                  projects={pagedResult.data}
                  pagination={pagedResult.pagination}
                  onProjectClick={handleProjectOpen}
                  onPageChange={page => setCurrentPage(page)}
                  onPageSizeChange={_size => undefined}
                  searchQuery={searchQuery}
                />
              )}

              {viewMode === 'kanban' && (
                <ProjectKanbanView
                  projects={fullResultForKanban.data}
                  groups={kanbanGroups}
                  onProjectClick={handleProjectOpen}
                  searchQuery={searchQuery}
                />
              )}

              {(viewMode === 'calendar' || viewMode === 'map') && (
                <ProjectPlaceholderView
                  viewMode={viewMode}
                  projects={fullResultForKanban.data}
                  searchQuery={searchQuery}
                />
              )}
            </section>
          </div>
        </main>
      </div>

      <button
        type="button"
        className="pm-insights-fab"
        aria-label="打开洞察"
        onClick={() => setIsInsightsOpen(true)}
      >
        <img src="/assets/CodeBubbyAssets/3848_19/55.svg" alt="" />
      </button>

      <InsightsPanel isOpen={isInsightsOpen} onClose={() => setIsInsightsOpen(false)} />

      <CreateProjectModeModal
        isOpen={isCreateModalOpen}
        submitting={false}
        errorMessage={createError}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleProjectCreate}
      />
    </div>
  )
}

export default ProjectManagementPage
