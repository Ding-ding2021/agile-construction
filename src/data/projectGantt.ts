import type { ProjectItem } from './projects';

export type GanttTaskStatus = 'completed' | 'in-progress' | 'delayed' | 'planned';

export type ProjectGanttTimelineMonth = {
  id: string;
  year: number;
  label: string;
};

export type ProjectGanttTaskItem = {
  id: string;
  kind: 'task' | 'milestone';
  groupId: string;
  groupLabel: string;
  name: string;
  owner: string;
  status: GanttTaskStatus;
  statusLabel: string;
  start: number;
  span: number;
  progress: number;
  startDate: string;
  endDate: string;
  critical: boolean;
  dependencies: string[];
  tags: string[];
  description: string;
};

export type ProjectGanttGroup = {
  id: string;
  label: string;
  summary: string;
  items: ProjectGanttTaskItem[];
};

export type ProjectGanttData = {
  timeline: ProjectGanttTimelineMonth[];
  groups: ProjectGanttGroup[];
  focusTaskId: string;
  updatedAt: string;
  legend: Array<{ label: string; tone: GanttTaskStatus | 'milestone' }>;
  summary: {
    phaseCount: number;
    taskCount: number;
    milestoneCount: number;
  };
};

type TaskTemplate = {
  id: string;
  kind?: 'task' | 'milestone';
  name: string;
  owner: string;
  status: GanttTaskStatus;
  start: number;
  span?: number;
  progress: number;
  startDay: number;
  endDay?: number;
  critical?: boolean;
  dependencies?: string[];
  tags?: string[];
  description: string;
};

type GroupTemplate = {
  id: string;
  label: string;
  summary: string;
  items: TaskTemplate[];
};

const STATUS_LABELS: Record<GanttTaskStatus, string> = {
  completed: '已完成',
  'in-progress': '进行中',
  delayed: '延误',
  planned: '未开始',
};

const DEFAULT_TIMELINE_START = new Date(2024, 9, 1);
const TIMELINE_MONTH_COUNT = 10;

const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1);

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const clampDay = (date: Date, day: number) => Math.min(Math.max(day, 1), getDaysInMonth(date));

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseProjectRange = (dateRange: string) => {
  const [startText] = dateRange.split('~').map((item) => item.trim());
  const parsed = startText ? new Date(`${startText}T00:00:00`) : DEFAULT_TIMELINE_START;
  return Number.isNaN(parsed.getTime()) ? DEFAULT_TIMELINE_START : startOfMonth(parsed);
};

const createTimeline = (timelineStart: Date): ProjectGanttTimelineMonth[] =>
  Array.from({ length: TIMELINE_MONTH_COUNT }, (_, index) => {
    const currentMonth = addMonths(timelineStart, index);
    return {
      id: `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`,
      year: currentMonth.getFullYear(),
      label: `${currentMonth.getMonth() + 1}月`,
    };
  });

const createDateInTimelineMonth = (timelineStart: Date, monthOffset: number, day: number) => {
  const targetMonth = addMonths(timelineStart, monthOffset);
  return new Date(targetMonth.getFullYear(), targetMonth.getMonth(), clampDay(targetMonth, day));
};

