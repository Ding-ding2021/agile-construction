import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TaskDetailTabsProps {
  activeTab: 'detail' | 'history'
  onTabChange: (tab: 'detail' | 'history') => void
}

export default function TaskDetailTabs({ activeTab, onTabChange }: TaskDetailTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={v => onTabChange(v as 'detail' | 'history')}>
      <TabsList>
        <TabsTrigger value="detail">详情</TabsTrigger>
        <TabsTrigger value="history">历史</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
