import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { api } from '@/services/api'
import { TabOverview } from './detail/tab-overview'
import { TabScope } from './detail/tab-scope'
import { TabProgress } from './detail/tab-progress'
import { TabCost } from './detail/tab-cost'
import { TabQuality } from './detail/tab-quality'
import { TabResource } from './detail/tab-resource'
import { TabRisk } from './detail/tab-risk'
import { TabSettings } from './detail/tab-settings'
import { TAB_KEYS, TAB_LABELS, type TabKey, type ProjectDetail } from '@/types/project-detail'
import { HEALTH_STYLE } from '@/pages/projects/constants/project-styles'
import {
  LayoutDashboard,
  GitBranch,
  Timer,
  DollarSign,
  CheckCircle2,
  Users,
  AlertTriangle,
  Settings,
} from 'lucide-react'

const VALID_TABS = TAB_KEYS as readonly string[]

const TAB_ICONS: Record<TabKey, React.ReactNode> = {
  overview: <LayoutDashboard className="size-4" />,
  scope: <GitBranch className="size-4" />,
  progress: <Timer className="size-4" />,
  cost: <DollarSign className="size-4" />,
  quality: <CheckCircle2 className="size-4" />,
  resource: <Users className="size-4" />,
  risk: <AlertTriangle className="size-4" />,
  settings: <Settings className="size-4" />,
}

const HEALTH_FALLBACK = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'

export default function ProjectDetailPage() {
  const { projectCode } = useParams<{ projectCode: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const rawTab = searchParams.get('tab') ?? 'overview'
  const activeTab: TabKey = VALID_TABS.includes(rawTab) ? (rawTab as TabKey) : 'overview'

  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectCode) return
    setLoading(true)
    api
      .getProjectDetail(projectCode)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [projectCode])

  const handleTabChange = useCallback(
    (value: string) => {
      setSearchParams(value === 'overview' ? {} : { tab: value }, { replace: true })
    },
    [setSearchParams]
  )

  if (!projectCode) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        缺少项目编码
      </div>
    )
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6">
      {!loading && project && (
        <div className="flex items-center gap-3 px-2 pt-2">
          <button
            onClick={() => navigate('/projects')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            项目管理
          </button>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">{project.name}</span>
          <div className="flex-1" />
          <Badge
            variant="ghost"
            className={
              'text-xs font-medium ' + (HEALTH_STYLE[project.healthStatus ?? ''] ?? HEALTH_FALLBACK)
            }
          >
            {project.healthStatus ?? '正常'}
          </Badge>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <div className="overflow-x-auto pb-1.5">
          <TabsList variant="line" className="inline-flex w-auto min-w-0 gap-1">
            {TAB_KEYS.map(key => (
              <TabsTrigger
                key={key}
                value={key}
                className="whitespace-nowrap text-sm px-3 py-1.5 gap-1.5"
              >
                {TAB_ICONS[key]}
                {TAB_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1">
          <TabsContent value="overview">
            <TabOverview project={project} loading={loading} />
          </TabsContent>
          <TabsContent value="scope">
            <TabScope projectCode={projectCode} />
          </TabsContent>
          <TabsContent value="progress">
            <TabProgress projectCode={projectCode} />
          </TabsContent>
          <TabsContent value="cost">
            <TabCost projectCode={projectCode} />
          </TabsContent>
          <TabsContent value="quality">
            <TabQuality projectCode={projectCode} />
          </TabsContent>
          <TabsContent value="resource">
            <TabResource projectCode={projectCode} />
          </TabsContent>
          <TabsContent value="risk">
            <TabRisk projectCode={projectCode} />
          </TabsContent>
          <TabsContent value="settings">
            <TabSettings projectCode={projectCode} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
