'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BuenFinApiData, LlantaBuenFin, Sucursal } from './tipos';
import {
  DIRECCIONES,
  LEYENDAS,
  RINES_BUEN_FIN,
  WA_AJUSCO,
  WA_TLALPAN,
  type RinBuenFin,
} from './constantes';
import {
  desgloseMedida,
  esCamion,
  formatearMoneda,
  formatearRegreso,
  linkWhatsApp,
  nombreMarca,
  normalizarBusqueda,
  numero,
  rinDeMedida,
} from './utils';

const STORAGE_KEY = 'shoptire-buen-fin-sucursal';
const SIN_LLANTAS: LlantaBuenFin[] = [];

type Props = {
  data: BuenFinApiData;
  initialSucursal: Sucursal;
};

type Resultado = { ok: boolean; mensaje: string };

const WA_ICON = (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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

export default function BuenFinClient({ data, initialSucursal }: Props) {
  const llantas = data.llantas ?? SIN_LLANTAS;
  const pct = numero(data.cashback?.pct) ?? 15;

  const [sucursal, setSucursal] = useState<Sucursal>(initialSucursal);
  const [marca, setMarca] = useState<string | null>(null);
  const [rin, setRin] = useState<RinBuenFin | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const [seleccion, setSeleccion] = useState<LlantaBuenFin | null>(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [piezas, setPiezas] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [errorLocal, setErrorLocal] = useState('');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('sucursal')) {
        window.localStorage.setItem(STORAGE_KEY, initialSucursal);
        return;
      }
      const guardada = window.localStorage.getItem(STORAGE_KEY);
      if (guardada === 'ajusco' || guardada === 'tlalpan') {
        setSucursal(guardada);
      }
    } catch {
      // localStorage puede no estar disponible
    }
  }, [initialSucursal]);

  useEffect(() => {
    if (!seleccion) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previo;
    };
  }, [seleccion]);

  const consulta = normalizarBusqueda(busqueda);

  const marcas = useMemo(() => {
    const orden = ['SUNFULL', 'DAVANTI', 'LONGTRACK'];
    const presentes = Array.from(new Set(llantas.map(l => l.marca.toUpperCase())));
    return presentes.sort((a, b) => {
      const ia = orden.indexOf(a);
      const ib = orden.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [llantas]);

  const ordenadas = useMemo(() => [...llantas].sort(ordenar), [llantas]);

  const filtradas = useMemo(() => {
    return ordenadas.filter(l => {
      if (marca && l.marca.toUpperCase() !== marca) return false;

      if (rin !== null) {
        if (rin === 'camion') {
          if (!esCamion(l.medida)) return false;
        } else if (rinDeMedida(l.medida) !== rin) {
          return false;
        }
      }

      if (consulta.length > 0) {
        if (!normalizarBusqueda(l.medida).includes(consulta)) return false;
      }

      return true;
    });
  }, [ordenadas, marca, rin, consulta]);

  const hayFiltros = marca !== null || rin !== null || busqueda.trim() !== '';

  function cambiarSucursal(nueva: Sucursal) {
    setSucursal(nueva);
    try {
      window.localStorage.setItem(STORAGE_KEY, nueva);
    } catch {
      // localStorage puede no estar disponible
    }
    const url = new URL(window.location.href);
    if (nueva === 'tlalpan') url.searchParams.set('sucursal', 'tlalpan');
    else url.searchParams.delete('sucursal');
    window.history.replaceState(null, '', url.toString());
  }

  function limpiarFiltros() {
    setMarca(null);
    setRin(null);
    setBusqueda('');
  }

  function abrirFormulario(l: LlantaBuenFin) {
    setSeleccion(l);
    setNombre('');
    setTelefono('');
    setPiezas(1);
    setResultado(null);
    setErrorLocal('');
  }

  function cerrarFormulario() {
    if (enviando) return;
    setSeleccion(null);
    setResultado(null);
    setErrorLocal('');
  }

  async function enviarApartado(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!seleccion) return;

    const nombreLimpio = nombre.trim();
    if (nombreLimpio.length < 2) {
      setErrorLocal('Escribe tu nombre.');
      return;
    }
    if (!/^\d{10}$/.test(telefono)) {
      setErrorLocal('El teléfono debe tener 10 dígitos.');
      return;
    }
    if (!Number.isInteger(piezas) || piezas < 1 || piezas > 8) {
      setErrorLocal('Elige entre 1 y 8 piezas.');
      return;
    }

    setErrorLocal('');
    setResultado(null);
    setEnviando(true);

    try {
      const res = await fetch('/api/buen-fin/apartar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          llantaId: seleccion.id,
          nombre: nombreLimpio,
          telefono,
          piezas,
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok !== false) {
        setResultado({
          ok: true,
          mensaje: '✅ ¡Listo! Te la traemos a Tlalpan. Llega al día siguiente; te llamamos para confirmar.',
        });
      } else {
        setResultado({
          ok: false,
          mensaje:
            json?.error ||
            json?.message ||
            'No pudimos apartar tu llanta. Intenta de nuevo.',
        });
      }
    } catch {
      setResultado({
        ok: false,
        mensaje: 'No pudimos conectar. Revisa tu internet e intenta de nuevo.',
      });
    } finally {
      setEnviando(false);
    }
  }

  const precioSeleccion = seleccion ? precioSucursal(seleccion, sucursal) : null;

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div id="sucursales-buen-fin" className="pt-5">
          <p className="text-[11px] font-bold text-[#FFD400] uppercase tracking-[0.25em] text-center mb-3">
            Elige tu sucursal
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => cambiarSucursal('ajusco')}
              aria-pressed={sucursal === 'ajusco'}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-4 transition-colors ${
                sucursal === 'ajusco'
                  ? 'bg-[#E11D2E] border-[#E11D2E] text-white shadow-lg shadow-[#E11D2E]/25'
                  : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#E11D2E]/60'
              }`}
            >
              <span className="font-heading text-lg font-extrabold leading-none">📍 Ajusco</span>
              <span className="text-[10px] uppercase tracking-wider opacity-80">Precio normal</span>
            </button>
            <button
              type="button"
              onClick={() => cambiarSucursal('tlalpan')}
              aria-pressed={sucursal === 'tlalpan'}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-4 transition-colors ${
                sucursal === 'tlalpan'
                  ? 'bg-[#E11D2E] border-[#E11D2E] text-white shadow-lg shadow-[#E11D2E]/25'
                  : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#E11D2E]/60'
              }`}
            >
              <span className="font-heading text-lg font-extrabold leading-none">📍 Tlalpan</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD400]">
                15% de regreso
              </span>
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">📍 {DIRECCIONES[sucursal]}</p>
        </div>

        <div id="filtros-buen-fin" className="-mx-4 mt-5 px-4 py-4 border-y border-white/5">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold text-[#FFD400] uppercase tracking-[0.2em] mb-2">
                Marca
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setMarca(null)}
                  aria-pressed={marca === null}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    marca === null
                      ? 'bg-[#E11D2E] border-[#E11D2E] text-white'
                      : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#E11D2E]/60'
                  }`}
                >
                  Todas
                </button>
                {marcas.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMarca(m)}
                    aria-pressed={marca === m}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                      marca === m
                        ? 'bg-[#E11D2E] border-[#E11D2E] text-white'
                        : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#E11D2E]/60'
                    }`}
                  >
                    {nombreMarca(m)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-[#FFD400] uppercase tracking-[0.2em] mb-2">
                Rin
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setRin(null)}
                  aria-pressed={rin === null}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    rin === null
                      ? 'bg-[#E11D2E] border-[#E11D2E] text-white'
                      : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#E11D2E]/60'
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
                        ? 'bg-[#E11D2E] border-[#E11D2E] text-white'
                        : 'bg-[#111] border-[#2a2a2a] text-gray-300 hover:border-[#E11D2E]/60'
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
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
                  onClick={limpiarFiltros}
                  className="shrink-0 px-4 py-3 rounded-xl border border-[#2a2a2a] text-gray-300 text-sm font-bold hover:border-[#E11D2E]/60 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          id="resultados-buen-fin"
          className="flex items-center justify-between mt-5 mb-4"
        >
          <p className="text-gray-400 text-sm">
            <span className="text-white font-bold">{filtradas.length}</span>{' '}
            {filtradas.length === 1 ? 'llanta' : 'llantas'}
          </p>
          <p className="text-[11px] text-gray-600 uppercase tracking-wider">
            {sucursal === 'ajusco' ? 'Precio Ajusco' : 'Precio Buen Fin · Tlalpan'}
          </p>
        </div>

        {filtradas.length === 0 ? (
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-10 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <h2 className="font-heading text-xl font-extrabold text-white mb-2">
              No encontramos esa medida
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Prueba con otro rin o escríbenos por WhatsApp y la buscamos en nuestra bodega.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={limpiarFiltros}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E11D2E] text-white font-bold text-sm hover:bg-[#c4162a] transition-colors"
              >
                Ver todas las llantas
              </button>
              <a
                href={linkWhatsApp(
                  sucursal === 'ajusco' ? WA_AJUSCO : WA_TLALPAN,
                  'Hola, busco una llanta que no aparece en el Buen Fin. ¿Me ayudan?'
                )}
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
            {filtradas.map(l => {
              const ajusco = Boolean(l.ajusco?.disponible);
              const precioAjusco = numero(l.ajusco?.precio);
              const enTienda = Boolean(l.tlalpan?.enTienda);
              const llegaManana = Boolean(l.tlalpan?.llegaManana);
              const precioTlalpan = numero(l.tlalpan?.precio);
              const cashbackTlalpan =
                numero(l.tlalpan?.cashback) ??
                (precioTlalpan !== null ? (precioTlalpan * pct) / 100 : null);

              const gris = sucursal === 'ajusco' && !ajusco;
              const precio = sucursal === 'ajusco' ? precioAjusco : precioTlalpan;

              return (
                <article
                  key={String(l.id)}
                  className={`card-dark relative rounded-2xl p-5 flex flex-col overflow-hidden border ${
                    gris
                      ? 'bg-[#0a0a0a] border-[#1a1a1a]'
                      : 'bg-[#111] border-[#1f1f1f]'
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD400]/70 to-transparent" />

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[11px] font-extrabold text-[#FFD400] uppercase tracking-[0.2em]">
                      {nombreMarca(l.marca)}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm font-medium">{l.modelo}</p>
                  <p
                    className={`font-heading text-3xl font-extrabold leading-none mt-1 mb-3 ${
                      gris ? 'text-gray-500' : 'text-white'
                    }`}
                  >
                    {l.medida}
                  </p>

                  <div className="mb-5">
                    {sucursal === 'ajusco' ? (
                      ajusco ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Disponible en Ajusco
                        </span>
                      ) : (
                        <span className="inline-block text-[11px] font-bold text-amber-400 leading-snug">
                          Agotada en Ajusco · disponible en Tlalpan
                        </span>
                      )
                    ) : enTienda ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        En tienda
                      </span>
                    ) : llegaManana ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Llega al día siguiente
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        No disponible en Tlalpan
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    <p className="text-[10px] text-[#FFD400]/80 uppercase tracking-[0.2em] mb-1">
                      {sucursal === 'ajusco' ? 'Precio Ajusco' : 'Precio Buen Fin'}
                    </p>
                    <p
                      className={`font-heading text-4xl font-extrabold leading-none ${
                        gris ? 'text-gray-500' : 'text-white'
                      }`}
                    >
                      {precio !== null ? formatearMoneda(precio) : 'Consultar'}
                    </p>

                    {sucursal === 'tlalpan' &&
                      precio !== null &&
                      cashbackTlalpan !== null && (
                        <p className="text-emerald-400 text-sm font-semibold mt-2">
                          + {formatearRegreso(cashbackTlalpan)} de regreso para tu próxima compra
                        </p>
                      )}

                    <div className="mt-4">
                      {sucursal === 'ajusco' ? (
                        ajusco && precioAjusco !== null ? (
                          <a
                            href={linkWhatsApp(
                              WA_AJUSCO,
                              `Hola, vi en el Buen Fin la ${nombreMarca(l.marca)} ${l.modelo} ${l.medida} a ${formatearMoneda(precioAjusco)} en Ajusco. ¿Me la aparto?`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95"
                          >
                            {WA_ICON}
                            La quiero en Ajusco
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => cambiarSucursal('tlalpan')}
                            className="w-full bg-[#FFD400] hover:bg-[#ffe14d] text-black font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95"
                          >
                            Ver en Tlalpan →
                          </button>
                        )
                      ) : enTienda && precioTlalpan !== null ? (
                        <a
                          href={linkWhatsApp(
                            WA_TLALPAN,
                            `Hola, vi en el Buen Fin la ${nombreMarca(l.marca)} ${l.modelo} ${l.medida} a ${formatearMoneda(precioTlalpan)} en Tlalpan con 15% de regreso. ¿Me la aparto?`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95"
                        >
                          {WA_ICON}
                          Apartar en Tlalpan
                        </a>
                      ) : llegaManana && precioTlalpan !== null ? (
                        <button
                          type="button"
                          onClick={() => abrirFormulario(l)}
                          className="w-full bg-[#E11D2E] hover:bg-[#c4162a] text-white font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95"
                        >
                          Apartar en Tlalpan
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full bg-[#1a1a1a] text-gray-500 font-bold text-sm py-3.5 rounded-xl cursor-not-allowed"
                        >
                          No disponible
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-t border-white/10 bg-[#0d0d0d] px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-5">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed text-center">
            {LEYENDAS[sucursal]}
          </p>
          <p className="text-gray-500 text-[11px] text-center border-t border-white/5 pt-5">
            Precios válidos del 13 al 17 de noviembre de 2026 o hasta agotar existencias.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={linkWhatsApp(
                sucursal === 'ajusco' ? WA_AJUSCO : WA_TLALPAN,
                sucursal === 'ajusco'
                  ? 'Hola, vi el Buen Fin de ShopTire Ajusco y quiero información.'
                  : 'Hola, vi el Buen Fin de ShopTire Tlalpan y quiero información.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors"
            >
              {WA_ICON}
              Preguntar por WhatsApp
            </a>
            <a
              href="/catalogo"
              className="flex items-center justify-center w-full sm:w-auto border border-[#2a2a2a] hover:border-[#E11D2E]/60 text-gray-300 hover:text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors"
            >
              Ver catálogo completo
            </a>
          </div>
        </div>
      </section>

      {seleccion && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="apartar-titulo"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={cerrarFormulario}
          />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#111] border border-[#2a2a2a] rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2
                  id="apartar-titulo"
                  className="font-heading text-xl font-extrabold text-white"
                >
                  Apartar en Tlalpan
                </h2>
                <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider mt-1">
                  Llega al día siguiente
                </p>
              </div>
              <button
                type="button"
                onClick={cerrarFormulario}
                aria-label="Cerrar formulario"
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#E11D2E]/60 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 mb-5">
              <p className="text-[11px] font-extrabold text-[#FFD400] uppercase tracking-[0.2em]">
                {nombreMarca(seleccion.marca)}
              </p>
              <p className="text-gray-400 text-sm mt-1">{seleccion.modelo}</p>
              <p className="font-heading text-2xl font-extrabold text-white leading-none mt-1">
                {seleccion.medida}
              </p>
              <p className="font-heading text-2xl font-extrabold text-white mt-3">
                {precioSeleccion !== null ? formatearMoneda(precioSeleccion) : 'Consultar'}
              </p>
            </div>

            {resultado?.ok ? (
              <div className="text-center py-2">
                <p className="text-white font-bold text-lg leading-snug mb-2">
                  ✅ ¡Listo! Te la traemos a Tlalpan.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  Llega al día siguiente; te llamamos para confirmar.
                </p>
                <a
                  href={linkWhatsApp(
                    WA_TLALPAN,
                    `Hola, acabo de apartar la ${nombreMarca(seleccion.marca)} ${seleccion.modelo} ${seleccion.medida} en Tlalpan. ¿Me confirman?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold text-sm py-3.5 rounded-xl transition-colors mb-2"
                >
                  {WA_ICON}
                  Confirmar por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="w-full border border-[#2a2a2a] text-gray-300 hover:text-white font-bold text-sm py-3 rounded-xl transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={enviarApartado} className="space-y-4">
                <div>
                  <label htmlFor="apartar-nombre" className="block text-xs font-bold text-gray-300 mb-1.5">
                    Nombre
                  </label>
                  <input
                    id="apartar-nombre"
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    maxLength={80}
                    autoComplete="name"
                    required
                    className="input-dark w-full rounded-xl px-4 py-3 text-base"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="apartar-telefono" className="block text-xs font-bold text-gray-300 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    id="apartar-telefono"
                    type="tel"
                    inputMode="numeric"
                    value={telefono}
                    onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    autoComplete="tel"
                    required
                    className="input-dark w-full rounded-xl px-4 py-3 text-base"
                    placeholder="10 dígitos"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">10 dígitos, sin ladas ni espacios.</p>
                </div>

                <div>
                  <label htmlFor="apartar-piezas" className="block text-xs font-bold text-gray-300 mb-1.5">
                    Piezas
                  </label>
                  <select
                    id="apartar-piezas"
                    value={piezas}
                    onChange={e => setPiezas(Number(e.target.value))}
                    className="input-dark w-full rounded-xl px-4 py-3 text-base"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {(errorLocal || (resultado && !resultado.ok)) && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {errorLocal || resultado?.mensaje}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-[#E11D2E] hover:bg-[#c4162a] disabled:bg-[#4a1117] disabled:text-gray-400 text-white font-bold text-sm py-3.5 rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  {enviando ? 'Enviando…' : 'Apartar en Tlalpan'}
                </button>

                <p className="text-[11px] text-gray-500 leading-relaxed text-center">
                  Te llamamos para confirmar. Llega al día siguiente a Tlalpan.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function precioSucursal(l: LlantaBuenFin, sucursal: Sucursal) {
  return sucursal === 'ajusco' ? numero(l.ajusco?.precio) : numero(l.tlalpan?.precio);
}
