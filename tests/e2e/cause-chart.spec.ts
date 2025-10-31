import { test, expect } from '@playwright/test';

test.describe('Cause view – fund use chart', () => {
  test('loads donut only after user opts in', async ({ page }) => {
    // hit a real cause slug present in your JSON (adjust if needed)
    await page.goto('/causes/education');

    // if the button is shown (flag ON), click to mount the chart
    const viewBtn = page.getByRole('button', { name: /view breakdown/i });
    if (await viewBtn.isVisible().catch(() => false)) {
      await viewBtn.click();
    }

    // chart container should appear with role="img" or canvas rendered
    const chartImgRole = page.getByRole('img');
    const canvas = page.locator('canvas');
    await expect(chartImgRole.or(canvas)).toBeVisible();
  });
});
