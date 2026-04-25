# 日历/看板/卡片/地图视图组件评估与建议

## 一、日历视图

### 1.1 现状

| 模块         | 状态        | 实现方式                      | 说明                               |
| ------------ | ----------- | ----------------------------- | ---------------------------------- |
| **项目中心** | ❌ 未实现   | `ProjectPlaceholderView` 占位 | 仅显示"功能开发中"占位图           |
| **任务中心** | ⚠️ 简化实现 | `TaskListView.tsx` 内联       | 按日期分组纵向排列，非标准日历网格 |

**任务中心现有日历视图结构：**

```
4月1日
  ├── 任务A
  └── 任务B
4月3日
  └── 任务C
4月5日
  ├── 任务D
  └── 任务E
```

**问题：**

- 不是真正的"日历"（无月历网格、无周/日切换）
- 日期不连续时有大量空白（如 4月1日 → 4月3日 之间缺少 4月2日）
- 无法直观看到某周/某月的任务密度分布

### 1.2 需求分析

项目中心日历视图应展示：

- 项目里程碑日期
- 项目计划开业日期
- 关键任务截止日期

任务中心日历视图应展示：

- 任务计划起止日期
- 任务状态色块
- 按日/周/月切换粒度

### 1.3 外部库调研

| 库                      | 功能                               | React 封装               | 暗色主题          | 体积   | 许可   |
| ----------------------- | ---------------------------------- | ------------------------ | ----------------- | ------ | ------ |
| **@mui/x-date-pickers** | 日期选择器（非日历视图）           | ✅ 官方                  | ✅ 跟随 MUI Theme | ~80KB  | MIT    |
| **react-big-calendar**  | 完整日历视图（月/周/日/ agenda）   | ✅ 原生 React            | ⚠️ 需 CSS 覆盖    | ~60KB  | MIT    |
| **fullcalendar**        | 最完整日历（月/周/日/时间轴/资源） | ✅ `@fullcalendar/react` | ⚠️ 需 CSS 覆盖    | ~100KB | MIT    |
| **react-calendar**      | 轻量月历                           | ✅ 原生 React            | ⚠️ 需 CSS 覆盖    | ~20KB  | MIT    |
| **daypilot-pro-react**  | 企业级（甘特+日历+调度）           | ✅                       | ✅ 内置主题       | ~200KB | 商业版 |

**推荐：fullcalendar 或 react-big-calendar**

#### fullcalendar 详细评估

```typescript
// 安装
// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

<FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  }}
  events={tasks.map(t => ({
    id: t.code,
    title: t.name,
    start: t.plannedStartAt,
    end: t.plannedEndAt,
    backgroundColor: statusColorMap[t.status],
    borderColor: 'transparent',
  }))}
  eventClick={(info) => onTaskOpen(info.event.id)}
/>
```

**优点：**

- 功能最全（月/周/日/时间轴/列表视图）
- 支持拖拽调整事件时间
- 支持事件拉伸调整时长
- 国际化完善

**缺点：**

- 默认亮色主题，暗色需大量 CSS 覆盖（约 50+ 条规则）
- 包体积较大（核心 + 插件 ≈ 100KB gzip）
- 样式系统与项目设计规范差异大

#### react-big-calendar 详细评估

```typescript
// 安装
// npm install react-big-calendar

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import zhCN from 'date-fns/locale/zh-CN';

const locales = { 'zh-CN': zhCN };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

<Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  views={['month', 'week', 'day', 'agenda']}
  style={{ height: 600 }}
/>
```

**优点：**

- API 更简洁
- 样式覆盖比 fullcalendar 容易
- 支持自定义事件渲染（`components.event`）

**缺点：**

- 功能比 fullcalendar 少（无资源视图、无时间轴）
- 拖拽需额外插件
- 同样需暗色主题覆盖

### 1.4 建议方案

**短期（当前阶段）：任务中心先用自研简化日历，项目中心保持占位**

任务中心现有"按日期分组"已基本可用，只需优化：

1. 补充空日期占位（显示"无任务"或隐藏空日期）
2. 增加日期筛选（本周/本月/自定义范围）
3. 增加任务密度指示（某日期任务多时的视觉提示）

**中期（V1.2 Phase 2）：引入 react-big-calendar**

