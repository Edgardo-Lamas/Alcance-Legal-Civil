/**
 * Output Validation Module - Control Senior
 * 
 * Validación final del razonamiento jurídico antes de entregar al usuario.
 * Este módulo actúa como "control senior": puede bloquear respuestas riesgosas.
 * NO mejora el razonamiento, solo lo evalúa y controla.
 */

import type { ReasoningOutput, ContenidoReasoning } from '../reasoning/guidedCivilReasoning';

// ============================================
// CONFIGURACIÓN DE VALIDACIÓN
// ============================================

/**
 * Patrones que indican certeza excesiva (riesgoso en contexto jurídico)
 */
const CERTEZA_EXCESIVA_PATTERNS = [
    /sin duda alguna/i,
    /es absolutamente cierto/i,
    /indiscutiblemente/i,
    /no hay ninguna duda/i,
    /con total certeza/i,
    /garantizo que/i,
    /seguramente ganará/i,
    /100% seguro/i,
    /es imposible que/i,
    /nunca podrá/i,
    /siempre será/i
] as const;

/**
 * Patrones que indican extrapolación no fundada
 */
const EXTRAPOLACION_PATTERNS = [
    /en mi experiencia/i,
    /generalmente se considera/i,
    /la doctrina mayoritaria/i,
    /según la jurisprudencia/i,  // Sin cita específica
    /es de público conocimiento/i,
    /como todos saben/i,
    /en la práctica profesional/i,
    /normalmente los tribunales/i
] as const;

/**
 * Keywords de fueros excluidos (violación de scope)
 */
const FUERO_EXCLUIDO_KEYWORDS = [
    'penal', 'delito', 'crimen', 'prisión',
    'laboral', 'despido', 'LCT', 'indemnización laboral',
    'comercial', 'quiebra', 'concurso', 'sociedad anónima',
    'familia', 'divorcio', 'alimentos', 'tenencia', 'régimen de visitas'
] as const;

// ============================================
// TIPOS
// ============================================

export type ValidationStatus = 'approved' | 'limited' | 'rejected';

export interface ValidationResult {
    /** Estado final de la validación */
    status: ValidationStatus;
    /** Si la respuesta puede entregarse (approved o limited) */
    entregable: boolean;
    /** Razones del rechazo o limitación (si aplica) */
    razones: ValidationIssue[];
    /** Output original o ajustado */
    output: ReasoningOutput;
    /** Advertencias a incluir en la respuesta (para limited) */
    advertencias?: string[];
    /** Metadata de validación */
    metadata: ValidationMetadata;
}

export interface ValidationIssue {
    tipo: ValidationIssueType;
    severidad: 'warning' | 'error' | 'critical';
    descripcion: string;
    fragmento?: string;
}

export type ValidationIssueType =
    | 'CERTEZA_EXCESIVA'
    | 'EXTRAPOLACION_NO_FUNDADA'
    | 'VIOLACION_SCOPE'
    | 'CONTRADICCION_INTERNA'
    | 'CONCLUSION_SIN_FUNDAMENTO'
    | 'RIESGO_PROFESIONAL';

export interface ValidationMetadata {
    checksRealizados: number;
    issuesDetectados: number;
    timestamp: string;
}

// ============================================
// FUNCIONES DE DETECCIÓN
// ============================================

/**
 * Detecta patrones de certeza excesiva en el texto
 */
function detectarCertezaExcesiva(texto: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const pattern of CERTEZA_EXCESIVA_PATTERNS) {
        const match = texto.match(pattern);
        if (match) {
            issues.push({
                tipo: 'CERTEZA_EXCESIVA',
                severidad: 'error',
                descripcion: 'Se detectó lenguaje que simula certeza absoluta, inapropiado para análisis jurídico.',
                fragmento: match[0]
            });
        }
    }

    return issues;
}

/**
 * Detecta extrapolaciones no fundadas en el texto
 */
function detectarExtrapolaciones(texto: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const pattern of EXTRAPOLACION_PATTERNS) {
        const match = texto.match(pattern);
        if (match) {
            issues.push({
                tipo: 'EXTRAPOLACION_NO_FUNDADA',
                severidad: 'warning',
                descripcion: 'Se detectó referencia a fuentes no proporcionadas en el contexto.',
                fragmento: match[0]
            });
        }
    }

    return issues;
}

/**
 * Detecta violaciones de scope (menciones a fueros excluidos)
 */
function detectarViolacionScope(texto: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const textoLower = texto.toLowerCase();

    for (const keyword of FUERO_EXCLUIDO_KEYWORDS) {
        if (textoLower.includes(keyword.toLowerCase())) {
            issues.push({
                tipo: 'VIOLACION_SCOPE',
                severidad: 'critical',
                descripcion: `Se detectó mención a materia fuera del scope Civil: "${keyword}"`,
                fragmento: keyword
            });
        }
    }

    return issues;
}

/**
 * Detecta contradicciones internas entre secciones
 */
