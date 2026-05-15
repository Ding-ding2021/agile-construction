import { test, expect } from '@playwright/test'

const API_BASE = 'http://localhost:3100'

test.describe('项目详情 — 任务驱动聚合展示', () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.post(`${API_BASE}/projects`, {
      data: {
        code: `E2E-${Date.now()}`,
        name: 'E2E测试项目',
        brand: '测试品牌',
        plannedOpenDate: '2026-12-01',
      },
    })
    expect(res.ok()).toBeTruthy()
  })

  test('创建项目 → 进入详情 → 看到健康度卡片和维度状态面板', async ({ page }) => {
    await page.goto('http://localhost:5173/projects')
    await page.waitForTimeout(2000)

    await expect(page.getByText('全部项目')).toBeVisible()
    await expect(page.getByPlaceholder('搜索项目...')).toBeVisible()

    const projectLink = page.locator('table tbody tr').first()
    await projectLink.click()
    await page.waitForTimeout(2000)

    const healthCardTexts = ['健康度', '进度偏差', 'SLA超时', '风险项', '未分配']
    for (const text of healthCardTexts) {
      await expect(page.getByText(text).first()).toBeVisible({ timeout: 5000 })
    }

    const dimensionTexts = ['执行维度', '验收维度', '结算维度', '派单维度']
    for (const text of dimensionTexts) {
      await expect(page.getByText(text).first()).toBeVisible({ timeout: 3000 })
    }

    const region = page.getByRole('region', { name: '项目维度状态' })
    await expect(region).toBeVisible({ timeout: 3000 })
  })

  test('项目详情页 tab 切换 — 健康度始终可见', async ({ page }) => {
    await page.goto('http://localhost:5173/projects')
    await page.waitForTimeout(2000)

    const projectRow = page.locator('table tbody tr').first()
    await projectRow.click()
    await page.waitForTimeout(2000)

    await expect(page.getByRole('tab', { name: '概览' })).toBeVisible()

    const resourceTab = page.getByRole('tab', { name: '资源' })
    if (await resourceTab.isVisible().catch(() => false)) {
      await resourceTab.click()
      await page.waitForTimeout(1000)
    }

    const overviewTab = page.getByRole('tab', { name: '概览' })
    await overviewTab.click()
    await page.waitForTimeout(1000)

    await expect(page.getByText('健康度').first()).toBeVisible({ timeout: 3000 })
  })

  test('项目列表页 — 健康度标签正确渲染', async ({ page }) => {
    await page.goto('http://localhost:5173/projects')
    await page.waitForTimeout(2000)

    const healthBadge = page
      .locator('table tbody tr td span')
      .filter({
        hasText: /正常|关注|预警|严重/,
      })
      .first()
    await expect(healthBadge).toBeVisible({ timeout: 5000 })
  })
})
