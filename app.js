// Ruta Maker: la portada con las estaciones abre directo el video de cada una (la sala, en sala.js). Arduino tiene además Circuitos Maker (#maker).
const D = window.RUTA, $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const seg = t => t.split(":").reduce((a, b) => a * 60 + Number(b), 0);
const ico = n => `<svg class="i"><use href="#i-${n}"/></svg>`;

// ---------- Guardado: localStorage puede fallar (modo privado, bloqueado) y la plataforma sigue funcionando ----------
const CLAVE = "pionero-ruta-laser";
const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE)) || null; } catch { return null; } };
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(E)); return true; } catch { return false; } }

// Los equipos vienen de datos.js. Se cargan una vez por computador y después cada uno guarda su avance.
const equiposDesdeDatos = () => Array.from({ length: D.cantidadEquipos }, (_, i) => ({ id: `e${i + 1}`, nombre: `Equipo ${i + 1}`, misiones: {} }));
let E = leer();
if (E?.version !== D.versionEquipos) { E = { version: D.versionEquipos, actual: null, equipos: equiposDesdeDatos() }; guardar(); }
// Entrada libre: en el inicio se elige solo la tecnología. Cada tecnología tiene un "equipo" propio de este computador (id t-<tec>),
// que no se envía al servidor: su avance queda guardado solo aquí.
E.libres ??= {};
const libreDe = tec => (E.libres[tec] ??= { id: `t-${tec}`, nombre: tecDe(tec).nombre, tec, n: 1, des: null, libre: true, misiones: {} });
const equipo = () => E.actual?.startsWith("t-") ? E.libres[E.actual.slice(2)] || null : E.equipos.find(e => e.id === E.actual) || null;

// Las misiones se identifican por su posición en D.misiones; cada tecnología usa las suyas
const tecDe = id => D.tecnologias.find(t => t.id === id) || null;
const misionesDe = tec => D.misiones.flatMap((m, i) => m.tec === tec ? [i] : []);
const estadoMision = (eq, i) => (eq.misiones[i] ??= { t: 0, hecha: false });

// ---------- Navegación ----------
// Páginas: la portada (con sus estaciones) y Circuitos Maker (#maker y #maker/<id>). Los videos se abren en la sala, encima de la portada.
const VISTAS = { equipos: vistaEquipos, maker: vistaMaker };
function ir() {
  const r = location.hash.slice(1) || "equipos";
  salirDeSala();
  // Portada de una estación con estaciones hijas (por ejemplo, #estacion-i3d)
  const padre = r.startsWith("estacion-") && hijasDe(r.slice(9)).length ? r.slice(9) : null;
  const [base, sub] = r.split("/"); // #maker/<id>: la ficha de un circuito
  const destino = !padre && base === "maker" ? "maker" : "equipos";
  if (!padre && destino === "equipos" && r !== "equipos") history.replaceState(null, "", "#equipos"); // Enlaces antiguos (#ruta, #circuitos…) vuelven a la portada
  document.body.classList.add("en-portada");
  scrollTo(0, 0);
  VISTAS[destino](destino === "maker" ? sub : padre);
}
const irA = vista => { if (location.hash === `#${vista}`) ir(); else location.hash = vista; };
function iniciar() { addEventListener("hashchange", ir); ir(); }

