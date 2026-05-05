---
title: Gantt Component Analysis
status: archived
last_updated: 2026-05-05
---

# 甘特图组件设计与外部库引入建议

## 一、现有实现分析

### 1.1 代码规模

| 文件                   | 行数       | 职责                                        |
| ---------------------- | ---------- | ------------------------------------------- |
| `GanttChart.tsx`       | 136        | 核心渲染（时间轴 + 任务条 + 里程碑 + 分组） |
| `project-gantt.css`    | 660+       | 全部视觉样式（暗色玻璃态）                  |
| `GanttTaskPanel.tsx`   | 102        | 右侧详情面板                                |
| `ProjectGanttView.tsx` | 92         | 页面容器（数据聚合 + 选中态管理）           |
| `data/projectGantt.ts` | 187        | 数据转换（WorkItem → GanttData）            |
| **总计**               | **~1,177** | —                                           |

### 1.2 现有功能清单

| 功能               | 状态 | 说明                                                            |
| ------------------ | ---- | --------------------------------------------------------------- |
| 时间轴（年月层级） | ✅   | 年份行 + 月份行，固定 10 个月跨度                               |
| 任务条             | ✅   | 进度填充、状态色、标签、百分比文字                              |
| 里程碑             | ✅   | 菱形标记，支持完成/计划态                                       |
| 分组（阶段）       | ✅   | 可折叠的分组行，带阶段标题和汇总                                |
| 选中态             | ✅   | 高亮行 + 左侧蓝色边框指示器                                     |
| 关键路径标记       | ✅   | `critical` 字段 + "关键路径" pill                               |
| 状态图例           | ✅   | 已完成/进行中/延误/未开始/里程碑                                |
| 汇总统计           | ✅   | 阶段数、任务数、里程碑数、更新时间                              |
| 右侧详情面板       | ✅   | 进度、负责人、标签、前置任务、关键路径开关                      |
| 响应式             | ✅   | 1440px/1024px/768px 三断点                                      |
| 滚动定位           | ✅   | 左侧元信息 sticky + 顶部时间轴 sticky                           |
| **依赖线可视化**   | ❌   | 数据有 `dependencies`，但只在详情面板文字展示，未在时间轴画连线 |
| **拖拽调整**       | ❌   | 任务条不可拖拽调整起止时间                                      |
| **时间粒度切换**   | ❌   | 仅月视图，无日/周/季切换                                        |
| **今天标记线**     | ❌   | 无当前日期指示线                                                |
| **Hover Tooltip**  | ❌   | 无任务条悬停提示                                                |

### 1.3 设计规范匹配度

**优势：** 现有实现完全基于项目设计规范（暗色玻璃态、14px 圆角、Inter 字体、`--pm-*` 变量体系），视觉一致性极高。

**问题：** 所有样式硬编码在 `project-gantt.css` 中，约 660 行，与渐变色问题类似——大量魔法值、难以复用。

---

## 二、外部甘特图库调研

### 2.1 候选库对比

| 库                         | 功能完整度                                                    | 暗色主题                       | 样式定制           | React 封装                   | 体积   | 许可                 | 社区活跃度     |
| -------------------------- | ------------------------------------------------------------- | ------------------------------ | ------------------ | ---------------------------- | ------ | -------------------- | -------------- |
| **dhtmlx-gantt**           | ⭐⭐⭐ 最全（拖拽、依赖线、资源视图、基线对比、关键路径计算） | ⚠️ 需大量 CSS 覆盖             | 困难（类名固定）   | 官方 React 适配              | ~500KB | GPL/商业版           | 高（老牌）     |
| **gantt-task-react**       | ⭐⭐ 中等（任务条、依赖线、里程碑、层级）                     | ⚠️ 可通过 props 传入 className | 中等               | 原生 React                   | ~50KB  | MIT                  | 中（issue 多） |
| **frappe-gantt**           | ⭐ 简单（任务条、依赖线、拖拽、里程碑）                       | ⚠️ 可 CSS 覆盖                 | 容易               | 需 `react-frappe-gantt` 封装 | ~30KB  | MIT                  | 低             |
| **vis-timeline**           | ⭐⭐ 通用（时间线/甘特图混合）                                | ⚠️ 可 CSS 覆盖                 | 困难（API 偏底层） | `react-vis-timeline`         | ~200KB | Apache               | 中             |
| **syncfusion-react-gantt** | ⭐⭐⭐ 最全（与 dhtmlx 同级）                                 | ✅ 内置多套主题                | 容易               | 官方 React                   | ~400KB | 商业版（免费有水印） | 高             |
| **@mui/x-charts**          | ⭐ 无甘特图                                                   | —                              | —                  | —                            | —      | —                    | —              |

