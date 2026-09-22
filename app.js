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

// ---- YouTube (tarea 5) ----
function elegir() {}

// ---- panel (tarea 6) ----

pintarCarta();
$('#sobre').addEventListener('click', brotar);
