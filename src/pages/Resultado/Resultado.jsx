import { useLocation, useNavigate } from 'react-router-dom'
import './Resultado.css'

// Datos de ejemplo para demostración - reflejan estructura de respuesta real del sistema
const ejemploAnalisis = {
    // Metadatos del informe
    numero_informe: 'ALC-2026-001547',
    fecha_emision: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
    estado: 'INFORME PRELIMINAR',
    estado_detalle: 'Pendiente de validación por el profesional actuante',

    // Evaluación de viabilidad
    viabilidad: {
        valor: 75,
        clasificacion: 'MEDIA-ALTA',
        explicacion: 'La pretensión presenta fundamentos jurídicos sustentables, aunque existen factores de riesgo que requieren atención estratégica antes de iniciar la acción.',
        advertencia_metodologica: 'Esta evaluación se basa exclusivamente en la información proporcionada. Factores no declarados pueden alterar sustancialmente el pronóstico.'
    },

    // Síntesis ejecutiva
    sintesis: `La pretensión del cliente presenta fundamentos jurídicos sólidos basados en el incumplimiento contractual documentado. La existencia de contrato escrito y la correspondencia que acredita el reclamo previo fortalecen significativamente la posición del actor.

Sin embargo, se identifican aspectos críticos que requieren atención inmediata antes de proceder con la demanda judicial, particularmente en lo relativo a la cuantificación del daño y la acreditación de la relación causal.`,

    // Fundamentos identificados
    fundamentos: [
        {
            tipo: 'jurisprudencia',
            fuente: 'CNCiv, Sala A, 15/03/2023 - "López c/ Gómez"',
            extracto: '"El incumplimiento parcial de las obligaciones contractuales no libera al deudor de responder por los daños derivados..."',
            relevancia: 'Aplicable al caso en análisis por tratarse de incumplimiento contractual con pretensión resarcitoria.'
        },
        {
            tipo: 'metodologia',
            fuente: 'Metodología de Análisis de Contratos Bilaterales',
            extracto: 'Aplicación del esquema de análisis según criterio metodológico adoptado por el sistema.',
            relevancia: 'Marco conceptual para la evaluación de las obligaciones recíprocas y sus consecuencias.'
        }
    ],

    // Matriz de riesgos
    riesgos: [
        {
            nivel: 'alto',
            codigo: 'R-001',
            descripcion: 'Prescripción cercana',
            detalle: 'El plazo de prescripción de la acción vence en aproximadamente 6 meses desde la fecha de este informe.',
            consecuencia: 'La inacción resultaría en la pérdida definitiva del derecho a reclamar judicialmente.',
            mitigacion: 'Interponer demanda judicial antes de la fecha límite o gestionar reconocimiento de deuda que interrumpa el curso de la prescripción.',
            urgencia: true
        },
        {
            nivel: 'medio',
            codigo: 'R-002',
            descripcion: 'Prueba documental incompleta',
            detalle: 'No se ha referido documentación que acredite los pagos parciales mencionados en el relato fáctico.',
            consecuencia: 'Dificultad para acreditar el monto exacto del reclamo en sede judicial.',
            mitigacion: 'Solicitar exhibición de documentos a la contraparte o producir prueba informativa a entidades bancarias.',
            urgencia: false
        }
    ],

    // Advertencias institucionales
    advertencias: {
        principal: 'Este informe NO constituye consejo legal definitivo. Es un insumo técnico que debe ser validado por el profesional actuante antes de tomar decisiones procesales.',
        items: [
            'La evaluación de viabilidad es probabilística, no determinante del resultado judicial.',
            'Verificar vigencia de jurisprudencia citada antes de su utilización en escritos.',
            'Los datos proporcionados por el usuario determinan el alcance y precisión del análisis.',
            'Factores procesales locales pueden afectar la estrategia recomendada.'
        ]
    }
}

