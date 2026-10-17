/**
 * CONTENIDO LEGAL
 * ---------------------------------------------------------------------------
 * Fuente: `plan completo.md` §4.2, §4.3, §4.4, §5.5, §5.6, §5.7, §6.1, §6.2,
 * §7.5, §8.4 y §10 (completo: checklist, documentos, tributario y datos
 * personales), más `01-sitemap-final.md` §4.1.
 *
 * POR QUÉ EN UN ARCHIVO DE DATOS Y NO EN LAS PÁGINAS
 *   Las tres páginas legales tienen la misma forma: secciones con un título y
 *   párrafos. Si cada una la escribiera a mano, con el tiempo se separarían en
 *   tipografía, en orden y en contenido. Aquí se declaran una vez y
 *   `ContenidoLegal.astro` las pinta igual en las tres.
 *
 * REGLAS QUE SE RESPETAN AL ESCRIBIR ESTO
 *   1. Nada se inventa. Lo que el plan no dice, no está.
 *   2. Lo que todavía no existe se escribe `[POR DEFINIR]`, y el componente
 *      `Pendiente` lo pinta como un hueco visible. Un dato pendiente tiene que
 *      verse como pendiente, nunca confundirse con contenido real.
 *   3. Se escribe para que lo entienda quien va a firmar, no para cubrirse las
 *      espaldas. Una política que nadie entiende no protege a nadie.
 */

export const ACTUALIZADO = '16 de octubre de 2026';

export const RESPONSABLE = {
  nombre: 'RUWAY ACADEMY',
  calle: 'Jr. Los Geranios 250',
  ciudad: 'Cajamarca, Perú',
  /** ⏳ Pendiente de tramitar con el RUC. Bloquea la publicación de esta página. */
  ruc: '[POR DEFINIR]',
  correo: 'ruway.edu.cax@gmail.com',
} as const;

export interface FilaLegal {
  etiqueta: string;
  valor: string;
}

export interface SeccionLegal {
  /** Ancla estable: permite enlazar a una cláusula concreta. */
  id: string;
  titulo: string;
  parrafos?: string[];
  items?: string[];
  filas?: FilaLegal[];
  /** Bloque final destacado de la sección. */
  nota?: string;
  /** Si es `true`, la nota se pinta como advertencia, no como comentario. */
  aviso?: boolean;
}

/* ============================================================================
   POLÍTICA DE PRIVACIDAD — /privacidad
   §10.4 y §4.4 · Ley 29733
   ========================================================================= */

