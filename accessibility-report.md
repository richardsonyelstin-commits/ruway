# Informe de accesibilidad — academiaruway.com

**Medición:** 16 de octubre de 2026 · **Versión del sitio:** build de las 13 páginas de la Fase 3
**Estándar de referencia:** WCAG 2.2, nivel AA · **Público declarado:** escolares desde 14 años y sus familias

Este informe es el resultado del incremento 3.6. Recoge **qué se midió**, **qué dio**, **qué no puede
medir una máquina** y **cómo se vuelve a correr**. Los documentos de las fases anteriores siguen siendo
la referencia de fondo: el §5.3 de `02-arquitectura.md` explica criterio por criterio *cómo se cumple*,
y `03-sistema-diseno.md` explica con qué piezas.

---

## 1. Qué se midió y con qué

| Bloque | Herramienta | Alcance | Comando |
| :--- | :--- | :--- | :--- |
| Automatizable | **axe-core 4.14.0** | 13 páginas × 2 temas × 2 tamaños = **52 pasadas**, más 2 estados del formulario en 2 páginas = 4 pasadas | `npm run auditar-a11y` |
| Teclado | **Chrome real** por CDP, eventos `Tab` reales | Las 13 páginas, **531 paradas de foco** | `npm run auditar-a11y` |
| Reflujo | **Chrome real**, viewport a 320 px y a 640 px (texto al 200 %) | Las 13 páginas | `npm run auditar-a11y` |
| Rendimiento | **Lighthouse 13.5.0** | 13 páginas × móvil 4G emulado y escritorio | `npm run auditar-rendimiento` |
| Marcado | `auditar-html.mjs` · `verificar-enlaces.mjs` · `verificar-datos-estructurados.mjs` | Las 13 páginas | `npm run verificar` |
| Formulario | Prueba funcional por CDP (ADR-023) | 47 comprobaciones | `npm run probar-formulario` |

Las tres primeras filas necesitan `npm run preview` en marcha y se lanzan por separado a propósito: son
lentas y `npm run verificar` tiene que poder correr sin navegador (ADR-025).

---

## 2. axe-core: cero violaciones

```
52 pasadas · 70 reglas WCAG de 105 evaluadas · 0 violaciones WCAG · 0 avisos de buenas prácticas
```

| Cobertura | Resultado |
| :--- | :--- |
| 13 páginas × tema claro / oscuro × móvil 390 px / escritorio 1280 px | **0 violaciones** en las 52 combinaciones |
| `/inscripcion` · resumen de errores y paso de revisión | **0 violaciones** |
| `/contacto` · resumen de errores y paso de revisión | **0 violaciones** |

Que estén los **dos temas** no es un adorno: la paleta tiene reglas de contraste que solo se pueden
comprobar midiendo. Maíz sobre Piedra da 9,62:1 y Maíz sobre Cal da 1,6:1 — el mismo color, dos
veredictos opuestos. axe-core evalúa el contraste real de cada nodo en cada tema, y por eso las
combinaciones prohibidas del §5.2 quedan cubiertas por una prueba y no por disciplina.

Que estén los **estados del formulario** tampoco: el resumen de errores y el paso de revisión no
existen en ninguna URL. Solo aparecen después de interactuar, y ahí es donde vive el `role="alert"`, el
error por campo y el `aria-live` de la confirmación.

De las 105 reglas que trae axe-core, **70 están etiquetadas como WCAG A o AA** y son las que forman la
barrera. Las 35 restantes son de buenas prácticas o de nivel AAA: se evalúan igual y se informan aparte
sin tumbar la auditoría. En esta medición no reportaron nada.

---

## 3. Teclado: 531 paradas, ninguna con problemas

El recorrido se hace con **eventos `Tab` reales**, no con `.focus()` desde la página: Chrome decide
adónde va el foco, aplica `:focus-visible` y hace su propio desplazamiento. Por cada parada se comprueba
que hay indicador de foco, que nada lo tapa y que no se repite en bucle.

