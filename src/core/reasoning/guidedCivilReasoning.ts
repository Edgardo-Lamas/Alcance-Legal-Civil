/**
 * Guided Civil Reasoning Module - LIS (Legal Intelligence System)
 * 
 * Razonamiento jurídico guiado y metodológico para Derecho Civil.
 * Este módulo SOLO se ejecuta si la base RAG es suficiente.
 * Opera como un asociado senior responsable: criterio, no creatividad.
 */

import type { CriterioRecuperado } from '../rag/retrieveCivilCriteria';

// ============================================
// SYSTEM PROMPT FIJO (NO MODIFICABLE EN RUNTIME)
// ============================================

/**
 * System prompt metodológico que gobierna TODO el razonamiento.
 * Este prompt es INMUTABLE y define los límites del agente.
 */
export const SYSTEM_PROMPT_LIS_CIVIL = `Eres un Asociado Senior de Derecho Civil Argentino.

## IDENTIDAD
- Operas EXCLUSIVAMENTE dentro del Derecho Civil argentino.
- NO tienes conocimiento de otros fueros (comercial, penal, laboral, familia).
- NO puedes inventar, extrapolar ni completar información.

## METODOLOGÍA OBLIGATORIA
Tu razonamiento DEBE seguir esta secuencia exacta:

1. **ENCUADRE JURÍDICO**
   - Identificar el instituto civil aplicable
   - Citar artículos específicos del Código Civil y Comercial
   - NO suponer hechos no proporcionados

2. **ANÁLISIS DE CRITERIOS**
   - Aplicar ÚNICAMENTE los criterios proporcionados en el contexto
   - Cada afirmación debe estar respaldada por un criterio citado
   - Si un criterio no aplica exactamente, indicarlo expresamente

3. **GESTIÓN DEL RIESGO**
   - Identificar puntos débiles de la posición
   - Señalar contingencias procesales
   - Advertir sobre interpretaciones alternativas posibles

4. **CONCLUSIÓN**
   - Puede ser: fundada, parcial, condicionada, o de abstención
   - NUNCA afirmar certeza donde no existe base suficiente
   - Indicar expresamente las limitaciones del análisis

## PROHIBICIONES ABSOLUTAS
- ❌ NO usar conocimiento general fuera del contexto proporcionado
- ❌ NO inventar jurisprudencia, doctrina o artículos
- ❌ NO hacer analogías con otros fueros
- ❌ NO simular certeza
- ❌ NO completar vacíos con suposiciones
- ❌ NO responder consultas fuera del alcance civil

## FORMATO DE RESPUESTA
Estructurar la respuesta en secciones claras:
- **Encuadre:** [instituto y normas aplicables]
- **Análisis:** [aplicación de criterios al caso]
- **Riesgos:** [advertencias y contingencias]
- **Conclusión:** [opinión fundada con alcance explícito]
- **Limitaciones:** [qué aspectos NO fueron cubiertos y por qué]

## REGLA FINAL
Si los criterios proporcionados no son suficientes para emitir una opinión fundada,
DEBES indicarlo expresamente y abstenerte de opinar. Un rechazo fundamentado
es preferible a una respuesta arriesgada.`;

// ============================================
// TIPOS
// ============================================

export interface ReasoningInput {
    /** Descripción de los hechos del caso */
    hechos: string;
    /** Criterios civiles recuperados del RAG */
    criterios: CriterioRecuperado[];
    /** Jurisprudencia relevante (opcional) */
    jurisprudencia?: JurisprudenciaItem[];
    /** Tipo de análisis solicitado */
    tipoAnalisis: TipoAnalisis;
}

export interface JurisprudenciaItem {
    /** Carátula del fallo */
    caratula: string;
    /** Tribunal */
    tribunal: string;
    /** Fecha */
    fecha: string;
    /** Extracto relevante */
    extracto: string;
}

export type TipoAnalisis =
    | 'analisis_viabilidad'
    | 'estrategia_procesal'
    | 'riesgos_posicion'
    | 'encuadre_normativo';

export interface ReasoningOutput {
    /** Si el razonamiento se completó satisfactoriamente */
    completado: boolean;
    /** Tipo de conclusión alcanzada */
    tipoConclusion: TipoConclusionReasoning;
    /** Contenido estructurado de la respuesta */
    contenido: ContenidoReasoning;
    /** Metadata del proceso */
    metadata: ReasoningMetadata;
}

export type TipoConclusionReasoning =
    | 'ANALISIS_FUNDADO'
    | 'ANALISIS_PARCIAL'
    | 'ANALISIS_CONDICIONADO'
    | 'ABSTENCION_METODOLOGICA'
    | 'LIMITACION_EXPRESA';

export interface ContenidoReasoning {
    encuadre: string;
    analisis: string;
    riesgos: string;
    conclusion: string;
    limitaciones: string;
}

export interface ReasoningMetadata {
    criteriosUtilizados: number;
    jurisprudenciaUtilizada: number;
    tipoAnalisis: TipoAnalisis;
    timestamp: string;
}

// ============================================
// PREPARACIÓN DEL CONTEXTO (para el LLM)
// ============================================

/**
 * Construye el contexto estructurado para el LLM.
 * Este contexto es el ÚNICO conocimiento disponible para razonar.
 */
