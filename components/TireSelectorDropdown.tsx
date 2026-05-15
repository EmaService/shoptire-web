'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Lock } from 'lucide-react';

interface Parsed { ancho: string; perfil: string; rin: string; }

function parseMedida(m: string): Parsed | null {
  const match = m.trim().match(/^(\d{3})\/(\d{2,3})\s*[Rr](\d{2})$/);
  if (!match) return null;
  return { ancho: match[1], perfil: match[2], rin: match[3] };
}

interface StepSelectProps {
  step: number;
  label: string;
  suffix: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  hint: string;
  disabled: boolean;
  done: boolean;
}

function StepSelect({ step, label, suffix, value, onChange, options, hint, disabled, done }: StepSelectProps) {
  return (
    <div className={`relative flex-1 min-w-0 rounded-2xl border-2 p-4 transition-all duration-200 ${
      disabled
        ? 'bg-[#111] border-[#222] opacity-50'
        : done
          ? 'bg-[#1a0d00] border-[#FF6B35] shadow-[0_0_16px_rgba(255,107,53,0.2)]'
          : 'bg-[#1e1e1e] border-[#3a3a3a] hover:border-[#555]'
    }`}>

      {/* Número de paso */}
      <div className={`absolute -top-3 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold border-2 ${
        done
          ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
          : disabled
            ? 'bg-[#1a1a1a] border-[#333] text-gray-600'
            : 'bg-[#0A0A0A] border-[#555] text-gray-300'
      }`}>
        {done ? '✓' : step}
      </div>

      {/* Label */}
      <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-2 ${
        done ? 'text-[#FF6B35]' : disabled ? 'text-gray-700' : 'text-gray-400'
      }`}>
        {label}
      </p>

      {/* Select */}
      {disabled ? (
        <div className="flex items-center gap-2 h-9">
          <Lock className="w-3.5 h-3.5 text-gray-700 shrink-0" />
          <span className="text-gray-700 text-sm font-mono">{hint}</span>
        </div>
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-full appearance-none bg-transparent text-2xl font-mono font-extrabold pr-7 focus:outline-none cursor-pointer leading-none ${
              value ? 'text-white' : 'text-gray-500'
            }`}
          >
            <option value="" className="bg-[#1a1a1a] text-gray-400 text-base">{hint}</option>
            {options.map(o => (
              <option key={o} value={o} className="bg-[#1a1a1a] text-white text-base">{o}</option>
            ))}
          </select>
          <svg
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${value ? 'text-[#FF6B35]' : 'text-gray-500'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}

      {/* Suffix (mm, %, ″) */}
      {!disabled && (
        <p className={`text-[10px] mt-1.5 font-mono ${value ? 'text-[#FF6B35]/70' : 'text-gray-700'}`}>
          {suffix}
        </p>
      )}
    </div>
  );
}

interface Props { medidas?: string[]; }

export default function TireSelectorDropdown({ medidas = [] }: Props) {
  const router = useRouter();

  const allParsed: Parsed[] = [];
  try {
    for (const m of medidas) {
      const p = parseMedida(m);
      if (p) allParsed.push(p);
    }
  } catch { /* silencioso */ }

  const [ancho,  setAncho]  = useState('');
  const [perfil, setPerfil] = useState('');
  const [rin,    setRin]    = useState('');

  const anchos   = Array.from(new Set(allParsed.map(p => p.ancho))).sort((a, b) => +a - +b);
  const perfiles = ancho
    ? Array.from(new Set(allParsed.filter(p => p.ancho === ancho).map(p => p.perfil))).sort((a, b) => +a - +b)
    : [];
  const rines = (ancho && perfil)
    ? Array.from(new Set(allParsed.filter(p => p.ancho === ancho && p.perfil === perfil).map(p => p.rin))).sort((a, b) => +a - +b)
    : [];

  const handleAncho  = (v: string) => { setAncho(v); setPerfil(''); setRin(''); };
  const handlePerfil = (v: string) => { setPerfil(v); setRin(''); };

  const complete = !!(ancho && perfil && rin);
  const medida   = complete ? `${ancho}/${perfil} R${rin}` : '';

  const handleSearch = () => {
    if (complete) router.push(`/catalogo?medida=${encodeURIComponent(medida)}`);
  };

  if (!allParsed.length) {
    return (
      <p className="text-sm text-gray-600">
        No se pudieron cargar las medidas.{' '}
        <a href="/catalogo" className="text-[#FF6B35] hover:underline">Ir al catálogo →</a>
      </p>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-3">

      {/* ── Pasos ── */}
      <div className="flex gap-2 sm:gap-3 items-stretch">

        <StepSelect
          step={1} label="Ancho" suffix="milímetros"
          value={ancho} onChange={handleAncho}
          options={anchos} hint="205…" disabled={false} done={!!ancho}
        />

        {/* Separador / */}
        <div className="flex items-center pb-5 shrink-0 text-gray-600 font-bold text-xl select-none">/</div>

        <StepSelect
          step={2} label="Perfil" suffix="porcentaje"
          value={perfil} onChange={handlePerfil}
          options={perfiles} hint={ancho ? 'Elige…' : 'Antes elige ancho'}
          disabled={!ancho} done={!!perfil}
        />

        {/* Separador R */}
        <div className="flex items-center pb-5 shrink-0 text-gray-600 font-bold text-base font-mono select-none">R</div>

        <StepSelect
          step={3} label="Rin" suffix="pulgadas"
          value={rin} onChange={setRin}
          options={rines} hint={perfil ? 'Elige…' : 'Antes perfil'}
          disabled={!perfil} done={!!rin}
        />
      </div>

      {/* ── Botón buscar + preview ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSearch}
          disabled={!complete}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base transition-all ${
            complete
              ? 'bg-[#FF6B35] hover:bg-orange-500 text-white orange-pulse shadow-lg shadow-orange-900/30'
              : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-600 cursor-not-allowed'
          }`}
        >
          <Search className="w-5 h-5" />
          Buscar llantas
        </button>

        {complete && (
          <p className="font-mono text-sm text-gray-400">
            <span className="text-white font-bold text-base">{medida}</span>
            <span className="ml-2 text-[11px] text-emerald-400">● lista</span>
          </p>
        )}
        {!complete && (
          <p className="text-xs text-gray-600">
            {!ancho ? 'Empieza eligiendo el ancho' : !perfil ? 'Ahora el perfil' : 'Selecciona el rin'}
          </p>
        )}
      </div>
    </div>
  );
}
