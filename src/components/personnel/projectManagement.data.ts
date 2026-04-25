/**
 * 项目管理页面的 mock 数据和配置
 */

import type { ProjectItem, ProjectStage } from './projectManagement.types';

/**
 * 项目列表 mock 数据
 */
export const mockProjects: ProjectItem[] = [
  {
    name: '深圳万象城开业项目',
    code: 'PRJ-2024-001',
    brand: '万象城',
    stage: '执行',
    status: '进行中',
    statusTone: 'blue',
    progress: 65,
    milestone: '8/12',
    tasks: '23/35',
    riskLevel: 'medium',
    riskCount: 3,
    plannedOpenDate: '2024-06-15',
    owner: '张三'
  },
  {
    name: '北京SKP旗舰店筹建',
    code: 'PRJ-2024-002',
    brand: 'SKP',
    stage: '准备',
    status: '审批中',
    statusTone: 'yellow',
    progress: 25,
    milestone: '2/8',
    tasks: '8/20',
    riskLevel: 'low',
    riskCount: 1,
    plannedOpenDate: '2024-08-20',
    owner: '李四'
  },
  {
    name: '上海K11艺术商场改造',
    code: 'PRJ-2024-003',
    brand: 'K11',
    stage: '收尾',
    status: '待验收',
    statusTone: 'green',
    progress: 92,
    milestone: '11/12',
    tasks: '32/35',
    riskLevel: null,
    riskCount: 0,
    plannedOpenDate: '2024-04-01',
    owner: '王五'
  },
  {
    name: '成都太古里二期扩建',
    code: 'PRJ-2024-004',
    brand: '太古里',
    stage: '执行',
    status: '进度滞后',
    statusTone: 'red',
    progress: 48,
    milestone: '5/15',
    tasks: '18/40',
    riskLevel: 'high',
    riskCount: 5,
    plannedOpenDate: '2024-07-30',
    owner: '赵六'
  },
  {
    name: '广州天环广场品牌升级',
    code: 'PRJ-2024-005',
    brand: '天环广场',
    stage: '启动',
    status: '规划中',
    statusTone: 'blue',
    progress: 10,
    milestone: '1/10',
    tasks: '2/25',
    riskLevel: null,
    riskCount: 0,
    plannedOpenDate: '2024-10-01',
    owner: '孙七'
  },
  {
    name: '杭州湖滨银泰in77焕新',
    code: 'PRJ-2024-006',
    brand: '银泰',
    stage: '执行',
    status: '进行中',
    statusTone: 'blue',
    progress: 72,
    milestone: '9/12',
    tasks: '27/30',
    riskLevel: 'low',
    riskCount: 1,
    plannedOpenDate: '2024-05-20',
    owner: '周八'
  },
  {
    name: '南京德基广场VIP室装修',
    code: 'PRJ-2024-007',
    brand: '德基广场',
    stage: '准备',
    status: '资源协调',
    statusTone: 'yellow',
    progress: 35,
    milestone: '3/8',
    tasks: '10/18',
    riskLevel: 'medium',
    riskCount: 2,
    plannedOpenDate: '2024-09-15',
    owner: '吴九'
  },
  {
    name: '武汉恒隆广场机电改造',
    code: 'PRJ-2024-008',
    brand: '恒隆广场',
    stage: '执行',
    status: '待协调',
    statusTone: 'red',
    progress: 55,
    milestone: '7/12',
    tasks: '20/32',
    riskLevel: 'critical',
    riskCount: 7,
    plannedOpenDate: '2024-06-30',
    owner: '郑十'
  },
  {
    name: '重庆IFS国金中心扩建',
    code: 'PRJ-2024-009',
    brand: 'IFS',
    stage: '启动',
    status: '立项审批',
    statusTone: 'blue',
    progress: 5,
    milestone: '0/10',
    tasks: '1/28',
    riskLevel: null,
    riskCount: 0,
    plannedOpenDate: '2024-12-01',
    owner: '陈一'
  },
  {
    name: '西安大悦城亲子业态调整',
    code: 'PRJ-2024-010',
    brand: '大悦城',
    stage: '收尾',
    status: '验收中',
    statusTone: 'green',
    progress: 88,
    milestone: '10/12',
    tasks: '30/32',
    riskLevel: 'low',
    riskCount: 1,
    plannedOpenDate: '2024-04-10',
    owner: '刘二'
  },
  {
    name: '苏州中心广场智慧化升级',
    code: 'PRJ-2024-011',
    brand: '苏州中心',
    stage: '执行',
    status: '进行中',
    statusTone: 'blue',
    progress: 60,
    milestone: '7/14',
    tasks: '21/38',
    riskLevel: 'medium',
    riskCount: 3,
    plannedOpenDate: '2024-07-15',
    owner: '张三'
  },
  {
    name: '天津天河城品牌焕新',
    code: 'PRJ-2024-012',
    brand: '天河城',
    stage: '准备',
    status: '方案评审',
    statusTone: 'yellow',
    progress: 20,
    milestone: '2/9',
    tasks: '5/22',
    riskLevel: null,
    riskCount: 0,
    plannedOpenDate: '2024-11-01',
    owner: '李四'
  }
];

/**
 * 统计卡片配置
 */
export const statsCardConfig = [
  {
    key: 'all' as const,
    label: '全部项目',
    icon: '/assets/CodeBubbyAssets/3848_19/46.svg',
    color: 'default'
  },
  {
    key: 'active' as const,
    label: '执行中',
    icon: '/assets/CodeBubbyAssets/3848_19/47.svg',
    color: 'blue'
  },
  {
    key: 'pendingAcceptance' as const,
    label: '待验收',
    icon: '/assets/CodeBubbyAssets/3848_19/48.svg',
    color: 'green'
  },
  {
    key: 'risk' as const,
    label: '风险预警',
    icon: '/assets/CodeBubbyAssets/3848_19/49.svg',
    color: 'red'
  }
];

/**
 * 分组选项配置
 */
export const groupOptions = [
  { value: 'none', label: '不分组' },
  { value: 'stage', label: '按阶段' },
  { value: 'owner', label: '按负责人' },
  { value: 'brand', label: '按品牌' }
];

/**
 * 排序选项配置
 */
export const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'name-asc', label: '项目名称 A-Z' },
  { value: 'progress-desc', label: '进度从高到低' },
  { value: 'planned-open-asc', label: '计划开业时间' },
  { value: 'risk-desc', label: '风险等级优先' }
];

/**
 * 项目阶段枚举
 */
export const stageOptions: ProjectStage[] = ['启动', '准备', '执行', '收尾'];

/**
 * 状态选项
 */
export const statusOptions = [
  '规划中',
  '立项审批',
  '审批中',
  '方案评审',
  '资源协调',
  '进行中',
  '待协调',
  '进度滞后',
  '验收中',
  '待验收'
];

/**
 * 每页条数选项
 */
export const pageSizeOptions = [10, 20, 50, 100];
