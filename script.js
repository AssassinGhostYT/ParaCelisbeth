/* ============================================================
   Para Celisbeth — atardecer, osito y jardín
   por Jose ♡
   ============================================================ */

/* ---------- 1. CIELO: NUBES Y LUCIÉRNAGAS ---------- */
(function crearNubes() {
  const cont = document.getElementById('nubes');
  for (let i = 0; i < 7; i++) {
    const n = document.createElement('div');
    n.className = 'nube';
    const w = 90 + Math.random() * 160;
    n.style.width = `${w}px`;
    n.style.height = `${w * 0.34}px`;
    n.style.top = `${5 + Math.random() * 45}%`;
    n.style.animationDuration = `${40 + Math.random() * 50}s`;
    n.style.animationDelay = `${-Math.random() * 60}s`;
    n.style.opacity = `${0.2 + Math.random() * 0.3}`;
    cont.appendChild(n);
  }
})();

(function crearMariposas() {
  const cont = document.getElementById('mariposas');
  for (let i = 0; i < 6; i++) {
    const m = document.createElement('span');
    m.className = 'mariposa';
    m.textContent = '🦋';
    m.style.top = `${8 + Math.random() * 52}%`;
    m.style.fontSize = `${14 + Math.random() * 14}px`;
    m.style.animationDuration = `${16 + Math.random() * 18}s`;
    m.style.animationDelay = `${-Math.random() * 22}s`;
    cont.appendChild(m);
  }
})();

(function crearPetalos() {
  const cont = document.getElementById('petalos-caen');
  const simb = ['🌸', '🌷', '💮', '🌺'];
  setInterval(() => {
    const p = document.createElement('span');
    p.className = 'petalo-cae';
    p.textContent = simb[Math.floor(Math.random() * simb.length)];
    p.style.left = `${Math.random() * 100}%`;
    p.style.fontSize = `${12 + Math.random() * 14}px`;
    p.style.animationDuration = `${7 + Math.random() * 7}s`;
    cont.appendChild(p);
    setTimeout(() => p.remove(), 15000);
  }, 950);
})();

const lc = document.getElementById('luciernagas');
const lctx = lc.getContext('2d');
let luci = [];
let LW, LH;
let intensidadLuci = 0.35;

function ajustarLuces() {
  LW = lc.width = window.innerWidth;
  LH = lc.height = window.innerHeight;
  luci = [];
  const cantidad = Math.min(90, Math.floor((LW * LH) / 16000));
  for (let i = 0; i < cantidad; i++) {
    luci.push({
      x: Math.random() * LW,
      y: Math.random() * LH,
      r: Math.random() * 1.8 + 0.6,
      fase: Math.random() * Math.PI * 2,
      vel: 0.2 + Math.random() * 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
    });
  }
}

function dibujarLuces(t) {
  lctx.clearRect(0, 0, LW, LH);
  for (const l of luci) {
    const brillo = (0.3 + 0.7 * Math.abs(Math.sin(l.fase))) * intensidadLuci;
    l.x += l.dx;
    l.y += l.dy;
    if (l.x < 0) l.x = LW;
    if (l.x > LW) l.x = 0;
    if (l.y < 0) l.y = LH;
    if (l.y > LH) l.y = 0;
    l.fase += 0.02 * l.vel;
    lctx.beginPath();
    lctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
    lctx.fillStyle = `rgba(255, 240, 160, ${brillo})`;
    lctx.shadowBlur = 12;
    lctx.shadowColor = `rgba(255, 230, 150, ${brillo})`;
    lctx.fill();
  }
  lctx.shadowBlur = 0;
  requestAnimationFrame(dibujarLuces);
}
window.addEventListener('resize', ajustarLuces);
ajustarLuces();
requestAnimationFrame(dibujarLuces);

