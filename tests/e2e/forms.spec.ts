import { test, expect } from '@playwright/test'

const VOLUNTEER_ROUTE = '**/api/send-email'

test.describe('Forms', () => {
  test('Volunteer submission redirects to thanks', async ({ page }) => {
    await page.route(VOLUNTEER_ROUTE, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('/volunteer')
    await page.getByLabel('Full name').fill('Volunteer Test')
    await page.getByLabel('Email').fill('volunteer@test.sw')
    await page.getByLabel('Phone (optional)').fill('+977-123456789')
    await page.getByLabel('Skills or interests').fill('Mentorship, medical outreach')
    await page.getByLabel('How would you like to help?').fill('I would love to help with upcoming health camps in Lamjung district.')

    await page.getByRole('button', { name: /submit volunteer form/i }).click()
    await page.waitForURL(/thanks\?form=volunteer/)
    await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible()
  })

  test('Contact honeypot short-circuits submission', async ({ page }) => {
    await page.route(VOLUNTEER_ROUTE, () => {
      throw new Error('Honeypot should prevent network call')
    })

    await page.goto('/contact')
    await page.getByLabel('Full name').fill('Spam Guard')
    await page.getByLabel('Email').fill('spamguard@test.sw')
    await page.getByLabel('Subject').fill('Question about programs')
    await page.getByLabel('How can we help?').fill('Just validating the honeypot flow for testing purposes.')
    await page.evaluate(() => {
      const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]')
      if (honeypot) {
        honeypot.value = 'http://spam.example.com'
        honeypot.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    await page.getByRole('button', { name: /send message/i }).click()
    await page.waitForURL(/thanks\?form=contact/)
    await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible()
  })
})
