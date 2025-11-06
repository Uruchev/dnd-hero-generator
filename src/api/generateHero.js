// Simulated POST to /api/generate-hero
// Returns a promise resolving after a short delay.

export function generateHero(payload) {
  // Choose some themed placeholder images
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
    }, 900)
  })
}

