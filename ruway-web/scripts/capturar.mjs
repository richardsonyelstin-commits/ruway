/**
 * Capturas de pantalla en tamaños de dispositivo reales.
 *
 *   npm run capturar                      → todas las vistas, temas claro y oscuro
 *   npm run capturar -- --url /precios    → una ruta concreta
 *   npm run capturar -- --solo movil      → una sola vista
 *   npm run capturar -- --y 2400 --alto 1800   → un tramo de una página larga
 *
 * POR QUÉ EXISTE
 *   Chrome en Windows no acepta ventanas de menos de 500 px, así que la vista
 *   de móvil (390 px) no se puede comprobar con `--window-size`. Este script
 *   usa el protocolo de herramientas de desarrollo (CDP) para forzar el tamaño
 *   exacto del dispositivo, el tema y la preferencia de movimiento reducido.
 *
 * Las imágenes se guardan en ../.openclaw/tmp/capturas/ (nunca en el proyecto).
 *
 * Requiere el servidor de vista previa en marcha:  npm run preview
 * El navegador y el cliente CDP los pone `scripts/lib/navegador.mjs`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirNavegador, altoDeLaPagina, BASE, emular, irA } from './lib/navegador.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA_POR_DEFECTO = resolve(RAIZ, '..', '.openclaw', 'tmp', 'capturas');

const PUERTO = 9333;

/** Techo de altura por captura: evita imágenes imposibles en páginas largas */
const ALTO_MAXIMO = 16000;

/**
 * Nombre de archivo legible a partir de la ruta.
 *   `/` → `inicio` · `/preguntas-frecuentes` → `preguntas-frecuentes`
 */
const etiquetaDeRuta = (ruta) =>
  ruta.replace(/^\//, '').replace(/[/?#=]/g, '-').replace(/^-+|-+$/g, '') || 'inicio';

/** Tamaños reales de dispositivo (ancho en píxeles CSS) */
const VISTAS = [
  { nombre: 'movil', ancho: 390, alto: 844, escala: 2, movil: true },
  { nombre: 'tableta', ancho: 768, alto: 1024, escala: 2, movil: true },
  { nombre: 'escritorio', ancho: 1280, alto: 800, escala: 1, movil: false },
];

const TEMAS = ['claro', 'oscuro'];

/* ------------------------------------------------------------------ opciones */
const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : porDefecto;
};

const rutas = opcion('url', '/').split(',').map((r) => r.trim());
const soloVista = opcion('solo', null);
const dirSalida = resolve(opcion('salida', SALIDA_POR_DEFECTO));
/** Recorte vertical (en píxeles CSS) para revisar páginas largas por tramos */
const desde = Number(opcion('y', 0));
const altoRecorte = opcion('alto', null) ? Number(opcion('alto')) : null;

/* ------------------------------------------------------------------- proceso */
const { cliente, cerrar } = await abrirNavegador({
  puerto: PUERTO,
  perfil: 'ruway-capturas',
  argumentos: ['--hide-scrollbars'],
});

try {
  mkdirSync(dirSalida, { recursive: true });

  const vistas = soloVista ? VISTAS.filter((v) => v.nombre === soloVista) : VISTAS;
  if (!vistas.length) throw new Error(`Vista desconocida: ${soloVista}`);

  let total = 0;

  for (const ruta of rutas) {
    const url = new URL(ruta, BASE).href;

    for (const vista of vistas) {
      for (const tema of TEMAS) {
        await emular(cliente, {
          ancho: vista.ancho,
          alto: vista.alto,
          escala: vista.escala,
          movil: vista.movil,
          tema,
        });
        await irA(cliente, url);

        // Alto real del documento: sin esto, la captura se queda en el tamaño
        // de la ventana y se pierde todo lo que hay más abajo.
        const altoDocumento = (await altoDeLaPagina(cliente)) || vista.alto;
        const disponible = Math.max(altoDocumento - desde, 1);
        const altoPagina = Math.min(altoRecorte ?? disponible, disponible, ALTO_MAXIMO);

        const { data } = await cliente.enviar('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: true,
          clip: {
            x: 0,
            y: desde,
            width: vista.ancho,
            height: altoPagina,
            scale: 1,
          },
        });

        const imagen = Buffer.from(data, 'base64');
        const sufijo = desde || altoRecorte ? `-y${desde}` : '';
        // La ruta forma parte del nombre. Sin ella, capturar varias rutas de
        // una vez sobrescribía el archivo anterior y quedaba solo la última
        // página, con un nombre que parecía el de todas.
        const nombreArchivo = `${etiquetaDeRuta(ruta)}-${vista.nombre}-${tema}${sufijo}.png`;
        writeFileSync(join(dirSalida, nombreArchivo), imagen);

        const anchoReal = medirPng(imagen, 16);
        const altoReal = medirPng(imagen, 20);
        console.log(
          `  ${nombreArchivo.padEnd(28)} ${String(anchoReal).padStart(4)}×${altoReal} px  ` +
            `(página: ${altoDocumento} px · ${(imagen.length / 1024).toFixed(0)} KB)`,
        );
        total++;
      }
    }
  }

  console.log(`\n✓ ${total} captura(s) en ${dirSalida}\n`);
} finally {
  await cerrar();
}

/* ------------------------------------------------------------- utilidades PNG */
/** Lee un entero de 32 bits sin signo de un PNG. Desplazamiento 16 = ancho,
 *  20 = alto (después de firma, longitud y tipo del bloque IHDR). */
function medirPng(buffer, desplazamiento) {
  return buffer.readUInt32BE(desplazamiento);
}
