import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../services/api'
import '../Analizar/Analizar.css'

const tiposEscrito = [
    { value: 'demanda', label: 'Demanda' },
    { value: 'contestacion', label: 'Contestación de Demanda' },
    { value: 'apelacion', label: 'Expresión de Agravios' },
    { value: 'incidente', label: 'Incidente' },
    { value: 'memorial', label: 'Memorial' },
]

function Redactar() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        tipo_escrito: '',
        hechos_relevantes: '',
        pretension: '',
        fundamentos_juridicos: '',
        estilo: 'formal',
        incluir_jurisprudencia: true
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.tipo_escrito) {
            newErrors.tipo_escrito = 'Seleccione el tipo de escrito'
        }
        if (!formData.hechos_relevantes || formData.hechos_relevantes.length < 200) {
            newErrors.hechos_relevantes = 'Describa los hechos relevantes (mínimo 200 caracteres)'
        }
        if (!formData.pretension) {
            newErrors.pretension = 'Indique la pretensión'
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
                const response = await api.redactarEscrito(formData)

                if (response.success) {
                    navigate('/resultado', {
                        state: {
                            capacidad: 'redactar',
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

    const charCount = formData.hechos_relevantes.length

    return (
        <div className="analizar">
            <header className="analizar__header">
                <button className="analizar__back" onClick={() => navigate('/')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver
                </button>
                <h1 className="analizar__title">Redactar Escrito Civil</h1>
                <p className="analizar__subtitle">
                    Asistencia para redacción de escritos con jurisprudencia curada y metodología profesional.
                </p>
            </header>

            <div className="redactar__aviso">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p>
                    <strong>BORRADOR ASISTIDO</strong> — El resultado será un borrador que requiere
                    revisión y aprobación del abogado responsable antes de su presentación.
                </p>
            </div>

            <form className="analizar__form" onSubmit={handleSubmit}>
                {/* Tipo de Escrito */}
                <div className="form-group">
                    <label className="form-label">
                        Tipo de Escrito <span className="required">*</span>
                    </label>
                    <div className="form-options">
                        {tiposEscrito.map(tipo => (
                            <label
                                key={tipo.value}
                                className={`form-option ${formData.tipo_escrito === tipo.value ? 'form-option--selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="tipo_escrito"
                                    value={tipo.value}
                                    checked={formData.tipo_escrito === tipo.value}
                                    onChange={handleChange}
                                />
                                <span>{tipo.label}</span>
                            </label>
                        ))}
                    </div>
                    {errors.tipo_escrito && <span className="form-error">{errors.tipo_escrito}</span>}
                </div>

                {/* Hechos Relevantes */}
                <div className="form-group">
                    <label className="form-label" htmlFor="hechos_relevantes">
                        Hechos Relevantes <span className="required">*</span>
                    </label>
                    <p className="form-hint">
                        Relate los hechos que fundamentan el escrito de manera cronológica y precisa.
                    </p>
                    <textarea
                        id="hechos_relevantes"
                        name="hechos_relevantes"
                        className={`form-textarea ${errors.hechos_relevantes ? 'form-textarea--error' : ''}`}
                        rows="8"
                        value={formData.hechos_relevantes}
                        onChange={handleChange}
                        placeholder="Describa los hechos identificando: partes, fechas, lugares, actos jurídicos relevantes, documentación respaldatoria..."
                    />
                    <div className="form-textarea-footer">
                        <span className={`char-count ${charCount < 200 ? 'char-count--warning' : 'char-count--ok'}`}>
                            {charCount}/200 mínimo
                        </span>
                    </div>
                    {errors.hechos_relevantes && <span className="form-error">{errors.hechos_relevantes}</span>}
                </div>

                {/* Pretensión */}
                <div className="form-group">
                    <label className="form-label" htmlFor="pretension">
                        Pretensión <span className="required">*</span>
                    </label>
                    <p className="form-hint">
                        ¿Qué solicita concretamente al tribunal?
                    </p>
                    <textarea
                        id="pretension"
                        name="pretension"
                        className={`form-textarea ${errors.pretension ? 'form-textarea--error' : ''}`}
                        rows="3"
                        value={formData.pretension}
                        onChange={handleChange}
                        placeholder="Ej: Se declare la nulidad del contrato y se condene a la demandada al pago de..."
                    />
                    {errors.pretension && <span className="form-error">{errors.pretension}</span>}
                </div>

                {/* Fundamentos Jurídicos */}
                <div className="form-group">
                    <label className="form-label" htmlFor="fundamentos_juridicos">
                        Fundamentos Jurídicos
                    </label>
                    <p className="form-hint">
                        Normas, principios o jurisprudencia que desea incluir específicamente.
                    </p>
                    <textarea
                        id="fundamentos_juridicos"
                        name="fundamentos_juridicos"
                        className="form-textarea"
                        rows="3"
                        value={formData.fundamentos_juridicos}
                        onChange={handleChange}
                        placeholder="Ej: Arts. 1078, 1109 CC, art. 730 CCCN, Fallos relevantes..."
                    />
                </div>

                {/* Opciones */}
                <div className="form-group">
                    <label className="form-label">Opciones de Redacción</label>
                    <div className="redactar__opciones">
                        <label className="form-checkbox form-checkbox--checked">
                            <input
                                type="checkbox"
                                name="incluir_jurisprudencia"
                                checked={formData.incluir_jurisprudencia}
                                onChange={handleChange}
                            />
                            <span className="form-checkbox__box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </span>
                            <span>Incluir jurisprudencia curada</span>
                        </label>

                        <div className="form-radio-group" style={{ marginTop: '1rem' }}>
                            <label className={`form-radio ${formData.estilo === 'formal' ? 'form-radio--selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="estilo"
                                    value="formal"
                                    checked={formData.estilo === 'formal'}
                                    onChange={handleChange}
                                />
                                <span>Estilo Formal</span>
                            </label>
                            <label className={`form-radio ${formData.estilo === 'tecnico' ? 'form-radio--selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="estilo"
                                    value="tecnico"
                                    checked={formData.estilo === 'tecnico'}
                                    onChange={handleChange}
                                />
                                <span>Estilo Técnico</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button type="button" className="btn btn--secondary" onClick={() => navigate('/')}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn--primary">
                        Generar Borrador
                    </button>
                </div>
            </form>

            <footer className="analizar__footer">
                <p>
                    <strong>Importante:</strong> Todo output de redacción es un BORRADOR ASISTIDO que
                    requiere revisión profesional. El sistema identificará secciones que necesitan
                    atención especial del abogado.
                </p>
            </footer>
        </div>
    )
}

export default Redactar
