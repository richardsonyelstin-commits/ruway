# 00 · Inventario de Insumos — RUWAY ACADEMY

**Agente:** A0 (Analista de Insumos) · Fase 0
**Fecha:** 16 de octubre de 2026
**Directorio analizado:** `C:\Ruway`
**Archivos leídos:** 9 documentos + 62 assets en `ruway-identidad/`

> **Regla aplicada:** este inventario **no inventa datos**. Todo valor numérico o de copy
> proviene de un archivo local y se cita con su origen (`plan completo.md §X.Y`).
> Lo que no existe se marca `[POR DEFINIR]`.

---

## 1. Estado de los archivos

### 1.1 Fuente de verdad real del proyecto

| Archivo | Tamaño | Estado | Qué contiene realmente | ¿Sirve como fuente? |
| :--- | ---: | :--- | :--- | :--- |
| `ruway-identidad/` | 8 carpetas · 62 archivos | ✅ **Completo** | Kit de marca cerrado: 6 variantes de logo, isotipo, trazo, avatares/insignias, favicons. **SVG + PNG en todos los casos.** Paleta, tipografía y reglas en `LEEME.txt`. | ✅ Sí — fuente de marca |
| `plan completo.md` | 28 KB · 492 líneas | ✅ **Completo** | Plan de negocio v2.0 íntegro: identidad, oferta académica, precios, operación, legal, marketing, cronograma. | ✅ Sí — fuente de copy y datos |
| `01-mapa-del-sitio.md` | 8 KB · 147 líneas | ✅ **Completo (v1.0)** | Sitemap con 8 páginas + 2 legales, detalle por bloque, flujo de conversión y SEO local. | ✅ Sí — a revisar/enriquecer en Fase 1 |

### 1.2 Archivos que **no** contienen lo que el brief supone

El brief define `IDENTITY`, `SOUL`, `USER`, `AGENTS`, `TOOLS` y `HEARTBEAT` como documentos
de marca de RUWAY. **En el directorio no lo son: son las plantillas del asistente OpenClaw**
(su identidad de agente, su política de seguridad y sus notas locales). Están **vacíos de
contenido RUWAY**.

| Archivo | Estado real | Contenido | Destino equivalente de la info |
| :--- | :--- | :--- | :--- |
| `IDENTITY.md` | ⚠️ Plantilla vacía | Formato de identidad del *agente* (`Name`, `Creature`, `Vibe`…). Sin rellenar. | `plan completo.md §2.1–2.6` |
| `SOUL.md` | ⚠️ Política de seguridad | Personalidad del agente + protocolo de seguridad (en chino). Nada de RUWAY. | `plan completo.md §2.2–2.4` |
| `USER.md` | ⚠️ Plantilla vacía | Ficha del *dueño del agente*. Sin rellenar. | `plan completo.md §4.1–4.2` |
| `AGENTS.md` | ⚠️ Instrucciones del agente | Manual operativo del workspace del agente. No son roles de RUWAY. | `plan completo.md §9` |
| `TOOLS.md` | ⚠️ Plantilla vacía | Notas de entorno (cámaras, SSH, TTS). Sin rellenar. | `plan completo.md §8.3` |
| `HEARTBEAT.md` | ⚠️ Plantilla vacía | Sin tareas. | `plan completo.md §5.4, §12` |

> ⚠️ **No es bloqueante.** La información que el brief esperaba en esos 6 archivos **sí existe**,
> pero vive concentrada en `plan completo.md`. Ver Fase de clarificación (§7) para el reencauce propuesto.

---

## 2. Identidad visual (extraída de `ruway-identidad/`)

### 2.1 Paleta oficial — 6 colores, sin variantes

| Token propuesto | Nombre | HEX | Rol en el brief |
| :--- | :--- | :--- | :--- |
| `--ruway-piedra` | **Piedra** | `#14171E` | Fondo oscuro principal / texto sobre claro |
| `--ruway-cal` | **Cal** | `#F3F1EA` | Fondo claro principal / texto sobre oscuro |
| `--ruway-maiz` | **Maíz** | `#F0B429` | Acento primario (CTA, foco, data-viz) |
| `--ruway-teja` | **Teja** | `#BE3A1B` | Acento secundario / alertas / nivel 2 |
| `--ruway-ichu` | **Ichu** | `#1F6B4F` | Éxito / logro / nivel 3 |
| `--ruway-niebla` | **Niebla** | `#9AA0AE` | Texto secundario, bordes, metadatos |

