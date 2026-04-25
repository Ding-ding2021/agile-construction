/**
 * 图标组件系统
 * 统一管理所有图标资源，提供语义化的图标访问方式
 */

export type IconName =
  // 导航图标
  | 'dashboard'
  | 'data-center'
  | 'projects'
  | 'tasks'
  | 'customers'
  | 'contracts'
  | 'procurement'
  | 'orders'
  | 'facility'
  | 'resources'
  | 'standards'
  | 'personnel'
  | 'digital-employee'
  | 'settings'
  // 页头操作图标
  | 'search'
  | 'notification'
  | 'ai-assistant'
  | 'user-avatar'
  | 'dropdown'
  | 'collapse'
  | 'logo'
  // 通用操作图标
  | 'add'
  | 'edit'
  | 'delete'
  | 'save'
  | 'cancel'
  | 'close'
  | 'refresh'
  | 'filter'
  | 'sort'
  | 'more'
  | 'menu'
  // 状态图标
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'loading'
  // 方向箭头
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  // 文件相关
  | 'file'
  | 'folder'
  | 'upload'
  | 'download'
  | 'attachment'
  // 沟通协作
  | 'message'
  | 'comment'
  | 'share'
  | 'link'
  | 'calendar'
  // 项目相关
  | 'milestone'
  | 'phase'
  | 'task'
  | 'risk'
  | 'member'
  | 'activity'
  // 数字员工
  | 'agent'
  | 'bot'
  | 'ai'
  | 'sparkles'

