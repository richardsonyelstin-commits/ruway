# 03 · Sistema de Diseño — RUWAY ACADEMY

**Agente:** A3 (Desarrollador Full-Stack) · Fase 3.1
**Fecha:** 16 de octubre de 2026
**Implementación:** `ruway-web/src/styles/tokens.css` + `global.css`
**Fuente de marca:** `ruway-identidad/LEEME.txt`

---

## 1. Principio rector

> **La marca presta los colores; el sistema decide cómo usarlos.**

RUWAY tiene **exactamente 6 colores** y 3 tipografías. Este sistema no añade ninguno:
todo valor derivado se obtiene **mezclando la paleta oficial con `color-mix()`**, de modo que
la derivación sea explícita y auditable. Si mañana cambia un color de marca, cambia un token
y todo el sitio se recalcula.

El sistema tiene 3 capas:

| Capa | Qué contiene | Se edita |
| :--- | :--- | :--- |
| **1 · Paleta de marca** | Los 6 colores oficiales + tipografía + radios + easings | Nunca (viene del manual) |
| **2 · Tokens semánticos** | `fondo`, `texto`, `acento`, `borde`… con valor por tema | Rara vez |
| **3 · Componentes** | Botones, tarjetas, acordeón, barra de datos | Consumen la capa 2, nunca la 1 |

**Regla dura:** ningún componente usa `piedra`, `cal` o `maiz` directamente. Todos usan
`text-texto`, `bg-fondo`, `bg-maiz` solo para el CTA, etc. Por eso el cambio de tema no
requiere tocar ni un componente.

---

## 2. Capa 1 — Paleta oficial

| Token | Nombre | HEX | Rol |
| :--- | :--- | :--- | :--- |
| `--color-piedra` | Piedra | `#14171E` | Fondo oscuro principal · texto sobre claro |
| `--color-cal` | Cal | `#F3F1EA` | Fondo claro principal · texto sobre oscuro |
| `--color-maiz` | Maíz | `#F0B429` | Acento primario · fondo del CTA |
| `--color-teja` | Teja | `#BE3A1B` | Acento secundario · alertas |
| `--color-ichu` | Ichu | `#1F6B4F` | Éxito · logro |
| `--color-niebla` | Niebla | `#9AA0AE` | Texto secundario · bordes |

Tailwind genera con ellas las utilidades `bg-piedra`, `text-cal`, `border-maiz`, etc.

---

## 3. Capa 2 — Tokens semánticos

### 3.1 Tabla comparativa de temas

| Token | Tema claro | Tema oscuro | Ratio de contraste |
| :--- | :--- | :--- | :--- |
| `--color-fondo` | Cal `#F3F1EA` | Piedra `#14171E` | — |
| `--color-superficie` | Cal aclarado (78 % Cal + blanco) | Piedra aclarado (90 % Piedra + Cal) | — |
| `--color-superficie-alta` | Cal aclarado (55 % Cal + blanco) | Piedra aclarado (82 % Piedra + Cal) | — |
| `--color-texto` | Piedra | Cal | **15.9:1** ✅ AAA |
| `--color-texto-suave` | 68 % Piedra + 32 % Cal | Niebla | **5.85:1** / **6.84:1** ✅ AA |
| `--color-acento` | Teja | Maíz | **4.88:1** / **9.62:1** ✅ AA |
| `--color-borde` | 42 % Niebla + Cal (decorativo) | 28 % Niebla + Piedra (decorativo) | — |
| `--color-borde-control` | 55 % Niebla + 45 % Piedra | 60 % Niebla + 40 % Piedra | **5.4:1** / **3.26:1** ✅ ≥3:1 |
| `--color-foco` | Piedra | Maíz | **15.9:1** / **9.62:1** ✅ |
| `--color-exito` | Ichu | 55 % Ichu + 45 % Cal | **5.68:1** / **6.70:1** ✅ AA |
| `--color-alerta` | Teja | 50 % Teja + 50 % Cal | **4.88:1** / **7.38:1** ✅ AA |
| `--color-sobre-cta` | Piedra | Piedra | **9.62:1** sobre Maíz ✅ AAA |

### 3.2 Por qué hay colores derivados (y por qué es legítimo)

El manual prohíbe cambiar los colores de marca. No los hemos cambiado: los hemos **mezclado**.

| Token derivado | Fórmula | Motivo |
| :--- | :--- | :--- |
| `superficie` (claro) | `color-mix(Cal 78 %, blanco)` | Elevar una tarjeta sobre el fondo Cal sin añadir un gris nuevo |
| `superficie` (oscuro) | `color-mix(Piedra 90 %, Cal)` | Elevar una tarjeta sobre Piedra con una pizca de la Cal de marca |
| `texto-suave` (claro) | `color-mix(Piedra 68 %, Cal)` | Niebla sobre Cal da 2.3:1 → **no es usable**. Esta mezcla da 5.85:1 |
| `exito` (oscuro) | `color-mix(Ichu 55 %, Cal)` | Ichu sobre Piedra da 2.8:1 → **no es usable**. Esta mezcla da 6.70:1 |
| `alerta` (oscuro) | `color-mix(Teja 50 %, Cal)` | Teja sobre Piedra da 3.3:1 → solo texto grande. Esta mezcla da 7.38:1 |
| `borde-control` | `color-mix(Niebla, Piedra)` | WCAG 1.4.11 exige ≥3:1 en bordes de controles |

