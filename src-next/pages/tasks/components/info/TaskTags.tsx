import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tag, Plus } from 'lucide-react'

interface TaskTagsProps {
  tags: string[]
  readonly?: boolean
  onAddTag?: () => void
}

export default function TaskTags({ tags, readonly, onAddTag }: TaskTagsProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">标签</h3>
      <div className="flex gap-1.5 flex-wrap items-center">
        {tags.length === 0 && (
          <span className="text-xs text-muted-foreground">无标签</span>
        )}
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1 text-[11px]">
            <Tag className="size-3" />
            {tag}
          </Badge>
        ))}
        {!readonly && (
          <Button variant="outline" size="sm" className="h-6 text-xs gap-1" onClick={onAddTag}>
            <Plus className="size-3" />
            添加
          </Button>
        )}
      </div>
    </div>
  )
}
