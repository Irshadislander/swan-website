import { test, expect } from '@playwright/test';

test.describe('Navigation accessibility', () => {
  test('Skip link and mega nav keyboard flow', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    await expect(page.locator('a[href="#main"]')).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused({ timeout: 200 });

    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const causesNav = page.locator('nav[aria-label="Primary navigation"] a', { hasText: 'Causes' });
    await causesNav.focus();
    await expect(causesNav).toBeFocused();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    const megaPanel = page.locator('nav[aria-label="Primary navigation"] .card');
    await expect(megaPanel).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(megaPanel).toBeHidden();
    await expect(causesNav).toBeFocused();
  });
});
