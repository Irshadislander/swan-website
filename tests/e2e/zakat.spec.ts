import { test, expect } from '@playwright/test';

test.describe('Zakat tools', () => {
  test('calculator computes zakat and saves lead', async ({ page }) => {
    await page.route('**/api/leads', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, id: 'L_TEST' }),
      });
    });

    await page.goto('/zakat');
    await expect(page.getByRole('heading', { name: /Fulfill your Zakat/i })).toBeVisible();

    await page.getByLabel('Cash & savings').fill('1000');
    await page.getByLabel('Gold value').fill('100');
    await expect(page.getByText(/Zakat due \(2.5%\)/i)).toBeVisible();

    await page.getByRole('button', { name: /Save calculation/i }).click();
    await expect(page.getByText(/Calculation saved/i)).toBeVisible();
  });
});
