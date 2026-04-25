const ASSET_BASE = '/assets/CodeBubbyAssets/3923_861';

type PhaseItem = {
  id: number;
  title: string;
  date: string;
  progress: number;
  iconDot: string;
  iconLine?: string;
  handle?: string;
  tone: 'green' | 'blue';
};

const phases: readonly PhaseItem[] = [
  {
    id: 1, title: '设计深化', date: '2024-01-10 ~ 2024-03-15', progress: 100,
    iconDot: '17.svg', iconLine: '18.svg', tone: 'green'
  },
  {
    id: 2, title: '拆除与结构改造', date: '2024-03-16 ~ 2024-06-30', progress: 100,
    iconDot: '19.svg', iconLine: '20.svg', tone: 'green'
  },
  {
    id: 3, title: '隔墙与吊顶施工', date: '2024-07-01 ~ 2025-01-31', progress: 72,
    iconDot: '21.svg', iconLine: '22.svg', handle: '23.svg', tone: 'blue'
  },
  {
    id: 4, title: '机电与消防安装', date: '2024-10-01 ~ 2025-04-30', progress: 35,
    iconDot: '24.svg', iconLine: '25.svg', handle: '26.svg', tone: 'blue'
  },
  {
    id: 5, title: '精装修与软装陈设', date: '2025-02-01 ~ 2025-05-31', progress: 0,
    iconDot: '27.svg', iconLine: '28.svg', handle: '29.svg', tone: 'blue'
  },
  {
    id: 6, title: '验收与开业准备', date: '2025-06-01 ~ 2025-06-30', progress: 0,
    iconDot: '30.svg', handle: '31.svg', tone: 'blue'
  }
] as const;

const milestones = [
  { id: 1, name: '设计方案终审通过', date: '2024-02-28', person: '张伟', icon: '32.svg', bgClass: 'bg-green-light', dateClass: 'text-green' },
  { id: 2, name: '拆除改造完工验收', date: '2024-06-20', person: '李建国', icon: '33.svg', bgClass: 'bg-green-light', dateClass: 'text-yellow' },
  { id: 3, name: '吊顶隔墙封板完成', date: '计划: 2025-01-15', person: '张伟', icon: '34.svg', bgClass: 'bg-blue-light', dateClass: 'text-muted' },
  { id: 4, name: '机电设备调试完成', date: '计划: 2025-04-15', person: '王晓明', icon: '35.svg', bgClass: 'bg-gray-light', dateClass: 'text-muted' },
  { id: 5, name: '消防验收通过', date: '计划: 2025-05-30', person: '赵敏', icon: '36.svg', bgClass: 'bg-gray-light', dateClass: 'text-muted' },
  { id: 6, name: '开业验收合格', date: '计划: 2025-06-25', person: '张伟', icon: '37.svg', bgClass: 'bg-gray-light', dateClass: 'text-muted' }
] as const;

const PhasesCard = () => {
  return (
    <div className="card phases-card">
      <div className="card-header">
        <img src={`${ASSET_BASE}/16.svg`} alt="" />
        <h2>阶段与里程碑</h2>
      </div>
      
      <div className="phases-timeline">
        {phases.map((phase) => (
          <div className="phase-item" key={phase.id}>
            <div className="phase-icon">
              <img src={`${ASSET_BASE}/${phase.iconDot}`} alt="" className="icon-dot" />
              {phase.iconLine && <img src={`${ASSET_BASE}/${phase.iconLine}`} alt="" className="icon-line" />}
            </div>
            <div className="phase-content">
              <div className="phase-info">
                <h3>{phase.title}</h3>
                <p>{phase.date}</p>
              </div>
              <div className="phase-progress">
                <div className="mini-progress-bar">
                  <div className={`mini-progress-fill ${phase.tone}`} style={{ width: `${phase.progress}%` }}>
                    {phase.handle && (
                      <img
                        src={`${ASSET_BASE}/${phase.handle}`}
                        alt=""
                        className={`progress-handle ${phase.progress === 0 ? 'zero-handle' : ''}`}
                      />
                    )}
                  </div>
                </div>
                <span className="mini-progress-text">{phase.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="milestones-title">关键里程碑</h3>
      <div className="milestones-list">
        {milestones.map((milestone) => (
          <div className="milestone-item" key={milestone.id}>
            <div className={`milestone-icon ${milestone.bgClass}`}>
              <img src={`${ASSET_BASE}/${milestone.icon}`} alt="" />
            </div>
            <div className="milestone-name">{milestone.name}</div>
            <div className={`milestone-date ${milestone.dateClass}`}>{milestone.date}</div>
            <div className="milestone-person">{milestone.person}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhasesCard;
