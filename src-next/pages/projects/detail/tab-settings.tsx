import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { api } from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProjectOverview } from '@/types/project-detail'

interface TabSettingsProps {
  projectCode: string
}

export function TabSettings({ projectCode }: TabSettingsProps) {
  const [project, setProject] = useState<ProjectOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    plannedOpenDate: '',
    owner: '',
  })

  useEffect(() => {
    setLoading(true)
    api
      .getProjectDetail(projectCode)
      .then(d => {
        setProject(d)
        setForm({
          name: d.name,
          description: d.description ?? '',
          plannedOpenDate: d.plannedOpenDate?.slice(0, 10) ?? '',
          owner: d.owner ?? '',
        })
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [projectCode])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaved(false)
    try {
      await api.updateProject(projectCode, form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }, [projectCode, form])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>项目设置</CardTitle>
          <CardDescription>基本配置信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!project) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">加载失败</CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>项目设置</CardTitle>
          <CardDescription>基础配置与编码规则</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">项目编码</Label>
            <Input id="code" value={project.code} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">项目名称</Label>
            <Input
              id="name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">负责人</Label>
            <Input
              id="owner"
              value={form.owner}
              onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plannedOpenDate">计划开业日期</Label>
            <Input
              id="plannedOpenDate"
              type="date"
              value={form.plannedOpenDate}
              onChange={e => setForm(f => ({ ...f, plannedOpenDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">项目描述</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '保存设置'}
            </Button>
            {saved && <span className="text-xs text-emerald-500">已保存</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
