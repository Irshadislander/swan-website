import { test, expect } from '@playwright/test';

test.describe('Orphan sponsorship form', () => {
  test('submits lead and email', async ({ page }) => {
    await page.route('**/api/leads', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, id: 'L_ORPHAN' }),
      });
    });
    await page.route('**/api/send-email', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/orphan-sponsorship');
    await expect(page.getByRole('heading', { name: /Sponsor an orphaned student/i })).toBeVisible();

    await page.getByLabel('Full name').fill('Test Sponsor');
    await page.getByLabel('Email').fill('sponsor@test.sw');
    await page.getByLabel(/Questions or dedication/i).fill('Happy to support.');
    await page.getByRole('button', { name: /Submit interest/i }).click();
    await expect(page.getByText(/sponsorship team/i)).toBeVisible();
  });
});
