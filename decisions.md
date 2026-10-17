# decisions.md — Registro de decisiones (ADR ligero)

Formato: **ADR-NNN · Título** — Estado · Fecha · Contexto · Decisión · Consecuencias.

---

## ADR-000 · Reencauce de los documentos de identidad

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** El brief esperaba contenido de marca en `IDENTITY`, `SOUL`, `USER`, `AGENTS`,
`TOOLS` y `HEARTBEAT`. En el directorio esos archivos son las plantillas operativas del asistente
(identidad del agente, protocolo de seguridad, notas de entorno), no documentos de RUWAY.

**Decisión.** Crear el paquete `ruway-marca/` con los 6 documentos reales de RUWAY, derivados de
`plan completo.md` y `ruway-identidad/LEEME.txt`. **No** sobrescribir los archivos de la raíz.

**Consecuencias.**
- ✅ Existe una fuente de verdad de identidad explícita y trazable.
- ✅ El workspace del asistente queda intacto (no se rompe la configuración).
- ⚠️ Convivencia de nombres: `IDENTITY.md` (raíz) ≠ `ruway-marca/IDENTITY.md`. Documentado en
  `ruway-marca/LEEME.md`.

---

## ADR-001 · Sitemap en dos olas

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** El mapa v1.0 cubría el embudo central pero le faltaban rutas legales, de
contacto, B2B y de prueba social. Algunas de esas rutas (Demo Day, Nivel 2) requieren contenido
que **solo existirá después del primer ciclo** (Demo Day en semana 8).

**Decisión.** Publicar el sitio en dos olas. **Ola 1** (antes del 27/10/2026): 13 páginas con
contenido ya disponible. **Ola 2** (~diciembre 2026): `/demo-day` y `/nivel-2`.

**Alternativas descartadas.**
- Publicar todo ya con páginas "próximamente" → contradice la honestidad de marca y perjudica SEO.
- No planificar la Ola 2 → se perdería el destino de la preventa del Ciclo 2 (§11.5).

**Consecuencias.** Ninguna página vacía; la estructura de navegación ya contempla el hueco.

---

## ADR-002 · Un solo idioma, es-PE, URLs sin acentos

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** El tráfico llega de Cajamarca (TikTok, Instagram, WhatsApp, Google Maps). El mapa
v1.0 ya declaraba un solo idioma.

**Decisión.** Contenido y rutas en español peruano. URLs en minúsculas, sin acentos ni guiones
bajos. Sin i18n en v1. `lang="es-PE"`.

**Consecuencias.** URLs legibles y compartibles por WhatsApp; sin gasto de mantenimiento de i18n.

---

## ADR-003 · La navegación principal mantiene 5 destinos

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** Con `/contacto` e `/instituciones` se llegaría a 7 enlaces + CTA, saturando el
header en móvil y diluyendo la conversión.

**Decisión.** Header: Inicio · Programa · Precios · Preguntas frecuentes · Sobre + **CTA
siempre visible**. `/contacto` e `/instituciones` viven en el footer y en enlaces contextuales.

**Consecuencias.** Mayor foco en el CTA de demo; `/instituciones` recibe apoyo de enlaces
contextuales para no perder descubribilidad.

---

## ADR-004 · Un único formulario con parámetro de intención

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** El embudo tiene dos entradas: reserva de **demo** y **matrícula**.

**Decisión.** Una sola ruta `/inscripcion` con `?intencion=demo|matricula`, que preselecciona el
estado del formulario. No se crean dos páginas.

**Consecuencias.** Menos duplicación, sin fragmentar autoridad SEO, mantenimiento simple.

---

## ADR-005 · `scroll-margin-top` en anclas con header fijo

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** El mapa v1.0 usa anclas internas para deep-links desde redes (§4 del sitemap).

**Decisión.** Todos los encabezados con `id` llevan `scroll-margin-top` equivalente a la altura
del header fijo.

**Consecuencias.** El deep-link desde TikTok/WhatsApp muestra la sección completa, no oculta
tras el header. Cumple WCAG 2.2 · 2.4.11 (evitar contenido oculto por foco/scroll).

---

## ADR-006 · Stack frontend: Astro + TypeScript + Tailwind CSS 4

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Resuelve TBD-01*
**Actualizado:** 2026-10-16 — versión instalada corregida (ver nota al final)

**Contexto.** Se evaluaron 4 stacks con 6 criterios ponderados (`02-arquitectura.md §1`).

**Decisión.** Astro + TypeScript + Tailwind CSS 4. Puntaje ponderado **4.70/5**, el más alto.
Versión instalada: **Astro 7.4.0** y **Tailwind CSS 4.3.3** (`ruway-web/package.json`).

**Alternativas descartadas.**
- *Next.js 15* (3.95): el plan Hobby de Vercel **prohíbe uso comercial**; Pro cuesta ~S/ 900/año, **5× el presupuesto**.
- *SvelteKit* (4.10): técnicamente excelente, pero **talento local escaso** (2/5) → deuda de mantenimiento.
- *WordPress* (3.10): hosting de pago, superficie de ataque y mantenimiento continuo para un equipo de 2 personas no técnicas.

**Consecuencias.**
- ✅ Cero JavaScript por defecto → LCP, INP y CLS sin esfuerzo extra.
- ✅ Contenido en `src/data/*.ts` → editable sin conocimientos del framework.
- ⚠️ Ecosistema React más pequeño que Next.js → mitigado en `02-arquitectura.md §7`.

