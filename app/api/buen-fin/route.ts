import { NextResponse } from 'next/server';
import { getBuenFin } from '@/app/buen-fin/nexus';

export const revalidate = 60;

export async function GET() {
  const estado = await getBuenFin();

  if (!estado.ok) {
    return NextResponse.json(
      { ok: false, error: estado.error },
      { status: 502 }
    );
  }

  return NextResponse.json(estado.data);
}
