# Contrato de API – Alcance Legal Civil

## Principios

1. La API es una **fachada** que dispara workflows en n8n
2. Cada endpoint representa una **capacidad profesional**
3. Un rechazo fundado es una **respuesta válida**, no un error
4. Toda respuesta incluye **metadatos de trazabilidad**

> [!IMPORTANT]
> **Rechazos y advertencias son respuestas de primera clase.**
> - HTTP `200` para rechazos (no son errores, son decisiones del sistema)
> - Las `advertencias` siempre se incluyen cuando aplican
> - El campo `status` distingue `"procesado"` de `"rechazado"`

---

## Endpoints

### POST `/capacidades/analizar`

Análisis jurídico de casos civiles.

**Request**:
```json
{
  "tipo_consulta": "contrato" | "daños" | "sucesión" | "ejecución" | "obligaciones" | "otro",
  "situacion_factica": "string (requerido, min 100 chars)",
  "documentacion_disponible": ["string"],
  "pretension_cliente": "string (requerido)",
  "jurisdiccion": "string (provincia)",
  "urgencia": "normal" | "alta"
}
```

**Response (éxito)**:
```json
{
  "status": "procesado",
  "capacidad": "analizar",
  "resultado": {
    "viabilidad": "alta" | "media" | "baja" | "no_determinable",
    "analisis": "string",
    "fundamentos": [
      {
        "tipo": "jurisprudencia" | "metodologia",
        "referencia": "string",
        "extracto": "string"
      }
    ],
    "riesgos": [
      {
        "nivel": "alto" | "medio" | "bajo",
        "descripcion": "string",
        "mitigacion_sugerida": "string"
      }
    ],
    "observaciones": ["string"],
    "advertencias": ["string"]
  },
  "metadata": {
    "timestamp": "ISO8601",
    "workflow_id": "string",
    "fuentes_consultadas": 5,
    "version_metodologia": "1.0"
  }
}
```

---

### POST `/capacidades/auditar`

Auditoría de estrategias procesales.

**Request**:
```json
{
  "etapa_procesal": "demanda" | "contestación" | "prueba" | "alegatos" | "ejecución",
  "estrategia_actual": "string (requerido, min 150 chars)",
  "objetivo_procesal": "string (requerido)",
  "riesgos_identificados": ["string"],
  "contexto_adicional": "string"
}
```

**Response (éxito)**:
```json
{
  "status": "procesado",
  "capacidad": "auditar",
  "resultado": {
    "consistencia_estrategia": "coherente" | "inconsistente" | "requiere_ajuste",
    "evaluacion": "string",
    "supuestos_implicitos_detectados": [
      {
        "supuesto": "string",
        "riesgo_asociado": "string",
        "recomendacion": "string"
      }
    ],
    "inconsistencias_detectadas": [
      {
        "tipo": "string",
        "descripcion": "string",
        "impacto_potencial": "string"
      }
    ],
    "riesgos_no_identificados": ["string"],
    "recomendaciones": [
      {
        "prioridad": "alta" | "media" | "baja",
        "accion": "string",
        "fundamento": "string"
      }
    ],
    "advertencias": ["string"]
  },
  "metadata": { ... }
}
```

---

### POST `/capacidades/redactar`

Asistencia en redacción de escritos civiles.

**Request**:
```json
{
  "tipo_escrito": "demanda" | "contestación" | "apelación" | "incidente" | "memorial",
  "hechos_relevantes": "string (requerido, min 200 chars)",
  "pretension": "string (requerido)",
  "fundamentos_juridicos": ["string"],
  "estilo": "formal" | "técnico",
  "incluir_jurisprudencia": true | false
}
```

**Response (éxito)**:
```json
{
  "status": "procesado",
  "capacidad": "redactar",
  "tipo_documento": "BORRADOR_ASISTIDO",
  "aviso_obligatorio": "Este documento es un borrador asistido que requiere revisión y aprobación del abogado responsable.",
  "resultado": {
    "escrito": "string (texto completo)",
    "estructura": {
      "secciones": ["objeto", "hechos", "derecho", "petitorio"],
      "extension_palabras": 1500
    },
    "jurisprudencia_citada": [
      {
        "referencia": "string",
        "aplicacion": "string"
      }
    ],
    "secciones_revisar": [
      {
        "seccion": "string",
        "motivo": "string"
      }
    ],
    "advertencias": ["string"]
  },
  "metadata": { ... }
}
```

> [!WARNING]
> Todo response de redacción DEBE incluir `tipo_documento: "BORRADOR_ASISTIDO"` y el `aviso_obligatorio`.

---

## Respuestas de Rechazo

Todos los endpoints pueden devolver rechazo:

```json
{
  "status": "rechazado",
  "capacidad": "analizar" | "auditar" | "redactar",
  "rechazo": {
    "tipo": "fuero_excluido" | "datos_insuficientes" | "riesgo_inaceptable" | "sin_fundamento_curado",
    "fundamentacion": "string (explicación profesional)",
    "sugerencia": "string (cómo reformular)",
    "campos_faltantes": ["string"] // si aplica
  },
  "metadata": {
    "timestamp": "ISO8601",
    "workflow_id": "string"
  }
}
```

**HTTP Status Codes**:
- `200` → Procesado exitosamente
- `200` → Rechazo fundado (es respuesta válida, no error)
- `400` → Request mal formado
- `401` → No autenticado
- `403` → Sin permisos / límite de plan excedido
- `500` → Error interno

---

## Headers Requeridos

```
Authorization: Bearer <token_supabase>
Content-Type: application/json
X-Client-Version: 1.0
```

---

## Rate Limits (por plan)

| Plan | Consultas/día | Capacidades |
|------|---------------|-------------|
| Básico | 10 | analizar |
| Profesional | 50 | analizar, auditar |
| Premium | ilimitado | todas |
