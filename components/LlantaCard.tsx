import { Clock, Store, Truck } from 'lucide-react';

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

interface Props {
  llanta: Llanta;
}

const entregaColor = (dias: number) => {
  if (dias === 0) return 'bg-green-100 text-green-800';
  if (dias === 1) return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-600';
};

const EntregaIcon = ({ dias }: { dias: number }) => {
  if (dias === 0) return <Store className="w-3.5 h-3.5" />;
  if (dias === 1) return <Clock className="w-3.5 h-3.5" />;
  return <Truck className="w-3.5 h-3.5" />;
};

export default function LlantaCard({ llanta }: Props) {
  const precio = typeof llanta.precio === 'string' ? parseFloat(llanta.precio) : llanta.precio;
  const precioFmt = precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

  return (
    <a
      href={`/llanta/${llanta.tabla_origen}/${llanta.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md hover:border-red-200 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide truncate">
            {llanta.marca_col}
          </p>
          <p className="text-sm text-gray-700 truncate leading-tight mt-0.5">
            {llanta.modelo}
          </p>
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0 ${entregaColor(llanta.entrega_dias)}`}>
          <EntregaIcon dias={llanta.entrega_dias} />
          {llanta.disponibilidad}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-base font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
          {llanta.medida}
        </span>
        <span className="text-2xl font-bold text-gray-900">
          {precioFmt}
        </span>
      </div>

      <div className="text-xs text-center text-red-500 font-medium mt-1 border border-red-200 rounded-lg py-1.5 hover:bg-red-50 transition-colors">
        Ver detalles →
      </div>
    </a>
  );
}