const buildGroupTemplates = (project: ProjectItem): GroupTemplate[] => {
  const focusStatus: GanttTaskStatus = project.statusTone === 'red' ? 'delayed' : 'in-progress';
  const focusProgress = project.statusTone === 'red' ? Math.max(project.progress, 72) : Math.max(project.progress, 64);

  return [
    {
      id: 'design',
      label: '设计阶段',
      summary: '方案冻结与图纸审查',
      items: [
        {
          id: 'design-deepen',
          name: '设计深化',
          owner: '李晨',
          status: 'completed',
          start: 0,
          span: 1,
          progress: 100,
          startDay: 3,
          endDay: 24,
          critical: true,
          tags: ['方案冻结', '已完成'],
          description: '完成门头、动线与灯光效果深化，已满足后续施工图出图条件。',
        },
        {
          id: 'si-standard',
          name: 'SI标准深化设计',
          owner: '李静',
          status: 'completed',
          start: 0,
          span: 1,
          progress: 100,
          startDay: 8,
          endDay: 27,
          dependencies: ['design-deepen'],
          tags: ['品牌标准'],
          description: '品牌总部标准已与本地施工要求对齐，重点节点已完成复核。',
        },
        {
          id: 'drawing-review',
          name: '施工图纸会审',
          owner: '王璐',
          status: 'completed',
          start: 1,
          span: 1,
          progress: 100,
          startDay: 5,
          endDay: 21,
          dependencies: ['si-standard'],
          tags: ['图纸会审'],
          description: '完成建筑、机电、弱电专业会审，碰撞问题已形成闭环清单。',
        },
        {
          id: 'design-final',
          kind: 'milestone',
          name: '设计方案终审通过',
          owner: project.owner,
          status: 'completed',
          start: 1,
          progress: 100,
          startDay: 26,
          critical: true,
          dependencies: ['drawing-review'],
          tags: ['里程碑'],
          description: '项目设计成果通过终审，进入结构与现场施工阶段。',
        },
      ],
    },
    {
      id: 'structure',
      label: '结构与隐蔽工程',
      summary: '加固、隔墙与基础工序',
      items: [
        {
          id: 'structure-reinforcement',
          name: '结构加固施工',
          owner: '周工',
          status: 'completed',
          start: 2,
          span: 2,
          progress: 100,
          startDay: 2,
          endDay: 20,
          critical: true,
          dependencies: ['design-final'],
          tags: ['关键路径任务'],
          description: '结构加固区域全部完成，现场已切换至装饰与机电穿插施工。',
        },
        {
          id: 'partition-frame',
          name: '轻钢龙骨隔墙施工',
          owner: '陈工',
          status: 'completed',
          start: 2,
          span: 1,
          progress: 100,
          startDay: 6,
          endDay: 25,
          dependencies: ['structure-reinforcement'],
          tags: ['隐蔽工程'],
          description: '轻钢龙骨与隔墙封板施工已按区域完成交接。',
        },
        {
          id: 'ceiling-partition',
          name: '隔墙与吊顶施工',
          owner: '李哲',
          status: 'completed',
          start: 3,
          span: 1,
          progress: 100,
          startDay: 3,
          endDay: 24,
          dependencies: ['partition-frame'],
          tags: ['现场推进'],
          description: '隔墙与吊顶主施工面已封闭，为饰面与机电收口创造条件。',
        },
        {
          id: 'waterproofing',
          name: '防水层施工',
          owner: '赵工',
          status: 'completed',
          start: 4,
          span: 1,
          progress: 100,
          startDay: 4,
          endDay: 18,
          dependencies: ['ceiling-partition'],
          tags: ['隐蔽工程'],
          description: '后场区域防水施工结束，试水检查无异常。',
        },
        {
          id: 'hidden-acceptance',
          kind: 'milestone',
          name: '隐蔽工程验收',
          owner: project.owner,
          status: 'completed',
          start: 4,
          progress: 100,
          startDay: 25,
          critical: true,
          dependencies: ['waterproofing'],
          tags: ['里程碑'],
          description: '隐蔽工程验收一次通过，项目进入饰面与机电联调并行阶段。',
        },
      ],
    },
    {
      id: 'site',
      label: '机电与现场推进',
      summary: '重点任务与关键路径跟踪',
      items: [
        {
          id: 'site-survey',
          name: '现场勘测与测量',
          owner: project.owner,
          status: focusStatus,
          start: 4,
          span: 4,
          progress: focusProgress,
          startDay: 6,
          endDay: 18,
          critical: true,
          dependencies: ['hidden-acceptance'],
          tags: ['关键路径任务', project.stage],
          description: `${project.name}现场存在多专业穿插复测需求，当前重点跟踪测量复核、机电点位回标与场地净高修正。`,
        },
        {
          id: 'wall-finishes',
          name: '墙面饰面施工',
          owner: '黄工',
          status: 'completed',
          start: 4,
          span: 2,
          progress: 100,
          startDay: 9,
          endDay: 24,
          dependencies: ['site-survey'],
          tags: ['精装'],
          description: '主要展示面饰面完成，局部收口等待机电面板安装后闭合。',
        },
        {
          id: 'mep-commission',
          name: '机电调试完成',
          owner: '罗工',
          status: 'delayed',
          start: 5,
          span: 2,
          progress: 85,
          startDay: 7,
          endDay: 26,
          critical: true,
          dependencies: ['wall-finishes'],
          tags: ['联调', '风险跟踪'],
          description: '机电联调受部分设备晚到影响，正在压缩调试节奏以回收延期。',
        },
        {
          id: 'fire-acceptance',
          kind: 'milestone',
          name: '消防验收通过',
          owner: '刘工',
          status: 'in-progress',
          start: 7,
          progress: 40,
          startDay: 16,
          critical: true,
          dependencies: ['mep-commission'],
          tags: ['里程碑', '报验中'],
          description: '消防报验资料已提交，待完成现场联动复核后进入正式验收。',
        },
      ],
    },
    {
      id: 'opening',
      label: '验收与开业准备',
      summary: '收尾、总部验收与开业节点',
      items: [
        {
          id: 'si-hq-acceptance',
          name: '品牌总部SI验收',
          owner: '孙晴',
          status: 'in-progress',
          start: 6,
          span: 4,
          progress: 78,
          startDay: 5,
          endDay: 14,
          dependencies: ['site-survey'],
          tags: ['品牌验收'],
          description: '总部验收按周滚动推进，当前问题清单聚焦陈列细节与灯光一致性。',
        },
        {
          id: 'demolition-acceptance',
          name: '拆除改造完工验收',
          owner: '王飞',
          status: 'in-progress',
          start: 6,
          span: 2,
          progress: 60,
          startDay: 9,
          endDay: 28,
          dependencies: ['mep-commission'],
          tags: ['完工验收'],
          description: '拆除改造区域已进入验收阶段，仍需补齐两项照片与签认资料。',
        },
        {
          id: 'environment-acceptance',
          name: '环评验收',
          owner: '周岚',
          status: 'delayed',
          start: 7,
          span: 2,
          progress: 55,
          startDay: 4,
          endDay: 21,
          dependencies: ['demolition-acceptance'],
          tags: ['政府验收'],
          description: '环评验收窗口被压缩，需同步推进材料补件与现场整改闭环。',
        },
        {
          id: 'opening-ready',
          name: '开业验收合格',
          kind: 'milestone',
          owner: project.owner,
          status: 'planned',
          start: 8,
          progress: 10,
          startDay: 27,
          critical: true,
          dependencies: ['si-hq-acceptance', 'environment-acceptance', 'fire-acceptance'],
          tags: ['里程碑', '开业准备'],
          description: '开业前联合验收节点，需确保总部、消防、环评与现场整改同时完成。',
        },
      ],
    },
  ];
};

