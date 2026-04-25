import { mockProjects } from '../components/personnel/projectManagement.data';
import type { ProjectItem as BaseProjectItem } from '../components/personnel/projectManagement.types';

export type ProjectStatusTone = BaseProjectItem['statusTone'];
export type ProjectStage = BaseProjectItem['stage'];
export type ProjectRiskLevel = BaseProjectItem['riskLevel'];

export type ProjectItem = BaseProjectItem & {
  budget: string;
  teamSize: string;
  dateRange: string;
  description: string;
};

const detailOverrides: Record<string, Omit<ProjectItem, keyof BaseProjectItem>> = {
  'PRJ-2024-001': {
    budget: '1,280万',
    teamSize: '26人',
    dateRange: '2024-01-15 ~ 2024-06-15',
    description: '深圳万象城开业项目当前处于执行阶段，重点推进机电安装、精装收口与开业前联合验收，需同步控制关键材料到货节奏。',
  },
  'PRJ-2024-002': {
    budget: '1,560万',
    teamSize: '18人',
    dateRange: '2024-03-01 ~ 2024-08-20',
    description: '北京SKP旗舰店筹建项目目前聚焦方案深化、报审报建与供应商定标，属于高关注度旗舰项目，前置准备要求严格。',
  },
  'PRJ-2024-003': {
    budget: '980万',
    teamSize: '16人',
    dateRange: '2023-11-20 ~ 2024-04-01',
    description: '上海K11艺术商场改造项目已进入收尾阶段，当前主要任务为整改闭环、竣工资料整理与验收交付准备。',
  },
  'PRJ-2024-004': {
    budget: '1,920万',
    teamSize: '32人',
    dateRange: '2024-02-10 ~ 2024-07-30',
    description: '成都太古里二期扩建项目涉及多专业交叉施工，当前存在进度滞后与供应链风险，需要强化跨部门协同与现场排产。',
  },
  'PRJ-2024-005': {
    budget: '860万',
    teamSize: '14人',
    dateRange: '2024-04-08 ~ 2024-10-01',
    description: '广州天环广场品牌升级项目仍处于启动期，核心工作是明确项目边界、锁定投资估算并推动设计与采购联动启动。',
  },
  'PRJ-2024-006': {
    budget: '1,140万',
    teamSize: '21人',
    dateRange: '2024-01-22 ~ 2024-05-20',
    description: '杭州湖滨银泰in77焕新项目整体推进平稳，当前重点在软装陈列、设备联调以及开业节点前的质量巡检。',
  },
  'PRJ-2024-007': {
    budget: '720万',
    teamSize: '13人',
    dateRange: '2024-05-01 ~ 2024-09-15',
    description: '南京德基广场VIP室装修项目处于准备阶段，正推进资源协调、关键工种排班与定制材料的排产确认。',
  },
  'PRJ-2024-008': {
    budget: '1,360万',
    teamSize: '27人',
    dateRange: '2024-02-05 ~ 2024-06-30',
    description: '武汉恒隆广场机电改造项目当前面临高风险预警，需优先处理机电协同、消防验收路径与现场安全问题。',
  },
  'PRJ-2024-009': {
    budget: '1,680万',
    teamSize: '17人',
    dateRange: '2024-06-01 ~ 2024-12-01',
    description: '重庆IFS国金中心扩建项目为城市级重点项目，现阶段以立项审批、投资测算与关键节点排期为主。',
  },
  'PRJ-2024-010': {
    budget: '890万',
    teamSize: '15人',
    dateRange: '2023-12-18 ~ 2024-04-10',
    description: '西安大悦城亲子业态调整项目接近验收完成，当前正集中处理遗留问题、设备调试和开业前准备事项。',
  },
  'PRJ-2024-011': {
    budget: '1,240万',
    teamSize: '23人',
    dateRange: '2024-02-18 ~ 2024-07-15',
    description: '苏州中心广场智慧化升级项目聚焦弱电系统、数字化设备与商业空间联动，目前整体进度稳定但需关注中风险问题。',
  },
  'PRJ-2024-012': {
    budget: '930万',
    teamSize: '16人',
    dateRange: '2024-05-12 ~ 2024-11-01',
    description: '天津天河城品牌焕新项目处于方案评审期，当前关键是完成品牌标准确认、设计冻结与采购计划拆解。',
  },
};

const createFallbackDetail = (project: BaseProjectItem): Omit<ProjectItem, keyof BaseProjectItem> => ({
  budget: '待确认',
  teamSize: '待配置',
  dateRange: `${project.plannedOpenDate} 前筹备`,
  description: `${project.name}当前处于${project.stage}阶段，正在围绕${project.status}状态推进项目目标达成。`,
});

export const projects: ProjectItem[] = mockProjects.map((project) => ({
  ...project,
  ...(detailOverrides[project.code] ?? createFallbackDetail(project)),
}));

export const getProjectByCode = (code: string) =>
  projects.find((project) => project.code === code);
