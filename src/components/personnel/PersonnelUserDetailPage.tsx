import { useMemo, useState } from 'react'
import { AppSidebar } from '../shared'
import {
  getPersonnelUserById,
  getPersonnelUserDetailDataById,
  type PersonnelDetailActivity,
  type PersonnelDetailProject,
  type PersonnelDetailTask,
  type PersonnelStatusChange,
} from './personnelUsers'

type PersonnelUserDetailPageProps = {
  userId: string
  onBack?: () => void
}

type DetailTabKey = 'overview' | 'projects' | 'tasks' | 'activities' | 'permissions'
type ProjectFilterKey = 'all' | 'current' | 'history'

type TabItem = {
  key: DetailTabKey
  label: string
  icon: string
  count?: number
}

const personStatusMeta = {
  onduty: { label: '在岗', tone: 'green' },
  leave: { label: '请假', tone: 'orange' },
  offboard: { label: '离岗', tone: 'neutral' },
  disabled: { label: '禁用', tone: 'red' },
} as const

const availabilityStatusMeta = {
  assignable: { label: '可分配', tone: 'green' },
  busy: { label: '忙碌', tone: 'orange' },
  unavailable: { label: '不可分配', tone: 'neutral' },
} as const

const employmentTypeMeta = {
  internal: { label: '内部员工', tone: 'blue' },
  outsource: { label: '外包人员', tone: 'orange' },
  vendor: { label: '供应商', tone: 'purple' },
} as const

const certStatusMeta = {
  valid: { label: '有效', tone: 'green' },
  expiring: { label: '即将到期', tone: 'orange' },
  expired: { label: '已过期', tone: 'red' },
} as const

const skillLevelTone = {
  初级: 'neutral',
  中级: 'blue',
  高级: 'green',
} as const

const statusChangeTypeMeta = {
  leave: { label: '请假', tone: 'orange' },
  return: { label: '返岗', tone: 'green' },
  offboard: { label: '离岗', tone: 'red' },
  replacement: { label: '替补', tone: 'blue' },
} as const