**Reevaluación.** Si en 12 meses se incorpora un dev React, migrar a Next.js 15 es viable
(la salida es HTML/CSS estándar).

> **Nota de versión.** La comparativa original se escribió sobre Astro 5; al instalar se
> obtuvo Astro 7.4.0, que es la rama estable actual y no cambia ninguna de las
> consecuencias evaluadas (mismo modelo de islas, misma salida estática, mismo
> `@astrojs/sitemap`). Se registra aquí para que el documento no contradiga a
> `package.json`, que es la fuente de verdad.

---

## ADR-007 · Hosting y CDN: Cloudflare Pages

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Resuelve TBD-04*

**Contexto.** Presupuesto: S/ 180/año para dominio + hosting. Tráfico móvil local.

**Decisión.** Cloudflare Pages. Tier gratuito con **ancho de banda ilimitado**, CDN global,
SSL y despliegues de vista previa.

**Alternativas descartadas.** Vercel (no comercial en plan gratuito) · Netlify (100 GB/mes, límite
alcanzable con tráfico de video/reels) · hosting compartido (sin CDN global, de pago).

**Consecuencias.** Coste real del sitio: **~S/ 45/año** (solo dominio). Ahorro de ~S/ 135/año.

---

## ADR-008 · Sin backend: el formulario compone un mensaje de WhatsApp

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Resuelve TBD-02*

**Contexto.** El plan pide formulario → WhatsApp sin backend (§11.1 canal 6). El brief de Fase 3.5
menciona «integración backend». Los datos incluyen, en algunos casos, **información de menores**.

**Decisión.** v1 **sin backend y sin base de datos**. El formulario valida en el cliente y compone
un mensaje de WhatsApp a `wa.me/51930736214`. La confirmación lleva a `/gracias`.

**Fundamento.** Con Ley 29733 y menores de edad, **no almacenar datos es la postura de menor
riesgo legal**: no hay banco de datos que custodiar, no hay filtración posible, no hay retención
que declarar. Además, el plan ya prevé el banco de datos y la política de privacidad; la web
minimiza su superficie.

**Alternativa futura (Ola 1.1, opcional).** Cloudflare Pages Function que reenvía el contenido
por **correo** a `ruway.edu.cax@gmail.com`, **sin persistir nada**. Si algún día se requiere CRM,
se revisará con asesoría legal por tratarse de datos de menores.

---

## ADR-009 · Sin CMS en v1

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Resuelve TBD-03*

**Contexto.** El contenido lo mantiene el fundador (perfil no técnico).

**Decisión.** v1 usa **Content Collections** (Markdown + archivos TS en `src/data/`). Sin CMS.

**Fundamento.** Faltan 11 días para el lanzamiento: cada dependencia externa es un riesgo.
Los datos viven separados del código (`src/data/programa.ts`, `precios.ts`, `faq.ts`), así que
editar un precio es cambiar una línea.

**Alternativa futura (Ola 1.1).** **Decap CMS** (editor visual gratuito, basado en Git): añade
una interfaz en `/admin` sin base de datos ni coste. Se decide tras el lanzamiento.

---

## ADR-010 · Analítica sin cookies (Cloudflare Web Analytics)

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Resuelve TBD-05*

**Contexto.** El plan exige medir leads (§3.4: ≥ 10/semana). Ley 29733 y directrices de cookies.

**Decisión.** **Cloudflare Web Analytics**: sin cookies, sin PII, sin perfilado entre sitios. Se
acompañan eventos propios (clic en CTA, envío de formulario, clic en WhatsApp).

**Consecuencias.**
- ✅ Al no usar cookies de analítica, **no se requiere banner de consentimiento** para la medición.
- ✅ Se publica igualmente `/cookies` como página de transparencia y previsión futura.
- ✅ Sin cookie banner → menos fricción y mejor conversión en móvil.

---

## ADR-011 · Reglas de accesibilidad fuera de `@layer`

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Corrige un fallo detectado en 3.2*

**Contexto.** En la verificación del incremento 3.2 se midió el estilo calculado del enlace de
la página actual (`aria-current="page"`): `text-decoration-line` era **`none`**. La regla estaba
escrita dentro de `@layer base { … }` de `global.css`, y la clase `.no-underline` de Tailwind
vive en `@layer utilities`. En la cascada de CSS, **el orden de capas pesa más que la
especificidad**: la capa `utilities` gana a `base` siempre, así que la regla de accesibilidad
quedaba anulada en silencio y el único indicador de «página actual» era el color —incumpliendo
WCAG 2.2 · 1.4.1 (el color no puede ser el único medio visual).

**Decisión.** Las reglas que **no deben poder anularse nunca** por una clase de utilidad salen de
las capas y se escriben **sin `@layer`** (los estilos sin capa tienen prioridad sobre todas las
capas). Son tres:

1. `a[aria-current="page"]` — marca de página actual.
2. `:focus-visible` — anillo de foco (2.4.7 y 2.4.11).
3. `button, [role="button"], summary, a.boton` — objetivo táctil mínimo (2.5.8).

**Consecuencias.**
- ✅ La accesibilidad deja de depender del orden de capas de Tailwind.
- ✅ Se detectó con una medición real, no por inspección visual: **toda regla de accesibilidad
  se verifica midiendo estilos calculados**, no mirando la pantalla.