> Origen: `ruway-identidad/LEEME.txt` líneas 27–29. La marca **no define** variantes claras/oscuras
> de estos colores, así que cualquier variante para dark mode debe derivarse y **aprobarse** (§7).

### 2.2 Contrastes calculados (WCAG 2.2 · fórmula de luminancia relativa)

| Combinación | Ratio | Texto normal (≥4.5) | Texto grande / UI (≥3) | Veredicto de uso |
| :--- | ---: | :---: | :---: | :--- |
| Cal `#F3F1EA` sobre Piedra `#14171E` | **15.9:1** | ✅ | ✅ | Par base AA/AAA |
| Piedra `#14171E` sobre Cal `#F3F1EA` | **15.9:1** | ✅ | ✅ | Par base AA/AAA |
| Blanco `#FFFFFF` sobre Piedra | **17.9:1** | ✅ | ✅ | Títulos sobre dark |
| Maíz `#F0B429` sobre Piedra | **9.6:1** | ✅ | ✅ | Acento y CTA sobre dark |
| Niebla `#9AA0AE` sobre Piedra | **6.8:1** | ✅ | ✅ | Texto secundario en dark |
| Ichu `#1F6B4F` sobre Cal | **5.7:1** | ✅ | ✅ | Estado "logro" sobre claro |
| Teja `#BE3A1B` sobre Cal | **4.9:1** | ✅ | ✅ | Acento sobre claro (al límite) |
| Teja `#BE3A1B` sobre Piedra | **3.3:1** | ❌ | ✅ | Solo texto grande / bordes en dark |
| Ichu `#1F6B4F` sobre Piedra | **2.8:1** | ❌ | ❌ | **Prohibido en dark** — requiere variante clara |
| **Maíz `#F0B429` sobre Cal** | **1.6:1** | ❌ | ❌ | **Prohibido como texto en claro** |
| Niebla `#9AA0AE` sobre Cal | **2.3:1** | ❌ | ❌ | **Prohibido en claro** — es `border`/`placeholder`, no texto |

**Reglas de accesibilidad derivadas (se implementan en Fase 3):**

1. **Maíz y Niebla son colores de fondo oscuro.** Sobre Cal no pueden llevar texto ni ser texto.
   El botón "Maíz" lleva **texto Piedra** (9.6:1), nunca texto Cal.
2. **El anillo de foco cambia según el tema:** Maíz sobre Piedra (9.6:1 ✅) en dark;
   en claro el foco debe ser **Piedra** (15.9:1 ✅) o un anillo de doble contraste, porque
   Maíz sobre Cal solo alcanza 1.6:1 y violaría WCAG 2.2 · 2.4.11 (Focus Appearance).
3. **Ichu y Teja necesitan variante clara en dark mode.** Se propondrán valores derivados
   (manteniendo el tono) y se pedirá aprobación — *no se altera la marca sin autorización*.
4. **Contraste ≥ 4.5:1 se cumple** con el par Piedra/Cal sin tocar la paleta.

### 2.3 Tipografía oficial (Google Fonts, gratuita)

| Uso | Familia | Origen |
| :--- | :--- | :--- |
| Títulos / display | **Bricolage Grotesque** | `LEEME.txt` l. 32 |
| Texto / UI | **Instrument Sans** | `LEEME.txt` l. 32 |
| Etiquetas / código / datos | **JetBrains Mono** | `LEEME.txt` l. 32 |

Las tres son de **Google Fonts**, licencia OFL → self-hosting permitido (mejor LCP, sin
terceros). El logotipo ya está **convertido a curvas en el SVG**, así que la tipografía del
sitio no necesita coincidir con la del logo.

### 2.4 Activos visuales disponibles

