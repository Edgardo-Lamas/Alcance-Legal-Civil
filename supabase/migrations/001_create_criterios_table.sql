-- ============================================
-- Migración: Crear tabla criterios_juridicos con vectores
-- Alcance Legal - PMV Vector Store
-- ============================================

-- Habilitar extensión pgvector (ya instalada en Supabase por defecto)
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla principal de criterios jurídicos
CREATE TABLE IF NOT EXISTS criterios_juridicos (
    id TEXT PRIMARY KEY,
    
    -- Contenido para embedding
    contenido TEXT NOT NULL,  -- Texto completo para vectorizar
    
    -- Metadata obligatoria
    instituto TEXT NOT NULL,        -- ej: 'responsabilidad_civil'
    subtipo TEXT NOT NULL,          -- ej: 'extracontractual'
    jurisdiccion TEXT NOT NULL,     -- ej: 'argentina_nacional'
    alcance TEXT NOT NULL,          -- FILTRO PRINCIPAL: 'criterios_generales'
    
    -- Metadata adicional
    criterio TEXT NOT NULL,         -- Nombre descriptivo del criterio
    regla_general TEXT NOT NULL,    -- Enunciado de la regla
    articulos_ccyc TEXT[],          -- Array de artículos relevantes
    nivel_autoridad TEXT,           -- 'vinculante', 'orientativo'
    
    -- Datos estructurados completos (JSON original)
    data JSONB NOT NULL,
    
    -- Vector embedding (1536 dimensiones para OpenAI ada-002)
    embedding VECTOR(1536),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda vectorial (HNSW más rápido para consultas)
CREATE INDEX IF NOT EXISTS criterios_embedding_idx 
ON criterios_juridicos 
USING hnsw (embedding vector_cosine_ops);

-- Índice para filtrado por alcance (CRÍTICO para el filtrado)
CREATE INDEX IF NOT EXISTS criterios_alcance_idx 
ON criterios_juridicos (alcance);

-- Índice compuesto para filtros comunes
CREATE INDEX IF NOT EXISTS criterios_meta_idx 
ON criterios_juridicos (instituto, subtipo, jurisdiccion);

-- Función de búsqueda con filtro obligatorio de alcance
CREATE OR REPLACE FUNCTION buscar_criterios(
    query_embedding VECTOR(1536),
    match_count INT DEFAULT 5,
    filter_alcance TEXT DEFAULT 'criterios_generales',
    filter_instituto TEXT DEFAULT NULL,
    filter_subtipo TEXT DEFAULT NULL
)
RETURNS TABLE (
    id TEXT,
    criterio TEXT,
    regla_general TEXT,
    articulos_ccyc TEXT[],
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.criterio,
        c.regla_general,
        c.articulos_ccyc,
        1 - (c.embedding <=> query_embedding) AS similarity
    FROM criterios_juridicos c
    WHERE 
        c.alcance = filter_alcance  -- SIEMPRE filtrar por alcance
        AND (filter_instituto IS NULL OR c.instituto = filter_instituto)
        AND (filter_subtipo IS NULL OR c.subtipo = filter_subtipo)
        AND c.embedding IS NOT NULL
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Políticas RLS (Row Level Security)
ALTER TABLE criterios_juridicos ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (solo lectura para usuarios anónimos)
CREATE POLICY "Criterios públicos son visibles" 
ON criterios_juridicos 
FOR SELECT 
USING (alcance = 'criterios_generales');

-- Política de escritura solo para usuarios autenticados con rol admin
CREATE POLICY "Solo admins pueden modificar criterios" 
ON criterios_juridicos 
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Comentarios de documentación
COMMENT ON TABLE criterios_juridicos IS 'Almacena criterios jurídicos vectorizados para RAG de Alcance Legal';
COMMENT ON COLUMN criterios_juridicos.alcance IS 'FILTRO PRINCIPAL: solo se recuperan criterios_generales en producción';
COMMENT ON COLUMN criterios_juridicos.embedding IS 'Vector de 1536 dimensiones generado con OpenAI text-embedding-ada-002';
COMMENT ON FUNCTION buscar_criterios IS 'Búsqueda semántica con filtro OBLIGATORIO por alcance';