/**
 * CONTENIDO DEL PROGRAMA
 * ---------------------------------------------------------------------------
 * Fuente: `plan completo.md` §2.5, §2.6, §4.1, §5.1, §5.2, §5.3, §5.4, §8.1, §8.3
 * y `01-sitemap-final.md` §5 (estructura de la Home).
 *
 * REGLA: nada de esto se inventa. Cada frase proviene de uno de esos dos
 * documentos. Si falta un dato, se escribe [POR DEFINIR] y se avisa al
 * responsable; nunca se rellena con una suposición.
 */

import type { NombreIcono } from '../lib/iconos';

/* ============================================================================
   IDENTIDAD DEL PROGRAMA
   ========================================================================= */

export const PROGRAMA = {
  nombre: 'Programa de Inteligencia Artificial Aplicada',
  nombreCorto: 'Programa de IA Aplicada',
  eslogan: 'Tu camino a la inteligencia artificial, paso a paso.',
  /** §2.5 — el resumen que va en el hero */
  resumen:
    'Academia presencial en Cajamarca para personas sin conocimientos previos de IA. Grupos pequeños, proyectos reales y acompañamiento paso a paso.',
} as const;

/* ============================================================================
   BARRA DE DATOS  (Home, bloque 2)
   §5.1 — datos duros de la ficha del programa
   ========================================================================= */

export interface Dato {
  etiqueta: string;
  valor: string;
}

export const BARRA_DATOS: Dato[] = [
  { etiqueta: 'Duración', valor: '8 semanas' },
  { etiqueta: 'Sesiones', valor: '24' },
  { etiqueta: 'Horas totales', valor: '48 h' },
  { etiqueta: 'Grupo', valor: '7 a 10 alumnos' },
  { etiqueta: 'Desde', valor: '14 años' },
];

/* ============================================================================
   PROPUESTA DE VALOR  (Home, bloque 3)
   §2.5, §2.6 — por qué esta academia y no un curso online
   ========================================================================= */

export interface TarjetaValor {
  icono: NombreIcono;
  titulo: string;
  texto: string;
}

export const PROPUESTA_VALOR: TarjetaValor[] = [
  {
    icono: 'mapa',
    titulo: 'Presencial, en Cajamarca',
    texto:
      'Nos vemos en persona. Frente a los cursos online, aquí gana la cercanía, el acompañamiento directo y resultados que se pueden verificar.',
  },
  {
    icono: 'usuarios',
    titulo: 'Grupos de 7 a 10',
    texto:
      'Grupo pequeño de verdad: mínimo 7 y máximo 10 alumnos. Acompañamiento real, no un webinar.',
  },
  {
    icono: 'bloques',
    titulo: 'Proyectos reales',
    texto:
      'La metodología es aprendizaje basado en proyectos: cada alumno sale con algo hecho y funcionando.',
  },
  {
    icono: 'cuadricula',
    titulo: 'Herramientas vigentes',
    texto:
      'ChatGPT, Gemini, Copilot, Make/Zapier y Notion. Todo con planes gratuitos: si una herramienta cambia sus condiciones, se sustituye sin costo para el alumno.',
  },
];

/* ============================================================================
   PARA QUIÉN  (Home, bloque 4)
   §4.1 — un solo grupo, tres perfiles de proyecto
   ========================================================================= */

export interface Perfil {
  perfil: string;
  rango: string;
  necesidad: string;
  proyecto: string;
}

export const PARA_QUIEN: Perfil[] = [
  {
    perfil: 'Escolares',
    rango: '14 a 17 años',
    necesidad: 'Estudiar mejor, tareas, exposiciones y orientación.',
    proyecto: 'Bot de estudio y asistente de repaso',
  },
  {
    perfil: 'Universitarios',
    rango: 'Pregrado y egresados',
    necesidad: 'Trabajos, investigación, portafolio y empleabilidad.',
    proyecto: 'Portafolio profesional y asistente de investigación',
  },
  {
    perfil: 'Público general',
    rango: 'Emprendedores y adultos',
    necesidad: 'Productividad, negocio propio y automatizar tareas.',
    proyecto: 'Asistente del negocio familiar o automatización personal',
  },
];

