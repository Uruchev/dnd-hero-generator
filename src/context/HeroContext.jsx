import React, { createContext, useContext, useMemo, useState } from 'react'

const HeroContext = createContext(null)

export function HeroProvider({ children }) {
  const [heroData, setHeroDataState] = useState(() => {
    try {
      const raw = sessionStorage.getItem('heroData')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const setHeroData = (value) => {
    setHeroDataState(value)
    try {
      if (value == null) sessionStorage.removeItem('heroData')
      else sessionStorage.setItem('heroData', JSON.stringify(value))
    } catch {
      // ignore storage errors
    }
  }

  const ctx = useMemo(() => ({ heroData, setHeroData }), [heroData])

  return (
    <HeroContext.Provider value={ctx}>
      {children}
    </HeroContext.Provider>
  )
}

export function useHero() {
  const ctx = useContext(HeroContext)
  if (!ctx) throw new Error('useHero must be used within HeroProvider')
  return ctx
}
