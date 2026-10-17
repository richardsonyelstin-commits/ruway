# RUWAY ACADEMY · Sitio web

Sitio oficial de **RUWAY ACADEMY** — Escuela de IA · Cajamarca.
`https://academiaruway.com`

---

## Arranque rápido

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera /dist  (salida 100 % estática)
npm run preview    # sirve lo compilado
```

### Comprobar antes de publicar

```bash
npm run verificar            # compila y ejecuta las tres comprobaciones automáticas
npm run probar-formulario    # 47 comprobaciones del formulario en Chrome real  (requiere `npm run preview`)
npm run auditar-a11y         # axe-core · teclado real · reflujo, 13 páginas     (requiere `npm run preview`)
npm run auditar-rendimiento  # Lighthouse en móvil 4G y escritorio             (requiere `npm run preview`)
npm run capturar             # capturas a 390 / 768 / 1280 px en tema claro y oscuro  (requiere `npm run preview`)
npm run og                   # regenera la imagen para compartir en redes
```

`npm run verificar` encadena tres revisiones sobre el HTML ya compilado, y se pueden lanzar por
separado cuando se está trabajando en una sola cosa:

| Comando | Qué revisa | Cuándo falla |
| :--- | :--- | :--- |
| `npm run auditar` | Estructura: encabezados, landmarks, ARIA, un solo `<h1>`, formularios | Cualquier descuido de marcado |
| `npm run enlaces` | Que cada enlace interno resuelva y cada `#ancla` exista en su destino | Un enlace roto o un ancla renombrada |
| `npm run jsonld` | Que cada bloque JSON-LD parsee y declare los tipos del sitemap §10.1 | Marcado inválido o certificado mal descrito |

El formulario es lo único que esas tres no pueden revisar, porque su comportamiento vive en el
JavaScript. Para todo lo que necesita un navegador —el formulario, la accesibilidad medida y el
rendimiento— hay tres comandos que van contra el sitio ya compilado:

```bash
npm run preview              # en otra terminal
npm run probar-formulario    # abre Chrome y recorre el formulario como lo haría una persona
npm run probar-formulario -- --capturas   # y guarda imagen de los dos estados intermedios
npm run auditar-a11y         # axe-core, recorrido real con Tab y reflujo, en las 13 páginas
npm run auditar-rendimiento  # Lighthouse en móvil 4G y escritorio, con los presupuestos como barrera
```

Comprueba, entre otras cosas, que el mensaje que se revisa en pantalla sea **exactamente** el que se
abre en WhatsApp, que el foco siga el orden previsto y que confirmar lleve a `/gracias`. (ADR-023)

**Ninguna de las seis sustituye a la revisión con lector de pantalla.** Atrapan la mayoría de los
descuidos mecánicos —incluido el recorrido con teclado, que desde el 3.6 se hace con eventos `Tab`
reales dentro del navegador— y eso es todo lo que prometen. Lo que queda en manos de una persona está
enumerado en el §7 de **`../accessibility-report.md`**.

Cuando `npm run enlaces` avisa de páginas que todavía no existen, sale bajo el epígrafe
«páginas que llegan en el siguiente incremento». Es una lista declarada a propósito en
`scripts/verificar-enlaces.mjs`: se vacía sola cuando la página se construye, y mientras tenga algo
dentro el aviso aparece en cada compilación. Un enlace mal escrito nunca cae en esa lista.
**Hoy está vacía**, así que el verificador exige cero enlaces rotos sin excepciones. (ADR-019)

La Home mide unos 7 000 px de alto en escritorio, así que la captura completa queda tan reducida
que no se puede revisar. Para verla por tramos:

```bash
npm run capturar -- --solo escritorio --alto 1750 --y 3500
#                    └ solo esa vista   └ alto    └ desde (en píxeles CSS)
npm run capturar -- --url "/programa,/precios"   # varias rutas a la vez
```

Los archivos llevan la ruta delante (`programa-escritorio-claro.png`) y, si son recortes, `-y3500`.

---

## Cómo está construido

| Pieza | Tecnología | Decisión |
| :--- | :--- | :--- |
| Framework | Astro 7 (`output: static`) | ADR-006 |
| Estilos | Tailwind CSS 4 + design tokens propios | ADR-006 |
| Tipografía | Self-hosted vía `@fontsource` | Sin peticiones a terceros |
| Hosting | Cloudflare Pages | ADR-007 |
| Formulario | Sin backend → mensaje de WhatsApp, con paso de revisión | ADR-008 · ADR-022 |
| Analítica | Cloudflare Web Analytics (sin cookies) | ADR-010 |