const ejemploAuditoria = {
    numero_informe: 'ALC-AUD-2026-000892',
    fecha_emision: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
    estado: 'DICTAMEN DE AUDITORÍA',
    estado_detalle: 'Requiere revisión de los puntos señalados',

    // Evaluación de consistencia
    consistencia: {
        valor: 'PARCIAL',
        explicacion: 'La estrategia presenta líneas argumentales sólidas pero contiene supuestos implícitos no validados e inconsistencias que podrían afectar su efectividad.',
        advertencia: 'Se recomienda revisar los puntos señalados antes de avanzar con la ejecución de la estrategia.'
    },

    // Observaciones críticas
    observaciones: [
        {
            tipo: 'supuesto_implicito',
            codigo: 'OBS-001',
            descripcion: 'Se asume que la contraparte no cuestionará la validez del contrato.',
            impacto: 'Si la validez del instrumento es cuestionada, la estrategia probatoria actual resultaría insuficiente para sostener la pretensión.',
            severidad: 'media'
        },
        {
            tipo: 'inconsistencia',
            codigo: 'OBS-002',
            descripcion: 'El objetivo de obtener daños punitivos contradice la etapa procesal declarada.',
            impacto: 'Los daños punitivos requieren fundamentación diferenciada (art. 52 bis LDC) no contemplada en la estrategia propuesta.',
            severidad: 'alta'
        }
    ],

    // Recomendaciones
    recomendaciones: [
        {
            prioridad: 'alta',
            accion: 'Incorporar línea argumental subsidiaria para el supuesto de cuestionamiento de validez contractual.'
        },
        {
            prioridad: 'alta',
            accion: 'Reformular pretensión de daños punitivos o desarrollar fundamentación normativa específica.'
        },
        {
            prioridad: 'media',
            accion: 'Considerar prueba pericial contable para acreditar cuantificación del daño con mayor precisión.'
        }
    ],

    advertencias: {
        principal: 'La auditoría detecta patrones potencialmente problemáticos. La decisión final sobre la estrategia corresponde al profesional actuante.',
        items: [
            'Este dictamen evalúa consistencia lógica, no garantiza resultados procesales.',
            'Supuestos no declarados pueden contener riesgos adicionales no identificados.',
            'La validación final de la estrategia requiere conocimiento del contexto judicial específico.'
        ]
    }
}

const ejemploRedaccion = {
    numero_informe: 'ALC-RED-2026-002341',
    fecha_emision: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
    estado: 'BORRADOR ASISTIDO',
    estado_detalle: 'Documento de trabajo - NO PRESENTAR sin revisión profesional',

    tipo_escrito: 'Demanda por Incumplimiento Contractual',

    contenido: `PROMUEVE DEMANDA POR INCUMPLIMIENTO CONTRACTUAL

Sr. Juez:

[Nombre del letrado], abogado, T° [...] F° [...] del C.P.A.C.F., constituyendo domicilio electrónico en [...] y domicilio procesal en [...], en representación de [NOMBRE DEL ACTOR], según poder que se adjunta, a V.S. respetuosamente digo:

I. OBJETO
Que vengo a promover formal demanda por incumplimiento contractual contra [NOMBRE DEL DEMANDADO], con domicilio en [...], por la suma de PESOS [MONTO] ($[...]) o lo que en más o en menos resulte de la prueba a producirse, con más sus intereses y costas.

II. HECHOS
[SECCIÓN PENDIENTE - Requiere desarrollo según cronología del caso]

III. DERECHO
[SECCIÓN PENDIENTE - Ajustar fundamentación a jurisdicción específica]

...`,

    secciones_pendientes: [
        {
            seccion: 'II. HECHOS',
            motivo: 'Requiere desarrollo detallado según cronología específica del caso',
            criticidad: 'alta'
        },
        {
            seccion: 'III. DERECHO',
            motivo: 'Ajustar citas normativas a la jurisdicción y fuero correspondiente',
            criticidad: 'alta'
        },
        {
            seccion: 'V. PRUEBA',
            motivo: 'Completar ofrecimiento según documentación efectivamente disponible',
            criticidad: 'media'
        },
        {
            seccion: 'PETITORIO',
            motivo: 'Verificar monto reclamado y accesorios solicitados',
            criticidad: 'alta'
        }
    ],

    advertencias: {
        principal: 'ADVERTENCIA CRÍTICA: Este documento es un BORRADOR DE TRABAJO generado por asistencia automatizada. Su presentación judicial sin revisión profesional completa constituye ejercicio inadecuado de la profesión.',
        items: [
            'El letrado firmante asume responsabilidad exclusiva por el contenido presentado.',
            'Verificar datos de las partes, montos y fechas antes de cualquier uso.',
            'Las citas legales deben ser validadas contra normativa vigente.',
            'El estilo y estructura pueden requerir ajustes según práctica del fuero.'
        ]
    }
}

