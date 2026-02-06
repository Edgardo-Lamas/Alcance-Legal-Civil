# PMV de Conocimiento Jurídico
## Responsabilidad Civil Extracontractual – Argentina

---

## 1. Principios Rectores del Paquete

> [!IMPORTANT]
> Este paquete NO contiene doctrina, interpretaciones ni montos. Solo **criterios jurisprudenciales públicos** con condiciones de aplicación objetivas.

| Permitido | Prohibido |
|-----------|-----------|
| Criterios reiterados | Doctrina/opiniones |
| Reglas generales públicas | Fallos completos |
| Condiciones de aplicación | Montos indemnizatorios |
| Exclusiones típicas | Conclusiones cerradas |
| Riesgos procesales | Interpretaciones creativas |

---

## 2. Esquema JSON de Criterios (v2)

### Meta de Alcance Congelado

```json
{
  "_meta": {
    "alcance": "criterios_generales",
    "jurisdiccion": "argentina_nacional",
    "vigencia": "ccyc_2015",
    "advertencia": "Este paquete contiene exclusivamente criterios generales de aplicación uniforme. No incluye excepciones provinciales, interpretaciones doctrinarias ni cuantificaciones.",
    "congelado": true,
    "version_esquema": "2.0"
  }
}
```

### Esquema de Criterio Individual

```json
{
  "id": "RC-EXT-001",
  "instituto": "responsabilidad_civil",
  "subtipo": "extracontractual",
  "criterio": "Nombre descriptivo del criterio",
  "regla_general": "Enunciado objetivo de la regla",
  
  "fuentes": {
    "normativas": [
      {
        "tipo": "codigo",
        "cuerpo": "CCyC",
        "articulos": ["1717", "1718"],
        "vigencia": "2015-08-01"
      }
    ],
    "jurisprudenciales": [
      {
        "tipo": "criterio_reiterado",
        "tribunal": "CNCiv",
        "alcance": "Salas diversas",
        "periodo": "2015-presente",
        "caracter": "mayoritario"
      }
    ]
  },
  
  "condiciones_aplicacion": [],
  "exclusiones_comunes": [],
  "riesgos_procesales": [],
  
  "nivel_autoridad": "corte | camara_nacional | reiterado",
  "limitaciones": "Qué NO cubre este criterio",
  "tags": [],
  "version": "1.0",
  "fecha_actualizacion": "2026-02-06"
}
```

---

## 3. Lista de Criterios Mínimos (17 criterios)

### 3.1 Elementos Constitutivos

| ID | Criterio | Justificación |
|----|----------|---------------|
| RC-EXT-001 | **Antijuridicidad** | Sin acto antijurídico no hay responsabilidad. |
| RC-EXT-002 | **Daño resarcible** | Requisito esencial para evaluar viabilidad. |
| RC-EXT-003 | **Relación causal adecuada** | Criterio adoptado para evaluar nexo. |
| RC-EXT-004 | **Factor de atribución** | Determina título de imputación. |

### 3.2 Prueba y Carga

| ID | Criterio | Justificación |
|----|----------|---------------|
| RC-EXT-005 | **Carga de la prueba del daño** | Quien alega debe probar. |
| RC-EXT-006 | **Carga de la prueba causalidad** | Riesgo frecuente de rechazo. |
| RC-EXT-007 | **Inversión en riesgo creado** | Excepción para actividades riesgosas. |

### 3.3 Tipos de Daño

| ID | Criterio | Justificación |
|----|----------|---------------|
| RC-EXT-008 | **Daño emergente** | Categoría básica de rubro. |
| RC-EXT-009 | **Lucro cesante** | Exige prueba específica. |
| RC-EXT-010 | **Daño moral** | Criterio in re ipsa vs. prueba. |
| RC-EXT-011 | **Pérdida de chance** | Probabilidad cierta requerida. |

### 3.4 Eximentes

| ID | Criterio | Justificación |
|----|----------|---------------|
| RC-EXT-012 | **Hecho de la víctima** | Eximente total o parcial. |
| RC-EXT-013 | **Caso fortuito** | Condiciones estrictas. |
| RC-EXT-014 | **Hecho de tercero** | Ruptura del nexo causal. |

