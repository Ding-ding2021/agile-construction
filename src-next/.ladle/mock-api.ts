// Ladle 全局 API mock — 拦截 fetch 请求返回 mock 数据
// 页面在 Ladle 中预览时不需要启动 local-api

const MOCK_PERSONNEL = {
  data: [
    {
      id: 1,
      personCode: 'P-2026-0001',
      name: '张伟',
      mobile: '138****1234',
      email: 'zhangwei@example.com',
      avatarUrl: null,
      orgId: 1,
      orgName: '华东大区',
      title: '高级项目经理',
      employmentType: 1,
      personStatus: 1,
      availabilityStatus: 1,
      workCity: '上海',
      currentTaskCount: 4,
      criticalTaskCount: 2,
      riskLevel: 1,
      remark: null,
      isDeleted: false,
      createdAt: '2026-01-15T08:00:00Z',
      updatedAt: '2026-05-06T10:00:00Z',
    },
    {
      id: 2,
      personCode: 'P-2026-0002',
      name: '李娜',
      mobile: '138****2222',
      email: 'lina@example.com',
      avatarUrl: null,
      orgId: 1,
      orgName: '华东大区',
      title: '项目经理',
      employmentType: 1,
      personStatus: 1,
      availabilityStatus: 2,
      workCity: '苏州',
      currentTaskCount: 5,
      criticalTaskCount: 2,
      riskLevel: 2,
      remark: null,
      isDeleted: false,
      createdAt: '2026-01-20T08:00:00Z',
      updatedAt: '2026-05-05T14:00:00Z',
    },
    {
      id: 3,
      personCode: 'P-2026-0003',
      name: '王强',
      mobile: '138****3333',
      email: 'wangqiang@example.com',
      avatarUrl: null,
      orgId: 2,
      orgName: '工程技术中心',
      title: '结构负责人',
      employmentType: 1,
      personStatus: 1,
      availabilityStatus: 2,
      workCity: '天津',
      currentTaskCount: 6,
      criticalTaskCount: 3,
      riskLevel: 3,
      remark: null,
      isDeleted: false,
      createdAt: '2026-02-01T08:00:00Z',
      updatedAt: '2026-05-04T16:00:00Z',
    },
    {
      id: 4,
      personCode: 'P-2026-0004',
      name: '赵敏',
      mobile: '138****4444',
      email: 'zhaomin@example.com',
      avatarUrl: null,
      orgId: 3,
      orgName: '安全质量中心',
      title: '质检工程师',
      employmentType: 1,
      personStatus: 2,
      availabilityStatus: 3,
      workCity: '南京',
      currentTaskCount: 2,
      criticalTaskCount: 0,
      riskLevel: 2,
      remark: null,
      isDeleted: false,
      createdAt: '2026-02-10T08:00:00Z',
      updatedAt: '2026-05-03T09:00:00Z',
    },
    {
      id: 5,
      personCode: 'EXT-001',
      name: '吴芳（外部）',
      mobile: '139****7777',
      email: 'wufang@partner.com',
      avatarUrl: null,
      orgId: 4,
      orgName: '合作伙伴组织',
      title: '外协负责人',
      employmentType: 3,
      personStatus: 1,
      availabilityStatus: 1,
      workCity: '深圳',
      currentTaskCount: 1,
      criticalTaskCount: 1,
      riskLevel: 3,
      remark: null,
      isDeleted: false,
      createdAt: '2026-03-01T08:00:00Z',
      updatedAt: '2026-05-06T08:00:00Z',
    },
  ],
}

const MOCK_ORGANIZATIONS = {
  data: [
    {
      id: 1,
      orgCode: 'HD',
      orgName: '华东大区',
      orgType: 1,
      status: 1,
      contactName: '张总',
      contactMobile: '139****0001',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 2,
      orgCode: 'ETC',
      orgName: '工程技术中心',
      orgType: 1,
      status: 1,
      contactName: '李总',
      contactMobile: '139****0002',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 3,
      orgCode: 'SQC',
      orgName: '安全质量中心',
      orgType: 1,
      status: 1,
      contactName: '王总',
      contactMobile: '139****0003',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 4,
      orgCode: 'PTNR',
      orgName: '合作伙伴组织',
      orgType: 3,
      status: 1,
      contactName: null,
      contactMobile: null,
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-03-01T00:00:00Z',
    },
  ],
}

type MockHandler = (url: URL) => { status: number; body: unknown } | null

function matchPersonnelDetail(path: string): number | null {
  const m = path.match(/^\/api\/personnel\/(\d+)$/)
  return m ? Number(m[1]) : null
}

const routes: Record<string, MockHandler> = {
  '/api/personnel': url => {
    const id = matchPersonnelDetail(url.pathname)
    if (id) {
      const person = MOCK_PERSONNEL.data.find(p => p.id === id)
      return { status: 200, body: person ?? null }
    }
    // GET /api/personnel (list)
    return { status: 200, body: MOCK_PERSONNEL }
  },
  '/api/organizations': () => ({ status: 200, body: MOCK_ORGANIZATIONS }),
}

export function installMockApi() {
  const originalFetch = globalThis.fetch.bind(globalThis)

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? new URL(input, location.origin)
        : input instanceof URL
          ? input
          : new URL(input.url, location.origin)
    const method = (init?.method ?? 'GET').toUpperCase()

    // 只 mock GET /api/* 请求
    if (method === 'GET' && url.pathname.startsWith('/api/')) {
      const handler = routes[url.pathname]
      if (handler) {
        const result = handler(url)
        if (result) {
          return new Response(JSON.stringify(result.body), {
            status: result.status,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      // 未匹配的 /api/* 路径返回空数据（避免页面崩溃）
      if (url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    return originalFetch(input, init)
  }
}
