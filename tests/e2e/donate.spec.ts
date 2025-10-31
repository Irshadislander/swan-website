import { test, expect } from '@playwright/test';

test.describe('Donate flow', () => {
  test('Quick donate flow leads to success summary', async ({ page }) => {
    await page.goto('/donate');

    const form = page.locator('form');
    await expect(form).toBeVisible();

    await page.getByLabel('Full name').fill('Playwright Donor');
    await page.getByLabel('Email').fill('playwright@swan.org');
    await page.getByRole('button', { name: /submit donation/i }).click();

    await page.waitForURL(/donate\/success/);
    await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible();
    await expect(page.getByText('Download receipt')).toBeVisible();
  });
});
