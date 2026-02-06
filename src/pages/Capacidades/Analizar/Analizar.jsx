import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../services/api'
import './Analizar.css'

const tiposConsulta = [
    { value: 'contrato', label: 'Contratos Civiles' },
    { value: 'daños', label: 'Responsabilidad Civil y Daños' },
    { value: 'sucesion', label: 'Sucesiones' },
    { value: 'ejecucion', label: 'Ejecuciones Civiles' },
    { value: 'obligaciones', label: 'Obligaciones' },
]

const jurisdicciones = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
    'Tierra del Fuego', 'Tucumán'
]

const documentacionOpciones = [
    { value: 'contrato_escrito', label: 'Contrato escrito' },
    { value: 'emails', label: 'Intercambio de emails/mensajes' },
    { value: 'facturas', label: 'Facturas o recibos' },
    { value: 'actuaciones', label: 'Actuaciones judiciales previas' },
    { value: 'otros', label: 'Otros documentos' },
]

function Analizar() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        tipo_consulta: '',
        situacion_factica: '',
        pretension_cliente: '',
        documentacion_disponible: [],
        jurisdiccion: '',
        urgencia: 'normal'
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

    const handleDocumentacion = (value) => {
        setFormData(prev => ({
            ...prev,
            documentacion_disponible: prev.documentacion_disponible.includes(value)
                ? prev.documentacion_disponible.filter(d => d !== value)
                : [...prev.documentacion_disponible, value]
        }))
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.tipo_consulta) {
            newErrors.tipo_consulta = 'Seleccione el tipo de materia'
        }
        if (!formData.situacion_factica || formData.situacion_factica.length < 100) {
            newErrors.situacion_factica = 'Describa la situación fáctica (mínimo 100 caracteres)'
        }
        if (!formData.pretension_cliente) {
            newErrors.pretension_cliente = 'Indique la pretensión del cliente'
        }
        if (!formData.jurisdiccion) {
            newErrors.jurisdiccion = 'Seleccione la jurisdicción'
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
                const response = await api.analizarCaso(formData)

                if (response.success) {
                    navigate('/resultado', {
                        state: {
                            capacidad: 'analizar',
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

    const charCount = formData.situacion_factica.length

    return (
        <div className="analizar">
            <header className="analizar__header">
                <button className="analizar__back" onClick={() => navigate('/')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver
                </button>
                <h1 className="analizar__title">Analizar Caso Civil</h1>
                <p className="analizar__subtitle">
                    Complete los datos del caso para obtener un análisis jurídico con evaluación de viabilidad y riesgos.
                </p>
            </header>

            <form className="analizar__form" onSubmit={handleSubmit}>
                {/* Tipo de Consulta */}
                <div className="form-group">
                    <label className="form-label">
                        Tipo de Materia <span className="required">*</span>
                    </label>
                    <div className="form-options">
                        {tiposConsulta.map(tipo => (
                            <label
                                key={tipo.value}
                                className={`form-option ${formData.tipo_consulta === tipo.value ? 'form-option--selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="tipo_consulta"
                                    value={tipo.value}
                                    checked={formData.tipo_consulta === tipo.value}
                                    onChange={handleChange}
                                />
                                <span>{tipo.label}</span>
                            </label>
                        ))}
                    </div>
                    {errors.tipo_consulta && <span className="form-error">{errors.tipo_consulta}</span>}
                </div>

                {/* Situación Fáctica */}
                <div className="form-group">
                    <label className="form-label" htmlFor="situacion_factica">
                        Situación Fáctica <span className="required">*</span>
                    </label>
                    <p className="form-hint">
                        Describa los hechos relevantes del caso de manera clara y ordenada.
                    </p>
                    <textarea
                        id="situacion_factica"
                        name="situacion_factica"
                        className={`form-textarea ${errors.situacion_factica ? 'form-textarea--error' : ''}`}
                        rows="6"
                        value={formData.situacion_factica}
                        onChange={handleChange}
                        placeholder="Relate los hechos cronológicamente, identificando partes involucradas, fechas relevantes y circunstancias clave..."
                    />
                    <div className="form-textarea-footer">
                        <span className={`char-count ${charCount < 100 ? 'char-count--warning' : 'char-count--ok'}`}>
                            {charCount}/100 mínimo
                        </span>
                    </div>
                    {errors.situacion_factica && <span className="form-error">{errors.situacion_factica}</span>}
                </div>

                {/* Pretensión */}
                <div className="form-group">
                    <label className="form-label" htmlFor="pretension_cliente">
                        Pretensión del Cliente <span className="required">*</span>
                    </label>
                    <p className="form-hint">
                        ¿Qué busca obtener el cliente? Sea específico.
                    </p>
                    <textarea
                        id="pretension_cliente"
                        name="pretension_cliente"
                        className={`form-textarea ${errors.pretension_cliente ? 'form-textarea--error' : ''}`}
                        rows="3"
                        value={formData.pretension_cliente}
                        onChange={handleChange}
                        placeholder="Ej: Obtener la resolución del contrato y el resarcimiento de daños..."
                    />
                    {errors.pretension_cliente && <span className="form-error">{errors.pretension_cliente}</span>}
                </div>

                {/* Documentación */}
                <div className="form-group">
                    <label className="form-label">Documentación Disponible</label>
                    <p className="form-hint">Seleccione la documentación con la que cuenta.</p>
                    <div className="form-checkboxes">
                        {documentacionOpciones.map(doc => (
                            <label
                                key={doc.value}
                                className={`form-checkbox ${formData.documentacion_disponible.includes(doc.value) ? 'form-checkbox--checked' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.documentacion_disponible.includes(doc.value)}
                                    onChange={() => handleDocumentacion(doc.value)}
                                />
                                <span className="form-checkbox__box">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </span>
                                <span>{doc.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Jurisdicción */}
                <div className="form-group form-group--half">
                    <label className="form-label" htmlFor="jurisdiccion">
                        Jurisdicción <span className="required">*</span>
                    </label>
                    <select
                        id="jurisdiccion"
                        name="jurisdiccion"
                        className={`form-select ${errors.jurisdiccion ? 'form-select--error' : ''}`}
                        value={formData.jurisdiccion}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione provincia</option>
                        {jurisdicciones.map(j => (
                            <option key={j} value={j}>{j}</option>
                        ))}
                    </select>
                    {errors.jurisdiccion && <span className="form-error">{errors.jurisdiccion}</span>}
                </div>

                {/* Urgencia */}
                <div className="form-group form-group--half">
                    <label className="form-label">Urgencia</label>
                    <div className="form-radio-group">
                        <label className={`form-radio ${formData.urgencia === 'normal' ? 'form-radio--selected' : ''}`}>
                            <input
                                type="radio"
                                name="urgencia"
                                value="normal"
                                checked={formData.urgencia === 'normal'}
                                onChange={handleChange}
                            />
                            <span>Normal</span>
                        </label>
                        <label className={`form-radio ${formData.urgencia === 'alta' ? 'form-radio--selected' : ''}`}>
                            <input
                                type="radio"
                                name="urgencia"
                                value="alta"
                                checked={formData.urgencia === 'alta'}
                                onChange={handleChange}
                            />
                            <span>Alta</span>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button type="button" className="btn btn--secondary" onClick={() => navigate('/')}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn--primary">
                        Solicitar Análisis
                    </button>
                </div>
            </form>

            <footer className="analizar__footer">
                <p>
                    <strong>Nota:</strong> La consulta será evaluada por admisibilidad antes de procesarse.
                    Si excede el alcance del fuero civil, será rechazada con fundamentación.
                </p>
            </footer>
        </div>
    )
}

export default Analizar