理由：

- 项目中心和任务中心都需要真正的日历网格
- react-big-calendar 体积适中，API 简洁
- 可以通过自定义 `components` 完全控制事件渲染，匹配暗色玻璃态

```typescript
// 自定义事件渲染，匹配设计规范
const components = {
  event: ({ event }: { event: CalendarEvent }) => (
    <div className="pm-calendar-event" data-status={event.status}>
      <span className="pm-calendar-event-dot" />
      <span className="pm-calendar-event-title">{event.title}</span>
    </div>
  ),
  toolbar: (props: ToolbarProps) => (
    <div className="pm-calendar-toolbar">
      {/* 自定义工具栏，匹配设计规范 */}
    </div>
  ),
};
```

**长期（V1.5+）：如需资源调度视图，升级到 fullcalendar**

---

## 二、看板视图

### 2.1 现状

| 模块         | 状态      | 实现方式                | 功能                                   |
| ------------ | --------- | ----------------------- | -------------------------------------- |
| **项目中心** | ✅ 已实现 | `ProjectKanbanView.tsx` | 按阶段分列（启动/计划/执行/监控/收尾） |
| **任务中心** | ✅ 已实现 | `TaskListView.tsx` 内联 | 按状态分列（待处理/进行中/已完成等）   |

**项目中心看板（ProjectKanbanView）：**

- 150 行 TSX，结构清晰
- 支持空状态
- 卡片包含：名称、编号、品牌、进度条、统计、负责人、风险等级
- ❌ 无拖拽（卡片不能在列之间拖拽移动）

**任务中心看板（TaskListView 内联）：**

- 20 行内联实现
- 卡片简单：名称、编号、摘要元信息
- ❌ 无拖拽

### 2.2 需求分析

看板的核心价值在于**拖拽状态流转**：

- 任务从"待处理"拖到"进行中" → 自动更新状态
- 项目从"计划"拖到"执行" → 触发状态机校验

### 2.3 外部库调研

| 库                      | 功能                           | React 封装         | 拖拽      | 体积  | 许可   |
| ----------------------- | ------------------------------ | ------------------ | --------- | ----- | ------ |
| **@dnd-kit**            | 通用拖拽底层                   | ✅ `@dnd-kit/core` | ✅ 底层   | ~15KB | MIT    |
| **react-beautiful-dnd** | 列表拖拽（Atlassian）          | ✅                 | ✅ 列表间 | ~40KB | Apache |
| **@hello-pangea/dnd**   | react-beautiful-dnd 的维护分支 | ✅                 | ✅ 列表间 | ~40KB | Apache |
| **react-dnd**           | 通用拖拽（老派）               | ✅                 | ✅ 底层   | ~30KB | MIT    |

**推荐：@dnd-kit/core + @dnd-kit/sortable**

理由：

- 现代、活跃、TypeScript 友好
- 不是"看板组件"，而是"拖拽底层"——可以精确控制视觉和交互
- 与现有自研看板结构完美兼容（只需给卡片加拖拽句柄）
- 体积最小（~15KB）

### 2.4 建议方案

**保持自研看板，引入 @dnd-kit 补充拖拽**

不需要引入"看板组件库"（如 react-trello 等），因为：

1. 现有看板视觉已经完美匹配设计规范
2. 看板逻辑简单（列 + 卡片），自研完全可控
3. 只需补充拖拽能力

**实施步骤（1-2 天）：**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

```typescript
// ProjectKanbanView.tsx —— 增加拖拽能力
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 可拖拽卡片
function SortableKanbanCard({ item, onClick }: { item: ProjectItem; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.code,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* 现有卡片内容 */}
      <div className="pm-kanban-card" onClick={onClick}>
        {/* ... */}
      </div>
    </div>
  );
}

// 看板容器
function KanbanColumn({ stage, projects, onProjectClick, onDragEnd }) {
  return (
    <div className="pm-kanban-column">
      <div className="pm-kanban-column-header">{stage}</div>
      <SortableContext items={projects.map(p => p.code)} strategy={verticalListSortingStrategy}>
        <div className="pm-kanban-column-body">
          {projects.map(item => (
            <SortableKanbanCard
              key={item.code}
              item={item}
              onClick={() => onProjectClick(item)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// 主组件
export function ProjectKanbanBoard({ groups, onProjectClick, onMoveProject }) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // 确定目标列
    const targetStage = over.data.current?.stage;
    if (targetStage) {
      onMoveProject(String(active.id), targetStage);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="pm-kanban-container">
        {Array.from(groups.entries()).map(([stage, stageProjects]) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            projects={stageProjects}
            onProjectClick={onProjectClick}
          />
        ))}
      </div>
    </DndContext>
  );
}
```

