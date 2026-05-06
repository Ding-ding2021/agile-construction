"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSettings } from "@/hooks/useSettings"
import { LayoutDashboard, CheckSquare, FolderKanban, Users, Settings, Package } from "lucide-react"

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/default.jpg",
  },
  navMain: [
    {
      title: "仪表盘",
      url: "/dashboard",
      icon: <LayoutDashboard />,
      isActive: true,
    },
    {
      title: "任务管理",
      url: "/tasks",
      icon: <CheckSquare />,
      items: [
        { title: "全部任务", url: "/tasks" },
        { title: "待执行", url: "/tasks?status=pending" },
        { title: "已完成", url: "/tasks?status=done" },
      ],
    },
    {
      title: "项目管理",
      url: "/projects",
      icon: <FolderKanban />,
      items: [
        { title: "项目列表", url: "/projects" },
        { title: "项目看板", url: "/projects/board" },
      ],
    },
    {
      title: "人员管理",
      url: "/personnel",
      icon: <Users />,
    },
    {
      title: "系统设置",
      url: "/settings",
      icon: <Settings />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { settings } = useSettings()

  const showLogo = !!settings.logo

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <a href="/dashboard" className="flex items-center gap-2 px-4 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          {/* Collapsed logo (square) — shown when sidebar is icon-only */}
          {showLogo ? (
            <img src={settings.logo!} alt="Logo" className="size-5 shrink-0 rounded group-data-[collapsible=icon]:flex hidden object-contain" />
          ) : (
            <svg className="size-5 shrink-0 group-data-[collapsible=icon]:flex hidden" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="oklch(0.205 0 0)" />
              <rect x="7" y="7" width="6" height="14" rx="1.5" fill="oklch(0.985 0 0)" />
              <rect x="15" y="11" width="6" height="10" rx="1.5" fill="oklch(0.708 0 0)" />
            </svg>
          )}

          {/* Expanded logo (horizontal) — shown when sidebar is expanded */}
          <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden">
            {showLogo ? (
              <img src={settings.logo!} alt="Logo" className="size-7 shrink-0 rounded object-contain" />
            ) : (
              <svg className="size-7 shrink-0" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="6" fill="oklch(0.205 0 0)" />
                <rect x="7" y="7" width="6" height="14" rx="1.5" fill="oklch(0.985 0 0)" />
                <rect x="15" y="11" width="6" height="10" rx="1.5" fill="oklch(0.708 0 0)" />
              </svg>
            )}
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">数字营建</span>
              <span className="text-[10px] text-muted-foreground">Digital Construction</span>
            </div>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