### 2.2 各库详细评估

#### dhtmlx-gantt（功能之王）

```typescript
// 使用示例
import { Gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css' // ❌ 默认主题与项目风格冲突

gantt.config.date_format = '%Y-%m-%d'
gantt.init('gantt-container')
gantt.parse({ data: tasks, links: dependencies })
```

**优点：** 功能最全，支持拖拽、依赖线、关键路径自动计算、资源视图、基线对比
**缺点：**

- 默认主题老旧，要匹配暗色玻璃态需重写几乎全部 CSS（约 300+ 条规则）
- 商业版收费（$599/年起）
- 包体积大，初始化慢
- API 偏命令式，与 React 声明式风格不太匹配

**结论：** 除非需要资源视图/基线对比等高级功能，否则不值得引入。

---

#### gantt-task-react（轻量之选）

```typescript
// 使用示例
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css'; // ❌ 需覆盖为暗色主题

const tasks: Task[] = [
  {
    start: new Date(2024, 1, 1),
    end: new Date(2024, 1, 15),
    name: '设计阶段',
    id: 'Task 0',
    type: 'task',
    progress: 45,
    styles: { progressColor: '#2B7FFF', progressSelectedColor: '#51A2FF' },
  },
];

<Gantt tasks={tasks} viewMode={ViewMode.Month} />
```

**优点：**

- 原生 React，API 友好
- 支持依赖线（`dependencies` 字段）
- 支持日/周/月/年切换
- 体积小

**缺点：**

- 活跃度一般，issue 响应慢
- 不支持分组（阶段）折叠
- 不支持关键路径高亮
- 默认亮色主题，暗色需大量 CSS 覆盖
- 右侧详情面板需自研

**结论：** 适合功能需求简单的场景，但本项目已有分组、关键路径、详情面板，引入后反而要砍掉已有功能。

---

#### frappe-gantt（极简之选）

```typescript
// 使用示例
import Gantt from 'frappe-gantt'

const gantt = new Gantt('#gantt', tasks, {
  view_mode: 'Month',
  custom_popup_html: task => `<div class="tooltip">${task.name}</div>`,
})
```

**优点：** 极小（~30KB）、支持拖拽、依赖线
**缺点：** 功能极简，不支持分组、无详情面板、无状态色
**结论：** 不满足本项目需求。

---

#### syncfusion-react-gantt（企业之选）

**优点：** 功能与 dhtmlx 同级，有官方暗色主题，React 封装好
**缺点：** 免费版有水印，商业版贵（$995/年起），体积大
**结论：** 不适合当前阶段。

---

## 三、建议方案

### 3.1 核心结论

**保持自研，补充 4 个缺失功能。**

理由：

1. 现有实现已经完美匹配设计规范（暗色玻璃态），任何外部库都需要大量样式覆盖
2. 已有功能（分组折叠、关键路径、详情面板）在外部库中要么不支持，要么需付费
3. 缺失的 4 个功能（依赖线、今天标记、Tooltip、粒度切换）实现成本低于引入外部库后的适配成本
4. 甘特图是项目管理核心视图，自研可控性更高

### 3.2 功能补充路线图

