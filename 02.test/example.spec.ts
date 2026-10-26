import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the store title and product list', async ({ page }) => {
    await expect(page).toHaveTitle('STORE');
    await expect(page.locator('#tbodyid .card').first()).toBeVisible();
  });

  test('filters products by the Laptops category', async ({ page }) => {
    await page.getByRole('link', { name: 'Laptops' }).click();

    const titles = page.locator('#tbodyid .card-title');
    await expect(titles.filter({ hasText: 'MacBook air' })).toBeVisible();
    await expect(titles.filter({ hasText: 'Samsung galaxy s6' })).toHaveCount(0);
  });

  test('opens a product detail page', async ({ page }) => {
    await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

    await expect(page).toHaveURL(/prod\.html\?idp_=/);
    await expect(page.locator('.name')).toHaveText('Samsung galaxy s6');
    await expect(page.getByRole('link', { name: 'Add to cart' })).toBeVisible();
  });
});
