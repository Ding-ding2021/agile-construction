import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Paperclip, Upload, FileText, Image, FileArchive, File } from 'lucide-react'
import type { TaskAttachment } from '@/types/task'

interface TaskAttachmentsProps {
  attachments: TaskAttachment[]
  readonly?: boolean
  onUpload?: () => void
}

function fileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return <FileText className="size-3.5 text-red-500" />
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext ?? ''))
    return <Image className="size-3.5 text-blue-500" />
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext ?? ''))
    return <FileArchive className="size-3.5 text-amber-500" />
  return <File className="size-3.5 text-muted-foreground" />
}

export default function TaskAttachments({ attachments, readonly, onUpload }: TaskAttachmentsProps) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          附件 ({attachments.length})
        </h4>
        {!readonly && (
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onUpload}>
            <Upload className="size-3" />
            上传
          </Button>
        )}
      </div>

      {attachments.length === 0 && (
        <p className="text-xs text-muted-foreground py-2 text-center">暂无附件</p>
      )}

      <div className="space-y-1">
        {attachments.map(att => (
          <div key={att.id} className="flex items-center gap-2 py-1.5 border-b last:border-b-0">
            {fileIcon(att.fileName)}
            <span className="text-sm truncate flex-1">{att.fileName}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {att.fileSizeKb > 1024
                ? `${(att.fileSizeKb / 1024).toFixed(1)}MB`
                : `${att.fileSizeKb}KB`}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
