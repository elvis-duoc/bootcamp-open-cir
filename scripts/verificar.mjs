// Verificación antes de publicar (la corre GitHub Actions en cada cambio; también sirve en este computador: node scripts/verificar.mjs).
// Revisa que el sitio esté completo: archivos principales, sintaxis de los scripts, imágenes y videos referenciados,
// OpenCircuits incluido con sus programas precompilados, y que no queden enlaces a servidores PHP ni archivos demasiado grandes.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errores = [], avisos = [];
const existe = f => fs.existsSync(path.join(raiz, f));
const leer = f => fs.readFileSync(path.join(raiz, f), "utf8");

// 1. Archivos principales
for (const f of ["index.html", "app.js", "sala.js", "datos.js", "estilos.css", "vercel.json", "opencircuits/index.html"])
  if (!existe(f)) errores.push(`Falta ${f}`);

// 2. Sintaxis de los scripts del sitio
for (const f of ["app.js", "sala.js", "datos.js"]) {
  if (!existe(f)) continue;
  try { new vm.Script(leer(f), { filename: f }); } catch (e) { errores.push(`Error de sintaxis en ${f}: ${e.message}`); }
}

// 3. Recursos que index.html carga
if (existe("index.html")) {
  const html = leer("index.html");
  for (const [, url] of html.matchAll(/(?:src|href)="([^"#:]+?)(?:\?[^"]*)?"/g))
    if (!url.startsWith("//") && !existe(url)) errores.push(`index.html usa ${url}, que no existe`);
}

// 4. Datos: imágenes de estaciones, cartas, circuitos y piezas
let D = null;
try { const ctx = { window: {} }; vm.runInNewContext(leer("datos.js"), ctx); D = ctx.window.RUTA; } catch (e) { errores.push(`No se pudo leer datos.js: ${e.message}`); }
if (D) {
  for (const t of D.tecnologias || []) {
    const img = t.estacion?.img;
    if (img && !existe(`assets/tecnologias/${img}${img.includes(".") ? "" : ".webp"}`)) errores.push(`Falta la imagen de la estación ${t.id}: ${img}`);
    for (const e of t.enlaces || []) if (e.url && !/^https?:/.test(e.url) && !existe(e.url.replace(/\/$/, "/index.html"))) errores.push(`El enlace «${e.t}» de ${t.id} apunta a ${e.url}, que no existe`);
  }
  for (const m of D.misiones || []) for (const c of m.cartas || []) if (c.foto && !existe(`assets/fotos/${c.foto}.webp`)) errores.push(`Falta la foto de carta ${c.foto}`);
  const M = D.circuitosMaker;
  if (M) {
    if (!/^https?:/.test(M.abrir) && !existe(M.abrir.replace(/\/$/, "/index.html"))) errores.push(`circuitosMaker.abrir apunta a ${M.abrir}, que no existe`);
    for (const c of M.circuitos) {
      for (const f of [`assets/circuitos-maker/${c.id}.webp`, c.guia?.diagramaGrande && `assets/circuitos-maker/${c.guia.diagramaGrande}.webp`].filter(Boolean))
        if (!existe(f)) errores.push(`Falta ${f}`);
      const fotos = [...(c.guia?.pasos || []).map(p => p.foto), ...(c.materiales || []).map(x => x[3]), ...(c.guia?.ubicacion || []).map(u => u[0])].filter(Boolean);
      for (const f of new Set(fotos)) if (!existe(`assets/circuitos-maker/piezas/${f}.webp`)) errores.push(`Falta la foto de pieza ${f} (circuito ${c.id})`);
    }
    if (!M.escritorio) avisos.push("circuitosMaker.escritorio está vacío: no se muestra el botón «Descargar app de escritorio».");
  }
}

// 5. OpenCircuits: programas precompilados (en Vercel no hay compilador)
const fw = "opencircuits/assets/firmware";
if (!existe(fw)) errores.push(`Falta ${fw}: sin él, los Circuitos Maker no se pueden simular en Vercel`);
else {
  const n = fs.readdirSync(path.join(raiz, fw)).filter(f => /^[0-9a-f]{64}\.json$/.test(f)).length;
  if (n < 3) errores.push(`Solo hay ${n} programas precompilados en ${fw}`);
}

// 6. Nada de PHP ni archivos que Vercel o GitHub no aceptan
const recorrer = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.name.startsWith(".") ? [] : e.isDirectory() ? recorrer(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of recorrer(raiz)) {
  const rel = path.relative(raiz, f).split(path.sep).join("/"), mb = fs.statSync(f).size / 1048576;
  if (/\.php$/i.test(rel)) errores.push(`${rel}: Vercel no ejecuta PHP`);
  if (mb > 50) errores.push(`${rel} pesa ${mb.toFixed(0)} MB (GitHub avisa sobre 50 MB y rechaza sobre 100 MB)`);
}

for (const a of avisos) console.log(`Aviso: ${a}`);
if (errores.length) { for (const e of errores) console.error(`✗ ${e}`); console.error(`\n${errores.length} problema(s): no se publica.`); process.exit(1); }
console.log("✓ Sitio completo y listo para publicar.");
