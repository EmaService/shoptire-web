export type Sucursal = 'ajusco' | 'tlalpan';

export type LlantaBuenFin = {
  id: string | number;
  marca: string;
  modelo: string;
  medida: string;
  descripcion?: string;
  ajusco?: {
    disponible?: boolean;
    precio?: number | null;
  };
  tlalpan?: {
    enTienda?: boolean;
    llegaManana?: boolean;
    precio?: number | null;
    cashback?: number | null;
  };
};

export type BuenFinApiData = {
  activo: boolean;
  desde?: string;
  hasta?: string;
  cashback?: { pct?: number };
  llantas?: LlantaBuenFin[];
};

export type BuenFinEstado =
  | { ok: true; data: BuenFinApiData }
  | { ok: false; error: string };