✅ **Ninguna mezcla introduce una familia de color nueva.** Son siempre combinaciones
de dos colores oficiales, así que el sitio sigue siendo 100 % reconocible como RUWAY.

### 3.3 Reglas de uso (obligatorias)

| # | Regla | Motivo |
| --: | :--- | :--- |
| 1 | **Maíz nunca como texto sobre Cal** (1.6:1) | Falla AA |
| 2 | El **CTA** es fondo Maíz + texto `--color-sobre-cta` (Piedra) | 9.62:1 en ambos temas |
| 3 | **Niebla nunca como texto sobre Cal** (2.3:1); sí como borde o placeholder | Falla AA |
| 4 | **Ichu y Teja nunca como texto sobre Piedra**; se usan las variantes derivadas | Fallan AA |
| 5 | **Ningún estado se comunica solo por color** | WCAG 1.4.1 |
| 6 | El **anillo de foco** es `--color-foco` (Piedra en claro, Maíz en oscuro) con 3 px y 2 px de separación | WCAG 2.4.7 · 2.4.11 |
| 7 | Objetivos táctiles ≥ **44×44 px** (mínimo exigido: 24×24) | WCAG 2.5.8 |

---

## 4. Tipografía

### 4.1 Familias

| Token | Familia | Uso |
| :--- | :--- | :--- |
| `--font-display` | **Bricolage Grotesque Variable** | Títulos, display |
| `--font-sans` | **Instrument Sans Variable** | Texto corriente, UI |
| `--font-mono` | **JetBrains Mono** | Etiquetas, datos, precios |

Las tres son **self-hosted** vía `@fontsource`. Sin peticiones a Google Fonts:
mejor privacidad (no se comparte la IP del visitante con un tercero) y mejor LCP.

**Subset:** se sirve el latino, con `unicode-range` en el `@font-face`. Un visitante
en español **no descarga** latin-ext ni vietnamita.

### 4.2 Escala

| Token | Tamaño | Interlineado | Uso |
| :--- | :--- | :--- | :--- |
| `--text-display` | `clamp(2.25rem, 5.5vw, 3.75rem)` | 1.03 | Solo el hero |
| `--text-titulo-1` | `clamp(1.875rem, 4vw, 2.75rem)` | 1.1 | `<h1>` · una por página |
| `--text-titulo-2` | `clamp(1.5rem, 2.8vw, 2rem)` | 1.15 | `<h2>` secciones |
| `--text-titulo-3` | `1.25rem` | 1.25 | `<h3>` subsecciones |
| `--text-cuerpo` | `1rem` | 1.65 | Texto corriente |
| `--text-pequeno` | `0.875rem` | 1.5 | Notas, apoyos |
| `--text-micro` | `0.75rem` | 1.4 | Etiquetas en monoespaciada |

Los tres tamaños grandes usan `clamp()`: escalan con el viewport **sin media queries**
y sin saltos bruscos. Todo está en `rem`, así que respeta el zoom del navegador
(WCAG 1.4.4).

### 4.3 Detalles

- Títulos con `text-wrap: balance` → evita palabras huérfanas en móvil.
- Párrafos con `text-wrap: pretty`.
- Cifras con `font-variant-numeric: tabular-nums` en la clase `.dato` → los precios y la
  barra de datos se alinean como una tabla financiera.

---

## 5. Espaciado y radios

### 5.1 Espaciado

Se usa la escala de Tailwind (múltiplos de 4 px) más:

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `--spacing-seccion` | `5rem` (80 px) | Separación vertical entre secciones |

### 5.2 Radios

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `--radius-xs` | 6 px | Foco, detalles |
| `--radius-sm` | 10 px | Inputs, chips |
| `--radius-md` | 16 px | Tarjetas pequeñas |
| `--radius-lg` | 22 px | Bloques internos |
| **`--radius-marca`** | **26 px** | Tarjetas y contenedores principales |
| `--radius-full` | 9999 px | Botones (píldora) |

> **`--radius-marca` es un token de identidad, no una preferencia estética.**
> El isotipo de RUWAY es un cuadrado de 120 × 120 con un radio de esquina de **26**.
> Esa proporción (26/120) es la firma geométrica de la marca y se reproduce en el
> contenedor principal de cada tarjeta, de modo que el sitio "se vea RUWAY" incluso
> sin mostrar el logo.

---

## 6. Movimiento

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `--dur-rapida` | 150 ms | Cambios de color, hover |
| `--dur-media` | 250 ms | Transiciones de estado |
| `--dur-lenta` | 400 ms | Aparición de bloques |
| `--ease-salida` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Entradas con frenada suave |
| `--ease-entrada` | `cubic-bezier(0.4, 0, 1, 1)` | Salidas |
| `--ease-suave` | `cubic-bezier(0.33, 0, 0.2, 1)` | Animaciones largas |

### 6.1 Motion con significado