/* ---------- 2. NAVEGACIÓN ---------- */
function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach((p) => p.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- 3. EL OSITO ---------- */
const osito = document.getElementById('osito');
const globito = document.getElementById('globito');
let globitoTimer = null;

function hablar(texto, ms = 2600) {
  globito.textContent = texto;
  globito.classList.add('visible');
  clearTimeout(globitoTimer);
  globitoTimer = setTimeout(() => globito.classList.remove('visible'), ms);
}

function saltar() {
  osito.classList.remove('salta');
  void osito.offsetWidth;
  osito.classList.add('salta');
}

osito.addEventListener('click', () => {
  saltar();
  const frases = ['¡Hola! 👋', 'jeje 🧸', 'te quiero decir algo...', '¡qué bonito todo!', '¿ya viste las flores?'];
  hablar(frases[Math.floor(Math.random() * frases.length)]);
  osito.classList.add('saludando');
  setTimeout(() => osito.classList.remove('saludando'), 2100);
});

setTimeout(() => hablar('¡Holaaa! 🧸', 3200), 1200);

/* ---------- 4. MÚSICA: la canción (reproductor de YouTube) ---------- */
const VIDEO_ID = 'nq3EaPNI8Cg';
const btnMusica = document.getElementById('btn-musica');
const textoMusica = document.getElementById('texto-musica');

let reproductor = null;
let playerListo = false;
let musicaSonando = false;
let quiereSonar = false;

function actualizarBotonMusica() {
  if (musicaSonando) {
    btnMusica.classList.add('sonando');
    textoMusica.textContent = 'Pausar música';
  } else {
    btnMusica.classList.remove('sonando');
    textoMusica.textContent = 'Dale click a la música';
  }
}

function reproducir() {
  quiereSonar = true;
  if (playerListo && reproductor && reproductor.playVideo) reproductor.playVideo();
}

function pausarMusica() {
  quiereSonar = false;
  if (playerListo && reproductor && reproductor.pauseVideo) reproductor.pauseVideo();
}

window.onYouTubeIframeAPIReady = function () {
  reproductor = new YT.Player('yt-player', {
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      loop: 1,
      playlist: VIDEO_ID,
      playsinline: 1,
      modestbranding: 1,
      rel: 0,
    },
    events: {
      onReady: () => {
        playerListo = true;
        actualizarBotonMusica();
        if (quiereSonar) reproductor.playVideo();
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) musicaSonando = true;
        else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) musicaSonando = false;
        actualizarBotonMusica();
      },
    },
  });
};

btnMusica.addEventListener('click', () => {
  if (musicaSonando) pausarMusica();
  else reproducir();
});

actualizarBotonMusica();

/* ---------- 5. INTRO ---------- */
document.getElementById('btn-empezar').addEventListener('click', () => {
  reproducir();
  mostrarPantalla('p-jardin');
  setTimeout(() => {
    osito.classList.add('saludando');
    hablar('Siembra una flor por cada cosa que me gusta de ti 🌱', 3600);
    setTimeout(() => osito.classList.remove('saludando'), 2100);
  }, 500);
});

/* ---------- 6. LA SIEMBRA ---------- */
const motivos = [
  'Porque tu nombre me aparece en la cabeza sin pedir permiso. 🌸',
  'Porque contigo hasta lo más normal se siente distinto. 🌼',
  'Porque quiero ser ese ratito de tu día que te saque una sonrisa. 🌻',
  'Porque me dan ganas de contarte todo, hasta lo más pequeño. 💛',
  'Porque me gusta la forma en que existes, sin más. ✨',
  'Porque te pienso más de lo que quiero admitir. 🙈',
];
const coloresFlor = ['#ff9e6d', '#ff7aa2', '#c77dff', '#ffd166', '#ff8fab', '#9be3a0'];

const macetero = document.getElementById('macetero');
let floresPlantadas = 0;

