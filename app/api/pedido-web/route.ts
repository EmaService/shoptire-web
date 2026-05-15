import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.BACKEND_URL || 'http://3.236.101.20:3000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${BACKEND}/web/pedido-web`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ ok: false, error: 'Error de conexión con el servidor' }, { status: 502 });
  }
}
