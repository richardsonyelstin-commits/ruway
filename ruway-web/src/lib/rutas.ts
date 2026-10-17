/**
 * Normalización de rutas.
 *
 * Con `build.format: 'file'` (ver astro.config.mjs), durante el build
 * `Astro.url.pathname` incluye la extensión: «/programa.html» o «/index.html».
 * Las URLs canónicas del sitio, en cambio, son limpias y sin barra final
 * (sección 9 de ../01-sitemap-final.md): «/programa» y «/».
 *
 * Esta función es el ÚNICO punto donde se hace esa conversión. Se usa tanto
 * para el <link rel="canonical"> como para marcar la página actual en el menú.
 */
export function normalizarRuta(pathname: string): string {
  let ruta = pathname.split('?')[0].split('#')[0];

  // «/index.html» y «/» son la misma página
  ruta = ruta.replace(/\/index\.html?$/i, '/');
  // El resto pierde la extensión
  ruta = ruta.replace(/\.html?$/i, '');
  // Sin barra final
  ruta = ruta.replace(/\/+$/, '');

  return ruta === '' ? '/' : ruta;
}
