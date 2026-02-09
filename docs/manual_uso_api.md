# Manual de Uso de la API - Alcance Legal

Este manual describe el funcionamiento técnico y funcional de la API de Alcance Legal, diseñada como un **Asociado Senior Digital** para profesionales del derecho.

## 1. Filosofía de la API
La API de Alcance Legal no es un motor de chat genérico. Es un sistema de **inteligencia jurídica aplicada** que opera bajo:
- **Metodología Jurídica Definida**: Razona sobre los 4 elementos constitutivos de la responsabilidad (Antijuridicidad, Daño, Nexo Causal, Factor de Atribución).
- **Ground Truth Curado**: Las respuestas se basan exclusivamente en el corpus jurídico y metodológico del proyecto.
- **Rechazo Razonado**: El sistema puede negarse a responder si la consulta excede el alcance o carece de información suficiente.

## 2. Endpoints Principales

### 2.1 Análisis de Caso
`POST /analizar` (Edge Function) o `POST /analizar-caso` (Webhook)

Analiza una situación fáctica y determina la viabilidad técnica preliminar.

**Input (JSON):**
```json
{
  "situacion_factica": "Relato detallado de los hechos...",
  "pretension_cliente": "Lo que el cliente busca obtener...",
  "documentacion_disponible": ["Contrato", "Carta documento", "..."]
}
```

**Output Destacado:**
- `viabilidad`: Índice porcentual y clasificación (BAJA, MEDIA, ALTA).
- `elementos_evaluados`: Estado de los 4 elementos de la responsabilidad.
- `riesgos`: Identificación de riesgos estratégicos o procesales.
- `disclaimer`: Advertencia legal obligatoria.

### 2.2 Auditoría de Estrategia
`POST /auditar-estrategia`

Evalúa la consistencia de una estrategia propuesta por el abogado.

**Input (JSON):**
```json
{
  "estrategia_propuesta": "Descripción de la línea argumental...",
  "etapa_procesal": "Demanda / Contestación / Prueba..."
}
```

### 2.3 Redacción Asistida
`POST /redactar-escrito`

Genera borradores técnicos basados en el análisis previo.

**Input (JSON):**
```json
{
  "tipo_escrito": "Demanda por daños / Contestación...",
  "puntos_clave": ["Hechos principales", "Prueba ofrecida"]
}
```

## 3. Perfiles y Alcance
La API requiere la especificación del fuero para activar el corpus correspondiente:
- **Civil**: Responsabilidad civil, contratos, daños.
- **Comercial**: (Próximamente) Sociedades, títulos valores.
- **Familia**: (Próximamente) Divorcios, alimentos.

> [!IMPORTANT]
> El fuero **Penal** está expresamente excluido de todas las capacidades del sistema.

## 4. Códigos de Estado y Errores
- `200 OK`: Operación exitosa con análisis.
- `400 Bad Request`: Información insuficiente para procesar.
- `403 Forbidden`: Intento de acceso a fueros excluidos (ej. Penal).
- `500 Internal Error`: Fallo en la recuperación de conocimiento (RAG).
