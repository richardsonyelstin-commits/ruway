/**
 * Auditoría de rendimiento con Lighthouse sobre el sitio compilado.
 *
 *   npm run preview                 (en otra terminal)
 *   npm run auditar-rendimiento
 *   npm run auditar-rendimiento -- --url /precios
 *   npm run auditar-rendimiento -- --solo movil
 *   npm run auditar-rendimiento -- --json ../.openclaw/tmp/rendimiento.json
 *
 * POR QUÉ EXISTE
 *   El presupuesto del §6.4 del documento de arquitectura promete cinco cosas
 *   medibles: cuatro categorías de Lighthouse por encima de 95, LCP, CLS,
 *   INP y peso de página. Ninguna se puede comprobar leyendo el HTML. Esta
 *   auditoría las mide en las condiciones duras —móvil 4G emulado, que es el
 *   escenario que castiga— y en escritorio, sin throttling.
 *
 *   La primera pasada —en el navegador real de esta máquina— fija el listón.
 *   Lighthouse no se encadena en `npm run verificar`: tarda minutos y necesita
 *   el servidor de vista previa.
 *
 * Requiere el servidor de vista previa en marcha. El navegador lo pone
 * `scripts/lib/navegador.mjs`; Lighthouse abre su propia pestaña en él.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import { abrirNavegador, BASE } from './lib/navegador.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUERTO = 9336;

const RUTAS = [
  '/',
  '/programa',
  '/precios',
  '/preguntas-frecuentes',
  '/sobre',
  '/contacto',
  '/instituciones',
  '/inscripcion',
  '/gracias',
  '/privacidad',
  '/terminos',
  '/cookies',
  '/404',
];

/**
 * Páginas cuya puntuación de SEO queda **fuera de la barrera**, con el motivo y
 * con la auditoría que Lighthouse tiene que seguir poniendo en rojo. Las dos son
 * comportamiento correcto, no defectos, y se comprueba que sigan siéndolo.
 */
const SIN_SEO = new Map([
  [
    '/gracias',
    {
      motivo: 'lleva «noindex, follow» a propósito (ADR-020): no aporta nada a un buscador',
      auditoria: 'is-crawlable',
    },
  ],
  [
    '/404',
    {
      motivo: 'es la página de error: también va con «noindex, follow» a propósito',
      auditoria: 'is-crawlable',
    },
  ],
]);

const CATEGORIAS = ['performance', 'accessibility', 'best-practices', 'seo'];
const MINIMO = 95;

/** Presupuestos del §6.4. TBT se usa como proxy de INP: en laboratorio no hay INP. */
const PRESUPUESTO = {
  lcp: 2500,
  cls: 0.1,
  tbt: 200,
  pesoHtmlCss: 150 * 1024,
};

/** Móvil: los valores por defecto de Lighthouse (4G lento emulado + CPU ×4). */
const MOVIL = { id: 'movil', etiqueta: 'móvil 4G', ajustes: {} };

/** Escritorio: los mismos valores que el `--preset=desktop` de Lighthouse. */
const ESCRITORIO = {
  id: 'escritorio',
  etiqueta: 'escritorio',
  ajustes: {
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  },
};

const PERFILES = [MOVIL, ESCRITORIO];

/* ------------------------------------------------------------------ opciones */
const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : porDefecto;
};

const soloRuta = opcion('url', null);
const soloPerfil = opcion('solo', null);
const rutaJson = opcion('json', null);

const rutas = soloRuta ? [soloRuta] : RUTAS;
/** Acepta `movil` y `móvil`: la tilde no debería decidir si la auditoría corre. */
const perfiles = soloPerfil
  ? PERFILES.filter((p) => p.id === soloPerfil || p.etiqueta.startsWith(soloPerfil))
  : PERFILES;

if (!perfiles.length) {
  console.error(`Perfil desconocido: ${soloPerfil}. Usa «movil» o «escritorio».`);
  process.exit(1);
}

/* ------------------------------------------------------------------ informe */
const fallos = [];
const informe = [];
const sinIndexar = [];

const kB = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const segundos = (ms) => `${(ms / 1000).toFixed(2)} s`;

function comprobar(condicion, mensaje) {
  if (!condicion) fallos.push(mensaje);
  return condicion ? '✓' : '✖';
}

/* ------------------------------------------------------------------- proceso */
const { cerrar } = await abrirNavegador({ puerto: PUERTO, perfil: 'ruway-lighthouse', pestana: false });