- ⚠️ Estas reglas son de máxima prioridad: al añadir utilidades a esos elementos hay que
  contar con que las utilidades de `text-decoration`, `outline` y tamaño no ganarán.
- ℹ️ Se eliminó también el `font-weight` de la regla de página actual para no provocar un salto
  de anchura al navegar entre páginas.

---

## ADR-012 · Normalizar `Astro.url.pathname` antes de usarlo

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Corrige un fallo detectado en 3.2*

**Contexto.** Con `build.format: 'file'` (ADR-001/`astro.config.mjs`), durante el build
`Astro.url.pathname` **incluye la extensión**: `/index.html`, `/programa.html`. El primer build
generó:

```html
<link rel="canonical" href="https://academiaruway.com/index.html">
```

Un canonical apuntando a `index.html` fragmenta la indexación (Google lo trata como una URL
distinta de `/`) y contradice `.html`-less URLs del sitemap. Además, la marca de página actual
del menú nunca coincidía, porque `'/index.html' !== '/'`.

**Decisión.** Una única función `normalizarRuta()` en `ruway-web/src/lib/rutas.ts` convierte
`/index.html` → `/` y `/programa.html` → `/programa`. Se usa en **ambos** sitios: el canonical
de `BaseLayout` y el `aria-current` del `Header`. Ninguna otra parte del código manipula la ruta
a mano.

**Consecuencias.**
- ✅ Canonical limpio y coherente con `sitemap-0.xml`.
- ✅ La marca de página actual funciona.
- ✅ Sirve igual en `dev` (donde las rutas ya llegan sin extensión) y en `build`.
- ⚠️ Cualquier comparación futura de rutas debe pasar por esta función.

---

## ADR-013 · Colores derivados ratificados y tema claro por defecto

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Cierra la decisión pendiente de 3.1*

**Contexto.** El sistema necesitaba 5 colores que el manual de marca no define: texto secundario,
borde de control y los estados de éxito/alerta en ambos temas. Se propusieron como derivaciones
de la paleta con `color-mix()`, marcadas como **propuestas razonadas** y no como valores oficiales.

**Decisión del responsable.** Se aprueban tal como están y el sitio **arranca en tema claro**.

**Consecuencias.**
- ✅ Los 6 colores del manual siguen siendo los únicos colores de *identidad*; los derivados son
  colores **de interfaz** y viven solo en `tokens.css` (capa 2), nunca en un componente.
- ✅ Cualquiera puede reproducir un derivado: su receta de mezcla queda escrita junto al valor.
- ✅ El tema claro por defecto refuerza la lectura diurna en aulas y en móvil, que es el contexto
  real del público (Cajamarca, uso en la calle).
- ⚠️ Todo derivado está obligado a superar 4.5:1 en ambos temas. Si un ajuste futuro lo baja, se
  cambia el derivado, no el manual.
- ℹ️ `prefers-color-scheme` se sigue respetando y el botón del header siempre tiene la última
  palabra. El «claro por defecto» solo decide el caso en que el sistema no opina.

---

## ADR-014 · La reserva de demo abre WhatsApp, sin pasar por el formulario

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Ajusta parcialmente el ADR-004*

**Contexto.** El ADR-004 decidió un solo formulario que recibía `?intencion=demo` o `?intencion=matricula`.
Al construir la Home quedó a la vista un problema práctico: el formulario llega en el incremento 3.4,
así que el botón **principal** de la página entera apuntaba a una dirección que todavía no existía.
Un enlace roto en el pie de página es una molestia; un enlace roto en el botón que convierte es otra cosa.

**Decisión.** Los llamados a «reserva tu demo» —el del header, el del hero y el del cierre— abren
WhatsApp directamente con el mensaje ya redactado. El formulario se conserva para la matrícula.

**Consecuencias.**
- ✅ El camino de conversión funciona desde el primer día, sin depender de que exista ninguna página.
- ✅ No contradice al plan: el §6.1 y el §11.2 dicen que la demo «se reserva por WhatsApp», y el
  ADR-008 ya estableció que el formulario termina en WhatsApp de todos modos. Se quita un paso
  intermedio que no aportaba nada.
- ✅ El ADR-004 sigue en pie en lo que importa: **un solo formulario**, no dos.
- ⚠️ El enlace de «Inscripción y demo» del pie sigue apuntando a `/inscripcion`, que llega en 3.4.

---

## ADR-015 · La Home muestra el precio de lanzamiento y tacha el de lista

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Decidido por el responsable*

**Contexto.** Los datos de origen tenían dos precios reales y ninguno era falso:
- el sitemap aprobado decía que el bloque 8 mostraba «S/ 550 general · S/ 450 escolar»;
- el plan (§11.3) dice que la versión que «se comunica siempre» es el precio de lanzamiento,
  S/ 500 general y S/ 400 escolar, para las primeras 10 matrículas.

Mostrar dos precios con la misma importancia habría sido confuso; elegir uno sin consultar habría
sido decidir por cuenta propia algo comercial.

**Decisión del responsable.** El precio de lanzamiento se muestra como precio vigente, con el precio
de lista **tachado al lado** y la condición real a la vista.

