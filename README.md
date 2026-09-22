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

- `npx playwright test` (necesita `npm i` una vez) levanta solo su propio
  servidor (`python -m http.server 4321`; hace falta `python` en el PATH) —
  no depende de XAMPP.
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

## Pendientes

- Imágenes: ningún fallback CSS (hay `cuarto.webp` y `sobre.webp`). Las gerberas 01 y 02 son recortes fotográficos, no acuarela; si aparece una gerbera pintada con licencia libre, cambiarlas.
- El panel no usa un `ramo.png` propio (el spec lo pedía como imagen única): se arma con las 3 primeras `flor-0N.webp` superpuestas más un cono en CSS (`clip-path`), para no salir a buscar y licenciar una imagen de ramo aparte. Si aparece un PNG de ramo con licencia libre, se puede cambiar por una sola imagen.
- Botón de cierre / "Finish mixtape" (no va por ahora).
- Nota de audio grabada.
- Link corto.
- Probar en iPhone y en el navegador de WhatsApp (reproducción y bloom en primera carga).
