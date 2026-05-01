import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import TaskDetailPage from './components/task/TaskDetailPage'
import { AppRouter } from './components/router/AppRouter'
import { readRouteFromHash, isRouterHandledPage, type AppRoute } from './config/routes'
import { goToProjectList, goToTaskList, goToPersonnelUser } from './config/navigation'
import { getProjectByCode, projects as allProjects } from './data/projects'
import { resolveTaskDetail } from './components/task/taskManagement.data'
import { taskRepository } from './services/repositories/taskRepository'
import type { TaskDetail } from './components/task/taskManagement.types'

const PersonnelPage = lazy(() => import('./components/personnel/PersonnelPage'))
const ProjectDetailPage = lazy(() => import('./components/project/ProjectDetailPage'))

const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      background: 'rgba(15, 23, 42, 0.95)',
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        border: '3px solid rgba(99, 102, 241, 0.28)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'pageLoaderSpin 0.9s linear infinite',
      }}
      aria-label="页面加载中"
      role="status"
    />
    <style>
      {`@keyframes pageLoaderSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
    </style>
  </div>
)

function App() {
  const [route, setRoute] = useState<AppRoute>(() => readRouteFromHash())
  const [activeTaskDetail, setActiveTaskDetail] = useState<TaskDetail | null>(null)
  const [isTaskDetailLoading, setIsTaskDetailLoading] = useState(false)

  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#') {
      goToProjectList()
    }

    const handleHashChange = () => {
      setRoute(readRouteFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // 全页任务详情：API 优先，降级到 mock
  useEffect(() => {
    if (route.page !== 'task-detail') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTaskDetail(null)
      return
    }

    let cancelled = false
    setIsTaskDetailLoading(true)

    // 先通过 mock 数据快速展示，再异步尝试 API
    const mockDetail = resolveTaskDetail(route.taskCode)
    if (mockDetail) {
      setActiveTaskDetail(mockDetail)
      setIsTaskDetailLoading(false)
    }

    // 异步尝试从 API 获取更完整的数据
    taskRepository
      .loadTasks('__all')
      .then(tasks => {
        if (cancelled) return
        const task = tasks?.find(t => t.code === route.taskCode)
        if (!task?.projectId) return
        return taskRepository.getTaskDetail(task.projectId, route.taskCode)
      })
      .then(apiDetail => {
        if (cancelled || !apiDetail) return
        const fallback = resolveTaskDetail(route.taskCode)
        if (fallback) {
          // 合并 API 数据与 mock 数据
          setActiveTaskDetail({
            ...fallback,
            ...apiDetail,
            flowLogs: apiDetail.flowLogs.length > 0 ? apiDetail.flowLogs : fallback.flowLogs,
            attachments:
              apiDetail.attachments.length > 0 ? apiDetail.attachments : fallback.attachments,
            checklist: apiDetail.checklist.length > 0 ? apiDetail.checklist : fallback.checklist,
            executionStandards:
              apiDetail.executionStandards.length > 0
                ? apiDetail.executionStandards
                : fallback.executionStandards,
            acceptanceStandards:
              apiDetail.acceptanceStandards.length > 0
                ? apiDetail.acceptanceStandards
                : fallback.acceptanceStandards,
            relations: apiDetail.relations.length > 0 ? apiDetail.relations : fallback.relations,
          })
        } else {
          setActiveTaskDetail(apiDetail)
        }
        setIsTaskDetailLoading(false)
      })
      .catch(() => {
        if (!cancelled) setIsTaskDetailLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [route])

  const activeProject = useMemo(() => {
    if (route.page !== 'detail') {
      return null
    }
    return getProjectByCode(route.code) ?? null
  }, [route])

  // detail 页面：注入 project 数据（AppRouter 无法处理需要外部数据的页面）
  if (route.page === 'detail' && activeProject) {
    return (
      <Suspense fallback={<PageLoader />}>
        <ProjectDetailPage project={activeProject} activeTab={route.tab} onBack={goToProjectList} />
      </Suspense>
    )
  }

  // task-detail 页面：注入 task 数据
  if (route.page === 'task-detail') {
    if (isTaskDetailLoading) {
      return <PageLoader />
    }

    if (activeTaskDetail) {
      return <TaskDetailPage taskDetail={activeTaskDetail} onBack={goToTaskList} />
    }

    return (
      <div style={{ padding: 40, color: '#fff' }}>
        <h1>任务不存在</h1>
        <button type="button" onClick={goToTaskList}>
          返回任务列表
        </button>
      </div>
    )
  }

  // new-detail 页面：创建新项目
  if (route.page === 'new-detail') {
    // TODO: 实现新项目创建页面
    return (
      <div style={{ padding: 40, color: '#fff' }}>
        <h1>新建项目</h1>
        <p>mode: {route.mode}</p>
        <button type="button" onClick={goToProjectList}>
          返回项目列表
        </button>
      </div>
    )
  }

  // personnel 页面：注入 onUserOpen 回调
  if (route.page === 'personnel') {
    return (
      <Suspense fallback={<PageLoader />}>
        <PersonnelPage onUserOpen={goToPersonnelUser} />
      </Suspense>
    )
  }

  // 其他所有页面由 AppRouter 处理
  if (isRouterHandledPage(route.page)) {
    return (
      <Suspense fallback={<PageLoader />}>
        <AppRouter route={route} projects={allProjects} />
      </Suspense>
    )
  }

  // Fallback
  return (
    <Suspense fallback={<PageLoader />}>
      <PersonnelPage onUserOpen={goToPersonnelUser} />
    </Suspense>
  )
}

export default App