**Consecuencias.**
- ✅ Quien mira la Home ve el precio que realmente se cobra hoy, no un «desde» ni un precio que ya no rige.
- ✅ La condición («solo las primeras 10 matrículas») va al lado del número, no en letra pequeña:
  cuando se llenen las diez plazas, se cambia el dato en `src/data/precios.ts` y desaparece solo.
- ⚠️ **Pendiente operativo:** cuando se agoten las 10 plazas hay que quitar el bloque de lanzamiento
  de `precios.ts`. Es un cambio de un solo archivo, pero alguien tiene que acordarse de hacerlo.

---

## ADR-016 · El sitio no incrusta contenido de terceros

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Consecuencia directa del ADR-010*

**Contexto.** `/contacto` es la página que exige el sitemap para el SEO local y pide «NAP + mapa». Lo
natural era pegar un `<iframe>` de Google Maps. Al medirlo apareció el problema: un mapa incrustado
instala cookies de Google en el primer pintado, sin que el visitante haya hecho nada ni haya podido
decidirlo.

**Decisión.** No se incrusta ningún contenido de terceros: ni el mapa de Google, ni vídeos, ni botones
sociales. La dirección va escrita, con un enlace que abre la aplicación del visitante.

**Consecuencias.**
- ✅ El sitio sigue sin una sola cookie y sin banner de consentimiento. Incrustar el mapa habría hecho
  falta un banner, y el banner habría hecho falta en todas las páginas, no solo en `/contacto`.
- ✅ La dirección se sigue pudiendo consultar y abrir en un toque: se pierde el mapa en línea, se gana
  velocidad de carga y coherencia con lo que `/cookies` promete.
- ✅ Como el marco de trabajo ya queda escrito, un vídeo futuro no se incrusta: se enlaza o se carga
  solo después de que el visitante lo pida.
- ⚠️ Si algún día se inserte algo, el ADR-010 y la página `/cookies` dejan de ser ciertos el mismo día.

---

## ADR-017 · Un solo nodo `Course`, compartido por tres páginas

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16 · *Evita que los datos estructurados se contradigan*

**Contexto.** El sitemap §10.1 pide el nodo `Course` en `/programa` y `/precios`, y la Home lo añadió
en 3.3. Escribirlo tres veces a mano significa que el día que cambie un precio, dos páginas dirán
S/ 500 y una dirá S/ 550, y Google verá dos cursos distintos con el mismo nombre.

**Decisión.** Todos los nodos de schema.org se construyen en `src/lib/datos-estructurados.ts`, a partir
de `src/data/`. Las páginas no escriben marcado: lo piden.

**Consecuencias.**
- ✅ Imposible que dos páginas declaren precios distintos: salen del mismo objeto `TRAMOS`.
- ✅ El nodo `LocalBusiness` de `/contacto` y `/sobre` comparte `@id` con el `EducationalOrganization`
  global, así que Google las lee como **una sola entidad** y no como dos negocios en la misma dirección.
- ⚠️ `Course` no declara `endDate`: el calendario reserva dos sesiones de reposición y la fecha de
  cierre todavía no es exacta. Una fecha inventada es peor que una fecha ausente.
- ℹ️ Los datos estructurados tienen ahora su propia verificación automática (ADR-019), que comprueba
  qué tipos declara cada página contra la tabla del sitemap §10.1.

---

## ADR-018 · `[POR DEFINIR]` se dibuja como un hueco visible

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** La regla del proyecto es no inventar datos y marcar lo que falta como `[POR DEFINIR]`.
En texto plano, ese marcador se lee como un error de programación: el pie del sitio mostraba
«Atención presencial: [POR DEFINIR]» y parecía un fallo. Un hueco que parece un fallo se termina
tapando con una suposición, que es exactamente lo que la regla quiere evitar.

**Decisión.** Existe un componente `Pendiente` que pinta el marcador con borde discontinuo y color de
alerta, y que se anuncia a los lectores de pantalla como «dato pendiente de definir».

**Consecuencias.**
- ✅ Un dato pendiente se ve **deliberado** en pantalla y en una captura de pantalla dentro de seis meses.
- ✅ El texto entre corchetes se sustituye solo, dentro de `ContenidoLegal`, sin ensuciar los datos.
- ✅ El pie del sitio dejó de parecer roto redibujando el mismo valor que ya tenía.
- ⚠️ **Bloqueante de publicación:** la política de privacidad no se puede publicar con el RUC sin
  completar. Es el único `[POR DEFINIR]` legal que queda a la vista.

---

## ADR-019 · Tres verificaciones automáticas antes de cada entrega

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** Hasta 3.3, `npm run verificar` solo auditaba la estructura de cada página por separado.
Con 11 páginas enlazadas entre sí quedaron a la vista dos clases de fallo que ninguna herramienta
detectaba: los enlaces a páginas que no existen y las anclas que ya no apuntan a nada.

**Decisión.** `npm run verificar` encadena tres comprobaciones sobre el HTML compilado:
1. **Estructura** (`auditar-html.mjs`) — encabezados, landmarks, ARIA, un solo `<h1>`.
2. **Enlaces y anclas** (`verificar-enlaces.mjs`) — cada `href` interno resuelve y cada `#ancla` existe
   de verdad en la página de destino.
3. **Datos estructurados** (`verificar-datos-estructurados.mjs`) — cada bloque JSON-LD parsea, cada
   página declara los tipos del sitemap §10.1 y **el certificado nunca se anuncia con validez oficial**.

