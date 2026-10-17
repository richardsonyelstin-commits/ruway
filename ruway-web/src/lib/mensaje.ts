/**
 * COMPOSICIÓN DEL MENSAJE DE WHATSAPP
 * ---------------------------------------------------------------------------
 * ADR-008: no hay backend ni base de datos. El formulario NO envía nada a un
 * servidor: arma un texto en el propio dispositivo del visitante y abre
 * WhatsApp con ese texto ya escrito. Nada se guarda en ningún sitio.
 *
 * POR QUÉ AQUÍ Y NO DENTRO DEL COMPONENTE
 *   Este archivo lo usan los dos lados:
 *     · el navegador (`Formulario.astro`) para armar el mensaje al confirmar;
 *     · las comprobaciones del proyecto, que pueden verificar el texto sin
 *       abrir un navegador.
 *   Si el mensaje se escribiera dentro del componente, la única forma de
 *   revisarlo sería abriendo el sitio.
 *
 * ADR-022: el visitante REVISA el mensaje antes de que se abra WhatsApp
 * (WCAG 2.2 · 3.3.4, prevención de errores). Por eso la composición vive en una
 * función pura: se puede llamar para pintar la vista previa y otra vez al
 * confirmar, y el texto revisado es exactamente el texto que se envía.
 */
import { SITIO } from '../data/site';

export type Intencion = 'demo' | 'matricula';

/** Las dos únicas intenciones del formulario (ADR-004). */
export const INTENCIONES: { valor: Intencion; etiqueta: string; ayuda: string }[] = [
  {
    valor: 'demo',
    etiqueta: 'La clase demo gratuita',
    ayuda: 'Una hora presencial para conocer el método, el local y a quien dicta las clases.',
  },
  {
    valor: 'matricula',
    etiqueta: 'Matricularme en el Ciclo 1',
    ayuda: `Reservo una plaza del grupo que inicia el ${SITIO.ciclo1.inicioTextoCompleto}.`,
  },
];

/**
 * Lee el parámetro `?intencion=` de la URL.
 *
 * Devuelve `null` si no viene o si trae cualquier otra cosa: el formulario se
 * queda sin marcar y el visitante elige. Nunca se adivina una intención.
 */
export function intencionDe(valor: string | null | undefined): Intencion | null {
  return valor === 'demo' || valor === 'matricula' ? valor : null;
}

export interface DatosFormulario {
  intencion: Intencion;
  nombre: string;
  /** Ya normalizado a 9 dígitos, sin código de país. */
  whatsapp: string;
  correo?: string;
  perfil: string;
  mensaje?: string;
}

/** Primera línea del mensaje. Cambia según lo que el visitante vino a hacer. */
const APERTURAS: Record<Intencion, string> = {
  demo: 'Hola RUWAY 👋 Quiero reservar una clase demo gratuita del Programa de Inteligencia Artificial Aplicada.',
  matricula: `Hola RUWAY 👋 Quiero matricularme en el Programa de Inteligencia Artificial Aplicada (inicio ${SITIO.ciclo1.inicioTextoCompleto}).`,
};

/**
 * Arma el texto que se abre en WhatsApp.
 *
 * Formato: una línea por dato, sin viñetas. Se lee bien en la burbuja de
 * WhatsApp y, sobre todo, se puede revisar y corregir de un vistazo antes de
 * enviarlo (3.3.4). Los campos opcionales que quedan vacíos no se escriben:
 * nunca se envía «Correo: ».
 */
export function componerMensaje(datos: DatosFormulario): string {
  const lineas = [
    APERTURAS[datos.intencion],
    '',
    `Nombre: ${datos.nombre.trim()}`,
    `WhatsApp: ${formatearTelefono(datos.whatsapp)}`,
    `Perfil: ${datos.perfil}`,
  ];

  const correo = datos.correo?.trim();
  if (correo) lineas.push(`Correo: ${correo}`);

  const mensaje = datos.mensaje?.trim();
  if (mensaje) lineas.push('', `Mensaje: ${mensaje}`);

  return lineas.join('\n');
}

/**
 * Deja el teléfono en 9 dígitos.
 *
 * Acepta lo que la gente escribe de verdad: «+51 930 736 214», «930-736-214»,
 * «(051) 930736214». Si el resultado tiene 11 dígitos y empieza por 51, se
 * quita el código de país: quien escribió ya lo puso una vez.
 */
export function normalizarTelefono(entrada: string): string {
  let digitos = entrada.replace(/\D/g, '');
  if (digitos.length === 11 && digitos.startsWith('51')) digitos = digitos.slice(2);
  return digitos;
}

/** 930736214 → «930 736 214». Con otra longitud, devuelve lo que haya. */
export function formatearTelefono(entrada: string): string {
  const digitos = normalizarTelefono(entrada);
  if (digitos.length !== 9) return digitos;
  return `${digitos.slice(0, 3)} ${digitos.slice(3, 6)} ${digitos.slice(6)}`;
}
