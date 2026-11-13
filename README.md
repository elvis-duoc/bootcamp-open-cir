# Bootcamp Web · Ruta Maker

Plataforma Ruta Maker del Bootcamp Pionero (estaciones de Impresión 3D, Corte láser y Arduino, videos y Circuitos Maker)
con **OpenCircuits Web** incluido en `opencircuits/`. Es un sitio estático: no necesita servidor, base de datos ni compilación.

| Carpeta / archivo | Qué es |
|---|---|
| `index.html`, `app.js`, `sala.js`, `datos.js`, `estilos.css`, `assets/` | La plataforma. Los textos, videos y circuitos se editan en `datos.js`. |
| `opencircuits/` | OpenCircuits Web ya construido (modo Bootcamp), con los Circuitos Maker precompilados para simular sin servidor. |
| `vercel.json` | Configuración de Vercel: sitio estático, encabezados de seguridad y caché. |
| `.github/workflows/vercel.yml` | CI/CD: verifica el sitio y lo publica en Vercel en cada cambio. |
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

Al subirlo, GitHub Actions corre la verificación. Mientras falten los secretos de Vercel, verifica pero no publica.

## 2. Conectar con Vercel (una sola vez)

1. Instalen la CLI y vinculen la carpeta a un proyecto nuevo de Vercel:

```powershell
npm install --global vercel
vercel login
vercel link          # «Set up and deploy?» → sí · nombre del proyecto · sin framework ni comando de build
```

   Esto crea `.vercel/project.json` (no se sube al repositorio) con dos datos: `orgId` y `projectId`.
2. Creen un token en https://vercel.com/account/tokens.
3. En GitHub: **Settings → Secrets and variables → Actions → New repository secret**, y agreguen:

| Secreto | Valor |
|---|---|
| `VERCEL_TOKEN` | el token del paso 2 |
| `VERCEL_ORG_ID` | `orgId` de `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` de `.vercel/project.json` |

4. En GitHub, **Actions → Verificar y publicar en Vercel → Run workflow** para la primera publicación.

## 3. Cómo funciona el CI/CD

| Evento | Qué pasa |
|---|---|
| Push a `main` | Verificación → publicación en **producción**. |
| Pull request | Verificación → publicación de **vista previa** con su propio enlace. |
| Falla la verificación | No se publica nada y el error aparece en la pestaña Actions. |

`vercel.json` desactiva las publicaciones automáticas propias de Vercel (`git.deploymentEnabled: false`) para que no se
publique dos veces: el único que publica es GitHub Actions, y solo si la verificación pasa.

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
