// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  // baseURL con subruta ('/sophia/') rompe page.goto('/'): la URL WHATWG
  // resuelve una barra inicial contra el origen, no contra la subruta, y
  // termina en http://localhost/ (dashboard de XAMPP). Servimos la carpeta
  // en su propia raíz con el servidor estático de Python (ya instalado).
  webServer: {
    command: 'python -m http.server 4321',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://127.0.0.1:4321/',
    viewport: { width: 390, height: 844 },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
