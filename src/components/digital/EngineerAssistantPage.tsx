import { AppSidebar, PageHeader } from '../shared'

const EngineerAssistantPage = () => {
  const currentHash =
    typeof window === 'undefined'
      ? '#/engineer-assistant'
      : window.location.hash || '#/engineer-assistant'

  return (
    <div className="de-page">
      <div className="de-glow de-glow-left" />
      <div className="de-glow de-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <div className="pm-workspace">
        <main className="pm-main">
          <PageHeader title="工程师助手" subtitle="项目施工智能监控" variant="dark" />

          <div className="pm-body">
            <div style={{ padding: '24px', color: '#fff' }}>
              <h2>工程师助手页面</h2>
              <p>正在开发中...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EngineerAssistantPage
