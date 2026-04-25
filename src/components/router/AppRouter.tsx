/**
 * AppRouter - 配置驱动的路由渲染器
 *
 * 职责：根据当前 route 从注册表查找对应页面组件并渲染。
 * 消除 App.tsx 中的硬编码 if/else 路由判断。
 *
 * 分层策略：
 * - 简单页面（无 props 或仅透传 commonProps）：由 AppRouter 自动渲染
 * - 复杂页面（detail / new-detail 等）：保留在 App.tsx 中作为特例处理
 *
 * @see docs/02-architecture/routing-state-migration-plan.md
 */

import { Suspense } from 'react'
import type { AppRoute } from '../../config/routes'
import { PARAM_PAGES, getPageComponent } from '../../config/routes'

// ─── Helper: 提取 route 中的页面专属参数 ─────────────────────────

const extractRouteParams = (route: AppRoute): Record<string, unknown> => {
  switch (route.page) {
    case 'personnel-detail':
      return { userId: route.userId }
    case 'procurement-supplier-detail':
      return { supplierId: route.supplierId }
    case 'standard-template-detail':
      return { templateId: route.templateId }
    default:
      return {}
  }
}

// ─── AppRouter Props ─────────────────────────────────────────────────

type AppRouterProps = {
  route: AppRoute
  // 全局数据（供 DATA_PAGES 使用）
  projects?: Array<{ code: string; name: string; status: string }>
  // 导航回调（供 CALLBACK_PAGES 使用）
  onOpenPersonnelDetail?: (userId: string) => void
  onOpenSupplier?: (supplierId: string) => void
}

// ─── AppRouter Component ─────────────────────────────────────────────

export function AppRouter({
  route,
  projects,
  onOpenPersonnelDetail,
  onOpenSupplier: _onOpenSupplier,
}: AppRouterProps) {
  const entry = getPageComponent(route.page)

  if (!entry) {
    console.warn(`[AppRouter] No component registered for page: ${route.page}`)
    return <PageLoader />
  }

  const PageComponent = entry.component

  // 组装页面 props（不可变方式，避免 react-hooks/immutability 报错）
  const pageProps: Record<string, unknown> = {
    // 1. 路由参数页面：注入 route 中的参数
    ...(PARAM_PAGES.includes(route.page) ? extractRouteParams(route) : {}),

    // 2. 带回调页面：注入外部回调（用 useCallback 包裹避免重新渲染）
    ...(route.page === 'personnel' && onOpenPersonnelDetail
      ? { onUserOpen: onOpenPersonnelDetail }
      : {}),

    // 3. 带数据页面：注入全局数据
    ...((route.page === 'contracts' || route.page === 'projects') && projects ? { projects } : {}),
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <PageComponent {...pageProps} />
    </Suspense>
  )
}

// ─── PageLoader（路由切换时的过渡）───────────────────────────────────

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
