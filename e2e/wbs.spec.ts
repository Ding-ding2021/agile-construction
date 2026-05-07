import { test, expect } from '@playwright/test'

test.describe('WBS 页面', () => {
  test('WBS 加载并显示数据', async ({ page }) => {
    await page.goto('http://localhost:5173/projects/P001/wbs')
    await page.waitForTimeout(2000)

    await expect(page.getByText('工作分解结构')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('WBS 编码')).toBeVisible()
    await expect(page.getByRole('button', { name: '新建工作包' })).toBeVisible()
  })

  test('树展开/折叠和 Sheet 侧拉窗', async ({ page }) => {
    await page.goto('http://localhost:5173/projects/P001/wbs')
    await page.waitForResponse(
      resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
      { timeout: 15000 }
    )
    await page.waitForTimeout(1000)

    // 折叠操作
    const foldBtn = page.locator('button[title="折叠"]').first()
    if (await foldBtn.isVisible().catch(() => false)) {
      await foldBtn.click()
      await page.waitForTimeout(300)
    }

    // 点击行打开 Sheet
    const row = page.locator('table tbody tr').first()
    await row.click()
    await page.waitForTimeout(1500)

    // 验证 Sheet 已弹出
    const sheet = await page.evaluate(
      () => document.querySelector('[data-slot="sheet-content"]') !== null
    )
    expect(sheet).toBeTruthy()
  })

  test('甘特图切换并显示时间轴', async ({ page }) => {
    await page.goto('http://localhost:5173/projects/P001/wbs')
    await page.waitForResponse(
      resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
      { timeout: 15000 }
    )
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: '甘特图' }).click()
    await page.waitForTimeout(500)

    await expect(page.getByText(/W\d+/)).toBeVisible()
  })

  test('网络图切换并显示节点', async ({ page }) => {
    await page.goto('http://localhost:5173/projects/P001/wbs')
    await page.waitForResponse(
      resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
      { timeout: 15000 }
    )
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: '网络图' }).click()
    await page.waitForTimeout(1000)

    await expect(page.locator('.react-flow__node')).toBeVisible()
  })

  test('甘特图展开/折叠子节点', async ({ page }) => {
    await page.goto('http://localhost:5173/projects/P001/wbs')
    await page.waitForResponse(
      resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
      { timeout: 15000 }
    )
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: '甘特图' }).click()
    await page.waitForTimeout(500)

    const expandBtn = page.locator('button[aria-label="展开"]').first()
    if (await expandBtn.isVisible().catch(() => false)) {
      await expandBtn.click()
      await page.waitForTimeout(300)
      await expect(page.locator('button[aria-label="折叠"]').first()).toBeVisible()
    }
  })

  test('甘特图缩放切换日/周/月', async ({ page }) => {
    await page.goto('http://localhost:5173/projects/P001/wbs')
    await page.waitForResponse(
      resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
      { timeout: 15000 }
    )
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: '甘特图' }).click()
    await page.waitForTimeout(500)

    await page.getByRole('button', { name: '周' }).click()
    await page.waitForTimeout(300)
    await expect(page.getByText(/W\d+/)).toBeVisible()
  })

  test('甘特图左侧信息列', async ({ page }) => {
    await page.goto('http://localhost:5173/projects/P001/wbs')
    await page.waitForResponse(
      resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
      { timeout: 15000 }
    )
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: '甘特图' }).click()
    await page.waitForTimeout(500)

    await expect(page.getByText('任务名称')).toBeVisible()
  })
})
