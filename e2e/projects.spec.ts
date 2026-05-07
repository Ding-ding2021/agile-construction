import { test, expect } from '@playwright/test'

test.describe('项目管理页面', () => {
  test('列表页加载并显示项目数据', async ({ page }) => {
    await page.goto('http://localhost:5173/projects')
    await page.waitForTimeout(2000)

    // 统计卡
    await expect(page.getByText('全部项目')).toBeVisible()
    await expect(page.getByText('执行中').first()).toBeVisible()

    // 视图 Tab
    await expect(page.getByText('表格')).toBeVisible()
    await expect(page.getByText('看板')).toBeVisible()
    await expect(page.getByText('日历')).toBeVisible()
    await expect(page.getByText('地图')).toBeVisible()

    // 数据行
    await expect(page.getByText('上海南京路旗舰店')).toBeVisible()

    // 工具栏
    await expect(page.getByPlaceholder('搜索项目...')).toBeVisible()
    await expect(page.getByRole('button', { name: '新建项目' })).toBeVisible()
  })

  test('列表搜索筛选', async ({ page }) => {
    await page.goto('http://localhost:5173/projects')
    await page.waitForTimeout(2000)

    const searchInput = page.getByPlaceholder('搜索项目...')
    await searchInput.fill('杭州')
    await page.waitForTimeout(500)

    await expect(page.getByText('杭州西湖银泰店')).toBeVisible()
    await expect(page.getByText('上海南京路旗舰店')).not.toBeVisible()
  })

  test('面包屑显示正确', async ({ page }) => {
    // 直接在列表页验证面包屑
    await page.goto('http://localhost:5173/projects')
    await page.waitForTimeout(2000)
    await expect(page.getByText('项目管理').first()).toBeVisible()
  })
})
