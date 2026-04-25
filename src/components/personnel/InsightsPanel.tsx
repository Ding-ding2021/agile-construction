type InsightItem = {
  icon: string;
  level: '致命' | '高' | '中' | '提示';
  source: string;
  time: string;
  accentTitle: string;
  message: string;
  tone: 'red' | 'orange' | 'yellow' | 'blue' | 'green';
};

const insightItems: InsightItem[] = [
  {
    icon: '67.svg',
    level: '致命',
    source: '工程师助手',
    time: '5分钟前',
    accentTitle: '成都春熙路旗舰店',
    message: '消防验收超期，2 项致命问题待处理',
    tone: 'red'
  },
  {
    icon: '69.svg',
    level: '高',
    source: '采购助手',
    time: '12分钟前',
    accentTitle: '物料紧缺预警',
    message: '防火涂料（A 型）库存清零，需紧急补货',
    tone: 'orange'
  },
  {
    icon: '71.svg',
    level: '中',
    source: '客户经理助手',
    time: '28分钟前',
    accentTitle: '客户流失预警',
    message: '永辉超市（华东区）30 天无互动，流失风险 78%',
    tone: 'yellow'
  },
  {
    icon: '73.svg',
    level: '中',
    source: '数据分析助手',
    time: '2小时前',
    accentTitle: '全局进度分析',
    message: '8 个在建项目中 4 个进度低于 50%',
    tone: 'blue'
  },
  {
    icon: '75.svg',
    level: '提示',
    source: '质检助手',
    time: '3小时前',
    accentTitle: 'SI 合规监控',
    message: '重庆解放碑店 SI 评分跌至 72 分（本月新低）',
    tone: 'green'
  }
];

type InsightsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const InsightsPanel = ({ isOpen, onClose }: InsightsPanelProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="pm-insights-backdrop" onClick={onClose} />
      <aside
        className="pm-insights pm-insights-open"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Agent 对话窗口"
      >
        <div className="pm-insights-topbar">
          <div className="pm-insights-top-actions">
            <button type="button"><img src="/assets/CodeBubbyAssets/3848_19/56.svg" alt="" /></button>
            <button type="button"><img src="/assets/CodeBubbyAssets/3848_19/57.svg" alt="" /></button>
            <button type="button" onClick={onClose}><img src="/assets/CodeBubbyAssets/3848_19/58.svg" alt="关闭" /></button>
          </div>

          <div className="pm-insights-hero">
            <div className="pm-insights-hero-icon">
              <div className="pm-insights-hero-icon-bg">
                <img src="/assets/CodeBubbyAssets/3848_19/59.svg" alt="" />
              </div>
              <img className="pm-insights-hero-spark" src="/assets/CodeBubbyAssets/3848_19/60.svg" alt="" />
            </div>
            <div className="pm-insights-hero-copy">
              <div className="pm-insights-hero-title">
                <span>工程师助手</span>
                <img src="/assets/CodeBubbyAssets/3848_19/61.svg" alt="" />
              </div>
              <p>项目施工智能监控</p>
            </div>
          </div>
        </div>

        <div className="pm-insights-mode-tabs">
          <button type="button" className="active">
            <img src="/assets/CodeBubbyAssets/3848_19/63.svg" alt="" />
            <span>主动洞察</span>
            <em>4</em>
          </button>
          <button type="button">
            <img src="/assets/CodeBubbyAssets/3848_19/62.svg" alt="" />
            <span>对话</span>
          </button>
        </div>

        <div className="pm-insights-body">
          <div className="pm-insights-filters">
            <button type="button" className="active"><span>全部</span><em>6</em></button>
            <button type="button">致命</button>
            <button type="button">高风险</button>
          </div>

          <div className="pm-insights-list">
            {insightItems.map((item) => (
              <article key={item.message} className={`pm-insight-card ${item.tone}`}>
                <div className={`pm-insight-icon ${item.tone}`}>
                  <img src={`/assets/CodeBubbyAssets/3848_19/${item.icon}`} alt="" />
                </div>
                <div className="pm-insight-content">
                  <div className="pm-insight-meta-row">
                    <span className={`pm-insight-level ${item.tone}`}>{item.level}</span>
                    <span className="pm-insight-source">{item.source}</span>
                    <span className="pm-insight-time">{item.time}</span>
                  </div>
                  <div className={`pm-insight-accent ${item.tone}`}>{item.accentTitle}</div>
                  <h4>{item.message}</h4>
                </div>
                <img className="pm-insight-arrow" src="/assets/CodeBubbyAssets/3848_19/76.svg" alt="" />
              </article>
            ))}
          </div>

          <button type="button" className="pm-insight-chat">
            <img src="/assets/CodeBubbyAssets/3848_19/77.svg" alt="" />
            <span>切换到对话模式，进一步提问</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default InsightsPanel;
