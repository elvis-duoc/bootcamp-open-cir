// La sala: el video de la tecnología elegida corre grande y, al terminar la misión, muestra las cartas para recordar.

// ---------- Reproductores: los dos responden igual ----------
const ensayo = { // Sin YouTube: un reloj que avanza
  nombre: "ensayo", _t: 0, _desde: null,
  time() { return this._desde === null ? this._t : this._t + (performance.now() - this._desde) / 1000; },
  seek(t) { const on = this.playing(); this._t = t; this._desde = on ? performance.now() : null; },
  play() { if (!this.playing()) this._desde = performance.now(); },
  pause() { this._t = this.time(); this._desde = null; },
  playing() { return this._desde !== null; },
  acabo: () => false,
};
const youtube = {
  nombre: "youtube", p: null, listo: false, cargado: null, cargando: false, _on: false, _t: 0, _hasta: 0,
  // Justo después de saltar o de cambiar de video, YouTube aún puede responder el tiempo anterior
  time() { return this.listo && !this.cargando && performance.now() > this._hasta ? this.p.getCurrentTime() : this._t; },
  seek(t) { this._t = t; this._hasta = Math.max(this._hasta, performance.now() + 500); if (this.listo && !this.cargando) this.p.seekTo(t, true); },
  play() {
    this._on = true; if (!this.listo) return;
    this.p.playVideo();
    // Si el navegador bloquea el inicio, vuelve a mostrar el botón de reproducir
    setTimeout(() => { if (this._on && [-1, 5].includes(this.p.getPlayerState())) this._on = false; }, 1500);
  },
  pause() { this._t = this.time(); this._on = false; if (this.listo) this.p.pauseVideo(); },
  playing() { return this._on; },
  acabo() { return this.listo && !this.cargando && performance.now() > this._hasta && this.p.getPlayerState() === 0; },
  // Cambiar de video toma más que un salto: hasta que empieza a correr no se confía en su tiempo ni en su estado.
  // Saltar mientras carga haría que YouTube parta desde cero, así que el punto de inicio se aplica al empezar.
  cargar(id, t) { this.cargado = id; this._t = t; this.cargando = true; this.p.loadVideoById({ videoId: id, startSeconds: t }); },
  yaCargo() { if (!this.cargando) return; this.cargando = false; this._hasta = performance.now() + 500; this.p.seekTo(this._t, true); },
};
// Video local (app de escritorio, sin internet): un <video> con el archivo de la carpeta «videos» junto al programa.
// Si el archivo dura menos que las misiones (por ejemplo, un video de prueba), sus tiempos se reparten a lo largo del archivo.
const local = {
  nombre: "local", v: null, src: "", total: 0, escala: 1, _t: 0, _on: false,
  el() { if (!this.v) { const v = document.createElement("video"); v.id = "vlocal"; v.playsInline = true; v.preload = "auto"; v.addEventListener("loadedmetadata", () => this.ajustar()); v.addEventListener("error", () => { this.fallo = true; if (P !== local) return; const t = this._t, on = this._on; usar(ensayo); $("#demo-t").textContent = `Falta el video ${decodeURIComponent(this.src)}`; ensayo.seek(t); if (on) ensayo.play(); }); $("#vid").insertBefore(v, $("#capa-clic")); this.v = v; } return this.v; },
  cargar(src, total) {
    const v = this.el(); this.total = total; this.fallo = false;
    if (this.src !== src) { this.src = src; this.escala = 1; v.src = src; } else this.ajustar();
  },
  ajustar() { const d = this.v.duration; this.escala = d && this.total && d < this.total - 1 ? d / this.total : 1; this.seek(this._t); if (this._on) this.v.play().catch(() => { this._on = false; }); },
  time() { return this.v && this.v.readyState ? this.v.currentTime / this.escala : this._t; },
  seek(t) { this._t = t; if (this.v && this.v.readyState) this.v.currentTime = Math.min(t * this.escala, Math.max(0, this.v.duration - .05)); },
  play() { this._on = true; this.v?.play().catch(() => { this._on = false; }); },
  pause() { this._t = this.time(); this._on = false; this.v?.pause(); },
  playing() { return this._on; },
  acabo() { return !!this.v?.ended; },
};
const enEscritorio = !!window.bootcampEscritorio; // Lo define la app de escritorio (preload.cjs)
let P = ensayo, apiPedida = false, sinYT = false, videoId = null;
function usar(r) { P = r; $("#yt").hidden = r !== youtube; $("#demo").hidden = r !== ensayo; $("#b-cc").hidden = r !== youtube; if (local.v) { local.v.hidden = r !== local; if (r !== local) local.v.pause(); } }

