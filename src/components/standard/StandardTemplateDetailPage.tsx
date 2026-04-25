import { useMemo, useState } from 'react'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import { getStandardTemplateById, getStandardTemplatesByKind } from './standard-template.data'
import { goToStandardList } from '../../config/navigation'
import type { ProjectTemplate, TaskTemplate, TemplateStatus } from './template-contract.types'
import './standard-template-detail.css'

type StandardTemplateDetailPageProps = {
  templateId?: string
}

type StatItem = {
  icon: string
  label: string
  value: string
  suffix: string
  tone: 'blue' | 'purple' | 'green' | 'orange' | 'cyan'
}

type StageItem = {
  index: number
  name: string
  desc: string
  badge: string
}

const ASSET_BASE = '/assets/CodeBubbyAssets/4048_3'

const STATUS_TEXT_MAP: Record<TemplateStatus, string> = {
  draft: '草稿',
  reviewing: '评审中',
  ready: '待生效',
  active: '已生效',
  inactive: '已停用',
  deprecated: '已废弃',
}

const formatStatus = (status: TemplateStatus) => STATUS_TEXT_MAP[status] ?? status

const fallbackTemplateId = 'tpl-store-standard-v1'

const buildProjectStats = (template: ProjectTemplate, usageCount: number): StatItem[] => [
  {
    icon: '36.svg',
    label: '阶段数量',
    value: String(template.phaseBlueprint.length),
    suffix: '个阶段',
    tone: 'blue',
  },
  {
    icon: '37.svg',
    label: '里程碑',
    value: String(template.milestoneBlueprint.length),
    suffix: '个节点',
    tone: 'purple',
  },
  {
    icon: '38.svg',
    label: '绑定任务模板',
    value: String(template.taskTemplateBinding.length),
    suffix: '个模板',
    tone: 'green',
  },
  {
    icon: '39.svg',
    label: '默认标准包',
    value: template.defaultStandardPackageId ? '1' : '0',
    suffix: '个包',
    tone: 'orange',
  },
  { icon: '40.svg', label: '使用次数', value: String(usageCount), suffix: '次使用', tone: 'cyan' },
]

const buildTaskStats = (template: TaskTemplate, usageCount: number): StatItem[] => [
  {
    icon: '36.svg',
    label: '子模板数量',
    value: String(template.childTemplateRefs.length),
    suffix: '个子节点',
    tone: 'blue',
  },
  {
    icon: '37.svg',
    label: '依赖关系',
    value: String(template.dependencyBlueprint.length),
    suffix: '条依赖',
    tone: 'purple',
  },
  {
    icon: '38.svg',
    label: '执行标准',
    value: String(template.standardBinding.defaultExecutionStandardIds.length),
    suffix: '项标准',
    tone: 'green',
  },
  {
    icon: '39.svg',
    label: '验收标准',
    value: String(template.standardBinding.defaultAcceptanceStandardIds.length),
    suffix: '项标准',
    tone: 'orange',
  },
  { icon: '40.svg', label: '使用次数', value: String(usageCount), suffix: '次使用', tone: 'cyan' },
]

