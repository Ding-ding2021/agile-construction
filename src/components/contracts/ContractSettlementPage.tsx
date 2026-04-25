import { useEffect, useMemo, useState } from 'react'
import type { ProjectItem } from '../../data/projects'
import { AppSidebar, PageHeader } from '../shared'
import { settlementRepository } from '../../services/repositories/settlementRepository'
import {
  navigateByHash,
  goToProjectDetail,
  goToProjectSettlementReview,
} from '../../config/navigation'
import './contract-settlement-page.css'

type ContractStatus = '履约中' | '审核中' | '已归档' | '草稿'

type ContractItem = {
  name: string
  code: string
  projectCode: string
  status: ContractStatus
  amount: string
  progress?: number
  date: string
  actionIcon: string
}

type TopTab = {
  key: string
  label: string
  icon: string
  href: string
}

type StatItem = {
  key: string
  label: string
  valueMain: string
  valueSub: string
  icon: string
  tone: 'blue' | 'purple' | 'orange'
  delta?: string
  deltaIcon?: string
  ratio?: string
  riskTag?: string
}

type SettlementDiffItem = {
  id: string
  projectCode: string
  projectName: string
  source: string
  status: '待处理' | '处理中' | '需复核'
  suggestion: string
  draftAmountWan: number
  varianceWan: number
  varianceRate: number
}

const ASSET_BASE = '/assets/CodeBubbyAssets/4106_2422'

const topTabs: TopTab[] = [
  { key: 'contract', label: '合同管理', icon: '1.svg', href: '#/contracts' },
  { key: 'settlement', label: '结算中心', icon: '2.svg', href: '#/procurement' },
  { key: 'budget', label: '预算管理', icon: '3.svg', href: '#/projects' },
  { key: 'quota', label: '清单定额', icon: '4.svg', href: '#/standards' },
]

