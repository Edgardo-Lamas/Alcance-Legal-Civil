# Base de Conocimiento - Alcance Legal Civil

Esta carpeta contiene la documentación curada que alimenta el sistema RAG de Alcance Legal.

## Estructura

```
knowledge/
├── civil/                    # Fuero Civil
│   ├── contratos/           # Contratos civiles
│   ├── danos/               # Daños y perjuicios
│   ├── sucesiones/          # Sucesiones
│   ├── ejecuciones/         # Ejecuciones
│   └── obligaciones/        # Obligaciones
├── metodologia/             # Metodología de análisis
│   ├── analisis/            # Esquemas de análisis
│   ├── auditoria/           # Frameworks de auditoría
│   └── redaccion/           # Pautas de redacción
├── jurisprudencia/          # Jurisprudencia curada
│   └── civil/               # Por fuero
└── templates/               # Templates de escritos
    ├── demandas/            # Modelos de demandas
    ├── contestaciones/      # Contestaciones
    └── recursos/            # Recursos
```

## Formato de Documentos

Los documentos deben seguir el formato Markdown con frontmatter YAML:

```markdown
---
titulo: Nombre del documento
tipo: [jurisprudencia|metodologia|template|normativa]
fuero: civil
materia: contratos
tags: [incumplimiento, resolucion, daños]
fecha_actualizacion: 2026-02-06
version: 1.0
---

# Contenido del documento

...
```

## Uso en el Sistema

1. Los documentos son indexados por Supabase Vector Store
2. Las consultas se procesan vía n8n con embeddings
3. Los resultados relevantes se inyectan en el contexto del LLM
