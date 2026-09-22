# Carta mixtape para Sophia — diseño

Fecha: 22 sep 2026. Referencia: `WhatsApp Video 2026-09-22 at 4.45.20 PM.mp4`
(TikTok @flowers_the_bloom).

## Qué es

Una página estática de una sola pantalla que se manda por link. Al abrirla se
ve un sobre cerrado; al tocarlo brota un ramo de flores en acuarela que llena
la pantalla y se funde con una carta abierta sobre un cuarto coquette. La carta
trae un casete animado, una playlist de 3 canciones (YouTube) y una nota
escrita. Un botón "Hay algo más" abre un panel con un ramo y el reproductor de
la canción que suena.

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Imágenes | Claude busca PNG con licencia libre (Pixabay, Openclipart, Wikimedia). Flores: **gerberas, lavanda y margaritas** en rosa, crema, blanco, verdes y lavanda. Cada archivo queda registrado en `img/FUENTES.md` con URL y licencia. |
| Música | YouTube IFrame API. Un solo reproductor, dentro del panel. |
| Contenido | Objeto `CONTENIDO` al inicio de `app.js`, con texto de ejemplo en español. |
| Destino | Estático en `c:\xampp\htdocs\sophia\` → `http://localhost/sophia/`. Se sube luego a cualquier hosting estático. |
| Pantalla | Móvil primero; en ≥ 900 px replica el layout del video. |
| Idioma UI | Español. |
| Paleta | La del video: crema `#efe6d8`, verde salvia (casete, botones), nota amarillo pálido, panel ciruela oscuro. Flores en rosa/crema/blanco/verde/lavanda. |
| Bloom | CSS puro sobre PNG (enfoque A). Sin canvas, sin GSAP. |
| Botón de cierre / "Finish mixtape" | No va. Pendiente en README. |
| README | `README.md` con avances y pendientes, actualizado en cada paso. |

## Archivos

```
sophia/
  index.html
  estilo.css
  app.js            ← CONTENIDO editable arriba del todo
  img/
    sobre.png, cuarto.jpg, ramo.png
    flor-01.png … flor-NN.png
    FUENTES.md      ← URL + licencia de cada imagen
  tests/carta.spec.js
  README.md
  docs/superpowers/specs/…
```

Sin build, sin npm en la página. Playwright solo para el test.

## Contenido editable

```js
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
    { titulo: 'Perfect',    artista: 'Ed Sheeran',  youtube: '2Vv-BfVoq4g' },
    { titulo: 'All of Me',  artista: 'John Legend', youtube: '450p7goxZqg' },
    { titulo: 'Yellow',     artista: 'Coldplay',    youtube: 'yKNxeF4KMsY' },
  ],
};
```

`youtube` es el id del video (lo que va tras `v=`). `app.js` pinta la
cabecera, la nota y la playlist desde aquí; nada de eso está en el HTML.

## Pantallas

Una sola página con cuatro capas; el estado es una clase en `<body>`:
`sobre` → `bloom` → `carta` (+ `panel-abierto`).

### 1. Sobre

Fondo crema. Sobre centrado (`img/sobre.png`) con leve balanceo en bucle.
Debajo, en cursiva: "Toca para abrir". Clic o toque en cualquier parte del
sobre → `body.bloom`.

### 2. Bloom

Capa fija a pantalla completa. Contiene ~20 `<img class="flor">` generadas por
JS desde la lista de PNG, posicionadas en el centro. Cada una lleva variables
CSS: `--angulo` (0-360), `--distancia` (0-45 vmin), `--retraso` (0-900 ms),
`--giro` (-40° a 40°), `--tam` (12-30 vmin). Un `@keyframes brotar`:
`scale(0) rotate(0)` → `translate(polar) scale(1) rotate(var(--giro))`, con
`cubic-bezier` de rebote suave y `animation-delay: var(--retraso)`.

Cuando termina la última flor (`animationend` con `--retraso` máximo), la
capa entera hace `scale(1.6)` + `opacity 0` en 900 ms mientras la carta hace
`opacity 0 → 1`. Al acabar: `body.carta`, se quita la capa del bloom del DOM.

Las flores se reparten por color al azar pero el JS garantiza que las primeras
en brotar sean grandes y centrales y las últimas pequeñas y periféricas, como
en el video. Si `prefers-reduced-motion`, el bloom se salta y se va derecho a
la carta con un fundido.

### 3. Carta

Fondo: `img/cuarto.jpg` a pantalla completa (`object-fit: cover`) con un
degradado rosa translúcido encima para que la tarjeta destaque. Tarjeta crema
centrada con sombra suave y borde apenas visible.