motivos.forEach((motivo, idx) => {
  const semilla = document.createElement('div');
  semilla.className = 'semilla';

  const color = coloresFlor[idx % coloresFlor.length];
  let petalos = '';
  for (let p = 0; p < 6; p++) {
    const ang = (360 / 6) * p;
    petalos += `<div class="petalo" style="--c:${color}; transform: translate(-50%, -100%) rotate(${ang}deg);"></div>`;
  }

  semilla.innerHTML = `
    <div class="tierra"></div>
    <div class="monticulo"></div>
    <div class="brote"></div>
    <div class="tallo"></div>
    <div class="flor">${petalos}<div class="centro"></div></div>`;

  semilla.addEventListener('click', (e) => {
    if (semilla.classList.contains('abierta')) return;
    semilla.classList.add('abierta');
    floresPlantadas++;
    saltar();
    mostrarMensaje(e.currentTarget, motivo);
    document.getElementById('pista-flores').textContent = `${floresPlantadas} de 6 flores`;
    if (floresPlantadas >= motivos.length) {
      const b = document.getElementById('btn-corazon-jardin');
      b.disabled = false;
      hablar('¡Mira todo lo que creciste! 🌸', 3000);
    }
  });

  macetero.appendChild(semilla);
});

let mensajeActual = null;
function mostrarMensaje(el, texto) {
  if (mensajeActual) mensajeActual.remove();
  const m = document.createElement('div');
  m.className = 'mensaje';
  m.textContent = texto;
  document.body.appendChild(m);
  const r = el.getBoundingClientRect();
  const ancho = 250;
  let left = r.left + r.width / 2 - ancho / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - ancho - 12));
  m.style.left = `${left}px`;
  m.style.width = `${ancho}px`;
  m.style.top = `${Math.max(12, r.top - 84)}px`;
  mensajeActual = m;
  clearTimeout(m._t);
  m._t = setTimeout(() => {
    m.style.transition = 'opacity .5s';
    m.style.opacity = '0';
    setTimeout(() => m.remove(), 500);
    if (mensajeActual === m) mensajeActual = null;
  }, 4200);
}

/* ---------- 7. CORAZÓN DE FLORES ---------- */
function puntoCorazon(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x, y };
}

function construirCorazonFlores() {
  const cont = document.getElementById('corazon-flores');
  cont.innerHTML = '';

  const W = cont.clientWidth || 480;
  const H = cont.clientHeight || 440;
  const N = 56;
  const pts = [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const p = puntoCorazon(t);
    pts.push(p);
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }

  const pad = 26;
  pts.forEach((p, i) => {
    const nx = (p.x - minX) / (maxX - minX);
    const ny = (p.y - minY) / (maxY - minY);
    const px = pad + nx * (W - pad * 2);
    const py = pad + (1 - ny) * (H - pad * 2);

    const color = coloresFlor[i % coloresFlor.length];
    const fl = document.createElement('div');
    fl.className = 'flor-corazon';
    fl.style.left = `${px}px`;
    fl.style.top = `${py}px`;
    fl.style.animationDelay = `${i * 0.03}s`;

    let pc = '';
    for (let k = 0; k < 5; k++) {
      const ang = (360 / 5) * k;
      pc += `<div class="pc" style="--c:${color}; transform: translate(-50%, -100%) rotate(${ang}deg);"></div>`;
    }
    fl.innerHTML = `${pc}<div class="cc"></div>`;
    cont.appendChild(fl);
  });

  // el osito late con el corazón
  hablar('este corazón es por ti 💗', 3600);
}

document.getElementById('btn-corazon-jardin').addEventListener('click', () => {
  mostrarPantalla('p-corazon');
  requestAnimationFrame(() => construirCorazonFlores());
});

window.addEventListener('resize', () => {
  if (document.getElementById('p-corazon').classList.contains('activa')) construirCorazonFlores();
});

/* ---------- 8. HACIA LA PREGUNTA ---------- */
document.getElementById('btn-final').addEventListener('click', () => {
  mostrarPantalla('p-pregunta');
  hablar('por favor di que sí... 🥺', 3400);
});

/* ---------- 8b. LA PREGUNTA (el "No" huye) ---------- */
const btnNo = document.getElementById('btn-no');
const btnSi = document.getElementById('btn-si');
const respPregunta = document.getElementById('respuesta-pregunta');
let huirPasos = 0;

