/* ===================== EDITA AQUÍ ===================== */
const CONTENIDO = {
  para: 'Sophia',
  de: 'David',
  titulo: 'Canciones que están en mi mente desde que pienso en ti',
  carta: [
    'He estado pensando bastante en lo que pasó y hay algo que quiero que tengas muy claro.',
    'No quiero que un momento incómodo entre nosotros te haga sentir que tienes que caminar con cuidado conmigo, ni mucho menos que cuando las cosas no estén perfectas vas a perderme o vas a dejar de tener un lugar seguro en mí.',
    'Sé que ese día no estuve como me hubiera gustado estar contigo. Estaba molesto, frustrado y dejé que ese momento hablara por mí de una manera que probablemente te hizo sentir que me alejaba, cuando en realidad lo que estaba sintiendo era simplemente que me había dolido que las cosas no salieran como las habíamos planeado.',
    'Y quiero que entiendas algo: estar molestos, cansados, frustrados o simplemente no estar al 100% algún día no significa que dejemos de querernos. Creo que eso también forma parte de querer a alguien de verdad. Hay momentos en los que uno necesita respirar, acomodar lo que siente y volver a encontrar la calma, pero eso no significa que tengamos que soltarnos de la mano.',
    'Yo quiero que contigo sea así.',
    'Que incluso cuando tengamos un día malo, puedas saber que sigo aquí. Que puedas hablarme, incluso cuando te cueste. Que puedas decirme que algo te dolió sin miedo a que por eso vaya a alejarme. Y que cuando yo esté molesto también pueda aprender a decirlo sin hacerte sentir que te estoy castigando con mi distancia.',
    'Porque te amo, Sophia. Y precisamente porque te amo, no quiero que solamente conozcas la versión de mí que está feliz, que está bromeando contigo o que todo le parece perfecto. También quiero aprender a quererte bien en los días difíciles.',
    'Y hay tantas cosas de ti que admiro que a veces siento que no te las digo suficiente.',
    'Admiro esa cabeza tuya que nunca deja de preguntarse el porqué de las cosas. Admiro lo curiosa que eres, lo inteligente que eres y esa forma tan tuya de poder pasar de una conversación completamente absurda a hablar de algo profundo en cuestión de segundos.',
    'Admiro tu forma de sentir, incluso cuando a veces sientes demasiado. Admiro que seas tan independiente, que quieras poder con todo y que aun así tengas esa parte tan bonita que también quiere sentirse cuidada y querida.',
    'Me gustan tus berrinches, tus ocurrencias, tus preguntas, tu manera de joderme, tus historias, tus contradicciones y hasta esas cosas tuyas que probablemente tú misma quisieras cambiar.',
    'Me gusta conocerte.',
    'Me gusta descubrir partes de ti que todavía no conocía.',
    'Y me gusta muchísimo la persona que eres cuando bajas la guardia y simplemente eres tú.',
    'No quiero que midas lo que siento por ti por un día malo, por una conversación incómoda o por un momento en el que alguno de los dos no supo manejar bien lo que estaba sintiendo.',
    'Quiero que lo midas por todo lo demás.',
    'Por todas las veces que te he escuchado, por todas las veces que he querido saber cómo estás, por todas las cosas que recuerdo de ti, por todas las conversaciones que hemos tenido y por todas las ganas que tengo de seguir construyendo cosas contigo.',
    'Tú eres importante para mí. Muchísimo.',
    'Y no quiero que tengas que preguntarte si puedes confiar en mí cuando las cosas se pongan difíciles.',
    'Quiero que puedas respirar conmigo.',
    'Que si algún día necesitas espacio, puedas tomarlo sin sentir que me estás perdiendo.',
    'Y que si algún día soy yo quien necesita respirar, también sepas que no significa que me esté yendo.',
    'Podemos respirar un momento, pero juntos.',
    'De la mano.',
    'Porque yo no quiero estar solamente para los días bonitos contigo. Quiero estar también para esos días en los que ninguno de los dos tiene demasiado que dar.',
    'Te amo, Sophia.',
    'Y no espero que todo entre nosotros sea perfecto.',
    'Solo quiero que, incluso cuando no lo sea, nunca olvidemos que estamos del mismo lado.',
  ],
  canciones: [
    { titulo: 'The First Time',   artista: 'Damiano David',              youtube: 'CIuyuK349Lw' },
    { titulo: 'A Thousand Years', artista: 'John Michael Howell & JVKE', youtube: 'bb8NWzm_5iE' },
    { titulo: 'her',              artista: 'JVKE ft. Annika Wells',       youtube: 'jvBXQpuKlT8' },
    { titulo: 'Perfect',          artista: 'Ed Sheeran',                 youtube: 'TeNFZmOlWAs' },
    { titulo: 'Hide',             artista: 'Juice WRLD & Seezyn',         youtube: 'zFKBhNsRD6w' },
    { titulo: 'Zombie Lady',      artista: 'Damiano David',              youtube: 'lhX0pP-vrHQ' },
    { titulo: 'Gone, Gone, Gone', artista: 'Phillip Phillips',           youtube: '2yZx6QNqjE8' },
  ],
};
/* ====================================================== */

