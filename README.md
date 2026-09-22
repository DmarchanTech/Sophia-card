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
- 22 sep 2026 — 11 flores, cuarto y sobre en `img/` con fuentes.
- 22 sep 2026 — Bloom: 22 flores con variables CSS, fundido a la carta, reduced-motion.

## Pendientes

- Imágenes: ningún fallback CSS (hay `cuarto.jpg` y `sobre.png`). Las gerberas 01 y 02 son recortes fotográficos, no acuarela; si aparece una gerbera pintada con licencia libre, cambiarlas.
- Botón de cierre / "Finish mixtape" (no va por ahora).
- Nota de audio grabada.
- Compartir por link corto / hosting.