**注意：** 项目拖拽涉及状态机校验（如"计划"→"执行"需要前置条件），拖拽后需调用 `canTransition` 做守卫验证，失败时回滚并提示。

---

## 三、卡片组件

### 3.1 现状

#### 已组件化（共享层）

| 组件           | 位置                             | 用途         | 复用度         |
| -------------- | -------------------------------- | ------------ | -------------- |
| **StatCard**   | `shared/data-display/StatCard`   | 统计数字卡片 | 高（10+ 页面） |
| **StatsCards** | `shared/data-display/StatsCards` | 统计卡片组   | 高（10+ 页面） |
| **Pagination** | `shared/data-display/Pagination` | 分页         | 中（4-5 页面） |

#### 未组件化（业务层重复实现）

| 组件                 | 位置                         | 实现方式                | 问题       |
| -------------------- | ---------------------------- | ----------------------- | ---------- |
| **项目卡片（网格）** | `ProjectGridView.tsx` 内联   | 每个字段单独写 JSX      | 无法复用   |
| **项目卡片（看板）** | `ProjectKanbanView.tsx` 内联 | 与网格卡片结构 80% 重复 | 无法复用   |
| **任务卡片（看板）** | `TaskListView.tsx` 内联      | 简化版卡片              | 无法复用   |
| **任务卡片（日历）** | `TaskListView.tsx` 内联      | 简化版卡片              | 无法复用   |
| **项目信息卡片**     | `ProjectInfoCard.tsx`        | 独立组件，但项目专用    | 仅项目详情 |
| **阶段卡片**         | `PhasesCard.tsx`             | 独立组件，项目专用      | 仅项目详情 |
| **成员卡片**         | `ProjectMembersCard.tsx`     | 独立组件，项目专用      | 仅项目详情 |

### 3.2 问题分析

**核心问题：同一实体（项目/任务）在不同视图中的卡片重复实现。**

以"项目卡片"为例：

- 网格视图（ProjectGridView）：名称、编号、品牌标签、阶段标签、进度条、里程碑数、任务数、开业日期、负责人、风险等级
- 看板视图（ProjectKanbanView）：名称、编号、品牌标签、进度条、里程碑数、任务数、负责人、风险等级
- 差异：网格多了"阶段标签"和"开业日期"，看板多了"状态 badge"

**理想状态：一套 `ProjectCard` 组件，通过 props 控制显示哪些字段。**

### 3.3 建议方案

#### 阶段 1：提取通用卡片组件（1 天）

```typescript
// src/components/shared/cards/ProjectCard.tsx
import type { ProjectItem } from '../../../data/projects';

type ProjectCardVariant = 'grid' | 'kanban' | 'compact';

type ProjectCardProps = {
  project: ProjectItem;
  variant?: ProjectCardVariant;
  onClick?: (project: ProjectItem) => void;
  showStage?: boolean;
  showOpenDate?: boolean;
  showStatus?: boolean;
  showRisk?: boolean;
};

export function ProjectCard({
  project,
  variant = 'grid',
  onClick,
  showStage = variant === 'grid',
  showOpenDate = variant === 'grid',
  showStatus = variant === 'kanban',
  showRisk = true,
}: ProjectCardProps) {
  return (
    <div
      className={`pm-project-card pm-project-card--${variant}`}
      onClick={() => onClick?.(project)}
      role="button"
      tabIndex={0}
    >
      <div className="pm-project-card__header">
        <div className="pm-project-card__name">{project.name}</div>
        {showStatus && (
          <span className={`pm-project-card__status ${project.statusTone}`}>
            {project.status}
          </span>
        )}
      </div>

      <div className="pm-project-card__meta">
        <span>{project.code}</span>
        <span className="pm-brand-tag">{project.brand}</span>
        {showStage && <span className="pm-stage-tag">{project.stage}</span>}
      </div>

      <div className="pm-project-card__progress">
        <div className="pm-project-card__progress-header">
          <span>进度</span>
          <span>{project.progress}%</span>
        </div>
        <div className="pm-line-progress">
          <div className={`pm-line-progress-fill ${project.statusTone}`} style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className="pm-project-card__stats">
        <div className="pm-project-card__stat">
          <Icon name="milestone" size="xs" />
          <span>{project.milestone}</span>
        </div>
        <div className="pm-project-card__stat">
          <Icon name="task" size="xs" />
          <span>{project.tasks}</span>
        </div>
      </div>

      <div className="pm-project-card__footer">
        <div>
          {showOpenDate && <span>{project.plannedOpenDate}</span>}
          <span>{project.owner}</span>
        </div>
        {showRisk && project.riskLevel && (
          <span className={`pm-risk-badge ${project.riskLevel}`}>
            {riskLevelMap[project.riskLevel].label}
          </span>
        )}
      </div>
    </div>
  );
}
```