### 3.5 Prescripción

| ID | Criterio | Justificación |
|----|----------|---------------|
| RC-EXT-015 | **Plazo (3 años)** | Crítico para temporalidad. |
| RC-EXT-016 | **Cómputo del plazo** | Punto conflictivo frecuente. |

### 3.6 Meta

| ID | Criterio | Justificación |
|----|----------|---------------|
| RC-EXT-ADV | **Limitaciones del sistema** | Advertencias obligatorias. |

---

## 4. Ejemplos de Criterios

### RC-EXT-003: Causalidad Adecuada

```json
{
  "id": "RC-EXT-003",
  "instituto": "responsabilidad_civil",
  "subtipo": "extracontractual",
  "criterio": "Teoría de la causalidad adecuada",
  "regla_general": "Son reparables las consecuencias que acostumbran suceder según el curso normal y ordinario de las cosas (art. 1726 CCyC).",
  "condiciones_aplicacion": [
    "Nexo fáctico entre hecho y daño",
    "Previsibilidad objetiva de la consecuencia",
    "Ausencia de interrupción del nexo causal"
  ],
  "exclusiones_comunes": [
    "Consecuencias extraordinarias o imprevisibles",
    "Daños remotos sin conexión directa"
  ],
  "riesgos_procesales": [
    "No distinguir causalidad de culpabilidad",
    "Falta de prueba del nexo específico"
  ],
  "nivel_autoridad": "corte",
  "fuente_publica": "CSJN, doctrina reiterada; CCyC art. 1726",
  "limitaciones": "No resuelve cuantificación, solo atribuibilidad"
}
```

### RC-EXT-010: Daño Moral

```json
{
  "id": "RC-EXT-010",
  "instituto": "responsabilidad_civil",
  "subtipo": "extracontractual",
  "criterio": "Daño moral - Acreditación",
  "regla_general": "El daño moral puede presumirse in re ipsa en lesiones a derechos personalísimos, pero requiere acreditación en otros supuestos.",
  "condiciones_aplicacion": [
    "Afectación a la esfera íntima/espiritual",
    "Legitimación del reclamante",
    "Nexo causal con el hecho dañoso"
  ],
  "exclusiones_comunes": [
    "Meras molestias o incomodidades",
    "Disgusto patrimonial sin proyección espiritual"
  ],
  "riesgos_procesales": [
    "Confusión entre daño moral y psicológico",
    "Falta de fundamentación de la pretensión"
  ],
  "nivel_autoridad": "camara_nacional",
  "fuente_publica": "CNCiv, salas diversas, criterio mayoritario",
  "limitaciones": "No indica montos ni parámetros de cuantificación"
}
```

---

## 5. Estructura de Carpetas

```
knowledge/
└── jurisprudencia_publica/
    └── civil/
        └── danos_responsabilidad_extracontractual/
            ├── _meta/
            │   ├── schema.json
            │   └── indice.json
            ├── elementos_constitutivos/
            │   ├── RC-EXT-001_antijuridicidad.json
            │   ├── RC-EXT-002_dano_resarcible.json
            │   ├── RC-EXT-003_causalidad.json
            │   └── RC-EXT-004_factor_atribucion.json
            ├── prueba_carga/
            ├── tipos_dano/
            ├── eximentes/
            ├── prescripcion/
            └── advertencias/
```

---

## 6. Diseño para RAG

| Aspecto | Diseño |
|---------|--------|
| Chunking | Cada criterio = 1 documento (~500-800 tokens) |
| Embedding | `criterio` + `regla_general` como texto principal |
| Metadata | `instituto`, `subtipo`, `tags` para filtrado |
| Auditabilidad | Campo `fuente_publica` siempre citable |

---

## 7. Expansión Futura

```
└── civil/
    ├── danos_responsabilidad_extracontractual/  ← PMV actual
    ├── danos_responsabilidad_contractual/       ← Próximo
    ├── contratos/
    └── sucesiones/
```

---

> [!CAUTION]
> Este diseño es conceptual. Requiere revisión jurídica profesional antes de implementación.
