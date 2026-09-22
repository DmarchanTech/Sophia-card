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
  'img/flor-01.png', 'img/flor-02.png', 'img/flor-03.png', 'img/flor-04.png',
  'img/flor-05.png', 'img/flor-06.png', 'img/flor-07.png', 'img/flor-08.png',
  'img/flor-09.png', 'img/flor-10.png', 'img/flor-11.png',
];

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
}

function marcarActiva() {
  document.querySelectorAll('#playlist li').forEach((li, i) => {
    li.classList.toggle('activa', i === activa);
    li.classList.remove('error');
  });
}

function alCambiarEstado(evento) {
  if (activa === -1) { activa = 0; marcarActiva(); }
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

pintarCarta();
$('#sobre').addEventListener('click', brotar);
