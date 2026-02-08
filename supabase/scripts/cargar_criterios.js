/**
 * Script para cargar criterios jurídicos a Supabase con embeddings
 * Alcance Legal - PMV Vector Store
 * 
 * REQUISITOS:
 * 1. npm install @supabase/supabase-js openai
 * 2. Configurar variables de entorno en .env
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURACIÓN - Editar según tu entorno
// ============================================
const SUPABASE_URL = process.env.SUPABASE_URL || 'TU_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'TU_SERVICE_KEY';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'TU_OPENAI_API_KEY';

// Directorio base de criterios (relativo desde supabase/scripts)
const KNOWLEDGE_DIR = '../../knowledge/jurisprudencia_publica/civil/danos_responsabilidad_extracontractual';

// ============================================
// INICIALIZACIÓN DE CLIENTES
// ============================================
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Genera embedding vectorial para un texto usando OpenAI
 */
async function generarEmbedding(texto) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: texto,
    });
    return response.data[0].embedding;
}

/**
 * Construye el texto para vectorizar a partir del criterio
 */
function construirTextoParaEmbedding(criterio) {
    const partes = [
        `Criterio: ${criterio.criterio}`,
        `Regla General: ${criterio.regla_general}`,
    ];

    // Agregar condiciones si existen
    if (criterio.condiciones_aplicacion?.length) {
        partes.push(`Condiciones: ${criterio.condiciones_aplicacion.join('. ')}`);
    }

    // Agregar exclusiones si existen
    if (criterio.exclusiones_comunes?.length) {
        partes.push(`Exclusiones: ${criterio.exclusiones_comunes.join('. ')}`);
    }

    // Agregar riesgos procesales si existen
    if (criterio.riesgos_procesales?.length) {
        partes.push(`Riesgos: ${criterio.riesgos_procesales.join('. ')}`);
    }

    return partes.join('\n\n');
}

/**
 * Extrae artículos del CCyC de las fuentes
 */
function extraerArticulosCCyC(criterio) {
    const fuentes = criterio.fuentes?.normativas || [];
    for (const fuente of fuentes) {
        if (fuente.cuerpo === 'CCyC' && fuente.articulos) {
            return fuente.articulos;
        }
    }
    return [];
}

/**
 * Procesa un archivo JSON de criterio y lo inserta en Supabase
 */
async function procesarCriterio(filePath) {
    console.log(`\nProcesando: ${path.basename(filePath)}`);

    // Leer archivo JSON
    const contenido = fs.readFileSync(filePath, 'utf-8');
    const criterio = JSON.parse(contenido);

    // Construir texto para embedding
    const textoEmbedding = construirTextoParaEmbedding(criterio);
    console.log(`  → Texto para embedding: ${textoEmbedding.substring(0, 100)}...`);

    // Generar embedding
    console.log('  → Generando embedding con OpenAI...');
    const embedding = await generarEmbedding(textoEmbedding);
    console.log(`  → Embedding generado (${embedding.length} dimensiones)`);

    // Preparar datos para inserción
    const registro = {
        id: criterio.id,
        contenido: textoEmbedding,
        instituto: criterio.instituto,
        subtipo: criterio.subtipo,
        jurisdiccion: 'argentina_nacional', // Por defecto
        alcance: 'criterios_generales',     // Público por defecto
        criterio: criterio.criterio,
        regla_general: criterio.regla_general,
        articulos_ccyc: extraerArticulosCCyC(criterio),
        nivel_autoridad: criterio.nivel_autoridad || 'orientativo',
        data: criterio, // JSON completo
        embedding: embedding,
    };

    // Insertar en Supabase (upsert para evitar duplicados)
    const { data, error } = await supabase
        .from('criterios_juridicos')
        .upsert(registro, { onConflict: 'id' })
        .select();

    if (error) {
        console.error(`  ✗ Error al insertar: ${error.message}`);
        return false;
    }

    console.log(`  ✓ Insertado correctamente: ${criterio.id}`);
    return true;
}

/**
 * Busca todos los archivos JSON en un directorio (recursivo)
 */
function buscarArchivosJSON(directorio) {
    const archivos = [];

    function explorar(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.startsWith('_')) {
                explorar(fullPath);
            } else if (item.endsWith('.json') && !item.startsWith('_')) {
                archivos.push(fullPath);
            }
        }
    }

    explorar(directorio);
    return archivos;
}

/**
 * Función principal
 */
async function main() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Carga de Criterios Jurídicos a Supabase');
    console.log('  Alcance Legal - PMV Vector Store');
    console.log('═══════════════════════════════════════════════════════\n');

    // Validar configuración
    if (SUPABASE_URL.includes('TU_') || OPENAI_API_KEY.includes('TU_')) {
        console.error('❌ ERROR: Debes configurar las variables de entorno:');
        console.error('   - SUPABASE_URL');
        console.error('   - SUPABASE_SERVICE_KEY');
        console.error('   - OPENAI_API_KEY');
        console.error('\nPuedes crear un archivo .env o exportar las variables.');
        process.exit(1);
    }

    // Buscar archivos JSON
    const baseDir = path.resolve(__dirname, KNOWLEDGE_DIR);
    console.log(`Buscando criterios en: ${baseDir}\n`);

    const archivos = buscarArchivosJSON(baseDir);
    console.log(`Encontrados ${archivos.length} archivos de criterios\n`);

    // Procesar cada archivo
    let exitosos = 0;
    let errores = 0;

    for (const archivo of archivos) {
        try {
            const ok = await procesarCriterio(archivo);
            if (ok) exitosos++;
            else errores++;
        } catch (error) {
            console.error(`  ✗ Error procesando ${path.basename(archivo)}: ${error.message}`);
            errores++;
        }

        // Pequeña pausa para no exceder rate limits
        await new Promise(r => setTimeout(r, 200));
    }

    // Resumen
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  RESUMEN');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  ✓ Exitosos: ${exitosos}`);
    console.log(`  ✗ Errores: ${errores}`);
    console.log(`  Total: ${archivos.length}`);
    console.log('═══════════════════════════════════════════════════════\n');
}

// Ejecutar
main().catch(console.error);
