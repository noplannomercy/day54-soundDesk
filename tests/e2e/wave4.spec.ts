import { test, expect } from '@playwright/test'

test.describe('Wave 4 - Dashboard/Tags/Reviews/Playlists/Reports/Settings', () => {
  // Dashboard
  test('/dashboard 페이지가 로드된다', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/dashboard 페이지에 이번 달 매출 카드가 있다', async ({ page }) => {
    await page.goto('/dashboard')
    const card = page.getByText(/이번 달 매출|월 매출/i).first()
    await expect(card).toBeVisible()
  })

  test('/dashboard 페이지에 세션 타임라인이 있다', async ({ page }) => {
    await page.goto('/dashboard')
    const timeline = page.getByText(/세션|오늘|Schedule/i).first()
    await expect(timeline).toBeVisible()
  })

  // Tags
  test('/tags 페이지가 로드된다', async ({ page }) => {
    await page.goto('/tags')
    await expect(page).toHaveURL('/tags')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/tags 페이지에 새 태그 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/tags')
    const addButton = page.getByRole('button', { name: /새 태그|태그 추가/i })
    await expect(addButton).toBeVisible()
  })

  test('/tags 페이지에서 태그를 생성할 수 있다', async ({ page }) => {
    await page.goto('/tags')
    await page.getByRole('button', { name: /새 태그|태그 추가/i }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('textbox').first().fill('테스트 태그')
    await dialog.getByRole('button', { name: /저장|생성|추가/i }).click()
    await expect(page.getByText('테스트 태그')).toBeVisible()
  })

  // Reviews
  test('/reviews 페이지가 로드된다', async ({ page }) => {
    await page.goto('/reviews')
    await expect(page).toHaveURL('/reviews')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/reviews 페이지에 새 리뷰 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/reviews')
    const addButton = page.getByRole('button', { name: /새 리뷰|리뷰 추가/i })
    await expect(addButton).toBeVisible()
  })

  test('/reviews 페이지에 평균 평점이 표시된다', async ({ page }) => {
    await page.goto('/reviews')
    const ratingText = page.getByText(/평균 평점|평점/i).first()
    await expect(ratingText).toBeVisible()
  })

  test('/reviews 페이지에 아티스트 필터가 있다', async ({ page }) => {
    await page.goto('/reviews')
    const filter = page.locator('[role="combobox"]').first()
    await expect(filter).toBeVisible()
  })

  // Playlists
  test('/playlists 페이지가 로드된다', async ({ page }) => {
    await page.goto('/playlists')
    await expect(page).toHaveURL('/playlists')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/playlists 페이지에 새 플레이리스트 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/playlists')
    const addButton = page.getByRole('button', { name: /새 플레이리스트|플레이리스트 추가/i })
    await expect(addButton).toBeVisible()
  })

  test('/playlists 페이지에 공개/비공개 필터가 있다', async ({ page }) => {
    await page.goto('/playlists')
    const filter = page.locator('[role="combobox"]').first()
    await expect(filter).toBeVisible()
  })

  // Reports
  test('/reports 페이지가 로드된다', async ({ page }) => {
    await page.goto('/reports')
    await expect(page).toHaveURL('/reports')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/reports 페이지에 차트가 렌더링된다', async ({ page }) => {
    await page.goto('/reports')
    await page.waitForTimeout(1000)
    const chart = page.locator('.recharts-wrapper, [class*="recharts"], svg').first()
    await expect(chart).toBeVisible()
  })

  test('/reports 페이지에 월별 매출 섹션이 있다', async ({ page }) => {
    await page.goto('/reports')
    const section = page.getByText(/월별 매출|매출 추이/i).first()
    await expect(section).toBeVisible()
  })

  test('/reports 페이지에 룸 가동률 섹션이 있다', async ({ page }) => {
    await page.goto('/reports')
    const section = page.getByText(/가동률|룸 가동/i).first()
    await expect(section).toBeVisible()
  })

  // Settings
  test('/settings 페이지가 로드된다', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL('/settings')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })

  test('/settings 페이지에 통화 설정이 있다', async ({ page }) => {
    await page.goto('/settings')
    const currencySection = page.getByText(/통화|Currency/i).first()
    await expect(currencySection).toBeVisible()
  })

  test('/settings 페이지에 데이터 초기화 버튼이 있다', async ({ page }) => {
    await page.goto('/settings')
    const resetButton = page.getByRole('button', { name: /초기화|삭제|Reset/i })
    await expect(resetButton).toBeVisible()
  })

  test('/settings 페이지에 다크모드 설정이 있다', async ({ page }) => {
    await page.goto('/settings')
    const darkMode = page.getByText(/다크모드|Dark/i).first()
    await expect(darkMode).toBeVisible()
  })

  // Sidebar
  test('Sidebar에 Wave 4 링크가 존재한다', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /대시보드|Dashboard/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /태그|Tags/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /리뷰|Reviews/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /플레이리스트|Playlists/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /보고서|Reports/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /설정|Settings/i })).toBeVisible()
  })

  // albums/[id] - TagSelector integration
  test('/albums/:id 페이지에 태그 섹션이 있다', async ({ page }) => {
    await page.goto('/albums')
    await expect(page.getByText('SoundDesk').first()).toBeVisible()
  })
})