**No hay base de datos. No hay servidor. No hay CMS.**
El sitio es HTML y CSS estáticos, más unos pocos kilobytes de JavaScript que solo se descargan en
`/inscripcion` y `/contacto` —las dos páginas que llevan el formulario—. El resto de las páginas
tienen **cero JavaScript**.

---

## 📌 Tareas frecuentes

### Cambiar un precio

Un solo lugar: `src/data/precios.ts`. Nunca edites el precio dentro de una página.

### Cambiar el número de WhatsApp, el correo o la fecha de inicio

Todo vive en `src/data/site.ts`. Se usa en el header, el footer, el formulario y los
datos estructurados de SEO: cambiarlo aquí lo cambia en todo el sitio.

### Añadir o corregir una pregunta frecuente

`src/data/faq.ts`. Aparecerá en `/preguntas-frecuentes` y en el marcado `FAQPage`
que Google usa para los resultados enriquecidos.

### Editar el temario de una semana

`src/data/programa.ts`. Ahí viven también los datos de la barra de datos, la propuesta de valor,
los perfiles de «para quién», los cuatro escalones del camino, las herramientas, el resultado del
egresado, la sede y el texto del certificado.

### Cambiar el orden o el texto de un bloque de la Home

Los once bloques viven en `src/components/home/`, uno por archivo con el nombre del bloque. El orden
se cambia reordenando las etiquetas en `src/pages/index.astro`; no hay que tocar nada más.

### Editar una página interna

Cada página `src/pages/*.astro` es **corta a propósito**: compone secciones y lee el contenido de
`src/data/`. Para cambiar un texto, casi siempre se edita el dato, no la página.

| Página | Contenido en |
| :--- | :--- |
| `/programa` | `data/programa.ts` (ficha, temario, metodología, evaluación, faltas, certificado) |
| `/precios` | `data/precios.ts` (tarifas, cuotas, descuentos, devoluciones, otros conceptos) |
| `/preguntas-frecuentes` | `data/faq.ts` |
| `/sobre` | `data/programa.ts` (identidad, enfoque, equipo, sede) |
| `/contacto` | `data/site.ts` (dirección y canales) + el formulario compartido |
| `/inscripcion` | `data/programa.ts` (requisitos) + `data/precios.ts` (datos del ciclo) + el formulario |
| `/gracias` | `pages/gracias.astro` (los tres pasos están en el propio archivo) |
| `/privacidad`, `/terminos`, `/cookies` | `data/legal.ts` |
| `/instituciones` | `pages/instituciones.astro` (los pasos y el alcance están en el propio archivo) |

### Cambiar lo que dice el mensaje de WhatsApp

`src/lib/mensaje.ts`. Ahí se arma el texto que se abre en WhatsApp y ahí se normaliza el teléfono.
El mismo archivo alimenta la vista previa y el enlace de envío, así que **no pueden divergir**: lo que
se revisa en pantalla es lo que se envía. Si cambias el formato, la prueba funcional lo detecta.

### Añadir una cláusula legal

`src/data/legal.ts`. Cada apartado es un objeto con `id`, `titulo` y su contenido; añadirlo a la
lista lo hace aparecer en la página **y en el índice lateral**, sin tocar el marcado.

### Marcar un dato que todavía no existe

`npm run jsonld` y el resto de verificaciones no pueden saber si un dato es real. Si falta uno,
escríbelo como `[POR DEFINIR]`: dentro de las páginas legales se dibuja solo como un hueco visible
(borde discontinuo, color de alerta) y se anuncia como «dato pendiente de definir» a los lectores de
pantalla. **No rellenes un dato con una suposición:** la regla del proyecto es no inventar nada.

### Añadir un logo o una insignia

1. Copia el SVG a `public/logos/`.
2. Referéncialo con `/logos/nombre-archivo.svg`.

Respeta las reglas de `ruway-identidad/LEEME.txt`: margen libre de un escalón,
no estirar, no recolorear, no añadir sombras.

### Cambiar colores o tipografía

⚠️ **No edites componentes.** Los colores viven en `src/styles/tokens.css`.
Cambia un token y se actualiza todo el sitio, en ambos temas.
Los valores deben salir siempre de `ruway-identidad/`.

---

## 🎨 Sistema de diseño

Documentación completa en **`../03-sistema-diseno.md`**.

