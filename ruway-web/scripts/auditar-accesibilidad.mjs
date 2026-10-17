/**
 * Auditoría de accesibilidad en navegador real: axe-core + teclado + reflujo.
 *
 *   npm run preview            (en otra terminal)
 *   npm run auditar-a11y
 *   npm run auditar-a11y -- --url /precios
 *   npm run auditar-a11y -- --solo axe
 *   npm run auditar-a11y -- --json ../.openclaw/tmp/a11y.json
 *
 * POR QUÉ EXISTE
 *   Los tres verificadores de `npm run verificar` leen HTML compilado y no ven
 *   nada de lo que depende del cálculo de estilos: el contraste real de cada
 *   combinación de tema, el indicador de foco, el desborde horizontal a 320 px.
 *   axe-core tampoco está detrás de ellos. Esta auditoría cierra ese hueco y es
 *   la que sostiene el `accessibility-report.md`.
 *
 * QUÉ COMPRUEBA
 *   1 · axe-core sobre las 13 páginas × 2 temas × 2 tamaños (52 pasadas).
 *       Las violaciones con etiqueta WCAG son la barrera; las de «best-practice»
 *       se informan aparte y no tumban la auditoría.
 *   2 · axe-core sobre los dos estados del formulario que no existen por URL:
 *       el resumen de errores y el paso de revisión.
 *   3 · Teclado de verdad (eventos Tab reales): el primer Tab llega al enlace de
 *       salto, cada parada tiene indicador de foco propio o en su tarjeta, no
 *       hay trampa y la cabecera fija no tapa el elemento enfocado (2.4.11).
 *   4 · Reflujo: 320 px y texto al 200 % sin desborde horizontal (1.4.10/1.4.4).
 *
 * Requiere el servidor de vista previa en marcha. El navegador y el cliente CDP
 * los pone `scripts/lib/navegador.mjs`.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirNavegador, BASE, dormir, emular, evaluar, irA } from './lib/navegador.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUERTO = 9335;

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

const VISTAS = [
  { nombre: 'móvil 390', ancho: 390, alto: 844, movil: true },
  { nombre: 'escritorio 1280', ancho: 1280, alto: 800, movil: false },
];

/** Anchos extremos: reflujo a 320 px y texto al 200 % (pantalla de 640 px). */
const VISTAS_EXTREMAS = [
  { nombre: '320 px', ancho: 320, alto: 1024 },
  { nombre: '200 % · 640 px', ancho: 640, alto: 800 },
];

const TEMAS = ['claro', 'oscuro'];

/** Tope de paradas del recorrido de teclado. El pie solo ya tiene ~20 enlaces. */
const TOPE_TABULACION = 90;

/* ------------------------------------------------------------------ opciones */
const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : porDefecto;
};

const soloRuta = opcion('url', null);
const soloBloque = opcion('solo', null);
const rutaJson = opcion('json', null);
/** Lista cada parada del recorrido de teclado. Para depurar la propia prueba. */
const conDetalle = args.includes('--detalle');

const rutas = soloRuta ? [soloRuta] : RUTAS;
const bloque = (nombre) => !soloBloque || soloBloque === nombre;