export const SECCIONES_PRIVACIDAD: SeccionLegal[] = [
  {
    id: 'responsable',
    titulo: 'Quién es el responsable de tus datos',
    parrafos: [
      'El responsable del tratamiento de tus datos personales es RUWAY ACADEMY, con domicilio en la dirección que figura abajo y correo de contacto en la línea siguiente. Es la misma persona con la que vas a tratar si escribes por WhatsApp o por correo.',
    ],
    filas: [
      { etiqueta: 'Responsable', valor: RESPONSABLE.nombre },
      { etiqueta: 'Domicilio', valor: `${RESPONSABLE.calle}, ${RESPONSABLE.ciudad}` },
      { etiqueta: 'RUC', valor: RESPONSABLE.ruc },
      { etiqueta: 'Correo', valor: RESPONSABLE.correo },
    ],
  },
  {
    id: 'finalidad',
    titulo: 'Para qué usamos tus datos',
    parrafos: [
      'Solo para dos cosas: lo educativo y lo administrativo. En concreto, para gestionar la matrícula, comunicarnos con el alumno y con su apoderado, emitir las boletas de venta electrónicas, llevar el seguimiento académico y el portafolio de cada alumno, y avisarte de las clases y del calendario.',
      'Tus datos no se ceden ni se venden a terceros, y no se usan para publicidad de otras empresas. Tampoco se usan para construir perfiles ni para tomar decisiones automatizadas sobre nadie.',
      'La base legal de este tratamiento es tu consentimiento, que se firma en la matrícula conforme a la Ley 29733 de Protección de Datos Personales. Puedes retirarlo en cualquier momento; hacerlo implica dejar de poder usar el servicio.',
    ],
  },
  {
    id: 'que-no-hacemos',
    titulo: 'Lo que no hacemos con los datos del aula',
    parrafos: [
      'Esto aplica a todos los alumnos, y de forma estricta a los menores de edad. Son reglas del reglamento interno, no recomendaciones.',
    ],
    items: [
      'No se suben datos personales, documentos de identidad ni imágenes de terceros a los modelos de inteligencia artificial.',
      'No se publica nada de un menor de edad —ni su nombre, ni su imagen, ni sus proyectos— sin el consentimiento firmado de su apoderado.',
      'No se piden documentos por WhatsApp ni por correo antes de la matrícula. Si alguien te los pide en nuestro nombre, no es nuestro.',
      'No se usa el trabajo de un alumno como material de marketing sin pedirlo antes y por escrito.',
    ],
    nota: 'Estas reglas forman parte del reglamento interno que se firma en la matrícula y se explican en la primera sesión.',
  },
  {
    id: 'menores',
    titulo: 'Menores de edad',
    parrafos: [
      'El programa admite alumnos desde los 14 años, así que una parte del alumnado es menor de edad y eso cambia lo que tenemos que hacer.',
      'Para matricular a un menor, el apoderado firma la autorización correspondiente. Las cuentas de inteligencia artificial de un menor de edad se crean y se gestionan con el apoderado, y esa constancia se firma también en la matrícula: no se abre una cuenta a nombre de un menor a sus espaldas.',
      'El uso de imagen de un menor es un consentimiento aparte, es obligatorio para menores, y el apoderado puede revocarlo cuando quiera. La revocación se atiende sin justificar el motivo.',
    ],
  },
  {
    id: 'banco-de-datos',
    titulo: 'Registro del banco de datos',
    parrafos: [
      'RUWAY ACADEMY registra su banco de datos personales ante la Autoridad Nacional de Protección de Datos Personales antes de la primera matrícula, conforme al reglamento vigente (D.S. 016-2024-JUS). El registro es gratuito.',
      'Si quieres verificar ese registro, escríbenos y te damos la constancia.',
    ],
  },
  {
    id: 'derechos',
    titulo: 'Tus derechos (acceso, rectificación, cancelación y oposición)',
    parrafos: [
      'Puedes pedirnos en cualquier momento que te digamos qué datos tuyos tenemos (acceso), que los corrijamos si están mal (rectificación), que los eliminemos cuando ya no sean necesarios (cancelación) y que dejemos de usarlos para un fin concreto (oposición).',
      'Para ejercerlos, escríbenos al correo o por WhatsApp indicando qué derecho quieres ejercer. Te respondemos en el plazo que establece la ley. Si el pedido lo hace el apoderado de un menor, se atiende igual y con prioridad.',
    ],
  },
  {
    id: 'seguridad',
    titulo: 'Seguridad y cuánto tiempo los guardamos',
    parrafos: [
      'Los datos se guardan solo mientras dure la relación educativa y el tiempo adicional que exija la normativa tributaria para sustentar las boletas emitidas. Pasado ese plazo, se eliminan.',
      'El acceso está restringido a quien gestiona la academia. El material del curso y el seguimiento viven en Notion, con acceso privado por alumno.',
    ],
  },
  {
    id: 'cambios',
    titulo: 'Cambios en esta política',
    parrafos: [
      `Última actualización: ${ACTUALIZADO}. Si esta política cambia, la fecha cambia con ella y el cambio se explica. No se modifican de forma retroactiva las condiciones con las que alguien se matriculó.`,
    ],
  },
];

/* ============================================================================
   TÉRMINOS Y CONDICIONES — /terminos
   §6.1, §6.2, §7.5, §5.5, §5.6, §5.7, §8.4, §10.2, §10.3, §2.5
   ========================================================================= */

