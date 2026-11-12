import type { BuenFinApiData } from './tipos';

export type FaseBuenFin = 'antes' | 'activo' | 'terminado';

export function faseBuenFin(
  data: BuenFinApiData,
  ahora: Date = new Date()
): FaseBuenFin {
  const desde = data.desde ? new Date(data.desde).getTime() : NaN;
  const hasta = data.hasta ? new Date(data.hasta).getTime() : NaN;
  const t = ahora.getTime();

  const hayDesde = Number.isFinite(desde);
  const hayHasta = Number.isFinite(hasta);

  if (hayDesde && t < desde) return 'antes';
  if (hayHasta && t > hasta) return 'terminado';
  if (hayDesde || hayHasta) return 'activo';

  return data.activo === false ? 'terminado' : 'activo';
}
