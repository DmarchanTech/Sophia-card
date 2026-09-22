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
  if (!body.classList.contains('sobre')) return;
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

// ---- YouTube ----
const ESPERA_YOUTUBE_MS = 8000;
const ESPERA_REPRODUCCION_MS = 2500;
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

// En iOS / WebView el play por postMessage puede ignorarse: si no arranca, se pide el toque en el reproductor.
function comprobarQueSuena() {
  const estado = player.getPlayerState();
  const filaConError = document.querySelector('#playlist li.activa.error');
  const arranco = estado === YT.PlayerState.PLAYING || estado === YT.PlayerState.BUFFERING;
  if (arranco || estado === YT.PlayerState.PAUSED || filaConError) return;
  $('#estado').textContent = 'Toca ▶ en el reproductor';
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

pintarCarta();
$('#sobre').addEventListener('click', brotar);
// Precarga las flores mientras el sobre está en pantalla.
FLORES.forEach((src) => { new Image().src = src; });