- **Paleta:** 6 colores oficiales. No se añaden colores nuevos; las variantes se derivan
  mezclando la paleta con `color-mix()`.
- **Temas:** claro y oscuro. Se activa con `data-tema="oscuro"` en `<html>`.
- **Accesibilidad:** WCAG 2.2 AA **medido** (axe-core en 2 temas × 2 tamaños, 531 paradas de teclado y
  reflujo a 320 px). Contrastes calculados y documentados. Ver `../accessibility-report.md`.

---

## ✅ Accesibilidad

El sitio se construye para **WCAG 2.2 AA** desde el primer componente, y desde el incremento 3.6 se
**mide** en lugar de darse por supuesto: `npm run auditar-a11y` recorre las 13 páginas con axe-core —dos
temas por dos tamaños—, con eventos `Tab` reales y a 320 px. Los resultados están en
**`../accessibility-report.md`**.

```bash
npm run verificar            # estructura, enlaces y JSON-LD (sin navegador)
npm run auditar-a11y         # axe-core + teclado + reflujo      (requiere `npm run preview`)
npm run auditar-rendimiento  # Lighthouse: las 4 categorías ≥ 95 (requiere `npm run preview`)
```

Lo que sigue siendo manual, con su nombre, está desarrollado en el §7 del informe:

1. **Lector de pantalla** (NVDA en Windows, VoiceOver en iOS). La automatización comprueba que el
   nombre accesible existe y es correcto; no comprueba si al escucharlo se entiende.
2. **Zoom real del navegador** hasta el 200 %. La prueba emula el ancho equivalente, que es la parte
   medible; el zoom de verdad puede destapar problemas de rejilla.
3. **Las animaciones con movimiento activado.** Las auditorías corren con `prefers-reduced-motion:
   reduce` para no medir estados intermedios; el estado *durante* la animación no está cubierto.
4. **La calidad del copy.** Que un texto se entienda a los 14 años no lo mide ninguna herramienta.

Y lo que se comprueba solo, para no repetirlo a mano: que el estado de error se comunique con texto y no
solo con color, que el anillo de foco se vea en cada una de las 531 paradas de teclado y que nada quede
tapado por la cabecera fija.

---

## 🚀 Publicar

El despliegue es automático: **todo push a `main` compila y publica en Cloudflare Pages**.

```bash
git add .
git commit -m "descripción del cambio"
git push
```

En ~1 minuto está en línea. Si algo falla, Cloudflare conserva la versión anterior.

---

## 📁 Estructura

```
src/
├── styles/      tokens.css (paleta y temas) · global.css
├── layouts/     BaseLayout.astro  — head, skip link, header, footer
│                PlantillaPagina.astro — cabecera con migas + <h1> de las internas
├── components/  piezas reutilizables
│   ├── Formulario.astro  ⭐ el formulario compartido (única pieza con JavaScript)
│   └── home/    los 11 bloques de la portada, uno por archivo
├── data/        ⭐ TODO EL CONTENIDO EDITABLE ESTÁ AQUÍ
├── lib/         rutas.ts · whatsapp.ts · mensaje.ts · migajas.ts · iconos.ts
└── pages/       una página por ruta del sitio
scripts/
├── lib/navegador.mjs                  abre Chrome y habla CDP (lo comparten cuatro scripts)
├── auditar-html.mjs                   estructura del HTML compilado
├── verificar-enlaces.mjs              enlaces internos y anclas
├── verificar-datos-estructurados.mjs  JSON-LD: validez y tipos exigidos
├── probar-formulario.mjs              el formulario, en un Chrome real (ADR-023)
├── auditar-accesibilidad.mjs          axe-core + teclado + reflujo (ADR-025)
├── auditar-rendimiento.mjs            Lighthouse móvil y escritorio (ADR-025)
├── capturar.mjs                       capturas por tamaño de dispositivo (Chrome/Edge)
└── generar-og.mjs                     imagen para compartir en redes
public/
├── logos/       activos de ruway-identidad/ (SVG)
├── og/          imágenes para compartir en redes
└── favicon*     iconos
```

---

## ⛔ Bloqueantes antes de publicar

No son mejoras: son cosas que hoy están **incompletas a la vista** y que hay que cerrar antes de
apuntar el dominio al sitio.