La única animación "de marca" es **el trazo del isotipo que se dibuja**: la escalera se
construye segmento a segmento. No es decoración: *es literalmente el concepto de la marca*
—aprender **paso a paso**—. Se implementa con `stroke-dashoffset`.

### 6.2 Regla de `prefers-reduced-motion` (WCAG 2.3.3 / 2.2.2)

**El estado por defecto es sin animación.** Las clases animadas existen **únicamente**
dentro de `@media (prefers-reduced-motion: no-preference)`:

```css
@media (prefers-reduced-motion: no-preference) {
  .anim-aparecer { animation: aparecer var(--dur-lenta) var(--ease-salida) both; }
}
```

Además, hay una red de seguridad global que anula cualquier transición y el *scroll suave*
cuando el usuario pide reducir movimiento. **Ninguna información depende del movimiento.**

---

## 7. Componentes base (especificados en la vista previa 3.1)

| Componente | Especificación | Criterio de accesibilidad |
| :--- | :--- | :--- |
| **Botón CTA** | Píldora, fondo Maíz, texto Piedra, `padding` 0.75/1.5 rem, peso 600 | 9.62:1 · objetivo 44 px |
| **Botón secundario** | Píldora, borde `--borde-control`, sin relleno | Borde ≥3:1 |
| **Botón deshabilitado** | Fondo `superficie-alta`, texto `texto-suave`, `disabled` real | No depende del color |
| **Barra de datos** | `<dl>` con JetBrains Mono, 6 pares término/valor | Estructura semántica |
| **Acordeón FAQ** | `<details>`/`<summary>` nativos | Teclado sin JavaScript |
| **Estados** | Texto + símbolo (`●`, `▲`) + color | No depende del color |
| **Skip link** | Oculto hasta `:focus-visible`; salta a `#contenido` | WCAG 2.4.1 |
| **Tarjeta** | Fondo `superficie`, borde `borde`, radio `marca` | — |

---

## 8. Accesibilidad integrada en el sistema

| Mecanismo | Dónde | Criterio |
| :--- | :--- | :--- |
| Anillo de foco de 3 px siempre visible | `global.css` | 2.4.7 |
| `scroll-margin-top` en todo `[id]` | `global.css` | 2.4.11 |
| Altura mínima táctil de 44 px en controles | `global.css` | 2.5.8 |
| `.visualmente-oculto` para texto solo de lectores | `global.css` | 1.3.1 |
| `.saltar-enlace` | `global.css` | 2.4.1 |
| Contraste verificado token a token | `tokens.css` | 1.4.3 · 1.4.11 |
| Movimiento bajo `prefers-reduced-motion` | `global.css` | 2.2.2 · 2.3.3 |
| `<html lang="es-PE">` | Layout | 3.1.1 |

---

## 9. Verificación ejecutada en 3.1

| Comprobación | Resultado |
| :--- | :--- |
| `npm install` | ✅ 209 paquetes |
| `npm run build` | ✅ HTML estático generado en ~1 s |
| `sitemap-index.xml` | ✅ generado por `@astrojs/sitemap` |
| Familias tipográficas | ✅ los 3 nombres coinciden con `@fontsource` |
| Peso real de fuentes para español | ✅ ~90 KB (3 archivos woff2) |
| Tokens en la salida | ✅ `color-mix()` resuelto en **build-time** por Lightning CSS: el CSS final lleva los hex ya calculados |
| Valores derivados verificados | ✅ `#5b5d5f`, `#7ea795`, `#d99683`, `#5e626d`, `#646974` — coinciden con los ratios calculados |
| Peso de CSS | ✅ 16.6 KB minificado (≈5 KB con Brotli) |
| Tema oscuro | ✅ `@media (prefers-color-scheme: dark)` + `[data-tema="oscuro"]` presentes |
| `prefers-reduced-motion` | ✅ presente en el CSS compilado |

> **Ventaja inesperada:** aunque en el origen escribimos `color-mix()` (expresivo y
> auditable), Lightning CSS lo **evalúa durante el build**. Resultado: el CSS final
> contiene colores planos, así que el sitio se ve correcto **incluso en navegadores que
> no soportan `color-mix()`** — accesibilidad real, no solo en los navegadores modernos.

---

## 10. Archivos

| Archivo | Contenido |
| :--- | :--- |
| `ruway-web/src/styles/tokens.css` | Capas 1 y 2 completas, ambos temas |
| `ruway-web/src/styles/global.css` | Reset, base, utilidades, movimiento y reglas de accesibilidad sin capa |
| `ruway-web/src/data/site.ts` | Datos duros del sitio (contacto, sede, ciclo) |
| `ruway-web/src/data/navegacion.ts` | Enlaces del header y del footer |
| `ruway-web/src/lib/rutas.ts` | Normalización de rutas (canonical y página actual) |
| `ruway-web/src/lib/whatsapp.ts` | Enlaces `wa.me` con mensaje prefijado |
| `ruway-web/src/layouts/BaseLayout.astro` | `<head>`, tema sin parpadeo, landmarks, JSON-LD global |
| `ruway-web/src/components/` | `Header`, `Footer`, `BotonCTA`, `Marca`, `SkipLink` |
| `ruway-web/src/pages/index.astro` | ✅ Vista previa **temporal** (se reemplaza por la Home en 3.3) |
| `ruway-web/scripts/` | Herramientas de verificación (auditoría, capturas, imagen OG) |
| `ruway-web/README.md` | Guía de mantenimiento para el fundador |

