# Disclaimer Legal Institucional
## Alcance Legal – Sistema de Inteligencia Jurídica Civil
**Versión 1.0 – Definitiva e Inalterable**

---

## 1. Texto del Disclaimer

### Versión Completa (Pantalla de Aceptación)

> **AVISO LEGAL OBLIGATORIO**
>
> **Alcance Legal** es un sistema de consulta de criterios jurisprudenciales generales de acceso público, correspondientes al derecho civil argentino. Su función es exclusivamente informativa y de apoyo técnico.
>
> **Este sistema NO constituye:**
> - Asesoramiento legal profesional
> - Patrocinio letrado
> - Dictamen jurídico vinculante
> - Análisis integral de casos concretos
> - Estrategia procesal
> - Estimación de montos indemnizatorios
>
> **Este sistema NO reemplaza:**
> - La consulta con abogados matriculados
> - El criterio profesional del letrado actuante
> - El análisis particular de cada situación
>
> **El usuario reconoce y acepta que:**
> 1. Los criterios presentados son de carácter general y orientativo
> 2. Toda decisión jurídica requiere intervención profesional calificada
> 3. El sistema opera sobre información pública y no accede a documentación del caso
> 4. La responsabilidad por las decisiones adoptadas corresponde exclusivamente al usuario o al profesional interviniente
> 5. Los criterios jurisprudenciales pueden modificarse por cambios normativos, doctrinarios o de interpretación judicial
>
> **Exclusión de responsabilidad:** El operador, desarrollador y proveedores del sistema no asumen responsabilidad alguna por el uso que se haga de la información proporcionada, ni por las decisiones adoptadas en base a ella.
>
> **Jurisdicción aplicable:** República Argentina
> **Alcance del contenido:** Criterios jurisprudenciales públicos de aplicación general

---

### Versión Resumida (Banner Persistente)

> ⚖️ **Aviso:** Este sistema brinda información orientativa basada en criterios jurisprudenciales generales. No constituye asesoramiento legal. Toda decisión requiere intervención profesional.

---

### Versión Resultados (Bloque en cada respuesta)

> **Nota institucional:** Este análisis es un insumo técnico basado en criterios generales de acceso público. No constituye consejo legal definitivo. La validación y decisión final corresponde exclusivamente al profesional actuante.

---

## 2. Integración Frontend

### 2.1 Pantalla de Aceptación Inicial

| Atributo | Especificación |
|----------|----------------|
| **Momento** | Primera carga del sistema, antes de cualquier funcionalidad |
| **Contenido** | Versión Completa del Disclaimer |
| **Scroll** | Obligatorio hasta el final para habilitar botón |
| **Botón de aceptación** | "He leído y acepto los términos" |
| **Persistencia** | LocalStorage con version + timestamp |
| **Re-aceptación** | Si cambia versión del disclaimer |
| **Salteable** | NO |

```
┌─────────────────────────────────────────────┐
│              ALCANCE LEGAL                  │
│      Sistema de Inteligencia Jurídica       │
├─────────────────────────────────────────────┤
│                                             │
│         AVISO LEGAL OBLIGATORIO             │
│                                             │
│  [Texto completo del disclaimer]            │
│                                             │
│  ▼ Scroll para continuar                    │
│                                             │
├─────────────────────────────────────────────┤
│  [ ] He leído y acepto los términos         │
│                                             │
│       [CONTINUAR] (disabled hasta scroll)   │
└─────────────────────────────────────────────┘
```

### 2.2 Banner Persistente

| Ubicación | Comportamiento |
|-----------|----------------|
| Dashboard | Visible en header o footer |
| Resultados | Visible antes de la viabilidad |
| Formularios | Visible en parte inferior |
| **Ocultable** | NO |
| **Colapsable** | NO |

### 2.3 Bloque en Resultados

- Aparece **siempre** al final de cada análisis
- Formato: Card con borde institucional
- Contenido: Versión Resultados + 6 advertencias específicas
- **No colapsable, no editable, no removible**

---

## 3. Integración API

### 3.1 Estructura de Respuesta Obligatoria

Todas las respuestas del endpoint `/api/analizar` incluyen:

```json
{
  "resultado": { ... },
  "disclaimer_institucional": {
    "version": "1.0",
    "texto": "Este análisis es un insumo técnico basado en criterios generales de acceso público. No constituye consejo legal definitivo. La validación y decisión final corresponde exclusivamente al profesional actuante.",
    "obligatorio": true,
    "advertencias": [
      "Este análisis NO constituye opinión legal ni consejo profesional.",
      "La evaluación de viabilidad es orientativa y probabilística.",
      "Los criterios citados son de carácter general. Verificar vigencia ante cambios normativos.",
      "La precisión depende de la completitud de la información proporcionada.",
      "Factores no declarados pueden alterar sustancialmente las conclusiones.",
      "La decisión final corresponde exclusivamente al profesional actuante.",
      "El operador del sistema no asume responsabilidad por el uso de esta información."
    ]
  }
}
```

### 3.2 Reglas de Ejecución

| Regla | Comportamiento |
|-------|----------------|
| **Desactivación por prompt** | NO permitida |
| **Dependencia de endpoint** | Aplica a TODOS |
| **Fuera de alcance** | Bloqueo + explicación + disclaimer |

### 3.3 Respuesta de Bloqueo (Fuera de Alcance)

```json
{
  "bloqueado": true,
  "motivo": "La consulta excede el alcance de criterios generales",
  "alcance_permitido": "criterios_generales",
  "disclaimer_institucional": {
    "version": "1.0",
    "texto": "...",
    "obligatorio": true
  }
}
```

---

## 4. Relación con el RAG

### 4.1 Obligaciones del RAG

| Obligación | Implementación |
|------------|----------------|
| Citar alcance | "Opera sobre criterios generales" en cada respuesta |
| No conclusiones cerradas | Usar "sugiere", "orienta", "requiere validación" |
| Conflicto disclaimer/salida | **Gana el disclaimer** |
| Respuesta conflictiva | Se ajusta o se bloquea |

### 4.2 Texto que el RAG DEBE incluir

Cada respuesta del RAG incluye al final:

> Los criterios aplicados corresponden a jurisprudencia pública de alcance general. La evaluación particular del caso requiere intervención profesional.

### 4.3 Jerarquía de Control

```
1. Disclaimer Legal Institucional (máxima autoridad)
2. Filtro de alcance (_meta.alcance = criterios_generales)
3. Lógica de análisis del RAG
4. Respuesta generada
```

Si hay conflicto entre niveles → se aplica el nivel superior.

---

## 5. Confirmación de Encapsulamiento Jurídico

### Checklist de Cierre

- [ ] Disclaimer redactado (versión 1.0 definitiva)
- [ ] Pantalla de aceptación implementada
- [ ] Banner persistente visible
- [ ] Bloque en resultados siempre presente
- [ ] API incluye disclaimer_institucional en todas las respuestas
- [ ] RAG cita alcance en cada salida
- [ ] Bloqueos funcionan correctamente
- [ ] Conflictos resueltos a favor del disclaimer

### Declaración de Conformidad

Una vez completado el checklist, el sistema queda **jurídicamente encapsulado** y habilitado para:
1. Integración con Supabase
2. Carga de criterios
3. Producción

---

**Documento de referencia obligatorio para todo desarrollo posterior.**
