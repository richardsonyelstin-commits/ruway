/**
 * DATOS ESTRUCTURADOS (JSON-LD)
 * ---------------------------------------------------------------------------
 * Todo nodo de schema.org se construye aquí, una sola vez.
 *
 * POR QUÉ CENTRALIZADO
 *   El sitemap aprobado (§10.1) pide `Course` en `/`, `/programa` y `/precios`.
 *   Si cada página lo escribiera a mano, en el primer ajuste de precio una
 *   diría S/ 500 y otra S/ 550, y Google vería dos cursos distintos. Aquí se
 *   construye de `src/data/`, que es donde vive el dato.
 *
 * NINGÚN NODO LLEVA `@context`
 *   Lo pone la plantilla que los agrupa en un `@graph`. Un nodo suelto con
 *   `@context` dentro de un `@graph` es un error de sintaxis frecuente.
 */
import { SITIO } from '../data/site';
import { PROGRAMA } from '../data/programa';
import { TRAMOS, soles } from '../data/precios';

/** Identificador único de la organización. Compartirlo unifica las entidades. */
export const ID_ORGANIZACION = `${SITIO.url}/#organizacion`;

/**
 * `Course` con una sola `CourseInstance`: el Ciclo 1 con fecha confirmada.
 *
 * ⚠️ No se declara `endDate`: el programa reserva dos sesiones de reposición
 * para feriados, así que la fecha de cierre todavía no es exacta. Declarar una
 * fecha inventada en datos estructurados es peor que no declararla.
 *
 * ⚠️ `educationalCredentialAwarded` dice EXPLÍCITAMENTE que el certificado no
 * tiene validez oficial del MINEDU (§5.7 y §10.1).
 */
export function jsonLdCurso() {
  return {
    '@type': 'Course',
    name: `${PROGRAMA.nombre} · ${SITIO.nombre}`,
    description:
      'Programa presencial de 8 semanas (24 sesiones, 48 horas) para aprender a usar la inteligencia artificial con criterio: fundamentos, prompting, productividad, creación sin programar, datos y automatización sin código, con un proyecto personal final.',
    inLanguage: 'es-PE',
    url: `${SITIO.url}/programa`,
    provider: { '@id': ID_ORGANIZACION },
    timeRequired: 'P8W',
    educationalCredentialAwarded:
      'Certificado de participación, 48 horas. No tiene validez oficial del MINEDU.',
    coursePrerequisites:
      'Laptop propia con navegador actualizado y conocimientos básicos de computación.',
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'onsite',
        courseWorkload: 'PT48H',
        startDate: SITIO.ciclo1.inicio,
        maximumAttendeeCapacity: 10,
        location: {
          '@type': 'Place',
          name: SITIO.nombre,
          address: {
            '@type': 'PostalAddress',
            streetAddress: SITIO.sede.calle,
            addressLocality: SITIO.sede.distrito,
            addressRegion: SITIO.sede.region,
            addressCountry: SITIO.sede.paisCodigo,
          },
        },
      },
    ],
    offers: TRAMOS.map((tramo) => ({
      '@type': 'Offer',
      name: tramo.etiqueta,
      category: tramo.publico,
      price: tramo.lanzamiento,
      priceCurrency: 'PEN',
      availability: 'https://schema.org/LimitedAvailability',
      url: `${SITIO.url}/precios`,
      description: `${tramo.etiqueta}: ${soles(tramo.lanzamiento)} en precio de lanzamiento (de ${soles(tramo.normal)}). Precio con IGV incluido, para las primeras 10 matrículas.`,
    })),
  };
}

/**
 * `LocalBusiness` para `/contacto` y `/sobre` (SEO local, §10.1).
 *
 * Comparte `@id` con la organización global, de modo que Google las lea como
 * una sola entidad y no como dos negocios distintos en la misma dirección.
 *
 * ⚠️ No se declaran `geo` ni `openingHours`: los dos siguen `[POR DEFINIR]`.
 * Omitirlos deja el nodo válido; rellenarlos con un texto de relleno lo
 * invalidaría y, peor, publicaría información falsa.
 */
export function jsonLdNegocioLocal() {
  return {
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    '@id': ID_ORGANIZACION,
    name: SITIO.nombre,
    url: SITIO.url,
    email: SITIO.contacto.correo,
    telephone: SITIO.contacto.whatsapp.visible,
    priceRange: 'S/ 400 – S/ 550',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITIO.sede.calle,
      addressLocality: SITIO.sede.distrito,
      addressRegion: SITIO.sede.region,
      addressCountry: SITIO.sede.paisCodigo,
    },
    areaServed: {
      '@type': 'City',
      name: SITIO.sede.distrito,
    },
  };
}

/** `FAQPage` a partir de las preguntas reales (§10.1). */
export function jsonLdPreguntas(preguntas: { pregunta: string; respuesta: string }[], limpiar: (html: string) => string) {
  return {
    '@type': 'FAQPage',
    mainEntity: preguntas.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: limpiar(p.respuesta),
      },
    })),
  };
}
