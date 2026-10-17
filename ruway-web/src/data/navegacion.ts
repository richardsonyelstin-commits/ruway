/**
 * Estructura de navegación. Coincide exactamente con el sitemap aprobado
 * (../01-sitemap-final.md). NO añadir enlaces a páginas que no existen.
 *
 * Nota de alcance: /contacto, /instituciones y las páginas legales se
 * construyen en el incremento 3.4. Hasta entonces sus enlaces no resuelven.
 */

export interface EnlaceNav {
  etiqueta: string;
  href: string;
}

/** Navegación principal (header). 5 destinos + CTA — decisión ADR-003 */
export const NAV_PRINCIPAL: EnlaceNav[] = [
  { etiqueta: 'Inicio', href: '/' },
  { etiqueta: 'Programa', href: '/programa' },
  { etiqueta: 'Precios', href: '/precios' },
  { etiqueta: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
  { etiqueta: 'Sobre', href: '/sobre' },
];

/** Llamada a la acción principal del sitio (conversión) */
export const CTA_PRINCIPAL: EnlaceNav = {
  etiqueta: 'Reserva tu demo gratis',
  href: '/inscripcion?intencion=demo',
};

/** CTA secundario del hero y del footer */
export const CTA_SECUNDARIO: EnlaceNav = {
  etiqueta: 'Ver el programa',
  href: '/programa',
};

export interface ColumnaPie {
  titulo: string;
  enlaces: EnlaceNav[];
}

/** Footer — 4 columnas + barra inferior */
export const NAV_PIE: ColumnaPie[] = [
  {
    titulo: 'Programa',
    enlaces: [
      { etiqueta: 'Programa completo', href: '/programa' },
      { etiqueta: 'Precios y descuentos', href: '/precios' },
      { etiqueta: 'Inscripción y demo', href: '/inscripcion' },
      { etiqueta: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
    ],
  },
  {
    titulo: 'Academia',
    enlaces: [
      { etiqueta: 'Sobre RUWAY', href: '/sobre' },
      { etiqueta: 'Contacto', href: '/contacto' },
      { etiqueta: 'Talleres para colegios e institutos', href: '/instituciones' },
    ],
  },
  {
    titulo: 'Legal',
    enlaces: [
      { etiqueta: 'Política de privacidad', href: '/privacidad' },
      { etiqueta: 'Términos y condiciones', href: '/terminos' },
      { etiqueta: 'Política de cookies', href: '/cookies' },
    ],
  },
];

/** Navegación secundaria del footer (para el landmark <nav>) */
export const NAV_SECUNDARIA: EnlaceNav[] = [
  { etiqueta: 'Inicio', href: '/' },
  { etiqueta: 'Sobre', href: '/sobre' },
  { etiqueta: 'Contacto', href: '/contacto' },
];
