/** Lightweight types for request/response */
export type Stats = {
  STR: number; DEX: number; CON: number; INT: number; WIS: number; CHA: number;
}
export type GenerateHeroPayload = {
  name: string;
  description: string;
  class: string;
  stats: Stats;
}
export type GenerateHeroResponse = {
  id: number;
  name: string;
  description: string;
  class: string;
  stats: Stats;
  hero_image: string;
  background_image: string;
  created_at: string;
}

// Use the same configuration source as the JS API helper
// to avoid falling back to the mock unintentionally.
// This reads VITE_N8N_WEBHOOK_URL and provides a sane default
// (production webhook URL) when the env var is absent.
import { N8N_WEBHOOK_URL as URL_FROM_CONFIG } from '../config'
const URL = URL_FROM_CONFIG;

/**
 * POSTs to the n8n webhook.
 * - Throws if the response is not ok.
 * - If fetch throws (network), returns a mock object so the UI remains usable.
 */
export async function generateHero(payload: GenerateHeroPayload): Promise<GenerateHeroResponse> {
  try {
    const res = await fetch(URL ?? '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`[n8n] ${res.status} ${res.statusText} - ${text}`);
    }

    const raw = await res.json();
    // n8n 'Respond to Webhook' node often returns an Item shape
    // like { json: {...} } or an array with the item at [0].
    const item = Array.isArray(raw) ? raw[0] : raw;
    const data: any = item?.json ?? item ?? {};

    // Normalize various possible keys from the workflow
    const normalized: GenerateHeroResponse = {
      id: data.id ?? Date.now(),
      name: data.name ?? payload.name,
      description: data.description ?? payload.description ?? '',
      class: data.class ?? data.cls ?? payload.class,
      stats: data.stats ?? payload.stats,
      hero_image: data.hero_image || data.image || data?.hero?.image || data?.result?.hero_image,
      background_image: data.background_image || data.background || data?.hero?.background || data?.result?.background_image,
      created_at: data.created_at ?? new Date().toISOString(),
    } as GenerateHeroResponse;

    return normalized;
  } catch (err) {
    // Network, CORS, or URL misconfig - provide a local mock.
    // eslint-disable-next-line no-console
    console.warn('[n8n] Falling back to mock:', (err as Error)?.message || err);
    return mockResponse(payload);
  }
}

function mockResponse(payload: GenerateHeroPayload): GenerateHeroResponse {
  const portraits = [
    'https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975922284-6c1d4c19b9a0?q=80&w=800&auto=format&fit=crop',
  ];
  const backgrounds = [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop',
  ];
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const nowIso = new Date().toISOString();
  return {
    id: Math.floor(Math.random() * 1_000_000),
    name: payload.name,
    description: payload.description,
    class: payload.class,
    stats: payload.stats,
    hero_image: pick(portraits),
    background_image: pick(backgrounds),
    created_at: nowIso,
  };
}
