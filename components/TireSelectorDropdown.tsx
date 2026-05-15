'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';

interface Parsed { ancho: string; perfil: string; rin: string; }

function parseMedida(m: string): Parsed | null {
  const match = m.trim().match(/^(\d{3})\/(\d{2,3})\s*[Rr](\d{2})$/);
  if (!match) return null;
  return { ancho: match[1], perfil: match[2], rin: match[3] };
}

interface SelectFieldProps {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled: boolean;
}

function SelectField({ label, unit, value, onChange, options, placeholder, disabled }: SelectFieldProps) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
        {label} <span className="text-gray-600 normal-case font-normal text-[10px]">{unit}</span>
      </p>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full rounded-xl px-4 py-3.5 text-xl font-mono font-bold appearance-none pr-9
            border-2 transition-all cursor-pointer
            focus:outline-none
            ${disabled
              ? 'bg-[#161616] border-[#252525] text-gray-700 cursor-not-allowed'
              : value
                ? 'bg-[#1c1008] border-[#FF6B35] text-white'
                : 'bg-[#1a1a1a] border-[#444] text-gray-200 hover:border-[#666]'
            }
          `}
        >
          <option value="" className="bg-[#1a1a1a] text-gray-400">{placeholder}</option>
          {options.map(o => (
            <option key={o} value={o} className="bg-[#1a1a1a] text-white">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
            disabled ? 'text-gray-700' : value ? 'text-[#FF6B35]' : 'text-gray-400'
          }`}
        />
      </div>
    </div>
  );
}

interface Props {
  medidas?: string[];
}

export default function TireSelectorDropdown({ medidas = [] }: Props) {
  const router = useRouter();

  const allParsed: Parsed[] = [];
  try {
    for (const m of medidas) {
      const p = parseMedida(m);
      if (p) allParsed.push(p);
    }
  } catch {
    // si algo falla, allParsed queda vacío → fallback al catálogo
  }

  const [ancho, setAncho] = useState('');
  const [perfil, setPerfil] = useState('');
  const [rin, setRin] = useState('');

  const anchos = Array.from(new Set(allParsed.map(p => p.ancho))).sort((a, b) => +a - +b);
  const perfiles = ancho
    ? Array.from(new Set(allParsed.filter(p => p.ancho === ancho).map(p => p.perfil))).sort((a, b) => +a - +b)
    : [];
  const rines = (ancho && perfil)
    ? Array.from(new Set(allParsed.filter(p => p.ancho === ancho && p.perfil === perfil).map(p => p.rin))).sort((a, b) => +a - +b)
    : [];

  const handleAncho  = (v: string) => { setAncho(v); setPerfil(''); setRin(''); };
  const handlePerfil = (v: string) => { setPerfil(v); setRin(''); };

  const complete = ancho && perfil && rin;
  const medida   = complete ? `${ancho}/${perfil} R${rin}` : '';

  const handleSearch = () => {
    if (!complete) return;
    router.push(`/catalogo?medida=${encodeURIComponent(medida)}`);
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
    <div className="w-full max-w-2xl space-y-4">
      {/* ── 3 selects ── */}
      <div className="flex gap-3 items-end">
        <SelectField
          label="Ancho"
          unit="mm"
          value={ancho}
          onChange={handleAncho}
          options={anchos}
          placeholder="Ej: 205"
          disabled={false}
        />

        <div className="text-2xl font-extrabold text-gray-400 pb-3.5 shrink-0 select-none">/</div>

        <SelectField
          label="Perfil"
          unit="%"
          value={perfil}
          onChange={handlePerfil}
          options={perfiles}
          placeholder={ancho ? 'Elige' : '—'}
          disabled={!ancho}
        />

        <div className="text-base font-extrabold text-gray-400 pb-3.5 shrink-0 font-mono select-none">R</div>

        <SelectField
          label="Rin"
          unit="″"
          value={rin}
          onChange={setRin}
          options={rines}
          placeholder={perfil ? 'Elige' : '—'}
          disabled={!perfil}
        />

        {/* Botón buscar */}
        <div className="shrink-0">
          <p className="text-[10px] font-bold text-transparent uppercase tracking-widest mb-1.5">.</p>
          <button
            onClick={handleSearch}
            disabled={!complete}
            className={`
              flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-white transition-all
              ${complete
                ? 'bg-[#FF6B35] hover:bg-orange-500 orange-pulse shadow-lg shadow-orange-900/30'
                : 'bg-[#1a1a1a] border-2 border-[#2a2a2a] text-gray-600 cursor-not-allowed'
              }
            `}
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </div>
      </div>

      {/* ── Preview medida ── */}
      <div className="h-7 flex items-center">
        {complete ? (
          <p className="font-mono text-sm text-gray-400">
            Medida:{' '}
            <span className="text-white font-bold text-base tracking-wide">{medida}</span>
            <span className="ml-3 text-xs text-emerald-400 animate-pulse">● lista para buscar</span>
          </p>
        ) : (
          <p className="text-xs text-gray-600">
            {!ancho ? 'Elige el ancho para empezar' : !perfil ? 'Ahora elige el perfil' : 'Selecciona el rin'}
          </p>
        )}
      </div>
    </div>
  );
}
