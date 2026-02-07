/**
 * Disclaimer Legal Institucional - Constantes
 * 
 * VERSIÓN 1.0 - DEFINITIVA E INALTERABLE
 * 
 * Este archivo contiene los textos oficiales del disclaimer.
 * NO MODIFICAR sin autorización expresa.
 */

export const DISCLAIMER_VERSION = '1.0'

/**
 * Texto completo para pantalla de aceptación
 */
export const DISCLAIMER_COMPLETO = {
    titulo: 'AVISO LEGAL OBLIGATORIO',
    introduccion: 'Alcance Legal es un sistema de inteligencia jurídica especializado en criterios jurisprudenciales del derecho civil argentino.',

    permite: [
        'Consultar criterios de viabilidad basados en jurisprudencia pública',
        'Identificar elementos constitutivos de responsabilidad civil',
        'Detectar riesgos procesales antes de iniciar acciones',
        'Orientar el análisis preliminar de situaciones civiles',
        'Evaluar la presencia de causales de justificación o eximentes',
        'Generar reportes estructurados con fundamentos normativos'
    ],

    propositoPositivo: 'Su función es brindar un insumo técnico de calidad para profesionales del derecho, optimizando la investigación jurisprudencial y reduciendo tiempos de análisis.',

    noConstituye: [
        'Asesoramiento legal profesional',
        'Patrocinio letrado',
        'Dictamen jurídico vinculante',
        'Análisis integral de casos concretos',
        'Estrategia procesal',
        'Estimación de montos indemnizatorios'
    ],

    noReemplaza: [
        'La consulta con abogados matriculados',
        'El criterio profesional del letrado actuante',
        'El análisis particular de cada situación'
    ],

    reconocimientos: [
        'Los criterios presentados son de carácter general y orientativo',
        'Toda decisión jurídica requiere intervención profesional calificada',
        'El sistema opera sobre información pública y no accede a documentación del caso',
        'La responsabilidad por las decisiones adoptadas corresponde exclusivamente al usuario o al profesional interviniente',
        'Los criterios jurisprudenciales pueden modificarse por cambios normativos, doctrinarios o de interpretación judicial'
    ],

    exclusionResponsabilidad: 'El operador, desarrollador y proveedores del sistema no asumen responsabilidad alguna por el uso que se haga de la información proporcionada, ni por las decisiones adoptadas en base a ella.',

    jurisdiccion: 'República Argentina',
    alcance: 'Criterios jurisprudenciales públicos de aplicación general'
}

/**
 * Texto resumido para banner persistente
 */
export const DISCLAIMER_BANNER = '⚖️ Aviso: Este sistema brinda información orientativa basada en criterios jurisprudenciales generales. No constituye asesoramiento legal. Toda decisión requiere intervención profesional.'

/**
 * Texto para bloque en resultados
 */
export const DISCLAIMER_RESULTADOS = 'Este análisis es un insumo técnico basado en criterios generales de acceso público. No constituye consejo legal definitivo. La validación y decisión final corresponde exclusivamente al profesional actuante.'

/**
 * Advertencias obligatorias en cada respuesta
 */
export const ADVERTENCIAS_OBLIGATORIAS = [
    'Este análisis NO constituye opinión legal ni consejo profesional.',
    'La evaluación de viabilidad es orientativa y probabilística.',
    'Los criterios citados son de carácter general. Verificar vigencia ante cambios normativos.',
    'La precisión depende de la completitud de la información proporcionada.',
    'Factores no declarados pueden alterar sustancialmente las conclusiones.',
    'La decisión final corresponde exclusivamente al profesional actuante.',
    'El operador del sistema no asume responsabilidad por el uso de esta información.'
]

/**
 * Texto obligatorio que el RAG debe incluir
 */
export const DISCLAIMER_RAG = 'Los criterios aplicados corresponden a jurisprudencia pública de alcance general. La evaluación particular del caso requiere intervención profesional.'

/**
 * Objeto para respuestas de API
 */
export const DISCLAIMER_API = {
    version: DISCLAIMER_VERSION,
    texto: DISCLAIMER_RESULTADOS,
    obligatorio: true,
    advertencias: ADVERTENCIAS_OBLIGATORIAS
}

/**
 * Clave de localStorage para persistencia de aceptación
 */
export const DISCLAIMER_STORAGE_KEY = 'alcance_legal_disclaimer_accepted'

/**
 * Verifica si el disclaimer fue aceptado (versión actual)
 */
export function isDisclaimerAccepted() {
    try {
        const stored = localStorage.getItem(DISCLAIMER_STORAGE_KEY)
        if (!stored) return false

        const { version } = JSON.parse(stored)
        return version === DISCLAIMER_VERSION
    } catch {
        return false
    }
}

/**
 * Guarda la aceptación del disclaimer
 */
export function acceptDisclaimer() {
    const data = {
        version: DISCLAIMER_VERSION,
        timestamp: new Date().toISOString()
    }
    localStorage.setItem(DISCLAIMER_STORAGE_KEY, JSON.stringify(data))
}
