// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * RUWAY ACADEMY · academiaruway.com
 *
 * Decisiones (ver ../decisions.md):
 *  - ADR-006: Astro + TypeScript + Tailwind CSS 4
 *  - ADR-007: despliegue en Cloudflare Pages (salida estática)
 *  - ADR-010: sin cookies de analítica (se añade el script de CF en el layout)
 *
 * `build.format: 'file'` + `trailingSlash: 'never'` producen URLs limpias sin barra
 * final (/programa), coherente con §9 de ../01-sitemap-final.md.
 */
export default defineConfig({
  site: 'https://academiaruway.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      // Páginas que NO entran al sitemap: confirmación (thin) y 404.
      filter: (page) => !page.includes('/gracias') && !page.includes('/404'),
      changefreq: 'monthly',
      priority: 0.6,
      serialize(item) {
        // Prioridades del sitemap §10.3: Home 1.0 · embudo 0.8 · legal 0.3
        if (item.url === 'https://academiaruway.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        if (
          /\/(programa|precios|inscripcion|preguntas-frecuentes|sobre|contacto|instituciones)$/.test(
            item.url,
          )
        ) {
          item.priority = 0.8;
        }
        if (/\/(privacidad|terminos|cookies)$/.test(item.url)) {
          item.priority = 0.3;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
