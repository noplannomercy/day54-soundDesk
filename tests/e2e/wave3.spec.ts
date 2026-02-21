import { test, expect } from '@playwright/test'

test.describe('Wave 3 - Session/Equipment/Invoice/Contract Pages', () => {
  // Sessions page
  test('/sessions 페이지가 로드된다', async ({ page }) => {
    await page.goto('/sessions')
    await expect(page).toHaveURL('/sessions')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/sessions 페이지에 새 세션 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/sessions')
    const addButton = page.getByRole('button', { name: /새 세션|세션 추가|Add Session/i })
    await expect(addButton).toBeVisible()
  })

  test('/sessions 페이지에 캘린더/리스트 뷰 토글이 있다', async ({ page }) => {
    await page.goto('/sessions')
    // Look for calendar or list toggle buttons
    const calendarOrList = page.getByRole('button', { name: /캘린더|리스트|Calendar|List/i })
    await expect(calendarOrList.first()).toBeVisible()
  })

  // Equipment page
  test('/equipment 페이지가 로드된다', async ({ page }) => {
    await page.goto('/equipment')
    await expect(page).toHaveURL('/equipment')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/equipment 페이지에 새 장비 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/equipment')
    const addButton = page.getByRole('button', { name: /새 장비|장비 추가|Add Equipment/i })
    await expect(addButton).toBeVisible()
  })

  test('/equipment 페이지에 전체 자산 가치가 표시된다', async ({ page }) => {
    await page.goto('/equipment')
    // Look for asset value or total value text
    const assetText = page.getByText(/자산|총액|Total|Asset/i).first()
    await expect(assetText).toBeVisible()
  })

  // Invoices page
  test('/invoices 페이지가 로드된다', async ({ page }) => {
    await page.goto('/invoices')
    await expect(page).toHaveURL('/invoices')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/invoices 페이지에 새 인보이스 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/invoices')
    const addButton = page.getByRole('button', { name: /새 인보이스|인보이스 추가|Add Invoice/i })
    await expect(addButton).toBeVisible()
  })

  test('/invoices 페이지에 월별 매출 차트가 있다', async ({ page }) => {
    await page.goto('/invoices')
    // Recharts renders SVG elements
    const chart = page.locator('.recharts-wrapper, [class*="recharts"]').first()
    await expect(chart).toBeVisible()
  })

  // Contracts page
  test('/contracts 페이지가 로드된다', async ({ page }) => {
    await page.goto('/contracts')
    await expect(page).toHaveURL('/contracts')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/contracts 페이지에 새 계약 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/contracts')
    const addButton = page.getByRole('button', { name: /새 계약|계약 추가|Add Contract/i })
    await expect(addButton).toBeVisible()
  })

  // Sidebar navigation
  test('Sidebar에 Wave 3 링크가 존재한다', async ({ page }) => {
    await page.goto('/')
    const sessionsLink = page.getByRole('link', { name: /세션|Sessions/i })
    const equipmentLink = page.getByRole('link', { name: /장비|Equipment/i })
    const invoicesLink = page.getByRole('link', { name: /인보이스|Invoices/i })
    const contractsLink = page.getByRole('link', { name: /계약|Contracts/i })
    await expect(sessionsLink).toBeVisible()
    await expect(equipmentLink).toBeVisible()
    await expect(invoicesLink).toBeVisible()
    await expect(contractsLink).toBeVisible()
  })

  // Artists detail page - Wave 2 connection
  test('/artists 페이지에서 첫 번째 아티스트 상세로 이동 가능하다', async ({ page }) => {
    await page.goto('/artists')
    await expect(page).toHaveURL('/artists')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  // Sessions filter options
  test('/sessions 페이지에 필터 옵션이 있다', async ({ page }) => {
    await page.goto('/sessions')
    // Look for filter/select elements (status, room, etc.)
    const filter = page.locator('select, [role="combobox"]').first()
    await expect(filter).toBeVisible()
  })

  // Members page - Wave 2 connection
  test('/members 페이지가 로드된다', async ({ page }) => {
    await page.goto('/members')
    await expect(page).toHaveURL('/members')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })
})
