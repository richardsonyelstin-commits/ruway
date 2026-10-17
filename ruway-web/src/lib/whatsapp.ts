import { SITIO } from '../data/site';

/**
 * Construye el enlace de WhatsApp con un mensaje ya redactado.
 *
 * Decisión ADR-008: NO hay backend ni base de datos. El formulario y los CTA
 * componen el mensaje en el cliente y abren WhatsApp. Así no almacenamos
 * ningún dato personal —postura de mínima exposición frente a la Ley 29733,
 * especialmente al tratar con menores de edad.
 */
export function enlaceWhatsApp(mensaje: string): string {
  const numero = SITIO.contacto.whatsapp.e164;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensajes prefijados por contexto, para que la conversación arranque clara. */
export const MENSAJES = {
  demo: `Hola RUWAY 👋 Quiero reservar una clase demo gratuita del Programa de Inteligencia Artificial Aplicada (inicio ${SITIO.ciclo1.inicioTextoCompleto}). Mi nombre es:`,

  informacion: `Hola RUWAY 👋 Quiero información sobre el Programa de Inteligencia Artificial Aplicada. Mi nombre es:`,

  matricula: `Hola RUWAY 👋 Quiero matricularme en el Programa de Inteligencia Artificial Aplicada (inicio ${SITIO.ciclo1.inicioTextoCompleto}). Mi nombre es:`,

  taller: `Hola RUWAY 👋 Represento a una institución educativa y quiero solicitar un taller gratuito de inteligencia artificial para nuestros estudiantes. Mi nombre es:`,

  consulta: `Hola RUWAY 👋 Tengo una consulta. Mi nombre es:`,
} as const;

export type ClaveMensaje = keyof typeof MENSAJES;

/**
 * Enlaces ya compuestos.
 *
 * ADR-014: los llamados a acción de «demo gratuita» abren WhatsApp directamente.
 * Motivo: el plan (§6.1 y §11.2) dice que la demo «se reserva por WhatsApp», y
 * ADR-008 ya estableció que el formulario termina en WhatsApp de todos modos.
 * Ir directo quita un paso y funciona desde el primer día.
 */
export const ENLACE_DEMO = enlaceWhatsApp(MENSAJES.demo);
export const ENLACE_TALLER = enlaceWhatsApp(MENSAJES.taller);
export const ENLACE_CONSULTA = enlaceWhatsApp(MENSAJES.consulta);

