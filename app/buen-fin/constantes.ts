export const WA_AJUSCO = '5215570601568';

// TODO número Tlalpan
export const WA_TLALPAN = '5215570601568';

export const RINES_BUEN_FIN = [14, 15, 16, 17, 18, 19, 20, 'camion'] as const;
export type RinBuenFin = (typeof RINES_BUEN_FIN)[number];

export const DIRECCIONES: Record<'ajusco' | 'tlalpan', string> = {
  ajusco: 'Huehuetán 286, Tlalpan, CDMX',
  tlalpan: 'Viaducto Tlalpan 78 A, Huipulco, CDMX',
};

export const LEYENDAS: Record<'ajusco' | 'tlalpan', string> = {
  ajusco:
    'Instalación, balanceo, válvulas y nitrógeno gratis. Alineación gratis en la compra de 2 llantas o más.',
  tlalpan:
    'Promoción válida solo en sucursal Tlalpan del 13 al 17 de noviembre de 2026 o hasta agotar existencias. El 15% se entrega como saldo a favor para tu próxima compra en Tlalpan, ligado a tu teléfono, válido 365 días. No aplica con meses sin intereses ni crédito. No se cambia por efectivo.',
};
