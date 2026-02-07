/**
 * Script de Carga de Criterios a Supabase
 * 
 * Carga los archivos JSON de criterios jurídicos, genera embeddings
 * y los inserta en la tabla criterios_juridicos de Supabase.
 * 
 * Ejecutar: node scripts/load-criterios.js
 * Requiere: SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY en .env
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Ruta base de criterios
const CRITERIOS_BASE_PATH = path.join(__dirname, '../knowledge/jurisprudencia_publica/civil/danos_responsabilidad_extracontractual')

// Validar configuración
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !OPENAI_API_KEY) {
    console.error('❌ Faltan variables de entorno:')
    console.error('   SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌')
    console.error('   SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? '✅' : '❌')
    console.error('   OPENAI_API_KEY:', OPENAI_API_KEY ? '✅' : '❌')
    process.exit(1)
}

// Clientes
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

/**
 * Genera embedding para un texto
 */
async function generarEmbedding(texto) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: texto
    })
    return response.data[0].embedding
}

/**
 * Convierte un criterio JSON a formato de inserción
 */
function criterioARegistro(criterio, categoria) {
    // Construir texto para embedding (concatenar campos relevantes)
    const textoEmbedding = [
        criterio.criterio,
        criterio.regla_general,
        ...(criterio.condiciones_aplicacion || []),
        ...(criterio.exclusiones_comunes || [])
    ].join(' ')

    // Extraer artículos del CCyC
    const articulos = criterio.fuentes?.normativas
        ?.filter(f => f.cuerpo === 'CCyC')
        ?.flatMap(f => f.articulos) || []

    return {
        id: criterio.id,
        contenido: textoEmbedding,
        instituto: criterio.instituto,
        subtipo: criterio.subtipo,
        jurisdiccion: 'argentina_nacional',  // Metadata obligatoria
        alcance: 'criterios_generales',       // Filtro principal
        criterio: criterio.criterio,
        regla_general: criterio.regla_general,
        articulos_ccyc: articulos,
        nivel_autoridad: criterio.nivel_autoridad || 'orientativo',
        data: criterio
    }
}

/**
 * Carga todos los criterios de una categoría
 */
async function cargarCategoria(nombreCategoria) {
    const categoriaPath = path.join(CRITERIOS_BASE_PATH, nombreCategoria)

    if (!fs.existsSync(categoriaPath)) {
        console.log(`⚠️  Categoría no encontrada: ${nombreCategoria}`)
        return 0
    }

    const archivos = fs.readdirSync(categoriaPath)
        .filter(f => f.endsWith('.json') && f.startsWith('RC-'))

    console.log(`\n📂 ${nombreCategoria}: ${archivos.length} criterios`)

    let cargados = 0
    for (const archivo of archivos) {
        const archivoPath = path.join(categoriaPath, archivo)
        const criterioJson = JSON.parse(fs.readFileSync(archivoPath, 'utf8'))

        try {
            // Convertir a registro
            const registro = criterioARegistro(criterioJson, nombreCategoria)

            // Generar embedding
            console.log(`   🔄 Generando embedding para ${registro.id}...`)
            registro.embedding = await generarEmbedding(registro.contenido)

            // Insertar/actualizar en Supabase
            const { error } = await supabase
                .from('criterios_juridicos')
                .upsert(registro, { onConflict: 'id' })

            if (error) {
                console.error(`   ❌ Error insertando ${registro.id}:`, error.message)
            } else {
                console.log(`   ✅ ${registro.id} cargado`)
                cargados++
            }

            // Rate limiting para API de OpenAI
            await new Promise(r => setTimeout(r, 200))

        } catch (err) {
            console.error(`   ❌ Error procesando ${archivo}:`, err.message)
        }
    }

    return cargados
}

/**
 * Función principal
 */
async function main() {
    console.log('🚀 Iniciando carga de criterios a Supabase')
    console.log('   URL:', SUPABASE_URL)
    console.log('   Ruta criterios:', CRITERIOS_BASE_PATH)

    const categorias = [
        'elementos_constitutivos',
        'prueba_carga',
        'tipos_dano',
        'eximentes',
        'prescripcion',
        'advertencias'
    ]

    let totalCargados = 0

    for (const categoria of categorias) {
        const cargados = await cargarCategoria(categoria)
        totalCargados += cargados
    }

    console.log(`\n✅ Carga completada: ${totalCargados} criterios insertados`)

    // Verificar carga
    const { count, error } = await supabase
        .from('criterios_juridicos')
        .select('*', { count: 'exact', head: true })
        .eq('alcance', 'criterios_generales')

    if (!error) {
        console.log(`📊 Total en base de datos (criterios_generales): ${count}`)
    }
}

main().catch(console.error)
