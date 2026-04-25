import { Suspense, useEffect, useMemo, useState } from 'react'
import PersonnelPage from './components/personnel/PersonnelPage'
import ProjectDetailPage from './components/project/ProjectDetailPage'
import TaskDetailPage from './components/task/TaskDetailPage'
import { AppRouter } from './components/router/AppRouter'
import { readRouteFromHash, isRouterHandledPage, type AppRoute } from './config/routes'
import { getProjectByCode, projects as allProjects } from './data/projects'
import { getTaskDetailByCode } from './components/task/taskManagement.data'
import {
  buildProjectDetailTabHash,
  type ProjectDetailTab,
} from './components/project/projectTabs.shared'

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

  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#/projects'
    }

    const handleHashChange = () => {
      setRoute(readRouteFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const activeProject = useMemo(() => {
    if (route.page !== 'detail') {
      return null
    }
    return getProjectByCode(route.code) ?? null
  }, [route])

  const activeTaskDetail = useMemo(() => {
    if (route.page !== 'task-detail') {
      return null
    }
    return getTaskDetailByCode(route.taskCode)
  }, [route])

  const openProject = (projectCode: string, tab: ProjectDetailTab = 'overview') => {
    window.location.hash = buildProjectDetailTabHash(projectCode, tab)
  }

  const goToProjectList = () => {
    window.location.hash = '#/projects'
  }

  const goToTaskList = () => {
    window.location.hash = '#/tasks'
  }

  const openPersonnelUser = (userId: string) => {
    window.location.hash = `#/personnel/users/${encodeURIComponent(userId)}`
  }

  // detail 页面：注入 project 数据（AppRouter 无法处理需要外部数据的页面）
  if (route.page === 'detail' && activeProject) {
    return (
      <ProjectDetailPage project={activeProject} activeTab={route.tab} onBack={goToProjectList} />
    )
  }

  // task-detail 页面：注入 task 数据
  if (route.page === 'task-detail') {
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
    return <PersonnelPage onUserOpen={openPersonnelUser} />
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
  return <PersonnelPage onUserOpen={openPersonnelUser} />
}

export default App
