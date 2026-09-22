# Carta mixtape — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Página estática en `c:\xampp\htdocs\sophia\` que abre un sobre, hace brotar un ramo de flores en acuarela y muestra una carta con casete, playlist de YouTube y nota, más un panel "Hay algo más" con el reproductor.

**Architecture:** Un `index.html` con cuatro capas (`sobre`, `bloom`, `carta`, `panel`) cuyo estado es una clase en `<body>`. `app.js` pinta el contenido desde el objeto `CONTENIDO`, genera las flores del bloom con variables CSS y maneja el único reproductor de YouTube (IFrame API) que vive en el panel. Todo el movimiento es CSS.

**Tech Stack:** HTML, CSS, JS vanilla (sin build). YouTube IFrame API. Google Fonts (Playfair Display, Inter). Playwright para el test. Apache de XAMPP sirve `http://localhost/sophia/`.

**Spec:** `docs/superpowers/specs/2026-09-22-carta-mixtape-design.md`

## Global Constraints

- Idioma de la UI: **español** ("Toca para abrir", "Hay algo más", "Reproduciendo: …", "Toca una canción").
- Paleta: crema `#efe6d8`, verde salvia `#8a9a7b` (casete/botones), nota amarillo pálido `#fbf3d5`, panel ciruela `#2b1d2e`, texto `#2f2a26`.
- Móvil primero; en `min-width: 900px` layout del video (tarjeta 560 px, panel flotante 300 px abajo-izquierda).
- Sin dependencias en la página (ni GSAP ni jQuery). Solo la IFrame API de YouTube, cargada al entrar a la carta.
- Todo el contenido variable sale de `CONTENIDO` en `app.js`; nada de nombres ni canciones en el HTML.
- Cada imagen en `img/` queda anotada en `img/FUENTES.md` con URL y licencia.
- `README.md` se actualiza en cada tarea: sección **Avances** (fecha + qué) y **Pendientes**.
- Commits en `main` del repo `DmarchanTech/Sophia-card` con formato `<tipo>: <descripción>`. `*.mp4` no se sube.
- Nombres en español en código propio (`brotar`, `elegir`, `alCambiarEstado`), `camelCase`, constantes `UPPER_SNAKE_CASE`, sin números mágicos.

---

## Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Esqueleto de las cuatro capas y el casete en HTML. Sin texto de contenido. |
| `estilo.css` | Tokens de color, capas, bloom (`@keyframes brotar`), tarjeta, casete, playlist, nota, panel, media query 900 px, reduced-motion. |
| `app.js` | `CONTENIDO`, `FLORES`, pintado de la carta, bloom, YouTube, panel. |
| `img/` + `img/FUENTES.md` | Flores PNG, sobre, cuarto, ramo, y su procedencia. |
| `tests/carta.spec.js`, `playwright.config.js`, `package.json` | Test E2E contra `http://localhost/sophia/`. |
| `README.md` | Qué es, cómo editar, cómo probar, Avances, Pendientes. |

---

### Task 1: Esqueleto, contenido pintado y primer test

**Files:**
- Create: `index.html`, `estilo.css`, `app.js`, `README.md`, `package.json`, `playwright.config.js`, `tests/carta.spec.js`

**Interfaces:**
- Produces: `CONTENIDO` (objeto global), `FLORES` (array de rutas, vacío aún), `pintarCarta()`, `pintarPlaylist()`, ids del DOM: `#sobre`, `#pantalla-sobre`, `#pantalla-bloom`, `#pantalla-carta`, `#para`, `#de`, `#titulo`, `#casete-titulo`, `#playlist`, `#estado`, `#nota`, `#abrir-panel`, `#panel`, `#cerrar-panel`, `#panel-de`, `#yt`. Clases de estado en `<body>`: `sobre`, `bloom`, `carta`, `sonando`, `panel-abierto`.

- [ ] **Step 1: Instalar Playwright en `sophia/`**

```bash
cd /c/xampp/htdocs/sophia
npm init -y >/dev/null
npm i -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Escribir `playwright.config.js`**

```js
// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost/sophia/',
    viewport: { width: 390, height: 844 },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
```

- [ ] **Step 3: Escribir el test que falla (`tests/carta.spec.js`)**

```js
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
```

- [ ] **Step 4: Correrlo y ver que falla**

Run: `cd /c/xampp/htdocs/sophia && npx playwright test`
Expected: FAIL (404 o `#sobre` no encontrado).

- [ ] **Step 5: Escribir `index.html`**

