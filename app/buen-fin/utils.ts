export function nombreMarca(marca: string) {
  return marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase();
}

export function numero(valor: unknown): number | null {
  if (typeof valor === 'number' && Number.isFinite(valor)) return valor;
  if (typeof valor === 'string' && valor.trim() !== '') {
    const n = Number(valor);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function desgloseMedida(
  medida: string
): { ancho: number; perfil: number; rin: number } | null {
  const m = medida.match(/^\s*(?:LT)?(\d{3})\/(\d{2,3})\s*R(\d{2})\s*$/i);
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

export function normalizarBusqueda(valor: string) {
  return valor.replace(/\D/g, '');
}

const MONEDA = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ENTERO = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });

export function formatearMoneda(valor: number) {
  return MONEDA.format(valor);
}

export function formatearRegreso(valor: number) {
  return `$${ENTERO.format(Math.round(valor))}`;
}

export function linkWhatsApp(numero: string, texto: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
