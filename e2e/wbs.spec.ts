import { test, expect } from '@playwright/test'

test.describe('WBS 页面', () => {
  test('WBS 加载并显示数据', async ({ page }) => {
    await page.goto('http://localhost:5173/projects/P001/wbs')
    await page.waitForResponse(
      resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
      { timeout: 15000 }
    )

    await expect(page.getByText('工作分解结构')).toBeVisible()
    await expect(page.getByText('树视图')).toBeVisible()
    await expect(page.getByRole('button', { name: '新建工作包' })).toBeVisible()
    await expect(page.getByText('WBS 编码')).toBeVisible()
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
})
