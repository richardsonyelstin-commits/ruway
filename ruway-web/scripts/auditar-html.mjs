/**
 * Auditoría estructural de accesibilidad y SEO sobre el HTML ya compilado.
 *
 *   npm run build && node scripts/auditar-html.mjs
 *
 * Revisa de forma estática lo que se puede comprobar sin navegador. NO sustituye
 * a una auditoría real: las pruebas con axe-core, teclado y lector de pantalla
 * se ejecutan antes de cada publicación (ver 02-arquitectura.md §5.1).
 *
 * Sin dependencias: usa expresiones regulares sobre el HTML generado.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');

/** Recorre dist/ y devuelve todos los .html */
function archivosHtml(dir) {
  const salida = [];
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) salida.push(...archivosHtml(ruta));
    else if (entrada.endsWith('.html')) salida.push(ruta);
  }
  return salida;
}

const errores = [];
const avisos = [];

function revisar(archivo, htmlCrudo) {
  const nombre = relative(DIST, archivo).replace(/\\/g, '/');

  // Se eliminan los comentarios ANTES de analizar. Motivo real: un comentario
  // explicativo que mencionaba `<h1>` hacía que la auditoría contara dos
  // encabezados de nivel 1, y el error era del auditor, no de la página.
  const html = htmlCrudo.replace(/<!--[\s\S]*?-->/g, '');

  const fallo = (mensaje) => errores.push(`${nombre} · ${mensaje}`);
  const nota = (mensaje) => avisos.push(`${nombre} · ${mensaje}`);

  // 1 · Idioma del documento (WCAG 3.1.1)
  if (!/<html[^>]+lang="[^"]+"/i.test(html)) fallo('falta lang en <html> (3.1.1)');

  // 2 · Título no vacío y único (2.4.2)
  const titulo = html.match(/<title>([^<]*)<\/title>/i);
  if (!titulo || !titulo[1].trim()) fallo('falta <title> o está vacío (2.4.2)');

  // 3 · Un solo <h1> y sin saltos de nivel (1.3.1 · 2.4.6)
  const nivelH1 = (html.match(/<h1[\s>]/gi) || []).length;
  if (nivelH1 === 0) fallo('no hay <h1> en la página');
  if (nivelH1 > 1) fallo(`hay ${nivelH1} elementos <h1>; debe haber exactamente uno`);

  const encabezados = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  let maximo = 0;
  for (const nivel of encabezados) {
    if (nivel > maximo + 1) fallo(`salto de nivel de encabezado: h${maximo} → h${nivel} (1.3.1)`);
    maximo = Math.max(maximo, nivel);
  }

  // 4 · Imágenes con texto alternativo (1.1.1)
  //     Un `alt` vacío puede llegar como `alt=""` o como `alt` a secas: en HTML
  //     ambos significan cadena vacía (imagen decorativa). Los dos son válidos.
  for (const img of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt\b/i.test(img[0])) fallo(`<img> sin atributo alt: ${img[0].slice(0, 90)}`);
  }

  // 5 · Landmarks (1.3.1 · 2.4.1)
  if (!/<main\b/i.test(html)) fallo('falta el landmark <main> (2.4.1)');
  if (!/<header\b/i.test(html)) nota('no hay <header> (banner)');
  if (!/<footer\b/i.test(html)) nota('no hay <footer> (contentinfo)');
  if (!/Saltar al contenido/i.test(html)) fallo('falta el enlace «saltar al contenido» (2.4.1)');

  // 6 · Identificadores duplicados (4.1.1 rompería las referencias ARIA)
  const ids = [...html.matchAll(/\sid="([^"]+)"/gi)].map((m) => m[1]);
  const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (repetidos.length) fallo(`id duplicados: ${[...new Set(repetidos)].join(', ')}`);

  // 7 · tabindex positivo rompe el orden natural del foco (2.4.3)
  for (const m of html.matchAll(/tabindex="(\d+)"/gi)) {
    if (Number(m[1]) > 0) fallo(`tabindex positivo (${m[1]}) altera el orden del foco (2.4.3)`);
  }

  // 8 · Enlaces con nombre accesible (2.4.4 · 4.1.2)
  for (const a of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    const etiqueta = a[0];
    const contenido = a[1].replace(/<[^>]+>/g, '').trim();
    const tieneAria = /aria-label\s*=\s*"[^"]+"/i.test(etiqueta);
    const tieneImgConAlt = /<img\b[^>]*\balt="[^"]+"/i.test(a[1]);
    const tieneSvgTitulo = /<title>/i.test(a[1]);
    if (!contenido && !tieneAria && !tieneImgConAlt && !tieneSvgTitulo) {
      fallo(`enlace sin nombre accesible: ${etiqueta.slice(0, 90)}`);
    }
    const textoPlano = contenido.toLowerCase();
    if (/^(clic aquí|aquí|más|ver más|leer más)$/.test(textoPlano)) {
      nota(`texto de enlace poco descriptivo: «${contenido}» (2.4.4)`);
    }
  }

  // 9 · Enlaces externos sin rel="noopener" (seguridad + rendimiento)
  for (const a of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    if (!/rel="[^"]*noopener/i.test(a[0])) nota(`enlace _blank sin rel="noopener": ${a[0].slice(0, 90)}`);
  }

  // 10 · Botones con nombre accesible (4.1.2)
  for (const b of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const contenido = b[1].replace(/<[^>]+>/g, '').trim();
    const tieneAria = /aria-label\s*=\s*"[^"]+"/i.test(b[0]);
    if (!contenido && !tieneAria) fallo(`botón sin nombre accesible: ${b[0].slice(0, 90)}`);
  }

  // 11 · Controles de formulario etiquetados (3.3.2)
  for (const control of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    const etiqueta = control[0];
    if (/type="(hidden|submit|button)"/i.test(etiqueta)) continue;
    const id = etiqueta.match(/\bid="([^"]+)"/i)?.[1];
    const tieneLabel = id && new RegExp(`<label[^>]+for="${id}"`, 'i').test(html);
    const envuelto = new RegExp(`<label[^>]*>(?:(?!</label>)[\\s\\S])*?<${control[1]}`, 'i').test(html);
    if (!tieneLabel && !envuelto && !/aria-label\s*=\s*"[^"]+"/i.test(etiqueta)) {
      fallo(`control sin etiqueta: ${etiqueta.slice(0, 90)} (3.3.2)`);
    }
  }

  // 12 · SEO técnico
  if (!/rel="canonical"/i.test(html)) nota('falta <link rel="canonical">');
  if (!/property="og:title"/i.test(html)) nota('faltan etiquetas Open Graph');
}

/* ------------------------------------------------------------------ informe */
const archivos = archivosHtml(DIST);
for (const archivo of archivos) revisar(archivo, readFileSync(archivo, 'utf8'));

console.log(`\nAuditoría estructural · ${archivos.length} página(s) revisadas\n${'─'.repeat(58)}`);

if (avisos.length) {
  console.log(`\n⚠  ${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`   · ${a}`);
}

if (errores.length) {
  console.log(`\n✖  ${errores.length} error(es):`);
  for (const e of errores) console.log(`   · ${e}`);
  console.log('');
  process.exit(1);
}

console.log(`\n✓  Sin errores estructurales.\n`);
