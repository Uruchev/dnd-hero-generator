import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { HeroProvider } from './context/HeroContext'
import FormPage from './pages/FormPage'
import ResultPage from './pages/ResultPage'

export default function App() {
  return (
    <HeroProvider>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HeroProvider>
  )
}

