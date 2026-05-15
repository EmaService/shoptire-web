'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface Props {
  defaultValue?: string;
  autoFocus?: boolean;
  variant?: 'dark' | 'light';
}

export default function SearchBar({ defaultValue = '', autoFocus = false, variant = 'dark' }: Props) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/catalogo?medida=${encodeURIComponent(q)}`);
  };

  const inputClass = variant === 'dark'
    ? 'input-dark flex-1 rounded-xl px-4 py-3.5 text-lg font-mono'
    : 'flex-1 rounded-xl border-2 border-gray-200 px-4 py-3.5 text-lg focus:border-[#FF6B35] focus:outline-none bg-white text-black';

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Ej: 205/60 R16"
        className={inputClass}
      />
      <button
        type="submit"
        className="bg-[#FF6B35] hover:bg-orange-500 text-white px-5 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-colors orange-pulse"
      >
        <Search className="w-5 h-5" />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </form>
  );
}
