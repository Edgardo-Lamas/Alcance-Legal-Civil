# Configuración de Supabase para Alcance Legal

## 1. Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear cuenta/proyecto
2. Copiar las credenciales:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon Key**: Clave pública
   - **Service Key**: Clave privada (solo para scripts de carga)

## 2. Ejecutar Migración

En el SQL Editor de Supabase, ejecutar el contenido de:
```
supabase/migrations/001_create_criterios_table.sql
```

Esto crea:
- Tabla `criterios_juridicos` con columna `embedding` (vector 1536)
- Índice HNSW para búsqueda vectorial
- Función `buscar_criterios` con filtro por `alcance`
- Políticas RLS para seguridad

## 3. Configurar Variables de Entorno

Crear `.env.local` con:
```env
# Supabase (frontend)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Para script de carga (solo local)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu-service-key
OPENAI_API_KEY=tu-openai-key
```

## 4. Cargar Criterios

```bash
# Instalar dependencias
npm install @supabase/supabase-js openai

# Ejecutar script de carga
node scripts/load-criterios.js
```

El script:
1. Lee todos los archivos JSON de criterios
2. Genera embeddings con OpenAI ada-002
3. Inserta en Supabase con metadata obligatoria

## 5. Validar Carga

En el SQL Editor de Supabase:
```sql
SELECT id, criterio, alcance 
FROM criterios_juridicos 
WHERE alcance = 'criterios_generales';
```

## Estructura de la Tabla

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TEXT | ID único (ej: RC-EXT-001) |
| `contenido` | TEXT | Texto vectorizado |
| `instituto` | TEXT | ej: responsabilidad_civil |
| `subtipo` | TEXT | ej: extracontractual |
| `jurisdiccion` | TEXT | argentina_nacional |
| `alcance` | TEXT | **FILTRO**: criterios_generales |
| `embedding` | VECTOR(1536) | Vector OpenAI |
| `data` | JSONB | JSON original completo |

## Filtro de Seguridad

**CRÍTICO**: La función `buscar_criterios` SIEMPRE filtra por:
```sql
WHERE alcance = 'criterios_generales'
```

Esto garantiza que solo se recuperen criterios públicos validados.
