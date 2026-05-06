import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, CheckSquare, FolderKanban, Users, Settings, Package } from 'lucide-react'

const NAV_GROUPS = [
  {
    label: '概览',
    items: [
      { label: '工作台', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: '核心',
    items: [
      { label: '任务管理', href: '/tasks', icon: CheckSquare },
      { label: '项目管理', href: '/projects', icon: FolderKanban },
    ],
  },
  {
    label: '其他',
    items: [
      { label: '人员管理', href: '/personnel', icon: Users },
      { label: '系统设置', href: '/settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-56 shrink-0 border-r border-border bg-background lg:flex flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2 h-14 shrink-0 px-5 border-b border-border">
        <Package className="size-5" />
        <span className="font-semibold text-sm">数字营建</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto no-scrollbar px-3 py-5">
        <div className="flex flex-col gap-6">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="px-2 mb-2 text-[13px] font-medium text-muted-foreground">
                {group.label}
              </p>
              <div className="flex flex-col">
                {group.items.map(item => {
                  const active =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[0.8rem] font-medium transition-colors',
                        active
                          ? 'text-foreground bg-accent'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version */}
      <div className="px-5 py-3 border-t border-border text-[13px] text-muted-foreground">
        v2.0.0
      </div>
    </aside>
  )
}
