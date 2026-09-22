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