// ---------- Base de equipos ----------
const hijasDe = id => D.tecnologias.filter(t => (t.padre || null) === (id || null));
function vistaEquipos(padre = null) {
  // Portada: solo los logos y las estaciones, con el diseño de los lienzos colgantes. Al tocar una, el equipo entra a su video.
  // Si la estación tiene estaciones hijas (padre en datos.js), primero se muestran esas.
  const lista = hijasDe(padre), p = tecDe(padre);
  const imagen = f => `assets/tecnologias/${esc(f)}${f.includes(".") ? "" : ".webp"}`;
  $("#vista").innerHTML = `
    <section class="portada">
      <img class="base-graf" src="assets/grafismo.svg" alt="">
      <header class="portada-marca"><img class="portada-aa" src="assets/anglo-blanco.webp" alt="Anglo American"><img class="portada-logo" src="assets/logo-pionero-blanco.webp" alt="Bootcamp Pionero"></header>
      ${p ? `<a class="portada-volver" href="#equipos">${ico("back")}Volver a las estaciones</a>` : ""}
      <div class="estaciones n${lista.length}">${lista.map(t => { const s = t.estacion || {};
        const enlaces = (t.enlaces || []).map(x => x.ruta ? `<a class="est-enlace" href="#${esc(x.ruta)}">${ico(x.icono || "next")}${esc(x.t)}</a>`
          : externo(x.url) ? `<a class="est-enlace" href="${esc(x.url)}" target="_blank" rel="noopener">${ico("ext")}${esc(x.t)}</a>`
          : `<a class="est-enlace" href="${esc(x.url)}">${ico("chip")}${esc(x.t)}</a>`).join("");
        return `<div class="estacion" role="button" tabindex="0" data-t="${esc(t.id)}">
          <span class="est-ic">${s.img ? `<img src="${imagen(s.img)}" alt="">` : ico(t.icono)}</span>
          <span class="est-k">${p ? esc(p.estacion?.titulo || p.nombre) : "Estación"}</span><b class="est-t">${esc(s.titulo || t.nombre)}</b><span class="est-f">${esc(s.frase || t.lema)}</span>
          ${enlaces ? `<span class="est-enlaces">${enlaces}</span>` : ""}
        </div>`; }).join("")}</div>
    </section>`;
  const elegir = b => {
    const id = b.dataset.t;
    if (hijasDe(id).length) { irA(`estacion-${id}`); return; }
    E.actual = libreDe(id).id; guardar();
    // Directo al video: sigue en la misión donde iban; si terminaron todas, desde la primera
    const eq = equipo(), lista = misionesDe(id);
    abrirMision(lista.find(i => !eq.misiones[i]?.hecha) ?? lista[0]);
  };
  $("#vista").querySelectorAll(".estacion").forEach(b => {
    b.addEventListener("click", e => { if (!e.target.closest(".est-enlace")) elegir(b); }); // Los botones de software abren su enlace, no el video
    b.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === b) { e.preventDefault(); elegir(b); } });
  });
}

// ---------- Circuitos Maker: 3 circuitos de ejemplo de OpenCircuits, de menos a más complejo, con el diseño de la portada ----------
const marcaPortada = `<img class="base-graf" src="assets/grafismo.svg" alt="">
      <header class="portada-marca"><img class="portada-aa" src="assets/anglo-blanco.webp" alt="Anglo American"><img class="portada-logo" src="assets/logo-pionero-blanco.webp" alt="Bootcamp Pionero"></header>`;
function vistaMaker(id) {
  const M = D.circuitosMaker, c = M.circuitos.find(x => x.id === id);
  if (id && !c) { history.replaceState(null, "", "#maker"); return vistaMaker(); }
  if (c) return fichaMaker(M, c);
  $("#vista").innerHTML = `
    <section class="portada maker">
      ${marcaPortada}
      <a class="portada-volver" href="#equipos">${ico("back")}Volver a las estaciones</a>
      <header class="mk-cabeza"><p class="est-k">Estación Arduino</p><h1>Circuitos Maker</h1><p>Tres circuitos con sensor ultrasónico, de menos a más complejo. Elijan uno para ver sus materiales, cómo se arma y qué debe pasar.</p></header>
      <div class="mk-grid">${M.circuitos.map(x => `
        <a class="mk-card" href="#maker/${esc(x.id)}">
          <span class="mk-img"><img src="assets/circuitos-maker/${esc(x.id)}.webp" alt="Circuito ${esc(x.nombre)}" loading="lazy"></span>
          <span class="mk-cuerpo"><span class="mk-nv"><span class="mk-n n${x.nivel}">Nivel ${x.nivel}</span>${esc(x.nivelTxt)}</span><b>${esc(x.nombre)}</b><span class="mk-desc">${esc(x.descripcion)}</span></span>
        </a>`).join("")}</div>
    </section>`;
}
// Ficha explicada paso a paso (circuitos con «guia» en datos.js): qué hace, cómo funciona, simulador, materiales con fotos y conexiones
// OpenCircuits: si está dentro del proyecto (dirección relativa) se abre en la misma pestaña y directo en el circuito;
// si es un sitio externo, en una pestaña nueva y el estudiante elige el circuito en el menú «Circuitos Maker».
const externo = u => /^https?:/i.test(u);
const abrirOC = (M, c) => externo(M.abrir)
  ? `<a class="btn mk-abrir" href="${esc(M.abrir)}" target="_blank" rel="noopener">${ico("ext")}Abrir en OpenCircuits</a>`
  : `<a class="btn mk-abrir" href="${esc(M.abrir)}#maker-${esc(c.id)}">${ico("play")}Abrir en OpenCircuits</a>`;