const StandardTemplateDetailPage = ({ templateId }: StandardTemplateDetailPageProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const effectiveTemplateId = templateId ?? fallbackTemplateId
  const templateItem =
    getStandardTemplateById(effectiveTemplateId) ?? getStandardTemplateById(fallbackTemplateId)

  const taskTemplateCatalog = useMemo(() => getStandardTemplatesByKind('task'), [])
  const taskCodeNameMap = useMemo(
    () =>
      new Map(
        taskTemplateCatalog
          .filter(item => item.taskTemplate)
          .map(
            item =>
              [item.taskTemplate!.taskTemplateCode, item.taskTemplate!.taskTemplateName] as const
          )
      ),
    [taskTemplateCatalog]
  )

  const currentHash =
    typeof window === 'undefined' ? '#/standards' : window.location.hash || '#/standards'

  const statsItems = useMemo(() => {
    if (!templateItem) return []
    const isProjectTemplate =
      templateItem.kind === 'project' && Boolean(templateItem.projectTemplate)
    const currentProjectTemplate = templateItem.projectTemplate as ProjectTemplate | undefined
    const currentTaskTemplate = templateItem.taskTemplate as TaskTemplate | undefined
    const stats =
      isProjectTemplate && currentProjectTemplate
        ? buildProjectStats(currentProjectTemplate, templateItem.listMeta.usageCount)
        : currentTaskTemplate
          ? buildTaskStats(currentTaskTemplate, templateItem.listMeta.usageCount)
          : []
    return stats.map(item => ({
      key: item.label,
      icon: item.icon,
      label: item.label,
      value: item.value,
      tone: item.tone,
      subLabel: item.suffix,
    }))
  }, [templateItem])

  if (!templateItem) {
    return (
      <div className="std-page">
        <AppSidebar currentHash={currentHash} />
        <section className="std-main">
          <PageHeader
            title="模板未找到"
            subtitle="Template Not Found"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="搜索模版详情..."
          />
          <main className="std-content">
            <div className="std-panel">
              未找到对应模板，请返回标准管理页重新选择。
              <div style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="std-primary-btn"
                  onClick={() => goToStandardList()}
                >
                  返回标准管理
                </button>
              </div>
            </div>
          </main>
        </section>
      </div>
    )
  }

  const { listMeta, kind, projectTemplate, taskTemplate, version, status, name } = templateItem
  const isProjectTemplate = kind === 'project' && Boolean(projectTemplate)

  const currentProjectTemplate = projectTemplate as ProjectTemplate | undefined
  const currentTaskTemplate = taskTemplate as TaskTemplate | undefined

  const stageItems: StageItem[] =
    isProjectTemplate && currentProjectTemplate
      ? currentProjectTemplate.phaseBlueprint
          .slice()
          .sort((a, b) => a.phaseOrder - b.phaseOrder)
          .map((phase, index) => ({
            index: index + 1,
            name: phase.phaseName,
            desc: `负责人：${phase.ownerRole}`,
            badge:
              phase.plannedOffsetStartDays !== undefined && phase.plannedOffsetEndDays !== undefined
                ? `${phase.plannedOffsetStartDays}-${phase.plannedOffsetEndDays}天`
                : '阶段模板',
          }))
      : [
          {
            index: 1,
            name: currentTaskTemplate?.taskTemplateName ?? name,
            desc: `层级：${currentTaskTemplate?.templateLevel ?? '-'} · 领域：${currentTaskTemplate?.businessDomain ?? '-'}`,
            badge: `SLA：${currentTaskTemplate?.slaRuleId ?? '未设置'}`,
          },
        ]

  const milestoneItems =
    isProjectTemplate && currentProjectTemplate
      ? currentProjectTemplate.milestoneBlueprint.map(item => item.milestoneName)
      : (currentTaskTemplate?.dependencyBlueprint.length ?? 0) > 0
        ? currentTaskTemplate!.dependencyBlueprint.map(
            item => `${item.fromTemplateCode} -> ${item.toTemplateCode} (${item.constraintType})`
          )
        : ['暂无依赖关系']

  const roleItems =
    isProjectTemplate && currentProjectTemplate
      ? Array.from(new Set(currentProjectTemplate.phaseBlueprint.map(item => item.ownerRole)))
      : Array.from(
          new Set(
            [currentTaskTemplate?.ownerRole, currentTaskTemplate?.assigneeTypeDefault].filter(
              Boolean
            ) as string[]
          )
        )

  const relatedTaskTemplateNames =
    isProjectTemplate && currentProjectTemplate
      ? currentProjectTemplate.taskTemplateBinding.map(
          binding => taskCodeNameMap.get(binding.taskTemplateCode) ?? binding.taskTemplateCode
        )
      : (currentTaskTemplate?.childTemplateRefs.map(
          child => taskCodeNameMap.get(child.childTemplateCode) ?? child.childTemplateCode
        ) ?? [])

  return (
    <div className="std-page">
      <div className="std-glow std-glow-left" />
      <div className="std-glow std-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <section className="std-main">
        <PageHeader
          title={name}
          subtitle={isProjectTemplate ? 'Project Template Detail' : 'Task Template Detail'}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="搜索模版详情..."
        />

        <main className="std-content">
          <div className="std-breadcrumb">
            <button type="button" onClick={() => goToStandardList()}>
              标准管理
            </button>
            <img src={`${ASSET_BASE}/2.svg`} alt="" />
            <span>{isProjectTemplate ? '项目模版' : '任务模版'}</span>
            <img src={`${ASSET_BASE}/3.svg`} alt="" />
            <strong>{name}</strong>
          </div>

          <section className="std-hero">
            <div className="std-hero-top">
              <div className="std-hero-main">
                <span className="std-hero-icon">
                  <img src={`${ASSET_BASE}/27.svg`} alt="" />
                </span>
                <div>
                  <div className="std-hero-name-row">
                    <h2>{name}</h2>
                    {listMeta.builtin && <span className="std-builtin-tag">系统内置</span>}
                    <span className="std-star-wrap">
                      <img src={`${ASSET_BASE}/28.svg`} alt="" />
                    </span>
                  </div>
                  <p>{listMeta.description}</p>
                  <div className="std-hero-meta">
                    <span>
                      <img src={`${ASSET_BASE}/29.svg`} alt="" />
                      更新于 {listMeta.updatedAt}
                    </span>
                    <i>·</i>
                    <span>
                      <img src={`${ASSET_BASE}/30.svg`} alt="" />
                      创建者: {listMeta.owner}
                    </span>
                    <i>·</i>
                    <span>
                      <img src={`${ASSET_BASE}/31.svg`} alt="" />
                      状态: {formatStatus(status)}
                    </span>
                    <i>·</i>
                    <span>版本: {version}</span>
                  </div>
                </div>
              </div>

              <div className="std-hero-actions">
                <button type="button" className="std-primary-btn">
                  <img src={`${ASSET_BASE}/32.svg`} alt="" />
                  使用此模版
                </button>
                <button type="button" className="std-mini-btn" aria-label="收藏">
                  <img src={`${ASSET_BASE}/33.svg`} alt="" />
                </button>
                <button type="button" className="std-mini-btn" aria-label="分享">
                  <img src={`${ASSET_BASE}/34.svg`} alt="" />
                </button>
                <button type="button" className="std-mini-btn" aria-label="更多">
                  <img src={`${ASSET_BASE}/35.svg`} alt="" />
                </button>
              </div>
            </div>

            <StatsCards
              items={statsItems}
              className="pm-stats-row"
              classNamePrefix="pm"
              assetBase={ASSET_BASE}
            />
          </section>

          <div className="std-tabs" role="tablist" aria-label="详情导航">
            <button type="button" className="active">
              <img src={`${ASSET_BASE}/4.svg`} alt="" />
              概览信息
            </button>
            <button type="button">
              <img src={`${ASSET_BASE}/5.svg`} alt="" />
              结构详情
            </button>
            <button type="button">
              <img src={`${ASSET_BASE}/6.svg`} alt="" />
              关系规则
            </button>
            <button type="button">
              <img src={`${ASSET_BASE}/7.svg`} alt="" />
              默认角色
            </button>
            <button type="button">
              <img src={`${ASSET_BASE}/8.svg`} alt="" />
              标准绑定
            </button>
          </div>

          <section className="std-body">
            <div className="std-left">
              <article className="std-panel">
                <header>
                  <h3>
                    <img src={`${ASSET_BASE}/9.svg`} alt="" />
                    结构概览 <small>共 {stageItems.length} 项</small>
                  </h3>
                  <button type="button">
                    查看详情 <img src={`${ASSET_BASE}/10.svg`} alt="" />
                  </button>
                </header>
                <div className="std-stage-list">
                  {stageItems.map(item => (
                    <div key={`${item.index}-${item.name}`} className="std-stage-item">
                      <span className="std-stage-index">{item.index}</span>
                      <div className="std-stage-content">
                        <strong>{item.name}</strong>
                        <p>{item.desc}</p>
                      </div>
                      <span className="std-stage-days">
                        <img src={`${ASSET_BASE}/11.svg`} alt="" />
                        {item.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="std-panel">
                <header>
                  <h3>
                    <img src={`${ASSET_BASE}/18.svg`} alt="" />
                    关系概览 <small>共 {milestoneItems.length} 项</small>
                  </h3>
                  <button type="button">
                    查看详情 <img src={`${ASSET_BASE}/19.svg`} alt="" />
                  </button>
                </header>
                <div className="std-milestone-grid">
                  {milestoneItems.map(item => (
                    <div key={item} className="std-milestone-item">
                      <img src={`${ASSET_BASE}/1.svg`} alt="" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <aside className="std-right">
              <article className="std-panel">
                <header>
                  <h3>
                    <img src={`${ASSET_BASE}/20.svg`} alt="" />
                    模版信息
                  </h3>
                </header>
                <div className="std-info-list">
                  <div>
                    <label>模版分类</label>
                    <span className="std-category-tag">{listMeta.category}</span>
                  </div>
                  <div>
                    <label>模版来源</label>
                    <p>{listMeta.builtin ? '系统内置模版' : '自定义模版'}</p>
                  </div>
                  <div>
                    <label>创建者</label>
                    <p>{listMeta.owner}</p>
                  </div>
                  <div>
                    <label>最后更新</label>
                    <p>{listMeta.updatedAt}</p>
                  </div>
                  <div>
                    <label>使用统计</label>
                    <p>
                      <strong>{listMeta.usageCount}</strong> 次使用
                    </p>
                  </div>
                </div>
              </article>

              <article className="std-panel">
                <header>
                  <h3>
                    <img src={`${ASSET_BASE}/21.svg`} alt="" />
                    默认角色
                  </h3>
                  <button type="button">
                    查看详情 <img src={`${ASSET_BASE}/22.svg`} alt="" />
                  </button>
                </header>
                <div className="std-role-list">
                  {roleItems.map((item, index) => (
                    <div key={item} className="std-role-item">
                      <span className="std-role-icon">
                        <img src={`${ASSET_BASE}/${23 + (index % 4)}.svg`} alt="" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="std-panel">
                <header>
                  <h3>关联模板</h3>
                </header>
                <div className="std-quick-actions">
                  {relatedTaskTemplateNames.length === 0 ? (
                    <button type="button">
                      <img src={`${ASSET_BASE}/12.svg`} alt="" />
                      暂无关联模板
                    </button>
                  ) : (
                    relatedTaskTemplateNames.slice(0, 4).map(item => (
                      <button type="button" key={item}>
                        <img src={`${ASSET_BASE}/11.svg`} alt="" />
                        {item}
                      </button>
                    ))
                  )}
                </div>
              </article>
            </aside>
          </section>
        </main>
      </section>
    </div>
  )
}

export default StandardTemplateDetailPage