| Página | Paradas | Primer `Tab` | Indicador | No oscurecido | Sin trampa |
| :--- | --: | :--- | :---: | :---: | :---: |
| `/` | 32 | Enlace de salto | ✓ | ✓ | ✓ |
| `/programa` | 36 | Enlace de salto | ✓ | ✓ | ✓ |
| `/precios` | 56 | Enlace de salto | ✓ | ✓ | ✓ |
| `/preguntas-frecuentes` | 41 | Enlace de salto | ✓ | ✓ | ✓ |
| `/sobre` | 29 | Enlace de salto | ✓ | ✓ | ✓ |
| `/contacto` | 43 | Enlace de salto | ✓ | ✓ | ✓ |
| `/instituciones` | 29 | Enlace de salto | ✓ | ✓ | ✓ |
| `/inscripcion` | 82 | Enlace de salto | ✓ | ✓ | ✓ |
| `/gracias` | 32 | Enlace de salto | ✓ | ✓ | ✓ |
| `/privacidad` | 39 | Enlace de salto | ✓ | ✓ | ✓ |
| `/terminos` | 42 | Enlace de salto | ✓ | ✓ | ✓ |
| `/cookies` | 38 | Enlace de salto | ✓ | ✓ | ✓ |
| `/404` | 32 | Enlace de salto | ✓ | ✓ | ✓ |
| **Total** | **531** | **13 / 13** | **531 / 531** | **531 / 531** | **13 / 13** |

Qué cubre esto:

- **2.4.1 Evitar bloques.** El primer `Tab` de las 13 páginas llega a «Saltar al contenido principal»,
  que entra en pantalla al recibir foco.
- **2.4.7 Foco visible.** Cada una de las 531 paradas cambia su estilo al enfocarse. La comprobación
  compara el control **y sus dos ancestros** contra una línea base tomada antes de enfocar nada, porque
  el radio y la casilla del formulario son `visually-hidden` dentro de una tarjeta y el anillo se pinta
  en la tarjeta.
- **2.4.11 Foco no oscurecido** (nuevo en WCAG 2.2). Con la cabecera fija, la única pregunta válida es
  quién se pinta encima. Se consulta `elementFromPoint` sobre las **cajas de línea** del control
  —no sobre su caja envolvente, que en un enlace de dos líneas deja el centro en el hueco— y en ningún
  caso otro elemento lo tapa.
- **2.1.2 Sin trampa de teclado.** Ninguna página repite tres veces seguidas el mismo control. En `/404`
  el recorrido cerró el ciclo (volvió al primer control) sin haber agotado el tope de 90 paradas: eso es
  el final natural de la página, no una trampa.

---

## 4. Reflujo y zoom: 13 / 13

| Condición | Qué se mide | Resultado |
| :--- | :--- | :--- |
| Ancho de **320 px** (1.4.10 Reflow, AA) | `scrollWidth` del documento ≤ ancho visible | ✓ Las 13 páginas |
| Ancho equivalente al **texto al 200 %** — 640 px (1.4.4 Redimensionar texto, AA) | Igual | ✓ Las 13 páginas |

Cuando hay desborde, el script dice **qué elemento** lo provoca (los cinco primeros con su etiqueta y su
`id`), no solo que existe. En esta medición no hubo ninguno.

---

## 5. Rendimiento (Lighthouse)

Móvil es el escenario duro: 4G lento emulado y CPU a un cuarto de velocidad. Si algo tiene que fallar,
falla aquí.

**Móvil 4G emulado · 13 páginas**

| Página | Rend. | A11y | Buenas prácticas | SEO | LCP | CLS | TBT | HTML+CSS |
| :--- | --: | --: | --: | --: | --: | --: | --: | --: |
| `/` | 99 | 100 | 100 | 100 | 1,66 s | 0,002 | 0 ms | 17,5 KB |
| `/programa` | 99 | 100 | 100 | 100 | 1,66 s | 0,000 | 0 ms | 16,5 KB |
| `/precios` | 99 | 100 | 100 | 100 | 1,66 s | 0,000 | 0 ms | 14,4 KB |
| `/preguntas-frecuentes` | 99 | 100 | 100 | 100 | 1,66 s | 0,000 | 0 ms | 14,8 KB |
| `/sobre` | 99 | 100 | 100 | 100 | 1,66 s | 0,000 | 0 ms | 14,2 KB |
| `/contacto` | 99 | 100 | 100 | 100 | 1,66 s | 0,017 | 0 ms | 15,8 KB |
| `/instituciones` | 99 | 100 | 100 | 100 | 1,66 s | 0,000 | 0 ms | 13,9 KB |
| `/inscripcion` | 99 | 100 | 100 | 100 | 1,66 s | 0,000 | 0 ms | 16,1 KB |
| `/gracias` | 99 | 100 | 100 | 69 \* | 1,66 s | 0,000 | 0 ms | 12,6 KB |
| `/privacidad` | 99 | 100 | 100 | 100 | 1,66 s | 0,007 | 0 ms | 14,5 KB |
| `/terminos` | 99 | 100 | 100 | 100 | 1,66 s | 0,007 | 0 ms | 15,4 KB |
| `/cookies` | 99 | 100 | 100 | 100 | 1,66 s | 0,000 | 0 ms | 14,2 KB |
| `/404` | 99 | 100 | 100 | 69 \* | 1,66 s | 0,000 | 0 ms | 12,0 KB |

