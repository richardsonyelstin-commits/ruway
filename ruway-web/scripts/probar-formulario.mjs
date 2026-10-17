/**
 * Prueba funcional del formulario, en un navegador real.
 *
 *   npm run preview          (en otra terminal)
 *   npm run probar-formulario
 *
 * POR QUÉ EXISTE
 *   La auditoría estructural, el verificador de enlaces y el de datos
 *   estructurados miran HTML compilado y no abren un navegador. Eso alcanza para
 *   todo el sitio menos para una cosa: el formulario es el único punto del
 *   proyecto donde el JavaScript hace trabajo de verdad. Valida, mueve el foco,
 *   cambia de paso y compone un mensaje. Nada de eso se puede comprobar leyendo
 *   el HTML, y si se rompe, el visitante se queda mirando un botón que no hace
 *   nada.
 *
 *   Además comprueba la promesa central de ADR-022: que el mensaje que se
 *   revisa en pantalla es EXACTAMENTE el que se abre en WhatsApp. Si algún día
 *   divergen, este script lo dice.
 *
 * Requiere el servidor de vista previa en marcha. El navegador y el cliente CDP
 * los pone `scripts/lib/navegador.mjs`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirNavegador, BASE, dormir } from './lib/navegador.mjs';

const PUERTO = 9334;

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const ESPERA_PINTADO = 250;

/**
 * `--capturas` guarda además una imagen de los dos estados que no se pueden
 * fotografiar por URL, porque solo existen después de interactuar: el resumen de
 * errores y el paso de revisión. Sin esta opción la prueba no escribe archivos.
 */
const args = process.argv.slice(2);
const guardarCapturas = args.includes('--capturas');
const indiceSalida = args.indexOf('--salida');
const dirCapturas = resolve(
  RAIZ,
  indiceSalida >= 0 && args[indiceSalida + 1]
    ? args[indiceSalida + 1]
    : join('..', '.openclaw', 'tmp', 'capturas'),
);

const VISTAS_CAPTURA = [
  { nombre: 'movil', ancho: 390, alto: 844, escala: 2, movil: true },
  { nombre: 'escritorio', ancho: 1280, alto: 800, escala: 1, movil: false },
];

/* ------------------------------------------------------------------ informe */
const resultados = [];

function comprobar(nombre, condicion, detalle = '') {
  resultados.push({ nombre, ok: Boolean(condicion), detalle: String(detalle) });
}

/* ------------------------------------------------------------------- proceso */
const { cliente, cerrar } = await abrirNavegador({ puerto: PUERTO, perfil: 'ruway-formulario' });

let erroresDeConsola = [];

