import './Manual.css'

const manualContent = {
    api: {
        title: 'Manual de Uso de la API',
        sections: [
            {
                title: '1. Filosofía de la API',
                content: 'La API de Alcance Legal no es un motor de chat genérico. Es un sistema de inteligencia jurídica aplicada que opera bajo metodología jurídica definida y Ground Truth curado.'
            },
            {
                title: '2. Endpoints Principales',
                items: [
                    { label: 'Análisis de Caso', detail: 'Determina la viabilidad técnica preliminar basada en hechos y pretensiones.' },
                    { label: 'Auditoría de Estrategia', detail: 'Detecta inconsistencias y supuestos implícitos en una estrategia propuesta.' },
                    { label: 'Redacción Asistida', detail: 'Genera borradores técnicos con señalamiento de secciones pendientes.' }
                ]
            },
            {
                title: '3. Perfiles y Alcance',
                content: 'Actualmente operativo en Fuero Civil. Los fueros de Familia y Comercial se encuentran en desarrollo. El fuero Penal está expresamente excluido.'
            }
        ]
    },
    usuario: {
        title: 'Guía de Navegación',
        sections: [
            {
                title: '🔍 Analizar Caso',
                content: 'Use esta opción al recibir un cliente nuevo. Ingrese la situación fáctica detallada, la pretensión y la documentación disponible. Recibirá un índice de viabilidad, análisis de elementos constitutivos y riesgos detectados.'
            },
            {
                title: '📋 Auditar Estrategia',
                content: 'Para cuando ya tiene una teoría del caso. Describa su línea argumental y etapa procesal. Recibirá un dictamen de consistencia, supuestos implícitos e inconsistencias.'
            },
            {
                title: '✍️ Redactar Escrito',
                content: 'Genera borradores estructurados con secciones profesionales. Las partes pendientes se marcan claramente. TODO borrador requiere revisión profesional obligatoria.'
            },
            {
                title: '📊 Flujo Recomendado',
                content: '1° Analice → 2° Audite → 3° Redacte. Este orden evita invertir tiempo en casos inviables y asegura coherencia entre estrategia y documento.'
            },
            {
                title: '🚦 Indicadores',
                items: [
                    { label: 'Rojo (Crítico)', detail: 'Atención inmediata: prescripción, plazos procesales.' },
                    { label: 'Amarillo (Advertencia)', detail: 'Elemento a profundizar o validar con el cliente.' },
                    { label: 'Verde (Consistencia)', detail: 'Fundamentación sólida, puede avanzar.' }
                ]
            },
            {
                title: '❓ Preguntas Frecuentes',
                items: [
                    { label: '¿Puedo usar borradores directamente?', detail: 'No. Son puntos de partida que requieren su criterio profesional.' },
                    { label: '¿Qué fueros cubre?', detail: 'Solo Fuero Civil. Penal está expresamente excluido.' },
                    { label: '¿Y si rechaza mi consulta?', detail: 'Revise el mensaje y reformule con más información.' }
                ]
            }
        ]
    }
}

function ManualPage() {
    return (
        <div className="manual-page">
            <header className="manual-page__header">
                <h1 className="manual-page__title">Centro de Ayuda y Documentación</h1>
                <p className="manual-page__subtitle">Guía técnica y funcional de Alcance Legal</p>
            </header>

            <div className="manual-page__grid">
                <section className="manual-section">
                    <div className="manual-section__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    </div>
                    <h2 className="manual-section__title">{manualContent.api.title}</h2>
                    {manualContent.api.sections.map((s, idx) => (
                        <div key={idx} className="manual-section__block">
                            <h3>{s.title}</h3>
                            {s.content && <p>{s.content}</p>}
                            {s.items && (
                                <ul className="manual-section__list">
                                    {s.items.map((item, i) => (
                                        <li key={i}>
                                            <strong>{item.label}:</strong> {item.detail}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>

                <section className="manual-section">
                    <div className="manual-section__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 19l7-7 3 3-7 7-3-3z" />
                            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                            <path d="M2 2l7.586 7.586" />
                            <circle cx="11" cy="11" r="2" />
                        </svg>
                    </div>
                    <h2 className="manual-section__title">{manualContent.usuario.title}</h2>
                    {manualContent.usuario.sections.map((s, idx) => (
                        <div key={idx} className="manual-section__block">
                            <h3>{s.title}</h3>
                            {s.content && <p>{s.content}</p>}
                            {s.items && (
                                <ul className="manual-section__list">
                                    {s.items.map((item, i) => (
                                        <li key={i}>
                                            <strong>{item.label}:</strong> {item.detail}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>
            </div>

            <footer className="manual-page__footer">
                <p>
                    Para más detalles técnicos, consulte los archivos <code>docs/manual_uso_api.md</code> y <code>docs/guia_navegacion_usuario.md</code> en el repositorio.
                </p>
            </footer>
        </div>
    )
}

export default ManualPage
