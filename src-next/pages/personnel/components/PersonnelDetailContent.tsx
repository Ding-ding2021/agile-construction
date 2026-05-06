import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Bookmark,
  MessageSquare,
  MoreHorizontal,
  ExternalLink,
  X,
} from 'lucide-react'
import {
  PERSON_STATUS_LABEL,
  AVAILABILITY_LABEL,
  EMPLOYMENT_LABEL,
  RISK_LABEL,
  avatarColor,
} from '../constants/personnel-styles'
import type { PersonDetail } from '@/types/personnel'

interface PersonnelDetailContentProps {
  person: PersonDetail | null
  loading: boolean
  mode?: 'page' | 'sheet'
  onBack?: () => void
  onOpenPage?: () => void
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Input value={value} disabled className={`h-7 text-[10px] ${mono ? 'font-mono' : ''}`} />
    </div>
  )
}

export default function PersonnelDetailContent({
  person,
  loading,
  mode = 'page',
  onBack,
  onOpenPage,
}: PersonnelDetailContentProps) {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'info' | 'history'>('info')

  const handleBack = onBack ?? (() => navigate('/personnel'))

  if (loading) {
    return (
      <div className="flex flex-col h-full p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 flex-1">
          <Skeleton className="flex-1" />
          <Skeleton className="w-80" />
        </div>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <p className="text-sm">人员不存在</p>
        <button className="text-sm text-primary underline" onClick={handleBack}>
          返回人员列表
        </button>
      </div>
    )
  }

  const header = (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0">
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="上一条">
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="下一条">
          <ChevronRight className="size-4" />
        </Button>
        <h2 className="text-sm font-semibold ml-1">人员详情</h2>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Heart className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bookmark className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MessageSquare className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </Button>
        {mode === 'sheet' && onOpenPage && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenPage}
            className="text-muted-foreground"
          >
            <ExternalLink className="size-4" />
          </Button>
        )}
        <div className="w-px h-5 bg-border/50 mx-1" />
        <Button variant="ghost" size="icon" onClick={handleBack} className="text-muted-foreground">
          {mode === 'sheet' ? <X className="size-4" /> : <ArrowLeft className="size-4" />}
        </Button>
      </div>
    </div>
  )

  const leftPanel = (
    <>
      <Tabs value={tab} onValueChange={v => setTab(v as 'info' | 'history')}>
        <TabsList>
          <TabsTrigger value="info">基础信息</TabsTrigger>
          <TabsTrigger value="history">操作记录</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === 'info' ? (
        <>
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              基本信息
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              <div className="col-span-2 flex items-center gap-3 mb-1">
                <Avatar className={`size-10 ${avatarColor(person.name)}`}>
                  <AvatarFallback className="text-sm bg-inherit">{person.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{person.name}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                    <span>{person.personCode}</span>
                    <span className="size-1 rounded-full bg-border" />
                    <span>{person.orgName || `组织#${person.orgId}`}</span>
                  </div>
                </div>
              </div>
              <Field label="手机号" value={person.mobile} />
              <Field label="邮箱" value={person.email || '—'} />
              <Field label="岗位" value={person.title || '—'} />
              <Field label="城市" value={person.workCity || '—'} />
              <Field label="用工类型" value={EMPLOYMENT_LABEL[person.employmentType] || '—'} />
              <Field label="风险等级" value={RISK_LABEL[person.riskLevel] || '—'} />
              <Field label="人员状态" value={PERSON_STATUS_LABEL[person.personStatus]} />
              <Field label="可分配" value={AVAILABILITY_LABEL[person.availabilityStatus]} />
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              任务负载
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">当前任务</span>
              <span className="text-sm font-medium">{person.currentTaskCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">关键任务</span>
              <span className="text-sm font-medium text-red-500">{person.criticalTaskCount}</span>
            </div>
            {person.criticalTaskCount > 2 && (
              <p className="text-[10px] text-red-500 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-red-500" />
                建议检查工作量
              </p>
            )}
          </Card>

          {person.skills.length > 0 && (
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                技能
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {person.skills.map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px] h-5">
                    {s.name}
                    <span className="ml-1 text-[9px] text-muted-foreground">{s.level}</span>
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {person.certs.length > 0 && (
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                资质证书
              </h3>
              <div className="space-y-1">
                {person.certs.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <div className="min-w-0 flex-1">
                      <span className="text-sm">{c.name}</span>
                      <span className="text-muted-foreground ml-2 text-[10px]">{c.certNo}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground">到期 {c.expireAt}</span>
                      <Badge
                        variant="ghost"
                        className={`text-[10px] h-5 ${c.status === 'expiring' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950' : c.status === 'expired' ? 'text-red-600 bg-red-50 dark:bg-red-950' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950'}`}
                      >
                        {c.status === 'valid' ? '有效' : c.status === 'expiring' ? '临期' : '过期'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              项目参与
            </h3>
            {person.projects.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between py-1">
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.role}</p>
                </div>
                <span
                  className={`text-[10px] shrink-0 ml-2 ${p.status === '已完成' ? 'text-emerald-500' : 'text-blue-500'}`}
                >
                  {p.status === '已完成' ? '已完成' : p.progress}
                </span>
              </div>
            ))}
          </Card>

          {person.tasks.length > 0 && (
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                当前任务
              </h3>
              <div className="space-y-1">
                {person.tasks.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-sm truncate block">{t.title}</span>
                      <span className="text-[10px] text-muted-foreground">{t.project}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span
                        className={`text-[10px] font-medium ${t.priority === 'P0' ? 'text-red-500' : 'text-amber-500'}`}
                      >
                        {t.priority}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            状态变更记录
          </h3>
          {person.statusChanges.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">暂无变更记录</p>
          ) : (
            <div className="space-y-0">
              {person.statusChanges.map((c, i) => {
                const dotColor =
                  c.type === 'leave'
                    ? 'bg-amber-500'
                    : c.type === 'return'
                      ? 'bg-emerald-500'
                      : c.type === 'replacement'
                        ? 'bg-blue-500'
                        : 'bg-red-500'
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`size-2.5 rounded-full shrink-0 ring-2 ring-background ${dotColor}`}
                      />
                      {i < person.statusChanges.length - 1 && (
                        <div className="w-px flex-1 min-h-[24px] bg-border" />
                      )}
                    </div>
                    <div className="pb-4 flex-1 min-w-0">
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.operator} · {c.at}
                      </p>
                      {c.note && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{c.note}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}
    </>
  )

  return (
    <div className="flex flex-col h-full">
      {header}
      <div className="flex-1 min-w-0 overflow-auto">
        <div className="p-5 space-y-6 max-w-4xl">{leftPanel}</div>
      </div>
    </div>
  )
}
