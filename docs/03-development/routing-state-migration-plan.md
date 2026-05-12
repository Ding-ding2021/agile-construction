---
id: DOC-02-ARCH-ROUTING-STATE-MIGRATION
number: DEV-008
domain: development
category: technical-design
title: 路由渲染与状态管理优化方案
owner: docs-maintainer
status: deprecated
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
date: 2026-04-25
---

# 路由渲染与状态管理优化方案

> **背景**：`src/config/routes.ts` 已建立现代化的路由注册表，但 `App.tsx` 仍使用 17 个 if/else 硬编码渲染；Zustand `persist` 已落地，但手动持久化逻辑未清理。  
> **目标**：让路由系统「配置驱动」、让状态管理「单源可信」、让 `App.tsx` 回归「应用壳」本质。

---

## 一、现状架构诊断

### 1.1 路由系统：「半身不遂」

```
┌─────────────────────────────────────────────────────────────┐
│  routes.ts（已现代化）                                       │
│  ├─ ROUTE_PATHS（常量）                                      │
│  ├─ AppRoute（Discriminated Union）                          │
│  ├─ pageComponentRegistry（组件注册表）                      │
│  └─ getPageComponent()（查询函数）                           │
├─────────────────────────────────────────────────────────────┤
│  App.tsx（仍用石器时代的 if/else）                           │
│  ├─ if (route.page === 'detail') → <ProjectDetailPage ...>  │
│  ├─ if (route.page === 'tasks')  → <TaskManagementPage />    │
│  ├─ ...（共 17 个分支）                                     │
│  └─ fallback → <ProjectManagementPage />                    │
└─────────────────────────────────────────────────────────────┘
```

**问题**：新增页面需要同时修改 `routes.ts`（注册组件）和 `App.tsx`（添加 if/else），违背 DRY 原则。

### 1.2 状态管理：「双头 write」

```
┌─────────────────────────────────────────────────────────────┐
│  Zustand Store（projectStore.ts）                            │
│  └─ persist middleware → 自动写入 localStorage               │
├─────────────────────────────────────────────────────────────┤
│  App.tsx（手动持久化）                                       │
│  └─ useEffect → projectRepository.saveState()               │
│      → 再次写入 localStorage                                 │
└─────────────────────────────────────────────────────────────┘
```

**问题**：同一数据源存在两条写入路径，可能导致竞态或数据不一致。

### 1.3 App.tsx 职责分布

| 职责                                | 当前位置                                  | 目标位置                 |
| ----------------------------------- | ----------------------------------------- | ------------------------ |
| 路由渲染                            | App.tsx（17 个 if/else）                  | `AppRouter.tsx`          |
| 状态订阅                            | App.tsx（useProjectStore selector）       | 保留在 App.tsx           |
| 业务 Action（状态流转、创建项目等） | App.tsx（~200 行函数）                    | `projectActions.ts`      |
| 数据持久化                          | App.tsx（useEffect 调用 Repository）      | Zustand persist 全权负责 |
| 全局事件监听                        | App.tsx（hashchange、pm:remote-fallback） | 保留在 App.tsx           |

---

## 二、目标架构

### 2.1 路由层：配置驱动渲染

```
Hash Change → routes.ts（parse）→ AppRoute
                                ↓
                        AppRouter.tsx
                                ↓
                    pageComponentRegistry
                                ↓
                    propsMapper（按需注入）
                                ↓
                         Page Component
```

**核心设计**：`AppRouter` 是一个纯渲染组件，零业务逻辑。它只做三件事：

1. 根据 `route.page` 从注册表查找组件
2. 根据 `route` 和 `commonProps` 计算最终 props
3. 用 `<Suspense>` 包裹并渲染

### 2.2 状态层：Zustand 单源可信

```
User Action → projectActions.ts
                    ↓
            useProjectStore.getState().updateXxx()
                    ↓
            Zustand persist → localStorage
                    ↓
            UI 自动重渲染
```

**核心设计**：

- 所有状态变更必须通过 Zustand action
- `projectRepository` 转型为「服务端 API 适配器」，不再触碰 localStorage
- 启动时由 Zustand rehydrate 恢复状态，无需 App.tsx 手动 bootstrap