#### 阶段 2：提取通用任务卡片（0.5 天）

```typescript
// src/components/shared/cards/TaskCard.tsx
export function TaskCard({
  task,
  variant = 'kanban',
  onClick,
  showProjectName = true,
  showOwner = true,
  showDates = false,
}: TaskCardProps) {
  // 类似 ProjectCard 的结构
}
```

#### 阶段 3：提取通用空状态组件（0.5 天）

```typescript
// src/components/shared/feedback/EmptyState.tsx
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  // 替换各页面重复的空状态实现
}
```

当前至少有 6 处重复的空状态实现（ProjectGridView、ProjectKanbanView、ProjectPlaceholderView、TaskListView 等）。

---

## 四、地图视图

### 4.1 现状

| 模块             | 状态      | 说明                          |
| ---------------- | --------- | ----------------------------- |
| **项目中心**     | ❌ 未实现 | `ProjectPlaceholderView` 占位 |
| **Roadmap 规划** | ✅ 已规划 | Phase 2 W15-W16 接入高德地图  |

### 4.2 Roadmap 规划（development-plan-v1.2.md）

```
Phase 2 W15-W16: 地理信息基础
├── 申请高德地图 JS API Key（Web端）
├── 封装 src/services/geo/amap.ts：地址解析、逆地理编码、地图初始化
├── 项目立项页：地址输入框 + 地图选点 → 自动填充省市区 + 经纬度
└── 项目中心：地图视图（按项目状态色块标记）
```

### 4.3 外部库调研

| 库/服务             | 类型         | 功能                       | 成本               | 暗色主题          |
| ------------------- | ------------ | -------------------------- | ------------------ | ----------------- |
| **高德地图 JS API** | 国内地图服务 | 地图、标记、地址解析、路线 | 免费额度充足       | ✅ 支持自定义样式 |
| **腾讯地图 JS API** | 国内地图服务 | 类似高德                   | 免费额度充足       | ✅ 支持自定义样式 |
| **百度地图 JS API** | 国内地图服务 | 类似高德                   | 免费额度充足       | ✅ 支持自定义样式 |
| **Mapbox GL JS**    | 国际地图引擎 | 矢量地图、高度定制         | 免费额度 50,000/月 | ✅ 暗色主题优秀   |
| **Leaflet**         | 开源地图库   | 轻量、插件丰富             | 免费               | ⚠️ 需 Tile 提供商 |

### 4.4 建议方案

**推荐：高德地图 JS API**

理由：

1. Roadmap 已明确规划高德地图
2. 国内地址解析准确度最高（地址是中文，高德训练数据最优）
3. 免费额度对个人/中小企业充足（日 1 万次地理编码）
4. 支持自定义地图样式，可匹配暗色主题

**实施步骤（按 Roadmap Phase 2）：**

