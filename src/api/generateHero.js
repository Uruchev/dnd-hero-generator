import { N8N_WEBHOOK_URL } from '../config'

// Call n8n workflow via webhook. Falls back to local mock on failure.
export async function generateHero(payload) {
  // POST JSON to n8n webhook
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`n8n error ${res.status}: ${text}`)
    }

    const data = await res.json().catch(() => ({}))

    // Normalize a few possible shapes just in case
    const normalized = {
      hero_image: data.hero_image || data.image || data?.hero?.image,
      background_image: data.background_image || data.background || data?.hero?.background,
      name: data.name || payload.name,
      class: data.class || data.cls || payload.class,
      description: data.description ?? payload.description ?? '',
      stats: data.stats || payload.stats || {},
    }

    return normalized
  } catch (err) {
    console.warn('[generateHero] Falling back to mock due to:', err?.message || err)
    clearTimeout(timeout)
    return mockGenerateHero(payload)
  }
}

// Local mock used for development/fallback
function mockGenerateHero(payload) {
  const backgrounds = [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop',
  ]
  const portraits = [
    'https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975922284-6c1d4c19b9a0?q=80&w=800&auto=format&fit=crop',
  ]
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        hero_image: pick(portraits),
        background_image: pick(backgrounds),
        name: payload.name,
        class: payload.class,
        description: payload.description,
        stats: payload.stats,
      })
    }, 800)
  })
}