**Escritorio (sin throttling) · 13 páginas:** **100 / 100 / 100 / 100** en todas, LCP **0,37 s**,
CLS ≤ 0,013, TBT 0 ms.

Las cifras son de la corrida final guardada en `.openclaw/tmp/rendimiento.json`. El puntaje de
Lighthouse **oscila ±1 punto entre corridas** —en una pasada anterior, por ejemplo, `/` marcó 1,58 s y
`/404` llegó a 100—, así que lo que importa no es el decimal exacto sino que **ninguna corrida baja de
la barrera**: 95 en las cuatro categorías y LCP < 2,5 s.

\* **Las dos excepciones de SEO son deliberadas, y se comprueba que sigan siéndolo.** `/gracias` y
`/404` llevan `noindex, follow` a propósito: una existe para cerrar el embudo y la otra es la página de
error. Lighthouse las puntúa con 69 y tiene razón en su lógica. El guion de auditoría no se limita a
exceptuarlas: **exige que la auditoría que falla sea la que está escrita para cada una** —`is-crawlable`
en las dos— y, si falla otra, lo dice con su nombre. Si alguien quitara el `noindex`, la auditoría lo
diría el mismo día.

**Los presupuestos del §6.4, uno por uno**

| Presupuesto | Objetivo | Medido | |
| :--- | :--- | :--- | :---: |
| Lighthouse | ≥ 95 en las 4 categorías | 99–100 / 100 / 100 / 100 | ✓ |
| LCP | < 2,5 s en móvil 4G | 1,66 s en las 13 páginas | ✓ |
| CLS | < 0,1 | ≤ 0,017 | ✓ |
| INP | < 200 ms | **0 ms de TBT** como proxy | ≈ |
| Peso HTML+CSS | < 150 KB sin imágenes | ≤ 17,5 KB comprimido · 78,3 KB en disco | ✓ |
| Fuentes | 2 familias + 1 mono, subset latino | 3 familias, y solo se descarga el subset `latin` | ✓ |

Cuatro matices que conviene dejar escritos:

- **El INP no se puede medir en laboratorio.** Es una métrica de campo: necesita interacción real de
  personas. Lighthouse no lo mide y por eso el guion usa el **TBT** —tiempo total con el hilo
  bloqueado— como proxy. Un TBT de 0 ms en las 26 mediciones dice que no hay JavaScript que pueda
  bloquear una interacción: el total del sitio son 5,3 KB y solo se descargan en dos páginas.
- **El peso se da en dos lecturas.** Comprimido —lo que viaja por la red, 17,5 KB en la Home— y en
  disco, 78,3 KB (48 KB de HTML + 30,3 KB de CSS). Las dos están por debajo de los 150 KB del
  presupuesto, así que la cifra no depende de cómo se lea.
- **Las fuentes se declaran por subset.** El CSS trae `unicode-range` para cada subset, y lo que se
  descarga lo confirma: **91,4 KB de fuentes, los mismos en las 13 páginas**, que son exactamente los
  tres archivos `latin`. Ninguno de `latin-ext` ni de `vietnamese` —37 KB que viven en el despliegue y
  no llegan al visitante—. No hizo falta recortar el paquete: lo decide el navegador.
- **Y ese es el mayor margen que queda.** Una página pesa entre 112 y 118 KB, de los cuales **91,4 son
  fuentes**: el 78 %. Bajar de ahí exige recortar los glifos a los que el español realmente usa, un paso
  de subsetting propio que hoy no hace falta para cumplir ningún presupuesto y que añadiría una
  herramienta al build. Queda anotado como el sitio por donde se recortaría primero.


---

## 6. Criterio por criterio: cómo se verificó

Las dos columnas de la derecha son las que añade este informe al §5.3 de `02-arquitectura.md`:
**quién** comprueba cada criterio y **con qué** se comprobó.

**Perceptible (1.x)**

