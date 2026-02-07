/**
 * Cliente Supabase para Alcance Legal
 * 
 * Configura la conexión a Supabase con las variables de entorno.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Variables de entorno no configuradas. Usando modo mock.')
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

/**
 * Verifica si Supabase está configurado y disponible
 */
export function isSupabaseConfigured() {
    return supabase !== null
}

/**
 * Busca criterios jurídicos por similitud vectorial
 * 
 * @param {number[]} embedding - Vector de 1536 dimensiones
 * @param {Object} options - Opciones de búsqueda
 * @param {number} options.limit - Cantidad de resultados (default: 5)
 * @param {string} options.alcance - Filtro de alcance (default: 'criterios_generales')
 * @param {string} options.instituto - Filtro opcional por instituto
 * @param {string} options.subtipo - Filtro opcional por subtipo
 * @returns {Promise<Array>} Criterios ordenados por similitud
 */
export async function buscarCriteriosSimilares(embedding, options = {}) {
    if (!supabase) {
        console.warn('[Supabase] No configurado, retornando vacío')
        return []
    }

    const {
        limit = 5,
        alcance = 'criterios_generales',  // FILTRO OBLIGATORIO
        instituto = null,
        subtipo = null
    } = options

    try {
        const { data, error } = await supabase.rpc('buscar_criterios', {
            query_embedding: embedding,
            match_count: limit,
            filter_alcance: alcance,
            filter_instituto: instituto,
            filter_subtipo: subtipo
        })

        if (error) {
            console.error('[Supabase] Error en búsqueda:', error)
            return []
        }

        return data || []
    } catch (err) {
        console.error('[Supabase] Error de conexión:', err)
        return []
    }
}

/**
 * Obtiene todos los criterios de una categoría
 * 
 * @param {string} instituto - Instituto jurídico
 * @param {string} subtipo - Subtipo específico
 * @returns {Promise<Array>} Lista de criterios
 */
export async function obtenerCriteriosPorCategoria(instituto, subtipo) {
    if (!supabase) {
        return []
    }

    try {
        const { data, error } = await supabase
            .from('criterios_juridicos')
            .select('id, criterio, regla_general, articulos_ccyc, nivel_autoridad')
            .eq('alcance', 'criterios_generales')  // SIEMPRE filtrar
            .eq('instituto', instituto)
            .eq('subtipo', subtipo)
            .order('id')

        if (error) {
            console.error('[Supabase] Error obteniendo criterios:', error)
            return []
        }

        return data || []
    } catch (err) {
        console.error('[Supabase] Error de conexión:', err)
        return []
    }
}

/**
 * Obtiene un criterio específico por ID
 * 
 * @param {string} id - ID del criterio (ej: 'RC-EXT-001')
 * @returns {Promise<Object|null>} Criterio o null si no existe
 */
export async function obtenerCriterioPorId(id) {
    if (!supabase) {
        return null
    }

    try {
        const { data, error } = await supabase
            .from('criterios_juridicos')
            .select('*')
            .eq('id', id)
            .eq('alcance', 'criterios_generales')  // SIEMPRE filtrar
            .single()

        if (error) {
            console.error('[Supabase] Error obteniendo criterio:', error)
            return null
        }

        return data
    } catch (err) {
        console.error('[Supabase] Error de conexión:', err)
        return null
    }
}

export default supabase