const PersonnelUserDetailPage = ({ userId, onBack }: PersonnelUserDetailPageProps) => {
  const [activeTab, setActiveTab] = useState<DetailTabKey>('overview')
  const [projectFilter, setProjectFilter] = useState<ProjectFilterKey>('all')
  const user = getPersonnelUserById(userId)
  const detailData = useMemo(() => getPersonnelUserDetailDataById(userId), [userId])
  const currentHash =
    typeof window === 'undefined' ? '#/personnel' : window.location.hash || '#/personnel'

  const projectCountMeta = useMemo(
    () => ({
      all: detailData.projects.length,
      current: detailData.projects.filter(project => project.status === '进行中').length,
      history: detailData.projects.filter(project => project.status !== '进行中').length,
    }),
    [detailData.projects]
  )

  const filteredProjects = useMemo(() => {
    if (projectFilter === 'all') {
      return detailData.projects
    }
    if (projectFilter === 'current') {
      return detailData.projects.filter(project => project.status === '进行中')
    }
    return detailData.projects.filter(project => project.status !== '进行中')
  }, [detailData.projects, projectFilter])

  const statusChip = personStatusMeta[user.personStatus]
  const availabilityChip = availabilityStatusMeta[user.availabilityStatus]
  const employmentChip = employmentTypeMeta[user.employmentType]

  const riskWarnings = [
    ...(user.riskLevel === 'high' || user.criticalTaskCount >= 3
      ? [
          {
            tone: 'red' as const,
            text: `关键任务 ${user.criticalTaskCount} 项，当前处于高负载，请优先调配资源。`,
          },
        ]
      : user.riskLevel === 'medium' || user.criticalTaskCount >= 2
        ? [
            {
              tone: 'orange' as const,
              text: `关键任务 ${user.criticalTaskCount} 项，建议关注近期交付压力。`,
            },
          ]
        : []),
    ...user.certs
      .filter(cert => cert.status !== 'valid')
      .map(cert => ({
        tone: cert.status === 'expired' ? ('red' as const) : ('orange' as const),
        text: `证书「${cert.name}」${cert.status === 'expired' ? '已过期' : '将于近期到期'}（${cert.expireAt}）。`,
      })),
  ]

  const tabs: TabItem[] = [
    { key: 'overview', label: '概览', icon: '7.svg' },
    { key: 'projects', label: '参与项目', icon: '8.svg', count: detailData.projects.length },
    { key: 'tasks', label: '待办任务', icon: '9.svg', count: detailData.tasks.length },
    {
      key: 'activities',
      label: '变更记录',
      icon: '10.svg',
      count: detailData.activities.length + detailData.statusChanges.length,
    },
    { key: 'permissions', label: '权限详情', icon: '11.svg' },
  ]

  const renderSkillAndCertPanel = () => (
    <article className="pud-panel">
      <h3>
        <img src="/assets/CodeBubbyAssets/4094_832/20.svg" alt="" />
        技能与资质
      </h3>
      <div className="pud-skill-cert-grid">
        <section className="pud-skill-cert-block">
          <h4>技能标签</h4>
          <ul className="pud-skill-list">
            {user.skillProfiles.map(skill => (
              <li key={skill.name}>
                <span>{skill.name}</span>
                <span className={`pud-chip ${skillLevelTone[skill.level]}`}>{skill.level}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pud-skill-cert-block">
          <h4>资质证书</h4>
          <ul className="pud-cert-list">
            {user.certs.map(cert => {
              const certChip = certStatusMeta[cert.status]
              return (
                <li key={cert.name}>
                  <div>
                    <strong>{cert.name}</strong>
                    <p>有效期至 {cert.expireAt}</p>
                  </div>
                  <span className={`pud-chip ${certChip.tone}`}>{certChip.label}</span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </article>
  )

  const renderProjectList = (projects: PersonnelDetailProject[]) => (
    <article className="pud-panel">
      <div className="pud-panel-header">
        <h3>
          <img src="/assets/CodeBubbyAssets/4094_832/12.svg" alt="" />
          参与项目
        </h3>
        <div className="pud-project-filter" aria-label="项目筛选">
          {[
            { key: 'all' as const, label: '全部', count: projectCountMeta.all },
            { key: 'current' as const, label: '当前', count: projectCountMeta.current },
            { key: 'history' as const, label: '历史', count: projectCountMeta.history },
          ].map(item => (
            <button
              key={item.key}
              type="button"
              className={`pud-filter-btn ${projectFilter === item.key ? 'active' : ''}`}
              onClick={() => setProjectFilter(item.key)}
            >
              {item.label}
              <span>{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="pud-list-empty">当前筛选条件下暂无项目</div>
      ) : (
        <ul>
          {projects.map((project, index) => (
            <li key={project.name + index} className="pud-row-item">
              <div>
                <strong>{project.name}</strong>
                <p>
                  {project.role} · {project.joinedAt}
                </p>
              </div>
              <div className="pud-row-right">
                <span className="pud-progress">任务完成 {project.progress}</span>
                <span className={`pud-chip ${project.tone === 'green' ? 'green' : 'blue'}`}>
                  {project.status}
                </span>
                <img src={`/assets/CodeBubbyAssets/4094_832/${13 + (index % 3)}.svg`} alt="" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  )

  const renderTaskList = (tasks: PersonnelDetailTask[]) => (
    <article className="pud-panel">
      <h3>
        <img src="/assets/CodeBubbyAssets/4094_832/16.svg" alt="" />
        待办任务
      </h3>
      <ul>
        {tasks.map((task, index) => (
          <li key={task.title + index} className="pud-task-item">
            <div>
              <div className="pud-task-top">
                <span className={`pud-mini ${task.priorityTone === 'red' ? 'red' : 'orange'}`}>
                  {task.priority}
                </span>
                <span
                  className={`pud-chip ${task.statusTone === 'blue' ? 'blue' : task.statusTone === 'red' ? 'red' : 'neutral'}`}
                >
                  {task.status}
                </span>
              </div>
              <strong>{task.title}</strong>
              <p>{task.project}</p>
            </div>
            <span className="pud-date">
              <img src={`/assets/CodeBubbyAssets/4094_832/${17 + (index % 4)}.svg`} alt="" />
              {task.due}
            </span>
          </li>
        ))}
      </ul>
    </article>
  )

  const renderStatusChangeList = (statusChanges: PersonnelStatusChange[]) => (
    <article className="pud-panel pud-compact">
      <h3>状态变更记录</h3>
      {statusChanges.length === 0 ? (
        <div className="pud-list-empty">暂无状态变更记录</div>
      ) : (
        <ul className="pud-status-timeline">
          {statusChanges.map((item, index) => {
            const meta = statusChangeTypeMeta[item.type]
            return (
              <li key={item.title + index} className="pud-status-item">
                <span className={`pud-status-dot ${meta.tone}`} aria-hidden="true" />
                <div>
                  <div className="pud-status-top">
                    <strong>{item.title}</strong>
                    <span className={`pud-chip ${meta.tone}`}>{meta.label}</span>
                  </div>
                  <p>
                    {item.at} · 操作人：{item.operator}
                  </p>
                  {item.note ? <p className="pud-status-note">{item.note}</p> : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )

  const renderActivityList = (activities: PersonnelDetailActivity[]) => (
    <article className="pud-panel pud-compact">
      <h3>最近变更</h3>
      <ul className="pud-activity-list">
        {activities.map((activity, index) => (
          <li key={activity.text + index}>
            <span className={`pud-activity-icon ${activity.tone}`}>
              <img src={`/assets/CodeBubbyAssets/4094_832/${activity.icon}`} alt="" />
            </span>
            <div>
              <strong>{activity.text}</strong>
              <p>{activity.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )

  return (
    <div className="pm-app pud-page">
      <div className="pm-glow pm-glow-left" />
      <div className="pm-glow pm-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <div className="pm-workspace">
        <main className="pm-main">
          <header className="pm-header pud-header">
            <div className="pm-header-title">
              <h1>用户详情</h1>
              <span>User Profile</span>
            </div>

            <div className="pm-header-actions">
              <div className="pm-search-box">
                <img src="/assets/CodeBubbyAssets/4094_832/36.svg" alt="搜索" />
                <input type="text" placeholder="搜索..." />
              </div>
              <button type="button" className="pm-icon-btn" aria-label="通知">
                <img src="/assets/CodeBubbyAssets/4094_832/30.svg" alt="" />
              </button>
              <button type="button" className="pm-icon-btn pm-icon-btn-active" aria-label="AI助手">
                <img src="/assets/CodeBubbyAssets/4094_832/31.svg" alt="" />
              </button>
              <button type="button" className="pm-user-profile" aria-label="当前用户">
                <img src="/assets/CodeBubbyAssets/4094_832/32.svg" alt="" />
                <span>管理员</span>
                <img src="/assets/CodeBubbyAssets/4094_832/33.svg" alt="" />
              </button>
            </div>
          </header>

          <div className="pm-body pud-body">
            <div className="pud-breadcrumb">
              <button type="button" className="pud-back-btn" onClick={onBack}>
                <img src="/assets/CodeBubbyAssets/4094_832/1.svg" alt="" />
                <span>人员管理</span>
              </button>
              <img src="/assets/CodeBubbyAssets/4094_832/2.svg" alt="" />
              <strong>{user.name}</strong>
            </div>

            <section className="pud-profile-card">
              <div className="pud-profile-main">
                <div className="pud-avatar">{user.initial}</div>
                <div className="pud-base-info">
                  <div className="pud-name-line">
                    <h2>{user.name}</h2>
                    <span className={`pud-chip ${statusChip.tone}`}>{statusChip.label}</span>
                    <span className={`pud-chip ${availabilityChip.tone}`}>
                      {availabilityChip.label}
                    </span>
                    <span className="pud-chip blue">{user.role}</span>
                    <span className={`pud-chip ${employmentChip.tone}`}>
                      {employmentChip.label}
                    </span>
                  </div>
                  <p>
                    {user.orgName} · {user.teamName} · {user.title ?? user.role}
                  </p>
                  <div className="pud-contact-grid">
                    <span>
                      <img src="/assets/CodeBubbyAssets/4094_832/3.svg" alt="" />
                      {user.email ?? '--'}
                    </span>
                    <span>
                      <img src="/assets/CodeBubbyAssets/4094_832/4.svg" alt="" />
                      {user.mobile}
                    </span>
                    <span>
                      <img src="/assets/CodeBubbyAssets/4094_832/5.svg" alt="" />
                      工号 {user.personCode}
                    </span>
                    <span>
                      <img src="/assets/CodeBubbyAssets/4094_832/6.svg" alt="" />
                      工作城市 {user.workCity}
                    </span>
                    <span>
                      <img src="/assets/CodeBubbyAssets/4094_832/5.svg" alt="" />
                      用工类型 {employmentChip.label}
                    </span>
                    <span>
                      <img src="/assets/CodeBubbyAssets/4094_832/6.svg" alt="" />
                      最近登录 {user.lastActiveAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pud-profile-side">
                <div className="pud-card-actions">
                  <button type="button" className="pud-outline-btn">
                    <img src="/assets/CodeBubbyAssets/4094_832/34.svg" alt="" />
                    <span>禁用账号</span>
                  </button>
                  <button type="button" className="pud-outline-btn">
                    <img src="/assets/CodeBubbyAssets/4094_832/35.svg" alt="" />
                    <span>编辑</span>
                  </button>
                </div>

                <div className="pud-kpi-row">
                  <div className="pud-kpi">
                    <small>参与项目</small>
                    <strong>{detailData.projects.length}</strong>
                  </div>
                  <div className="pud-kpi">
                    <small>待办任务</small>
                    <strong className="warn">{detailData.tasks.length}</strong>
                  </div>
                  <div className="pud-kpi">
                    <small>入职天数</small>
                    <strong>{detailData.stats.joinedDays}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="pud-tabs" aria-label="详情选项卡">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  className={`pud-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <img src={`/assets/CodeBubbyAssets/4094_832/${tab.icon}`} alt="" />
                  {tab.label}
                  {typeof tab.count === 'number' ? <span>{tab.count}</span> : null}
                </button>
              ))}
            </section>

            {activeTab === 'overview' && (
              <section className="pud-content-grid">
                <div className="pud-col-left">
                  {renderSkillAndCertPanel()}
                  {renderProjectList(filteredProjects)}
                  {renderTaskList(detailData.tasks)}
                </div>

                <aside className="pud-col-right">
                  <article className="pud-panel pud-compact pud-risk-panel">
                    <h3>风险提示</h3>
                    <ul className="pud-risk-list">
                      {(riskWarnings.length
                        ? riskWarnings
                        : [{ tone: 'blue' as const, text: '当前无高优先级风险，状态稳定。' }]
                      ).map(risk => (
                        <li key={risk.text} className={`pud-risk-item ${risk.tone}`}>
                          <span className="pud-risk-dot" aria-hidden="true" />
                          <p>{risk.text}</p>
                        </li>
                      ))}
                    </ul>
                  </article>

                  <article className="pud-panel pud-compact">
                    <h3>工作统计</h3>
                    <ul className="pud-stats-list">
                      <li>
                        <span>
                          <img src="/assets/CodeBubbyAssets/4094_832/21.svg" alt="" />
                          累计完成任务
                        </span>
                        <strong>{detailData.stats.completedTasks}</strong>
                      </li>
                      <li>
                        <span>
                          <img src="/assets/CodeBubbyAssets/4094_832/22.svg" alt="" />
                          创建风险/问题
                        </span>
                        <strong>{detailData.stats.riskCount}</strong>
                      </li>
                      <li>
                        <span>
                          <img src="/assets/CodeBubbyAssets/4094_832/23.svg" alt="" />
                          上传资料
                        </span>
                        <strong>{detailData.stats.uploadCount}</strong>
                      </li>
                      <li>
                        <span>
                          <img src="/assets/CodeBubbyAssets/4094_832/24.svg" alt="" />
                          任务按期完成率
                        </span>
                        <strong>{detailData.stats.onTimeRate}</strong>
                      </li>
                    </ul>
                  </article>

                  {renderStatusChangeList(detailData.statusChanges)}
                  {renderActivityList(detailData.activities)}
                </aside>
              </section>
            )}

            {activeTab === 'projects' && (
              <section className="pud-content-single">
                {renderProjectList(filteredProjects)}
              </section>
            )}
            {activeTab === 'tasks' && (
              <section className="pud-content-single">{renderTaskList(detailData.tasks)}</section>
            )}
            {activeTab === 'activities' && (
              <section className="pud-content-single">
                {renderStatusChangeList(detailData.statusChanges)}
                {renderActivityList(detailData.activities)}
              </section>
            )}

            {activeTab === 'permissions' && (
              <section className="pud-content-single">
                <article className="pud-panel pud-empty-panel">
                  <h3>权限详情</h3>
                  <p className="pud-empty-text">
                    当前身份：{user.role}（{user.orgName} / {user.teamName}）
                  </p>
                  <p className="pud-empty-text">
                    已开通模块：项目管理、任务管理、人员管理（可读写）。
                  </p>
                  <p className="pud-empty-text">后续可接入后端权限模型进行精细化授权。</p>
                </article>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default PersonnelUserDetailPage
