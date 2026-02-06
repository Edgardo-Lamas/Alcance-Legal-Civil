import { useLocation, useNavigate } from 'react-router-dom'
import './Resultado.css'

// Datos de ejemplo para demostración
const ejemploAnalisis = {
    viabilidad: 75,
    viabilidadLabel: 'MEDIA-ALTA',
    analisis: `La pretensión del cliente presenta fundamentos jurídicos sólidos basados en el incumplimiento contractual documentado. La existencia de contrato escrito y la correspondencia que acredita el reclamo previo fortalecen significativamente la posición del actor.

Sin embargo, se identifican aspectos que requieren atención antes de proceder con la demanda judicial, particularmente en lo relativo a la cuantificación del daño y la acreditación de la relación causal.`,
    fundamentos: [
        {
            tipo: 'jurisprudencia',
            fuente: 'CNCiv, Sala A, 15/03/2023 - "López c/ Gómez"',
            extracto: '"El incumplimiento parcial de las obligaciones contractuales no libera al deudor de responder por los daños derivados..."'
        },
        {
            tipo: 'metodologia',
            fuente: 'Metodología de Análisis Contractual',
            extracto: 'Aplicación del esquema de análisis de contratos bilaterales según criterio adoptado.'
        }
    ],
    riesgos: [
        {
            nivel: 'alto',
            descripcion: 'Prescripción cercana',
            detalle: 'El plazo de prescripción vence en aproximadamente 6 meses.',
            mitigacion: 'Interponer demanda antes de la fecha límite o gestionar reconocimiento de deuda.'
        },
        {
            nivel: 'medio',
            descripcion: 'Prueba documental incompleta',
            detalle: 'No se cuenta con recibos de pago parcial mencionados en los hechos.',
            mitigacion: 'Solicitar exhibición de documentos o producir prueba informativa a entidades bancarias.'
        }
    ],
    advertencias: [
        'Este análisis no reemplaza el criterio del abogado actuante.',
        'Verificar vigencia de jurisprudencia citada antes de su utilización.',
        'Los datos proporcionados determinan el alcance del análisis.'
    ]
}

const ejemploAuditoria = {
    consistencia: 'PARCIAL',
    observaciones: [
        {
            tipo: 'supuesto_implicito',
            descripcion: 'Se asume que la contraparte no cuestionará la validez del contrato.',
            impacto: 'Si la validez es cuestionada, la estrategia probatoria actual sería insuficiente.'
        },
        {
            tipo: 'inconsistencia',
            descripcion: 'El objetivo de obtener daños punitivos contradice la etapa procesal declarada.',
            impacto: 'Los daños punitivos requieren fundamentación diferenciada no contemplada.'
        }
    ],
    recomendaciones: [
        'Incorporar línea argumental subsidiaria para el supuesto de cuestionamiento contractual.',
        'Reformular pretensión de daños punitivos o desarrollar fundamentación específica.',
        'Considerar prueba pericial contable para acreditar cuantificación del daño.'
    ]
}

const ejemploRedaccion = {
    tipo: 'Demanda',
    estado: 'BORRADOR',
    contenido: `PROMUEVE DEMANDA POR INCUMPLIMIENTO CONTRACTUAL

Sr. Juez:

[Nombre del letrado], abogado, T° [...] F° [...] del C.P.A.C.F., constituyendo domicilio electrónico en [...] y domicilio procesal en [...], en representación de [NOMBRE DEL ACTOR], según poder que se adjunta, a V.S. respetuosamente digo:

I. OBJETO
Que vengo a promover formal demanda por incumplimiento contractual contra [NOMBRE DEL DEMANDADO], con domicilio en [...], por la suma de PESOS [MONTO] ($[...]) o lo que en más o en menos resulte de la prueba a producirse, con más sus intereses y costas.

II. HECHOS
[Sección que requiere desarrollo específico según los hechos del caso]

...`,
    secciones_pendientes: [
        { seccion: 'II. HECHOS', motivo: 'Requiere desarrollo detallado según cronología del caso' },
        { seccion: 'III. DERECHO', motivo: 'Ajustar citas normativas a jurisdicción específica' },
        { seccion: 'V. PRUEBA', motivo: 'Completar ofrecimiento según documentación disponible' }
    ]
}

