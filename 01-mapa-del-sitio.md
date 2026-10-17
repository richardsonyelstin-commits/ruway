# RUWAY ACADEMY — Documento 01 · Mapa del sitio

**Versión:** 1.0 · Oct 2026
**Fuente de contenido:** Plan de Implementación RUWAY ACADEMY v2.0
**Objetivo del sitio:** cerrar la venta que inicia en redes → demo gratuita → matrícula (canal web = S/ 180/año según §11.1 del plan)

---

## 1. Principios de arquitectura de información

1. **Embudo explícito** (§11.2 del plan): cada página tiene un único CTA principal que empuja al paso siguiente del embudo (conocer → comparar → reservar demo → inscribirse).
2. **Máximo 3 clics** desde cualquier página hasta el formulario de inscripción.
3. **Cero fricción legal:** el certificado "sin validez oficial MINEDU", los requisitos y la política de devoluciones son visibles sin descarga de PDF (§5.7, §7.5).
4. **Un solo idioma (es-PE)**, contenido orientado a 3 perfiles: escolar 14–17, universitario y público general/emprendedor (§4.1).
5. **Mobile-first:** el tráfico llega desde TikTok/Instagram/WhatsApp → la mayoría será móvil.

---

## 2. Mapa global (árbol de navegación)

```
RUWAY.ACADEMY
│
├── / (Inicio) ──────────────────────────────── puerta de entrada + conversión
│
├── PROGRAMA (sección de nivel 1, con anclas)
│   ├── /programa (Programa completo)
│   │   ├── #temario            → 8 semanas / 24 sesiones / 48 h
│   │   ├── #metodologia        → estructura de sesión de 120 min
│   │   ├── #resultados         → perfil del egresado
│   │   └── #evaluacion         → rúbrica, asistencia, certificado
│
├── /precios (Precios y descuentos)
│   ├── #tarifas                → tabla única de precios (§6.1)
│   ├── #descuentos             → máx. 2 acumulables (§6.2)
│   └── #devoluciones           → política de devoluciones (§7.5)
│
├── /inscripcion (Inscripción / Reservar demo)
│   ├── #requisitos             → laptop, edad, autorización de apoderado
│   └── #formulario             → formulario → WhatsApp (sin backend)
│
├── /preguntas-frecuentes (FAQ)  → resuelve objeciones de padres y alumnos
│
├── /sobre (Sobre RUWAY)
│   ├── #identidad              → "Ruway" = camino en quechua, misión y visión
│   ├── #metodo                 → diferenciadores (§2.6)
│   └── #sede                   → Jr. Los Geranios 250, Cajamarca + horarios
│
└── LEGAL (nivel 2, solo en footer)
    ├── /privacidad             → Ley 29733, tratamiento de datos (§10.4)
    └── /terminos               → matrícula, certificado, imagen, devoluciones
```

**Navegación principal (header):** Inicio · Programa · Precios · Preguntas frecuentes · Sobre · [CTA: Reserva tu demo gratis]
**Navegación secundaria (footer):** todas las páginas + Privacidad + Términos + contacto + dirección.

---

## 3. Detalle por página

### 3.1 Inicio — `/`
| Bloque | Contenido | Función |
|---|---|---|
| Hero | Eslogan "Tu camino a la inteligencia artificial, paso a paso" + subcopy (presencial, Cajamarca, sin conocimientos previos) + CTA doble: *Reserva tu demo gratis* / *Ver el programa* | Atención + conversión |
| Barra de datos | 8 semanas · 24 sesiones · 48 horas · grupos de 7 a 10 · desde 14 años | Prueba rápida |
| Propuesta de valor | 4 tarjetas: presencialidad, grupos pequeños, proyectos reales, herramientas vigentes (§2.5) | Diferenciación vs. cursos online |
| Para quién | 3 perfiles → banco de proyectos por segmento (§4.1) | Autorreconocimiento del visitante |
| El camino (preview) | 4 pasos: Fundamentos → Prompting → Crear y automatizar → Proyecto + Demo Day | Demuestra método "paso a paso" |
| Resultado | Perfil del egresado (6 puntos, §5.2) | Promesa concreta |
| Precio resumido | S/ 550 general · S/ 450 escolar · demo gratis + CTA | Filtro de precio temprano |
| CTA final | Reserva de demo gratuita (cupo 12) | Conversión |