| # | Qué falta | Dónde se arregla |
| :-- | :--- | :--- |
| 1 | **RUC del responsable** en la política de privacidad | `src/data/legal.ts` → `RESPONSABLE.ruc`. Hoy se ve como un hueco marcado. |
| 2 | Horario de atención presencial | `src/data/site.ts` → `sede.horarioAtencion` (hoy `[POR DEFINIR]`, el pie lo dibuja con `Pendiente`). |
| 3 | Perfiles de TikTok e Instagram | `src/data/site.ts` → `porDefinir.redes`. El pie no los muestra mientras estén vacíos. |
| 4 | Fotos reales del local | `public/`. No se usan imágenes de banco. |
| 5 | Testimonios y resultados | Solo después del primer Demo Day. Hoy no hay ninguno y el sitio lo dice. |
| 6 | Analítica sin cookies | `BaseLayout.astro`. El ADR-010 la prevé; **hoy no hay ningún script de medición**. `/cookies` está escrito en consecuencia. |

Además, hay un **pendiente operativo** que no es de código: cuando se agoten las 10 plazas de
lanzamiento, hay que quitar el bloque de lanzamiento de `src/data/precios.ts` para que vuelva el
precio de lista. Se cambia un dato y desaparece de la Home y de `/precios` a la vez.

---

## 🔍 Siete trampas del proyecto (ya resueltas, no repetir)

1. **Reglas de accesibilidad fuera de `@layer`.** En CSS, el orden de capas pesa más que la
   especificidad: cualquier cosa en `@layer utilities` gana a `@layer base`. Por eso
   `a[aria-current="page"]`, `:focus-visible` y el tamaño mínimo de los botones viven **sin
   `@layer`**, al final de `global.css`. Si los mueves dentro de una capa, dejan de aplicarse.
   (ADR-011)

2. **`Astro.url.pathname` trae la extensión en el build** (`/index.html`, `/programa.html`).
   Nunca lo uses directamente: pasa siempre por `normalizarRuta()` de `src/lib/rutas.ts`,
   o el canonical y el menú se rompen. (ADR-012)

3. **El anillo de foco depende del fondo.** El color de foco es Maíz en tema oscuro. Sobre una
   banda de fondo Maíz —como la del llamado final— sería invisible. Cualquier bloque nuevo con
   fondo de color lleno debe redefinir `--ruway-foco` (y `--ruway-acento`) para su contenido.

4. **Nada de contenido incrustado de terceros.** Un `<iframe>` de Google Maps, un vídeo o un botón
   social instalan cookies de terceros en el primer pintado y obligarían a un banner de
   consentimiento en **todo** el sitio. La dirección y el mapa van como **enlace**, que abre la
   aplicación del visitante. (ADR-016)

5. **El mensaje de WhatsApp tiene una sola fuente.** Tanto la vista previa del paso de revisión como
   el `href` del botón de envío salen de `componerMensaje()`, en `src/lib/mensaje.ts`. Si alguien
   escribe el enlace a mano, el paso de revisión pasa a **mentir**: muestra un texto y se envía otro.
   Es la peor avería posible en esta página, y por eso la prueba funcional compara los dos carácter a
   carácter. (ADR-022)

6. **`?intencion=` no existe durante la compilación.** El sitio es estático: la cadena de consulta
   solo vive en el navegador. La opción del formulario se marca con JavaScript, y si el valor no es
   `demo` ni `matricula` no se marca nada. No intentes leerla con `Astro.url` en el build: llegará
   siempre vacía. (ADR-022)

7. **Al medir el foco con teclado, sospecha primero del medidor.** La primera versión de
   `scripts/auditar-accesibilidad.mjs` dio **13 fallos que no existían** por tres motivos que conviene
   tener presentes: medir a los 40 ms (cuando `scroll-behavior: smooth` y la transición del enlace de
   salto aún iban por la mitad del recorrido), preguntar por geometría en lugar de por **quién se pinta
   encima**, y muestrear la caja envolvente de un enlace de dos líneas en vez de sus **cajas de línea**
   —el centro de la unión cae en el hueco entre ambas, fuera del enlace—. Si tocas esa prueba y salen
   fallos raros, mira el medidor antes que el sitio. (ADR-026)

---

## ⚠️ Cosas que nunca se hacen

- No inventar cursos, precios, sedes ni fechas. Todo sale de `plan completo.md`.
- No publicar el certificado sin decir que **no tiene validez oficial MINEDU**.
- No usar texto Lorem Ipsum.
- No añadir colores fuera de la paleta oficial.
- No crear animaciones que ignoren `prefers-reduced-motion`.
- No publicar cifras internas del negocio: costos, remuneraciones, márgenes, punto de equilibrio ni
  roles «por asignar». El plan de negocio es un documento interno. (ADR-021)
