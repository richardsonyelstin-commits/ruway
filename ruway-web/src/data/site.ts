/**
 * DATOS DUROS DEL SITIO — ÚNICA FUENTE DE VERDAD
 * ---------------------------------------------------------------------------
 * Todo lo que aparece en el header, el footer, el formulario y los datos
 * estructurados de SEO sale de aquí. Cambiar un valor aquí lo cambia en todo
 * el sitio. NUNCA escribas el WhatsApp o el correo a mano en una página.
 *
 * Origen: confirmado por el responsable del proyecto (16/10/2026) +
 *         plan completo.md. Lo no confirmado se marca [POR DEFINIR].
 */

export const SITIO = {
  nombre: 'RUWAY ACADEMY',
  nombreCorto: 'RUWAY',
  descriptor: 'Escuela de IA · Cajamarca',
  url: 'https://academiaruway.com',
  dominio: 'academiaruway.com',

  contacto: {
    correo: 'ruway.edu.cax@gmail.com',
    whatsapp: {
      /** Formato para wa.me: código de país + número, sin símbolos */
      e164: '51930736214',
      /** Formato para mostrar en pantalla */
      visible: '+51 930 736 214',
      /** Formato local, para los mensajes y el formulario */
      local: '930 736 214',
    },
  },

  sede: {
    calle: 'Jr. Los Geranios 250',
    distrito: 'Cajamarca',
    provincia: 'Cajamarca',
    region: 'Cajamarca',
    pais: 'Perú',
    paisCodigo: 'PE',
    /** ⏳ [POR DEFINIR] horario de atención presencial */
    horarioAtencion: '[POR DEFINIR]',
  },

  ciclo1: {
    /** ISO 8601 — se usa en los datos estructurados (Course.startDate) */
    inicio: '2026-10-27',
    inicioTexto: 'martes 27 de octubre',
    inicioTextoCompleto: 'martes 27 de octubre de 2026',
  },

  /** Valores pendientes. Se muestran como [POR DEFINIR] y nunca se inventan. */
  porDefinir: {
    ruc: '[POR DEFINIR]',
    redes: [] as string[],
  },
} as const;

/** Nombre, dirección y teléfono en formato consistente (SEO local) */
export const NAP = `${SITIO.nombre} · ${SITIO.sede.calle}, ${SITIO.sede.distrito}, ${SITIO.sede.pais}`;

/** Dirección de una línea, para el footer y los datos estructurados.
 *  No se repite la región: distrito, provincia y región se llaman «Cajamarca»,
 *  así que encadenarlos daría «Cajamarca, Cajamarca, Cajamarca, Perú». */
export const DIRECCION_UNA_LINEA = `${SITIO.sede.calle}, ${SITIO.sede.distrito}, ${SITIO.sede.pais}`;

/** URL de búsqueda en Google Maps a partir de la dirección (sin inventar datos) */
export const ENLACE_MAPA = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITIO.sede.calle}, ${SITIO.sede.distrito}, ${SITIO.sede.pais}`,
)}`;
