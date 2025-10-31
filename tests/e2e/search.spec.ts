import { test, expect } from '@playwright/test';

test.describe('Site search', () => {
  test('can locate health stories and open the first result', async ({ page }) => {
    await page.goto('/search');

    const input = page.getByLabel(/search swan/i);
    await expect(input).toBeFocused();

    await input.fill('health');
    await expect(page.getByRole('heading', { name: /Causes/i })).toBeVisible();

    const firstResult = page.locator('a', { hasText: /Health/i }).first();
    await firstResult.focus();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/stories\/|\/causes\//);
  });
});
