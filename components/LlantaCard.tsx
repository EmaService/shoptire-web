interface Llanta {
  tabla_origen: string;
  id: number;
  marca_col: string;
  modelo: string;
  medida: string;
  precio: string | number;
  stock: number;
  disponibilidad: string;
  entrega_dias: number;
}

interface Props { llanta: Llanta }

const BADGE: Record<number, { bg: string; text: string; dot: string }> = {
  0: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  1: { bg: 'bg-blue-50 border-blue-200',       text: 'text-blue-700',   dot: 'bg-blue-400' },
  2: { bg: 'bg-sky-50 border-sky-200',         text: 'text-sky-700',    dot: 'bg-sky-400' },
  3: { bg: 'bg-gray-100 border-gray-200',      text: 'text-gray-600',   dot: 'bg-gray-400' },
};

export default function LlantaCard({ llanta }: Props) {
  const precio = typeof llanta.precio === 'string' ? parseFloat(llanta.precio) : llanta.precio;
  const precioFmt = precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const dias = Math.min(llanta.entrega_dias ?? 3, 3);
  const badge = BADGE[dias];

  return (
    <a
      href={`/llanta/${llanta.tabla_origen}/${llanta.id}`}
      className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-[#FF6B35] p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
    >
      {/* Top: marca + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-widest truncate">
            {llanta.marca_col}
          </p>
          <p className="text-sm text-gray-500 truncate mt-0.5 leading-snug">
            {llanta.modelo}
          </p>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${badge.bg} ${badge.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {llanta.disponibilidad}
        </span>
      </div>

      {/* Medida + Precio */}
      <div className="flex items-end justify-between mt-auto">
        <span className="font-mono text-sm font-medium text-[#2C3E50] bg-[#F4F6F8] px-2.5 py-1 rounded-lg">
          {llanta.medida}
        </span>
        <span className="font-heading text-2xl font-extrabold text-[#0A0A0A]">
          {precioFmt}
        </span>
      </div>

      {/* CTA */}
      <div className="text-xs text-center font-semibold text-[#FF6B35] border border-[#FF6B35]/30 group-hover:bg-[#FF6B35] group-hover:text-white group-hover:border-[#FF6B35] rounded-xl py-2 transition-all">
        Ver y apartar →
      </div>
    </a>
  );
}
