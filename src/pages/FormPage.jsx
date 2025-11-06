import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import StatAllocator from '../components/StatAllocator'
import { useHero } from '../context/HeroContext'
import { generateHero } from '../api/n8n'

const CLASSES = ['Warrior','Mage','Healer','Rogue','Ranger','Paladin']

export default function FormPage() {
  const navigate = useNavigate()
  const { setHeroData } = useHero()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [charClass, setCharClass] = useState(CLASSES[0])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const remaining = useMemo(() => 10 - Object.values(stats).reduce((a,b)=>a+b,0), [stats])
  const canSubmit = remaining === 0 && name.trim().length > 0 && !loading

  async function onSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setErrorMsg('')
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        class: charClass,
        stats: {
          STR: stats.STR || 0,
          DEX: stats.DEX || 0,
          CON: stats.CON || 0,
          INT: stats.INT || 0,
          WIS: stats.WIS || 0,
          CHA: stats.CHA || 0,
        },
      }
      // Call n8n webhook
      const data = await generateHero(payload)
      setHeroData(data)
      navigate('/result')
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to generate hero. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen fantasy-bg">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-3xl font-extrabold tracking-tight mb-6">
          D&D Hero Generator
        </motion.h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="paper rounded-xl border border-white/10 p-5 space-y-4">
            <div>
              <label className="block text-sm mb-1">Name of Hero</label>
              <input
                type="text"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="e.g., Aranel the Swift"
                className="w-full bg-gray-900 border border-white/10 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                placeholder="e.g., female elf warrior from the forest"
                rows={3}
                className="w-full bg-gray-900 border border-white/10 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Class</label>
              <select
                value={charClass}
                onChange={(e)=>setCharClass(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded px-3 py-2"
              >
                {CLASSES.map((c)=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="paper rounded-xl border border-white/10 p-5">
            <StatAllocator value={{}} onChange={setStats} pool={10} />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-5 py-2 rounded-lg font-semibold border border-white/10 shadow-glow ${canSubmit ? 'bg-brand-600 hover:bg-brand-500' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`}
            >
              {loading ? 'Summoning hero…' : 'Generate Hero'}
            </button>
            <div className="text-sm text-gray-300/80">
              Points remaining: <span className={remaining === 0 ? 'text-emerald-300' : 'text-sky-300'}>{remaining}</span>
            </div>
          </div>
          {errorMsg && (
            <div className="text-sm text-red-300 bg-red-900/30 border border-red-500/30 rounded px-3 py-2">
              {errorMsg}
            </div>
          )}
        </form>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="paper border border-white/10 rounded-xl p-6 text-center"
            >
              <div className="animate-pulse text-lg font-semibold">Summoning your hero...</div>
              <div className="mt-2 text-sm text-gray-300/80">Conjuring portrait and backstory</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
