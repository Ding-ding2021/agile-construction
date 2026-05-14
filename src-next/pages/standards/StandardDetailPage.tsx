import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
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
import { Skeleton } from '@/components/ui/skeleton'
import { PageLayout } from '@/components/page-layout'
import { ChevronLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import {
  getStandard,
  updateStandard,
  getClauses,
  createClause,
  updateClause,
  deleteClause,
} from '@/services/api'
import type { StandardItem, StandardClause } from '@/types/standard'
import {
  SOURCE_TYPE_OPTIONS,
  CLAUSE_TYPE_OPTIONS,
  CLAUSE_TYPE_STYLE,
  STANDARD_STATUS_OPTIONS,
  STANDARD_STATUS_STYLE,
} from '@/types/standard'

export default function StandardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const numericId = Number(id)

  const [standard, setStandard] = useState<StandardItem | null>(null)
  const [clauses, setClauses] = useState<StandardClause[]>([])
  const [loading, setLoading] = useState(true)

  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBrand, setEditBrand] = useState('')
  const [editStoreType, setEditStoreType] = useState('')
  const [editStatus, setEditStatus] = useState('active')

  const [showClause, setShowClause] = useState(false)
  const [editClause, setEditClause] = useState<StandardClause | null>(null)
  const [clauseTitle, setClauseTitle] = useState('')
  const [clauseContent, setClauseContent] = useState('')
  const [clauseType, setClauseType] = useState('execution')

  const loadData = useCallback(async () => {
    if (!numericId) return
    setLoading(true)
    try {
      const [std, clRes] = await Promise.all([getStandard(numericId), getClauses(numericId)])
      setStandard(std)
      setClauses(clRes.data)
    } catch {
      setStandard(null)
      setClauses([])
    } finally {
      setLoading(false)
    }
  }, [numericId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openEdit = () => {
    if (!standard) return
    setEditName(standard.name)
    setEditBrand(standard.brand ?? '')
    setEditStoreType(standard.storeType ?? '')
    setEditStatus(standard.status)
    setShowEdit(true)
  }

  const handleEdit = async () => {
    if (!editName.trim()) return
    try {
      await updateStandard(numericId, {
        name: editName.trim(),
        brand: editBrand.trim() || null,
        storeType: editStoreType.trim() || null,
        status: editStatus,
      })
      setShowEdit(false)
      await loadData()
    } catch (err) {
      console.warn('Failed to update standard:', err)
    }
  }

  const openClause = (clause?: StandardClause) => {
    setEditClause(clause ?? null)
    setClauseTitle(clause?.title ?? '')
    setClauseContent(clause?.content ?? '')
    setClauseType(clause?.clauseType ?? 'execution')
    setShowClause(true)
  }

  const handleSaveClause = async () => {
    if (!clauseTitle.trim()) return
    try {
      if (editClause) {
        await updateClause(numericId, editClause.id, {
          title: clauseTitle.trim(),
          content: clauseContent || null,
          clauseType,
        })
      } else {
        await createClause(numericId, {
          title: clauseTitle.trim(),
          content: clauseContent || null,
          clauseType,
        })
      }
      setShowClause(false)
      await loadData()
    } catch (err) {
      console.warn('Failed to save clause:', err)
    }
  }

  const handleDeleteClause = async (clauseId: number) => {
    try {
      await deleteClause(numericId, clauseId)
      await loadData()
    } catch (err) {
      console.warn('Failed to delete clause:', err)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div role="status" aria-busy={true}>
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </div>
          <div className="rounded-lg border p-6 space-y-4 mt-4 md:mt-6">
            <Skeleton className="h-5 w-20" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }
  if (!standard) {
    return (
      <PageLayout>
        <div className="text-sm text-muted-foreground">标准不存在</div>
        <Button variant="outline" onClick={() => navigate('/standards')}>
          <ChevronLeft className="size-4 mr-1" /> 返回列表
        </Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => navigate('/standards')}
          aria-label="返回列表"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">{standard.name}</h1>
          <p className="text-sm text-muted-foreground">{standard.code}</p>
        </div>
        <Badge variant="ghost" className={STANDARD_STATUS_STYLE[standard.status] ?? ''}>
          {STANDARD_STATUS_OPTIONS.find(o => o.value === standard.status)?.label ?? standard.status}
        </Badge>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={openEdit}>
          <Pencil className="size-3.5 mr-1" /> 编辑
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">编码</span>
            <div className="text-sm font-mono">{standard.code}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">来源类型</span>
            <div className="text-sm">
              {SOURCE_TYPE_OPTIONS.find(o => o.value === standard.sourceType)?.label ??
                standard.sourceType}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">品牌</span>
            <div className="text-sm">{standard.brand || '-'}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">店型</span>
            <div className="text-sm">{standard.storeType || '-'}</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">状态</span>
            <Badge variant="ghost" className={STANDARD_STATUS_STYLE[standard.status] ?? ''}>
              {STANDARD_STATUS_OPTIONS.find(o => o.value === standard.status)?.label ??
                standard.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>关联条款</CardTitle>
            <CardDescription>此标准的结构化条款列表</CardDescription>
          </div>
          <Button size="sm" onClick={() => openClause()}>
            <Plus className="size-3.5 mr-1" /> 新增条款
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">编号</TableHead>
                <TableHead>标题</TableHead>
                <TableHead>内容</TableHead>
                <TableHead className="w-24">类型</TableHead>
                <TableHead className="w-28">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clauses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">
                    暂无条款，点击"新增条款"
                  </TableCell>
                </TableRow>
              ) : (
                clauses.map(clause => (
                  <TableRow key={clause.id}>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {clause.code}
                    </TableCell>
                    <TableCell className="font-medium">{clause.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {clause.content || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={CLAUSE_TYPE_STYLE[clause.clauseType] ?? ''}
                      >
                        {CLAUSE_TYPE_OPTIONS.find(o => o.value === clause.clauseType)?.label ??
                          clause.clauseType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => openClause(clause)}
                          aria-label="编辑条款"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive"
                          onClick={() => handleDeleteClause(clause.id)}
                          aria-label="删除条款"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑标准</DialogTitle>
            <DialogDescription>修改标准基本信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>
                名称 <span className="text-destructive">*</span>
              </Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>品牌</Label>
                <Input value={editBrand} onChange={e => setEditBrand(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>店型</Label>
                <Input value={editStoreType} onChange={e => setEditStoreType(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>状态</Label>
              <Select value={editStatus} onValueChange={v => setEditStatus(v ?? 'active')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STANDARD_STATUS_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>
              取消
            </Button>
            <Button onClick={handleEdit} disabled={!editName.trim()}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showClause} onOpenChange={setShowClause}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editClause ? '编辑条款' : '新增条款'}</DialogTitle>
            <DialogDescription>
              {editClause ? `编号: ${editClause.code}` : '为当前标准添加新的结构化条款'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>
                标题 <span className="text-destructive">*</span>
              </Label>
              <Input
                value={clauseTitle}
                onChange={e => setClauseTitle(e.target.value)}
                placeholder="如：门头招牌安装要求"
              />
            </div>
            <div className="space-y-1.5">
              <Label>内容</Label>
              <Textarea
                value={clauseContent}
                onChange={e => setClauseContent(e.target.value)}
                placeholder="条款详细内容..."
                rows={4}
              />
            </div>
            <div className="space-y-1.5">
              <Label>类型</Label>
              <Select value={clauseType} onValueChange={v => setClauseType(v ?? 'execution')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLAUSE_TYPE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClause(false)}>
              取消
            </Button>
            <Button onClick={handleSaveClause} disabled={!clauseTitle.trim()}>
              {editClause ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