---

## 11. Verificación del incremento 3.2 (layout base)

### Comprobado

| Qué | Cómo | Resultado |
| :--- | :--- | :--- |
| Estructura y accesibilidad | `npm run verificar` (auditoría sobre `dist/`) | ✅ 0 errores |
| Idioma, un solo `<h1>`, sin saltos de encabezado | Auditoría | ✅ |
| Un solo `<main>`, landmarks, enlace «saltar al contenido» | Auditoría | ✅ |
| `<img>` con `alt`, botones y enlaces con nombre accesible | Auditoría | ✅ |
| `id` únicos, sin `tabindex` positivo | Auditoría | ✅ |
| Marca de página actual | Estilo **calculado** en el navegador | ✅ `text-decoration-line: underline` |
| Objetivo táctil del alternador de tema | Estilo calculado | ✅ 44 × 44 px |
| Canonical | HTML generado | ✅ `https://academiaruway.com/` |
| Sitemap | `dist/sitemap-0.xml` | ✅ 1 URL, `priority 1.0` |
| Cambio de logo por tema | Capturas en claro y oscuro | ✅ Sin JavaScript |
| Menú móvil abierto | Captura forzada con `data-abierto="true"` | ✅ |
| Peso | `dist/` | CSS **21,7 KB** · HTML **20,3 KB** · JS **0 KB** (≈1,1 KB incrustados) |

### Dos fallos reales encontrados y corregidos

Los dos se detectaron **midiendo**, no mirando la pantalla. Están registrados como ADR-011 y ADR-012.

1. **El subrayado de «página actual» no se aplicaba.** La regla vivía en `@layer base` y
   `.no-underline` (capa `utilities`) la anulaba. El estado se distinguía **solo por color**.
2. **El canonical del primer build decía `/index.html`.** Con `build.format: 'file'`,
   `Astro.url.pathname` incluye la extensión. Se corrigió con `normalizarRuta()`.

Además se corrigieron dos detalles de contenido: faltaba el espacio en «WhatsApp +51 930 736 214»
(la expresión y el texto quedaban en líneas distintas del marcado) y la dirección mostraba
«Cajamarca, Cajamarca, Perú».

### Regla que queda para el resto del proyecto

> Una regla de accesibilidad no está terminada hasta que se **mide el estilo calculado** en el
> navegador. Que se vea bien en una captura no demuestra que se aplique.

### Herramientas nuevas (reutilizables en todas las fases)

| Comando | Qué hace |
| :--- | :--- |
| `npm run verificar` | Compila y audita el HTML: encabezados, `alt`, landmarks, ARIA, etiquetas de formulario, canonical |
| `npm run capturar` | Capturas a 390 / 768 / 1280 px reales en tema claro y oscuro (por CDP) |
| `npm run capturar -- --alto 1750 --y 3500` | **Recorte vertical.** Captura solo 1750 px empezando a 3500 px del documento. Necesario porque la Home mide ~7 000 px en escritorio: una captura completa se reduce tanto que no se puede revisar. El nombre del archivo incluye `-y3500` para no confundir recortes con páginas completas. |
| `npm run og` | Regenera la imagen para compartir en redes |

---

## 12. Decisiones resueltas por el responsable (2026-10-16)

| Tema | Resolución |
| :--- | :--- |
| **Colores derivados** | ✅ **Aprobados tal como están.** Los 5 tokens derivados (§3.2) quedan ratificados como valores oficiales del sistema. Se documentan en `tokens.css` con su receta de mezcla, de modo que cualquiera pueda reproducir el valor desde la paleta del manual. |
| **Tema por defecto** | ✅ **Arranca en claro.** Se mantiene el comportamiento actual: tema claro si el sistema no dice nada; oscuro si el sistema lo pide; y siempre manda el botón del header si el usuario elige. |

**Consecuencia práctica.** Los 6 colores del manual siguen siendo los únicos colores de
*identidad*. Los derivados son colores **de interfaz** (texto secundario, bordes de control,
estados) y viven en `tokens.css` como capa 2, nunca en componentes. Regla: si un derivado no
alcanza 4.5:1 en alguno de los dos temas, no se usa.

---

## 13. Incremento 3.3 — Home

### Los 11 bloques

| # | Bloque | Componente | Qué aporta |
| --: | :--- | :--- | :--- |
| 1 | Hero | `home/Hero.astro` | Eslogan, fecha de inicio y doble CTA |
| 2 | Barra de datos | `home/BarraDatos.astro` | 8 semanas · 24 sesiones · 48 h · 7 a 10 · 14+ |
| 3 | Propuesta de valor | `home/PropuestaValor.astro` | Las cuatro razones del §2.5 |
| 4 | Para quién | `home/ParaQuien.astro` | Tres perfiles, tres proyectos |
| 5 | El camino | `home/Camino.astro` | Los cuatro escalones |
| 6 | Herramientas | `home/Herramientas.astro` | Ocho herramientas, todas con plan gratuito (cuadrícula 4 × 2) |
| 7 | Resultado | `home/Resultado.astro` | Los seis puntos del egresado |
| 8 | Precio resumido | `home/PrecioResumen.astro` | Lanzamiento + precio de lista |
| 9 | Sede | `home/Sede.astro` | Dirección, horario y referencia del local |
| 10 | Honestidad | `home/Honestidad.astro` | Certificado sin validez MINEDU |
| 11 | Llamado final | `home/CtaFinal.astro` | Banda de Maíz con la reserva de demo |

