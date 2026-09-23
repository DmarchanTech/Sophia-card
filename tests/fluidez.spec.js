const { test, expect } = require('@playwright/test');

// Headless rasteriza por software y no carga la fuente de emoji, así que el congelón del primer
// pintado del casete (600 ms en GPU real) solo se reproduce en ventana.
test.use({ headless: false });

test('pasar del bloom a la carta no congela el hilo principal', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1200); // precarga de flores
  // dispatchEvent y no click(): el sobre se balancea sin parar y Playwright puede quedarse
  // esperando a que esté quieto.
  await page.locator('#sobre').dispatchEvent('click');
  await expect(page.locator('body')).toHaveClass(/bloom/);
  await page.waitForTimeout(3300); // el fundido arranca 4200 ms después del clic
  const peorHuecoMs = await page.evaluate(() => new Promise((resolve) => {
    const t0 = performance.now(); let ultimo = t0; let peor = 0;
    const tick = (t) => { peor = Math.max(peor, t - ultimo); ultimo = t; if (t - t0 < 1600) requestAnimationFrame(tick); else resolve(Math.round(peor)); };
    requestAnimationFrame(tick);
  }));
  await expect(page.locator('body')).toHaveClass(/carta/);
  expect(peorHuecoMs, `peor hueco entre frames: ${peorHuecoMs} ms`).toBeLessThan(150);
});
