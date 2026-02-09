/**
 * Supabase Edge Function: POST /analizar-caso
 * 
 * Endpoint principal de Alcance Legal – Civil.
 * Orquesta el pipeline completo:
 *   1. Admisibilidad → 2. RAG Civil → 3. Razonamiento LIS → 4. Validación → 5. Respuesta
 * 
 * Este endpoint representa un ACTO JURÍDICO-INTELECTUAL, no un chat.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ============================================
// CONFIGURACIÓN
// ============================================

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================
// CONTRATOS REQUEST/RESPONSE
// ============================================

/**
 * Contrato de Request
 */
interface AnalizarCasoRequest {
    /** Descripción de los hechos del caso (requerido) */
    hechos: string
    /** Pretensión del cliente (opcional pero recomendado) */
    pretension?: string
    /** Instituto jurídico principal (opcional, se infiere si no se proporciona) */
    instituto?: string
    /** Documentación disponible */
    documentacion?: string[]
}

/**
 * Contrato de Response (éxito)
 */
interface AnalizarCasoResponse {
    success: true
    status: 'approved' | 'limited' | 'rejected'
    data: {
        numero_informe: string
        fecha_emision: string
        encuadre: string
        analisis: string
        riesgos: string
        conclusion: string
        limitaciones: string
    }
    advertencias?: string[]
    disclaimer: typeof DISCLAIMER
    meta: {
        criterios_utilizados: number
        pipeline_version: string
        timestamp: string
    }
}

/**
 * Contrato de Response (rechazo)
 */
interface RechazoResponse {
    success: false
    fase_rechazo: 'admisibilidad' | 'rag' | 'validacion'
    codigo: string
    fundamento: string
    recomendacion?: string
    disclaimer: typeof DISCLAIMER
}

// ============================================
// DISCLAIMER INSTITUCIONAL
// ============================================

const DISCLAIMER = {
    version: '1.1',
    texto: 'Este análisis es un insumo técnico basado en criterios jurídicos verificados. No constituye consejo legal definitivo. La validación y decisión final corresponde exclusivamente al profesional actuante.',
    advertencias: [
        'Este análisis NO constituye opinión legal vinculante.',
        'Los criterios citados corresponden al corpus Civil verificado.',
        'La precisión depende de la completitud de la información proporcionada.',
        'La decisión final corresponde exclusivamente al profesional actuante.'
    ]
} as const

// ============================================
// SYSTEM PROMPT LIS (importado conceptualmente)
// ============================================

const SYSTEM_PROMPT_LIS = `Eres un Asociado Senior de Derecho Civil Argentino.

## IDENTIDAD
- Operas EXCLUSIVAMENTE dentro del Derecho Civil argentino.
- NO tienes conocimiento de otros fueros.
- NO puedes inventar, extrapolar ni completar información.

## METODOLOGÍA OBLIGATORIA
1. **ENCUADRE JURÍDICO**: Identificar instituto civil y artículos CC&C aplicables.
2. **ANÁLISIS DE CRITERIOS**: Aplicar ÚNICAMENTE los criterios proporcionados.
3. **GESTIÓN DEL RIESGO**: Identificar puntos débiles y contingencias.
4. **CONCLUSIÓN**: Puede ser fundada, parcial, condicionada o abstención.

## PROHIBICIONES ABSOLUTAS
- ❌ NO usar conocimiento general fuera del contexto proporcionado
- ❌ NO inventar jurisprudencia, doctrina o artículos
- ❌ NO hacer analogías con otros fueros
- ❌ NO simular certeza
- ❌ NO completar vacíos con suposiciones

## FORMATO DE RESPUESTA (JSON)
{
  "encuadre": "[instituto y normas aplicables]",
  "analisis": "[aplicación de criterios al caso]",
  "riesgos": "[advertencias y contingencias]",
  "conclusion": "[opinión fundada con alcance explícito]",
  "limitaciones": "[aspectos NO cubiertos y por qué]"
}`

// ============================================
// CONFIGURACIÓN RAG
// ============================================

const RAG_CONFIG = {
    TOP_K: 5,
    SIMILARITY_THRESHOLD: 0.75,
    MIN_RELEVANT_CRITERIA: 2
}

// ============================================
// KEYWORDS FUEROS EXCLUIDOS
// ============================================

const FUERO_EXCLUIDO_KEYWORDS = [
    'penal', 'delito', 'crimen', 'prisión', 'homicidio', 'robo', 'hurto', 'estafa',
    'laboral', 'despido', 'LCT', 'indemnización laboral', 'trabajo registrado',
    'comercial', 'quiebra', 'concurso', 'sociedad anónima', 'cheque', 'pagaré',
    'familia', 'divorcio', 'alimentos', 'tenencia', 'régimen de visitas', 'adopción'
]

const CIVIL_KEYWORDS = [
    'contrato', 'daños', 'perjuicios', 'obligaciones', 'propiedad', 'sucesión',
    'locación', 'alquiler', 'responsabilidad civil', 'usucapión', 'hipoteca'
]

