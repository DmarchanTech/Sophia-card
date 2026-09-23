/* ===================== EDITA AQUÍ ===================== */
const CONTENIDO = {
  para: 'Sophia',
  de: 'David',
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

const FLORES = [
  'img/flor-01.webp', 'img/flor-02.webp', 'img/flor-03.webp', 'img/flor-04.webp',
  'img/flor-05.webp', 'img/flor-06.webp', 'img/flor-07.webp', 'img/flor-08.webp',
  'img/flor-09.webp', 'img/flor-10.webp', 'img/flor-11.webp',
];

const $ = (sel) => document.querySelector(sel);
const body = document.body;

function pintarCarta() {
  $('#para').textContent = `Para ${CONTENIDO.para}`;
  $('#de').textContent = `De ${CONTENIDO.de}`;
  $('#titulo').textContent = CONTENIDO.titulo;
  $('#casete-titulo').textContent = CONTENIDO.titulo;
  $('#panel-de').textContent = `De ${CONTENIDO.de}`;
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

const BOTANICA = {
  gerberas: [
    'img/flor-01.webp', // Gerbera rosa
    'img/flor-02.webp', // Gerbera blanca / centro rosa
    'img/flor-03.webp', // Gerbera salmón
  ],
  margaritas: [
    'img/flor-04.webp', // Margaritas en acuarela
  ],
  lavanda: [
    'img/flor-05.webp', // Ramita de lavanda
    'img/flor-06.webp', // Manojo de lavanda
  ],
  lirios: [
    'img/flor-07.webp', // Ramillete crema y lirio blanco
    'img/flor-09.webp', // Flor melocotón suave
  ],
  salvia: [
    'img/flor-10.webp', // Eucalipto
    'img/flor-11.webp', // Follaje salvia
  ]
};

// ---- animaciones botánicas y bloom orgánico ----
function animarPresion(elemento, callback) {
  if (!elemento) {
    if (callback) callback();
    return;
  }
  elemento.classList.add('presionando');
  setTimeout(() => {
    elemento.classList.remove('presionando');
    if (typeof callback === 'function') callback();
  }, 140);
}

const prefiereMenosMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let transicionandoSobre = false;

/*
 * brotar() — Espiral floral desde el centro
 * ------------------------------------------
 * Lógica visual (replicando las imágenes de referencia):
 *   1. Las flores nacen del centro de la pantalla, escala 0.08.
 *   2. Cada flor viaja hacia afuera a lo largo de un radio determinado
 *      por su índice (distribución proporcional al área → √t) mientras
 *      rota alrededor del centro (giro espiral).
 *   3. El ángulo de inicio se escoge con el ángulo áureo para relleno
 *      natural y uniforme.
 *   4. Las flores más cercanas al centro usan imágenes más grandes y
 *      florecen primero; las periféricas son algo menores y más tardías.
 *   5. Tres capas de z-index + sombra dan profundidad.
 *   6. La pantalla queda cubierta (~75 vmax de radio cubre cualquier esquina)
 *      y luego se hace el fundido hacia #pantalla-carta.
 */
function brotar() {
  if (!body.classList.contains('sobre') || transicionandoSobre) return;
  transicionandoSobre = true;

  animarPresion($('#sobre'), () => {
    if (prefiereMenosMovimiento() || FLORES.length === 0) {
      body.classList.replace('sobre', 'carta');
      mostrarCarta();
      return;
    }

    const capa = $('#pantalla-bloom');
    capa.innerHTML = '';

    const esMovil      = window.innerWidth <= 640;
    const N            = esMovil ? 52 : 78;   // total de flores
    const RADIO_MAX    = esMovil ? 62 : 78;   // vmax — cubre esquinas en cualquier pantalla
    const ANG_DORADO   = 137.507764;           // giro áureo entre flores consecutivas
    const GIRO_ESPIRAL = 38;                   // grados extra que cada flor gira en su viaje

    // Paleta floral: solo flores que encajan en la paleta rosa / blanca / crema
    const POOL = [
      ...BOTANICA.gerberas,   // rosa, blanco, salmón
      ...BOTANICA.gerberas,   // doble peso: protagonistas
      ...BOTANICA.lirios,     // crema / melocotón
      ...BOTANICA.lirios,
      ...BOTANICA.margaritas, // blanco
      ...BOTANICA.lavanda,    // lavanda suave — profundidad
    ];

    for (let i = 0; i < N; i++) {
      const t = i / (N - 1); // 0 = centro · 1 = periferia

      // ── Asignación de capa ──────────────────────────────────────────────
      // Las flores del centro (t < 0.35) van delante para el efecto de masa
      // floral compacta; las periféricas van detrás para profundidad.
      let capaClase;
      if (t < 0.30)       capaClase = 'capa-frente';
      else if (t < 0.65)  capaClase = 'capa-media';
      else                capaClase = 'capa-fondo';

      // ── Imagen ──────────────────────────────────────────────────────────
      const src = POOL[i % POOL.length];

      // ── Ángulo de salida (espiral áurea) ────────────────────────────────
      const anguloInicio = (i * ANG_DORADO) % 360;

      // ── Radio: crecimiento proporcional al área (√t) ────────────────────
      // Las primeras flores forman el núcleo compacto; las últimas alcanzan
      // las esquinas de la pantalla.
      const factorR  = Math.sqrt(t);
      const distancia = (factorR * RADIO_MAX).toFixed(1);

      // ── Tamaño ─────────────────────────────────────────────────────────
      // Centro: flores grandes (hasta 44 vmin) que forman la masa visual.
      // Periferia: flores algo menores (min ~18 vmin) que tapan los bordes.
      const tamBase = esMovil ? 26 : 38;
      const tam = (tamBase * (1 - t * 0.42) + Math.random() * 5 - 2.5).toFixed(1);

      // ── Temporización ──────────────────────────────────────────────────
      // Las flores del centro salen antes; las periféricas con retraso
      // progresivo para el efecto de «ola que se expande».
      const retraso  = Math.round(t * 1800 + Math.random() * 100); // 0 → 1900 ms
      const duracion = (1.4 + Math.random() * 0.55).toFixed(2);    // 1.4 → 1.95 s

      // ── Rotación en espiral ─────────────────────────────────────────────
      // Cada flor rota mientras viaja → efecto de remolino / espiral.
      const giroEspiral = (GIRO_ESPIRAL + Math.random() * 20 - 10).toFixed(1);

      // ── Giro propio de cada pétalo ──────────────────────────────────────
      const giroPropio  = (Math.random() * 80 - 40).toFixed(1);

      // ── Escala final (ligera variación orgánica) ─────────────────────────
      const escalaFinal = (0.88 + Math.random() * 0.3).toFixed(2);

      // ── Construir elemento ──────────────────────────────────────────────
      const img = document.createElement('img');
      img.className = `flor ${capaClase}`;
      img.alt = '';
      img.src = src;

      img.style.setProperty('--angulo-inicio',  `${anguloInicio.toFixed(1)}deg`);
      img.style.setProperty('--giro-espiral',   `${giroEspiral}deg`);
      img.style.setProperty('--giro-propio',    `${giroPropio}deg`);
      img.style.setProperty('--distancia',      `${distancia}vmax`);
      img.style.setProperty('--escala-final',   escalaFinal);
      img.style.setProperty('--retraso',        `${retraso}ms`);
      img.style.setProperty('--duracion',       `${duracion}s`);
      img.style.setProperty('--tam',            `${tam}vmin`);

      img.onerror = () => img.remove();
      capa.appendChild(img);
    }

    body.classList.replace('sobre', 'bloom');

    // El fundido comienza cuando la última flor (~t=1) ha terminado de salir.
    // retraso_max ≈ 1900 ms + duracion_max ≈ 1950 ms = ~3850 ms totales.
    // Añadimos 200 ms de margen para que la pantalla esté cubierta.
    setTimeout(fundirBloom, 4050);
  });
}

function fundirBloom() {
  const capa = $('#pantalla-bloom');
  if (!capa) return;
  capa.classList.add('fundir');
  body.classList.add('carta');
  setTimeout(() => {
    body.classList.remove('bloom');
    capa.remove();
    mostrarCarta();
  }, 1200);
}

function mostrarCarta() {
  if (typeof cargarYouTube === 'function') cargarYouTube();
}

// ---- YouTube ----
const ESPERA_YOUTUBE_MS = 8000;
const ESPERA_REPRODUCCION_MS = 4000;
let player = null;
let activa = -1;
let temporizadorYouTube = null;
let playerListo = false;
let pendiente = null;

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
  $('#playlist').classList.remove('sin-musica');
  player = new YT.Player('yt', {
    videoId: CONTENIDO.canciones[0].youtube,
    playerVars: { rel: 0, playsinline: 1 },
    events: {
      onReady: () => {
        playerListo = true;
        $('#estado').textContent = 'Toca una canción';
        if (pendiente !== null) { const i = pendiente; pendiente = null; elegir(i); }
      },
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
  if (!player || !playerListo) { pendiente = i; $('#estado').textContent = 'Cargando la música…'; return; }
  if (i === activa) {
    const sonando = player.getPlayerState() === YT.PlayerState.PLAYING;
    if (sonando) player.pauseVideo(); else player.playVideo();
    return;
  }
  activa = i;
  marcarActiva();
  player.loadVideoById(CONTENIDO.canciones[i].youtube);
  setTimeout(comprobarQueSuena, ESPERA_REPRODUCCION_MS);
}

// En iOS / WebView el play por postMessage puede ignorarse, y YouTube puede meter un anuncio
// antes (estado UNSTARTED durante varios segundos): si no arranca, se enseña el reproductor
// sin afirmar que falló; al llegar PLAYING el estado se corrige solo.
function comprobarQueSuena() {
  const estado = player.getPlayerState();
  const filaConError = document.querySelector('#playlist li.activa.error');
  const arranco = estado === YT.PlayerState.PLAYING || estado === YT.PlayerState.BUFFERING;
  if (arranco || estado === YT.PlayerState.PAUSED || filaConError) return;
  $('#estado').textContent = 'Cargando… si no suena, toca ▶ en el reproductor';
  abrirPanel(true);
}

function marcarActiva() {
  document.querySelectorAll('#playlist li').forEach((li, i) => {
    li.classList.toggle('activa', i === activa);
    li.classList.remove('error');
  });
}

function alCambiarEstado(evento) {
  if (evento.data === YT.PlayerState.PLAYING && activa === -1) { activa = 0; marcarActiva(); }
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

// ---- panel ----
function abrirPanel(abierto) {
  body.classList.toggle('panel-abierto', abierto);
  $('#panel').setAttribute('aria-hidden', String(!abierto));
}
$('#abrir-panel').addEventListener('click', () => abrirPanel(true));
$('#cerrar-panel').addEventListener('click', () => abrirPanel(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') abrirPanel(false); });

// ---- orla floral interactiva en la tarjeta (isBloomed) ----
let isBloomed = false;
let temporizadorRetraer = null;

function toggleBloomedTarjeta(e) {
  // Evitar toggle si se interactúa con canciones, botones o enlaces
  if (e.target.closest('button') || e.target.closest('a') || e.target.closest('#playlist')) {
    return;
  }

  const tarjeta = $('#tarjeta');
  const contenedor = $('#flores-tarjeta');
  if (!tarjeta || !contenedor) return;

  clearTimeout(temporizadorRetraer);
  animarPresion(tarjeta);

  isBloomed = !isBloomed;

  if (isBloomed) {
    contenedor.innerHTML = '';

    // Perímetro botánico en 3 capas alrededor de la tarjeta
    const puntos = [
      // Borde superior
      { x: '12%', y: '-22px', capa: 'capa-fondo', tipo: 'lavanda' },
      { x: '32%', y: '-32px', capa: 'capa-media', tipo: 'margaritas' },
      { x: '50%', y: '-38px', capa: 'capa-media', tipo: 'lirios' },
      { x: '68%', y: '-30px', capa: 'capa-media', tipo: 'gerberas' },
      { x: '88%', y: '-20px', capa: 'capa-fondo', tipo: 'salvia' },

      // Borde izquierdo
      { x: '-24px', y: '18%', capa: 'capa-fondo', tipo: 'salvia' },
      { x: '-34px', y: '38%', capa: 'capa-media', tipo: 'gerberas' },
      { x: '-28px', y: '58%', capa: 'capa-media', tipo: 'margaritas' },
      { x: '-26px', y: '78%', capa: 'capa-fondo', tipo: 'lavanda' },

      // Borde derecho
      { x: 'calc(100% - 32px)', y: '20%', capa: 'capa-fondo', tipo: 'lavanda' },
      { x: 'calc(100% - 22px)', y: '42%', capa: 'capa-media', tipo: 'lirios' },
      { x: 'calc(100% - 34px)', y: '64%', capa: 'capa-media', tipo: 'gerberas' },
      { x: 'calc(100% - 24px)', y: '84%', capa: 'capa-fondo', tipo: 'salvia' },

      // Esquinas con acentos en primer plano
      { x: '-16px', y: '-16px', capa: 'capa-frente', tipo: 'gerberas' },
      { x: 'calc(100% - 40px)', y: '-20px', capa: 'capa-frente', tipo: 'lirios' },
      { x: '-18px', y: 'calc(100% - 40px)', capa: 'capa-frente', tipo: 'margaritas' },
      { x: 'calc(100% - 40px)', y: 'calc(100% - 40px)', capa: 'capa-frente', tipo: 'gerberas' },

      // Borde inferior
      { x: '22%', y: 'calc(100% - 22px)', capa: 'capa-fondo', tipo: 'lavanda' },
      { x: '50%', y: 'calc(100% - 32px)', capa: 'capa-media', tipo: 'gerberas' },
      { x: '78%', y: 'calc(100% - 22px)', capa: 'capa-fondo', tipo: 'salvia' },
    ];

    puntos.forEach((p, idx) => {
      const img = document.createElement('img');
      img.className = `flor-tarjeta ${p.capa}`;
      img.alt = '';

      const lista = BOTANICA[p.tipo] || BOTANICA.gerberas;
      img.src = lista[Math.floor(Math.random() * lista.length)];

      const rotInicio = Math.round(Math.random() * 50 - 25);
      const rotFinal = Math.round(rotInicio + (Math.random() * 40 - 20));
      const escala = (0.82 + Math.random() * 0.32).toFixed(2);
      const retraso = Math.round(idx * 35 + Math.random() * 40);
      const duracion = (0.75 + Math.random() * 0.25).toFixed(2);

      const dx = (Math.random() * 14 - 7).toFixed(1);
      const dy = (Math.random() * 14 - 7).toFixed(1);

      img.style.left = p.x;
      img.style.top = p.y;
      img.style.setProperty('--x-origen', '0px');
      img.style.setProperty('--y-origen', '0px');
      img.style.setProperty('--x-dest', `${dx}px`);
      img.style.setProperty('--y-dest', `${dy}px`);
      img.style.setProperty('--rot-inicio', `${rotInicio}deg`);
      img.style.setProperty('--rot-final', `${rotFinal}deg`);
      img.style.setProperty('--escala', escala);
      img.style.setProperty('--retraso', `${retraso}ms`);
      img.style.setProperty('--duracion', `${duracion}s`);
      img.style.setProperty('--tam', p.capa === 'capa-fondo' ? '68px' : '82px');

      img.onerror = () => img.remove();
      contenedor.appendChild(img);
    });
  } else {
    // Retracción progresiva
    const flores = contenedor.querySelectorAll('.flor-tarjeta');
    flores.forEach((flor, idx) => {
      flor.style.setProperty('--retraso', `${idx * 22}ms`);
      flor.classList.add('retraer');
    });
    temporizadorRetraer = setTimeout(() => {
      contenedor.innerHTML = '';
    }, 550);
  }
}

pintarCarta();
$('#sobre').addEventListener('click', brotar);
const pantallaSobre = $('#pantalla-sobre');
if (pantallaSobre) {
  pantallaSobre.addEventListener('click', (e) => {
    brotar();
  });
}

const tarjeta = $('#tarjeta');
if (tarjeta) {
  tarjeta.addEventListener('click', toggleBloomedTarjeta);
}

// Precarga las flores mientras el sobre está en pantalla.
FLORES.forEach((src) => { new Image().src = src; });
