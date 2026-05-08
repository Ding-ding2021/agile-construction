import { EmbeddableWBS } from '@/components/embeddable-wbs'

interface TabScopeProps {
  projectCode: string
}

export function TabScope({ projectCode }: TabScopeProps) {
  return (
    <div className="space-y-4">
      <EmbeddableWBS projectCode={projectCode} />
    </div>
  )
}