export const SECCIONES_TERMINOS: SeccionLegal[] = [
  {
    id: 'objeto',
    titulo: 'Qué regula este documento',
    parrafos: [
      'Estas condiciones rigen la matrícula y la participación en el Programa de Inteligencia Artificial Aplicada de RUWAY ACADEMY, en su sede de Cajamarca. Se aceptan al firmar el contrato de matrícula.',
      'Están escritas para leerse antes de pagar. Lo que aquí dice el precio, el calendario y el certificado es lo mismo que dice el contrato: no hay una versión amable en la web y otra distinta en el papel.',
    ],
  },
  {
    id: 'matricula',
    titulo: 'Matrícula y requisitos',
    parrafos: [
      'Para matricularse hace falta cumplir estos requisitos. Se verifican antes de firmar, no después.',
    ],
    items: [
      'Laptop propia con un navegador actualizado. No hay equipos en préstamo, y así queda escrito en el contrato.',
      'Conocimientos básicos de computación: manejo de archivos, navegador y correo.',
      'Compromiso de asistencia y de avance del proyecto personal.',
      'Si el alumno es menor de 18 años, autorización firmada del apoderado.',
    ],
    nota: 'En la matrícula se firman seis documentos: el contrato, la autorización del apoderado cuando corresponde, el consentimiento de tratamiento de datos personales, el consentimiento de uso de imagen, la política de devoluciones y faltas, y el reglamento interno.',
  },
  {
    id: 'precios',
    titulo: 'Precios y pagos',
    filas: [
      { etiqueta: 'Programa completo (general)', valor: 'S/ 550' },
      { etiqueta: 'Programa completo (escolar, 14 a 17 años)', valor: 'S/ 450' },
      { etiqueta: 'Precio de lanzamiento, primeras 10 matrículas', valor: 'S/ 500 · S/ 400' },
      { etiqueta: 'Pago en dos cuotas', valor: '2 × S/ 290 · 2 × S/ 240' },
      { etiqueta: 'Clase demo', valor: 'Gratis' },
      { etiqueta: 'Clase personalizada 1 a 1', valor: 'S/ 80 por hora' },
    ],
    parrafos: [
      'Todos los precios están expresados con el Impuesto General a las Ventas incluido, y así se declaran en la web y en el contrato. No se añade ningún cargo por matrícula ni por certificado: van dentro del precio.',
      'Cada pago se sustenta con una boleta de venta electrónica. El pago único cubre las ocho semanas; la opción en dos cuotas se paga al inicio y en la semana 5, con vencimiento fijo.',
      'Los descuentos se acumulan como máximo de dos en dos. El descuento de lanzamiento ya está aplicado en el precio publicado y no se suma otra vez. Si crees que calificas a un descuento, hay que decirlo al matricularse: no se aplican de oficio.',
    ],
  },
  {
    id: 'grupo',
    titulo: 'Apertura del grupo y calendario',
    parrafos: [
      'El grupo se abre con un mínimo de 7 matrículas confirmadas y un máximo de 10 alumnos.',
      'Si 15 días antes de la fecha de inicio no se alcanzan las 7 matrículas, se activa una de estas dos salidas: un plan con dos días de clase por semana, o la postergación del inicio dos semanas. En cualquiera de los dos casos, quien lo prefiera puede pedir la devolución de su pago. No se abre un grupo con menos de 7 personas.',
      'El programa son 8 semanas continuas con 24 sesiones y 48 horas. El calendario reserva dos sesiones de reposición para feriados nacionales o locales, o para fallas de servicio; el calendario definitivo se entrega en la matrícula.',
    ],
  },
  {
    id: 'certificado',
    titulo: 'Certificado',
    parrafos: [
      'Se entrega un Certificado de participación del Programa de Inteligencia Artificial Aplicada, con las 48 horas y el proyecto final.',
    ],
    nota: 'El certificado no tiene validez oficial del MINEDU. No acredita un título ni una competencia reconocida por el Estado: acredita que el alumno completó 48 horas de formación práctica y presentó un proyecto funcionando. Se comunica así en todas partes, también en la portada.',
    aviso: true,
  },
  {
    id: 'asistencia',
    titulo: 'Asistencia y faltas',
    parrafos: [
      'La asistencia cuenta para la evaluación: es el 20 % de la nota, junto con la participación. Para que el certificado se emita hace falta un 80 % de asistencia, presentar el proyecto en el Demo Day y tener el portafolio completo.',
      'No hay recuperación de clases. El mecanismo compensatorio es este:',
    ],
    items: [
      'El alumno que falta accede al material en Notion y completa un mini-reto de nivelación.',
      'Tiene derecho a una tutoría express de 15 minutos antes de la clase siguiente.',
      'Con más de dos faltas seguidas, presenta un avance adicional del proyecto.',
      'Con más del 30 % de inasistencias no se emite el certificado, aunque puede seguir asistiendo.',
    ],
    nota: 'La autoevaluación y la coevaluación se aplican, pero no pesan en la nota: son formativas.',
  },
  {
    id: 'devoluciones',
    titulo: 'Devoluciones',
    parrafos: [
      'Esta es la tabla completa. Se aplica tal como está escrita, también cuando la respuesta es que no corresponde devolución.',
    ],
    filas: [
      { etiqueta: 'Antes del inicio del programa', valor: 'Devolución del 100 % menos S/ 30 de gastos administrativos.' },
      { etiqueta: 'Después de la sesión 1', valor: 'Devolución del 80 %.' },
      { etiqueta: 'Después de la sesión 2', valor: 'Sin devolución; se puede postergar al ciclo siguiente una sola vez.' },
      { etiqueta: 'Retiro voluntario a mitad del programa', valor: 'Sin devolución del periodo en curso.' },
      { etiqueta: 'Cancelación por parte de RUWAY ACADEMY', valor: 'Devolución del 100 % proporcional o reprogramación, a elección del alumno.' },
      { etiqueta: 'Inasistencia', valor: 'Sin devolución.' },
    ],
  },
  {
    id: 'proyecto',
    titulo: 'Tu proyecto es tuyo',
    parrafos: [
      'El proyecto que cada alumno construye durante el programa le pertenece. RUWAY ACADEMY no reclama ningún derecho sobre él, ni sobre el portafolio del alumno, ni sobre el código, los textos o los datos que haya usado.',
      'Si en algún momento queremos mostrar un proyecto como ejemplo —en una publicación, en un taller o en el Demo Day—, se pide permiso antes y por escrito. En el caso de un menor de edad, el permiso lo da su apoderado.',
    ],
  },
  {
    id: 'convivencia',
    titulo: 'Reglamento interno',
    parrafos: [
      'Se firma en la matrícula y se explica en la primera sesión. Cubre tres cosas: el uso responsable de la inteligencia artificial, la convivencia entre compañeros y la seguridad en el local.',
      'En cuanto al uso de la IA, la regla central es que la herramienta no sustituye el criterio: se enseña cuándo sirve, cuándo se equivoca y cuándo no hay que usarla. En cuanto a los datos, queda prohibido subir a los modelos datos personales, documentos de identidad o imágenes de terceros.',
    ],
  },
  {
    id: 'fuerza-mayor',
    titulo: 'Fuerza mayor',
    parrafos: [
      'Si un feriado, una falla de servicio —de internet o eléctrica— o cualquier causa ajena a las dos partes obliga a suspender una sesión, se usa una de las dos sesiones de reposición ya reservadas en el calendario. Si tampoco fuera posible, la sesión se reprograma dentro de la misma semana.',
      'Si la causa impidiera continuar el programa de forma definitiva, se devuelve la parte proporcional de lo no dictado, sin discusión.',
    ],
  },
  {
    id: 'ley',
    titulo: 'Ley aplicable',
    parrafos: [
      'Estas condiciones se rigen por la legislación peruana. Cualquier controversia se resuelve primero conversando: escríbenos antes de dar cualquier otro paso y te respondemos.',
    ],
  },
];

