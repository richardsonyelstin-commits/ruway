/**
 * Generador de imagen para compartir en redes (Open Graph) — 1200 × 630.
 *
 *   node scripts/generar-og.mjs
 *
 * Escribe public/og/ruway-compartir.png
 *
 * POR QUÉ SIN DEPENDENCIAS
 *   Compone la imagen con el codificador PNG que trae Node (zlib), sin canvas
 *   ni librerías nativas. Así el build es reproducible en cualquier máquina y
 *   no se añade peso al proyecto.
 *
 * QUÉ DIBUJA
 *   - Fondo Piedra (color de marca)
 *   - Barra inferior Maíz
 *   - El trazo escalonado del isotipo + el punto, en Maíz y Cal: la marca real,
 *     rasterizada del mismo path que usa el SVG oficial.
 *
 * PENDIENTE (3.6): versión con texto (nombre del programa, fecha de inicio).
 * Requiere composición tipográfica, que se hará con una herramienta dedicada.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = resolve(RAIZ, 'public/og/ruway-compartir.png');

const ANCHO = 1200;
const ALTO = 630;

/* ---------------------------------------------------------------- colores */
const PIEDRA = [0x14, 0x17, 0x1e];
const MAIZ = [0xf0, 0xb4, 0x29];
const CAL = [0xf3, 0xf1, 0xea];

/* ------------------------------------------------------------- PNG (zlib) */
const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabla[n] = c >>> 0;
  }
  return tabla;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) c = TABLA_CRC[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function bloque(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([largo, cuerpo, crc]);
}

function codificarPng(ancho, alto, pixeles /* Buffer RGB, 3 bytes por píxel */) {
  const firma = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ancho, 0);
  ihdr.writeUInt32BE(alto, 4);
  ihdr[8] = 8; // profundidad de bits
  ihdr[9] = 2; // tipo de color: RGB
  ihdr[10] = 0; // compresión deflate
  ihdr[11] = 0; // filtro
  ihdr[12] = 0; // sin entrelazado

  const crudo = Buffer.alloc(alto * (1 + ancho * 3));
  for (let y = 0; y < alto; y++) {
    crudo[y * (1 + ancho * 3)] = 0; // filtro None por fila
    pixeles.copy(crudo, y * (1 + ancho * 3) + 1, y * ancho * 3, (y + 1) * ancho * 3);
  }

  return Buffer.concat([
    firma,
    bloque('IHDR', ihdr),
    bloque('IDAT', deflateSync(crudo, { level: 9 })),
    bloque('IEND', Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------- geometría del isotipo de RUWAY */
/** Trazo escalonado, en el sistema de coordenadas del SVG oficial (120 × 120) */
const TRAZO = [
  [27, 102], [27, 75], [51, 75], [51, 53], [75, 53], [75, 40],
  [85, 40], [85, 63], [61, 63], [61, 85], [37, 85], [37, 102],
];
/** Punto despegado del trazo */
const PUNTO = { cx: 80, cy: 25, r: 8 };

/** Punto dentro de polígono por trazado de rayo (regla par-impar) */
function dentroDelTrazo(x, y) {
  let dentro = false;
  for (let i = 0, j = TRAZO.length - 1; i < TRAZO.length; j = i++) {
    const [xi, yi] = TRAZO[i];
    const [xj, yj] = TRAZO[j];
    const cruza = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (cruza) dentro = !dentro;
  }
  return dentro;
}

/* ------------------------------------------------------------------ dibujo */
const pixeles = Buffer.alloc(ANCHO * ALTO * 3);

function pintar(x, y, color) {
  if (x < 0 || y < 0 || x >= ANCHO || y >= ALTO) return;
  const o = (y * ANCHO + x) * 3;
  pixeles[o] = color[0];
  pixeles[o + 1] = color[1];
  pixeles[o + 2] = color[2];
}

// 1 · Fondo Piedra + barra inferior Maíz
for (let y = 0; y < ALTO; y++) {
  const color = y >= ALTO - 18 ? MAIZ : PIEDRA;
  for (let x = 0; x < ANCHO; x++) pintar(x, y, color);
}

// 2 · La marca, a la derecha, en Maíz
const ESCALA = 2.6;
const LADO = 120 * ESCALA; // 312 px
const ORIGEN_X = ANCHO - 96 - LADO;
const ORIGEN_Y = (ALTO - LADO) / 2;
const RADIO = PUNTO.r * ESCALA;

for (let py = 0; py < LADO; py++) {
  for (let px = 0; px < LADO; px++) {
    const mx = px / ESCALA;
    const my = py / ESCALA;

    const enTrazo = dentroDelTrazo(mx, my);
    const enPunto = (mx - PUNTO.cx) ** 2 + (my - PUNTO.cy) ** 2 <= PUNTO.r ** 2;

    if (enTrazo || enPunto) {
      pintar(Math.round(ORIGEN_X + px), Math.round(ORIGEN_Y + py), MAIZ);
    }
  }
}

// 3 · Un guion Maíz a la izquierda: ritmo visual, sin inventar tipografía
const GUION_Y0 = ALTO / 2 - 8;
const GUION_Y1 = ALTO / 2 + 8;
for (let y = GUION_Y0; y < GUION_Y1; y++) {
  for (let x = 96; x < 96 + 40 * ESCALA; x++) pintar(Math.round(x), Math.round(y), CAL);
}

/* ------------------------------------------------------------------ salida */
mkdirSync(dirname(SALIDA), { recursive: true });
writeFileSync(SALIDA, codificarPng(ANCHO, ALTO, pixeles));

console.log(`✓ Imagen OG generada: ${SALIDA}`);
console.log(`  ${ANCHO} × ${ALTO} px · ${(pixeles.length / 1024).toFixed(0)} KB sin comprimir`);
console.log(`  Marca a ${ESCALA}× (escala ${LADO} px) en Maíz sobre Piedra`);