```
┌─────────────────────────────────────────────────────────────┐
│  阶段 1（1 天）：基础增强                                      │
│  ├── 今天标记线（红色竖线，标记当前月份位置）                    │
│  ├── Hover Tooltip（任务条悬停显示：名称/起止日期/进度/负责人）   │
│  └── 依赖线可视化（SVG 连线，连接任务条与前置任务）              │
├─────────────────────────────────────────────────────────────┤
│  阶段 2（1-2 天）：交互增强                                    │
│  ├── 时间粒度切换（日/周/月/季 Tab 切换）                      │
│  ├── 任务条拖拽调整起止时间（引入 @dnd-kit/core）               │
│  └── 任务条拖拽调整进度（横向拖拽右边缘）                       │
├─────────────────────────────────────────────────────────────┤
│  阶段 3（可选）：高级功能                                      │
│  ├── 关键路径自动计算（而非仅标记）                             │
│  ├── 资源负载视图（按人员查看任务分布）                         │
│  └── 基线对比（计划 vs 实际时间轴叠加）                         │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 依赖线可视化实现方案

```typescript
// GanttDependencies.tsx — SVG 连线层
import { useMemo } from 'react';
import type { ProjectGanttData, ProjectGanttTaskItem } from '../../data/projectGantt';

type GanttDependenciesProps = {
  groups: ProjectGanttData['groups'];
  taskPositions: Map<string, { x: number; y: number; width: number; height: number }>;
  monthWidth: number;
};

