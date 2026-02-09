import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PageLayout from './components/PageLayout/PageLayout'
import HeroScreen from './components/HeroScreen/HeroScreen'
import Dashboard from './pages/Dashboard/Dashboard'
import Analizar from './pages/Capacidades/Analizar/Analizar'
import Auditar from './pages/Capacidades/Auditar/Auditar'
import Redactar from './pages/Capacidades/Redactar/Redactar'
import ManualPage from './pages/Manual/Manual'
import Resultado from './pages/Resultado/Resultado'
import ScrollToTop from './components/ScrollToTop'
import DisclaimerAcceptance from './components/DisclaimerAcceptance'
import { isDisclaimerAccepted } from './constants/disclaimer'

// Check if hero was shown this session
const isHeroShown = () => sessionStorage.getItem('alcance_hero_shown') === 'true'
const setHeroShown = () => sessionStorage.setItem('alcance_hero_shown', 'true')

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(isDisclaimerAccepted())
  const [showHero, setShowHero] = useState(false)

  // Check if we should show hero on mount (mobile only, first visit this session)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const heroAlreadyShown = isHeroShown()
    if (isMobile && !heroAlreadyShown && disclaimerAccepted) {
      setShowHero(true)
    }
  }, [disclaimerAccepted])

  // Pantalla de aceptación OBLIGATORIA antes de cualquier uso
  if (!disclaimerAccepted) {
    return (
      <DisclaimerAcceptance
        onAccept={() => setDisclaimerAccepted(true)}
      />
    )
  }

  // Hero screen for mobile (shown once per session after disclaimer)
  if (showHero) {
    return (
      <HeroScreen
        onEnter={() => {
          setHeroShown()
          setShowHero(false)
        }}
      />
    )
  }

  return (
    <PageLayout>
      <ScrollToTop />
      <Routes>
        {/* Dashboard - Selección de capacidad */}
        <Route path="/" element={<Dashboard />} />

        {/* Flujos de Capacidades */}
        <Route path="/analizar" element={<Analizar />} />
        <Route path="/auditar" element={<Auditar />} />
        <Route path="/redactar" element={<Redactar />} />

        {/* Documentación */}
        <Route path="/manual" element={<ManualPage />} />

        {/* Vista de Resultado */}
        <Route path="/resultado" element={<Resultado />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageLayout>
  )
}

export default App

