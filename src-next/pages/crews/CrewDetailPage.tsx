import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Trash2, Pencil } from 'lucide-react'
import {
  getCrew,
  updateCrew,
  getCrewMembers,
  addCrewMember,
  removeCrewMember,
  getCrewCertifications,
  createCrewCertification,
  updateCrewCertification,
  deleteCrewCertification,
} from '@/services/api'
import { api } from '@/services/api'
import type {
  CrewItem,
  CrewMemberItem,
  CrewCertificationItem,
  CrewFormData,
  CrewCertFormData,
} from '@/types/crew'
import {
  CREW_STATUS_LABEL,
  CREW_RATING_OPTIONS,
  CERT_TYPE_OPTIONS,
  CERT_STATUS_LABEL,
  MEMBER_ROLE_OPTIONS,
} from '@/types/crew'
import type { PersonItem } from '@/types/personnel'

export default function CrewDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [crew, setCrew] = useState<CrewItem | null>(null)
  const [members, setMembers] = useState<CrewMemberItem[]>([])
  const [certs, setCerts] = useState<CrewCertificationItem[]>([])
  const [persons, setPersons] = useState<PersonItem[]>([])
  const [loading, setLoading] = useState(true)

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editForm, setEditForm] = useState<CrewFormData>({ name: '' })

  const [showMemberDialog, setShowMemberDialog] = useState(false)
  const [memberForm, setMemberForm] = useState({ personId: 0, role: '队员', joinDate: '' })

  const [showCertDialog, setShowCertDialog] = useState(false)
  const [editCert, setEditCert] = useState<CrewCertificationItem | null>(null)
  const [certForm, setCertForm] = useState<CrewCertFormData>({ certType: '', certName: '' })

  const crewId = Number(id)

  const loadAll = useCallback(async () => {
    if (!crewId) return
    setLoading(true)
    try {
      const [crewRes, membersRes, certsRes, personsRes] = await Promise.all([
        getCrew(crewId),
        getCrewMembers(crewId),
        getCrewCertifications(crewId),
        api.getPersonnel(),
      ])
      setCrew(crewRes)
      setMembers(membersRes.data)
      setCerts(certsRes.data)
      setPersons(personsRes.data)
    } catch (e) {
      console.error('Failed to load crew detail', e)
    } finally {
      setLoading(false)
    }
  }, [crewId])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const openEdit = () => {
    if (!crew) return
    setEditForm({
      name: crew.name,
      leaderName: crew.leaderName || undefined,
      leaderPhone: crew.leaderPhone || undefined,
      rating: crew.rating || undefined,
      status: crew.status,
      speciality: crew.speciality || undefined,
      workCities: crew.workCities || undefined,
    })
    setShowEditDialog(true)
  }

  const handleSaveEdit = async () => {
    if (!crew || !editForm.name) return
    try {
      const updated = await updateCrew(crew.id, editForm)
      setCrew(updated)
      setShowEditDialog(false)
    } catch (e) {
      console.error('Failed to update crew', e)
    }
  }

  const handleAddMember = async () => {
    if (!memberForm.personId) return
    try {
      await addCrewMember(crewId, {
        personId: memberForm.personId,
        role: memberForm.role,
        joinDate: memberForm.joinDate || undefined,
      })
      setShowMemberDialog(false)
      setMemberForm({ personId: 0, role: '队员', joinDate: '' })
      loadAll()
    } catch (e) {
      console.error('Failed to add member', e)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm('确认移除此成员？')) return
    try {
      await removeCrewMember(crewId, memberId)
      loadAll()
    } catch (e) {
      console.error('Failed to remove member', e)
    }
  }

  const openAddCert = () => {
    setEditCert(null)
    setCertForm({ certType: '', certName: '' })
    setShowCertDialog(true)
  }

  const openEditCert = (cert: CrewCertificationItem) => {
    setEditCert(cert)
    setCertForm({
      certType: cert.certType,
      certName: cert.certName,
      certNumber: cert.certNumber || undefined,
      issueDate: cert.issueDate || undefined,
      expireDate: cert.expireDate || undefined,
      status: cert.status,
      fileUrl: cert.fileUrl || undefined,
    })
    setShowCertDialog(true)
  }

  const handleSaveCert = async () => {
    if (!certForm.certType || !certForm.certName) return
    try {
      if (editCert) {
        await updateCrewCertification(crewId, editCert.id, certForm)
      } else {
        await createCrewCertification(crewId, certForm)
      }
      setShowCertDialog(false)
      loadAll()
    } catch (e) {
      console.error('Failed to save certification', e)
    }
  }

  const handleDeleteCert = async (cert: CrewCertificationItem) => {
    if (!confirm('确认删除此资质证照？')) return
    try {
      await deleteCrewCertification(crewId, cert.id)
      loadAll()
    } catch (e) {
      console.error('Failed to delete certification', e)
    }
  }

  const statusColor = (status: string) => {
    if (status === 'active') return { bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' }
    return { bg: 'bg-zinc-500/10', dot: 'bg-zinc-400' }
  }

  const certStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      valid: 'bg-emerald-500/10 text-emerald-400',
      expiring: 'bg-amber-500/10 text-amber-400',
      expired: 'bg-red-500/10 text-red-400',
    }
    return colors[status] || 'bg-zinc-500/10 text-zinc-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">加载中...</div>
    )
  }

  if (!crew) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">工队不存在</div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/crews')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{crew.name}</h1>
          <p className="text-sm text-muted-foreground">{crew.code}</p>
        </div>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>基本信息</CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={openEdit}>
            <Pencil className="size-3.5 mr-1" />
            编辑
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">负责人</Label>
              <p className="mt-1">{crew.leaderName || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">电话</Label>
              <p className="mt-1">{crew.leaderPhone || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">状态</Label>
              <p className="mt-1">
                <Badge
                  variant="ghost"
                  className={`text-[11px] font-medium ${statusColor(crew.status).bg}`}
                >
                  <span className={`mr-1 size-1.5 rounded-full ${statusColor(crew.status).dot}`} />
                  {CREW_STATUS_LABEL[crew.status]}
                </Badge>
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">评级</Label>
              <p className="mt-1">{crew.rating || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">专长领域</Label>
              <p className="mt-1">{crew.speciality || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">工作城市</Label>
              <p className="mt-1">{crew.workCities || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成员管理 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>成员管理 ({members.length})</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setMemberForm({ personId: 0, role: '队员', joinDate: '' })
              setShowMemberDialog(true)
            }}
          >
            <Plus className="size-3.5 mr-1" />
            添加成员
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>加入日期</TableHead>
                  <TableHead className="w-20">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      暂无成员
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="text-sm font-medium">{m.personName}</TableCell>
                      <TableCell className="text-sm">{m.role}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {m.joinDate || '—'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-red-500 hover:text-red-400"
                          onClick={() => handleRemoveMember(m.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 资质证照 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>资质证照 ({certs.length})</CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={openAddCert}>
            <Plus className="size-3.5 mr-1" />
            新增证照
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类型</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>编号</TableHead>
                  <TableHead>颁发日期</TableHead>
                  <TableHead>到期日期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-24">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      暂无资质证照
                    </TableCell>
                  </TableRow>
                ) : (
                  certs.map(cert => (
                    <TableRow key={cert.id}>
                      <TableCell className="text-sm">{cert.certType}</TableCell>
                      <TableCell className="text-sm font-medium">{cert.certName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cert.certNumber || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cert.issueDate || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cert.expireDate || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="ghost"
                          className={`text-[11px] font-medium ${certStatusColor(cert.status)}`}
                        >
                          {CERT_STATUS_LABEL[cert.status] || cert.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => openEditCert(cert)}
                          >
                            <Pencil className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-red-500 hover:text-red-400"
                            onClick={() => handleDeleteCert(cert)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 编辑工队对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑工队</DialogTitle>
            <DialogDescription>修改 {crew.name} 的信息</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-0.5">
            <div className="flex flex-col gap-2">
              <Label>
                工队名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                value={editForm.name || ''}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>负责人</Label>
                <Input
                  value={editForm.leaderName || ''}
                  onChange={e => setEditForm(f => ({ ...f, leaderName: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>负责人电话</Label>
                <Input
                  value={editForm.leaderPhone || ''}
                  onChange={e => setEditForm(f => ({ ...f, leaderPhone: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>评级</Label>
                <Select
                  value={editForm.rating || ''}
                  onValueChange={v => setEditForm(f => ({ ...f, rating: v || undefined }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="不限" />
                  </SelectTrigger>
                  <SelectContent>
                    {CREW_RATING_OPTIONS.map(r => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>状态</Label>
                <Select
                  value={editForm.status || 'active'}
                  onValueChange={v =>
                    setEditForm(f => ({ ...f, status: v as 'active' | 'inactive' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">启用</SelectItem>
                    <SelectItem value="inactive">停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>专长领域</Label>
              <Input
                value={editForm.speciality || ''}
                onChange={e => setEditForm(f => ({ ...f, speciality: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>工作城市</Label>
              <Input
                value={editForm.workCities || ''}
                onChange={e => setEditForm(f => ({ ...f, workCities: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">取消</Button>} />
            <Button onClick={handleSaveEdit} disabled={!editForm.name}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加成员对话框 */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加成员</DialogTitle>
            <DialogDescription>从现有人员中选择成员加入工队</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 px-0.5">
            <div className="flex flex-col gap-2">
              <Label>
                选择人员 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={String(memberForm.personId)}
                onValueChange={v => setMemberForm(f => ({ ...f, personId: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择人员" />
                </SelectTrigger>
                <SelectContent>
                  {persons.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name} ({p.personCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>角色</Label>
              <Select
                value={memberForm.role}
                onValueChange={v => v && setMemberForm(f => ({ ...f, role: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_ROLE_OPTIONS.map(r => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>加入日期</Label>
              <Input
                type="date"
                value={memberForm.joinDate}
                onChange={e => setMemberForm(f => ({ ...f, joinDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">取消</Button>} />
            <Button onClick={handleAddMember} disabled={!memberForm.personId}>
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 资质证照对话框 */}
      <Dialog open={showCertDialog} onOpenChange={setShowCertDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editCert ? '编辑证照' : '新增证照'}</DialogTitle>
            <DialogDescription>
              {editCert ? `修改 ${editCert.certName}` : '填写资质证照信息'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-0.5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>
                  证照类型 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={certForm.certType}
                  onValueChange={v => v && setCertForm(f => ({ ...f, certType: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {CERT_TYPE_OPTIONS.map(t => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  证照名称 <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={certForm.certName || ''}
                  onChange={e => setCertForm(f => ({ ...f, certName: e.target.value }))}
                  placeholder="请输入名称"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>编号</Label>
                <Input
                  value={certForm.certNumber || ''}
                  onChange={e => setCertForm(f => ({ ...f, certNumber: e.target.value }))}
                  placeholder="可选"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>状态</Label>
                <Select
                  value={certForm.status || 'valid'}
                  onValueChange={v => v && setCertForm(f => ({ ...f, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valid">有效</SelectItem>
                    <SelectItem value="expiring">即将到期</SelectItem>
                    <SelectItem value="expired">已过期</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>颁发日期</Label>
                <Input
                  type="date"
                  value={certForm.issueDate || ''}
                  onChange={e => setCertForm(f => ({ ...f, issueDate: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>到期日期</Label>
                <Input
                  type="date"
                  value={certForm.expireDate || ''}
                  onChange={e => setCertForm(f => ({ ...f, expireDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>文件链接</Label>
              <Input
                value={certForm.fileUrl || ''}
                onChange={e => setCertForm(f => ({ ...f, fileUrl: e.target.value }))}
                placeholder="可选"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">取消</Button>} />
            <Button onClick={handleSaveCert} disabled={!certForm.certType || !certForm.certName}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
