# Propuesta UX/UI – Alcance Legal Civil

## Concepto Central

**"Consola profesional de criterio jurídico"** – No es un chat, no es un buscador, es una herramienta de trabajo para abogados civilistas que impone metodología y rigor.

> [!CAUTION]
> **Prohibición absoluta de chat libre:**
> - No existe ningún input de texto abierto sin contexto
> - Toda interacción es a través de flujos estructurados por capacidad
> - Los formularios definen qué información se requiere
> - El sistema guía al usuario, no al revés

---

## Arquitectura de Pantallas

```
┌─────────────────────────────────────────────────────────────────┐
│                        ALCANCE LEGAL                            │
│                  Inteligencia Jurídica Civil                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐              │
│   │  ANALIZAR │    │  AUDITAR  │    │  REDACTAR │              │
│   │   CASO    │    │ ESTRATEGIA│    │  ESCRITO  │              │
│   └───────────┘    └───────────┘    └───────────┘              │
│                                                                 │
│   Seleccione la capacidad profesional que requiere             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flujo: ANALIZAR CASO

### Paso 1: Clasificación
```
┌─────────────────────────────────────────────────────────────────┐
│  ANALIZAR CASO CIVIL                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tipo de materia:                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  Contratos  │ │   Daños     │ │ Sucesiones  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│  ┌─────────────┐ ┌─────────────┐                               │
│  │ Ejecuciones │ │Obligaciones │                               │
│  └─────────────┘ └─────────────┘                               │
│                                                                 │
│  ⚠️ Consultas de otros fueros serán rechazadas                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Paso 2: Datos del Caso (formulario estructurado)
```
┌─────────────────────────────────────────────────────────────────┐
│  ANALIZAR CASO > Contratos                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Situación fáctica *                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Describa los hechos relevantes del caso...              │   │
│  │ (mínimo 100 caracteres)                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Pretensión del cliente *                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ¿Qué busca obtener el cliente?                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Documentación disponible                                       │
│  [ ] Contrato escrito                                          │
│  [ ] Intercambio de emails/mensajes                            │
│  [ ] Facturas/recibos                                          │
│  [ ] Otros: ________________                                   │
│                                                                 │
│  Jurisdicción *                                                 │
│  [▼ Seleccione provincia ]                                     │
│                                                                 │
│  ┌─────────────┐                                               │
│  │  ANALIZAR   │                                               │
│  └─────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Paso 3: Resultado Profesional
```
┌─────────────────────────────────────────────────────────────────┐
│  RESULTADO DEL ANÁLISIS                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  VIABILIDAD: ████████░░ MEDIA                                  │
│                                                                 │
│  ┌─ ANÁLISIS ──────────────────────────────────────────────┐   │
│  │ [Texto del análisis jurídico profesional...]            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ FUNDAMENTOS ───────────────────────────────────────────┐   │
│  │ 📚 CNComercial, Sala A, 15/03/2023 - "López c/ Gómez"  │   │
│  │    "El incumplimiento parcial no libera..."             │   │
│  │                                                          │   │
│  │ 📋 Metodología: Análisis de contratos bilaterales       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️ RIESGOS IDENTIFICADOS                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔴 ALTO: Prescripción cercana (6 meses)                 │   │
│  │    Mitigación: Interponer demanda antes de [fecha]      │   │
│  │                                                          │   │
│  │ 🟡 MEDIO: Prueba documental incompleta                  │   │
│  │    Mitigación: Solicitar exhibición de documentos       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📌 ADVERTENCIAS                                                │
│  • Este análisis no reemplaza el criterio del abogado          │
│  • Verificar vigencia de jurisprudencia citada                 │
│  • Datos proporcionados determinan alcance del análisis        │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  EXPORTAR   │  │  HISTORIAL  │  │NUEVA CONSULTA│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pantalla de RECHAZO

```
┌─────────────────────────────────────────────────────────────────┐
│  CONSULTA NO ADMITIDA                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⛔ Fuero excluido                                              │
│                                                                 │
│  La consulta presentada corresponde al FUERO LABORAL,          │
│  que se encuentra expresamente excluido del alcance de         │
│  este sistema.                                                  │
│                                                                 │
│  Alcance Legal – Civil opera exclusivamente en:                │
│  • Contratos civiles                                           │
│  • Responsabilidad civil y daños                               │
│  • Obligaciones                                                │
│  • Sucesiones                                                  │
│  • Ejecuciones civiles                                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 💡 Si su consulta tiene componentes civiles, puede      │   │
│  │    reformularla enfocándose exclusivamente en           │   │
│  │    esos aspectos.                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │ REFORMULAR      │                                           │
│  └─────────────────┘                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Componentes de Diseño

### Paleta de Colores
| Uso | Color | Código |
|-----|-------|--------|
| Primario | Azul profundo | #1a365d |
| Secundario | Gris profesional | #4a5568 |
| Acento | Dorado sobrio | #b7791f |
| Éxito | Verde | #276749 |
| Advertencia | Ámbar | #c05621 |
| Riesgo alto | Rojo | #9b2c2c |

### Tipografía
- Títulos: **Inter** (weight 600)
- Cuerpo: **Inter** (weight 400)
- Código/Citas: **JetBrains Mono**

### Principios de Interacción
1. **Inputs obligatorios** → Campos mínimos marcados como requeridos
2. **Validación contextual** → Mensajes que educan, no solo validan
3. **Progresión clara** → Pasos numerados, breadcrumb visible
4. **Outputs diferenciados** → Secciones visuales claras (análisis, riesgos, advertencias)
5. **Rechazos dignos** → Pantalla completa, no un simple error
