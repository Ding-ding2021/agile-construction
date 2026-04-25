import type { CSSProperties } from 'react';
import type { ProjectGanttData, ProjectGanttTaskItem } from '../../data/projectGantt';

type GanttChartProps = {
  timeline: ProjectGanttData['timeline'];
  groups: ProjectGanttData['groups'];
  selectedTaskId: string;
  onTaskSelect: (taskId: string) => void;
};

const META_WIDTH = 338;
const MONTH_WIDTH = 76;

const buildYearSegments = (timeline: ProjectGanttData['timeline']) => {
  const segments: Array<{ year: number; count: number }> = [];

  timeline.forEach((month) => {
    const currentSegment = segments[segments.length - 1];

    if (currentSegment?.year === month.year) {
      currentSegment.count += 1;
      return;
    }

    segments.push({ year: month.year, count: 1 });
  });

  return segments;
};

const getBarStyle = (task: ProjectGanttTaskItem): CSSProperties => ({
  left: `${task.start * MONTH_WIDTH + 10}px`,
  width: `${Math.max(task.span * MONTH_WIDTH - 18, 18)}px`,
});

const getMilestoneStyle = (task: ProjectGanttTaskItem): CSSProperties => ({
  left: `${task.start * MONTH_WIDTH + MONTH_WIDTH / 2}px`,
});

const getProgressStyle = (progress: number): CSSProperties => ({
  width: `${Math.min(Math.max(progress, 10), 100)}%`,
});

const GanttChart = ({ timeline, groups, selectedTaskId, onTaskSelect }: GanttChartProps) => {
  const yearSegments = buildYearSegments(timeline);
  const timelineWidth = timeline.length * MONTH_WIDTH;
  const timelineStyle = {
    width: timelineWidth,
    minWidth: timelineWidth,
    backgroundSize: `${MONTH_WIDTH}px 100%`,
  } satisfies CSSProperties;

  return (
    <div className="gantt-board-scroll">
      <div className="gantt-board-shell" style={{ minWidth: META_WIDTH + timelineWidth }}>
        <div className="gantt-table-header">
          <div className="gantt-meta-header" style={{ width: META_WIDTH, minWidth: META_WIDTH }}>
            <span>任务名称</span>
            <span>负责人</span>
            <span>状态</span>
          </div>

          <div className="gantt-timeline-header" style={{ width: timelineWidth, minWidth: timelineWidth }}>
            <div className="gantt-year-row">
              {yearSegments.map((segment) => (
                <span key={segment.year} style={{ width: segment.count * MONTH_WIDTH }}>
                  {segment.year}年
                </span>
              ))}
            </div>
            <div className="gantt-month-row">
              {timeline.map((month) => (
                <span key={month.id} style={{ width: MONTH_WIDTH }}>
                  {month.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="gantt-table-body">
          {groups.map((group) => (
            <div key={group.id} className="gantt-group-block">
              <div className="gantt-group-row">
                <div className="gantt-group-meta" style={{ width: META_WIDTH, minWidth: META_WIDTH }}>
                  <span className="gantt-group-dot" />
                  <span className="gantt-group-title">{group.label}</span>
                  <span className="gantt-group-summary">{group.summary}</span>
                </div>
                <div className="gantt-group-track" style={timelineStyle} />
              </div>

              {group.items.map((task) => {
                const isSelected = task.id === selectedTaskId;
                const isMilestone = task.kind === 'milestone';

                return (
                  <button
                    key={task.id}
                    type="button"
                    className={`gantt-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => onTaskSelect(task.id)}
                  >
                    <div className="gantt-row-meta" style={{ width: META_WIDTH, minWidth: META_WIDTH }}>
                      <div className="gantt-row-name-cell">
                        <span className={`gantt-row-name ${isMilestone ? 'milestone' : ''}`}>{task.name}</span>
                        {task.critical && <span className="gantt-critical-pill">关键路径</span>}
                      </div>
                      <span className="gantt-row-owner">{task.owner}</span>
                      <span className={`gantt-status-chip ${task.status}`}>{task.statusLabel}</span>
                    </div>

                    <div className="gantt-row-timeline" style={timelineStyle}>
                      {isMilestone ? (
                        <span className={`gantt-milestone ${task.status}`} style={getMilestoneStyle(task)} />
                      ) : (
                        <span className={`gantt-bar ${task.status} ${task.span <= 1 ? 'compact' : ''}`} style={getBarStyle(task)}>
                          <span className="gantt-bar-progress" style={getProgressStyle(task.progress)} />
                          {task.span > 1 && <span className="gantt-bar-label">{task.name}</span>}
                          <span className="gantt-bar-value">{task.progress}%</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