// ---------- Subtítulos: parten apagados y se prenden con el botón CC ----------
// YouTube los muestra solo si el video o el navegador lo piden; se controla cargando o quitando su módulo de subtítulos.
let subtitulos = false;
// cargar: true solo al prender con el botón. Cuando YouTube avisa un cambio de módulo (onApiChange) solo se elige la pista o se quita, sin volver a cargar.
function aplicarSubtitulos(cargar) {
  const p = youtube.p; if (!youtube.listo || !p?.loadModule) return;
  if (!subtitulos) { p.unloadModule("captions"); return; }
  if (cargar === true) p.loadModule("captions");
  // La lista de pistas llega cuando el módulo terminó de cargar: la de español si existe, si no la primera
  const pistas = p.getOption("captions", "tracklist") || [];
  const pista = pistas.find(x => /^es/.test(x.languageCode)) || pistas[0];
  if (pista && p.getOption("captions", "track")?.languageCode !== pista.languageCode) p.setOption("captions", "track", { languageCode: pista.languageCode });
}
function alternarSubtitulos() { subtitulos = !subtitulos; aplicarSubtitulos(true); pintarSala(); }
// Si YouTube no responde (sin internet), la plataforma sigue con el video de ensayo
function sinYoutube() {
  sinYT = true;
  if (P !== youtube) return;
  const t = youtube.time(), on = youtube.playing(); youtube.listo = false; usar(ensayo); ensayo.seek(t); if (on) ensayo.play();
}
function pedirApi() {
  apiPedida = true;
  // Un error puntual no debe dejar a un equipo sin video: primero reintenta en el mismo punto
  let ultimoReintento = -Infinity;
  youtube.alError = () => {
    if (!youtube.listo || performance.now() - ultimoReintento < 30000) return sinYoutube();
    ultimoReintento = performance.now();
    const t = youtube.time(), on = youtube._on;
    youtube.cargar(youtube.cargado, t);
    if (!on) youtube.p.pauseVideo();
  };
  window.onYouTubeIframeAPIReady = () => {
    youtube.cargado = videoId;
    new YT.Player("yt", {
      videoId, width: "100%", height: "100%",
      playerVars: { cc_load_policy: 0, controls: 0, disablekb: 1, rel: 0, playsinline: 1, fs: 0, iv_load_policy: 3, origin: location.origin },
      events: {
        onReady: e => {
          youtube.p = e.target; youtube.listo = true; aplicarSubtitulos();
          // Si mientras cargaba eligieron otra tecnología con video, se cambia al suyo
          if (videoId && youtube.cargado !== videoId) youtube.cargar(videoId, youtube._t); else youtube.p.seekTo(youtube._t, true);
          if (youtube._on) youtube.play(); else youtube.p.pauseVideo();
        },
        // Al saltar, YouTube avisa «en pausa» por un instante: no cuenta
        onStateChange: e => {
          if (e.data === YT.PlayerState.PLAYING) { youtube._on = true; youtube.yaCargo(); aplicarSubtitulos(true); }
          if (youtube.cargando) return;
          if (e.data === YT.PlayerState.ENDED || (e.data === YT.PlayerState.PAUSED && performance.now() > youtube._hasta)) youtube._on = false;
        },
        onError: () => youtube.alError(),
        onApiChange: () => aplicarSubtitulos(), // YouTube cargó (o quitó) el módulo de subtítulos: se respeta lo elegido con CC
      },
    });
  };
  const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; s.onerror = sinYoutube; document.head.append(s);
  setTimeout(() => { if (!youtube.listo) sinYoutube(); }, 12000);
}
// Deja listo el video de la tecnología. Las tecnologías sin enlace usan el video de ensayo.
// En la app de escritorio cada tecnología usa su video local (videoLocal en datos.js); en la web, YouTube.
function prepararVideoLocal(tec, desde) {
  const total = Math.max(...D.misiones.filter(m => m.tec === tec.id).map(m => seg(m.fin)));
  local.cargar(tec.videoLocal, total); local._t = desde; usar(local);
}
function prepararVideo(url, desde) {
  videoId = String(url || "").match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1] || null;
  if (!videoId || sinYT || location.protocol === "file:") { usar(ensayo); return; }
  usar(youtube);
  if (!apiPedida) pedirApi();
  else if (youtube.listo && youtube.cargado !== videoId) youtube.cargar(videoId, desde);
}