const FUENTE_AXE = readFileSync(join(RAIZ, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');

/* ------------------------------------------------------------------ informe */
const problemas = [];

function anotar(gravedad, mensaje, detalle = '') {
  problemas.push({ gravedad, mensaje, detalle: String(detalle) });
}

/** axe-core en todas las páginas que se carguen a partir de ahora. */
async function registrarAxe(cliente) {
  await cliente.enviar('Page.addScriptToEvaluateOnNewDocument', { source: FUENTE_AXE });
}

/**
 * Red de seguridad: si por lo que sea `window.axe` no está cuando toca medir,
 * se inyecta a mano en el documento actual antes de rendirse.
 */
async function inyectarAxe(cliente) {
  const hay = await evaluar(cliente, () => typeof window.axe !== 'undefined');
  if (!hay) await cliente.enviar('Runtime.evaluate', { expression: FUENTE_AXE });
}

/**
 * Corre axe-core sobre el documento y clasifica lo que encuentra.
 * Las violaciones con etiqueta `wcag*` son barrera; el resto es informativo.
 */
async function correrAxe(cliente) {
  return evaluar(cliente, async () => {
    const informe = await window.axe.run(document, {
      resultTypes: ['violations'],
      elementRef: false,
    });

    const recortar = (v) => ({
      id: v.id,
      impacto: v.impact,
      ayuda: v.help,
      criterios: v.tags.filter((t) => /^wcag/.test(t)),
      nodos: v.nodes.map((n) => ({
        destino: n.target.join(' '),
        fragmento: n.html.length > 140 ? `${n.html.slice(0, 140)}…` : n.html,
        resumen: (n.failureSummary ?? '').replace(/\s+/g, ' '),
      })),
    });

    return {
      violaciones: informe.violations.map(recortar),
      incompletas: informe.incomplete.map((v) => ({ id: v.id, nodos: v.nodes.length })),
      // Prueba de que axe miró algo y no se quedó en blanco por un fallo de carga.
      reglasWcag: window.axe.getRules(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).length,
      reglasTotales: window.axe.getRules().length,
      elementos: document.querySelectorAll('*').length,
    };
  });
}

/** Registra las violaciones de una pasada de axe. Devuelve cuántas hay por WCAG. */
function registrar(pasada, informe) {
  const wcag = informe.violaciones.filter((v) => v.criterios.length);
  const otras = informe.violaciones.filter((v) => !v.criterios.length);

  for (const v of wcag) {
    anotar(
      'error',
      `axe · ${v.id} (${v.criterios.join(', ')}) en ${pasada}`,
      v.nodos.map((n) => `${n.destino} → ${n.resumen}`).join(' ǀ '),
    );
  }

  for (const v of otras) {
    anotar('aviso', `axe · best-practice ${v.id} en ${pasada}`, v.nodos.length + ' nodo(s)');
  }

  return wcag.length;
}

/* --------------------------------------------------------------- 1 · axe-core */
const resumenAxe = { pasadas: 0, violaciones: 0, avisos: 0, reglasWcag: 0, reglasTotales: 0 };

async function bloqueAxe(cliente) {
  console.log(`\n1 · axe-core · ${rutas.length} página(s) × ${TEMAS.length} temas × ${VISTAS.length} tamaños\n`);

  for (const ruta of rutas) {
    const filas = [];

    for (const vista of VISTAS) {
      for (const tema of TEMAS) {
        await emular(cliente, { ...vista, escala: 1, tema });
        await irA(cliente, new URL(ruta, BASE).href, { espera: 350 });
        await inyectarAxe(cliente);

        const informe = await correrAxe(cliente);
        const wcag = registrar(`${ruta} · ${vista.nombre} · ${tema}`, informe);

        resumenAxe.pasadas++;
        resumenAxe.violaciones += wcag;
        resumenAxe.avisos += informe.violaciones.length - wcag;
        resumenAxe.reglasWcag = informe.reglasWcag;
        resumenAxe.reglasTotales = informe.reglasTotales;
        filas.push(`${vista.nombre}/${tema}: ${wcag === 0 ? '✓' : `✖ ${wcag}`}`);
      }
    }

    console.log(`  ${ruta.padEnd(24)} ${filas.join('   ')}`);
  }

  console.log(
    `\n  ${resumenAxe.pasadas} pasadas · ${resumenAxe.reglasWcag} reglas WCAG de ${resumenAxe.reglasTotales} ` +
      `evaluadas · ${resumenAxe.violaciones} violación(es) WCAG · ${resumenAxe.avisos} aviso(s) de buenas prácticas`,
  );
}

/* ------------------------------------------------- 2 · estados del formulario */
async function bloqueFormulario(cliente) {
  console.log('\n2 · axe-core · estados del formulario\n');

  const UTILIDADES = `(() => {
    const raiz = document.querySelector('[data-formulario]');
    const P = raiz.dataset.prefijo;
    const texto = (sufijo, valor) => {
      const campo = document.getElementById(P + '-' + sufijo);
      if (!campo) return;
      campo.value = valor;
      campo.dispatchEvent(new Event('input', { bubbles: true }));
      campo.dispatchEvent(new Event('change', { bubbles: true }));
    };
    window.__f = { raiz, P, texto };
  })()`;

  for (const ruta of ['/inscripcion', '/contacto']) {
    await emular(cliente, { ancho: 1280, alto: 900, escala: 1, movil: false, tema: 'claro' });
    await irA(cliente, new URL(ruta, BASE).href, { espera: 350 });

    // Estado de error: se envía en blanco a propósito.
    await evaluar(cliente, () => document.querySelector('[data-formulario] button[type="submit"]').click());
    await dormir(200);
    await inyectarAxe(cliente);
    const error = await correrAxe(cliente);
    const wcagError = registrar(`${ruta} · resumen de errores`, error);

    // Estado de revisión: el formulario completo, ya validado.
    await evaluar(
      cliente,
      (utilidades) => {
        eval(utilidades);
        const P = window.__f.P;
        for (const [sufijo, valor] of Object.entries({
          nombre: 'Ana Quispe',
          whatsapp: '930 736 214',
          correo: 'ana@ejemplo.com',
          perfil: 'Escolares · 14 a 17 años',
          mensaje: 'Quiero inscribirme en el Ciclo 1.',
        })) {
          window.__f.texto(sufijo, valor);
        }
        if (!document.querySelector(`input[name="${P}-intencion"]:checked`)) {
          const radio = document.querySelector(`input[name="${P}-intencion"]`);
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const casilla = document.getElementById(P + '-consent');
        casilla.checked = true;
        casilla.dispatchEvent(new Event('change', { bubbles: true }));
        document.querySelector('[data-formulario] button[type="submit"]').click();
      },
      [UTILIDADES],
    );
    await dormir(250);

    const enRevision = await evaluar(
      cliente,
      () => document.getElementById(document.querySelector('[data-formulario]').dataset.prefijo + '-revision').hidden === false,
    );
    if (!enRevision) anotar('error', `no se llegó al paso de revisión en ${ruta}`);

    await inyectarAxe(cliente);
    const revision = await correrAxe(cliente);
    const wcagRevision = registrar(`${ruta} · paso de revisión`, revision);

    console.log(
      `  ${ruta.padEnd(16)} errores: ${wcagError === 0 ? '✓' : `✖ ${wcagError}`}` +
        `   revisión: ${wcagRevision === 0 ? '✓' : `✖ ${wcagRevision}`}`,
    );
  }
}

/* ---------------------------------------------------------- 3 · teclado real */
/** Pulsa Tab de verdad: Chrome mueve el foco él mismo, no la página. */
async function pulsarTab(cliente) {
  const tecla = { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 };
  await cliente.enviar('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...tecla });
  await cliente.enviar('Input.dispatchKeyEvent', { type: 'keyUp', ...tecla });
}

const resumenTeclado = { paradas: 0, sinIndicador: [], tapadas: [], trampas: [], primeros: [] };

/**
 * Espera a que la parada se asiente antes de medirla.
 *
 * Hace falta de verdad: `html { scroll-behavior: smooth }` anima el
 * desplazamiento hasta el control, y el enlace de salto entra con una
 * transición de `top`. Midiendo a los 40 ms se veían a mitad de camino y
 * parecían tapados por la cabecera cuando en realidad iban llegando.
 */
async function esperarAsentamiento(cliente) {
  let anterior = null;

  for (let intento = 0; intento < 14; intento++) {
    const caja = await evaluar(cliente, () => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      return { y: Math.round(window.scrollY), arriba: Math.round(r.top), izquierda: Math.round(r.left) };
    });

    const clave = JSON.stringify(caja);
    if (clave === anterior) return;
    anterior = clave;
    await dormir(50);
  }
}

async function bloqueTeclado(cliente) {
  console.log(`\n3 · teclado real (Tab) · ${rutas.length} página(s)\n`);

  // Con la página emulada como enfocada, Chrome entrega los eventos de tecla.
  await cliente.enviar('Emulation.setFocusEmulationEnabled', { enabled: true });

  for (const ruta of rutas) {
    await emular(cliente, { ancho: 1280, alto: 800, escala: 1, movil: false, tema: 'claro' });
    await irA(cliente, new URL(ruta, BASE).href, { espera: 350 });

    // Línea base: cómo se ve cada enfocable SIN foco. Se mide ahora, cuando
    // nada está enfocado; después ya no habría forma de saberlo.
    const base = await evaluar(cliente, (selector, tope) => {
      const leer = (el) => {
        const s = getComputedStyle(el);
        return [
          s.outlineStyle,
          s.outlineWidth,
          s.outlineColor,
          s.boxShadow,
          s.backgroundColor,
          s.borderTopColor,
          s.borderRightColor,
          s.borderBottomColor,
          s.borderLeftColor,
          s.color,
          s.textDecorationLine,
        ].join('|');
      };
      // El anillo puede estar en la tarjeta que envuelve al control —el radio
      // y la casilla del formulario lo hacen así—, de modo que la firma abarca
      // el elemento y sus dos ancestros más cercanos.
      const firma = (el) => {
        const partes = [];
        let n = el;
        while (n && n.tagName !== 'BODY' && partes.length < 3) {
          partes.push(leer(n));
          n = n.parentElement;
        }
        return partes;
      };

      window.__k = { firma };
      const visibles = [...document.querySelectorAll(selector)]
        .filter((el) => el.getClientRects().length)
        .slice(0, tope * 3);

      return visibles.map((el, i) => {
        el.dataset.kFoco = String(i);
        return {
          i,
          id: el.id || null,
          etiqueta: el.tagName,
          firma: firma(el),
        };
      });
    }, [
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      TOPE_TABULACION,
    ]);

    const mapa = new Map(base.map((b) => [b.i, b]));
    const recorrido = [];
    let tope = false;

    for (let paso = 0; paso < TOPE_TABULACION; paso++) {
      await pulsarTab(cliente);
      await esperarAsentamiento(cliente);

      const parada = await evaluar(cliente, () => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;

        const r = el.getBoundingClientRect();

        // Foco no oscurecido (WCAG 2.4.11): lo que decide no es la geometría
        // —la cabecera es fija y todo pasa por debajo en algún momento— sino
        // quién se pinta encima. `elementFromPoint` lo dice sin ambigüedad.
        //
        // Se muestrean las cajas de LÍNEA, no la caja envolvente: un enlace
        // que rompe en dos líneas tiene de rectángulo la unión de las dos, y
        // su centro cae en el hueco entre ambas —fuera del enlace— aunque esté
        // perfectamente visible.
        const cajas = [...el.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
        const puntos = [];
        for (const caja of cajas.slice(0, 8)) {
          for (const fraccion of [0.5, 0.25, 0.75]) {
            puntos.push([caja.left + caja.width * fraccion, caja.top + caja.height / 2]);
          }
        }

        let dentro = 0;
        let alcanzable = false;
        let quienTapa = null;
        for (const [x, y] of puntos) {
          if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) continue;
          dentro++;
          const encima = document.elementFromPoint(x, y);
          if (encima && (encima === el || el.contains(encima))) alcanzable = true;
          else if (encima && !quienTapa) {
            const clases =
              typeof encima.className === 'string' && encima.className.trim()
                ? `.${encima.className.trim().split(/\s+/).slice(0, 3).join('.')}`
                : '';
            quienTapa = `${encima.tagName.toLowerCase()}${encima.id ? `#${encima.id}` : ''}${clases}`;
          }
        }

        return {
          indice: el.dataset.kFoco === undefined ? null : Number(el.dataset.kFoco),
          id: el.id || null,
          etiqueta: el.tagName,
          texto: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40),
          firma: window.__k.firma(el),
          visible: alcanzable,
          fueraDeVista: dentro === 0,
          quienTapa,
          caja: `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}×${Math.round(r.height)}`,
          arriba: Math.round(r.top),
        };
      });

      if (!parada) break;
      // Identidad real de la parada: el `id` no sirve —media docena de enlaces
      // del pie no lo tienen y todos se parecerían entre sí.
      parada.huella = `${parada.indice ?? 'x'}|${parada.etiqueta}|${parada.texto}|${parada.arriba}`;
      recorrido.push(parada);

      // Trampa de teclado: tres Tabs seguidos sobre el mismo control.
      const n = recorrido.length;
      if (n >= 3 && recorrido[n - 1].huella === recorrido[n - 2].huella && recorrido[n - 1].huella === recorrido[n - 3].huella) {
        resumenTeclado.trampas.push(`${ruta} · ${parada.id ?? `${parada.etiqueta} «${parada.texto}»`}`);
        break;
      }
      // Ciclo cerrado: se volvió al primer control sin haber llegado al final.
      if (n > 2 && parada.huella === recorrido[0].huella) {
        tope = true;
        break;
      }

      // Indicador de foco (WCAG 2.4.7): algo en la firma tiene que cambiar.
      const referencia = parada.indice === null ? null : mapa.get(parada.indice);
      if (referencia && !parada.firma.some((valor, k) => valor !== referencia.firma[k])) {
        resumenTeclado.sinIndicador.push(`${ruta} · ${parada.id ?? parada.etiqueta} (${parada.texto.slice(0, 30)})`);
      }

      // Foco no oscurecido (WCAG 2.4.11).
      if (!parada.visible) {
        const donde = `${ruta} · ${parada.id ?? `${parada.etiqueta} «${parada.texto}»`}`;
        const culpa = parada.fueraDeVista
          ? 'fuera de la vista'
          : `lo tapa ${parada.quienTapa ?? 'algo'} · caja ${parada.caja}`;
        resumenTeclado.tapadas.push(`${donde} (${culpa})`);
      }
    }

    resumenTeclado.paradas += recorrido.length;

    const primero = recorrido[0];
    const salto = primero && /saltar/i.test(`${primero.texto} ${primero.id ?? ''}`);
    if (!salto) {
      resumenTeclado.primeros.push(`${ruta} · el primer Tab llega a ${primero?.id ?? primero?.etiqueta ?? 'nada'}`);
    }

    console.log(
      `  ${ruta.padEnd(24)} ${String(recorrido.length).padStart(3)} parada(s)  ` +
        `${salto ? '✓ enlace de salto' : '✖ primer Tab'}${tope ? '  (ciclo cerrado)' : ''}`,
    );

    if (conDetalle) {
      for (const [i, p] of recorrido.entries()) {
        console.log(
          `        ${String(i + 1).padStart(3)}. <${p.etiqueta.toLowerCase()}${p.id ? ` #${p.id}` : ''}> ` +
            `${p.texto.slice(0, 46)}${p.visible ? '' : '   ← NO VISIBLE'}`,
        );
      }
    }
  }

  for (const t of resumenTeclado.trampas) anotar('error', `trampa de teclado · ${t}`);
  for (const t of resumenTeclado.sinIndicador) anotar('error', `sin indicador de foco · ${t}`);
  for (const t of resumenTeclado.tapadas) anotar('error', `foco tapado por la cabecera · ${t}`);
  for (const t of resumenTeclado.primeros) anotar('error', `el primer Tab no llega al enlace de salto · ${t}`);

  console.log(
    `\n  ${resumenTeclado.paradas} paradas · ${resumenTeclado.sinIndicador.length} sin indicador · ` +
      `${resumenTeclado.tapadas.length} tapadas · ${resumenTeclado.trampas.length} trampa(s) e ` +
      `${resumenTeclado.primeros.length} página(s) sin enlace de salto primero`,
  );
}

/* --------------------------------------------------------------- 4 · reflujo */
async function bloqueReflujo(cliente) {
  console.log('\n4 · reflujo y zoom\n');

  for (const ruta of rutas) {
    const lecturas = [];

    for (const vista of VISTAS_EXTREMAS) {
      await emular(cliente, { ...vista, escala: 1, movil: vista.ancho <= 400, tema: 'claro' });
      await irA(cliente, new URL(ruta, BASE).href, { espera: 300 });

      const desborde = await evaluar(cliente, () => {
        const d = document.documentElement;
        const ancho = d.clientWidth;
        const culpables = [...document.querySelectorAll('body *')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.right > ancho + 1;
          })
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}`);

        return { ancho, scroll: d.scrollWidth, culpables };
      });

      const hayDesborde = desborde.scroll > desborde.ancho + 1;
      if (hayDesborde) {
        anotar(
          'error',
          `desborde horizontal a ${vista.nombre} en ${ruta}`,
          `${desborde.scroll} > ${desborde.ancho} px · ${desborde.culpables.join(', ')}`,
        );
      }
      lecturas.push(`${vista.nombre}: ${hayDesborde ? '✖' : '✓'}`);
    }

    console.log(`  ${ruta.padEnd(24)} ${lecturas.join('   ')}`);
  }
}

/* ------------------------------------------------------------------- proceso */
const { cliente, cerrar } = await abrirNavegador({ puerto: PUERTO, perfil: 'ruway-a11y' });

try {
  if (bloque('axe') || bloque('formulario')) await registrarAxe(cliente);

  if (bloque('axe')) await bloqueAxe(cliente);
  if (bloque('formulario')) await bloqueFormulario(cliente);
  if (bloque('teclado')) await bloqueTeclado(cliente);
  if (bloque('reflujo')) await bloqueReflujo(cliente);
} finally {
  await cerrar();
}

/* ------------------------------------------------------------------ resultado */
const errores = problemas.filter((p) => p.gravedad === 'error');
const avisos = problemas.filter((p) => p.gravedad === 'aviso');

if (rutaJson) {
  const destino = resolve(RAIZ, rutaJson);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(
    destino,
    JSON.stringify({ fecha: new Date().toISOString(), resumenAxe, resumenTeclado, problemas }, null, 2),
  );
  console.log(`\nInforme JSON en ${destino}`);
}

console.log(`\nAccesibilidad · ${errores.length} error(es) · ${avisos.length} aviso(s)`);
console.log('─'.repeat(58));
for (const p of problemas) console.log(`  ${p.gravedad === 'error' ? '✖' : '·'} ${p.mensaje}`);

if (errores.length) {
  console.log('\nDetalle de los errores:\n');
  for (const p of errores) console.log(`  ${p.mensaje}\n     ${p.detalle}\n`);
  console.log(`\n✖  ${errores.length} problema(s) de accesibilidad.\n`);
  process.exit(1);
}

console.log('\n✓  Sin violaciones de WCAG 2.2 AA, con teclado y a 320 px.\n');