| Criterio | Nivel | Verificado por |
| :--- | :---: | :--- |
| 1.1.1 Contenido no textual | A | axe-core (`image-alt`, `svg-img-alt`) · revisión del marcado |
| 1.3.1 Información y relaciones | A | axe-core · `auditar-html.mjs` |
| 1.3.2 Secuencia significativa | A | Revisión humana (el orden del DOM es el visual) |
| 1.3.3 Características sensoriales | A | Revisión humana del copy |
| 1.3.4 Orientación | AA | Revisión humana · el diseño no bloquea orientación |
| 1.3.5 Identificar el propósito | AA | `probar-formulario` · `autocomplete` en nombre, teléfono y correo |
| 1.4.1 Uso del color | A | axe-core · el error lleva texto e icono, no solo color |
| 1.4.3 Contraste (mínimo) | AA | **axe-core en los 2 temas y los 2 tamaños** (`color-contrast`) |
| 1.4.4 Redimensionar texto | AA | **Chrome real a 640 px** |
| 1.4.5 Imágenes de texto | AA | Revisión humana · cero texto en imágenes |
| 1.4.10 Reflow | AA | **Chrome real a 320 px** |
| 1.4.11 Contraste no textual | AA | Tokens de diseño (§5.2) · **el anillo se comprueba en las 531 paradas**; el ≥ 3:1 de los bordes es revisión humana |
| 1.4.12 Espaciado del texto | AA | axe-core (`avoid-inline-spacing`) |
| 1.4.13 Contenido en hover/focus | AA | Revisión humana · no hay contenido emergente que ocultar |

**Operable (2.x)**

| Criterio | Nivel | Verificado por |
| :--- | :---: | :--- |
| 2.1.1 Teclado | A | **Recorrido real con `Tab` en las 13 páginas** |
| 2.1.2 Sin trampa de teclado | A | **Recorrido real** · el menú móvil cierra con `Esc` |
| 2.2.2 Pausar, detener, ocultar | A | Revisión humana · ver §7 |
| 2.3.1 Sin destellos | A | Revisión humana · no hay flashes |
| 2.4.1 Evitar bloques | A | **Recorrido real** · el primer `Tab` es el enlace de salto |
| 2.4.2 Título de página | A | axe-core (`document-title`) · `auditar-html.mjs` |
| 2.4.3 Orden del foco | A | **Recorrido real** · el orden sigue el del DOM |
| 2.4.4 Propósito del enlace | A | axe-core (`link-name`) · revisión del copy |
| 2.4.5 Múltiples vías | AA | Revisión humana · header, footer, enlaces contextuales y sitemap |
| 2.4.6 Encabezados y etiquetas | AA | `auditar-html.mjs` · un solo `<h1>`, jerarquía sin saltos |
| 2.4.7 Foco visible | AA | **Recorrido real** · 531 / 531 paradas |
| **2.4.11 Foco no oscurecido** | **AA (2.2)** | **`elementFromPoint` en 531 / 531 paradas** |
| 2.5.1 Gestos de puntero | A | Revisión humana · no hay gestos multipunto |
| 2.5.2 Cancelación del puntero | A | Revisión humana · todo se activa en `click` |
| 2.5.3 Etiqueta en el nombre | A | axe-core (`label-content-name-mismatch`) |
| 2.5.4 Activación por movimiento | A | Revisión humana · no aplica |
| **2.5.7 Movimientos de arrastre** | **AA (2.2)** | Revisión humana · ningún control exige arrastrar |
| **2.5.8 Tamaño del objetivo** | **AA (2.2)** | axe-core (`target-size`) en móvil 390 px |

**Comprensible (3.x)**

| Criterio | Nivel | Verificado por |
| :--- | :---: | :--- |
| 3.1.1 Idioma de la página | A | axe-core (`html-has-lang`, `html-lang-valid`) |
| 3.2.1 En foco | A | **Recorrido real** · enfocar no cambia nada de contexto |
| 3.2.2 En la entrada | A | `probar-formulario` · ningún campo se envía al cambiar |
| 3.2.3 Navegación coherente | AA | Revisión humana · mismo header y footer en las 13 páginas |
| 3.2.4 Identificación coherente | AA | Revisión humana · los mismos iconos y nombres |
| **3.2.6 Ayuda coherente** | **A (2.2)** | Revisión humana · WhatsApp y contacto en la misma posición relativa |
| 3.3.1 Identificación de errores | A | `probar-formulario` · error en texto junto al campo |
| 3.3.2 Etiquetas o instrucciones | A | axe-core (`label`) · `probar-formulario` |
| 3.3.3 Sugerencia ante errores | AA | `probar-formulario` · el error del teléfono sugiere el formato |
| 3.3.4 Prevención de errores | AA | `probar-formulario` · el mensaje se revisa antes de enviarse |
| **3.3.7 Entrada redundante** | **A (2.2)** | `probar-formulario` · los datos se escriben una sola vez |
| **3.3.8 Autenticación accesible** | **AA (2.2)** | No aplica · el sitio no tiene inicio de sesión |

