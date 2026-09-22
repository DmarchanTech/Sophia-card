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

test('elegir una canción la reproduce y marca la fila', async ({ page }) => {
  await page.goto('/');
  await page.click('#sobre');
  await expect(page.locator('body')).toHaveClass(/carta/, { timeout: 6000 });
  const hayYouTube = await page.waitForFunction(() => window.YT && window.YT.Player, null, { timeout: 8000 })
    .then(() => true).catch(() => false);
  test.skip(!hayYouTube, 'Sin conexión a YouTube: no se puede probar la reproducción');
  await page.locator('#playlist li').nth(1).locator('button').click();
  await expect(page.locator('#playlist li').nth(1)).toHaveClass(/activa/);
  await expect(page.locator('body')).toHaveClass(/sonando/, { timeout: 10000 });
  await expect(page.locator('#estado')).toHaveText('Reproduciendo: All of Me');
  await page.locator('#playlist li').nth(1).locator('button').click();
  await expect(page.locator('body')).not.toHaveClass(/sonando/, { timeout: 5000 });
  await expect(page.locator('#estado')).toHaveText('En pausa: All of Me');
});

test('sin la API de YouTube la playlist avisa', async ({ page }) => {
  await page.route('**/iframe_api', (ruta) => ruta.abort());
  await page.goto('/');
  await page.click('#sobre');
  await expect(page.locator('#estado')).toHaveText('Sin conexión para la música', { timeout: 12000 });
  await expect(page.locator('#playlist')).toHaveClass(/sin-musica/);
});

test('el panel se abre, muestra el ramo y el reproductor, y al cerrar no lo destruye', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.body.classList.replace('sobre', 'carta'));
  await expect(page.locator('#panel')).toBeHidden();
  await page.click('#abrir-panel');
  await expect(page.locator('#panel')).toBeVisible();
  await expect(page.locator('#panel .ramo')).toBeVisible();
  await expect(page.locator('#panel #yt')).toBeAttached();
  await page.click('#cerrar-panel');
  await expect(page.locator('#panel')).toBeHidden();
  await expect(page.locator('#panel #yt')).toBeAttached();
  expect(await page.locator('#panel').evaluate((el) => getComputedStyle(el).display)).not.toBe('none');
});
