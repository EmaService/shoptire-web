import type { BuenFinApiData, BuenFinEstado } from './tipos';

const NEXUS_URL = (
  process.env.NEXUS_URL || 'https://nexus-erp-orcin.vercel.app'
).replace(/\/$/, '');

const NEXUS_BUEN_FIN_KEY = process.env.NEXUS_BUEN_FIN_KEY;

const ERROR_DISPONIBLE = 'Estamos actualizando las promociones';

export async function getBuenFin(): Promise<BuenFinEstado> {
  if (!NEXUS_BUEN_FIN_KEY) {
    return { ok: false, error: ERROR_DISPONIBLE };
  }

  try {
    const res = await fetch(`${NEXUS_URL}/api/public/buen-fin`, {
      headers: { 'x-api-key': NEXUS_BUEN_FIN_KEY },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return { ok: false, error: ERROR_DISPONIBLE };
    }

    const data = (await res.json()) as BuenFinApiData;

    if (!data || typeof data !== 'object' || !Array.isArray(data.llantas)) {
      return { ok: false, error: ERROR_DISPONIBLE };
    }

    return { ok: true, data };
  } catch {
    return { ok: false, error: ERROR_DISPONIBLE };
  }
}