**Consecuencias.**
- ✅ El verificador de enlaces atrapó su propio fallo en la primera ejecución: no distinguía «todavía
  no existe» de «está mal escrito». Se resolvió con una lista de **pendientes conocidos**
  (`PENDIENTES_CONOCIDOS`) que se vacía sola cuando la página se construye, en vez de silenciar el error.
- ✅ El verificador de datos estructurados se estrenó cazando un falso positivo propio (comparaba
  mayúsculas y minúsculas) y ahora protege la única regla del §10.1 que tiene consecuencias legales.
- ✅ Los tres se pueden ejecutar por separado: `npm run auditar`, `npm run enlaces`, `npm run jsonld`.
- ⚠️ Siguen sin cubrir lo que exige un navegador real: axe-core, teclado y lector de pantalla. Eso es
  el incremento 3.6.

---

## ADR-020 · Frontera de los incrementos 3.4 y 3.5

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** `02-arquitectura.md` §9 nombra seis páginas para el incremento 3.4 («Programa, Precios,
Sobre, FAQ, Contacto, Instituciones») y deja «Inscripción + composición del mensaje de WhatsApp» para
el 3.5. El sitemap de Ola 1 tiene trece páginas: quedaban sin asignar `/gracias`, las tres legales y
`/404`.

**Decisión.** El 3.4 construye once páginas: las seis nombradas más las tres legales y `/404`. El 3.5
construye `/inscripcion` —con el formulario compartido— y `/gracias`.

**Consecuencias.**
- ✅ Las páginas legales son contenido, no formularios: encajan mejor con «páginas internas» que con
  «formulario», y adelantarlas permite que el pie del sitio deje de apuntar a rutas vacías.
- ⚠️ La sección `#formulario` de `/contacto` —ancla fijada por el sitemap §8— hoy contiene los canales
  directos (WhatsApp y correo) en lugar del formulario. No es un hueco: es la CTA que el sitemap §4.1
  le asigna a esa página («Escribir por WhatsApp»). En 3.5 se añade el formulario **encima**, sin
  quitar nada.
- ⚠️ `/gracias` no se construye en 3.4 porque solo tiene sentido como destino de un envío de formulario.

---

## ADR-021 · El plan de negocio es un documento interno

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** Para escribir `/sobre` hacía falta la sección de equipo del plan (§9). Al leerla apareció
material que no debe publicarse: tarifas por hora, comisión por matrícula cerrada, presupuesto de
community management, un rol «por asignar» con su remuneración y la regla laboral que explica por qué
se paga por locación de servicios.

**Decisión.** La web publica solo lo que un visitante necesita para decidir: quién enseña, con qué
experiencia y con qué apoyos cuenta el grupo. Nada de costos, márgenes, remuneraciones ni roles
vacantes. `/sobre` lleva esa regla escrita en su cabecera para que no se pierda.

**Consecuencias.**
- ✅ Queda fuera también el punto de equilibrio, el fondo inicial, el flujo de caja y el «punto de
  equilibrio de 7 alumnos»: son cuentas del negocio, no promesas al alumno.
- ✅ Lo que sí se publica del §7 y §10 son los **compromisos con el alumno**: devoluciones, regla de
  los 7 para abrir el grupo, IGV incluido y boletas. Eso protege al alumno, no al margen.
- ⚠️ El «horario de atención presencial» seguirá `[POR DEFINIR]` hasta que se defina. Se explica la
  situación con palabras normales en `/contacto` en vez de publicar el marcador.

---

## ADR-022 · El formulario se revisa antes de abrir WhatsApp, y confirma en `/gracias`

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** ADR-008 dejó el formulario sin backend: arma un texto y abre WhatsApp. Quedaban tres
flecos sin resolver, y los tres tienen consecuencias:

1. **WCAG 2.2 · 3.3.4 (prevención de errores, AA)** pide que una acción de consecuencias graves o de
   envío de datos sea reversible, verificable o confirmable. Un número de WhatsApp mal escrito no se
   puede corregir después: es el canal por donde vuelve la respuesta.
2. El sitemap §6.1 describe el flujo A como `/inscripcion?intencion=demo → /gracias → WhatsApp`, y
   §10.4 declara la visita a `/gracias` como el **evento de conversión**. Pero ADR-014 hizo que las
   CTA de demo abrieran WhatsApp directamente, así que `/gracias` se quedó sin ninguna vía de entrada.
3. Sin JavaScript el formulario no puede hacer su trabajo. Podía quedarse en un botón que no hace
   nada, o podía enviar los datos a la barra de direcciones.

**Decisión.** El envío tiene dos pasos y termina en una página propia.

1. **Rellenar → Revisar.** El primer envío valida y, si todo está bien, retira los campos y muestra
   el mensaje completo tal como se va a enviar. Los botones son «Abrir WhatsApp y enviar» y «Volver a
   editar», que devuelve el formulario con los datos intactos.
2. **Confirmar → WhatsApp + `/gracias`.** El botón de confirmar es un **enlace real** con
   `target="_blank"`, no un `window.open`: el navegador no bloquea enlaces, así que la pestaña de
   WhatsApp se abre siempre. Después, esta pestaña pasa a `/gracias`, que confirma el envío, explica
   qué sigue y sirve de punto de medición cuando se active la analítica (ADR-010).