function Resultado() {
    const location = useLocation()
    const navigate = useNavigate()
    const { capacidad, data } = location.state || {}

    // Si no hay datos, mostrar mensaje y redirigir
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

    const renderAnalisis = () => (
        <>
            {/* Viabilidad */}
            <div className="resultado__viabilidad">
                <span className="resultado__viabilidad-label">VIABILIDAD:</span>
                <div className="resultado__viabilidad-bar">
                    <div
                        className="resultado__viabilidad-fill"
                        style={{ width: `${ejemploAnalisis.viabilidad}%` }}
                    />
                </div>
                <span className={`resultado__viabilidad-value resultado__viabilidad-value--${ejemploAnalisis.viabilidad >= 70 ? 'alta' : ejemploAnalisis.viabilidad >= 40 ? 'media' : 'baja'}`}>
                    {ejemploAnalisis.viabilidadLabel}
                </span>
            </div>

            {/* Análisis */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">📋</span>
                    Análisis
                </h2>
                <div className="resultado__content">
                    {ejemploAnalisis.analisis.split('\n\n').map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>
            </section>

            {/* Fundamentos */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">📚</span>
                    Fundamentos
                </h2>
                <div className="resultado__fundamentos">
                    {ejemploAnalisis.fundamentos.map((f, i) => (
                        <div key={i} className={`resultado__fundamento resultado__fundamento--${f.tipo}`}>
                            <span className="resultado__fundamento-tipo">
                                {f.tipo === 'jurisprudencia' ? '⚖️' : '📖'} {f.fuente}
                            </span>
                            <p className="resultado__fundamento-extracto">"{f.extracto}"</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Riesgos */}
            <section className="resultado__section resultado__section--riesgos">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">⚠️</span>
                    Riesgos Identificados
                </h2>
                <div className="resultado__riesgos">
                    {ejemploAnalisis.riesgos.map((r, i) => (
                        <div key={i} className={`resultado__riesgo resultado__riesgo--${r.nivel}`}>
                            <div className="resultado__riesgo-header">
                                <span className={`resultado__riesgo-badge resultado__riesgo-badge--${r.nivel}`}>
                                    {r.nivel.toUpperCase()}
                                </span>
                                <span className="resultado__riesgo-titulo">{r.descripcion}</span>
                            </div>
                            <p className="resultado__riesgo-detalle">{r.detalle}</p>
                            <p className="resultado__riesgo-mitigacion">
                                <strong>Mitigación:</strong> {r.mitigacion}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Advertencias */}
            <section className="resultado__advertencias">
                <h3>📌 Advertencias</h3>
                <ul>
                    {ejemploAnalisis.advertencias.map((a, i) => (
                        <li key={i}>{a}</li>
                    ))}
                </ul>
            </section>
        </>
    )

    const renderAuditoria = () => (
        <>
            {/* Consistencia */}
            <div className="resultado__consistencia">
                <span>Consistencia de la Estrategia:</span>
                <span className={`resultado__consistencia-valor resultado__consistencia-valor--${ejemploAuditoria.consistencia.toLowerCase()}`}>
                    {ejemploAuditoria.consistencia}
                </span>
            </div>

            {/* Observaciones */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">🔍</span>
                    Observaciones
                </h2>
                <div className="resultado__observaciones">
                    {ejemploAuditoria.observaciones.map((o, i) => (
                        <div key={i} className={`resultado__observacion resultado__observacion--${o.tipo}`}>
                            <span className="resultado__observacion-tipo">
                                {o.tipo === 'supuesto_implicito' ? '💭 Supuesto Implícito' : '⚡ Inconsistencia'}
                            </span>
                            <p>{o.descripcion}</p>
                            <p className="resultado__observacion-impacto">
                                <strong>Impacto:</strong> {o.impacto}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recomendaciones */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">✅</span>
                    Recomendaciones
                </h2>
                <ul className="resultado__recomendaciones">
                    {ejemploAuditoria.recomendaciones.map((r, i) => (
                        <li key={i}>{r}</li>
                    ))}
                </ul>
            </section>
        </>
    )

    const renderRedaccion = () => (
        <>
            {/* Estado del Borrador */}
            <div className="resultado__borrador-estado">
                <span className="resultado__borrador-tipo">{ejemploRedaccion.tipo}</span>
                <span className="resultado__borrador-badge">{ejemploRedaccion.estado}</span>
            </div>

            {/* Contenido */}
            <section className="resultado__section">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">📝</span>
                    Borrador Generado
                </h2>
                <pre className="resultado__borrador-contenido">
                    {ejemploRedaccion.contenido}
                </pre>
            </section>

            {/* Secciones Pendientes */}
            <section className="resultado__section resultado__section--pendientes">
                <h2 className="resultado__section-title">
                    <span className="resultado__section-icon">🔔</span>
                    Secciones que Requieren Atención
                </h2>
                <div className="resultado__pendientes">
                    {ejemploRedaccion.secciones_pendientes.map((s, i) => (
                        <div key={i} className="resultado__pendiente">
                            <span className="resultado__pendiente-seccion">{s.seccion}</span>
                            <span className="resultado__pendiente-motivo">{s.motivo}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Advertencia importante */}
            <div className="resultado__borrador-warning">
                <strong>⚠️ ADVERTENCIA:</strong> Este es un BORRADOR ASISTIDO que requiere revisión profesional completa antes de su presentación. El abogado actuante es responsable de verificar y aprobar todo el contenido.
            </div>
        </>
    )

    const titulos = {
        analizar: 'Resultado del Análisis',
        auditar: 'Resultado de la Auditoría',
        redactar: 'Borrador Generado'
    }

    return (
        <div className="resultado">
            <header className="resultado__header">
                <button className="resultado__back" onClick={() => navigate(-1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver
                </button>
                <h1 className="resultado__title">{titulos[capacidad]}</h1>
            </header>

            <main className="resultado__main">
                {capacidad === 'analizar' && renderAnalisis()}
                {capacidad === 'auditar' && renderAuditoria()}
                {capacidad === 'redactar' && renderRedaccion()}
            </main>

            <footer className="resultado__actions">
                <button className="btn btn--secondary" onClick={() => navigate('/')}>
                    Nueva Consulta
                </button>
                <button className="btn btn--primary">
                    Exportar PDF
                </button>
            </footer>
        </div>
    )
}

export default Resultado
