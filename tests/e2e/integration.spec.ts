import { test, expect } from '@playwright/test'

test.describe('Integration: Cross-entity relationships and data visibility', () => {
  // Test 1: Dashboard data aggregation
  // Verifies that the dashboard shows multiple sections (revenue, sessions, room availability)
  test('Dashboard에 핵심 섹션이 모두 표시된다', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
    // Revenue card
    await expect(page.getByText('이번 달 매출').first()).toBeVisible()
    // Session timeline section
    await expect(page.getByText('오늘의 세션').first()).toBeVisible()
    // Room availability card title is "룸 현황"
    await expect(page.getByText('룸 현황').first()).toBeVisible()
  })

  // Test 2: Reports page — all 5 chart section titles visible
  test('Reports 페이지에 5개 차트 섹션 제목이 모두 표시된다', async ({ page }) => {
    await page.goto('/reports')
    await expect(page).toHaveURL('/reports')
    await expect(page.getByText('월별 매출 추이').first()).toBeVisible()
    await expect(page.getByText('룸 가동률').first()).toBeVisible()
    await expect(page.getByText('아티스트별 매출 (상위 10)').first()).toBeVisible()
    await expect(page.getByText('카테고리별 장비 자산').first()).toBeVisible()
    await expect(page.getByText('엔지니어 활동').first()).toBeVisible()
  })

  // Test 3: Albums list — seed albums visible after app initialization
  test('Albums 목록에서 시드 앨범이 표시된다', async ({ page }) => {
    // Visit app first to trigger seed initialization
    await page.goto('/dashboard')
    await page.goto('/albums')
    await expect(page).toHaveURL('/albums')
    // After seed init, album cards should be present
    // AlbumCard title links use album.title — verify the album titles appear
    await expect(page.getByText('봄날의 기억').first()).toBeVisible()
  })

  // Test 4: Album detail — tracks section and tags section visible
  // Use localStorage after seed init to get album ID
  test('Album 상세 페이지에 트랙 목록과 태그 섹션이 표시된다', async ({ page }) => {
    // Initialize seed by visiting app and waiting for content to render
    await page.goto('/dashboard')
    // Wait for seed data to be written (DashboardPage renders revenue card after data loads)
    await expect(page.getByText('이번 달 매출').first()).toBeVisible()
    // Now read the album ID from localStorage
    const albumId = await page.evaluate(() => {
      const albums = JSON.parse(localStorage.getItem('sounddesk_albums') ?? '[]')
      return albums[0]?.id ?? ''
    })
    expect(albumId).toBeTruthy()
    await page.goto(`/albums/${albumId}`)
    await expect(page).toHaveURL(new RegExp(`/albums/${albumId}`))
    // Track progress section
    await expect(page.getByText('트랙 진행률').first()).toBeVisible()
    // Tag section
    await expect(page.getByText('태그').first()).toBeVisible()
  })

  // Test 5: Artist detail — tabs for albums/sessions/reviews exist
  test('Artist 상세 페이지에 앨범/세션/리뷰 탭이 표시된다', async ({ page }) => {
    // Initialize seed by visiting app and waiting for content to render
    await page.goto('/dashboard')
    await expect(page.getByText('이번 달 매출').first()).toBeVisible()
    // Get artist ID from localStorage
    const artistId = await page.evaluate(() => {
      const artists = JSON.parse(localStorage.getItem('sounddesk_artists') ?? '[]')
      return artists[0]?.id ?? ''
    })
    expect(artistId).toBeTruthy()
    await page.goto(`/artists/${artistId}`)
    await expect(page.getByRole('tab', { name: '앨범' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '세션' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '리뷰' })).toBeVisible()
  })

  // Test 6: Artist detail — reviews tab shows "새 리뷰 추가" button
  test('Artist 상세 리뷰 탭에 새 리뷰 추가 버튼이 있다', async ({ page }) => {
    // Initialize seed by visiting app and waiting for content to render
    await page.goto('/dashboard')
    await expect(page.getByText('이번 달 매출').first()).toBeVisible()
    const artistId = await page.evaluate(() => {
      const artists = JSON.parse(localStorage.getItem('sounddesk_artists') ?? '[]')
      return artists[0]?.id ?? ''
    })
    expect(artistId).toBeTruthy()
    await page.goto(`/artists/${artistId}`)
    await page.getByRole('tab', { name: '리뷰' }).click()
    await expect(page.getByRole('button', { name: '새 리뷰 추가' })).toBeVisible()
  })

  // Test 7: Sessions page — calendar/list view toggle works
  test('Sessions 페이지에서 캘린더/리스트 뷰 토글이 동작한다', async ({ page }) => {
    await page.goto('/sessions')
    await expect(page).toHaveURL('/sessions')
    // Calendar and list toggle buttons should be visible
    await expect(page.getByRole('button', { name: /캘린더/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /리스트/i })).toBeVisible()
    // Click list view toggle
    await page.getByRole('button', { name: /리스트/i }).click()
    // After clicking, verify the page still shows sessions management heading
    await expect(page.getByText('세션 관리').first()).toBeVisible()
  })

  // Test 8: Equipment page — asset value card and equipment count visible
  test('Equipment 페이지에 총 자산 가치와 장비 목록이 표시된다', async ({ page }) => {
    // Initialize seed by visiting app
    await page.goto('/dashboard')
    await page.goto('/equipment')
    await expect(page).toHaveURL('/equipment')
    // Total asset value section should be visible
    await expect(page.getByText('총 자산 가치').first()).toBeVisible()
    // Equipment badge showing count
    await expect(page.getByText(/개 장비/).first()).toBeVisible()
  })
})
