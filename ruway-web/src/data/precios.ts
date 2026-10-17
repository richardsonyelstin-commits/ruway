/**
 * PRECIOS Y DESCUENTOS
 * ---------------------------------------------------------------------------
 * Fuente: `plan completo.md` §6.1 (tabla única de precios), §6.2 (descuentos)
 * y §11.3 (oferta de lanzamiento).
 *
 * ⚠️ TABLA ÚNICA
 *   El plan dice literalmente: «Tabla única de precios (la única que existe)».
 *   No puede haber dos precios distintos en el sitio. Todo precio que se muestre
 *   sale de este archivo. Si el precio cambia, se cambia AQUÍ y en ningún otro
 *   lugar.
 *
 * DECISIÓN DEL RESPONSABLE (2026-10-16)
 *   La Home muestra el PRECIO DE LANZAMIENTO como precio vigente y el precio
 *   normal tachado al lado, con la condición real (primeras 10 matrículas).
 *   Motivo: el §11.3 lo define como «la versión que se comunica siempre».
 */

export interface Tramo {
  /** Código interno, sin acentos ni espacios */
  clave: 'general' | 'escolar';
  etiqueta: string;
  /** Descripción del público de este tramo */
  publico: string;
  /** Precio de lista, el del §6.1 */
  normal: number;
  /** Precio de lanzamiento vigente, el del §11.3 */
  lanzamiento: number;
  /** §6.1 — pago fraccionado */
  cuotas: { cantidad: number; monto: number };
}

export const TRAMOS: Tramo[] = [
  {
    clave: 'general',
    etiqueta: 'Público general',
    publico: 'Universitarios, emprendedores y adultos',
    normal: 550,
    lanzamiento: 500,
    cuotas: { cantidad: 2, monto: 290 },
  },
  {
    clave: 'escolar',
    etiqueta: 'Escolares',
    publico: 'De 14 a 17 años',
    normal: 450,
    lanzamiento: 400,
    cuotas: { cantidad: 2, monto: 240 },
  },
];

/** Condición del precio de lanzamiento — §6.2 y §11.3 */
export const CONDICION_LANZAMIENTO = 'Precio de lanzamiento: solo las primeras 10 matrículas.';

/** Materias legales y operativas que acompañan siempre al precio — §6.1, §5.1 */
export const NOTAS_PRECIO: string[] = [
  'Precios con IGV incluido.',
  'Incluye matrícula y certificado.',
  'La clase demo es gratuita y se reserva por WhatsApp.',
];

/** Formatea un monto en soles: 550 → «S/ 550» */
export const soles = (monto: number): string => `S/ ${monto.toLocaleString('es-PE')}`;

/* ============================================================================
   DESCUENTOS  (§6.2 — máximo 2 acumulables)
   Se usan en /precios (incremento 3.4). Se declaran aquí para que exista una
   sola fuente y no se dupliquen.
   ========================================================================= */

export interface Descuento {
  nombre: string;
  monto: string;
  condicion: string;
}

export const DESCUENTOS: Descuento[] = [
  { nombre: 'Lanzamiento', monto: '−S/ 50', condicion: 'Solo las primeras 10 matrículas.' },
  { nombre: 'Early bird', monto: '−10 %', condicion: 'Matrícula dentro de los 7 días posteriores a la demo.' },
  { nombre: 'Hermanos', monto: '−15 %', condicion: 'Sobre el segundo hermano.' },
  { nombre: 'Referidos', monto: 'S/ 50', condicion: 'Para el referido matriculado y para quien lo refiere.' },
  { nombre: 'Alumni', monto: '−15 %', condicion: 'Renovación consecutiva, a partir del Ciclo 2.' },
];

/** Regla del plan: máximo 2 descuentos acumulables (§6.2) */
export const REGLA_DESCUENTOS = 'Se acumulan como máximo 2 descuentos.';

/* ============================================================================
   OTROS CONCEPTOS DE LA TABLA ÚNICA  (§6.1)
   ========================================================================= */

/** Lo que se cobra por fuera del programa completo */
export const OTROS_CONCEPTOS = [
  {
    nombre: 'Clase demo',
    detalle: 'Una hora, presencial, para conocer el método y el local.',
    precio: 'Gratis',
    nota: 'Se reserva por WhatsApp. Cupo de 12 personas.',
  },
  {
    nombre: 'Clase personalizada 1 a 1',
    detalle: 'Para reforzar un tema puntual, fuera del programa.',
    precio: 'S/ 80',
    nota: 'Por hora.',
  },
] as const;

/** Materias legales y operativas que acompañan siempre al precio */
export const NOTAS_FACTURACION: string[] = [
  'Todos los precios están expresados con IGV incluido.',
  'Cada pago se sustenta con boleta de venta electrónica.',
  'El certificado de participación no tiene validez oficial del MINEDU.',
];

/* ============================================================================
   POLÍTICA DE DEVOLUCIONES  (/precios #devoluciones)
   §7.5 — la tabla completa, sin resumir
   ========================================================================= */

export interface Devolucion {
  situacion: string;
  politica: string;
}

export const DEVOLUCIONES: Devolucion[] = [
  { situacion: 'Antes del inicio del programa', politica: 'Devolución del 100 % menos S/ 30 de gastos administrativos.' },
  { situacion: 'Después de la sesión 1', politica: 'Devolución del 80 %.' },
  {
    situacion: 'Después de la sesión 2',
    politica: 'Sin devolución, pero se puede postergar al ciclo siguiente una sola vez.',
  },
  { situacion: 'Retiro voluntario a mitad del programa', politica: 'Sin devolución del periodo en curso.' },
  {
    situacion: 'Cancelación por parte de RUWAY ACADEMY',
    politica: 'Devolución del 100 % proporcional o reprogramación, a elección del alumno.',
  },
  { situacion: 'Inasistencia', politica: 'Sin devolución.' },
];
