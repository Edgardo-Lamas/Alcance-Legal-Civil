import { useState, useEffect } from 'react'
import './HeroScreen.css'

function HeroScreen({ onEnter }) {
    const [isExiting, setIsExiting] = useState(false)

    const handleEnter = () => {
        setIsExiting(true)
        setTimeout(() => {
            onEnter()
        }, 500) // Match CSS transition duration
    }

    // Auto-dismiss on desktop (only show hero on mobile)
    useEffect(() => {
        const checkDesktop = () => {
            if (window.innerWidth > 768) {
                onEnter()
            }
        }
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [onEnter])

    return (
        <div className={`hero-screen ${isExiting ? 'hero-screen--exiting' : ''}`}>
            <div className="hero-screen__content">
                <div className="hero-screen__logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v18" />
                        <path d="M5 6l7-3 7 3" />
                        <path d="M5 6v6a7 7 0 0 0 7 7 7 7 0 0 0 7-7V6" />
                    </svg>
                </div>

                <h1 className="hero-screen__title">Alcance Legal</h1>
                <p className="hero-screen__tagline">Inteligencia Jurídica Civil</p>

                <div className="hero-screen__badge">
                    <span>Asociado Senior Digital</span>
                </div>

                <button className="hero-screen__cta" onClick={handleEnter}>
                    Ingresar a la Consola
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="hero-screen__footer">
                <p>Criterio · Metodología · Rigor Profesional</p>
            </div>
        </div>
    )
}

export default HeroScreen