`index.astro` no escribe una sola frase: solo compone los once bloques. Todo el texto vive en
`src/data/`.

### Decisiones de diseño que conviene no deshacer

| Decisión | Por qué |
| :--- | :--- |
| **El escalón es el motivo de toda la página** | El símbolo de la marca ya es una escalera y el eslogan dice «paso a paso». El bloque «El camino» usa la misma geometría en lugar de un gráfico genérico de línea de tiempo: la forma *es* el mensaje. |
| **Un elemento, dos lecturas** | En escritorio los cuatro escalones se comparan entre sí y la **altura** dibuja la escalera. En móvil van apilados, no hay con qué compararlos y la altura no diría nada: ahí el **ancho** dibuja el 25 / 50 / 75 / 100 % del recorrido. Mismo nodo, mismo dato, dos formas de contarlo. |
| **Maíz solo como relleno, nunca como texto sobre Cal** | Refuerza la regla del manual (Maíz sobre Cal = 1.6:1). El único bloque con fondo de color lleno es el llamado final, y ahí el texto va en Piedra (9.62:1). |
| **El bloque del certificado está en la portada** | El §5.7 y el `SOUL.md` lo piden siempre y con la misma claridad. Es un diferenciador de marca, no un aviso legal: si ahí se exagerara, no valdría nada de lo de arriba. |
| **Los precios se escriben a mano en el código** | `soles()` formatea desde `src/data/precios.ts`, que es la tabla única del §6.1. Ningún componente inventa una cifra. |

### Accesibilidad: tres cosas que se rompen solas si no se vigilan

1. **Anillo de foco sobre Maíz.** En tema oscuro `--ruway-foco` vale Maíz; sobre una banda de
   Maíz el anillo desaparecería. La banda del llamado final redefine `--ruway-foco` y
   `--ruway-acento` a Piedra para todo su contenido.
2. **Precio tachado.** Un `<s>` no lo anuncia un lector de pantalla. El precio de lista lleva
   además el texto oculto «Precio normal: », de modo que quien no ve el tachado entiende las dos
   cifras (WCAG 2.2 · 1.3.1).
3. **Iconos siempre acompañados.** Los 13 iconos son `aria-hidden` y decorativos por diseño: el
   mensaje va siempre en el texto, nunca solo en el dibujo (WCAG 2.2 · 1.1.1).

### Herramienta: el auditor también tenía un fallo

El primer pase de `npm run verificar` sobre la Home dio **«hay 2 elementos `<h1>`»**. El segundo
`<h1>` no existía: era una mención a `<h1>` dentro de un **comentario HTML** del componente Hero.
El fallo estaba en el auditor, que analizaba el HTML sin quitar los comentarios. Ahora los quita
antes de medir, así que un comentario nunca más podrá provocar un error falso.

---

## 14. Incremento 3.4 — páginas internas

### Las once páginas

| Ruta | Tamaño del problema | Anclas del sitemap §8 |
| :--- | :--- | :--- |
| `/programa` | El más largo: ficha, 8 semanas, metodología, herramientas, evaluación, certificado | `#ficha` `#temario` `#semana-1`…`#semana-8` `#metodologia` `#herramientas` `#evaluacion` `#certificado` |
| `/precios` | Tabla única + 5 descuentos + 6 situaciones de devolución | `#tarifas` `#descuentos` `#devoluciones` |
| `/preguntas-frecuentes` | Las 12 objeciones reales | — |
| `/sobre` | Identidad, enfoque, sede y equipo | `#identidad` `#metodo` `#sede` `#equipo` |
| `/contacto` | NAP + canales directos (SEO local) | `#mapa` `#formulario` |
| `/instituciones` | Landing B2B del taller gratuito | — |
| `/privacidad` | Ley 29733, menores, derechos ARCO | por cláusula |
| `/terminos` | Matrícula, precios, certificado, faltas, devoluciones | por cláusula |
| `/cookies` | «Aquí no hay ninguna» | por cláusula |
| `/404` | Recuperación accesible | — |

### Piezas nuevas del sistema

