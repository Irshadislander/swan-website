import { test, expect } from '@playwright/test';

test.describe('Home', () => {
  test('renders the IRUSA-style hero and donate CTA', async ({ page }) => {
    await page.goto('/');
    // headline
    await expect(page.getByRole('heading', {
      name: "Because a student’s dream should never be out of reach."
    })).toBeVisible();

    // quick donate CTA
    await expect(page.getByRole('button', { name: /donate now/i })).toBeVisible();

    // stats row is present
    await expect(page.getByText(/Students reached/i)).toBeVisible();
  });
});
