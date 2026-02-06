import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../services/api'
import '../Analizar/Analizar.css'

const etapasProcesales = [
    { value: 'demanda', label: 'Demanda' },
    { value: 'contestacion', label: 'Contestación' },
    { value: 'prueba', label: 'Etapa Probatoria' },
    { value: 'alegatos', label: 'Alegatos' },
    { value: 'ejecucion', label: 'Ejecución de Sentencia' },
]

function Auditar() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        etapa_procesal: '',
        estrategia_actual: '',
        objetivo_procesal: '',
        riesgos_identificados: '',
        contexto_adicional: ''
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.etapa_procesal) {
            newErrors.etapa_procesal = 'Seleccione la etapa procesal'
        }
        if (!formData.estrategia_actual || formData.estrategia_actual.length < 150) {
            newErrors.estrategia_actual = 'Describa la estrategia actual (mínimo 150 caracteres)'
        }
        if (!formData.objetivo_procesal) {
            newErrors.objetivo_procesal = 'Indique el objetivo procesal'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validate()) {
            setIsLoading(true)
            setErrors({})

            try {
                const response = await api.auditarEstrategia(formData)

                if (response.success) {
                    navigate('/resultado', {
                        state: {
                            capacidad: 'auditar',
                            data: response.data
                        }
                    })
                } else {
                    setErrors({ api: response.error || 'Error al procesar la consulta' })
                }
            } catch (error) {
                setErrors({ api: 'Error de conexión. Intente nuevamente.' })
            } finally {
                setIsLoading(false)
            }
        }
    }

    const charCount = formData.estrategia_actual.length

    return (
        <div className="analizar">
            <header className="analizar__header">
                <button className="analizar__back" onClick={() => navigate('/')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver
                </button>
                <h1 className="analizar__title">Auditar Estrategia Procesal</h1>
                <p className="analizar__subtitle">
                    Evalúe la consistencia de su estrategia, identifique supuestos implícitos y detecte riesgos no considerados.
                </p>
            </header>

            <form className="analizar__form" onSubmit={handleSubmit}>
                {/* Etapa Procesal */}
                <div className="form-group">
                    <label className="form-label">
                        Etapa Procesal Actual <span className="required">*</span>
                    </label>
                    <div className="form-options">
                        {etapasProcesales.map(etapa => (
                            <label
                                key={etapa.value}
                                className={`form-option ${formData.etapa_procesal === etapa.value ? 'form-option--selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="etapa_procesal"
                                    value={etapa.value}
                                    checked={formData.etapa_procesal === etapa.value}
                                    onChange={handleChange}
                                />
                                <span>{etapa.label}</span>
                            </label>
                        ))}
                    </div>
                    {errors.etapa_procesal && <span className="form-error">{errors.etapa_procesal}</span>}
                </div>

                {/* Estrategia Actual */}
                <div className="form-group">
                    <label className="form-label" htmlFor="estrategia_actual">
                        Estrategia Actual <span className="required">*</span>
                    </label>
                    <p className="form-hint">
                        Describa la estrategia procesal que está implementando o planea implementar.
                    </p>
                    <textarea
                        id="estrategia_actual"
                        name="estrategia_actual"
                        className={`form-textarea ${errors.estrategia_actual ? 'form-textarea--error' : ''}`}
                        rows="6"
                        value={formData.estrategia_actual}
                        onChange={handleChange}
                        placeholder="Describa su enfoque estratégico, líneas argumentales principales, pruebas a ofrecer, orden de presentación..."
                    />
                    <div className="form-textarea-footer">
                        <span className={`char-count ${charCount < 150 ? 'char-count--warning' : 'char-count--ok'}`}>
                            {charCount}/150 mínimo
                        </span>
                    </div>
                    {errors.estrategia_actual && <span className="form-error">{errors.estrategia_actual}</span>}
                </div>

                {/* Objetivo Procesal */}
                <div className="form-group">
                    <label className="form-label" htmlFor="objetivo_procesal">
                        Objetivo Procesal <span className="required">*</span>
                    </label>
                    <p className="form-hint">
                        ¿Qué resultado concreto busca obtener con esta estrategia?
                    </p>
                    <textarea
                        id="objetivo_procesal"
                        name="objetivo_procesal"
                        className={`form-textarea ${errors.objetivo_procesal ? 'form-textarea--error' : ''}`}
                        rows="3"
                        value={formData.objetivo_procesal}
                        onChange={handleChange}
                        placeholder="Ej: Obtener sentencia favorable que declare la resolución contractual con daños..."
                    />
                    {errors.objetivo_procesal && <span className="form-error">{errors.objetivo_procesal}</span>}
                </div>

                {/* Riesgos Identificados */}
                <div className="form-group">
                    <label className="form-label" htmlFor="riesgos_identificados">
                        Riesgos Ya Identificados
                    </label>
                    <p className="form-hint">
                        ¿Qué riesgos procesales o de fondo ya ha identificado?
                    </p>
                    <textarea
                        id="riesgos_identificados"
                        name="riesgos_identificados"
                        className="form-textarea"
                        rows="3"
                        value={formData.riesgos_identificados}
                        onChange={handleChange}
                        placeholder="Liste los riesgos que ya contempla en su estrategia..."
                    />
                </div>

                {/* Contexto Adicional */}
                <div className="form-group">
                    <label className="form-label" htmlFor="contexto_adicional">
                        Contexto Adicional
                    </label>
                    <p className="form-hint">
                        Información adicional relevante para la auditoría.
                    </p>
                    <textarea
                        id="contexto_adicional"
                        name="contexto_adicional"
                        className="form-textarea"
                        rows="3"
                        value={formData.contexto_adicional}
                        onChange={handleChange}
                        placeholder="Antecedentes, particularidades del juzgado, comportamiento de la contraparte..."
                    />
                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button type="button" className="btn btn--secondary" onClick={() => navigate('/')}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn--primary">
                        Solicitar Auditoría
                    </button>
                </div>
            </form>

            <footer className="analizar__footer">
                <p>
                    <strong>Nota:</strong> La auditoría detectará supuestos implícitos en su estrategia
                    y evaluará su consistencia con el objetivo procesal declarado.
                </p>
            </footer>
        </div>
    )
}

export default Auditar
