import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
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
import { ChevronLeft, Plus, Trash2, ArrowLeft } from 'lucide-react'
import {
  getTemplate,
  getTaskTemplates,
  createTaskTemplate,
  addTemplateBinding,
  removeTemplateBinding,
  getTemplateBindings,
} from '@/services/api'
import type { ProjectTemplate, TaskTemplate } from '@/types/template'
import {
  TEMPLATE_STATUS_STYLE,
  TEMPLATE_STATUS_OPTIONS,
  TEMPLATE_LEVEL_OPTIONS,
} from '@/types/template'

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const numericId = Number(id)

  const [template, setTemplate] = useState<ProjectTemplate | null>(null)
  const [bindings, setBindings] = useState<TaskTemplate[]>([])
  const [loading, setLoading] = useState(true)

  const [showAddTask, setShowAddTask] = useState(false)
  const [allTaskTemplates, setAllTaskTemplates] = useState<TaskTemplate[]>([])
  const [selectedTaskTtId, setSelectedTaskTtId] = useState('')

  const [showCreateTask, setShowCreateTask] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskLevel, setNewTaskLevel] = useState('task')
  const [newTaskParent, setNewTaskParent] = useState('')

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!numericId) return
    setLoading(true)
    try {
      const [tmpl, bindRes] = await Promise.all([
        getTemplate(numericId),
        getTemplateBindings(numericId),
      ])
      setTemplate(tmpl)
      setBindings(bindRes.data)
    } catch (err) {
      console.warn('Failed to load template:', err)
      setTemplate(null)
      setBindings([])
    } finally {
      setLoading(false)
    }
  }, [numericId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddBinding = async () => {
    if (!selectedTaskTtId) return
    try {
      await addTemplateBinding(numericId, selectedTaskTtId)
      setShowAddTask(false)
      setSelectedTaskTtId('')
      await loadData()
    } catch (err) {
      console.warn('Failed to add binding:', err)
    }
  }

  const handleRemoveBinding = async (ttId: string) => {
    try {
      await removeTemplateBinding(numericId, ttId)
      setDeleteConfirm(null)
      await loadData()
    } catch (err) {
      console.warn('Failed to remove binding:', err)
    }
  }

  const openAddDialog = async () => {
    setSelectedTaskTtId('')
    try {
      const allRes = await getTaskTemplates()
      setAllTaskTemplates(allRes.data)
    } catch {
      setAllTaskTemplates([])
    }
    setShowAddTask(true)
  }

  const handleCreateTaskTemplate = async () => {
    if (!newTaskName.trim()) return
    try {
      const parent = newTaskParent
        ? allTaskTemplates.find(t => t.taskTemplateId === newTaskParent)
        : null
      await createTaskTemplate({
        taskTemplateName: newTaskName.trim(),
        templateLevel: newTaskLevel,
        parentTemplateCode: parent?.taskTemplateCode ?? null,
        status: 'active',
      })
      setShowCreateTask(false)
      setNewTaskName('')
      setNewTaskLevel('task')
      setNewTaskParent('')
      await openAddDialog()
    } catch (err) {
      console.warn('Failed to create task template:', err)
    }
  }

  const getLevelLabel = (level: string) => {
    return TEMPLATE_LEVEL_OPTIONS.find(o => o.value === level)?.label ?? level
  }

  if (loading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="text-sm text-muted-foreground">模板不存在</div>
        <Button variant="outline" onClick={() => navigate('/templates')}>
          <ArrowLeft className="size-4 mr-1" /> 返回列表
        </Button>
      </div>
    )
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => navigate('/templates')}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">{template.templateName}</h1>
          <p className="text-sm text-muted-foreground">
            {template.templateCode} v{template.templateVersion}
          </p>
        </div>
        <Badge variant="ghost" className={TEMPLATE_STATUS_STYLE[template.status] ?? ''}>
          {TEMPLATE_STATUS_OPTIONS.find(o => o.value === template.status)?.label ?? template.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">模板名称</span>
            <div className="text-sm font-medium">{template.templateName}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">编码</span>
            <div className="text-sm font-mono">{template.templateCode}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">品牌</span>
            <div className="text-sm">{template.brand || '-'}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">店型</span>
            <div className="text-sm">{template.storeType || '-'}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">版本</span>
            <div className="text-sm">{template.templateVersion}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">状态</span>
            <Badge variant="ghost" className={TEMPLATE_STATUS_STYLE[template.status] ?? ''}>
              {TEMPLATE_STATUS_OPTIONS.find(o => o.value === template.status)?.label ??
                template.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>绑定的任务模板</CardTitle>
            <CardDescription>管理此项目模板关联的任务模板</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCreateTask(true)
                setNewTaskParent('')
                setNewTaskLevel('work_package')
                setNewTaskName('')
              }}
            >
              <Plus className="size-3.5 mr-1" /> 新建任务模板
            </Button>
            <Button size="sm" onClick={openAddDialog}>
              <Plus className="size-3.5 mr-1" /> 绑定已有
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>编码</TableHead>
                <TableHead>层级</TableHead>
                <TableHead>版本</TableHead>
                <TableHead className="w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bindings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">
                    暂未绑定任务模板，点击"绑定已有"或"新建任务模板"
                  </TableCell>
                </TableRow>
              ) : (
                bindings.map(tt => (
                  <TableRow key={tt.taskTemplateId}>
                    <TableCell className="font-medium">{tt.taskTemplateName}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {tt.taskTemplateCode}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getLevelLabel(tt.templateLevel)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{tt.taskTemplateVersion}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive"
                        onClick={() => setDeleteConfirm(tt.taskTemplateId)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>绑定任务模板</DialogTitle>
            <DialogDescription>选择一个已有的任务模板绑定到此项目模板</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>任务模板</Label>
            <Select value={selectedTaskTtId} onValueChange={v => setSelectedTaskTtId(v ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="选择任务模板..." />
              </SelectTrigger>
              <SelectContent>
                {allTaskTemplates
                  .filter(tt => !bindings.find(b => b.taskTemplateId === tt.taskTemplateId))
                  .map(tt => (
                    <SelectItem key={tt.taskTemplateId} value={tt.taskTemplateId}>
                      {tt.taskTemplateName} ({tt.taskTemplateCode})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTask(false)}>
              取消
            </Button>
            <Button onClick={handleAddBinding} disabled={!selectedTaskTtId}>
              绑定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建任务模板</DialogTitle>
            <DialogDescription>创建后可绑定到项目模板</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>名称 *</Label>
              <Input
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                placeholder="如：门店装修"
              />
            </div>
            <div className="space-y-1.5">
              <Label>层级 *</Label>
              <Select value={newTaskLevel} onValueChange={v => setNewTaskLevel(v ?? 'task')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_LEVEL_OPTIONS.slice(1).map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>父模板（可选）</Label>
              <Select value={newTaskParent} onValueChange={v => setNewTaskParent(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="无（根节点）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">无（根节点）</SelectItem>
                  {allTaskTemplates
                    .filter(tt => tt.templateLevel !== 'task')
                    .map(tt => (
                      <SelectItem key={tt.taskTemplateId} value={tt.taskTemplateId}>
                        {tt.taskTemplateName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateTask(false)}>
              取消
            </Button>
            <Button onClick={handleCreateTaskTemplate} disabled={!newTaskName.trim()}>
              创建并绑定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认解绑</DialogTitle>
            <DialogDescription>
              确定要将此任务模板从项目模板中移除吗？此操作不会删除任务模板本身。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleRemoveBinding(deleteConfirm)}
            >
              确认解绑
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