| Categoría | Variantes | Formatos | Notas de uso |
| :--- | :--- | :--- | :--- |
| `01-logo-horizontal` | claro, oscuro, sobre-maiz, sobre-teja, negro, blanco | SVG + PNG | Uso general (header) |
| `02-logo-vertical` | 6 | SVG + PNG | Redes, portadas, footer compacto |
| `03-logo-con-descriptor` | 6 | SVG + PNG | «ESCUELA DE IA · CAJAMARCA» → OG image, afiches |
| `04-logotipo-solo-texto` | 6 | SVG + PNG | Wordmark sin símbolo |
| `05-isotipo` | blanco, negro, fondo-cal/maiz/piedra/teja | SVG + PNG | Avatar, favicon, bullets |
| `06-trazo-sin-fondo` | blanco, negro, cal, maiz, piedra, teja | SVG + PNG | Marca de agua, separador |
| `07-avatares-e-insignias` | avatar maíz/piedra + **3 insignias de nivel** | SVG + PNG | Gamificación (§5.4 del plan) |
| `08-iconos-app-y-favicon` | favicon 16/32/48/180/192/512 + icono app 1024 | SVG + PNG | PWA / manifest |

**Archivo `favicon.svg`** (leído): cuadrado Maíz `#F0B429` + trazo Piedra `#14171E`.
Como SVG de una sola capa, es el candidato natural a favicon principal.

**El símbolo (isotipo), descrito con precisión:** un cuadrado de esquinas muy redondeadas
(radio 26/120) que contiene un **trazo escalonado ascendente** —cuatro segmentos que suben
como una escalera vista de perfil— y un **punto circular** despegado en la esquina superior
derecha. Lectura de marca: *la escalera = aprender "paso a paso"; el punto = el destino/el
siguiente nivel; el cuadrado = el camino contenido*. Encaja con el eslogan (§3.1) sin caer
en clichés (no hay robots, ni cerebros, ni binario, ni Matrix). **Es un activo excelente para
animar con motion significativo** (trazo que se dibuja al hacer scroll) respetando
`prefers-reduced-motion`.

**⚠️ Faltante de assets:** el kit contiene **solo vectores de marca**. No hay **fotografías**
del local, del docente ni de alumnos. La web necesitará imágenes reales (o un plan de
ilustración temporal) → ver §4, gap 11.

---

## 3. Identidad de marca (extraída de `plan completo.md §2`)

### 3.1 Núcleo

| Elemento | Contenido literal |
| :--- | :--- |
| **Nombre** | RUWAY ACADEMY |
| **Etimología** | "Ruway" = *camino*, en quechua → identidad local + acompañamiento paso a paso (§2.1) |
| **Eslogan** | "RUWAY: Tu camino a la inteligencia artificial, paso a paso." (§2.2) |
| **Alternativas de eslogan** | "Aprende IA haciendo. Presencial, en Cajamarca, a tu ritmo." · "De cero a proyectos reales con IA." |
| **Misión** | Enseñar IA presencial, práctica y personalizada a jóvenes y público general de Cajamarca, para aplicarla en proyectos reales con criterio y ética (§2.3) |
| **Visión** | Ser la academia referente de IA aplicada en Cajamarca, reconocida por formar personas que usan la IA con criterio, ética y creatividad (§2.4) |

### 3.2 Tono de voz (inferido de §2.2, §2.5, §2.6 y `LEEME.txt`)

- **Cercano y local**, no corporativo: habla de Cajamarca, de "tu negocio familiar", de "tu colegio".
- **Promesa concreta y sin humo**: "cada alumno sale con algo hecho", "de cero a proyectos reales".
  El plan **prohíbe implícitamente** vender humo: el certificado se comunica *siempre* como
  "sin validez oficial MINEDU" (§5.7). La honestidad radical es parte del tono.
- **Directo y en segunda persona** ("Tu camino a la IA").
- **Anti-cliché**: §2.6 aclara que el uso es *instrumental*, "no formación de programadores".
  Traducido a diseño: **nada de estética "hacker"**, nada de Matrix, nada de robots genéricos.
- **Español peruano (es-PE)**, un solo idioma (§1.4 del mapa).
- **Palabras clave del léxico de marca:** *paso a paso · camino · presencial · grupos pequeños ·
  proyectos reales · criterio · ética · Cajamarca · herramientas vigentes*.

### 3.3 El "alma" (lo que en el brief era `SOUL`)