export function GanttDependencies({ groups, taskPositions, monthWidth }: GanttDependenciesProps) {
  const links = useMemo(() => {
    const allTasks = groups.flatMap((g) => g.items);
    const links: Array<{ from: string; to: string }> = [];

    allTasks.forEach((task) => {
      task.dependencies.forEach((depName) => {
        const depTask = allTasks.find((t) => t.name === depName || t.id === depName);
        if (depTask) {
          links.push({ from: depTask.id, to: task.id });
        }
      });
    });

    return links;
  }, [groups]);

  const getPath = (fromId: string, toId: string): string | null => {
    const from = taskPositions.get(fromId);
    const to = taskPositions.get(toId);
    if (!from || !to) return null;

    const startX = from.x + from.width;
    const startY = from.y + from.height / 2;
    const endX = to.x;
    const endY = to.y + to.height / 2;
    const midX = (startX + endX) / 2;

    // 贝塞尔曲线：起点 → 右出 → 中点 → 左入 → 终点
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  };

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.25)" />
        </marker>
      </defs>
      {links.map((link) => {
        const path = getPath(link.from, link.to);
        if (!path) return null;
        return (
          <path
            key={`${link.from}-${link.to}`}
            d={path}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
    </svg>
  );
}
```

### 3.4 今天标记线实现方案

```typescript
// 在 GanttChart.tsx 的时间轴区域增加
const today = new Date();
const todayMonthOffset = getMonthOffsetFromTimelineStart(timelineStart, today);
const showTodayLine = todayMonthOffset >= 0 && todayMonthOffset < timeline.length;

// 渲染
{showTodayLine && (
  <div
    className="gantt-today-line"
    style={{
      position: 'absolute',
      left: `${todayMonthOffset * MONTH_WIDTH + MONTH_WIDTH / 2}px`,
      top: 0,
      bottom: 0,
      width: 2,
      background: 'linear-gradient(180deg, rgba(251, 44, 54, 0.6), rgba(251, 44, 54, 0.2))',
      zIndex: 4,
      pointerEvents: 'none',
    }}
  >
    <span className="gantt-today-label">今天</span>
  </div>
)}
```

### 3.5 时间粒度切换实现方案

无需引入外部库。月视图现有逻辑已完整，日/周/季视图只需调整：

```typescript
type TimeGranularity = 'day' | 'week' | 'month' | 'quarter'

const GRANULARITY_CONFIG: Record<
  TimeGranularity,
  { unitWidth: number; labelFormat: (date: Date) => string }
> = {
  day: { unitWidth: 28, labelFormat: d => `${d.getMonth() + 1}/${d.getDate()}` },
  week: { unitWidth: 48, labelFormat: d => `W${getWeekNumber(d)}` },
  month: { unitWidth: 76, labelFormat: d => `${d.getMonth() + 1}月` },
  quarter: { unitWidth: 120, labelFormat: d => `Q${Math.floor(d.getMonth() / 3) + 1}` },
}
```

### 3.6 拖拽调整（可选，阶段 2）

如需任务条拖拽，引入 `@dnd-kit/core`（已有很多项目使用）：

```bash
npm install @dnd-kit/core @dnd-kit/utilities
```

但需要注意：甘特图的拖拽逻辑特殊（横向拖拽 = 调整起止时间，右边缘拖拽 = 调整时长），`@dnd-kit` 是通用拖拽库，需要较多封装。

**替代方案：** 纯原生 HTML5 drag API + `onMouseDown`/`onMouseMove`/`onMouseUp` 自研，约 100 行代码即可实现任务条拖拽。

---

## 四、CSS 变量化建议

与渐变色 Token 化迁移类似，甘特图的 660+ 行 CSS 也应提取变量：

```css
/* 新增到 index.css :root */
--gantt-bar-height: 12px;
--gantt-bar-radius: 999px;
--gantt-row-height: 52px;
--gantt-group-height: 40px;
--gantt-meta-width: 338px;
--gantt-month-width: 76px;
--gantt-today-color: #fb2c36;
--gantt-dependency-color: rgba(255, 255, 255, 0.25);
--gantt-timeline-grid: var(--pm-card);
```

---

## 五、决策树

```
是否需要资源负载视图或基线对比？
    ├── 是 → 考虑 dhtmlx-gantt 商业版 或 syncfusion（预算允许时）
    └── 否 → 继续自研
            │
            ├── 是否需要拖拽调整任务时间？
            │   ├── 是 → 阶段 2 引入原生拖拽（~100 行）
            │   └── 否 → 保持现有
            │
            ├── 是否需要依赖线可视化？
            │   ├── 是 → 阶段 1 补充 SVG 连线层（~80 行）
            │   └── 否 → 保持现有
            │
            └── 是否需要时间粒度切换？
                ├── 是 → 阶段 2 补充粒度配置（~60 行）
                └── 否 → 保持现有
```

---

## 六、推荐实施顺序

| 优先级 | 功能          | 工作量 | 价值                            |
| ------ | ------------- | ------ | ------------------------------- |
| P0     | 今天标记线    | 0.5 天 | 高（用户最直观的时间参考）      |
| P0     | Hover Tooltip | 0.5 天 | 高（信息密度提升，减少点击）    |
| P1     | 依赖线可视化  | 1 天   | 高（数据已有，只是缺可视化）    |
| P1     | 时间粒度切换  | 1 天   | 中（日/周视图对短周期项目有用） |
| P2     | 任务条拖拽    | 1-2 天 | 中（交互提升，但非刚需）        |
| P3     | CSS 变量化    | 0.5 天 | 低（技术债清理）                |

---

## 七、结论

**不建议引入外部甘特图库。**

现有自研实现已经：

1. ✅ 完美匹配暗色玻璃态设计规范
2. ✅ 功能覆盖项目核心需求（分组、关键路径、详情面板）
3. ✅ 代码量可控（~1,200 行）
4. ✅ 数据流清晰（WorkItem → GanttData → 渲染）

引入任何外部库的收益（主要是拖拽和依赖线自动绘制）都抵不上适配成本（主题覆盖、功能取舍、体积增加）。

**建议投入 2-3 天，按阶段补充 4 个缺失功能，将现有甘特图从"够用"提升到"好用"。**

需要我现在开始实现 P0 功能（今天标记线 + Hover Tooltip）吗？
