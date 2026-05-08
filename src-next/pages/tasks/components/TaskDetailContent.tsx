import { useState, useCallback } from 'react'
import { api } from '@/services/api'
import TaskDetailLayout from './TaskDetailLayout'
import TaskDetailHeader from './TaskDetailHeader'
import TaskDetailTabs from './TaskDetailTabs'
import TaskFlowTimeline from './flow/TaskFlowTimeline'
import TaskBasicInfo from './info/TaskBasicInfo'
import OperationTaskChecklist from './operation/TaskChecklist'
import TaskStandards from './info/TaskStandards'
import TaskRelations from './info/TaskRelations'
import SubTaskTree from './tree/SubTaskTree'
import TaskStatusOps from './operation/TaskStatusOps'
import TaskPeople from './operation/TaskPeople'
import TaskRiskSla from './operation/TaskRiskSla'
import TaskAttachments from './operation/TaskAttachments'
import TaskProgress from './operation/TaskProgress'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import type { TaskDetail, TaskStatus } from '@/types/task'

interface TaskDetailContentProps {
  task: TaskDetail
  mode: 'sheet' | 'page'
  onBack: () => void
  onPrev?: () => void
  onNext?: () => void
  onOpenPage?: () => void
  onReload?: () => void
  onUploadAttachment?: () => void
  onBindStandard?: () => void
}

export default function TaskDetailContent({
  task,
  mode,
  onBack,
  onPrev,
  onNext,
  onOpenPage,
  onReload,
  onUploadAttachment,
  onBindStandard,
}: TaskDetailContentProps) {
  const pc = task.projectCode ?? ''
  const taskId = task.id as unknown as number

  const handleStatusChange = useCallback(
    (_code: string, status: TaskStatus) => {
      if (!pc || !taskId) return
      api
        .updateTask(pc, taskId, { status })
        .then(() => {
          toast.success(`状态已变更为「${status}」`)
          onReload?.()
        })
        .catch(() => toast.error('状态变更失败'))
    },
    [pc, taskId, onReload]
  )

  const handleRemind = useCallback(
    (_code: string) => {
      if (!pc || !taskId) return
      api
        .remindTask(pc, taskId)
        .then(() => {
          toast.success('已催办')
          onReload?.()
        })
        .catch(() => toast.error('催办失败'))
    },
    [pc, taskId, onReload]
  )

  const handleAssigneeSave = useCallback(
    (
      _code: string,
      data: {
        assigneeId?: number
        assigneeName?: string
        plannedStartAt?: string
        plannedEndAt?: string
      }
    ) => {
      if (!pc || !taskId) return
      api
        .updateTask(pc, taskId, data)
        .then(() => {
          toast.success('已保存')
          onReload?.()
        })
        .catch(() => toast.error('保存失败'))
    },
    [pc, taskId, onReload]
  )

  const handleRiskChange = useCallback(
    (_code: string, riskLevel: string) => {
      if (!pc || !taskId) return
      api
        .updateTask(pc, taskId, { riskLevel })
        .then(() => {
          toast.success('风险等级已更新')
        })
        .catch(() => toast.error('保存失败'))
    },
    [pc, taskId]
  )

  const handleAddRelation = useCallback(
    (fromTaskId: string, relationType: string) => {
      if (!pc || !taskId) return
      api
        .addRelation(pc, taskId, fromTaskId, relationType)
        .then(() => {
          toast.success('前置任务已添加')
          onReload?.()
        })
        .catch(e => toast.error(e.message))
    },
    [pc, taskId, onReload]
  )

  const handleRemoveRelation = useCallback(
    (relationId: string) => {
      if (!pc || !taskId) return
      api
        .removeRelation(pc, taskId, Number(relationId))
        .then(() => {
          toast.success('前置任务已移除')
          onReload?.()
        })
        .catch(() => toast.error('操作失败'))
    },
    [pc, taskId, onReload]
  )

  const handleTagsChange = useCallback(
    (_code: string, tags: string[]) => {
      if (!pc || !taskId) return
      api.updateTags(pc, taskId, tags).catch(() => toast.error('标签保存失败'))
    },
    [pc, taskId]
  )
  const [leftTab, setLeftTab] = useState<'detail' | 'history'>('detail')

  const handleProgressChange = useCallback(
    (value: number) => {
      if (!pc || !taskId) return
      api
        .updateTask(pc, taskId, { progress: value })
        .then(() => toast.success('进度已更新'))
        .catch(() => toast.error('保存失败'))
    },
    [pc, taskId]
  )

  const readonly = task.status === '已完成' || task.status === '已关闭'

  const header = (
    <TaskDetailHeader
      task={task}
      mode={mode}
      onBack={onBack}
      onPrev={onPrev}
      onNext={onNext}
      onOpenPage={onOpenPage}
    />
  )

  const leftPanel = (
    <>
      <TaskDetailTabs activeTab={leftTab} onTabChange={setLeftTab} />

      {leftTab === 'detail' ? (
        <>
          <TaskBasicInfo task={task} readonly={readonly} onTagsChange={handleTagsChange} />
          <TaskPeople task={task} readonly={false} onSave={handleAssigneeSave} />
          <Separator />
          <OperationTaskChecklist
            projectCode={pc}
            taskId={taskId}
            items={task.checklist ?? []}
            readonly={readonly}
            onReload={onReload}
          />
          <TaskRiskSla task={task} readonly={readonly} onRiskChange={handleRiskChange} />
          <TaskStandards task={task} readonly={readonly} onBindStandard={onBindStandard} />
          <TaskAttachments
            attachments={task.attachments ?? []}
            readonly={readonly}
            onUpload={onUploadAttachment}
          />
        </>
      ) : (
        <>
          <Card className="p-4 space-y-3">
            <TaskStatusOps
              task={task}
              readonly={readonly}
              onStatusChange={handleStatusChange}
              onRemind={handleRemind}
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">催办次数</span>
              <span className="font-medium">{task.remindCount} 次</span>
            </div>
            <Separator />
            <TaskFlowTimeline currentStatus={task.status} logs={task.flowLogs ?? []} />
          </Card>
          <TaskRelations
            relations={task.relations ?? []}
            readonly={readonly}
            onAdd={handleAddRelation}
            onRemove={handleRemoveRelation}
          />
          <TaskProgress
            progress={task.progress}
            readonly={readonly}
            onChange={handleProgressChange}
          />
          <SubTaskTree subtasks={task.subtasks ?? []} progress={task.progress} />
        </>
      )}
    </>
  )

  return <TaskDetailLayout header={header} leftPanel={leftPanel} />
}