No existe archivo `SOUL` de RUWAY; el equivalente está disperso en §2 y §11:
democratizar el acceso local a la IA, competir contra el curso online de Lima con
**presencialidad y cercanía**, y dejar que el alumno **sea protagonista** (Demo Day público,
proyecto propio del que conserva los derechos — §10.2). La experiencia UX debería sentirse
como *un taller con luz natural y gente del barrio*, no como un SaaS frío.

---

## 4. Público objetivo (extraído de `plan completo.md §4`)

| Segmento | Necesidad real | Proyecto tipo |
| :--- | :--- | :--- |
| **Escolares 14–17** | Estudiar mejor, tareas, exposiciones, orientación | Bot de estudio / asistente de repaso |
| **Universitarios** | Trabajos, investigación, portafolio, empleabilidad | Portafolio profesional + asistente de investigación |
| **Público general / emprendedores** | Productividad, negocio propio, automatizar tareas | Asistente del negocio familiar o automatización personal |

**Requisitos de ingreso (§4.2):** laptop propia con navegador actualizado · conocimientos básicos
de computación · compromiso de asistencia · autorización firmada del apoderado si es menor de 18.

**Restricciones operativas relevantes para la web (§4.3–4.4):**
- No hay equipos de préstamo. Un solo grupo heterogéneo (no se separa por edad).
- Menores: cuentas de IA gestionadas con el apoderado; prohibido subir datos personales.
- **Quien paga suele ser el padre/madre; quien decide, el hijo/a** (§11.1 canal 4). → La web
  necesita hablarle a **los dos**: al hijo (proyecto, tecnología, futuro) y al padre
  (seguridad, dirección física, certificado honesto, política de devoluciones).

---

## 5. Oferta académica (extraída de `plan completo.md §5, §6, §8`)

### 5.1 Ficha del programa

| Campo | Detalle |
| :--- | :--- |
| Nombre | Programa de Inteligencia Artificial Aplicada – RUWAY ACADEMY |
| Duración | 8 semanas · 24 sesiones · **48 horas** |
| Frecuencia | Martes, jueves y viernes · **4:00–6:00 pm** |
| Sede | **Jr. Los Geranios 250, Cajamarca** (local propio) |
| Grupo | Mínimo **7** · Máximo **10** alumnos |
| Certificado | Incluido — **sin validez oficial MINEDU** (se comunica siempre así) |
| Portafolio | Notion por defecto · GitHub opcional |
| Estructura de sesión | 120 min: activación 15 · teoría 20 · práctica guiada 30 · descanso 10 · práctica autónoma 35 · cierre 10 |
| Metodología | ABP + aula invertida (Notion) + gamificación ligera con insignias |

### 5.2 Temario — 8 semanas (nombres exactos, no se alteran)

| Semana | Tema | Contenido principal |
| :--: | :--- | :--- |
| 1 | Fundamentos + ética | Qué es la IA, tipos, LLM, límites y alucinaciones. Sesgos, deepfakes, verificación, privacidad. Panorama ChatGPT/Gemini/Copilot. Workspace. |
| 2 | Prompting efectivo | Rol, contexto, objetivo, formato, ejemplos. Zero-shot, few-shot, chain-of-thought. Biblioteca personal de prompts. |
| 3 | IA para productividad | Textos, correo, calendario, notas, presentaciones. Gemini en Workspace y Copilot en Microsoft 365 (planes gratuitos/educativos). |
| 4 | IA para crear sin programar | Generación de contenido, código asistido, sitios y prototipos. Demo opcional de Python/Colab (Nivel 2). |
| 5 | Datos y decisiones con IA | Hojas de cálculo + IA: análisis guiado, visualización, datos reales del alumno o del negocio familiar. |
| 6 | Automatización no-code | Make / Zapier / n8n (planes gratuitos). Conexión con Sheets, correo y WhatsApp Business (sin API de pago). |
| 7 | Proyecto personal | Definición por segmento, desarrollo guiado, retroalimentación entre pares. **Preventa del Ciclo 2.** |
| 8 | Portafolio + Demo Day | Armado del portafolio, ensayo, **Demo Day abierto a padres e invitados**, certificados y encuesta final. |

### 5.3 Herramientas del programa (§8.3) — todas con plan gratuito

