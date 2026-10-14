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

/* ---------- 4. MÚSICA (melodía suave generada) ---------- */
const btnMusica = document.getElementById('btn-musica');
const textoMusica = document.getElementById('texto-musica');
let audioCtx = null, masterGain = null, filtro = null, reverb = null, reverbGain = null;
let musicaSonando = false, planificadorID = null, siguienteTiempo = 0, pasoGlobal = 0;

const ACORDES = [
  [261.63, 329.63, 392.00, 523.25],
  [196.00, 246.94, 293.66, 392.00],
  [220.00, 261.63, 329.63, 440.00],
  [174.61, 220.00, 261.63, 349.23],
];
const DURACION_PASO = 0.46;

function crearReverb(ctx) {
  const dur = 2.6, rate = ctx.sampleRate, len = Math.floor(rate * dur);
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioCtx.destination);

  filtro = audioCtx.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.value = 2400;
  filtro.Q.value = 0.5;
  filtro.connect(masterGain);

  reverb = crearReverb(audioCtx);
  reverbGain = audioCtx.createGain();
  reverbGain.gain.value = 0.4;
  reverb.connect(reverbGain);
  reverbGain.connect(masterGain);
  filtro.connect(reverb);
}

function tocarNota(freq, cuando, dur, vol, tipo) {
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = tipo || 'triangle';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, cuando);
  g.gain.linearRampToValueAtTime(vol, cuando + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, cuando + dur);
  osc.connect(g);
  g.connect(filtro);
  osc.start(cuando);
  osc.stop(cuando + dur + 0.05);
}

function programar() {
  const horizonte = audioCtx.currentTime + 0.2;
  while (siguienteTiempo < horizonte) {
    const acorde = ACORDES[Math.floor(pasoGlobal / 4) % ACORDES.length];
    const idx = pasoGlobal % 4;
    const octava = Math.floor(pasoGlobal / 8) % 2 === 0 ? 2 : 1;
    tocarNota(acorde[idx] * octava, siguienteTiempo, 1.2, 0.15, 'triangle');
    if (idx === 3) tocarNota(acorde[0] * 2, siguienteTiempo + 0.22, 0.9, 0.07, 'sine');
    if (idx === 0) {
      tocarNota(acorde[0], siguienteTiempo, 2.3, 0.06, 'sine');
      tocarNota(acorde[2], siguienteTiempo, 2.3, 0.045, 'sine');
    }
    siguienteTiempo += DURACION_PASO;
    pasoGlobal++;
  }
}

function iniciarMusica() {
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  musicaSonando = true;
  const t = audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(t);
  masterGain.gain.setValueAtTime(masterGain.gain.value, t);
  masterGain.gain.linearRampToValueAtTime(0.5, t + 1.6);
  if (!planificadorID) {
    siguienteTiempo = audioCtx.currentTime + 0.1;
    programar();
    planificadorID = setInterval(programar, 60);
  }
  btnMusica.classList.add('sonando');
  textoMusica.textContent = 'Sonando';
}

function pausarMusica() {
  musicaSonando = false;
  if (audioCtx) {
    const t = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(t);
    masterGain.gain.setValueAtTime(masterGain.gain.value, t);
    masterGain.gain.linearRampToValueAtTime(0, t + 0.8);
  }
  btnMusica.classList.remove('sonando');
  textoMusica.textContent = 'Pon música';
}

btnMusica.addEventListener('click', () => {
  if (musicaSonando) pausarMusica();
  else iniciarMusica();
});

/* ---------- 5. INTRO ---------- */
document.getElementById('btn-empezar').addEventListener('click', () => {
  iniciarMusica();
  mostrarPantalla('p-jardin');
  setTimeout(() => {
    osito.classList.add('saludando');
    hablar('Siembra una flor por cada cosa que me gusta de ti 🌱', 3600);
    setTimeout(() => osito.classList.remove('saludando'), 2100);
  }, 500);
});

/* ---------- 6. LA SIEMBRA ---------- */
const motivos = [
  'Por tu sonrisa: es lo primero que busco cada vez que apareces. 🌻',
  'Por tus ojos: tienen una forma de mirar que me deja sin palabras. 🌸',
  'Porque me gusta todo de ti, y cada día descubro un motivo nuevo. 🌺',
  'Porque aunque no te sobre el tiempo, cada ratito tuyo vale oro. 🌼',
  'Por cómo me haces sentir: tranquilo, feliz, con ganas de más. 🌷',
  'Porque simplemente me gustas, Celi, y ya no hay más que explicar. 💐',
];
const coloresFlor = ['#ffb703', '#ff7aa2', '#c77dff', '#ffd166', '#ff8fab', '#f4845f'];

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
  if (cont.dataset.listo) return;
  cont.dataset.listo = '1';

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
  construirCorazonFlores();
  mostrarPantalla('p-corazon');
});

/* ---------- 8. FINAL ---------- */
document.getElementById('btn-final').addEventListener('click', () => {
  mostrarPantalla('p-final');
  iniciarLluvia();
  hablar('dile, dile... 🧸💗', 3400);
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

/* ---------- 10. EL "FIN" EXPLOTA ---------- */
const botonFin = document.getElementById('fin');
botonFin.addEventListener('click', () => {
  if (botonFin.dataset.explotando) return;
  botonFin.dataset.explotando = '1';

  const grande = document.createElement('span');
  grande.className = 'corazon-gigante';
  grande.textContent = '♥';
  document.body.appendChild(grande);
  setTimeout(() => grande.remove(), 1300);

  document.body.classList.add('temblor');
  setTimeout(() => document.body.classList.remove('temblor'), 520);

  explosionDesde(null);
  setTimeout(() => explosionDesde(null), 650);

  // cae la noche
  document.getElementById('cielo').classList.add('noche');
  intensidadLuci = 1;

  saltar();
  setTimeout(() => { delete botonFin.dataset.explotando; }, 1600);
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
