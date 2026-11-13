# Bootcamp Web · Ruta Maker

Plataforma Ruta Maker del Bootcamp Pionero (estaciones de Impresión 3D, Corte láser y Arduino, videos y Circuitos Maker)
con **OpenCircuits Web** incluido en `opencircuits/`. Es un sitio estático: no necesita servidor, base de datos ni compilación.

| Carpeta / archivo | Qué es |
|---|---|
| `index.html`, `app.js`, `sala.js`, `datos.js`, `estilos.css`, `assets/` | La plataforma. Los textos, videos y circuitos se editan en `datos.js`. |
| `opencircuits/` | OpenCircuits Web ya construido (modo Bootcamp), con los Circuitos Maker precompilados para simular sin servidor. |
| `vercel.json` | Configuración de Vercel: sitio estático, encabezados de seguridad y caché. |
| `.github/workflows/vercel.yml` | CI: verifica el sitio en cada cambio (la publicación la hace Vercel). |
| `scripts/verificar.mjs` | La verificación: archivos, sintaxis, imágenes y programas precompilados. |

## 1. Subir a GitHub

1. Creen un repositorio **vacío** en GitHub (sin README), por ejemplo `bootcamp-web`.
2. En esta carpeta, en una terminal:

```powershell
git init -b main
git add .
git commit -m "Primera versión de Bootcamp Web"
git remote add origin https://github.com/<usuario>/bootcamp-web.git
git push -u origin main
```

Al subirlo, GitHub Actions corre la verificación del sitio.

## 2. Conectar con Vercel (una sola vez)

1. En https://vercel.com → **Add New… → Project** → importen el repositorio de GitHub.
2. Configuración: **Framework Preset: Other**, sin comando de build y con la carpeta raíz del repositorio. **Deploy**.

Desde ahí, Vercel publica solo en cada subida a GitHub.

## 3. Cómo funciona el CI/CD

| Evento | Qué pasa |
|---|---|
| Push a `main` | GitHub Actions verifica el sitio · Vercel publica en **producción**. |
| Otra rama o pull request | GitHub Actions verifica · Vercel publica una **vista previa** con su propio enlace. |
| Falla la verificación | Aparece en rojo en la pestaña Actions (y en el pull request): revisen el error antes de seguir. |

## App de escritorio de OpenCircuits

No va en el repositorio: el instalador (`OpenCircuits-Setup.exe`, 187 MB) supera el límite de 100 MB de GitHub.
Está en la carpeta `bootcamp web/app-escritorio`. Para ofrecer su descarga:

1. En GitHub, **Releases → Draft a new release**, y adjunten `OpenCircuits-Setup.exe` (Releases acepta hasta 2 GB por archivo).
2. Copien el enlace del archivo y pónganlo en `datos.js` → `circuitosMaker.escritorio`.
3. Al subir el cambio aparece el botón **«Descargar app de escritorio»** en cada circuito.

## Actualizar

- **Plataforma:** editen aquí y suban los cambios (`git add . && git commit -m "..." && git push`).
- **OpenCircuits:** en `../opencircuits`, `npm run build:bootcamp` y copien `bootcamp web/opencircuits` sobre `opencircuits/` de esta carpeta.
- **Antes de subir:** `node scripts/verificar.mjs` hace la misma revisión que GitHub Actions.
- **Probarlo antes de subir:** usen la carpeta `bootcamp web` (tiene «Probar en este computador.bat»), que es la misma web.