Notion (material, rúbricas, seguimiento) · GitHub (portafolio opcional) · WhatsApp (avisos) ·
Google Colab (práctica técnica) · ChatGPT / Gemini / Copilot / DeepSeek / Kimi K3 / MiniMax · Make / Zapier / n8n ·
Google Business Profile (ficha local) · OSE + contador (facturación, S/ 120/mes).

> **Regla del plan:** el programa debe poder dictarse **íntegramente con planes gratuitos**.

### 5.4 Precios — tabla única (§6.1)

| Concepto | Precio | Nota |
| :--- | :--- | :--- |
| Programa completo — general (pago único) | **S/ 550** | Incluye matrícula y certificado |
| Programa completo — general en 2 cuotas | 2 × S/ 290 | Vence al inicio y en semana 5 |
| Programa completo — escolar 14–17 (pago único) | **S/ 450** | Igual |
| Programa completo — escolar en 2 cuotas | 2 × S/ 240 | Igual |
| Clase demo | **Gratis** | Reserva por WhatsApp, cupos limitados (cupo 12) |
| Clase personalizada 1 a 1 | S/ 80/hora | — |

**Descuentos (§6.2) — máximo 2 acumulables:**

| Descuento | Monto | Condición |
| :--- | :--- | :--- |
| Lanzamiento | −S/ 50 → **S/ 500 / S/ 400** | Solo primeras 10 matrículas |
| Early bird | −10% | Matrícula dentro de los 7 días posteriores a la demo |
| Hermanos | −15% | Sobre el segundo hermano |
| Referidos | S/ 50 para cada uno | Al referido matriculado y a quien refiere |
| Alumni (Ciclo 2+) | −15% | Renovación consecutiva |

**Política de devoluciones (§7.5):** antes del inicio 100% − S/ 30 · tras sesión 1: 80% ·
tras sesión 2: sin devolución (postergación 1 vez) · retiro voluntario: sin devolución ·
cancelación por RUWAY: 100% proporcional · inasistencia: sin devolución.

**Evaluación (§5.5):** proyecto 60% · asistencia 20% · portafolio 20%.
Aprobación: asistencia ≥ 80% + proyecto presentado en Demo Day + portafolio completo.

**Nota legal crítica:** precios **con IGV incluido**; el certificado **no tiene validez oficial
MINEDU** y debe verse **sin descargar PDF** (§1.3 del mapa).

### 5.5 Niveles (dato emergente, no desarrollado en el plan)

El kit de marca incluye **3 insignias**: `nivel-1-fundamentos`, `nivel-2-creador`,
`nivel-3-constructor`. El plan solo desarrolla el **Nivel 1** (el programa base) y menciona
un **"Nivel 2: IA aplicada a negocios y automatización avanzada"** (§11.5) y una "demo
opcional de Python/Colab (Nivel 2)" (§5.3 semana 4).
**No existe contenido de Nivel 2 ni Nivel 3** en los archivos → ver §7.

---

## 6. Cifras operativas y de negocio (contexto para copy y semántica)

| Dato | Valor | Origen |
| :--- | :--- | :--- |
| Punto de equilibrio | **7 alumnos** | §7.2 |
| Meta sana | 10 alumnos (~S/ 700/mes de utilidad) | §7.2 |
| Escalamiento | 2 grupos · 16 alumnos | §7.2 |
| Costos fijos | S/ 1,220/mes (con docente remunerado) | §7.1 |
| Costo variable | S/ 90 por alumno/bimestre | §7.1 |
| Fondo inicial | S/ 1,800 (rango 1,500–2,000) | §7.4 |
| Presupuesto web/hosting | **S/ 180/año** | §7.4 y §11.1 canal 6 |
| Conversión demo → matrícula | **≥ 40%** | §11.2 |
| Recompra Ciclo 2 | ≥ 50% | §3.3, §11.5 |
| Equipo | Fundador/docente + gestión comercial por comisión | §9 |

> **Cifras sensibles:** los márgenes, utilidades y el fondo inicial **no se publican en la web**.
> Solo se usan internamente para calibrar el copy (p. ej., "grupos de 7 a 10" viene de aquí).

---

## 7. Gaps detectados