```html
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Para ti</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,400&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="estilo.css">
</head>
<body class="sobre">

<section id="pantalla-sobre" class="capa">
  <button id="sobre" type="button" aria-label="Abrir la carta">
    <img src="img/sobre.png" alt="">
  </button>
  <p class="pista">Toca para abrir</p>
</section>

<section id="pantalla-bloom" class="capa" aria-hidden="true"></section>

<section id="pantalla-carta" class="capa">
  <img class="cuarto" src="img/cuarto.jpg" alt="">

  <article class="tarjeta">
    <p class="cabecera"><span id="para"></span> · <span id="de"></span></p>
    <h1 id="titulo"></h1>

    <div class="casete" aria-hidden="true">
      <span class="tornillo tl"></span><span class="tornillo tr"></span>
      <span class="tornillo bl"></span><span class="tornillo br"></span>
      <div class="etiqueta">
        <span class="etiqueta-titulo" id="casete-titulo"></span>
        <div class="ventana">
          <span class="carrete"></span>
          <span class="cinta"></span>
          <span class="carrete"></span>
        </div>
      </div>
      <div class="base"><span></span><span></span><span></span></div>
    </div>

    <div class="dos-columnas">
      <div>
        <ol id="playlist"></ol>
        <p id="estado">Toca una canción</p>
      </div>
      <div class="nota">
        <p class="nota-cab">Nota</p>
        <div id="nota"></div>
        <p class="firma" id="firma"></p>
      </div>
    </div>
  </article>

  <button id="abrir-panel" type="button">♥ Hay algo más</button>

  <aside id="panel" class="panel" aria-hidden="true">
    <button id="cerrar-panel" type="button" aria-label="Cerrar">×</button>
    <p class="panel-cab">Tu ramo <small id="panel-de"></small></p>
    <img class="ramo" src="img/ramo.png" alt="">
    <div class="yt-marco"><div id="yt"></div></div>
  </aside>
</section>

<script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 6: Escribir `estilo.css` (tokens, capas, tarjeta, playlist, nota; el bloom, casete y panel se completan en sus tareas)**

```css
:root {
  --crema: #efe6d8;
  --crema-claro: #f8f2e6;
  --salvia: #8a9a7b;
  --salvia-oscuro: #5f6e52;
  --nota: #fbf3d5;
  --ciruela: #2b1d2e;
  --tinta: #2f2a26;
  --tinta-suave: #7a716a;
  --rosa: #e9b7c4;
  --serif: 'Playfair Display', Georgia, serif;
  --sans: 'Inter', system-ui, sans-serif;
}

* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body {
  background: var(--crema);
  color: var(--tinta);
  font-family: var(--sans);
  font-size: 16px;
  overflow: hidden;
}

/* ---------- capas ---------- */
.capa { position: fixed; inset: 0; }

#pantalla-sobre {
  z-index: 30;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 24px;
}
body:not(.sobre) #pantalla-sobre { display: none; }
#sobre { background: none; border: 0; padding: 0; cursor: pointer; }
#sobre img { width: min(60vw, 260px); animation: mecer 3s ease-in-out infinite; }
@keyframes mecer { 50% { transform: rotate(-2deg) translateY(-4px); } }
.pista { font-family: var(--serif); font-style: italic; color: var(--tinta-suave); margin: 0; }

#pantalla-bloom { z-index: 20; display: none; background: var(--crema); overflow: hidden; }
body.bloom #pantalla-bloom { display: block; }

#pantalla-carta {
  z-index: 10;
  overflow-y: auto;
  opacity: 0; visibility: hidden;
  transition: opacity .9s ease, visibility 0s .9s;
}
body.carta #pantalla-carta { opacity: 1; visibility: visible; transition-delay: 0s; }
.cuarto {
  position: fixed; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;
}
#pantalla-carta::before {
  content: ''; position: fixed; inset: 0; z-index: -1;
  background: linear-gradient(180deg, rgba(240,200,210,.35), rgba(240,220,215,.55));
}

/* ---------- tarjeta ---------- */
.tarjeta {
  background: var(--crema-claro);
  margin: 24px 16px 96px;
  padding: 24px 20px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,.06);
  box-shadow: 0 20px 50px rgba(80,40,50,.18);
}
.cabecera {
  margin: 0 0 4px;
  font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--tinta-suave);
}
h1 { font-family: var(--serif); font-weight: 500; font-size: 32px; margin: 0 0 20px; }

/* ---------- playlist ---------- */
#playlist { list-style: none; margin: 0; padding: 0; }
#playlist li {
  display: grid; grid-template-columns: 28px 1fr 36px; align-items: center; gap: 8px;
  padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,.08);
}
#playlist .num { font-family: var(--serif); font-style: italic; color: var(--tinta-suave); }
#playlist .titulo { font-weight: 600; font-size: 14px; }
#playlist .artista { font-size: 12px; color: var(--tinta-suave); }
#playlist button {
  width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--salvia-oscuro);
  background: transparent; cursor: pointer; font-size: 12px; color: var(--salvia-oscuro);
}
#playlist li.activa button { background: var(--salvia-oscuro); color: #fff; }
#playlist li.activa button::before { content: '▶'; }
body.sonando #playlist li.activa button::before { content: '❚❚'; }
#playlist li:not(.activa) button::before { content: '▶'; }
#playlist li.error .artista { color: #b03a3a; }
#playlist.sin-musica button { opacity: .4; pointer-events: none; }
#estado { font-size: 12px; color: var(--tinta-suave); margin: 8px 0 0; }