// 图标路径映射
export const iconPaths: Record<IconName, string> = {
  // 导航图标 (来自 3990_3)
  dashboard: '/assets/CodeBubbyAssets/3990_3/42.svg',
  'data-center': '/assets/CodeBubbyAssets/3990_3/43.svg',
  projects: '/assets/CodeBubbyAssets/3990_3/44.svg',
  tasks: '/assets/CodeBubbyAssets/3990_3/45.svg',
  customers: '/assets/CodeBubbyAssets/3990_3/46.svg',
  contracts: '/assets/CodeBubbyAssets/3990_3/47.svg',
  procurement: '/assets/CodeBubbyAssets/3990_3/48.svg',
  orders: '/assets/CodeBubbyAssets/3990_3/49.svg',
  facility: '/assets/CodeBubbyAssets/3990_3/50.svg',
  resources: '/assets/CodeBubbyAssets/3990_3/51.svg',
  standards: '/assets/CodeBubbyAssets/3990_3/51.svg',
  personnel: '/assets/CodeBubbyAssets/3990_3/52.svg',
  'digital-employee': '/assets/CodeBubbyAssets/3990_3/53.svg',
  settings: '/assets/CodeBubbyAssets/3990_3/54.svg',

  // 页头操作图标 (来自 3990_3)
  search: '/assets/CodeBubbyAssets/3990_3/41.svg',
  notification: '/assets/CodeBubbyAssets/3990_3/37.svg',
  'ai-assistant': '/assets/CodeBubbyAssets/3990_3/38.svg',
  'user-avatar': '/assets/CodeBubbyAssets/3990_3/39.svg',
  dropdown: '/assets/CodeBubbyAssets/3990_3/40.svg',
  collapse: '/assets/CodeBubbyAssets/3990_3/55.svg',
  logo: '/assets/CodeBubbyAssets/3990_3/56.png',

  // 通用操作图标 (来自 3990_3)
  add: '/assets/CodeBubbyAssets/3990_3/1.svg',
  edit: '/assets/CodeBubbyAssets/3990_3/2.svg',
  delete: '/assets/CodeBubbyAssets/3990_3/3.svg',
  save: '/assets/CodeBubbyAssets/3990_3/4.svg',
  cancel: '/assets/CodeBubbyAssets/3990_3/5.svg',
  close: '/assets/CodeBubbyAssets/3990_3/6.svg',
  refresh: '/assets/CodeBubbyAssets/3990_3/7.svg',
  filter: '/assets/CodeBubbyAssets/3990_3/8.svg',
  sort: '/assets/CodeBubbyAssets/3990_3/9.svg',
  more: '/assets/CodeBubbyAssets/3990_3/10.svg',
  menu: '/assets/CodeBubbyAssets/3990_3/11.svg',

  // 状态图标
  success: '/assets/CodeBubbyAssets/3990_3/12.svg',
  error: '/assets/CodeBubbyAssets/3990_3/13.svg',
  warning: '/assets/CodeBubbyAssets/3990_3/14.svg',
  info: '/assets/CodeBubbyAssets/3990_3/15.svg',
  loading: '/assets/CodeBubbyAssets/3990_3/16.svg',

  // 方向箭头
  'arrow-up': '/assets/CodeBubbyAssets/3990_3/17.svg',
  'arrow-down': '/assets/CodeBubbyAssets/3990_3/18.svg',
  'arrow-left': '/assets/CodeBubbyAssets/3990_3/19.svg',
  'arrow-right': '/assets/CodeBubbyAssets/3990_3/20.svg',
  'chevron-up': '/assets/CodeBubbyAssets/3990_3/21.svg',
  'chevron-down': '/assets/CodeBubbyAssets/3990_3/22.svg',
  'chevron-left': '/assets/CodeBubbyAssets/3990_3/23.svg',
  'chevron-right': '/assets/CodeBubbyAssets/3990_3/24.svg',

  // 文件相关
  file: '/assets/CodeBubbyAssets/3990_3/25.svg',
  folder: '/assets/CodeBubbyAssets/3990_3/26.svg',
  upload: '/assets/CodeBubbyAssets/3990_3/27.svg',
  download: '/assets/CodeBubbyAssets/3990_3/28.svg',
  attachment: '/assets/CodeBubbyAssets/3990_3/29.svg',

  // 沟通协作
  message: '/assets/CodeBubbyAssets/3990_3/30.svg',
  comment: '/assets/CodeBubbyAssets/3990_3/31.svg',
  share: '/assets/CodeBubbyAssets/3990_3/32.svg',
  link: '/assets/CodeBubbyAssets/3990_3/33.svg',
  calendar: '/assets/CodeBubbyAssets/3990_3/34.svg',

  // 项目相关
  milestone: '/assets/CodeBubbyAssets/3990_3/35.svg',
  phase: '/assets/CodeBubbyAssets/3990_3/36.svg',
  task: '/assets/CodeBubbyAssets/3990_3/37.svg',
  risk: '/assets/CodeBubbyAssets/3990_3/38.svg',
  member: '/assets/CodeBubbyAssets/3990_3/39.svg',
  activity: '/assets/CodeBubbyAssets/3990_3/40.svg',

  // 数字员工
  agent: '/assets/CodeBubbyAssets/3990_3/53.svg',
  bot: '/assets/CodeBubbyAssets/3990_3/53.svg',
  ai: '/assets/CodeBubbyAssets/3990_3/38.svg',
  sparkles: '/assets/CodeBubbyAssets/3990_3/38.svg',
}

// 获取图标路径
export const getIconPath = (name: IconName): string => {
  return iconPaths[name] || iconPaths['info']
}

// 检查图标是否存在
export const hasIcon = (name: string): name is IconName => {
  return name in iconPaths
}

// 导航图标映射（用于侧边栏）
export const navIconMap: Record<string, IconName> = {
  工作台: 'dashboard',
  数据中心: 'data-center',
  项目管理: 'projects',
  任务管理: 'tasks',
  客户管理: 'customers',
  合同结算: 'contracts',
  采购管理: 'procurement',
  订单管理: 'orders',
  设施管理: 'facility',
  资源池: 'resources',
  标准管理: 'standards',
  人员管理: 'personnel',
  数字员工: 'digital-employee',
  系统设置: 'settings',
}