/* ============================================================================
   EL CAMINO  (Home, bloque 5)
   §5.3 — el temario de 8 semanas, condensado en 4 pasos
   El ancho del escalón (`avance`) dibuja el progreso: 25 · 50 · 75 · 100
   ========================================================================= */

export interface Paso {
  numero: string;
  titulo: string;
  semanas: string;
  detalle: string;
  avance: number;
}

export const CAMINO: Paso[] = [
  {
    numero: '01',
    titulo: 'Fundamentos',
    semanas: 'Semana 1',
    detalle:
      'Qué es la IA, cómo funciona, cuáles son sus límites y su ética. Sesgos, verificación y privacidad de datos.',
    avance: 25,
  },
  {
    numero: '02',
    titulo: 'Prompting',
    semanas: 'Semana 2',
    detalle:
      'Estructura de un buen prompt: rol, contexto, objetivo, formato y ejemplos. Construyes tu biblioteca personal.',
    avance: 50,
  },
  {
    numero: '03',
    titulo: 'Crear y automatizar',
    semanas: 'Semanas 3 a 6',
    detalle:
      'IA para productividad, creación sin programar, datos y decisiones, y automatización sin código.',
    avance: 75,
  },
  {
    numero: '04',
    titulo: 'Proyecto y Demo Day',
    semanas: 'Semanas 7 y 8',
    detalle:
      'Defines y desarrollas tu proyecto personal, armas tu portafolio y lo presentas en público.',
    avance: 100,
  },
];

/* ============================================================================
   HERRAMIENTAS  (Home, bloque 6 · la misma lista alimenta /programa)
   §8.3 y §5.2 — todas con plan gratuito.
   El sitemap nombraba cinco (ChatGPT, Gemini, Copilot, Make/Zapier, Notion).
   El responsable añadió DeepSeek, Kimi K3 y MiniMax y descartó «Hojas de
   cálculo»: es un TEMA de la semana 5 (ver TEMARIO), no una plataforma.
   Son ocho, así que la cuadrícula pasa a 4 × 2 sin celdas vacías.
   ========================================================================= */

export interface Herramienta {
  nombre: string;
  uso: string;
}

export const HERRAMIENTAS: Herramienta[] = [
  { nombre: 'ChatGPT', uso: 'Asistente de IA en clase' },
  { nombre: 'Gemini', uso: 'IA dentro de Google' },
  { nombre: 'Copilot', uso: 'IA dentro de Microsoft 365' },
  { nombre: 'DeepSeek', uso: 'Razonamiento paso a paso' },
  { nombre: 'Kimi K3', uso: 'Contexto largo: documentos y video' },
  { nombre: 'MiniMax', uso: 'Agentes que completan tareas por ti' },
  { nombre: 'Make / Zapier', uso: 'Automatización sin código' },
  { nombre: 'Notion', uso: 'Material, seguimiento y portafolio' },
];

/* ============================================================================
   RESULTADO DEL EGRESADO  (Home, bloque 7)
   §5.2 — los 6 puntos, tal como los define el plan
   ========================================================================= */

export const RESULTADO_EGRESADO: string[] = [
  'Comprende los fundamentos de la IA y sus límites.',
  'Distingue cuándo usar ChatGPT, Gemini o Copilot.',
  'Diseña prompts efectivos y su propia biblioteca de prompts.',
  'Usa IA para productividad: texto, correo, planificación y presentaciones.',
  'Crea sin programar —contenido, código asistido, sitios— y automatiza tareas con herramientas no-code.',
  'Desarrolla y presenta un proyecto personal potenciado por IA en su portafolio.',
];

/* ============================================================================
   SEDE Y HORARIO  (Home, bloque 9)
   §8.1 — local propio · §5.1 — frecuencia
   ========================================================================= */