**Robusto (4.x)**

| Criterio | Nivel | Verificado por |
| :--- | :---: | :--- |
| 4.1.2 Nombre, función, valor | A | axe-core · `auditar-html.mjs` |
| 4.1.3 Mensajes de estado | AA | `auditar-html.mjs` · `probar-formulario` (el estado se anuncia con `role="alert"` y `role="status"`) |

**Fuera de alcance (nivel AAA), como declaró el §5.3:** 2.4.12 *Foco no oscurecido (mejorado)* y 2.4.13
*Apariencia del foco*. Se aplican buenas prácticas —anillo doble de 2 px más halo—, pero no se certifican.

---

## 7. Lo que ninguna de estas pruebas puede hacer

Esta lista no es un descargo: es trabajo pendiente y con nombre. Nada de aquí se puede dar por hecho
porque las 52 + 4 pasadas de axe hayan salido limpias.

| Qué queda | Por qué una máquina no llega | Cuándo |
| :--- | :--- | :--- |
| **Lectura con lector de pantalla** (NVDA en Windows, VoiceOver en iOS) | axe-core comprueba que el nombre accesible *existe* y es correcto; no comprueba si al escucharlo se entiende. El orden de lectura, la pertinencia de un `aria-label` o si el resumen de errores se oye entero solo se saben escuchando. | Antes de publicar |
| **Zoom real del navegador** (Ctrl + hasta el 200 %) | La prueba emula el ancho equivalente (640 px), que es la parte medible. El zoom real puede destapar problemas de rejilla o de `position: fixed` que la emulación de ancho no reproduce. | Antes de publicar |
| **Animaciones con movimiento activado** | Las auditorías corren con `prefers-reduced-motion: reduce` para no medir estados intermedios. El estado final de cada sección queda cubierto por Lighthouse, que no fuerza esa preferencia; el estado *durante* la animación, no. | Al revisar los bloques de la Home |
| **Calidad del copy y legibilidad** | Que un texto sea claro a los 14 años no es un criterio que ninguna herramienta mida. | Antes de publicar |
| **El formulario tal como lo usa una familia real** | `npm run probar-formulario` recorre los caminos previstos. Lo que hace una persona de verdad —volver atrás, corregir, dudar— no. | Al probar con alguien ajeno al proyecto |

---

## 8. Cómo volver a correrlo

```bash
npm run preview                 # en una terminal; las auditorías van contra el sitio compilado
```

```bash
npm run verificar               # estructura + enlaces y anclas + JSON-LD
npm run probar-formulario       # 47 comprobaciones del formulario en Chrome real
npm run auditar-a11y            # axe-core + teclado + reflujo   (este informe, §2 a §4)
npm run auditar-rendimiento     # Lighthouse móvil y escritorio   (este informe, §5)
```

Opciones útiles, para no repetir una auditoría de minutos cuando se toca una sola página:

```bash
npm run auditar-a11y -- --url /precios          # una sola ruta
npm run auditar-a11y -- --solo axe              # un solo bloque: axe | formulario | teclado | reflujo
npm run auditar-a11y -- --detalle               # lista las paradas del recorrido de teclado
npm run auditar-rendimiento -- --solo movil     # un solo perfil: movil | escritorio
npm run auditar-a11y -- --json ../.openclaw/tmp/a11y.json   # deja los datos en crudo
```

Los dos comandos salen con código distinto de cero si hay algo que incumple, así que se pueden encadenar
en un flujo de integración cuando el proyecto tenga repositorio.

---

## 9. Historial de mediciones

| Fecha | Alcance | axe-core | Teclado | Reflujo | Lighthouse |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-10-16 | 13 páginas · primera medición (incremento 3.6) | 52 pasadas · **0 violaciones** | 531 paradas · **0 problemas** | 13 / 13 | ver §5 |

---

**Conclusión.** El sitio cumple **WCAG 2.2 AA** según todo lo que se puede comprobar sin una persona:
0 violaciones en 56 pasadas de axe-core, 531 paradas de teclado sin un solo indicador perdido, ninguna
parada tapada por la cabecera fija y las 13 páginas sin desborde a 320 px. Lo que falta —lector de
pantalla, zoom real y las animaciones en movimiento— está listado en §7 con su nombre, y es lo que queda
entre este informe y una declaración de conformidad.
