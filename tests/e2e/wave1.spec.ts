import { test, expect } from '@playwright/test'

test.describe('Wave 1: 공통 기반', () => {
  // Test 1: Root path redirects to /dashboard
  test('/ 경로는 /dashboard로 리다이렉트된다', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/dashboard')
  })

  // Test 2: /dashboard page loads successfully
  test('/dashboard 페이지가 정상 로드된다', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
    // The page renders MainLayout with title "Dashboard"
    await expect(page.locator('h1, [data-testid="header-title"]').first()).toBeVisible()
  })

  // Test 3: Sidebar renders with SoundDesk logo text
  test('Sidebar가 렌더링된다 (SoundDesk 로고 텍스트)', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByText('SoundDesk')).toBeVisible()
  })

  // Test 4: Sidebar contains a Dashboard link
  test('Sidebar에 Dashboard 링크가 존재한다', async ({ page }) => {
    await page.goto('/dashboard')
    const dashboardLink = page.getByRole('link', { name: /Dashboard/i })
    await expect(dashboardLink).toBeVisible()
  })

  // Test 5: Sidebar contains a Studio link
  test('Sidebar에 Studio 링크가 존재한다', async ({ page }) => {
    await page.goto('/dashboard')
    const studioLink = page.getByRole('link', { name: /Studio/i })
    await expect(studioLink).toBeVisible()
  })

  // Test 6: Sidebar has 4 group labels (운영, 아티스트, 비즈니스, 분석)
  test('Sidebar에 4개 그룹 레이블이 있다 (운영, 아티스트, 비즈니스, 분석)', async ({ page }) => {
    await page.goto('/dashboard')
    // Group labels are rendered as <p> elements with uppercase text
    await expect(page.getByText('운영')).toBeVisible()
    await expect(page.getByText('아티스트')).toBeVisible()
    await expect(page.getByText('비즈니스')).toBeVisible()
    await expect(page.getByText('분석')).toBeVisible()
  })

  // Test 7: Clicking Studio link navigates to /studio
  test('Sidebar의 Studio 링크를 클릭하면 /studio로 이동한다', async ({ page }) => {
    await page.goto('/dashboard')
    const studioLink = page.getByRole('link', { name: /Studio/i })
    await studioLink.click()
    await expect(page).toHaveURL('/studio')
  })

  // Test 8: Clicking Artists link navigates to /artists
  test('Sidebar의 Artists 링크를 클릭하면 /artists로 이동한다', async ({ page }) => {
    await page.goto('/dashboard')
    const artistsLink = page.getByRole('link', { name: /Artists/i })
    await artistsLink.click()
    await expect(page).toHaveURL('/artists')
  })

  // Test 9: /rooms page loads successfully
  test('/rooms 페이지가 정상 로드된다', async ({ page }) => {
    await page.goto('/rooms')
    await expect(page).toHaveURL('/rooms')
    await expect(page.getByText('SoundDesk')).toBeVisible()
  })

  // Test 10: /settings page loads successfully
  test('/settings 페이지가 정상 로드된다', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL('/settings')
    await expect(page.getByText('SoundDesk')).toBeVisible()
  })
})
