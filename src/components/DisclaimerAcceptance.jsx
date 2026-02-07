/**
 * Componente de Aceptación del Disclaimer Legal
 * 
 * Pantalla bloqueante que requiere aceptación explícita
 * antes de acceder a cualquier funcionalidad del sistema.
 * 
 * NO SALTEABLE - Obligatorio para todos los usuarios
 */

import { useState, useRef, useEffect } from 'react'
import {
    DISCLAIMER_COMPLETO,
    DISCLAIMER_VERSION,
    acceptDisclaimer
} from '../constants/disclaimer'
import './DisclaimerAcceptance.css'

function DisclaimerAcceptance({ onAccept }) {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const contentRef = useRef(null)

    // Detectar scroll al final
    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20
            if (isAtBottom) {
                setHasScrolledToBottom(true)
            }
        }
    }

    // Verificar si el contenido es más corto que el contenedor
    useEffect(() => {
        if (contentRef.current) {
            const { scrollHeight, clientHeight } = contentRef.current
            if (scrollHeight <= clientHeight) {
                setHasScrolledToBottom(true)
            }
        }
    }, [])

    const handleAccept = () => {
        if (hasScrolledToBottom && isChecked) {
            acceptDisclaimer()
            onAccept()
        }
    }

    return (
        <div className="disclaimer-overlay">
            <div className="disclaimer-modal">
                <header className="disclaimer-header">
                    <div className="disclaimer-logo">⚖️</div>
                    <h1>ALCANCE LEGAL</h1>
                    <p>Sistema de Inteligencia Jurídica Civil</p>
                </header>

                <div
                    className="disclaimer-content"
                    ref={contentRef}
                    onScroll={handleScroll}
                >
                    <h2>{DISCLAIMER_COMPLETO.titulo}</h2>

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
                        <h3>⚠️ Importante - Este sistema NO constituye:</h3>
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

                    <div className="exclusion-responsabilidad">
                        <h3>⚠️ Exclusión de Responsabilidad</h3>
                        <p>{DISCLAIMER_COMPLETO.exclusionResponsabilidad}</p>
                    </div>

                    <div className="metadata">
                        <p><strong>Jurisdicción aplicable:</strong> {DISCLAIMER_COMPLETO.jurisdiccion}</p>
                        <p><strong>Alcance del contenido:</strong> {DISCLAIMER_COMPLETO.alcance}</p>
                        <p className="version">Versión {DISCLAIMER_VERSION}</p>
                    </div>

                    {!hasScrolledToBottom && (
                        <div className="scroll-indicator">
                            ▼ Desplácese hasta el final para continuar
                        </div>
                    )}
                </div>

                <footer className="disclaimer-footer">
                    <label className={`checkbox-label ${!hasScrolledToBottom ? 'disabled' : ''}`}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            disabled={!hasScrolledToBottom}
                        />
                        <span>He leído y acepto los términos del aviso legal</span>
                    </label>

                    <button
                        className="btn-accept"
                        onClick={handleAccept}
                        disabled={!hasScrolledToBottom || !isChecked}
                    >
                        CONTINUAR
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default DisclaimerAcceptance
