# Plan Operativo API – Alcance Legal Civil

> **Documento de referencia obligatorio.** No modificar sin autorización expresa.

---

## Contexto

- **Producto:** Alcance Legal – Civil
- **Naturaleza:** API jurídica especializada, cerrada y clonable
- **NO es:** chatbot, API generalista, motor de creatividad
- **Rol del desarrollador:** implementar capacidades de forma incremental y controlada

---

## Fases del Plan (Orden Estricto)

### 🟦 FASE 1 — CONSTITUCIÓN ✅ (en curso)

**Objetivo:** Definir identidad y límites.

**Componentes:**
- [x] `profile.ts` (perfil Civil puro)
- [x] `checkAdmissibility.ts` (admisibilidad estricta)
- [x] Rechazo como output válido

⚠️ **No se implementa nada más en esta fase.**

---

### 🟦 FASE 2 — RAG CIVIL CONTROLADO

**Objetivo:** Asegurar ground truth antes de razonar.

**Componentes:**
- [ ] Embedding de consulta
- [ ] Búsqueda semántica en Supabase (solo corpus Civil)
- [ ] Threshold mínimo de relevancia
- [ ] Rechazo por base insuficiente

**Regla:**
> Si no hay soporte suficiente → no se razona.

---

### 🟦 FASE 3 — RAZONAMIENTO GUIADO (LIS)

**Objetivo:** Ejecutar criterio, no creatividad.

**Componentes:**
- [ ] System prompt fijo
- [ ] Reglas metodológicas explícitas (LIS)
- [ ] Prohibición de conocimiento general
- [ ] Razonamiento condicionado a fuentes recuperadas

**Regla:**
> Claude no decide qué método usar, ejecuta el dado.

---

### 🟦 FASE 4 — VALIDACIÓN DE SALIDA

**Objetivo:** Control de riesgo profesional.

**Componentes:**
- [ ] Detección de certeza excesiva
- [ ] Detección de extrapolaciones
- [ ] Control de scope
- [ ] Posibilidad de rechazo post-razonamiento

---

### 🟦 FASE 5 — ENDPOINTS

**Objetivo:** Exponer actos jurídicos, no chat.

**Endpoints permitidos:**
- `POST /analizar-caso`
- `POST /auditar-estrategia`
- `POST /redactar-escrito`

**Pipeline único:**
```
Admisibilidad → RAG → Razonamiento → Validación → Output/Rechazo
```

---

## Estado Actual

| Fase | Estado | Componentes |
|------|--------|-------------|
| FASE 1 | ✅ Completada | `profile.ts`, `checkAdmissibility.ts` |
| FASE 2 | ✅ Completada | `rag/retrieveCivilCriteria.ts` |
| FASE 3 | ✅ Completada | `reasoning/guidedCivilReasoning.ts` |
| FASE 4 | ✅ Completada | `validation/validateCivilOutput.ts` |
| FASE 5 | ✅ Completada | `analizar-caso/index.ts` |

---

*Versión: 1.0 — 2026-02-09*
