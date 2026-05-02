import { useEffect, useMemo, useRef, useState } from 'react'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import { navigateByHash } from '../../config/navigation'
import './digital-employee-page.css'

type StatCard = {
  icon: string
  value: string
  label: string
  subLabel: string
  tone: 'blue' | 'green' | 'purple' | 'orange'
}

type AgentCard = {
  name: string
  subtitle: string
  description: string
  tags: string[]
  processed: string
  response: string
  accuracy: string
  version: string
  icon: string
  versionIcon: string
  online: boolean
  tone: 'blue' | 'cyan' | 'orange' | 'green' | 'violet' | 'rose'
  launchTo?: string
}

const ASSET_BASE = '/assets/CodeBubbyAssets/4106_3892'

const statCards: StatCard[] = [
  { icon: '1.svg', value: '5', label: '活跃 Agent', subLabel: '共 6 个', tone: 'blue' },
  { icon: '2.svg', value: '2,334', label: '今日处理任务', subLabel: '+12% vs 昨日', tone: 'green' },
  { icon: '3.svg', value: '1.2s', label: '平均响应时间', subLabel: 'P99 < 3s', tone: 'purple' },
  { icon: '4.svg', value: '93.8%', label: '综合准确率', subLabel: '满意度 4.8/5', tone: 'orange' },
]

const agentCards: AgentCard[] = [
  {
    name: '工程师助手',
    subtitle: '项目施工智能监控',
    description:
      '专注于门店建设项目全程监控，实时分析进度偏差、关键路径风险及变更影响，为项目经理提供决策支持。',
    tags: ['进度分析', '风险预警', '工期优化', '变更评估', '甘特协调', '关键路径追踪'],
    processed: '328',
    response: '1.2s',
    accuracy: '94.2%',
    version: 'EngineerGPT-4 · v2.3.1',
    icon: '9.svg',
    versionIcon: '11.svg',
    online: true,
    tone: 'blue',
    launchTo: '#/projects',
  },
  {
    name: '客户经理助手',
    subtitle: '智能客户洞察与跟进',
    description:
      '深度分析客户价值与行为，自动识别合同机会，生成跟进建议，提升门店开发成功率与客户留存。',
    tags: ['客户分析', '跟进提醒', '合同机会识别', 'CLV 预测', '流失预警', '价值评估'],
    processed: '512',
    response: '0.8s',
    accuracy: '91.8%',
    version: 'CustomerAI-3 · v1.8.4',
    icon: '13.svg',
    versionIcon: '15.svg',
    online: true,
    tone: 'cyan',
    launchTo: '#/contracts',
  },
  {
    name: '采购专员助手',
    subtitle: '供应链优化与采购决策',
    description:
      '自动比对供应商报价，追踪物料到货状态，识别供应链风险，确保工程材料及时到位、成本最优。',
    tags: ['询价比对', '供应商评估', '到货追踪', '成本分析', '紧急采购预警', '合规检查'],
    processed: '186',
    response: '1.5s',
    accuracy: '89.3%',
    version: 'ProcureAI-2 · v1.5.2',
    icon: '17.svg',
    versionIcon: '19.svg',
    online: true,
    tone: 'orange',
    launchTo: '#/procurement',
  },
  {
    name: '合同财务助手',
    subtitle: '合同风险与结算管理',
    description:
      '智能审查合同条款，自动计算结算金额，实时监控预算超支，生成合规审计报告，降低财务风险。',
    tags: ['合同审查', '结算计算', '超支预警', '合规检查', '付款节点提醒', '税务合规'],
    processed: '274',
    response: '2.1s',
    accuracy: '96.5%',
    version: 'FinanceGPT-3 · v2.1.0',
    icon: '21.svg',
    versionIcon: '23.svg',
    online: true,
    tone: 'green',
    launchTo: '#/contracts',
  },
  {
    name: '质检审计助手',
    subtitle: '工程质量监控与审计',
    description:
      '依据 SI 标准对施工质量进行智能评估，自动生成验收清单，追踪质量问题整改闭环，确保品牌标准达标。',
    tags: ['质量评估', '验收清单', '问题追踪', '整改督促', 'SI 合规报告', '照片分析'],
    processed: '143',
    response: '1.8s',
    accuracy: '93.1%',
    version: 'QualityAI-2 · v1.2.3',
    icon: '25.svg',
    versionIcon: '27.svg',
    online: false,
    tone: 'violet',
    launchTo: '#/standards',
  },
  {
    name: '数据分析助手',
    subtitle: '多维数据洞察与决策报告',
    description:
      '整合全链路工程数据，自动生成可视化分析报告，识别异常趋势，为管理层提供高层次战略决策参考。',
    tags: ['数据可视化', '趋势预测', '报表生成', '异常检测', 'KPI 监控', '对标分析'],
    processed: '891',
    response: '0.5s',
    accuracy: '97.8%',
    version: 'AnalyticsGPT-4 · v3.0.1',
    icon: '29.svg',
    versionIcon: '31.svg',
    online: true,
    tone: 'rose',
    launchTo: '#/projects',
  },
]

