import { test, expect } from '@playwright/test'

test.describe('Wave 2 - Core CRUD Pages', () => {
  // Test 1: Root redirects to /dashboard
  test('/ redirects to /dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/dashboard/)
  })

  // Test 2: /studio page loads with MainLayout
  test('/studio 페이지가 MainLayout과 함께 로드된다', async ({ page }) => {
    await page.goto('/studio')
    await expect(page).toHaveURL('/studio')
    await expect(page.getByText('SoundDesk')).toBeVisible()
  })

  // Test 3: /rooms page loads and shows content
  test('/rooms 페이지가 로드된다', async ({ page }) => {
    await page.goto('/rooms')
    await expect(page).toHaveURL('/rooms')
    await expect(page.getByRole('main').getByRole('heading', { name: '룸 관리' })).toBeVisible()
  })

  // Test 4: /rooms page has filter buttons
  test('/rooms 페이지에 필터 버튼이 표시된다', async ({ page }) => {
    await page.goto('/rooms')
    await expect(page.getByRole('button', { name: '전체' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Recording' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mixing' })).toBeVisible()
  })

  // Test 5: /members page has "새 스태프 추가" button
  test('/members 페이지에 새 스태프 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/members')
    await expect(page.getByRole('button', { name: '새 스태프 추가' })).toBeVisible()
  })

  // Test 6: /albums page has "새 앨범 추가" button
  test('/albums 페이지에 새 앨범 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/albums')
    await expect(page.getByRole('button', { name: '새 앨범 추가' })).toBeVisible()
  })

  // Test 7: /albums page loads
  test('/albums 페이지가 로드된다', async ({ page }) => {
    await page.goto('/albums')
    await expect(page).toHaveURL('/albums')
    await expect(page.getByText('SoundDesk')).toBeVisible()
  })

  // Test 8: /members page loads
  test('/members 페이지가 로드된다', async ({ page }) => {
    await page.goto('/members')
    await expect(page).toHaveURL('/members')
    await expect(page.getByText('SoundDesk')).toBeVisible()
  })

  // Test 9: Sidebar navigation links exist
  test('Sidebar에 Wave 2 핵심 링크가 존재한다', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('link', { name: /Rooms/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Artists/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Albums/i })).toBeVisible()
  })

  // Test 10: /rooms page has "새 룸 추가" button
  test('/rooms 페이지에 새 룸 추가 버튼이 있다', async ({ page }) => {
    await page.goto('/rooms')
    await expect(page.getByRole('button', { name: '새 룸 추가' })).toBeVisible()
  })
})