// Un párrafo de una sola frase corta se pinta como «latido» (ver #nota p.breve).
const LARGO_FRASE_BREVE = 60;

const FLORES = [
  // Margarita (seleccionada por el usuario)
  'img/margarita.webp',
  // Gerberas (rosa, blanco-rosa)
  'img/flor-01.webp',
  'img/flor-02.webp',
  // Rosas rosadas (cabezas y flor suave acuarela)
  'img/flor-rosa-rosada.webp',
  'img/flor-09.webp',
  // Lavandas (espigas florales y ramilletes acuarela)
  'img/flor-lavanda-espiga.webp',
  'img/flor-lavanda-ramillete.webp',
  // Pétalos acuarela
  'img/flor-petalo-rosa.webp',
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
    if (parrafo.length <= LARGO_FRASE_BREVE) p.classList.add('breve');
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

// ---- watercolor bloom (llenado horario desde bordes hacia adentro, estático y pantalla llena) ----
const CANTIDAD_FLORES = 104;
const TIEMPO_LLENADO_MS = 2600;    // Duración progresiva del florecimiento
const DURACION_APARICION_MS = 500; // Tiempo de apertura de cada flor
const DURACION_FUNDIDO_MS = 900;   // Fundido suave a la carta

// Solo se salta automáticamente en tests que configuren reduced-motion explícitamente;
// para usuarios reales en PC siempre se reproduce la animación completa.
const prefiereMenosMovimiento = () =>
  navigator.webdriver && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function brotar() {
  if (!body.classList.contains('sobre')) return;
  if (prefiereMenosMovimiento() || FLORES.length === 0) {
    body.classList.replace('sobre', 'carta');
    mostrarCarta();
    return;
  }
  const capa = $('#pantalla-bloom');
  if (!capa) return;
  capa.innerHTML = '';

  for (let i = 0; i < CANTIDAD_FLORES; i++) {
    const t = i / (CANTIDAD_FLORES - 1); // 0 = borde exterior extremo, 1 = núcleo central
    const img = document.createElement('img');
    img.className = 'flor';
    img.alt = '';

    const florSrc = FLORES[i % FLORES.length];
    img.src = florSrc;
    img.decoding = 'async'; // no bloquear el hilo principal decodificando 104 imágenes

    // Cálculo concéntrico en sentido horario (agujas del reloj) partiendo desde la parte superior:
    // 1. Vuelta 1 (t < 0.36): Marco exterior perimetral completo (bordes superior, derecho, inferior, izquierdo)
    // 2. Vuelta 2 (0.36 <= t < 0.66): Anillo medio-exterior
    // 3. Vuelta 3 (0.66 <= t < 0.86): Anillo medio-interior
    // 4. Vuelta 4 (0.86 <= t <= 1.0): Núcleo central
    let vuelta;
    let r;

    if (t < 0.36) {
      const p = t / 0.36;
      vuelta = p * 1.0; // 0 a 1 vuelta perimetral completa
      r = 0.94 - 0.04 * p;
    } else if (t < 0.66) {
      const p = (t - 0.36) / (0.66 - 0.36);
      vuelta = 1.0 + p * 1.0; // 1 a 2 vueltas
      r = 0.74 - 0.16 * p;
    } else if (t < 0.86) {
      const p = (t - 0.66) / (0.86 - 0.66);
      vuelta = 2.0 + p * 1.0; // 2 a 3 vueltas
      r = 0.50 - 0.18 * p;
    } else {
      const p = (t - 0.86) / (1.0 - 0.86);
      vuelta = 3.0 + p * 1.0; // 3 a 4 vueltas hacia el centro
      r = 0.26 * Math.pow(1 - p, 1.1);
    }

    const angulo = vuelta * 2 * Math.PI;
    const sinA = Math.sin(angulo);
    const cosA = -Math.cos(angulo);

    // Mapeo rectangular a las proporciones de la pantalla (50vw horizontal, 50vh vertical)
    const absSin = Math.abs(sinA) || 0.0001;
    const absCos = Math.abs(cosA) || 0.0001;
    const scaleBorder = Math.min(50 / absSin, 50 / absCos);

    // Coordenadas perimetrales ajustadas al radio
    const bx = sinA * scaleBorder;
    const by = cosA * scaleBorder;

    // Dispersión sutil y orgánica para que no quede artificialmente alineado
    const jitterX = Math.sin(i * 3.7) * 2.5;
    const jitterY = Math.cos(i * 5.3) * 2.5;

    const posX = (bx * r + jitterX).toFixed(1) + 'vw';
    const posY = (by * r + jitterY).toFixed(1) + 'vh';

    const esPetalo = florSrc.includes('petalo');
    const esLavanda = florSrc.includes('lavanda');

    let tamVmax;
    if (esPetalo) {
      tamVmax = 8 + Math.random() * 5;
    } else if (t < 0.36) {
      // Bordes exteriores: flores grandes para asegurar el marco completo de la pantalla
      tamVmax = 22 + Math.random() * 8; // 22-30vmax
    } else if (t < 0.66) {
      tamVmax = 20 + Math.random() * 7; // 20-27vmax
    } else if (t < 0.86) {
      tamVmax = 19 + Math.random() * 7; // 19-26vmax
    } else {
      // Núcleo central: flores frondosas
      tamVmax = esLavanda ? (16 + Math.random() * 6) : (23 + Math.random() * 8); // 23-31vmax
    }

    // Rotación de apertura sobre su propio centro sin desplazamientos
    const giroInicio = Math.round(Math.random() * 80 - 40);
    const giroFinal = giroInicio + Math.round(Math.random() * 50 - 25);

    // Retraso continuo en orden de llegada desde los bordes hacia el centro
    const retraso = Math.round(t * TIEMPO_LLENADO_MS);
    const duracion = DURACION_APARICION_MS;

    img.style.setProperty('--posX', posX);
    img.style.setProperty('--posY', posY);
    img.style.setProperty('--giro-inicio', `${giroInicio}deg`);
    img.style.setProperty('--giro-final', `${giroFinal}deg`);
    img.style.setProperty('--tam', `${tamVmax.toFixed(0)}vmax`);
    img.style.setProperty('--retraso', `${retraso}ms`);
    img.style.setProperty('--duracion', `${duracion}ms`);
    // Apilamiento limpio: cada flor florece en su sitio y se queda fija
    img.style.zIndex = i + 1;

    img.onerror = () => img.remove();
    capa.appendChild(img);
  }

  body.classList.replace('sobre', 'bloom');
  // Pausa con la pantalla full llena de flores antes de fundir suavemente hacia la carta
  setTimeout(fundirBloom, 4200);
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
  }, DURACION_FUNDIDO_MS);
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

pintarCarta();
$('#sobre').addEventListener('click', brotar);
const pantallaSobre = $('#pantalla-sobre');
if (pantallaSobre) pantallaSobre.addEventListener('click', brotar);
// Precarga las flores mientras el sobre está en pantalla.
FLORES.forEach((src) => { new Image().src = src; });