const ayudaOC = (M, c) => externo(M.abrir)
  ? `En OpenCircuits, elijan «${esc(c.nombre)}» en Circuitos Maker. Se abre listo para simular: seleccionen el sensor y muevan el objeto para cambiar la distancia.`
  : `Se abre este mismo circuito listo para simular: presionen «Iniciar simulación», seleccionen el sensor y muevan el objeto para cambiar la distancia. Para volver, usen «Volver a la guía del circuito».`;
const fotoPieza = f => `assets/circuitos-maker/piezas/${esc(f)}.webp`;
// Destaca las coordenadas de la protoboard (a17, j16…) y las columnas de los rieles (col. 16)
const coords = t => esc(t).replace(/\b([a-j](?:30|[12]\d|[1-9]))\b/g, '<code class="gu-coord">$1</code>').replace(/col\. (\d+)/g, '<code class="gu-coord">col. $1</code>');
function fichaGuia(M, c) {
  const i = M.circuitos.indexOf(c), g = c.guia;
  const S = g.sim, figuras = {
    persona: `<svg viewBox="0 0 40 80" aria-hidden="true"><circle cx="20" cy="11" r="9"/><path d="M8 28a12 12 0 0 1 24 0v22h-5v28h-5V52h-4v26h-5V50H8Z"/></svg>`,
    // Camión minero de dibujo, mirando hacia la barrera y el sensor (a la izquierda)
    vehiculo: `<svg viewBox="0 0 124 74" aria-hidden="true"><ellipse cx="62" cy="69" rx="58" ry="3.5" fill="rgb(10 12 60 / .35)"/><path d="M50 14c4-6 9-8 14-5 3-5 9-6 13-2 4-4 11-4 14 1 4-3 10-2 12 3 4-1 8 1 9 5H50Z" fill="#9aa0b8"/><path d="M60 10l3 2M74 7l2 3M90 9l3 2M100 11l2 2" stroke="#7d84a8" stroke-width="1.6" stroke-linecap="round"/><path d="M46 16h74l-5 30H50Z" fill="#f2b630" stroke="#b9800f" stroke-width="2" stroke-linejoin="round"/><path d="M64 18v26M82 18v26M100 18v26" stroke="#d99a1c" stroke-width="2.4"/><path d="M46 16h74" stroke="#ffd36b" stroke-width="2.4"/><rect x="8" y="44" width="110" height="8" rx="2" fill="#3a3f5c"/><path d="M12 46V27c0-3 2-5 5-5h17l9 11v13Z" fill="#f2b630" stroke="#b9800f" stroke-width="2" stroke-linejoin="round"/><path d="M18 26h14l7 8H18Z" fill="#bfe6ff" stroke="#3a3f5c" stroke-width="1.6" stroke-linejoin="round"/><path d="M21 28l4 0-3 4h-3Z" fill="#fff" opacity=".7"/><rect x="36" y="16" width="4" height="8" rx="1.5" fill="#3a3f5c"/><rect x="4" y="40" width="10" height="8" rx="2" fill="#3a3f5c"/><circle cx="9" cy="37" r="3.2" fill="#fff3b0" stroke="#b9800f" stroke-width="1.2"/><circle cx="28" cy="56" r="12" fill="#22263a"/><circle cx="28" cy="56" r="6" fill="#aab0c8"/><circle cx="28" cy="56" r="2.2" fill="#3a3f5c"/><circle cx="82" cy="56" r="12" fill="#22263a"/><circle cx="82" cy="56" r="6" fill="#aab0c8"/><circle cx="82" cy="56" r="2.2" fill="#3a3f5c"/><circle cx="104" cy="56" r="12" fill="#22263a"/><circle cx="104" cy="56" r="6" fill="#aab0c8"/><circle cx="104" cy="56" r="2.2" fill="#3a3f5c"/></svg>` };
  // Salidas del simulador: LED, semáforo (3 luces) y barrera movida por el servo
  const salidas = {
    "led-rojo": `<div class="sim-salida"><span class="sim-luz rojo" data-luz="rojo"></span><small>LED rojo</small></div>`,
    semaforo: `<div class="sim-salida"><span class="sim-semaforo">${["rojo", "amarillo", "verde"].map(c => `<span class="sim-luz ${c}" data-luz="${c}"></span>`).join("")}</span><small>Semáforo</small></div>`,
    barrera: "" };
  // Barrera dentro de la pista: el brazo cruza frente al vehículo y termina justo en la distancia donde se abre
  const conBarrera = S.salidas.includes("barrera"), abre = conBarrera ? S.estados.find(e => e[2] === 90)?.[0] : null;
  const barreraPista = conBarrera ? `<div class="sim-paso" style="--abre:${abre}%" aria-hidden="true">
      <span class="sim-paso-poste"></span><span class="sim-paso-brazo"></span><span class="sim-paso-eje"></span></div>` : "";
  $("#vista").innerHTML = `
    <section class="portada maker guia">
      ${marcaPortada}
      <a class="portada-volver" href="#maker">${ico("back")}Todos los circuitos</a>

      <header class="gu-hero">
        <div class="gu-hero-t">
          <p class="est-k"><span class="mk-n n${c.nivel}">Nivel ${c.nivel}</span> Circuito ${i + 1} de ${M.circuitos.length}</p>
          <h1>${esc(c.nombre)}</h1>
          <p class="gu-resumen">${esc(g.resumen)}</p>
          ${abrirOC(M, c)}
        </div>
        <figure class="gu-hero-img"><img src="assets/circuitos-maker/${esc(c.id)}.webp" alt="Circuito ${esc(c.nombre)} armado en la protoboard"><figcaption>Así queda armado</figcaption></figure>
      </header>

      <section class="gu-sec">
        <h2 class="gu-h"><span>1</span>¿Cómo funciona?</h2>
        <ol class="gu-pasos" style="--n:${g.pasos.length}">${g.pasos.map((p, k) => `<li>
          <span class="gu-foto"><img src="${fotoPieza(p.foto)}" alt="" loading="lazy"></span>
          <b><em>${k + 1}</em>${esc(p.t)}</b><p>${esc(p.d)}</p></li>`).join("")}</ol>
      </section>

      <section class="gu-sec gu-sim">
        <h2 class="gu-h"><span>2</span>Pruébenlo</h2>
        <p class="gu-intro">${esc(S.intro)}</p>
        <div class="sim-escena">
          <div class="sim-sensor"><img src="${fotoPieza("hcsr04-azul")}" alt="Sensor"><small>Sensor</small></div>
          <div class="sim-pista">
            ${S.zonas.map(([hasta, color, txt], k) => { const desde = k ? S.zonas[k - 1][0] : 0; return `<div class="sim-zona ${color}" style="left:${desde}%;width:${hasta - desde}%"><span>${esc(txt)}</span></div>`; }).join("")}
            <div class="sim-ondas"></div>
            ${barreraPista}
            <div class="sim-objeto ${S.objeto}">${figuras[S.objeto]}</div>
            <div class="sim-regla">${[0, 20, 40, 60, 80, 100].map(n => `<span style="left:${n}%">${n} cm</span>`).join("")}</div>
          </div>
          <div class="sim-salidas">${S.salidas.map(x => salidas[x]).join("")}</div>
        </div>
        <label class="sim-control"><span>Distancia</span><input type="range" min="2" max="100" value="70" aria-label="Distancia al sensor, en centímetros"><output>70 cm</output></label>
        <p class="sim-estado" aria-live="polite"></p>
      </section>

      <section class="gu-sec">
        <h2 class="gu-h"><span>3</span>Materiales</h2>
        <ul class="gu-mat">${c.materiales.map(([n, pieza, det, foto, rol]) => `<li>
          <span class="gu-foto">${foto ? `<img src="${fotoPieza(foto)}" alt="" loading="lazy">` : ""}<em>×${n}</em></span>
          <b>${esc(pieza)}</b>${det ? `<small>${esc(det)}</small>` : ""}${rol ? `<p>${esc(rol)}</p>` : ""}</li>`).join("")}</ul>
      </section>

      <section class="gu-sec gu-conex">
        <h2 class="gu-h"><span>4</span>Cómo se conecta</h2>
        <p class="gu-intro">Las filas de la protoboard van de la <b>a</b> a la <b>j</b> y las columnas del <b>1</b> al <b>30</b>. Usen los botones para acercar el diagrama y ver cada hoyo.</p>
        <figure class="gu-zoom">
          <div class="gu-zoom-lienzo" tabindex="0" aria-label="Diagrama de conexiones. Usen los botones para acercar o alejar."><img src="assets/circuitos-maker/${esc(g.diagramaGrande || c.id)}.webp" alt="Diagrama de conexiones del circuito ${esc(c.nombre)}" draggable="false"></div>
          <div class="gu-zoom-ctrl" role="group" aria-label="Zoom del diagrama">
            <button type="button" data-z="menos" aria-label="Alejar">−</button><output>100%</output><button type="button" data-z="mas" aria-label="Acercar">+</button>
            <button type="button" data-z="ajustar" class="gu-zoom-aj">${ico("full")}Ajustar</button>
          </div>
          <figcaption>El color de cada cable es el mismo del diagrama. Con zoom, arrastren la imagen para recorrerla.</figcaption>
        </figure>
        ${g.ubicacion ? `<h3 class="gu-sub">Dónde va cada pieza</h3>
        <ul class="gu-ubic">${g.ubicacion.map(([foto, pieza, donde, nota]) => `<li><span class="gu-foto"><img src="${fotoPieza(foto)}" alt="" loading="lazy"></span>
          <div><b>${esc(pieza)}</b><p class="gu-donde">${coords(donde)}</p><small>${esc(nota)}</small></div></li>`).join("")}</ul>` : ""}
      </section>

      <section class="gu-cta">
        <div><h2>Ahora, ¡a armarlo!</h2><p>${ayudaOC(M, c)}</p></div>
        <div class="gu-cta-b">
          ${abrirOC(M, c)}
          ${M.escritorio ? `<a class="btn ghost mk-escritorio" href="${esc(M.escritorio)}" target="_blank" rel="noopener">${ico("screen")}Descargar app de escritorio</a>` : ""}
        </div>
      </section>

    </section>`;
  // Simulador: el objeto se mueve con el control; según la zona se encienden las luces y gira la barrera (textos y reglas en datos.js)
  const sim = $(".gu-sim"), control = sim.querySelector("input");
  const pintar = () => {
    const d = Number(control.value), [, luz, angulo, txt] = S.estados.find(([hasta]) => d < hasta);
    sim.querySelector("output").textContent = `${d} cm`;
    sim.querySelector(".sim-objeto").style.left = `${d}%`;
    sim.querySelectorAll(".sim-luz").forEach(l => l.classList.toggle("on", l.dataset.luz === luz));
    sim.querySelectorAll(".sim-zona").forEach((z, k) => z.classList.toggle("activa", d < S.zonas[k][0] && d >= (k ? S.zonas[k - 1][0] : 0)));
    sim.querySelector(".sim-paso")?.classList.toggle("abierta", angulo === 90); // El ángulo se lee en el mensaje de abajo
    sim.dataset.luz = luz || "";
    sim.querySelector(".sim-estado").innerHTML = `<b>A ${d} cm:</b> ${txt}`;
  };
  control.addEventListener("input", pintar); pintar();
  activarZoom($(".gu-zoom"));
}
// Zoom del diagrama: botones + / − / Ajustar y arrastre para recorrerlo cuando está ampliado
function activarZoom(fig) {
  const lienzo = fig.querySelector(".gu-zoom-lienzo"), img = lienzo.querySelector("img"), nivel = fig.querySelector("output");
  const MIN = 1, MAX = 6, PASO = 1.6;
  let s = 1, x = 0, y = 0, arrastre = null;
  const aplicar = () => {
    const w = lienzo.clientWidth, h = lienzo.clientHeight, mx = w * (s - 1) / 2, my = h * (s - 1) / 2;
    x = Math.max(-mx, Math.min(mx, x)); y = Math.max(-my, Math.min(my, y));
    img.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    nivel.textContent = `${Math.round(s * 100)}%`;
    fig.querySelector('[data-z="menos"]').disabled = s <= MIN; fig.querySelector('[data-z="mas"]').disabled = s >= MAX;
    lienzo.classList.toggle("movible", s > 1);
  };
  const escala = f => { const n = Math.max(MIN, Math.min(MAX, s * f)); x *= n / s; y *= n / s; s = n; aplicar(); };
  fig.querySelectorAll("[data-z]").forEach(b => b.addEventListener("click", () => {
    const z = b.dataset.z;
    if (z === "mas") escala(PASO); else if (z === "menos") escala(1 / PASO); else { s = 1; x = y = 0; aplicar(); }
  }));
  lienzo.addEventListener("keydown", e => { if (e.key === "+" || e.key === "=") escala(PASO); if (e.key === "-") escala(1 / PASO); if (e.key === "0") { s = 1; x = y = 0; aplicar(); } });
  lienzo.addEventListener("pointerdown", e => { if (s <= 1) return; arrastre = { px: e.clientX, py: e.clientY, x, y }; lienzo.setPointerCapture(e.pointerId); lienzo.classList.add("arrastrando"); });
  lienzo.addEventListener("pointermove", e => { if (!arrastre) return; x = arrastre.x + e.clientX - arrastre.px; y = arrastre.y + e.clientY - arrastre.py; aplicar(); });
  const soltar = () => { arrastre = null; lienzo.classList.remove("arrastrando"); };
  lienzo.addEventListener("pointerup", soltar); lienzo.addEventListener("pointercancel", soltar);
  addEventListener("resize", aplicar);
  aplicar();
}
function fichaMaker(M, c) {
  if (c.guia) return fichaGuia(M, c);
  const i = M.circuitos.indexOf(c);
  $("#vista").innerHTML = `
    <section class="portada maker">
      ${marcaPortada}
      <a class="portada-volver" href="#maker">${ico("back")}Todos los circuitos</a>
      <article class="mk-ficha">
        <figure class="mk-ficha-img"><img src="assets/circuitos-maker/${esc(c.id)}.webp" alt="Circuito ${esc(c.nombre)} armado en la protoboard"></figure>
        <div class="mk-ficha-t">
          <p class="est-k"><span class="mk-n n${c.nivel}">Nivel ${c.nivel}</span> Circuito ${i + 1} de ${M.circuitos.length}</p>
          <h1>${esc(c.nombre)}</h1>
          <p class="mk-ficha-desc">${esc(c.descripcion)}</p>
          <h2>Materiales</h2>
          <ul class="mk-mat">${c.materiales.map(([n, pieza, det]) => `<li><b>${n}</b><span>${esc(pieza)}${det ? `<small>${esc(det)}</small>` : ""}</span></li>`).join("")}</ul>
          <h2>Qué debe pasar</h2>
          <ul class="mk-reac">${c.reacciones.map(([cuando, pasa]) => `<li><b>${esc(cuando)}</b><span>${esc(pasa)}</span></li>`).join("")}</ul>
          <div class="mk-dato"><span>${ico("mountain")}</span><p><b>En la minería</b>${esc(c.mineria)}</p></div>
          <div class="mk-dato"><span>${ico("bulb")}</span><p><b>Aprenden</b>${esc(c.aprende)}</p></div>
          <h2>Pines del kit</h2>
          <ul class="mk-pines">${M.pines.filter(([p]) => p === "TRIG" || p === "ECHO" || (p.startsWith("LED") && c.piezas.leds && (c.piezas.leds === 3 || p === "LED rojo")) || (p === "Servo" && c.piezas.servo)).map(([p, d]) => `<li><span>${esc(p)}</span><b>${esc(d)}</b></li>`).join("")}</ul>
          ${abrirOC(M, c)}
          <p class="mk-ayuda">${ayudaOC(M, c)}</p>
        </div>
      </article>
    </section>`;
}

// Las cartas: tres ideas para recordar en cada misión terminada. Se dan vuelta al tocarlas.
const cartaHTML = (c, icono) => `<button class="carta" aria-label="${esc(c.txt)}"><span class="c-in">${c.foto ? `<span class="c-a"><img src="assets/fotos/${c.foto}.webp" alt="" loading="lazy"></span>` : `<span class="c-a sin-foto">${ico(icono)}</span>`}<span class="c-b">${esc(c.txt)}</span></span></button>`;
function activarCartas(el) { el.querySelectorAll(".carta").forEach(c => c.addEventListener("click", () => c.classList.toggle("vuelta"))); }