const designActions = [
  {
    key: 'template-library',
    title: '模板库',
    description: '快速应用列表模板与布局方案',
    icon: '5.svg',
    to: '#/settings?section=template-library',
  },
  {
    key: 'style-preset',
    title: '样式预设',
    description: '一键切换品牌色与视觉密度',
    icon: '7.svg',
    to: '#/settings?section=style-preset',
  },
  {
    key: 'field-config',
    title: '字段配置',
    description: '自定义列表显示字段与顺序',
    icon: '8.svg',
    to: '#/settings?section=field-config',
  },
] as const

const DigitalEmployeePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [showDesignPanel, setShowDesignPanel] = useState(false)
  const designPanelRef = useRef<HTMLDivElement | null>(null)
  const currentHash = window.location.hash || '#/digital-employee'

  const designFeaturePanel = (
    <div className="de-design-feature-wrap" ref={designPanelRef}>
      <button
        type="button"
        className="de-design-feature-btn"
        onClick={() => setShowDesignPanel(prev => !prev)}
        aria-haspopup="dialog"
        aria-expanded={showDesignPanel}
        aria-controls="de-design-feature-panel"
      >
        <img src={`${ASSET_BASE}/6.svg`} alt="" />
        <span>设计功能</span>
      </button>

      {showDesignPanel ? (
        <div
          id="de-design-feature-panel"
          className="de-design-feature-panel"
          role="dialog"
          aria-label="设计功能面板"
        >
          <header className="de-design-panel-head">
            <strong>快速设计</strong>
            <span>常用能力入口</span>
          </header>
          <div className="de-design-panel-list">
            {designActions.map(action => (
              <button
                key={action.key}
                type="button"
                className="de-design-panel-item"
                onClick={() => {
                  setShowDesignPanel(false)
                  navigateByHash(action.to)
                }}
              >
                <span className="de-design-item-icon">
                  <img src={`${ASSET_BASE}/${action.icon}`} alt="" />
                </span>
                <span className="de-design-item-copy">
                  <strong>{action.title}</strong>
                  <span>{action.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )

  const filteredCards = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()
    if (!keyword) {
      return agentCards
    }

    return agentCards.filter(card =>
      `${card.name}${card.subtitle}${card.description}${card.tags.join('')}`
        .toLowerCase()
        .includes(keyword)
    )
  }, [searchQuery])

  const onlineCount = useMemo(() => agentCards.filter(card => card.online).length, [])

  const avgAccuracy = useMemo(() => {
    if (filteredCards.length === 0) {
      return '0.0%'
    }

    const total = filteredCards.reduce((sum, card) => sum + Number.parseFloat(card.accuracy), 0)
    return `${(total / filteredCards.length).toFixed(1)}%`
  }, [filteredCards])

  useEffect(() => {
    if (!showDesignPanel) {
      return
    }

    const onClickOutside = (event: MouseEvent) => {
      if (!designPanelRef.current?.contains(event.target as Node)) {
        setShowDesignPanel(false)
      }
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDesignPanel(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)

    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [showDesignPanel])

  return (
    <div className="de-page">
      <div className="de-glow de-glow-left" />
      <div className="de-glow de-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <div className="pm-workspace">
        <main className="pm-main">
          <PageHeader
            title="AI 智能助手中心"
            subtitle="6 个专业 Agent · 覆盖全链路业务场景"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="搜索..."
            extraActions={designFeaturePanel}
          />

          <div className="pm-body de-main">
            <StatsCards
              items={statCards.map(item => ({
                key: item.label,
                icon: item.icon,
                label: item.label,
                value: item.value,
                tone: item.tone,
                subLabel: item.subLabel,
              }))}
              className="pm-stats-row"
              classNamePrefix="pm"
              assetBase={ASSET_BASE}
              layout="horizontal"
            />

            <section className="de-list-head" aria-label="助手列表说明">
              <div className="de-list-head-left">
                <div className="de-list-title">
                  <img src={`${ASSET_BASE}/7.svg`} alt="" />
                  <h3>全部 Agent</h3>
                </div>
                <p>支持卡片与列表双视图，便于快速运营与批量管理</p>
                <div className="de-list-toolbar" role="group" aria-label="列表操作">
                  <div className="de-view-switch" role="group" aria-label="视图切换">
                    <button
                      type="button"
                      className={`de-view-btn ${viewMode === 'card' ? 'active' : ''}`}
                      onClick={() => setViewMode('card')}
                    >
                      卡片视图
                    </button>
                    <button
                      type="button"
                      className={`de-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      列表视图
                    </button>
                  </div>
                  <span className="de-online-count">
                    <img src={`${ASSET_BASE}/8.svg`} alt="" />
                    {onlineCount} 个 Agent 在线运行
                  </span>
                </div>
              </div>

              <div className="de-list-head-right">
                <div className="de-design-feature-wrap" ref={designPanelRef}>
                  <button
                    type="button"
                    className="de-design-feature-btn"
                    onClick={() => setShowDesignPanel(prev => !prev)}
                    aria-haspopup="dialog"
                    aria-expanded={showDesignPanel}
                    aria-controls="de-design-feature-panel"
                  >
                    <img src={`${ASSET_BASE}/6.svg`} alt="" />
                    <span>设计功能</span>
                  </button>

                  {showDesignPanel ? (
                    <div
                      id="de-design-feature-panel"
                      className="de-design-feature-panel"
                      role="dialog"
                      aria-label="设计功能面板"
                    >
                      <header className="de-design-panel-head">
                        <strong>快速设计</strong>
                        <span>常用能力入口</span>
                      </header>
                      <div className="de-design-panel-list">
                        {designActions.map(action => (
                          <button
                            key={action.key}
                            type="button"
                            className="de-design-panel-item"
                            onClick={() => {
                              setShowDesignPanel(false)
                              navigateByHash(action.to)
                            }}
                          >
                            <span className="de-design-item-icon">
                              <img src={`${ASSET_BASE}/${action.icon}`} alt="" />
                            </span>
                            <span className="de-design-item-copy">
                              <strong>{action.title}</strong>
                              <span>{action.description}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            {viewMode === 'card' ? (
              <section className="de-grid" aria-label="Agent 卡片列表">
                {filteredCards.map((card, index) => (
                  <article key={card.name} className={`de-agent-card ${card.tone}`}>
                    <header className="de-agent-head">
                      <div className="de-agent-identity">
                        <div className={`de-agent-icon ${card.tone}`}>
                          <img src={`${ASSET_BASE}/${card.icon}`} alt="" />
                        </div>
                        <div>
                          <h4>{card.name}</h4>
                          <p>{card.subtitle}</p>
                        </div>
                      </div>

                      <span className={`de-status ${card.online ? 'online' : 'idle'}`}>
                        <img src={`${ASSET_BASE}/${10 + index * 4}.svg`} alt="" />
                        {card.online ? '在线' : '待机'}
                      </span>
                    </header>

                    <p className="de-agent-desc">{card.description}</p>

                    <div className="de-tag-wrap">
                      {card.tags.map(tag => (
                        <span key={`${card.name}-${tag}`} className={`de-tag ${card.tone}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="de-metrics">
                      <div className="de-metric-item">
                        <strong>{card.processed}</strong>
                        <span>已处理</span>
                      </div>
                      <div className="de-metric-item">
                        <strong>{card.response}</strong>
                        <span>响应时长</span>
                      </div>
                      <div className="de-metric-item">
                        <strong>{card.accuracy}</strong>
                        <span>准确率</span>
                      </div>
                    </div>

                    <footer className="de-agent-foot">
                      <span>
                        <img src={`${ASSET_BASE}/${card.versionIcon}`} alt="" />
                        {card.version}
                      </span>
                      <button
                        type="button"
                        className={`de-launch-btn ${card.tone}`}
                        onClick={() => navigateByHash(card.launchTo ?? '#/digital-employee')}
                      >
                        启动
                        <img src={`${ASSET_BASE}/${12 + index * 4}.svg`} alt="" />
                      </button>
                    </footer>
                  </article>
                ))}
              </section>
            ) : (
              <section className="de-list-table-shell" aria-label="Agent 列表视图">
                <div className="de-list-table-container" role="table" aria-label="数字员工列表">
                  <div className="de-list-table-head" role="rowgroup">
                    <div className="de-list-row de-list-row-head" role="row">
                      <div className="de-list-col-agent" role="columnheader">
                        Agent
                      </div>
                      <div className="de-list-col-capability" role="columnheader">
                        核心能力
                      </div>
                      <div className="de-list-col-metric" role="columnheader">
                        运行数据
                      </div>
                      <div className="de-list-col-version" role="columnheader">
                        版本
                      </div>
                      <div className="de-list-col-status" role="columnheader">
                        状态
                      </div>
                      <div className="de-list-col-action" role="columnheader">
                        操作
                      </div>
                    </div>
                  </div>

                  <div className="de-list-table-body" role="rowgroup">
                    {filteredCards.map((card, index) => (
                      <article key={`${card.name}-list`} className="de-list-row" role="row">
                        <div className="de-list-col-agent" role="cell">
                          <div className="de-list-agent-meta">
                            <div className={`de-agent-icon ${card.tone}`}>
                              <img src={`${ASSET_BASE}/${card.icon}`} alt="" />
                            </div>
                            <div className="de-list-agent-text">
                              <strong>{card.name}</strong>
                              <p>{card.subtitle}</p>
                              <span>{card.description}</span>
                            </div>
                          </div>
                        </div>

                        <div className="de-list-col-capability" role="cell">
                          <div className="de-list-tag-wrap">
                            {card.tags.slice(0, 3).map(tag => (
                              <span
                                key={`${card.name}-list-${tag}`}
                                className={`de-tag ${card.tone}`}
                              >
                                {tag}
                              </span>
                            ))}
                            {card.tags.length > 3 ? (
                              <span className="de-list-more-tag">+{card.tags.length - 3}</span>
                            ) : null}
                          </div>
                        </div>

                        <div className="de-list-col-metric" role="cell">
                          <div className="de-list-metric-wrap">
                            <div className="de-list-metric-chip">
                              <span>已处理</span>
                              <strong>{card.processed}</strong>
                            </div>
                            <div className="de-list-metric-chip">
                              <span>响应</span>
                              <strong>{card.response}</strong>
                            </div>
                            <div className="de-list-metric-chip">
                              <span>准确率</span>
                              <strong>{card.accuracy}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="de-list-col-version de-list-version" role="cell">
                          <img src={`${ASSET_BASE}/${card.versionIcon}`} alt="" />
                          <span>{card.version}</span>
                        </div>

                        <div className="de-list-col-status" role="cell">
                          <span className={`de-status ${card.online ? 'online' : 'idle'}`}>
                            <img src={`${ASSET_BASE}/${10 + index * 4}.svg`} alt="" />
                            {card.online ? '在线' : '待机'}
                          </span>
                        </div>

                        <div className="de-list-col-action" role="cell">
                          <button
                            type="button"
                            className={`de-launch-btn ${card.tone}`}
                            onClick={() => navigateByHash(card.launchTo ?? '#/digital-employee')}
                          >
                            启动
                            <img src={`${ASSET_BASE}/${12 + index * 4}.svg`} alt="" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <footer className="de-list-footer" aria-label="列表统计">
                  <span>共 {filteredCards.length} 个 Agent</span>
                  <span>
                    在线率{' '}
                    {(filteredCards.length
                      ? (filteredCards.filter(card => card.online).length / filteredCards.length) *
                        100
                      : 0
                    ).toFixed(0)}
                    %
                  </span>
                  <span>平均准确率 {avgAccuracy}</span>
                </footer>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DigitalEmployeePage
