export type SharedNavItem = {
  icon: string
  label: string
  href?: string
  disabled?: boolean
}

export const defaultNavItems: SharedNavItem[] = [
  { icon: '42.svg', label: '工作台', disabled: true },
  { icon: '43.svg', label: '数据中心', disabled: true },
  { icon: '44.svg', label: '项目管理', href: '#/projects' },
  { icon: '45.svg', label: '任务管理', href: '#/tasks' },
  { icon: '46.svg', label: '客户管理', href: '#/customers' },
  { icon: '47.svg', label: '合同结算', href: '#/contracts' },
  { icon: '48.svg', label: '采购管理', href: '#/procurement' },
  { icon: '49.svg', label: '订单管理', href: '#/orders' },
  { icon: '50.svg', label: '设施管理', href: '#/facility' },
  { icon: '51.svg', label: '资源池', href: '#/resources' },
  { icon: '51.svg', label: '标准管理', href: '#/standards' },
  { icon: '52.svg', label: '人员管理', href: '#/personnel' },
  { icon: '53.svg', label: '数字员工', href: '#/digital-employee' },
  { icon: '54.svg', label: '系统设置', href: '#/settings' },
]
