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

test('al tocar el sobre brota el ramo y llega a la carta', async ({ page }) => {
  await page.goto('/');
  await page.click('#sobre');
  await expect(page.locator('body')).toHaveClass(/bloom/);
  await expect(page.locator('#pantalla-bloom .flor').first()).toBeAttached();
  await expect(page.locator('body')).toHaveClass(/carta/, { timeout: 6000 });
  await expect(page.locator('body')).not.toHaveClass(/bloom/, { timeout: 3000 });
  await expect(page.locator('#pantalla-carta')).toBeVisible();
});

test('con reduced-motion se salta el bloom', async ({ browser }) => {
  const contexto = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await contexto.newPage();
  await page.goto('http://localhost/sophia/');
  await page.click('#sobre');
  await expect(page.locator('body')).toHaveClass(/carta/, { timeout: 2000 });
  await expect(page.locator('#pantalla-bloom .flor')).toHaveCount(0);
  await contexto.close();
});

test('los carretes del casete giran solo cuando suena', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.body.classList.replace('sobre', 'carta'));
  const estado = () => page.locator('.carrete').first()
    .evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(await estado()).toBe('paused');
  await page.evaluate(() => document.body.classList.add('sonando'));
  expect(await estado()).toBe('running');
});