---

## 三、具体实施方案

### 3.1 路由渲染解耦

#### Step 1：扩展注册表，支持 props 映射

修改 `src/config/routes.ts`：

```typescript
// 新增：通用 Props 类型（App.tsx 中透传的所有数据和回调）
export type CommonAppProps = {
  projects: ProjectItem[]
  logs: Record<string, ProjectStatusLogEntry[]>
  onProjectOpen: (code: string, tab?: ProjectDetailTab) => void
  onProjectCreate: (formData: CreateProjectFormData) => TransitionActionResult
  onProjectStatusUpdate: (
    code: string,
    status: ProjectStatus,
    reason?: string
  ) => TransitionActionResult
  // ... 其他通用回调
}

// 扩展注册表项
export type PageComponentEntry = {
  page: AppRoute['page']
  component: ComponentType<any>
  // 新增：props 映射函数，将 CommonAppProps + route 转为页面所需 props
  mapProps?: (route: AppRoute, commonProps: CommonAppProps) => object
}

// 示例：为 detail 页面定义 mapProps
export const pageComponentRegistry: PageComponentEntry[] = [
  // ... 其他页面
  {
    page: 'detail',
    component: ProjectDetailPage,
    mapProps: (route, commonProps) => ({
      project: commonProps.projects.find(
        p => p.code === (route as Extract<AppRoute, { page: 'detail' }>).code
      ),
      activeTab: (route as Extract<AppRoute, { page: 'detail' }>).tab,
      onBack: () => commonProps.onProjectOpen(''), // 简化示意
      // ... 其他映射
    }),
  },
  // 默认页面无需 mapProps，直接接收空 props 或透传 commonProps
  { page: 'tasks', component: TaskManagementPage },
]
```

#### Step 2：新建 AppRouter

新建 `src/components/router/AppRouter.tsx`：

```typescript
import { Suspense } from 'react';
import type { AppRoute } from '../../config/routes';
import { getPageComponent } from '../../config/routes';
import type { CommonAppProps } from '../../config/routes';

const PageLoader = () => <div>加载中...</div>; // 复用 App.tsx 中的 loader

type AppRouterProps = {
  route: AppRoute;
  commonProps: CommonAppProps;
};

export function AppRouter({ route, commonProps }: AppRouterProps) {
  const entry = getPageComponent(route.page);

  if (!entry) {
    console.warn(`No component registered for page: ${route.page}`);
    return <PageLoader />;
  }

  const { component: PageComponent, mapProps } = entry;
  const pageProps = mapProps ? mapProps(route, commonProps) : {};

  return (
    <Suspense fallback={<PageLoader />}>
      <PageComponent {...pageProps} />
    </Suspense>
  );
}
```

#### Step 3：改造 App.tsx

```typescript
function App() {
  const [route, setRoute] = useState<AppRoute>(() => readRouteFromHash());
  // ... 状态订阅和全局事件监听保持不变 ...

  // 组装 commonProps
  const commonProps: CommonAppProps = useMemo(() => ({
    projects: projectsState,
    logs: projectStatusLogs,
    onProjectOpen: openProject,
    onProjectCreate: createProject,
    onProjectStatusUpdate: transitionProjectStatus,
    // ... 其他回调
  }), [projectsState, projectStatusLogs, /* deps */]);

  return <AppRouter route={route} commonProps={commonProps} />;
}
```

**注意**：`detail` / `new-detail` 页面 props 极其复杂（含 `transitionOptions`、`transitionLogs`、`onMilestoneSync` 等），如果一次性全量迁移风险高，可采用**渐进策略**：

- Phase 1.5：先迁移无特殊 props 的页面（tasks、customers、orders、settings 等 12 个简单页面）
- Phase 2：再迁移 detail / new-detail / procurement-supplier-detail 等复杂页面

### 3.2 状态持久化清理

#### Step 1：验证 Zustand persist 独立性

在浏览器控制台执行：

```javascript
// 修改 store 后检查 localStorage
useProjectStore.getState().addProject({ ...mockProject })
console.log(localStorage.getItem('pm-projects-store-v1')) // 应出现新数据
```