export const getProjectGanttData = (project: ProjectItem): ProjectGanttData => {
  const timelineStart = parseProjectRange(project.dateRange);
  const timeline = createTimeline(timelineStart);
  const groupTemplates = buildGroupTemplates(project);

  const taskNameMap = new Map(groupTemplates.flatMap((group) => group.items.map((item) => [item.id, item.name] as const)));

  const groups = groupTemplates.map<ProjectGanttGroup>((group) => ({
    id: group.id,
    label: group.label,
    summary: group.summary,
    items: group.items.map((item) => {
      const itemKind = item.kind ?? 'task';
      const startDate = createDateInTimelineMonth(timelineStart, item.start, item.startDay);
      const endMonthOffset = itemKind === 'milestone' ? item.start : item.start + (item.span ?? 1) - 1;
      const endDate = createDateInTimelineMonth(timelineStart, endMonthOffset, item.endDay ?? item.startDay);

      return {
        id: item.id,
        kind: itemKind,
        groupId: group.id,
        groupLabel: group.label,
        name: item.name,
        owner: item.owner,
        status: item.status,
        statusLabel: STATUS_LABELS[item.status],
        start: item.start,
        span: item.span ?? 1,
        progress: item.progress,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        critical: item.critical ?? false,
        dependencies: (item.dependencies ?? []).map((dependencyId) => taskNameMap.get(dependencyId) ?? dependencyId),
        tags: item.tags ?? [],
        description: item.description,
      };
    }),
  }));

  const allItems = groups.flatMap((group) => group.items);

  return {
    timeline,
    groups,
    focusTaskId: 'site-survey',
    updatedAt: '今日 09:30',
    legend: [
      { label: '已完成', tone: 'completed' },
      { label: '进行中', tone: 'in-progress' },
      { label: '延误', tone: 'delayed' },
      { label: '未开始', tone: 'planned' },
      { label: '里程碑', tone: 'milestone' },
    ],
    summary: {
      phaseCount: groups.length,
      taskCount: allItems.filter((item) => item.kind === 'task').length,
      milestoneCount: allItems.filter((item) => item.kind === 'milestone').length,
    },
  };
};