3. **Sin JavaScript, se dice.** El formulario lleva un `<noscript>` que explica que el mensaje se
   arma en el propio dispositivo y ofrece WhatsApp directo. El botón es un `submit` real con
   `method="post"` y sin `action`, de modo que ni siquiera sin JavaScript un dato acaba en la URL.

**Consecuencias.**
- ✅ 3.3.4 queda cubierto donde importa. Y no por disciplina: `componerMensaje()` se llama una vez
  para pintar la vista previa y otra para el enlace, así que el texto revisado y el enviado son el
  mismo por construcción. La prueba funcional lo comprueba carácter a carácter.
- ✅ `/gracias` deja de ser una página huérfana y pasa a ser el destino real del embudo.
- ⚠️ `/gracias` **no puede reconstruir el mensaje**: no se guarda en ningún sitio, y ese es justamente
  el trato. Su botón abre una conversación nueva y la página lo dice con todas las letras, sin
  prometer que recupera el texto. En el caso normal no hace falta, porque el enlace no se bloquea.
- ⚠️ El sitio deja de tener cero JavaScript. `/inscripcion` y `/contacto` descargan 5,3 KB; el resto
  de las páginas siguen en 0 KB, porque Astro solo incluye el script de los componentes que usa.
- ⚠️ La intención de la URL (`?intencion=`) se aplica desde el navegador: el sitio es estático y la
  cadena de consulta no existe durante la compilación. No es un atajo, es la única forma.

---

## ADR-023 · Una prueba funcional en navegador para el formulario

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** Los tres verificadores existentes —estructura, enlaces y datos estructurados— leen HTML
compilado. Eso alcanza para todo el sitio menos para una cosa: el formulario es el único punto donde
el JavaScript hace trabajo de verdad. Valida, marca campos, mueve el foco, cambia de paso y compone un
mensaje. Nada de eso se ve en el HTML, y si se rompe el visitante se queda mirando un botón inerte.

**Decisión.** `scripts/probar-formulario.mjs` (`npm run probar-formulario`) abre Chrome por el
protocolo de herramientas de desarrollo —el mismo método que `capturar.mjs`, sin dependencias— y
recorre el formulario como lo haría una persona: envío vacío, un solo error, envío correcto, vuelta a
editar, confirmación. 47 comprobaciones, con informe en pantalla y salida distinta de cero si algo falla.

**Consecuencias.**
- ✅ Comprueba lo que no puede comprobar nadie más: que el mensaje revisado sea **exactamente** el que
  se envía, que el foco siga el orden previsto, que los campos opcionales vacíos no se escriban y que
  confirmar lleve a `/gracias`.
- ✅ Se pueden añadir capturas de los dos estados que no existen por URL —resumen de errores y paso de
  revisión— con `npm run probar-formulario -- --capturas`.
- ⚠️ Necesita el servidor de vista previa en marcha, igual que `npm run capturar`. Por eso **no** se
  encadena dentro de `npm run verificar`, que tiene que poder correr sin navegador.
- ⚠️ No sustituye a axe-core, al recorrido con teclado ni a la lectura con lector de pantalla: eso es
  el incremento 3.6.

---

## ADR-024 · La lista de herramientas son ocho, y «Hojas de cálculo» no es una de ellas

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** El bloque 6 de la Home venía enseñando seis herramientas. Cinco salían del sitemap
—ChatGPT, Gemini, Copilot, Make/Zapier, Notion— y la sexta, «Hojas de cálculo», se había añadido por
iniciativa propia para cerrar la cuadrícula 3 × 2, apoyándose en que el §2.5 y el §5.3 la nombran en
la semana 5. Al preguntar por ella, el responsable la descartó: **no es una herramienta del programa,
es un tema del temario.** Es decir, la sexta casilla era relleno, y el relleno había pasado de
decisión de diseño a afirmación de contenido: la web prometía algo que el programa no dicta así.

**Decisión.** La lista queda en ocho: se añaden **DeepSeek**, **Kimi K3** y **MiniMax**, que el
responsable incorpora como alternativas gratuitas a los tres asistentes «de casa» (los que vienen
dentro de Google y de Microsoft). «Hojas de cálculo» sale de la lista y **se queda** en la semana 5,
donde el plan la define como un uso de la IA, no como una plataforma propia. La cuadrícula pasa a
**4 × 2** en pantalla grande y 2 × 4 debajo, así que ninguna fila queda con una casilla vacía —que es
justo lo que la sexta herramienta venía a tapar.

**Consecuencias.**
- ✅ Las ocho tienen plan gratuito, que es la promesa literal del bloque («todas en su plan gratuito»)
  y la del §8.3: DeepSeek, Kimi y MiniMax se usan desde el navegador sin pago; el bloque ya avisa de
  que esos planes gratuitos tienen límite de uso.
- ✅ La semana 5 del temario no se toca: sigue hablando de datos y decisiones, que es donde «hojas de
  cálculo» sí pertenece.
- ✅ `npm run jsonld` no se altera: las herramientas no entran en ningún nodo de Schema.org.
- ⚠️ Kimi entra con el nombre del modelo (**Kimi K3**), no el del producto (**Kimi**), porque así lo
  pidió el responsable. Es el único nombre de la lista que caducará solo: cuando Moonshot publique la
  generación siguiente, la web dirá «K3» de un modelo que ya no es el que se enseña. Se cambia en
  `src/data/programa.ts`, una línea.
