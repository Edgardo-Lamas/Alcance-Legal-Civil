// Supabase Edge Function: analizar
// Orquesta: embeddings OpenAI + búsqueda vectorial + contraste con criterios generales
// 
// NO evalúa jurídicamente. Solo contrasta criterios generales y devuelve análisis orientativo.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ============================================
// CONFIGURACIÓN
// ============================================
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Headers CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================
// DISCLAIMER OBLIGATORIO
// ============================================
const DISCLAIMER = {
    version: '1.0',
    texto: 'Este análisis es un insumo técnico basado en criterios generales de acceso público. No constituye consejo legal definitivo. La validación y decisión final corresponde exclusivamente al profesional actuante.',
    advertencias: [
        'Este análisis NO constituye opinión legal ni consejo profesional.',
        'La evaluación es orientativa y probabilística.',
        'Los criterios citados son de carácter general. Verificar vigencia ante cambios normativos.',
        'La precisión depende de la completitud de la información proporcionada.',
        'Factores no declarados pueden alterar sustancialmente las conclusiones.',
        'La decisión final corresponde exclusivamente al profesional actuante.',
        'El operador del sistema no asume responsabilidad por el uso de esta información.'
    ]
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Genera embedding vectorial con OpenAI
 */
async function generarEmbedding(texto: string): Promise<number[]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: texto,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenAI API error: ${error}`)
    }

    const data = await response.json()
    return data.data[0].embedding
}

/**
 * Construye texto para embedding desde los datos del caso
 */
function construirTextoConsulta(datos: any): string {
    const partes = []

    if (datos.situacion_factica) {
        partes.push(`Situación: ${datos.situacion_factica}`)
    }
    if (datos.pretension_cliente) {
        partes.push(`Pretensión: ${datos.pretension_cliente}`)
    }
    if (datos.tipo_consulta) {
        partes.push(`Tipo: ${datos.tipo_consulta}`)
    }

    return partes.join('\n\n')
}

/**
 * Contrasta los criterios recuperados con los datos del caso
 * NO evalúa jurídicamente, solo identifica criterios relevantes
 */
function contrastarCriterios(criterios: any[], datosCaso: any): any {
    const criteriosRelevantes = criterios.map((c, idx) => ({
        id: c.id,
        criterio: c.criterio,
        regla_general: c.regla_general,
        articulos: c.articulos_ccyc || [],
        relevancia: c.similarity,
        observacion: generarObservacion(c, datosCaso)
    }))

    // Calcular indicador de completitud (no viabilidad jurídica)
    const completitud = calcularCompletitud(criteriosRelevantes, datosCaso)

    return {
        criterios_relevantes: criteriosRelevantes,
        completitud,
        elementos_identificados: identificarElementos(criteriosRelevantes),
        aspectos_faltantes: identificarFaltantes(criteriosRelevantes, datosCaso)
    }
}

/**
 * Genera observación orientativa sobre un criterio
 */
function generarObservacion(criterio: any, datos: any): string {
    // Observaciones genéricas basadas en el tipo de criterio
    const textoLower = datos.situacion_factica?.toLowerCase() || ''

    if (criterio.criterio?.includes('antijuridicidad')) {
        return 'Verificar si la conducta alegada puede encuadrarse como antijurídica según el criterio general.'
    }
    if (criterio.criterio?.includes('daño') || criterio.criterio?.includes('Daño')) {
        return 'Considerar el tipo de daño alegado y su acreditación según los elementos disponibles.'
    }
    if (criterio.criterio?.includes('causal')) {
        return 'Evaluar la conexión entre el hecho alegado y el perjuicio descripto.'
    }
    if (criterio.criterio?.includes('atribución') || criterio.criterio?.includes('factor')) {
        return 'Identificar el factor de atribución aplicable según las circunstancias del caso.'
    }
    if (criterio.criterio?.includes('prescripción')) {
        return 'Verificar plazos de prescripción aplicables al caso.'
    }
    if (criterio.criterio?.includes('eximente') || criterio.criterio?.includes('fortuito')) {
        return 'Considerar posibles eximentes que pudieran invocarse.'
    }

    return 'Criterio general a considerar según las circunstancias del caso.'
}

/**
 * Calcula indicador de completitud de información (NO viabilidad)
 */
function calcularCompletitud(criterios: any[], datos: any): any {
    let puntaje = 50 // Base

    // Más criterios relevantes = mejor contexto
    puntaje += Math.min(criterios.length * 5, 20)

    // Documentación mejora completitud
    if (datos.documentacion_disponible?.length > 0) {
        puntaje += datos.documentacion_disponible.length * 5
    }

    // Pretensión clara
    if (datos.pretension_cliente?.length > 30) {
        puntaje += 10
    }

    // Situación detallada
    if (datos.situacion_factica?.length > 100) {
        puntaje += 10
    }

    puntaje = Math.min(puntaje, 95) // Nunca 100%

    let nivel = 'BAJA'
    if (puntaje >= 70) nivel = 'ALTA'
    else if (puntaje >= 50) nivel = 'MEDIA'

    return {
        valor: puntaje,
        nivel,
        nota: 'Este indicador refleja la completitud de la información proporcionada, NO una evaluación jurídica del caso.'
    }
}

/**
 * Identifica elementos mencionados en los criterios
 */
function identificarElementos(criterios: any[]): string[] {
    const elementos = new Set<string>()

    criterios.forEach(c => {
        if (c.criterio?.includes('antijuridicidad')) elementos.add('Antijuridicidad')
        if (c.criterio?.includes('daño') || c.criterio?.includes('Daño')) elementos.add('Daño')
        if (c.criterio?.includes('causal')) elementos.add('Nexo causal')
        if (c.criterio?.includes('atribución')) elementos.add('Factor de atribución')
        if (c.criterio?.includes('prescripción')) elementos.add('Prescripción')
        if (c.criterio?.includes('eximente')) elementos.add('Eximentes')
    })

    return Array.from(elementos)
}

/**
 * Identifica aspectos que podrían requerir mayor desarrollo
 */
function identificarFaltantes(criterios: any[], datos: any): string[] {
    const faltantes: string[] = []

    // Analizar qué elementos constitutivos NO aparecen en criterios de alta relevancia
    const criteriosAltos = criterios.filter(c => c.relevancia > 0.85)
    const elementosIdentificados = identificarElementos(criteriosAltos)

    const elementosBase = ['Antijuridicidad', 'Daño', 'Nexo causal', 'Factor de atribución']

    elementosBase.forEach(elem => {
        if (!elementosIdentificados.includes(elem)) {
            faltantes.push(`Considerar desarrollar aspectos relativos a: ${elem}`)
        }
    })

    // Documentación
    if (!datos.documentacion_disponible || datos.documentacion_disponible.length === 0) {
        faltantes.push('No se indicó documentación disponible')
    }

    return faltantes
}

// ============================================
// HANDLER PRINCIPAL
// ============================================
serve(async (req) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Validar configuración
        if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Variables de entorno no configuradas')
        }

        // Parsear body
        const body = await req.json()

        // Validar datos mínimos
        if (!body.situacion_factica) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Se requiere situacion_factica'
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // 1. Construir texto para embedding
        const textoConsulta = construirTextoConsulta(body)

        // 2. Generar embedding con OpenAI
        const embedding = await generarEmbedding(textoConsulta)

        // 3. Buscar criterios similares en Supabase
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        const { data: criterios, error: searchError } = await supabase.rpc('buscar_criterios', {
            query_embedding: embedding,
            match_count: 5,
            filter_alcance: 'criterios_generales'
        })

        if (searchError) {
            throw new Error(`Error en búsqueda: ${searchError.message}`)
        }

        // 4. Contrastar criterios (sin evaluar jurídicamente)
        const contraste = contrastarCriterios(criterios || [], body)

        // 5. Construir respuesta con disclaimer obligatorio
        const numeroInforme = `ALC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`

        const respuesta = {
            success: true,
            data: {
                numero_informe: numeroInforme,
                fecha_emision: new Date().toISOString(),
                tipo: 'ANÁLISIS ORIENTATIVO',
                estado: 'BORRADOR - Requiere validación profesional',

                // Indicador de completitud (NO viabilidad)
                completitud: contraste.completitud,

                // Criterios contrastados
                criterios_relevantes: contraste.criterios_relevantes,
                elementos_identificados: contraste.elementos_identificados,
                aspectos_a_desarrollar: contraste.aspectos_faltantes,

                // Disclaimer OBLIGATORIO
                disclaimer: DISCLAIMER,

                // Metadata
                _meta: {
                    version_rag: '1.0-supabase',
                    criterios_consultados: criterios?.length || 0,
                    embedding_model: 'text-embedding-ada-002',
                    timestamp: new Date().toISOString()
                }
            }
        }

        return new Response(
            JSON.stringify(respuesta),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Error en Edge Function:', error)

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'Error interno del servidor',
                disclaimer: DISCLAIMER
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