// ---------- La misión ----------
let S = null; // { i, m, ini, fin, terminada, guardado }

function abrirMision(i) {
  const eq = equipo(), m = D.misiones[i], st = estadoMision(eq, i), ini = seg(m.ini), fin = seg(m.fin), tec = tecDe(m.tec);
  // Si ya la terminaron, se repite desde el principio. Si no, sigue donde iba.
  const desde = st.hecha ? ini : Math.max(ini, Math.min(st.t || ini, fin));
  if (enEscritorio && tec.videoLocal) prepararVideoLocal(tec, desde); else prepararVideo(tec.youtube, desde);
  S = { i, m, ini, fin, terminada: false, guardado: performance.now() };
  $("#sala").hidden = false; document.body.classList.add("en-sala");
  // Título: «Tecnología - frase de la estación» (los mismos textos de su tarjeta en la portada). Las estaciones dentro de otra usan el nombre de la principal.
  const lista = misionesDe(m.tec), padre = tecDe(tec.padre), nombreTec = (padre || tec).estacion?.titulo || (padre || tec).corto;
  $("#s-titulo").textContent = tec.estacion?.frase ? `${nombreTec} - ${tec.estacion.frase}` : (lista.length === 1 ? `${nombreTec} · ${m.nombre}` : `${tec.corto} · Misión ${lista.indexOf(i) + 1} · ${m.nombre}`);
  $("#cierre").hidden = true; $("#ctrl").hidden = false; $("#vid").hidden = false;
  $("#demo-t").textContent = m.nombre;
  P.seek(desde); P.play();
  pintarSala();
}
function registrarAvance(t, forzar) {
  if (t < S.ini || t > S.fin) return;
  const st = estadoMision(equipo(), S.i);
  if (st.hecha) return;
  st.t = Math.max(st.t || 0, Math.floor(t)); // Lo más lejos que han llegado: es lo que ve el panel /admin
  if (forzar || performance.now() - S.guardado > 10000) { S.guardado = performance.now(); guardar(); }
}
function salirDeSala() {
  if (!S) return;
  if (!S.terminada) registrarAvance(P.time(), true);
  P.pause(); S = null;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  $("#sala").hidden = true; document.body.classList.remove("en-sala");
}
const volverARuta = () => { salirDeSala(); ir(); }; // Cerrar el video deja ver de nuevo la portada desde donde lo abrieron

