import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { PROJECT_STATUS_STYLE } from '@/pages/projects/constants/project-styles'
import type { ProjectItem } from '@/types/project'

interface ProjectTableViewProps {
  projects: ProjectItem[]
  loading: boolean
}

export function ProjectTableView({ projects, loading }: ProjectTableViewProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>编码</TableHead>
              <TableHead>项目名称</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>计划开业</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j} className="py-2">
                    <div className="h-4 w-full rounded bg-muted animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>编码</TableHead>
              <TableHead>项目名称</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>计划开业</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                暂无项目数据
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">编码</TableHead>
            <TableHead>项目名称</TableHead>
            <TableHead className="w-24">状态</TableHead>
            <TableHead className="w-32">进度</TableHead>
            <TableHead className="w-24">负责人</TableHead>
            <TableHead className="w-28">计划开业</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => (
            <TableRow
              key={project.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => navigate(`/projects/${project.code}/wbs`)}
            >
              <TableCell className="py-2.5 text-xs font-mono text-muted-foreground">
                {project.code}
              </TableCell>
              <TableCell className="py-2.5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{project.name}</span>
                  <span className="text-xs text-muted-foreground">{project.brand}</span>
                </div>
              </TableCell>
              <TableCell className="py-2.5">
                <Badge
                  variant="ghost"
                  className={
                    'text-xs font-medium ' +
                    (PROJECT_STATUS_STYLE[project.status] ??
                      'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400')
                  }
                >
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell className="py-2.5">
                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="w-16 h-1.5" />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {project.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-2.5 text-sm text-muted-foreground">
                {project.owner || '-'}
              </TableCell>
              <TableCell className="py-2.5 text-sm text-muted-foreground">
                {project.plannedOpenDate ? project.plannedOpenDate.slice(0, 10) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