const parseBudgetToWan = (value: string): number => {
  const numeric = Number(value.replace(/[^\d.]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

const mapProjectToContractStatus = (project: ProjectItem): ContractStatus => {
  if (project.settlementStatus === '已确认') {
    return '已归档'
  }

  if (project.settlementStatus === '草案待确认') {
    return '审核中'
  }

  if (
    project.status === '执行中' ||
    project.status === '整改中' ||
    project.status === '待验收' ||
    project.status === '待结算'
  ) {
    return '履约中'
  }

  return '草稿'
}

const buildContractsByProjects = (projects: ProjectItem[]): ContractItem[] =>
  projects.slice(0, 20).map((project, index) => ({
    name: `${project.name}结算合同`,
    code: `CT-${project.code}`,
    projectCode: project.code,
    status: mapProjectToContractStatus(project),
    amount: `¥ ${project.budget}`,
    progress: project.progress,
    date: project.plannedOpenDate,
    actionIcon: ['25.svg', '26.svg', '27.svg', '28.svg', '29.svg'][index % 5],
  }))

const buildStatsByProjects = (projects: ProjectItem[]): StatItem[] => {
  const totalBudgetWan = projects.reduce(
    (sum, project) => sum + parseBudgetToWan(project.budget),
    0
  )
  const settledWan = projects
    .filter(project => project.settlementStatus === '已确认')
    .reduce((sum, project) => sum + parseBudgetToWan(project.budget), 0)
  const overRiskCount = projects.filter(project => project.riskLevel === 'critical').length
  const settledRatio = totalBudgetWan > 0 ? Math.round((settledWan / totalBudgetWan) * 100) : 0

  return [
    {
      key: 'yearlyTotal',
      label: '本年度合同总额',
      valueMain: `¥ ${Math.max(totalBudgetWan, 0).toLocaleString('zh-CN')}`,
      valueSub: '万',
      delta: '+0%',
      deltaIcon: '10.svg',
      icon: '5.svg',
      tone: 'blue',
    },
    {
      key: 'settled',
      label: '累计已结算金额',
      valueMain: `¥ ${Math.max(settledWan, 0).toLocaleString('zh-CN')}`,
      valueSub: '万',
      ratio: `占合同额 ${settledRatio}%`,
      icon: '11.svg',
      tone: 'purple',
    },
    {
      key: 'risk',
      label: '项目预算超支风险',
      valueMain: `¥ ${Math.max(totalBudgetWan - settledWan, 0).toLocaleString('zh-CN')}`,
      valueSub: '万',
      riskTag: `${overRiskCount} 个项目高风险`,
      icon: '13.svg',
      tone: 'orange',
    },
  ]
}

const buildSettlementDiffs = (projects: ProjectItem[]): SettlementDiffItem[] =>
  projects
    .filter(project => project.settlementStatus === '草案待确认')
    .map(project => {
      const budgetWan = parseBudgetToWan(project.budget)
      const draftAmountWan = Math.max(Math.round(budgetWan * 0.92), 0)
      const varianceWan = Math.max(budgetWan - draftAmountWan, 0)

      const pendingAcceptanceCount = project.pendingAcceptanceCount ?? 0
      const source =
        pendingAcceptanceCount > 0
          ? `验收节点（待处理 ${pendingAcceptanceCount} 项）`
          : project.riskLevel === 'critical'
            ? '风险评估（高风险待闭环）'
            : '预算差异（草案金额待财务确认）'

      const status: SettlementDiffItem['status'] =
        pendingAcceptanceCount > 0
          ? '待处理'
          : project.riskLevel === 'critical'
            ? '需复核'
            : '处理中'

      const suggestion =
        pendingAcceptanceCount > 0
          ? '先完成验收问题闭环，再提交结算审批。'
          : project.riskLevel === 'critical'
            ? '需补充风险处置结论与责任签认后再确认草案。'
            : '建议财务按草案金额复核并锁定差异说明。'

      return {
        id: `diff-${project.code}`,
        projectCode: project.code,
        projectName: project.name,
        source,
        status,
        suggestion,
        draftAmountWan,
        varianceWan,
        varianceRate: budgetWan > 0 ? Number(((varianceWan / budgetWan) * 100).toFixed(1)) : 0,
      }
    })
    .sort((a, b) => b.varianceWan - a.varianceWan)

type ContractSettlementPageProps = {
  projects: ProjectItem[]
}

const ContractSettlementPage = ({ projects }: ContractSettlementPageProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const currentHash =
    typeof window === 'undefined' ? '#/contracts' : window.location.hash || '#/contracts'

  const contracts = useMemo(() => buildContractsByProjects(projects), [projects])
  const stats = useMemo(() => buildStatsByProjects(projects), [projects])
  const settlementDiffs = useMemo(() => buildSettlementDiffs(projects), [projects])
  const [activeDiffProjectCode, setActiveDiffProjectCode] = useState<string>('all')
  const [reviewingDiffIds, setReviewingDiffIds] = useState<string[]>([])
  const [settlementSuggestions, setSettlementSuggestions] = useState<
    Array<{ code: string; name: string; budget: string; acceptanceStatus: string }>
  >([])

  useEffect(() => {
    let cancelled = false

    const loadSuggestions = async () => {
      const suggestions = await settlementRepository.loadSuggestions(projects)
      if (cancelled) {
        return
      }
      setSettlementSuggestions(suggestions)
    }

    void loadSuggestions()

    return () => {
      cancelled = true
    }
  }, [projects])

  const filteredContracts = contracts.filter(item =>
    `${item.name}${item.code}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  )

  const diffProjectOptions = useMemo(
    () => Array.from(new Set(settlementDiffs.map(item => item.projectCode))),
    [settlementDiffs]
  )

  const filteredDiffs = useMemo(
    () =>
      settlementDiffs.filter(item =>
        activeDiffProjectCode === 'all' ? true : item.projectCode === activeDiffProjectCode
      ),
    [activeDiffProjectCode, settlementDiffs]
  )

  const openDiffReview = (diff: SettlementDiffItem) => {
    setReviewingDiffIds(prev => (prev.includes(diff.id) ? prev : [...prev, diff.id]))
    goToProjectSettlementReview(diff.projectCode, diff.id)
  }

  return (
    <div className="csm-page">
      <div className="csm-glow csm-glow-left" />
      <div className="csm-glow csm-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <section className="csm-main">
        <PageHeader
          title="合同结算与预算"
          subtitle="Contracts, Settlements &amp; Budgets"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="搜索..."
        />

        <div className="csm-body">
          <section className="csm-top-tabs" role="tablist" aria-label="合同模块切换">
            {topTabs.map(tab => (
              <button
                key={tab.key}
                type="button"
                className={`csm-top-tab ${tab.href === '#/contracts' ? 'active' : ''}`}
                role="tab"
                aria-selected={tab.href === '#/contracts'}
                onClick={() => {
                  if (tab.href) navigateByHash(tab.href)
                }}
              >
                <img src={`${ASSET_BASE}/${tab.icon}`} alt="" />
                <span>{tab.label}</span>
              </button>
            ))}
          </section>

          <section className="csm-stat-row" aria-label="合同统计">
            {stats.map(item => (
              <article key={item.key} className={`csm-stat-card ${item.tone}`}>
                <div className="csm-stat-bg-icon">
                  <img src={`${ASSET_BASE}/${item.icon}`} alt="" />
                </div>
                <div className="csm-stat-top">
                  <p>{item.label}</p>
                  {item.delta ? (
                    <span className="csm-delta">
                      <img src={`${ASSET_BASE}/${item.deltaIcon}`} alt="" />
                      {item.delta}
                    </span>
                  ) : null}
                  {item.ratio ? <span className="csm-ratio">{item.ratio}</span> : null}
                  {item.riskTag ? <span className="csm-risk-tag">{item.riskTag}</span> : null}
                </div>
                <div className="csm-stat-value">
                  <strong>{item.valueMain}</strong>
                  <em>{item.valueSub}</em>
                </div>
              </article>
            ))}
          </section>

          {settlementSuggestions.length > 0 ? (
            <section className="csm-toolbar" aria-label="结算建议">
              <div className="csm-view-switch" role="group" aria-label="结算建议概览">
                <button type="button" className="csm-view-btn active">
                  <img src={`${ASSET_BASE}/13.svg`} alt="" />
                  <span>待确认草案 {settlementSuggestions.length}</span>
                </button>
              </div>
              <div className="csm-filter-actions" role="list" aria-label="结算建议列表">
                {settlementSuggestions.slice(0, 3).map(item => (
                  <button
                    key={item.code}
                    type="button"
                    className="csm-filter-btn"
                    role="listitem"
                    onClick={() => {
                      goToProjectDetail(item.code)
                    }}
                  >
                    <span>{item.name}</span>
                    <span>
                      {item.acceptanceStatus} · 预算 {item.budget}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {settlementDiffs.length > 0 ? (
            <section className="csm-diff-section" aria-label="结算草案差异项">
              <header className="csm-diff-header">
                <div>
                  <h3>结算草案差异项</h3>
                  <p>展示差异来源、当前处理状态与建议动作，可按项目追溯。</p>
                </div>
                <span>差异项 {filteredDiffs.length} 条</span>
              </header>

              <div className="csm-diff-filters" role="tablist" aria-label="按项目筛选差异项">
                <button
                  type="button"
                  className={`csm-diff-filter ${activeDiffProjectCode === 'all' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={activeDiffProjectCode === 'all'}
                  onClick={() => setActiveDiffProjectCode('all')}
                >
                  全部项目
                </button>
                {diffProjectOptions.slice(0, 6).map(projectCode => (
                  <button
                    key={projectCode}
                    type="button"
                    className={`csm-diff-filter ${activeDiffProjectCode === projectCode ? 'active' : ''}`}
                    role="tab"
                    aria-selected={activeDiffProjectCode === projectCode}
                    onClick={() => setActiveDiffProjectCode(projectCode)}
                  >
                    {projectCode}
                  </button>
                ))}
              </div>

              <div className="csm-diff-table-wrap">
                <table className="csm-diff-table">
                  <thead>
                    <tr>
                      <th>项目</th>
                      <th>差异来源</th>
                      <th>差异金额</th>
                      <th>差异率</th>
                      <th>处理状态</th>
                      <th>处理建议</th>
                      <th>追溯/复核</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiffs.map(diff => (
                      <tr key={diff.id}>
                        <td>
                          <strong>{diff.projectName}</strong>
                          <span>{diff.projectCode}</span>
                        </td>
                        <td>{diff.source}</td>
                        <td>
                          ¥ {diff.varianceWan.toLocaleString('zh-CN')} 万（草案{' '}
                          {diff.draftAmountWan.toLocaleString('zh-CN')} 万）
                        </td>
                        <td>{diff.varianceRate}%</td>
                        <td>
                          <span className={`csm-diff-status ${diff.status}`}>
                            {reviewingDiffIds.includes(diff.id) ? '复核中' : diff.status}
                          </span>
                        </td>
                        <td>{diff.suggestion}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button
                              type="button"
                              className="csm-row-action csm-row-trace"
                              onClick={() => {
                                goToProjectDetail(diff.projectCode)
                              }}
                            >
                              追溯项目
                            </button>
                            <button
                              type="button"
                              className="csm-row-action csm-row-trace"
                              onClick={() => openDiffReview(diff)}
                            >
                              发起复核
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className="csm-toolbar" aria-label="筛选和操作">
            <div className="csm-view-switch" role="group" aria-label="视图切换">
              <button type="button" className="csm-view-btn">
                <img src={`${ASSET_BASE}/15.svg`} alt="" />
                <span>网格</span>
              </button>
              <button type="button" className="csm-view-btn active">
                <img src={`${ASSET_BASE}/16.svg`} alt="" />
                <span>列表</span>
              </button>
            </div>

            <div className="csm-filter-actions">
              <label className="csm-search-sm" aria-label="搜索合同">
                <img src={`${ASSET_BASE}/18.svg`} alt="" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  placeholder="搜索合同名称/编号..."
                />
              </label>

              <button type="button" className="csm-filter-btn">
                <img src={`${ASSET_BASE}/19.svg`} alt="" />
                <span>分组</span>
                <img src={`${ASSET_BASE}/20.svg`} alt="" />
              </button>

              <button type="button" className="csm-filter-btn">
                <img src={`${ASSET_BASE}/21.svg`} alt="" />
                <span>排序</span>
                <img src={`${ASSET_BASE}/22.svg`} alt="" />
              </button>

              <button
                type="button"
                className="csm-add-btn"
                onClick={() => navigateByHash('#/projects/new?createMode=blank&source=contracts')}
              >
                <img src={`${ASSET_BASE}/17.svg`} alt="" />
                <span>新建合同</span>
              </button>

              <button type="button" className="csm-filter-btn">
                <img src={`${ASSET_BASE}/23.svg`} alt="" />
                <span>操作</span>
                <img src={`${ASSET_BASE}/24.svg`} alt="" />
              </button>
            </div>
          </section>

          <section className="csm-table-wrap" aria-label="合同列表">
            <table className="csm-table">
              <thead>
                <tr>
                  <th>合同名称</th>
                  <th>状态</th>
                  <th>合同金额</th>
                  <th>履约进度</th>
                  <th>签订日期</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map(item => (
                  <tr key={item.code}>
                    <td>
                      <div className="csm-contract-cell">
                        <strong>{item.name}</strong>
                        <span>{item.code}</span>
                      </div>
                    </td>
                    <td className="center">
                      <span className={`csm-status-badge ${item.status}`}>{item.status}</span>
                    </td>
                    <td className="center amount">{item.amount}</td>
                    <td className="center">
                      {typeof item.progress === 'number' ? (
                        <div
                          className="csm-progress-wrap"
                          aria-label={`履约进度 ${item.progress}%`}
                        >
                          <div className="csm-progress-track">
                            <div
                              className="csm-progress-fill"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span>{item.progress}%</span>
                        </div>
                      ) : (
                        <span className="csm-empty-progress">--</span>
                      )}
                    </td>
                    <td className="center">{item.date}</td>
                    <td className="center">
                      <button
                        type="button"
                        className="csm-row-action"
                        aria-label={`查看 ${item.name}`}
                        onClick={() => {
                          const target = item.projectCode
                          goToProjectDetail(target)
                        }}
                      >
                        <img src={`${ASSET_BASE}/${item.actionIcon}`} alt="" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <footer className="csm-pagination" aria-label="分页信息">
            <span>共 {filteredContracts.length} 条记录，当前第 1 / 1 页</span>
            <div className="csm-pagination-right">
              <button type="button" className="icon" aria-label="上一页">
                <img src={`${ASSET_BASE}/30.svg`} alt="" />
              </button>
              <button type="button" className="page active" aria-current="page">
                1
              </button>
              <button type="button" className="page">
                2
              </button>
              <button type="button" className="page">
                3
              </button>
              <button type="button" className="page">
                4
              </button>
              <button type="button" className="icon" aria-label="更多页">
                <img src={`${ASSET_BASE}/31.svg`} alt="" />
              </button>
              <button type="button" className="page">
                12
              </button>
              <button type="button" className="icon" aria-label="下一页">
                <img src={`${ASSET_BASE}/32.svg`} alt="" />
              </button>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}

export default ContractSettlementPage