export const SEDE = {
  calle: 'Jr. Los Geranios 250',
  ciudad: 'Cajamarca',
  pais: 'Perú',
  referencia: 'Local propio, con baños, iluminación y enchufes para 10 laptops.',
  horario: 'Martes, jueves y viernes',
  horarioDetalle: '4:00 pm – 6:00 pm',
  /** §4.2 — requisito de ingreso, hay que decirlo antes de la matrícula */
  requisitoLaptop: 'Necesitas tu propia laptop con un navegador actualizado.',
} as const;

/* ============================================================================
   CERTIFICADO  (Home, bloque 10)
   §5.7 — la transparencia es un diferenciador de marca, no un aviso legal
   ========================================================================= */

export const CERTIFICADO = {
  titulo: 'Certificado de participación',
  detalle: 'Programa de Inteligencia Artificial Aplicada · 48 horas',
  aclaracion:
    'No tiene validez oficial del MINEDU. Acredita las 48 horas de formación práctica y tu proyecto final.',
  motivo:
    'Lo decimos en la portada, no en la letra pequeña. Preferimos que decidas con la información completa.',
} as const;

/* ============================================================================
   FICHA DEL PROGRAMA  (/programa #ficha)
   §5.1 — la tabla de identificación del programa
   ========================================================================= */

export interface CampoFicha {
  campo: string;
  valor: string;
}

export const FICHA_PROGRAMA: CampoFicha[] = [
  { campo: 'Programa', valor: 'Inteligencia Artificial Aplicada' },
  { campo: 'Duración', valor: '8 semanas · 24 sesiones · 48 horas' },
  { campo: 'Frecuencia', valor: 'Martes, jueves y viernes, 4:00 pm – 6:00 pm' },
  { campo: 'Grupo', valor: 'Mínimo 7 · máximo 10 alumnos' },
  { campo: 'Modalidad', valor: 'Presencial, en local propio' },
  { campo: 'Desde', valor: '14 años, sin conocimientos previos de IA' },
  { campo: 'Portafolio', valor: 'Notion por defecto · GitHub opcional' },
  { campo: 'Certificado', valor: 'Incluido, sin validez oficial del MINEDU' },
];

/* ============================================================================
   TEMARIO  (/programa #temario)
   §5.3 — las 8 semanas, con el contenido principal de cada una
   ========================================================================= */

export interface Semana {
  numero: number;
  tema: string;
  contenido: string;
}

export const TEMARIO: Semana[] = [
  {
    numero: 1,
    tema: 'Fundamentos y ética',
    contenido:
      'Qué es la IA, tipos, modelos de lenguaje, límites y alucinaciones. Sesgos, deepfakes, verificación de información y privacidad de datos. Panorama de ChatGPT, Gemini y Copilot. Configuración del espacio de trabajo.',
  },
  {
    numero: 2,
    tema: 'Prompting efectivo',
    contenido:
      'Estructura de un prompt: rol, contexto, objetivo, formato y ejemplos. Zero-shot, few-shot y cadena de pensamiento. Construcción de una biblioteca de prompts personal.',
  },
  {
    numero: 3,
    tema: 'IA para productividad',
    contenido:
      'Textos, correo, calendario, notas y presentaciones. Gemini dentro de Google Workspace y Copilot dentro de Microsoft 365, con planes gratuitos o educativos.',
  },
  {
    numero: 4,
    tema: 'IA para crear sin programar',
    contenido:
      'Generación de contenido, código asistido, sitios y prototipos. Demostración opcional de Python en Google Colab, que se profundiza en el Nivel 2.',
  },
  {
    numero: 5,
    tema: 'Datos y decisiones con IA',
    contenido:
      'Hojas de cálculo más IA: análisis guiado, visualización e interpretación de datos reales, del propio alumno o del negocio de su familia.',
  },
  {
    numero: 6,
    tema: 'Automatización sin código',
    contenido:
      'Make, Zapier y n8n con planes gratuitos. Conexión con hojas de cálculo, correo y WhatsApp Business sin APIs de pago.',
  },
  {
    numero: 7,
    tema: 'Proyecto personal',
    contenido:
      'Definición del proyecto según el segmento, desarrollo guiado en formato coworking y retroalimentación entre pares. Se presenta también el Ciclo 2.',
  },
  {
    numero: 8,
    tema: 'Portafolio y Demo Day',
    contenido:
      'Armado del portafolio, ensayo de la presentación y Demo Day abierto a padres e invitados, con entrega de certificados y encuesta final.',
  },
];