| Pieza | Archivo | Qué resuelve |
| :--- | :--- | :--- |
| Plantilla de página interna | `layouts/PlantillaPagina.astro` | Banda de cabecera con migas + `<h1>` + entrada, y el `BreadcrumbList` construido con **las mismas** migas que se ven. |
| Migas de pan | `components/Migajas.astro` + `lib/migajas.ts` | La última miga es la página actual y no es un enlace: un enlace a donde ya estás es ruido para un lector de pantalla. |
| Cierre configurable | `components/Cierre.astro` | La misma banda de Maíz con acciones intercambiables, para que `/instituciones` pueda ofrecer un taller y el resto una demo. |
| Acordeón | (nativo) `<details>`/`<summary>` | Cero JavaScript. Funciona con teclado, con lector de pantalla y con `Ctrl+F` del navegador, que abre la respuesta que busca. |
| Contenido legal | `data/legal.ts` + `components/ContenidoLegal.astro` | Las tres páginas legales comparten estructura e índice lateral; el contenido se declara una vez. |
| Marca de pendiente | `components/Pendiente.astro` | Un dato que falta se ve como un hueco deliberado, no como un error. |
| Retorno al embudo | `components/Retorno.astro` | Salida sobria al final de las páginas informativas: sin amarillo y sin botón grande, porque quien lee la política de privacidad no está comprando. |

### Decisiones de diseño que conviene no deshacer

| Decisión | Por qué |
| :--- | :--- |
| **El temario es una lista con índice de saltos** | `/programa` mide más de 6.700 px en escritorio. El índice de las ocho semanas convierte un desplazamiento largo en ocho destinos. |
| **La estructura de la sesión no es una tabla** | Son tres columnas cortas (momento · duración · actividad). Una tabla obligaría a desplazamiento horizontal a 390 px o a reescribir el marcado; una lista se lee igual en todos los anchos. |
| **El mapa es un enlace, no un iframe** | ADR-016: un mapa incrustado instala cookies de Google y obligaría a un banner en todo el sitio. |
| **El aviso del certificado va en `/programa` y en `/terminos`** | Es la afirmación que más se consulta antes de pagar. En el contrato y en la web dice lo mismo, con la misma frase. |
| **Las páginas legales llevan índice fijo** | Un texto legal largo sin índice es un texto legal que nadie lee. La columna izquierda se queda fija mientras se lee. |
| **`/404` no usa `PlantillaPagina`** | Las migas de pan no significan nada cuando la ruta pedida no está en el mapa, y una cabecera de página normal daría a entender que sí lo está. |

### Verificación ejecutada

| Comprobación | Resultado |
| :--- | :--- |
| `npm run build` | 11 páginas · 0 errores |
| Auditoría estructural | ✓ Sin errores en 11 páginas |
| Enlaces internos y anclas | ✓ Sin enlaces rotos · 1 pendiente declarado (`/inscripcion`, 17 enlaces) |
| Datos estructurados | ✓ Los 11 nodos parsean y declaran los tipos del §10.1 |
| `sitemap.xml` | 10 URLs · `/404` y `/gracias` excluidos · prioridades 1.0 / 0.8 / 0.3 |
| Peso | CSS 29,4 KB · **JS externo 0 KB** · HTML total 331 KB en 11 páginas |
| Capturas | 390 · 768 · 1280 px en tema claro y oscuro |

---

## 15. Incremento 3.5 — el formulario

### Las dos páginas

| Ruta | Qué resuelve | Anclas del sitemap §8 |
| :--- | :--- | :--- |
| `/inscripcion` | Requisitos → formulario → qué pasa después. Un solo formulario (ADR-004) para las dos intenciones: clase demo y matrícula | `#requisitos` `#formulario` `#despues` |
| `/gracias` | Confirmación, qué sigue y punto de medición. `noindex, follow`: no aporta nada a un buscador y no queremos visitas que lleguen aquí sin haber enviado nada | — |

`/contacto` recibe el mismo componente en `#formulario`, con su propio prefijo de `id`. Los canales
directos (WhatsApp y correo) siguen debajo: hay quien prefiere escribir sin rellenar nada.

### El flujo, en tres pasos

```
1. RELLENAR        →  2. REVISAR (ADR-022)      →  3. CONFIRMAR
   Validación         El mensaje exacto que        WhatsApp en otra pestaña
   propia, con        se va a abrir, en el         (enlace real: ningún
   error junto        mismo formato que una        bloqueador lo cancela)
   al campo           burbuja de WhatsApp          + esta pestaña → /gracias
```

### Piezas nuevas del sistema

| Pieza | Archivo | Qué resuelve |
| :--- | :--- | :--- |
| Composición del mensaje | `lib/mensaje.ts` | Una función pura que arma el texto, más la normalización del teléfono. La usan **la vista previa y el enlace de envío**: que el mensaje revisado y el enviado sean el mismo no depende de la disciplina de nadie, es la misma llamada. |
| Formulario | `components/Formulario.astro` | Validación propia, resumen `role="alert"`, error de texto junto a cada campo, paso de revisión y estado `role="status"`. Se instancia dos veces con prefijos distintos, así que sus `id` nunca chocan. |
| Prueba funcional | `scripts/probar-formulario.mjs` | 47 comprobaciones en Chrome real (ADR-023). Es lo único del proyecto que no se puede verificar leyendo HTML compilado. |

### Decisiones de diseño que conviene no deshacer