function pintarSala() {
  if (!S) return;
  const t = P.time(), on = P.playing();
  $("#b-play").innerHTML = ico(on ? "pause" : "play");
  $("#bigplay").hidden = on;
  $("#l-fill").style.width = `${Math.max(0, Math.min(1, (t - S.ini) / (S.fin - S.ini))) * 100}%`;
  const rel = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  $("#tiempo").textContent = `${rel(Math.max(0, t - S.ini))} / ${rel(S.fin - S.ini)}`;
  $("#b-cc").classList.toggle("on", subtitulos); $("#b-cc").setAttribute("aria-pressed", subtitulos);
  $("#b-cc").title = subtitulos ? "Ocultar subtítulos" : "Mostrar subtítulos";
  $("#b-full").innerHTML = document.fullscreenElement ? `✕ Salir` : `${ico("full")}Pantalla completa`;
}
function tick() {
  if (!S || S.terminada) return;
  const t = P.time();
  // Termina un poco antes del final: el último cuadro no aporta y así no aparece la pantalla final de YouTube
  if (t >= S.fin - .8 || P.acabo()) return terminarMision();
  registrarAvance(t);
  pintarSala();
}
setInterval(tick, 120);

// ---------- Controles ----------
function alternar() { if (!S) return; P.playing() ? P.pause() : P.play(); pintarSala(); }
function saltar(t) {
  if (!S) return;
  const st = estadoMision(equipo(), S.i), tope = st.hecha ? S.fin : Math.max(st.t || S.ini, P.time()); // La primera vez no se puede adelantar más allá de lo visto
  P.seek(Math.max(S.ini, Math.min(t, tope))); pintarSala();
}
$("#b-play").addEventListener("click", alternar);
$("#bigplay").addEventListener("click", alternar);
$("#capa-clic").addEventListener("click", alternar);
$("#b-back").addEventListener("click", () => S && saltar(P.time() - 10));
$("#linea").addEventListener("click", e => { const r = e.currentTarget.getBoundingClientRect(); if (S) saltar(S.ini + (e.clientX - r.left) / r.width * (S.fin - S.ini)); });
$("#s-salir").addEventListener("click", volverARuta);
function pantallaCompleta() { document.fullscreenElement ? document.exitFullscreen().catch(() => {}) : $("#sala").requestFullscreen?.().catch(() => {}); }
$("#b-full").addEventListener("click", e => { e.currentTarget.blur(); pantallaCompleta(); });
$("#b-cc").addEventListener("click", e => { e.currentTarget.blur(); alternarSubtitulos(); });
document.addEventListener("fullscreenchange", pintarSala);
addEventListener("keydown", e => {
  if (!S || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.code === "Space" && !/BUTTON|A/.test(e.target.tagName)) { e.preventDefault(); alternar(); }
  if (e.key === "f" || e.key === "F") pantallaCompleta();
  if ((e.key === "c" || e.key === "C") && P === youtube) alternarSubtitulos();
});

// ---------- Cierre de la misión ----------
function terminarMision() {
  P.pause(); S.terminada = true;
  const eq = equipo(), st = estadoMision(eq, S.i), n = S.i, m = S.m, lista = misionesDe(m.tec), k = lista.indexOf(n), sig = lista[k + 1];
  st.hecha = true; st.t = 0; guardar();
  const el = $("#cierre"); el.hidden = false; $("#ctrl").hidden = true; $("#vid").hidden = true;
  el.innerHTML = `<div class="cierre-in">
      <p class="kicker">Misión ${k + 1} de ${lista.length}</p><h2>${esc(m.nombre)} lista</h2>
      <p class="cierre-tip">Para recordar. Toquen las cartas.</p>
      <div class="cartas">${m.cartas.map(c => cartaHTML(c, m.icono)).join("")}</div>
      <div class="cierre-b">
        <button class="btn ghost" id="p-otra">${ico("redo")}Repetir</button>
        ${sig !== undefined ? `<button class="btn" id="p-sig">Siguiente misión ${ico("next")}</button>` : ""}
        <button class="btn ghost" id="p-ruta">${ico("back")}Volver a las estaciones</button>
      </div></div>`;
  activarCartas(el);
  $("#p-otra").addEventListener("click", () => abrirMision(n));
  $("#p-ruta").addEventListener("click", volverARuta);
  $("#p-sig")?.addEventListener("click", () => abrirMision(sig));
  pintarSala();
}
