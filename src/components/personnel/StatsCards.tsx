import type { ProjectStats, ProjectFilters } from './projectManagement.types';

type StatCardProps = {
  icon: string;
  deltaIcon: string;
  label: string;
  value: number;
  delta: string;
  tone: 'blue' | 'green' | 'purple' | 'orange';
  active?: boolean;
  onClick?: () => void;
};

const StatCard = ({ icon, deltaIcon, label, value, delta, tone, active, onClick }: StatCardProps) => (
  <div 
    className={`pm-stat-card pm-stat-${tone} ${active ? 'active' : ''}`}
    onClick={onClick}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.();
      }
    }}
    tabIndex={0}
    role="button"
    aria-label={`${label}: ${value}`}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="pm-stat-top">
      <div className="pm-stat-icon-wrap">
        <img src={`/assets/CodeBubbyAssets/3848_19/${icon}`} alt="" />
      </div>
      <span className={`pm-stat-delta pm-stat-delta-${tone}`}>
        <img src={`/assets/CodeBubbyAssets/3848_19/${deltaIcon}`} alt="" />
        {delta}
      </span>
    </div>
    <div className="pm-stat-label">{label}</div>
    <div className="pm-stat-value">{value}</div>
  </div>
);

type StatsCardsProps = {
  stats: ProjectStats;
  activeStatKey: ProjectFilters['statKey'];
  onStatCardClick: (statKey: ProjectFilters['statKey']) => void;
};

const StatsCards = ({ stats, activeStatKey, onStatCardClick }: StatsCardsProps) => {
  const cards: Array<{
    key: ProjectFilters['statKey'];
    icon: string;
    deltaIcon: string;
    label: string;
    value: number;
    delta: string;
    tone: 'blue' | 'green' | 'purple' | 'orange';
  }> = [
    { 
      key: 'all', 
      icon: '1.svg', 
      deltaIcon: '2.svg', 
      label: '全部项目', 
      value: stats.total, 
      delta: '+8', 
      tone: 'blue' 
    },
    { 
      key: 'active', 
      icon: '3.svg', 
      deltaIcon: '6.svg', 
      label: '执行中', 
      value: stats.active, 
      delta: '+3', 
      tone: 'green' 
    },
    { 
      key: 'pendingAcceptance', 
      icon: '5.svg', 
      deltaIcon: '6.svg', 
      label: '待验收', 
      value: stats.pendingAcceptance, 
      delta: '+2', 
      tone: 'purple' 
    },
    { 
      key: 'risk', 
      icon: '7.svg', 
      deltaIcon: '8.svg', 
      label: '风险预警', 
      value: stats.risk, 
      delta: '-1', 
      tone: 'orange' 
    }
  ];

  return (
    <div className="pm-stats-row">
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

export default StatsCards;
