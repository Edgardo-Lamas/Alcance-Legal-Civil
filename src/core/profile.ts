/**
 * Profile Definition - Alcance Legal Civil
 * 
 * Define el perfil jurídico exclusivo del fuero Civil.
 * Este módulo actúa como "contrato de configuración" estático.
 */

// ============================================
// TIPOS
// ============================================

export type Fuero = 'civil' | 'comercial' | 'penal' | 'laboral' | 'familia';

export type ActoJuridico =
    | 'analizar_caso'
    | 'auditar_estrategia'
    | 'redactar_escrito'
    | 'revisar_documento';

export interface ProfileDefinition {
    readonly nombre: string;
    readonly descripcion: string;
    readonly fueroAdmitido: Fuero;
    readonly fuerosExcluidos: readonly Fuero[];
    readonly actosAdmitidos: readonly ActoJuridico[];
    readonly politicaRechazo: {
        readonly habilitado: boolean;
        readonly mensajeFueraDeCompetencia: string;
        readonly mensajeHechosInsuficientes: string;
        readonly mensajeConsultaHibrida: string;
    };
}

// ============================================
// PERFIL: ALCANCE LEGAL - CIVIL
// ============================================

export const PROFILE_CIVIL: ProfileDefinition = {
    nombre: 'Alcance Legal – Civil',
    descripcion: 'Asociado Senior Digital especializado exclusivamente en Derecho Civil',

    fueroAdmitido: 'civil',

    fuerosExcluidos: ['comercial', 'penal', 'laboral', 'familia'] as const,

    actosAdmitidos: [
        'analizar_caso',
        'auditar_estrategia',
        'redactar_escrito',
        'revisar_documento'
    ] as const,

    politicaRechazo: {
        habilitado: true,
        mensajeFueraDeCompetencia:
            'Esta consulta corresponde a un fuero distinto al Civil. ' +
            'Alcance Legal – Civil opera exclusivamente dentro del Derecho Civil. ' +
            'No se admiten consultas de otros fueros ni analogías entre jurisdicciones.',
        mensajeHechosInsuficientes:
            'La consulta no contiene hechos suficientes para emitir una opinión fundada. ' +
            'Por favor, proporcione: partes involucradas, hechos relevantes y pretensión.',
        mensajeConsultaHibrida:
            'La consulta involucra aspectos de múltiples fueros. ' +
            'Este sistema solo puede operar sobre cuestiones estrictamente civiles. ' +
            'Reformule la consulta excluyendo los aspectos no civiles.'
    }
} as const;

// ============================================
// HELPERS
// ============================================

/**
 * Verifica si un fuero está excluido del perfil actual
 */
export function isFueroExcluido(fuero: Fuero): boolean {
    return PROFILE_CIVIL.fuerosExcluidos.includes(fuero);
}

/**
 * Verifica si un acto jurídico está admitido
 */
export function isActoAdmitido(acto: ActoJuridico): boolean {
    return PROFILE_CIVIL.actosAdmitidos.includes(acto);
}

/**
 * Obtiene el perfil activo (preparado para futura multi-perfil)
 */
export function getActiveProfile(): ProfileDefinition {
    return PROFILE_CIVIL;
}
