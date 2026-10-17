/**
 * PREGUNTAS FRECUENTES
 * ---------------------------------------------------------------------------
 * Fuente: `plan completo.md` (§2.3, §2.5, §4.1–§4.3, §5.1–§5.7, §6.1, §7.2,
 * §7.5, §8.1, §8.3, §8.4, §10.2). Las doce preguntas son las objeciones reales
 * de un padre o un alumno; ninguna respuesta añade un dato que no esté en el
 * plan.
 *
 * REGLA DE DATOS ESTRUCTURADOS
 *   Google exige que el contenido del `FAQPage` esté VISIBLE en la página. Por
 *   eso las respuestas se declaran una sola vez, aquí, y las dos salidas —la
 *   lista visible y el JSON-LD— se generan de esta misma fuente. El JSON-LD usa
 *   `sinEtiquetas()` para quitar el marcado en línea. Si se escribieran por
 *   separado, podrían divergir y la página perdería los resultados enriquecidos.
 */

export interface Pregunta {
  /** Se escribe como la buscaría una persona, no como un título de manual. */
  pregunta: string;
  /** Admite marcado en línea: `<strong>`, `<a>`. Nada de bloques. */
  respuesta: string;
}

export const PREGUNTAS: Pregunta[] = [
  {
    pregunta: 'No sé nada de IA ni de programación. ¿Puedo entrar?',
    respuesta:
      'Sí. El programa está pensado exactamente para eso: para personas sin conocimientos previos de inteligencia artificial. Lo único que se pide es manejo básico de computación —archivos, navegador y correo—. No se enseña a programar: se enseña a usar la IA con criterio.',
  },
  {
    pregunta: '¿Desde qué edad pueden estudiar?',
    respuesta:
      'Desde los 14 años. Escolares, universitarios y público general comparten el mismo grupo; lo que cambia es el proyecto que cada uno construye. Si el alumno es menor de 18 años, la matrícula incluye la autorización firmada del apoderado, y la cuenta de IA se crea y se gestiona con él.',
  },
  {
    pregunta: '¿Necesito llevar mi propia laptop?',
    respuesta:
      'Sí. Cada alumno trae su laptop con un navegador actualizado. No hay equipos en préstamo y así está escrito en el contrato de matrícula. El local tiene enchufes y regletas para diez laptops.',
  },
  {
    pregunta: '¿Cuánto dura el programa y en qué horario son las clases?',
    respuesta:
      'Ocho semanas, 24 sesiones y 48 horas en total. Las clases son martes, jueves y viernes de 4:00 pm a 6:00 pm. El calendario reserva dos sesiones de reposición para feriados o fallas de servicio.',
  },
  {
    pregunta: '¿Cuánto cuesta y puedo pagarlo en partes?',
    respuesta:
      'S/ 550 para público general y S/ 450 para escolares de 14 a 17 años, con IGV incluido, matrícula y certificado dentro del precio. Con la oferta de lanzamiento vigente —solo las primeras 10 matrículas— quedan en S/ 500 y S/ 400. También se puede pagar en dos cuotas: 2 × S/ 290 en general o 2 × S/ 240 en escolar. El detalle completo está en <a href="/precios">Precios y descuentos</a>.',
  },
  {
    pregunta: '¿El certificado tiene validez oficial?',
    respuesta:
      'No. Entregamos un <strong>Certificado de participación del Programa de IA Aplicada, 48 horas</strong>, con los contenidos y el proyecto final, pero <strong>no tiene validez oficial del MINEDU</strong>. Lo decimos siempre y también en la portada. Lo que sí acredita es lo que de verdad sirve: 48 horas de formación práctica y un proyecto que funciona y se presenta en público.',
  },
  {
    pregunta: '¿Cuántos alumnos hay por grupo?',
    respuesta:
      'Mínimo 7 y máximo 10. Es el número que permite acompañar de verdad cada proyecto. Si 15 días antes del inicio no hay 7 matrículas confirmadas, se pasa a un plan B de dos días por semana o se posterga el arranque dos semanas: <strong>no abrimos con menos de 7</strong>.',
  },
  {
    pregunta: '¿Qué pasa si falto a una clase?',
    respuesta:
      'No hay recuperación de clases. El alumno que falta accede al material en Notion, completa un mini-reto de nivelación y tiene derecho a una tutoría express de 15 minutos antes de la clase siguiente. Con más de dos faltas seguidas, presenta un avance adicional. Con más del 30 % de inasistencias no se emite el certificado, aunque puede seguir asistiendo.',
  },
  {
    pregunta: '¿Puedo pedir la devolución de mi dinero?',
    respuesta:
      'Sí, según el momento. Antes del inicio se devuelve el 100 % menos S/ 30 de gastos administrativos; después de la sesión 1, el 80 %; después de la sesión 2 ya no hay devolución, pero se puede postergar al ciclo siguiente una vez. Si la cancelación es nuestra, se devuelve el 100 % proporcional o se reprograma. La tabla completa está en <a href="/precios#devoluciones">Precios y descuentos</a>.',
  },
  {
    pregunta: '¿Con qué herramientas vamos a trabajar?',
    respuesta:
      'ChatGPT, Gemini y Copilot para el trabajo con IA; DeepSeek, Kimi K3 y MiniMax como alternativas con plan gratuito; Make, Zapier o n8n para automatizar sin escribir código; Notion para el material, el seguimiento y el portafolio; y Google Colab para una demostración técnica. <strong>Todas se usan en su plan gratuito.</strong> Si una herramienta cambia sus condiciones, se sustituye sin costo para el alumno.',
  },
  {
    pregunta: '¿Qué proyecto voy a tener al final?',
    respuesta:
      'Depende de tu perfil. Los escolares construyen un bot de estudio o un asistente de repaso; los universitarios, un portafolio profesional con asistente de investigación; los emprendedores y el público general, un asistente del negocio familiar o una automatización personal. El proyecto pesa el 60 % de la evaluación y se presenta en el Demo Day ante padres e invitados.',
  },
  {
    pregunta: '¿Enseñan a usar la IA para hacer trampa con las tareas?',
    respuesta:
      'Al contrario. La primera semana es de fundamentos y ética: sesgos, deepfakes, verificación de información y privacidad de datos. Además hay un reglamento interno de uso responsable que se firma en la matrícula. El objetivo es que el alumno sepa cuándo la IA le sirve, cuándo le miente y cuándo no debe usarla.',
  },
];

/**
 * Quita el marcado en línea para el JSON-LD.
 * Exportada porque cualquier dato estructurado que se construya a partir de
 * texto visible la necesita.
 */
export const sinEtiquetas = (html: string): string =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
