const { test, expect } = require('@playwright/test');

test('al abrir se ve el sobre y la carta está oculta', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sobre')).toBeVisible();
  await expect(page.getByText('Toca para abrir')).toBeVisible();
  await expect(page.locator('#pantalla-carta')).toBeHidden();
});

test('la carta se pinta desde CONTENIDO', async ({ page }) => {
  await page.goto('/');
  // Sin bloom todavía: forzamos el estado para comprobar el pintado.
  await page.evaluate(() => document.body.classList.replace('sobre', 'carta'));
  await expect(page.locator('#titulo')).toHaveText('Canciones para ti');
  await expect(page.locator('#para')).toHaveText('Para Sophia');
  await expect(page.locator('#playlist li')).toHaveCount(3);
  await expect(page.locator('#playlist li').nth(1)).toContainText('All of Me');
  await expect(page.locator('#nota p')).toHaveCount(3);
  await expect(page.locator('#estado')).toHaveText('Toca una canción');
});
