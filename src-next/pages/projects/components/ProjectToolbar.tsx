import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Search, Plus } from 'lucide-react'

interface ProjectToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  onNewProject: () => void
}

export function ProjectToolbar({ search, onSearchChange, onNewProject }: ProjectToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <InputGroup className="w-72">
        <InputGroupAddon>
          <Search className="size-4 text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="搜索项目..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </InputGroup>
      <Button size="sm" onClick={onNewProject}>
        <Plus className="size-4" />
        新建项目
      </Button>
    </div>
  )
}
