import { ProjectTaskTree } from '@/pages/projects/components/ProjectTaskTree'

interface TabScopeProps {
  projectCode: string
}

export function TabScope({ projectCode }: TabScopeProps) {
  return (
    <div className="space-y-4">
      <ProjectTaskTree projectCode={projectCode} />
    </div>
  )
}
