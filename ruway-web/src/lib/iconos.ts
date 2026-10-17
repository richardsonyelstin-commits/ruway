/**
 * TRAZOS DE LOS ICONOS
 * ---------------------------------------------------------------------------
 * Los datos viven aquí y no dentro del componente por un motivo práctico:
 * los archivos de contenido (`src/data/*.ts`) necesitan nombrar un icono y
 * TypeScript tiene que poder comprobar que el nombre existe. Si los trazos
 * estuvieran dentro del `.astro`, el tipo no sería importable.
 *
 * Reglas de dibujo (coherentes con la marca):
 *  - Rejilla de 24 × 24, sin relleno, solo trazo.
 *  - Trazo de 1.6 px, esquinas y extremos redondeados.
 *  - Geometría recta y escalonada: nada de degradados ni de formas orgánicas.
 *  - Nada de robots, cerebros ni destellos: son los clichés visuales de la IA.
 */

export const TRAZOS = {
  mapa: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  usuarios:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  bloques:
    '<path d="m12 2.5 9 4.8-9 4.8-9-4.8 9-4.8Z"/><path d="m3 12.2 9 4.8 9-4.8"/><path d="m3 17 9 4.8 9-4.8"/>',
  cuadricula:
    '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7.2V12l3.2 2"/>',
  libro:
    '<path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h12.5v15H7a2.5 2.5 0 0 0 0 5h12.5"/><path d="M4.5 5.5v15"/>',
  documento:
    '<path d="M14 3v5h5"/><path d="M15 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V7l-4-4Z"/><path d="M9 13h6M9 17h4"/>',
  escudo: '<path d="M12 3l7.5 3v6c0 4.2-3.1 7.6-7.5 9-4.4-1.4-7.5-4.8-7.5-9V6L12 3Z"/>',
  mensaje: '<path d="M21 11.5a8 8 0 0 1-11.6 7.1L4.5 20l1.4-4.9A8 8 0 1 1 21 11.5Z"/>',
  comprobado: '<path d="m4.5 12.5 5 5 10-11"/>',
  chevron: '<path d="m6 9.5 6 6 6-6"/>',
  flecha: '<path d="M4.5 12h15"/><path d="m13.5 6 6 6-6 6"/>',
  calendario:
    '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  laptop:
    '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2.5 19.5h19"/>',
} as const;

export type NombreIcono = keyof typeof TRAZOS;