function detectarContradicciones(contenido: ContenidoReasoning): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Detectar si la conclusión contradice el análisis de riesgos
    const conclusionPositiva = /viable|favorable|procede|corresponde/i.test(contenido.conclusion);
    const riesgosGraves = /alto riesgo|muy riesgoso|desaconseja|improcedente/i.test(contenido.riesgos);

    if (conclusionPositiva && riesgosGraves) {
        issues.push({
            tipo: 'CONTRADICCION_INTERNA',
            severidad: 'error',
            descripcion: 'La conclusión favorable contradice los riesgos graves identificados.'
        });
    }

    // Detectar conclusión sin encuadre normativo
    const tieneEncuadre = contenido.encuadre.length > 50 && /art\.|artículo|código/i.test(contenido.encuadre);
    const tieneConclusionFuerte = /debe|corresponde|procede/i.test(contenido.conclusion);

    if (tieneConclusionFuerte && !tieneEncuadre) {
        issues.push({
            tipo: 'CONCLUSION_SIN_FUNDAMENTO',
            severidad: 'error',
            descripcion: 'La conclusión emite un juicio fuerte sin encuadre normativo previo.'
        });
    }

    return issues;
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

/**
 * Valida el output del razonamiento jurídico antes de entregar.
 * 
 * Criterios de validación:
 * 1. Sin certeza excesiva → evita comprometer al profesional
 * 2. Sin extrapolaciones → solo fuentes proporcionadas
 * 3. Scope Civil → no mezclar fueros
 * 4. Coherencia interna → conclusión consistente con análisis
 * 
 * @param reasoningOutput - Output del módulo de razonamiento LIS
 * @returns Resultado de validación con status y output ajustado si aplica
 */
export function validateCivilOutput(reasoningOutput: ReasoningOutput): ValidationResult {
    const timestamp = new Date().toISOString();
    const allIssues: ValidationIssue[] = [];

    // Concatenar todo el contenido para análisis
    const textoCompleto = Object.values(reasoningOutput.contenido).join(' ');

    // 1. Detectar certeza excesiva
    allIssues.push(...detectarCertezaExcesiva(textoCompleto));

    // 2. Detectar extrapolaciones
    allIssues.push(...detectarExtrapolaciones(textoCompleto));

    // 3. Detectar violaciones de scope
    allIssues.push(...detectarViolacionScope(textoCompleto));

    // 4. Detectar contradicciones internas
    allIssues.push(...detectarContradicciones(reasoningOutput.contenido));

    // Determinar status basándose en severidad de issues
    const status = determinarStatus(allIssues);
    const advertencias = generarAdvertencias(allIssues, status);

    return {
        status,
        entregable: status !== 'rejected',
        razones: allIssues,
        output: reasoningOutput,
        advertencias: status === 'limited' ? advertencias : undefined,
        metadata: {
            checksRealizados: 4,
            issuesDetectados: allIssues.length,
            timestamp
        }
    };
}

/**
 * Determina el status final basándose en los issues detectados
 */
function determinarStatus(issues: ValidationIssue[]): ValidationStatus {
    const hasCritical = issues.some(i => i.severidad === 'critical');
    const errorCount = issues.filter(i => i.severidad === 'error').length;
    const warningCount = issues.filter(i => i.severidad === 'warning').length;

    // Critical → rechazo inmediato
    if (hasCritical) {
        return 'rejected';
    }

    // Múltiples errores → rechazo
    if (errorCount >= 2) {
        return 'rejected';
    }

    // Un error o warnings → limitado con advertencias
    if (errorCount === 1 || warningCount >= 2) {
        return 'limited';
    }

    // Pocos o ningún issue menor → aprobado
    return 'approved';
}

/**
 * Genera advertencias para incluir en respuestas limitadas
 */
function generarAdvertencias(issues: ValidationIssue[], status: ValidationStatus): string[] {
    if (status === 'approved') return [];

    const advertencias: string[] = [];

    if (issues.some(i => i.tipo === 'CERTEZA_EXCESIVA')) {
        advertencias.push(
            'El análisis expresa niveles de certeza que deben interpretarse con cautela profesional.'
        );
    }

    if (issues.some(i => i.tipo === 'EXTRAPOLACION_NO_FUNDADA')) {
        advertencias.push(
            'Algunas afirmaciones hacen referencia a fuentes no explícitamente proporcionadas.'
        );
    }

    if (issues.some(i => i.tipo === 'CONTRADICCION_INTERNA')) {
        advertencias.push(
            'Se detectaron posibles tensiones entre el análisis y la conclusión que requieren revisión profesional.'
        );
    }

    return advertencias;
}

// ============================================
// FUNCIÓN DE RECHAZO ESTRUCTURADO
// ============================================

/**
 * Genera un rechazo estructurado y explicable
 */
export function generarRechazoFundado(result: ValidationResult): {
    mensaje: string;
    detalles: string[];
    recomendacion: string;
} {
    const criticos = result.razones.filter(r => r.severidad === 'critical');
    const errores = result.razones.filter(r => r.severidad === 'error');

    const detalles = [
        ...criticos.map(c => `[CRÍTICO] ${c.descripcion}`),
        ...errores.map(e => `[ERROR] ${e.descripcion}`)
    ];

    return {
        mensaje: 'El análisis no puede ser entregado por no superar los controles de calidad profesional.',
        detalles,
        recomendacion:
            'Se recomienda reformular la consulta con mayor precisión o ' +
            'limitar el alcance a aspectos estrictamente civiles.'
    };
}

// ============================================
// EXPORTS PARA TESTING
// ============================================

export const _internals = {
    detectarCertezaExcesiva,
    detectarExtrapolaciones,
    detectarViolacionScope,
    detectarContradicciones,
    determinarStatus,
    generarAdvertencias,
    CERTEZA_EXCESIVA_PATTERNS,
    EXTRAPOLACION_PATTERNS,
    FUERO_EXCLUIDO_KEYWORDS
};
