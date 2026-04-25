import type { TaskFilters, TaskStats } from './taskManagement.types';

type StatCardProps = {
  icon: string;
  deltaIcon: string;
  label: string;
  value: number;
  delta: string;
  tone: 'blue' | 'green' | 'orange' | 'red';
  active?: boolean;
  onClick?: () => void;
};

const StatCard = ({ icon, deltaIcon, label, value, delta, tone, active, onClick }: StatCardProps) => (
  <div
    className={`tm-stat-card tm-stat-${tone} ${active ? 'active' : ''}`}
    onClick={onClick}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.();
      }
    }}
    role="button"
    tabIndex={0}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="tm-stat-top">
      <div className="tm-stat-icon-wrap">
        <img src={`/assets/CodeBubbyAssets/3947_2/${icon}`} alt="" />
      </div>
      <span className={`tm-stat-delta tm-stat-delta-${tone}`}>
        <img src={`/assets/CodeBubbyAssets/3947_2/${deltaIcon}`} alt="" />
        {delta}
      </span>
    </div>
    <div className="tm-stat-label">{label}</div>
    <div className="tm-stat-value">{value}</div>
  </div>
);

type TaskStatsCardsProps = {
  stats: TaskStats;
  activeStatKey: TaskFilters['statKey'];
  onStatCardClick: (statKey: TaskFilters['statKey']) => void;
};

const TaskStatsCards = ({ stats, activeStatKey, onStatCardClick }: TaskStatsCardsProps) => {
  const cards: Array<{
    key: TaskFilters['statKey'];
    icon: string;
    deltaIcon: string;
    label: string;
    value: number;
    delta: string;
    tone: 'blue' | 'green' | 'orange' | 'red';
  }> = [
    { key: 'all', icon: '1.svg', deltaIcon: '2.svg', label: '全部任务数', value: stats.total, delta: '—', tone: 'blue' },
    { key: 'pendingAssign', icon: '3.svg', deltaIcon: '4.svg', label: '待分配数', value: stats.pendingAssign, delta: '—', tone: 'blue' },
    { key: 'executing', icon: '5.svg', deltaIcon: '6.svg', label: '执行中数', value: stats.executing, delta: '—', tone: 'blue' },
    { key: 'pendingSubmit', icon: '7.svg', deltaIcon: '8.svg', label: '待提交数', value: stats.pendingSubmit, delta: '—', tone: 'orange' },
    { key: 'pendingAcceptance', icon: '1.svg', deltaIcon: '2.svg', label: '待验收数', value: stats.pendingAcceptance, delta: '—', tone: 'orange' },
    { key: 'slaRisk', icon: '3.svg', deltaIcon: '4.svg', label: '超时/即将超时数', value: stats.slaWarningOrOverdue, delta: '—', tone: 'red' },
    { key: 'blocked', icon: '5.svg', deltaIcon: '6.svg', label: '阻塞任务数', value: stats.blocked, delta: '—', tone: 'red' },
  ];

  return (
    <div className="tm-stats-row">
      {cards.map((card) => (
        <StatCard
          key={card.key}
          icon={card.icon}
          deltaIcon={card.deltaIcon}
          label={card.label}
          value={card.value}
          delta={card.delta}
          tone={card.tone}
          active={activeStatKey === card.key}
          onClick={() => onStatCardClick(card.key)}
        />
      ))}
    </div>
  );
};

export default TaskStatsCards;
