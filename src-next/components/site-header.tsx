import { useNavigate } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

interface BreadcrumbItemData {
  label: string
  to?: string
}

interface SiteHeaderProps {
  title?: string
  breadcrumbs?: BreadcrumbItemData[]
}

export function SiteHeader({ title = 'Documents', breadcrumbs }: SiteHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        {breadcrumbs ? (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, i) => (
                <BreadcrumbItem key={i}>
                  {item.to ? (
                    <button
                      type="button"
                      onClick={() => navigate(item.to!)}
                      className={cn(
                        'text-sm transition-colors hover:text-foreground cursor-pointer',
                        i < breadcrumbs.length - 1 ? 'text-muted-foreground' : 'text-foreground'
                      )}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <BreadcrumbPage className="text-sm">{item.label}</BreadcrumbPage>
                  )}
                  {i < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator>
                      <span className="text-muted-foreground/50">/</span>
                    </BreadcrumbSeparator>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <h1 className="text-base font-medium">{title}</h1>
        )}
      </div>
    </header>
  )
}
