import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import TagPicker from '@/components/ui/tag-picker'
import type { TaskDetail } from '@/types/task'

const NODE_TYPE_LABEL: Record<string, string> = {
  project_root: '项目根节点', work_package: '工作包', task: '任务', subtask: '子任务',
}

const SOURCE_TYPE_LABEL: Record<string, string> = {
  manual: '手动创建', template: '模板生成', wbs: 'WBS 分解', standard: '标准派生',
}

const PRIORITY_LABEL: Record<string, string> = {
  urgent: '紧急', high: '高', medium: '中', low: '低',
}

const TAG_OPTIONS = ['土建', '电气', '给排水', '消防', '暖通', '装修', '弱电', '景观', '结构', '幕墙']

interface TaskBasicInfoProps {
  task: TaskDetail
  readonly?: boolean
  onTagsChange?: (code: string, tags: string[]) => void
}

export default function TaskBasicInfo({ task, readonly, onTagsChange }: TaskBasicInfoProps) {
  const [localTags, setLocalTags] = useState<string[]>(task.tags ?? [])

  const handleTagsChange = (v: unknown) => {
    const next = v as string[]
    setLocalTags(next)
    onTagsChange?.(task.code, next)
  }

  return (
    <Card className="p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">基本信息</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        <div className="col-span-2">
          <Field label="任务名称" value={task.name} />
        </div>
        <Field label="任务编号" value={task.code} mono />
        <Field label="所属项目" value={task.projectName} />
        <Field label="节点层级" value={NODE_TYPE_LABEL[task.nodeLevelType] ?? task.nodeLevelType} />
        <Field label="任务类型" value={task.taskType} />
        <Field label="来源方式" value={SOURCE_TYPE_LABEL[task.sourceType] ?? task.sourceType} />
        <Field label="优先级" value={PRIORITY_LABEL[task.priority] ?? task.priority} />
        {task.milestoneFlag && <Field label="里程碑节点" value="是" />}
        {task.isRectification && (
          <>
            <Field label="整改任务" value="是" />
            {task.rectificationReason && <Field label="整改原因" value={task.rectificationReason} />}
            {task.reopenCount > 0 && <Field label="重开次数" value={`${task.reopenCount} 次`} />}
          </>
        )}
        <Field label="创建人" value={task.createdBy} />
        <Field label="创建时间" value={task.createdAt?.slice(0, 10) ?? '—'} />

        {task.description && (
          <div className="col-span-2">
            <Field label="任务描述" value={task.description} />
          </div>
        )}

        {!readonly && (
          <div className="col-span-2 space-y-1.5">
            <span className="text-xs text-muted-foreground">专业标签</span>
            <TagPicker value={localTags} onChange={handleTagsChange} options={TAG_OPTIONS} />
          </div>
        )}
      </div>
      {task.derivedFromTaskId && (
        <p className="text-xs text-blue-500 mt-2">
          派生来源：{task.derivedFromTaskId}
        </p>
      )}
    </Card>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Input
        value={value}
        disabled
        className={`h-7 text-[10px] ${mono ? 'font-mono text-[10px]' : ''}`}
      />
    </div>
  )
}
