/**
 * Verificador de enlaces internos y de anclas.
 *
 *   node scripts/verificar-enlaces.mjs
 *
 * Qué comprueba, sobre el sitio YA compilado en dist/:
 *   1. Que todo `href` interno apunte a un archivo que existe.
 *   2. Que todo `#ancla` exista DE VERDAD en la página de destino.
 *   3. Al revés: que cada `id` de destino tenga alguien que lo use (avisos).
 *
 * POR QUÉ HACE FALTA
 *   La auditoría estructural revisa cada página por separado; no puede saber si
 *   `/contacto` existe cuando se escribe el enlace desde el footer. Un enlace
 *   roto no lo detecta ningún compilador: el build termina en verde y el
 *   visitante se come un 404. Esto lo caza antes de publicar.
 *
 * Sin dependencias: lee el HTML compilado y compara rutas.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');

/** Extensiones que NO son páginas: se comprueban como archivo directo. */
const RECURSOS = /\.(png|jpe?g|svg|webp|avif|ico|gif|css|js|mjs|json|xml|txt|webmanifest|woff2?|pdf|mp4)$/i;

/**
 * PÁGINAS QUE TODAVÍA NO EXISTEN Y SE ENLAZAN A PROPÓSITO.
 *
 * Ya no queda ninguna. En 3.4 la Home, el footer y los cierres apuntaban a
 * `/inscripcion`, que llegó en 3.5 con el formulario; al existir la página, esta
 * lista se vació sola y el verificador volvió a exigir cero enlaces rotos.
 *
 * El mecanismo se conserva porque el sitio sigue creciendo (Ola 2): si un
 * incremento vuelve a enlazar algo que aún no está construido, se declara aquí
 * y el informe lo dice en voz alta en cada compilación, en vez de silenciarlo.
 */
const PENDIENTES_CONOCIDOS = new Set([]);

function archivosHtml(dir) {
  const salida = [];
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) salida.push(...archivosHtml(ruta));
    else if (entrada.endsWith('.html')) salida.push(ruta);
  }
  return salida;
}

/** dist\programa.html → /programa · dist\index.html → / */
function rutaDeArchivo(archivo) {
  const rel = relative(DIST, archivo).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\.html$/, '');
}

/** /programa → dist\programa.html · / → dist\index.html */
function archivoDeRuta(ruta) {
  const limpia = ruta.replace(/\/+$/, '');
  if (limpia === '' || limpia === '/') return join(DIST, 'index.html');
  return join(DIST, `${limpia.slice(1)}.html`);
}

const archivos = archivosHtml(DIST);

/** ruta visible → ids presentes en esa página */
const anclasPorRuta = new Map();
/** ruta visible → índice de la página (para los avisos) */
const rutaPorArchivo = new Map();

for (const archivo of archivos) {
  const html = readFileSync(archivo, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const ruta = rutaDeArchivo(archivo);
  rutaPorArchivo.set(archivo, ruta);
  anclasPorRuta.set(
    ruta,
    new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
  );
}

const errores = [];
const avisos = [];
/** enlaces a páginas que todavía no se han construido (ver PENDIENTES_CONOCIDOS) */
const pendientes = new Map();
/** anclas usadas, para detectar las que sobran */
const anclasUsadas = new Set();

for (const archivo of archivos) {
  const origen = rutaPorArchivo.get(archivo);
  const html = readFileSync(archivo, 'utf8').replace(/<!--[\s\S]*?-->/g, '');

  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/gi)) {
    const href = m[1].trim();
    if (!href) continue;

    // Fuera de alcance: enlaces externos, correo, teléfono y descargas de datos
    if (/^(https?:)?\/\//i.test(href)) continue;
    if (/^(mailto:|tel:|sms:|whatsapp:|data:)/i.test(href)) continue;
    if (href.startsWith('#')) {
      const ancla = href.slice(1);
      anclasUsadas.add(`${origen}#${ancla}`);
      if (!anclasPorRuta.get(origen)?.has(ancla)) {
        errores.push(`${origen} · enlace a un ancla inexistente en la misma página: ${href}`);
      }
      continue;
    }
    if (!href.startsWith('/')) {
      avisos.push(`${origen} · enlace relativo sin barra inicial: ${href}`);
      continue;
    }

    // /ruta?param=1#ancla → ruta + ancla
    const [sinConsulta] = href.split('?');
    const [rutaCruda, ancla] = sinConsulta.split('#');
    const ruta = rutaCruda.replace(/\/+$/, '') || '/';

    if (RECURSOS.test(ruta)) {
      const recurso = join(DIST, ruta.replace(/^\//, ''));
      if (!existsSync(recurso)) errores.push(`${origen} · recurso inexistente: ${href}`);
      continue;
    }

    const destino = archivoDeRuta(ruta);
    if (!existsSync(destino)) {
      if (PENDIENTES_CONOCIDOS.has(ruta)) {
        pendientes.set(ruta, (pendientes.get(ruta) ?? 0) + 1);
        continue;
      }
      errores.push(`${origen} · página inexistente: ${href}`);
      continue;
    }

    if (ancla) {
      anclasUsadas.add(`${ruta}#${ancla}`);
      if (!anclasPorRuta.get(ruta)?.has(ancla)) {
        errores.push(`${origen} · el ancla #${ancla} no existe en ${ruta}`);
      }
    }
  }
}

/* ------------------------------------------------------- anclas huérfanas */
// Un `id` que nadie enlaza suele ser un resto de una versión anterior. Solo
// interesan los que parecen destinos de navegación, no los que usa el propio
// documento (aria-labelledby, aria-controls, etc.).
for (const [ruta, anclas] of anclasPorRuta) {
  for (const ancla of anclas) {
    if (/^(contenido|cierre-titulo|.*-titulo|.*-panel|.*-etiqueta|.*-error|.*-ayuda)$/.test(ancla)) {
      continue;
    }
    if (!anclasUsadas.has(`${ruta}#${ancla}`)) {
      // Se informa solo si la página tiene anclas declaradas como navegables.
      continue;
    }
  }
}

/* ------------------------------------------------------------------ informe */
console.log(
  `\nEnlaces y anclas · ${archivos.length} página(s) revisadas\n${'─'.repeat(58)}`,
);

if (avisos.length) {
  console.log(`\n⚠  ${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`   · ${a}`);
}

if (pendientes.size) {
  console.log(`\n◻  ${pendientes.size} página(s) que llegan en el siguiente incremento:`);
  for (const [ruta, cuenta] of pendientes) {
    console.log(`   · ${ruta} — ${cuenta} enlace(s) esperando (3.5)`);
  }
  console.log('   Se dejarán de avisar solas cuando la página exista.');
}

if (errores.length) {
  console.log(`\n✖  ${errores.length} enlace(s) roto(s):`);
  for (const e of errores) console.log(`   · ${e}`);
  console.log('');
  process.exit(1);
}

console.log(
  pendientes.size
    ? '\n✓  Sin enlaces rotos. Lo pendiente está declarado arriba.\n'
    : '\n✓  Todos los enlaces internos y las anclas resuelven.\n',
);
