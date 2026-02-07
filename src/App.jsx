import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PageLayout from './components/PageLayout/PageLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Analizar from './pages/Capacidades/Analizar/Analizar'
import Auditar from './pages/Capacidades/Auditar/Auditar'
import Redactar from './pages/Capacidades/Redactar/Redactar'
import Resultado from './pages/Resultado/Resultado'
import ScrollToTop from './components/ScrollToTop'
import DisclaimerAcceptance from './components/DisclaimerAcceptance'
import { isDisclaimerAccepted } from './constants/disclaimer'

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(isDisclaimerAccepted())

  // Pantalla de aceptación OBLIGATORIA antes de cualquier uso
  if (!disclaimerAccepted) {
    return (
      <DisclaimerAcceptance
        onAccept={() => setDisclaimerAccepted(true)}
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

        {/* Vista de Resultado */}
        <Route path="/resultado" element={<Resultado />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageLayout>
  )
}

export default App