/* ============================================================================
   POLÍTICA DE COOKIES — /cookies
   ADR-010 · §3.4 del plan (medición) y Ley 29733
   ========================================================================= */

export const SECCIONES_COOKIES: SeccionLegal[] = [
  {
    id: 'que-son',
    titulo: 'Qué son las cookies',
    parrafos: [
      'Una cookie es un archivo pequeño que un sitio web guarda en tu navegador. Algunas son necesarias para que el sitio funcione; la mayoría de las que te encuentras por ahí sirven para seguirte entre páginas y entre sitios, y construir un perfil publicitario.',
    ],
  },
  {
    id: 'las-que-usamos',
    titulo: 'Las que usa este sitio: ninguna',
    parrafos: [
      'Este sitio no instala cookies: ni propias, ni de terceros, ni de analítica, ni de publicidad. Por eso no vas a ver un banner pidiéndote que aceptes nada. No es una omisión: no hay nada que consentir, y un aviso que pide permiso para algo que no ocurre solo sirve para que la gente deje de leer los avisos.',
      'La decisión es deliberada. Tratar con datos de menores de edad exige la mínima exposición posible, y la forma más segura de no filtrar un dato es no recogerlo. Es la misma razón por la que el formulario del sitio no envía nada a un servidor nuestro: compone un mensaje y abre WhatsApp.',
      'Hay tres cosas que tampoco hacemos, y conviene decirlas porque son las vías habituales por las que entran las cookies de terceros:',
    ],
    items: [
      'No incrustamos el mapa de Google. En /contacto hay un enlace que lo abre en tu aplicación, porque un mapa incrustado instala cookies de Google al cargar la página.',
      'No incrustamos vídeos de YouTube ni botones sociales. Si algún día se añade un vídeo, se cargará solo después de que lo pidas.',
      'No usamos tipografías servidas desde servidores de terceros. Las fuentes de este sitio se sirven desde el propio dominio.',
    ],
  },
  {
    id: 'almacenamiento-local',
    titulo: 'Lo único que guardamos en tu navegador',
    parrafos: [
      'Hay una excepción, y es tan pequeña que se puede explicar en una frase: si usas el botón de tema claro u oscuro del encabezado, el sitio guarda tu elección en el almacenamiento local de tu navegador bajo la clave ruway-tema.',
      'Eso no es una cookie. No viaja a ningún servidor, no se comparte con nadie y no permite identificarte. Si no tocas el botón, el sitio se limita a respetar la preferencia de tema de tu sistema operativo. Puedes borrarlo vaciando los datos del sitio en tu navegador, y lo único que pasa es que el tema vuelve a seguir a tu sistema.',
    ],
  },
  {
    id: 'medicion',
    titulo: 'Cómo medimos sin cookies',
    parrafos: [
      'Un sitio sin ninguna medición no sabe si sirve. La medición se hace con una analítica que no usa cookies ni identificadores persistentes: cuenta visitas y páginas vistas de forma agregada, sin reconocer a nadie entre sesiones y sin seguir a nadie por otros sitios.',
      'En la práctica, esto significa que podemos saber que una página se visitó y no podemos saber quién la visitó. Es exactamente lo que necesitamos y nada más.',
    ],
  },
  {
    id: 'terceros',
    titulo: 'Qué pasa cuando sales del sitio',
    parrafos: [
      'Todas las conversaciones del sitio llevan a WhatsApp, porque es donde atendemos. Al pulsar un botón de WhatsApp sales de esta web y entras a WhatsApp, que tiene sus propias políticas sobre los datos que trata. Ahí ya no aplica lo que dice esta página.',
      'Lo mismo ocurre con el enlace a Google Maps y con el enlace de correo: son aplicaciones de otras empresas y sus condiciones son suyas. Nosotros solo ponemos el enlace.',
    ],
  },
  {
    id: 'base-legal',
    titulo: 'Base legal',
    parrafos: [
      'El marco aplicable es la Ley 29733 de Protección de Datos Personales y su reglamento. En el Perú no existe todavía una norma específica sobre cookies equivalente a la europea, pero los identificadores de seguimiento se consideran datos personales cuando permiten identificar a una persona, de modo que la ley sí alcanza este asunto.',
      'Como este sitio no instala cookies ni identificadores de seguimiento, no hay tratamiento de datos personales por esa vía y no hay nada que consentir. El detalle de cómo tratamos los datos que sí nos das —al matricularte o al escribirnos— está en la política de privacidad.',
    ],
  },
  {
    id: 'cambios',
    titulo: 'Si esto cambia',
    parrafos: [
      `Última actualización: ${ACTUALIZADO}. Si algún día se añade una herramienta que instale cookies, esta página lo dirá con su nombre, se pedirá consentimiento antes de instalarlas y hasta entonces no se cargarán. Mientras diga que no usamos cookies, es porque no usamos ninguna.`,
    ],
  },
];