try {
  for (const perfil of perfiles) {
    console.log(`\n${perfil.etiqueta}\n${'─'.repeat(78)}`);
    console.log(
      `  ${'ruta'.padEnd(22)}${'rend'.padStart(6)}${'a11y'.padStart(6)}${'buen'.padStart(6)}` +
        `${'seo'.padStart(6)}   ${'LCP'.padStart(8)}${'CLS'.padStart(8)}${'TBT'.padStart(9)}${'HTML+CSS'.padStart(11)}`,
    );

    for (const ruta of rutas) {
      const url = new URL(ruta, BASE).href;

      const salida = await lighthouse(url, {
        port: PUERTO,
        output: 'json',
        logLevel: 'error',
        onlyCategories: CATEGORIAS,
        ...perfil.ajustes,
      });

      const lhr = salida.lhr;
      const puntaje = (id) => Math.round((lhr.categories[id]?.score ?? 0) * 100);
      const auditoria = (id) => lhr.audits[id];

      const lcp = auditoria('largest-contentful-paint')?.numericValue ?? 0;
      const cls = auditoria('cumulative-layout-shift')?.numericValue ?? 0;
      const tbt = auditoria('total-blocking-time')?.numericValue ?? 0;

      const recursos = auditoria('resource-summary')?.details?.items ?? [];
      const pesoDe = (tipo) => recursos.find((r) => r.resourceType === tipo)?.transferSize ?? 0;
      const pesoHtmlCss = pesoDe('document') + pesoDe('stylesheet');

      const puntajes = Object.fromEntries(CATEGORIAS.map((c) => [c, puntaje(c)]));

      const marca = (categoria) => {
        const exigible = !(categoria === 'seo' && SIN_SEO.has(ruta));
        if (!exigible) return `${String(puntajes[categoria]).padStart(6)}`;
        comprobar(
          puntajes[categoria] >= MINIMO,
          `${ruta} (${perfil.etiqueta}) · ${categoria} ${puntajes[categoria]} < ${MINIMO}`,
        );
        return `${String(puntajes[categoria]).padStart(6)}`;
      };

      console.log(
        `  ${ruta.padEnd(22)}${marca('performance')}${marca('accessibility')}` +
          `${marca('best-practices')}${marca('seo')}   ${segundos(lcp).padStart(8)}` +
          `${cls.toFixed(3).padStart(8)}${`${Math.round(tbt)} ms`.padStart(9)}${kB(pesoHtmlCss).padStart(11)}`,
      );

      comprobar(lcp < PRESUPUESTO.lcp, `${ruta} (${perfil.etiqueta}) · LCP ${segundos(lcp)} ≥ 2,5 s`);
      comprobar(cls < PRESUPUESTO.cls, `${ruta} (${perfil.etiqueta}) · CLS ${cls.toFixed(3)} ≥ 0,1`);
      comprobar(tbt < PRESUPUESTO.tbt, `${ruta} (${perfil.etiqueta}) · TBT ${Math.round(tbt)} ms ≥ 200 ms`);
      comprobar(
        pesoHtmlCss < PRESUPUESTO.pesoHtmlCss,
        `${ruta} (${perfil.etiqueta}) · HTML+CSS ${kB(pesoHtmlCss)} ≥ 150 KB`,
      );

      informe.push({
        ruta,
        perfil: perfil.etiqueta,
        puntajes,
        lcp: Math.round(lcp),
        cls: Number(cls.toFixed(4)),
        tbt: Math.round(tbt),
        pesoHtmlCss,
        fuentes: pesoDe('font'),
        total: pesoDe('total'),
      });

      // En las páginas que quedan fuera del índice la señal esperada es la
      // contraria: lo que hay que comprobar es que Lighthouse siga viendo el
      // motivo. Sin esto, saltarse su SEO parecería un permiso para siempre.
      const exclusion = SIN_SEO.get(ruta);
      if (exclusion) {
        const fallidas = (lhr.categories.seo?.auditRefs ?? [])
          .filter((referencia) => referencia.weight > 0)
          .map((referencia) => referencia.id)
          .filter((id) => {
            const nota = lhr.audits[id]?.score;
            return typeof nota === 'number' && nota < 1;
          });

        comprobar(
          fallidas.includes(exclusion.auditoria),
          `${ruta} (${perfil.etiqueta}) · se esperaba que «${exclusion.auditoria}» estuviera en rojo y las que fallan son: ${fallidas.join(', ') || 'ninguna'}`,
        );
        sinIndexar.push({
          ruta,
          perfil: perfil.etiqueta,
          seo: puntajes.seo,
          motivo: exclusion.motivo,
          auditoria: exclusion.auditoria,
          confirmada: fallidas.includes(exclusion.auditoria),
        });
      }
    }

    if (sinIndexar.length) {
      const porRuta = new Map(sinIndexar.map((p) => [p.ruta, p]));
      console.log('\n  Fuera de la barrera de SEO, a propósito:');
      for (const p of porRuta.values()) {
        console.log(`    ${p.ruta.padEnd(10)} SEO ${String(p.seo).padStart(3)} · ${p.motivo}`);
      }
      console.log(
        '    En los dos casos el motivo se comprueba: la auditoría que Lighthouse deja en rojo\n' +
          '    tiene que ser la que está escrita aquí para cada una, y si falla otra, se dice cuál.',
      );
    }
  }
} finally {
  await cerrar();
}

/* ------------------------------------------------------------------ resultado */
if (rutaJson) {
  const destino = resolve(RAIZ, rutaJson);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, JSON.stringify({ fecha: new Date().toISOString(), minimo: MINIMO, informe, sinIndexar, fallos }, null, 2));
  console.log(`\nInforme JSON en ${destino}`);
}

console.log(`\nRendimiento · ${fallos.length} incumplimiento(s) de ${informe.length} mediciones`);
console.log('─'.repeat(78));

if (fallos.length) {
  for (const f of fallos) console.log(`  ✖ ${f}`);
  console.log(`\n✖  ${fallos.length} incumplimiento(s).\n`);
  process.exit(1);
}

const exceptuadas = [...new Set(sinIndexar.map((p) => p.ruta))];
console.log(
  `\n✓  Las 4 categorías ≥ ${MINIMO} en las ${informe.length} mediciones y los presupuestos de §6.4\n` +
    '   se cumplen.\n' +
    `   Fuera de la barrera de SEO, por el motivo escrito en el guion y comprobado: ${exceptuadas.join(', ')}.\n`,
);
