/**
 * 项目团队管理视图
 * 用于项目详情页 - 团队管理标签页
 */

import type { ProjectItem } from '../../data/projects'
import './ProjectTeamView.css'

type ProjectTeamViewProps = {
  project: ProjectItem
}

const ProjectTeamView = ({ project }: ProjectTeamViewProps) => {
  return (
    <section className="project-team-view">
      <div className="team-header">
        <h2>团队管理</h2>
        <p>管理项目团队成员、角色分配和协作流程</p>
      </div>

      <div className="team-content">
        <div className="team-stats-placeholder">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-value">12</span>
              <span className="stat-label">团队成员</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🟢</div>
            <div className="stat-info">
              <span className="stat-value">8</span>
              <span className="stat-label">在线成员</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🤖</div>
            <div className="stat-info">
              <span className="stat-value">3</span>
              <span className="stat-label">数字员工</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-value">92</span>
              <span className="stat-label">协作健康度</span>
            </div>
          </div>
        </div>

        <div className="team-section">
          <h3>团队概览</h3>
          <p className="team-description">
            项目「{project.name}」当前共有 12 名团队成员，其中 3 名为数字员工。 团队角色覆盖率达到
            85%，协作健康度评分为 92 分。
          </p>
        </div>

        <div className="team-section">
          <h3>功能模块</h3>
          <div className="team-modules">
            <div className="module-card">
              <div className="module-icon">📋</div>
              <h4>角色管理</h4>
              <p>配置项目角色和权限分配</p>
            </div>
            <div className="module-card">
              <div className="module-icon">👥</div>
              <h4>成员列表</h4>
              <p>查看和管理团队成员信息</p>
            </div>
            <div className="module-card">
              <div className="module-icon">🔄</div>
              <h4>协作流程</h4>
              <p>配置审批、通知和会议流程</p>
            </div>
          </div>
        </div>

        <div className="team-note">
          <p>💡 团队管理功能正在开发中，敬请期待完整版本</p>
        </div>
      </div>
    </section>
  )
}

export default ProjectTeamView
