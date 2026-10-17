/**
 * Verificador de datos estructurados (JSON-LD).
 *
 *   node scripts/verificar-datos-estructurados.mjs
 *
 * Qué comprueba, sobre el sitio YA compilado:
 *   1. Que CADA bloque `application/ld+json` sea JSON válido y se pueda parsear.
 *      Un solo carácter de más y Google descarta en silencio todo el marcado.
 *   2. Que cada página declare los tipos que fija el sitemap §10.1 — ni menos
 *      (se pierden resultados enriquecidos) ni de más (marcado engañoso).
 *   3. Que el certificado NUNCA se anuncie con reconocimiento oficial. Es la
 *      regla del §10.1 y la única que, si se rompe, deja de ser un problema de
 *      SEO para convertirse en un problema legal.
 *
 * Sin dependencias.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');

/**
 * Tipos exigidos por página (sitemap §10.1).
 *   `*` = en todas las páginas · los demás, solo donde se indica.
 */
const EXIGIDOS_GLOBALES = ['EducationalOrganization'];
const EXIGIDOS_POR_RUTA = {
  '/contacto': ['BreadcrumbList', 'LocalBusiness'],
  '/sobre': ['BreadcrumbList', 'LocalBusiness'],
  '/programa': ['BreadcrumbList', 'Course'],
  '/precios': ['BreadcrumbList', 'Course'],
  '/preguntas-frecuentes': ['BreadcrumbList', 'FAQPage'],
  '/instituciones': ['BreadcrumbList'],
  '/privacidad': ['BreadcrumbList'],
  '/terminos': ['BreadcrumbList'],
  '/cookies': ['BreadcrumbList'],
};

/** Frases que jamás pueden aparecer afirmadas en el marcado del certificado. */
const PROHIBIDAS = [
  'validez oficial del minedu',
  'reconocido por el minedu',
  'avalado por el minedu',
  'título oficial',
];

/** Negaciones que hacen legítima la mención. Se comparan en minúsculas. */
const NEGACIONES = ['no tiene validez oficial del minedu', 'sin validez oficial del minedu'];

function archivosHtml(dir) {
  const salida = [];
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) salida.push(...archivosHtml(ruta));
    else if (entrada.endsWith('.html')) salida.push(ruta);
  }
  return salida;
}

function rutaDeArchivo(archivo) {
  const rel = relative(DIST, archivo).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\.html$/, '');
}

/** Recoge todos los `@type` de un nodo, estén donde estén dentro del árbol. */
function tiposDe(nodo, acumulado = new Set()) {
  if (Array.isArray(nodo)) {
    for (const item of nodo) tiposDe(item, acumulado);
    return acumulado;
  }
  if (nodo && typeof nodo === 'object') {
    const tipo = nodo['@type'];
    if (typeof tipo === 'string') acumulado.add(tipo);
    else if (Array.isArray(tipo)) tipo.forEach((t) => acumulado.add(t));
    for (const valor of Object.values(nodo)) tiposDe(valor, acumulado);
  }
  return acumulado;
}

const errores = [];
const paginas = [];

for (const archivo of archivosHtml(DIST)) {
  const ruta = rutaDeArchivo(archivo);
  const html = readFileSync(archivo, 'utf8');
  const bloques = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];

  if (bloques.length === 0) {
    errores.push(`${ruta} · no declara ningún bloque JSON-LD`);
    continue;
  }

  const tipos = new Set();
  for (const [indice, bloque] of bloques.entries()) {
    try {
      const datos = JSON.parse(bloque[1]);
      tiposDe(datos, tipos);

      // Regla del certificado: si aparece una frase prohibida, tiene que ir
      // precedida de una negación. La comparación es insensible a mayúsculas
      // porque la negación puede abrir la frase y llevar inicial mayúscula.
      const plano = JSON.stringify(datos).toLowerCase();
      for (const prohibida of PROHIBIDAS) {
        if (plano.includes(prohibida) && !NEGACIONES.some((n) => plano.includes(n))) {
          errores.push(`${ruta} · bloque ${indice + 1} · afirma «${prohibida}» sin negarlo`);
        }
      }
    } catch (error) {
      errores.push(`${ruta} · bloque ${indice + 1} · JSON inválido: ${error.message}`);
    }
  }

  for (const tipo of EXIGIDOS_GLOBALES) {
    if (!tipos.has(tipo)) errores.push(`${ruta} · falta el tipo obligatorio ${tipo}`);
  }
  for (const tipo of EXIGIDOS_POR_RUTA[ruta] ?? []) {
    if (!tipos.has(tipo)) errores.push(`${ruta} · debería declarar ${tipo} y no lo hace`);
  }

  paginas.push({ ruta, tipos: [...tipos].sort() });
}

/* ------------------------------------------------------------------ informe */
console.log(
  `\nDatos estructurados · ${paginas.length} página(s)\n${'─'.repeat(58)}`,
);
for (const { ruta, tipos } of paginas) {
  console.log(`  ${ruta.padEnd(24)} ${tipos.join(' · ') || '(sin tipos)'}`);
}

const sitemapIndex = join(DIST, 'sitemap-index.xml');
if (!existsSync(sitemapIndex)) errores.push('falta dist/sitemap-index.xml');

if (errores.length) {
  console.log(`\n✖  ${errores.length} problema(s):`);
  for (const e of errores) console.log(`   · ${e}`);
  console.log('');
  process.exit(1);
}

console.log('\n✓  Todos los nodos son válidos y declaran lo que el sitemap pide.\n');