/* ---------- nota ---------- */
.nota {
  background: var(--nota); padding: 16px 18px; margin-top: 20px;
  font-family: var(--serif); font-style: italic; font-size: 15px; line-height: 1.55;
}
.nota-cab {
  font-family: var(--sans); font-style: normal; font-size: 10px; letter-spacing: .18em;
  text-transform: uppercase; color: var(--tinta-suave); margin: 0 0 8px;
}
.nota p { margin: 0 0 12px; }
.firma { margin: 0; }

/* ---------- botón panel ---------- */
#abrir-panel {
  position: fixed; left: 16px; bottom: 16px; z-index: 15;
  background: var(--rosa); color: var(--ciruela); border: 0; border-radius: 999px;
  padding: 10px 16px; font: 600 13px var(--sans); cursor: pointer;
  box-shadow: 0 8px 20px rgba(80,40,50,.25);
}

/* ---------- escritorio ---------- */
@media (min-width: 900px) {
  .tarjeta { width: 560px; margin: 32px auto 32px; padding: 32px 36px; }
  .dos-columnas { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .nota { margin-top: 0; }
}
```

- [ ] **Step 7: Escribir `app.js` (contenido + pintado; el resto queda como funciones vacías que las tareas siguientes rellenan)**

```js
/* ===================== EDITA AQUÍ ===================== */
const CONTENIDO = {
  para: 'Sophia',
  de: 'Tu nombre',
  titulo: 'Canciones para ti',
  carta: [
    'Hola,',
    'Te hice un mixtape — de los de casete, no un CD. El lado A somos nosotros riéndonos. El lado B soy yo extrañándote ya.',
    'Dale play.',
  ],
  canciones: [
    { titulo: 'Perfect',   artista: 'Ed Sheeran',  youtube: '2Vv-BfVoq4g' },
    { titulo: 'All of Me', artista: 'John Legend', youtube: '450p7goxZqg' },
    { titulo: 'Yellow',    artista: 'Coldplay',    youtube: 'yKNxeF4KMsY' },
  ],
};
/* ====================================================== */

// Se rellena en la tarea de imágenes.
const FLORES = [];

const $ = (sel) => document.querySelector(sel);
const body = document.body;

function pintarCarta() {
  $('#para').textContent = `Para ${CONTENIDO.para}`;
  $('#de').textContent = `De ${CONTENIDO.de}`;
  $('#titulo').textContent = CONTENIDO.titulo;
  $('#casete-titulo').textContent = CONTENIDO.titulo;
  $('#panel-de').textContent = `· De ${CONTENIDO.de}`;
  $('#firma').textContent = CONTENIDO.de;
  const nota = $('#nota');
  nota.innerHTML = '';
  CONTENIDO.carta.forEach((parrafo) => {
    const p = document.createElement('p');
    p.textContent = parrafo;
    nota.appendChild(p);
  });
  pintarPlaylist();
}

function pintarPlaylist() {
  const lista = $('#playlist');
  lista.innerHTML = '';
  CONTENIDO.canciones.forEach((cancion, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="num">${String(i + 1).padStart(2, '0')}</span>
      <span><span class="titulo"></span><br><span class="artista"></span></span>
      <button type="button" aria-label="Reproducir"></button>`;
    li.querySelector('.titulo').textContent = cancion.titulo;
    li.querySelector('.artista').textContent = cancion.artista;
    li.querySelector('button').addEventListener('click', () => elegir(i));
    lista.appendChild(li);
  });
}

// ---- bloom (tarea 3) ----
function brotar() {}

// ---- YouTube (tarea 5) ----
function elegir() {}

// ---- panel (tarea 6) ----

pintarCarta();
$('#sobre').addEventListener('click', brotar);
```

- [ ] **Step 8: Correr el test y ver que pasa**

Run: `cd /c/xampp/htdocs/sophia && npx playwright test`
Expected: 2 passed. (Las imágenes 404 no rompen nada aún.)

- [ ] **Step 9: Escribir `README.md`**

```markdown
# Sophia card

Carta digital: un sobre que al tocarlo hace brotar flores y muestra una carta
con casete, playlist y nota. Página estática, sin backend.

## Cómo editar el contenido

Abre `app.js` y cambia el bloque `CONTENIDO` al inicio: `para`, `de`,
`titulo`, los párrafos de `carta` y las `canciones` (`youtube` es el id del
video, lo que va después de `v=` en la URL).

## Imágenes

Van en `img/`. La lista de flores del bloom está en `FLORES` (`app.js`).
Cada archivo tiene su origen y licencia en `img/FUENTES.md`.

## Probar

- Abrir `http://localhost/sophia/` (XAMPP).
- Test: `npx playwright test` (necesita `npm i` una vez).

## Avances

- 22 sep 2026 — Spec y plan. Esqueleto con contenido pintado desde `CONTENIDO`; 2 tests en verde.

## Pendientes

- Botón de cierre / "Finish mixtape" (no va por ahora).
- Nota de audio grabada.
- Compartir por link corto / hosting.
```

- [ ] **Step 10: Commit**

```bash
cd /c/xampp/htdocs/sophia
git add index.html estilo.css app.js README.md package.json package-lock.json playwright.config.js tests
git commit -m "feat: esqueleto de la carta con contenido pintado desde CONTENIDO"
```

---

### Task 2: Imágenes (flores, sobre, cuarto, ramo) con licencia

**Files:**
- Create: `img/flor-01.png` … `img/flor-NN.png` (mínimo 8), `img/sobre.png`, `img/cuarto.jpg`, `img/ramo.png`, `img/FUENTES.md`
- Modify: `app.js` (`FLORES`), `README.md`

**Interfaces:**
- Produces: `FLORES = ['img/flor-01.png', …]` con al menos 8 rutas existentes.

- [ ] **Step 1: Buscar flores PNG con fondo transparente y licencia libre**

Buscar (WebSearch) en este orden, con estas consultas, y anotar candidatas:

1. `site:pixabay.com watercolor gerbera png transparent` (licencia Pixabay: uso libre sin atribución).
2. `site:pixabay.com watercolor lavender png`, `site:pixabay.com watercolor daisy png`.
3. `site:commons.wikimedia.org watercolor flower png` (CC0 / CC-BY: anotar autor).
4. `site:openclipart.org gerbera` (CC0; estilo más plano, último recurso).

Criterio: PNG con transparencia, ≥ 400 px de lado, tonos rosa / crema / blanco / verde / lavanda. Descartar fotos con fondo y lo que no diga la licencia.

- [ ] **Step 2: Descargar y verificar**

```bash
cd /c/xampp/htdocs/sophia && mkdir -p img
curl -sL -o img/flor-01.png "<URL>"
# repetir por cada una; luego comprobar formato y tamaño:
python -c "from PIL import Image; import glob; [print(f, Image.open(f).size, Image.open(f).mode) for f in glob.glob('img/flor-*.png')]"
```

Expected: cada `flor-*.png` con modo `RGBA` y ambos lados ≥ 400. Abrir cada una con `Read` para confirmar que es una flor y su tono. Si Pillow no está: `pip install pillow`.

- [ ] **Step 3: Cuarto de fondo**

Buscar `site:pixabay.com pink vintage room illustration` o `site:unsplash.com pink vintage bedroom` (licencia Unsplash). Guardar como `img/cuarto.jpg` a ≤ 1600 px de ancho:

```bash
python -c "from PIL import Image; im=Image.open('img/cuarto.jpg'); im.thumbnail((1600,1600)); im.save('img/cuarto.jpg', quality=82)"
```

Si no aparece nada digno, **fallback**: no crear `cuarto.jpg` y poner en `estilo.css` un papel tapiz CSS en `#pantalla-carta`:

```css
#pantalla-carta {
  background:
    radial-gradient(circle at 20% 30%, rgba(233,183,196,.5) 0 6px, transparent 7px) 0 0 / 90px 90px,
    radial-gradient(circle at 70% 70%, rgba(138,154,123,.35) 0 4px, transparent 5px) 30px 40px / 90px 90px,
    linear-gradient(180deg, #f3dfdc, #ead3cf);
}
```

y quitar `<img class="cuarto">` del HTML. Anotarlo en Pendientes.

- [ ] **Step 4: Sobre y ramo**

Sobre: buscar `site:pixabay.com envelope floral illustration png`. Fallback: dibujarlo en CSS dentro de `#sobre` (rectángulo crema con la solapa como triángulo `border` y un `::after` con `🌸`), y quitar `<img>`.

Ramo: componer con tres flores ya descargadas — no hace falta otra imagen:

```html
<div class="ramo" aria-hidden="true">
  <img src="img/flor-01.png" alt=""><img src="img/flor-02.png" alt=""><img src="img/flor-03.png" alt="">
  <span class="cono"></span>
</div>
```

```css
.ramo { position: relative; width: 140px; height: 180px; margin: 8px auto 0; }
.ramo img { position: absolute; width: 70px; top: 0; }
.ramo img:nth-child(1) { left: 0; }
.ramo img:nth-child(2) { left: 35px; top: -14px; z-index: 2; }
.ramo img:nth-child(3) { left: 70px; }
.cono {
  position: absolute; left: 40px; top: 60px; width: 60px; height: 120px;
  background: linear-gradient(160deg, #e9d7bd, #c9b18e);
  clip-path: polygon(0 0, 100% 0, 60% 100%, 40% 100%);
}
```

Reemplazar en `index.html` el `<img class="ramo" src="img/ramo.png">` por ese bloque.

- [ ] **Step 5: `img/FUENTES.md`**

```markdown
# Origen de las imágenes

| Archivo | Fuente (URL) | Licencia | Autor |
|---|---|---|---|
| flor-01.png | https://pixabay.com/… | Pixabay Content License | … |
| cuarto.jpg | … | … | … |
| sobre.png | … | … | … |
```

Una fila por archivo. Sin fila, no entra al repo.

- [ ] **Step 6: Rellenar `FLORES` en `app.js`**

```js
const FLORES = [
  'img/flor-01.png', 'img/flor-02.png', 'img/flor-03.png', 'img/flor-04.png',
  'img/flor-05.png', 'img/flor-06.png', 'img/flor-07.png', 'img/flor-08.png',
];
```

(con las que existan de verdad).

- [ ] **Step 7: Verificar que todo carga**

Run: `cd /c/xampp/htdocs/sophia && for f in $(grep -o "img/[a-z0-9.-]*" app.js index.html | sort -u); do curl -s -o /dev/null -w "%{http_code} $f\n" "http://localhost/sophia/$f"; done`
Expected: todo `200`.

- [ ] **Step 8: README y commit**

En `README.md` → Avances: "22 sep 2026 — N flores, cuarto y sobre en `img/` con fuentes." Pendientes: lo que quedó en fallback.

```bash
git add img app.js index.html estilo.css README.md
git commit -m "feat: imágenes del bloom, cuarto y sobre con sus fuentes"
```

---

### Task 3: Bloom (sobre → flores → carta)

**Files:**
- Modify: `app.js` (`brotar`, `mostrarCarta`), `estilo.css` (bloque bloom), `tests/carta.spec.js`, `README.md`

**Interfaces:**
- Consumes: `FLORES`, `#pantalla-bloom`, clases `sobre`/`bloom`/`carta`.
- Produces: `brotar()` (click del sobre), `mostrarCarta()` (deja `body.carta` y llama `cargarYouTube()` si existe).

- [ ] **Step 1: Test que falla**

Añadir a `tests/carta.spec.js`:

```js
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
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx playwright test -g "brota|reduced"`
Expected: FAIL (`body` nunca recibe `bloom`).

- [ ] **Step 3: CSS del bloom**

Añadir a `estilo.css` tras el bloque de capas:

```css
/* ---------- bloom ---------- */
.flor {
  position: absolute; left: 50%; top: 50%;
  width: var(--tam); height: var(--tam); object-fit: contain;
  margin: calc(var(--tam) / -2) 0 0 calc(var(--tam) / -2);
  transform: scale(0); opacity: 0;
  filter: drop-shadow(0 6px 12px rgba(120,60,80,.18));
  animation: brotar 1.2s cubic-bezier(.2,.9,.3,1.15) var(--retraso) forwards;
  pointer-events: none;
}
@keyframes brotar {
  from {
    transform: rotate(var(--angulo)) translateY(0) rotate(calc(-1 * var(--angulo))) scale(0);
    opacity: 0;
  }
  40% { opacity: 1; }
  to {
    transform: rotate(var(--angulo)) translateY(calc(-1 * var(--distancia)))
               rotate(calc(-1 * var(--angulo) + var(--giro))) scale(1);
    opacity: 1;
  }
}
#pantalla-bloom { transition: transform .9s ease-in, opacity .9s ease-in; }
#pantalla-bloom.fundir { transform: scale(1.6); opacity: 0; }
```

- [ ] **Step 4: JS del bloom**

Reemplazar `function brotar() {}` en `app.js` por:

```js
// ---- bloom ----
const CANTIDAD_FLORES = 22;
const DISTANCIA_MAX_VMIN = 42;
const TAM_MAX_VMIN = 30;
const TAM_MIN_VMIN = 12;
const RETRASO_MAX_MS = 900;
const DURACION_BROTE_MS = 1200;
const DURACION_FUNDIDO_MS = 900;
const GIRO_MAX_GRADOS = 40;

const prefiereMenosMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function brotar() {
  if (prefiereMenosMovimiento() || FLORES.length === 0) {
    body.classList.replace('sobre', 'carta');
    mostrarCarta();
    return;
  }
  const capa = $('#pantalla-bloom');
  for (let i = 0; i < CANTIDAD_FLORES; i++) {
    const t = i / (CANTIDAD_FLORES - 1); // 0 = central y grande, 1 = periférica y pequeña
    const img = document.createElement('img');
    img.className = 'flor';
    img.alt = '';
    img.src = FLORES[i % FLORES.length];
    img.style.setProperty('--angulo', `${Math.round(Math.random() * 360)}deg`);
    img.style.setProperty('--distancia', `${(t * DISTANCIA_MAX_VMIN).toFixed(1)}vmin`);
    img.style.setProperty('--retraso', `${Math.round(t * RETRASO_MAX_MS)}ms`);
    img.style.setProperty('--giro', `${Math.round(Math.random() * 2 * GIRO_MAX_GRADOS - GIRO_MAX_GRADOS)}deg`);
    img.style.setProperty('--tam', `${(TAM_MAX_VMIN - t * (TAM_MAX_VMIN - TAM_MIN_VMIN)).toFixed(0)}vmin`);
    img.style.zIndex = CANTIDAD_FLORES - i;
    img.onerror = () => img.remove();
    capa.appendChild(img);
  }
  body.classList.replace('sobre', 'bloom');
  // Temporizador y no animationend: la última flor puede haberse quitado por onerror.
  setTimeout(fundirBloom, RETRASO_MAX_MS + DURACION_BROTE_MS);
}

function fundirBloom() {
  const capa = $('#pantalla-bloom');
  capa.classList.add('fundir');
  body.classList.add('carta');
  setTimeout(() => {
    body.classList.remove('bloom');
    capa.remove();
    mostrarCarta();
  }, DURACION_FUNDIDO_MS);
}

function mostrarCarta() {
  if (typeof cargarYouTube === 'function') cargarYouTube();
}
```

- [ ] **Step 5: Correr los tests**

Run: `npx playwright test`
Expected: 4 passed.

- [ ] **Step 6: Mirarlo en el navegador**

Abrir `http://localhost/sophia/` con el MCP de Playwright a 390×844 y a 1280×800, tocar el sobre, captura a mitad del bloom (≈ 1 s) y al llegar a la carta. Consola sin errores (los de YouTube todavía no aplican). Si las flores se ven apelotonadas o dejan huecos, ajustar `DISTANCIA_MAX_VMIN` / `TAM_MAX_VMIN`, no la fórmula.

- [ ] **Step 7: README y commit**

Avances: "Bloom: 22 flores con variables CSS, fundido a la carta, reduced-motion."

```bash
git add app.js estilo.css tests/carta.spec.js README.md
git commit -m "feat: bloom de flores del sobre a la carta"
```

---

### Task 4: Casete animado y layout de la carta

**Files:**
- Modify: `estilo.css` (bloque casete), `README.md`

**Interfaces:**
- Consumes: HTML del casete de la Task 1, clase `body.sonando` (la pone la Task 5).
- Produces: `.carrete` gira solo con `body.sonando`.

- [ ] **Step 1: Test que falla**

Añadir a `tests/carta.spec.js`:

```js
test('los carretes del casete giran solo cuando suena', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.body.classList.replace('sobre', 'carta'));
  const estado = () => page.locator('.carrete').first()
    .evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(await estado()).toBe('paused');
  await page.evaluate(() => document.body.classList.add('sonando'));
  expect(await estado()).toBe('running');
});
```

Run: `npx playwright test -g carretes` → Expected: FAIL (`animationPlayState` es `running` o la animación no existe).

- [ ] **Step 2: CSS del casete**

Añadir a `estilo.css` antes de `/* ---------- playlist ---------- */`:

```css
/* ---------- casete ---------- */
.casete {
  position: relative;
  background: linear-gradient(180deg, #b7c2a6, var(--salvia));
  border-radius: 10px;
  padding: 18px 22px 14px;
  margin: 0 0 20px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 10px 24px rgba(60,70,50,.25);
}
.tornillo {
  position: absolute; width: 9px; height: 9px; border-radius: 50%;
  background: radial-gradient(circle, #6d6a62 30%, #3e3c38 100%);
}
.tornillo.tl { top: 8px; left: 8px; }   .tornillo.tr { top: 8px; right: 8px; }
.tornillo.bl { bottom: 8px; left: 8px; } .tornillo.br { bottom: 8px; right: 8px; }
.etiqueta {
  background: var(--crema-claro); border-radius: 6px; padding: 10px 14px 12px;
  text-align: center;
}
.etiqueta-titulo {
  display: inline-block; font-family: var(--serif); font-style: italic; font-size: 13px;
  border: 1px solid var(--salvia); border-radius: 999px; padding: 2px 14px; color: var(--salvia-oscuro);
}
.ventana {
  display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 10px;
}
.carrete {
  width: 44px; height: 44px; border-radius: 50%;
  border: 5px dashed #cfc7b4;
  background: radial-gradient(circle, #f4efe4 0 8px, #d9d2c0 9px 14px, #f4efe4 15px);
  animation: girar 2s linear infinite;
  animation-play-state: paused;
}
body.sonando .carrete { animation-play-state: running; }
@keyframes girar { to { transform: rotate(360deg); } }
.cinta { width: 70px; height: 34px; background: #3b2a24; border-radius: 4px; }
.base {
  display: flex; justify-content: space-between; margin: 12px 24px 0;
}
.base span { width: 12px; height: 8px; background: #3e3c38; border-radius: 2px; opacity: .6; }
.base span:nth-child(2) { width: 40px; opacity: .3; }
```

- [ ] **Step 3: Correr los tests**

Run: `npx playwright test`
Expected: 5 passed.

- [ ] **Step 4: Mirarlo en el navegador**

MCP Playwright a 390×844 y 1280×800: forzar `body.carta` desde consola, captura de la tarjeta. Comprobar: casete verde con etiqueta y dos carretes, playlist con 3 filas, nota amarilla; en escritorio playlist y nota en dos columnas y tarjeta de 560 px. Ajustar espaciados si algo se monta.

- [ ] **Step 5: README y commit**

Avances: "Casete en CSS con carretes que giran con `body.sonando`; layout móvil y escritorio."

```bash
git add estilo.css tests/carta.spec.js README.md
git commit -m "feat: casete animado y layout de la carta"
```

---

### Task 5: Playlist con YouTube

**Files:**
- Modify: `app.js` (bloque YouTube), `tests/carta.spec.js`, `README.md`

**Interfaces:**
- Consumes: `CONTENIDO.canciones`, `#yt`, `#playlist li`, `#estado`, `mostrarCarta()` (llama a `cargarYouTube`).
- Produces: `cargarYouTube()`, `elegir(i)`, `body.sonando`, `li.activa`, `li.error`, `#playlist.sin-musica`.

- [ ] **Step 1: Test que falla**

Añadir a `tests/carta.spec.js`:

```js
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
```

Run: `npx playwright test -g "elegir|sin la API"` → Expected: FAIL.

- [ ] **Step 2: JS de YouTube**

Reemplazar `function elegir() {}` en `app.js` por:

```js
// ---- YouTube ----
const ESPERA_YOUTUBE_MS = 8000;
let player = null;
let activa = -1;
let temporizadorYouTube = null;

function cargarYouTube() {
  if (document.querySelector('script[src*="iframe_api"]')) return;
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  script.onerror = sinMusica;
  document.head.appendChild(script);
  temporizadorYouTube = setTimeout(sinMusica, ESPERA_YOUTUBE_MS);
  $('#estado').textContent = 'Cargando la música…';
}

window.onYouTubeIframeAPIReady = function () {
  clearTimeout(temporizadorYouTube);
  player = new YT.Player('yt', {
    videoId: CONTENIDO.canciones[0].youtube,
    playerVars: { rel: 0, playsinline: 1 },
    events: {
      onReady: () => { $('#estado').textContent = 'Toca una canción'; },
      onStateChange: alCambiarEstado,
      onError: alFallarVideo,
    },
  });
};

function sinMusica() {
  $('#estado').textContent = 'Sin conexión para la música';
  $('#playlist').classList.add('sin-musica');
}

function elegir(i) {
  if (!player) return;
  if (i === activa) {
    const sonando = player.getPlayerState() === YT.PlayerState.PLAYING;
    if (sonando) player.pauseVideo(); else player.playVideo();
    return;
  }
  activa = i;
  marcarActiva();
  player.loadVideoById(CONTENIDO.canciones[i].youtube);
}

function marcarActiva() {
  document.querySelectorAll('#playlist li').forEach((li, i) => {
    li.classList.toggle('activa', i === activa);
    li.classList.remove('error');
  });
}

function alCambiarEstado(evento) {
  const cancion = CONTENIDO.canciones[activa];
  const nombre = cancion ? cancion.titulo : '';
  if (evento.data === YT.PlayerState.PLAYING) {
    body.classList.add('sonando');
    $('#estado').textContent = `Reproduciendo: ${nombre}`;
  } else if (evento.data === YT.PlayerState.PAUSED) {
    body.classList.remove('sonando');
    $('#estado').textContent = `En pausa: ${nombre}`;
  } else if (evento.data === YT.PlayerState.ENDED) {
    body.classList.remove('sonando');
    elegir((activa + 1) % CONTENIDO.canciones.length);
  }
}

function alFallarVideo() {
  body.classList.remove('sonando');
  $('#estado').textContent = 'No se pudo cargar la canción';
  const fila = document.querySelectorAll('#playlist li')[activa];
  if (fila) fila.classList.add('error');
}
```

- [ ] **Step 3: Correr los tests**

Run: `npx playwright test`
Expected: 7 passed (o 6 passed + 1 skipped si no hay red; anotar cuál).

- [ ] **Step 4: Mirarlo en el navegador**

Con el MCP: abrir, tocar el sobre, elegir la canción 2. Comprobar que suena (el panel aún no existe, pero `#yt` está en el DOM y el estado dice "Reproduciendo: All of Me"), carretes girando, pausa/reanuda con el mismo botón. Consola: solo avisos propios de YouTube, ningún error de `app.js`.

- [ ] **Step 5: README y commit**

Avances: "Playlist con YouTube IFrame API: play/pausa, siguiente al terminar, avisos sin red o video bloqueado."

```bash
git add app.js tests/carta.spec.js README.md
git commit -m "feat: playlist con reproductor de YouTube"
```

---

### Task 6: Panel "Hay algo más"

**Files:**
- Modify: `estilo.css` (bloque panel), `app.js` (abrir/cerrar), `tests/carta.spec.js`, `README.md`

**Interfaces:**
- Consumes: `#abrir-panel`, `#panel`, `#cerrar-panel`, `#yt` (con el iframe de la Task 5 dentro).
- Produces: `body.panel-abierto`.

- [ ] **Step 1: Test que falla**

Añadir a `tests/carta.spec.js`:

```js
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
```

Run: `npx playwright test -g panel` → Expected: FAIL (`#panel` visible desde el inicio o no abre).

- [ ] **Step 2: CSS del panel**

Añadir a `estilo.css` antes de `/* ---------- escritorio ---------- */`:

```css
/* ---------- panel ---------- */
.panel {
  position: fixed; inset: 0; z-index: 40;
  background: var(--ciruela); color: #f3e9ee;
  padding: 20px 16px 24px;
  overflow-y: auto;
  visibility: hidden; opacity: 0; transform: translateY(24px);
  transition: opacity .3s ease, transform .3s ease, visibility 0s .3s;
}
body.panel-abierto .panel {
  visibility: visible; opacity: 1; transform: none; transition-delay: 0s;
}
#cerrar-panel {
  position: absolute; top: 12px; right: 12px;
  width: 36px; height: 36px; border-radius: 50%; border: 0;
  background: rgba(255,255,255,.12); color: #fff; font-size: 22px; cursor: pointer;
}
.panel-cab {
  font-family: var(--serif); font-size: 18px; text-align: center; margin: 8px 0 0;
}
.panel-cab small { display: block; font-family: var(--sans); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; opacity: .7; }
.yt-marco {
  margin-top: 16px; border-radius: 10px; overflow: hidden;
  aspect-ratio: 16 / 9; background: #000;
}
.yt-marco iframe { width: 100%; height: 100%; display: block; }
@media (min-width: 900px) {
  .panel {
    inset: auto auto 16px 16px; width: 300px; max-height: calc(100vh - 32px);
    border-radius: 16px; box-shadow: 0 24px 60px rgba(0,0,0,.4);
  }
}
```

- [ ] **Step 3: JS del panel**

Añadir al final de `app.js`, antes de `pintarCarta();`:

```js
// ---- panel ----
function abrirPanel(abierto) {
  body.classList.toggle('panel-abierto', abierto);
  $('#panel').setAttribute('aria-hidden', String(!abierto));
}
$('#abrir-panel').addEventListener('click', () => abrirPanel(true));
$('#cerrar-panel').addEventListener('click', () => abrirPanel(false));
```

- [ ] **Step 4: Correr los tests**

Run: `npx playwright test`
Expected: 8 passed (o 7 + 1 skipped sin red).

- [ ] **Step 5: Mirarlo en el navegador**

MCP a 390×844: sobre → bloom → carta → canción 2 → "Hay algo más": el panel ocupa la pantalla con el ramo arriba y el video sonando abajo; cerrar y comprobar que la música sigue. A 1280×800: panel flotante de 300 px abajo-izquierda, como el video. Captura de ambos.

- [ ] **Step 6: README y commit**

Avances: "Panel 'Hay algo más' con ramo y reproductor; cerrado sigue sonando."

```bash
git add app.js estilo.css tests/carta.spec.js README.md
git commit -m "feat: panel 'Hay algo más' con ramo y reproductor"
```

---

### Task 7: Verificación final y entrega

**Files:**
- Modify: `README.md`; lo que salga de la revisión.

- [ ] **Step 1: Suite completa**

Run: `cd /c/xampp/htdocs/sophia && npx playwright test`
Expected: todo en verde (o el de YouTube skipped por red, y se dice).

- [ ] **Step 2: Recorrido completo en navegador, ambos tamaños**

Con el MCP de Playwright, sin forzar clases: 390×844 y 1280×800. Sobre → toque → bloom → carta → canción → pausa → siguiente → panel → cerrar. Consola: cero errores propios. Cuatro capturas por tamaño guardadas en `.playwright-mcp/` (fuera de git).

- [ ] **Step 3: Revisión contra el spec**

Repasar la tabla "Decisiones tomadas" y las cuatro pantallas del spec. Lo que no coincida se arregla o se anota en Pendientes con el motivo.

- [ ] **Step 4: README final y push**

Avances: "22 sep 2026 — Recorrido completo verificado en móvil y escritorio." Pendientes actualizados (fallbacks de imágenes si los hubo, hosting).

```bash
git add -A
git status --short   # confirmar que no entra ningún .mp4 ni node_modules
git commit -m "docs: avances y pendientes tras la verificación final"
git push origin main
```

---

## Autorevisión del plan

- **Cobertura del spec:** sobre (T1/T2), bloom con reduced-motion y `onerror` (T3), carta con casete/playlist/nota y responsive (T1/T4), YouTube con errores y timeout (T5), panel con `visibility` (T6), `FUENTES.md` (T2), README en cada tarea, pruebas 1-4 del spec (T1, T3, T5, T6), verificación manual (T7). "Fuera de alcance" queda en Pendientes del README (T1).
- **Placeholders:** las URL de `FUENTES.md` y las candidatas de imágenes se rellenan al buscar; el plan da consultas, criterio y fallback concretos para cada una.
- **Nombres consistentes:** `brotar`, `fundirBloom`, `mostrarCarta`, `cargarYouTube`, `elegir`, `marcarActiva`, `alCambiarEstado`, `alFallarVideo`, `sinMusica`, `abrirPanel`; clases `sobre/bloom/carta/sonando/panel-abierto`, `activa/error/sin-musica/fundir`; ids como en la Task 1.
