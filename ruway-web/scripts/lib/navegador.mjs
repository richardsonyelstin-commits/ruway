/**
 * Navegador real para los scripts de comprobación, sin dependencias.
 *
 * POR QUÉ EXISTE
 *   Tres scripts —capturar, probar-formulario y ahora los dos auditores— abren
 *   Chrome por el protocolo de herramientas de desarrollo (CDP). Hasta el
 *   incremento 3.5 cada uno llevaba su propia copia del mismo bloque de cien
 *   líneas: el mismo cliente de mensajes, las mismas banderas, la misma espera
 *   del puerto. Cuatro copias de un cliente de protocolo es cuatro sitios donde
 *   arreglar el mismo fallo, así que en el 3.6 se movió aquí.
 *
 *   Sigue sin haber dependencias: se usan `fetch` y `WebSocket` nativos de Node.
 *
 * USO
 *   const { cliente, cerrar } = await abrirNavegador({ puerto: 9333 });
 *   try { ... } finally { await cerrar(); }
 */
import { spawn } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** `astro preview` escucha en ::1; con 127.0.0.1 la conexión se rechaza. */
export const BASE = 'http://localhost:4321';

export const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** Busca un Chrome o un Edge instalado. `CHROME_PATH` tiene la última palabra. */
export function buscarNavegador() {
  const candidatos = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);

  for (const c of candidatos) if (existsSync(c)) return c;
  throw new Error('No se encontró Chrome ni Edge. Define la variable CHROME_PATH.');
}

/**
 * Cliente CDP mínimo sobre un WebSocket.
 *   enviar(método, params)  → pide algo y espera su respuesta
 *   esperar(método)         → espera UN evento de ese tipo (promesa de un solo uso)
 *   al(método, oyente)      → escucha todos los eventos de ese tipo
 */
export function clienteCdp(ws) {
  let siguienteId = 0;
  const pendientes = new Map();
  const esperas = new Map();
  const oyentes = new Map();

  ws.addEventListener('message', (evento) => {
    const mensaje = JSON.parse(evento.data);

    if (mensaje.id && pendientes.has(mensaje.id)) {
      const { resolver, rechazar } = pendientes.get(mensaje.id);
      pendientes.delete(mensaje.id);
      if (mensaje.error) rechazar(new Error(mensaje.error.message));
      else resolver(mensaje.result);
      return;
    }

    if (mensaje.method && esperas.has(mensaje.method)) {
      const lista = esperas.get(mensaje.method);
      esperas.delete(mensaje.method);
      for (const oyente of lista) oyente(mensaje.params);
    }

    for (const oyente of oyentes.get(mensaje.method) ?? []) oyente(mensaje.params);
  });

  const enviar = (method, params = {}) =>
    new Promise((resolver, rechazar) => {
      const id = ++siguienteId;
      pendientes.set(id, { resolver, rechazar });
      ws.send(JSON.stringify({ id, method, params }));
    });

  const esperar = (method) =>
    new Promise((resolver) => {
      const lista = esperas.get(method) ?? [];
      lista.push(resolver);
      esperas.set(method, lista);
    });

  /** Suscripción permanente (errores de consola: no tienen fin predecible). */
  const al = (method, oyente) => {
    const lista = oyentes.get(method) ?? [];
    lista.push(oyente);
    oyentes.set(method, lista);
  };

  return { enviar, esperar, al };
}

async function esperarDevtools(puerto) {
  for (let intento = 0; intento < 80; intento++) {
    try {
      if ((await fetch(`http://127.0.0.1:${puerto}/json/version`)).ok) return;
    } catch {
      /* todavía no escucha */
    }
    await dormir(150);
  }
  throw new Error('El navegador no abrió el puerto de depuración a tiempo.');
}

/**
 * Abre Chrome en modo headless y deja lista una pestaña nueva con `Page` y
 * `Runtime` activados. Cada script usa un puerto distinto: dos Chrome con el
 * mismo puerto de depuración se pisan.
 *
 * @param {object}  opciones
 * @param {number}  opciones.puerto      puerto de depuración
 * @param {string}  opciones.perfil      nombre del perfil temporal
 * @param {string[]} opciones.argumentos banderas adicionales
 * @param {boolean} opciones.pestana     false si el cliente externo (Lighthouse)
 *                                       abre la pestaña por su cuenta
 */