try {

  cliente.al('Runtime.exceptionThrown', (params) => {
    erroresDeConsola.push(params.exceptionDetails?.exception?.description ?? 'excepción');
  });

  /** Ejecuta una expresión en la página y devuelve su valor. */
  async function evaluar(expresion) {
    const salida = await cliente.enviar('Runtime.evaluate', {
      expression: expresion,
      returnByValue: true,
      awaitPromise: true,
    });
    if (salida.exceptionDetails) {
      throw new Error(
        salida.exceptionDetails.exception?.description ??
          salida.exceptionDetails.text ??
          'Error al evaluar en la página',
      );
    }
    return salida.result.value;
  }

  async function cargar(ruta) {
    const cargado = cliente.esperar('Page.loadEventFired');
    await cliente.enviar('Page.navigate', { url: new URL(ruta, BASE).href });
    await cargado;
    await dormir(ESPERA_PINTADO);
  }

  /** Fotografía el bloque del formulario en su estado actual, en dos anchos. */
  async function capturarEstado(nombre) {
    if (!guardarCapturas) return;
    mkdirSync(dirCapturas, { recursive: true });

    for (const vista of VISTAS_CAPTURA) {
      await cliente.enviar('Emulation.setDeviceMetricsOverride', {
        width: vista.ancho,
        height: vista.alto,
        deviceScaleFactor: vista.escala,
        mobile: vista.movil,
      });
      await dormir(180);

      const caja = await evaluar(`(() => {
        const bloque = document.querySelector('[data-formulario]');
        const r = bloque.getBoundingClientRect();
        return { y: Math.max(0, r.top + window.scrollY - 32), alto: r.height + 64 };
      })()`);

      const { data } = await cliente.enviar('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
        clip: {
          x: 0,
          y: caja.y,
          width: vista.ancho,
          height: Math.min(caja.alto, 3000),
          scale: 1,
        },
      });

      const archivo = join(dirCapturas, `inscripcion-${nombre}-${vista.nombre}.png`);
      writeFileSync(archivo, Buffer.from(data, 'base64'));
      console.log(`     ↳ ${resolve(archivo)}`);
    }

    await cliente.enviar('Emulation.clearDeviceMetricsOverride');
    await dormir(120);
  }

  /* Utilidades que se inyectan en la página una vez por navegación. */
  const UTILIDADES = `
    window.__p = {
      prefijo: null,
      el(id) { return document.querySelector('#' + this.prefijo + '-' + id); },
      activo() { return document.activeElement ? document.activeElement.id : null; },
      visible(el) { return el && !el.hidden; },
      rellenar(datos) {
        const P = this.prefijo;
        if (datos.intencion !== undefined) {
          const radio = document.querySelector('input[name="' + P + '-intencion"][value="' + datos.intencion + '"]');
          if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
        }
        const texto = (sufijo, valor) => {
          const campo = document.querySelector('#' + P + '-' + sufijo);
          if (!campo) return;
          campo.value = valor;
          campo.dispatchEvent(new Event('input', { bubbles: true }));
          campo.dispatchEvent(new Event('change', { bubbles: true }));
        };
        for (const sufijo of ['nombre', 'whatsapp', 'correo', 'perfil', 'mensaje']) {
          if (datos[sufijo] !== undefined) texto(sufijo, datos[sufijo]);
        }
        if (datos.consent !== undefined) {
          const casilla = document.querySelector('#' + P + '-consent');
          casilla.checked = datos.consent;
          casilla.dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
      enviar() { this.el('campos').querySelector('button[type="submit"]').click(); },
      editar() { document.querySelector('#' + this.prefijo + '-revision [data-accion="editar"]').click(); },
      resumen() {
        const caja = this.el('errores');
        return {
          visible: !caja.hidden,
          cuantos: caja.querySelectorAll('li').length,
          textos: [...caja.querySelectorAll('li')].map((li) => li.textContent.trim()),
          destinos: [...caja.querySelectorAll('a')].map((a) => a.getAttribute('href')),
        };
      },
    };
  `;

  /* ══════════════════════════════ 1 · /inscripcion ══════════════════════════ */
  await cargar('/inscripcion');
  await evaluar(UTILIDADES + `window.__p.prefijo = 'inscripcion';`);

  const inicial = await evaluar(`(() => {
    const p = window.__p;
    return {
      formularios: document.querySelectorAll('[data-formulario]').length,
      camposPresentes: ['intencion','nombre','whatsapp','correo','perfil','mensaje','consent']
        .filter((s) => !!p.el(s)).length,
      revisionOculta: p.el('revision').hidden,
      erroresOcultos: p.el('errores').hidden,
      anclas: ['requisitos','formulario','despues'].filter((a) => !!document.getElementById(a)).length,
      etiquetas: ['nombre','whatsapp','correo','perfil','mensaje']
        .filter((s) => !!document.querySelector('label[for="inscripcion-' + s + '"]')).length,
      autocompletado: {
        nombre: p.el('nombre').getAttribute('autocomplete'),
        whatsapp: p.el('whatsapp').getAttribute('autocomplete'),
        correo: p.el('correo').getAttribute('autocomplete'),
      },
      sinEnvioAutomatico: !document.querySelector('form [onchange]'),
    };
  })()`);

  comprobar('/inscripcion monta un solo formulario', inicial.formularios === 1, inicial.formularios);
  comprobar(
    '/inscripcion tiene los 7 controles',
    inicial.camposPresentes === 7,
    inicial.camposPresentes,
  );
  comprobar('la revisión empieza oculta', inicial.revisionOculta === true);
  comprobar('el resumen de errores empieza oculto', inicial.erroresOcultos === true);
  comprobar('las 3 anclas del sitemap existen', inicial.anclas === 3, inicial.anclas);
  comprobar('los 5 campos tienen <label for>', inicial.etiquetas === 5, inicial.etiquetas);
  comprobar(
    'autocomplete de nombre, teléfono y correo (WCAG 1.3.5)',
    inicial.autocompletado.nombre === 'name' &&
      inicial.autocompletado.whatsapp === 'tel' &&
      inicial.autocompletado.correo === 'email',
    JSON.stringify(inicial.autocompletado),
  );
  comprobar('ningún campo se envía solo al cambiar (WCAG 3.2.2)', inicial.sinEnvioAutomatico);

  const alternativaSinJs = await evaluar(
    `fetch('/inscripcion').then((r) => r.text()).then((t) => ({
       noscript: t.includes('necesita JavaScript activo'),
       canal: t.includes('wa.me/51930736214'),
     }))`,
  );
  comprobar(
    'sin JavaScript se explica y se ofrece WhatsApp',
    alternativaSinJs.noscript && alternativaSinJs.canal,
    JSON.stringify(alternativaSinJs),
  );

  /* ─────────────────── 2 · envío vacío: resumen de errores ─────────────────── */
  await evaluar(`window.__p.enviar()`);
  await dormir(120);

  const vacio = await evaluar(`(() => {
    const p = window.__p;
    return {
      resumen: p.resumen(),
      activo: p.activo(),
      nombreInvalido: p.el('nombre').getAttribute('aria-invalid'),
      errorNombreVisible: !p.el('nombre-error').hidden,
      errorNombreTexto: p.el('nombre-error').textContent.trim(),
      camposVisibles: !p.el('campos').hidden,
      revisionOculta: p.el('revision').hidden,
      estado: p.el('estado').textContent.trim(),
    };
  })()`);

  comprobar('el resumen de errores aparece', vacio.resumen.visible === true);
  comprobar(
    'cuenta los 5 campos obligatorios vacíos',
    vacio.resumen.cuantos === 5,
    vacio.resumen.cuantos,
  );
  comprobar('el foco pasa al resumen de errores', vacio.activo === 'inscripcion-errores', vacio.activo);
  comprobar(
    'cada error enlaza a su campo',
    vacio.resumen.destinos.every((d) => d.startsWith('#inscripcion-')),
    vacio.resumen.destinos.join(' '),
  );
  comprobar('el campo con error queda marcado', vacio.nombreInvalido === 'true', vacio.nombreInvalido);
  comprobar('el error se escribe junto al campo', vacio.errorNombreVisible && vacio.errorNombreTexto.length > 10, vacio.errorNombreTexto);
  comprobar('el formulario NO avanza con errores', vacio.camposVisibles && vacio.revisionOculta);
  comprobar('el estado se anuncia a lectores de pantalla', vacio.estado.length > 0, vacio.estado);

  await capturarEstado('errores');

  /* ─────────────────── 3 · un solo error: el teléfono ─────────────────── */
  await evaluar(`window.__p.rellenar({
    intencion: 'demo',
    nombre: 'Ana Pérez',
    whatsapp: '12345',
    perfil: 'Escolares · 14 a 17 años',
    consent: true,
  })`);
  await evaluar(`window.__p.enviar()`);
  await dormir(120);

  const telefonoMalo = await evaluar(`(() => {
    const p = window.__p;
    return {
      resumen: p.resumen(),
      error: p.el('whatsapp-error').textContent.trim(),
      marca: p.el('whatsapp').getAttribute('aria-invalid'),
      otros: ['nombre','correo','perfil'].map((s) => p.el(s).getAttribute('aria-invalid')),
    };
  })()`);

  comprobar('un solo error cuando el resto está bien', telefonoMalo.resumen.cuantos === 1, telefonoMalo.resumen.cuantos);
  comprobar(
    'el error del teléfono sugiere el formato (WCAG 3.3.3)',
    /9 d\u00edgitos/.test(telefonoMalo.error) && /930 736 214/.test(telefonoMalo.error),
    telefonoMalo.error,
  );
  comprobar('solo se marca el campo que falla', telefonoMalo.marca === 'true' && telefonoMalo.otros.every((v) => v === null));

  /* ─────────────────── 4 · envío válido: paso de revisión ─────────────────── */
  await evaluar(`window.__p.rellenar({
    intencion: 'matricula',
    nombre: 'Ana Pérez',
    whatsapp: '+51 930 736 214',
    correo: 'ana@ejemplo.com',
    perfil: 'Escolares · 14 a 17 años',
    mensaje: 'Escribo por mi hija, tiene 15 años.',
    consent: true,
  })`);
  await evaluar(`window.__p.enviar()`);
  await dormir(120);

  const revision = await evaluar(`(() => {
    const p = window.__p;
    const enlace = p.el('abrir');
    const mensaje = p.el('vista-previa').textContent;
    const url = new URL(enlace.href);
    return {
      visible: !p.el('revision').hidden,
      camposOcultos: p.el('campos').hidden,
      activo: p.activo(),
      mensaje,
      enlace: enlace.href,
      destino: url.origin + url.pathname,
      enviadoEnUrl: url.searchParams.get('text'),
      estado: p.el('estado').textContent.trim(),
      resumenOculto: p.el('errores').hidden,
      nuevaPestana: enlace.getAttribute('target') === '_blank',
      noopener: (enlace.getAttribute('rel') || '').includes('noopener'),
    };
  })()`);

  comprobar('el paso de revisión aparece', revision.visible === true);
  comprobar('los campos se retiran mientras se revisa', revision.camposOcultos === true);
  comprobar('el foco pasa al paso de revisión', revision.activo === 'inscripcion-revision', revision.activo);
  comprobar('los errores anteriores se limpian', revision.resumenOculto === true);
  comprobar('la revisión dice que aún no se envió nada', /no se ha enviado/.test(revision.estado), revision.estado);

  comprobar(
    'el mensaje abre wa.me con el número del sitio',
    revision.destino === 'https://wa.me/51930736214',
    revision.destino,
  );
  comprobar(
    'el mensaje revisado es EXACTAMENTE el que se envía (ADR-022)',
    revision.enviadoEnUrl === revision.mensaje,
    JSON.stringify({ revisado: revision.mensaje, enviado: revision.enviadoEnUrl }),
  );
  comprobar(
    'el teléfono se normaliza a 9 dígitos',
    /WhatsApp: 930 736 214/.test(revision.mensaje),
    revision.mensaje,
  );
  comprobar(
    'la intención elegida encabeza el mensaje',
    /matricularme/.test(revision.mensaje.split('\n')[0]),
    revision.mensaje.split('\n')[0],
  );
  comprobar(
    'los campos opcionales vacíos no se escriben',
    !/Correo: *$/m.test(revision.mensaje) && !/Mensaje: *$/m.test(revision.mensaje),
  );
  comprobar('el enlace abre en otra pestaña con noopener', revision.nuevaPestana && revision.noopener);

  await capturarEstado('revision');

  /* ─────────────────── 5 · volver a editar conserva los datos ─────────────────── */
  await evaluar(`window.__p.editar()`);
  await dormir(120);

  const vuelta = await evaluar(`(() => {
    const p = window.__p;
    return {
      camposVisibles: !p.el('campos').hidden,
      revisionOculta: p.el('revision').hidden,
      activo: p.activo(),
      activoEtiqueta: document.activeElement ? document.activeElement.tagName : null,
      nombre: p.el('nombre').value,
      intencion: document.querySelector('input[name="inscripcion-intencion"]:checked').value,
    };
  })()`);

  comprobar('«volver a editar» recupera el formulario', vuelta.camposVisibles && vuelta.revisionOculta);
  comprobar(
    'el foco vuelve al botón de revisar',
    vuelta.activo === 'inscripcion-revisar' && vuelta.activoEtiqueta === 'BUTTON',
    `${vuelta.activoEtiqueta}:${vuelta.activo}`,
  );
  comprobar('los datos escritos se conservan', vuelta.nombre === 'Ana Pérez' && vuelta.intencion === 'matricula', JSON.stringify(vuelta));

  /* ─────────────────── 6 · confirmar lleva a /gracias (ADR-022) ─────────────────── */
  await evaluar(`window.__p.enviar()`);
  await dormir(120);

  let rutaTrasConfirmar = '(sin navegación)';
  try {
    const cargado = cliente.esperar('Page.loadEventFired');
    await evaluar(`window.__p.el('abrir').click()`);
    await Promise.race([cargado, dormir(5000)]);
    await dormir(400);
    rutaTrasConfirmar = await evaluar(`location.pathname`);
  } catch (error) {
    rutaTrasConfirmar = `error: ${error.message}`;
  }

  comprobar(
    'al confirmar, esta pestaña pasa a /gracias',
    rutaTrasConfirmar === '/gracias',
    rutaTrasConfirmar,
  );

  /* ─────────────────── 6 · intención preseleccionada por URL ─────────────────── */
  for (const intencion of ['demo', 'matricula']) {
    await cargar(`/inscripcion?intencion=${intencion}`);
    const marcada = await evaluar(`(() => {
      const r = document.querySelector('input[name="inscripcion-intencion"]:checked');
      return r ? r.value : null;
    })()`);
    comprobar(`?intencion=${intencion} marca su opción`, marcada === intencion, marcada);
  }

  await cargar('/inscripcion?intencion=loquesea');
  const sinInventar = await evaluar(
    `document.querySelector('input[name="inscripcion-intencion"]:checked') === null`,
  );
  comprobar('un valor desconocido no marca nada', sinInventar === true);

  /* ══════════════════════════════ 7 · /contacto ══════════════════════════════ */
  await cargar('/contacto');
  const contacto = await evaluar(`(() => {
    const raiz = document.querySelector('[data-formulario]');
    return {
      prefijo: raiz?.dataset.prefijo ?? null,
      campos: !!document.getElementById('contacto-nombre'),
      canalesDirectos: [...document.querySelectorAll('#formulario a')].some(
        (a) => a.textContent.trim() === 'Escribir por WhatsApp',
      ),
      mapa: !!document.getElementById('mapa'),
      formularioEnAncla: !!document.querySelector('#formulario [data-formulario]'),
    };
  })()`);

  comprobar('el formulario está en /contacto con su propio prefijo', contacto.prefijo === 'contacto' && contacto.campos, JSON.stringify(contacto));
  comprobar('el formulario vive dentro de #formulario', contacto.formularioEnAncla === true);
  comprobar('los canales directos siguen ahí', contacto.canalesDirectos === true);

  /* ══════════════════════════════ 8 · /gracias ══════════════════════════════ */
  await cargar('/gracias');
  const gracias = await evaluar(`(() => ({
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
    h1: document.querySelectorAll('h1').length,
    whatsapp: [...document.querySelectorAll('a')].some((a) => a.href.startsWith('https://wa.me/')),
    volver: [...document.querySelectorAll('a')].some((a) => a.getAttribute('href') === '/'),
    formulario: document.querySelectorAll('[data-formulario]').length,
  }))()`);

  comprobar('«/gracias» es noindex, follow', /noindex/.test(gracias.robots ?? '') && /follow/.test(gracias.robots ?? ''), gracias.robots);
  comprobar('«/gracias» tiene un solo <h1>', gracias.h1 === 1, gracias.h1);
  comprobar('«/gracias» recupera el canal de WhatsApp', gracias.whatsapp === true);
  comprobar('«/gracias» tiene retorno al embudo', gracias.volver === true);
  comprobar('«/gracias» no repite el formulario', gracias.formulario === 0);

  comprobar(
    'ninguna página lanzó errores de JavaScript',
    erroresDeConsola.length === 0,
    erroresDeConsola.join(' | '),
  );
} finally {
  await cerrar();
}

/* ------------------------------------------------------------------ informe */
const fallos = resultados.filter((r) => !r.ok);

console.log(`\nFormulario · ${resultados.length} comprobación(es)\n${'─'.repeat(58)}`);
for (const r of resultados) {
  console.log(`  ${r.ok ? '✓' : '✖'} ${r.nombre}${r.ok ? '' : `  →  ${r.detalle}`}`);
}

if (fallos.length) {
  console.log(`\n✖  ${fallos.length} comprobación(es) fallida(s).\n`);
  process.exit(1);
}

console.log('\n✓  El formulario se comporta como está documentado.\n');
