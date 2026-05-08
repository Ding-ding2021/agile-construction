import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getTemplates, getTemplateBindings, instantiateFromTemplate } from '@/services/api'
import type { ProjectTemplate, TaskTemplate } from '@/types/template'

interface InstantiateDialogProps {
  projectCode: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (taskCount: number) => void
}

export function InstantiateDialog({
  projectCode,
  open,
  onOpenChange,
  onSuccess,
}: InstantiateDialogProps) {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [selectedBinding, setSelectedBinding] = useState<TaskTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [instantiating, setInstantiating] = useState(false)

  useEffect(() => {
    if (!open) return
    setSelectedId('')
    setSelectedBinding([])
    setLoading(true)
    getTemplates()
      .then(res => setTemplates(res.data.filter(t => t.status === 'active')))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false))
  }, [open])

  const handleSelect = async (value: string) => {
    setSelectedId(value)
    if (!value) {
      setSelectedBinding([])
      return
    }
    try {
      const res = await getTemplateBindings(Number(value))
      setSelectedBinding(res.data)
    } catch {
      setSelectedBinding([])
    }
  }

  const handleInstantiate = async () => {
    if (!selectedId) return
    setInstantiating(true)
    try {
      const res = await instantiateFromTemplate(projectCode, Number(selectedId))
      onSuccess(res.taskCount)
      onOpenChange(false)
    } catch (err) {
      console.warn('Instantiation failed:', err)
    } finally {
      setInstantiating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>从模板生成任务</DialogTitle>
          <DialogDescription>选择项目模板，系统将自动生成绑定的任务模板树</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>选择项目模板</Label>
            {loading ? (
              <div className="text-sm text-muted-foreground">加载中...</div>
            ) : templates.length === 0 ? (
              <div className="text-sm text-muted-foreground">暂无可用模板，请先在模板中心创建</div>
            ) : (
              <Select value={selectedId} onValueChange={v => handleSelect(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="选择项目模板..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.templateName} (v{t.templateVersion})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedId && (
            <div className="space-y-1.5">
              <Label>将生成以下任务模板</Label>
              <div className="rounded-md border border-border p-3 space-y-2">
                {selectedBinding.length === 0 ? (
                  <div className="text-sm text-muted-foreground">该模板未绑定任何任务模板</div>
                ) : (
                  selectedBinding.map(tt => (
                    <div
                      key={tt.taskTemplateId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{tt.taskTemplateName}</span>
                      <Badge variant="outline" className="text-xs">
                        {tt.templateLevel === 'project_root'
                          ? '项目根'
                          : tt.templateLevel === 'stage'
                            ? '阶段'
                            : tt.templateLevel === 'work_package'
                              ? '工作包'
                              : '任务'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleInstantiate} disabled={!selectedId || instantiating}>
            {instantiating ? '生成中...' : '确认生成'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
