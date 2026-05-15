import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.BACKEND_URL || 'http://3.236.101.20:3000';

export async function GET(
  req: NextRequest,
  { params }: { params: { tabla: string; id: string } }
) {
  try {
    const r = await fetch(`${BACKEND}/web/llanta/${params.tabla}/${params.id}`, { cache: 'no-store' });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ ok: false, error: 'Error' }, { status: 502 });
  }
}