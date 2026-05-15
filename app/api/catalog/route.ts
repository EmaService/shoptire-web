import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://3.236.101.20:3000';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams.toString();
  const url = `${BACKEND}/web/catalog${params ? '?' + params : ''}`;
  try {
    const r = await fetch(url, { cache: 'no-store' });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ ok: false, error: 'Error conectando al backend' }, { status: 502 });
  }
}