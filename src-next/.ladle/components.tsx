import type { GlobalProvider } from '@ladle/react'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { installMockApi } from './mock-api'
import '../index.css'

installMockApi()

export const Provider: GlobalProvider = ({ children }) => (
  <BrowserRouter>
    <TooltipProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </TooltipProvider>
  </BrowserRouter>
)
