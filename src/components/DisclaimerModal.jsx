/**
 * Modal para ver el Aviso Legal completo
 */

import { DISCLAIMER_COMPLETO, DISCLAIMER_VERSION } from '../constants/disclaimer'
import './DisclaimerModal.css'

function DisclaimerModal({ isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <div className="disclaimer-modal-overlay" onClick={onClose}>
            <div className="disclaimer-modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>⚖️ {DISCLAIMER_COMPLETO.titulo}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </header>

                <div className="modal-body">
                    <p className="introduccion">
                        {DISCLAIMER_COMPLETO.introduccion}
                    </p>

                    <div className="seccion capacidades">
                        <h3>✅ El sistema permite:</h3>
                        <ul>
                            {DISCLAIMER_COMPLETO.permite.map((item, i) => (
                                <li key={i}>✓ {item}</li>
                            ))}
                        </ul>
                        <p className="proposito">{DISCLAIMER_COMPLETO.propositoPositivo}</p>
                    </div>

                    <div className="seccion limitaciones">
                        <h3>⚠️ Este sistema NO constituye:</h3>
                        <ul>
                            {DISCLAIMER_COMPLETO.noConstituye.map((item, i) => (
                                <li key={i}>❌ {item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="seccion">
                        <h3>Este sistema NO reemplaza:</h3>
                        <ul>
                            {DISCLAIMER_COMPLETO.noReemplaza.map((item, i) => (
                                <li key={i}>❌ {item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="seccion">
                        <h3>El usuario reconoce y acepta que:</h3>
                        <ol>
                            {DISCLAIMER_COMPLETO.reconocimientos.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ol>
                    </div>

                    <div className="exclusion">
                        <h3>⚠️ Exclusión de Responsabilidad</h3>
                        <p>{DISCLAIMER_COMPLETO.exclusionResponsabilidad}</p>
                    </div>

                    <div className="metadata">
                        <p><strong>Jurisdicción:</strong> {DISCLAIMER_COMPLETO.jurisdiccion}</p>
                        <p><strong>Alcance:</strong> {DISCLAIMER_COMPLETO.alcance}</p>
                        <p className="version">Versión {DISCLAIMER_VERSION}</p>
                    </div>
                </div>

                <footer className="modal-footer">
                    <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
                </footer>
            </div>
        </div>
    )
}

export default DisclaimerModal
