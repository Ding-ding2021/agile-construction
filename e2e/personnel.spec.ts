import { test, expect } from '@playwright/test'

const MOCK_PERSONNEL = {
  data: [
    {
      id: 1,
      personCode: 'P-2026-0001',
      name: '张伟',
      mobile: '138****1234',
      email: null,
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
      email: null,
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
      email: null,
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
      email: null,
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

const MOCK_ORGS = {
  data: [
    {
      id: 1,
      orgCode: 'HD',
      orgName: '华东大区',
      orgType: 1,
      status: 1,
      contactName: null,
      contactMobile: null,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 2,
      orgCode: 'ETC',
      orgName: '工程技术中心',
      orgType: 1,
      status: 1,
      contactName: null,
      contactMobile: null,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 3,
      orgCode: 'SQC',
      orgName: '安全质量中心',
      orgType: 1,
      status: 1,
      contactName: null,
      contactMobile: null,
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

test.beforeEach(async ({ page }) => {
  await page.route('**/api/personnel', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PERSONNEL),
      })
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    }
  })
  await page.route('**/api/organizations', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_ORGS),
    })
  })
})

test.describe('人员管理页面', () => {
  test('加载后显示统计卡和人员表格', async ({ page }) => {
    await page.goto('/personnel')
    await page.waitForLoadState('networkidle')

    // 统计卡标题
    await expect(page.getByText('总人数')).toBeVisible()
    await expect(page.getByText('高负载')).toBeVisible()

    // 人员列表中包含名字
    await expect(page.getByText('张伟')).toBeVisible()
    await expect(page.getByText('李娜')).toBeVisible()
    await expect(page.getByText('王强')).toBeVisible()
    await expect(page.getByText('赵敏')).toBeVisible()
    await expect(page.getByText('吴芳（外部）')).toBeVisible()
  })

  test('搜索过滤人员', async ({ page }) => {
    await page.goto('/personnel')
    await page.waitForLoadState('networkidle')

    const searchInput = page.getByPlaceholder('搜索人员...')
    await searchInput.fill('张伟')

    await expect(page.getByText('张伟')).toBeVisible()
    await expect(page.getByText('李娜')).not.toBeVisible()
    await expect(page.getByText('王强')).not.toBeVisible()
  })

  test('打开新增人员对话框并填写', async ({ page }) => {
    await page.goto('/personnel')
    await page.waitForLoadState('networkidle')

    // 点击新增人员按钮（用按钮定位器避免歧义）
    const addBtn = page.locator('button').filter({ hasText: '新增人员' }).first()
    await addBtn.click()

    // 对话框出现
    await expect(page.getByRole('heading', { name: '新增人员' })).toBeVisible()
    await expect(page.getByPlaceholder('请输入姓名')).toBeVisible()
    await expect(page.getByPlaceholder('请输入手机号')).toBeVisible()

    // 填写并保存
    await page.getByPlaceholder('请输入姓名').fill('测试用户')
    await page.getByPlaceholder('请输入手机号').fill('13900001111')
    await page.getByRole('button', { name: '保存' }).click()

    // 对话框关闭
    await expect(page.getByRole('heading', { name: '新增人员' })).not.toBeVisible({ timeout: 3000 })
  })

  test('编辑已有人员', async ({ page }) => {
    await page.goto('/personnel')
    await page.waitForLoadState('networkidle')

    // 点击第一个"编辑"按钮
    const editBtn = page
      .locator('tr')
      .filter({ hasText: '张伟' })
      .getByRole('button', { name: '编辑' })
    await editBtn.click()

    // 对话框出现
    await expect(page.getByRole('heading', { name: '编辑人员' })).toBeVisible()
  })

  test('分页和加载状态', async ({ page }) => {
    await page.goto('/personnel')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('总人数')).toBeVisible()
    await expect(page.locator('text=/共 \\d+ 条/')).toBeVisible()
  })
})
