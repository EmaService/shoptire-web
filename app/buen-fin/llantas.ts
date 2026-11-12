export type LlantaBuenFin = {
  marca: 'SUNFULL' | 'DAVANTI';
  modelo: string;
  medida: string;
  precio: number;
  cashback: number;
  disponible: 'Tlalpan';
};

export const BUEN_FIN_HASTA = '2026-11-18T06:00:00Z';

// TODO número Tlalpan
export const WA_TLALPAN = '5215570601568';

export const LEYENDA_BUEN_FIN =
  'Promoción válida solo en sucursal Tlalpan, del 13 al 17 de noviembre de 2026 o hasta agotar existencias. El 15% se entrega como saldo a favor para tu próxima compra en la sucursal Tlalpan, ligado a tu número de teléfono. No aplica con meses sin intereses ni crédito. No se cambia por efectivo.';

export const LLANTAS_BUEN_FIN = [
  { marca: 'SUNFULL', modelo: 'SF-600',       medida: '185/70R14', precio: 1047, cashback: 157.05, disponible: 'Tlalpan' },
  { marca: 'SUNFULL', modelo: 'SF-600',       medida: '195/65R15', precio: 1106, cashback: 165.9,  disponible: 'Tlalpan' },
  { marca: 'DAVANTI', modelo: 'DX390',        medida: '205/45R16', precio: 1244, cashback: 186.6,  disponible: 'Tlalpan' },
  { marca: 'DAVANTI', modelo: 'DX390',        medida: '195/55R15', precio: 1278, cashback: 191.7,  disponible: 'Tlalpan' },
  { marca: 'DAVANTI', modelo: 'DX390',        medida: '215/55R16', precio: 1424, cashback: 213.6,  disponible: 'Tlalpan' },
  { marca: 'DAVANTI', modelo: 'DX390',        medida: '185/55R16', precio: 1487, cashback: 223.05, disponible: 'Tlalpan' },
  { marca: 'DAVANTI', modelo: 'DX640',        medida: '235/50R18', precio: 2009, cashback: 301.35, disponible: 'Tlalpan' },
  { marca: 'DAVANTI', modelo: 'DX640',        medida: '245/35R19', precio: 2116, cashback: 317.4,  disponible: 'Tlalpan' },
  { marca: 'DAVANTI', modelo: 'DX640',        medida: '255/35R19', precio: 2294, cashback: 344.1,  disponible: 'Tlalpan' },
  { marca: 'SUNFULL', modelo: 'MONT-PRO AT782', medida: '245/75R16', precio: 2424, cashback: 363.6, disponible: 'Tlalpan' },
  { marca: 'DAVANTI', modelo: 'DX640',        medida: '235/40R19', precio: 2496, cashback: 374.4,  disponible: 'Tlalpan' },
  { marca: 'DAVANTI', modelo: 'DX640',        medida: '255/55R19', precio: 2941, cashback: 441.15, disponible: 'Tlalpan' },
] as const satisfies readonly LlantaBuenFin[];

export const RINES_BUEN_FIN = [14, 15, 16, 17, 18, 19, 20, 'camion'] as const;
export type RinBuenFin = (typeof RINES_BUEN_FIN)[number];

export function desgloseMedida(medida: string): { ancho: number; perfil: number; rin: number } | null {
  const m = medida.match(/^\s*(\d{3})\/(\d{2,3})\s*R(\d{2})\s*$/i);
  if (!m) return null;
  return { ancho: Number(m[1]), perfil: Number(m[2]), rin: Number(m[3]) };
}

export function rinDeMedida(medida: string): number | null {
  return desgloseMedida(medida)?.rin ?? null;
}

export function esCamion(medida: string): boolean {
  const d = desgloseMedida(medida);
  return d !== null && d.perfil >= 75;
}

export function fechaBuenFinActiva(ahora: Date = new Date()): boolean {
  return ahora.getTime() < new Date(BUEN_FIN_HASTA).getTime();
}