function Resultado() {
    const location = useLocation()
    const navigate = useNavigate()
    const { capacidad, data } = location.state || {}

    if (!capacidad) {
        return (
            <div className="resultado resultado--vacio">
                <h1>No hay resultados para mostrar</h1>
                <p>Debe completar un formulario de consulta primero.</p>
                <button className="btn btn--primary" onClick={() => navigate('/')}>
                    Ir al Dashboard
                </button>
            </div>
        )
    }

    // Usar datos del API si están disponibles, sino fallback a ejemplos
    const informe = data || (capacidad === 'analizar' ? ejemploAnalisis
        : capacidad === 'auditar' ? ejemploAuditoria
            : ejemploRedaccion)

    const titulos = {
        analizar: 'Informe de Análisis Jurídico',
        auditar: 'Dictamen de Auditoría Estratégica',
        redactar: 'Borrador de Escrito Judicial'
    }

    const renderEncabezado = () => (
        <div className="resultado__encabezado-informe">
            <div className="resultado__encabezado-meta">
                <span className="resultado__numero-informe">N° {informe.numero_informe}</span>
                <span className="resultado__fecha-informe">{informe.fecha_emision}</span>
            </div>
            <div className={`resultado__estado-badge resultado__estado-badge--${capacidad}`}>
                <span className="resultado__estado-label">{informe.estado}</span>
                <span className="resultado__estado-detalle">{informe.estado_detalle}</span>
            </div>
        </div>
    )

    const renderAnalisis = () => (
        <>
            {renderEncabezado()}

            {/* Indicador de Viabilidad con Contexto Completo */}
            <section className="resultado__viabilidad-section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">📊</span>
                    Evaluación de Viabilidad
                </h2>

                <div className="resultado__viabilidad-card">
                    <div className="resultado__viabilidad-indicador">
                        <div className="resultado__viabilidad-visual">
                            <div className="resultado__viabilidad-bar">
                                <div
                                    className="resultado__viabilidad-fill"
                                    style={{ width: `${informe.viabilidad.valor}%` }}
                                />
                            </div>
                            <span className={`resultado__viabilidad-valor resultado__viabilidad-valor--${informe.viabilidad.valor >= 70 ? 'alta' : informe.viabilidad.valor >= 40 ? 'media' : 'baja'}`}>
                                {informe.viabilidad.clasificacion}
                            </span>
                        </div>
                    </div>

                    <div className="resultado__viabilidad-explicacion">
                        <p className="resultado__viabilidad-texto">{informe.viabilidad.explicacion}</p>
                    </div>

                    <div className="resultado__viabilidad-advertencia">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <p>{informe.viabilidad.advertencia_metodologica}</p>
                    </div>
                </div>
            </section>

            {/* Síntesis Ejecutiva */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">📋</span>
                    Síntesis Ejecutiva
                </h2>
                <div className="resultado__content">
                    {informe.sintesis.split('\n\n').map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>
            </section>

            {/* Fundamentos */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">📚</span>
                    Fundamentos Identificados
                </h2>
                <div className="resultado__fundamentos">
                    {informe.fundamentos.map((f, i) => (
                        <div key={i} className={`resultado__fundamento resultado__fundamento--${f.tipo}`}>
                            <div className="resultado__fundamento-header">
                                <span className="resultado__fundamento-tipo">
                                    {f.tipo === 'jurisprudencia' ? '⚖️ Jurisprudencia' : '📖 Metodología'}
                                </span>
                            </div>
                            <p className="resultado__fundamento-fuente">{f.fuente}</p>
                            <blockquote className="resultado__fundamento-extracto">"{f.extracto}"</blockquote>
                            <p className="resultado__fundamento-relevancia">
                                <strong>Relevancia:</strong> {f.relevancia}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Matriz de Riesgos */}
            <section className="resultado__section resultado__section--riesgos">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">⚠️</span>
                    Matriz de Riesgos
                </h2>
                <div className="resultado__riesgos">
                    {informe.riesgos.map((r, i) => (
                        <div key={i} className={`resultado__riesgo resultado__riesgo--${r.nivel}`}>
                            <div className="resultado__riesgo-header">
                                <span className="resultado__riesgo-codigo">{r.codigo}</span>
                                <span className={`resultado__riesgo-badge resultado__riesgo-badge--${r.nivel}`}>
                                    {r.nivel.toUpperCase()}
                                    {r.urgencia && ' • URGENTE'}
                                </span>
                            </div>
                            <h4 className="resultado__riesgo-titulo">{r.descripcion}</h4>
                            <p className="resultado__riesgo-detalle">{r.detalle}</p>
                            <p className="resultado__riesgo-consecuencia">
                                <strong>Consecuencia:</strong> {r.consecuencia}
                            </p>
                            <p className="resultado__riesgo-mitigacion">
                                <strong>Mitigación recomendada:</strong> {r.mitigacion}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Advertencias Institucionales */}
            <section className="resultado__advertencias-section">
                <div className="resultado__advertencia-principal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>{informe.advertencias.principal}</p>
                </div>
                <ul className="resultado__advertencias-lista">
                    {informe.advertencias.items.map((a, i) => (
                        <li key={i}>{a}</li>
                    ))}
                </ul>
            </section>
        </>
    )

    const renderAuditoria = () => (
        <>
            {renderEncabezado()}

            {/* Evaluación de Consistencia */}
            <section className="resultado__consistencia-section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">🎯</span>
                    Evaluación de Consistencia Estratégica
                </h2>

                <div className="resultado__consistencia-card">
                    <span className={`resultado__consistencia-valor resultado__consistencia-valor--${informe.consistencia.valor.toLowerCase()}`}>
                        {informe.consistencia.valor}
                    </span>
                    <p className="resultado__consistencia-explicacion">{informe.consistencia.explicacion}</p>
                    <div className="resultado__consistencia-advertencia">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <p>{informe.consistencia.advertencia}</p>
                    </div>
                </div>
            </section>

            {/* Observaciones Críticas */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">🔍</span>
                    Observaciones Críticas
                </h2>
                <div className="resultado__observaciones">
                    {informe.observaciones.map((o, i) => (
                        <div key={i} className={`resultado__observacion resultado__observacion--${o.severidad}`}>
                            <div className="resultado__observacion-header">
                                <span className="resultado__observacion-codigo">{o.codigo}</span>
                                <span className="resultado__observacion-tipo">
                                    {o.tipo === 'supuesto_implicito' ? '💭 Supuesto Implícito' : '⚡ Inconsistencia Detectada'}
                                </span>
                            </div>
                            <p className="resultado__observacion-descripcion">{o.descripcion}</p>
                            <p className="resultado__observacion-impacto">
                                <strong>Impacto potencial:</strong> {o.impacto}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recomendaciones */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">✅</span>
                    Recomendaciones de Acción
                </h2>
                <div className="resultado__recomendaciones-lista">
                    {informe.recomendaciones.map((r, i) => (
                        <div key={i} className={`resultado__recomendacion resultado__recomendacion--${r.prioridad}`}>
                            <span className="resultado__recomendacion-prioridad">
                                PRIORIDAD {r.prioridad.toUpperCase()}
                            </span>
                            <p>{r.accion}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Advertencias */}
            <section className="resultado__advertencias-section">
                <div className="resultado__advertencia-principal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>{informe.advertencias.principal}</p>
                </div>
                <ul className="resultado__advertencias-lista">
                    {informe.advertencias.items.map((a, i) => (
                        <li key={i}>{a}</li>
                    ))}
                </ul>
            </section>
        </>
    )

    const renderRedaccion = () => (
        <>
            {renderEncabezado()}

            {/* Alerta de Estado Crítico */}
            <div className="resultado__alerta-critica">
                <div className="resultado__alerta-icono">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </div>
                <div className="resultado__alerta-contenido">
                    <strong>DOCUMENTO DE TRABAJO</strong>
                    <p>Este borrador requiere revisión profesional completa antes de cualquier uso. El sistema identifica {informe.secciones_pendientes.length} secciones que requieren intervención del letrado.</p>
                </div>
            </div>

            {/* Tipo de Escrito */}
            <div className="resultado__tipo-escrito">
                <span className="resultado__tipo-escrito-label">Tipo de Escrito:</span>
                <span className="resultado__tipo-escrito-valor">{informe.tipo_escrito}</span>
            </div>

            {/* Secciones Pendientes de Revisión */}
            <section className="resultado__section resultado__section--pendientes">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">🔔</span>
                    Secciones Pendientes de Completar
                </h2>
                <div className="resultado__pendientes">
                    {informe.secciones_pendientes.map((s, i) => (
                        <div key={i} className={`resultado__pendiente resultado__pendiente--${s.criticidad}`}>
                            <div className="resultado__pendiente-header">
                                <span className="resultado__pendiente-seccion">{s.seccion}</span>
                                <span className={`resultado__pendiente-criticidad resultado__pendiente-criticidad--${s.criticidad}`}>
                                    {s.criticidad.toUpperCase()}
                                </span>
                            </div>
                            <p className="resultado__pendiente-motivo">{s.motivo}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contenido del Borrador */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">📝</span>
                    Borrador del Escrito
                </h2>
                <div className="resultado__borrador-container">
                    <div className="resultado__borrador-watermark">BORRADOR</div>
                    <pre className="resultado__borrador-contenido">
                        {informe.contenido}
                    </pre>
                </div>
            </section>

            {/* Advertencias Críticas */}
            <section className="resultado__advertencias-section resultado__advertencias-section--critica">
                <div className="resultado__advertencia-principal resultado__advertencia-principal--critica">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <p>{informe.advertencias.principal}</p>
                </div>
                <ul className="resultado__advertencias-lista">
                    {informe.advertencias.items.map((a, i) => (
                        <li key={i}>{a}</li>
                    ))}
                </ul>
            </section>
        </>
    )

    return (
        <div className="resultado">
            <header className="resultado__header">
                <button className="resultado__back" onClick={() => navigate(-1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver al formulario
                </button>
                <h1 className="resultado__title">{titulos[capacidad]}</h1>
                <p className="resultado__subtitle">Alcance Legal – Inteligencia Jurídica Civil</p>
            </header>

            <main className="resultado__main">
                {capacidad === 'analizar' && renderAnalisis()}
                {capacidad === 'auditar' && renderAuditoria()}
                {capacidad === 'redactar' && renderRedaccion()}
            </main>

            <footer className="resultado__footer">
                <div className="resultado__footer-disclaimer">
                    Este documento fue generado por Alcance Legal. Su uso está sujeto a los términos de servicio
                    y requiere validación profesional antes de cualquier aplicación práctica.
                </div>
                <div className="resultado__actions">
                    <button className="btn btn--secondary" onClick={() => navigate('/')}>
                        Nueva Consulta
                    </button>
                    <button className="btn btn--primary">
                        Exportar PDF
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default Resultado
