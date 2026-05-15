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
  0: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  1: { bg: 'bg-blue-500/10 border-blue-500/30',       text: 'text-blue-400',    dot: 'bg-blue-400' },
  2: { bg: 'bg-sky-500/10 border-sky-500/30',         text: 'text-sky-400',     dot: 'bg-sky-400' },
  3: { bg: 'bg-gray-700/40 border-gray-600/40',       text: 'text-gray-400',    dot: 'bg-gray-500' },
};

export default function LlantaCard({ llanta }: Props) {
  const precio = typeof llanta.precio === 'string' ? parseFloat(llanta.precio) : llanta.precio;
  const precioFmt = precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const dias = Math.min(llanta.entrega_dias ?? 3, 3);
  const badge = BADGE[dias];

  return (
    <a
      href={`/llanta/${llanta.tabla_origen}/${llanta.id}`}
      className="group bg-[#111] rounded-2xl border border-[#1f1f1f] hover:border-[#FF6B35] p-5 flex flex-col gap-4 card-dark cursor-pointer"
    >
      {/* Top: marca + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-widest truncate">
            {llanta.marca_col}
          </p>
          <p className="text-sm text-gray-400 truncate mt-0.5 leading-snug">
            {llanta.modelo}
          </p>
        </div>
        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${badge.bg} ${badge.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {llanta.disponibilidad}
        </span>
      </div>

      {/* Medida + Precio */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-sm font-medium text-gray-300 bg-[#1a1a1a] px-2.5 py-1 rounded-lg border border-[#2a2a2a]">
            {llanta.medida}
          </span>
          <span className="font-mono text-[10px] text-gray-600 px-1">
            Cód: {llanta.tabla_origen}-{llanta.id}
          </span>
        </div>
        <span className="font-heading text-2xl font-extrabold text-white group-hover:text-[#FF6B35] transition-colors">
          {precioFmt}
        </span>
      </div>

      {/* CTA */}
      <div className="text-xs text-center font-bold text-[#FF6B35] border border-[#FF6B35]/25 group-hover:bg-[#FF6B35] group-hover:text-white group-hover:border-[#FF6B35] rounded-xl py-2 transition-all uppercase tracking-wider">
        Ver y apartar →
      </div>
    </a>
  );
}
