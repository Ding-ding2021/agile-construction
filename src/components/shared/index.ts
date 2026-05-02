/**
 * 共享组件库导出
 *
 * 本模块统一导出所有共享组件，方便各模块使用
 *
 * @example
 * ```tsx
 * import { AppSidebar, PageHeader, StatCard } from '@/components/shared';
 * ```
 */

// Navigation components
export { default as AppSidebar } from './navigation/AppSidebar'
export { default as PageHeader } from './navigation/PageHeader'
export { default as TabNav } from './navigation/TabNav'
export type { TabNavItem, TabNavProps, TabNavVariant } from './navigation/TabNav'

// Layout components
export { default as AppShell } from './layout/AppShell'

// Data display components
export { default as StatCard } from './data-display/StatCard'
export { default as Pagination } from './data-display/Pagination'
export { default as StatsCards } from './data-display/StatsCards'

// Filter components
export { default as ListToolbar } from './filters/ListToolbar'
export { default as ViewToggle } from './filters/ViewToggle'
export type { ViewToggleItem } from './filters/ViewToggle'

// Feedback components
export { default as EmptyState } from './feedback/EmptyState'
export type { EmptyStateProps } from './feedback/EmptyState'

// MUI 封装组件 (预设样式，暗色玻璃态主题)
// import { PmButton, PmInput, PmTable } from '@/components/shared/mui';
// 如需直接使用 MUI 组件：
// import { Button, Dialog, Chip } from '@/components/shared/mui';
// 如需使用 MUI Icons：
// import { Save, Delete } from '@mui/icons-material';

// Form components
export { PmUserSelect, PmDatePicker, PmDateTimePicker, PmTagSelect } from './forms'
export type {
  UserSelectOption,
  PmUserSelectProps,
  PmDatePickerProps,
  PmDateTimePickerProps,
  PmTagOption,
  PmTagSelectProps,
} from './forms'

// Icon components
export { default as Icon } from './icons/Icon'
export { type IconName, getIconPath, hasIcon, navIconMap } from './icons'

// Shared ProjectCard component
export { default as ProjectCard } from './ProjectCard'
export type { ProjectCardProps } from './ProjectCard'