function huir() {
  huirPasos++;
  const maxX = Math.min(100, window.innerWidth * 0.2);
  const x = (Math.random() - 0.5) * maxX * 2;
  const y = (Math.random() - 0.5) * 70;
  const esc = Math.max(0.55, 1 - huirPasos * 0.1);
  btnNo.style.transform = `translate(${x}px, ${y}px) scale(${esc})`;
  const frases = ['¿segura? 🥺', '¡uy, se movió!', 'el osito se puso triste', 'dale al "Sí" mejor 🙈', '¡no me atrapas!', 'piénsalo bien...', 'insisto: mejor sí 💗'];
  respPregunta.textContent = frases[huirPasos % frases.length];
}

btnNo.addEventListener('pointerenter', huir);
btnNo.addEventListener('click', (e) => { e.preventDefault(); huir(); });

btnSi.addEventListener('click', () => {
  respPregunta.textContent = '¡sabía que dirías sí! 🥰';
  explosionDesde(btnSi);
  saltar();
  setTimeout(() => {
    mostrarPantalla('p-final');
    iniciarLluvia();
    hablar('te dije que dirías sí 😌🧸', 3400);
  }, 750);
});

const lluviaCont = document.getElementById('lluvia');
let lluviaActiva = false;
function iniciarLluvia() {
  if (lluviaActiva) return;
  lluviaActiva = true;
  const simbolos = ['♡', '♥', '🌸', '🌹', '✿', '❤'];
  setInterval(() => {
    const c = document.createElement('span');
    c.className = 'cae';
    c.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    c.style.left = `${Math.random() * 100}%`;
    c.style.fontSize = `${16 + Math.random() * 26}px`;
    c.style.animationDuration = `${5 + Math.random() * 6}s`;
    lluviaCont.appendChild(c);
    setTimeout(() => c.remove(), 12000);
  }, 300);
}

