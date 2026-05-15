import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.BACKEND_URL || 'http://3.236.101.20:3000';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${BACKEND}/web/mp-webhook-internal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': WEBHOOK_SECRET,
      },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}