'use client';
import { useState } from 'react';
import { Loader2, Copy, CheckCircle2 } from 'lucide-react';

interface Llanta {
  id: number;
  tabla_origen: string;
  marca?: string;
  marca_col?: string;
  modelo: string;
  medida: string;
  precio: number | string;
}

interface Props { llanta: Llanta }

type Resultado =
  | { tipo: 'tienda'; pedido_id: number }
  | { tipo: 'proveedor'; pedido_id: number; anticipo: number; transferencia: { clabe: string; banco: string; titular: string; concepto: string; whatsapp: string } };

export default function ComprarForm({ llanta }: Props) {
  const [nombre,   setNombre]   = useState('');
  const [telefono, setTelefono] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [copiado,  setCopiado]  = useState(false);

  const precio    = parseFloat(String(llanta.precio));
  const total     = precio * cantidad;
  const totalFmt  = total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const esT       = llanta.tabla_origen.toUpperCase() === 'T';

  const copiar = (txt: string) => {
    navigator.clipboard.writeText(txt).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nombre.trim())          return setError('Ingresa tu nombre completo.');
    if (!/\d{8,}/.test(telefono.replace(/\D/g, ''))) return setError('Ingresa un número de teléfono válido (10 dígitos).');

    setLoading(true);
    try {
      const res = await fetch('/api/pedido-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.replace(/\D/g, ''),
          id_llanta: llanta.id,
          tabla_origen: llanta.tabla_origen,
          cantidad,
        }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error || 'Error al registrar. Intenta de nuevo.'); setLoading(false); return; }
      setResultado(data);
    } catch {
      setError('Error de conexión. Verifica tu internet.');
    }
    setLoading(false);
  };

  /* ── Confirmación tienda ── */
  if (resultado?.tipo === 'tienda') {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-[#0A0A0A]">¡Pedido registrado!</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Pedido <strong>#{resultado.pedido_id}</strong> recibido. Estamos verificando disponibilidad en bodega.
          <br /><br />
          Te avisamos por WhatsApp al <strong>{telefono}</strong> en breve.
        </p>
        <a
          href={`https://wa.me/5215512899120?text=${encodeURIComponent(`Hola, acabo de registrar el pedido #${resultado.pedido_id} en la web para ${llanta.modelo} ${llanta.medida}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl w-full justify-center hover:bg-[#1ebe5d] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Confirmar por WhatsApp
        </a>
      </div>
    );
  }

  /* ── Confirmación proveedor ── */
  if (resultado?.tipo === 'proveedor') {
    const t = resultado.transferencia;
    const anticipoFmt = resultado.anticipo.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-[#0A0A0A]">Pedido #{resultado.pedido_id} registrado</h3>
            <p className="text-xs text-gray-500">Para confirmar, realiza el anticipo</p>
          </div>
        </div>

        <div className="bg-[#F4F6F8] rounded-2xl p-4 space-y-3">
          <p className="text-sm font-semibold text-[#2C3E50]">Datos para transferencia</p>

          {[
            { label: 'Banco',    value: t.banco },
            { label: 'CLABE',    value: t.clabe,   copy: true },
            { label: 'A nombre de', value: t.titular },
            { label: 'Concepto', value: t.concepto, copy: true },
            { label: 'Anticipo', value: anticipoFmt },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between gap-2 bg-white rounded-xl px-3 py-2.5">
              <div>
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="text-sm font-semibold text-[#0A0A0A] font-mono">{row.value}</p>
              </div>
              {row.copy && (
                <button
                  type="button"
                  onClick={() => copiar(row.value)}
                  className="text-[#FF6B35] hover:text-orange-700 transition-colors"
                  title="Copiar"
                >
                  {copiado ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Cuando realices el depósito, envía tu comprobante por WhatsApp al{' '}
          <strong>{t.whatsapp.replace('521', '+52 1 ')}</strong>{' '}
          indicando el número de pedido.
        </p>

        <a
          href={`https://wa.me/${t.whatsapp}?text=${encodeURIComponent(`Hola, hice el depósito del anticipo para el pedido #${resultado.pedido_id} (${llanta.modelo} ${llanta.medida}). Adjunto comprobante.`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl w-full justify-center hover:bg-[#1ebe5d] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar comprobante por WhatsApp
        </a>
      </div>
    );
  }

  /* ── Formulario ── */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cantidad */}
      <div>
        <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">Cantidad</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setCantidad(n)}
              className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                cantidad === n
                  ? 'bg-[#FF6B35] text-white shadow-md scale-105'
                  : 'bg-[#F4F6F8] text-gray-600 hover:bg-gray-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-semibold text-[#0A0A0A] mb-1">
          Nombre completo <span className="text-[#FF6B35]">*</span>
        </label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ej: Juan García"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#FF6B35] focus:outline-none transition-colors"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-semibold text-[#0A0A0A] mb-1">
          Teléfono WhatsApp <span className="text-[#FF6B35]">*</span>
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          placeholder="55 1234 5678"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#FF6B35] focus:outline-none transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1">
          {esT ? 'Te avisamos por WhatsApp cuando confirmemos disponibilidad.' : 'Te enviamos el seguimiento del pedido.'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Resumen + botón */}
      <div className="bg-[#F4F6F8] rounded-2xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{cantidad} {cantidad > 1 ? 'llantas' : 'llanta'} × {precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}</span>
          <span className="font-bold text-[#0A0A0A]">{totalFmt}</span>
        </div>
        {!esT && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Anticipo (10%)</span>
            <span className="font-bold text-[#FF6B35]">
              {Math.ceil(total * 0.10).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
            </span>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6B35] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-heading font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg transition-colors shadow-sm"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Registrando...</>
          ) : esT ? (
            <>🏪 Confirmar disponibilidad</>
          ) : (
            <>📦 Apartar llanta — {Math.ceil(total * 0.10).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}</>
          )}
        </button>
        <p className="text-xs text-center text-gray-400">
          {esT ? '⚡ Sin pago adelantado — confirmamos disponibilidad antes' : '🔒 El resto lo pagas al recoger la llanta'}
        </p>
      </div>
    </form>
  );
}
