import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

interface SystemField {
  key: string
  label: string
  type: 'select' | 'text' | 'date'
  options?: string[]
}

interface ExtraField {
  key: string
  label: string
  type: 'system' | 'custom'
}

interface Template {
  id: string
  label: string
  defaults: Record<string, string>
}

interface TemplateDetail {
  label: string
  fields: { key: string; label: string }[]
}

interface NewTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'quick' | 'template'
  onModeChange: (mode: 'quick' | 'template') => void
  fields: Record<string, string>
  onFieldsChange: (fields: Record<string, string>) => void
  selectedTemplate: string
  onTemplateChange: (id: string) => void
  extraFields: ExtraField[]
  onAddExtraField: (key: string) => void
  onAddCustomField: () => void
  onRemoveExtraField: (key: string) => void
  systemFields: SystemField[]
  templates: Template[]
  templateDetails: Record<string, TemplateDetail>
  availableExtraFields: SystemField[]
  onCreate: () => void
}

export function NewTaskDialog({
  open,
  onOpenChange,
  mode,
  onModeChange,
  fields,
  onFieldsChange,
  selectedTemplate,
  onTemplateChange,
  extraFields,
  onAddExtraField,
  onAddCustomField,
  onRemoveExtraField,
  systemFields,
  templates,
  templateDetails,
  availableExtraFields,
  onCreate,
}: NewTaskDialogProps) {
  const renderFieldInput = (key: string, label: string) => {
    const field = systemFields.find(f => f.key === key)
    if (!field) {
      return (
        <div key={key} className="flex items-center gap-2">
          <Input
            className="w-28 h-8"
            placeholder="字段名"
            value={fields[`${key}_label`] || ''}
            onChange={e => onFieldsChange({ ...fields, [`${key}_label`]: e.target.value })}
          />
          <Input
            className="flex-1 h-8"
            placeholder="值"
            value={fields[key] || ''}
            onChange={e => onFieldsChange({ ...fields, [key]: e.target.value })}
          />
        </div>
      )
    }
    if (field.type === 'select' && field.options) {
      return (
        <Select
          value={fields[key] || ''}
          onValueChange={v => onFieldsChange({ ...fields, [key]: v })}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder={`选择${label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map(o => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
    if (field.type === 'date') {
      return (
        <Input
          type="date"
          className="h-8"
          value={fields[key] || ''}
          onChange={e => onFieldsChange({ ...fields, [key]: e.target.value })}
        />
      )
    }
    return (
      <Input
        className="h-8"
        placeholder={`输入${label}`}
        value={fields[key] || ''}
        onChange={e => onFieldsChange({ ...fields, [key]: e.target.value })}
      />
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) {
          onFieldsChange({ name: '', status: '草稿' })
          extraFields.forEach(f => onRemoveExtraField(f.key))
          onTemplateChange('')
        }
        onOpenChange(open)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>新建任务</DialogTitle>
          <DialogDescription>选择创建方式后填写信息</DialogDescription>
        </DialogHeader>
        <div className="flex gap-1 rounded-lg bg-muted p-1 mb-2">
          <button
            type="button"
            onClick={() => {
              onModeChange('quick')
              onTemplateChange('')
              extraFields.forEach(f => onRemoveExtraField(f.key))
            }}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === 'quick' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            快速新建
          </button>
          <button
            type="button"
            onClick={() => onModeChange('template')}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === 'template' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            从模板创建
          </button>
        </div>
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto px-0.5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-name">
              任务名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-name"
              placeholder="请输入任务名称"
              value={fields.name || ''}
              onChange={e => onFieldsChange({ ...fields, name: e.target.value })}
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter' && fields.name?.trim()) onCreate()
              }}
            />
          </div>
          {mode === 'template' && (
            <div className="flex flex-col gap-2">
              <Label>选择模板</Label>
              <div className="grid grid-cols-3 gap-2">
                {templates.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onTemplateChange(t.id)}
                    className={`rounded-lg border-2 p-3 text-left transition-all hover:bg-muted/50 ${selectedTemplate === t.id ? 'border-ring' : 'border-transparent'}`}
                  >
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {templateDetails[t.id]?.fields.map(f => f.label).join('、')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {selectedTemplate && mode === 'template' && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                已选模板：{templateDetails[selectedTemplate]?.label}，将为任务预填相关信息
              </p>
            </div>
          )}
          {extraFields.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>{label}</Label>
                <button
                  type="button"
                  onClick={() => onRemoveExtraField(key)}
                  className="text-[11px] text-muted-foreground hover:text-destructive"
                >
                  移除
                </button>
              </div>
              {renderFieldInput(key, label)}
            </div>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  + 增加字段
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuLabel>系统字段</DropdownMenuLabel>
                {availableExtraFields.map(f => (
                  <DropdownMenuItem key={f.key} onClick={() => onAddExtraField(f.key)}>
                    {f.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onAddCustomField}>+ 自定义字段</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">取消</Button>} />
          <Button onClick={onCreate} disabled={!fields.name?.trim()}>
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