### 7.1 Clarificación estructural — ✅ RESUELTA (16/10/2026)

- **Decisión del usuario:** *"sí, reencauza"*.
- **Acción ejecutada:** se creó el paquete `ruway-marca/` con los 6 documentos de marca de RUWAY,
  derivados estrictamente de `plan completo.md` y `ruway-identidad/LEEME.txt`:

  | Documento creado | Reemplaza a | Origen real |
  | :--- | :--- | :--- |
  | `ruway-marca/IDENTITY.md` | `IDENTITY.md` (plantilla) | `plan completo.md §2` + `LEEME.txt` |
  | `ruway-marca/SOUL.md` | `SOUL.md` (política del agente) | `plan completo.md §2, §10.2, §11` |
  | `ruway-marca/USER.md` | `USER.md` (plantilla) | `plan completo.md §4.1–4.4, §11.1` |
  | `ruway-marca/AGENTS.md` | `AGENTS.md` (manual del agente) | `plan completo.md §9, §13` |
  | `ruway-marca/TOOLS.md` | `TOOLS.md` (plantilla) | `plan completo.md §8.2–8.3` |
  | `ruway-marca/HEARTBEAT.md` | `HEARTBEAT.md` (plantilla) | `plan completo.md §5.4, §3.4, §8.4, §12` |

- **Precaución aplicada:** los archivos originales de la raíz **no se sobrescribieron** (son la
  configuración operativa del asistente; borrarlos rompería el workspace). El paquete `ruway-marca/`
  es ahora la **fuente de verdad de identidad** del proyecto web.
- **Resultado:** deja de haber gap estructural. Todos los insumos de marca quedan disponibles en
  formato explícito.

### 7.2 Datos duros — estado

#### ✅ Confirmados por el usuario (16/10/2026)

| # | Dato | Valor confirmado |
| --: | :--- | :--- |
| 1 | **WhatsApp** | `+51 930 736 214` |
| 2 | **Correo de contacto** | `ruway.edu.cax@gmail.com` |
| 3 | **Dominio** | `academiaruway.com` |
| 4 | **Denominación comercial** | `RUWAY ACADEMIA` |
| 5 | **Fecha de inicio del Ciclo 1** | **martes 27 de octubre de 2026** |

> ✅ *Verificación:* el 27/10/2026 cae **martes**, día de clase según el horario oficial
> (mar/jue/vie 4–6 pm). La fecha es coherente con el plan.

#### ⏳ Todavía pendientes → irán como `[POR DEFINIR]` en el sitio

| # | Dato faltante | Dónde se necesita | Impacto |
| --: | :--- | :--- | :--- |
| 6 | **RUC** (la denominación ya existe; falta el número) | Aviso legal, Términos, Privacidad | Bajo — se puede lanzar sin mostrarlo |
| 7 | **Handles de TikTok e Instagram** | Footer, barra social, JSON-LD `sameAs` | Bajo — se añaden después |
| 8 | **Coordenadas geográficas** (lat/long) | JSON-LD `LocalBusiness` (`geo`) | Bajo — la dirección textual ya existe |
| 9 | **Fotografías reales** (local, docente, aula) | Inicio, Sobre, OG image | **Medio** — afecta credibilidad y OG |
| 10 | **Testimonios / casos de éxito** | Prueba social | Medio — academia nueva: **diseñar contenedor, no inventar** |
| 11 | **Contenido de Nivel 2 y Nivel 3** | `/nivel-2` | Medio — solo el nombre está definido (§11.5) |
| 12 | **Horario de atención presencial del local** | `/contacto`, `/sobre` | Bajo |

### 7.3 Gaps del `01-mapa-del-sitio.md` (a resolver en Fase 1)

El mapa v1.0 es **sólido** (8 páginas + 2 legales, con foco en el embudo). Faltantes que
propondré añadir en Fase 1, cada uno con justificación:

1. **`/politica-de-cookies`** — exigido por el brief (restricción §5) y por el uso de analítica/OG.
2. **`/contacto`** — hoy solo vive en el footer; falta página dedicada con NAP consistente
   (SEO local + Google Business, §11.1 canal 1) y mapa embebido accesible.
