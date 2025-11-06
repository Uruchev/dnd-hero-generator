import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const ALL_STATS = ['STR','DEX','CON','INT','WIS','CHA']

export default function StatAllocator({ value, onChange, pool = 10 }) {
  // value: { [stat]: number } for enabled stats
  const [enabled, setEnabled] = useState(() => {
    const init = {}
    ALL_STATS.forEach(s => { init[s] = value?.[s] != null })
    return init
  })

  const [points, setPoints] = useState(() => ({
    STR: value?.STR || 0,
    DEX: value?.DEX || 0,
    CON: value?.CON || 0,
    INT: value?.INT || 0,
    WIS: value?.WIS || 0,
    CHA: value?.CHA || 0,
  }))

  const spent = useMemo(() => ALL_STATS.reduce((sum, s) => sum + (enabled[s] ? points[s] : 0), 0), [enabled, points])
  const remaining = pool - spent

  useEffect(() => {
    const out = {}
    ALL_STATS.forEach((s) => {
      if (enabled[s]) out[s] = points[s]
    })
    onChange?.(out)
  }, [enabled, points, onChange])

  function toggleStat(s) {
    setEnabled((prev) => {
      const next = { ...prev, [s]: !prev[s] }
      if (!next[s]) {
        // returning its points to the pool by setting to 0
        setPoints((p) => ({ ...p, [s]: 0 }))
      }
      return next
    })
  }

  function setStat(s, nextVal) {
    const val = Math.max(0, Math.floor(Number(nextVal) || 0))
    const delta = val - points[s]
    if (delta <= remaining) {
      setPoints((p) => ({ ...p, [s]: val }))
    }
  }

  function inc(s) {
    if (remaining <= 0) return
    setPoints((p) => ({ ...p, [s]: p[s] + 1 }))
  }
  function dec(s) {
    setPoints((p) => ({ ...p, [s]: Math.max(0, p[s] - 1) }))
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold tracking-wide">Ability Scores</h3>
        <div className={`text-sm px-3 py-1 rounded-full ${remaining === 0 ? 'bg-emerald-600/20 text-emerald-300' : 'bg-sky-600/20 text-sky-300'}`}>
          Points remaining: {remaining}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_STATS.map((s) => (
          <motion.div key={s} layout className={`paper border border-white/10 rounded-lg p-3 flex items-center gap-3 ${enabled[s] ? '' : 'opacity-60'}`}>
            <label className="flex items-center gap-2 min-w-[64px]">
              <input
                type="checkbox"
                className="accent-sky-500 h-4 w-4"
                checked={enabled[s]}
                onChange={() => toggleStat(s)}
              />
              <span className="font-medium tracking-wide w-10">{s}</span>
            </label>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                className="px-2 py-1 rounded bg-gray-800 border border-white/10 hover:bg-gray-700 disabled:opacity-40"
                onClick={() => dec(s)}
                disabled={!enabled[s] || points[s] <= 0}
              >-</button>
              <input
                type="number"
                min={0}
                value={points[s]}
                onChange={(e) => enabled[s] && setStat(s, e.target.value)}
                className="w-14 text-center bg-gray-900 border border-white/10 rounded py-1"
                disabled={!enabled[s]}
              />
              <button
                type="button"
                className="px-2 py-1 rounded bg-gray-800 border border-white/10 hover:bg-gray-700 disabled:opacity-40"
                onClick={() => inc(s)}
                disabled={!enabled[s] || remaining <= 0}
              >+</button>
            </div>
          </motion.div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="text-sky-300/80 text-xs mt-2">Allocate all points to enable Generate Hero.</div>
      )}
    </div>
  )
}

