/**
 * Admissibility Check Module - Alcance Legal Civil
 * 
 * Valida que una consulta sea admisible ANTES de invocar RAG o LLM.
 * Actúa como "guardián" (gate) de la API.
 */

import {
    PROFILE_CIVIL,
    Fuero,
    ActoJuridico,
    isFueroExcluido
} from './profile';

// ============================================
// TIPOS DE INPUT/OUTPUT
// ============================================

export interface ConsultaInput {
    /** Texto de la consulta del usuario */
    texto: string;
    /** Fuero declarado por el usuario (opcional, se infiere si no se provee) */
    fueroDeclared?: Fuero;
    /** Tipo de acto jurídico solicitado */
    acto: ActoJuridico;
    /** Hechos del caso (opcional pero recomendado) */
    hechos?: string;
}

export interface AdmissibilityResult {
    /** Si la consulta es admisible */
    admitida: boolean;
    /** Código de resultado para logging/analytics */
    codigo: AdmissibilityCode;
    /** Fundamento del rechazo (solo si admitida = false) */
    fundamento?: string;
    /** Metadata adicional para debugging */
    metadata: {
        perfilUsado: string;
        fueroDetectado: Fuero | null;
        timestamp: string;
    };
}

export type AdmissibilityCode =
    | 'ADMITIDA'
    | 'RECHAZADA_FUERO_EXCLUIDO'
    | 'RECHAZADA_HECHOS_INSUFICIENTES'
    | 'RECHAZADA_CONSULTA_HIBRIDA'
    | 'RECHAZADA_ACTO_NO_ADMITIDO';

// ============================================
// KEYWORDS PARA DETECCIÓN DE FUEROS
// ============================================

const FUERO_KEYWORDS: Record<Fuero, readonly string[]> = {
    civil: [
        'contrato', 'daños', 'perjuicios', 'obligaciones', 'propiedad',
        'sucesión', 'herencia', 'locación', 'alquiler', 'responsabilidad civil',
        'usucapión', 'servidumbre', 'hipoteca', 'prenda', 'fianza',
        'incumplimiento contractual', 'resolución', 'rescisión', 'nulidad'
    ],
    comercial: [
        'sociedad', 'quiebra', 'concurso', 'cheque', 'pagaré', 'letra de cambio',
        'comerciante', 'empresa', 'accionista', 'directorio', 'SRL', 'SA',
        'fusión', 'escisión', 'transferencia de fondo de comercio'
    ],
    penal: [
        'delito', 'crimen', 'homicidio', 'robo', 'hurto', 'estafa',
        'prisión', 'cárcel', 'imputado', 'fiscal', 'querella criminal',
        'denuncia penal', 'sobreseimiento', 'condena'
    ],
    laboral: [
        'despido', 'indemnización laboral', 'trabajo', 'empleador', 'empleado',
        'sindicato', 'convenio colectivo', 'accidente de trabajo', 'ART',
        'LCT', 'relación de dependencia', 'aguinaldo', 'vacaciones'
    ],
    familia: [
        'divorcio', 'alimentos', 'tenencia', 'régimen de visitas', 'adopción',
        'filiación', 'patria potestad', 'guarda', 'tutela', 'curatela',
        'violencia familiar', 'compensación económica'
    ]
} as const;

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Detecta fueros mencionados en el texto de la consulta
 */
function detectarFueros(texto: string): Fuero[] {
    const textoLower = texto.toLowerCase();
    const fuerosDetectados: Fuero[] = [];

    for (const [fuero, keywords] of Object.entries(FUERO_KEYWORDS)) {
        const tieneKeyword = keywords.some(kw => textoLower.includes(kw.toLowerCase()));
        if (tieneKeyword) {
            fuerosDetectados.push(fuero as Fuero);
        }
    }

    return fuerosDetectados;
}

/**
 * Valida que existan hechos mínimos en la consulta
 */
function validarHechosMinimos(input: ConsultaInput): boolean {
    const textoCompleto = `${input.texto} ${input.hechos || ''}`.trim();

    // Criterios mínimos: al menos 20 caracteres y 3 palabras
    const palabras = textoCompleto.split(/\s+/).filter(p => p.length > 2);

    return textoCompleto.length >= 20 && palabras.length >= 3;
}

/**
 * Valida que el acto jurídico esté admitido
 */
function validarActoAdmitido(acto: ActoJuridico): boolean {
    return PROFILE_CIVIL.actosAdmitidos.includes(acto);
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

/**
 * Verifica la admisibilidad de una consulta.
 * 
 * Orden de validación:
 * 1. Acto jurídico admitido
 * 2. Hechos mínimos presentes
 * 3. Fuero corresponde al perfil
 * 4. No es consulta híbrida (múltiples fueros)
 * 
 * @param input - La consulta a validar
 * @returns Resultado estructurado de admisibilidad
 */
export function checkAdmissibility(input: ConsultaInput): AdmissibilityResult {
    const timestamp = new Date().toISOString();
    const fuerosDetectados = detectarFueros(input.texto);
    const fueroDetectado = fuerosDetectados.length === 1 ? fuerosDetectados[0] : null;

    const baseMetadata = {
        perfilUsado: PROFILE_CIVIL.nombre,
        fueroDetectado,
        timestamp
    };

    // 1. Validar acto admitido
    if (!validarActoAdmitido(input.acto)) {
        return {
            admitida: false,
            codigo: 'RECHAZADA_ACTO_NO_ADMITIDO',
            fundamento: `El acto "${input.acto}" no está admitido en este perfil.`,
            metadata: baseMetadata
        };
    }

    // 2. Validar hechos mínimos
    if (!validarHechosMinimos(input)) {
        return {
            admitida: false,
            codigo: 'RECHAZADA_HECHOS_INSUFICIENTES',
            fundamento: PROFILE_CIVIL.politicaRechazo.mensajeHechosInsuficientes,
            metadata: baseMetadata
        };
    }

    // 3. Detectar fueros excluidos
    const fuerosExcluidosPresentes = fuerosDetectados.filter(isFueroExcluido);

    if (fuerosExcluidosPresentes.length > 0 && !fuerosDetectados.includes('civil')) {
        return {
            admitida: false,
            codigo: 'RECHAZADA_FUERO_EXCLUIDO',
            fundamento: PROFILE_CIVIL.politicaRechazo.mensajeFueraDeCompetencia,
            metadata: baseMetadata
        };
    }

    // 4. Detectar consulta híbrida (civil + otro fuero)
    if (fuerosDetectados.includes('civil') && fuerosExcluidosPresentes.length > 0) {
        return {
            admitida: false,
            codigo: 'RECHAZADA_CONSULTA_HIBRIDA',
            fundamento: PROFILE_CIVIL.politicaRechazo.mensajeConsultaHibrida,
            metadata: baseMetadata
        };
    }

    // 5. Consulta admitida
    return {
        admitida: true,
        codigo: 'ADMITIDA',
        metadata: baseMetadata
    };
}

// ============================================
// EXPORTS ADICIONALES PARA TESTING
// ============================================

export const _internals = {
    detectarFueros,
    validarHechosMinimos,
    validarActoAdmitido,
    FUERO_KEYWORDS
};
