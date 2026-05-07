import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/services/api'
import { avatarColor } from '@/pages/projects/constants/project-styles'
import type { ProjectMember } from '@/types/project-detail'

interface TabResourceProps {
  projectCode: string
}

export function TabResource({ projectCode }: TabResourceProps) {
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .getMembers(projectCode)
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }, [projectCode])

  const grouped = members.reduce<Record<string, ProjectMember[]>>((acc, m) => {
    const role = m.role || '其他'
    if (!acc[role]) acc[role] = []
    acc[role].push(m)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>项目成员</CardTitle>
          <CardDescription>暂无成员数据</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">该项目暂无成员</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>项目成员</CardTitle>
          <CardDescription>共 {members.length} 人</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(grouped).map(([role, members]) => (
            <div key={role}>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {role}
              </h4>
              <div className="space-y-1">
                {members.map(m => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-foreground ${avatarColor(m.name)}`}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {m.department || '-'}
                      </p>
                    </div>
                    {m.phone && <span className="text-xs text-muted-foreground">{m.phone}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