Contenido de la tarjeta, en este orden:

1. Cabecera: `PARA SOPHIA · DE …` en mayúsculas pequeñas espaciadas; título
   serif grande (Playfair Display o similar de Google Fonts).
2. **Casete**: dibujado en HTML/CSS (cuerpo verde salvia, etiqueta crema con el
   título, dos carretes con dientes en `border` dashed que giran con
   `animation: girar 2s linear infinite` y `animation-play-state` según suene
   o no, cuatro tornillos, ventana de cinta). Sin imagen: así los carretes
   giran de verdad.
3. **Playlist**: 3 filas `01 · Título / Artista · [▶]`. La fila activa cambia
   el botón a `❚❚` y se marca. Debajo, "Reproduciendo: Título" o
   "Toca una canción".
4. **Nota**: bloque amarillo pálido con la carta en serif itálica, párrafos
   desde `CONTENIDO.carta`, firmado con `CONTENIDO.de`.

Móvil (< 900 px): todo apilado en ese orden, tarjeta con márgenes de 16 px,
fuente 16 px. Escritorio: casete arriba a lo ancho, playlist y nota en dos
columnas debajo, tarjeta de 560 px de ancho como el video.

Botón flotante abajo-izquierda: corazón + "Hay algo más". Abre el panel.

### 4. Panel "Hay algo más"

Tarjeta ciruela oscuro (`#2b1d2e`) con bordes redondeados. Arriba, cabecera
"Tu ramo · De …" con `img/ramo.png` centrado. Debajo, el `<div id="yt">` donde
la IFrame API monta el reproductor (16:9). Botón cerrar arriba a la derecha.

Móvil: hoja inferior a pantalla completa con desplazamiento. Escritorio:
flotante de 300 px sobre la esquina inferior izquierda, como el video.

**El reproductor vive aquí y es el único.** Cerrado, el panel queda con
`visibility: hidden` (no `display: none`) para que el iframe siga sonando.

## Flujo de la música

- `app.js` carga `https://www.youtube.com/iframe_api` al entrar a la carta (no
  antes: el sobre no lo necesita).
- `onYouTubeIframeAPIReady` crea `player` en `#yt` con el primer video,
  `autoplay: 0`.
- Clic en una fila de la playlist: si es la activa, `pauseVideo()`/`playVideo()`;
  si es otra, `loadVideoById(id)` (ya cuenta como gesto del usuario, así que
  suena).
- `onStateChange`: `PLAYING` → `body.sonando`, carretes giran, fila marcada,
  "Reproduciendo: X"; `PAUSED`/`ENDED` → se quita `sonando`; `ENDED` además
  pasa a la siguiente canción.
- `onError` → la fila muestra "No se pudo cargar la canción" y se quita
  `sonando`. Si la API no llega en 8 s (sin internet), la playlist muestra
  "Sin conexión para la música" en vez de botones muertos.

## Errores

- Imagen que no carga (`onerror` en cada `<img class="flor">`): se quita del
  DOM; el bloom sigue con las demás. Si ninguna carga, el bloom se salta.
- YouTube: ver arriba.
- Nada más puede fallar: no hay backend ni formularios.

## Pruebas

`tests/carta.spec.js` (Playwright, contra `http://localhost/sophia/`):

1. Abre la página: se ve el sobre y "Toca para abrir"; la carta no.
2. Clic al sobre: `body` pasa por `bloom` y llega a `carta` en < 6 s; la
   tarjeta muestra `CONTENIDO.titulo` y las 3 canciones.
3. Clic a la canción 2: el iframe de `#yt` carga con ese id y, al llegar
   `PLAYING`, `body` tiene `sonando` y la fila 2 está marcada.
4. Clic a "Hay algo más": el panel es visible y contiene el iframe; cerrar lo
   oculta sin quitar el iframe del DOM.

La prueba 3 depende de internet y de que el video permita embed; si falla por
red, se salta con `test.skip` y se anota, no se finge.

Verificación manual en navegador (obligatoria antes de dar por hecho): abrir
en móvil (375 px) y escritorio (1280 px), consola sin errores, capturas de
las cuatro pantallas.

## README

`README.md` en la raíz de `sophia/` con: qué es, cómo editar `CONTENIDO`,
cómo cambiar imágenes, cómo correr el test, **Avances** (fecha + qué quedó
hecho) y **Pendientes**. Se actualiza en cada paso del plan.

## Fuera de alcance

Botón de cierre / "Finish mixtape", nota de audio grabada, compartir por
link corto, cualquier backend. Van a "Pendientes" del README.