```typescript
// src/services/geo/amap.ts
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY;

export async function geocodeAddress(address: string): Promise<{
  lat: number;
  lng: number;
  province: string;
  city: string;
  district: string;
} | null> {
  const res = await fetch(
    `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${AMAP_KEY}`
  );
  const data = await res.json();
  if (data.status !== '1' || !data.geocodes?.[0]) return null;

  const loc = data.geocodes[0];
  const [lng, lat] = loc.location.split(',').map(Number);
  return {
    lat, lng,
    province: loc.province,
    city: loc.city,
    district: loc.district,
  };
}

// 地图组件封装
export function AmapContainer({
  projects,
  onMarkerClick,
}: {
  projects: ProjectItem[];
  onMarkerClick?: (project: ProjectItem) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // 动态加载高德地图脚本
    loadAMapScript().then(() => {
      mapInstance.current = new window.AMap.Map(mapRef.current, {
        zoom: 10,
        center: [116.397428, 39.90923], // 默认北京
        mapStyle: 'amap://styles/dark', // 暗色主题
      });

      // 添加标记
      projects.forEach((project) => {
        if (!project.lat || !project.lng) return;
        const marker = new window.AMap.Marker({
          position: [project.lng, project.lat],
          title: project.name,
          icon: new window.AMap.Icon({
            // 自定义图标，按状态色
            image: getStatusMarkerIcon(project.statusTone),
            size: new window.AMap.Size(24, 24),
          }),
        });
        marker.on('click', () => onMarkerClick?.(project));
        marker.setMap(mapInstance.current);
      });
    });

    return () => {
      mapInstance.current?.destroy();
      mapInstance.current = null;
    };
  }, [projects, onMarkerClick]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}
```

**地图视图 UI 设计：**

```
┌─────────────────────────────────────────────┐
│  搜索框 + 筛选器（品牌/状态/负责人）            │
├─────────────────────────────────────────────┤
│                                             │
│           地图区域（占满剩余空间）              │
│                                             │
│     📍 蓝色=进行中  🟢 绿色=已完成            │
│     🟠 橙色=监控中  ⚪ 灰色=未开始            │
│                                             │
├─────────────────────────────────────────────┤
│  底部项目列表（选中/悬浮时显示）                │
└─────────────────────────────────────────────┘
```

---

## 五、综合建议与优先级

### 5.1 各组件决策矩阵

| 组件         | 现状                                | 建议                        | 工作量 | 优先级       |
| ------------ | ----------------------------------- | --------------------------- | ------ | ------------ |
| **日历视图** | 项目中心占位；任务中心简化版        | 中期引入 react-big-calendar | 2-3 天 | P1           |
| **看板拖拽** | 已实现，无拖拽                      | 引入 @dnd-kit 补充拖拽      | 1-2 天 | P0           |
| **卡片组件** | 统计卡片已组件化；项目/任务卡片重复 | 提取 ProjectCard + TaskCard | 1.5 天 | P0           |
| **地图视图** | 占位                                | 按 Roadmap Phase 2 接入高德 | 2-3 天 | P1（已排期） |
| **空状态**   | 6+ 处重复实现                       | 提取 EmptyState 共享组件    | 0.5 天 | P0           |

### 5.2 推荐实施顺序

```
Week 1（P0，立即执行）：
  ├── Day 1: 提取 EmptyState 组件，替换 6 处空状态
  ├── Day 2: 提取 ProjectCard 组件，替换 GridView + KanbanView
  ├── Day 3: 提取 TaskCard 组件，替换 TaskListView 中的看板/日历卡片
  └── Day 4-5: 看板引入 @dnd-kit，实现拖拽状态流转

Week 2（P1，按需执行）：
  ├── 日历视图：引入 react-big-calendar，定制暗色主题
  └── 地图视图：按 Roadmap Phase 2 排期执行
```

### 5.3 产出文件规划

| 文件                                            | 说明                          |
| ----------------------------------------------- | ----------------------------- |
| `src/components/shared/cards/ProjectCard.tsx`   | 项目通用卡片                  |
| `src/components/shared/cards/TaskCard.tsx`      | 任务通用卡片                  |
| `src/components/shared/feedback/EmptyState.tsx` | 空状态组件                    |
| `src/components/shared/dnd/KanbanBoard.tsx`     | 看板拖拽容器（基于 @dnd-kit） |
| `src/services/geo/amap.ts`                      | 高德地图服务封装              |
| `src/components/shared/maps/AmapContainer.tsx`  | 地图容器组件                  |

需要我现在开始执行 P0 项（提取 EmptyState + ProjectCard + TaskCard）吗？