3. **`/demo-day` o `/proyectos`** — prueba social y motor del embudo demo→matrícula (§5.3 sem. 8, §11.4). Hoy no tiene destino.
4. **`/instituciones`** (colegios e institutos) — canal de captación B2B del taller gratuito intraescolar (§11.4). No está en el mapa.
5. **`/nivel-2`** (o `/ciclo-2`) — destino de la **preventa del Ciclo 2** (§11.5). Hoy no existe.
6. **`/gracias`** — confirmación de inscripción + evento de conversión para medir el embudo (§3.4).
7. **`404`** personalizada (accesible, con retorno al embudo).
8. **Técnicos:** `sitemap.xml`, `robots.txt`, `manifest.webmanifest`.
9. **Fuera de alcance propuesto:** blog/recursos — el plan **no asigna contenido editorial ni
   presupuesto**; se recomienda no abrirlo hasta tener material.
10. **Normalización de anclas:** el mapa usa `#metodologia` (en `/programa`) y `#metodo`
    (en `/sobre`). Conviene unificar nomenclatura para no romper enlaces.

### 7.4 Gaps de accesibilidad detectados en los insumos

- El mapa v1.0 **no menciona** accesibilidad, `prefers-reduced-motion`, foco visible ni
  landmarks. Se integrará desde el diseño (Fase 1/3), no como parche.
- **Contraste de marca:** la paleta cumple AA en pares base, pero **Maíz sobre Cal (1.6:1)**,
  **Niebla sobre Cal (2.3:1)** e **Ichu sobre Piedra (2.8:1)** fallan. Reglas derivadas en §2.2.
- **Certificado "sin validez oficial MINEDU"** debe comunicarse con **texto real**, no solo
  color/icono, y sin depender de descarga (WCAG 1.4.1 · 1.4.5).

### 7.5 Gaps de SEO detectados

- El mapa ya prevé `sitemap.xml`, `robots.txt`, JSON-LD `EducationalOrganization` + `Course` +
  `FAQPage`. **Añadiré** `LocalBusiness`, `BreadcrumbList` y, para el Demo Day, `Event`.
- Falta estrategia de **OG image** (candidato: `ruway-logo-descriptor-sobre-*` sobre fondo de marca).
- Faltan datos para SEO local completo (`telephone`, `geo`, `sameAs` con redes) → §7.2.

---

## 8. Stack operativo del programa (lo que la web debe reflejar, no imponer)

`plan completo.md §8.3` describe las herramientas **de la academia**, no el stack de la web:
Notion, GitHub, WhatsApp, Google Colab, ChatGPT/Gemini/Copilot/DeepSeek/Kimi K3/MiniMax, Make/Zapier/n8n, Google Business, OSE.

> ⚠️ **Caso límite del brief atendido:** estas herramientas **no condicionan** el stack de la web.
> Se reflejarán en `/programa` (sección "Herramientas") y en la metodología. La elección del
> stack web se hará en Fase 2 por criterios propios (rendimiento, SEO, costo, accesibilidad,
> talento en Perú).

---

## 9. Resumen ejecutivo de la Fase 0

| Veredicto | Detalle |
| :--- | :--- |
| 🟢 **Listo para trabajar** | `ruway-identidad/` (completo, SVG+PNG), `plan completo.md` (completo), `01-mapa-del-sitio.md` (completo v1.0) |
| ✅ **Reencauzado** | `IDENTITY`, `SOUL`, `USER`, `AGENTS`, `TOOLS`, `HEARTBEAT` → reconstruidos como documentos de RUWAY en `ruway-marca/` (ver §7.1) |
| 🟢 **Datos duros: 5 de 12** | Confirmados (WhatsApp, correo, dominio, denominación, fecha de inicio). Pendientes menores: RUC, redes, geo, fotos, testimonios, Nivel 2/3, horario de atención |
| ✅ **Sin bloqueo real** | Todo el copy y los datos duros de Home/Programa/Sedes/Precios existen en `plan completo.md` |

**Puedo avanzar a Fase 1 sin bloqueos.** Los 10 datos faltantes se insertarán como
`[POR DEFINIR]` en el sitio y señalados explícitamente en cada checkpoint.

---

**Checkpoint 0 — Comandos:** `$approve-0` · `$revise-0 "feedback"`