| Decisión | Por qué |
| :--- | :--- |
| **El teléfono se normaliza, no se rechaza** | «+51 930 736 214», «930-736-214» y «051 930736214» son el mismo número. Se aceptan y se escriben siempre como «930 736 214». Un formulario que rechaza el número correcto por venir con el prefijo del país es un formulario que pierde al visitante. |
| **La validación es propia, no la del navegador** | `novalidate` desactiva los globos nativos, que desaparecen a los pocos segundos y no se quedan junto al campo. Los mensajes propios sí: bajo el campo, con el campo marcado y con un resumen que se puede recorrer. |
| **Los errores se cuentan, y se dice cuántos** | «5 campos por revisar» en la región de estado. Sin eso, quien no ve la pantalla no sabe si el problema es uno o siete. |
| **El resumen de errores repite el nombre del campo** | «WhatsApp: Escribe tu número de 9 dígitos» en lugar de solo el mensaje: con cinco errores seguidos hay que saber a cuál pertenece cada uno. |
| **«Revisar el mensaje» es un `submit` real, con `method="post"` y sin `action`** | Sin JavaScript el formulario no puede armar nada. Con `post`, ningún dato acaba en la barra de direcciones; sin `action`, no hay a dónde enviar. Y el `<noscript>` lo explica con palabras y ofrece WhatsApp, que sí funciona siempre. |
| **`?intencion=` se aplica con JavaScript** | El sitio es estático: la cadena de consulta no existe durante la compilación. Se lee en el navegador y, si no es uno de los dos valores válidos, no se marca nada. |
| **El número del paso es texto, no una imagen ni un `::before`** | Se lee con lector de pantalla y cumple 1.4.5 sin discusión. Va con `aria-hidden` porque el orden ya lo aporta el `<ol>`: leerlo dos veces molesta. |
| **El círculo de opción del radio es toda la tarjeta** | El objetivo táctil pasa de 20 px a toda la tarjeta: cumple 2.5.8 con margen y en móvil se acierta sin apuntar. |
| **El anillo de foco de la tarjeta no es el del círculo** | Un anillo de 3 px sobre un círculo de 20 px es difícil de ver. Con `:has()`, el foco se pinta en la tarjeta entera; si el navegador no lo soporta, el círculo conserva su anillo (el `outline: none` solo se aplica dentro de `@supports selector(:has(*))`). |

### Verificación ejecutada

| Comprobación | Resultado |
| :--- | :--- |
| `npm run build` | 13 páginas · 0 errores |
| Auditoría estructural | ✓ Sin errores en 13 páginas |
| Enlaces internos y anclas | ✓ Sin enlaces rotos · **0 pendientes** (la lista quedó vacía) |
| Datos estructurados | ✓ Los 13 nodos son válidos y declaran los tipos del §10.1 |
| `npm run probar-formulario` | ✓ 47 comprobaciones en Chrome real, incluidas la del mensaje revisado = mensaje enviado y la de que confirmar lleva a `/gracias` |
| `sitemap.xml` | 11 URLs · `/404` y `/gracias` excluidos · prioridades 1.0 / 0.8 / 0.3 |
| Peso | CSS externo 30,3 KB · CSS del formulario 0,7 KB en línea · **JS 5,3 KB, y solo se descarga en `/inscripcion` y `/contacto`** · HTML total 400 KB en las 13 páginas |
| Capturas | 390 · 768 · 1280 px en tema claro y oscuro, más los dos estados que solo existen tras interactuar (resumen de errores y paso de revisión) |

---

## 16. Incremento 3.6 — accesibilidad y rendimiento medidos

Hasta aquí la accesibilidad se sostenía en el marcado y en las reglas de la paleta. Este incremento la
mide en un navegador real, cierra el hueco de lo que solo se ve calculando estilos y deja el resultado
en **`../accessibility-report.md`**.

### Qué se añadió

| Comando | Alcance | Barrera |
| :--- | :--- | :--- |
| `npm run auditar-a11y` | axe-core sobre las 13 páginas × 2 temas × 2 tamaños (**52 pasadas**) + los 2 estados del formulario en 2 páginas | Cualquier violación con etiqueta WCAG |
| — mismo comando — | Recorrido real con eventos `Tab` (**531 paradas**): indicador de foco, foco no oscurecido, sin trampas, enlace de salto primero | Cualquier parada sin indicador, tapada o en bucle |
| — mismo comando — | Reflujo a 320 px y al 200 % (640 px) | Desborde horizontal |
| `npm run auditar-rendimiento` | Lighthouse en móvil 4G emulado y escritorio, 13 páginas × 2 perfiles | Las 4 categorías ≥ 95 · LCP < 2,5 s · CLS < 0,1 · TBT < 200 ms · HTML+CSS < 150 KB |

### El resultado, en una línea

**0 violaciones de WCAG 2.2 AA** en 56 pasadas de axe-core (70 reglas WCAG de las 105 que trae, **0 avisos**
de buenas prácticas), **0 problemas en 531 paradas de teclado** y **0 desbordes** en las 13 páginas.

### Rendimiento

| Perfil | Rend. | A11y | Buenas prácticas | SEO | LCP | CLS | TBT | HTML+CSS |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: | :---: | :--- |
| **Móvil 4G** (13 páginas) | 99 | 100 | 100 | 100, salvo `/gracias` y `/404` | 1,66 s | ≤ 0,017 | **0 ms** | 12,0–17,5 KB |
| **Escritorio** (13 páginas) | 100 | 100 | 100 | igual | **0,37 s** | ≤ 0,013 | **0 ms** | idem |