export function buildReasoningContext(input: ReasoningInput): string {
    const criteriosTexto = input.criterios.map(c =>
        `### Criterio: ${c.criterio} (${c.id})
**Regla:** ${c.reglaGeneral}
**Artículos CC&C:** ${c.articulosCcyc.join(', ') || 'N/A'}
**Relevancia:** ${(c.similarity * 100).toFixed(1)}%`
    ).join('\n\n');

    const jurisprudenciaTexto = input.jurisprudencia?.length
        ? input.jurisprudencia.map(j =>
            `### ${j.caratula}
**Tribunal:** ${j.tribunal} | **Fecha:** ${j.fecha}
**Extracto:** ${j.extracto}`
        ).join('\n\n')
        : '_No se proporcionó jurisprudencia específica._';

    return `## HECHOS DEL CASO
${input.hechos}

## TIPO DE ANÁLISIS SOLICITADO
${formatTipoAnalisis(input.tipoAnalisis)}

## CRITERIOS CIVILES APLICABLES (del corpus verificado)
${criteriosTexto}

## JURISPRUDENCIA RELEVANTE
${jurisprudenciaTexto}

---
**RECORDATORIO:** Solo puedes utilizar la información proporcionada arriba.
No tienes acceso a ninguna otra fuente.`;
}

function formatTipoAnalisis(tipo: TipoAnalisis): string {
    const descripciones: Record<TipoAnalisis, string> = {
        analisis_viabilidad: 'Evaluar la viabilidad jurídica de la pretensión',
        estrategia_procesal: 'Proponer estrategia procesal con fundamento',
        riesgos_posicion: 'Identificar riesgos y contingencias de la posición',
        encuadre_normativo: 'Determinar el encuadre normativo aplicable'
    };
    return descripciones[tipo];
}

// ============================================
// INTERFAZ DE LLM (tipo esperado)
// ============================================

export interface LLMClient {
    chat: (params: {
        system: string;
        messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    }) => Promise<{ content: string }>;
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

/**
 * Ejecuta razonamiento jurídico guiado sobre un caso civil.
 * 
 * Garantías anti-improvisación:
 * 1. System prompt fijo e inmutable
 * 2. Contexto cerrado (solo criterios del RAG)
 * 3. Estructura de respuesta obligatoria
 * 4. Validación de output
 * 
 * @param llm - Cliente LLM (Claude, OpenAI, etc.)
 * @param input - Hechos y criterios para analizar
 * @returns Análisis estructurado o abstención fundamentada
 */
export async function guidedCivilReasoning(
    llm: LLMClient,
    input: ReasoningInput
): Promise<ReasoningOutput> {
    const timestamp = new Date().toISOString();

    // Construir contexto cerrado
    const context = buildReasoningContext(input);

    // Ejecutar razonamiento con prompt fijo
    const response = await llm.chat({
        system: SYSTEM_PROMPT_LIS_CIVIL,
        messages: [
            { role: 'user', content: context }
        ]
    });

    // Parsear respuesta estructurada
    const contenido = parseReasoningResponse(response.content);
    const tipoConclusion = determinarTipoConclusion(contenido);

    return {
        completado: tipoConclusion !== 'ABSTENCION_METODOLOGICA',
        tipoConclusion,
        contenido,
        metadata: {
            criteriosUtilizados: input.criterios.length,
            jurisprudenciaUtilizada: input.jurisprudencia?.length ?? 0,
            tipoAnalisis: input.tipoAnalisis,
            timestamp
        }
    };
}

// ============================================
// PARSING Y VALIDACIÓN
// ============================================

/**
 * Extrae secciones estructuradas de la respuesta del LLM.
 * Si alguna sección falta, marca como "No proporcionado".
 */
function parseReasoningResponse(raw: string): ContenidoReasoning {
    const extractSection = (label: string): string => {
        const regex = new RegExp(`\\*\\*${label}:?\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*[A-Z]|$)`, 'i');
        const match = raw.match(regex);
        return match?.[1]?.trim() || '_No proporcionado en el análisis._';
    };

    return {
        encuadre: extractSection('Encuadre'),
        analisis: extractSection('Análisis'),
        riesgos: extractSection('Riesgos'),
        conclusion: extractSection('Conclusión'),
        limitaciones: extractSection('Limitaciones')
    };
}

/**
 * Determina el tipo de conclusión basándose en el contenido.
 */
function determinarTipoConclusion(contenido: ContenidoReasoning): TipoConclusionReasoning {
    const conclusionLower = contenido.conclusion.toLowerCase();

    if (conclusionLower.includes('abstenerse') || conclusionLower.includes('no es posible opinar')) {
        return 'ABSTENCION_METODOLOGICA';
    }
    if (conclusionLower.includes('condicionado') || conclusionLower.includes('sujeto a')) {
        return 'ANALISIS_CONDICIONADO';
    }
    if (conclusionLower.includes('parcial') || conclusionLower.includes('limitado a')) {
        return 'ANALISIS_PARCIAL';
    }
    if (contenido.limitaciones.length > 50) {
        return 'LIMITACION_EXPRESA';
    }
    return 'ANALISIS_FUNDADO';
}

// ============================================
// EXPORTS PARA TESTING
// ============================================

export const _internals = {
    buildReasoningContext,
    parseReasoningResponse,
    determinarTipoConclusion,
    formatTipoAnalisis
};
