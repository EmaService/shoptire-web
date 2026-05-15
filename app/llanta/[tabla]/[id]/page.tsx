import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Store, Truck, AlertCircle } from 'lucide-react';
import ComprarForm from '@/components/ComprarForm';

interface LlantaDetalle {
  tabla_origen: string;
  id: number;
  marca?: string;
  marca_col?: string;
  modelo: string;
  medida: string;
  precio: number;
  stock: number;
  disponibilidad: string;
}

async function fetchLlanta(tabla: string, id: string): Promise<LlantaDetalle | null> {
  const BACKEND = process.env.BACKEND_URL || 'http://3.236.101.20:3000';
  try {
    const res = await fetch(`${BACKEND}/web/llanta/${tabla}/${id}`, { cache: 'no-store' });
    const data = await res.json();
    return data.ok ? data.llanta : null;
  } catch {
    return null;
  }
}

function EntregaBadge({ disponibilidad, entregaDias }: { disponibilidad: string; entregaDias: number }) {
  const configs = [
    { dias: 0, icon: Store, color: 'bg-green-100 text-green-800 border-green-200', label: disponibilidad },
    { dias: 1, icon: Clock, color: 'bg-blue-100 text-blue-800 border-blue-200', label: disponibilidad },
    { dias: 2, icon: Truck, color: 'bg-gray-100 text-gray-700 border-gray-200', label: disponibilidad },
  ];
  const cfg = configs[Math.min(entregaDias, 2)];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${cfg.color}`}>
      <Icon className="w-4 h-4" />
      {cfg.label}
    </span>
  );
}

function getEntregaDias(tabla: string): number {
  if (tabla === 'T') return 0;
  if (['A', 'G'].includes(tabla)) return 0;
  if (tabla === 'C') return 1;
  return 2;
}

export async function generateMetadata({ params }: { params: { tabla: string; id: string } }) {
  const llanta = await fetchLlanta(params.tabla, params.id);
  if (!llanta) return { title: 'Llanta no encontrada — ShopTire' };
  const marca = llanta.marca || llanta.marca_col || llanta.modelo.split(' ')[0];
  return {
    title: `${marca} ${llanta.medida} — ShopTire Ajusco`,
    description: `${llanta.modelo} ${llanta.medida}. Disponible en ShopTire Ajusco CDMX.`,
  };
}

export default async function LlantaDetallePage({ params }: { params: { tabla: string; id: string } }) {
  const llanta = await fetchLlanta(params.tabla, params.id);
  if (!llanta) notFound();

  const marca = llanta.marca || llanta.marca_col || llanta.modelo.split(' ')[0];
  const entregaDias = getEntregaDias(llanta.tabla_origen);
  const precioFmt = llanta.precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const stockBajo = llanta.stock > 0 && llanta.stock <= 3;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb / back */}
      <a href="javascript:history.back()"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver al catálogo
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info de la llanta */}
        <div className="space-y-5">
          {/* Marca y modelo */}
          <div>
            <p className="text-sm font-bold text-red-500 uppercase tracking-widest">{marca}</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1 leading-tight">{llanta.modelo}</h1>
          </div>

          {/* Medida destacada */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Medida</p>
              <p className="text-3xl font-bold tracking-tight">{llanta.medida}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Precio c/u</p>
              <p className="text-3xl font-bold text-red-400">{precioFmt}</p>
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="flex flex-wrap gap-2 items-center">
            <EntregaBadge disponibilidad={llanta.disponibilidad} entregaDias={entregaDias} />
            {stockBajo && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" />
                Últimas {llanta.stock} disponibles
              </span>
            )}
          </div>

          {/* Trust signals */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-blue-900">¿Por qué comprar aquí?</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Precio directo de llantera sin intermediarios</li>
              <li>✓ Instalación disponible en sucursal Ajusco</li>
              <li>✓ Soporte por WhatsApp antes y después de tu compra</li>
            </ul>
          </div>

          {/* WhatsApp alternativo */}
          <a
            href={`https://wa.me/5215512899120?text=${encodeURIComponent(`Hola, me interesa la llanta ${llanta.modelo} ${llanta.medida}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border-2 border-green-600 text-green-700 hover:bg-green-50 py-3 rounded-xl font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Preguntar por WhatsApp
          </a>
        </div>

        {/* Formulario de compra */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Comprar ahora</h2>
          <ComprarForm llanta={{ ...llanta, marca_col: marca }} />
        </div>
      </div>
    </main>
  );
}