Dos páginas quedan fuera de la barrera de SEO, y no por descuido: **`/gracias`** y **`/404`** llevan
`noindex, follow` (ADR-020), la primera porque existe para cerrar el embudo y la segunda porque es la
página de error. Lighthouse las puntúa con 69 y tiene razón en su lógica. El guion no se limita a
perdonarlas: **exige que la auditoría que falla sea la escrita para cada una** (`is-crawlable`) y, si
falla otra, la nombra. Si mañana alguien quita el `noindex`, la auditoría lo dice el mismo día.

El presupuesto del §6.4 habla de «< 150 KB (HTML+CSS) sin imágenes». Se cumple en las dos lecturas: en
la más exigente —lo que viaja comprimido, 17,5 KB en la Home— y en la más literal, los 78,3 KB que ocupa
la Home en disco (48 KB de HTML + 30,3 KB de CSS).

### Piezas nuevas

| Pieza | Archivo | Qué resuelve |
| :--- | :--- | :--- |
| Cliente CDP compartido | `scripts/lib/navegador.mjs` | Abre Chrome, emula tamaño/tema/movimiento reducido, navega y evalúa. Lo usan **cuatro** scripts. Antes eran dos copias del mismo bloque de cien líneas, y las auditorías nuevas iban a ser la tercera y la cuarta. |
| Auditoría de accesibilidad | `scripts/auditar-accesibilidad.mjs` | axe-core, teclado y reflujo, con salida distinta de cero si algo falla. |
| Auditoría de rendimiento | `scripts/auditar-rendimiento.mjs` | Lighthouse por la API de Node, con los presupuestos como barrera. |
| Informe | `../accessibility-report.md` | Los resultados, el criterio por criterio con su forma de verificación, y —lo más importante— **lo que la automatización no puede hacer**. |

### Decisiones que conviene no deshacer

| Decisión | Por qué |
| :--- | :--- |
| **axe-core y Lighthouse entran como `devDependencies`, y nada más** (ADR-025) | Son herramientas de medición. No suman un byte al CSS ni al JavaScript que descarga el visitante, y no tocan `dependencies`. |
| **El recorrido se hace con eventos `Tab` reales, no con `.focus()`** (ADR-026) | Solo así decide Chrome: adónde va el foco, cuándo aplica `:focus-visible` y cuánto desplaza la página. Con `.focus()` se mide lo que uno cree que pasa. |
| **Se espera a que la parada se asiente antes de medirla** (ADR-026) | `scroll-behavior: smooth` anima el desplazamiento y el enlace de salto entra con una transición de `top`. La primera versión midió a los 40 ms y dio **13 fallos que no existían**. |
| **«Tapado» es quién se pinta encima, no geometría** (ADR-026) | La cabecera es fija: todo pasa por debajo en algún momento. `elementFromPoint` sobre las **cajas de línea** responde la pregunta correcta —y sobre la caja envolvente daría falsos positivos con los enlaces que rompen en dos líneas, porque su centro cae en el hueco entre ambas. |
| **La firma de foco incluye dos ancestros** (ADR-026) | El radio y la casilla del formulario son `visually-hidden` dentro de una tarjeta y el anillo se pinta en la tarjeta. Mirando solo el control, las dos paradas parecerían no tener indicador. |
| **`/gracias` y `/404` se exceptúan del SEO con el motivo comprobado** | Una excepción sin comprobación es un permiso permanente. El guion exige que siga fallando la auditoría prevista. |
| **Las auditorías corren con `prefers-reduced-motion: reduce`** | Para no medir estados intermedios de una animación. Queda dicho en el §7 del informe: el estado *durante* el movimiento no está cubierto por axe. |

### Verificación ejecutada

| Comprobación | Resultado |
| :--- | :--- |
| `npm run build` | 13 páginas · 0 errores |
| `npm run verificar` | ✓ Estructura · ✓ enlaces y anclas · ✓ 13 nodos JSON-LD |
| `npm run probar-formulario` | ✓ **47/47** (vuelto a correr tras migrar el script al cliente CDP compartido) |
| `npm run capturar` | ✓ Las tres vistas siguen saliendo tras la migración |
| `npm run auditar-a11y` | ✓ 52 + 4 pasadas de axe sin violaciones · 531 paradas de teclado sin problemas · 13/13 sin desborde |
| `npm run auditar-rendimiento` | ✓ 4 categorías ≥ 95 y los presupuestos del §6.4 en las 26 mediciones |

---

## 17. Estado

| Incremento | Estado |
| :--- | :--- |
| 3.1 · Proyecto y sistema de diseño | ✅ Aprobado |
| 3.2 · Layout base (header, footer, landmarks, temas) | ✅ Aprobado |
| 3.3 · Home (11 bloques) | ✅ Aprobado |
| 3.4 · Páginas internas (11 páginas) | ✅ Aprobado |
| 3.5 · Formulario (`/inscripcion`, `/gracias`) | ✅ Aprobado (`$approve-3.5`) |
| 3.6 · Optimización y `accessibility-report.md` | ✅ Aprobado (`$approve-3.6`) |
