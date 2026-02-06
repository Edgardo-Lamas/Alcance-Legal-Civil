# Decisiones de Arquitectura – Alcance Legal Civil

> **Documento rector**: Estas decisiones son definitivas y no deben reinterpretarse sin consulta.

---

## Stack Tecnológico

| Capa | Tecnología | Rol |
|------|------------|-----|
| Orquestador | **n8n** | Lógica decisoria, razonamiento jurídico, secuencia de análisis |
| Base de datos | **Supabase** | PostgreSQL, Auth, Storage, Vector Store (RAG) |
| Frontend | **React + Vite** | Consola profesional de criterio jurídico |
| API | **Fachada** | Recibe requests → valida → dispara n8n → devuelve |

---

## Principios Arquitectónicos

1. **Todo el criterio vive en n8n** – No duplicar lógica decisoria fuera de workflows
2. **knowledge/ es la constitución** – Data estructurada, sin UI, no navegable
3. **Endpoints = Capacidades profesionales** – No acciones técnicas genéricas
4. **Rechazo fundado es respuesta válida** – El sistema dice "no" cuando corresponde

---

## Principios de UX (Obligatorios)

- ❌ No chat libre como interfaz principal
- ❌ No clones de herramientas AI existentes
- ✅ Flujos guiados por capacidad (analizar / auditar / redactar)
- ✅ Inputs estructurados que obliguen a pensar jurídicamente
- ✅ Outputs profesionales con advertencias, riesgos, inconsistencias
- ✅ Lenguaje sobrio y profesional

**Posicionamiento**: Primera plataforma de inteligencia jurídica civil con criterio decisorio en Argentina.

---

## Capacidades del Sistema (Endpoints)

| Capacidad | Descripción |
|-----------|-------------|
| Analizar caso | Análisis jurídico de situaciones civiles |
| Auditar estrategia | Revisión de estrategias procesales |
| Asistir redacción | Generación validada de escritos civiles |

Cada capacidad incluye obligatoriamente:
1. Validación de admisibilidad (fuero civil)
2. Consulta RAG sobre base curada
3. Razonamiento guiado según metodología
4. Validación de salida contra guía rectora