export async function abrirNavegador({
  puerto = 9333,
  perfil = 'ruway',
  argumentos = [],
  pestana = true,
} = {}) {
  const ejecutable = buscarNavegador();
  const carpetaPerfil = join(tmpdir(), `${perfil}-${Date.now()}`);

  const proceso = spawn(
    ejecutable,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      ...argumentos,
      `--remote-debugging-port=${puerto}`,
      `--user-data-dir=${carpetaPerfil}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  await esperarDevtools(puerto);

  let cliente = null;

  if (pestana) {
    const objetivo = await (
      await fetch(`http://127.0.0.1:${puerto}/json/new?about:blank`, { method: 'PUT' })
    ).json();

    const ws = new WebSocket(objetivo.webSocketDebuggerUrl);
    await new Promise((resolver, rechazar) => {
      ws.addEventListener('open', resolver, { once: true });
      ws.addEventListener('error', () => rechazar(new Error('No se pudo abrir CDP')), { once: true });
    });

    cliente = clienteCdp(ws);
    await cliente.enviar('Page.enable');
    await cliente.enviar('Runtime.enable');
  }

  /** Cierra el navegador y borra el perfil temporal. */
  const cerrar = async () => {
    try {
      await cliente?.enviar('Browser.close');
    } catch {
      /* el navegador ya puede estar cerrado */
    }
    proceso.kill();
    await dormir(300);
    rmSync(carpetaPerfil, { recursive: true, force: true });
  };

  return { cliente, proceso, cerrar, puerto, perfil: carpetaPerfil };
}

/**
 * Cambia el tamaño del dispositivo, el tema y el movimiento reducido.
 * `Emulation.setDeviceMetricsOverride` es la única forma de bajar de 500 px:
 * Chrome en Windows no acepta ventanas tan estrechas.
 */
export async function emular(cliente, { ancho, alto, escala = 1, movil = false, tema = 'claro' }) {
  await cliente.enviar('Emulation.setDeviceMetricsOverride', {
    width: ancho,
    height: alto,
    deviceScaleFactor: escala,
    mobile: movil,
  });
  await cliente.enviar('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-color-scheme', value: tema === 'oscuro' ? 'dark' : 'light' },
      // Capturas y auditorías estables: sin animaciones de entrada a medio camino.
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ],
  });
}

/** Navega y espera a que la página termine de cargar y de pintar. */
export async function irA(cliente, url, { espera = 500 } = {}) {
  const cargado = cliente.esperar('Page.loadEventFired');
  await cliente.enviar('Page.navigate', { url });
  await cargado;
  await dormir(espera);
}

/** Alto real del documento. `Page.getLayoutMetrics` devuelve el del viewport. */
export async function altoDeLaPagina(cliente) {
  const medida = await cliente.enviar('Runtime.evaluate', {
    expression: `(() => {
      const d = document.documentElement;
      const b = document.body;
      return Math.max(d.scrollHeight, b.scrollHeight, d.offsetHeight, b.offsetHeight, d.clientHeight, b.clientHeight);
    })()`,
    returnByValue: true,
  });
  return Number(medida.result.value) || 0;
}

/**
 * Evalúa una función en la página y devuelve su resultado.
 * El valor viaja como JSON: nada de `returnByValue` con objetos raros.
 */
export async function evaluar(cliente, funcion, argumentos = []) {
  const respuesta = await cliente.enviar('Runtime.evaluate', {
    expression: `(${funcion.toString()})(...${JSON.stringify(argumentos)})`,
    awaitPromise: true,
    returnByValue: true,
  });

  if (respuesta.exceptionDetails) {
    const excepcion = respuesta.exceptionDetails;
    throw new Error(
      `Error en la página: ${excepcion.exception?.description ?? excepcion.text ?? 'desconocido'}`,
    );
  }

  return respuesta.result.value;
}