- ✅ Los documentos fuente se sincronizaron el mismo día, a petición del responsable: el §5.2 del plan
  (`plan completo.md`), `ruway-marca/IDENTITY.md`, `ruway-marca/TOOLS.md` y `00-inventario-insumos.md`
  ya enumeran las ocho. Las cuatro apariciones de «hojas de cálculo» que quedan en el proyecto son del
  **temario de la semana 5**, que es donde el plan la define: `plan completo.md` §5.3,
  `00-inventario-insumos.md` §5.2, `ruway-marca/TOOLS.md` §2 y `src/data/programa.ts` (TEMARIO).

---

## ADR-025 · Las auditorías de accesibilidad y rendimiento corren en un navegador real

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** El §5.1 del documento de arquitectura pide axe-core sobre las **13 páginas** y Lighthouse
con las cuatro categorías ≥ 95. Los tres verificadores del incremento 3.4 leen HTML compilado, y hay una
familia entera de problemas que no aparece en un archivo de texto: el contraste **real** de cada
combinación de tema —el mismo Maíz es 9,62:1 sobre Piedra y 1,6:1 sobre Cal—, el anillo de foco, el
desborde horizontal a 320 px, el LCP, el CLS. Nada de eso se puede deducir leyendo HTML.

Había además un problema de forma. Los tres scripts que ya abrían un navegador llevaban cada uno su
copia del mismo cliente CDP —el cliente de mensajes, las banderas de Chrome, la espera del puerto— y las
dos auditorías nuevas habrían sido la tercera y la cuarta.

**Decisión.**

1. **Dos dependencias de desarrollo, y ninguna más:** `axe-core` 4.14.0 y `lighthouse` 13.5.0. Son
   herramientas de medición, no de producción: no entran al sitio compilado, no suman un byte al CSS ni
   al JavaScript que descarga el visitante y no tocan `dependencies`.
2. **Un cliente CDP compartido** en `scripts/lib/navegador.mjs` (`abrirNavegador`, `emular`, `irA`,
   `evaluar`, `altoDeLaPagina`, `dormir`, `BASE`). Sigue sin haber dependencias de navegador: se usan
   `fetch` y `WebSocket` nativos de Node.
3. **`capturar.mjs` y `probar-formulario.mjs` se migran al módulo** en el mismo incremento, para no
   dejar cuatro copias. La migración se da por buena porque las dos baterías se volvieron a correr
   enteras: el formulario sigue en **47/47** y las capturas siguen saliendo en los tres tamaños.
4. **Dos comandos nuevos**, cada uno con su barrera y su salida distinta de cero:
   - `npm run auditar-a11y` → axe-core sobre las 13 páginas × 2 temas × 2 tamaños (52 pasadas), los dos
     estados del formulario que no existen por URL, el recorrido real con `Tab` y el reflujo a 320 px y
     al 200 %.
   - `npm run auditar-rendimiento` → Lighthouse en móvil 4G emulado y en escritorio, con los
     presupuestos del §6.4 como barrera.
5. **No se encadenan en `npm run verificar`.** Igual que `probar-formulario` (ADR-023), necesitan
   `npm run preview` y tardan minutos; `verificar` tiene que poder correr sin navegador y en segundos.

**Consecuencias.**
- ✅ La accesibilidad deja de apoyarse en la lectura del marcado. Las 52 pasadas cubren lo que el ojo
  no compara bien: los cinco contrastes prohibidos de la paleta en los dos temas, el estado de error
  del formulario y el paso de revisión, que solo existen después de interactuar.
- ✅ Los presupuestos del §6.4 pasan de promesa a medición, y con barrera: LCP, CLS, TBT y peso de
  HTML+CSS tumban la auditoría si se salen.
- ✅ Cuatro scripts y un solo cliente de protocolo. Un fallo en la espera del puerto de depuración se
  arregla en un sitio.
- ⚠️ `axe-core` entra en `devDependencies` pero su código fuente —`node_modules/axe-core/axe.min.js`—
  se inyecta en el navegador para medir. No se copia al proyecto ni se publica.
- ⚠️ Lighthouse mide en la máquina de quien lo corre. Las cifras sirven como línea base y como barrera
  contra regresiones, no como promesa contractual de lo que verá un visitante real con otra red.

---

## ADR-026 · El recorrido con teclado se mide con eventos `Tab` reales y con lo que se pinta

**Estado:** ✅ Aceptado · **Fecha:** 2026-10-16

**Contexto.** El §5.1 lista «teclado solo (Tab/Shift+Tab/Enter/Esc)» como revisión **manual** antes de
cada release, y el §5.3 reclama dos criterios que solo se ven con el teclado: 2.4.7 (foco visible) y
2.4.11 (foco no oscurecido, nuevo en WCAG 2.2). Automatizarlo es deseable —una revisión manual antes de
cada release se acaba saltando— pero hacerlo mal es peor que no hacerlo: una prueba que da falsos
positivos enseña a ignorarla.

La primera versión del recorrido dio **13 fallos que no existían**: los cinco enlaces que rompen en dos
líneas aparecían «tapados» y todas las páginas menos una «sin indicador de foco».

**Decisión.** El recorrido se implementa así, y cada regla responde a un fallo real de la primera
versión:

1. **Eventos `Tab` de verdad** (`Input.dispatchKeyEvent`), no `.focus()` desde la página. Chrome decide
   él adónde va el foco, aplica `:focus-visible` y hace su propio desplazamiento. Se activa
   `Emulation.setFocusEmulationEnabled` para que la pestaña headless reciba las teclas.
2. **Espera a que la parada se asiente.** `html { scroll-behavior: smooth }` anima el desplazamiento y
   el enlace de salto entra con una transición de `top`. Midiendo a los 40 ms se veían a mitad de
   camino y parecían tapados. Ahora se sondea la caja del elemento enfocado hasta que dos lecturas
   seguidas coinciden.
3. **Foco no oscurecido = quién se pinta encima**, no geometría. La cabecera es fija: todo pasa por
   debajo en algún momento. Se pregunta a `elementFromPoint` si el elemento sigue siendo alcanzable en
   sus puntos, y si no, se informa **quién** lo tapa.
4. **Cajas de línea, no la caja envolvente.** Un enlace que rompe en dos líneas tiene por rectángulo la
   unión de las dos, y su centro cae en el hueco entre ambas —fuera del enlace— aunque esté
   perfectamente visible. Se muestrean `getClientRects()`.
5. **El indicador de foco puede estar en la tarjeta.** El radio y la casilla del formulario son
   `visually-hidden` dentro de `.opcion`, y el anillo se pinta en la tarjeta con
   `@supports selector(:has(*))`. La firma compara el elemento **y sus dos ancestros**, medida contra
   una línea base tomada al cargar, cuando todavía no hay nada enfocado.
6. **La identidad de una parada no es su `id`.** Media docena de enlaces del pie no tienen ninguno: la
   detección de trampas comparaba `null === null` y declaraba trampa a los tres pasos. La identidad es
   la huella completa (índice marcado, etiqueta, texto, posición).

**Consecuencias.**
- ✅ `npm run auditar-a11y` recorre las 13 páginas en 531 paradas y comprueba cuatro cosas por parada:
  que el primer `Tab` llega al enlace de salto, que hay indicador de foco, que nada lo tapa y que no hay
  trampa. Las 531 pasan.
- ✅ Lo que sigue siendo humano se **enumera** en `accessibility-report.md` en vez de darse por hecho:
  lector de pantalla (NVDA/VoiceOver), zoom real del navegador y las animaciones.
- ⚠️ 2.4.12 y 2.4.13 (nivel AAA) siguen fuera de alcance, como declaró el §5.3. La firma de foco
  comprueba que el indicador **cambia**, no que cumpla el área y el contraste mejorados.
- ⚠️ La prueba vive en `scripts/auditar-accesibilidad.mjs`, no en un servicio de terceros: el proyecto
  no tiene CI todavía (no hay repositorio) y el script se escribió para poder colgarse de uno cuando lo
  haya.

---

## Resumen de decisiones

| ADR | Decisión | Estado |
| :--- | :--- | :--- |
| 000 | Reencauce de documentos de identidad a `ruway-marca/` | ✅ |
| 001 | Sitemap en dos olas (13 + 2 páginas) | ✅ |
| 002 | Un solo idioma es-PE, URLs sin acentos | ✅ |
| 003 | Navegación principal de 5 destinos + CTA | ✅ |
| 004 | Un formulario con parámetro de intención | ✅ |
| 005 | `scroll-margin-top` en anclas | ✅ |
| 006 | Stack: Astro + TS + Tailwind 4 (instalado: Astro 7.4.0) | ✅ |
| 007 | Hosting/CDN: Cloudflare Pages | ✅ |
| 008 | Sin backend: formulario → WhatsApp | ✅ |
| 009 | Sin CMS en v1 (Content Collections) | ✅ |
| 010 | Analítica sin cookies | ✅ |
| 011 | Reglas de accesibilidad fuera de `@layer` | ✅ |
| 012 | Normalizar `Astro.url.pathname` (canonical y menú) | ✅ |
| 013 | Colores derivados ratificados · tema claro por defecto | ✅ |
| 014 | La reserva de demo abre WhatsApp directo (ajusta el 004) | ✅ |
| 015 | Precio de lanzamiento con el de lista tachado | ✅ |
| 016 | Sin contenido incrustado de terceros (ni mapa, ni vídeos) | ✅ |
| 017 | Un solo nodo `Course` compartido por tres páginas | ✅ |
| 018 | `[POR DEFINIR]` se dibuja como hueco visible (`Pendiente`) | ✅ |
| 019 | Triple verificación: estructura + enlaces/anclas + JSON-LD | ✅ |
| 020 | 3.4 = 11 páginas · 3.5 = `/inscripcion`, `/gracias` y el formulario | ✅ |
| 021 | El plan de negocio es interno: la web publica solo lo verificable | ✅ |
| 022 | El formulario se revisa antes de enviar y confirma en `/gracias` | ✅ |
| 023 | Prueba funcional del formulario en navegador real | ✅ |
| 024 | Ocho herramientas; «Hojas de cálculo» es tema, no herramienta | ✅ |
| 025 | axe-core y Lighthouse como dependencias de desarrollo · un cliente CDP compartido | ✅ |
| 026 | El recorrido con teclado usa eventos `Tab` reales y mide lo que se pinta | ✅ |
