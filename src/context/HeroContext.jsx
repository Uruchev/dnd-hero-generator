import React, { createContext, useContext, useState } from 'react'

const HeroContext = createContext(null)

export function HeroProvider({ children }) {
  const [heroData, setHeroData] = useState(null)
  return (
    <HeroContext.Provider value={{ heroData, setHeroData }}>
      {children}
    </HeroContext.Provider>
  )
}

export function useHero() {
  const ctx = useContext(HeroContext)
  if (!ctx) throw new Error('useHero must be used within HeroProvider')
  return ctx
}