### 3.2 Programa — `/programa`
| Bloque | Contenido |
|---|---|
| Hero | "8 semanas. 24 sesiones. Un proyecto tuyo." |
| Ficha del programa | Tabla §5.1 (duración, frecuencia, grupo, certificado, portafolio) |
| Temario | 8 tarjetas/semanas (tabla §5.3) con anclas `#semana-1` … `#semana-8` |
| Metodología | Estructura de sesión 120 min (tabla §5.4) + ABP + gamificación ligera |
| Evaluación | Pesos (proyecto 60% / asistencia 20% / portafolio 20%), aprobación (§5.5) |
| Certificado | Aviso destacado: **sin validez oficial MINEDU** (§5.7) |
| CTA | Reservar demo / Inscribirme |

### 3.3 Precios — `/precios`
| Bloque | Contenido |
|---|---|
| Hero | "Una sola tabla de precios. Sin sorpresas." |
| Tarifas | Tabla única §6.1 (general, escolar, cuotas, demo gratis, 1 a 1) |
| Lanzamiento | S/ 500 / S/ 400 primeras 10 matrículas (§11.3) |
| Descuentos | Tabla §6.2 con regla "máximo 2 acumulables" |
| Devoluciones | Tabla §7.5 |
| Nota legal | Precios con IGV incluido · certificado sin validez oficial |
| CTA | Inscribirme |

### 3.4 Inscripción — `/inscripcion`
| Bloque | Contenido |
|---|---|
| Hero | "Reserva tu plaza o tu clase demo gratuita" |
| Requisitos | §4.2 (laptop propia, conocimientos básicos, compromiso, autorización de apoderado) |
| Formulario | Nombre, WhatsApp, correo, segmento (escolar/universitario/general), interés (demo/programa), mensaje, consentimiento de datos → **genera mensaje de WhatsApp** |
| Qué pasa después | 3 pasos: te contactamos → asistes a la demo → te matriculas |
| Aviso | Menores de 18 requieren autorización del apoderado |

### 3.5 Preguntas frecuentes — `/preguntas-frecuentes`
Acordeón accesible (`<details>`/`<summary>`), ~12 preguntas:
certificado, laptop, edad mínima, herramientas gratuitas, horarios, ubicación, faltas, devoluciones, cupos, conocimientos previos, qué pasa si cambio de ciclo, datos de menores.

### 3.6 Sobre RUWAY — `/sobre`
Identidad ("Ruway" = camino en quechua), misión, visión, propuesta de valor y diferenciadores (§2.2–2.6), sede y horarios, compromiso legal (§10).

### 3.7 Privacidad — `/privacidad`
Tratamiento de datos personales (Ley 29733, D.S. 016-2024-JUS), finalidad educativa/administrativa, sin cesión a terceros, derechos ARCO, contacto, uso de imagen separado y revocable (§10.4).

### 3.8 Términos — `/terminos`
Matrícula y precios con IGV, certificado sin validez oficial MINEDU, política de devoluciones y faltas (§5.6, §7.5), propiedad del proyecto del alumno, fuerza mayor, uso responsable de IA.

---

## 4. Flujo de conversión (mapeo al embudo §11.2)

```
Redes / Google Maps / volante
        │
        ▼
   [Inicio] ──► [Programa] ──► [Precios]        · Atracción / Interés
        │            │            │
        └────────────┴─────┬──────┘
                           ▼
                  [Inscripción: demo gratis]    · Decisión
                           │
                           ▼
                  WhatsApp del equipo RUWAY     · Matrícula (≥40% conversión demo→matrícula)
                           │
                           ▼
                  [FAQ] resuelve objeciones de padres antes del pago
```

Cada página incluye al menos un CTA hacia `/inscripcion`; el footer incluye WhatsApp directo en todas las páginas.

---

## 5. SEO local (soporte a §11.1 canal 1)

- Títulos con "Cajamarca" + "inteligencia artificial": *Curso de Inteligencia Artificial en Cajamarca | RUWAY Academy*.
- `sitemap.xml` + `robots.txt` + JSON-LD (`EducationalOrganization` + `Course` + `FAQPage`).
- Consistencia NAP (nombre, dirección, teléfono) con la ficha de Google Business Profile: **Jr. Los Geranios 250, Cajamarca**.
- Open Graph / Twitter Cards con el logo descriptor para compartir desde WhatsApp y TikTok.
