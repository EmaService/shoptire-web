import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://3.236.101.20:3000';

export async function GET() {
  try {
    const r = await fetch(`${BACKEND}/web/medidas`, { cache: 'no-store' });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ ok: false, error: 'Error' }, { status: 502 });
  }
}