/* ============================================================================
   METODOLOGÍA  (/programa #metodologia)
   §5.4
   ========================================================================= */

export const METODOLOGIA = {
  resumen:
    'Aprendizaje basado en proyectos, aula invertida y gamificación ligera. El material previo vive en Notion, así que la clase se usa para practicar, no para copiar apuntes.',
  pilares: [
    {
      nombre: 'Aprendizaje basado en proyectos',
      detalle:
        'Cada semana avanzas una parte de tu proyecto personal. No hay ejercicios de laboratorio sin destino: todo va al proyecto final.',
    },
    {
      nombre: 'Aula invertida',
      detalle:
        'El material de lectura está en Notion antes de la sesión. Así las dos horas de clase se dedican a practicar con acompañamiento.',
    },
    {
      nombre: 'Gamificación ligera',
      detalle:
        'Insignias por hitos de proyecto y un tablero de avance visible para el grupo. Nada de puntajes que compitan entre compañeros.',
    },
  ],
} as const;

/** §5.4 — cómo se reparten los 120 minutos de cada sesión */
export const ESTRUCTURA_SESION = [
  { momento: 'Activación', duracion: '15 min', actividad: 'Pregunta detonadora y repaso' },
  { momento: 'Teoría mínima', duracion: '20 min', actividad: 'Explicación directa y visual' },
  { momento: 'Práctica guiada', duracion: '30 min', actividad: 'El docente demuestra, el alumno replica' },
  { momento: 'Descanso', duracion: '10 min', actividad: 'Pausa obligatoria' },
  {
    momento: 'Práctica autónoma',
    duracion: '35 min',
    actividad: 'Avance de proyecto con acompañamiento',
  },
  { momento: 'Cierre', duracion: '10 min', actividad: 'Retroalimentación y objetivos de la sesión siguiente' },
] as const;

/* ============================================================================
   EVALUACIÓN  (/programa #evaluacion)
   §5.5
   ========================================================================= */

export const EVALUACION = [
  {
    componente: 'Proyecto personal',
    peso: '60 %',
    instrumento: 'Rúbrica de 4 criterios: funciona · es útil · usa IA con criterio · presentación',
  },
  {
    componente: 'Asistencia y participación',
    peso: '20 %',
    instrumento: 'Lista de control por sesión',
  },
  {
    componente: 'Portafolio final',
    peso: '20 %',
    instrumento: 'Completitud y orden',
  },
] as const;

export const APROBACION = {
  criterios: [
    'Asistencia igual o mayor al 80 %.',
    'Proyecto presentado en el Demo Day.',
    'Portafolio completo.',
  ],
  formativas: 'La autoevaluación y la coevaluación se aplican, pero no pesan: son formativas.',
} as const;

/** §5.6 — política de faltas */
export const POLITICA_FALTAS: string[] = [
  'No hay recuperación de clases.',
  'El alumno que falta accede al material en Notion y completa un mini-reto de nivelación.',
  'Tiene derecho a una tutoría express de 15 minutos antes de la clase siguiente.',
  'Con más de 2 faltas seguidas, presenta un avance adicional.',
  'Con más del 30 % de inasistencias no se emite el certificado, pero puede seguir asistiendo.',
];

/* ============================================================================
   REQUISITOS DE INGRESO  (/inscripcion #requisitos)
   §4.2 y §4.3
   ========================================================================= */

