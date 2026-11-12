'use client';

import { useMemo, useState } from 'react';
import {
  LLANTAS_BUEN_FIN,
  RINES_BUEN_FIN,
  WA_TLALPAN,
  desgloseMedida,
  esCamion,
  rinDeMedida,
  type LlantaBuenFin,
  type RinBuenFin,
} from './llantas';

const NUM = new Intl.NumberFormat('es-MX');

const MARCAS = ['SUNFULL', 'DAVANTI'] as const;
type Marca = (typeof MARCAS)[number];

function nombreMarca(marca: string) {
  return marca === 'SUNFULL' ? 'Sunfull' : 'Davanti';
}

function precioLlantas(precio: number) {
  return `$${NUM.format(precio)}`;
}

function linkWhatsApp(l: LlantaBuenFin) {
  const texto = `Hola, vi en el Buen Fin la llanta ${nombreMarca(l.marca)} ${l.modelo} ${l.medida} a ${precioLlantas(l.precio)}. ¿Me la aparto?`;
  return `https://wa.me/${WA_TLALPAN}?text=${encodeURIComponent(texto)}`;
}

function ordenar(a: LlantaBuenFin, b: LlantaBuenFin) {
  const da = desgloseMedida(a.medida);
  const db = desgloseMedida(b.medida);
  if (da && db) {
    if (da.rin !== db.rin) return da.rin - db.rin;
    if (da.ancho !== db.ancho) return da.ancho - db.ancho;
    if (da.perfil !== db.perfil) return da.perfil - db.perfil;
  }
  return a.medida.localeCompare(b.medida, 'es');
}

const LLANTAS_ORDENADAS = [...LLANTAS_BUEN_FIN].sort(ordenar);

function normalizarBusqueda(valor: string) {
  return valor.replace(/\D/g, '');
}

export default function BuenFinClient() {
  const [marca, setMarca] = useState<Marca | null>(null);
  const [rin, setRin] = useState<RinBuenFin | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const consulta = normalizarBusqueda(busqueda);

  const filtradas = useMemo(() => {
    return LLANTAS_ORDENADAS.filter(l => {
      if (marca && l.marca !== marca) return false;

      if (rin !== null) {
        if (rin === 'camion') {
          if (!esCamion(l.medida)) return false;
        } else if (rinDeMedida(l.medida) !== rin) {
          return false;
        }
      }

      if (consulta.length > 0) {
        const medidaDigitos = normalizarBusqueda(l.medida);
        if (!medidaDigitos.includes(consulta)) return false;
      }

      return true;
    });
  }, [marca, rin, consulta]);

  const hayFiltros = marca !== null || rin !== null || busqueda.trim() !== '';

  function limpiar() {
    setMarca(null);
    setRin(null);
    setBusqueda('');
  }

  return (
    <section className="max-w-6xl mx-auto px-4 pb-16">
      <div id="filtros-buen-fin" className="-mx-4 px-4 py-4 border-b border-white/5">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Marca</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setMarca(null)}
                aria-pressed={marca === null}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                  marca === null
                    ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                    : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#FF6B35]/60'
                }`}
              >
                Todas
              </button>
              {MARCAS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMarca(m)}
                  aria-pressed={marca === m}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    marca === m
                      ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                      : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#FF6B35]/60'
                  }`}
                >
                  {nombreMarca(m)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Rin</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setRin(null)}
                aria-pressed={rin === null}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                  rin === null
                    ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                    : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#FF6B35]/60'
                }`}
              >
                Todos
              </button>
              {RINES_BUEN_FIN.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRin(r)}
                  aria-pressed={rin === r}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    rin === r
                      ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                      : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#FF6B35]/60'
                  }`}
                >
                  {r === 'camion' ? 'Camión' : `R${r}`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="search"
                inputMode="numeric"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Busca tu medida: 205/55r16"
                aria-label="Buscar por medida"
                className="input-dark w-full rounded-xl pl-12 pr-4 py-3 text-base"
              />
            </div>
            {hayFiltros && (
              <button
                type="button"
                onClick={limpiar}
                className="shrink-0 px-4 py-3 rounded-xl border border-[#2a2a2a] text-gray-300 text-sm font-bold hover:border-[#FF6B35]/60 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      <div id="resultados-buen-fin" className="flex items-center justify-between mt-5 mb-4">
        <p className="text-gray-400 text-sm">
          <span className="text-white font-bold">{filtradas.length}</span>{' '}
          {filtradas.length === 1 ? 'llanta' : 'llantas'}
        </p>
        <p className="text-[11px] text-gray-600 uppercase tracking-wider">Precio Buen Fin · Tlalpan</p>
      </div>

      {filtradas.length === 0 ? (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-10 text-center">
          <p className="text-3xl mb-3">🔍</p>
          <h2 className="font-heading text-xl font-extrabold text-white mb-2">No encontramos esa medida</h2>
          <p className="text-gray-400 text-sm mb-6">
            Prueba con otro rin o escríbenos por WhatsApp y la buscamos en nuestra bodega.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={limpiar}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-sm hover:bg-[#ff8055] transition-colors"
            >
              Ver todas las llantas
            </button>
            <a
              href={`https://wa.me/${WA_TLALPAN}?text=${encodeURIComponent('Hola, busco una llanta que no aparece en el Buen Fin. ¿Me ayudan?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#25D366]/50 text-[#25D366] font-bold text-sm hover:bg-[#25D366]/10 transition-colors"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map(l => (
            <article
              key={`${l.marca}-${l.modelo}-${l.medida}`}
              className="card-dark relative bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 flex flex-col overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/50 to-transparent" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-extrabold text-[#FF6B35] uppercase tracking-[0.2em]">
                  {nombreMarca(l.marca)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {l.disponible}
                </span>
              </div>

              <p className="text-gray-400 text-sm font-medium">{l.modelo}</p>
              <p className="font-heading text-3xl font-extrabold text-white leading-none mt-1 mb-5">
                {l.medida}
              </p>

              <div className="mt-auto">
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">Precio Buen Fin</p>
                <p className="font-heading text-4xl font-extrabold text-white leading-none">
                  {precioLlantas(l.precio)}
                </p>
                <p className="text-emerald-400 text-sm font-semibold mt-2">
                  + {precioLlantas(Math.round(l.cashback))} de regreso para tu próxima compra
                </p>

                <a
                  href={linkWhatsApp(l)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  La quiero
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
