# Sophia card

Carta digital: un sobre que al tocarlo hace brotar flores y muestra una carta
con casete, playlist y nota. Página estática, sin backend.

## Cómo editar el contenido

Abre `app.js` y cambia el bloque `CONTENIDO` al inicio: `para`, `de`,
`titulo`, los párrafos de `carta` y las `canciones` (`youtube` es el id del
video, lo que va después de `v=` en la URL).

## Imágenes

Van en `img/` (≈ 0,9 MB en total; todo WebP ≤ 700 px, el cuarto ≤ 1400 px).
La lista de flores del bloom está en `FLORES` (`app.js`). Cada archivo tiene
su origen y licencia en `img/FUENTES.md`; lo que no esté en esa tabla no debe
estar en la carpeta. Para meter una imagen nueva: WebP con transparencia,
≤ 700 px de lado, fila en `FUENTES.md`, y subir el `?v=` de `estilo.css` /
`app.js` en `index.html` si cambian esos archivos.

## Rendimiento del bloom

Son 104 `<img>` animadas con `transform` y `opacity`. **No añadir `filter`
(drop-shadow, blur) a `.flor`**: medido el 23 sep 2026 con CPU ×4 (≈ teléfono
medio), el drop-shadow bajaba el bloom de 50 a 22 fps y el peor frame subía de
50 a 233 ms. **`.flor` lleva `will-change: transform` y hay que dejarlo**: sin
él Chrome crea la capa de cada flor al arrancar su animación y, si el raster
no llega a tiempo, pinta un rectángulo rosa (tile vacío) durante un frame en
mitad del bloom; se vio en grabaciones a 10 fps y desapareció con `will-change`.
Las flores se precargan mientras el sobre está en pantalla y se decodifican en
segundo plano (`decoding = 'async'`).

**La carta está pintada desde la carga, tapada por el sobre y por el bloom**
(ambas capas opacas). El primer pintado del casete (SVG en data-URI, emoji,
sombras) cuesta ~600 ms de hilo principal en Chrome con GPU; si la carta se
ocultara con `visibility`/`display` y se mostrara al fundir, la pantalla se
congelaría medio segundo justo en la transición (medido el 23 sep 2026, 598 ms
→ 17 ms). El test `tests/fluidez.spec.js` lo vigila y corre en ventana
(`headless: false`) porque headless no reproduce el congelón.

## Probar

- `npx playwright test` (necesita `npm i` una vez) levanta solo su propio
  servidor (`npx serve -l 4321 .`, que `npx` descarga la primera vez) — no
  depende de XAMPP.
- Para verlo a mano: `http://localhost/sophia/` (XAMPP) o cualquier servidor
  estático.

## Publicar

GitHub Pages desde `main` / raíz. URL: `https://dmarchantech.github.io/Sophia-card/`.
Antes de mandar el link: poner el nombre real en `CONTENIDO.de` y revisar la
carta.

## Avances

- 22 sep 2026 — Spec y plan. Esqueleto con contenido pintado desde `CONTENIDO`; 2 tests en verde.
- 22 sep 2026 — 11 flores, cuarto y sobre en `img/` con fuentes.
- 22 sep 2026 — Bloom: 22 flores con variables CSS, fundido a la carta, reduced-motion.
- 22 sep 2026 — Casete en CSS con carretes que giran con `body.sonando`; layout móvil y escritorio.
- 22 sep 2026 — Playlist con YouTube IFrame API: play/pausa, siguiente al terminar, avisos sin red o video bloqueado.
- 22 sep 2026 — Panel "Hay algo más" con ramo y reproductor; cerrado sigue sonando.
- 22 sep 2026 — Tanda final: imágenes a WebP (<1,5 MB), precarga, fallback de reproducción móvil, test sin XAMPP, Esc cierra el panel.
- 22 sep 2026 — Recorrido completo verificado en móvil y escritorio.
- 22 sep 2026 — Personalización (David): nombre, carta y 6 canciones reales; bloom de 104 flores en espiral a pantalla llena; casete botánico vintage; ramo con lazo en el panel; tests leen `CONTENIDO`.
- 23 sep 2026 — Limpieza de `img/` (8 MB → 0,9 MB: fuera huérfanos y PNG, todo WebP ≤ 700 px), bloom a 50 fps con CPU ×4 (sin drop-shadow ni will-change, decodificación async), `FUENTES.md` y README al día.

## Pendientes

- Imágenes: las gerberas 01 y 02 son recortes fotográficos, no acuarela; si aparece una gerbera pintada con licencia libre, cambiarlas.
- Botón de cierre / "Finish mixtape" (no va por ahora).
- Nota de audio grabada.
- Link corto.
- Probar en iPhone y en el navegador de WhatsApp (reproducción y bloom en primera carga).
- YouTube mete anuncios antes de algunas canciones (visto en la URL pública el 22 sep 2026): la música tarda unos segundos y, mientras, se abre el panel con "Cargando… si no suena, toca ▶". No se puede quitar desde el código; se quitaría con vídeos sin anuncios o con mp3 locales.
