/**
 * 项目数字员工视图
 * 用于项目详情页 - 数字员工标签页
 */

import './ProjectDigitalEmployeeView.css'

const ProjectDigitalEmployeeView = () => {
  return (
    <section className="project-digital-employee-view">
      <div className="digital-header">
        <h2>数字员工</h2>
        <p>管理项目级数字员工配置与运行监控</p>
      </div>

      <div className="digital-content">
        <div className="digital-stats-placeholder">
          <div className="stat-card digital-stat-card">
            <div className="stat-icon">🤖</div>
            <div className="stat-info">
              <span className="stat-value">3</span>
              <span className="stat-label">已接入 Agent</span>
            </div>
          </div>
          <div className="stat-card digital-stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <span className="stat-value">47</span>
              <span className="stat-label">今日处理任务</span>
            </div>
          </div>
          <div className="stat-card digital-stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <span className="stat-value">2.3s</span>
              <span className="stat-label">平均响应时间</span>
            </div>
          </div>
          <div className="stat-card digital-stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-value">96.8%</span>
              <span className="stat-label">准确率</span>
            </div>
          </div>
        </div>

        <div className="digital-section">
          <h3>已接入的数字员工</h3>
          <div className="agent-list-placeholder">
            <div className="agent-card">
              <div className="agent-header">
                <div className="agent-icon blue">🤖</div>
                <div className="agent-basic">
                  <h4>AI 助手</h4>
                  <span className="agent-subtitle">智能项目助手</span>
                </div>
                <span className="agent-status online">在线</span>
              </div>
              <p className="agent-description">提供项目数据分析、文档生成、任务调度等智能化支持</p>
              <div className="agent-metrics">
                <span>今日处理: 18</span>
                <span>准确率: 97.2%</span>
              </div>
            </div>

            <div className="agent-card">
              <div className="agent-header">
                <div className="agent-icon green">🧪</div>
                <div className="agent-basic">
                  <h4>自动化测试 Agent</h4>
                  <span className="agent-subtitle">持续集成测试专家</span>
                </div>
                <span className="agent-status online">在线</span>
              </div>
              <p className="agent-description">自动化执行回归测试、性能测试，并生成测试报告</p>
              <div className="agent-metrics">
                <span>今日处理: 15</span>
                <span>准确率: 95.6%</span>
              </div>
            </div>

            <div className="agent-card">
              <div className="agent-header">
                <div className="agent-icon cyan">🔍</div>
                <div className="agent-basic">
                  <h4>代码审查 Agent</h4>
                  <span className="agent-subtitle">代码质量专家</span>
                </div>
                <span className="agent-status busy">忙碌</span>
              </div>
              <p className="agent-description">自动审查代码质量、安全性，并提供优化建议</p>
              <div className="agent-metrics">
                <span>今日处理: 14</span>
                <span>准确率: 97.8%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="digital-section">
          <h3>功能模块</h3>
          <div className="digital-modules">
            <div className="module-card">
              <div className="module-icon">⚙️</div>
              <h4>Agent 配置</h4>
              <p>配置 Agent 权限和触发规则</p>
            </div>
            <div className="module-card">
              <div className="module-icon">📋</div>
              <h4>任务队列</h4>
              <p>查看和管理 Agent 任务</p>
            </div>
            <div className="module-card">
              <div className="module-icon">📊</div>
              <h4>运行监控</h4>
              <p>实时监控 Agent 运行状态</p>
            </div>
          </div>
        </div>

        <div className="digital-note">
          <p>💡 数字员工管理功能正在开发中，敬请期待完整版本</p>
        </div>
      </div>
    </section>
  )
}

export default ProjectDigitalEmployeeView