// ============================================
// FUNCIONES AUXILIARES
// ============================================

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
        throw new Error(`OpenAI API error: ${await response.text()}`)
    }

    const data = await response.json()
    return data.data[0].embedding
}

async function invocarRazonamiento(context: string): Promise<any> {
    // Usar Claude para razonamiento si está disponible, sino OpenAI
    if (ANTHROPIC_API_KEY) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 2048,
                system: SYSTEM_PROMPT_LIS,
                messages: [{ role: 'user', content: context }]
            }),
        })

        if (!response.ok) {
            throw new Error(`Anthropic API error: ${await response.text()}`)
        }

        const data = await response.json()
        return JSON.parse(data.content[0].text)
    }

    // Fallback a OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: SYSTEM_PROMPT_LIS },
                { role: 'user', content: context }
            ]
        }),
    })

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${await response.text()}`)
    }

    const data = await response.json()
    return JSON.parse(data.choices[0].message.content)
}

// ============================================
// FASE 1: ADMISIBILIDAD
// ============================================

function checkAdmissibility(body: AnalizarCasoRequest): { admitida: boolean; codigo: string; fundamento?: string } {
    const textoCompleto = `${body.hechos} ${body.pretension || ''}`.toLowerCase()

    // Validar hechos mínimos
    if (!body.hechos || body.hechos.trim().length < 20) {
        return {
            admitida: false,
            codigo: 'RECHAZADA_HECHOS_INSUFICIENTES',
            fundamento: 'La consulta no contiene hechos suficientes para emitir una opinión fundada. Por favor, proporcione: partes involucradas, hechos relevantes y pretensión.'
        }
    }

    // Detectar fueros excluidos
    for (const keyword of FUERO_EXCLUIDO_KEYWORDS) {
        if (textoCompleto.includes(keyword.toLowerCase())) {
            // Verificar que no sea civil también
            const tieneCivil = CIVIL_KEYWORDS.some(kw => textoCompleto.includes(kw.toLowerCase()))

            if (!tieneCivil) {
                return {
                    admitida: false,
                    codigo: 'RECHAZADA_FUERO_EXCLUIDO',
                    fundamento: `Esta consulta corresponde a un fuero distinto al Civil (detectado: "${keyword}"). Alcance Legal – Civil opera exclusivamente dentro del Derecho Civil.`
                }
            } else {
                return {
                    admitida: false,
                    codigo: 'RECHAZADA_CONSULTA_HIBRIDA',
                    fundamento: `La consulta involucra aspectos de múltiples fueros. Este sistema solo puede operar sobre cuestiones estrictamente civiles.`
                }
            }
        }
    }

    return { admitida: true, codigo: 'ADMITIDA' }
}

// ============================================
// FASE 2: RAG CIVIL
// ============================================

async function retrieveCivilCriteria(
    supabase: any,
    embedding: number[]
): Promise<{ baseSuficiente: boolean; codigo: string; criterios: any[]; fundamento?: string }> {

    const { data: criterios, error } = await supabase.rpc('buscar_criterios', {
        query_embedding: embedding,
        match_count: RAG_CONFIG.TOP_K,
        filter_alcance: 'criterios_generales'
    })

    if (error) {
        throw new Error(`Error en búsqueda RAG: ${error.message}`)
    }

    if (!criterios || criterios.length === 0) {
        return {
            baseSuficiente: false,
            codigo: 'BASE_INSUFICIENTE_SIN_RESULTADOS',
            criterios: [],
            fundamento: 'No se encontraron criterios jurídicos en el corpus Civil que correspondan a esta consulta.'
        }
    }

    const criteriosRelevantes = criterios.filter((c: any) => c.similarity >= RAG_CONFIG.SIMILARITY_THRESHOLD)

    if (criteriosRelevantes.length < RAG_CONFIG.MIN_RELEVANT_CRITERIA) {
        return {
            baseSuficiente: false,
            codigo: 'BASE_INSUFICIENTE_BAJA_RELEVANCIA',
            criterios: criterios,
            fundamento: `Se encontraron ${criterios.length} criterios, pero solo ${criteriosRelevantes.length} superan el umbral de relevancia requerido.`
        }
    }

    return {
        baseSuficiente: true,
        codigo: 'BASE_SUFICIENTE',
        criterios: criteriosRelevantes
    }
}

// ============================================
// FASE 4: VALIDACIÓN DE SALIDA
// ============================================

const CERTEZA_PATTERNS = [
    /sin duda alguna/i, /absolutamente cierto/i, /garantizo que/i,
    /100% seguro/i, /es imposible que/i
]

function validateOutput(contenido: any): { status: 'approved' | 'limited' | 'rejected'; advertencias: string[]; esViolacionScope?: boolean } {
    const advertencias: string[] = []
    let errorCount = 0

    const textoCompleto = Object.values(contenido).join(' ')

    // Check certeza excesiva
    for (const pattern of CERTEZA_PATTERNS) {
        if (pattern.test(textoCompleto)) {
            advertencias.push('El análisis expresa niveles de certeza que deben interpretarse con cautela profesional.')
            errorCount++
            break
        }
    }

    // Check violación scope (retorna flag especial para HTTP 403)
    for (const keyword of FUERO_EXCLUIDO_KEYWORDS.slice(0, 10)) {
        if (textoCompleto.toLowerCase().includes(keyword.toLowerCase())) {
            return { status: 'rejected', advertencias: [`Se detectó mención a materia fuera del scope Civil: "${keyword}"`], esViolacionScope: true }
        }
    }

    if (errorCount >= 2) return { status: 'rejected', advertencias }
    if (errorCount === 1 || advertencias.length > 0) return { status: 'limited', advertencias }
    return { status: 'approved', advertencias: [] }
}

// ============================================
// HANDLER PRINCIPAL
// ============================================

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Validar configuración
        if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Variables de entorno no configuradas')
        }

        const body: AnalizarCasoRequest = await req.json()

        // ==========================================
        // FASE 1: ADMISIBILIDAD
        // ==========================================
        const admisibilidad = checkAdmissibility(body)

        if (!admisibilidad.admitida) {
            const rechazo: RechazoResponse = {
                success: false,
                fase_rechazo: 'admisibilidad',
                codigo: admisibilidad.codigo,
                fundamento: admisibilidad.fundamento!,
                recomendacion: 'Reformule la consulta limitándola a aspectos estrictamente civiles.',
                disclaimer: DISCLAIMER
            }
            return new Response(JSON.stringify(rechazo), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // ==========================================
        // FASE 2: RAG CIVIL
        // ==========================================
        const textoConsulta = `${body.hechos}\n\nPretensión: ${body.pretension || 'No especificada'}`
        const embedding = await generarEmbedding(textoConsulta)

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        const rag = await retrieveCivilCriteria(supabase, embedding)

        if (!rag.baseSuficiente) {
            const rechazo: RechazoResponse = {
                success: false,
                fase_rechazo: 'rag',
                codigo: rag.codigo,
                fundamento: rag.fundamento!,
                recomendacion: 'La consulta no tiene base suficiente en el corpus Civil verificado.',
                disclaimer: DISCLAIMER
            }
            // HTTP 422: Base insuficiente en RAG
            return new Response(JSON.stringify(rechazo), {
                status: 422,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // ==========================================
        // FASE 3: RAZONAMIENTO GUIADO (LIS)
        // ==========================================
        const criteriosTexto = rag.criterios.map((c: any) =>
            `### Criterio: ${c.criterio} (${c.id})\n**Regla:** ${c.regla_general}\n**Artículos:** ${c.articulos_ccyc?.join(', ') || 'N/A'}`
        ).join('\n\n')

        const contextReasoning = `## HECHOS DEL CASO\n${body.hechos}\n\n## PRETENSIÓN\n${body.pretension || 'No especificada'}\n\n## CRITERIOS CIVILES APLICABLES\n${criteriosTexto}\n\n---\nResponde en formato JSON con las claves: encuadre, analisis, riesgos, conclusion, limitaciones.`

        const razonamiento = await invocarRazonamiento(contextReasoning)

        // ==========================================
        // FASE 4: VALIDACIÓN DE SALIDA
        // ==========================================
        const validacion = validateOutput(razonamiento)

        if (validacion.status === 'rejected') {
            const rechazo: RechazoResponse = {
                success: false,
                fase_rechazo: 'validacion',
                codigo: 'RECHAZADA_VALIDACION',
                fundamento: 'El análisis no superó los controles de calidad profesional.',
                recomendacion: validacion.advertencias.join(' '),
                disclaimer: DISCLAIMER
            }
            // HTTP 403 si es violación de scope, HTTP 422 para otras validaciones
            const httpStatus = validacion.esViolacionScope ? 403 : 422
            return new Response(JSON.stringify(rechazo), {
                status: httpStatus,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // ==========================================
        // FASE 5: RESPUESTA
        // ==========================================
        const numeroInforme = `ALC-CIVIL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`

        const respuesta: AnalizarCasoResponse = {
            success: true,
            status: validacion.status,
            data: {
                numero_informe: numeroInforme,
                fecha_emision: new Date().toISOString(),
                encuadre: razonamiento.encuadre || '',
                analisis: razonamiento.analisis || '',
                riesgos: razonamiento.riesgos || '',
                conclusion: razonamiento.conclusion || '',
                limitaciones: razonamiento.limitaciones || ''
            },
            advertencias: validacion.status === 'limited' ? validacion.advertencias : undefined,
            disclaimer: DISCLAIMER,
            meta: {
                criterios_utilizados: rag.criterios.length,
                pipeline_version: '2.0-lis-civil',
                timestamp: new Date().toISOString()
            }
        }

        return new Response(JSON.stringify(respuesta), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error('Error en Edge Function:', error)

        return new Response(
            JSON.stringify({
                success: false,
                fase_rechazo: 'sistema',
                codigo: 'ERROR_INTERNO',
                fundamento: error.message || 'Error interno del servidor',
                disclaimer: DISCLAIMER
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
