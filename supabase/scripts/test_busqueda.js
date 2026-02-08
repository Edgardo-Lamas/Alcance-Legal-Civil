/**
 * Script para probar búsqueda semántica en Supabase
 * Alcance Legal - Test de Vector Store
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Configuración
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * Genera embedding para una consulta
 */
async function generarEmbedding(texto) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: texto,
    });
    return response.data[0].embedding;
}

/**
 * Busca criterios relevantes para una consulta
 */
async function buscarCriterios(consulta, limite = 3) {
    console.log(`\n🔍 Buscando: "${consulta}"\n`);

    // Generar embedding de la consulta
    const queryEmbedding = await generarEmbedding(consulta);

    // Llamar función de búsqueda de Supabase
    const { data, error } = await supabase.rpc('buscar_criterios', {
        query_embedding: queryEmbedding,
        match_count: limite,
        filter_alcance: 'criterios_generales',
    });

    if (error) {
        console.error('Error en búsqueda:', error.message);
        return [];
    }

    return data;
}

/**
 * Función principal de prueba
 */
async function main() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Test de Búsqueda Semántica - Alcance Legal');
    console.log('═══════════════════════════════════════════════════════');

    // Consultas de prueba
    const consultas = [
        '¿Cuáles son los elementos de la responsabilidad civil?',
        'daño moral por accidente de tránsito',
        'eximentes de responsabilidad por caso fortuito',
        'prescripción de acción de daños',
    ];

    for (const consulta of consultas) {
        const resultados = await buscarCriterios(consulta);

        if (resultados.length === 0) {
            console.log('  No se encontraron resultados.\n');
            continue;
        }

        console.log(`  Encontrados ${resultados.length} criterios:\n`);

        for (const r of resultados) {
            console.log(`  📋 ${r.criterio}`);
            console.log(`     Similaridad: ${(r.similarity * 100).toFixed(1)}%`);
            console.log(`     Artículos: ${r.articulos_ccyc?.join(', ') || 'N/A'}`);
            console.log(`     Regla: ${r.regla_general.substring(0, 80)}...`);
            console.log();
        }

        console.log('───────────────────────────────────────────────────────\n');
    }
}

main().catch(console.error);
