import { useState, Component, type ErrorInfo, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SettingsProvider, useSettings } from '@/hooks/useSettings'
import TaskListPage from './pages/tasks/TaskListPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import TaskDetailPage from './pages/tasks/TaskDetailPage'
import TaskDetailSheet from './pages/tasks/TaskDetailSheet'
import SettingsPage from './pages/settings/SettingsPage'
import PersonnelListPage from './pages/personnel/PersonnelListPage'
import PersonnelDetailPage from './pages/personnel/PersonnelDetailPage'
import ProjectListPage from './pages/projects/ProjectListPage'
import ProjectDetailPage from './pages/projects/ProjectDetailPage'
import { WBSView } from '@/pages/wbs/WBSView'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import type { TaskItem } from '@/types/task'
import TemplateListPage from './pages/templates/TemplateListPage'
import TemplateDetailPage from './pages/templates/TemplateDetailPage'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Dashboard Error:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 40,
            color: 'red',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            background: '#fff',
            minHeight: '100vh',
          }}
        >
          <h2>Dashboard Error</h2>
          <p>
            <strong>
              {this.state.error.name}: {this.state.error.message}
            </strong>
          </p>
          <pre style={{ fontSize: 12, marginTop: 20 }}>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function SiteHeaderWithTitle() {
  const path = useLocation().pathname
  const titles: Record<string, string> = {
    '/tasks': '任务管理',
    '/projects': '项目管理',
    '/templates': '模板中心',
    '/personnel': '人员管理',
    '/settings': '系统设置',
  }

  // 详情页：显示面包屑
  const segments = path.split('/').filter(Boolean)
  if (
    segments.length >= 2 &&
    segments[0] === 'projects' &&
    segments[1] !== undefined &&
    segments[1] !== 'new'
  ) {
    const projectCode = segments[1]
    return (
      <SiteHeader breadcrumbs={[{ label: '项目管理', to: '/projects' }, { label: projectCode }]} />
    )
  }

  const basePath = '/' + segments.slice(0, 1).join('/')
  return <SiteHeader title={titles[path] || titles[basePath] || '数字营建'} />
}

function LayoutWithSettings({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettings()

  return (
    <TooltipProvider>
      <SidebarProvider
        open={!settings.sidebarCollapsed}
        onOpenChange={open => updateSettings({ sidebarCollapsed: !open })}
      >
        <AppSidebar />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default function App() {
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
  const [listRefresh, setListRefresh] = useState(0)

  const handleCloseSheet = () => {
    setSelectedTask(null)
    setListRefresh(n => n + 1)
  }

  return (
    <SettingsProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route
              path="/dashboard/*"
              element={
                <LayoutWithSettings>
                  <SiteHeader title="仪表盘" />
                  <main className="@container/main flex flex-1 flex-col gap-4 p-6 md:gap-6">
                    <DashboardPage />
                  </main>
                </LayoutWithSettings>
              }
            />
            <Route
              path="/*"
              element={
                <LayoutWithSettings>
                  <SiteHeaderWithTitle />
                  <main className="@container/main flex flex-1 flex-col gap-4 p-6 md:gap-6">
                    <Routes>
                      <Route path="/" element={<Navigate to="/tasks" replace />} />
                      <Route path="/tasks/:code" element={<TaskDetailPage />} />
                      <Route
                        path="/tasks"
                        element={
                          <>
                            <TaskListPage
                              onSelectTask={setSelectedTask}
                              refreshTrigger={listRefresh}
                            />
                            <TaskDetailSheet task={selectedTask} onClose={handleCloseSheet} />
                          </>
                        }
                      />
                      <Route path="/projects" element={<ProjectListPage />} />
                      <Route path="/projects/new" element={<ProjectDetailPage />} />
                      <Route path="/projects/:projectCode" element={<ProjectDetailPage />} />
                      <Route path="/projects/:projectCode/wbs" element={<WBSView />} />
                      <Route path="/templates" element={<TemplateListPage />} />
                      <Route path="/templates/:id" element={<TemplateDetailPage />} />
                      <Route path="/personnel/:id" element={<PersonnelDetailPage />} />
                      <Route path="/personnel" element={<PersonnelListPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </main>
                </LayoutWithSettings>
              }
            />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </SettingsProvider>
  )
}
