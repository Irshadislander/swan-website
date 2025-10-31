import { test, expect } from '@playwright/test'

test.describe('Donate flow', () => {
  test('One-time preset routes to success when checkout mocked', async ({ page }) => {
    await page.route('**/api/create-checkout-session', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, mock: true, url: '/donate/success?id=MOCK' }),
      })
    })

    await page.goto('/donate')

    const form = page.locator('form')
    await expect(form).toBeVisible()

    // choose one-time $25 preset
    await page.getByRole('button', { name: /\$25/ }).first().click()

    await page.getByLabel('Full name').fill('Playwright Donor')
    await page.getByLabel('Email').fill('playwright@swan.org')
    await page.getByRole('button', { name: /submit donation/i }).click()

    await page.waitForURL(/donate\/success/)
    await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /download receipt/i })).toBeVisible()
  })
})
