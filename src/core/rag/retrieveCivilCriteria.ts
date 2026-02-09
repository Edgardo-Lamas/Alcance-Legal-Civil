/**
 * RAG Module - Retrieve Civil Criteria
 * 
 * Búsqueda semántica en corpus Civil con control de suficiencia.
 * Este módulo NO razona, solo recupera y evalúa cobertura.
 */

// ============================================
// CONFIGURACIÓN
// ============================================

/**
 * Cantidad máxima de resultados a recuperar.
 * 5 permite cubrir variantes del tema sin ruido.
 */
export const TOP_K = 5;

/**
 * Umbral mínimo de similitud coseno (0-1).
 * 0.75 = alta relevancia semántica requerida.
 * Por debajo de esto, el criterio no se considera "aplicable".
 */
export const SIMILARITY_THRESHOLD = 0.75;

/**
 * Cantidad mínima de criterios que deben superar el threshold
 * para considerar que existe "base suficiente".
 * Si hay menos de 2 criterios relevantes, se rechaza por insuficiencia.
 */
export const MIN_RELEVANT_CRITERIA = 2;

// ============================================
// TIPOS
// ============================================

export interface CriterioRecuperado {
    /** ID único del criterio (ej: RC-EXT-001) */
    id: string;
    /** Nombre descriptivo del criterio */
    criterio: string;
    /** Enunciado de la regla general */
    reglaGeneral: string;
    /** Artículos del CC&C relevantes */
    articulosCcyc: string[];
    /** Similitud coseno con la consulta (0-1) */
    similarity: number;
}

export interface RAGResult {
    /** Si hay base suficiente para continuar al razonamiento */
    baseSuficiente: boolean;
    /** Código de resultado para logging */
    codigo: RAGResultCode;
    /** Criterios recuperados (ordenados por relevancia) */
    criterios: CriterioRecuperado[];
    /** Cantidad de criterios que superan el threshold */
    criteriosRelevantes: number;
    /** Fundamento del rechazo (solo si baseSuficiente = false) */
    fundamento?: string;
    /** Metadata para debugging */
    metadata: {
        topK: number;
        threshold: number;
        minRequired: number;
        timestamp: string;
    };
}

export type RAGResultCode =
    | 'BASE_SUFICIENTE'
    | 'BASE_INSUFICIENTE_SIN_RESULTADOS'
    | 'BASE_INSUFICIENTE_BAJA_RELEVANCIA';

// ============================================
// TIPO DE INPUT (para Supabase RPC)
// ============================================

export interface QueryEmbedding {
    /** Vector de embedding (1536 dimensiones para ada-002) */
    embedding: number[];
}

export interface RetrieveOptions {
    /** Filtro opcional por instituto jurídico */
    filterInstituto?: string;
    /** Filtro opcional por subtipo */
    filterSubtipo?: string;
}

// ============================================
// INTERFAZ DE SUPABASE (tipo esperado del RPC)
// ============================================

interface SupabaseClient {
    rpc: (
        fnName: string,
        params: Record<string, unknown>
    ) => Promise<{
        data: SupabaseRPCResult[] | null;
        error: { message: string } | null;
    }>;
}

interface SupabaseRPCResult {
    id: string;
    criterio: string;
    regla_general: string;
    articulos_ccyc: string[];
    similarity: number;
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

/**
 * Recupera criterios jurídicos del corpus Civil mediante búsqueda semántica.
 * 
 * Reglas de suficiencia:
 * 1. Debe haber al menos MIN_RELEVANT_CRITERIA criterios
 * 2. Cada criterio debe superar SIMILARITY_THRESHOLD
 * 3. Si no hay base suficiente, el sistema puede rechazar SIN razonar
 * 
 * @param supabase - Cliente de Supabase inicializado
 * @param query - Embedding de la consulta del usuario
 * @param options - Filtros opcionales por instituto/subtipo
 * @returns Resultado estructurado con criterios o indicador de insuficiencia
 */
export async function retrieveCivilCriteria(
    supabase: SupabaseClient,
    query: QueryEmbedding,
    options: RetrieveOptions = {}
): Promise<RAGResult> {
    const timestamp = new Date().toISOString();

    const baseMetadata = {
        topK: TOP_K,
        threshold: SIMILARITY_THRESHOLD,
        minRequired: MIN_RELEVANT_CRITERIA,
        timestamp
    };

    // Llamar a la función RPC de Supabase
    const { data, error } = await supabase.rpc('buscar_criterios', {
        query_embedding: query.embedding,
        match_count: TOP_K,
        filter_alcance: 'criterios_generales', // SIEMPRE corpus Civil validado
        filter_instituto: options.filterInstituto ?? null,
        filter_subtipo: options.filterSubtipo ?? null
    });

    // Error de conexión/query
    if (error) {
        throw new Error(`Error en búsqueda RAG: ${error.message}`);
    }

    // Sin resultados
    if (!data || data.length === 0) {
        return {
            baseSuficiente: false,
            codigo: 'BASE_INSUFICIENTE_SIN_RESULTADOS',
            criterios: [],
            criteriosRelevantes: 0,
            fundamento:
                'No se encontraron criterios jurídicos en el corpus Civil que correspondan a esta consulta. ' +
                'El sistema no puede emitir opinión sin base normativa o jurisprudencial verificada.',
            metadata: baseMetadata
        };
    }

    // Transformar y filtrar por threshold
    const criteriosTransformados: CriterioRecuperado[] = data.map(row => ({
        id: row.id,
        criterio: row.criterio,
        reglaGeneral: row.regla_general,
        articulosCcyc: row.articulos_ccyc ?? [],
        similarity: row.similarity
    }));

    // Filtrar solo los que superan el threshold
    const criteriosRelevantes = criteriosTransformados.filter(
        c => c.similarity >= SIMILARITY_THRESHOLD
    );

    // Evaluar suficiencia
    if (criteriosRelevantes.length < MIN_RELEVANT_CRITERIA) {
        return {
            baseSuficiente: false,
            codigo: 'BASE_INSUFICIENTE_BAJA_RELEVANCIA',
            criterios: criteriosTransformados, // Retornar todos para debugging
            criteriosRelevantes: criteriosRelevantes.length,
            fundamento:
                `Se encontraron ${data.length} criterios, pero solo ${criteriosRelevantes.length} ` +
                `superan el umbral de relevancia requerido (${SIMILARITY_THRESHOLD}). ` +
                'El sistema requiere al menos 2 criterios verificados para emitir una opinión fundada.',
            metadata: baseMetadata
        };
    }

    // Base suficiente
    return {
        baseSuficiente: true,
        codigo: 'BASE_SUFICIENTE',
        criterios: criteriosRelevantes, // Solo los relevantes
        criteriosRelevantes: criteriosRelevantes.length,
        metadata: baseMetadata
    };
}

// ============================================
// CONSTANTES EXPORTADAS (para configuración externa)
// ============================================

export const RAG_CONFIG = {
    TOP_K,
    SIMILARITY_THRESHOLD,
    MIN_RELEVANT_CRITERIA,
    CORPUS_FILTER: 'criterios_generales'
} as const;
