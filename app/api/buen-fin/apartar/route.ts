import { NextRequest, NextResponse } from 'next/server';

const NEXUS_URL = (
  process.env.NEXUS_URL || 'https://nexus-erp-orcin.vercel.app'
).replace(/\/$/, '');

const NEXUS_BUEN_FIN_KEY = process.env.NEXUS_BUEN_FIN_KEY;

export async function POST(req: NextRequest) {
  let cuerpo: {
    llantaId?: unknown;
    nombre?: unknown;
    telefono?: unknown;
    piezas?: unknown;
  };

  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Datos inválidos' },
      { status: 400 }
    );
  }

  const llantaId = cuerpo?.llantaId;
  const nombre = typeof cuerpo?.nombre === 'string' ? cuerpo.nombre.trim() : '';
  const telefono = String(cuerpo?.telefono ?? '').replace(/\D/g, '');
  const piezas = Number(cuerpo?.piezas);

  if (llantaId === undefined || llantaId === null || llantaId === '') {
    return NextResponse.json(
      { ok: false, error: 'Falta la llanta a apartar' },
      { status: 400 }
    );
  }

  if (nombre.length < 2) {
    return NextResponse.json(
      { ok: false, error: 'Escribe tu nombre' },
      { status: 400 }
    );
  }

  if (!/^\d{10}$/.test(telefono)) {
    return NextResponse.json(
      { ok: false, error: 'El teléfono debe tener 10 dígitos' },
      { status: 400 }
    );
  }

  if (!Number.isInteger(piezas) || piezas < 1 || piezas > 8) {
    return NextResponse.json(
      { ok: false, error: 'Elige entre 1 y 8 piezas' },
      { status: 400 }
    );
  }

  if (!NEXUS_BUEN_FIN_KEY) {
    return NextResponse.json(
      { ok: false, error: 'Estamos actualizando las promociones' },
      { status: 502 }
    );
  }

  try {
    const res = await fetch(`${NEXUS_URL}/api/public/buen-fin/apartar-tlalpan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': NEXUS_BUEN_FIN_KEY,
      },
      body: JSON.stringify({ llantaId, nombre, telefono, piezas }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.ok === false) {
      const mensaje =
        data?.error ||
        data?.message ||
        'No pudimos apartar tu llanta. Intenta de nuevo.';
      const status = res.ok ? 400 : res.status;
      return NextResponse.json({ ok: false, error: mensaje }, { status });
    }

    return NextResponse.json({ ok: true, ...(data ?? {}) });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'No pudimos conectar. Intenta de nuevo.' },
      { status: 502 }
    );
  }
}
