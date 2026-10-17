/**
 * MIGAS DE PAN
 * ---------------------------------------------------------------------------
 * El sitemap (§10.1) pide `BreadcrumbList` en todas las páginas internas. Aquí
 * se declara una sola vez y se usa en dos sitios:
 *
 *   1. La lista visible (`components/Migajas.astro`)
 *   2. Los datos estructurados (`jsonLdMigajas`)
 *
 * Van juntos a propósito: si se escribieran por separado, tarde o temprano la
 * miga visible y la que ve Google dirían cosas distintas.
 */
import { SITIO } from '../data/site';

export interface Migaja {
  /** Texto visible. Corto: es una ruta, no un título. */
  etiqueta: string;
  /** Ruta interna que empieza por `/`. La última miga es la página actual. */
  href: string;
}

/** JSON-LD `BreadcrumbList`, sin `@context` (lo pone la plantilla en el `@graph`). */
export function jsonLdMigajas(migajas: Migaja[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: migajas.map((migaja, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: migaja.etiqueta,
      item: new URL(migaja.href, SITIO.url).href,
    })),
  };
}

/** Atajo: «Inicio» siempre es la primera miga. */
export function conInicio(...resto: Migaja[]): Migaja[] {
  return [{ etiqueta: 'Inicio', href: '/' }, ...resto];
}