const finalCaja = document.getElementById('final-caja');
const cartaFinal = document.getElementById('carta-final');
document.getElementById('btn-cerrar').addEventListener('click', () => {
  if (cartaFinal.classList.contains('cerrando')) return;
  cartaFinal.classList.add('cerrando');
  saltar();
  explosionDesde(osito);
  setTimeout(() => {
    cartaFinal.style.display = 'none';
    finalCaja.classList.add('mostrando');
    finalCaja.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1150);
});

/* ---------- 9. EXPLOSIÓN DE CORAZONES ---------- */
function explosionDesde(origen) {
  const r = origen ? origen.getBoundingClientRect() : null;
  const cx = r ? r.left + r.width / 2 : window.innerWidth / 2;
  const cy = r ? r.top + r.height / 2 : window.innerHeight / 2;
  const simbolos = ['♡', '♥', '✦', '❀', '✿', '🌸'];
  const maxDim = Math.max(window.innerWidth, window.innerHeight);

  for (let i = 0; i < 80; i++) {
    const p = document.createElement('span');
    p.className = 'particula';
    p.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    const ang = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * maxDim * 0.6;
    p.style.setProperty('--tx', `${Math.cos(ang) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(ang) * dist}px`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    p.style.color = config_colores();
    p.style.fontSize = `${14 + Math.random() * 26}px`;
    p.style.animationDuration = `${0.9 + Math.random() * 0.9}s`;
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2200);
  }
}

function config_colores() {
  const c = ['#ff8fb1', '#ffb703', '#c77dff', '#ffd166', '#f4845f'];
  return c[Math.floor(Math.random() * c.length)];
}

/* ---------- 10. LA GALAXIA FINAL (ella toca y se abre el universo) ---------- */
const galaxia = document.getElementById('galaxia');
const galaxiaCanvas = document.getElementById('galaxia-canvas');
let gctx = null;
let galaxiaActiva = false;
let galaxiaStars = [];
let galaxiaRAF = null;
let galaxiaW = 0, galaxiaH = 0;

function medirGalaxia() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  galaxiaW = window.innerWidth;
  galaxiaH = window.innerHeight;
  galaxiaCanvas.width = Math.floor(galaxiaW * dpr);
  galaxiaCanvas.height = Math.floor(galaxiaH * dpr);
  gctx = galaxiaCanvas.getContext('2d');
  gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function crearGalaxiaEstrellas() {
  galaxiaStars = [];
  const mx = Math.min(galaxiaW, galaxiaH) * 0.46;
  const brazos = 4;
  const total = 980;
  for (let i = 0; i < total; i++) {
    const disperso = i % 5 === 0;
    const t = Math.pow(Math.random(), 0.62);
    const radio = 6 + t * mx;
    const brazo = i % brazos;
    const angulo = disperso
      ? Math.random() * Math.PI * 2
      : brazo * (Math.PI * 2 / brazos) + t * 3.2 + (Math.random() - 0.5) * 0.85;
    const velocidad = 0.0014 + 0.0032 / (radio / 45 + 1);
    galaxiaStars.push({
      radio, angulo, velocidad,
      tam: 0.5 + Math.random() * 1.7,
      brillo: (disperso ? 0.25 : 0.4) + Math.random() * 0.6,
      fase: Math.random() * Math.PI * 2,
    });
  }
}

function colorGalaxia(r) {
  const mx = Math.min(galaxiaW, galaxiaH) * 0.46;
  const t = Math.min(1, r / mx);
  const a = [255, 226, 170];
  const b = [150, 120, 255];
  const c = [120, 190, 255];
  let from, to, k;
  if (t < 0.5) { from = a; to = b; k = t / 0.5; }
  else { from = b; to = c; k = (t - 0.5) / 0.5; }
  const out = from.map((v, i) => (v + (to[i] - v) * k) | 0);
  return `rgb(${out[0]}, ${out[1]}, ${out[2]})`;
}

function animarGalaxia() {
  if (!gctx) return;
  const w = galaxiaW, h = galaxiaH;
  const radioNucleo = Math.min(w, h) * 0.22;
  gctx.clearRect(0, 0, w, h);
  gctx.save();
  gctx.translate(w / 2, h / 2);

  const nucleo = gctx.createRadialGradient(0, 0, 0, 0, 0, radioNucleo);
  nucleo.addColorStop(0, 'rgba(255, 241, 214, .85)');
  nucleo.addColorStop(0.35, 'rgba(255, 200, 150, .33)');
  nucleo.addColorStop(1, 'rgba(255, 180, 140, 0)');
  gctx.fillStyle = nucleo;
  gctx.beginPath();
  gctx.arc(0, 0, radioNucleo, 0, Math.PI * 2);
  gctx.fill();

  const inclina = 1;
  for (const s of galaxiaStars) {
    s.angulo += s.velocidad;
    const x = Math.cos(s.angulo) * s.radio;
    const y = Math.sin(s.angulo) * s.radio * inclina;
    const parpadeo = 0.55 + 0.45 * Math.sin(s.fase + s.angulo * 1.3);
    gctx.globalAlpha = s.brillo * parpadeo;
    gctx.fillStyle = colorGalaxia(s.radio);
    gctx.beginPath();
    gctx.arc(x, y, s.tam, 0, Math.PI * 2);
    gctx.fill();
  }
  gctx.globalAlpha = 1;
  gctx.restore();

  galaxiaRAF = requestAnimationFrame(animarGalaxia);
}

function mostrarFraseGalaxia(texto, alTerminar) {
  const el = document.getElementById('galaxia-palabra');
  el.textContent = '';
  el.classList.add('visible');
  let k = 0;
  const paso = () => {
    if (k <= texto.length) {
      el.textContent = texto.slice(0, k);
      k++;
      setTimeout(paso, 55);
    } else {
      setTimeout(() => {
        el.classList.remove('visible');
        setTimeout(alTerminar, 520);
      }, 950);
    }
  };
  setTimeout(paso, 260);
}

function secuenciaGalaxia() {
  const frases = [
    'me gustas ✨',
    'te extraño 🌙',
    'pienso en ti 💫',
    'me haces sonreír 🙈',
    'quiero estar contigo 🌻',
  ];
  let i = 0;
  const siguiente = () => {
    if (i >= frases.length) { iniciarEstrellasGalaxia(); return; }
    mostrarFraseGalaxia(frases[i], () => { i++; siguiente(); });
  };
  setTimeout(siguiente, 1500);
}

function iniciarEstrellasGalaxia() {
  const cont = document.getElementById('estrellas-caen');
  const baja = document.getElementById('galaxia-baja');
  baja.classList.add('visible');
  const simb = ['✦', '✧', '★', '⭐', '✨', '⋆'];
  let n = 0;
  const id = setInterval(() => {
    for (let k = 0; k < 3; k++) {
      const s = document.createElement('span');
      s.className = 'estrella-cae';
      s.textContent = simb[Math.floor(Math.random() * simb.length)];
      s.style.left = `${Math.random() * 100}%`;
      s.style.fontSize = `${12 + Math.random() * 24}px`;
      s.style.animationDuration = `${3 + Math.random() * 4}s`;
      s.style.animationDelay = `${Math.random() * 0.8}s`;
      cont.appendChild(s);
      setTimeout(() => s.remove(), 8000);
    }
    n++;
    if (n >= 24) {
      clearInterval(id);
      setTimeout(mostrarFinalGalaxia, 1500);
    }
  }, 260);
}

function mostrarFinalGalaxia() {
  document.getElementById('galaxia-baja').classList.remove('visible');
  document.getElementById('galaxia-final').classList.add('visible');
  setTimeout(() => document.getElementById('btn-besos').classList.add('visible'), 2400);
}

function lluviaDeBesos() {
  const cont = document.getElementById('besos');
  const simb = ['💋', '😘', '😚', '💗', '❤️', '💕', '🥰'];
  let n = 0;
  const id = setInterval(() => {
    for (let k = 0; k < 4; k++) {
      const b = document.createElement('span');
      b.className = 'beso';
      b.textContent = simb[Math.floor(Math.random() * simb.length)];
      b.style.left = `${Math.random() * 100}%`;
      b.style.fontSize = `${18 + Math.random() * 30}px`;
      b.style.animationDuration = `${3 + Math.random() * 3}s`;
      b.style.animationDelay = `${Math.random() * 0.6}s`;
      b.style.setProperty('--rot', `${(Math.random() - 0.5) * 40}deg`);
      cont.appendChild(b);
      setTimeout(() => b.remove(), 7000);
    }
    n++;
    if (n >= 18) clearInterval(id);
  }, 240);
}

document.getElementById('btn-besos').addEventListener('click', () => {
  document.getElementById('btn-besos').classList.add('clickeado');
  document.getElementById('galaxia-final').classList.remove('visible');
  document.getElementById('galaxia-gracias').classList.add('visible');
  lluviaDeBesos();
});

function abrirGalaxia() {
  if (galaxiaActiva) return;
  galaxiaActiva = true;
  galaxia.classList.add('activa');
  document.body.classList.add('sin-scroll');
  medirGalaxia();
  crearGalaxiaEstrellas();
  animarGalaxia();
  document.getElementById('cielo').classList.add('noche');
  intensidadLuci = 1;
  saltar();
  setTimeout(() => document.getElementById('galaxia-corazon').classList.add('visible'), 700);
  setTimeout(secuenciaGalaxia, 900);
}

document.getElementById('btn-galaxia').addEventListener('click', abrirGalaxia);

window.addEventListener('resize', () => {
  if (galaxiaActiva) { medirGalaxia(); crearGalaxiaEstrellas(); }
});

/* ---------- 11. DESTELLOS DEL CURSOR ---------- */
let ultimoDestello = 0;
document.addEventListener('pointermove', (e) => {
  const ahora = Date.now();
  if (ahora - ultimoDestello < 80) return;
  ultimoDestello = ahora;
  const d = document.createElement('span');
  d.textContent = Math.random() > 0.5 ? '✦' : '·';
  d.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:999;font-size:13px;color:#ffe0a3;`;
  d.animate(
    [{ opacity: 0.9, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(-22px) scale(.2)' }],
    { duration: 850, easing: 'ease-out' }
  ).onfinish = () => d.remove();
  document.body.appendChild(d);
});
