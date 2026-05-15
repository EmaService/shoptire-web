'use client';
import { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface Llanta {
  id: number;
  tabla_origen: string;
  marca?: string;
  marca_col?: string;
  modelo: string;
  medida: string;
  precio: number | string;
  disponibilidad: string;
}

interface Props {
  llanta: Llanta;
}

export default function ComprarForm({ llanta }: Props) {
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const precio = parseFloat(String(llanta.precio));
  const total = precio * cantidad;
  const totalFmt = total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const isSandbox = process.env.NEXT_PUBLIC_MP_SANDBOX === 'true';

  const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const isTel = (s: string) => /^[\d\s\-\+\(\)]{8,15}$/.test(s.trim());

  const handleComprar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) return setError('Ingresa tu nombre completo.');
    if (!contacto.trim()) return setError('Ingresa tu email o teléfono.');
    if (!isEmail(contacto) && !isTel(contacto)) return setError('El contacto debe ser un email válido o un número de teléfono.');

    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        nombre: nombre.trim(),
        id_llanta: llanta.id,
        tabla_origen: llanta.tabla_origen,
        cantidad,
      };
      if (isEmail(contacto)) body.email = contacto.trim();
      else body.telefono = contacto.replace(/\D/g, '');

      const res = await fetch('/api/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.ok) {
        if (res.status === 503) {
          setError('El pago en línea no está disponible. Contáctanos por WhatsApp.');
        } else {
          setError(data.error || 'Ocurrió un error. Intenta de nuevo.');
        }
        setLoading(false);
        return;
      }

      const mpUrl = isSandbox ? data.mp_sandbox_init_point : data.mp_init_point;
      window.location.href = mpUrl;
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleComprar} className="space-y-4">
      {/* Cantidad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setCantidad(n)}
              className={`w-12 h-12 rounded-xl font-bold text-lg transition-colors ${
                cantidad === n
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ej: Juan García"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
          required
        />
      </div>

      {/* Email o teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email o teléfono <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={contacto}
          onChange={e => setContacto(e.target.value)}
          placeholder="correo@ejemplo.com  o  55 1234 5678"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
          required
        />
        <p className="text-xs text-gray-400 mt-1">Para enviarte la confirmación de tu pedido</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
          {error.includes('WhatsApp') && (
            <a href="https://wa.me/5215512899120" target="_blank" rel="noopener noreferrer"
              className="ml-2 underline font-medium">
              Ir a WhatsApp →
            </a>
          )}
        </div>
      )}

      {/* Total + Botón */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{cantidad} llanta{cantidad > 1 ? 's' : ''} × {parseFloat(String(llanta.precio)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}</span>
          <span className="font-bold text-gray-900">{totalFmt}</span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg transition-colors shadow-sm"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
          ) : (
            <><ShoppingCart className="w-5 h-5" /> Comprar — {totalFmt}</>
          )}
        </button>
        <p className="text-xs text-center text-gray-400">
          🔒 Pago seguro con Mercado Pago · Tarjeta, OXXO, transferencia
        </p>
      </div>
    </form>
  );
}