#### Step 2：移除冗余 useEffect

删除 `App.tsx` 中以下代码：

```typescript
// ❌ 删除此 useEffect
useEffect(() => {
  if (!hydratedRef.current) return
  void projectRepository.saveState({
    projects: projectsState,
    logs: projectStatusLogs,
  })
}, [projectsState, projectStatusLogs])
```

#### Step 3：迁移 bootstrap 逻辑到 Zustand

修改 `projectStore.ts`，在 `persist` 的 `onRehydrateStorage` 中处理初始加载：

```typescript
export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({ ... }),
    {
      name: 'pm-projects-store-v1',
      onRehydrateStorage: () => (state) => {
        // 如果 persist 恢复为空，尝试从 projectRepository 加载旧格式数据
        if (!state || state.projects.length === 0) {
          projectRepository.loadState().then((oldState) => {
            if (oldState.projects.length > 0) {
              useProjectStore.getState().setProjects(oldState.projects);
              useProjectStore.getState().setLogs(oldState.logs);
            }
          });
        }
      },
    }
  )
);
```

然后删除 `App.tsx` 中的 bootstrap `useEffect`。

### 3.3 业务 Action 抽取

新建 `src/store/projectActions.ts`，将以下函数从 `App.tsx` 迁移：

```typescript
// src/store/projectActions.ts
import { useProjectStore } from './projectStore'
import type { ProjectStatus, ProjectStatusLogEntry } from '../domain/projectStatusMachine'
import type { ProjectItem } from '../data/projects'

export function transitionProjectStatusAction(
  projectCode: string,
  toStatus: ProjectStatus,
  reason?: string
): { ok: boolean; message: string } {
  const store = useProjectStore.getState()
  const project = store.projects.find(p => p.code === projectCode)
  if (!project) return { ok: false, message: '未找到项目' }

  // ... 守卫校验、状态更新、日志追加 ...
  // 直接调用 store.updateProjectStatus / store.appendLog
}

export function createProjectAction(formData: CreateProjectFormData): {
  ok: boolean
  message: string
} {
  // ...
}

// 其他 action...
```

---

## 四、文件变更清单

| 操作 | 文件路径                                                 | 说明                                                                                 |
| ---- | -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 修改 | `src/config/routes.ts`                                   | 扩展 `PageComponentEntry`，新增 `CommonAppProps` 和 `mapProps`                       |
| 新建 | `src/components/router/AppRouter.tsx`                    | 配置驱动的路由渲染器                                                                 |
| 修改 | `src/App.tsx`                                            | 删除 17 个 if/else，挂载 AppRouter，删除冗余持久化 useEffect                         |
| 新建 | `src/store/projectActions.ts`                            | 业务 Action 集合                                                                     |
| 修改 | `src/store/projectStore.ts`                              | 在 `onRehydrateStorage` 中兼容旧数据加载                                             |
| 删除 | `src/services/repositories/projectRepository.ts`（可选） | 如确认仅操作 localStorage，可完全删除；如需保留 API 能力，则重命名为 `projectApi.ts` |

---

## 五、回滚方案

若重构后出现严重问题，按以下顺序回滚：

1. **路由渲染**：将 `AppRouter` 替换回 `if/else` 代码块（Git 回退 `App.tsx` 即可）
2. **持久化**：恢复 `App.tsx` 中的 `saveState` useEffect，暂时关闭 Zustand persist
3. **Action 抽取**：将 `projectActions.ts` 中的函数复制回 `App.tsx`

**建议**：每个 Step 单独提交 Git，确保可原子级回滚。

---

## 六、验收检查清单

- [ ] `App.tsx` 中不存在任何 `if (route.page === ...)` 渲染分支
- [ ] 新增测试路由仅需修改 `routes.ts` 一处
- [ ] `localStorage` 中项目数据仅由 Zustand persist 写入（监控 Network / Storage）
- [ ] 刷新页面后数据完整恢复
- [ ] App.tsx 行数 ≤ 300 行
- [ ] `npm run build` 零报错
- [ ] 所有页面路由跳转正常
- [ ] 项目状态流转、创建、编辑功能正常
