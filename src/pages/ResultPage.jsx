import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useHero } from '../context/HeroContext'

export default function ResultPage() {
  const { heroData } = useHero()
  const navigate = useNavigate()

  useEffect(() => {
    if (!heroData) navigate('/')
  }, [heroData, navigate])

  if (!heroData) return null

  const { hero_image, background_image, name, class: cls, stats, description } = heroData

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <img
        src={background_image}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 items-start">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="paper border border-white/10 rounded-xl overflow-hidden w-full md:w-[360px]">
          <img src={hero_image} alt={name} className="w-full h-[420px] object-cover" />
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 }} className="paper border border-white/10 rounded-xl p-6 w-full">
          <h2 className="text-2xl font-extrabold tracking-tight">{name}</h2>
          <div className="text-brand-300 font-semibold mt-1">{cls}</div>
          {description && <p className="text-sm text-gray-200/90 mt-3">{description}</p>}

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(stats).map(([k,v]) => (
              <div key={k} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="text-xs text-gray-300">{k}</div>
                <div className="text-xl font-bold">{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg font-semibold border border-white/10 bg-gray-800 hover:bg-gray-700"
            >
              Generate another
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