export const REQUISITOS_INGRESO: string[] = [
  'Laptop propia con un navegador actualizado.',
  'Conocimientos básicos de computación: manejo de archivos, navegador y correo.',
  'Compromiso de asistencia y de avance del proyecto.',
  'Si el alumno es menor de 18 años, autorización firmada del apoderado.',
];

export const NOTAS_REQUISITOS: string[] = [
  'No hay equipos en préstamo, y está escrito en el contrato de matrícula.',
  'No se separan los grupos por edad. Es un solo grupo con tres perfiles de proyecto y trabajo por parejas mixtas.',
  'Si es menor de edad, la cuenta de IA se crea y se gestiona con el apoderado, que firma una constancia en la matrícula.',
];

/* ============================================================================
   EQUIPO  (/sobre #equipo)
   §2.6 y §9
   ----------------------------------------------------------------------------
   ⚠️ SOLO LO PUBLICABLE.
   El §9 del plan es un documento interno: incluye tarifas por hora, comisiones
   y un rol «por asignar». Nada de eso sale a la web. Aquí va únicamente quién
   enseña y con qué experiencia.
   ========================================================================= */

export const EQUIPO = [
  {
    rol: 'Docente principal',
    quien: 'Fundador de RUWAY ACADEMY',
    detalle:
      'Con experiencia en inteligencia artificial, programación y docencia. Dicta las clases, prepara el material, evalúa y acompaña los proyectos.',
  },
  {
    rol: 'Apoyo en aula',
    quien: 'Se incorpora a partir del segundo grupo',
    detalle:
      'Cuando la academia abra un segundo grupo, se suma un asistente de clase para que la proporción de acompañamiento se mantenga.',
  },
] as const;

/* ============================================================================
   IDENTIDAD DE LA ACADEMIA  (/sobre #identidad)
   §2.1 a §2.4
   ========================================================================= */

export const IDENTIDAD = {
  significado:
    '«Ruway» significa camino en quechua. El nombre no es decorativo: es la promesa. Aquí nadie llega sabiendo y se va igual, y nadie recorre el camino solo.',
  eslogan: 'RUWAY: Tu camino a la inteligencia artificial, paso a paso.',
  mision:
    'Enseñar inteligencia artificial de forma presencial, práctica y personalizada a jóvenes y público general de Cajamarca, para que la apliquen en proyectos reales con criterio y ética.',
  vision:
    'Ser la academia referente de IA aplicada en Cajamarca, reconocida por formar personas capaces de usar la IA con criterio, ética y creatividad.',
} as const;

/* ============================================================================
   ENFOQUE  (/sobre #metodo)
   §2.6 — los diferenciadores, contados como principios
   ========================================================================= */

export interface Principio {
  titulo: string;
  texto: string;
}

export const ENFOQUE: Principio[] = [
  {
    titulo: 'Presencial, en Cajamarca',
    texto:
      'No competimos con los cursos online de Lima: competimos donde ellos no llegan. Presencialidad, cercanía y resultados que se pueden verificar en una mesa.',
  },
  {
    titulo: 'Uso instrumental de la tecnología',
    texto:
      'Formamos personas que usan la IA, la automatización y algo de Python demostrativo para resolver problemas. No formamos programadores: eso es otra carrera y otro programa.',
  },
  {
    titulo: 'Un paso detrás de ti, nunca delante',
    texto:
      'Grupos de 7 a 10 alumnos y trabajo por proyectos para poder acompañar de verdad. Un webinar de 300 personas no admite esto, y por eso no lo hacemos.',
  },
  {
    titulo: 'Local propio',
    texto:
      'Trabajamos en local propio. Eso sostiene precios accesibles y estabilidad: el ciclo no depende de que un alquiler se pague con las matrículas del mes.',
  },
];

/** §2.6 — lo que conviene decir en voz alta para no decepcionar a nadie */
export const NO_SOMOS: string[] = [
  'No somos un bootcamp de programación.',
  'No entregamos un certificado con validez oficial del MINEDU.',
  'No garantizamos un empleo al terminar.',
  'No prestamos equipos: cada alumno trabaja en su propia laptop.',
];
